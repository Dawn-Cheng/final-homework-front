<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">M</div>
        <h1>微商城后台管理</h1>
        <p class="login-sub">请使用管理员账号登录</p>
      </div>
      <div class="form-group">
        <label>用户名</label>
        <input v-model="username" placeholder="请输入管理员账号" @keyup.enter="handleLogin" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
      </div>
      <p class="error" v-if="error">{{ error }}</p>
      <button class="login-btn" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import adminHttp from '@/api/admin-index'

const router = useRouter()
const username = ref('admin')
const password = ref('admin123')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  error.value = ''
  loading.value = true
  try {
    const res = await adminHttp.post('/api/admin/login', { username: username.value, password: password.value })
    localStorage.setItem('adminToken', res.data.token)
    router.push('/admin/dashboard')
  } catch (e) { error.value = e.message || '登录失败' } finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #001529 0%, #003a70 100%);
}

.login-card {
  width: 440px;
  padding: 48px 44px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .25);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 22px;
  color: #1a1a2e;
  margin-bottom: 6px;
  font-weight: 600;
}

.login-sub {
  font-size: 14px;
  color: #999;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color .2s;
}

.form-group input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, .1);
}

.error {
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background .2s;
  letter-spacing: 4px;
}

.login-btn:hover {
  background: #096dd9;
}

.login-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
