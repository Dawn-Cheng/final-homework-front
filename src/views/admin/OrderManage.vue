<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>订单管理</h2>
      <select v-model="statusFilter" @change="fetchList">
        <option :value="null">全部状态</option>
        <option :value="0">待付款</option>
        <option :value="1">待发货</option>
        <option :value="2">待收货</option>
        <option :value="3">待评价</option>
        <option :value="4">已完成</option>
        <option :value="5">已取消</option>
      </select>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>订单号</th><th>用户</th><th>金额</th><th>状态</th><th>时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in list" :key="o.id">
            <td class="col-id">{{ o.id }}</td>
            <td class="col-no">{{ o.orderNo }}</td>
            <td>{{ o.userId }}</td>
            <td class="col-price">&yen;{{ o.totalAmount.toFixed(2) }}</td>
            <td><span :class="statusClass(o.status)">{{ statusMap[o.status] || '未知' }}</span></td>
            <td>{{ formatTime(o.createdAt) }}</td>
            <td class="col-action">
              <button class="btn-edit" @click="openDetail(o)">详情</button>
              <button v-if="o.status === 1" class="btn-ship" @click="handleShip(o)" :disabled="shipping">发货</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="empty-tip">暂无订单数据</div>
    </div>

    <!-- 订单详情弹窗 -->
    <div v-if="showDetail" class="modal-mask" @click.self="showDetail = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>订单详情</h3>
          <button class="modal-close" @click="showDetail = false">&times;</button>
        </div>
        <div class="modal-body" v-if="detail">
          <div class="detail-row">
            <span class="detail-label">订单号</span>
            <span>{{ detail.orderNo }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">用户ID</span>
            <span>{{ detail.userId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">总金额</span>
            <span class="col-price">&yen;{{ detail.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">状态</span>
            <span :class="statusClass(detail.status)">{{ statusMap[detail.status] || '未知' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">下单时间</span>
            <span>{{ formatTime(detail.createdAt) }}</span>
          </div>
          <div v-if="detail.items && detail.items.length" class="detail-items">
            <div class="detail-label" style="margin-bottom:8px">商品明细</div>
            <div v-for="item in detail.items" :key="item.id" class="detail-item">
              <img v-if="item.coverImage" :src="item.coverImage" class="detail-thumb" />
              <div class="detail-item-info">
                <span class="detail-item-name">{{ item.goodsName || '商品' }}</span>
                <span class="detail-item-meta">x{{ item.quantity }} &yen;{{ (item.goodsPrice ?? item.price).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showDetail = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminOrders, getAdminOrderDetail, shipOrder } from '@/api/order'
import { formatTime } from '@/utils'
import { showToast } from '@/utils'

const list = ref([])
const statusFilter = ref(null)
const showDetail = ref(false)
const detail = ref(null)
const shipping = ref(false)

const statusMap = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '待评价', 4: '已完成', 5: '已取消' }
const statusClassMap = { 0: 'tag-pay', 1: 'tag-ship', 2: 'tag-rec', 3: 'tag-rev', 4: 'tag-done', 5: 'tag-cancel' }

function statusClass(s) { return ['tag', statusClassMap[s] || ''] }

async function fetchList() {
  try {
    const params = statusFilter.value != null ? { status: statusFilter.value } : {}
    const res = await getAdminOrders(params)
    list.value = res.data || []
  } catch { list.value = [] }
}
onMounted(fetchList)

async function openDetail(o) {
  try {
    const res = await getAdminOrderDetail(o.id)
    detail.value = res.data || {}
    showDetail.value = true
  } catch { showToast('获取详情失败') }
}

async function handleShip(o) {
  if (!confirm(`确认对订单「${o.orderNo}」进行发货？`)) return
  shipping.value = true
  try {
    await shipOrder(o.id)
    showToast('发货成功')
    fetchList()
  } catch (e) { showToast(e.message || '发货失败') }
  finally { shipping.value = false }
}
</script>

<style scoped>
.manage-page { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 18px; font-weight: 600; color: #1a1a2e; }
.page-header select { padding: 6px 12px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; background: #fff; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.data-table th { background: #fafafa; color: #666; font-weight: 500; font-size: 13px; white-space: nowrap; }
.data-table tbody tr:hover { background: #fafafa; }
.col-id { color: #999; width: 50px; }
.col-no { font-family: monospace; font-size: 13px; }
.col-price { color: #e74c3c; font-weight: 600; }
.col-action { white-space: nowrap; }

.tag { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 12px; }
.tag-pay { background: #fff7e6; color: #fa8c16; border: 1px solid #ffd591; }
.tag-ship { background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }
.tag-rec { background: #f0f5ff; color: #722ed1; border: 1px solid #d3adf7; }
.tag-rev { background: #fff1f0; color: #f5222d; border: 1px solid #ffa39e; }
.tag-done { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
.tag-cancel { background: #f5f5f5; color: #999; border: 1px solid #e0e0e0; }

.btn-edit, .btn-ship { padding: 4px 14px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 13px; cursor: pointer; background: #fff; transition: all .2s; margin-right: 8px; }
.btn-edit { color: #1890ff; }
.btn-edit:hover { color: #fff; background: #1890ff; border-color: #1890ff; }
.btn-ship { color: #52c41a; border-color: #b7eb8f; }
.btn-ship:hover { color: #fff; background: #52c41a; border-color: #52c41a; }
.btn-ship:disabled { opacity: .5; cursor: not-allowed; }

.empty-tip { text-align: center; padding: 60px 0; color: #999; font-size: 14px; }

/* 详情弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 300; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; border-radius: 8px; width: 520px; max-height: 75vh; display: flex; flex-direction: column; box-shadow: 0 8px 40px rgba(0,0,0,.15); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
.modal-header h3 { font-size: 16px; font-weight: 600; }
.modal-close { background: none; border: none; font-size: 22px; color: #999; cursor: pointer; padding: 0 4px; }
.modal-close:hover { color: #333; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px; }

.detail-row { display: flex; align-items: center; margin-bottom: 14px; font-size: 14px; }
.detail-label { width: 80px; color: #999; flex-shrink: 0; }
.detail-items { margin-top: 16px; border-top: 1px solid #f0f0f0; padding-top: 14px; }
.detail-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.detail-thumb { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #f5f5f5; }
.detail-item-info { display: flex; flex-direction: column; gap: 4px; }
.detail-item-name { font-size: 14px; color: #333; }
.detail-item-meta { font-size: 12px; color: #999; }

.btn-cancel { padding: 8px 22px; background: #fff; color: #666; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; cursor: pointer; }
.btn-cancel:hover { color: #1890ff; border-color: #1890ff; }
</style>