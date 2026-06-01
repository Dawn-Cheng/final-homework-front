import http from './index'
import adminHttp from './admin-index'

export const getBanners = () =>
  http.get('/api/mall/banners')

export const getAdminBanners = () =>
  adminHttp.get('/api/admin/banners')

export const createBanner = (data) =>
  adminHttp.post('/api/admin/banners', data)

export const updateBanner = (id, data) =>
  adminHttp.put(`/api/admin/banners/${id}`, data)

export const deleteBanner = (id) =>
  adminHttp.delete(`/api/admin/banners/${id}`)
