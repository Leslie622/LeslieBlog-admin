<template>
  <div class="navbar">
    <div class="navbar__menu-control" @click="commonStore.controlMenuCollapse()">
      <Icon
        icon="ant-design:menu-fold-outlined"
        width="20px"
        v-if="commonStore.isMenuCollapse"
      ></Icon>
      <Icon icon="ant-design:menu-unfold-outlined" width="20px" v-else></Icon>
    </div>
    <div class="navbar__breadcrumb">
      <bread-crumb></bread-crumb>
    </div>
    <div class="navbar__action">
      <div class="action__setting"></div>
      <div class="action__user">
        <el-dropdown>
          <el-avatar :size="30" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="dialogFormVisible = true">修改用户信息</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoutHandler">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-dialog v-model="dialogFormVisible" title="修改用户信息">
        <el-form :model="form">
          <el-form-item label="头像"> </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/modules/common'
import { useUserStore } from '@/stores/modules/user'

const commonStore = useCommonStore()
const userStore = useUserStore()
const router = useRouter()

const dialogFormVisible = ref(false) //修改用户信息弹窗控制
//用户信息表单
const form = reactive<User.editUserReqData>({
  id: '',
  avatar: '',
  introduce: ''
})
const imageUrl = ref('')

/* 用户退出登录 */
async function logoutHandler() {
  ElMessageBox.confirm('确定要退出登录吗？', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/welcome')
  })
}

/* 头像改变时预览头像 */
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 100%;
}

.navbar__menu-control {
  display: grid;
  place-content: center;
  width: 30px;
  cursor: pointer;
}

.navbar__breadcrumb {
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex: 1;
}

.navbar__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

//头像容器大小
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
