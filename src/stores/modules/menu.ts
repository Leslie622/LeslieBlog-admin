import apiUser from '@/api/modules/user'

export const useMenuStore = defineStore('menu', () => {
  /* state */
  const menuList = ref()

  async function getMenuList() {
    const response = await apiUser.login({ account: '17671448657', password: 'lyf001211' })
    const userInfo = response.data
    menuList.value = userInfo.menuList
  }

  return { menuList, getMenuList }
})
