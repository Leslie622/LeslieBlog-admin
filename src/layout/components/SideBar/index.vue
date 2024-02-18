<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <img src="@/assets/image/logoFont.png" alt="" :class="[commonStore.isMenuCollapse ? 'small' : 'big']" />
    </div>
    <Menu></Menu>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/modules/common'
const commonStore = useCommonStore()
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .sidebar__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    font-size: 20px;
    color: red;
    background-image: $backImgDark;
    img {
      transition: all 0.5s;
      &.big {
        height: 45%;
      }
      &.small {
        height: 30%;
      }
    }
  }
}
</style>
