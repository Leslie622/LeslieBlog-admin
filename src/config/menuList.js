/* 菜单列表 */
const menuList = [
  {
    menuType: '1',
    menuName: '仪表盘',
    menuCode: '',
    path: '',
    icon: IconEpEdit,
    component: '',
    children: [
      {
        menuType: '1',
        menuName: '文章数据',
        menuCode: '',
        path: '/home/ArticleData',
        component: 'ArticleData'
      },
      {
        menuType: '1',
        menuName: '日记数据',
        menuCode: '',
        path: '/home/DiaryData',
        component: 'DiaryData'
      }
    ]
  },
  {
    menuType: '1',
    menuName: '用户管理',
    menuCode: '',
    path: '/home/UserManage',
    icon: '123',
    component: 'UserManage'
  },
  {
    menuType: '1',
    menuName: '文章管理',
    menuCode: '',
    path: '/home/ArticleManage',
    icon: '123',
    component: 'ArticleManage'
  }
]

export default menuList
