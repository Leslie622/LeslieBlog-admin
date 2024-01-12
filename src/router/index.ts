import { createRouter, createWebHistory } from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'

const welcome = () => import('@/views/welcome/index.vue')
const home = () => import('@/views/home/index.vue')
const layout = () => import('@/layout/index.vue')
const userManage = () => import('@/views/user-manage/index.vue')
const menuManage = () => import('@/views/menu-manage/index.vue')
const roleManage = () => import('@/views/role-manage/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: home
        }
      ]
    },
    // {
    //   path: '/system',
    //   component: layout,
    //   redirect: '/system/userManage',
    //   children: [
    //     {
    //       path: '/system/userManage',
    //       component: userManage
    //     },
    //     {
    //       path: '/system/menuManage',
    //       component: menuManage
    //     },
    //     {
    //       path: '/system/roleManage',
    //       component: roleManage
    //     }
    //   ]
    // },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome
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
      // //拿到动态路由
      routeStore.getAsyncRoute()
      const asyncRoute = routeStore.asyncRoute

      if (registerRouteFresh) {
        asyncRoute.forEach((route) => {
          router.addRoute('layout', {
            path: route.path,
            component: () => import(`@/views/${route.component}/index.vue`)
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
