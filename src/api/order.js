import request from '@/utils/request'

// 订单分页查询
export function getOrderPage(params) {
  return request({
    url: '/admin/order/conditionSearch',
    method: 'get',
    params,
  })
}

// 查询订单详情
export function getOrderDetail(id) {
  return request({
    url: `/admin/order/details/${id}`,
    method: 'get',
  })
}

// 完成订单
export function completeOrder(id) {
  return request({
    url: `/admin/order/complete/${id}`,
    method: 'put',
  })
}

// 拒绝订单
export function rejectOrder(data) {
  return request({
    url: '/admin/order/rejection/',
    method: 'put',
    data,
  })
}
