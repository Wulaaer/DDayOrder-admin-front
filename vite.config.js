import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8081, // 修改本地运行端口
    open: true, // 启动项目自动打开浏览器
    proxy: {
      // 后端接口跨域代理
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true, // 开启跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉 /api 前缀
      },
    },
  },
})
