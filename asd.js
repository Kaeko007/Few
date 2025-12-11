import express from 'express'
import session from 'cookie-session'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors' // added
dotenv.config()

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// enable CORS for the frontend and allow cookies
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://ayacloud.ddns.net:5173',
  credentials: true
}))

app.use(session({
  name: 'sid',
  keys: [process.env.SESSION_KEY || 'change_this'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
}))

const CLIENT_ID = process.env.DISCORD_CLIENT_ID
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI

app.get('/auth/discord/token', async (req, res) => {
  // accept code from query or POST body
  const code = req.query.code || req.body.code
  if (!code) return res.status(400).json({ error: 'missing code' })

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI
  })

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    if (!tokenRes.ok) {
      const txt = await tokenRes.text()
      // forward Discord status and body so client can see error details (CORS header is present)
      return res.status(tokenRes.status || 500).send(txt)
    }
    const tokenJson = await tokenRes.json()
    // store access token in session
    req.session.access_token = tokenJson.access_token
    req.session.refresh_token = tokenJson.refresh_token
    req.session.expires_in = tokenJson.expires_in
    return res.json({ ok: true })
  } catch (err) {
    console.error('token exchange failed:', err)
    return res.status(500).json({ error: 'token exchange failed' })
  }
})

app.get('/auth/discord/guilds', async (req, res) => {
  const token = req.session?.access_token
  if (!token) return res.status(401).json({ error: 'not logged in' })

  try {
    const r = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!r.ok) {
      const txt = await r.text()
      return res.status(r.status).send(txt)
    }
    const guilds = await r.json()
    return res.json(guilds)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'failed to fetch guilds' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`))