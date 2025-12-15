import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetRoleList,
  mockGetRoleDetail,
  mockCreateRole,
  mockUpdateRole,
  mockDeleteRole,
  mockConfigRolePermissions,
  mockGetRoleUsers,
} from '@/mock/roles'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// 角色管理API接口类型定义
export interface RoleListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'active' | 'inactive'
}

export interface Role {
  id: number
  name: string
  code: string
  type: 'platform_admin' | 'regional_manager' | 'store_manager' | 'store_staff'
  description: string
  dataScope: 'all' | 'region' | 'store' | 'self'
  userCount: number
  status: 'active' | 'inactive'
  isSystem: boolean
  createdAt: string
  updatedAt?: string
}

export interface RoleListResponse {
  list: Role[]
  total: number
  page: number
  pageSize: number
}

export interface CreateRoleParams {
  name: string
  code: string
  type: 'platform_admin' | 'regional_manager' | 'store_manager' | 'store_staff'
  description?: string
  dataScope: 'all' | 'region' | 'store' | 'self'
  status?: 'active' | 'inactive'
}

export interface UpdateRoleParams {
  id: number
  name?: string
  type?: 'platform_admin' | 'regional_manager' | 'store_manager' | 'store_staff'
  description?: string
  dataScope?: 'all' | 'region' | 'store' | 'self'
  status?: 'active' | 'inactive'
}

export interface ConfigPermissionsParams {
  roleId: number
  menuPermissions: string[]
  functionPermissions: string[]
}

export interface RoleUser {
  id: number
  username: string
  realName: string
  phone: string
  department: string
  status: 'active' | 'inactive'
}

export const roleApi = {
  // 获取角色列表
  getRoleList: (params: RoleListParams) => {
    if (USE_MOCK) {
      return mockGetRoleList(params) as Promise<ApiResponse<RoleListResponse>>
    }
    return request.get<ApiResponse<RoleListResponse>>('/roles', params)
  },

  // 获取角色详情
  getRoleDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetRoleDetail(id) as Promise<ApiResponse<Role>>
    }
    return request.get<ApiResponse<Role>>(`/roles/${id}`)
  },

  // 创建角色
  createRole: (data: CreateRoleParams) => {
    if (USE_MOCK) {
      return mockCreateRole(data) as Promise<ApiResponse<Role>>
    }
    return request.post<ApiResponse<Role>>('/roles', data)
  },

  // 更新角色信息
  updateRole: (data: UpdateRoleParams) => {
    if (USE_MOCK) {
      return mockUpdateRole(data) as Promise<ApiResponse<Role>>
    }
    return request.put<ApiResponse<Role>>(`/roles/${data.id}`, data)
  },

  // 删除角色
  deleteRole: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteRole(id) as Promise<ApiResponse>
    }
    return request.delete<ApiResponse>(`/roles/${id}`)
  },

  // 配置角色权限
  configRolePermissions: (data: ConfigPermissionsParams) => {
    if (USE_MOCK) {
      return mockConfigRolePermissions(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/roles/${data.roleId}/permissions`, data)
  },

  // 获取角色下的用户列表
  getRoleUsers: (roleId: number, params?: { page?: number; pageSize?: number }) => {
    if (USE_MOCK) {
      return mockGetRoleUsers(roleId, params) as Promise<ApiResponse<{ list: RoleUser[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: RoleUser[]; total: number }>>(`/roles/${roleId}/users`, params)
  },
}
