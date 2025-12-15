/**
 * 系统配置 Mock 数据
 */
import type {
  SystemConfig,
  UpdateSystemConfigParams,
  SystemParamListParams,
  SystemParam,
  CreateSystemParamParams,
  UpdateSystemParamParams,
  SystemAlertListParams,
  SystemAlert,
  SystemAlertStats,
  SystemMonitorStatus,
  SystemService,
  SystemDatabaseStatus,
  SystemApiStats,
  SystemLog,
  SystemBackupListParams,
  SystemBackup,
  CreateSystemBackupParams,
  SystemBackupAutoSettings,
  SystemBackupStats,
} from '@/api/system'

// ==================== 系统配置 Mock 数据 ====================
let mockSystemConfig: SystemConfig = {
  platformName: '叨叨房车',
  platformLogo: '/logo.png',
  servicePhone: '400-888-8888',
  serviceEmail: 'service@daodao.com',
  maintenanceMode: false,
  sessionTimeout: 30,
}

export const mockGetSystemConfig = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockSystemConfig,
      })
    }, 200)
  })
}

export const mockUpdateSystemConfig = (data: UpdateSystemConfigParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockSystemConfig = { ...mockSystemConfig, ...data }
      resolve({
        code: 200,
        message: '更新成功',
      })
    }, 500)
  })
}

// ==================== 系统参数 Mock 数据 ====================
let mockSystemParams: SystemParam[] = [
  {
    id: 1,
    name: '会话超时时间',
    key: 'session_timeout',
    category: 'system',
    type: 'number',
    value: '30',
    unit: '分钟',
    defaultValue: '30',
    description: '用户会话超时时间，超时后需要重新登录',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: '订单自动取消时间',
    key: 'order_auto_cancel_time',
    category: 'business',
    type: 'number',
    value: '15',
    unit: '分钟',
    defaultValue: '15',
    description: '未支付订单自动取消时间',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'API请求限流',
    key: 'api_rate_limit',
    category: 'performance',
    type: 'number',
    value: '100',
    unit: '次/分钟',
    defaultValue: '100',
    description: '单个IP每分钟最大请求次数',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: '密码最小长度',
    key: 'password_min_length',
    category: 'security',
    type: 'number',
    value: '6',
    unit: '字符',
    defaultValue: '6',
    description: '用户密码最小长度要求',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

export const mockGetSystemParams = (params: SystemParamListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredParams = [...mockSystemParams]

      if (params.category) {
        filteredParams = filteredParams.filter((p) => p.category === params.category)
      }

      if (params.keyword) {
        filteredParams = filteredParams.filter(
          (p) => p.name.includes(params.keyword!) || p.key.includes(params.keyword!)
        )
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredParams.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredParams.length,
        },
      })
    }, 300)
  })
}

export const mockCreateSystemParam = (data: CreateSystemParamParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newParam: SystemParam = {
        id: mockSystemParams.length + 1,
        ...data,
        unit: data.unit || '',
        description: data.description || '',
        createdAt: new Date().toISOString(),
      }
      mockSystemParams.push(newParam)
      resolve({
        code: 200,
        message: '创建成功',
        data: newParam,
      })
    }, 500)
  })
}

export const mockUpdateSystemParam = (data: UpdateSystemParamParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSystemParams.findIndex((p) => p.id === data.id)
      if (index > -1) {
        mockSystemParams[index] = {
          ...mockSystemParams[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        resolve({
          code: 200,
          message: '更新成功',
        })
      } else {
        reject({
          code: 404,
          message: '参数不存在',
        })
      }
    }, 500)
  })
}

export const mockDeleteSystemParam = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSystemParams.findIndex((p) => p.id === id)
      if (index > -1) {
        mockSystemParams.splice(index, 1)
        resolve({
          code: 200,
          message: '删除成功',
        })
      } else {
        reject({
          code: 404,
          message: '参数不存在',
        })
      }
    }, 300)
  })
}

export const mockResetSystemParam = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSystemParams.findIndex((p) => p.id === id)
      if (index > -1) {
        mockSystemParams[index].value = mockSystemParams[index].defaultValue
        mockSystemParams[index].updatedAt = new Date().toISOString()
        resolve({
          code: 200,
          message: '重置成功',
        })
      } else {
        reject({
          code: 404,
          message: '参数不存在',
        })
      }
    }, 300)
  })
}

// ==================== 智能预警 Mock 数据 ====================
const mockSystemAlerts: SystemAlert[] = [
  {
    id: 1,
    title: '订单支付失败率过高',
    level: 'critical',
    type: 'business',
    message: '最近1小时订单支付失败率达到15%，超过阈值10%',
    status: 'pending',
    createdAt: '2024-12-01T10:30:00.000Z',
  },
  {
    id: 2,
    title: 'CPU使用率过高',
    level: 'warning',
    type: 'system',
    message: 'CPU使用率持续超过80%，建议检查系统负载',
    status: 'processing',
    createdAt: '2024-12-01T09:15:00.000Z',
  },
  {
    id: 3,
    title: 'API响应时间增加',
    level: 'warning',
    type: 'performance',
    message: 'API平均响应时间从200ms增加到500ms',
    status: 'resolved',
    createdAt: '2024-12-01T08:00:00.000Z',
    resolvedAt: '2024-12-01T09:00:00.000Z',
    resolvedBy: '管理员',
  },
]

export const mockGetSystemAlerts = (params: SystemAlertListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredAlerts = [...mockSystemAlerts]

      if (params.level) {
        filteredAlerts = filteredAlerts.filter((a) => a.level === params.level)
      }

      if (params.type) {
        filteredAlerts = filteredAlerts.filter((a) => a.type === params.type)
      }

      if (params.status) {
        filteredAlerts = filteredAlerts.filter((a) => a.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredAlerts.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredAlerts.length,
        },
      })
    }, 300)
  })
}

export const mockGetSystemAlertDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const alert = mockSystemAlerts.find((a) => a.id === id)
      if (alert) {
        resolve({
          code: 200,
          message: '获取成功',
          data: alert,
        })
      } else {
        reject({
          code: 404,
          message: '预警不存在',
        })
      }
    }, 200)
  })
}

export const mockResolveSystemAlert = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alert = mockSystemAlerts.find((a) => a.id === id)
      if (alert) {
        alert.status = 'resolved'
        alert.resolvedAt = new Date().toISOString()
        alert.resolvedBy = '管理员'
      }
      resolve({
        code: 200,
        message: '处理成功',
      })
    }, 300)
  })
}

export const mockIgnoreSystemAlert = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alert = mockSystemAlerts.find((a) => a.id === id)
      if (alert) {
        alert.status = 'ignored'
      }
      resolve({
        code: 200,
        message: '已忽略',
      })
    }, 300)
  })
}

export const mockGetSystemAlertStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: SystemAlertStats = {
        critical: mockSystemAlerts.filter((a) => a.level === 'critical').length,
        warning: mockSystemAlerts.filter((a) => a.level === 'warning').length,
        info: mockSystemAlerts.filter((a) => a.level === 'info').length,
        total: mockSystemAlerts.length,
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats,
      })
    }, 200)
  })
}

// ==================== 系统监控 Mock 数据 ====================
export const mockGetSystemMonitorStatus = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const status: SystemMonitorStatus = {
        cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
        memory: Math.floor(Math.random() * 30) + 50, // 50-80%
        disk: Math.floor(Math.random() * 20) + 40, // 40-60%
        network: Math.random() * 20 + 5, // 5-25 MB/s
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: status,
      })
    }, 200)
  })
}

export const mockGetSystemMonitorServices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services: SystemService[] = [
        {
          name: 'Web服务',
          status: 'running',
          uptime: '15天3小时',
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'MySQL数据库',
          status: 'running',
          uptime: '30天12小时',
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'Redis缓存',
          status: 'running',
          uptime: '30天12小时',
          lastCheck: new Date().toISOString(),
        },
      ]
      resolve({
        code: 200,
        message: '获取成功',
        data: services,
      })
    }, 200)
  })
}

export const mockGetSystemMonitorDatabase = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dbStatus: SystemDatabaseStatus = {
        activeConnections: 45,
        maxConnections: 100,
        queryPerSecond: 120,
        slowQueries: 3,
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: dbStatus,
      })
    }, 200)
  })
}

export const mockGetSystemMonitorApiStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const apiStats: SystemApiStats = {
        totalRequests: 125680,
        successRate: 99.2,
        avgResponseTime: 245,
        errorRate: 0.8,
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: apiStats,
      })
    }, 200)
  })
}

export const mockGetSystemMonitorLogs = (params: { level?: string; limit?: number }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs: SystemLog[] = [
        {
          id: 1,
          level: 'error',
          message: '数据库连接超时',
          timestamp: '2024-12-01T10:30:15.000Z',
        },
        {
          id: 2,
          level: 'warn',
          message: 'API响应时间超过500ms',
          timestamp: '2024-12-01T10:25:30.000Z',
        },
        {
          id: 3,
          level: 'info',
          message: '系统定时任务执行成功',
          timestamp: '2024-12-01T10:00:00.000Z',
        },
      ]

      let filteredLogs = logs
      if (params.level) {
        filteredLogs = logs.filter((log) => log.level === params.level)
      }

      if (params.limit) {
        filteredLogs = filteredLogs.slice(0, params.limit)
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: filteredLogs,
      })
    }, 200)
  })
}

// ==================== 数据备份 Mock 数据 ====================
let mockSystemBackups: SystemBackup[] = [
  {
    id: 1,
    name: '每日自动备份-20241201',
    type: 'full',
    status: 'success',
    size: '2.5 GB',
    compress: true,
    tables: ['users', 'orders', 'vehicles'],
    remark: '自动备份',
    createdAt: '2024-12-01T02:00:00.000Z',
  },
  {
    id: 2,
    name: '手动备份-升级前',
    type: 'full',
    status: 'success',
    size: '2.3 GB',
    compress: true,
    tables: ['users', 'orders', 'vehicles'],
    remark: '系统升级前备份',
    createdAt: '2024-11-30T15:30:00.000Z',
  },
]

export const mockGetSystemBackups = (params: SystemBackupListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredBackups = [...mockSystemBackups]

      if (params.type) {
        filteredBackups = filteredBackups.filter((b) => b.type === params.type)
      }

      if (params.status) {
        filteredBackups = filteredBackups.filter((b) => b.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredBackups.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredBackups.length,
        },
      })
    }, 300)
  })
}

export const mockCreateSystemBackup = (data: CreateSystemBackupParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBackup: SystemBackup = {
        id: mockSystemBackups.length + 1,
        name: data.name,
        type: data.type,
        status: 'processing',
        size: '0 MB',
        compress: data.compress || false,
        tables: data.tables || [],
        remark: data.remark || '',
        createdAt: new Date().toISOString(),
      }
      mockSystemBackups.unshift(newBackup)

      // 模拟备份完成
      setTimeout(() => {
        newBackup.status = 'success'
        newBackup.size = '2.4 GB'
      }, 3000)

      resolve({
        code: 200,
        message: '备份任务已创建',
        data: newBackup,
      })
    }, 500)
  })
}

export const mockRestoreSystemBackup = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '恢复任务已创建，请稍候...',
      })
    }, 1000)
  })
}

export const mockDeleteSystemBackup = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSystemBackups.findIndex((b) => b.id === id)
      if (index > -1) {
        mockSystemBackups.splice(index, 1)
        resolve({
          code: 200,
          message: '删除成功',
        })
      } else {
        reject({
          code: 404,
          message: '备份不存在',
        })
      }
    }, 300)
  })
}

export const mockVerifySystemBackup = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '备份文件验证成功',
      })
    }, 1500)
  })
}

let mockBackupAutoSettings: SystemBackupAutoSettings = {
  enabled: true,
  frequency: 'daily',
  time: '02:00',
  keepCount: 7,
  type: 'full',
}

export const mockGetSystemBackupAutoSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockBackupAutoSettings,
      })
    }, 200)
  })
}

export const mockUpdateSystemBackupAutoSettings = (data: SystemBackupAutoSettings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockBackupAutoSettings = data
      resolve({
        code: 200,
        message: '更新成功',
      })
    }, 500)
  })
}

export const mockGetSystemBackupStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: SystemBackupStats = {
        totalBackups: mockSystemBackups.length,
        totalSize: '12.5 GB',
        lastBackupTime: mockSystemBackups[0]?.createdAt || '',
        successRate: 98.5,
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats,
      })
    }, 200)
  })
}
