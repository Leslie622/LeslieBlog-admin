import apiUser from '@/api/modules/user'
import { removeRouteList } from '@/router'

export const useUserStore = defineStore('user', () => {
  /* pinia state */
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')

  /* 用户登录操作 */
  async function login(data: User.loginReqData) {
    //调用登录接口
    const response = await apiUser.login(data)
    const userInfo = response.data
    //用户信息存储到localstorage
    localStorage.setItem('account', userInfo.account)
    localStorage.setItem('token', userInfo.token)
    //用户信息存储到Pinia
    account.value = userInfo.account
    token.value = userInfo.token
  }

  /* 用户注册操作 */
  async function register(data: User.registerReqData) {
    const response = await apiUser.register(data)
  }

  /* 用户退出登录 */
  function logout() {
    //清除用户信息
    account.value = ''
    token.value = ''
    localStorage.removeItem('account')
    localStorage.removeItem('token')
    //清除动态路由
    removeRouteList.forEach((item) => {
      item()
    })
    //清除tabs
    localStorage.removeItem('tabs')
  }

  /* return */
  return { account, token, login, register, logout }
})
