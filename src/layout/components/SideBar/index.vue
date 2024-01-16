<template>
  <div class="sidebar">
    <div class="sidebar__logo">Logo</div>
    <Menu class="sidebar__menu"></Menu>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .sidebar__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    font-size: 20px;
    color: red;
    background-color: #343a40;
  }
}
</style>
