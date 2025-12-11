<script setup>
import Navbar from '../components/nav.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const clientId = '1259472762850775042'
const redirectUri = 'https://viteprojectest.netlify.app/discord-callback' // ปรับเป็นของคุณถ้าจำเป็น
const scope = 'identify email guilds'

function handleGetStart() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'
  if (loggedIn) {
    router.push({ name: 'Dashboard' })
  } else {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
    window.location.href = discordAuthUrl
  }
}

const userGuilds = ref([])

onMounted(() => {
  const guildsStr = localStorage.getItem('userGuilds')
  if (guildsStr) {
    userGuilds.value = JSON.parse(guildsStr)
  }
})
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
  </header>
  <main>
    <Navbar/>
    <router-view />
    <div class="title">
      <h1>ASTRALIS</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat pariatur eaque officiis labore saepe officia quisquam, consequatur eveniet libero minus.</p>
      <button @click="handleGetStart">
        Get start
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="2" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </main>
</template>

<style>
/* ลบ scroll ของ body */
body {
  margin: 0;
  overflow: hidden; /* ป้องกัน scroll */
}

/* title อยู่ตรงกลาง */
.title {
  position: absolute;      /* ให้อยู่กลางหน้าจอ */
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.title h1 {
  font-size: 12rem;
  font-family: "BBH Sans Hegarty", sans-serif;
  font-weight: 200;
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #000000, #a8a8a8, white); 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent;
  text-shadow: 
    0 0 40px rgba(163, 163, 163, 0.5),
    0 0 80px rgba(75, 75, 75, 0.3);
}

.title p {
  position: absolute;      /* ให้อยู่กลางหน้าจอ */
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.12rem;
  font-family: "Exo 2", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

.title button {
  padding: 15px 30px;
  font-size: 1.2rem;
  font-family: 'Orbitron', sans-serif;
  font-weight: 500;
  color: #eee; 
  background: linear-gradient(45deg, #7e7e7e);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow:
    0 0 10px rgba(100,100,100,0.6),
    0 0 20px rgba(80,80,80,0.5),
    0 0 40px rgba(60,60,60,0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;  /* ปิดเส้น underline */
}

.title button:hover {
  transform: scale(1.05);
  box-shadow:
    0 0 20px rgba(120,120,120,0.8),
    0 0 40px rgba(90,90,90,0.6),
    0 0 80px rgba(70,70,70,0.5);
}

.title button .arrow {
  transform: translateX(-2px);
  transition: transform 0.3s ease;
}

.title button:hover .arrow {
  transform: translateX(5px);
}

/* ลบ .guild-list style ออกได้ถ้าไม่ใช้ */
</style>