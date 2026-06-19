<template>
  <div class="user-manager">
    <div class="search-bar">
      <el-input v-model="query.name" placeholder="姓名" style="width: 180px; margin-right: 10px" />

      <el-button type="primary" @click="getList">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="success" style="margin-left: 10px" @click="openAdd">新增员工</el-button>
    </div>

    <el-table :data="list" border stripe style="width: 100%">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="账号名" prop="username" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">{{ row.sex === '1' ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column label="角色">
        <template #default="{ row }">{{ row.role === '1' ? '管理员' : '普通员工' }}</template>
      </el-table-column>
      <el-table-column label="状态">
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
            @click="toggleStatus(row.id, row.status)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      background
      layout="total, sizes, prev, pager, next"
      style="margin-top: 20px; text-align: right"
      @size-change="getList"
      @current-change="getList"
    />

    <UserForm
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
  getEmployeePage,
  addEmployee,
  deleteEmployee,
  getEmployeeById,
  updateEmployee,
  toggleEmployeeStatus,
} from '@/api/employee'
// 子组件路径
import UserForm from './components/UserFrom.vue'

const api = {
  page: (params) => getEmployeePage(params),
  getById: (id) => getEmployeeById(id),
  add: (data) => addEmployee(data),
  update: (data) => updateEmployee(data),
  delete: (id) => deleteEmployee(id),
  status: (id, status) => toggleEmployeeStatus(id, status),
}

const query = reactive({ name: '' })
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])

const formVisible = ref(false)
const isAdd = ref(true)
const currentRow = ref({})

const getList = async () => {
  const res = await api.page({ ...query, page: page.value, pageSize: pageSize.value })
  if (res.code === 1) {
    list.value = res.data.records
    total.value = res.data.total
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
  isAdd.value = false
  currentRow.value = row
  formVisible.value = true
}

const handleSubmit = async (formData) => {
  const res = isAdd.value ? await api.add(formData) : await api.update(formData)
  if (res.code === 1) {
    ElMessage.success('保存成功')
    getList()
  }
}

// 删除确认
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认永久删除该员工?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await api.delete(id)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 状态切换确认
const toggleStatus = async (id, status) => {
  const targetStatus = status === 1 ? 0 : 1
  const tipText = targetStatus === 0 ? '确定要禁用该员工吗？' : '确定要启用该员工吗？'

  try {
    await ElMessageBox.confirm(tipText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await api.status(id, targetStatus)
    if (res.code === 1) {
      ElMessage.success('状态更新成功')
      getList()
    } else {
      ElMessage.error(res.msg || '状态更新失败')
    }
  } catch {
    ElMessage.info('已取消操作')
  }
}

getList()
</script>

<style scoped>
.user-manager {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.search-bar {
  margin-bottom: 20px;
}
</style>
