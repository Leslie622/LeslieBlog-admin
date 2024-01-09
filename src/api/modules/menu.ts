import api from '../index'

export default {
  // 创建菜单
  createMenu: (data) => api.post('menu/createMenu', data),
  //删除菜单
  deleteMenu: (data) => api.post('menu/deleteMenu', data),
  //编辑菜单
  editMenu: (data) => api.post('menu/editMenu', data),
  // 获取菜单
  getMenuList:() => api.get('menu/getMenuList'),

}
