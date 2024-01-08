<template>
  <el-button type="primary" @click="createMenuHandler" round>新增菜单</el-button>
  <!-- 菜单列表 -->
  <el-table :data="menuList" row-key="id" border default-expand-all>
    <el-table-column prop="menuName" label="菜单名称" />
    <el-table-column prop="menuType" label="菜单类型">
      <template v-slot="{ row }">
        <span>{{ menuTypeMap[row.menuType] }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="menuCode" label="权限标识" />
    <el-table-column prop="path" label="路径" />
    <el-table-column prop="icon" label="图标" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- 新增菜单弹框 -->
  <el-dialog v-model="dialogCreateMenu" :title="dialogData['title']">
    <el-form :model="menuForm" label-width="120px">
      <el-form-item label="菜单类型">
        <el-radio-group v-model="menuForm.menuType" @change="menuTypeSelectHandler" >
          <el-radio v-for="(value, key) in menuTypeMap" :label="Number(key)">{{ value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 新建菜单时展示 -->
      <template v-if="menuForm.menuType === 1">
        <el-form-item label="父级菜单" key="1">
          <el-select v-model="menuForm.parentId">
            <el-option label="Root" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="menuForm.path" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menuForm.icon" />
        </el-form-item>
      </template>
      <!-- 新建路由时展示 -->
      <template v-else-if="menuForm.menuType === 2">
        <el-form-item label="父级菜单" key="2">
          <el-select v-model="menuForm.parentId">
            <el-option
              v-for="item in routerParentMenu"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="menuForm.path" />
        </el-form-item>
      </template>
      <!-- 新建按钮时展示 -->
      <template v-else-if="menuForm.menuType === 3">
        <el-form-item label="父级菜单" key="3">
          <el-select v-model="menuForm.parentId">
            <el-option
              v-for="item in buttonParentMenu"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="menuForm.menuCode" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogCreateMenu = false">取消</el-button>
        <el-button type="primary" @click="dialogData['submitEvent']">
          {{ dialogData['submitName'] }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// import menuList from '@/config/menuList'
import apiMenu from '@/api/modules/menu'

const menuList = ref()
//路由可选父菜单
const routerParentMenu = ref([])
//按钮可选父菜单
const buttonParentMenu = ref([])

//弹框控制
const dialogCreateMenu = ref(false)

//弹框数据
const dialogData = reactive({
  title: '',
  submitName: '',
  submitEvent: null
})

function a() {
  console.log('1')
}

apiMenu.getMenuList().then((res) => {
  const data = res.data
  menuList.value = data
  routerParentMenu.value = filterMenuByType(data, 1)
  console.log(routerParentMenu.value)

  buttonParentMenu.value = filterMenuByType(data, 2)
  console.log(buttonParentMenu.value)
})

//菜单类型字典
const menuTypeMap = {
  1: '菜单',
  2: '路由',
  3: '按钮'
}

//表单：新增菜单
const menuForm = reactive({
  parentId: '', //父级菜单:默认为空
  menuType: 1, //表单类型:默认为菜单(1)
  menuName: '', //表单名称
  menuCode: '', //权限标识:默认为空
  path: '', //路径
  icon: '' //图标
})

/* 可选父菜单列表：只有menuType为1的才能成为父菜单 */
function filterMenuByType(menuList, menuType) {
  const result = []
  for (let i = 0; i < menuList.length; i++) {
    const menu = menuList[i]
    if (menu.menuType === menuType) {
      result.push(menu)
    }
    if (menu.children && menu.children.length > 0) {
      result.push(...filterMenuByType(menu.children, menuType))
    }
  }
  return result
}

/* 根据选择的菜单类型进行一些操作 */
function menuTypeSelectHandler(menuType) {
  //清空父菜单
  menuForm.parentId = ''
}

/* 新增菜单逻辑处理 */
async function createMenuHandler() {
  dialogCreateMenu.value = true
  dialogData.title = '创建菜单'
  dialogData.submitName = '创建'
  dialogData.submitEvent = a
}

const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}
</script>

<style lang="scss" scoped></style>
