<script setup>
const menus = [
  { key: 'user', name: '用户管理', icon: '👤' },
  { key: 'category', name: '分类管理', icon: '📁' },
  { key: 'dish', name: '菜品管理', icon: '🍽️' },
  { key: 'order', name: '订单管理', icon: '📋' },
  { key: 'data', name: '数据统计', icon: '📊' },
]
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="logo">订餐后台管理系统</div>
      <div class="user-info">你好，管理员</div>
    </header>

    <div class="container">
      <aside class="sidebar">
        <div class="menu-list">
          <!-- 路由跳转 -->
          <router-link v-for="item in menus" :key="item.key" :to="item.key" class="menu-item">
            <span class="icon">{{ item.icon }}</span>
            <span class="title">{{ item.name }}</span>
          </router-link>
        </div>
      </aside>

      <!-- 路由出口：切换组件的位置 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 关键：强制这个布局占满整个屏幕，不受外面限制 */
.layout {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.header {
  height: 60px;
  background: #1977f3;
  color: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.user-info {
  font-size: 14px;
}

.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e6eb;
  padding: 12px 0;
  overflow-y: auto;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #e8f3ff;
  color: #1977f3;
}

.menu-item.active {
  background: #1977f3;
  color: white;
}

.icon {
  font-size: 16px;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
