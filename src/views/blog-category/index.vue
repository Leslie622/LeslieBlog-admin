<template>
  <custom-table :data="categoryList">
    <template v-slot:action>
      <el-button type="primary" @click="createCategoryHandler">新增分类</el-button>
    </template>
    <template v-slot:tableContent>
      <el-table-column label="分类名称" prop="name" />
      <el-table-column label="博客数量" prop="count" />
      <el-table-column label="分类介绍" prop="introduce" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editCategoryHandler(scope.row)"> 编辑 </el-button>
          <el-popconfirm title="确定要删除该分类吗？" @confirm="deleteCategorySubmit(scope.row)">
            <template #reference>
              <el-button size="small" type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </custom-table>

  <el-dialog v-model="dialogFormVisible" @closed="dialogCloseHandler" :title="categoryDialogData['title']" :align-center="true" width="40%">
    <div>
      <el-form :model="categoryForm" :rules="rules" ref="categoryFormRef" label-width="auto">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="分类介绍" prop="introduce">
          <el-input v-model="categoryForm.introduce" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="categoryDialogData['submitEvent'](categoryFormRef)">{{ categoryDialogData['submitName'] }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import apiBlogCategory from '@/api/modules/blogCategory'
import type { FormInstance, FormRules } from 'element-plus'

const categoryList = ref<BlogCategory.listResData>() //分类列表
const dialogFormVisible = ref(false) //弹框控制
const categoryFormRef = ref<FormInstance>() //表单ref
//弹框数据
const categoryDialogData = reactive<{
  title: string
  submitName: string
  submitEvent: Function
}>({
  title: '',
  submitName: '',
  submitEvent: () => {}
})
//分类表单
const categoryForm = reactive<BlogCategory.info>({
  id: '',
  name: '',
  introduce: '',
  count: 0
})
//表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
})

onBeforeMount(() => {
  getCategoryList()
})

onActivated(() => {
  getCategoryList()
})

/* 获取分类列表 */
const getCategoryList = async () => {
  const res = await apiBlogCategory.getList()
  categoryList.value = res.data
}

/* 新增博客分类处理函数 */
function createCategoryHandler() {
  dialogFormVisible.value = true
  //改变弹框数据
  categoryDialogData.title = '新增博客分类'
  categoryDialogData.submitName = '新增'
  categoryDialogData.submitEvent = createCategorySubmit
}

/* 新增分类 */
async function createCategorySubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //表单验证通过
      await apiBlogCategory.create({
        name: categoryForm.name,
        introduce: categoryForm.introduce
      })
      ElMessage.success('新增成功')
      dialogFormVisible.value = false
      getCategoryList()
    }
  })
}

/* 编辑分类处理函数 */
function editCategoryHandler(row: BlogCategory.info) {
  dialogFormVisible.value = true
  //改变弹框数据
  categoryDialogData.title = '编辑博客分类'
  categoryDialogData.submitName = '编辑'
  categoryDialogData.submitEvent = editCategorySubmit
  //赋值
  nextTick(() => {
    categoryForm.id = row.id
    categoryForm.name = row.name
    categoryForm.introduce = row.introduce
  })
}

/* 编辑分类 */
async function editCategorySubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await apiBlogCategory.edit({
        id: categoryForm.id,
        name: categoryForm.name,
        introduce: categoryForm.introduce
      })
      ElMessage.success('编辑成功')
      dialogFormVisible.value = false
      getCategoryList()
    }
  })
}

/* 删除分类 */
async function deleteCategorySubmit(row: BlogCategory.info) {
  await apiBlogCategory.delete({ id: row.id })
  ElMessage.success('删除成功')
  dialogFormVisible.value = false
  getCategoryList()
}

/* 弹框关闭处理函数 */
function dialogCloseHandler() {
  //每次弹框关闭,重置表单数据
  categoryForm.name = ''
  categoryForm.introduce = ''
}
</script>

<style lang="scss" scoped></style>
