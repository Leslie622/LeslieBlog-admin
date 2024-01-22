/* 后端返回的基本数据结构 */
type Result<T> = {
  status: number
  message: string
  data: T
}

namespace User {
  /* 用户信息 */
  type userInfo = {
    id: string
    account: string
    roleId: string
  }

  /* 用户注册 */
  type registerReqData = {
    account: string
    password: string
  }

  /* 用户登录：返回信息中需要携带token */
  type loginReqData = {
    account: string
    password: string
  }

  type loginResData = {
    token: string
  } & userInfo

  /* 删除用户：只需id字段 */
  type deleteUserReqData = {
    id: string
  }

  /* 编辑用户信息：不能编辑 account */
  type editUserReqData = Omit<userInfo, 'account'>

  /* 获取用户列表：返回一个userResData数组 */
  type userResData = userInfo
  type userListResData = userResData[]

  /* 获取用户权限 */
  type permissionResData = {
    permission: string[]
    menu: MenuItem[]
  }
}

namespace Role {
  /* 角色信息 */
  type RoleInfo = {
    id: string
    roleName: string
    permissionList: string[]
    menuList: string[]
    isDefault: boolean
  }

  /* 创建角色：排除id字段 */
  type createRoleReqData = Omit<RoleInfo, 'id'>

  /* 删除角色：只传id字段 */
  type deleteRoleReqData = {
    id: string
  }

  /* 编辑角色:id字段必传，其他字段选传 */
  type editRoleReqData = Partial<RoleInfo> & {
    id: string
  }

  /* 查询角色列表：返回roleInfo数组 */
  type roleResData = RoleInfo
  type roleListResData = roleResData[]
}

namespace Menu {
  type menuInfo = {
    [key: string]: string | number | menuInfo[] | null
    id: string | 0 //这里可以为0是为了处理要创建根菜单的情况,父级id可以为0
    parentId: string | null | 0 //前端传0，后端返回的是null
    menuType: number
    menuName: string
    menuCode: string
    icon: string
    path: string
    component: string
  }

  /* 创建菜单：去除掉id字段 */
  type createMenuReqData = Omit<menuInfo, 'id'>

  /* 编辑菜单，id必传，其他选传(这里的id类型只能为string，不能为空) */
  type editMenuReqData = Partial<RoleInfo> & {
    id: string
  }

  /* 删除菜单：只需传id字段 */
  type deleteMenuReqData = {
    id: string
  }

  /* 后端返回的menu树中会带有children字段 */
  type menuResData = menuInfo & {
    children: menuListResData
  }
  type menuListResData = menuResData[]
}
