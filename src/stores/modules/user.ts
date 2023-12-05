export const useUserStore = defineStore('user', () => {
  const account = ref(localStorage.account ?? '')
  const token = ref(localStorage.token ?? '')
  function delayedPromise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("123");
      }, 3000);
    });
  }
  async function login(data: { username: string; password: string }) {
   await delayedPromise()
   
  }
  return { account, token, login }
})
