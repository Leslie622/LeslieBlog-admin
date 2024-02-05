//公共状态管理
export const useCommonStore = defineStore('common', () => {
  /* state */
  const isMenuCollapse = ref(false)
  const isRegisterAsyncRoute = ref(false) //判断是否注册过动态路由
  const isHaveBlogCotent = ref(false) //判断编辑器是否有内容:默认为false表示在没有写博客之前可以随意离开写博客页面

  /* 改变layout菜单折叠状态 */
  function controlMenuCollapse() {
    isMenuCollapse.value = !isMenuCollapse.value
  }

  return { isMenuCollapse, controlMenuCollapse, isRegisterAsyncRoute, isHaveBlogCotent }
})
