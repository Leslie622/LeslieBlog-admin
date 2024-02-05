<template>
  <div class="cropper">
    <div class="cropper__main" :style="{ height: height + 'px', width: width + 'px' }">
      <vue-cropper v-bind="props" :img="imageInfo.url ? imageInfo.url : img" ref="cropperRef"></vue-cropper>
    </div>
    <div class="cropper__action">
      <div>
        <el-upload ref="uploadRef" class="upload-demo" :showFileList="false" action="#" :auto-upload="false" :on-change="uploadImage">
          <el-button>选择图片</el-button>
        </el-upload>
      </div>
      <div>
        <el-button @click="rotateLeft">
          <Icon icon="material-symbols:rotate-90-degrees-ccw-outline-rounded" width="14px"></Icon>
        </el-button>
      </div>
      <div>
        <el-button @click="rotateRight">
          <Icon icon="material-symbols:rotate-90-degrees-cw-outline-rounded" width="14px"></Icon>
        </el-button>
      </div>
      <div>
        <el-button @click="getClippedImg" :disabled="!imageInfo.url">剪裁</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import type { CropperOptionsData } from '@/types/vue-cropper'
import type { UploadFile } from 'element-plus'

const props = withDefaults(defineProps<CropperOptionsData>(), {
  width: 300,
  height: 300,
  img: '',
  outputSize: 1,
  outputType: 'jpeg',
  info: false,
  canScale: false,
  autoCrop: true,
  autoCropWidth: 0,
  autoCropHeight: 0,
  fixed: true,
  fixedNumber: () => [1, 1],
  full: false,
  fixedBox: false,
  canMove: false,
  canMoveBox: true,
  original: false,
  centerBox: true,
  high: true,
  infoTrue: false,
  maxImgSize: 2000,
  enlarge: 1,
  mode: 'contain',
  limitMinSize: '100',
  fillColor: '#ffffff'
})
const emit = defineEmits<{
  submitImg: [Blob: Blob]
}>()
const cropperRef = ref()
//图片信息
const imageInfo = reactive({
  url: ''
})

/* 上传图片 */
function uploadImage(uploadFile: UploadFile) {
  //将file转为ObjectURL
  const ObjectURL = URL.createObjectURL(uploadFile.raw!)
  imageInfo.url = ObjectURL
}

/* 图片向左旋转 */
function rotateRight() {
  cropperRef.value.rotateRight()
}

/* 图片向右旋转 */
function rotateLeft() {
  cropperRef.value.rotateLeft()
}

/* 获取剪裁后的图片并返回blob */
function getClippedImg() {
  cropperRef.value.getCropBlob((Blob: Blob) => {
    emit('submitImg', Blob)
  })
}
</script>

<style lang="scss" scoped>
.cropper {
  display: inline-block;
  text-align: center;
  padding: 10px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
.cropper__main {
  display: inline-block;
}
.cropper__action {
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
