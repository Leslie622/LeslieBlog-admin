import { createRouter, createWebHistory } from 'vue-router'

const Welcome = () => import('@/views/welcome.vue')
const Home = () => import('@/views/home.vue')
const ArticleData = () => import('@/views/HomeChildren/ArticleData.vue')

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
      redirect: (to)=>{
        return componentsArray[0].path
        
      }
    }
  ]
})

const extractComponents = (menuList) => {
  return menuList.reduce((acc, item) => {
    if (item.component !== '') {
      acc.push(item)
    }
    if (item.children && item.children.length > 0) {
      const childrenWithComponents = extractComponents(item.children)
      acc.push(...childrenWithComponents)
    }
    return acc
  }, [])
}

const componentsArray = extractComponents(menuList)

/* 全局前置守卫 */
let registerRouteFresh = true
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
      //注册动态路由
      if (registerRouteFresh) {
        componentsArray.forEach((route) => {
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
