import http from './index'

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
