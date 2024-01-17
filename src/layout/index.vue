<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside class="layout__aside">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <!-- 导航头 -->
      <el-header class="layout__header">
        <nav-bar></nav-bar>
      </el-header>
      <!-- 主内容 -->
      <el-main class="layout__main">
        <!-- <router-view></router-view> -->
        <!-- <el-tabs
          v-model="editableTabsValue"
          type="card"
          class="demo-tabs"
          closable
          @tab-click="tabClick"
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          > -->
            <router-view></router-view>
          <!-- </el-tab-pane>
        </el-tabs> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

//获取菜单激活项
const activeMenu = computed(() => {
  return route.path
})
const editableTabsValue = ref()
const editableTabs = ref([])
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    //点击tab 切换路由
    console.log(toPath);
    
    router.push(toPath)
    console.log(router.currentRoute.value.meta.title);
    
    editableTabsValue.value = router.currentRoute.value.meta.title

    //如果添加相同的路由，则直接跳转，否则新建
    const checkValueInArray = (key, value, array) => array.some((obj) => obj[key] === value)
    if (checkValueInArray('path', toPath, editableTabs.value)) {
      router.push(toPath)
    } else {
      editableTabs.value.push({
        title: router.currentRoute.value.meta.title,
        // name: router.currentRoute.value.name,
        path: router.currentRoute.value.path
      })
    }
  },
  { immediate: true, deep: true }
)

// watch(()=> route.path,(newPath,oldPath)=>{
//   // console.log(newPath,oldPath);
//   console.log(route);

// })
const tabClick = (pane, event) => {
  router.push(editableTabs.value[pane.index].path)
}
const removeTab = (targetName: string) => {
  //如果剩最后一个tab，则不能删除
  if (editableTabs.value.length === 1) {
    return
  }
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
          router.push(nextTab.path)
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.layout__header {
  height: 50px;
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
}

.layout__main {
  padding: 10px;
}

.layout__aside {
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.25),
    0 3px 3px rgba(0, 0, 0, 0.22);
  width: auto;
}
</style>
