import { useUserStore } from '@/stores/modules/user'

export const useRouteStore = defineStore('route', () => {
  /* state */
  const asyncRoute = ref()
  const userStore = useUserStore()
  
  /* 将用户菜单转换为路由 */
  async function getAsyncRoute() {
    asyncRoute.value = generateRoute(userStore.menuList)
  }

  /* 根据用户菜单生成路由 */
  function generateRoute(menuList, route = []) {
    menuList.forEach((item) => {
      if (item.menuType === 2) {
        route.push(item)
      }
      generateRoute(item.children, route)
    })
    return route
  }

  return { asyncRoute, getAsyncRoute }
})
