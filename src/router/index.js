import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import DiscordCallback from '../views/DiscordCallback.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },                // หน้าแรก
  { path: '/discord-callback', name: 'DiscordCallback', component: DiscordCallback },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// global guard: ถ้าหน้าต้องการ auth แต่ยังไม่ได้ล็อคอิน จะไปหน้า Home
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'
  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
