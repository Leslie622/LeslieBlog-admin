/* 后端返回的基本数据结构 */
type Result<T> = {
  status: number
  message: string
  data: T
}

namespace User {
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
    id: string
    account: string
    role: {
      roleId: string
      roleName: stirng
    }
    token: string
    avatar: string
    introduce: string
  }

  /* 删除用户：只需id字段 */
  type deleteUserReqData = {
    id: string
  }

  /* 编辑用户信息：id字段必传，其他选传，且不能编辑 account */
  type editUserReqData = {
    id: string
    roleId?: string
    avatar?: string
    introduce?: string
  }

  /* 获取当前用户信息 */
  type userInfoResData = {
    id: string
    account: string
    role: {
      roleId: string
      roleName: stirng
    }
    avatar: string
    introduce: string
  }

  /* 获取用户列表：返回一个userResData数组 */
  type userResData = {
    id: string
    account: string
    role: {
      roleId: string
      roleName: string
    }
  }
  type userListResData = userResData[]

  /* 获取用户权限 */
  type permissionResData = {
    permission: string[]
    menu: Menu.menuResData[]
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
  type createRoleReqData = {
    roleName: string
    permissionList: string[]
    menuList: string[]
    isDefault: boolean
  }

  /* 删除角色：只传id字段 */
  type deleteRoleReqData = {
    id: string
  }

  /* 编辑角色:id字段必传，其他字段选传 */
  type editRoleReqData = {
    id: string
    roleName?: string
    permissionList?: string[]
    menuList?: string[]
    isDefault?: boolean
  }

  /* 查询角色列表：返回roleInfo数组 */
  type roleResData = {
    id: string
    roleName: string
    permissionList: string[]
    menuList: string[]
    isDefault: boolean
  }
  type roleListResData = roleResData[]
}

namespace Menu {
  type menuInfo = {
    id: string
    parentId: string | null //前端传0，后端返回的是null
    menuType: number
    menuName: string
    menuCode: string
    icon: string
    path: string
    component: string
  }

  /* 创建菜单：去除掉id字段 */
  type createMenuReqData = {
    parentId: string | null
    menuType: number
    menuName: string
    menuCode: string
    icon: string
    path: string
    component: string
  }

  /* 编辑菜单，id必传，其他选传(这里的id类型只能为string，不能为空) */
  type editMenuReqData = {
    id: string
    parentId?: string | null
    menuType?: number
    menuName?: string
    menuCode?: string
    icon?: string
    path?: string
    component?: string
  }

  /* 删除菜单：只需传id字段 */
  type deleteMenuReqData = {
    id: string
  }

  /* 后端返回的menu树中会带有children字段 */
  type menuResData = {
    id: string
    parentId: string | null
    menuType: number
    menuName: string
    menuCode: string
    icon: string
    path: string
    component: string
    children: menuResData[]
  }

  type menuListResData = menuResData[]
}

namespace Upload {
  type UploadImageData = FormData
}
