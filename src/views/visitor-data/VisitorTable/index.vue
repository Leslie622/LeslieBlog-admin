<template>
  <custom-table :data="visitorList">
    <template v-slot:tableContent>
      <el-table-column label="IP" prop="ip" />
      <el-table-column label="省份" prop="location.province" />
      <el-table-column label="城市" prop="location.city" />
      <el-table-column label="操作系统" prop="system" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="访问次数" prop="visitTimes" />
      <el-table-column label="首次访问时间" prop="createdAt" />
      <el-table-column label="最近访问时间" prop="updatedAt" />
    </template>
  </custom-table>
</template>

<script setup lang="ts">
import apiVisitor from '@/api/modules/visitor'
const visitorList = ref<Visitor.info[]>()
//游客列表配置：分页
const visitorListConfig = reactive({
  pageNum: 1,
  pageSize: 10
})

onMounted(() => {
  getVisitorList()
})

/* 获取游客列表 */
async function getVisitorList() {
  const res = await apiVisitor.getVisitorList(visitorListConfig)
  visitorList.value = res.data.visitorList
}
</script>

<style lang="scss" scoped></style>
