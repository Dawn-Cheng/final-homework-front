<template>
  <div class="profile-page">
    <h2>个人中心</h2>

    <div class="profile-grid">
      <div class="card">
        <h3>基本信息</h3>
        <div class="form-row">
          <div class="form-group"><label>用户名</label><input :value="profile.username" disabled /></div>
          <div class="form-group"><label>手机号</label><input v-model="form.phone" /></div>
        </div>
        <div class="form-group"><label>头像 URL</label><input v-model="form.avatar" /></div>
        <button class="btn-primary" @click="handleSaveProfile" :disabled="saving">保存信息</button>
      </div>

      <div class="card">
        <h3>修改密码</h3>
        <div class="form-group"><label>旧密码</label><input v-model="pwd.old" type="password" /></div>
        <div class="form-group"><label>新密码</label><input v-model="pwd.new1" type="password" /></div>
        <div class="form-group"><label>确认新密码</label><input v-model="pwd.new2" type="password" /></div>
        <button class="btn-primary" @click="handleChangePwd" :disabled="pwdSaving">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import adminHttp from '@/api/admin-index'
import { showToast } from '@/utils'

const profile = ref({})
const form = reactive({ phone: '', avatar: '' })
const pwd = reactive({ old: '', new1: '', new2: '' })
const saving = ref(false)
const pwdSaving = ref(false)

onMounted(async () => {
  try {
    const res = await adminHttp.get('/api/admin/profile')
    profile.value = res.data
    form.phone = res.data.phone || ''
    form.avatar = res.data.avatar || ''
  } catch {}
})

async function handleSaveProfile() {
  saving.value = true
  try { await adminHttp.put('/api/admin/profile', { phone: form.phone, avatar: form.avatar }); showToast('保存成功') }
  catch (e) { showToast(e.message || '保存失败') } finally { saving.value = false }
}

async function handleChangePwd() {
  if (!pwd.old || !pwd.new1) { showToast('请填写密码'); return }
  if (pwd.new1 !== pwd.new2) { showToast('两次新密码不一致'); return }
  pwdSaving.value = true
  try {
    await adminHttp.put('/api/admin/password', { oldPassword: pwd.old, newPassword: pwd.new1 })
    showToast('密码修改成功')
    pwd.old = ''; pwd.new1 = ''; pwd.new2 = ''
  } catch (e) { showToast(e.message || '修改失败') } finally { pwdSaving.value = false }
}
</script>

<style scoped>
.profile-page h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.form-row .form-group {
  flex: 1;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color .2s;
  background: #fff;
}
.form-group input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24,144,255,.1);
  outline: none;
}
.form-group input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.btn-primary {
  padding: 9px 28px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background .2s;
}
.btn-primary:hover { background: #096dd9; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
</style>
