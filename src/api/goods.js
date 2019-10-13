import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/goods?current_page='+params.current_page+"&page_size="+params.page_size,
    method: 'get',
  })
}

export function update(params) {
  return request({
    url: '/goods/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/goods',
    method: 'post',
    data: params
  })
}
export function deletes(id) {
  return request({
    url: '/goods/'+id,
    method: 'delete',
  })
}
export function getInfo(id){
  return request({
    url: '/goods/'+id,
    method: 'get',
  })
}
