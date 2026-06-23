<template>
  <div class="order-container">
    <!-- 查询条件 -->
    <div class="query-bar" style="margin-bottom: 15px">
      <el-input
        v-model="query.number"
        placeholder="订单编号"
        style="width: 220px; margin-right: 10px"
      />

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="margin-right: 10px"
      />

      <el-button type="primary" @click="getPage">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
    </div>

    <el-tabs v-model="activeStatus" @tab-change="handleTabChange" :disabled="loading">
      <el-tab-pane label="已支付" name="2" />
      <el-tab-pane label="已完成" name="3" />
      <el-tab-pane label="待支付" name="1" />
      <el-tab-pane label="已取消" name="4" />
      <el-tab-pane label="全部订单" name="all" />
    </el-tabs>

    <!-- 表格 -->
    <!-- 1. 添加 table-layout="fixed" 使每行高度一致且列宽平均 -->
    <el-table :data="list" border table-layout="fixed" style="width: 100%; margin-top: 15px">
      <el-table-column label="下单时间" prop="orderTime" width="180" />
      <el-table-column label="桌号" prop="tableNumber" width="100" />

      <!-- 2. 添加 show-overflow-tooltip，文字过多时自动省略并显示 tooltip -->
      <el-table-column label="订单金额" prop="amount" width="120">
        <template #default="{ row }">
          <span style="color: #f56c6c; font-weight: bold">￥{{ row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用餐人数" prop="userNum" width="100" />

      <el-table-column label="订单状态" width="100">
        <template #default="{ row }">
          <el-tag :type="tagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 备注列：内容可能很长，必须加上省略提示 -->
      <el-table-column label="备注" prop="remark" show-overflow-tooltip />

      <!-- 3. 调整操作列：添加完成和拒绝按钮，并适当加宽 -->
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
          <!-- 只有待支付(1)或已支付(2)的订单才显示拒绝按钮 -->

          <el-button
            v-if="row.status === 1 || row.status === 2"
            type="danger"
            size="small"
            @click="handleReject(row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getPage"
      @current-change="getPage"
      style="margin-top: 15px; text-align: right"
    />

    <!-- 详情弹窗组件调用 -->
    <OrderDetail v-model:visible="detailVisible" :orderId="currentOrderId" @refresh="getPage" />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderPage, rejectOrder } from '@/api/order' // 4. 导入接口
import OrderDetail from './components/OrderDetail.vue' // 5. 导入订单详情组件
import { onMounted, onUnmounted } from 'vue'
import { wsClient } from '@/utils/websocket'

const query = reactive({
  number: null,
  beginTime: null,
  endTime: null,
  status: '2',
})

const dateRange = ref([])
const activeStatus = ref('2')
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const total = ref(0)

let unsubscribe = null

onMounted(() => {
  // 订阅WebSocket消息
  unsubscribe = wsClient.subscribe((msg) => {
    // 假设后端推送格式: { type: 'NEW_ORDER', orderId: 'xxx' }
    if (msg.type === 1) {
      // 1. 弹出提示音/通知
      // ElNotification({
      //   title: '🔔 新订单提醒',
      //   message: `您有一个新订单，请及时处理！`,
      //   type: 'success',
      //   duration: 5000
      // });

      // 2. 自动刷新当前列表（如果当前在"已支付"或"全部"标签页）
      if (activeStatus.value === '2' || activeStatus.value === 'all') {
        getPage()
      }
    }
  })
})

onUnmounted(() => unsubscribe?.())

const detailVisible = ref(false)
const currentOrderId = ref(null)
const loading = ref(false)

function statusText(status) {
  if (status === 1) return '待支付'
  if (status === 2) return '已支付'
  if (status === 3) return '已完成'
  if (status === 4) return '已取消'
  return '未知'
}

function tagType(status) {
  if (status === 1) return 'warning'
  if (status === 2) return 'success'
  if (status === 3) return 'info'
  if (status === 4) return 'danger'
  return ''
}

watch(dateRange, (val) => {
  if (val && val.length === 2) {
    query.beginTime = val[0]
    query.endTime = val[1]
  } else {
    query.beginTime = null
    query.endTime = null
  }
})

function handleTabChange(newName) {
  if (loading.value) return
  page.value = 1
  query.status = newName === 'all' ? null : newName
  getPage()
}

async function getPage() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getOrderPage({
      page: page.value,
      pageSize: pageSize.value,
      ...query,
    })
    list.value = res.data.records || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  if (loading.value) return
  query.number = null
  query.status = '2'
  dateRange.value = []
  page.value = 1
  getPage()
}

function viewDetail(row) {
  currentOrderId.value = row.id
  detailVisible.value = true
  console.log('查看订单详情, 订单ID:', row.id)
}

// 6. 拒绝订单逻辑
async function handleReject(row) {
  try {
    await ElMessageBox.confirm('确定要拒绝该订单吗？', '提示', { type: 'warning' })
    await rejectOrder({ id: row.id })
    ElMessage.success('订单已拒绝')
    getPage() // 刷新列表
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('操作失败')
  }
}

getPage()
</script>
