<template>
  <custom-table :data="visitorList" @page-change="pageChangeHandler" :total="visitorTotal" :page-size="visitorListConfig.pageSize">
    <template v-slot:tableContent>
      <el-table-column label="IP" prop="ip" />
      <el-table-column label="省份" prop="location.province" />
      <el-table-column label="城市" prop="location.city" />
      <el-table-column label="操作系统" prop="system" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="访问次数" prop="visitTimes" />
      <el-table-column label="首次访问时间" prop="createdAt" />
      <el-table-column label="最近访问时间" prop="updatedAt" />
      <el-table-column label="访问间隔">
        <template #default="scope">
          <el-tag v-if="calcTimeDiff(scope.row.createdAt, scope.row.updatedAt) > 60000" type="warning" size="small" class="tag">
            {{ getTimeString(calcTimeDiff(scope.row.createdAt, scope.row.updatedAt)) }}
          </el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
    </template>
  </custom-table>
</template>

<script setup lang="ts">
import apiVisitor from '@/api/modules/visitor'
const visitorList = ref<Visitor.info[]>()
//游客列表配置：分页
const visitorListConfig = reactive<Visitor.visitorListConfigData>({
  pageNum: 1,
  pageSize: 14,
  sortArr: [{ field: 'updatedAt', order: -1 }]
})
const visitorTotal = ref<number>() //游客总数

onMounted(() => {
  getVisitorList()
})

/* 获取游客列表 */
async function getVisitorList() {
  const res = await apiVisitor.getVisitorList(visitorListConfig)
  visitorList.value = res.data.visitorList
  visitorTotal.value = res.data.total
}

/* 分页改变处理函数 */
function pageChangeHandler(pageNum: number) {
  visitorListConfig.pageNum = pageNum
  getVisitorList()
}

/* 时间间隔计算 */
function calcTimeDiff(startTime: string, endTime: string) {
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)
  const diffTime = endDate.getTime() - startDate.getTime()
  return diffTime
}

/* 获取时间间隔字符串 */
function getTimeString(timeDiff: number) {
  const timeUnits = [
    { unit: '天', duration: 24 * 60 * 60 * 1000 },
    { unit: '小时', duration: 60 * 60 * 1000 },
    { unit: '分钟', duration: 60 * 1000 }
  ]
  let timeString = ''
  for (const unit of timeUnits) {
    const value = Math.floor(timeDiff / unit.duration)
    if (value > 0) {
      timeString += `${value}${unit.unit} `
      timeDiff %= unit.duration
    }
  }

  return timeString || '0秒'
}
</script>

<style lang="scss" scoped></style>
