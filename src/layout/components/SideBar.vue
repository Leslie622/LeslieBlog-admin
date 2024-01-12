<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    router
  >
    <tree-menu :menuList="userStore.menuList"></tree-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const route = useRoute()
console.log(route);

</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
}
</style>
