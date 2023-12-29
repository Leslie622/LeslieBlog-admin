import { createRouter, createWebHistory } from 'vue-router'

const Welcome = () => import('@/views/welcome.vue')
const Home = () => import('@/views/home.vue')
// 导入菜单列表
import menuList from '@/config/menuList'

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
      component: Home,
      //重定向到第一个子路由
      redirect: (to) => {
        return routeList[0].path
      }
    }
  ]
})

/* 将菜单转换为路由列表 */
const getRouteList = (menuList: MenuItem[]) => {
  return menuList.reduce((acc, item) => {
    //如果菜单类型是路由，则添加到路由列表
    if (item.menuType === 'router') {
      acc.push(item)
    }
    //如果该菜单类型为list，并有children项，则递归
    if (item.children && item.menuType === 'list') {
      const childrenRoute = getRouteList(item.children)
      acc.push(...childrenRoute)
    }
    return acc
  }, [])
}

// 路由列表
const routeList = getRouteList(menuList)

/* 全局前置守卫 */
let registerRouteFresh = true
router.beforeEach((to, from, next) => {
  if (to.name === 'welcome') {
    next()
  } else {
    // 每次路由跳转，根据token是否存在判断用户是否登陆
    let token = localStorage.getItem('token')
    if (token === null || token === '') {
      ElMessage.error({ message: '您未登录，请先登录' })
      next({ name: 'welcome' })
    } else {
      //用户登录成功 注册动态路由
      if (registerRouteFresh) {
        routeList.forEach((route) => {
          router.addRoute('home', {
            path: route.path,
            name: route.menuName,
            component: () => import(`@/views/HomeChildren/${route.component}.vue`)
          })
        })
        // next({ path: '/parent/first-child', replace: true });
        next({ ...to, replace: true })
        registerRouteFresh = false
      } else {
        next()
      }
    }
  }
})

export default router
