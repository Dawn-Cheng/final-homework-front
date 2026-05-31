<template>
  <div class="detail-page">
    <div class="detail-body">
      <div class="img-swiper" v-if="images.length">
        <div class="swiper-track" :style="{ transform: `translateX(-${currentImg * 100}%)` }">
          <img v-for="(img, i) in images" :key="i" :src="img" />
        </div>
        <div class="swiper-dots" v-if="images.length > 1">
          <span v-for="(img, i) in images" :key="i" class="dot" :class="{ active: i === currentImg }"></span>
        </div>
      </div>
      <div class="price-section">
        <span class="price">&yen;{{ goods.price }}</span>
        <span class="original-price">&yen;{{ goods.originalPrice }}</span>
        <span class="sales">已售 {{ goods.sales }}</span>
      </div>
      <h1 class="goods-title">{{ goods.name }}</h1>
      <p class="goods-desc" v-if="goods.description">{{ goods.description }}</p>
      <div class="spec-section" v-if="specGroups.length">
        <div v-for="(group, gi) in specGroups" :key="gi" class="spec-group">
          <span class="spec-label">{{ group.name }}</span>
          <div class="spec-options">
            <span v-for="(val, vi) in group.values" :key="vi" class="spec-tag"
              :class="{ active: selectedSpecs[gi] === val }" @click="selectedSpecs[gi] = val">{{ val }}</span>
          </div>
        </div>
      </div>
      <div class="qty-section">
        <span class="qty-label">数量</span>
        <div class="qty-control">
          <button @click="qty > 1 && qty--" :class="{ disabled: qty <= 1 }">-</button>
          <span class="qty-value">{{ qty }}</span>
          <button @click="qty++">+</button>
        </div>
      </div>
      <div class="detail-section" v-if="goods.detail">
        <h3>商品详情</h3>
        <div class="detail-html" v-html="goods.detail"></div>
      </div>
    </div>
    <div class="bottom-bar">
      <button class="btn-cart" @click="handleAddCart">加入购物车</button>
      <button class="btn-buy" @click="handleBuyNow">立即购买</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getGoodsDetail } from '@/api/goods'
import { addToCart } from '@/api/cart'
import { showToast } from '@/utils'

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useUserStore()
const goods = ref({})
const images = ref([])
const specGroups = ref([])
const selectedSpecs = ref([])
const qty = ref(1)
const currentImg = ref(0)

const specStr = computed(() => {
  const parts = []
  specGroups.value.forEach((g, i) => {
    if (selectedSpecs.value[i]) parts.push(`${g.name}:${selectedSpecs.value[i]}`)
  })
  return parts.join(',')
})

onMounted(async () => {
  try {
    const res = await getGoodsDetail(route.params.id)
    goods.value = res.data
    images.value = JSON.parse(res.data.images || '[]')
    if (res.data.coverImage) images.value.unshift(res.data.coverImage)
    try {
      const specs = JSON.parse(res.data.specs || '[]')
      const groups = {}
      specs.forEach((s) => { const [n, v] = s.split(':'); if (!groups[n]) groups[n] = []; groups[n].push(v) })
      specGroups.value = Object.entries(groups).map(([name, values]) => ({ name, values }))
      selectedSpecs.value = specGroups.value.map(() => '')
    } catch {}
  } catch { showToast('商品不存在') }
})

function requireLogin() {
  if (!isLoggedIn.value) { showToast('请先登录'); router.push('/mall/login'); return false }
  return true
}

async function handleAddCart() {
  if (!requireLogin()) return
  try {
    await addToCart({ goodsId: goods.value.id, spec: specStr.value || undefined, quantity: qty.value })
    showToast('已加入购物车')
  } catch (e) { showToast(e.message || '添加失败') }
}

async function handleBuyNow() {
  if (!requireLogin()) return
  try {
    await addToCart({ goodsId: goods.value.id, spec: specStr.value || undefined, quantity: qty.value })
    showToast('请前往购物车结算')
    router.push('/mall/cart')
  } catch (e) { showToast(e.message || '操作失败') }
}
</script>

<style scoped>
.detail-page { min-height:100vh;background:var(--color-bg); }
.detail-body { background:var(--color-white); }
.img-swiper { position:relative;overflow:hidden; }
.swiper-track { display:flex;transition:transform .3s; }
.swiper-track img { min-width:100%;height:300px;object-fit:cover; }
.swiper-dots { position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px; }
.dot { width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.5); }
.dot.active { background:#fff;width:16px; }
.price-section { padding:14px 16px 8px;display:flex;align-items:baseline;gap:8px; }
.price { color:var(--color-primary);font-size:24px;font-weight:700; }
.original-price { color:var(--color-text-light);font-size:var(--font-sm);text-decoration:line-through; }
.sales { margin-left:auto;color:var(--color-text-light);font-size:var(--font-sm); }
.goods-title { padding:0 16px;font-size:var(--font-lg);font-weight:600; }
.goods-desc { padding:6px 16px 12px;color:var(--color-text-light);font-size:var(--font-sm); }
.spec-section { padding:10px 16px;border-top:8px solid var(--color-bg); }
.spec-group { margin-bottom:10px; }
.spec-label { font-size:var(--font-sm);color:var(--color-text-secondary);margin-bottom:6px;display:block; }
.spec-options { display:flex;flex-wrap:wrap;gap:8px; }
.spec-tag { padding:6px 14px;border-radius:4px;background:#f0f0f0;font-size:var(--font-sm);cursor:pointer; }
.spec-tag.active { background:var(--color-primary);color:#fff; }
.qty-section { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--color-border); }
.qty-label { font-size:var(--font-sm);color:var(--color-text-secondary); }
.qty-control { display:flex;align-items:center; }
.qty-control button { width:32px;height:28px;border:1px solid #ddd;background:#f5f5f5;font-size:var(--font-lg);display:flex;align-items:center;justify-content:center; }
.qty-control button:first-child { border-radius:4px 0 0 4px; }
.qty-control button:last-child { border-radius:0 4px 4px 0; }
.qty-control button.disabled { color:#ccc; }
.qty-value { width:40px;text-align:center;border-top:1px solid #ddd;border-bottom:1px solid #ddd;height:28px;line-height:28px;font-size:var(--font-md); }
.detail-section { padding:16px;border-top:8px solid var(--color-bg); }
.detail-section h3 { font-size:var(--font-lg);margin-bottom:10px; }
.detail-html { font-size:var(--font-sm);line-height:1.7;color:var(--color-text-secondary); }
.detail-html :deep(img) { max-width:100%; }
.bottom-bar { position:sticky;bottom:0;width:100%;display:flex;height:48px;background:var(--color-white);border-top:1px solid var(--color-border);z-index:99; }
.bottom-bar button { flex:1;font-size:var(--font-md);font-weight:600;border:none; }
.btn-cart { background:#ff6b81;color:#fff; }
.btn-buy { background:var(--color-primary);color:#fff; }
</style>
