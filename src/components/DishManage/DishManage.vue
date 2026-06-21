<template>
  <div class="dish-manager">
    <div class="search-bar">
      <el-input
        v-model="query.name"
        placeholder="菜品名称"
        style="width: 200px; margin-right: 10px"
      />

      <el-select
        v-model="query.categoryId"
        placeholder="菜品分类"
        style="width: 200px; margin-right: 10px"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-button type="primary" @click="getList">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="success" style="margin-left: 10px" @click="openAdd">新增菜品</el-button>
    </div>

    <el-table :data="list" border stripe style="width: 100%; margin-top: 15px">
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image :src="row.image" fit="cover" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="菜品名称" prop="name" />
      <el-table-column label="分类名称" prop="categoryName" width="100" />
      <el-table-column label="搭配分类" prop="recCategoryName" width="100" />
      <el-table-column label="排序" prop="sortInCategory" width="100" />
      <el-table-column label="价格" prop="price" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 1 ? 'warning' : 'success'"
            @click="toggleStatus(row)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next"
      style="margin-top: 20px; text-align: right"
      @current-change="getList"
    >
      <template #total="{ pageSize }"> {{ pageSize }} 条/页，共 {{ total }} 条 </template>
    </el-pagination>

    <DishForm
      v-model:visible="formVisible"
      :is-add="isAdd"
      :row-data="currentRow"
      :category-list="categoryList"
      :flavor-list="flavorList"
      @success="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DishForm from './components/DishForm.vue'
import {
  getDishPage,
  addDish,
  updateDish,
  deleteDish,
  toggleDishStatus,
  getDishById,
} from '@/api/dish'
import { uploadImage } from '@/api/common'
import { getCategoryList } from '@/api/category'
import { getFlavorList } from '@/api/flavor'

// 接口占位
const api = {
  page: (params) => getDishPage(params),
  add: (data) => addDish(data),
  update: (data) => updateDish(data),
  delete: (id) => deleteDish(id),
  status: (id, status) => toggleDishStatus(id, status),
  getCategoryList: () => getCategoryList(),
  getFlavorList: () => getFlavorList(),
  getDishById: (id) => getDishById(id),
}

const query = reactive({
  name: '',
  categoryId: '',
})
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])

const formVisible = ref(false)
const isAdd = ref(true)
const currentRow = ref({})
const categoryList = ref([])
const flavorList = ref([])

const getList = async () => {
  // 分页查询菜品列表
  const res = await api.page({
    ...query,
    page: page.value,
    pageSize: pageSize.value,
  })
  if (res.code === 1) {
    list.value = res.data.records
    total.value = res.data.total
  }

  // 加载分类列表
  const categoryRes = await api.getCategoryList()
  if (categoryRes.code === 1) {
    categoryList.value = categoryRes.data
  }
  // 加载口味列表
  const flavorRes = await api.getFlavorList()
  if (flavorRes.code === 1) {
    flavorList.value = flavorRes.data
  }
}

const resetQuery = () => {
  query.name = ''
  getList()
}

const openAdd = () => {
  isAdd.value = true
  currentRow.value = {}
  formVisible.value = true
}
const openEdit = (row) => {
  api.getDishById(row.id).then((res) => {
    if (res.code === 1) {
      currentRow.value = res.data
    }
  })
  isAdd.value = false
  formVisible.value = true
}

const handleSubmit = async (formData) => {
  try {
    let imageUrl = formData.image

    // 如果有新选择的图片，先上传
    if (formData.file) {
      const formUpload = new FormData()
      formUpload.append('file', formData.file)
      const res = await uploadImage(formUpload) // 你的OSS上传接口

      if (res.code !== 1) {
        ElMessage.error('图片上传失败')
        return
      }
      imageUrl = res.data
    }

    // 构造最终要保存的数据
    const submitData = {
      ...formData,
      image: imageUrl,
    }
    delete submitData.file // 不要把 file 带给后端

    // 新增或更新
    const res = isAdd.value ? await api.add(submitData) : await api.update(submitData)

    if (res.code === 1) {
      ElMessage.success('保存成功')
      getList()
    }
  } catch (e) {
    ElMessage.error('操作失败')
    console.error(e)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该菜品？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await api.delete(row.id)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  } catch {
    ElMessage.info('已取消')
  }
}

const toggleStatus = async (row) => {
  const target = row.status === 1 ? 0 : 1
  try {
    await ElMessageBox.confirm(target === 0 ? '确定禁用该菜品？' : '确定启用该菜品？', '提示')
    const res = await api.status(row.id, target)
    if (res.code === 1) {
      ElMessage.success('状态更新成功')
      getList()
    }
  } catch {
    ElMessage.info('已取消')
  }
}

getList()
</script>

<style scoped>
.dish-manager {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.search-bar {
  margin-bottom: 15px;
}
</style>
