<template>
  <vditor-md @publish-blog="publishBlogHandler" @blur="blurHandler" @recall="setBlogCache" ref="vditorRef" :content="blogForm.draft ? blogForm.draft : blogForm.content"></vditor-md>

  <el-drawer title="发布博客" v-model="blogDrawer" direction="rtl" :size="400">
    <template #default>
      <el-form :model="blogForm" ref="blogFormRef" :validate-on-rule-change="false" :rules="rules" label-width="auto">
        <el-form-item label="博客标题" prop="title">
          <el-input v-model="blogForm.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="博客摘要">
          <el-input v-model="blogForm.abstract" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
        </el-form-item>
        <el-form-item label="博客分类" prop="category">
          <el-select v-model="blogForm.category" placeholder="Select">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
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
              <img v-if="blogForm.cover" :src="$ImgPrefix + blogForm.cover" alt="头像" ref="blogCoverRef" />
              <Icon icon="material-symbols:upload-rounded" color="#cccccc" width="30px" v-else></Icon>
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
        <el-button>取消</el-button>
        <el-button type="warning" @click="publishAsDraft">保存草稿</el-button>
        <el-button type="primary" @click="blogDrawerData['submitEvent'](blogFormRef)">上传</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog v-model="dialogCropperVisible" destroy-on-close title="修改用户头像" class="cropper-dailog" align-center>
    <cropper-image :img="$ImgPrefix + blogForm.cover" @submit-img="submitImg" v-bind="cropperOptions"></cropper-image>
  </el-dialog>
</template>

<script setup lang="ts">
import apiBlogCategory from '@/api/modules/blogCategory'
import apiBlog from '@/api/modules/blog'
import apiUpload from '@/api/modules/upload'
import { useCommonStore } from '@/stores/modules/common'
import type { FormInstance, FormRules } from 'element-plus'
import type { CropperOptionsData } from '@/types/vue-cropper'
const route = useRoute()
const commonStore = useCommonStore()
const blogDrawer = ref(false) //drawer控制
const blogFormRef = ref() //表单ref
const vditorRef = ref() //vditorRef
const blogCoverRef = ref() //博客封面img ref
const dialogCropperVisible = ref(false) //修改用户头像弹窗控制
const imgBlob = ref() //临时存储Blob
const categoryList = ref<BlogCategory.listResData>([])
const blogForm = reactive<Blog.createReqData>({
  title: '',
  abstract: '',
  cover: '',
  content: '',
  draft: '',
  category: '',
  isOriginal: true,
  isSticky: false
})
//表单验证规则
const rules = reactive<FormRules<Blog.createReqData>>({
  title: [{ required: true, message: '请输入博客标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择博客分类', trigger: ['change'], type: 'string' }]
})
//cropper配置
const cropperOptions = reactive<CropperOptionsData>({
  width: 300,
  height: 300,
  outputType: 'png',
  fixedNumber: [16, 9],
  fillColor: ''
})
//控制写博客/编辑博客的事件
const blogDrawerData = reactive<{
  submitEvent: Function
}>({
  submitEvent: () => {}
})

/* 监听路由变化 */
watch(
  () => route.query.blogId,
  async () => {
    //如果携带blogId，则请求博客数据
    const blogId = route.query.blogId
    if (blogId) {
      const res = await apiBlog.singleBlog({ blogId })
      blogForm.abstract = res.data.abstract
      blogForm.title = res.data.title
      blogForm.category = res.data.category
      blogForm.cover = res.data.cover
      blogForm.content = res.data.content
      blogForm.draft = res.data.draft
      blogForm.isOriginal = res.data.isOriginal
      blogForm.isSticky = res.data.isSticky
    }
  },
  {
    immediate: true,
    deep: true
  }
)

onBeforeMount(async () => {
  getBlogCategoryList()
})

/* 浏览器刷新时缓存博客，以便回溯 */
window.addEventListener('beforeunload', function () {
  const vidtor = vditorRef.value.getVditorInstance()
  const value = vidtor.getValue()
  localStorage.setItem('blogCache', JSON.stringify({ ...blogForm, content: value }))
})

/* 编辑器失焦缓存博客数据，以便回溯 */
function blurHandler(value: string) {
  localStorage.setItem('blogCache', JSON.stringify({ ...blogForm, content: value }))
}

onBeforeRouteLeave((to, from, next) => {
  //离开页面时，如果没有发布文章，需要询问
  if (!commonStore.isBlogPublished) {
    ElMessageBox.confirm('您还没有上传博客或保存为草稿，离开页面会丢失博客内容，确定离开吗？', '离开页面提醒', {
      confirmButtonText: '不离开',
      cancelButtonText: '离开',
      closeOnClickModal: false,
      type: 'warning'
    })
      .then(() => {})
      .catch(() => {
        resetBlogFrom()
        next()
      })
  } else {
    //离开页面清空blogFrom
    resetBlogFrom()
    next()
    commonStore.isBlogPublished = false
  }
})

function resetBlogFrom() {
  blogForm.abstract = ''
  blogForm.title = ''
  blogForm.category = ''
  blogForm.cover = ''
  blogForm.content = ''
  blogForm.draft = ''
  blogForm.isOriginal = true
  blogForm.isSticky = false
}

/* 获取博客分类列表 */
async function getBlogCategoryList() {
  const res = await apiBlogCategory.getList()
  categoryList.value = res.data
}

/* 上传博客处理函数：markdown为vditor组件返回 */
function publishBlogHandler(markdown: string) {
  blogDrawer.value = true
  nextTick(() => {
    blogFormRef.value.clearValidate()
  })
  blogForm.content = markdown
  //如果路由携带id，则为编辑模式
  if (route.query.blogId) {
    blogDrawerData.submitEvent = editBlog
  } else {
    blogDrawerData.submitEvent = publishBlog
  }
}

/* 上传博客 */
async function publishBlog(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //确定上传博客的时候，如果有封面，再上传封面
      if (imgBlob.value) {
        const file = new File([imgBlob.value], `example.${cropperOptions.outputType}`)
        const formData = new FormData()
        formData.append('image', file)
        const res = await apiUpload.uploadSingleImage(formData)
        const path = res.data.path
        blogForm.cover = path
      }
      //上传博客：清空draft
      blogForm.draft = ''
      await apiBlog.create(blogForm)
      blogDrawer.value = false
      commonStore.isBlogPublished = true
      resetBlogFrom()
    }
  })
}

/* 编辑博客 */
async function editBlog(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //确定上传博客的时候，如果有封面，再上传封面
      if (imgBlob.value) {
        const file = new File([imgBlob.value], `example.${cropperOptions.outputType}`)
        const formData = new FormData()
        formData.append('image', file)
        const res = await apiUpload.uploadSingleImage(formData)
        const path = res.data.path
        blogForm.cover = path
      }
      //上传博客：清空draft
      blogForm.draft = ''
      await apiBlog.edit({ id: route.query.blogId as string, ...blogForm })
      blogDrawer.value = false
      commonStore.isBlogPublished = true
      resetBlogFrom()
    }
  })
}

/* 上传草稿 */
async function publishAsDraft() {
  //确定上传博客的时候，如果有封面，再上传封面
  if (imgBlob.value) {
    const file = new File([imgBlob.value], `example.${cropperOptions.outputType}`)
    const formData = new FormData()
    formData.append('image', file)
    const res = await apiUpload.uploadSingleImage(formData)
    const path = res.data.path
    blogForm.cover = path
  }
  //上传草稿：
  blogForm.draft = blogForm.content
  //编辑草稿，调用编辑接口，否则调用创建接口
  if (route.query.blogId) {
    await apiBlog.edit({ id: route.query.blogId as string, ...blogForm })
  } else {
    await apiBlog.create(blogForm)
  }
  blogDrawer.value = false
  commonStore.isBlogPublished = true
  resetBlogFrom()
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

/* 填充博客缓存数据 */
function setBlogCache(vidtor: any) {
  if (localStorage.getItem('blogCache')) {
    const blogInfo = JSON.parse(localStorage.getItem('blogCache')!)
    blogForm.abstract = blogInfo.abstract
    blogForm.title = blogInfo.title
    blogForm.category = blogInfo.category
    blogForm.cover = blogInfo.cover
    blogForm.content = blogInfo.content
    blogForm.draft = blogInfo.draft
    blogForm.isOriginal = blogInfo.isOriginal
    blogForm.isSticky = blogInfo.isSticky
  }
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
