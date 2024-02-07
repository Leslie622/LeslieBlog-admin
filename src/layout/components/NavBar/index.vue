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
      <div class="action__user" @click="userInfoDrawer = true">
        <el-avatar :size="35" v-if="userInfo.avatar" :src="$ImgPrefix + userInfo.avatar" />
        <Icon icon="ep:user" color="gray" width="16px" v-else></Icon>
      </div>
    </div>
    <el-drawer
      v-model="userInfoDrawer"
      :close="(introduceEdit = false)"
      direction="rtl"
      :size="300"
      class="user-info-drawer"
    >
      <template #header>
        <div>
          用户信息 <el-tag type="info">{{ userInfo.role.roleName }}</el-tag>
        </div>
      </template>
      <div class="avatar__wrapper">
        <div class="avatar" @click="dialogCropperVisible = true">
          <img v-if="userInfo.avatar" :src="$ImgPrefix + userInfo.avatar" alt="头像" />
          <Icon icon="material-symbols:upload-rounded" color="#cccccc" width="30px" v-else></Icon>
          <div class="imgMask">
            <Icon icon="material-symbols:edit-square-outline" width="25px"></Icon>
          </div>
        </div>
      </div>
      <div class="introduce__wrapper">
        <p class="introduce" v-if="introduceEdit === false">
          {{ userInfo.introduce === '' ? '点击右侧编辑按钮编辑个性签名' : userInfo.introduce }}
        </p>
        <el-input
          v-model="userInfo.introduce"
          type="textarea"
          v-else
          @change="sumbitIntroduce"
          @blur="introduceEdit = false"
          ref="introInputRef"
          :rows="1"
        ></el-input>
        <Icon
          icon="material-symbols:edit-square-outline"
          width="18px"
          class="introduce__edit"
          @click="editIntroduceHandler"
          v-if="introduceEdit === false"
        ></Icon>
      </div>

      <div class="logout">
        <el-button type="primary" @click="logoutHandler">退出登录</el-button>
      </div>
    </el-drawer>
    <el-dialog
      v-model="dialogCropperVisible"
      destroy-on-close
      title="修改用户头像"
      class="cropper-dailog"
      align-center
    >
      <cropper-image
        :img="$ImgPrefix + userInfo.avatar"
        @submit-img="submitImg"
        v-bind="cropperOptions"
      ></cropper-image>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/modules/common'
import { useUserStore } from '@/stores/modules/user'
import apiUpload from '@/api/modules/upload'
import apiUser from '@/api/modules/user'
import type { CropperOptionsData } from '@/types/vue-cropper'
import { Icon } from '@iconify/vue/dist/iconify.js'

const commonStore = useCommonStore()
const userStore = useUserStore()
const router = useRouter()
const dialogCropperVisible = ref(false) //修改用户头像弹窗控制
const userInfoDrawer = ref(false) //用户信息抽屉
const introInputRef = ref()
const introduceEdit = ref(false) //编辑个性签名控制
//用户信息
const userInfo = ref<User.userInfoResData>({
  id: '',
  avatar: '',
  introduce: '',
  account: '',
  role: {
    roleId: '',
    roleName: ''
  }
})
//cropper配置
const cropperOptions = reactive<CropperOptionsData>({
  width: 300,
  height: 300,
  outputType: 'png',
  fixedNumber: [1, 1],
  fillColor: ''
})

onBeforeMount(() => {
  getUserInfo()
})

/* 获取用户信息 */
async function getUserInfo() {
  const res = await apiUser.getUserInfo()
  userInfo.value = res.data
}

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

/* 上传头像 */
async function submitImg(blob: Blob) {
  //blob转file
  const file = new File([blob], `example.${cropperOptions.outputType}`)
  //头像上传到服务器
  const formData = new FormData()
  formData.append('image', file)
  const res = await apiUpload.uploadSingleImage(formData)
  //拿到图片path
  const path = res.data.path
  //编辑用户头像信息
  await apiUser.editUser({
    id: userInfo.value.id,
    avatar: path
  })
  //重新获取用户信息
  getUserInfo()
  dialogCropperVisible.value = false
}

/* 编辑个性签名处理函数 */
function editIntroduceHandler() {
  introduceEdit.value = true
  nextTick(() => {
    introInputRef.value.focus()
  })
}

/* 修改个性签名 */
async function sumbitIntroduce() {
  await apiUser.editUser({
    id: userInfo.value.id,
    introduce: userInfo.value.introduce
  })

  //重新获取用户信息
  getUserInfo()
}
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

  .action__user {
    display: grid;
    place-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    // background-color: red;
    box-shadow:
      rgba(9, 30, 66, 0.25) 0px 1px 1px,
      rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    cursor: pointer;
  }
}

//头像容器大小
.avatar {
  display: grid;
  place-items: center;
  position: relative;

  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  overflow: hidden;

  &:hover .imgMask {
    opacity: 1;
  }

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .imgMask {
    position: absolute;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: rgba(239, 239, 239, 0.5);
    background-color: rgba(0, 0, 0, 0.5); /* 遮罩的背景颜色和透明度 */
    transition: opacity 0.2s;
  }
}

.introduce__wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover .introduce__edit {
    opacity: 1;
  }
  .introduce {
    margin: 0;
    padding: 0 10px;
    font-size: 14px;
    color: rgba(128, 128, 128, 0.7);
  }
  .introduce__edit {
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0;
    position: absolute;
    right: 0;
  }
}

.logout {
  margin-top: auto;
  margin-bottom: 100px;
}
</style>
<style lang="scss">
.cropper-dailog {
  --el-dialog-width: auto;
}

.user-info-drawer {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
}
</style>
