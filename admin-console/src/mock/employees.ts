/**
 * 员工管理 Mock 数据
 */
import type { Employee, EmployeeListParams, CreateEmployeeParams, UpdateEmployeeParams } from '@/api/employee'

// Mock 员工数据
const mockEmployees: Employee[] = [
  {
    id: 1,
    realName: '张三',
    jobNumber: 'EMP001',
    phone: '13800138000',
    email: 'zhangsan@daodao.com',
    roleId: 1,
    role: '平台管理员',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '技术部',
    status: 'active',
    avatar: '',
    joinDate: '2024-01-15',
    loginPlatforms: ['pc', 'mobile'],
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    realName: '李四',
    jobNumber: 'EMP002',
    phone: '13800138001',
    email: 'lisi@daodao.com',
    roleId: 2,
    role: '区域经理',
    storeId: null,
    storeName: null,
    department: '运营部',
    status: 'active',
    avatar: '',
    joinDate: '2024-02-01',
    loginPlatforms: ['pc', 'mobile'],
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 3,
    realName: '王五',
    jobNumber: 'EMP003',
    phone: '13800138002',
    email: 'wangwu@daodao.com',
    roleId: 3,
    role: '门店经理',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '门店管理',
    status: 'active',
    avatar: '',
    joinDate: '2024-03-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-03-01T08:00:00.000Z',
  },
  {
    id: 4,
    realName: '赵六',
    jobNumber: 'EMP004',
    phone: '13800138003',
    email: 'zhaoliu@daodao.com',
    roleId: 4,
    role: '门店员工',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '客服部',
    status: 'active',
    avatar: '',
    joinDate: '2024-04-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-04-01T08:00:00.000Z',
  },
  {
    id: 5,
    realName: '孙七',
    jobNumber: 'EMP005',
    phone: '13800138004',
    email: 'sunqi@daodao.com',
    roleId: 3,
    role: '门店经理',
    storeId: 2,
    storeName: '上海浦东店',
    department: '门店管理',
    status: 'active',
    avatar: '',
    joinDate: '2024-05-01',
    loginPlatforms: ['pc', 'mobile'],
    createdAt: '2024-05-01T08:00:00.000Z',
  },
  {
    id: 6,
    realName: '周八',
    jobNumber: 'EMP006',
    phone: '13800138005',
    email: 'zhouba@daodao.com',
    roleId: 4,
    role: '门店员工',
    storeId: 2,
    storeName: '上海浦东店',
    department: '维修部',
    status: 'active',
    avatar: '',
    joinDate: '2024-06-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-06-01T08:00:00.000Z',
  },
  {
    id: 7,
    realName: '吴九',
    jobNumber: 'EMP007',
    phone: '13800138006',
    email: 'wujiu@daodao.com',
    roleId: 3,
    role: '门店经理',
    storeId: 3,
    storeName: '深圳南山店',
    department: '门店管理',
    status: 'active',
    avatar: '',
    joinDate: '2024-07-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-07-01T08:00:00.000Z',
  },
  {
    id: 8,
    realName: '郑十',
    jobNumber: 'EMP008',
    phone: '13800138007',
    email: 'zhengshi@daodao.com',
    roleId: 4,
    role: '门店员工',
    storeId: 3,
    storeName: '深圳南山店',
    department: '客服部',
    status: 'active',
    avatar: '',
    joinDate: '2024-08-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-08-01T08:00:00.000Z',
  },
  {
    id: 9,
    realName: '冯十一',
    jobNumber: 'EMP009',
    phone: '13800138008',
    email: 'fengshiyi@daodao.com',
    roleId: 2,
    role: '区域经理',
    storeId: null,
    storeName: null,
    department: '运营部',
    status: 'active',
    avatar: '',
    joinDate: '2024-09-01',
    loginPlatforms: ['pc', 'mobile'],
    createdAt: '2024-09-01T08:00:00.000Z',
  },
  {
    id: 10,
    realName: '陈十二',
    jobNumber: 'EMP010',
    phone: '13800138009',
    email: 'chenshier@daodao.com',
    roleId: 4,
    role: '门店员工',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '维修部',
    status: 'inactive',
    avatar: '',
    joinDate: '2024-10-01',
    loginPlatforms: ['mobile'],
    createdAt: '2024-10-01T08:00:00.000Z',
  },
]

// Mock 获取员工列表
export const mockGetEmployeeList = (params: EmployeeListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredEmployees = [...mockEmployees]

      // 关键词搜索
      if (params.keyword) {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.realName.includes(params.keyword!) ||
            emp.phone.includes(params.keyword!) ||
            emp.jobNumber.includes(params.keyword!)
        )
      }

      // 门店筛选
      if (params.storeId) {
        filteredEmployees = filteredEmployees.filter((emp) => emp.storeId === params.storeId)
      }

      // 角色筛选
      if (params.roleId) {
        filteredEmployees = filteredEmployees.filter((emp) => emp.roleId === params.roleId)
      }

      // 状态筛选
      if (params.status) {
        filteredEmployees = filteredEmployees.filter((emp) => emp.status === params.status)
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredEmployees.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredEmployees.length,
          page,
          pageSize,
        },
      })
    }, 300)
  })
}

// Mock 获取员工详情
export const mockGetEmployeeDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployees.find((e) => e.id === id)
      if (employee) {
        resolve({
          code: 200,
          message: '获取成功',
          data: employee,
        })
      } else {
        reject({
          code: 404,
          message: '员工不存在',
        })
      }
    }, 200)
  })
}

// Mock 创建员工
export const mockCreateEmployee = (data: CreateEmployeeParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee: Employee = {
        id: mockEmployees.length + 1,
        realName: data.realName,
        jobNumber: data.jobNumber,
        phone: data.phone,
        email: data.email || '',
        roleId: 0,
        role: '',
        storeId: data.storeId || null,
        storeName: data.storeId ? '北京朝阳店' : null,
        department: data.department || '',
        status: data.status || 'active',
        avatar: '',
        joinDate: data.joinDate,
        loginPlatforms: data.loginPlatforms,
        createdAt: new Date().toISOString(),
      }
      mockEmployees.push(newEmployee)

      resolve({
        code: 200,
        message: '创建成功',
        data: newEmployee,
      })
    }, 500)
  })
}

// Mock 更新员工
export const mockUpdateEmployee = (data: UpdateEmployeeParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex((e) => e.id === data.id)
      if (index > -1) {
        mockEmployees[index] = {
          ...mockEmployees[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        resolve({
          code: 200,
          message: '更新成功',
          data: mockEmployees[index],
        })
      } else {
        reject({
          code: 404,
          message: '员工不存在',
        })
      }
    }, 500)
  })
}

// Mock 更改员工状态
export const mockChangeEmployeeStatus = (id: number, status: 'active' | 'inactive') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex((e) => e.id === id)
      if (index > -1) {
        mockEmployees[index].status = status
        mockEmployees[index].updatedAt = new Date().toISOString()
        resolve({
          code: 200,
          message: '状态更新成功',
        })
      } else {
        reject({
          code: 404,
          message: '员工不存在',
        })
      }
    }, 300)
  })
}

// Mock 分配员工角色
export const mockAssignEmployeeRoles = (id: number, roleIds: number[]) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex((e) => e.id === id)
      if (index > -1) {
        // 这里只是模拟,实际应该保存角色分配
        mockEmployees[index].roleId = roleIds[0] || 0
        mockEmployees[index].updatedAt = new Date().toISOString()
        resolve({
          code: 200,
          message: '角色分配成功',
        })
      } else {
        reject({
          code: 404,
          message: '员工不存在',
        })
      }
    }, 500)
  })
}

// Mock 导出员工列表
export const mockExportEmployees = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '导出成功',
        data: {
          url: '/exports/employees.xlsx',
        },
      })
    }, 1000)
  })
}

// Mock 导入员工数据
export const mockImportEmployees = (_file: File) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '导入成功',
        data: {
          successCount: 10,
          failCount: 0,
        },
      })
    }, 2000)
  })
}

// ==================== 员工绩效管理 Mock 数据 ====================
import type { EmployeePerformance, EmployeePerformanceStats } from '@/api/employee'

const mockEmployeePerformances: EmployeePerformance[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    department: '技术部',
    month: '2024-11',
    orderCount: 25,
    totalRevenue: 125000,
    customerSatisfaction: 4.8,
    attendanceRate: 98,
    score: 95,
    rank: 1,
    bonus: 5000,
    createdAt: '2024-11-30T10:00:00.000Z',
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: '赵六',
    department: '客服部',
    month: '2024-11',
    orderCount: 30,
    totalRevenue: 150000,
    customerSatisfaction: 4.9,
    attendanceRate: 100,
    score: 98,
    rank: 1,
    bonus: 6000,
    createdAt: '2024-11-30T10:00:00.000Z',
  },
  {
    id: 3,
    employeeId: 6,
    employeeName: '周八',
    department: '维修部',
    month: '2024-11',
    orderCount: 20,
    totalRevenue: 100000,
    customerSatisfaction: 4.5,
    attendanceRate: 95,
    score: 88,
    rank: 3,
    bonus: 3500,
    createdAt: '2024-11-30T10:00:00.000Z',
  },
]

// Mock 获取员工绩效列表
export const mockGetEmployeePerformanceList = (params: { page?: number; pageSize?: number; month?: string; employeeId?: number }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockEmployeePerformances]

      if (params.month) {
        filteredData = filteredData.filter((item) => item.month === params.month)
      }

      if (params.employeeId) {
        filteredData = filteredData.filter((item) => item.employeeId === params.employeeId)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: filteredData.slice(start, end),
          total: filteredData.length,
        },
      })
    }, 300)
  })
}

// Mock 获取员工绩效统计
export const mockGetEmployeePerformanceStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: EmployeePerformanceStats = {
        totalEmployees: mockEmployeePerformances.length,
        avgScore: 93.7,
        avgBonus: 4833,
        topPerformer: '赵六',
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: stats,
      })
    }, 200)
  })
}
