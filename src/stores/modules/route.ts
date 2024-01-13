import { useMenuStore } from '@/stores/modules/menu'

export const useRouteStore = defineStore('route', () => {
  /* state */
  const asyncRoute = ref()
  const menuStore = useMenuStore()
  
  /* 将用户菜单转换为路由 */
  async function getAsyncRoute() {
    
    asyncRoute.value = generateRoute(menuStore.menuList)
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
