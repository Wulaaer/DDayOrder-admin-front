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
import { ref, reactive, watch, onMounted } from 'vue'
import { getCategoryList } from '@/api/category' // 换成你真实路径

const props = defineProps({
  visible: Boolean,
  isAdd: Boolean,
  rowData: Object,
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
})

// 分类下拉数据
const categoryList = ref([])

// 打开表单时加载分类列表
onMounted(async () => {
  const res = await getCategoryList()
  if (res.code === 1) {
    categoryList.value = res.data
  }
})

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
