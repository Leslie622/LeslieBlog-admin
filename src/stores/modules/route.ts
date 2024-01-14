import { usePermissionStore } from '@/stores/modules/permission'

export const useRouteStore = defineStore('route', () => {
  /* state */
  const asyncRoute = ref([])
  const permissionStore = usePermissionStore()

  /* 获取异步路由 */
  async function getAsyncRoute() {
    await permissionStore.getPermission()
    asyncRoute.value = generateRoute(permissionStore.menu)
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
