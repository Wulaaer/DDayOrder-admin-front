import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 前往登录页直接放行
  if (to.path === '/login') return next()
  // 无token强制跳转登录页
  if (!userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
