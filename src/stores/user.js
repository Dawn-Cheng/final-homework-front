import { ref } from 'vue'

const token = ref(localStorage.getItem('token') || '')
const userInfo = ref(null)
const isLoggedIn = ref(!!token.value)

export function useUserStore() {
  function login(newToken, info) {
    token.value = newToken
    userInfo.value = info
    isLoggedIn.value = true
    localStorage.setItem('token', newToken)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  function setUserInfo(info) {
    userInfo.value = info
  }

  return { token, userInfo, isLoggedIn, login, logout, setUserInfo }
}
