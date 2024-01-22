import ApiService from '../index'

export default {
  // 创建菜单
  createMenu: (data: Menu.createMenuReqData) => ApiService.post('menu/createMenu', data),
  //删除菜单
  deleteMenu: (data: Menu.deleteMenuReqData) => ApiService.post('menu/deleteMenu', data),
  //编辑菜单
  editMenu: (data: Menu.editMenuReqData) => ApiService.post('menu/editMenu', data),
  // 获取菜单
  getMenuList: () => ApiService.get<Menu.menuListResData>('menu/getMenuList')
}
