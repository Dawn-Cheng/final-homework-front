import http from './index'
import adminHttp from './admin-index'

export const getGoodsList = (params) =>
  http.get('/api/mall/goods', { params })

export const getGoodsDetail = (id) =>
  http.get(`/api/mall/goods/${id}`)

export const getAdminGoods = (params) =>
  adminHttp.get('/api/admin/goods', { params })

export const createGoods = (data) =>
  adminHttp.post('/api/admin/goods', data)

export const updateGoods = (id, data) =>
  adminHttp.put(`/api/admin/goods/${id}`, data)

export const deleteGoods = (id) =>
  adminHttp.delete(`/api/admin/goods/${id}`)
