<template>
  <div class="welcome__wrapper">
    <div class="welcome__content">
      <div class="illustration"></div>
      <div class="entrance">
        <div class="logo">
          <img src="@/assets/image/logoFont.png" alt="" />
        </div>
        <div class="entrance__content">
          <Transition name="fade" mode="out-in">
            <component :is="activeComponent" @go-to-login="activeComponent = UserLogin"></component>
          </Transition>
        </div>
        <div class="action">
          <div class="register__btn" v-if="activeComponent === UserRegister" @click="activeComponent = UserLogin">
            <span>去登录</span>
            <Icon icon="material-symbols:keyboard-double-arrow-right-rounded" width="18px" class="icon"></Icon>
          </div>
          <div class="register__btn" v-if="activeComponent === UserLogin" @click="activeComponent = UserRegister">
            <span>去注册</span>
            <Icon icon="material-symbols:keyboard-double-arrow-right-rounded" width="18px" class="icon"></Icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserLogin from './UserLogin/index.vue'
import UserRegister from './UserRegister/index.vue'

const activeComponent: any = shallowRef(UserLogin)
</script>

<style lang="scss" scoped>
.welcome__wrapper {
  display: grid;
  place-items: center;
  height: 100%;
  background-image: $backImgEcailles;
  user-select: none;

  .welcome__content {
    display: flex;
    width: 750px;
    height: 463px;
    border-radius: 10px;
    overflow: hidden;
    background-color: white;
    box-shadow:
      rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

    .entrance {
      z-index: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 5px 10px;
      background-image: $backImgLight;

      .logo {
        display: flex;
        align-items: center;
        justify-content: end;
        height: 20px;

        img {
          height: 80%;
          opacity: 0.15;
        }
      }

      .entrance__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 70px 20px 0px;
        div {
          width: 100%;
        }
      }

      .action {
        height: 30px;
        display: flex;
        justify-content: end;

        .register__btn {
          display: flex;
          align-items: center;
          transition: all 0.3s;
          cursor: pointer;
          color: #857f7f;

          span {
            position: relative;
            bottom: -1px;
          }
          &:hover {
            color: black;
          }
        }
      }
    }

    .illustration {
      position: relative;
      z-index: 100;
      flex: 1;
      background-image: url('@/assets/image/illustration.png');
      background-size: cover;
      box-shadow:
        rgba(17, 17, 26, 0.05) 0px 1px 0px,
        rgba(17, 17, 26, 0.1) 0px 0px 8px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
