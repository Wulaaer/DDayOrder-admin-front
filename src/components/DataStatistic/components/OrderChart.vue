<template>
  <div class="chart-card">
    <h3 class="chart-title">订单统计</h3>
    <!-- ECharts 渲染容器，必须指定宽高 -->
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getOrderStatistics } from '@/api/report'

const props = defineProps({ dateRange: Object })
const chartRef = ref(null)
let chartInstance = null

const fetchData = async () => {
  if (!props.dateRange?.begin) return
  const res = await getOrderStatistics(props.dateRange)
  if (res.code === 1) {
    const { dateList, orderCountList, validOrderCountList } = res.data
    chartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['订单总数', '有效订单'] },
      xAxis: { type: 'category', data: dateList.split(',') },
      yAxis: { type: 'value' },
      series: [
        { name: '订单总数', type: 'bar', data: orderCountList.split(',').map(Number) },
        { name: '有效订单', type: 'bar', data: validOrderCountList.split(',').map(Number) },
      ],
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
