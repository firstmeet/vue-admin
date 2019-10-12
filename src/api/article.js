import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/article',
    method: 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/article/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/article',
    method: 'post',
    data: params
  })
}
