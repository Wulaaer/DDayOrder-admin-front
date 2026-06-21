<template>
  <!-- 给父容器加上全屏布局的 class -->
  <div class="report-container">
    <!-- 1. 顶部全局时间筛选区 -->
    <div class="filter-bar">
      <el-radio-group v-model="timeRange" @change="handleTimeChange">
        <el-radio-button label="today">本日</el-radio-button>
        <el-radio-button label="yesterday">昨日</el-radio-button>
        <el-radio-button label="thisWeek">本周</el-radio-button>
        <el-radio-button label="thisMonth">本月</el-radio-button>
        <el-radio-button label="week">近七日</el-radio-button>
        <el-radio-button label="month">近三十日</el-radio-button>
      </el-radio-group>

      <el-date-picker
        v-model="customDateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        style="margin-left: 15px"
        @change="handleTimeChange"
      />

      <!-- 2. 导出按钮 -->
      <el-button type="success" @click="handleExport" style="margin-left: 360px">
        导出近30天报表
      </el-button>
    </div>

    <!-- 2. 统计图表网格布局 -->
    <div class="chart-grid">
      <TurnoverChart :date-range="currentDateRange" />
      <UserChart :date-range="currentDateRange" />
      <OrderChart :date-range="currentDateRange" />
      <SalesRanking :date-range="currentDateRange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportBusinessData } from '@/api/report'
import TurnoverChart from './components/TurnoverChart.vue'
import UserChart from './components/UserChart.vue'
import OrderChart from './components/OrderChart.vue'
import SalesRanking from './components/SalesRanking.vue'

// 默认选中“本日”
const timeRange = ref('today')
const customDateRange = ref([])

// 核心：根据快捷按钮动态计算真实的日期范围
const currentDateRange = computed(() => {
  // 1. 如果用户选择了自定义日期范围，优先使用自定义的
  if (customDateRange.value && customDateRange.value.length === 2) {
    return { begin: customDateRange.value[0], end: customDateRange.value[1] }
  }

  // 2. 日期格式化辅助函数
  const formatDate = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const today = new Date()
  let beginDate = new Date()

  if (timeRange.value === 'today') {
    // 本日：今天到今天
    return { begin: formatDate(today), end: formatDate(today) }
  } else if (timeRange.value === 'yesterday') {
    // 昨日：昨天到昨天
    beginDate.setDate(today.getDate() - 1)
    return { begin: formatDate(beginDate), end: formatDate(beginDate) }
  } else if (timeRange.value === 'thisWeek') {
    // 本周：从本周一到今天
    // getDay() 返回 0(周日) - 6(周六)，如果是周日则往前推6天，否则往前推 (getDay()-1) 天
    const day = today.getDay() || 7
    beginDate.setDate(today.getDate() - day + 1)
    return { begin: formatDate(beginDate), end: formatDate(today) }
  } else if (timeRange.value === 'thisMonth') {
    // 本月：从本月1号到今天
    beginDate = new Date(today.getFullYear(), today.getMonth(), 1)
    return { begin: formatDate(beginDate), end: formatDate(today) }
  } else if (timeRange.value === 'week') {
    // 近七日：包含今天往前推6天
    beginDate.setDate(today.getDate() - 6)
    return { begin: formatDate(beginDate), end: formatDate(today) }
  } else if (timeRange.value === 'month') {
    // 近三十日：包含今天往前推29天
    beginDate.setDate(today.getDate() - 29)
    return { begin: formatDate(beginDate), end: formatDate(today) }
  }

  // 兜底返回今天
  return { begin: formatDate(today), end: formatDate(today) }
})

const handleTimeChange = () => {
  // 切换快捷按钮时，必须清空自定义日期，让 computed 走快捷按钮的计算逻辑
  customDateRange.value = []
}

async function handleExport() {
  try {
    // 1. 导出前二次确认（对应原代码的 this.$confirm）
    await ElMessageBox.confirm('是否确认导出最近30天运营数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 2. 请求接口获取 Blob 数据
    const data = await exportBusinessData()

    // 3. 创建临时链接并触发下载（对应原代码的 createObjectURL 逻辑）
    const url = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = '运营数据统计报表.xlsx' // 直接硬编码，彻底杜绝 undefined
    document.body.appendChild(a)
    a.click()

    // 4. 清理内存与 DOM
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    ElMessage.success('导出成功')
  } catch (error) {
    // 用户点击“取消”时不报错，仅处理真实异常
    if (error !== 'cancel' && error?.toString() !== 'cancel') {
      ElMessage.error(error.message || '导出失败，请稍后重试')
    }
  }
}
</script>

<style scoped>
/* 1. 父容器：占满可用高度，使用 Flex 纵向布局 */
.report-container {
  padding: 20px;
  height: 100%; /* 确保撑满父级路由容器 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box; /* 防止 padding 撑破高度 */
  overflow: hidden; /* 防止出现页面级滚动条 */
}

/* 2. 顶部筛选区：固定高度，不参与拉伸 */
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 关键：防止被挤压 */
}

/* 3. 图表网格：占据剩余所有空间，并均分给子元素 */
.chart-grid {
  flex: 1; /* 关键：自动填满剩余高度 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr); /* 关键：让两行图表均分高度 */
  gap: 20px;
  min-height: 0; /* 关键：防止 Grid 内容撑破父容器 */
}

/* 4. 响应式：小屏幕下变单列 */
@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr); /* 单列时，4个图表均分高度 */
  }
}
</style>
