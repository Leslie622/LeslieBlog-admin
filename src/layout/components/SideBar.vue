<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="/"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-menu-item index="/">
      <span>主页</span>
    </el-menu-item>
    <el-menu-item index="/system/userManage">
      <span>用户</span>
    </el-menu-item>
    <el-menu-item index="/system/menuManage">
      <span>菜单</span>
    </el-menu-item>
    <el-menu-item index="/system/roleManage">
      <span>角色</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
const handleOpen = (key: string, keyPath: string[]) => {
}
const handleClose = (key: string, keyPath: string[]) => {
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
}
</style>
