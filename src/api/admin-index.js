import axios from 'axios'

const adminHttp = axios.create({
  timeout: 10000,
})

adminHttp.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken')
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }
  return config
})

adminHttp.interceptors.response.use(
  (res) => {
    const { code, msg } = res.data
    if (code === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
      return Promise.reject(new Error('未登录'))
    }
    if (code !== 200) {
      return Promise.reject(new Error(msg || '请求失败'))
    }
    return res.data
  },
  (err) => Promise.reject(err)
)

export const getDashboardStats = () =>
  adminHttp.get('/api/admin/dashboard/stats')

export const aiAnalyze = (message) =>
  adminHttp.post('/api/admin/ai/analyze', { message })

export default adminHttp