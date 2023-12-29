import api from '../index'

export default {
  // 登录
  login: (data: { account: string; password: string }) => api.post('users/login', data),
  //注册
  register: (data: { account: string; password: string }) => api.post('users/register', data),
  //获取用户菜单
  menuList: () => api.get('users/menuList')
}
