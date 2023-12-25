<template>
  <template v-for="menu in props.menuList">
    <el-sub-menu :index="menu.path" v-if="menu.children">
      <template #title>
        <el-icon v-if="menu.icon">
          <component :is="menu.icon"></component>
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :menuList="menu.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item :index="menu.path" v-else>
      <el-icon v-if="menu.icon"><location /></el-icon>
      <span>{{ menu.menuName }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import TreeMenu from '@/components/TreeMenu/index.vue'
const props = defineProps(['menuList'])

</script>

<style lang="scss" scoped></style>
