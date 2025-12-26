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
const mockOldCarApplications: OldCarHostingApplication[] = [
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
const mockNewCarApplications: NewCarHostingApplication[] = [
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
const mockHostingVehicles: HostingVehicle[] = [
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
const mockOwnerUsageApplications: OwnerUsageApplication[] = [
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
const mockIncomeRecords: IncomeRecord[] = [
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

// ==================== 众筹车型管理 ====================

// 众筹车型信息
export interface CrowdfundingModel {
  id: number
  modelName: string
  brandName: string
  image: string
  purchasePrice: number
  suggestedShares: number
  estimatedMonthlyIncome: number
  isHotCrowdfunding: boolean
  crowdfundingDisplayOrder: number
  crowdfundingCount: number
  successfulCrowdfundingCount: number
  crowdfundingDescription: string
  crowdfundingEnabledAt: string
  crowdfundingUpdatedAt: string
}

// 众筹车型列表查询参数
export interface CrowdfundingModelListParams {
  keyword?: string
  isHot?: boolean | null
  page: number
  pageSize: number
}

// 更新众筹配置参数
export interface UpdateCrowdfundingModelConfigParams {
  purchasePrice: number
  suggestedShares: number
  estimatedMonthlyIncome: number
  isHotCrowdfunding: boolean
  crowdfundingDisplayOrder: number
  crowdfundingDescription: string
}

// Mock 众筹车型数据
const mockCrowdfundingModels: CrowdfundingModel[] = [
  {
    id: 1,
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    image: 'https://picsum.photos/800/600?random=101',
    purchasePrice: 500000,
    suggestedShares: 10,
    estimatedMonthlyIncome: 8500,
    isHotCrowdfunding: true,
    crowdfundingDisplayOrder: 100,
    crowdfundingCount: 5,
    successfulCrowdfundingCount: 4,
    crowdfundingDescription: '专为川西环线打造的高端房车，配备完善的生活设施，适合长途旅行。众筹成功后将托管运营，预计年化收益率20%以上。',
    crowdfundingEnabledAt: '2025-01-01T10:00:00.000Z',
    crowdfundingUpdatedAt: '2025-01-15T14:30:00.000Z'
  },
  {
    id: 2,
    modelName: '依维柯欧胜C型房车',
    brandName: '依维柯',
    image: 'https://picsum.photos/800/600?random=102',
    purchasePrice: 450000,
    suggestedShares: 10,
    estimatedMonthlyIncome: 7500,
    isHotCrowdfunding: true,
    crowdfundingDisplayOrder: 90,
    crowdfundingCount: 3,
    successfulCrowdfundingCount: 3,
    crowdfundingDescription: '经典C型房车，性价比高，适合家庭出游。空间宽敞，配置齐全，托管收益稳定。',
    crowdfundingEnabledAt: '2025-01-05T09:00:00.000Z',
    crowdfundingUpdatedAt: '2025-01-10T16:20:00.000Z'
  },
  {
    id: 3,
    modelName: '福特全顺B型房车',
    brandName: '福特',
    image: 'https://picsum.photos/800/600?random=103',
    purchasePrice: 380000,
    suggestedShares: 10,
    estimatedMonthlyIncome: 6500,
    isHotCrowdfunding: false,
    crowdfundingDisplayOrder: 50,
    crowdfundingCount: 2,
    successfulCrowdfundingCount: 2,
    crowdfundingDescription: '紧凑型B型房车，适合城市出行和短途旅游。操控灵活，油耗经济。',
    crowdfundingEnabledAt: '2025-01-08T11:00:00.000Z',
    crowdfundingUpdatedAt: '2025-01-12T10:15:00.000Z'
  },
  {
    id: 4,
    modelName: '奔驰斯宾特商务房车',
    brandName: '奔驰',
    image: 'https://picsum.photos/800/600?random=104',
    purchasePrice: 880000,
    suggestedShares: 10,
    estimatedMonthlyIncome: 15000,
    isHotCrowdfunding: true,
    crowdfundingDisplayOrder: 95,
    crowdfundingCount: 4,
    successfulCrowdfundingCount: 3,
    crowdfundingDescription: '豪华商务房车，高端配置，适合商务接待和高端旅游。预期年化收益率超过20%。',
    crowdfundingEnabledAt: '2025-01-03T08:30:00.000Z',
    crowdfundingUpdatedAt: '2025-01-18T15:45:00.000Z'
  },
  {
    id: 5,
    modelName: '览众风骏C7房车',
    brandName: '览众',
    image: 'https://picsum.photos/800/600?random=105',
    purchasePrice: 320000,
    suggestedShares: 10,
    estimatedMonthlyIncome: 5500,
    isHotCrowdfunding: false,
    crowdfundingDisplayOrder: 40,
    crowdfundingCount: 1,
    successfulCrowdfundingCount: 1,
    crowdfundingDescription: '入门级C型房车，价格亲民，适合新手房车爱好者。托管收益稳定可靠。',
    crowdfundingEnabledAt: '2025-01-10T13:00:00.000Z',
    crowdfundingUpdatedAt: '2025-01-10T13:00:00.000Z'
  }
]

// Mock 获取众筹车型列表
export const mockGetCrowdfundingModelList = (params: CrowdfundingModelListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockCrowdfundingModels]

      // 关键词搜索
      if (params.keyword) {
        filtered = filtered.filter(
          m =>
            m.modelName.includes(params.keyword!) ||
            m.brandName.includes(params.keyword!)
        )
      }

      // 热门筛选
      if (params.isHot !== null && params.isHot !== undefined) {
        filtered = filtered.filter(m => m.isHotCrowdfunding === params.isHot)
      }

      // 按展示排序降序排列
      filtered.sort((a, b) => b.crowdfundingDisplayOrder - a.crowdfundingDisplayOrder)

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

// Mock 更新车型众筹配置
export const mockUpdateCrowdfundingModelConfig = (id: number, data: UpdateCrowdfundingModelConfigParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const model = mockCrowdfundingModels.find(m => m.id === id)
      if (model) {
        Object.assign(model, {
          ...data,
          crowdfundingUpdatedAt: new Date().toISOString()
        })
      }

      resolve({
        code: 200,
        data: model,
        message: '更新成功'
      })
    }, 300)
  })
}

// Mock 批量设置热门推荐
export const mockBatchSetHotCrowdfunding = (ids: number[], isHot: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const model = mockCrowdfundingModels.find(m => m.id === id)
        if (model) {
          model.isHotCrowdfunding = isHot
          model.crowdfundingUpdatedAt = new Date().toISOString()
        }
      })

      resolve({
        code: 200,
        data: { successCount: ids.length },
        message: '批量设置成功'
      })
    }, 300)
  })
}

// Mock 更新展示排序
export const mockUpdateCrowdfundingModelOrder = (id: number, order: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const model = mockCrowdfundingModels.find(m => m.id === id)
      if (model) {
        model.crowdfundingDisplayOrder = order
        model.crowdfundingUpdatedAt = new Date().toISOString()
      }

      resolve({
        code: 200,
        data: model,
        message: '更新成功'
      })
    }, 300)
  })
}

// ==================== 众筹项目管理 ====================

// 众筹项目参与者接口
export interface CrowdfundingParticipant {
  userId: number
  userName: string
  userPhone: string
  shares: number
  amount: number
  shareRatio: number
  role: 'initiator' | 'investor' | 'manager'
  joinedAt: string
}

// 众筹项目接口
export interface CrowdfundingProject {
  id: number
  projectNo: string
  title: string
  modelId: number
  modelName: string
  brandName: string
  purchasePrice: number
  totalShares: number
  pricePerShare: number
  soldShares: number
  raisedAmount: number
  targetAmount: number
  participantCount: number
  initiatorId: number
  initiatorName: string
  initiatorPhone: string
  estimatedMonthlyIncome: number
  status: 'pending' | 'rejected' | 'funding' | 'success' | 'failed' | 'purchasing' | 'hosting' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  description: string
  createdAt: string
  participants: CrowdfundingParticipant[]
}

// 众筹项目列表查询参数
export interface CrowdfundingProjectListParams {
  keyword?: string
  status?: string
  modelId?: number
  initiatorId?: number
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// Mock 众筹项目数据
const mockCrowdfundingProjects: CrowdfundingProject[] = [
  {
    id: 1,
    projectNo: 'CF202501001',
    title: '上汽大通RG10众筹项目',
    modelId: 1,
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    purchasePrice: 500000,
    totalShares: 10,
    pricePerShare: 50000,
    soldShares: 8,
    raisedAmount: 400000,
    targetAmount: 500000,
    participantCount: 4,
    initiatorId: 1,
    initiatorName: '张三',
    initiatorPhone: '13800138001',
    estimatedMonthlyIncome: 8500,
    status: 'funding',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    description: '专为川西环线打造的高端房车，配备完善的生活设施，适合长途旅行。众筹成功后将托管运营，预计年化收益率20%以上。',
    createdAt: '2025-01-01 10:00:00',
    participants: [
      {
        userId: 1,
        userName: '张三',
        userPhone: '13800138001',
        shares: 3,
        amount: 150000,
        shareRatio: 30,
        role: 'initiator',
        joinedAt: '2025-01-01 10:00:00',
      },
      {
        userId: 2,
        userName: '李四',
        userPhone: '13800138002',
        shares: 2,
        amount: 100000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2025-01-02 14:30:00',
      },
      {
        userId: 3,
        userName: '王五',
        userPhone: '13800138003',
        shares: 2,
        amount: 100000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2025-01-03 09:15:00',
      },
      {
        userId: 4,
        userName: '赵六',
        userPhone: '13800138004',
        shares: 1,
        amount: 50000,
        shareRatio: 10,
        role: 'manager',
        joinedAt: '2025-01-04 16:20:00',
      },
    ],
  },
  {
    id: 2,
    projectNo: 'CF202501002',
    title: '依维柯欧胜C型房车众筹',
    modelId: 2,
    modelName: '依维柯欧胜C型房车',
    brandName: '依维柯',
    purchasePrice: 450000,
    totalShares: 10,
    pricePerShare: 45000,
    soldShares: 10,
    raisedAmount: 450000,
    targetAmount: 450000,
    participantCount: 6,
    initiatorId: 2,
    initiatorName: '李四',
    initiatorPhone: '13800138002',
    estimatedMonthlyIncome: 7500,
    status: 'success',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    description: '经典C型房车，性价比高，适合家庭出游。众筹成功后将托管运营。',
    createdAt: '2024-12-01 09:00:00',
    participants: [
      {
        userId: 2,
        userName: '李四',
        userPhone: '13800138002',
        shares: 3,
        amount: 135000,
        shareRatio: 30,
        role: 'initiator',
        joinedAt: '2024-12-01 09:00:00',
      },
      {
        userId: 5,
        userName: '孙七',
        userPhone: '13800138005',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-12-02 11:20:00',
      },
      {
        userId: 6,
        userName: '周八',
        userPhone: '13800138006',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-12-03 15:45:00',
      },
      {
        userId: 7,
        userName: '吴九',
        userPhone: '13800138007',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-12-05 10:30:00',
      },
      {
        userId: 8,
        userName: '郑十',
        userPhone: '13800138008',
        shares: 1,
        amount: 45000,
        shareRatio: 10,
        role: 'manager',
        joinedAt: '2024-12-06 14:00:00',
      },
    ],
  },
  {
    id: 3,
    projectNo: 'CF202501003',
    title: '福特全顺B型房车众筹',
    modelId: 3,
    modelName: '福特全顺B型房车',
    brandName: '福特',
    purchasePrice: 380000,
    totalShares: 10,
    pricePerShare: 38000,
    soldShares: 0,
    raisedAmount: 0,
    targetAmount: 380000,
    participantCount: 0,
    initiatorId: 3,
    initiatorName: '王五',
    initiatorPhone: '13800138003',
    estimatedMonthlyIncome: 6500,
    status: 'pending',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    description: '紧凑型B型房车，适合城市出行和短途旅游。众筹成功后将托管运营。',
    createdAt: '2025-01-10 15:30:00',
    participants: [],
  },
  {
    id: 4,
    projectNo: 'CF202412001',
    title: '大通V90房车众筹项目',
    modelId: 1,
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    purchasePrice: 500000,
    totalShares: 10,
    pricePerShare: 50000,
    soldShares: 5,
    raisedAmount: 250000,
    targetAmount: 500000,
    participantCount: 3,
    initiatorId: 4,
    initiatorName: '赵六',
    initiatorPhone: '13800138004',
    estimatedMonthlyIncome: 8500,
    status: 'failed',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    description: '高端房车众筹项目，因众筹期限到期未达成目标而失败。',
    createdAt: '2024-12-01 10:00:00',
    participants: [
      {
        userId: 4,
        userName: '赵六',
        userPhone: '13800138004',
        shares: 2,
        amount: 100000,
        shareRatio: 40,
        role: 'initiator',
        joinedAt: '2024-12-01 10:00:00',
      },
      {
        userId: 9,
        userName: '钱十一',
        userPhone: '13800138009',
        shares: 2,
        amount: 100000,
        shareRatio: 40,
        role: 'investor',
        joinedAt: '2024-12-05 14:20:00',
      },
      {
        userId: 10,
        userName: '孙十二',
        userPhone: '13800138010',
        shares: 1,
        amount: 50000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-12-10 09:30:00',
      },
    ],
  },
  {
    id: 5,
    projectNo: 'CF202411001',
    title: '依维柯房车众筹项目',
    modelId: 2,
    modelName: '依维柯欧胜C型房车',
    brandName: '依维柯',
    purchasePrice: 450000,
    totalShares: 10,
    pricePerShare: 45000,
    soldShares: 10,
    raisedAmount: 450000,
    targetAmount: 450000,
    participantCount: 5,
    initiatorId: 5,
    initiatorName: '孙七',
    initiatorPhone: '13800138005',
    estimatedMonthlyIncome: 7500,
    status: 'hosting',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    description: '经典C型房车众筹项目，已成功购车并进入托管运营阶段。',
    createdAt: '2024-11-01 09:00:00',
    participants: [
      {
        userId: 5,
        userName: '孙七',
        userPhone: '13800138005',
        shares: 3,
        amount: 135000,
        shareRatio: 30,
        role: 'initiator',
        joinedAt: '2024-11-01 09:00:00',
      },
      {
        userId: 11,
        userName: '李十三',
        userPhone: '13800138011',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-11-03 11:20:00',
      },
      {
        userId: 12,
        userName: '周十四',
        userPhone: '13800138012',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-11-05 15:45:00',
      },
      {
        userId: 13,
        userName: '吴十五',
        userPhone: '13800138013',
        shares: 2,
        amount: 90000,
        shareRatio: 20,
        role: 'investor',
        joinedAt: '2024-11-08 10:30:00',
      },
      {
        userId: 14,
        userName: '郑十六',
        userPhone: '13800138014',
        shares: 1,
        amount: 45000,
        shareRatio: 10,
        role: 'manager',
        joinedAt: '2024-11-10 14:00:00',
      },
    ],
  },
]

// Mock 获取众筹项目列表
export const mockGetCrowdfundingProjectList = (params: CrowdfundingProjectListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProjects = [...mockCrowdfundingProjects]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredProjects = filteredProjects.filter(
          p =>
            p.projectNo.toLowerCase().includes(keyword) ||
            p.title.toLowerCase().includes(keyword) ||
            p.initiatorName.toLowerCase().includes(keyword)
        )
      }

      // 状态筛选
      if (params.status) {
        filteredProjects = filteredProjects.filter(p => p.status === params.status)
      }

      // 车型筛选
      if (params.modelId) {
        filteredProjects = filteredProjects.filter(p => p.modelId === params.modelId)
      }

      // 发起人筛选
      if (params.initiatorId) {
        filteredProjects = filteredProjects.filter(p => p.initiatorId === params.initiatorId)
      }

      // 日期范围筛选
      if (params.startDate) {
        filteredProjects = filteredProjects.filter(p => p.startDate >= params.startDate!)
      }
      if (params.endDate) {
        filteredProjects = filteredProjects.filter(p => p.endDate <= params.endDate!)
      }

      // 分页
      const total = filteredProjects.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredProjects.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
        },
        message: '获取成功',
      })
    }, 500)
  })
}

// Mock 获取众筹项目详情
export const mockGetCrowdfundingProjectDetail = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockCrowdfundingProjects.find(p => p.id === id)

      if (project) {
        resolve({
          code: 200,
          data: project,
          message: '获取成功',
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '项目不存在',
        })
      }
    }, 300)
  })
}

// Mock 审核众筹项目
export const mockReviewCrowdfundingProject = (id: number, approved: boolean, comment: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockCrowdfundingProjects.find(p => p.id === id)

      if (project) {
        project.status = approved ? 'funding' : 'rejected'

        resolve({
          code: 200,
          data: {
            project,
            approved,
            comment,
            reviewedAt: new Date().toISOString(),
          },
          message: '审核成功',
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '项目不存在',
        })
      }
    }, 500)
  })
}

// Mock 更新众筹项目状态
export const mockUpdateCrowdfundingProjectStatus = (id: number, status: string, remark: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockCrowdfundingProjects.find(p => p.id === id)

      if (project) {
        project.status = status as any

        resolve({
          code: 200,
          data: {
            project,
            status,
            remark,
            updatedAt: new Date().toISOString(),
          },
          message: '状态更新成功',
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '项目不存在',
        })
      }
    }, 500)
  })
}

// ==================== 众筹车主管理 ====================

// 众筹车主列表查询参数
export interface CrowdfundingOwnerListParams {
  keyword?: string
  role?: string
  page: number
  pageSize: number
}

// 众筹车主项目参与记录
export interface CrowdfundingOwnerProject {
  projectId: number
  projectNo: string
  projectTitle: string
  modelName: string
  shares: number
  investment: number
  shareRatio: number
  income: number
  role: 'initiator' | 'investor' | 'manager'
  status: string
  joinedAt: string
}

// 众筹车主信息
export interface CrowdfundingOwner {
  userId: number
  userName: string
  userPhone: string
  projectCount: number
  totalShares: number
  totalInvestment: number
  totalIncome: number
  roles: Array<'initiator' | 'investor' | 'manager'>
  registeredAt: string
  projects: CrowdfundingOwnerProject[]
}

// Mock 众筹车主数据
const mockCrowdfundingOwners: CrowdfundingOwner[] = [
  {
    userId: 1,
    userName: '张三',
    userPhone: '13800138001',
    projectCount: 2,
    totalShares: 6,
    totalInvestment: 300000,
    totalIncome: 15000,
    roles: ['initiator', 'investor'],
    registeredAt: '2024-10-15 10:30:00',
    projects: [
      {
        projectId: 1,
        projectNo: 'CF202501001',
        projectTitle: '上汽大通RG10众筹项目',
        modelName: '上汽大通RG10 生活家V90',
        shares: 3,
        investment: 150000,
        shareRatio: 30,
        income: 9000,
        role: 'initiator',
        status: 'funding',
        joinedAt: '2025-01-01 10:00:00',
      },
      {
        projectId: 2,
        projectNo: 'CF202501002',
        projectTitle: '依维柯欧胜C型房车众筹',
        modelName: '依维柯欧胜C型房车',
        shares: 3,
        investment: 150000,
        shareRatio: 30,
        income: 6000,
        role: 'investor',
        status: 'hosting',
        joinedAt: '2024-12-01 09:00:00',
      },
    ],
  },
  {
    userId: 2,
    userName: '李四',
    userPhone: '13800138002',
    projectCount: 3,
    totalShares: 7,
    totalInvestment: 335000,
    totalIncome: 18000,
    roles: ['initiator', 'investor'],
    registeredAt: '2024-09-20 14:20:00',
    projects: [
      {
        projectId: 1,
        projectNo: 'CF202501001',
        projectTitle: '上汽大通RG10众筹项目',
        modelName: '上汽大通RG10 生活家V90',
        shares: 2,
        investment: 100000,
        shareRatio: 20,
        income: 6000,
        role: 'investor',
        status: 'funding',
        joinedAt: '2025-01-02 14:30:00',
      },
      {
        projectId: 2,
        projectNo: 'CF202501002',
        projectTitle: '依维柯欧胜C型房车众筹',
        modelName: '依维柯欧胜C型房车',
        shares: 3,
        investment: 135000,
        shareRatio: 30,
        income: 8000,
        role: 'initiator',
        status: 'success',
        joinedAt: '2024-12-01 09:00:00',
      },
      {
        projectId: 5,
        projectNo: 'CF202411001',
        projectTitle: '依维柯房车众筹项目',
        modelName: '依维柯欧胜C型房车',
        shares: 2,
        investment: 100000,
        shareRatio: 20,
        income: 4000,
        role: 'investor',
        status: 'hosting',
        joinedAt: '2024-11-03 11:20:00',
      },
    ],
  },
  {
    userId: 3,
    userName: '王五',
    userPhone: '13800138003',
    projectCount: 1,
    totalShares: 2,
    totalInvestment: 100000,
    totalIncome: 6000,
    roles: ['investor'],
    registeredAt: '2024-11-05 09:15:00',
    projects: [
      {
        projectId: 1,
        projectNo: 'CF202501001',
        projectTitle: '上汽大通RG10众筹项目',
        modelName: '上汽大通RG10 生活家V90',
        shares: 2,
        investment: 100000,
        shareRatio: 20,
        income: 6000,
        role: 'investor',
        status: 'funding',
        joinedAt: '2025-01-03 09:15:00',
      },
    ],
  },
  {
    userId: 4,
    userName: '赵六',
    userPhone: '13800138004',
    projectCount: 2,
    totalShares: 3,
    totalInvestment: 150000,
    totalIncome: 3000,
    roles: ['initiator', 'manager'],
    registeredAt: '2024-10-10 16:20:00',
    projects: [
      {
        projectId: 1,
        projectNo: 'CF202501001',
        projectTitle: '上汽大通RG10众筹项目',
        modelName: '上汽大通RG10 生活家V90',
        shares: 1,
        investment: 50000,
        shareRatio: 10,
        income: 3000,
        role: 'manager',
        status: 'funding',
        joinedAt: '2025-01-04 16:20:00',
      },
      {
        projectId: 4,
        projectNo: 'CF202412001',
        projectTitle: '大通V90房车众筹项目',
        modelName: '上汽大通RG10 生活家V90',
        shares: 2,
        investment: 100000,
        shareRatio: 40,
        income: 0,
        role: 'initiator',
        status: 'failed',
        joinedAt: '2024-12-01 10:00:00',
      },
    ],
  },
  {
    userId: 5,
    userName: '孙七',
    userPhone: '13800138005',
    projectCount: 2,
    totalShares: 5,
    totalInvestment: 225000,
    totalIncome: 12000,
    roles: ['initiator', 'investor'],
    registeredAt: '2024-08-15 11:20:00',
    projects: [
      {
        projectId: 2,
        projectNo: 'CF202501002',
        projectTitle: '依维柯欧胜C型房车众筹',
        modelName: '依维柯欧胜C型房车',
        shares: 2,
        investment: 90000,
        shareRatio: 20,
        income: 4000,
        role: 'investor',
        status: 'success',
        joinedAt: '2024-12-02 11:20:00',
      },
      {
        projectId: 5,
        projectNo: 'CF202411001',
        projectTitle: '依维柯房车众筹项目',
        modelName: '依维柯欧胜C型房车',
        shares: 3,
        investment: 135000,
        shareRatio: 30,
        income: 8000,
        role: 'initiator',
        status: 'hosting',
        joinedAt: '2024-11-01 09:00:00',
      },
    ],
  },
]

// Mock 获取众筹车主列表
export const mockGetCrowdfundingOwnerList = (params: CrowdfundingOwnerListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredOwners = [...mockCrowdfundingOwners]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredOwners = filteredOwners.filter(
          o =>
            o.userName.toLowerCase().includes(keyword) ||
            o.userPhone.includes(keyword)
        )
      }

      // 角色筛选
      if (params.role) {
        filteredOwners = filteredOwners.filter(o => o.roles.includes(params.role as any))
      }

      // 分页
      const total = filteredOwners.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredOwners.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
        },
        message: '获取成功',
      })
    }, 500)
  })
}

// Mock 获取用户众筹参与记录
export const mockGetUserCrowdfundingRecords = (userId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const owner = mockCrowdfundingOwners.find(o => o.userId === userId)

      if (owner) {
        resolve({
          code: 200,
          data: owner.projects,
          message: '获取成功',
        })
      } else {
        resolve({
          code: 404,
          data: [],
          message: '用户不存在',
        })
      }
    }, 300)
  })
}

// ==================== 份额管理 ====================

// 份额列表查询参数
export interface CrowdfundingShareListParams {
  keyword?: string
  projectId?: number
  ownerId?: number
  status?: string
  page: number
  pageSize: number
}

// 份额转移记录
export interface ShareTransferHistory {
  transferNo: string
  fromOwner: string
  toOwner: string
  shares: number
  price: number
  status: 'pending' | 'completed' | 'cancelled'
  transferredAt: string
}

// 众筹份额信息
export interface CrowdfundingShare {
  id: number
  shareNo: string
  projectId: number
  projectNo: string
  projectTitle: string
  modelName: string
  brandName: string
  ownerId: number
  ownerName: string
  ownerPhone: string
  shares: number
  purchasePrice: number
  currentPrice: number
  totalIncome: number
  returnRate: number
  status: 'normal' | 'locked' | 'trading'
  purchasedAt: string
  transferHistory: ShareTransferHistory[]
}

// Mock 份额数据
const mockCrowdfundingShares: CrowdfundingShare[] = [
  {
    id: 1,
    shareNo: 'SH202501001-001',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    ownerId: 1,
    ownerName: '张三',
    ownerPhone: '13800138001',
    shares: 3,
    purchasePrice: 150000,
    currentPrice: 155000,
    totalIncome: 9000,
    returnRate: 9.33,
    status: 'normal',
    purchasedAt: '2025-01-01 10:00:00',
    transferHistory: [],
  },
  {
    id: 2,
    shareNo: 'SH202501001-002',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    ownerId: 2,
    ownerName: '李四',
    ownerPhone: '13800138002',
    shares: 2,
    purchasePrice: 100000,
    currentPrice: 103000,
    totalIncome: 6000,
    returnRate: 9.0,
    status: 'normal',
    purchasedAt: '2025-01-02 14:30:00',
    transferHistory: [],
  },
  {
    id: 3,
    shareNo: 'SH202501001-003',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    ownerId: 3,
    ownerName: '王五',
    ownerPhone: '13800138003',
    shares: 2,
    purchasePrice: 100000,
    currentPrice: 103000,
    totalIncome: 6000,
    returnRate: 9.0,
    status: 'locked',
    purchasedAt: '2025-01-03 09:15:00',
    transferHistory: [],
  },
  {
    id: 4,
    shareNo: 'SH202501001-004',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    brandName: '上汽大通',
    ownerId: 4,
    ownerName: '赵六',
    ownerPhone: '13800138004',
    shares: 1,
    purchasePrice: 50000,
    currentPrice: 51500,
    totalIncome: 3000,
    returnRate: 9.0,
    status: 'normal',
    purchasedAt: '2025-01-04 16:20:00',
    transferHistory: [],
  },
  {
    id: 5,
    shareNo: 'SH202501002-001',
    projectId: 2,
    projectNo: 'CF202501002',
    projectTitle: '依维柯欧胜C型房车众筹',
    modelName: '依维柯欧胜C型房车',
    brandName: '依维柯',
    ownerId: 1,
    ownerName: '张三',
    ownerPhone: '13800138001',
    shares: 3,
    purchasePrice: 150000,
    currentPrice: 154000,
    totalIncome: 6000,
    returnRate: 6.67,
    status: 'normal',
    purchasedAt: '2024-12-01 09:00:00',
    transferHistory: [
      {
        transferNo: 'TR202412001',
        fromOwner: '李四',
        toOwner: '张三',
        shares: 1,
        price: 50000,
        status: 'completed',
        transferredAt: '2024-12-15 14:30:00',
      },
    ],
  },
]

// Mock 获取份额列表
export const mockGetCrowdfundingShareList = (params: CrowdfundingShareListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredShares = [...mockCrowdfundingShares]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredShares = filteredShares.filter(
          s =>
            s.shareNo.toLowerCase().includes(keyword) ||
            s.ownerName.toLowerCase().includes(keyword) ||
            s.ownerPhone.includes(keyword)
        )
      }

      // 项目筛选
      if (params.projectId) {
        filteredShares = filteredShares.filter(s => s.projectId === params.projectId)
      }

      // 持有人筛选
      if (params.ownerId) {
        filteredShares = filteredShares.filter(s => s.ownerId === params.ownerId)
      }

      // 状态筛选
      if (params.status) {
        filteredShares = filteredShares.filter(s => s.status === params.status)
      }

      // 分页
      const total = filteredShares.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredShares.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
        },
        message: '获取成功',
      })
    }, 500)
  })
}

// Mock 锁定/解锁份额
export const mockToggleShareLock = (id: number, locked: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const share = mockCrowdfundingShares.find(s => s.id === id)

      if (share) {
        share.status = locked ? 'locked' : 'normal'

        resolve({
          code: 200,
          data: {
            share,
            locked,
            updatedAt: new Date().toISOString(),
          },
          message: locked ? '份额已锁定' : '份额已解锁',
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '份额不存在',
        })
      }
    }, 300)
  })
}

// ==================== 份额交易监管 ====================

// 份额交易列表查询参数
export interface CrowdfundingTransactionListParams {
  keyword?: string
  projectId?: number
  status?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// 份额交易信息
export interface CrowdfundingTransaction {
  id: number
  transactionNo: string
  projectId: number
  projectNo: string
  projectTitle: string
  modelName: string
  sellerId: number
  sellerName: string
  sellerPhone: string
  buyerId: number
  buyerName: string
  buyerPhone: string
  shares: number
  transactionPrice: number
  referencePrice: number
  status: 'pending' | 'completed' | 'cancelled'
  transactionTime: string
}

// Mock 份额交易数据
const mockCrowdfundingTransactions: CrowdfundingTransaction[] = [
  {
    id: 1,
    transactionNo: 'TR202501001',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    sellerId: 2,
    sellerName: '李四',
    sellerPhone: '13800138002',
    buyerId: 5,
    buyerName: '孙七',
    buyerPhone: '13800138005',
    shares: 1,
    transactionPrice: 52000,
    referencePrice: 51500,
    status: 'completed',
    transactionTime: '2025-01-10 14:30:00',
  },
  {
    id: 2,
    transactionNo: 'TR202501002',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    modelName: '上汽大通RG10 生活家V90',
    sellerId: 3,
    sellerName: '王五',
    sellerPhone: '13800138003',
    buyerId: 6,
    buyerName: '周八',
    buyerPhone: '13800138006',
    shares: 1,
    transactionPrice: 51000,
    referencePrice: 51500,
    status: 'pending',
    transactionTime: '2025-01-15 10:20:00',
  },
  {
    id: 3,
    transactionNo: 'TR202412001',
    projectId: 2,
    projectNo: 'CF202501002',
    projectTitle: '依维柯欧胜C型房车众筹',
    modelName: '依维柯欧胜C型房车',
    sellerId: 5,
    sellerName: '孙七',
    sellerPhone: '13800138005',
    buyerId: 1,
    buyerName: '张三',
    buyerPhone: '13800138001',
    shares: 1,
    transactionPrice: 50000,
    referencePrice: 51300,
    status: 'completed',
    transactionTime: '2024-12-15 14:30:00',
  },
  {
    id: 4,
    transactionNo: 'TR202412002',
    projectId: 2,
    projectNo: 'CF202501002',
    projectTitle: '依维柯欧胜C型房车众筹',
    modelName: '依维柯欧胜C型房车',
    sellerId: 2,
    sellerName: '李四',
    sellerPhone: '13800138002',
    buyerId: 4,
    buyerName: '赵六',
    buyerPhone: '13800138004',
    shares: 2,
    transactionPrice: 100000,
    referencePrice: 102600,
    status: 'cancelled',
    transactionTime: '2024-12-20 09:15:00',
  },
]

// Mock 获取份额交易列表
export const mockGetCrowdfundingTransactionList = (params: CrowdfundingTransactionListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredTransactions = [...mockCrowdfundingTransactions]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredTransactions = filteredTransactions.filter(
          t =>
            t.transactionNo.toLowerCase().includes(keyword) ||
            t.sellerName.toLowerCase().includes(keyword) ||
            t.buyerName.toLowerCase().includes(keyword)
        )
      }

      // 项目筛选
      if (params.projectId) {
        filteredTransactions = filteredTransactions.filter(t => t.projectId === params.projectId)
      }

      // 状态筛选
      if (params.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === params.status)
      }

      // 日期范围筛选
      if (params.startDate) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionTime >= params.startDate!)
      }
      if (params.endDate) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionTime <= params.endDate!)
      }

      // 分页
      const total = filteredTransactions.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredTransactions.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
        },
        message: '获取成功',
      })
    }, 500)
  })
}

// Mock 取消交易
export const mockCancelCrowdfundingTransaction = (id: number, reason: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockCrowdfundingTransactions.find(t => t.id === id)

      if (transaction) {
        transaction.status = 'cancelled'

        resolve({
          code: 200,
          data: {
            transaction,
            reason,
            cancelledAt: new Date().toISOString(),
          },
          message: '交易已取消',
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '交易不存在',
        })
      }
    }, 300)
  })
}

// ==================== 收益分配管理 ====================

// 收益分配列表查询参数
export interface CrowdfundingIncomeListParams {
  keyword?: string
  projectId?: number
  status?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// 收益分配明细
export interface IncomeDistributionDetail {
  userId: number
  userName: string
  userPhone: string
  shares: number
  shareRatio: number
  income: number
  role: 'initiator' | 'investor' | 'manager'
  status: 'pending' | 'success' | 'failed'
}

// 收益分配记录
export interface CrowdfundingIncomeRecord {
  id: number
  recordNo: string
  projectId: number
  projectNo: string
  projectTitle: string
  vehicleId: number
  vehiclePlate: string
  modelName: string
  orderNo: string
  orderAmount: number
  totalIncome: number
  beneficiaryCount: number
  distributionTime: string
  status: 'pending' | 'distributed' | 'failed'
  distributions: IncomeDistributionDetail[]
}

// 收益统计数据
export interface CrowdfundingIncomeStats {
  totalIncome: number
  distributedIncome: number
  pendingIncome: number
  monthlyIncome: number
}

// Mock 收益分配记录数据
const mockCrowdfundingIncomeRecords: CrowdfundingIncomeRecord[] = [
  {
    id: 1,
    recordNo: 'IN202501001',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    vehicleId: 1,
    vehiclePlate: '京A12345',
    modelName: '上汽大通RG10 生活家V90',
    orderNo: 'ORD202501001',
    orderAmount: 5000,
    totalIncome: 3500,
    beneficiaryCount: 4,
    distributionTime: '2025-01-10 15:00:00',
    status: 'distributed',
    distributions: [
      {
        userId: 1,
        userName: '张三',
        userPhone: '13800138001',
        shares: 3,
        shareRatio: 30,
        income: 1050,
        role: 'initiator',
        status: 'success',
      },
      {
        userId: 2,
        userName: '李四',
        userPhone: '13800138002',
        shares: 2,
        shareRatio: 20,
        income: 700,
        role: 'investor',
        status: 'success',
      },
      {
        userId: 3,
        userName: '王五',
        userPhone: '13800138003',
        shares: 2,
        shareRatio: 20,
        income: 700,
        role: 'investor',
        status: 'success',
      },
      {
        userId: 4,
        userName: '赵六',
        userPhone: '13800138004',
        shares: 1,
        shareRatio: 10,
        income: 350,
        role: 'manager',
        status: 'success',
      },
    ],
  },
  {
    id: 2,
    recordNo: 'IN202501002',
    projectId: 1,
    projectNo: 'CF202501001',
    projectTitle: '上汽大通RG10众筹项目',
    vehicleId: 1,
    vehiclePlate: '京A12345',
    modelName: '上汽大通RG10 生活家V90',
    orderNo: 'ORD202501002',
    orderAmount: 4500,
    totalIncome: 3150,
    beneficiaryCount: 4,
    distributionTime: '2025-01-15 10:30:00',
    status: 'pending',
    distributions: [
      {
        userId: 1,
        userName: '张三',
        userPhone: '13800138001',
        shares: 3,
        shareRatio: 30,
        income: 945,
        role: 'initiator',
        status: 'pending',
      },
      {
        userId: 2,
        userName: '李四',
        userPhone: '13800138002',
        shares: 2,
        shareRatio: 20,
        income: 630,
        role: 'investor',
        status: 'pending',
      },
      {
        userId: 3,
        userName: '王五',
        userPhone: '13800138003',
        shares: 2,
        shareRatio: 20,
        income: 630,
        role: 'investor',
        status: 'pending',
      },
      {
        userId: 4,
        userName: '赵六',
        userPhone: '13800138004',
        shares: 1,
        shareRatio: 10,
        income: 315,
        role: 'manager',
        status: 'pending',
      },
    ],
  },
  {
    id: 3,
    recordNo: 'IN202412001',
    projectId: 2,
    projectNo: 'CF202501002',
    projectTitle: '依维柯欧胜C型房车众筹',
    vehicleId: 2,
    vehiclePlate: '京B67890',
    modelName: '依维柯欧胜C型房车',
    orderNo: 'ORD202412001',
    orderAmount: 4000,
    totalIncome: 2800,
    beneficiaryCount: 5,
    distributionTime: '2024-12-20 14:00:00',
    status: 'distributed',
    distributions: [],
  },
]

// Mock 获取收益分配列表
export const mockGetCrowdfundingIncomeList = (params: CrowdfundingIncomeListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRecords = [...mockCrowdfundingIncomeRecords]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredRecords = filteredRecords.filter(
          r =>
            r.recordNo.toLowerCase().includes(keyword) ||
            r.orderNo.toLowerCase().includes(keyword)
        )
      }

      // 项目筛选
      if (params.projectId) {
        filteredRecords = filteredRecords.filter(r => r.projectId === params.projectId)
      }

      // 状态筛选
      if (params.status) {
        filteredRecords = filteredRecords.filter(r => r.status === params.status)
      }

      // 日期范围筛选
      if (params.startDate) {
        filteredRecords = filteredRecords.filter(r => r.distributionTime >= params.startDate!)
      }
      if (params.endDate) {
        filteredRecords = filteredRecords.filter(r => r.distributionTime <= params.endDate!)
      }

      // 分页
      const total = filteredRecords.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredRecords.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
        },
        message: '获取成功',
      })
    }, 500)
  })
}

// Mock 获取收益统计
export const mockGetCrowdfundingIncomeStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: CrowdfundingIncomeStats = {
        totalIncome: 125000,
        distributedIncome: 98000,
        pendingIncome: 27000,
        monthlyIncome: 45000,
      }

      resolve({
        code: 200,
        data: stats,
        message: '获取成功',
      })
    }, 300)
  })
}

// Mock 执行收益分配
export const mockDistributeCrowdfundingIncome = (data: {
  projectId: number
  orderId: string
  totalIncome: number
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          recordNo: `IN${Date.now()}`,
          distributedAt: new Date().toISOString(),
          ...data,
        },
        message: '收益分配成功',
      })
    }, 1000)
  })
}

// ==================== 车主自用费用配置 Mock 数据 ====================

// ==================== 淡季补贴配置 Mock 数据 ====================

/**
 * Mock: 淡季补贴配置列表数据
 */
export const mockSeasonalSubsidyConfigs = [
  {
    id: 1,
    configName: '2025年淡季补贴标准',
    seasonStartDate: '11-15',
    seasonEndDate: '03-15',
    maxSubsidyAmount: 1000,
    calculationFormula: '补贴金额 = (1 - 出租率) × 1000元',
    minOccupancyRate: 0,
    enabled: true,
    effectiveYear: 2025,
    description: '2025年冬季淡季补贴配置',
    createdBy: '系统管理员',
    createdAt: '2025-01-01 10:00:00',
  },
]

// ==================== 车主自用费用配置 Mock 数据 ====================

/**
 * 车主自用费用配置接口
 */
export interface OwnerUsageFeeConfig {
  id: number
  configName: string
  serviceFeeMin: number
  serviceFeeMax: number
  serviceFeeDefault: number
  relocationFee: number
  relocationFreeCount: number
  maxUsageDaysPerMonth: number
  advanceNoticeDays: number
  enabled: boolean
  effectiveDate: string
  expiryDate?: string
  description?: string
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt?: string
}

/**
 * Mock: 车主自用费用配置列表数据
 */
export const mockOwnerUsageFeeConfigs: OwnerUsageFeeConfig[] = [
  {
    id: 1,
    configName: '标准自用费用配置',
    serviceFeeMin: 200,
    serviceFeeMax: 500,
    serviceFeeDefault: 300,
    relocationFee: 500,
    relocationFreeCount: 1,
    maxUsageDaysPerMonth: 7,
    advanceNoticeDays: 3,
    enabled: true,
    effectiveDate: '2025-01-01',
    description: '适用于所有托管车辆的标准自用费用配置',
    createdBy: '系统管理员',
    createdAt: '2025-01-01 00:00:00',
  },
  {
    id: 2,
    configName: 'VIP车主优惠配置',
    serviceFeeMin: 150,
    serviceFeeMax: 400,
    serviceFeeDefault: 250,
    relocationFee: 300,
    relocationFreeCount: 2,
    maxUsageDaysPerMonth: 10,
    advanceNoticeDays: 2,
    enabled: true,
    effectiveDate: '2025-01-01',
    description: '适用于VIP车主的优惠自用费用配置',
    createdBy: '系统管理员',
    createdAt: '2025-01-01 00:00:00',
  },
  {
    id: 3,
    configName: '旺季自用费用配置',
    serviceFeeMin: 300,
    serviceFeeMax: 600,
    serviceFeeDefault: 400,
    relocationFee: 600,
    relocationFreeCount: 0,
    maxUsageDaysPerMonth: 5,
    advanceNoticeDays: 5,
    enabled: false,
    effectiveDate: '2025-05-01',
    expiryDate: '2025-10-31',
    description: '旺季期间的自用费用配置，限制自用天数',
    createdBy: '系统管理员',
    createdAt: '2025-01-01 00:00:00',
  },
]
