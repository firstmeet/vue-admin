import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/category',
    method: 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/category/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/category',
    method: 'post',
    data: params
  })
}
export function deletes(id) {
  return request({
    url: '/category/'+id,
    method: 'delete',
  })
}
