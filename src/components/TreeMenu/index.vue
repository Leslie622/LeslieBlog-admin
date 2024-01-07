<template>
  <template v-for="menu in props.menuList">
    <!-- 菜单类型是list,渲染成sub-menu -->
    <el-sub-menu :index="menu.path" v-if="menu.menuType === 'list'">
      <template #title>
        <el-icon >
          <!-- <i class="iconfont icon-menu"></i> -->
          <!-- <component :is="menu.icon"></component> -->
          <!-- <i-ep-dataAnalysis></i-ep-dataAnalysis> -->
          <!-- arrow-down -->
          <Icon v-if="menu.icon" :icon="menu.icon" />
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <!-- 递归渲染 -->
      <tree-menu :menuList="menu.children"></tree-menu>
    </el-sub-menu>
    <!-- 菜单类型是router,渲染成menu-item -->
    <el-menu-item :index="menu.path" v-else-if="menu.menuType === 'router'">
      <template #title>
        <!-- <el-icon v-if="menu.icon">
          <component :is="menu.icon"></component>
        </el-icon> -->
        <span>{{ menu.menuName }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">

import TreeMenu from '@/components/TreeMenu/index.vue'
// const props = defineProps<{
//   menuList: Array<MenuItem>
// }>()

const props = defineProps({
  menuList: Array<MenuItem>
})
</script>

<style lang="scss" scoped></style>
