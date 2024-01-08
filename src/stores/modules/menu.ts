import apiUser from '@/api/modules/user'

export const useMenuStore = defineStore('menu', () => {
  /* state */
  const menuList = ref()

  /* 获取用户菜单 */
  async function getAsyncMenuList() {
    const response = await apiUser.menuList()
    menuList.value = response.data.menuList
  }

  /* return */
  return { menuList, getAsyncMenuList }
})
