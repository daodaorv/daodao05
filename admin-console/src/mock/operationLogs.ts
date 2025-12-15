/**
 * 操作日志 Mock 数据
 */
import type { OperationLog, OperationLogListParams } from '@/api/operationLog'

// Mock 操作日志数据
const mockOperationLogs: OperationLog[] = [
  {
    id: 1,
    operator: '管理员',
    operatorAvatar: '',
    module: 'user',
    action: 'create',
    description: '创建用户：张三',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 125,
    requestParams: '{"username":"张三","phone":"13800138000"}',
    responseData: '{"code":200,"message":"创建成功"}',
    createdAt: '2024-11-30T10:30:00.000Z',
  },
  {
    id: 2,
    operator: '区域经理',
    operatorAvatar: '',
    module: 'role',
    action: 'update',
    description: '更新角色权限：门店经理',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 89,
    requestParams: '{"roleId":3,"permissions":["user:view","order:view"]}',
    responseData: '{"code":200,"message":"更新成功"}',
    createdAt: '2024-11-30T09:15:00.000Z',
  },
  {
    id: 3,
    operator: '门店经理',
    operatorAvatar: '',
    module: 'vehicle',
    action: 'delete',
    description: '删除车辆：京A12345',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'failed',
    duration: 45,
    requestParams: '{"vehicleId":123}',
    responseData: '{"code":403,"message":"权限不足"}',
    createdAt: '2024-11-30T08:00:00.000Z',
  },
  {
    id: 4,
    operator: '平台管理员',
    operatorAvatar: '',
    module: 'permission',
    action: 'update',
    description: '配置角色权限：区域经理',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 156,
    requestParams: '{"roleId":2,"menuPermissions":["/dashboard","/users"],"functionPermissions":["user:view"]}',
    responseData: '{"code":200,"message":"配置成功"}',
    createdAt: '2024-11-30T07:45:00.000Z',
  },
  {
    id: 5,
    operator: '门店员工',
    operatorAvatar: '',
    module: 'order',
    action: 'query',
    description: '查询订单列表',
    ip: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 67,
    requestParams: '{"page":1,"pageSize":10}',
    responseData: '{"code":200,"message":"获取成功","data":{"total":50}}',
    createdAt: '2024-11-30T07:30:00.000Z',
  },
]

// Mock 获取操作日志列表
export const mockGetOperationLogList = (params: OperationLogListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredLogs = [...mockOperationLogs]

      // 操作人搜索
      if (params.operator) {
        filteredLogs = filteredLogs.filter((log) => log.operator.includes(params.operator!))
      }

      // 模块筛选
      if (params.module) {
        filteredLogs = filteredLogs.filter((log) => log.module === params.module)
      }

      // 操作类型筛选
      if (params.action) {
        filteredLogs = filteredLogs.filter((log) => log.action === params.action)
      }

      // 日期范围筛选
      if (params.startDate && params.endDate) {
        filteredLogs = filteredLogs.filter((log) => {
          const logDate = new Date(log.createdAt)
          return logDate >= new Date(params.startDate!) && logDate <= new Date(params.endDate!)
        })
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredLogs.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredLogs.length,
          page,
          pageSize,
        },
      })
    }, 300)
  })
}

// Mock 获取操作日志详情
export const mockGetOperationLogDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const log = mockOperationLogs.find((l) => l.id === id)
      if (log) {
        resolve({
          code: 200,
          message: '获取成功',
          data: log,
        })
      } else {
        reject({
          code: 404,
          message: '日志不存在',
        })
      }
    }, 200)
  })
}

// Mock 导出操作日志
export const mockExportOperationLogs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '导出成功',
        data: {
          url: '/exports/operation-logs.xlsx',
        },
      })
    }, 1000)
  })
}

// Mock 清理操作日志
export const mockCleanOperationLogs = (_beforeDate: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '清理成功',
        data: {
          cleanedCount: 100,
        },
      })
    }, 1500)
  })
}
