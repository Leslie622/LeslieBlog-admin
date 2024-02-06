import type { Directive } from 'vue'
import { usePermissionStore } from '@/stores/modules/permission'

const permission: Directive = {
  mounted: (el, binding, vnode) => {
    //获取权限列表
    const permissionStore = usePermissionStore()
    const permissionList = permissionStore.permission

    const hasPermission = permissionList!.includes(binding.value.sign)
    if (!hasPermission) {
      //
    } else {
      //
    }
  }
}

export default permission
