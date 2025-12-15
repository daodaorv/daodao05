/**
 * 托管管理 Mock 数据
 */

// ==================== 自有车托管申请 ====================

// 托管申请状态
export type HostingApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// 车辆状况评级
export type VehicleConditionRating = 'excellent' | 'good' | 'fair' | 'poor'

// 自有车托管申请信息
export interface OldCarHostingApplication {
  id: number
  applicationNo: string
  ownerName: string
  ownerPhone: string
  ownerIdCard: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  licensePlate: string
  vehicleAge: number
  mileage: number
  conditionRating: VehicleConditionRating
  registrationPhotos: string[]
  vehiclePhotos: string[]
  interiorPhotos: string[]
  status: HostingApplicationStatus
  reviewComment: string
  reviewedBy: string
  reviewedAt: string
  expectedIncome: number
  platformShare: number
  ownerShare: number
  createdAt: string
  updatedAt: string
}

// Mock 自有车托管申请数据
let mockOldCarApplications: OldCarHostingApplication[] = [
  {
    id: 1,
    applicationNo: 'OLD20250101001',
    ownerName: '张三',
    ownerPhone: '13800138001',
    ownerIdCard: '110101199001011234',
    vehicleBrand: '大通',
    vehicleModel: 'RG10',
    vehicleYear: 2022,
    licensePlate: '京A12345',
    vehicleAge: 3,
    mileage: 25000,
    conditionRating: 'good',
    registrationPhotos: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2'
    ],
    vehiclePhotos: [
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=5'
    ],
    interiorPhotos: [
      'https://picsum.photos/800/600?random=6',
      'https://picsum.photos/800/600?random=7'
    ],
    status: 'pending',
    reviewComment: '',
    reviewedBy: '',
    reviewedAt: '',
    expectedIncome: 8000,
    platformShare: 30,
    ownerShare: 70,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: 2,
    applicationNo: 'OLD20250102001',
    ownerName: '李四',
    ownerPhone: '13800138002',
    ownerIdCard: '110101199002021234',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型',
    vehicleYear: 2021,
    licensePlate: '京B67890',
    vehicleAge: 4,
    mileage: 38000,
    conditionRating: 'excellent',
    registrationPhotos: [
      'https://picsum.photos/400/300?random=8',
      'https://picsum.photos/400/300?random=9'
    ],
    vehiclePhotos: [
      'https://picsum.photos/800/600?random=10',
      'https://picsum.photos/800/600?random=11'
    ],
    interiorPhotos: [
      'https://picsum.photos/800/600?random=12'
    ],
    status: 'approved',
    reviewComment: '车辆状况良好，手续齐全，同意托管',
    reviewedBy: '审核员-王五',
    reviewedAt: '2025-01-02T14:30:00.000Z',
    expectedIncome: 9500,
    platformShare: 30,
    ownerShare: 70,
    createdAt: '2025-01-02T09:00:00.000Z',
    updatedAt: '2025-01-02T14:30:00.000Z'
  },
  {
    id: 3,
    applicationNo: 'OLD20250103001',
    ownerName: '王五',
    ownerPhone: '13800138003',
    ownerIdCard: '110101199003031234',
    vehicleBrand: '福特',
    vehicleModel: '全顺B型',
    vehicleYear: 2019,
    licensePlate: '京C11111',
    vehicleAge: 6,
    mileage: 65000,
    conditionRating: 'fair',
    registrationPhotos: [
      'https://picsum.photos/400/300?random=13'
    ],
    vehiclePhotos: [
      'https://picsum.photos/800/600?random=14',
      'https://picsum.photos/800/600?random=15'
    ],
    interiorPhotos: [
      'https://picsum.photos/800/600?random=16'
    ],
    status: 'rejected',
    reviewComment: '车辆年限过长，磨损较严重，不符合托管标准',
    reviewedBy: '审核员-赵六',
    reviewedAt: '2025-01-03T16:00:00.000Z',
    expectedIncome: 6000,
    platformShare: 30,
    ownerShare: 70,
    createdAt: '2025-01-03T11:00:00.000Z',
    updatedAt: '2025-01-03T16:00:00.000Z'
  }
]

// ==================== 购车托管申请 ====================

// 购车托管申请状态
export type NewCarApplicationStatus = 'pending' | 'approved' | 'rejected' | 'purchasing' | 'completed' | 'cancelled'

// 购车托管申请信息
export interface NewCarHostingApplication {
  id: number
  applicationNo: string
  applicantName: string
  applicantPhone: string
  applicantIdCard: string
  age: number
  creditScore: number
  monthlyIncome: number
  vehicleBrand: string
  vehicleModel: string
  vehiclePrice: number
  downPayment: number
  loanAmount: number
  loanTerm: number
  monthlyPayment: number
  guaranteedIncome: number
  status: NewCarApplicationStatus
  reviewComment: string
  reviewedBy: string
  reviewedAt: string
  purchaseProgress: number
  deliveryDate: string
  createdAt: string
  updatedAt: string
}

// Mock 购车托管申请数据
let mockNewCarApplications: NewCarHostingApplication[] = [
  {
    id: 1,
    applicationNo: 'NEW20250101001',
    applicantName: '赵六',
    applicantPhone: '13800138004',
    applicantIdCard: '110101199004041234',
    age: 35,
    creditScore: 750,
    monthlyIncome: 15000,
    vehicleBrand: '大通',
    vehicleModel: 'RG10 豪华版',
    vehiclePrice: 380000,
    downPayment: 114000,
    loanAmount: 266000,
    loanTerm: 36,
    monthlyPayment: 7900,
    guaranteedIncome: 3500,
    status: 'pending',
    reviewComment: '',
    reviewedBy: '',
    reviewedAt: '',
    purchaseProgress: 0,
    deliveryDate: '',
    createdAt: '2025-01-01T13:00:00.000Z',
    updatedAt: '2025-01-01T13:00:00.000Z'
  },
  {
    id: 2,
    applicationNo: 'NEW20250102001',
    applicantName: '孙七',
    applicantPhone: '13800138005',
    applicantIdCard: '110101199005051234',
    age: 40,
    creditScore: 800,
    monthlyIncome: 20000,
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型 旗舰版',
    vehiclePrice: 450000,
    downPayment: 135000,
    loanAmount: 315000,
    loanTerm: 36,
    monthlyPayment: 9300,
    guaranteedIncome: 3500,
    status: 'purchasing',
    reviewComment: '申请人资质优秀，收入稳定，同意购车托管',
    reviewedBy: '审核员-王五',
    reviewedAt: '2025-01-02T15:00:00.000Z',
    purchaseProgress: 60,
    deliveryDate: '2025-02-15',
    createdAt: '2025-01-02T10:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z'
  },
  {
    id: 3,
    applicationNo: 'NEW20250103001',
    applicantName: '周八',
    applicantPhone: '13800138006',
    applicantIdCard: '110101199006061234',
    age: 28,
    creditScore: 650,
    monthlyIncome: 8000,
    vehicleBrand: '福特',
    vehicleModel: '全顺B型 标准版',
    vehiclePrice: 280000,
    downPayment: 84000,
    loanAmount: 196000,
    loanTerm: 36,
    monthlyPayment: 5800,
    guaranteedIncome: 3500,
    status: 'rejected',
    reviewComment: '申请人年龄偏小，收入不足以覆盖月供，建议延后申请',
    reviewedBy: '审核员-赵六',
    reviewedAt: '2025-01-03T17:00:00.000Z',
    purchaseProgress: 0,
    deliveryDate: '',
    createdAt: '2025-01-03T12:00:00.000Z',
    updatedAt: '2025-01-03T17:00:00.000Z'
  }
]

// ==================== 托管车辆管理 ====================

// 托管车辆状态
export type HostingVehicleStatus = 'operating' | 'maintenance' | 'owner_using' | 'offline'

// 托管车辆信息
export interface HostingVehicle {
  id: number
  vehicleNo: string
  hostingType: 'old_car' | 'new_car'
  ownerName: string
  ownerPhone: string
  vehicleBrand: string
  vehicleModel: string
  licensePlate: string
  status: HostingVehicleStatus
  totalIncome: number
  ownerIncome: number
  platformIncome: number
  orderCount: number
  utilizationRate: number
  lastMaintenanceDate: string
  nextMaintenanceDate: string
  insuranceExpireDate: string
  hostingStartDate: string
  createdAt: string
  updatedAt: string
}

// Mock 托管车辆数据
let mockHostingVehicles: HostingVehicle[] = [
  {
    id: 1,
    vehicleNo: 'HV20250001',
    hostingType: 'old_car',
    ownerName: '李四',
    ownerPhone: '13800138002',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型',
    licensePlate: '京B67890',
    status: 'operating',
    totalIncome: 125000,
    ownerIncome: 87500,
    platformIncome: 37500,
    orderCount: 28,
    utilizationRate: 75,
    lastMaintenanceDate: '2024-12-15',
    nextMaintenanceDate: '2025-03-15',
    insuranceExpireDate: '2025-12-31',
    hostingStartDate: '2024-06-01',
    createdAt: '2024-06-01T10:00:00.000Z',
    updatedAt: '2025-01-10T15:00:00.000Z'
  },
  {
    id: 2,
    vehicleNo: 'HV20250002',
    hostingType: 'new_car',
    ownerName: '孙七',
    ownerPhone: '13800138005',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型 旗舰版',
    licensePlate: '京D88888',
    status: 'maintenance',
    totalIncome: 42000,
    ownerIncome: 21000,
    platformIncome: 21000,
    orderCount: 8,
    utilizationRate: 60,
    lastMaintenanceDate: '2025-01-05',
    nextMaintenanceDate: '2025-04-05',
    insuranceExpireDate: '2026-02-15',
    hostingStartDate: '2024-09-01',
    createdAt: '2024-09-01T10:00:00.000Z',
    updatedAt: '2025-01-05T14:00:00.000Z'
  }
]

// ==================== 车主自用申请 ====================

// 车主自用申请状态
export type OwnerUsageStatus = 'pending' | 'approved' | 'rejected' | 'using' | 'completed' | 'cancelled'

// 车主自用申请信息
export interface OwnerUsageApplication {
  id: number
  applicationNo: string
  vehicleNo: string
  vehicleBrand: string
  vehicleModel: string
  licensePlate: string
  ownerName: string
  ownerPhone: string
  startDate: string
  endDate: string
  days: number
  purpose: string
  destination: string
  serviceFee: number
  relocationFee: number
  totalFee: number
  status: OwnerUsageStatus
  reviewComment: string
  reviewedBy: string
  reviewedAt: string
  conflictOrders: number
  createdAt: string
  updatedAt: string
}

// Mock 车主自用申请数据
let mockOwnerUsageApplications: OwnerUsageApplication[] = [
  {
    id: 1,
    applicationNo: 'OU20250101001',
    vehicleNo: 'HV20250001',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型',
    licensePlate: '京B67890',
    ownerName: '李四',
    ownerPhone: '13800138002',
    startDate: '2025-02-01',
    endDate: '2025-02-07',
    days: 7,
    purpose: '家庭旅游',
    destination: '云南大理',
    serviceFee: 350,
    relocationFee: 0,
    totalFee: 350,
    status: 'pending',
    reviewComment: '',
    reviewedBy: '',
    reviewedAt: '',
    conflictOrders: 0,
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 2,
    applicationNo: 'OU20250102001',
    vehicleNo: 'HV20250002',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型 旗舰版',
    licensePlate: '京D88888',
    ownerName: '孙七',
    ownerPhone: '13800138005',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    days: 6,
    purpose: '商务出行',
    destination: '上海',
    serviceFee: 300,
    relocationFee: 500,
    totalFee: 800,
    status: 'approved',
    reviewComment: '无订单冲突，同意自用',
    reviewedBy: '审核员-王五',
    reviewedAt: '2025-01-12T14:00:00.000Z',
    conflictOrders: 0,
    createdAt: '2025-01-12T10:00:00.000Z',
    updatedAt: '2025-01-12T14:00:00.000Z'
  }
]

// ==================== 收益管理 ====================

// 收益记录类型
export type IncomeRecordType = 'rental' | 'owner_usage' | 'penalty' | 'subsidy' | 'other'

// 收益记录信息
export interface IncomeRecord {
  id: number
  recordNo: string
  vehicleNo: string
  vehicleBrand: string
  vehicleModel: string
  licensePlate: string
  ownerName: string
  type: IncomeRecordType
  orderNo: string
  amount: number
  ownerShare: number
  platformShare: number
  ownerAmount: number
  platformAmount: number
  recordDate: string
  settlementStatus: 'pending' | 'settled'
  createdAt: string
}

// Mock 收益记录数据
let mockIncomeRecords: IncomeRecord[] = [
  {
    id: 1,
    recordNo: 'IR20250101001',
    vehicleNo: 'HV20250001',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型',
    licensePlate: '京B67890',
    ownerName: '李四',
    type: 'rental',
    orderNo: 'ORD20250101001',
    amount: 4500,
    ownerShare: 70,
    platformShare: 30,
    ownerAmount: 3150,
    platformAmount: 1350,
    recordDate: '2025-01-01',
    settlementStatus: 'settled',
    createdAt: '2025-01-01T18:00:00.000Z'
  },
  {
    id: 2,
    recordNo: 'IR20250102001',
    vehicleNo: 'HV20250001',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型',
    licensePlate: '京B67890',
    ownerName: '李四',
    type: 'rental',
    orderNo: 'ORD20250102001',
    amount: 5200,
    ownerShare: 70,
    platformShare: 30,
    ownerAmount: 3640,
    platformAmount: 1560,
    recordDate: '2025-01-05',
    settlementStatus: 'settled',
    createdAt: '2025-01-05T18:00:00.000Z'
  },
  {
    id: 3,
    recordNo: 'IR20250103001',
    vehicleNo: 'HV20250002',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜C型 旗舰版',
    licensePlate: '京D88888',
    ownerName: '孙七',
    type: 'rental',
    orderNo: 'ORD20250103001',
    amount: 6800,
    ownerShare: 50,
    platformShare: 50,
    ownerAmount: 3500,
    platformAmount: 3300,
    recordDate: '2025-01-08',
    settlementStatus: 'pending',
    createdAt: '2025-01-08T18:00:00.000Z'
  }
]

// 收益统计信息
export interface IncomeStats {
  totalIncome: number
  ownerIncome: number
  platformIncome: number
  monthlyIncome: number
  vehicleCount: number
  activeVehicleCount: number
  averageUtilization: number
}

// Mock 收益统计数据
const mockIncomeStats: IncomeStats = {
  totalIncome: 167000,
  ownerIncome: 108500,
  platformIncome: 58500,
  monthlyIncome: 42000,
  vehicleCount: 2,
  activeVehicleCount: 1,
  averageUtilization: 67.5
}

// ==================== API Mock 函数 ====================

// 自有车托管申请列表查询参数
export interface OldCarApplicationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: HostingApplicationStatus
}

// Mock 获取自有车托管申请列表
export const mockGetOldCarApplicationList = (params: OldCarApplicationListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockOldCarApplications]

      if (params.keyword) {
        filtered = filtered.filter(
          a =>
            a.applicationNo.includes(params.keyword!) ||
            a.ownerName.includes(params.keyword!) ||
            a.ownerPhone.includes(params.keyword!) ||
            a.licensePlate.includes(params.keyword!)
        )
      }

      if (params.status) {
        filtered = filtered.filter(a => a.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize
        },
        message: '获取成功'
      })
    }, 300)
  })
}

// Mock 审核自有车托管申请
export const mockReviewOldCarApplication = (id: number, approved: boolean, comment: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockOldCarApplications.find(a => a.id === id)
      if (application) {
        application.status = approved ? 'approved' : 'rejected'
        application.reviewComment = comment
        application.reviewedBy = '审核员-测试'
        application.reviewedAt = new Date().toISOString()
        application.updatedAt = new Date().toISOString()
      }

      resolve({
        code: 200,
        data: application,
        message: '审核成功'
      })
    }, 500)
  })
}

// 购车托管申请列表查询参数
export interface NewCarApplicationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: NewCarApplicationStatus
}

// Mock 获取购车托管申请列表
export const mockGetNewCarApplicationList = (params: NewCarApplicationListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockNewCarApplications]

      if (params.keyword) {
        filtered = filtered.filter(
          a =>
            a.applicationNo.includes(params.keyword!) ||
            a.applicantName.includes(params.keyword!) ||
            a.applicantPhone.includes(params.keyword!)
        )
      }

      if (params.status) {
        filtered = filtered.filter(a => a.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize
        },
        message: '获取成功'
      })
    }, 300)
  })
}

// Mock 审核购车托管申请
export const mockReviewNewCarApplication = (id: number, approved: boolean, comment: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockNewCarApplications.find(a => a.id === id)
      if (application) {
        application.status = approved ? 'approved' : 'rejected'
        application.reviewComment = comment
        application.reviewedBy = '审核员-测试'
        application.reviewedAt = new Date().toISOString()
        application.updatedAt = new Date().toISOString()
      }

      resolve({
        code: 200,
        data: application,
        message: '审核成功'
      })
    }, 500)
  })
}

// 托管车辆列表查询参数
export interface HostingVehicleListParams {
  page?: number
  pageSize?: number
  keyword?: string
  hostingType?: 'old_car' | 'new_car'
  status?: HostingVehicleStatus
}

// Mock 获取托管车辆列表
export const mockGetHostingVehicleList = (params: HostingVehicleListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockHostingVehicles]

      if (params.keyword) {
        filtered = filtered.filter(
          v =>
            v.vehicleNo.includes(params.keyword!) ||
            v.ownerName.includes(params.keyword!) ||
            v.licensePlate.includes(params.keyword!)
        )
      }

      if (params.hostingType) {
        filtered = filtered.filter(v => v.hostingType === params.hostingType)
      }

      if (params.status) {
        filtered = filtered.filter(v => v.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize
        },
        message: '获取成功'
      })
    }, 300)
  })
}

// 车主自用申请列表查询参数
export interface OwnerUsageApplicationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: OwnerUsageStatus
}

// Mock 获取车主自用申请列表
export const mockGetOwnerUsageApplicationList = (params: OwnerUsageApplicationListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockOwnerUsageApplications]

      if (params.keyword) {
        filtered = filtered.filter(
          a =>
            a.applicationNo.includes(params.keyword!) ||
            a.ownerName.includes(params.keyword!) ||
            a.licensePlate.includes(params.keyword!)
        )
      }

      if (params.status) {
        filtered = filtered.filter(a => a.status === params.status)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize
        },
        message: '获取成功'
      })
    }, 300)
  })
}

// Mock 审核车主自用申请
export const mockReviewOwnerUsageApplication = (id: number, approved: boolean, comment: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockOwnerUsageApplications.find(a => a.id === id)
      if (application) {
        application.status = approved ? 'approved' : 'rejected'
        application.reviewComment = comment
        application.reviewedBy = '审核员-测试'
        application.reviewedAt = new Date().toISOString()
        application.updatedAt = new Date().toISOString()
      }

      resolve({
        code: 200,
        data: application,
        message: '审核成功'
      })
    }, 500)
  })
}

// 收益记录列表查询参数
export interface IncomeRecordListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: IncomeRecordType
  settlementStatus?: 'pending' | 'settled'
  startDate?: string
  endDate?: string
}

// Mock 获取收益记录列表
export const mockGetIncomeRecordList = (params: IncomeRecordListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockIncomeRecords]

      if (params.keyword) {
        filtered = filtered.filter(
          r =>
            r.recordNo.includes(params.keyword!) ||
            r.vehicleNo.includes(params.keyword!) ||
            r.ownerName.includes(params.keyword!) ||
            r.licensePlate.includes(params.keyword!)
        )
      }

      if (params.type) {
        filtered = filtered.filter(r => r.type === params.type)
      }

      if (params.settlementStatus) {
        filtered = filtered.filter(r => r.settlementStatus === params.settlementStatus)
      }

      if (params.startDate) {
        filtered = filtered.filter(r => r.recordDate >= params.startDate!)
      }

      if (params.endDate) {
        filtered = filtered.filter(r => r.recordDate <= params.endDate!)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize
        },
        message: '获取成功'
      })
    }, 300)
  })
}

// Mock 获取收益统计
export const mockGetIncomeStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockIncomeStats,
        message: '获取成功'
      })
    }, 300)
  })
}
