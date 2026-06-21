import request from '@/utils/request'

// 获取前十菜品数据
export function getSalesRanking(params) {
  return request({
    url: '/admin/report/top10',
    method: 'get',
    params,
  })
}

// 获取用户统计数据
export function getUserStatistics(params) {
  return request({
    url: '/admin/report/userStatistics',
    method: 'get',
    params,
  })
}

// 获取销售额统计数据
export function getTurnoverStatistics(params) {
  return request({
    url: '/admin/report/turnoverStatistics',
    method: 'get',
    params,
  })
}

// 获取订单统计数据
export function getOrderStatistics(params) {
  return request({
    url: '/admin/report/ordersStatistics',
    method: 'get',
    params,
  })
}

// 导出报表数据
export function exportBusinessData() {
  return request({
    url: '/admin/report/export', // 替换为实际接口路径
    method: 'get',
    responseType: 'blob',
  })
}
