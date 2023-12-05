import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/views/login.vue')
const Home = () => import('@/views/home.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

export default router
