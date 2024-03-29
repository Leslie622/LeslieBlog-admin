<template>
  <div class="login">
    <div class="login__container">
      <div class="hint">
        <p>登录 ~</p>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" status-icon>
        <el-form-item prop="account">
          <span class="input input--kaede">
            <input class="input__field input__field--kaede" type="text" id="account" v-model="loginForm.account" autocomplete="off" />
            <label class="input__label input__label--kaede" for="account">
              <span class="input__label-content input__label-content--kaede">
                <Icon icon="material-symbols:account-circle-outline" width="20px"></Icon>
                <span>账号</span>
              </span>
            </label>
          </span>
        </el-form-item>
        <el-form-item prop="password">
          <span class="input input--kaede">
            <input class="input__field input__field--kaede" type="text" id="password" v-model="loginForm.password" autocomplete="off" />
            <label class="input__label input__label--kaede" for="password">
              <span class="input__label-content input__label-content--kaede">
                <Icon icon="material-symbols:key-outline-rounded" width="20px"></Icon>
                <span>密码</span>
              </span>
            </label>
          </span>
        </el-form-item>
        <el-form-item>
          <div class="button">
            <a @click="submitForm(loginFormRef)" :loading="isLoading"> 登录 </a>
          </div>
          <div class="button">
            <a @click="resetForm(loginFormRef)" :loading="isLoading"> Reset </a>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { type FormInstance, type FormRules } from 'element-plus'
const router = useRouter()
const userStore = useUserStore()

/* 登录表单ref */
const loginFormRef = ref<FormInstance>()

/* 登录表单 */
const loginForm = reactive<User.loginReqData>({
  account: '',
  password: ''
})

/* 登录表单规则 */
const rules = reactive<FormRules<User.loginReqData>>({
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
        ElMessage.success('登录成功，欢迎！')
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
.button {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin-right: 20px;

  a {
    text-decoration: none;
    color: #000;
    margin: auto;
    width: 70px;
    display: inline-block;
    line-height: 25px;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 2px;
    background-color: #fff;
    border: 2px solid #000;
    box-shadow:
      1px 1px 0,
      2px 2px 0;
    position: relative;
    cursor: pointer;
  }

  a:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    background-color: #fff;
    transition: all 0.3s;
  }

  a:hover {
    z-index: 0;
    background-color: transparent;
  }

  a:hover:after {
    background-color: #ee3f4d;
  }

  a:active {
    top: 2px;
    left: 2px;
    box-shadow: 0 0 0 0;
  }
}

.login__container {
  width: 100%;

  :deep(.el-form-item__content) {
    justify-content: center;
  }

  :deep(.el-form-item) {
    margin-bottom: 30px;
  }

  .hint {
    font-size: 30px;
    padding-left: 10px;
    p {
      margin: 0;
      margin-bottom: 30px;
    }
  }
}

.input {
  position: relative;
  z-index: 1;
  width: 100%;
  border-radius: 5px;

  .input__field {
    position: relative;
    border: none;
  }

  .input__field:focus {
    outline: none;
  }

  .input__label {
    padding: 0 10px;
  }

  .input__label-content {
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 35px;
    color: #857f7f;
  }
}

.input--kaede {
  overflow: hidden;
  background-image: $backInputLight;

  .input__field--kaede {
    position: absolute;
    top: 0;
    right: 100%;
    width: 60%;
    height: 100%;
    transition: transform 0.5s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
  }

  .input__label--kaede {
    display: block;
    cursor: text;
    transform-origin: 0% 50%;
    transition: transform 0.5s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
  }

  .input__label-content--kaede {
    padding: 5px 0;
  }

  .input__field--kaede:focus,
  .input--filled .input__field--kaede {
    transform: translate3d(100%, 0, 0);
    transition-delay: 0.06s;
  }

  .input__field--kaede:focus + .input__label--kaede,
  .input--filled .input__label--kaede {
    transform: translate3d(60%, 0, 0);
    pointer-events: none;
  }

  @media screen and (max-width: 34em) {
    .input__field--kaede:focus + .input__label--kaede,
    .input--filled .input__label--kaede {
      transform: translate3d(65%, 0, 0) scale3d(0.65, 0.65, 1);
      pointer-events: none;
    }
  }
}
</style>
