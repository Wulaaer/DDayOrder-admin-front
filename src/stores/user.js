import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      username: '',
    }
  },
  actions: {
    // 存储用户信息和token
    setUserInfo(data) {
      this.token = data.token
      this.username = data.username
    },
    // 退出登录清空信息
    clearUserInfo() {
      this.token = ''
      this.username = ''
    },
  },
  // 开启本地持久化，自动存入localStorage
  persist: true,
})
