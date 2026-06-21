import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      name: '',
      // 新增：过期时间戳
      tokenExpire: null,
    }
  },

  actions: {
    // 存储用户信息和token，并设置过期时间（默认 24 小时）
    setUserInfo(data) {
      this.token = data.token
      this.name = data.name

      // 设置过期时间：20小时后过期（单位毫秒）
      this.tokenExpire = Date.now() + 72000000
    },

    // 退出登录清空信息
    clearUserInfo() {
      this.token = ''
      this.name = ''
      this.tokenExpire = null
    },
  },

  // 开启本地持久化 + 自动判断过期
  persist: {
    // 只持久化需要的字段
    paths: ['token', 'name', 'tokenExpire'],

    // 从本地恢复后，检查是否过期
    afterRestore: (store) => {
      // 有过期时间，并且已经过期
      if (store.tokenExpire && Date.now() > store.tokenExpire) {
        // 清空登录态
        store.clearUserInfo()
      }
    },
  },
})
