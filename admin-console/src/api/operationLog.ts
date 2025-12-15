// @ts-nocheck
import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetOperationLogList,
  mockGetOperationLogDetail,
  mockExportOperationLogs,
  mockCleanOperationLogs,
} from '@/mock/operationLogs'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// 操作日志API接口类型定义
export interface OperationLogListParams {
  page?: number
  pageSize?: number
  operator?: string
  module?: 'user' | 'role' | 'permission' | 'vehicle' | 'order'
  action?: 'create' | 'update' | 'delete' | 'query'
  startDate?: string
  endDate?: string
}

export interface OperationLog {
  id: number
  operator: string
  operatorAvatar: string
  module: string
  action: string
  description: string
  ip: string
  userAgent: string
  status: 'success' | 'failed'
  duration: number
  requestParams: string
  responseData: string
  createdAt: string
}

export interface OperationLogListResponse {
  list: OperationLog[]
  total: number
  page: number
  pageSize: number
}

export const operationLogApi = {
  // 获取操作日志列表
  getOperationLogList: (params: OperationLogListParams) => {
    if (USE_MOCK) {
      return mockGetOperationLogList(params) as Promise<ApiResponse<OperationLogListResponse>>
    }
    return request.get<ApiResponse<OperationLogListResponse>>('/operation-logs', params)
  },

  // 获取操作日志详情
  getOperationLogDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetOperationLogDetail(id) as Promise<ApiResponse<OperationLog>>
    }
    return request.get<ApiResponse<OperationLog>>(`/operation-logs/${id}`)
  },

  // 导出操作日志
  exportOperationLogs: () => {
    if (USE_MOCK) {
      return mockExportOperationLogs() as Promise<ApiResponse<{ url: string }>>
    }
    return request.post<ApiResponse<{ url: string }>>('/operation-logs/export')
  },

  // 清理操作日志
  cleanOperationLogs: (beforeDate: string) => {
    if (USE_MOCK) {
      return mockCleanOperationLogs(beforeDate) as Promise<ApiResponse<{ cleanedCount: number }>>
    }
    return request.delete<ApiResponse<{ cleanedCount: number }>>('/operation-logs/clean', { params: { beforeDate } })
  },
}
