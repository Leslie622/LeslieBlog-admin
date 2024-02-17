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
        <nav-tab></nav-tab>
        <div class="main__router-view">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  user-select: none;
}

.layout__header {
  background-image: $backImgLight;
  height: 50px;
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
}

.layout__main {
  display: flex;
  flex-direction: column;
  padding: 0;

  .main__router-view {
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
}

.layout__aside {
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.25),
    0 3px 3px rgba(0, 0, 0, 0.22);
  width: auto;
}
</style>
