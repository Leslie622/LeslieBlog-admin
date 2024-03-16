<template>
  <el-tabs v-model="activeTabName" type="card" class="tabs" @tab-click="changeTab" @tab-remove="removeTab" :closable="true">
    <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.name" :name="tab.name"> </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import type { TabPaneName, TabsPaneContext } from 'element-plus'

const route = useRoute()
const router = useRouter()
const activeTabName = ref<TabPaneName>() //默认tab项
//定义tabs类型
type Tabs = {
  name: string
  path: string
}[]
const tabs = ref<Tabs>(localStorage.tabs ? JSON.parse(localStorage.tabs) : []) //tabs数组

/* 监听tabs变化,每次改变将信息存储到localStorage */
watch(
  () => tabs,
  () => {
    localStorage.setItem('tabs', JSON.stringify(tabs.value))
  },
  { deep: true, immediate: true }
)

/* 监听路由变化 */
watch(
  () => route,
  (newRoute) => {
    const name = newRoute.meta.title as string
    const path = newRoute.path as string
    //每次路由变化，添加tab项
    activeTabName.value = name
    //如果tab不存在，则新增
    const isExist = tabs.value.find((tab) => tab.name === name)
    if (!isExist) {
      tabs.value.push({ name, path })
    }
  },
  { deep: true, immediate: true }
)

/* 点击tab更改路由 */
function changeTab(tab: TabsPaneContext) {
  const index = Number(tab.index)
  router.push(tabs.value[index].path)
}

/* 删除tab */
function removeTab(targetName: TabPaneName) {
  const tabArr = tabs.value
  //如果剩最后一个tab，则不能删除
  if (tabs.value.length === 1) {
    return
  }
  //如果删除的是当前的tab
  if (activeTabName.value === targetName) {
    //找到当前tab的位置
    tabArr.forEach((tab, index) => {
      if (tab.name === targetName) {
        //优先跳转到前面的tab项
        const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
        if (nextTab) {
          //更改活跃tab项
          activeTabName.value = nextTab.name
          router.push(nextTab.path)
        }
      }
    })
  }
  tabs.value = tabs.value.filter((tab) => tab.name !== targetName)
}
</script>

<style lang="scss" scoped>
.tabs {
  :deep(.el-tabs__header) {
    margin: 0px;
    --el-tabs-header-height: 35px;
    .el-tabs__item {
      font-size: 13px;
    }
  }
  :deep(.is-active) {
    font-weight: bold;
  }
}
</style>
