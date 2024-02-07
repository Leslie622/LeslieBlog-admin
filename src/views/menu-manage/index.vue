<template>
  <el-button
    type="primary"
    @click="createMenuHandler({ ...menuForm, menuType: 0, id: '', children: [] })"
    >新增菜单</el-button
  >
  <el-button
    type="primary"
    @click="createMenuHandler({ ...menuForm, menuType: 1, id: '', children: [] })"
    >新增路由</el-button
  >
  <!-- 菜单列表 -->
  <el-table :data="menuList" row-key="id" stripe>
    <el-table-column prop="menuName" label="名称" />
    <el-table-column prop="menuType" label="类型">
      <template v-slot="{ row }">
        <span>{{ menuTypeMap[row.menuType] }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="menuCode" label="权限标识" />
    <el-table-column prop="path" label="路径" />
    <el-table-column prop="component" label="组件名" />
    <el-table-column prop="icon" label="图标">
      <template #default="scope">
        <Icon :icon="scope.row.icon" width="20px" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="230" fixed="right">
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          @click="createMenuHandler(scope.row)"
          v-if="scope.row.menuType !== 3"
          >{{ '新增' + menuTypeMap[scope.row.menuType + 1] }}</el-button
        >
        <el-button size="small" @click="editMenuHandler(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除吗？" @confirm="deleteMenuHandler(scope.row)">
          <template #reference>
            <el-button size="small" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 新增菜单弹框 -->
  <el-dialog
    v-model="dialogCreateMenu"
    :title="'新增' + menuTypeMap[menuForm.menuType]"
    @closed="dialogCloseHandler"
    :align-center="true"
    width="500px"
  >
    <el-form
      :model="menuForm"
      :rules="rules"
      ref="menuFormRef"
      label-width="auto"
      :key="Math.random()"
    >
      <el-form-item :label="menuTypeMap[menuForm.menuType] + '名称'" prop="menuName">
        <el-input v-model="menuForm.menuName" />
      </el-form-item>
      <!-- 新增菜单时展示 -->
      <template v-if="menuForm.menuType === 1">
        <el-form-item :label="menuTypeMap[menuForm.menuType] + '路径'">
          <el-input v-model="menuForm.path" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menuForm.icon" />
        </el-form-item>
      </template>
      <!-- 新增路由时展示 -->
      <template v-else-if="menuForm.menuType === 2">
        <el-form-item :label="menuTypeMap[menuForm.menuType] + '路径'" prop="path">
          <el-input v-model="menuForm.path" />
        </el-form-item>
        <el-form-item label="组件名" prop="component">
          <el-input v-model="menuForm.component" />
        </el-form-item>
      </template>
      <!-- 新增按钮时展示 -->
      <template v-else-if="menuForm.menuType === 3">
        <el-form-item label="权限标识">
          <el-input v-model="menuForm.menuCode" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="dialogCreateMenu = false">取消</el-button>
        <el-button type="primary" @click="MenuDialogData['submitEvent'](menuFormRef)">
          {{ MenuDialogData['submitName'] }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import apiMenu from '@/api/modules/menu'
import type { FormInstance, FormRules } from 'element-plus'

const menuList = ref<Menu.menuListResData>() //菜单列表
const dialogCreateMenu = ref(false) //弹框控制
const menuFormRef = ref<FormInstance>() //表单ref
//弹框数据
const MenuDialogData = reactive<{
  submitName: string
  submitEvent: Function
}>({
  submitName: '',
  submitEvent: () => {}
})
//菜单类型字典
enum menuTypeMap {
  '菜单' = 1,
  '路由' = 2,
  '按钮' = 3
}
const menuForm = reactive<Menu.menuInfo>({
  //菜单表单
  id: '',
  parentId: '', //父级菜单:默认为空
  menuType: 1, //表单类型:默认为菜单(1)
  menuName: '', //表单名称
  menuCode: '', //权限标识:默认为空
  path: '', //路径
  component: '', //组件
  icon: '' //图标
})
//表单验证规则
const rules = reactive<FormRules<Menu.menuInfo>>({
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件名', trigger: 'blur' }]
})

onBeforeMount(() => {
  getMenuList()
})

/* 获取菜单 */
async function getMenuList() {
  const res = await apiMenu.getMenuList()
  menuList.value = res.data
}

/* 新增菜单“子项”处理函数 */
async function createMenuHandler(row: Menu.menuResData) {
  dialogCreateMenu.value = true
  //改变弹框数据
  MenuDialogData.submitName = '新增'
  MenuDialogData.submitEvent = createMenuSubmit
  //根据menuType渲染相应的表单内容
  menuForm.menuType = row.menuType + 1
  //指定父级菜单
  menuForm.parentId = row.id
}

/* 新增菜单 */
async function createMenuSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //表单验证通过
      await apiMenu.createMenu(menuForm)
      ElMessage.success("新增成功")
      dialogCreateMenu.value = false
      getMenuList()
    }
  })
}

/* 编辑菜单处理函数 */
const editMenuHandler = (row: Menu.menuResData) => {
  dialogCreateMenu.value = true
  //改变弹框数据
  MenuDialogData.submitName = '编辑'
  MenuDialogData.submitEvent = editMenuSubmit
  //将菜单内容赋值到menuForm
  const { children, ...menuInfo } = row
  Object.assign(menuForm, menuInfo)
}

/* 编辑菜单 */
async function editMenuSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //表单验证通过
      await apiMenu.editMenu(menuForm)
      ElMessage.success("编辑成功")
      dialogCreateMenu.value = false
      getMenuList()
    }
  })
}

/* 删除菜单处理函数 */
const deleteMenuHandler = async (row: Menu.menuResData) => {
  //获取该菜单和所有children的id
  await apiMenu.deleteMenu({
    id: row.id
  })
  ElMessage.success("删除成功")
  dialogCreateMenu.value = false
  getMenuList()
}

/* 弹框关闭处理函数 */
function dialogCloseHandler() {
  //每次弹框关闭,重置menuForm数据
  let key: keyof Menu.menuInfo
  for (key in menuForm) {
    if (key === 'menuType') {
      menuForm[key] = 1
    } else {
      menuForm[key] = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
