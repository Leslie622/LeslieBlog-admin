import apiUser from '@/api/modules/user'

export const useUserStore = defineStore('user', () => {
  /* pinia state */
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')

  /* 用户登录操作 */
  async function login(data: { account: string; password: string }) {
    //调用登录接口
    const response = await apiUser.login(data)
    //用户信息存储到localstorage
    localStorage.setItem('account', response.data.account)
    localStorage.setItem('token', response.data.token)
    //用户信息存储到Pinia
    account.value = response.data.account
    token.value = response.data.token
  }

  /* 用户注册操作 */
  async function register(data: { account: string; password: string }) {
    const response = await apiUser.register(data)
  }

  /* return */
  return { account, token, login, register }
})
