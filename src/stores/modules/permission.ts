import apiUser from '@/api/modules/user'

export const usePermissionStore = defineStore('permission', () => {
  /* state */
  const menu = ref<MenuItem[]>() //用户菜单
  const permission = ref<string[]>() //用户权限

  /* 获取用户权限 */
  async function getPermission() {
    const response = await apiUser.getPermission()
    const userPermission = response.data
    menu.value = userPermission.menu
    permission.value = userPermission.permission
  }

  return { menu, permission, getPermission }
})
