import http from './index'

export const getCartList = () =>
  http.get('/api/mall/cart')

export const addToCart = (data) =>
  http.post('/api/mall/cart', data)

export const updateQuantity = (id, quantity) =>
  http.put(`/api/mall/cart/${id}/quantity`, null, { params: { quantity } })

export const removeCartItem = (id) =>
  http.delete(`/api/mall/cart/${id}`)

export const toggleCheck = (id) =>
  http.put(`/api/mall/cart/${id}/check`)

export const checkAll = (checked) =>
  http.put('/api/mall/cart/check-all', null, { params: { checked } })
