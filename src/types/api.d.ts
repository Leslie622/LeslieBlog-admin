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

  /* 编辑用户个人信息：只能编辑头像和个人简介 */
  type editUserInfoReqData = {
    id: string
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
  type userListResData = {
    total: number
    userList: userResData[]
  }

  /* 用户列表配置信息 */
  type userListConfigData = {
    pageNum: number //页码
    pageSize: number //每页个数
  }

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
  type roleListResData = {
    total: number
    roleList: roleResData[]
  }

  /* 角色列表配置信息 */
  type roleListConfigData = {
    pageNum?: number //页码
    pageSize?: number //每页个数
  }
}

namespace Menu {
  type menuInfo = {
    id: string
    parentId: string
    menuType: number
    menuName: string
    menuCode: string
    icon: string
    path: string
    component: string
  }

  /* 创建菜单：去除掉id字段 */
  type createMenuReqData = {
    parentId: string
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
    parentId?: string
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
    parentId: string | null //根菜单的parentId为null
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

namespace BlogCategory {
  /* 分类信息 */
  type info = {
    id: string
    name: string
    introduce: string
    count: number
  }

  /* 创建博客分类 */
  type createReqData = {
    name: string
    introduce: string
  }

  /* 删除博客分类 */
  type deleteReqData = {
    id: string
  }

  /* 编辑博客分类 */
  type editReqData = {
    id: string
    name?: string
    introduce?: string
  }

  /* 查询博客分类列表 */
  type listResData = {
    total: number
    categoryList: info[]
  }

  /* 分类列表配置信息 */
  type listConfigData = {
    pageNum?: number //页码
    pageSize?: number //每页个数
  }
}

namespace Blog {
  /* 博客信息 */
  type blogInfo = {
    id: string
    title: string
    abstract: string
    cover: string
    content: string
    draft: string
    category: string
    author: string
    views: number
    isOriginal: boolean
    isSticky: boolean
    createdAt: string
    updatedAt: string
  }

  /* 创建博客 */
  type createReqData = {
    title: string
    abstract: string
    cover: string
    content: string
    draft: string
    category: string
    isOriginal: boolean
    isSticky: boolean
  }

  /* 编辑博客 */
  type editReqData = {
    id: string
    title?: string
    abstract?: string
    cover?: string
    content?: string
    draft?: string
    category?: string
    isOriginal?: boolean
    isSticky?: boolean
  }

  /* 删除博客 */
  type deleteReqData = {
    id: string
  }

  /* 博客列表 */
  type listResData = {
    total: number
    blogList: blogInfo[]
  }

  /* 查询单篇博客 */
  type singleBlogReqData = {
    blogId: string
  }

  /* 博客列表配置信息 */
  type blogListConfigData = {
    pageNum: number //页码
    pageSize: number //每页个数
    category: string //分类id，默认空为所有
    searchKeyword: string //搜索关键字
    //排序数组
    sortArr: Array<{ field: string; order: number }>
  }
}

namespace Visitor {
  type info = {
    location: string
    system: string
    browser: string
    ip: string
    visitTimes: number
    createdAt: string
    updatedAt: string
  }

  type listResData = {
    total: number
    visitorList: info[]
  }
}
