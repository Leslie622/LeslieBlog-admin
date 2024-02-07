<template>
  <template v-for="menu in props.menuList">
    <!-- 菜单类型是1,渲染成sub-menu -->
    <el-sub-menu :index="menu.path" v-if="menu.menuType === 1" popper-class="popper" :key="menu.menuName">
      <template #title>
        <el-icon v-if="menu.icon">
          <Icon :icon="menu.icon"></Icon>
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <!-- 递归渲染 -->
      <menu-tree :menuList="menu.children"></menu-tree>
    </el-sub-menu>
    <!-- 菜单类型是2,渲染成menu-item -->
    <el-menu-item :index="menu.path" v-else-if="menu.menuType === 2" :key="menu.path">
      <template #title>
        <el-icon v-if="menu.icon">
          <Icon :icon="menu.icon"></Icon>
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{
  menuList: Menu.menuListResData
}>()
</script>

<style lang="scss" scoped>
//覆盖element:menu部分样式
.el-sub-menu {
  --el-menu-item-height: 40px;
  --el-menu-item-font-size: 10px;
  .el-menu-item {
    margin: 5px 8px;
    border-radius: 5px;
    --el-menu-sub-item-height: 35px;
    &.is-active {
      color: #343a40;
      background-color: rgba(255, 255, 255, 0.9);
    }
    &:hover:not(.is-active) {
      color: #ffffff;
    }
  }
}

.popper {
  .el-menu-item {
    height: 35px;
    margin: 5px 8px;
    border-radius: 5px;
    color: #c2c7d0;
    &.is-active {
      color: #343a40;
      background-color: rgba(255, 255, 255, 0.9);
    }
    &:hover:not(.is-active) {
      color: #343a40;
    }
  }
}
</style>
<style lang="scss">
.popper {
  .el-menu--popup {
    background-image: $backImgDark;
    min-width: 0px;
  }
}
</style>
