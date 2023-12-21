import apiUser from '@/api/modules/user'


export const useUserStore = defineStore('user', () => {
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')

  async function login(data: { account: string; password: string }) {
    const response = await apiUser.login(data)
  }
  return { account, token, login }
})
