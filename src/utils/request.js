import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 有 token 就自动带到请求头
    if (userStore.token) {
      config.headers['token'] = userStore.token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 401 代表未登录/过期
    if (res.code === 401) {
      const userStore = useUserStore()
      userStore.clearUserInfo()
      router.push('/login')
      return Promise.reject('登录已过期')
    }

    return res
  },
  (error) => {
    console.error('请求异常：', error)
    return Promise.reject(error)
  },
)

export default service
