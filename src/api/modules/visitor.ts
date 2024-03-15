import ApiService from '../index'

export default {
  //获取游客列表
  getVisitorList: (data: any) => ApiService.post<Visitor.listResData>('visitor/getVisitorList', data)
}
