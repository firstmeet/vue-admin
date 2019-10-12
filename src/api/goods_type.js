import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/goods_type',
    method: 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/goods_type/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/goods_type',
    method: 'post',
    data: params
  })
}
export function deletes(id) {
  return request({
    url: '/goods_type/'+id,
    method: 'delete',
  })
}
