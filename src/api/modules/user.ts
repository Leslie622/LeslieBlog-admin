import api from '../index'

export default {
  // 登录
  login: (data: { account: string; password: string }) => api.post('users/login', data),
  // 注册
  register: (data: { account: string; password: string }) => api.post('users/register', data),
  // 获取用户菜单和权限
  getPermission: () => api.get('users/getPermission'),
  // 获取用户列表
  getUserList: () => api.get('users/getUserList'),
  // 编辑用户(目前只更改角色)
  editUser: (data) => api.post('users/editUser', data),
  // 删除用户(目前硬性删除，后面会改成拉黑)
  deleteUser: (data) => api.post('users/deleteUser', data)
}
