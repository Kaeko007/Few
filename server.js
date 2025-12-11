import express from 'express'
import cors from 'cors'
// Node.js v18+ มี fetch ในตัว ไม่ต้อง import node-fetch

const app = express()
app.use(cors())
app.use(express.json())

const clientId = '1259472762850775042'
const clientSecret = 'KuIliA7Koq7G_5SyXt7w_ssA94Maj1kr'
const redirectUri = 'http://ayacloud.ddns.net:5173/discord-callback'
const botToken = 'MTI1OTQ3Mjc2Mjg1MDc3NTA0Mg.G4DOzW.UOJYQsnXSh9zXsHnMKnBvm7Ag4sQOi8quuBF_8' // ใส่ token ของบอทคุณ

// แลก code เป็น access token
app.post('/api/exchange-token', async (req, res) => {
  const params = req.body
  const urlParams = new URLSearchParams()
  urlParams.append('client_id', clientId)
  urlParams.append('client_secret', clientSecret)
  urlParams.append('grant_type', 'authorization_code')
  urlParams.append('code', params.code)
  urlParams.append('redirect_uri', redirectUri)
  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlParams
    })
    const tokenData = await tokenRes.json()
    res.json(tokenData)
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed' })
  }
})

// รับ access token แล้วคืน guilds ที่ user กับ bot อยู่ร่วมกัน
app.post('/api/shared-guilds', async (req, res) => {
  const { accessToken } = req.body
  try {
    // guilds ของ user
    const userRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const userGuilds = await userRes.json()

    // guilds ของ bot
    const botRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bot ${botToken}` }
    })
    const botGuilds = await botRes.json()

    // filter เฉพาะ guild ที่ id ตรงกัน
    const botGuildIds = new Set(botGuilds.map(g => g.id))
    const sharedGuilds = userGuilds.filter(g => botGuildIds.has(g.id))

    res.json({ guilds: sharedGuilds })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guilds' })
  }
})

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
