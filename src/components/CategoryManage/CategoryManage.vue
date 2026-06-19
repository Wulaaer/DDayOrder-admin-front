<template>
  <div class="category-manager">
    <div class="search-bar">
      <el-input
        v-model="query.name"
        placeholder="分类名称"
        style="width: 200px; margin-right: 10px"
      />

      <el-button type="primary" @click="getList">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="success" style="margin-left: 10px" @click="openAdd">新增分类</el-button>
    </div>

    <el-table :data="list" border stripe style="width: 100%; margin-top: 15px">
      <el-table-column label="分类名称" prop="name" />
      <el-table-column label="排序" prop="sort" width="100" />
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

    <CategoryForm
      v-model:visible="formVisible"
      :is-add="isAdd"
      :row-data="currentRow"
      @success="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCategoryPage,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '@/api/category'
import CategoryForm from './components/CategoryForm.vue'

// 接口占位（你后面替换成真实接口名即可）
const api = {
  page: (params) => getCategoryPage(params),
  add: (data) => addCategory(data),
  update: (data) => updateCategory(data),
  delete: (id) => deleteCategory(id),
  status: (id, status) => toggleCategoryStatus(id, status),
}

// 查询条件
const query = reactive({ name: '' })
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])

// 弹窗
const formVisible = ref(false)
const isAdd = ref(true)
const currentRow = ref({})

// 获取列表
const getList = async () => {
  const res = await api.page({
    ...query,
    page: page.value,
    pageSize: pageSize.value,
  })
  if (res.code === 1) {
    list.value = res.data.records
    total.value = res.data.total
  }
}

// 重置
const resetQuery = () => {
  query.name = ''
  getList()
}

// 新增/编辑
const openAdd = () => {
  isAdd.value = true
  currentRow.value = {}
  formVisible.value = true
}
const openEdit = (row) => {
  isAdd.value = false
  currentRow.value = row
  formVisible.value = true
}

// 提交
const handleSubmit = async (formData) => {
  const res = isAdd.value ? await api.add(formData) : await api.update(formData)
  if (res.code === 1) {
    ElMessage.success('保存成功')
    getList()
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该分类？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await api.delete(row.id)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.info('已取消')
  }
}

// 切换状态
const toggleStatus = async (row) => {
  const target = row.status === 1 ? 0 : 1
  try {
    await ElMessageBox.confirm(target === 0 ? '确定禁用该分类？' : '确定启用该分类？', '提示')
    const res = await api.status(row.id, target)
    if (res.code === 1) {
      ElMessage.success('状态已更新')
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.info('已取消')
  }
}

getList()
</script>

<style scoped>
.category-manager {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.search-bar {
  margin-bottom: 15px;
}
</style>
