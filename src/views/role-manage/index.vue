<template>
  <el-button type="primary" @click="createRoleHandler">新增角色</el-button>
  <!-- 角色列表 -->
  <el-table :data="roleList" style="width: 100%">
    <el-table-column label="角色名称" prop="roleName" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editRoleHandler(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除该角色吗？" @confirm="deleteRoleSubmit(scope.row)">
          <template #reference>
            <el-button size="small" type="danger" :disabled="scope.row.isDefault === true">
              删除
            </el-button>
          </template>
        </el-popconfirm>
        <el-button size="small" @click="setDafaultRole(scope.row)" v-if="!scope.row.isDefault"
          >设置为默认角色</el-button
        >
        <el-button size="small" disabled v-else>默认角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogFormVisible"
    @closed="dialogCloseHandler"
    :title="roleDialogData['title']"
    width="40%"
  >
    <el-form :model="roleForm" :rules="rules" :key="Math.random()" ref="roleFormRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" />
      </el-form-item>
      <el-form-item label="权限设置" prop="permissionList">
        <el-tree
          ref="treeRef"
          :data="menuList"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="roleDialogData['submitEvent'](roleFormRef)">{{
          roleDialogData['submitName']
        }}</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import apiMenu from '@/api/modules/menu'
import role from '@/api/modules/role'
import apiRole from '@/api/modules/role'
import type { FormInstance, FormRules } from 'element-plus'

const menuList = ref() //菜单列表
const roleList = ref<Role.roleListResData>() //角色列表
const dialogFormVisible = ref(false) //弹框控制
const treeRef = ref() //树形组件ref
const roleFormRef = ref<FormInstance>() //表单ref
//树形控件数据
const defaultProps = {
  children: 'children',
  label: 'menuName'
}
//弹框数据
const roleDialogData = reactive<{
  title: string
  submitName: string
  submitEvent: Function
}>({
  title: '',
  submitName: '',
  submitEvent: () => {}
})
//角色表单
const roleForm = reactive<Role.RoleInfo>({
  id: '',
  roleName: '',
  permissionList: [],
  menuList: [],
  isDefault: false
})
//表单验证规则
const rules = reactive<FormRules>({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
})

onBeforeMount(() => {
  getMenuList()
  getRoleList()
})

/* 获取菜单 */
async function getMenuList() {
  const res = await apiMenu.getMenuList()
  menuList.value = res.data
}

/* 获取角色列表 */
const getRoleList = async () => {
  const res = await apiRole.getRoleList()
  roleList.value = res.data
}

/* 新增角色处理函数 */
function createRoleHandler() {
  dialogFormVisible.value = true
  //改变弹框数据
  roleDialogData.title = '新增角色'
  roleDialogData.submitName = '新增'
  roleDialogData.submitEvent = createRoleSubmit
}

/* 获取树形控件权限节点的id */
function generatePermissionList() {
  const checkedNodes = treeRef.value.getCheckedNodes()
  const halfCheckedNodes = treeRef.value.getHalfCheckedNodes()
  const checkedMenuList = [...checkedNodes, ...halfCheckedNodes]
  const permissionList: string[] = []
  const menuList: string[] = []
  checkedMenuList.forEach((menu) => {
    //将按钮id赋值给permission，菜单和路由id赋值给menu
    if (menu.menuType === 3) {
      permissionList.push(menu.id)
    }
    menuList.push(menu.id)
  })
  return { permissionList, menuList }
}

/* 新增角色 */
async function createRoleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //表单验证通过
      const { permissionList, menuList } = generatePermissionList()
      roleForm.permissionList = permissionList
      roleForm.menuList = menuList
      await apiRole.createRole({
        roleName: roleForm.roleName,
        permissionList: roleForm.permissionList,
        menuList: roleForm.menuList,
        isDefault: roleForm.isDefault
      })
      dialogFormVisible.value = false
      getRoleList()
    }
  })
}

/* 编辑角色处理函数 */
function editRoleHandler(row: Role.roleResData) {
  dialogFormVisible.value = true
  //改变弹框数据
  roleDialogData.title = '编辑角色'
  roleDialogData.submitName = '编辑'
  roleDialogData.submitEvent = editRoleSubmit
  //赋值
  nextTick(() => {
    roleForm.roleName = row.roleName
    roleForm.id = row.id
    //只需要给底层的（也就是按钮）全选中的树赋值即可
    treeRef.value.setCheckedKeys(row.permissionList)
  })
}

/* 编辑角色 */
async function editRoleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //表单验证通过
      const { permissionList, menuList } = generatePermissionList()
      roleForm.permissionList = permissionList
      roleForm.menuList = menuList
      await apiRole.editRole({
        id: roleForm.id,
        roleName: roleForm.roleName,
        permissionList: roleForm.permissionList,
        menuList: roleForm.menuList
      })
      //编辑完成后关闭弹窗并重新渲染角色列表
      dialogFormVisible.value = false
      getRoleList()
    }
  })
}

/* 删除角色 */
async function deleteRoleSubmit(row: Role.roleResData) {
  await apiRole.deleteRole({ id: row.id })
  //删除完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 设置默认角色 */
async function setDafaultRole(row: Role.roleResData) {
  await apiRole.editRole({ id: row.id, isDefault: true })
  //设置完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 弹框关闭处理函数 */
function dialogCloseHandler() {
  //每次弹框关闭,重置roleForm数据
  roleForm.roleName = ''
}
</script>

<style lang="scss" scoped></style>
