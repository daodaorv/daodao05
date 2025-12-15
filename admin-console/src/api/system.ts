import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetSystemConfig,
  mockUpdateSystemConfig,
  mockGetSystemParams,
  mockCreateSystemParam,
  mockUpdateSystemParam,
  mockDeleteSystemParam,
  mockResetSystemParam,
  mockGetSystemAlerts,
  mockGetSystemAlertDetail,
  mockResolveSystemAlert,
  mockIgnoreSystemAlert,
  mockGetSystemAlertStats,
  mockGetSystemMonitorStatus,
  mockGetSystemMonitorServices,
  mockGetSystemMonitorDatabase,
  mockGetSystemMonitorApiStats,
  mockGetSystemMonitorLogs,
  mockGetSystemBackups,
  mockCreateSystemBackup,
  mockRestoreSystemBackup,
  mockDeleteSystemBackup,
  mockVerifySystemBackup,
  mockGetSystemBackupAutoSettings,
  mockUpdateSystemBackupAutoSettings,
  mockGetSystemBackupStats,
} from '@/mock/system'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// ==================== 系统配置 ====================
export interface SystemConfig {
  platformName: string
  platformLogo: string
  servicePhone: string
  serviceEmail: string
  maintenanceMode: boolean
  sessionTimeout: number
}

export interface UpdateSystemConfigParams {
  platformName?: string
  platformLogo?: string
  servicePhone?: string
  serviceEmail?: string
  maintenanceMode?: boolean
  sessionTimeout?: number
}

// ==================== 系统参数 ====================
export interface SystemParamListParams {
  page?: number
  pageSize?: number
  category?: 'system' | 'business' | 'performance' | 'security'
  keyword?: string
}

export interface SystemParam {
  id: number
  name: string
  key: string
  category: 'system' | 'business' | 'performance' | 'security'
  type: string
  value: string
  unit: string
  defaultValue: string
  description: string
  createdAt: string
  updatedAt?: string
}

export interface CreateSystemParamParams {
  name: string
  key: string
  category: 'system' | 'business' | 'performance' | 'security'
  type: string
  value: string
  unit?: string
  defaultValue: string
  description?: string
}

export interface UpdateSystemParamParams {
  id: number
  name?: string
  value?: string
  description?: string
}

// ==================== 智能预警 ====================
export interface SystemAlertListParams {
  page?: number
  pageSize?: number
  level?: 'critical' | 'warning' | 'info'
  type?: 'business' | 'system' | 'performance' | 'security'
  status?: 'pending' | 'processing' | 'resolved' | 'ignored'
}

export interface SystemAlert {
  id: number
  title: string
  level: 'critical' | 'warning' | 'info'
  type: 'business' | 'system' | 'performance' | 'security'
  message: string
  status: 'pending' | 'processing' | 'resolved' | 'ignored'
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface SystemAlertStats {
  critical: number
  warning: number
  info: number
  total: number
}

// ==================== 系统监控 ====================
export interface SystemMonitorStatus {
  cpu: number
  memory: number
  disk: number
  network: number
}

export interface SystemService {
  name: string
  status: 'running' | 'stopped' | 'error'
  uptime: string
  lastCheck: string
}

export interface SystemDatabaseStatus {
  activeConnections: number
  maxConnections: number
  queryPerSecond: number
  slowQueries: number
}

export interface SystemApiStats {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  errorRate: number
}

export interface SystemLog {
  id: number
  level: 'error' | 'warn' | 'info'
  message: string
  timestamp: string
}

// ==================== 数据备份 ====================
export interface SystemBackupListParams {
  page?: number
  pageSize?: number
  type?: 'full' | 'incremental' | 'differential'
  status?: 'success' | 'failed' | 'processing'
}

export interface SystemBackup {
  id: number
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'success' | 'failed' | 'processing'
  size: string
  compress: boolean
  tables: string[]
  remark: string
  createdAt: string
}

export interface CreateSystemBackupParams {
  name: string
  type: 'full' | 'incremental' | 'differential'
  compress?: boolean
  tables?: string[]
  remark?: string
}

export interface SystemBackupAutoSettings {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  keepCount: number
  type: 'full' | 'incremental' | 'differential'
}

export interface SystemBackupStats {
  totalBackups: number
  totalSize: string
  lastBackupTime: string
  successRate: number
}

// ==================== API 接口 ====================
export const systemApi = {
  // 系统配置
  getSystemConfig: () => {
    if (USE_MOCK) {
      return mockGetSystemConfig() as Promise<ApiResponse<SystemConfig>>
    }
    return request.get<ApiResponse<SystemConfig>>('/system/config')
  },

  updateSystemConfig: (data: UpdateSystemConfigParams) => {
    if (USE_MOCK) {
      return mockUpdateSystemConfig(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>('/system/config', data)
  },

  // 系统参数
  getSystemParams: (params: SystemParamListParams) => {
    if (USE_MOCK) {
      return mockGetSystemParams(params) as Promise<ApiResponse<{ list: SystemParam[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: SystemParam[]; total: number }>>('/system/params', params)
  },

  createSystemParam: (data: CreateSystemParamParams) => {
    if (USE_MOCK) {
      return mockCreateSystemParam(data) as Promise<ApiResponse<SystemParam>>
    }
    return request.post<ApiResponse<SystemParam>>('/system/params', data)
  },

  updateSystemParam: (data: UpdateSystemParamParams) => {
    if (USE_MOCK) {
      return mockUpdateSystemParam(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/system/params/${data.id}`, data)
  },

  deleteSystemParam: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteSystemParam(id) as Promise<ApiResponse>
    }
    return request.delete<ApiResponse>(`/system/params/${id}`)
  },

  resetSystemParam: (id: number) => {
    if (USE_MOCK) {
      return mockResetSystemParam(id) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/system/params/${id}/reset`)
  },

  // 智能预警
  getSystemAlerts: (params: SystemAlertListParams) => {
    if (USE_MOCK) {
      return mockGetSystemAlerts(params) as Promise<ApiResponse<{ list: SystemAlert[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: SystemAlert[]; total: number }>>('/system/alerts', params)
  },

  getSystemAlertDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetSystemAlertDetail(id) as Promise<ApiResponse<SystemAlert>>
    }
    return request.get<ApiResponse<SystemAlert>>(`/system/alerts/${id}`)
  },

  resolveSystemAlert: (id: number) => {
    if (USE_MOCK) {
      return mockResolveSystemAlert(id) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/system/alerts/${id}/resolve`)
  },

  ignoreSystemAlert: (id: number) => {
    if (USE_MOCK) {
      return mockIgnoreSystemAlert(id) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/system/alerts/${id}/ignore`)
  },

  getSystemAlertStats: () => {
    if (USE_MOCK) {
      return mockGetSystemAlertStats() as Promise<ApiResponse<SystemAlertStats>>
    }
    return request.get<ApiResponse<SystemAlertStats>>('/system/alerts/stats')
  },

  // 系统监控
  getSystemMonitorStatus: () => {
    if (USE_MOCK) {
      return mockGetSystemMonitorStatus() as Promise<ApiResponse<SystemMonitorStatus>>
    }
    return request.get<ApiResponse<SystemMonitorStatus>>('/system/monitor/status')
  },

  getSystemMonitorServices: () => {
    if (USE_MOCK) {
      return mockGetSystemMonitorServices() as Promise<ApiResponse<SystemService[]>>
    }
    return request.get<ApiResponse<SystemService[]>>('/system/monitor/services')
  },

  getSystemMonitorDatabase: () => {
    if (USE_MOCK) {
      return mockGetSystemMonitorDatabase() as Promise<ApiResponse<SystemDatabaseStatus>>
    }
    return request.get<ApiResponse<SystemDatabaseStatus>>('/system/monitor/database')
  },

  getSystemMonitorApiStats: () => {
    if (USE_MOCK) {
      return mockGetSystemMonitorApiStats() as Promise<ApiResponse<SystemApiStats>>
    }
    return request.get<ApiResponse<SystemApiStats>>('/system/monitor/api-stats')
  },

  getSystemMonitorLogs: (params: { level?: string; limit?: number }) => {
    if (USE_MOCK) {
      return mockGetSystemMonitorLogs(params) as Promise<ApiResponse<SystemLog[]>>
    }
    return request.get<ApiResponse<SystemLog[]>>('/system/monitor/logs', params)
  },

  // 数据备份
  getSystemBackups: (params: SystemBackupListParams) => {
    if (USE_MOCK) {
      return mockGetSystemBackups(params) as Promise<ApiResponse<{ list: SystemBackup[]; total: number }>>
    }
    return request.get<ApiResponse<{ list: SystemBackup[]; total: number }>>('/system/backups', params)
  },

  createSystemBackup: (data: CreateSystemBackupParams) => {
    if (USE_MOCK) {
      return mockCreateSystemBackup(data) as Promise<ApiResponse<SystemBackup>>
    }
    return request.post<ApiResponse<SystemBackup>>('/system/backups', data)
  },

  restoreSystemBackup: (id: number) => {
    if (USE_MOCK) {
      return mockRestoreSystemBackup(id) as Promise<ApiResponse>
    }
    return request.post<ApiResponse>(`/system/backups/${id}/restore`)
  },

  deleteSystemBackup: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteSystemBackup(id) as Promise<ApiResponse>
    }
    return request.delete<ApiResponse>(`/system/backups/${id}`)
  },

  verifySystemBackup: (id: number) => {
    if (USE_MOCK) {
      return mockVerifySystemBackup(id) as Promise<ApiResponse>
    }
    return request.post<ApiResponse>(`/system/backups/${id}/verify`)
  },

  getSystemBackupAutoSettings: () => {
    if (USE_MOCK) {
      return mockGetSystemBackupAutoSettings() as Promise<ApiResponse<SystemBackupAutoSettings>>
    }
    return request.get<ApiResponse<SystemBackupAutoSettings>>('/system/backups/auto-settings')
  },

  updateSystemBackupAutoSettings: (data: SystemBackupAutoSettings) => {
    if (USE_MOCK) {
      return mockUpdateSystemBackupAutoSettings(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>('/system/backups/auto-settings', data)
  },

  getSystemBackupStats: () => {
    if (USE_MOCK) {
      return mockGetSystemBackupStats() as Promise<ApiResponse<SystemBackupStats>>
    }
    return request.get<ApiResponse<SystemBackupStats>>('/system/backups/stats')
  },
}
