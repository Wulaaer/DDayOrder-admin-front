// src/utils/websocket.js
class WsClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.listeners = new Set() // 消息订阅者集合
    this.reconnectTimer = null
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => console.log('✅ WS已连接')
    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        this.listeners.forEach((cb) => cb(data)) // 广播给所有订阅者
      } catch (err) {
        console.error('消息解析失败', err)
      }
    }
    this.ws.onclose = () => {
      console.warn('❌ WS断开，3秒后重连...')
      this.reconnectTimer = setTimeout(() => this.connect(), 3000)
    }
  }

  // 供页面/Store订阅消息
  subscribe(callback) {
    this.listeners.add(callback)
    // 返回取消订阅函数，防止内存泄漏
    return () => this.listeners.delete(callback)
  }

  destroy() {
    clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.listeners.clear()
  }
}

//  待替换为真实店铺ID和后端地址
const shopId = '10086'
export const wsClient = new WsClient(`ws://localhost:8080/ws/${shopId}`)
