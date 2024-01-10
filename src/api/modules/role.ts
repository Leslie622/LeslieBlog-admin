import api from '../index'

export default {
  //创建菜单
  createRole: (data) => api.post('role/createRole', data),
  //删除菜单
  deleteRole: (data) => api.post('role/deleteRole', data),
  //编辑菜单
  editRole: (data) => api.post('role/editRole', data),
  //获取菜单
  getRoleList: () => api.get('role/getRoleList')
}
