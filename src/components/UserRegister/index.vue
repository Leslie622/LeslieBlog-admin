<template>
  <div class="register">
    <div class="register__container">
      <el-form ref="registerFormRef" :model="registerForm" :rules="rules" status-icon>
        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(registerFormRef)" :loading="isLoading">
            注册
          </el-button>
          <el-button @click="resetForm(registerFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { type FormInstance, type FormRules } from 'element-plus'
const userStore = useUserStore()

/* 注册表单ref */
const registerFormRef = ref<FormInstance>()

/* 注册表单 */
const registerForm = reactive<User.registerReqData>({
  account: '',
  password: ''
})

/* 注册表单规则 */
const rules = reactive<FormRules<User.registerReqData>>({
  account: [
    { required: true, message: '请输入您的用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度必须大于 5', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须大于 6', trigger: 'blur' }
  ]
})

/* 注册操作 */
const emit = defineEmits(['change-tab'])
let isLoading = ref(false) //控制注册加载
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  isLoading.value = true
  await formEl.validate(async (valid) => {
    //验证通过
    if (valid) {
      try {
        //请求注册接口：该逻辑在store/user中处理
        await userStore.register(registerForm)
        emit('change-tab', 'login')
        isLoading.value = false
      } catch {
        isLoading.value = false
      }
    }
    //注册失败
    else {
      isLoading.value = false
    }
  })
}

/* 重置表单操作 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.register__container {
  width: 500px;
}
</style>
