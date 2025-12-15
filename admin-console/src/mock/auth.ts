/**
 * 认证相关 Mock 数据
 */
import type { User } from '@/types/user'
import { UserRole } from '@/types/permission'

// Mock 用户数据
export const mockUsers: Record<string, User> = {
  '13800138000': {
    id: 1,
    username: '平台管理员',
    email: 'admin@daodao.com',
    phone: '13800138000',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: UserRole.PLATFORM_ADMIN,
    permissions: ['*'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  '13800138001': {
    id: 2,
    username: '区域经理',
    email: 'regional@daodao.com',
    phone: '13800138001',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: UserRole.REGIONAL_MANAGER,
    permissions: ['region:*', 'store:*', 'order:*', 'vehicle:*'],
    status: 'active',
    regionId: 'region-001',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  '13800138002': {
    id: 3,
    username: '门店经理',
    email: 'store@daodao.com',
    phone: '13800138002',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: UserRole.STORE_MANAGER,
    permissions: ['store:view', 'order:*', 'vehicle:view'],
    status: 'active',
    storeId: 'store-001',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  '13800138003': {
    id: 4,
    username: '门店员工',
    email: 'staff@daodao.com',
    phone: '13800138003',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: UserRole.STORE_STAFF,
    permissions: ['order:view', 'vehicle:view'],
    status: 'active',
    storeId: 'store-001',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
}

// Mock 登录
export const mockLogin = (phone: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 简单验证：任何密码都接受（开发环境）
      const user = mockUsers[phone]

      if (!user) {
        reject({
          code: 401,
          message: '用户不存在',
        })
        return
      }

      // 生成 Mock Token
      const token = `mock-token-${user.id}-${Date.now()}`

      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token,
          user,
        },
      })
    }, 500) // 模拟网络延迟
  })
}

// Mock 获取用户信息
export const mockGetUserInfo = (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 从 token 中提取用户 ID
      const match = token.match(/mock-token-(\d+)/)
      if (!match) {
        reject({
          code: 401,
          message: 'Token 无效',
        })
        return
      }

      const userId = parseInt(match[1])
      const user = Object.values(mockUsers).find(u => u.id === userId)

      if (!user) {
        reject({
          code: 401,
          message: '用户不存在',
        })
        return
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: user,
      })
    }, 300)
  })
}

// Mock 登出
export const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '登出成功',
      })
    }, 200)
  })
}
