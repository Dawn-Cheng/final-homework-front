import http from './index'
import adminHttp from './admin-index'

export const getCategoryTree = () =>
  http.get('/api/mall/categories')

export const getAdminCategories = () =>
  adminHttp.get('/api/admin/categories')

export const createCategory = (data) =>
  adminHttp.post('/api/admin/categories', data)

export const updateCategory = (id, data) =>
  adminHttp.put(`/api/admin/categories/${id}`, data)

export const deleteCategory = (id) =>
  adminHttp.delete(`/api/admin/categories/${id}`)
