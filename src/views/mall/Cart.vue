<template>
  <div class="cart-page">
    <div v-if="!cartItems.length" class="empty-state">
      <p style="font-size:48px">🛒</p>
      <p>购物车是空的</p>
      <button class="btn btn-primary" style="margin-top:16px" @click="$router.push('/mall/home')">去逛逛</button>
    </div>
    <template v-else>
      <div class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <span class="check-box" :class="{ checked: item.checked === 1 }" @click="toggleItem(item)"></span>
          <img :src="item.goodsCover" class="item-img" @click="$router.push(`/mall/goods/${item.goodsId}`)" />
          <div class="item-info">
            <p class="item-name" @click="$router.push(`/mall/goods/${item.goodsId}`)">{{ item.goodsName }}</p>
            <p class="item-spec" v-if="item.spec">{{ item.spec }}</p>
            <div class="item-bottom">
              <span class="item-price">&yen;{{ item.goodsPrice }}</span>
              <div class="qty-control">
                <button @click="decrease(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increase(item)">+</button>
              </div>
            </div>
          </div>
          <span class="delete-btn" @click="removeItem(item)">×</span>
        </div>
      </div>
      <div class="settle-bar">
        <div class="settle-left">
          <span class="check-box" :class="{ checked: allChecked }" @click="toggleAll"></span>
          <span class="all-label">全选</span>
        </div>
        <div class="settle-right">
          <span class="total-text">合计：</span>
          <span class="total-price">&yen;{{ totalPrice }}</span>
          <button class="btn-settle" :disabled="!checkedCount" @click="showOrderModal = true">结算({{ checkedCount }})</button>
        </div>
      </div>
    </template>
    <div v-if="showOrderModal" class="modal-mask" @click.self="showOrderModal = false">
      <div class="modal-card">
        <h3>确认订单</h3>
        <div class="modal-body">
          <div class="form-group"><label>收货地址</label><input v-model="orderAddress" placeholder="请输入收货地址" /></div>
          <div class="form-group"><label>备注</label><input v-model="orderRemark" placeholder="选填" /></div>
          <p class="order-summary">共 {{ checkedCount }} 件商品，合计 <strong>&yen;{{ totalPrice }}</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm" style="background:#f0f0f0" @click="showOrderModal = false">取消</button>
          <button class="btn btn-primary btn-sm" @click="submitOrder" :disabled="submitting">{{ submitting ? '提交中...' : '提交订单' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { getCartList, updateQuantity, removeCartItem, toggleCheck, checkAll as checkAllApi } from '@/api/cart'
import { createOrder } from '@/api/order'
import { showToast } from '@/utils'

const router = useRouter()
const cartItems = ref([])
const showOrderModal = ref(false)
const orderAddress = ref('')
const orderRemark = ref('')
const submitting = ref(false)
const checkedItems = computed(() => cartItems.value.filter((i) => i.checked === 1))
const checkedCount = computed(() => checkedItems.value.length)
const allChecked = computed(() => cartItems.value.length > 0 && cartItems.value.every((i) => i.checked === 1))
const totalPrice = computed(() => checkedItems.value.reduce((s, i) => s + i.goodsPrice * i.quantity, 0).toFixed(2))

async function fetchCart() {
  try { const res = await getCartList(); cartItems.value = res.data || [] } catch { cartItems.value = [] }
}
onMounted(fetchCart)
onActivated(fetchCart)

async function increase(item) { try { await updateQuantity(item.id, item.quantity + 1); item.quantity++ } catch (e) { showToast(e.message) } }
async function decrease(item) { if (item.quantity <= 1) return; try { await updateQuantity(item.id, item.quantity - 1); item.quantity-- } catch (e) { showToast(e.message) } }
async function toggleItem(item) { try { await toggleCheck(item.id); item.checked = item.checked === 1 ? 0 : 1 } catch {} }
async function toggleAll() { try { const v = !allChecked.value; await checkAllApi(v); cartItems.value.forEach((i) => (i.checked = v ? 1 : 0)) } catch {} }
async function removeItem(item) { try { await removeCartItem(item.id); cartItems.value = cartItems.value.filter((i) => i.id !== item.id); showToast('已删除') } catch (e) { showToast(e.message) } }

async function submitOrder() {
  if (!orderAddress.value.trim()) { showToast('请填写收货地址'); return }
  submitting.value = true
  try {
    await createOrder({ address: orderAddress.value, remark: orderRemark.value || undefined, cartItemIds: checkedItems.value.map((i) => i.id) })
    showToast('下单成功'); showOrderModal.value = false; fetchCart()
  } catch (e) { showToast(e.message || '下单失败') } finally { submitting.value = false }
}
</script>

<style scoped>
.cart-page { background:var(--color-bg); }
.cart-list { background:var(--color-white); }
.cart-item { display:flex;align-items:center;padding:12px;border-bottom:1px solid var(--color-border);position:relative; }
.check-box { width:20px;height:20px;border-radius:50%;border:2px solid #ddd;flex-shrink:0;margin-right:10px;cursor:pointer; }
.check-box.checked { border-color:var(--color-primary);background:var(--color-primary);position:relative; }
.check-box.checked::after { content:'';position:absolute;left:5px;top:2px;width:5px;height:9px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg); }
.item-img { width:80px;height:80px;border-radius:var(--radius-sm);object-fit:cover;background:#f0f0f0;flex-shrink:0;cursor:pointer; }
.item-info { flex:1;margin-left:10px;min-width:0; }
.item-name { font-size:var(--font-md);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer; }
.item-spec { font-size:var(--font-xs);color:var(--color-text-light);margin-top:4px; }
.item-bottom { display:flex;justify-content:space-between;align-items:center;margin-top:8px; }
.item-price { color:var(--color-primary);font-weight:600;font-size:var(--font-md); }
.qty-control { display:flex;align-items:center; }
.qty-control button { width:26px;height:24px;border:1px solid #ddd;background:#f5f5f5;font-size:var(--font-md);display:flex;align-items:center;justify-content:center; }
.qty-control span { width:30px;text-align:center;border-top:1px solid #ddd;border-bottom:1px solid #ddd;height:24px;line-height:24px;font-size:var(--font-sm); }
.delete-btn { position:absolute;top:8px;right:10px;font-size:20px;color:var(--color-text-light);cursor:pointer;padding:2px 6px; }
.settle-bar { position:sticky;bottom:0;width:100%;height:48px;background:var(--color-white);border-top:1px solid var(--color-border);display:flex;align-items:center;justify-content:space-between;padding:0 12px;z-index:99; }
.settle-left { display:flex;align-items:center;gap:6px; }
.all-label { font-size:var(--font-sm); }
.settle-right { display:flex;align-items:center;gap:4px; }
.total-text { font-size:var(--font-sm); }
.total-price { color:var(--color-primary);font-size:var(--font-lg);font-weight:700; }
.btn-settle { background:var(--color-primary);color:#fff;border:none;padding:8px 16px;border-radius:20px;font-size:var(--font-sm);font-weight:600;margin-left:8px; }
.btn-settle:disabled { background:#ccc; }
.modal-mask { position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:flex-end;justify-content:center; }
.modal-card { width:100%;max-width:450px;background:#fff;border-radius:var(--radius-lg) var(--radius-lg) 0 0;padding:20px; }
.modal-card h3 { font-size:var(--font-lg);margin-bottom:16px; }
.form-group { margin-bottom:12px; }
.form-group label { display:block;font-size:var(--font-sm);color:var(--color-text-secondary);margin-bottom:4px; }
.form-group input { width:100%;padding:10px;border:1px solid #ddd;border-radius:var(--radius-sm);font-size:var(--font-md); }
.order-summary { padding:10px 0;font-size:var(--font-sm);color:var(--color-text-secondary); }
.order-summary strong { color:var(--color-primary); }
.modal-footer { display:flex;gap:10px;justify-content:flex-end;margin-top:10px; }
</style>
