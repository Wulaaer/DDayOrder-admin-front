import request from '@/utils/request'

// 登录接口
export function loginApi(data) {
  return request({
    url: '/admin/employee/login',
    method: 'post',
    data,
  })
}

// 修改密码接口
export function editPassword(data) {
  return request({
    url: '/admin/employee/editPassword',
    method: 'put',
    data,
  })
}

// 员工分页查询接口
export function getEmployeePage(params) {
  return request({
    url: '/admin/employee/page',
    method: 'get',
    params,
  })
}

// 员工添加接口
export function addEmployee(data) {
  return request({
    url: '/admin/employee',
    method: 'post',
    data,
  })
}

// 根据id查询员工接口
export function getEmployeeById(id) {
  return request({
    url: `/admin/employee/${id}`,
    method: 'get',
  })
}

// 员工修改接口
export function updateEmployee(data) {
  return request({
    url: '/admin/employee',
    method: 'put',
    data,
  })
}

// 员工删除接口
export function deleteEmployee(id) {
  return request({
    url: `/admin/employee/${id}`,
    method: 'delete',
  })
}

// 启用 / 禁用员工接口
export function toggleEmployeeStatus(id, status) {
  return request({
    url: `/admin/employee/status/${status}`,
    method: 'post',
    params: { id },
  })
}
