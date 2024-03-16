import ApiService from '../index'

export default {
  //获取中国地图json
  getCNMapJson: () => ApiService.get<any>('dataOverview/getCNMapJson'),
  //获取游客地址信息列表
  getVisitorLocation: () => ApiService.get<DataOverview.visitorLocation>('dataOverview/getVisitorLocation')
}
