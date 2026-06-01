import http from './index'
import adminHttp from './admin-index'

export const login = (username, password) =>
  http.post('/api/mall/user/login', { username, password })

export const register = (username, password, phone) =>
  http.post('/api/mall/user/register', { username, password, phone })

export const getUserInfo = () =>
  http.get('/api/mall/user/info')

export const adminLogin = (username, password) =>
  adminHttp.post('/api/admin/login', { username, password })

export const getAdminProfile = () =>
  adminHttp.get('/api/admin/profile')

export const updateAdminProfile = (data) =>
  adminHttp.put('/api/admin/profile', data)

export const changePassword = (oldPassword, newPassword) =>
  adminHttp.put('/api/admin/password', { oldPassword, newPassword })
