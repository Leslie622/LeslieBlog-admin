<template>
  <div class="tabs">
    <el-tabs type="border-card" v-model="activeName" class="tabs__content">
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
const activeName = ref('login')
import UserLogin from './UserLogin/index.vue'
import UserRegister from './UserRegister/index.vue'
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("../../assets/image/brillant.png");
  

  .tabs__content {
    width: 500px;
    height: 300px;
    border-radius: 5px;
    overflow: hidden;
   
    :deep(.el-tabs__content) {
      padding: 0;
      box-sizing: content-box;
      height: calc(100% - 40px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
