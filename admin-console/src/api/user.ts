import request from './request'

// 用户列表查询参数
export interface UserListParams {
  page?: number
  pageSize?: number
  search?: string
  userType?: string
  status?: string
}

// 用户信息
export interface User {
  id: number
  phone: string
  username: string
  user_type: 'customer' | 'mobile_admin' | 'pc_admin'
  status: 'active' | 'inactive' | 'banned'
  created_at: string
  updated_at: string
  last_login_at: string
}

// 用户列表响应
export interface UserListResponse {
  code: number
  message: string
  data: {
    users: User[]
    total: number
    page: number
    pageSize: number
  }
}

// 获取用户列表
export function getUserList(params: UserListParams) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetail(id: number) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 更新用户信息
export interface UpdateUserParams {
  username?: string
  user_type?: 'customer' | 'mobile_admin' | 'pc_admin'
  status?: 'active' | 'inactive' | 'banned'
}

export function updateUser(id: number, data: UpdateUserParams) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id: number) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 批量删除用户
export function batchDeleteUsers(ids: number[]) {
  return request({
    url: '/users/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 更新用户状态
export function updateUserStatus(id: number, status: string) {
  return request({
    url: `/users/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 重置用户密码
export function resetUserPassword(id: number, password: string) {
  return request({
    url: `/users/${id}/reset-password`,
    method: 'post',
    data: { password }
  })
}

