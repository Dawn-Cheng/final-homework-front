import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/mall',
      component: () => import('@/views/mall/MallLayout.vue'),
      redirect: '/mall/home',
      children: [
        { path: 'home', component: () => import('@/views/mall/Home.vue') },
        { path: 'category', component: () => import('@/views/mall/Category.vue') },
        { path: 'goods/:id', component: () => import('@/views/mall/GoodsDetail.vue') },
        { path: 'cart', component: () => import('@/views/mall/Cart.vue'), meta: { auth: true } },
        { path: 'order', component: () => import('@/views/mall/Order.vue'), meta: { auth: true } },
        { path: 'message', component: () => import('@/views/mall/Message.vue'), meta: { auth: true } },
        { path: 'login', component: () => import('@/views/mall/Login.vue') },
        { path: 'profile', component: () => import('@/views/mall/Profile.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      meta: { admin: true },
      children: [
        { path: 'login', component: () => import('@/views/admin/Login.vue'), meta: { admin: false } },
        { path: 'dashboard', component: () => import('@/views/admin/Dashboard.vue') },
        { path: 'goods', component: () => import('@/views/admin/GoodsManage.vue') },
        { path: 'categories', component: () => import('@/views/admin/CategoryManage.vue') },
        { path: 'banners', component: () => import('@/views/admin/BannerManage.vue') },
        { path: 'profile', component: () => import('@/views/admin/Profile.vue') },
      ],
    },
    { path: '/', redirect: '/mall/home' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const adminToken = localStorage.getItem('adminToken')

  // 前台页面：除登录页外全部需要登录
  if (to.path.startsWith('/mall') && to.path !== '/mall/login' && !token) {
    return next('/mall/login')
  }

  // 后台页面
  if (to.path.startsWith('/admin')) {
    if (to.path === '/admin/login') return next()
    if (!adminToken) return next('/admin/login')
  }

  next()
})

export default router
