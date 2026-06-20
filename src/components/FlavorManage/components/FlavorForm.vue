<template>
  <el-dialog v-model="localVisible" :title="isAdd ? '新增口味' : '编辑口味'" width="600px">
    <!-- 关键：给内部加固定上下间距，强制统一样式 -->
    <div class="flavor-form-inner">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="口味名称">
          <el-input v-model="formData.name" placeholder="例如：甜度、冰度、辣度" />
        </el-form-item>

        <el-form-item label="可选值" label-suffix=" " style="margin-bottom: 10px">
          <div
            style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center"
          >
            <el-input v-model="valueList[0]" placeholder="请输入选项" />
            <el-button size="small" type="primary" @click="addItem">+ 添加选项</el-button>

            <template v-for="(item, idx) in valueList.slice(1)" :key="idx">
              <el-input v-model="valueList[idx + 1]" placeholder="请输入选项" />
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
  // rowData 默认空对象，防止接收 null
  rowData: {
    type: Object,
    default: () => ({}),
  },
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
const formData = reactive({
  id: undefined,
  name: '',
  value: '[]',
})

// 前端友好编辑数组
const valueList = ref([])

// 添加选项
const addItem = () => valueList.value.push('')
// 删除选项
const delItem = (idx) => valueList.value.splice(idx, 1)

// 提交时转成 JSON
const submit = () => {
  // 过滤空项
  const arr = valueList.value.filter((s) => s && s.trim())
  formData.value = JSON.stringify(arr)
  emit('success', { ...formData })
  close()
}

// 编辑回填：解析 JSON 成数组
watch(
  () => props.rowData,
  (row) => {
    if (!row) return
    formData.id = row.id
    formData.name = row.name || ''
    try {
      valueList.value = JSON.parse(row.value || '[]')
    } catch {
      valueList.value = []
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
</style>
