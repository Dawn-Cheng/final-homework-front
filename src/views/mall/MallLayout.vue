<template>
  <div class="layout">
    <div class="content">
      <router-view />
    </div>
    <nav class="tab-bar">
      <router-link to="/mall/home" class="tab-item" active-class="tab-active">
        <img src="/首页.png" class="tab-icon-img" />
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/mall/category" class="tab-item" active-class="tab-active">
        <img src="/分类.png" class="tab-icon-img" />
        <span class="tab-label">分类</span>
      </router-link>
      <router-link to="/mall/message" class="tab-item" active-class="tab-active">
        <img src="/消息.png" class="tab-icon-img" />
        <span class="tab-label">消息</span>
      </router-link>
      <router-link to="/mall/cart" class="tab-item" active-class="tab-active">
        <img src="/购物车.png" class="tab-icon-img" />
        <span class="tab-label">购物车</span>
        <span v-if="cartCount > 0" class="badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </router-link>
      <router-link to="/mall/profile" class="tab-item" active-class="tab-active">
        <img src="/我的.png" class="tab-icon-img" />
        <span class="tab-label">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { getCartList } from '@/api/cart'

const { isLoggedIn } = useUserStore()
const cartCount = ref(0)

async function fetchCartCount() {
  if (!isLoggedIn.value) { cartCount.value = 0; return }
  try {
    const res = await getCartList()
    cartCount.value = (res.data || []).length
  } catch { cartCount.value = 0 }
}

fetchCartCount()
watch(isLoggedIn, () => fetchCartCount())
</script>

<style scoped>
/*
 * MallLayout - 纯商城布局（不含手机框）
 * 布局说明：
 * layout    → flex 列布局，100% 高
 * content   → flex:1 填充剩余空间，溢出时内部滚动
 * tab-bar   → 固定 56px 底部栏
 */

.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  font-size: 14px;
  line-height: 1.6;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
}

.content::-webkit-scrollbar {
  width: 2.5px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 1.25px;
}

.tab-bar {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
  gap: 2px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.tab-item.tab-active {
  color: #007aff;
}

.tab-icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.badge {
  position: absolute;
  top: 2px;
  left: 50%;
  margin-left: 8px;
  background: #007aff;
  color: #fff;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 10px;
  line-height: 1.2;
  min-width: 16px;
  text-align: center;
}

/* 移动端：全屏显示 */
@media (max-width: 480px) {
  .layout {
    height: 100dvh;
  }
}
</style>
