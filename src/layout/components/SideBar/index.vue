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
    border-bottom: 1px solid rgb(47, 47, 47);
    background-image: $backImgDark;
    img {
      transition: all 0.25s;
      &.big {
        height: 50%;
      }
      &.small {
        height: 30%;
      }
    }
  }
}
</style>
