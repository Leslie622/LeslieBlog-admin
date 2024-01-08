<template>
  <el-container class="home">
    <!-- 侧边栏 -->
    <el-aside width="150px">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <!-- 导航头 -->
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <!-- 主内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
}
</style>
