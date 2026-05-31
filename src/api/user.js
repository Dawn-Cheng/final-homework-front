import http from './index'

export const login = (username, password) =>
  http.post('/api/mall/user/login', { username, password })

export const register = (username, password, phone) =>
  http.post('/api/mall/user/register', { username, password, phone })

export const getUserInfo = () =>
  http.get('/api/mall/user/info')

export const adminLogin = (username, password) =>
  http.post('/api/admin/login', { username, password })

export const getAdminProfile = () =>
  http.get('/api/admin/profile')

export const updateAdminProfile = (data) =>
  http.put('/api/admin/profile', data)

export const changePassword = (oldPassword, newPassword) =>
  http.put('/api/admin/password', { oldPassword, newPassword })
