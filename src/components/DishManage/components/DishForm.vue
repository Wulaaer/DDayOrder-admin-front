<template>
  <el-dialog v-model="localVisible" :title="isAdd ? '新增菜品' : '编辑菜品'" width="550px">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="菜品名称">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>

      <!-- 分类下拉框 -->
      <el-form-item label="菜品分类">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="口味">
        <!-- 选择器 + 按钮 一行 -->
        <div
          style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; width: 100%"
        >
          <el-select
            placeholder="选择口味模板"
            style="flex: 1; width: 0"
            v-model="selectedFlavorTpl"
          >
            <el-option v-for="t in flavorList" :key="t.id" :label="t.name" :value="t" />
          </el-select>
          <el-button @click="addFlavorTpl">添加模板</el-button>
          <el-button type="primary" @click="addFlavor">+ 新建口味</el-button>
        </div>

        <!-- 已添加口味：每行一个，带编辑+删除 -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%">
          <div
            v-for="(f, idx) in formData.flavors"
            :key="idx"
            style="display: flex; align-items: center; gap: 8px"
          >
            <div style="flex: 1; padding: 4px 10px; border: 1px solid #eee; border-radius: 4px">
              {{ f.name }}: {{ JSON.parse(f.value || '[]').join(' / ') }}
            </div>
            <el-button @click="editFlavor(idx)">编辑</el-button>
            <el-button type="danger" @click="formData.flavors.splice(idx, 1)">删除</el-button>
          </div>
        </div>
      </el-form-item>

      <!-- 口味弹窗 -->
      <FlavorForm
        v-model:visible="flavorFormVisible"
        :is-add="isAddFlavor"
        :row-data="currentEditFlavor"
        @success="handleFlavorEditSuccess"
      />

      <el-form-item label="价格">
        <el-input v-model.number="formData.price" placeholder="0.00" />
      </el-form-item>

      <el-form-item label="图片">
        <div style="display: flex; align-items: center; gap: 15px">
          <div
            v-if="previewUrl"
            style="
              width: 80px;
              height: 80px;
              border: 1px solid #eee;
              border-radius: 6px;
              overflow: hidden;
            "
          >
            <el-image :src="previewUrl" fit="cover" style="width: 100%; height: 100%" />
          </div>
          <el-button type="primary" @click="chooseImage">选择图片</el-button>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
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
import FlavorForm from '@/components/FlavorManage/components/FlavorForm.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: Boolean,
  isAdd: Boolean,
  rowData: Object,
  categoryList: {
    type: Array,
    default: () => [],
  },
  flavorList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:visible', 'success'])

// 弹窗
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
  categoryId: '',
  price: 0.0,
  image: '',
  flavors: [],
})

const flavorFormVisible = ref(false)
const isAddFlavor = ref(true)
const currentEditFlavor = ref({})
const selectedFlavorTpl = ref('')

// 点击【添加模板】
const addFlavorTpl = () => {
  const tpl = selectedFlavorTpl.value
  if (!tpl) {
    ElMessage.warning('请先选择口味模板')
    return
  }
  // 追加进去
  formData.flavors.push(tpl)
}

// 点击添加口味：可以从 flavorList 选一个回填进去
const addFlavor = () => {
  isAddFlavor.value = true
  currentEditFlavor.value = {}
  flavorFormVisible.value = true
}

// 编辑口味
const editFlavor = (idx) => {
  isAddFlavor.value = false
  const item = formData.flavors[idx]
  // 构造 FlavorForm 需要的格式
  currentEditFlavor.value = {
    index: idx, // 记录当前编辑的是哪个口味（通过索引定位）
    name: item.name,
    value: item.value,
  }
  flavorFormVisible.value = true
}

// 编辑后更新对应项
const handleFlavorEditSuccess = (flavor) => {
  if (isAddFlavor.value) {
    // 新增口味：追加到数组末尾
    formData.flavors.push(flavor)
  } else {
    // 编辑口味：根据索引更新对应项
    const idx = currentEditFlavor.value.index
    if (idx !== undefined) {
      formData.flavors[idx] = flavor
    }
  }
  flavorFormVisible.value = false
}

// 图片预览相关
const fileInput = ref(null)
const localFile = ref(null)
const previewUrl = ref('')

const chooseImage = () => fileInput.value.click()

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  localFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// 提交：把 formData + file 一起抛给父组件
const submit = () => {
  emit('success', {
    ...formData,
    file: localFile.value,
  })
  close()
}

const close = () => (localVisible.value = false)

// 回填编辑
watch(
  () => props.rowData,
  (val) => {
    if (val) {
      Object.assign(formData, val)
      previewUrl.value = val.image || ''
      localFile.value = null
    }
  },
  { deep: true },
)

// 新增重置
watch(
  () => props.visible,
  (val) => {
    if (val && props.isAdd) {
      Object.assign(formData, {
        id: undefined,
        name: '',
        categoryId: '',
        price: 0.0,
        image: '',
      })
      previewUrl.value = ''
      localFile.value = null
    }
  },
)
</script>
