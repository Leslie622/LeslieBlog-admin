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
            <el-button size="small" type="danger"> 删除 </el-button>
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
  >
    <el-form :model="roleForm" :key="Math.random()">
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="roleDialogData['submitEvent']"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import apiMenu from '@/api/modules/menu'
import apiRole from '@/api/modules/role'
const menuList = ref() //菜单列表
const roleList = ref() //角色列表
const dialogFormVisible = ref(false)
const treeRef = ref()
const roleId = ref()

const roleDialogData = reactive({
  //弹框数据
  title: '',
  submitName: '',
  submitEvent: null
})

const roleForm = reactive({
  roleName: '',
  permissionList: [],
  menuList: [],
  isDefault: false
})

const defaultProps = {
  children: 'children',
  label: 'menuName'
}

/* 获取菜单 */
async function getMenuList() {
  const res = await apiMenu.getMenuList()
  menuList.value = res.data
}
getMenuList()

/* 获取角色列表 */
async function getRoleList() {
  const res = await apiRole.getRoleList()
  roleList.value = res.data
}
getRoleList()

/* 新增角色处理函数 */
function createRoleHandler() {
  dialogFormVisible.value = true
  //改变弹框数据
  roleDialogData.title = '新增角色'
  roleDialogData.submitName = '新增'
  roleDialogData.submitEvent = createRoleSubmit
}

/* 获取权限节点的id */
function generatePermissionList() {
  const checkedNodes = treeRef.value.getCheckedNodes()
  const halfCheckedNodes = treeRef.value.getHalfCheckedNodes()
  const checkedMenuList = [...checkedNodes, ...halfCheckedNodes]
  const permissionList = []
  const menuList = []
  checkedMenuList.forEach((menu) => {
    if (menu.menuType === 3) {
      permissionList.push(menu.id)
    }
    menuList.push(menu.id)
  })
  return { permissionList, menuList }
}

/* 新增角色 */
async function createRoleSubmit() {
  const { permissionList, menuList } = generatePermissionList()
  roleForm.permissionList = permissionList
  roleForm.menuList = menuList
  //新增角色
  await apiRole.createRole(roleForm)
  //新增完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 编辑角色处理函数 */
function editRoleHandler(row) {
  dialogFormVisible.value = true
  //改变弹框数据
  roleDialogData.title = '编辑角色'
  roleDialogData.submitName = '编辑'
  roleDialogData.submitEvent = editRoleSubmit
  //赋值
  nextTick(() => {
    roleForm.roleName = row.roleName
    roleForm.isDefault = row.isDefault
    roleId.value = row._id
    treeRef.value.setCheckedKeys(row.permissionList)
  })
}

/* 编辑角色 */
async function editRoleSubmit() {
  const { permissionList, menuList } = generatePermissionList()
  roleForm.permissionList = permissionList
  roleForm.menuList = menuList
  //编辑角色
  await apiRole.editRole({ id: roleId.value, roleInfo: roleForm })
  //编辑完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 删除角色 */
async function deleteRoleSubmit(row) {
  const roleId = row._id
  await apiRole.deleteRole({ id: roleId })
  //删除完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 设置默认角色 */
async function setDafaultRole(row) {
  await apiRole.editRole({ id: row._id, roleInfo: { isDefault: true } })
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
