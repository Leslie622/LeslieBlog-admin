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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.layout__header {
  height: 60px;
  padding: 0;
}

.layout__main {
  padding: 10px;
}

.layout__aside {
  box-shadow:
    0 7px 14px rgba(0, 0, 0, 0.25),
    0 5px 5px rgba(0, 0, 0, 0.22);
  width: auto;
}
</style>
