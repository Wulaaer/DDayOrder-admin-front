import request from '@/utils/request'

// 登录接口
export function loginApi(data) {
  return request({
    url: '/admin/employee/login',
    method: 'post',
    data,
  })
}
