<template>
  <vditor-md @publish-blog="publishBlogHandler"></vditor-md>

  <el-drawer title="发布博客" v-model="blogDrawer" direction="rtl" :size="400">
    <template #default>
      <el-form :model="blogForm" ref="blogFormRef" :rules="rules" label-width="auto">
        <el-form-item label="博客标题" prop="title">
          <el-input v-model="blogForm.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="博客摘要">
          <el-input
            v-model="blogForm.abstract"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="博客分类" prop="category">
          <el-select v-model="blogForm.category" placeholder="Select">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否原创">
          <el-switch v-model="blogForm.isOriginal" />
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="blogForm.isSticky" />
        </el-form-item>
        <el-form-item label="博客封面">
          <div class="avatar__wrapper">
            <div class="avatar" @click="dialogCropperVisible = true">
              <img
                v-if="blogForm.cover"
                :src="$ImgPrefix + blogForm.cover"
                alt="头像"
                ref="blogCoverRef"
              />
              <Icon
                icon="material-symbols:upload-rounded"
                color="#cccccc"
                width="30px"
                v-else
              ></Icon>
              <div class="imgMask">
                <Icon icon="material-symbols:edit-square-outline" width="25px"></Icon>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>cancel</el-button>
        <el-button type="primary" @click="publishBlog(blogFormRef)">confirm</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog
    v-model="dialogCropperVisible"
    destroy-on-close
    title="修改用户头像"
    class="cropper-dailog"
    align-center
  >
    <cropper-image
      :img="$ImgPrefix + blogForm.cover"
      @submit-img="submitImg"
      v-bind="cropperOptions"
    ></cropper-image>
  </el-dialog>
</template>

<script setup lang="ts">
import apiBlogCategory from '@/api/modules/blogCategory'
import apiBlog from '@/api/modules/blog'
import apiUpload from '@/api/modules/upload'
import type { FormInstance, FormRules } from 'element-plus'
import type { CropperOptionsData } from '@/types/vue-cropper'
const blogDrawer = ref(true) //drawer控制
const blogFormRef = ref() //表单ref
const blogCoverRef = ref() //博客封面img ref
const dialogCropperVisible = ref(false) //修改用户头像弹窗控制
const imgBlob = ref() //临时存储Blob
const categoryList = ref<BlogCategory.listResData>([])
const blogForm = reactive<Blog.createReqData>({
  title: '',
  abstract: '',
  cover: '',
  content: '',
  category: '',
  isOriginal: true,
  isSticky: false
})
//表单验证规则
const rules = reactive<FormRules<Blog.createReqData>>({
  title: [{ required: true, message: '请输入博客标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择博客分类', trigger: 'change' }]
})
//cropper配置
const cropperOptions = reactive<CropperOptionsData>({
  width: 300,
  height: 300,
  outputType: 'png',
  fixedNumber: [16, 9],
  fillColor: ''
})

onBeforeMount(() => {
  getBlogCategoryList()
})

/* 获取博客分类列表 */
async function getBlogCategoryList() {
  const res = await apiBlogCategory.getList()
  categoryList.value = res.data
}

/* 上传博客处理函数 */
function publishBlogHandler(markdown: string) {
  blogDrawer.value = true
  blogForm.content = markdown
}

/* 上传博客 */
async function publishBlog(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //确定上传博客的时候再上传封面，拿到封面path
      const file = new File([imgBlob.value], `example.${cropperOptions.outputType}`)
      const formData = new FormData()
      formData.append('image', file)
      const res = await apiUpload.uploadSingleImage(formData)
      const path = res.data.path
      blogForm.cover = path
      //上传博客
      await apiBlog.create(blogForm)
    }
  })
}

/* 上传头像处理函数 */
async function submitImg(blob: Blob) {
  //存储blob
  imgBlob.value = blob
  const blobUrl = URL.createObjectURL(blob)
  //回显
  blogForm.cover = blobUrl
  nextTick(() => {
    blogCoverRef.value.src = blobUrl
  })
  dialogCropperVisible.value = false
}
</script>

<style lang="scss" scoped>
.avatar__wrapper {
  width: 100%;
  padding-top: 56.25%;
  border-radius: 10px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  .avatar {
    display: grid;
    place-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;
    &:hover .imgMask {
      opacity: 1;
    }
    img {
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
}
</style>
