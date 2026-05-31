<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="top-bar">
      <div class="top-bar-left">
        <span class="brand">微商城后台管理</span>
        <span class="breadcrumb">/ {{ pageTitle }}</span>
      </div>
      <div class="top-bar-right">
        <span class="user-avatar">A</span>
        <span class="user-name">管理员</span>
        <button class="logout-link" @click="handleLogout">退出</button>
      </div>
    </header>
    <div class="admin-body">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <nav>
          <router-link to="/admin/dashboard" class="nav-item">
            <span class="nav-icon">▦</span>数据看板
          </router-link>
          <router-link to="/admin/categories" class="nav-item">
            <span class="nav-icon">▤</span>分类管理
          </router-link>
          <router-link to="/admin/goods" class="nav-item">
            <span class="nav-icon">▣</span>商品管理
          </router-link>
          <router-link to="/admin/banners" class="nav-item">
            <span class="nav-icon">▥</span>轮播图管理
          </router-link>
          <router-link to="/admin/profile" class="nav-item">
            <span class="nav-icon">◎</span>个人中心
          </router-link>
        </nav>
      </aside>
      <!-- 主内容区 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  const map = {
    dashboard: '数据看板',
    categories: '分类管理',
    goods: '商品管理',
    banners: '轮播图管理',
    profile: '个人中心',
  }
  return map[route.path.split('/').pop()] || ''
})

function handleLogout() {
  localStorage.removeItem('adminToken')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100%;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.top-bar {
  height: 48px;
  background: #001529;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand {
  font-size: 16px;
  font-weight: 700;
}
.breadcrumb {
  font-size: 12px;
  color: rgba(255,255,255,.4);
}
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
.user-name {
  font-size: 13px;
  color: rgba(255,255,255,.85);
}
.logout-link {
  background: none;
  border: none;
  color: rgba(255,255,255,.4);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}
.logout-link:hover {
  color: #fff;
}

/* 主体区域 */
.admin-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 180px;
  background: #001529;
  flex-shrink: 0;
  overflow-y: auto;
  padding-top: 8px;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: rgba(255,255,255,.6);
  font-size: 13px;
  text-decoration: none;
  transition: all .2s;
  border-left: 3px solid transparent;
}
.nav-icon {
  font-size: 14px;
  width: 18px;
  text-align: center;
}
.nav-item:hover {
  color: #fff;
  background: rgba(255,255,255,.08);
}
.nav-item.router-link-active {
  color: #fff;
  background: #1890ff;
  border-left-color: #69c0ff;
}

/* 主内容 */
.main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f0f2f5;
}
</style>
