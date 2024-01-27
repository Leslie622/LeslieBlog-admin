import ApiService from '../index'

export default {
  //上传单个图片
  uploadSingleImage: (data: Upload.UploadImageData) =>
    ApiService.post('uploads/uploadSingleImage', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
