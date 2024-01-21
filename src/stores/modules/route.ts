import { type RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'

export const useRouteStore = defineStore('route', () => {
  /* state */
  const asyncRoute = ref<RouteRecordRaw[]>([])
  const permissionStore = usePermissionStore()
  //获取所有组件路径
  const modules = import.meta.glob('@/views/**/**/*.vue')

  /* 获取异步路由 */
  async function getAsyncRoute() {
    await permissionStore.getPermission()
    asyncRoute.value = generateRoute(permissionStore.menu)
  }

  /* 根据用户菜单生成路由 */
  function generateRoute(menuList: MenuItem[] = [], route: RouteRecordRaw[] = []) {
    menuList.forEach((item) => {
      if (item.menuType === 2) {
        route.push({
          path: item.path,
          meta: {
            title: item.menuName
          },
          component: modules[`/src/views/${item.component}/index.vue`]
        })
      }
      generateRoute(item.children, route)
    })
    return route
  }

  return { asyncRoute, getAsyncRoute }
})
