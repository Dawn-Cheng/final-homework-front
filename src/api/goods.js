import http from './index'

export const getGoodsList = (params) =>
  http.get('/api/mall/goods', { params })

export const getGoodsDetail = (id) =>
  http.get(`/api/mall/goods/${id}`)

export const getAdminGoods = (params) =>
  http.get('/api/admin/goods', { params })

export const createGoods = (data) =>
  http.post('/api/admin/goods', data)

export const updateGoods = (id, data) =>
  http.put(`/api/admin/goods/${id}`, data)

export const deleteGoods = (id) =>
  http.delete(`/api/admin/goods/${id}`)
