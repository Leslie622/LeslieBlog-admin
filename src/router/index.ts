import { createRouter, createWebHistory } from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'
import { usePermissionStore } from '@/stores/modules/permission'

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
      meta: {
        title: '主页'
      },
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: home,
          meta: {
            title: '主页'
          }
        }
      ]
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome
    }
  ]
})

//路由回调列表
export const removeRouteList = []

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
      await routeStore.getAsyncRoute()
      const asyncRoute = routeStore.asyncRoute
      if (registerRouteFresh) {
        console.log('注册')
        asyncRoute.forEach((route) => {
          //注册路由的同时保存回调，以便后续清空
          removeRouteList.push(
            router.addRoute('layout', {
              path: route.path,
              meta: {
                title: route.menuName
              },
              component: () => import(`@/views/${route.component}/index.vue`)
            })
          )
        })
        registerRouteFresh = false
        next({ ...to, replace: true })
      } else {
        registerRouteFresh = true
        next()
      }
    }
  }
})

export default router
