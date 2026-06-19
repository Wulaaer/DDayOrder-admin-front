import request from '@/utils/request'

// 上传图片
export function uploadImage(data) {
  return request({
    url: '/admin/common/upload',
    method: 'post',
    data,
  })
}
