import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('@/views/login.vue')

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
    }
  ]
})

export default router
