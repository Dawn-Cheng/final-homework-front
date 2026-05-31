<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>商品管理</h2>
      <button class="btn-primary" @click="openAdd">+ 新增商品</button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>封面</th><th>名称</th><th>分类</th><th>价格</th><th>库存</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="g in list" :key="g.id">
            <td class="col-id">{{ g.id }}</td>
            <td><img :src="g.coverImage" class="thumb" /></td>
            <td class="col-name">{{ g.name }}</td>
            <td>{{ g.categoryName || '-' }}</td>
            <td class="col-price">&yen;{{ g.price }}</td>
            <td>{{ g.stock || 0 }}</td>
            <td>
              <span :class="['tag', g.status === 1 ? 'tag-on' : 'tag-off']">
                {{ g.status === 1 ? '上架' : '下架' }}
              </span>
            </td>
            <td class="col-action">
              <button class="btn-edit" @click="openEdit(g)">编辑</button>
              <button class="btn-del" @click="handleDelete(g)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="empty-tip">暂无商品数据</div>
    </div>

    <!-- 弹窗 -->
    <div v-if="showModal" class="modal-mask" @click.self="showModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editing ? '编辑商品' : '新增商品' }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-2"><label>名称</label><input v-model="form.name" /></div>
            <div class="form-group"><label>分类</label>
              <select v-model="form.categoryId">
                <option :value="0">请选择</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>价格</label><input v-model.number="form.price" type="number" step="0.01" /></div>
            <div class="form-group"><label>原价</label><input v-model.number="form.originalPrice" type="number" step="0.01" /></div>
            <div class="form-group"><label>库存</label><input v-model.number="form.stock" type="number" /></div>
            <div class="form-group"><label>状态</label>
              <select v-model="form.status"><option :value="1">上架</option><option :value="0">下架</option></select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>封面图 URL</label><input v-model="form.coverImage" placeholder="图片地址" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>描述</label><textarea v-model="form.description" rows="2"></textarea></div>
            <div class="form-group"><label>详情（HTML）</label><textarea v-model="form.detail" rows="4"></textarea></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showModal = false">取消</button>
          <button class="btn-primary" @click="handleSave" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import adminHttp from '@/api/admin-index'
import { showToast } from '@/utils'

const list = ref([])
const categories = ref([])
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const form = reactive({
  name: '', categoryId: 0, price: 0, originalPrice: 0,
  stock: 0, status: 1, description: '', detail: '', coverImage: '',
})

async function fetchList() {
  try { const res = await adminHttp.get('/api/admin/goods'); list.value = res.data?.list || [] } catch { list.value = [] }
}
async function fetchCategories() {
  try { const res = await adminHttp.get('/api/admin/categories'); categories.value = res.data || [] } catch { categories.value = [] }
}
onMounted(() => { fetchList(); fetchCategories() })

function resetForm() {
  Object.assign(form, { name: '', categoryId: 0, price: 0, originalPrice: 0, stock: 0, status: 1, description: '', detail: '', coverImage: '' })
}
function openAdd() { editing.value = null; resetForm(); showModal.value = true }
function openEdit(g) {
  editing.value = g
  Object.assign(form, {
    name: g.name, categoryId: g.categoryId || 0, price: g.price,
    originalPrice: g.originalPrice || 0, stock: g.stock || 0,
    status: g.status, description: g.description || '', detail: g.detail || '', coverImage: g.coverImage || '',
  })
  showModal.value = true
}
async function handleSave() {
  saving.value = true
  try {
    if (editing.value) {
      await adminHttp.put(`/api/admin/goods/${editing.value.id}`, form)
    } else {
      await adminHttp.post('/api/admin/goods', form)
    }
    showToast('保存成功'); showModal.value = false; fetchList()
  } catch (e) { showToast(e.message || '保存失败') } finally { saving.value = false }
}
async function handleDelete(g) {
  if (!confirm(`确定删除「${g.name}」？`)) return
  try { await adminHttp.delete(`/api/admin/goods/${g.id}`); showToast('已删除'); fetchList() } catch (e) { showToast(e.message) }
}
</script>

<style scoped>
.manage-page { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 18px; font-weight: 600; color: #1a1a2e; }

.btn-primary {
  padding: 8px 22px; background: #1890ff; color: #fff; border: none; border-radius: 6px;
  font-size: 14px; cursor: pointer; transition: background .2s;
}
.btn-primary:hover { background: #096dd9; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.data-table th { background: #fafafa; color: #666; font-weight: 500; font-size: 13px; white-space: nowrap; }
.data-table tbody tr:hover { background: #fafafa; }
.col-id { color: #999; width: 60px; }
.col-name { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-price { color: #e74c3c; font-weight: 600; }
.col-action { white-space: nowrap; }
.thumb { width: 52px; height: 52px; border-radius: 6px; object-fit: cover; background: #f5f5f5; }

.tag { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 12px; }
.tag-on { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
.tag-off { background: #f5f5f5; color: #999; border: 1px solid #e0e0e0; }

.btn-edit, .btn-del {
  padding: 4px 14px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 13px;
  cursor: pointer; background: #fff; transition: all .2s;
}
.btn-edit { color: #1890ff; margin-right: 8px; }
.btn-edit:hover { color: #fff; background: #1890ff; border-color: #1890ff; }
.btn-del { color: #e74c3c; }
.btn-del:hover { color: #fff; background: #e74c3c; border-color: #e74c3c; }

.empty-tip { text-align: center; padding: 60px 0; color: #999; font-size: 14px; }

/* 弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 300; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; border-radius: 8px; width: 680px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 8px 40px rgba(0,0,0,.15); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
.modal-header h3 { font-size: 16px; font-weight: 600; }
.modal-close { background: none; border: none; font-size: 22px; color: #999; cursor: pointer; padding: 0 4px; }
.modal-close:hover { color: #333; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px; }

.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-row .form-group { flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-group { margin-bottom: 0; }
.form-group label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 500; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 9px 12px; border: 1px solid #e0e0e0; border-radius: 6px;
  font-size: 14px; transition: border-color .2s; background: #fff;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #1890ff; box-shadow: 0 0 0 2px rgba(24,144,255,.1); outline: none;
}
.form-group textarea { resize: vertical; font-family: inherit; }

.btn-cancel {
  padding: 8px 22px; background: #fff; color: #666; border: 1px solid #e0e0e0;
  border-radius: 6px; font-size: 14px; cursor: pointer;
}
.btn-cancel:hover { color: #1890ff; border-color: #1890ff; }
</style>
