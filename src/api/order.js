import http from './index'
import adminHttp from './admin-index'

// ---- 前台订单 ----
export const createOrder = (data) =>
  http.post('/api/mall/orders', data)

export const getOrders = (status) =>
  http.get('/api/mall/orders', { params: status !== undefined ? { status } : {} })

export const getOrderDetail = (id) =>
  http.get(`/api/mall/orders/${id}`)

export const getOrderItems = (id) =>
  http.get(`/api/mall/orders/${id}/items`)

export const cancelOrder = (id) =>
  http.put(`/api/mall/orders/${id}/cancel`)

export const confirmReceive = (id) =>
  http.put(`/api/mall/orders/${id}/receive`)

// ---- 后台订单管理 ----
export const getAdminOrders = (params) =>
  adminHttp.get('/api/admin/orders', { params })

export const getAdminOrderDetail = (id) =>
  adminHttp.get(`/api/admin/orders/${id}`)

export const shipOrder = (id) =>
  adminHttp.put(`/api/admin/orders/${id}/ship`)