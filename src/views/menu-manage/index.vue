<template>
  <el-button type="primary" @click="createMenuHandler({ menuType: 0, id: 0 })">新增菜单</el-button>
  <el-button type="primary" @click="createMenuHandler({ menuType: 1, id: 0 })">新增路由</el-button>
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
    <el-table-column label="Operations">
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
  >
    <el-form :model="menuForm" label-width="120px">
      <el-form-item :label="menuTypeMap[menuForm.menuType] + '名称'">
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
        <el-form-item :label="menuTypeMap[menuForm.menuType] + '路径'">
          <el-input v-model="menuForm.path" />
        </el-form-item>
        <el-form-item label="组件名">
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
      <span class="dialog-footer">
        <el-button @click="dialogCreateMenu = false">取消</el-button>
        <el-button type="primary" @click="MenuDialogData['submitEvent']">
          {{ MenuDialogData['submitName'] }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import apiMenu from '@/api/modules/menu'
import { Icon } from '@iconify/vue/dist/iconify.js'

const menuList = ref() //菜单列表
const dialogCreateMenu = ref(false) //弹框控制
//弹框数据
const MenuDialogData = reactive({
  submitName: '',
  submitEvent: null
})
//菜单类型字典
const menuTypeMap = {
  1: '菜单',
  2: '路由',
  3: '按钮'
}
const menuForm = reactive({
  //菜单表单
  parentId: 0, //父级菜单:默认为空
  menuType: 1, //表单类型:默认为菜单(1)
  menuName: '', //表单名称
  menuCode: '', //权限标识:默认为空
  path: '', //路径
  component: '', //组件
  icon: '' //图标
})
const menuId = ref() //临时存储菜单id

/* 获取菜单 */
function getMenuList() {
  apiMenu.getMenuList().then((res) => {
    console.log(res.data)

    menuList.value = res.data
  })
}
getMenuList()

/* 新增菜单处理函数 */
async function createMenuHandler(row) {
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
function createMenuSubmit() {
  apiMenu.createMenu(menuForm)
  //新增成功后关闭弹窗并重新获取菜单列表
  dialogCreateMenu.value = false
  getMenuList()
}

/* 编辑菜单处理函数 */
const editMenuHandler = (row) => {
  dialogCreateMenu.value = true
  //改变弹框数据
  MenuDialogData.submitName = '编辑'
  MenuDialogData.submitEvent = editMenuSubmit
  //将菜单内容赋值到menuForm
  for (const key in menuForm) {
    menuForm[key] = row[key]
  }
  //保存菜单id
  menuId.value = row.id
}

/* 编辑菜单 */
function editMenuSubmit() {
  apiMenu.editMenu({
    id: menuId.value,
    menuInfo: menuForm
  })
  //编辑成功后关闭弹窗并重新获取菜单列表
  dialogCreateMenu.value = false
  getMenuList()
}

/* 删除菜单处理函数 */
const deleteMenuHandler = (row) => {
  //获取该菜单和所有children的id
  apiMenu.deleteMenu({
    id: row.id
  })
  //删除成功后关闭弹窗并重新获取菜单列表
  dialogCreateMenu.value = false
  getMenuList()
}

/* 弹框关闭处理函数 */
function dialogCloseHandler() {
  //每次弹框关闭,重置menuForm数据
  for (let key in menuForm) {
    if (key === 'menuType') {
      menuForm[key] = 1
    } else {
      menuForm[key] = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
