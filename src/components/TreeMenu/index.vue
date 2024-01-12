<template>
  <template v-for="menu in props.menuList">
    <!-- 菜单类型是1,渲染成sub-menu -->
    <el-sub-menu :index="menu.path" v-if="menu.menuType === 1">
      <template #title>
        <span>{{ menu.menuName }}</span>
      </template>
      <!-- 递归渲染 -->
      <tree-menu :menuList="menu.children"></tree-menu>
    </el-sub-menu>
    <!-- 菜单类型是2,渲染成menu-item -->
    <el-menu-item :index="menu.path" v-else-if="menu.menuType === 2">
      <template #title>
        <!-- <el-icon v-if="menu.icon">
          <component :is="menu.icon"></component>
        </el-icon> -->
        <span>{{ menu.menuName }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import TreeMenu from '@/components/TreeMenu/index.vue'

const props = defineProps(['menuList'])
console.log(props.menuList);

</script>

<style lang="scss" scoped></style>
