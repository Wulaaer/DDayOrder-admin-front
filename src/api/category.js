import request from '@/utils/request'

// 分类分页接口
export function getCategoryPage(params) {
  return request({
    url: '/admin/category/page',
    method: 'get',
    params,
  })
}

// 分类添加接口
export function addCategory(data) {
  return request({
    url: '/admin/category',
    method: 'post',
    data,
  })
}

// 分类修改接口
export function updateCategory(data) {
  return request({
    url: '/admin/category',
    method: 'put',
    data,
  })
}

// 分类删除接口
export function deleteCategory(id) {
  return request({
    url: `/admin/category`,
    method: 'delete',
    params: { id },
  })
}

// 分类状态修改接口
export function toggleCategoryStatus(id, status) {
  return request({
    url: `/admin/category/status/${status}`,
    method: 'post',
    params: { id },
  })
}
