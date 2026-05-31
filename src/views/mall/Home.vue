<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-bar" @click="$router.push('/mall/category')">
      <img src="/搜索.png" class="search-icon-img" />
      <span class="search-text">搜索商品、品牌</span>
    </div>

    <!-- 轮播图 -->
    <div class="banner-wrap" v-if="banners.length">
      <div class="banner-track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <div v-for="(img, i) in banners" :key="i" class="banner-slide">
          <img :src="img" alt="banner" />
        </div>
      </div>
      <div class="banner-dots">
        <span v-for="(b, i) in banners" :key="i" class="dot" :class="{ active: i === current }" />
      </div>
    </div>

    <!-- 功能入口（图片直接写死路径，不用插值） -->
    <div class="feature-grid">
      <div v-for="f in features" :key="f.label" class="feature-item"
        @click="$router.push({ path: '/mall/category', query: { keyword: f.kw } })">
        <img :src="f.iconPath" class="feature-icon-img" />
        <span class="feature-label">{{ f.label }}</span>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="section" v-if="goods.length">
      <div class="section-header">
        <span class="section-title">为你推荐</span>
        <span class="section-more" @click="$router.push('/mall/category')">查看更多 ›</span>
      </div>
      <div class="goods-grid">
        <div v-for="item in goods" :key="item.id" class="goods-card" @click="$router.push(`/mall/goods/${item.id}`)">
          <div class="goods-img-wrap">
            <img :src="item.coverImage" :alt="item.name" class="goods-img" />
          </div>
          <div class="goods-info">
            <p class="goods-name">{{ item.name }}</p>
            <div class="goods-price-row">
              <span class="goods-price">¥{{ item.price }}</span>
              <span class="goods-original">¥{{ item.originalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 骨架屏 -->
    <div class="section skeleton-section" v-if="!goods.length">
      <div class="section-header">
        <span class="section-title">为你推荐</span>
      </div>
      <div class="goods-grid">
        <div v-for="n in 4" :key="n" class="goods-card skeleton-card">
          <div class="skeleton-img" />
          <div class="skeleton-line w60" />
          <div class="skeleton-line w40" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getBanners } from '@/api/banner'
import { getGoodsList } from '@/api/goods'

const banners = ref([])
const current = ref(0)
const goods = ref([])

// 图片路径直接写死，不用插值，避免中文路径被 encode 成乱码
const features = [
  { label: '今日爆款', iconPath: '/火爆.png', kw: '爆款' },
  { label: '新品首发', iconPath: '/新品首发.png', kw: '新品' },
  { label: '限时优惠', iconPath: '/限时优惠.png', kw: '优惠' },
  { label: '全部分类', iconPath: '/分类.png', kw: '' },
]

let timer = null

onMounted(async () => {
  try {
    const res = await getBanners()
    banners.value = (res.data || [])
      .filter(b => b.status === 1)
      .map(b => b.imageUrl)
  } catch { banners.value = [] }

  if (banners.value.length > 1) {
    timer = setInterval(() => {
      current.value = (current.value + 1) % banners.value.length
    }, 3000)
  }

  try {
    const res = await getGoodsList({ pageSize: 6 })
    goods.value = (res.data?.list || []).slice(0, 4)
  } catch { goods.value = [] }
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.home {
  -webkit-user-select: none;
  user-select: none;
}

/* ========== 搜索栏 ========== */
.search-bar {
  margin: 12px 14px 8px;
  padding: 10px 14px;
  background: #f2f2f7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #8e8e93;
  cursor: pointer;
  transition: background 0.2s;
}

.search-icon-img {
  width: 16px;
  height: 16px;
  opacity: 0.45;
  flex-shrink: 0;
}

.search-text {
  font-size: 14px;
}

/* ========== 轮播 ========== */
.banner-wrap {
  position: relative;
  margin: 8px 14px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.banner-track {
  display: flex;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.banner-slide {
  min-width: 100%;
  height: 150px;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  transition: all 0.3s;
}

.dot.active {
  width: 14px;
  border-radius: 2.5px;
  background: #fff;
}

/* ========== 功能入口 ========== */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin: 14px;
  background: #fff;
  border-radius: 12px;
  padding: 14px 6px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.feature-icon-img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.2s;
}

.feature-item:active .feature-icon-img {
  transform: scale(0.92);
}

.feature-label {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* ========== 商品区 ========== */
.section {
  margin: 4px 14px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background: linear-gradient(180deg, #007aff, #5ac8fa);
  border-radius: 2px;
}

.section-more {
  font-size: 13px;
  color: #8e8e93;
  cursor: pointer;
}

.goods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.goods-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.goods-card:active {
  transform: scale(0.97);
}

.goods-img-wrap {
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.goods-card:active .goods-img {
  transform: scale(1.03);
}

.goods-info {
  padding: 8px 10px 10px;
}

.goods-name {
  font-size: 13px;
  color: #1a1a1a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.goods-price-row {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.goods-price {
  font-size: 16px;
  font-weight: 700;
  color: #ff3b30;
}

.goods-original {
  font-size: 11px;
  color: #c7c7cc;
  text-decoration: line-through;
}

/* ========== 骨架屏 ========== */
.skeleton-section {
  padding-bottom: 20px;
}

.skeleton-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 12px;
  margin: 8px 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w60 {
  width: 60%;
}

.w40 {
  width: 40%;
  margin-bottom: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
