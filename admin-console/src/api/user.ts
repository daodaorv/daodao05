// @ts-nocheck
import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetUserList,
  mockGetUserDetail,
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  mockChangeUserStatus,
} from '@/mock/users'
import {
  mockGetTagList,
  mockCreateTag,
  mockUpdateTag,
  mockDeleteTag,
  mockGetUserTags,
  mockAddUserTags,
  mockRemoveUserTag
} from '@/mock/tags'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// 用户管理API接口类型定义
export interface UserListParams {
  page?: number
  pageSize?: number
  phone?: string
  username?: string
  userType?: string
  status?: string
}

// ==================== 标签系统类型定义 ====================
// 从 @/types/tag 导入类型定义，避免循环依赖
export type {
  AutoRuleConditionType,
  AutoRuleOperator,
  AutoRuleCondition,
  AutoRule,
  ApiTrigger,
  BusinessAssociation,
  MemberBenefits,
  Tag
} from '@/types/tag'

export { TagType, TagCategory, TagTriggerType } from '@/types/tag'

// 用户类型枚举（重构：移除plus_member，改为标签管理）
export type UserType = 'visitor' | 'registered' | 'customer'  // customer 保留用于向后兼容

export interface UserInfo {
  id: number
  username: string
  phone: string
  email?: string
  userType: UserType  // 只描述身份认证状态：游客/注册用户
  status: 'active' | 'inactive' | 'banned'
  realName?: string
  avatarUrl?: string
  tags?: Tag[]  // 用户标签（包含PLUS会员、VIP等标签）
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  list: UserInfo[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserParams {
  username: string
  phone: string
  password: string
  email?: string
  userType: UserType  // visitor 或 registered
  realName?: string
}

export interface UpdateUserParams {
  id: number
  username?: string
  email?: string
  userType?: UserType  // visitor 或 registered
  status?: 'active' | 'inactive' | 'banned'
  realName?: string
}

// 用户导入结果
export interface ImportUsersResult {
  success: number
  failed: number
  errors: Array<{ row: number; message: string }>
}

export const userApi = {
  // 获取用户列表
  getUserList: (params: UserListParams) => {
    if (USE_MOCK) {
      return mockGetUserList(params) as Promise<ApiResponse<UserListResponse>>
    }
    return request.get<ApiResponse<UserListResponse>>('/users', params)
  },

  // 获取用户详情
  getUserDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetUserDetail(id) as Promise<ApiResponse<UserInfo>>
    }
    return request.get<ApiResponse<UserInfo>>(`/users/${id}`)
  },

  // 创建用户
  createUser: (data: CreateUserParams) => {
    if (USE_MOCK) {
      return mockCreateUser(data) as Promise<ApiResponse<UserInfo>>
    }
    return request.post<ApiResponse<UserInfo>>('/users', data)
  },

  // 更新用户信息
  updateUser: (data: UpdateUserParams) => {
    if (USE_MOCK) {
      return mockUpdateUser(data) as Promise<ApiResponse<UserInfo>>
    }
    return request.put<ApiResponse<UserInfo>>(`/users/${data.id}`, data)
  },

  // 删除用户
  deleteUser: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteUser(id) as Promise<ApiResponse>
    }
    return request.delete<ApiResponse>(`/users/${id}`)
  },

  // 更改用户状态
  changeUserStatus: (id: number, status: 'active' | 'inactive' | 'banned') => {
    if (USE_MOCK) {
      return mockChangeUserStatus(id, status) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/users/${id}/status`, { status })
  },

  // 重置用户密码
  resetPassword: (id: number, newPassword: string) =>
    request.put<ApiResponse>(`/users/${id}/reset-password`, { password: newPassword }),

  // 用户导入
  importUsers: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    // TODO: 实现真实的导入逻辑
    return Promise.resolve({
      success: 0,
      failed: 0,
      errors: []
    } as ImportUsersResult)
  },
}

// 标签管理 API
export const tagApi = {
  // 获取标签列表
  getTagList: () => {
    if (USE_MOCK) {
      return mockGetTagList()
    }
    return request.get<Tag[]>('/tags')
  },

  // 创建标签
  createTag: (data: Partial<Tag>) => {
    if (USE_MOCK) {
      return mockCreateTag(data)
    }
    return request.post<Tag>('/tags', data)
  },

  // 更新标签
  updateTag: (id: number, data: Partial<Tag>) => {
    if (USE_MOCK) {
      return mockUpdateTag(id, data)
    }
    return request.put<Tag>(`/tags/${id}`, data)
  },

  // 删除标签
  deleteTag: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteTag(id)
    }
    return request.delete(`/tags/${id}`)
  },

  // 获取用户的标签
  getUserTags: (userId: number) => {
    if (USE_MOCK) {
      return mockGetUserTags(userId)
    }
    return request.get<Tag[]>(`/users/${userId}/tags`)
  },

  // 为用户添加标签
  addUserTags: (userId: number, tagIds: number[]) => {
    if (USE_MOCK) {
      return mockAddUserTags(userId, tagIds)
    }
    return request.post(`/users/${userId}/tags`, { tagIds })
  },

  // 移除用户标签
  removeUserTag: (userId: number, tagId: number) => {
    if (USE_MOCK) {
      return mockRemoveUserTag(userId, tagId)
    }
    return request.delete(`/users/${userId}/tags/${tagId}`)
  },
}
