<template>
  <div class="flavor-manager" style="padding: 20px; background: #fff; border-radius: 8px">
    <div style="margin-bottom: 15px">
      <el-button type="success" @click="openAdd">新增口味模板</el-button>
    </div>

    <el-table :data="list" border stripe>
      <el-table-column label="口味名称" prop="name" width="150" />

      <el-table-column label="可选值" min-width="250">
        <template #default="{ row }">
          <span v-for="(item, idx) in safeParse(row.value)" :key="idx">
            <el-tag size="small" style="margin-right: 4px">{{ item }}</el-tag>
          </span>
        </template>
      </el-table-column>

      <!-- 新增：价格列 -->
      <el-table-column label="加价金额" min-width="200">
        <template #default="{ row }">
          <span v-for="(item, idx) in safeParse(row.price)" :key="idx">
            <el-tag size="small" type="warning" style="margin-right: 4px">
              ￥{{ item || '0' }}
            </el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <div style="display: flex; gap: 6px">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <FlavorForm
      v-model:visible="formVisible"
      :is-add="isAdd"
      :row-data="currentRow"
      @success="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FlavorForm from './components/FlavorForm.vue'
import { getFlavorList, addFlavor, updateFlavor, deleteFlavor } from '@/api/flavor'

const api = {
  list: () => getFlavorList(),
  add: (data) => addFlavor(data),
  update: (data) => updateFlavor(data),
  delete: (id) => deleteFlavor(id),
}

const list = ref([])
const formVisible = ref(false)
const isAdd = ref(true)
const currentRow = ref({})

// 安全解析 JSON 工具函数
const safeParse = (str) => {
  try {
    return JSON.parse(str || '[]')
  } catch {
    return []
  }
}

const getList = async () => {
  const res = await api.list()
  if (res.code === 1) list.value = res.data
}

const openAdd = () => {
  isAdd.value = true
  currentRow.value = {}
  formVisible.value = true
}

const openEdit = (row) => {
  isAdd.value = false
  currentRow.value = { ...row }
  formVisible.value = true
}

const handleSubmit = async (data) => {
  const res = isAdd.value ? await api.add(data) : await api.update(data)
  if (res.code === 1) {
    ElMessage.success('保存成功')
    getList()
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该口味模板？')
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

getList()
</script>
