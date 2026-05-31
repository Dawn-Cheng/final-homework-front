<template>
  <div class="profile">
    <!-- 未登录 -->
    <div v-if="!isLoggedIn" class="not-login">
      <div class="avatar-placeholder"></div>
      <p class="login-hint">登录后享受更多优惠</p>
      <button class="btn btn-primary" @click="$router.push('/mall/login')">登录 / 注册</button>
    </div>

    <!-- 已登录 -->
    <template v-if="isLoggedIn && userInfo">
      <div class="user-header">
        <img :src="userInfo.avatar" class="avatar" @error="onAvatarError" />
        <div class="user-text">
          <p class="user-name">{{ userInfo.realName || userInfo.username }}</p>
          <p class="user-phone">{{ userInfo.phone || '未绑定手机号' }}</p>
        </div>
      </div>

      <div class="menu-list">
        <div class="menu-item" @click="$router.push('/mall/order')">
          <span>我的订单</span>
          <span class="arrow">&gt;</span>
        </div>
        <div class="menu-item" @click="$router.push('/mall/order?status=0')">
          <span>待付款</span>
          <span class="arrow">&gt;</span>
        </div>
        <div class="menu-item" @click="$router.push('/mall/order?status=2')">
          <span>待收货</span>
          <span class="arrow">&gt;</span>
        </div>
      </div>

      <div class="logout-wrap">
        <button class="btn btn-block logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/user'
import { showToast } from '@/utils'

const router = useRouter()
const { isLoggedIn, userInfo, logout, setUserInfo } = useUserStore()

// 如果已登录但 userInfo 为空，尝试获取
if (isLoggedIn.value && !userInfo.value) {
  getUserInfo()
    .then((res) => setUserInfo(res.data))
    .catch(() => {})
}

function onAvatarError(e) {
  e.target.style.display = 'none'
}

function handleLogout() {
  logout()
  showToast('已退出')
  router.push('/mall/home')
}
</script>

<style scoped>
.profile {
  background: var(--color-bg);
}

/* 未登录 */
.not-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px;
}
.avatar-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #e0e0e0;
  margin-bottom: 16px;
}
.login-hint {
  color: var(--color-text-light);
  font-size: var(--font-sm);
  margin-bottom: 20px;
}

/* 用户头部 */
.user-header {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  gap: 14px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  object-fit: cover;
  background: rgba(255, 255, 255, 0.2);
}
.user-text {
  color: var(--color-white);
}
.user-name {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 4px;
}
.user-phone {
  font-size: var(--font-sm);
  opacity: 0.85;
}

/* 菜单 */
.menu-list {
  background: var(--color-white);
  margin: 10px 0;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  font-size: var(--font-md);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
.menu-item:last-child {
  border-bottom: none;
}
.arrow {
  color: var(--color-text-light);
}

/* 退出 */
.logout-wrap {
  padding: 30px 16px;
}
.logout-btn {
  background: var(--color-white);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 12px;
  font-size: var(--font-md);
  border-radius: var(--radius-md);
}
</style>
