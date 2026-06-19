<template>
  <el-dialog v-model="localVisible" :title="isAdd ? '新增分类' : '编辑分类'" width="500px">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model.number="formData.sort" placeholder="数字越小越靠前" />
      </el-form-item>
    </el-form>

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
  rowData: Object,
})

const emit = defineEmits(['update:visible', 'success'])

// 弹窗本地受控
const localVisible = ref(false)
watch(
  () => props.visible,
  (val) => (localVisible.value = val),
  { immediate: true },
)
watch(localVisible, (val) => emit('update:visible', val))

// 表单
const formData = reactive({
  id: undefined,
  name: '',
  sort: 0,
})

// 回填
watch(
  () => props.rowData,
  (val) => {
    if (val) Object.assign(formData, val)
  },
  { deep: true },
)

// 重置
watch(
  () => props.visible,
  (val) => {
    if (val && props.isAdd) {
      Object.assign(formData, {
        id: undefined,
        name: '',
        sort: 0,
      })
    }
  },
)

const close = () => (localVisible.value = false)
const submit = () => {
  emit('success', { ...formData })
  close()
}
</script>
