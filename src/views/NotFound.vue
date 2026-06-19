<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面不存在或已被移除</p>
      <button @click="goHome" class="back-btn">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

h1 {
  font-size: 80px;
  margin: 0;
  color: #1977f3;
}

p {
  font-size: 16px;
  color: #666;
  margin: 10px 0 30px;
}

.back-btn {
  padding: 10px 24px;
  background-color: #1977f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #1368d8;
}
</style>
