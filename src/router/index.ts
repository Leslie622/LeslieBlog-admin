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
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    }
  ]
})

/* 全局前置守卫 */
router.beforeEach((to, from, next) => {
  // 判断用户是否登陆
  if (to.name === 'welcome') {
    next()
  } else {
    let token = localStorage.getItem('token')
    if (token === null || token === '') {
      ElMessage.error({ message: '您未登录，请先登录' })
      next({ name: 'welcome' })
    } else {
      next()
    }
  }
})

export default router
