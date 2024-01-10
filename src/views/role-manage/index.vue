<template>
  <el-button type="primary" @click="createRoleHandler">新增角色</el-button>
  <!-- 角色列表 -->
  <el-table :data="roleList" style="width: 100%">
    <el-table-column label="角色名称" prop="roleName" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editRoleHandler(scope.row)"
          >设置权限</el-button
        >
        <el-popconfirm title="确定要删除该角色吗？" @confirm="deleteRoleSubmit(scope.row)">
          <template #reference>
            <el-button size="small" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogFormVisible"
    @close="dialogCloseHandler"
    :title="roleDialogData['title']"
  >
    <el-form :model="roleForm">
      <el-form-item label="角色名称">
        <el-input v-model="roleForm.roleName" />
      </el-form-item>
      <el-form-item label="权限设置">
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
  permissionList: []
})

const defaultProps = {
  children: 'children',
  label: 'menuName'
}

/* 获取菜单 */
function getMenuList() {
  apiMenu.getMenuList().then((res) => {
    menuList.value = res.data
  })
}
getMenuList()

/* 获取角色列表 */
function getRoleList() {
  apiRole.getRoleList().then((res) => {
    roleList.value = res.data
  })
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
  checkedMenuList.forEach((menu) => {
    if (menu.menuType === 3) {
      permissionList.push(menu.id)
    }
  })
  return permissionList
}

/* 新增角色 */
function createRoleSubmit() {
  roleForm.permissionList = generatePermissionList()
  //新增角色
  apiRole.createRole(roleForm)
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
  roleForm.roleName = row.roleName
  roleId.value = row._id
  nextTick(() => {
    treeRef.value.setCheckedKeys(row.permissionList)
  })
}

/* 编辑角色 */
function editRoleSubmit() {
  roleForm.permissionList = generatePermissionList()
  //编辑角色
  apiRole.editRole({ id: roleId.value, roleInfo: roleForm })
  //编辑完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 删除角色 */
function deleteRoleSubmit(row) {
  console.log(row)

  const roleId = row._id
  apiRole.deleteRole({ id: roleId })
  //删除完成后关闭弹窗并重新渲染角色列表
  dialogFormVisible.value = false
  getRoleList()
}

/* 弹框关闭处理函数 */
function dialogCloseHandler() {
  console.log(1);
  
  //每次弹框关闭,重置roleForm数据
  roleForm.roleName = ''
  roleForm.permissionList = []
}
</script>

<style lang="scss" scoped></style>
