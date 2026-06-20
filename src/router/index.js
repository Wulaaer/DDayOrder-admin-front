import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import HomeView from '../views/HomeView.vue'

// 引入管理组件
import UserManage from '../components/UserManage/UserManage.vue'
import CategoryManage from '../components/CategoryManage/CategoryManage.vue'
import DishManage from '../components/DishManage/DishManage.vue'
import FlavorManage from '../components/FlavorManage/FlavorManage.vue'
import OrderManage from '../components/OrderManage.vue'
import DataManage from '../components/DataStatistic.vue'

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
      // 子路由：内容区显示的页面
      // 加上这一行
      redirect: '/order',
      children: [
        { path: 'user', component: UserManage },
        { path: 'category', component: CategoryManage },
        { path: 'dish', component: DishManage },
        { path: 'flavor', component: FlavorManage },
        { path: 'order', component: OrderManage },
        { path: 'data', component: DataManage },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
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
