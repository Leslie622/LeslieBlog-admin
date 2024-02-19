<template>
  <el-input placeholder="按博客标题搜索" class="input" ref="input" @change="searchHandler">
    <template v-slot:suffix>
      <div class="Icon__wrapper">
        <Icon icon="tabler:search" width="15px"></Icon>
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
const input = ref()
const emit = defineEmits(['search'])

function searchHandler() {
  emit('search')
}
</script>

<style lang="scss" scoped>
.input {
  :deep(.el-input__wrapper) {
    overflow: hidden;
    padding-right: 0;
  }
}
.Icon__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  border-left: 1px solid rgb(220, 223, 230);
  cursor: pointer;

  &:hover {
    background-color: rgba(216, 216, 216, 0.2);
  }
}
</style>
