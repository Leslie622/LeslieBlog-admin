//公共状态管理
export const useCommonStore = defineStore('common', () => {
  /* state */
  const isMenuCollapse = ref(false)
  const isRegisterAsyncRoute = ref(false) //判断是否注册过动态路由
  const isBlogPublished = ref(false) //判断文章是否已经发布

  /* 改变layout菜单折叠状态 */
  function controlMenuCollapse() {
    isMenuCollapse.value = !isMenuCollapse.value
  }

  return { isMenuCollapse, controlMenuCollapse, isRegisterAsyncRoute,isBlogPublished }
})
