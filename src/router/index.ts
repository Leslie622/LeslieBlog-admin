import { createRouter, createWebHistory } from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'
import { useMenuStore } from '@/stores/modules/menu'

const Welcome = () => import('@/views/welcome.vue')
const Home = () => import('@/views/home.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/home'
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
let registerRouteFresh = true
router.beforeEach(async (to, from, next) => {
  if (to.name === 'welcome') {
    next()
  } else {
    // 每次路由跳转，根据token是否存在判断用户是否登陆
    let token = localStorage.getItem('token')
    if (token === null || token === '') {
      ElMessage.error({ message: '您未登录，请先登录' })
      next({ name: 'welcome' })
    } else {
      /* 用户登录成功 注册动态路由 */
      const routeStore = useRouteStore()
      const menuStore = useMenuStore()
      //获取动态菜单
      const asyncMenu = await menuStore.getAsyncMenuList()
      //拿到动态路由
       routeStore.getAsyncRoute()
      const asyncRoute = routeStore.asyncRoute

      if (registerRouteFresh) {
        console.log("注册");
        
        asyncRoute.forEach((route) => {
          router.addRoute('home', {
            path: route.path,
            name: route.menuName,
            component: () => import(`@/views/HomeChildren/${route.component}.vue`)
          })
        })
        next({ ...to, replace: true })
        registerRouteFresh = false
      } else {
        next()
      }
    }
  }
})

export default router
