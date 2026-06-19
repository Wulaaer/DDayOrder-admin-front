<template>
  <!-- 这里不再直接用 prop 的 visible，改用本地变量 -->
  <el-dialog v-model="localVisible" :title="isAdd ? '新增员工' : '编辑员工'" width="500px">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="登录账号">
        <el-input v-model="formData.username" placeholder="请输入登录账号" />
      </el-form-item>

      <el-form-item label="密码" v-if="isAdd">
        <el-input v-model="formData.password" type="password" placeholder="新增时填写密码" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="formData.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="角色">
        <el-radio-group v-model="formData.role">
          <el-radio label="1">管理员</el-radio>
          <el-radio label="2">普通员工</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  isAdd: { type: Boolean, default: true },
  rowData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible', 'success'])

const localVisible = ref(false)

watch(
  () => props.visible,
  (val) => {
    localVisible.value = val
  },
  { immediate: true },
)

watch(localVisible, (val) => {
  emit('update:visible', val)
})

const formData = reactive({
  id: undefined,
  name: '',
  username: '',
  password: '',
  phone: '',
  sex: '', // 字符串 '1'/'0'
  role: '', // 字符串 '1'/'2'
})

// 监听行数据变化回填（最可靠）
watch(
  () => props.rowData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      Object.assign(formData, newVal)
    }
  },
  { deep: true },
)

// 新增时重置
watch(
  () => props.visible,
  (val) => {
    if (!val) return
    if (props.isAdd) {
      Object.assign(formData, {
        id: undefined,
        name: '',
        username: '',
        password: '',
        phone: '',
        sex: '',
        role: '',
      })
    }
  },
)

const close = () => {
  localVisible.value = false
}

const submit = () => {
  emit('success', { ...formData })
  close()
}
</script>
