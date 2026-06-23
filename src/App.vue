<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { wsClient } from '@/utils/websocket'

onMounted(() => wsClient.connect())
onUnmounted(() => wsClient.destroy())
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
