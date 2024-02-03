<template>
  <div class="wrapper">
    <el-table
      ref="tableRef"
      :data="blogList"
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
      <el-table-column label="标题" prop="title" />
      <el-table-column label="所属分类" prop="category">
        <template #header>
          <el-select
            v-model="blogListConfig.category"
            style="width: 150px"
            size="small"
            placeholder="选择分类进行筛选"
            @change="findByCategory"
          >
            <el-option label="所有" value=""></el-option>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" prop="views" sortable="custom" />
      <el-table-column label="发布时间" prop="createTime" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="是否置顶" prop="isSticky" width="120px" sortable="custom">
        <template #default="scope">
          <el-tag v-if="scope.row.isSticky" type="danger" size="small" class="tag">置顶</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="是否原创" prop="isOriginal" width="120px" sortable="custom">
        <template #default="scope">
          <el-tag v-if="scope.row.isOriginal" type="warning" size="small" class="tag">
            原创
          </el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="blogEditHandler(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm title="确定要删除该博客吗？" @confirm="blogDeleteHandler(scope.row)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="blogListConfig.pageSize"
        :total="blogTotal"
        v-model:current-page="blogListConfig.pageNum"
        @update:current-page="findByPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import apiBlog from '@/api/modules/blog'
import apiBlogCategory from '@/api/modules/blogCategory'
import type { CellCls } from 'element-plus'

type blogListConfigData = {
  pageNum: number //页码
  pageSize: number //每页个数
  category: string //分类id，默认空为所有
  //排序数组
  sortArr: Array<{ field: string; order: number }>
}
const router = useRouter()
const categoryList = ref<BlogCategory.listResData>([]) //博客分类列表
const blogList = ref<Blog.blogInfo[]>() //博客列表
//博客列表配置：排序，分页等
const blogListConfig = reactive<blogListConfigData>({
  pageNum: 1,
  pageSize: 14,
  category: '',
  sortArr: []
})
//排序字段存储
const sortField = new Map<string, any>()
//博客总数量存储，控制分页，默认一页
const blogTotal = ref(blogListConfig.pageSize)

onBeforeMount(() => {
  getBlogCategoryList()
  getBlogList()
})

/* 获取博客分类列表 */
async function getBlogCategoryList() {
  const res = await apiBlogCategory.getList()
  categoryList.value = res.data
}

/* 获取博客列表 */
async function getBlogList() {
  const res = await apiBlog.getList(blogListConfig)
  blogList.value = res.data.blogList
  blogTotal.value = res.data.total
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
  blogListConfig.sortArr = sortArr
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
  getBlogList()
}

/* 保留table-column排序样式 */
function setHeaderClass(params: any) {
  if (sortField.has(params.column.property)) {
    params.column.order = sortField.get(params.column.property)
  }
}

/* 按照分类查询 */
function findByCategory(value: string) {
  console.log(value)
  blogListConfig.category = value
  getBlogList()
}

/* 按照分页查询 */
function findByPage() {
  getBlogList()
}

/* 删除博客处理函数 */
async function blogDeleteHandler(row: Blog.blogInfo) {
  await apiBlog.delete({
    id: row.id
  })
  getBlogList()
}

/* 编辑博客处理函数 */
function blogEditHandler(row: Blog.blogInfo) {
  //跳转到写博客页面，携带博客id
  router.push({ path: '/blog/write', query: { blogId: row.id } })
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  .action {
    display: flex;
    gap: 20px;
    padding: 8px 20px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  }
  .table {
    flex: 1;
    overflow: auto;
    // :deep(.el-scrollbar__view) {
    //   height: 100%;
    // }
    // :deep(.el-table__body) {
    //   height: 100%;
    // }
  }
  .pagination {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.tag {
  margin-right: 5px;
}
</style>
