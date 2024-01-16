//公共状态管理
export const useCommonStore = defineStore('common', () => {
  /* state */
  const isMenuCollapse = ref(false)

  /* 改变layout菜单折叠状态 */
  function controlMenuCollapse() {
    isMenuCollapse.value = !isMenuCollapse.value
  }

  return { isMenuCollapse ,controlMenuCollapse}
})
