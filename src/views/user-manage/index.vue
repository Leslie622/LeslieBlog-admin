<template>
  <el-table :data="userList">
    <el-table-column prop="account" label="账号" />
    <el-table-column prop="roleId.roleName" label="角色" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editUserHandler(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除该用户吗？" @confirm="deleteUserSubmit(scope.row)">
          <template #reference>
            <el-button size="small" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="编辑角色">
    <el-form :model="userForm" :key="Math.random()">
      <el-form-item label="账号" prop="account">
        <el-input v-model="userForm.account" disabled />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="userForm.roleId">
          <el-option
            v-for="item in roleList"
            :key="item.roleName"
            :label="item.roleName"
            :value="item.id!"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editUserSubmit"> 编辑 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import apiUser from '@/api/modules/user'
import apiRole from '@/api/modules/role'

//弹框控制
const dialogFormVisible = ref(false)
//用户表单
const userForm = reactive<User.userInfo>({
  id: '',
  account: '',
  roleId: ''
})
//用户列表
const userList = ref<User.userListResData>()
//角色列表
const roleList = ref<Role.roleListResData>()

onBeforeMount(() => {
  getUserList()
  getRoleList()
})

/* 获取用户列表 */
const getUserList = async () => {
  const res = await apiUser.getUserList()
  userList.value = res.data
}

/* 获取角色列表 */
const getRoleList = async () => {
  const res = await apiRole.getRoleList()
  roleList.value = res.data
}

/* 编辑用户信息处理函数 */
const editUserHandler = (row: User.userInfo) => {
  dialogFormVisible.value = true
  userForm.id = row.id
  userForm.account = row.account
  userForm.roleId = row.roleId
}

/* 编辑用户信息 */
const editUserSubmit = async () => {
  await apiUser.editUser({
    id: userForm.id,
    roleId: userForm.roleId
  })
  dialogFormVisible.value = false
  getUserList()
}

/* 删除用户 */
const deleteUserSubmit = async (row: User.userInfo) => {
  await apiUser.deleteUser({
    id: row.id
  })
  dialogFormVisible.value = false
  getUserList()
}
</script>

<style lang="scss" scoped></style>
