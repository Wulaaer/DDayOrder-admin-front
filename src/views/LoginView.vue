<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-panel">
        <h3>订餐后台管理系统</h3>

        <el-form class="login-form" :model="loginForm" label-width="60px">
          <el-form-item label="账号">
            <el-input
              ref="usernameRef"
              v-model="loginForm.username"
              placeholder="请输入管理员账号"
              size="large"
              @keyup.enter="focusPassword"
            />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              ref="passwordRef"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              @keyup.enter="login"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" class="login-btn" @click="login">
              登录系统
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/employee'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: '',
})

// 账号输入框 ref
const usernameRef = ref(null)
// 密码输入框 ref
const passwordRef = ref(null)

// 页面加载完成后自动聚焦账号
onMounted(() => {
  usernameRef.value.focus()
})

// 回车跳到密码框
const focusPassword = () => {
  passwordRef.value.focus()
}

// 登录
const login = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  try {
    const res = await loginApi(loginForm.value)
    if (res.code === 1) {
      userStore.setUserInfo(res.data)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(res.msg)
    }
  } catch (err) {
    ElMessage.error('登录异常，请稍后重试')
    console.error('登录异常:', err)
  }
}
</script>

<style scoped>
.login-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 460px;
}

.login-panel {
  background: rgba(255, 255, 255, 0.93);
  border-radius: 24px;
  padding: 50px 42px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.login-panel h3 {
  font-size: 24px;
  color: #1565c0;
  margin: 0 0 6px;
  text-align: center;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #90a4bc;
  font-size: 14px;
  margin: 0 0 40px;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  margin-top: 10px;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: none;
  border: 1px solid #e4e7ed;
}

:deep(.el-input__wrapper:hover) {
  border-color: #b3d8ff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}
</style>
