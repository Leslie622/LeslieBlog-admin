<template>
  <div id="vditor" />
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import apiUpload from '@/api/modules/upload'
import myOptions from './options'
const globalProperties = getCurrentInstance()?.appContext.config.globalProperties //全局变量
const vditor = ref<Vditor | null>(null) //实例

//配置项
const options = reactive<IOptions>({
  height: '100%',
  placeholder: '开始写文章...',
  value: '',
  toolbar: [...myOptions.toolbarConfig],
  counter: {
    enable: true,
    type: 'text'
  },
  preview: {
    delay: 0,
    hljs: {
      style: 'native',
      lineNumber: true
    }
  },
  upload: {
    handler: async (files: File[]) => {
      const formData = new FormData()
      formData.append('image', files[0])
      const res = await apiUpload.uploadSingleImage(formData)
      const path = globalProperties?.$ImgPrefix + res.data.path
      //vditor只能插入md,所以只能用hack居中插入图片
      vditor.value?.insertValue(
        `&lt;p align="center"&gt;
  &lt;img src="${path}"&gt;
&lt;/p&gt;`
      )
      return null
    }
  }
})

onMounted(() => {
  vditor.value = new Vditor('vditor', options)
})
</script>

<style lang="scss">
#vditor {
  .vditor-reset {
    font-family: ''; //跟随用户浏览器字体
    font-size: 15px;
  }
  .vditor-counter {
    &.vditor-tooltipped__nw::before {
      top: auto;
      bottom: -5px;
      border-bottom-color: #3b3e43;
      border-top-color: transparent;
    }
    &.vditor-tooltipped__nw::after {
      bottom: -185%;
    }
  }
  --toolbar-background-color: #ffffff;
  .vditor-ir pre.vditor-reset:focus,
  .vditor-wysiwyg pre.vditor-reset:focus,
  .vditor-sv:focus {
    background-color: #ffffff;
  }
}
</style>
