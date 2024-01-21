/* 定义菜单结构 */
interface MenuItem {
  menuType: string
  menuName: string
  menuCode: string
  icon: string
  path: string
  component: string
  children: MenuItem[]
}
