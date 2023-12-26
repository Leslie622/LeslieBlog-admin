/* 菜单列表 */

/* 
  menuType: 1：列表 2：路由
*/

const menuList = [
  {
    menuType: 'list',
    menuName: '仪表盘',
    icon: IconEpDataAnalysis,
    path:"/home",
    children: [
      {
        menuType: 'router',
        menuName: '文章数据',
        path: '/home/ArticleData',
        component: 'ArticleData'
      },
      {
        menuType: 'router',
        menuName: '日记数据',
        path: '/home/DiaryData',
        component: 'DiaryData'
      }
    ]
  },
  {
    menuType: 'router',
    menuName: '用户管理',
    path: '/home/UserManage',
    icon: IconEpUser,
    component: 'UserManage'
  },
  {
    menuType: 'router',
    menuName: '文章管理',
    path: '/home/ArticleManage',
    icon: IconEpNotebook,
    component: 'ArticleManage'
  }
]

export default menuList
