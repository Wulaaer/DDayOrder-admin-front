import request from '@/utils/request'

// 查询全部
export function getFlavorList() {
  return request({
    url: '/admin/flavor/list',
    method: 'get',
  })
}

// 新增
export function addFlavor(data) {
  return request({
    url: '/admin/flavor',
    method: 'post',
    data,
  })
}

// 修改
export function updateFlavor(data) {
  return request({
    url: '/admin/flavor',
    method: 'put',
    data,
  })
}

// 删除
export function deleteFlavor(id) {
  return request({
    url: `/admin/flavor/${id}`,
    method: 'delete',
  })
}
