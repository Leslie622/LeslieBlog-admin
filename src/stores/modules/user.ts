import apiUser from '@/api/modules/user'

export const useUserStore = defineStore('user', () => {
  /* pinia state */
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')
  const permissionList = ref(JSON.parse(localStorage.permissionList) ?? '')
  const menuList = ref(JSON.parse(localStorage.menuList) ?? '')

  /* 用户登录操作 */
  async function login(data: { account: string; password: string }) {
    //调用登录接口
    const response = await apiUser.login(data)
    const userInfo = response.data
    //用户信息存储到localstorage
    localStorage.setItem('account', userInfo.account)
    localStorage.setItem('token', userInfo.token)
    localStorage.setItem('permissionList', JSON.stringify(userInfo.permissionList))
    localStorage.setItem('menuList', JSON.stringify(userInfo.menuList))
    //用户信息存储到Pinia
    account.value = userInfo.account
    token.value = userInfo.token
    permissionList.value = userInfo.permissionList
    menuList.value = userInfo.menuList
  }

  /* 用户注册操作 */
  async function register(data: { account: string; password: string }) {
    const response = await apiUser.register(data)
  }

  /* return */
  return { account, token, permissionList, menuList, login, register }
})
