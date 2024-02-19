import ApiService from '../index'

export default {
  // 登录
  login: (data: User.loginReqData) => ApiService.post<User.loginResData>('users/login', data),
  // 注册
  register: (data: User.registerReqData) => ApiService.post('users/register', data),
  // 获取当前用户信息
  getUserInfo: () => ApiService.get<User.userInfoResData>('users/getUserInfo'),
  // 获取用户菜单和权限
  getPermission: () => ApiService.get<User.permissionResData>('users/getPermission'),
  // 获取用户列表
  getUserList: () => ApiService.get<User.userListResData>('users/getUserList'),
  // 编辑用户(目前只更改角色)
  editUser: (data: User.editUserReqData) => ApiService.post('users/editUser', data),
  // 编辑用户个人信息
  editUserInfo: (data: User.editUserInfoReqData) => ApiService.post('users/editUserInfo', data),
  // 删除用户(目前硬性删除，后面会改成拉黑)
  deleteUser: (data: User.deleteUserReqData) => ApiService.post('users/deleteUser', data)
}
