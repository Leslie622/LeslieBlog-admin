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
const emit = defineEmits<{
  publishBlog: [markdown: string]
  recall: [vditor: any]
  blur: [value: string]
  input: [value: string]
}>()

const props = withDefaults(
  defineProps<{
    content: string
  }>(),
  {
    content: ''
  }
)

/* 获取vditor实例方法 */
function getVditorInstance() {
  return vditor.value
}

defineExpose({
  //暴露获取实例方法
  getVditorInstance
})

//配置项
const options = reactive<IOptions>({
  height: '100%',
  placeholder: '开始写文章...',
  after: () => {
    //编辑器渲染完成，监听父组件传值
    vditor.value?.setValue(props.content)
    watch(
      () => props.content,
      (content) => {
        vditor.value?.setValue(content)
      }
    )
  },
  blur: (value: string) => {
    emit('blur', value)
  },
  input: (value: string) => {
    emit('input', value)
  },
  toolbar: [
    ...myOptions.toolbarConfig,

    {
      name: 'recall',
      tipPosition: 'e',
      tip: '获取缓存',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 28 28"><circle cx="7" cy="7" r="1" fill="#586069"/><circle cx="7" cy="15" r="1" fill="#586069"/><circle cx="7" cy="23" r="1" fill="#586069"/><path fill="#586069" d="M12 26H4v-6h8v-2H4v-6h18V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h8ZM4 4h16v6H4Z"/><path fill="#586069" d="M28 17v2.413A6.996 6.996 0 1 0 22 30v-2a5 5 0 1 1 4.576-7H24v2h6v-6Z"/></svg>',
      className: 'recall',
      click: () => {
        //获取缓存内容
        emit('recall', vditor.value)
      }
    },
    {
      name: '|'
    },
    {
      name: 'publish',
      tipPosition: 'e',
      tip: '发布文章',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 16 16"><g fill="none" stroke="#586069" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="14;0"/></path><path stroke-dasharray="18" stroke-dashoffset="18" d="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="18;0"/><animate attributeName="d" calcMode="linear" dur="1.5s" keyTimes="0;0.7;1" repeatCount="indefinite" values="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5;M12 15 h2 v-3 h2.5 L12 7.5M12 15 h-2 v-3 h-2.5 L12 7.5;M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"/></path></g></svg>',
      className: 'publish',
      click: () => {
        //获取md内容并发送给父组件
        emit('publishBlog', vditor.value?.getValue()!)
      }
    }
  ],
  counter: {
    enable: true,
    type: 'text'
  },
  cache: {
    enable: false
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
