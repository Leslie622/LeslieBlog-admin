<template>
  <el-table :data="userList">
    <el-table-column prop="account" label="账号" />
    <el-table-column prop="roleId.roleName" label="角色" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editRoleHandler(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除该用户吗？" @confirm="deleteUserSubmit(scope.row)">
          <template #reference>
            <el-button size="small" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" @closed="dialogCloseHandler" title="编辑角色">
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
            :value="item._id"
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

const dialogFormVisible = ref(false)

const userForm = reactive({
  id: '',
  account: '',
  roleId: '659f9879210e92a7deb9a647'
})

const userList = ref([])
const roleList = ref([])
/* 获取用户列表 */
async function getUserList() {
  const res = await apiUser.getUserList()
  userList.value = res.data
}
getUserList()

/* 获取角色列表 */
async function getRoleList() {
  const res = await apiRole.getRoleList()
  roleList.value = res.data
  console.log(roleList.value)
}
getRoleList()

function editRoleHandler(row) {
  dialogFormVisible.value = true
  //赋值
  userForm.id = row._id
  userForm.account = row.account
  userForm.roleId = row.roleId._id
}
async function editUserSubmit() {
  //编辑角色
  await apiUser.editUser({
    id: userForm.id,
    userInfo: {
      roleId: userForm.roleId
    }
  })
  //编辑成功后关闭弹窗并且重新渲染
  dialogFormVisible.value = false
  getUserList()
}

async function deleteUserSubmit(row) {
  //删除角色
  await apiUser.deleteUser({
    id: row._id
  })
  //删除成功后关闭弹窗并且重新渲染
  dialogFormVisible.value = false
  getUserList()
}

function dialogCloseHandler() {}
</script>

<style lang="scss" scoped></style>
