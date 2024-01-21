import {
  createRouter,
  createWebHistory,
  type RouterOptions,
  type RouteRecordRaw,
  type Router
} from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'

const welcome = () => import('@/views/welcome/index.vue')
const home = () => import('@/views/home/index.vue')
const layout = () => import('@/layout/index.vue')

/* routes */
const routes: RouteRecordRaw[] = [
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

/* router配置项 */
const options: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
}

/* router实例 */
const router: Router = createRouter(options)

//路由回调列表：删除动态路由时使用
export const removeRouteList: Function[] = []

/* 全局前置守卫 */
let registerRouteFresh = true
router.beforeEach(async (to, from, next) => {
  if (to.name === 'welcome') {
    next()
  } else {
    // 每次路由跳转，根据token是否存在判断用户是否登陆
    const token = localStorage.getItem('token')
    if (token === null || token === '') {
      ElMessage.error({ message: '您未登录，请先登录' })
      next({ name: 'welcome' })
    } else {
      /* 用户登录成功 注册动态路由 */
      const routeStore = useRouteStore()
      await routeStore.getAsyncRoute()
      const asyncRoute = routeStore.asyncRoute
      if (registerRouteFresh) {
        asyncRoute.forEach((route) => {
          //注册路由的同时保存回调
          removeRouteList.push(router.addRoute('layout', route))
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
