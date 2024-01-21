import ApiService from '../index'

export default {
  //创建角色
  createRole: (data: Role.createRoleReqData) => ApiService.post('role/createRole', data),
  //删除角色
  deleteRole: (data: Role.deleteRoleReqData) => ApiService.post('role/deleteRole', data),
  //编辑角色
  editRole: (data: Role.editRoleReqData) => ApiService.post('role/editRole', data),
  //获取角色列表
  getRoleList: () => ApiService.get<Role.roleListResData>('role/getRoleList')
}
