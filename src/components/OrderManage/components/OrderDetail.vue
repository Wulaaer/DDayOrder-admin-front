<template>
  <el-dialog v-model="visible" title="订单详情" width="750px" destroy-on-close @close="handleClose">
    <div v-loading="loading">
      <!-- 1. 订单基础信息 -->
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="订单编号">{{ detail.number }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="tagType(detail.status)">{{ statusText(detail.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="桌号">{{ detail.tableNumber }}</el-descriptions-item>
        <el-descriptions-item label="用餐人数">{{ detail.userNum }} 人</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ detail.orderTime }}</el-descriptions-item>
        <el-descriptions-item label="结账时间">{{
          detail.checkoutTime || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="订单金额" :span="2">
          <span style="color: #f56c6c; font-weight: bold">￥{{ detail.amount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          detail.remark || '无'
        }}</el-descriptions-item>
      </el-descriptions>

      <!-- 2. 菜品明细信息 -->
      <div style="margin-top: 20px">
        <h4 style="margin-bottom: 10px">菜品明细</h4>
        <el-table :data="detail.orderDetailList || []" border size="small">
          <el-table-column label="菜品名称" prop="dishName" show-overflow-tooltip />
          <el-table-column label="口味/规格" prop="dishFlavor" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.dishFlavor || '默认' }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="number" width="80" align="center" />
          <el-table-column label="单价" prop="amount" width="100" align="center">
            <template #default="{ row }">￥{{ row.amount }}</template>
          </el-table-column>
          <el-table-column label="小计" width="100" align="center">
            <template #default="{ row }">￥{{ (row.amount * row.number).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 3. 底部操作区 -->
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <!-- 只有已支付(2)状态才显示完成订单按钮 -->
      <el-button
        v-if="detail.status === 2"
        type="primary"
        :loading="completing"
        @click="handleComplete"
      >
        完成订单
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderDetail, completeOrder } from '@/api/order' // 确保导入了详情和完成接口

const props = defineProps({
  visible: Boolean,
  orderId: [String, Number],
})

const emit = defineEmits(['update:visible', 'refresh'])

const loading = ref(false)
const completing = ref(false)
const detail = ref({})

// 2. 定义计算属性来代理 visible
const visible = computed({
  get() {
    // 读取父组件传来的 props
    console.log('visible getter called, props.visible:', props.visible)
    return props.visible
  },
  set(newValue) {
    // 当 el-dialog 想要修改值时，不直接修改，而是通过事件通知父组件
    emit('update:visible', newValue)
  },
})

// 监听弹窗打开和 orderId 变化，获取详情
watch(
  () => [props.visible, props.orderId],
  async ([newvisible, newId]) => {
    if (newvisible && newId) {
      loading.value = true
      try {
        const res = await getOrderDetail(newId)
        // 根据实际接口返回结构赋值，这里假设 res.data 就是详情对象
        detail.value = res.data || res
      } catch (e) {
        ElMessage.error('获取订单详情失败')
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  },
)

// 完成订单逻辑
async function handleComplete() {
  try {
    await ElMessageBox.confirm('确认该订单已完成用餐并结账吗？', '提示', { type: 'warning' })
    completing.value = true
    await completeOrder(detail.value.id)
    ElMessage.success('订单已完成')
    emit('update:visible', false)
    emit('refresh') // 通知父组件刷新列表
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('操作失败')
  } finally {
    completing.value = false
  }
}

// 弹窗关闭时清空数据
function handleClose() {
  detail.value = {}
}

// 状态映射函数
function statusText(status) {
  const map = { 1: '待支付', 2: '已支付', 3: '已完成', 4: '已取消' }
  return map[status] || '未知'
}

function tagType(status) {
  const map = { 1: 'warning', 2: 'success', 3: 'info', 4: 'danger' }
  return map[status] || ''
}
</script>
