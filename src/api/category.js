import http from './index'

export const getCategoryTree = () =>
  http.get('/api/mall/categories')

export const getAdminCategories = () =>
  http.get('/api/admin/categories')

export const createCategory = (data) =>
  http.post('/api/admin/categories', data)

export const updateCategory = (id, data) =>
  http.put(`/api/admin/categories/${id}`, data)

export const deleteCategory = (id) =>
  http.delete(`/api/admin/categories/${id}`)
