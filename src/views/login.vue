<template>
  <div class="login">
    <div class="login__container">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="isLoading">
            登录
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { error } from 'console'
import { ElMessage, Message, type FormInstance, type FormRules } from 'element-plus'
const router = useRouter()

const userStore = useUserStore()
interface RuleForm {
  account: string
  password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  password: ''
})

const rules = reactive<FormRules<RuleForm>>({
  account: [
    { required: true, message: '请输入您的用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度必须大于 5', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须大于 6', trigger: 'blur' }
  ]
})

let isLoading = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  isLoading.value = true
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await userStore.login(ruleForm)
      router.push('/home')
      ElMessage({
        type: 'success',
        message: '登录成功'
      })
      isLoading.value = false
    } else {
      isLoading.value = false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .login__container {
    width: 500px;
  }
}
</style>
