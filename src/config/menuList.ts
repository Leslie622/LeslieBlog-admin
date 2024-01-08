/* 菜单列表 */

const menuList = [
  {
    id: 1,
    menuType: 1,
    menuName: '系统管理',
    menuCode: '',
    path: '/system',
    icon: '',
    parentId: null,
    children: [
      {
        id: 10,
        menuType: 2,
        menuName: '角色管理',
        menuCode: '',
        path: '/system/userManage',
        icon: '',
        parentId: 1,
        children: [
          {
            id: 100,
            menuType: 3,
            menuName: '新增角色',
            menuCode: 'user-create',
            path: '',
            icon: '',
            parentId: 10,
            children: []
          },
          {
            id: 101,
            menuType: 3,
            menuName: '删除角色',
            menuCode: 'user-delete',
            path: '',
            icon: '',
            parentId: 10,
            children: []
          }
        ]
      },
      {
        id: 11,
        menuType: 2,
        menuName: '菜单管理',
        menuCode: '',
        path: '/system/menuManage',
        icon: '',
        parentId: 1,
        children: [
          {
            id: 111,
            menuType: 3,
            menuName: '新增菜单',
            menuCode: 'menu-create',
            path: '',
            icon: '',
            parentId: 11,
            children: []
          },
          {
            id: 112,
            menuType: 3,
            menuName: '删除菜单',
            menuCode: 'menu-delete',
            path: '',
            icon: '',
            parentId: 11,
            children: []
          }
        ]
      }
    ]
  }
]

export default menuList
