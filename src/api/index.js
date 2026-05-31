import axios from 'axios'
import { useUserStore } from '@/stores/user'

const http = axios.create({
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const { token } = useUserStore()
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`
  }
  return config
})

http.interceptors.response.use(
  (res) => {
    const { code, msg } = res.data
    if (code === 401) {
      const { logout } = useUserStore()
      logout()
      window.location.href = '/mall/login'
      return Promise.reject(new Error('未登录'))
    }
    if (code !== 200) {
      return Promise.reject(new Error(msg || '请求失败'))
    }
    return res.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default http
