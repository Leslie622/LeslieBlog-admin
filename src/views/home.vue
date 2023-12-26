<template>
  <el-container class="home">
    <!-- aside -->
    <el-aside width="150px">
      <el-menu :default-active="activeMenu"  @open="handleOpen" @close="handleClose" router>
        <tree-menu :menuList="menuList"></tree-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- header -->
      <el-header> </el-header>
      <!-- main -->
      <el-main>
        <el-tabs
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
          >
          </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import TreeMenu from '@/components/TreeMenu/index.vue'
import menuList from '@/config/menuList.js'
const route = useRoute()
const router = useRouter()
console.log(route)

const routes = computed(() => {
  return route.matched
})

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
//获取菜单激活项
const activeMenu = computed(() => {
  return route.path
})

const routerName = computed(() => {
  return router.currentRoute.value.name
})

// let tabIndex = 2
const editableTabsValue = ref()
const editableTabs = ref([
  // {
  //   title: 'Tab 1',
  //   name: '1',
  //   content: 'Tab 1 content'
  // },
  // {
  //   title: 'Tab 2',
  //   name: '2',
  //   content: 'Tab 2 content'
  // }
])

watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    console.log(router)
    //点击tab 切换路由
    router.push(toPath)
    editableTabsValue.value = router.currentRoute.value.name
    // console.log(router.currentRoute.value.name);

    //如果添加相同的路由，则直接跳转，否则新建
    const checkValueInArray = (key, value, array) => array.some((obj) => obj[key] === value)
    if (checkValueInArray('path', toPath, editableTabs.value)) {
      router.push(toPath)
    } else {
      editableTabs.value.push({
        title: router.currentRoute.value.name,
        name: router.currentRoute.value.name,
        path: router.currentRoute.value.path
      })
      console.log(editableTabs.value)
    }
  },
  { immediate: true, deep: true }
)


const tabClick = (pane, event) => {
  console.log(pane.index, event)
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
.home {
  height: 100vh;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
