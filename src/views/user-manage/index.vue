<template>
  <h2>获取角色信息</h2>
  账号：{{ account }} token:{{ token }}
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const { account, token } = storeToRefs(userStore)
</script>

<style lang="scss" scoped></style>
