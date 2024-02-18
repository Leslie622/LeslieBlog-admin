<!-- 该组件内置了表格的分页，排序功能 -->
<template>
  <div class="table__wrapper">
    <div class="table__action">
      <slot name="action"></slot>
    </div>
    <div class="table__content">
      <el-table
        style="height: 100%"
        :data="tableData"
        stripe
        border
        @sort-change="sortChangeHandler"
        :header-cell-class-name="
          ((params: any) => {
            setHeaderClass(params)
          }) as CellCls<any>
        "
        class="table"
      >
        <slot name="tableContent"></slot>
      </el-table>
    </div>
    <div class="table__footer">
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" v-model:current-page="pageNum" @update:current-page="pageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CellCls } from 'element-plus'

const pageNum = ref(1) //页码
const sortField = new Map<string, any>() //排序字段存储

interface Props {
  pageSize: number
  total: number
  tableData: any[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  total: 0,
  tableData: () => []
})

const emit = defineEmits<{
  pageChange: [pageNum: number]
  sortChange: [
    sortArr: {
      field: string
      order: number
    }[]
  ]
}>()

/* 监听页码改变 */
function pageChange() {
  emit('pageChange', pageNum.value)
}

/* 排序处理函数 */
const sortChangeHandler = (params: any) => {
  const hasprop = sortField.has(params.prop)
  if (hasprop == true && params.order == null) {
    sortField.delete(params.prop)
  } else {
    sortField.set(params.prop, params.order)
  }
  updateOrderBy()
}

/* 更新排序数组 */
function updateOrderBy() {
  let sortArr = []
  for (const [key, value] of sortField) {
    sortArr.push({
      field: key,
      order: value === 'ascending' ? 1 : -1
    })
  }
  emit('sortChange', sortArr)
}

/* 保留table-column排序样式 */
function setHeaderClass(params: any) {
  if (sortField.has(params.column.property)) {
    params.column.order = sortField.get(params.column.property)
  }
}
</script>

<style lang="scss" scoped>
.table__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-image: $backImgLight;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;

  .table__action {
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .table__content {
    flex: 1;
    padding: 10px 0px;
    overflow: auto;
  }
  .table__footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
