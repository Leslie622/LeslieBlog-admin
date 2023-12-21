import { createRouter, createWebHistory } from 'vue-router'

const Welcome = () => import('@/views/welcome.vue')
const Home = () => import('@/views/home.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/welcome'
    },
    {
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

export default router
