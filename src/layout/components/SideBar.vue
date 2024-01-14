<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    router
  >
    <tree-menu :menuList="permissionStore.menu"></tree-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/modules/permission'
const permissionStore = usePermissionStore()
const route = useRoute()
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
}
</style>
