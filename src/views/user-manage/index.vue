<template>
  <custom-table :data="userList" @page-change="pageChangeHandler" :total="userTotal" :page-size="userListConfig.pageSize">
    <template v-slot:tableContent>
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="role.roleName" label="角色" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editUserHandler(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除该用户吗？" @confirm="deleteUserSubmit(scope.row)">
            <template #reference>
              <el-button size="small" type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </custom-table>

  <el-dialog v-model="dialogFormVisible" title="编辑角色">
    <template #header="{ titleClass }">
      <div class="my-header">
        <span :class="titleClass">编辑用户 </span>
        <el-tag>{{ userInfo.account }}</el-tag>
      </div>
    </template>

    <div>
      <el-form :model="userInfo" label-width="auto">
        <el-form-item label="角色">
          <el-select v-model="userInfo.role.roleId">
            <el-option v-for="item in roleList" :key="item.roleName" :label="item.roleName" :value="item.id!" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
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
//用户信息
const userInfo = reactive<User.userResData>({
  id: '',
  account: '',
  role: {
    roleId: '',
    roleName: ''
  }
})
//用户列表
const userList = ref<User.userResData[]>()
//角色列表
const roleList = ref<Role.roleResData[]>()
const userListConfig = reactive<User.userListConfigData>({
  pageNum: 1,
  pageSize: 14
})
//用户总数量，控制分页，默认一页
const userTotal = ref(userListConfig.pageSize)

onBeforeMount(() => {
  getUserList()
  getRoleList()
})

/* 获取用户列表 */
const getUserList = async () => {
  const res = await apiUser.getUserList(userListConfig)
  userList.value = res.data.userList
  userTotal.value = res.data.total
}

/* 获取角色列表 */
const getRoleList = async () => {
  const res = await apiRole.getRoleList({})
  roleList.value = res.data.roleList
}

/* 编辑用户信息处理函数 */
const editUserHandler = (row: User.userResData) => {
  dialogFormVisible.value = true
  //回显
  userInfo.id = row.id
  userInfo.account = row.account
  userInfo.role.roleId = row.role.roleId
}

/* 编辑用户信息 */
const editUserSubmit = async () => {
  await apiUser.editUser({
    id: userInfo.id,
    roleId: userInfo.role.roleId
  })
  ElMessage.success('编辑成功')
  dialogFormVisible.value = false
  getUserList()
}

/* 删除用户 */
const deleteUserSubmit = async (row: User.userResData) => {
  await apiUser.deleteUser({
    id: row.id
  })
  ElMessage.success('删除成功')
  dialogFormVisible.value = false
  getUserList()
}

/* 分页改变处理函数 */
function pageChangeHandler(pageNum: number) {
  userListConfig.pageNum = pageNum
  getUserList()
}
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  gap: 10px;
}
</style>
<style></style>
