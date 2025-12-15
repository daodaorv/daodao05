/**
 * 保险管理模块 Mock 数据
 */

// 保险记录数据类型
export interface InsuranceRecord {
  id: number
  vehicleId: number
  vehicleNumber: string
  modelName: string
  insuranceType: 'compulsory' | 'commercial' | 'combined' // 保险类型：交强险/商业险/组合
  insuranceCompany: string // 保险公司
  policyNumber: string // 保单号
  insuranceAmount: number // 保险金额
  premium: number // 保费
  startDate: string // 起保日期
  endDate: string // 到期日期
  status: 'active' | 'expired' | 'cancelled' // 状态
  coverageItems: CoverageItem[] // 保险项目
  beneficiary: string // 受益人
  remark: string // 备注
  attachments: string[] // 附件（保单扫描件等）
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 保险项目
export interface CoverageItem {
  id: number
  name: string // 项目名称
  coverage: number // 保额
  premium: number // 保费
  deductible: number // 免赔额
  remark: string
}

// 理赔记录数据类型
export interface ClaimRecord {
  id: number
  insuranceId: number
  vehicleId: number
  vehicleNumber: string
  modelName: string
  claimNumber: string // 理赔单号
  accidentDate: string // 出险日期
  accidentLocation: string // 出险地点
  accidentType: string // 事故类型
  accidentDescription: string // 事故描述
  claimAmount: number // 理赔金额
  approvedAmount: number // 核定金额
  deductible: number // 免赔额
  actualAmount: number // 实际赔付金额
  status: 'pending' | 'investigating' | 'approved' | 'rejected' | 'paid' // 状态
  submittedDate: string // 提交日期
  approvedDate?: string // 核定日期
  paidDate?: string // 赔付日期
  handler: string // 处理人
  remark: string
  attachments: string[] // 附件（事故照片、维修单据等）
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 续保提醒数据类型
export interface RenewalReminder {
  id: number
  vehicleId: number
  vehicleNumber: string
  modelName: string
  insuranceId: number
  insuranceType: string
  insuranceCompany: string
  endDate: string
  daysRemaining: number
  status: 'pending' | 'reminded' | 'renewed' | 'ignored'
  remindDate: string
  remark: string
}

// 保险记录Mock数据
export const mockInsuranceRecords: InsuranceRecord[] = [
  {
    id: 1,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    insuranceType: 'combined',
    insuranceCompany: '中国人保',
    policyNumber: 'PICC2024001',
    insuranceAmount: 500000,
    premium: 8500,
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    status: 'active',
    coverageItems: [
      {
        id: 1,
        name: '交强险',
        coverage: 122000,
        premium: 950,
        deductible: 0,
        remark: '国家强制保险',
      },
      {
        id: 2,
        name: '车损险',
        coverage: 300000,
        premium: 3500,
        deductible: 500,
        remark: '',
      },
      {
        id: 3,
        name: '第三者责任险',
        coverage: 1000000,
        premium: 2800,
        deductible: 0,
        remark: '100万保额',
      },
      {
        id: 4,
        name: '车上人员责任险',
        coverage: 50000,
        premium: 800,
        deductible: 0,
        remark: '司机+乘客',
      },
      {
        id: 5,
        name: '盗抢险',
        coverage: 300000,
        premium: 450,
        deductible: 0,
        remark: '',
      },
    ],
    beneficiary: '叨叨房车租赁公司',
    remark: '全险',
    attachments: ['/uploads/insurance/policy_001.pdf'],
    createdBy: '系统',
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-01-10 10:00:00',
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleNumber: '京A12346',
    modelName: 'RV80 C型房车',
    insuranceType: 'combined',
    insuranceCompany: '中国平安',
    policyNumber: 'PINGAN2024002',
    insuranceAmount: 500000,
    premium: 8200,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'active',
    coverageItems: [
      {
        id: 1,
        name: '交强险',
        coverage: 122000,
        premium: 950,
        deductible: 0,
        remark: '',
      },
      {
        id: 2,
        name: '车损险',
        coverage: 300000,
        premium: 3400,
        deductible: 500,
        remark: '',
      },
      {
        id: 3,
        name: '第三者责任险',
        coverage: 1000000,
        premium: 2700,
        deductible: 0,
        remark: '',
      },
      {
        id: 4,
        name: '车上人员责任险',
        coverage: 50000,
        premium: 750,
        deductible: 0,
        remark: '',
      },
      {
        id: 5,
        name: '玻璃单独破碎险',
        coverage: 10000,
        premium: 400,
        deductible: 0,
        remark: '',
      },
    ],
    beneficiary: '叨叨房车租赁公司',
    remark: '',
    attachments: [],
    createdBy: '张三',
    createdAt: '2024-01-25 14:30:00',
    updatedAt: '2024-01-25 14:30:00',
  },
  {
    id: 3,
    vehicleId: 3,
    vehicleNumber: '京B23456',
    modelName: '全顺B型房车',
    insuranceType: 'combined',
    insuranceCompany: '太平洋保险',
    policyNumber: 'CPIC2024003',
    insuranceAmount: 400000,
    premium: 7500,
    startDate: '2024-03-10',
    endDate: '2025-03-09',
    status: 'active',
    coverageItems: [
      {
        id: 1,
        name: '交强险',
        coverage: 122000,
        premium: 950,
        deductible: 0,
        remark: '',
      },
      {
        id: 2,
        name: '车损险',
        coverage: 250000,
        premium: 3000,
        deductible: 500,
        remark: '',
      },
      {
        id: 3,
        name: '第三者责任险',
        coverage: 500000,
        premium: 2200,
        deductible: 0,
        remark: '',
      },
      {
        id: 4,
        name: '车上人员责任险',
        coverage: 30000,
        premium: 600,
        deductible: 0,
        remark: '',
      },
      {
        id: 5,
        name: '自燃损失险',
        coverage: 250000,
        premium: 750,
        deductible: 0,
        remark: '',
      },
    ],
    beneficiary: '叨叨房车租赁公司',
    remark: '',
    attachments: [],
    createdBy: '李四',
    createdAt: '2024-03-05 09:00:00',
    updatedAt: '2024-03-05 09:00:00',
  },
]

// 理赔记录Mock数据
export const mockClaimRecords: ClaimRecord[] = [
  {
    id: 1,
    insuranceId: 1,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    claimNumber: 'CLAIM2024001',
    accidentDate: '2024-11-15',
    accidentLocation: '北京市朝阳区东三环',
    accidentType: '追尾事故',
    accidentDescription: '在东三环行驶时被后车追尾，车尾受损',
    claimAmount: 8000,
    approvedAmount: 7500,
    deductible: 500,
    actualAmount: 7000,
    status: 'paid',
    submittedDate: '2024-11-16',
    approvedDate: '2024-11-20',
    paidDate: '2024-11-25',
    handler: '王理赔员',
    remark: '已完成赔付',
    attachments: [
      '/uploads/claims/accident_001_1.jpg',
      '/uploads/claims/accident_001_2.jpg',
      '/uploads/claims/repair_invoice_001.pdf',
    ],
    createdBy: '张三',
    createdAt: '2024-11-16 10:00:00',
    updatedAt: '2024-11-25 16:00:00',
  },
  {
    id: 2,
    insuranceId: 2,
    vehicleId: 2,
    vehicleNumber: '京A12346',
    modelName: 'RV80 C型房车',
    claimNumber: 'CLAIM2024002',
    accidentDate: '2024-11-20',
    accidentLocation: '北京市海淀区中关村',
    accidentType: '刮擦事故',
    accidentDescription: '停车时被其他车辆刮擦，左侧车门受损',
    claimAmount: 3000,
    approvedAmount: 2800,
    deductible: 500,
    actualAmount: 2300,
    status: 'approved',
    submittedDate: '2024-11-21',
    approvedDate: '2024-11-28',
    handler: '李理赔员',
    remark: '等待赔付',
    attachments: ['/uploads/claims/accident_002_1.jpg'],
    createdBy: '李四',
    createdAt: '2024-11-21 14:30:00',
    updatedAt: '2024-11-28 10:00:00',
  },
  {
    id: 3,
    insuranceId: 1,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    claimNumber: 'CLAIM2024003',
    accidentDate: '2024-11-28',
    accidentLocation: '北京市丰台区',
    accidentType: '玻璃破损',
    accidentDescription: '行驶中被飞石击中，前挡风玻璃破损',
    claimAmount: 2500,
    approvedAmount: 0,
    deductible: 0,
    actualAmount: 0,
    status: 'investigating',
    submittedDate: '2024-11-29',
    handler: '赵理赔员',
    remark: '正在调查中',
    attachments: ['/uploads/claims/accident_003_1.jpg'],
    createdBy: '王五',
    createdAt: '2024-11-29 09:00:00',
    updatedAt: '2024-11-29 09:00:00',
  },
]

// 续保提醒Mock数据
export const mockRenewalReminders: RenewalReminder[] = [
  {
    id: 1,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    insuranceId: 1,
    insuranceType: '组合险',
    insuranceCompany: '中国人保',
    endDate: '2025-01-14',
    daysRemaining: 45,
    status: 'pending',
    remindDate: '2024-12-01',
    remark: '即将到期，请及时续保',
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleNumber: '京A12346',
    modelName: 'RV80 C型房车',
    insuranceId: 2,
    insuranceType: '组合险',
    insuranceCompany: '中国平安',
    endDate: '2025-01-31',
    daysRemaining: 62,
    status: 'pending',
    remindDate: '2024-12-01',
    remark: '',
  },
]

/**
 * 获取保险记录列表
 */
export const mockGetInsuranceRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  insuranceType?: string
  status?: string
  insuranceCompany?: string
}) => {
  const { page = 1, pageSize = 10, vehicleId, vehicleNumber, insuranceType, status, insuranceCompany } = params

  // 过滤数据
  let filteredData = [...mockInsuranceRecords]

  if (vehicleId) {
    filteredData = filteredData.filter(item => item.vehicleId === vehicleId)
  }

  if (vehicleNumber) {
    filteredData = filteredData.filter(item =>
      item.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
    )
  }

  if (insuranceType) {
    filteredData = filteredData.filter(item => item.insuranceType === insuranceType)
  }

  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }

  if (insuranceCompany) {
    filteredData = filteredData.filter(item =>
      item.insuranceCompany.toLowerCase().includes(insuranceCompany.toLowerCase())
    )
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  })
}

/**
 * 获取保险记录详情
 */
export const mockGetInsuranceRecordDetail = (id: number) => {
  const record = mockInsuranceRecords.find(item => item.id === id)

  if (!record) {
    return Promise.reject({
      code: 404,
      message: '保险记录不存在',
    })
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: record,
  })
}

/**
 * 创建保险记录
 */
export const mockCreateInsuranceRecord = (data: Partial<InsuranceRecord>) => {
  const newRecord: InsuranceRecord = {
    id: mockInsuranceRecords.length + 1,
    vehicleId: data.vehicleId!,
    vehicleNumber: data.vehicleNumber!,
    modelName: data.modelName!,
    insuranceType: data.insuranceType!,
    insuranceCompany: data.insuranceCompany!,
    policyNumber: data.policyNumber!,
    insuranceAmount: data.insuranceAmount!,
    premium: data.premium!,
    startDate: data.startDate!,
    endDate: data.endDate!,
    status: data.status || 'active',
    coverageItems: data.coverageItems || [],
    beneficiary: data.beneficiary || '',
    remark: data.remark || '',
    attachments: data.attachments || [],
    createdBy: '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockInsuranceRecords.unshift(newRecord)

  return Promise.resolve({
    code: 200,
    message: '创建成功',
    data: newRecord,
  })
}

/**
 * 更新保险记录
 */
export const mockUpdateInsuranceRecord = (id: number, data: Partial<InsuranceRecord>) => {
  const index = mockInsuranceRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '保险记录不存在',
    })
  }

  const updatedRecord = {
    ...mockInsuranceRecords[index],
    ...data,
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockInsuranceRecords[index] = updatedRecord

  return Promise.resolve({
    code: 200,
    message: '更新成功',
    data: updatedRecord,
  })
}

/**
 * 删除保险记录
 */
export const mockDeleteInsuranceRecord = (id: number) => {
  const index = mockInsuranceRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '保险记录不存在',
    })
  }

  mockInsuranceRecords.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: '删除成功',
  })
}

/**
 * 获取理赔记录列表
 */
export const mockGetClaimRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  const { page = 1, pageSize = 10, vehicleId, vehicleNumber, status, startDate, endDate } = params

  // 过滤数据
  let filteredData = [...mockClaimRecords]

  if (vehicleId) {
    filteredData = filteredData.filter(item => item.vehicleId === vehicleId)
  }

  if (vehicleNumber) {
    filteredData = filteredData.filter(item =>
      item.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
    )
  }

  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }

  if (startDate) {
    filteredData = filteredData.filter(item => item.accidentDate >= startDate)
  }

  if (endDate) {
    filteredData = filteredData.filter(item => item.accidentDate <= endDate)
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  })
}

/**
 * 获取理赔记录详情
 */
export const mockGetClaimRecordDetail = (id: number) => {
  const record = mockClaimRecords.find(item => item.id === id)

  if (!record) {
    return Promise.reject({
      code: 404,
      message: '理赔记录不存在',
    })
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: record,
  })
}

/**
 * 创建理赔记录
 */
export const mockCreateClaimRecord = (data: Partial<ClaimRecord>) => {
  const newRecord: ClaimRecord = {
    id: mockClaimRecords.length + 1,
    insuranceId: data.insuranceId!,
    vehicleId: data.vehicleId!,
    vehicleNumber: data.vehicleNumber!,
    modelName: data.modelName!,
    claimNumber: data.claimNumber || `CLAIM${Date.now()}`,
    accidentDate: data.accidentDate!,
    accidentLocation: data.accidentLocation!,
    accidentType: data.accidentType!,
    accidentDescription: data.accidentDescription!,
    claimAmount: data.claimAmount!,
    approvedAmount: data.approvedAmount || 0,
    deductible: data.deductible || 0,
    actualAmount: data.actualAmount || 0,
    status: data.status || 'pending',
    submittedDate: data.submittedDate || new Date().toISOString().split('T')[0],
    approvedDate: data.approvedDate,
    paidDate: data.paidDate,
    handler: data.handler || '',
    remark: data.remark || '',
    attachments: data.attachments || [],
    createdBy: '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockClaimRecords.unshift(newRecord)

  return Promise.resolve({
    code: 200,
    message: '创建成功',
    data: newRecord,
  })
}

/**
 * 更新理赔记录
 */
export const mockUpdateClaimRecord = (id: number, data: Partial<ClaimRecord>) => {
  const index = mockClaimRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '理赔记录不存在',
    })
  }

  const updatedRecord = {
    ...mockClaimRecords[index],
    ...data,
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockClaimRecords[index] = updatedRecord

  return Promise.resolve({
    code: 200,
    message: '更新成功',
    data: updatedRecord,
  })
}

/**
 * 获取续保提醒列表
 */
export const mockGetRenewalReminders = (params: {
  page?: number
  pageSize?: number
  status?: string
  daysThreshold?: number
}) => {
  const { page = 1, pageSize = 10, status, daysThreshold } = params

  // 过滤数据
  let filteredData = [...mockRenewalReminders]

  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }

  if (daysThreshold) {
    filteredData = filteredData.filter(item => item.daysRemaining <= daysThreshold)
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  })
}

/**
 * 获取保险统计
 */
export const mockGetInsuranceStats = () => {
  const stats = {
    totalInsurance: mockInsuranceRecords.length,
    activeInsurance: mockInsuranceRecords.filter(r => r.status === 'active').length,
    expiredInsurance: mockInsuranceRecords.filter(r => r.status === 'expired').length,
    expiringInsurance: mockInsuranceRecords.filter(r => {
      const endDate = new Date(r.endDate)
      const now = new Date()
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysRemaining > 0 && daysRemaining <= 30 && r.status === 'active'
    }).length,
    totalPremium: mockInsuranceRecords.reduce((sum, r) => sum + r.premium, 0),
    totalClaims: mockClaimRecords.length,
    pendingClaims: mockClaimRecords.filter(c => c.status === 'pending' || c.status === 'investigating').length,
    totalClaimAmount: mockClaimRecords
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.actualAmount, 0),
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}
