import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      name: '',
    }
  },
  actions: {
    // 存储用户信息和token
    setUserInfo(data) {
      this.token = data.token
      this.name = data.name
    },
    // 退出登录清空信息
    clearUserInfo() {
      this.token = ''
      this.name = ''
    },
  },
  // 开启本地持久化，自动存入localStorage
  persist: true,
})
