<template>
  <div class="tabs">
    <el-tabs type="border-card" v-model="activeName" class="tabs__content" @tab-click="handleClick">
      <el-tab-pane label="登录" name="login">
        <user-login></user-login>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <user-register @change-tab="activeName = 'login'"></user-register>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import UserLogin from '@/components/UserLogin/index.vue'
import UserRegister from '@/components/UserRegister/index.vue'
const activeName = ref('login')

const handleClick = (tab: TabsPaneContext, event: Event) => {}


</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .tabs__content {
    width: 600px;
    height: 300px;

    :deep(.el-tabs__content) {
      padding: 0;
      height: calc(100% - 40px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
