import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetPermissionList,
  mockGetPermissionTree,
  mockUpdatePermission,
  mockGetMenuPermissionList,
  mockUpdateMenuPermission,
  mockGetDataPermissionList,
  mockUpdateDataPermission,
} from '@/mock/permission'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.DEV

// ==================== 权限配置 ====================
export interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  path?: string
  method?: string
  description: string
  parentId: number | null
  sort: number
  enabled: boolean
  createdAt: string
}

export interface PermissionListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: string
  enabled?: boolean
}

export interface UpdatePermissionParams {
  id: number
  name?: string
  description?: string
  enabled?: boolean
  sort?: number
}

// ==================== 菜单权限 ====================
export interface MenuPermission {
  id: number
  menuId: number
  menuName: string
  menuPath: string
  roleId: number
  roleName: string
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canExport: boolean
  createdAt: string
}

export interface MenuPermissionListParams {
  page?: number
  pageSize?: number
  roleId?: number
  menuId?: number
}

export interface UpdateMenuPermissionParams {
  id: number
  canView?: boolean
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canExport?: boolean
}

// ==================== 数据权限 ====================
export interface DataPermission {
  id: number
  roleId: number
  roleName: string
  resourceType: 'user' | 'order' | 'vehicle' | 'store'
  resourceName: string
  scope: 'all' | 'department' | 'store' | 'self'
  scopeName: string
  conditions: string
  enabled: boolean
  createdAt: string
}

export interface DataPermissionListParams {
  page?: number
  pageSize?: number
  roleId?: number
  resourceType?: string
}

export interface UpdateDataPermissionParams {
  id: number
  scope?: string
  conditions?: string
  enabled?: boolean
}

// ==================== API 接口 ====================
export const permissionApi = {
  // 权限配置
  getPermissionList: (params: PermissionListParams) => {
    if (USE_MOCK) {
      return mockGetPermissionList(params) as Promise<ApiResponse<{ list: Permission[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: Permission[]; total: number }>>('/permissions', params)
  },

  getPermissionTree: () => {
    if (USE_MOCK) {
      return mockGetPermissionTree() as Promise<ApiResponse<Permission[]>>
    }
    return request.get<ApiResponse<Permission[]>>('/permissions/tree')
  },

  updatePermission: (data: UpdatePermissionParams) => {
    if (USE_MOCK) {
      return mockUpdatePermission(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/permissions/${data.id}`, data)
  },

  // 菜单权限
  getMenuPermissionList: (params: MenuPermissionListParams) => {
    if (USE_MOCK) {
      return mockGetMenuPermissionList(params) as Promise<ApiResponse<{ list: MenuPermission[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: MenuPermission[]; total: number }>>('/permissions/menu', params)
  },

  updateMenuPermission: (data: UpdateMenuPermissionParams) => {
    if (USE_MOCK) {
      return mockUpdateMenuPermission(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/permissions/menu/${data.id}`, data)
  },

  // 数据权限
  getDataPermissionList: (params: DataPermissionListParams) => {
    if (USE_MOCK) {
      return mockGetDataPermissionList(params) as Promise<ApiResponse<{ list: DataPermission[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: DataPermission[]; total: number }>>('/permissions/data', params)
  },

  updateDataPermission: (data: UpdateDataPermissionParams) => {
    if (USE_MOCK) {
      return mockUpdateDataPermission(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/permissions/data/${data.id}`, data)
  },
}
