//定义vue-cropper插件的类型
export type CropperOptionsData = {
  width?: number //剪切窗口宽度
  height?: number //剪切窗口高度
  img?: string //图片地址 url 地址, base64, blob
  outputSize?: number //裁剪生成图片的质量 0.1 ~ 1
  outputType?: 'jpeg' | 'png' | 'webp' //裁剪生成图片的格式 jpeg, png, webp
  info?: boolean //裁剪生成图片的格式 jpeg, png, webp
  canScale?: boolean //	图片是否允许滚轮缩放
  autoCrop?: boolean //	是否默认生成截图框
  autoCropWidth?: number //	默认生成截图框宽度 默认容器的80% 0 ~ max
  autoCropHeight?: number //	默认生成截图框高度 默认容器的80% 0 ~ max
  fixed?: boolean //	是否开启截图框宽高固定比例
  fixedNumber?: [number,number] //	截图框的宽高比例, 开启fixed生效
  full?: boolean //	是否输出原图比例的截图
  fixedBox?: boolean //	固定截图框大小
  canMove?: boolean //	上传图片是否可以移动
  canMoveBox?: boolean //	截图框能否拖动
  original?: boolean //	上传图片按照原始比例渲染
  centerBox?: boolean //	截图框是否被限制在图片里面
  high?: boolean //	是否按照设备的dpr 输出等比例图片
  infoTrue?: boolean //	true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  maxImgSize?: number //	限制图片最大宽度和高度	 0 ~ max
  enlarge?: number //	图片根据截图框输出比例倍数
  mode?: 'contain' | 'cover' //图片默认渲染方式
  limitMinSize?: string //裁剪框限制最小区域	默认10
  fillColor?: string //导出时背景颜色填充
}
