<template>
  <el-dialog v-model="localVisible" :title="isAdd ? '新增口味' : '编辑口味'" width="700px">
    <div class="flavor-form-inner">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="口味名称">
          <el-input v-model="formData.name" placeholder="例如：甜度、冰度、辣度" />
        </el-form-item>

        <el-form-item label="可选值" label-suffix=" " style="margin-bottom: 10px">
          <div class="flavor-grid">
            <!-- 表头 -->
            <div class="grid-header">选项名称</div>
            <div class="grid-header">加价金额</div>
            <div class="grid-header">操作</div>

            <!-- 第一行（带添加按钮） -->
            <el-input v-model="valueList[0]" placeholder="请输入选项" />
            <el-input v-model="priceList[0]" placeholder="0" />
            <el-button size="small" type="primary" @click="addItem">+ 添加</el-button>

            <!-- 动态渲染后续行 -->
            <template v-for="(item, idx) in valueList.slice(1)" :key="idx">
              <el-input v-model="valueList[idx + 1]" placeholder="请输入选项" />
              <el-input v-model="priceList[idx + 1]" placeholder="0" />
              <el-button size="small" type="danger" @click="delItem(idx + 1)">删除</el-button>
            </template>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  isAdd: Boolean,
  rowData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible', 'success'])
const localVisible = ref(false)

watch(
  () => props.visible,
  (v) => (localVisible.value = v),
  { immediate: true },
)
watch(localVisible, (v) => emit('update:visible', v))

// 提交给后端的结构
const formData = reactive({ id: undefined, name: '', value: '[]', price: '[]' })

// 前端友好编辑数组
const valueList = ref([])
const priceList = ref([])

const addItem = () => {
  valueList.value.push('')
  priceList.value.push('')
}

const delItem = (idx) => {
  valueList.value.splice(idx, 1)
  priceList.value.splice(idx, 1)
}

// 提交时转成 JSON
const submit = () => {
  const arr = valueList.value.filter((s) => s && s.trim())
  const pArr = priceList.value.filter((s) => s !== undefined && s !== '')
  formData.value = JSON.stringify(arr)
  formData.price = JSON.stringify(pArr)
  emit('success', { ...formData })
  close()
}

// 编辑回填
watch(
  () => props.rowData,
  (row) => {
    if (!row) return
    formData.id = row.id
    formData.name = row.name || ''
    try {
      valueList.value = JSON.parse(row.value || '[]')
      priceList.value = JSON.parse(row.price || '[]')
    } catch {
      valueList.value = []
      priceList.value = []
    }
  },
  { deep: true },
)

// 新增重置
watch(
  () => props.visible,
  (v) => {
    if (v && props.isAdd) {
      formData.name = ''
      valueList.value = ['']
      priceList.value = ['']
    }
  },
)

const close = () => (localVisible.value = false)
</script>

<style scoped>
.flavor-form-inner {
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

.flavor-grid {
  display: grid;
  grid-template-columns: 1fr 120px auto;
  gap: 8px;
  align-items: center;
}

.grid-header {
  font-weight: bold;
  color: #606266;
  font-size: 13px;
}
</style>
