<template>
<div class="topnav">
  <img src="../assets/logo.png" alt="" class="icon">
  <a class="active" href="#home">Home</a>
  <a href="#news">News</a>
  <a href="#contact">Contact</a>
  <a href="#about">About</a>

  <!-- ปุ่ม Login แสดงเมื่อยังไม่ล็อกอิน, ถ้าล็อกอินแล้วจะแสดงปุ่ม Logout แทน -->
  <button v-if="!loggedIn" class="login" @click="loginWithDiscord">
    Login<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord discord" viewBox="0 0 16 16">
  <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
</svg>
  </button>

  <button v-else class="logout" @click="logout">
    Logout
  </button>
</div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const clientId = "1259472762850775042"
const redirectUri = "https://viteprojectest.netlify.app/discord-callback" // เปลี่ยนตามของคุณ
const scope = "identify email guilds"

const router = useRouter()
const route = useRoute()
const loggedIn = ref(localStorage.getItem('loggedIn') === 'true')

function loginWithDiscord() {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
  window.location.href = discordAuthUrl
}

function logout() {
  localStorage.removeItem('loggedIn')
  loggedIn.value = false
  router.push({ name: 'Home' })
}

// อัพเดตเมื่อมีการเปลี่ยน route (เช่นหลังจาก callback) และเมื่อ storage ถูกเปลี่ยนจาก tab อื่น
function onStorage(e) {
  if (e.key === 'loggedIn') loggedIn.value = e.newValue === 'true'
}

onMounted(() => {
  window.addEventListener('storage', onStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
})

// ถ้า DiscordCallback ตั้ง localStorage แล้ว redirect ในแท็บเดียวกัน, watch route เพื่อ refresh สถานะ
watch(() => route.fullPath, () => {
  loggedIn.value = localStorage.getItem('loggedIn') === 'true'
})
</script>

<style>
.topnav {
  outline: 1px solid gray;
  display: flex;
  top: 0;
  justify-content: center; /* จัดให้อยู่กลางแนวนอน */
  background-color: blur;
  border-radius: 0 0 20px 20px;
  padding: 17px 20px;
  width: 60%;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  gap: 3%;
  font-size: 1.12rem;
  
  font-family: "Exo 2", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

.topnav a {
  border-radius: 20px;
  padding: 10px 20px;       /* เพิ่ม padding รอบข้อความ */
  color: white;
  text-decoration: none;
  text-align: center;
  opacity: 1;
}

.topnav a:hover {
  outline: 1px solid rgb(175, 175, 175);
  background-color: #464646;
  transition: background-color 0.3s;
}

.icon {
  position: fixed;
  left: 25px; /* เว้นระยะจากขอบ navbar */
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
}

.login {
  position: fixed;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgb(69, 69, 255);
  border-radius: 30px;
  border: none;
  padding: 12px 22px;
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 0.8rem;

  display: flex;           /* ข้อความ + icon ขนานกัน */
  align-items: center;     /* แนวตั้งกลาง */
  gap: 8px;                /* เว้นระยะข้อความกับ SVG */

  cursor: pointer;
  transition: all 0.3s ease; /* Smooth transition */
  box-shadow:
    0 4px 6px rgba(0,0,0,0.3);
}

/* ปรับขนาด SVG ข้างในปุ่ม */
.login svg {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease; /* สำหรับ animation ขณะ hover */
}

/* Hover effect */
.login:hover {
  background-color: rgb(41, 41, 255); /* เปลี่ยนสีพื้นหลัง */
  transform: translateY(-50%) scale(1.05); /* ขยายเล็กน้อย */
  box-shadow:
    0 6px 10px rgba(0,0,0,0.4),
    0 4px 20px rgba(0,0,0,0.2);
}

.login:hover svg {
  transform: translateY(-1px) scale(1.1); /* ขยับและขยาย icon เล็กน้อย */
}



.logout {
  position: fixed;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgb(255, 69, 69);
  border-radius: 30px;
  border: none;
  padding: 12px 22px;
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 0.8rem;

  display: flex;           /* ข้อความ + icon ขนานกัน */
  align-items: center;     /* แนวตั้งกลาง */
  gap: 8px;                /* เว้นระยะข้อความกับ SVG */

  cursor: pointer;
  transition: all 0.3s ease; /* Smooth transition */
  box-shadow:
    0 4px 6px rgba(0,0,0,0.3);
}

/* ปรับขนาด SVG ข้างในปุ่ม */
.logout svg {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease; /* สำหรับ animation ขณะ hover */
}

/* Hover effect */
.logout:hover {
  background-color: rgb(255, 41, 41); /* เปลี่ยนสีพื้นหลัง */
  transform: translateY(-50%) scale(1.05); /* ขยายเล็กน้อย */
  box-shadow:
    0 6px 10px rgba(0,0,0,0.4),
    0 4px 20px rgba(0,0,0,0.2);
}

.logout:hover svg {
  transform: translateY(-1px) scale(1.1); /* ขยับและขยาย icon เล็กน้อย */
}
</style>
