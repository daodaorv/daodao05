import { request } from '@/utils/request'
import type { LoginForm, ApiResponse, User } from '@/types/user'
import { mockLogin, mockGetUserInfo, mockLogout } from '@/mock/auth'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

export const authApi = {
  // 登录
  login: (data: LoginForm) => {
    if (USE_MOCK) {
      return mockLogin(data.username, data.password) as Promise<ApiResponse<{ token: string; user: User }>>
    }
    return request.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      phone: data.username,
      password: data.password,
    })
  },

  // 登出
  logout: () => {
    if (USE_MOCK) {
      return mockLogout() as Promise<ApiResponse>
    }
    return request.post<ApiResponse>('/auth/logout')
  },

  // 获取用户信息
  getUserInfo: () => {
    if (USE_MOCK) {
      const token = localStorage.getItem('token') || ''
      return mockGetUserInfo(token) as Promise<ApiResponse<User>>
    }
    return request.get<ApiResponse<User>>('/auth/me')
  },

  // 刷新token
  refreshToken: () =>
    request.post<ApiResponse<{ token: string }>>('/auth/refresh'),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    request.post<ApiResponse>('/auth/change-password', data),
}