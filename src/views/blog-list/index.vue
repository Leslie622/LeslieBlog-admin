<template>
  <custom-table @page-change="pageChangeHandler" @sort-change="sortChangeHandler" :tableData="blogList" :total="blogTotal" :page-size="blogListConfig.pageSize">
    <template v-slot:action>
      <div class="select">
        <el-input v-model="blogListConfig.searchKeyword" @change="getBlogList()" placeholder="按博客标题搜索">
          <template v-slot:suffix>
            <Icon icon="material-symbols:search-rounded"></Icon>
          </template>
        </el-input>
      </div>
    </template>
    <template v-slot:tableContent>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="所属分类" prop="category">
        <template #header>
          <el-select v-model="blogListConfig.category" style="width: 140px" size="small" placeholder="选择分类进行筛选" @change="findByCategory">
            <el-option label="所有" value=""></el-option>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-tag v-if="scope.row.isOriginal" type="warning" size="small" class="tag"> 原创 </el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="draft" width="120px">
        <template #default="scope">
          <el-tag v-if="scope.row.draft != ''" type="warning" size="small" class="tag"> 草稿 </el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="blogEditHandler(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除该博客吗？" @confirm="blogDeleteHandler(scope.row)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </custom-table>
</template>

<script setup lang="ts">
import apiBlog from '@/api/modules/blog'
import apiBlogCategory from '@/api/modules/blogCategory'

const router = useRouter()
const categoryList = ref<BlogCategory.listResData>([]) //博客分类列表
const blogList = ref<Blog.blogInfo[]>() //博客列表
//博客列表配置：排序，分页，分类等
const blogListConfig = reactive<Blog.blogListConfigData>({
  pageNum: 1,
  pageSize: 20,
  category: '',
  searchKeyword: '',
  sortArr: []
})
//博客总数量存储，控制分页，默认一页
const blogTotal = ref(blogListConfig.pageSize)

onBeforeMount(() => {
  getBlogCategoryList()
  getBlogList()
})

onActivated(() => {
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

/* 编辑博客处理函数 */
function blogEditHandler(row: Blog.blogInfo) {
  //跳转到写博客页面，携带博客id
  router.push({ path: '/blog/write', query: { blogId: row.id } })
}

/* 删除博客处理函数 */
async function blogDeleteHandler(row: Blog.blogInfo) {
  await apiBlog.delete({
    id: row.id
  })
  ElMessage.success('删除成功')
  getBlogList()
}

/* 按照分类查询 */
function findByCategory(value: string) {
  blogListConfig.category = value
  getBlogList()
}

/* 分页改变处理函数 */
function pageChangeHandler(pageNum: number) {
  blogListConfig.pageNum = pageNum
  getBlogList()
}

/* 排序改变处理函数 */
function sortChangeHandler(sortArr: any) {
  blogListConfig.sortArr = sortArr
  getBlogList()
}
</script>

<style lang="scss" scoped></style>
