import http from './index'

export const getMessages = () =>
  http.get('/api/mall/messages')
