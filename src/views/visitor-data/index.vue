<template>
  <div class="visitor">
    <div class="action">
      <el-button type="primary" size="small" @click="currentTab = 'VisitorTable'">表格</el-button>
      <el-button type="primary" size="small" @click="currentTab = 'VisitorVisual'">数据可视化</el-button>
    </div>
    <component :is="tabs[currentTab]"></component>
  </div>
</template>

<script setup lang="ts">
import VisitorTable from './VisitorTable/index.vue'
import VisitorVisual from './VisitorVisual/index.vue'

type Tabs = {
  [key: string]: any
}

const currentTab = ref<string>('VisitorTable')
const tabs: Tabs = {
  VisitorTable,
  VisitorVisual
}
</script>

<style lang="scss" scoped>
.visitor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.action {
  padding: 10px;
  display: flex;
}
</style>
