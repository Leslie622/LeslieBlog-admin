import ApiService from '../index'

export default {
  //创建博客
  create: (data: Blog.createReqData) => ApiService.post('blog/create', data),
  //删除博客
  delete: (data: Blog.deleteReqData) => ApiService.post('blog/delete', data),
  //编辑博客
  edit: (data: Blog.editReqData) => ApiService.post('blog/edit', data),
  //获取博客列表
  getList: (data: any) => ApiService.post<Blog.listResData>('blog/list', data),
  //查询单篇博客
  singleBlog: (data: any) => ApiService.post<Blog.blogInfo>('blog/singleBlog', data)
}
