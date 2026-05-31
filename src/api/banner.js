import http from './index'

export const getBanners = () =>
  http.get('/api/mall/banners')

export const getAdminBanners = () =>
  http.get('/api/admin/banners')

export const createBanner = (data) =>
  http.post('/api/admin/banners', data)

export const updateBanner = (id, data) =>
  http.put(`/api/admin/banners/${id}`, data)

export const deleteBanner = (id) =>
  http.delete(`/api/admin/banners/${id}`)
