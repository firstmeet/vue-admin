import request from '@/utils/request'
import {getToken, setToken} from "../utils/auth";

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    headers: {
      'Authorization':"Bearer "+token
    }
  })
}

export function logout() {
   setToken("")
}
export function userList() {
  return request({
    url: '/user/',
    method: 'post',
    headers: {
      'Authorization':getToken()
    }
  })
}
export function update(row){
  return request({
    url:"/user/"+row.id,
    method:"put",
    headers:{
      'Authorization':getToken()
    },
    data:row
  })
}
export function fetchUser(name) {
  return request({
    url:"/user/show",
    method:"post",
    headers:{
      'Authorization':getToken()
    },
    data:{name:name}
  })
}
