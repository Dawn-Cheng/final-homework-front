<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">微商城</h2>

      <!-- Tab 切换 -->
      <div class="tab-row">
        <span :class="{ active: mode === 'login' }" @click="switchMode('login')">登录</span>
        <span :class="{ active: mode === 'register' }" @click="switchMode('register')">注册</span>
      </div>

      <!-- 登录表单 -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="form">
        <div class="input-group">
          <input v-model="loginForm.username" type="text" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-if="mode === 'register'" @submit.prevent="handleRegister" class="form">
        <div class="input-group">
          <input v-model="registerForm.username" type="text" placeholder="用户名 (3~20位)" required />
        </div>
        <div class="input-group">
          <input v-model="registerForm.password" type="password" placeholder="密码 (6~20位)" required />
        </div>
        <div class="input-group">
          <input v-model="registerForm.phone" type="text" placeholder="手机号 (选填)" />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login as loginApi, register as registerApi } from '@/api/user'
import { showToast } from '@/utils'

const router = useRouter()
const { login: storeLogin } = useUserStore()

const mode = ref('login')
const loading = ref(false)

const loginForm = reactive({ username: 'wangxiaomei', password: 'admin123' })
const registerForm = reactive({ username: '', password: '', phone: '' })

function switchMode(m) {
  mode.value = m
}

async function handleLogin() {
  loading.value = true
  try {
    const res = await loginApi(loginForm.username, loginForm.password)
    storeLogin(res.data.token, res.data.userInfo)
    showToast('登录成功')
    setTimeout(() => router.push('/mall/profile'), 800)
  } catch (e) {
    showToast(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  loading.value = true
  try {
    await registerApi(registerForm.username, registerForm.password, registerForm.phone || undefined)
    showToast('注册成功，请登录')
    mode.value = 'login'
    loginForm.username = registerForm.username
  } catch (e) {
    showToast(e.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 340px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 24px;
  font-weight: 700;
}

.tab-row {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-border);
}

.tab-row span {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  color: var(--color-text-light);
  font-size: var(--font-lg);
  position: relative;
  transition: color 0.2s;
}

.tab-row span.active {
  color: var(--color-primary);
  font-weight: 600;
}

.tab-row span.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  background: #f5f5f5;
  border-radius: var(--radius-md);
  padding: 0 14px;
}

.input-group input {
  width: 100%;
  padding: 12px 0;
  background: transparent;
  font-size: var(--font-md);
}

.btn {
  margin-top: 4px;
  padding: 12px;
  font-size: var(--font-lg);
  border-radius: var(--radius-md);
}

.btn:disabled {
  opacity: 0.6;
}
</style>
