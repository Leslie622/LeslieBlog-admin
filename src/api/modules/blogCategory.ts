import ApiService from '../index'

export default {
  //创建分类
  create: (data: BlogCategory.createReqData) => ApiService.post('blogCategory/create', data),
  //删除分类
  delete: (data: BlogCategory.deleteReqData) => ApiService.post('blogCategory/delete', data),
  //编辑分类
  edit: (data: BlogCategory.editReqData) => ApiService.post('blogCategory/edit', data),
  //获取分类列表
  getList: (data:BlogCategory.listConfigData) => ApiService.post<BlogCategory.listResData>('blogCategory/list',data)
}
