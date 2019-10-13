import request from '@/utils/request'

export function getList(params) {
	var pag=params.pag==0?params.pag:1
  return request({
    url: '/spec?goods_type_id='+params.goods_type_id+'&current_page='+params.current_page+"&page_size="+params.page_size+"&pag="+pag,
    method: 'get',
  })
}

export function update(params) {
  return request({
    url: '/spec/' + params.id,
    method: 'put',
    data: params
  })
}
export function create(params) {
  return request({
    url: '/spec',
    method: 'post',
    data: params
  })
}
export function deletes(id) {
  return request({
    url: '/spec/'+id,
    method: 'delete',
  })
}
export function findByType(goods_type_id) {
  return request({
    url: '/spec/find?goods_type_id='+goods_type_id,
    method: 'get',
  })
}
