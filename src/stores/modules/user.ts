import apiUser from '@/api/modules/user'

export const useUserStore = defineStore('user', () => {
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')

  async function login(data: { account: string; password: string }) {
    const res = await apiUser.login(data)
    console.log(res)
  }
  return { account, token, login }
})
