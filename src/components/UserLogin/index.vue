<template>
  <div class="login">
    <div class="login__container">
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" status-icon>
        <el-form-item label="账号" prop="account">
          <el-input v-model="loginForm.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(loginFormRef)" :loading="isLoading">
            登录
          </el-button>
          <el-button @click="resetForm(loginFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
const router = useRouter()
const userStore = useUserStore()

/* 定义登录表单接口 */
interface LoginForm {
  account: string
  password: string
}

/* 登录表单ref */
const loginFormRef = ref<FormInstance>()

/* 登录表单 */
const loginForm = reactive<LoginForm>({
  account: '17671448657',
  password: 'lyf001211'
})

/* 登录表单规则 */
const rules = reactive<FormRules<LoginForm>>({
  account: [
    { required: true, message: '请输入您的用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度必须大于 5', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须大于 6', trigger: 'blur' }
  ]
})

/* 登录操作 */
let isLoading = ref(false) //控制登录加载
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  isLoading.value = true
  await formEl.validate(async (valid, fields) => {
    //验证通过
    if (valid) {
      try {
        //请求登录接口：该逻辑在store/user中处理
        await userStore.login(loginForm)
        isLoading.value = false
        router.push('/home')
      } catch {
        isLoading.value = false
      }
    }
    //验证失败
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
.login__container {
  width: 500px;
}
</style>
