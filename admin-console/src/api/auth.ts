import request from './request'

// 登录接口
export interface LoginParams {
  phone: string
  password?: string
  code?: string
  login_type: 'password' | 'sms'
  platform?: string
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    user: {
      id: number
      phone: string
      nickname: string
      avatar: string
      role: string
    }
  }
}

export function login(data: LoginParams) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 发送验证码
export interface SendCodeParams {
  phone: string
  type: 'login' | 'register' | 'reset_password'
}

export function sendCode(data: SendCodeParams) {
  return request({
    url: '/auth/send-code',
    method: 'post',
    data
  })
}

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: '/auth/current-user',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

