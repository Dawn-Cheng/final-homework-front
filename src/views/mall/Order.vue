<template>
  <div class="order-page">
    <div class="tabs">
      <span v-for="t in tabs" :key="t.status" class="tab" :class="{ active: activeTab === t.status }"
        @click="activeTab = t.status; fetchOrders()">
        {{ t.label }}
      </span>
    </div>
    <div v-if="orders.length" class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <span class="order-no">{{ order.orderNo }}</span>
          <span class="order-status" :style="{ color: statusColor(order.status) }">{{ order.statusText }}</span>
        </div>
        <div class="order-body" v-if="order.items && order.items.length">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.goodsImage" />
            <div class="item-text">
              <p>{{ item.goodsName }}</p>
              <span v-if="item.spec" class="item-spec">{{ item.spec }}</span>
            </div>
            <div class="item-right">
              <span>&yen;{{ item.price }}</span>
              <span class="item-qty">×{{ item.quantity }}</span>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <span>共 {{ order.itemCount || 1 }} 件 合计：<strong>&yen;{{ order.totalAmount }}</strong></span>
          <div class="order-actions">
            <button v-if="order.status === 0" class="btn btn-sm action-btn" @click="handleCancel(order)">取消订单</button>
            <button v-if="order.status === 2" class="btn btn-sm btn-primary" @click="handleReceive(order)">确认收货</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>暂无订单</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders, cancelOrder, confirmReceive, getOrderItems } from '@/api/order'
import { showToast } from '@/utils'

const tabs = [
  { label: '全部', status: undefined },
  { label: '待付款', status: 0 },
  { label: '待发货', status: 1 },
  { label: '待收货', status: 2 },
  { label: '待评价', status: 3 },
  { label: '已完成', status: 4 },
]
const activeTab = ref(undefined)
const orders = ref([])

function statusColor(s) {
  const map = { 0: '#ffa502', 1: '#3742fa', 2: '#2ed573', 3: '#ff6348', 4: '#999', 5: '#999' }
  return map[s] || '#999'
}

async function fetchOrders() {
  try {
    const res = await getOrders(activeTab.value)
    const list = res.data || []
    // 获取每个订单的商品项
    for (const order of list) {
      try {
        const itemsRes = await getOrderItems(order.id)
        order.items = itemsRes.data || []
        order.itemCount = (itemsRes.data || []).reduce((s, i) => s + i.quantity, 0)
      } catch { order.items = []; order.itemCount = 1 }
    }
    orders.value = list
  } catch { orders.value = [] }
}

async function handleCancel(order) {
  try {
    await cancelOrder(order.id)
    showToast('已取消')
    fetchOrders()
  } catch (e) { showToast(e.message || '取消失败') }
}

async function handleReceive(order) {
  try {
    await confirmReceive(order.id)
    showToast('已确认收货')
    fetchOrders()
  } catch (e) { showToast(e.message || '操作失败') }
}

onMounted(fetchOrders)
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.tabs {
  display: flex;
  background: var(--color-white);
  overflow-x: auto;
  border-bottom: 1px solid var(--color-border);
}

.tab {
  flex-shrink: 0;
  padding: 12px 14px;
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.tab.active {
  color: var(--color-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: -1px;
}

.order-card {
  background: var(--color-white);
  margin-top: 8px;
  padding: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-no {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.order-status {
  font-size: var(--font-sm);
  font-weight: 600;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
}

.order-item img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  background: #f0f0f0;
}

.item-text {
  flex: 1;
  min-width: 0;
}

.item-text p {
  font-size: var(--font-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.item-right {
  text-align: right;
  font-size: var(--font-sm);
}

.item-qty {
  color: var(--color-text-light);
  margin-left: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
  font-size: var(--font-sm);
}

.order-footer strong {
  color: var(--color-primary);
  font-size: var(--font-md);
}

.order-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #fff;
  border: 1px solid #ddd;
  color: var(--color-text-secondary);
}
</style>
