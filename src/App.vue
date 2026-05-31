<template>
  <div class="mall-app">
    <!-- 前/后台切换按钮：固定在 #app 左上角 -->
    <button class="toggle-view-btn" @click="toggleView">
      {{ isAdmin ? '📱 前台' : '⚙ 后台' }}
    </button>

    <router-view v-slot="{ Component }">
      <Phone v-if="showPhone" :mode="isAdmin ? 'tablet' : 'phone'">
        <component :is="Component" />
      </Phone>
      <component v-else :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MOCK_PHONE } from './config.js'
import Phone from './components/Phone.vue'

const route = useRoute()
const router = useRouter()

const isAdmin = computed(() => route.path.startsWith('/admin'))

const showPhone = computed(() => {
  if (!MOCK_PHONE) return false
  if (route.query.nomock !== undefined) return false
  return typeof window !== 'undefined' && window.innerWidth > 480
})

function toggleView() {
  if (isAdmin.value) {
    router.push('/mall/home')
  } else {
    router.push('/admin/dashboard')
  }
}
</script>

<style scoped>
/* 前/后台切换按钮 */
.toggle-view-btn {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 99999;
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.25s;
  -webkit-user-select: none;
  user-select: none;
}
.toggle-view-btn:hover {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
}
.toggle-view-btn:active {
  transform: scale(0.95);
}
</style>
