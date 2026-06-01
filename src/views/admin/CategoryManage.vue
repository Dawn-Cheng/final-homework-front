<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>分类管理</h2>
      <button class="btn-primary" @click="openAdd">+ 新增分类</button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>名称</th><th>父级分类</th><th>排序</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="cat in list" :key="cat.id">
            <td class="col-id">{{ cat.id }}</td>
            <td>{{ cat.name }}</td>
            <td>{{ cat.parentName || '顶级' }}</td>
            <td>{{ cat.sort }}</td>
            <td class="col-action">
              <button class="btn-edit" @click="openEdit(cat)">编辑</button>
              <button class="btn-del" @click="handleDelete(cat)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="empty-tip">暂无分类数据</div>
    </div>

    <div v-if="showModal" class="modal-mask" @click.self="showModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editing ? '编辑分类' : '新增分类' }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-2"><label>名称</label><input v-model="form.name" /></div>
            <div class="form-group"><label>排序</label><input v-model.number="form.sort" type="number" /></div>
          </div>
          <div class="form-group"><label>父级分类</label>
            <select v-model="form.parentId">
              <option :value="0">顶级分类</option>
              <option v-for="c in parentOpts" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
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
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/api/category'
import { showToast } from '@/utils'

const list = ref([])
const parentOpts = ref([])
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const form = reactive({ name: '', parentId: 0, sort: 0 })

async function fetchList() {
  try {
    const res = await getAdminCategories()
    list.value = res.data || []
    parentOpts.value = list.value.filter((c) => !c.parentId)
  } catch { list.value = [] }
}
onMounted(fetchList)

function openAdd() {
  editing.value = null; form.name = ''; form.parentId = 0; form.sort = 0; showModal.value = true
}
function openEdit(cat) {
  editing.value = cat; form.name = cat.name; form.parentId = cat.parentId || 0; form.sort = cat.sort || 0; showModal.value = true
}
async function handleSave() {
  saving.value = true
  try {
    const data = { name: form.name, sort: form.sort }
    if (form.parentId) data.parentId = form.parentId
    if (editing.value) {
      await updateCategory(editing.value.id, data)
    } else {
      await createCategory(data)
    }
    showToast('保存成功'); showModal.value = false; fetchList()
  } catch (e) { showToast(e.message || '保存失败') } finally { saving.value = false }
}
async function handleDelete(cat) {
  if (!confirm(`确定删除「${cat.name}」？`)) return
  try { await deleteCategory(cat.id); showToast('已删除'); fetchList() } catch (e) { showToast(e.message) }
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
.data-table th { background: #fafafa; color: #666; font-weight: 500; font-size: 13px; }
.data-table tbody tr:hover { background: #fafafa; }
.col-id { color: #999; width: 80px; }
.col-action { white-space: nowrap; }

.btn-edit, .btn-del {
  padding: 4px 14px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 13px;
  cursor: pointer; background: #fff; transition: all .2s;
}
.btn-edit { color: #1890ff; margin-right: 8px; }
.btn-edit:hover { color: #fff; background: #1890ff; border-color: #1890ff; }
.btn-del { color: #e74c3c; }
.btn-del:hover { color: #fff; background: #e74c3c; border-color: #e74c3c; }

.empty-tip { text-align: center; padding: 60px 0; color: #999; font-size: 14px; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 300; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; border-radius: 8px; width: 520px; box-shadow: 0 8px 40px rgba(0,0,0,.15); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
.modal-header h3 { font-size: 16px; font-weight: 600; }
.modal-close { background: none; border: none; font-size: 22px; color: #999; cursor: pointer; padding: 0 4px; }
.modal-close:hover { color: #333; }
.modal-body { padding: 24px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px; }

.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-row .form-group { flex: 1; }
.form-group.flex-2 { flex: 2; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 500; }
.form-group input, .form-group select {
  width: 100%; padding: 9px 12px; border: 1px solid #e0e0e0; border-radius: 6px;
  font-size: 14px; transition: border-color .2s; background: #fff;
}
.form-group input:focus, .form-group select:focus {
  border-color: #1890ff; box-shadow: 0 0 0 2px rgba(24,144,255,.1); outline: none;
}

.btn-cancel {
  padding: 8px 22px; background: #fff; color: #666; border: 1px solid #e0e0e0;
  border-radius: 6px; font-size: 14px; cursor: pointer;
}
.btn-cancel:hover { color: #1890ff; border-color: #1890ff; }
</style>
