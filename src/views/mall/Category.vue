<template>
  <div class="category-page">
    <div class="search-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="keyword" type="text" placeholder="搜索商品" @keyup.enter="handleSearch" />
      </div>
    </div>
    <div class="category-body">
      <div class="left-panel">
        <div v-for="cat in categories" :key="cat.id" class="cat-item"
          :class="{ active: activeCat === cat.id }" @click="selectCategory(cat)">
          {{ cat.name }}
        </div>
      </div>
      <div class="right-panel">
        <div v-if="subCategories.length" class="sub-cats">
          <span v-for="sub in subCategories" :key="sub.id" class="sub-tag"
            :class="{ active: activeSub === sub.id }" @click="selectSub(sub)">
            {{ sub.name }}
          </span>
        </div>
        <div class="goods-grid" v-if="goods.length">
          <div v-for="item in goods" :key="item.id" class="goods-card"
            @click="$router.push(`/mall/goods/${item.id}`)">
            <img :src="item.coverImage" :alt="item.name" />
            <div class="goods-info">
              <p class="goods-name">{{ item.name }}</p>
              <span class="goods-price">&yen;{{ item.price }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state"><p>暂无商品</p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryTree } from '@/api/category'
import { getGoodsList } from '@/api/goods'

const route = useRoute()

const categories = ref([])
const subCategories = ref([])
const goods = ref([])
const activeCat = ref(0)
const activeSub = ref(0)
const keyword = ref('')

onMounted(async () => {
  // 从路由 query 中读取搜索关键词
  if (route.query.keyword) {
    keyword.value = route.query.keyword
  }
  try {
    const res = await getCategoryTree()
    categories.value = res.data || []
    if (categories.value.length) selectCategory(categories.value[0])
  } catch {}
})

async function loadGoods() {
  try {
    const cid = activeSub.value || activeCat.value
    const params = { pageSize: 20 }

    // 选中父分类但未选子分类：拉全部，前端按子分类 ID 过滤
    if (activeCat.value && !activeSub.value && subCategories.value.length) {
      if (keyword.value) params.keyword = keyword.value
      const res = await getGoodsList(params)
      const childIds = subCategories.value.map(c => c.id)
      goods.value = (res.data?.list || []).filter(g => childIds.includes(g.categoryId))
    } else {
      if (cid) params.categoryId = cid
      if (keyword.value) params.keyword = keyword.value
      const res = await getGoodsList(params)
      goods.value = res.data?.list || []
    }
  } catch { goods.value = [] }
}

function selectCategory(cat) {
  activeCat.value = cat.id
  subCategories.value = cat.children || []
  activeSub.value = 0
  loadGoods()
}

function selectSub(sub) {
  activeSub.value = sub.id
  loadGoods()
}

function handleSearch() { loadGoods() }
</script>

<style scoped>
.category-page { display:flex;flex-direction:column;height:calc(100vh - var(--nav-height));background:var(--color-white); }
.search-bar { padding:8px 12px;background:var(--color-white);border-bottom:1px solid var(--color-border); }
.search-box { display:flex;align-items:center;background:#f0f0f0;border-radius:20px;padding:6px 12px; }
.search-icon { margin-right:6px;font-size:14px; }
.search-box input { flex:1;background:transparent;font-size:var(--font-sm); }
.category-body { flex:1;display:flex;overflow:hidden; }
.left-panel { width:90px;background:#f8f8f8;overflow-y:auto;flex-shrink:0; }
.cat-item { padding:14px 10px;font-size:var(--font-sm);text-align:center;color:var(--color-text-secondary);cursor:pointer;position:relative; }
.cat-item.active { background:var(--color-white);color:var(--color-primary);font-weight:600; }
.cat-item.active::before { content:'';position:absolute;left:0;top:10px;bottom:10px;width:3px;background:var(--color-primary); }
.right-panel { flex:1;overflow-y:auto;padding:10px; }
.sub-cats { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px; }
.sub-tag { padding:4px 12px;border-radius:14px;background:#f0f0f0;font-size:var(--font-sm);color:var(--color-text-secondary);cursor:pointer; }
.sub-tag.active { background:var(--color-primary);color:#fff; }
.goods-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
.goods-card { background:var(--color-white);border-radius:var(--radius-md);overflow:hidden; }
.goods-card img { width:100%;aspect-ratio:1;object-fit:cover;background:#f0f0f0; }
.goods-info { padding:6px 8px; }
.goods-name { font-size:var(--font-sm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:4px; }
.goods-price { color:var(--color-primary);font-size:var(--font-md);font-weight:600; }
</style>
