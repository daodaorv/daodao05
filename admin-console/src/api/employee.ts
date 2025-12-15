import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetEmployeeList,
  mockGetEmployeeDetail,
  mockCreateEmployee,
  mockUpdateEmployee,
  mockChangeEmployeeStatus,
  mockAssignEmployeeRoles,
  mockExportEmployees,
  mockImportEmployees,
  mockGetEmployeePerformanceList,
  mockGetEmployeePerformanceStats,
} from '@/mock/employees'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// 员工管理API接口类型定义
export interface EmployeeListParams {
  page?: number
  pageSize?: number
  keyword?: string
  storeId?: number
  roleId?: number
  status?: 'active' | 'inactive'
  department?: string
}

export interface Employee {
  id: number
  realName: string
  jobNumber: string
  phone: string
  email: string
  roleId: number
  role: string
  storeId: number | null
  storeName: string | null
  department: string
  status: 'active' | 'inactive'
  avatar: string
  joinDate: string
  loginPlatforms: ('pc' | 'mobile')[]  // 可登录的平台
  createdAt: string
  updatedAt?: string
}

export interface EmployeeListResponse {
  list: Employee[]
  total: number
  page: number
  pageSize: number
}

export interface CreateEmployeeParams {
  realName: string
  jobNumber: string
  phone: string
  email?: string
  storeId?: number
  department?: string
  joinDate: string
  loginPlatforms: ('pc' | 'mobile')[]
  status?: 'active' | 'inactive'
}

export interface UpdateEmployeeParams {
  id: number
  realName?: string
  phone?: string
  email?: string
  storeId?: number
  department?: string
  loginPlatforms?: ('pc' | 'mobile')[]
  status?: 'active' | 'inactive'
}

export const employeeApi = {
  // 获取员工列表
  getEmployeeList: (params: EmployeeListParams) => {
    if (USE_MOCK) {
      return mockGetEmployeeList(params) as Promise<ApiResponse<EmployeeListResponse>>
    }
    return request.get<ApiResponse<EmployeeListResponse>>('/employees', params)
  },

  // 获取员工详情
  getEmployeeDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetEmployeeDetail(id) as Promise<ApiResponse<Employee>>
    }
    return request.get<ApiResponse<Employee>>(`/employees/${id}`)
  },

  // 创建员工
  createEmployee: (data: CreateEmployeeParams) => {
    if (USE_MOCK) {
      return mockCreateEmployee(data) as Promise<ApiResponse<Employee>>
    }
    return request.post<ApiResponse<Employee>>('/employees', data)
  },

  // 更新员工信息
  updateEmployee: (data: UpdateEmployeeParams) => {
    if (USE_MOCK) {
      return mockUpdateEmployee(data) as Promise<ApiResponse<Employee>>
    }
    return request.put<ApiResponse<Employee>>(`/employees/${data.id}`, data)
  },

  // 更改员工状态
  changeEmployeeStatus: (id: number, status: 'active' | 'inactive') => {
    if (USE_MOCK) {
      return mockChangeEmployeeStatus(id, status) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/employees/${id}/status`, { status })
  },

  // 分配员工角色
  assignEmployeeRoles: (id: number, roleIds: number[]) => {
    if (USE_MOCK) {
      return mockAssignEmployeeRoles(id, roleIds) as Promise<ApiResponse>
    }
    return request.post<ApiResponse>(`/employees/${id}/roles`, { roleIds })
  },

  // 导出员工列表
  exportEmployees: () => {
    if (USE_MOCK) {
      return mockExportEmployees() as Promise<ApiResponse<{ url: string }>>
    }
    return request.post<ApiResponse<{ url: string }>>('/employees/export')
  },

  // 导入员工数据
  importEmployees: (file: File) => {
    if (USE_MOCK) {
      return mockImportEmployees(file) as Promise<ApiResponse<{ successCount: number; failCount: number }>>
    }
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ApiResponse<{ successCount: number; failCount: number }>>('/employees/import', formData)
  },

  // 获取门店员工列表
  getStoreStaffList: (params: EmployeeListParams) => {
    if (USE_MOCK) {
      return mockGetEmployeeList({ ...params, department: 'store' }) as Promise<ApiResponse<EmployeeListResponse>>
    }
    return request.get<ApiResponse<EmployeeListResponse>>('/employees/store-staff', params)
  },

  // 获取客服人员列表
  getCustomerServiceList: (params: EmployeeListParams) => {
    if (USE_MOCK) {
      return mockGetEmployeeList({ ...params, department: 'customer_service' }) as Promise<ApiResponse<EmployeeListResponse>>
    }
    return request.get<ApiResponse<EmployeeListResponse>>('/employees/customer-service', params)
  },

  // 获取员工绩效列表
  getEmployeePerformanceList: (params: { page?: number; pageSize?: number; month?: string; employeeId?: number }) => {
    if (USE_MOCK) {
      return mockGetEmployeePerformanceList(params) as Promise<ApiResponse<EmployeePerformanceListResponse>>
    }
    return request.get<ApiResponse<EmployeePerformanceListResponse>>('/employees/performance', params)
  },

  // 获取员工绩效统计
  getEmployeePerformanceStats: () => {
    if (USE_MOCK) {
      return mockGetEmployeePerformanceStats() as Promise<ApiResponse<EmployeePerformanceStats>>
    }
    return request.get<ApiResponse<EmployeePerformanceStats>>('/employees/performance/stats')
  },
}

// 员工绩效相关类型定义
export interface EmployeePerformance {
  id: number
  employeeId: number
  employeeName: string
  department: string
  month: string
  orderCount: number
  totalRevenue: number
  customerSatisfaction: number
  attendanceRate: number
  score: number
  rank: number
  bonus: number
  createdAt: string
}

export interface EmployeePerformanceListResponse {
  list: EmployeePerformance[]
  total: number
}

export interface EmployeePerformanceStats {
  totalEmployees: number
  avgScore: number
  avgBonus: number
  topPerformer: string
}
