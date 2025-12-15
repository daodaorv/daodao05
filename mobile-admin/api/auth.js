/**
 * 认证相关API
 */
import { get, post } from '@/utils/request'
import mockAuth from './mock/auth'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 登录
 */
export function login(data) {
  if (USE_MOCK) {
    return mockAuth.login(data)
  }
  return post('/api/v1/auth/login', data)
}

/**
 * 登出
 */
export function logout() {
  if (USE_MOCK) {
    return mockAuth.logout()
  }
  return post('/api/v1/auth/logout')
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  if (USE_MOCK) {
    return mockAuth.getUserInfo()
  }
  return get('/api/v1/auth/user')
}

/**
 * 刷新Token
 */
export function refreshToken() {
  if (USE_MOCK) {
    return mockAuth.refreshToken()
  }
  return post('/api/v1/auth/refresh')
}

export default {
  login,
  logout,
  getUserInfo,
  refreshToken
}
