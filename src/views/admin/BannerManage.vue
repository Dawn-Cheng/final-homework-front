<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>轮播图管理</h2>
      <button class="btn-primary" @click="openAdd">+ 新增轮播图</button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>图片</th>
            <th>标题</th>
            <th>跳转链接</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in list" :key="b.id">
            <td class="col-id">{{ b.id }}</td>
            <td><img :src="b.image" class="thumb" /></td>
            <td>{{ b.title || '-' }}</td>
            <td class="col-link">{{ b.link || '-' }}</td>
            <td>{{ b.sort }}</td>
            <td>
              <span :class="['tag', b.status === 1 ? 'tag-on' : 'tag-off']">
                {{ b.status === 1 ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="col-action">
              <button class="btn-edit" @click="openEdit(b)">编辑</button>
              <button class="btn-del" @click="handleDelete(b)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="empty-tip">暂无轮播图数据</div>
    </div>

    <div v-if="showModal" class="modal-mask" @click.self="showModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editing ? '编辑轮播图' : '新增轮播图' }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-2"><label>标题</label><input v-model="form.title" /></div>
            <div class="form-group"><label>排序</label><input v-model.number="form.sort" type="number" /></div>
            <div class="form-group"><label>状态</label>
              <select v-model="form.status">
                <option :value="1">启用</option>
                <option :value="0">禁用</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>图片 URL</label><input v-model="form.image" /></div>
          <div class="form-group"><label>跳转链接</label><input v-model="form.link" placeholder="如 /goods/1" /></div>
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
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const form = reactive({ title: '', image: '', link: '', sort: 0, status: 1 })

async function fetchList() {
  try { const res = await adminHttp.get('/api/admin/banners'); list.value = res.data || [] } catch { list.value = [] }
}
onMounted(fetchList)

function openAdd() { editing.value = null; form.title = ''; form.image = ''; form.link = ''; form.sort = 0; form.status = 1; showModal.value = true }
function openEdit(b) { editing.value = b; Object.assign(form, { title: b.title || '', image: b.image || '', link: b.link || '', sort: b.sort || 0, status: b.status }); showModal.value = true }
async function handleSave() {
  saving.value = true
  try {
    if (editing.value) { await adminHttp.put(`/api/admin/banners/${editing.value.id}`, form) }
    else { await adminHttp.post('/api/admin/banners', form) }
    showToast('保存成功'); showModal.value = false; fetchList()
  } catch (e) { showToast(e.message || '保存失败') } finally { saving.value = false }
}
async function handleDelete(b) {
  if (!confirm('确定删除这条轮播图？')) return
  try { await adminHttp.delete(`/api/admin/banners/${b.id}`); showToast('已删除'); fetchList() } catch (e) { showToast(e.message) }
}
</script>

<style scoped>
.manage-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-primary {
  padding: 8px 22px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background .2s;
}

.btn-primary:hover {
  background: #096dd9;
}

.btn-primary:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.data-table th {
  background: #fafafa;
  color: #666;
  font-weight: 500;
  font-size: 13px;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.col-id {
  color: #999;
  width: 60px;
}

.col-link {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-action {
  white-space: nowrap;
}

.thumb {
  width: 100px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-on {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.tag-off {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #e0e0e0;
}

.btn-edit,
.btn-del {
  padding: 4px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  background: #fff;
  transition: all .2s;
}

.btn-edit {
  color: #1890ff;
  margin-right: 8px;
}

.btn-edit:hover {
  color: #fff;
  background: #1890ff;
  border-color: #1890ff;
}

.btn-del {
  color: #e74c3c;
}

.btn-del:hover {
  color: #fff;
  background: #e74c3c;
  border-color: #e74c3c;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 14px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #fff;
  border-radius: 8px;
  width: 560px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group.flex-2 {
  flex: 2;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color .2s;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, .1);
  outline: none;
}

.btn-cancel {
  padding: 8px 22px;
  background: #fff;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel:hover {
  color: #1890ff;
  border-color: #1890ff;
}
</style>
