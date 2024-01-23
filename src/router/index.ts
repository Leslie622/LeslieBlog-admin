import {
  createRouter,
  createWebHistory,
  type RouterOptions,
  type RouteRecordRaw,
  type Router
} from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'
import { useCommonStore } from '@/stores/modules/common'

const welcome = () => import('@/views/welcome/index.vue')
const home = () => import('@/views/home/index.vue')
const layout = () => import('@/layout/index.vue')
const notFound = () => import('@/views/404/index.vue')

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
      /* 用户登录成功 如果没有注册动态路由则注册 */
      const commonStore = useCommonStore()
      if (!commonStore.isRegisterAsyncRoute) {
        console.log('注册')
        //拿到动态路由
        const routeStore = useRouteStore()
        await routeStore.getAsyncRoute()
        const asyncRoute = routeStore.asyncRoute
        //循环注册：注册的同时保存路由回调
        asyncRoute.forEach((route) => {
          removeRouteList.push(router.addRoute('layout', route))
        })
        //注册公共动态路由：暂时解决刷新页面会被捕捉到404的bug
        router.addRoute('layout', {
          path: '/:pathMatch(.*)*',
          name: '404',
          meta: {
            title: '404'
          },
          component: notFound
        })
        //注册成功后改变状态，避免重复注册
        commonStore.isRegisterAsyncRoute = true
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  }
})

export default router
