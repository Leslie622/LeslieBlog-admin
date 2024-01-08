import { useMenuStore } from '@/stores/modules/menu'

export const useRouteStore = defineStore('route', () => {
  /* state */
  const asyncRoute = ref([])
  const menuStore = useMenuStore()

  /* 将用户菜单转换为路由 */
  async function getAsyncRoute() {
    asyncRoute.value = generateRoute(menuStore.menuList)
  }

  /* 根据动态菜单生成路由 */
  function generateRoute(menuList: Array<MenuItem>) {
    return menuList.reduce((acc, item) => {
      //如果菜单类型是路由，则添加到路由列表
      if (item.menuType === 'router') {
        acc.push(item)
      }
      //如果该菜单类型为list，并有children项，则递归
      if (item.children && item.menuType === 'list') {
        const childrenRoute = generateRoute(item.children)
        acc.push(...childrenRoute)
      }
      return acc
    }, [])
  }

  return { asyncRoute, getAsyncRoute }
})
