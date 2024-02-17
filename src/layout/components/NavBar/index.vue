<template>
  <div class="navbar">
    <div class="navbar__menu-control" @click="commonStore.controlMenuCollapse()">
      <Icon icon="ant-design:menu-fold-outlined" width="20px" v-if="commonStore.isMenuCollapse"></Icon>
      <Icon icon="ant-design:menu-unfold-outlined" width="20px" v-else></Icon>
    </div>
    <div class="navbar__breadcrumb">
      <bread-crumb></bread-crumb>
    </div>
    <div class="navbar__action">
      <div class="action__user">
        <user-info></user-info>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/modules/common'
import { Icon } from '@iconify/vue/dist/iconify.js'

const commonStore = useCommonStore()
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 100%;
}

.navbar__menu-control {
  display: grid;
  place-content: center;
  width: 30px;
  cursor: pointer;
}

.navbar__breadcrumb {
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex: 1;
}

.navbar__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}
</style>
