<template>
  <div class="chart-card">
    <h3 class="chart-title">销量前十菜品</h3>
    <!-- ECharts 渲染容器，必须指定宽高 -->
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSalesRanking } from '@/api/report' // 注意：这里调用的是 top10 接口

const props = defineProps({ dateRange: Object })
const chartRef = ref(null)
let chartInstance = null

const fetchData = async () => {
  if (!props.dateRange?.begin) return
  const res = await getSalesRanking(props.dateRange)
  if (res.code === 1) {
    const { nameList, numberList } = res.data
    // 销量排名通常需要倒序，让第一名在最上面
    const names = nameList.split(',').reverse()
    const numbers = numberList.split(',').map(Number).reverse()

    chartInstance.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: names }, // Y轴是商品名称
      series: [
        {
          type: 'bar',
          data: numbers,
          itemStyle: { color: '#409EFF' },
        },
      ],
      grid: { left: '15%' }, // 留出左侧空间显示商品名
    })
  }
}

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  fetchData()
})
watch(() => props.dateRange, fetchData, { deep: true })
onUnmounted(() => chartInstance?.dispose())
</script>

<style scoped>
.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 100%; /* 关键：让卡片撑满 Grid 单元格 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.chart-title {
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}
</style>
