import request from '@/utils/request'

// 菜品分页接口
export function getDishPage(params) {
  return request({
    url: '/admin/dish/page',
    method: 'get',
    params,
  })
}

// 根据分类id查询菜品
export function getDishesByCategoryId(categoryId) {
  return request({
    url: '/admin/dish/list',
    method: 'get',
    params: { categoryId },
  })
}

// 菜品添加接口
export function addDish(data) {
  return request({
    url: '/admin/dish',
    method: 'post',
    data,
  })
}

// 菜品修改接口
export function updateDish(data) {
  return request({
    url: '/admin/dish',
    method: 'put',
    data,
  })
}

// 菜品删除接口
export function deleteDish(id) {
  return request({
    url: `/admin/dish`,
    method: 'delete',
    params: { ids: id },
  })
}

// 菜品启售/停售接口
export function toggleDishStatus(id, status) {
  return request({
    url: `/admin/dish/status/${status}`,
    method: 'post',
    params: { id },
  })
}
