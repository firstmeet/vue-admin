import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/element',
    method: 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/element/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/element',
    method: 'post',
    data: params
  })
}
