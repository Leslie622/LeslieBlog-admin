<template>
  <el-menu :collapse="commonStore.isMenuCollapse" class="menu" :default-active="route.path" router>
    <menu-tree :menuList="permissionStore.menu"></menu-tree>
  </el-menu>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/modules/permission'
import { useCommonStore } from '@/stores/modules/common';
const permissionStore = usePermissionStore()
const commonStore = useCommonStore()
const route = useRoute()


</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
  border: none;
  --el-menu-bg-color: #343a40;
  --el-menu-text-color: #c2c7d0;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1);
  --el-menu-active-color: #ffffff;
}
</style>
