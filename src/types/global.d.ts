/* 定义菜单结构 */
type MenuItem = {
  menuType: number
  menuName: string
  menuCode: string
  icon: string
  path: string
  component: string
  children: MenuItem[]
}
