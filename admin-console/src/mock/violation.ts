/**
 * 违章管理模块 Mock 数据
 */

// 违章记录数据类型
export interface ViolationRecord {
  id: number
  vehicleId: number
  vehicleNumber: string
  modelName: string
  violationType: string // 违章类型
  violationCode: string // 违章代码
  violationDate: string // 违章日期
  violationLocation: string // 违章地点
  violationDescription: string // 违章描述
  penaltyPoints: number // 扣分
  fineAmount: number // 罚款金额
  status: 'pending' | 'processing' | 'paid' | 'appealing' | 'cancelled' // 状态
  driverName: string // 驾驶人
  driverLicense: string // 驾驶证号
  processDate?: string // 处理日期
  paymentDate?: string // 缴款日期
  paymentMethod?: string // 缴款方式
  handler: string // 处理人
  remark: string
  attachments: string[] // 附件（违章照片、处理凭证等）
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 违章统计数据类型
export interface ViolationStats {
  totalViolations: number
  pendingViolations: number
  processingViolations: number
  paidViolations: number
  totalPoints: number
  totalFines: number
  monthlyViolations: number
  monthlyPoints: number
  monthlyFines: number
}

// 违章记录Mock数据
export const mockViolationRecords: ViolationRecord[] = [
  {
    id: 1,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    violationType: '超速行驶',
    violationCode: '1345',
    violationDate: '2024-11-15',
    violationLocation: '北京市朝阳区东三环',
    violationDescription: '超速20%以下',
    penaltyPoints: 3,
    fineAmount: 200,
    status: 'paid',
    driverName: '张三',
    driverLicense: '110101199001011234',
    processDate: '2024-11-20',
    paymentDate: '2024-11-20',
    paymentMethod: '微信支付',
    handler: '李四',
    remark: '已处理完成',
    attachments: ['/uploads/violations/v001_1.jpg'],
    createdBy: '系统',
    createdAt: '2024-11-16 10:00:00',
    updatedAt: '2024-11-20 15:30:00',
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleNumber: '京A12346',
    modelName: 'RV80 C型房车',
    violationType: '违法停车',
    violationCode: '1039',
    violationDate: '2024-11-20',
    violationLocation: '北京市海淀区中关村大街',
    violationDescription: '在禁止停车路段停车',
    penaltyPoints: 0,
    fineAmount: 200,
    status: 'processing',
    driverName: '李四',
    driverLicense: '110101199002022345',
    processDate: '2024-11-25',
    handler: '王五',
    remark: '正在处理中',
    attachments: ['/uploads/violations/v002_1.jpg'],
    createdBy: '张三',
    createdAt: '2024-11-21 09:00:00',
    updatedAt: '2024-11-25 10:00:00',
  },
  {
    id: 3,
    vehicleId: 1,
    vehicleNumber: '京A12345',
    modelName: 'RV80 C型房车',
    violationType: '闯红灯',
    violationCode: '1625',
    violationDate: '2024-11-25',
    violationLocation: '北京市丰台区南三环',
    violationDescription: '驾驶机动车违反道路交通信号灯通行',
    penaltyPoints: 6,
    fineAmount: 200,
    status: 'pending',
    driverName: '王五',
    driverLicense: '110101199003033456',
    handler: '',
    remark: '待处理',
    attachments: [
      '/uploads/violations/v003_1.jpg',
      '/uploads/violations/v003_2.jpg',
    ],
    createdBy: '系统',
    createdAt: '2024-11-26 14:00:00',
    updatedAt: '2024-11-26 14:00:00',
  },
  {
    id: 4,
    vehicleId: 3,
    vehicleNumber: '京B23456',
    modelName: '全顺B型房车',
    violationType: '未系安全带',
    violationCode: '1240',
    violationDate: '2024-11-18',
    violationLocation: '上海市浦东新区世纪大道',
    violationDescription: '驾驶机动车在高速公路或者城市快速路上行驶时，驾驶人未按规定系安全带',
    penaltyPoints: 2,
    fineAmount: 50,
    status: 'paid',
    driverName: '赵六',
    driverLicense: '310101199004044567',
    processDate: '2024-11-22',
    paymentDate: '2024-11-22',
    paymentMethod: '支付宝',
    handler: '孙七',
    remark: '已处理',
    attachments: [],
    createdBy: '李四',
    createdAt: '2024-11-19 11:00:00',
    updatedAt: '2024-11-22 16:00:00',
  },
  {
    id: 5,
    vehicleId: 7,
    vehicleNumber: '川F67890',
    modelName: '特顺C型房车',
    violationType: '违法变道',
    violationCode: '1345A',
    violationDate: '2024-11-28',
    violationLocation: '成都市武侯区天府大道',
    violationDescription: '机动车违反禁止标线指示',
    penaltyPoints: 3,
    fineAmount: 100,
    status: 'pending',
    driverName: '周八',
    driverLicense: '510101199005055678',
    handler: '',
    remark: '',
    attachments: ['/uploads/violations/v005_1.jpg'],
    createdBy: '系统',
    createdAt: '2024-11-29 08:00:00',
    updatedAt: '2024-11-29 08:00:00',
  },
]

/**
 * 获取违章记录列表
 */
export const mockGetViolationRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  violationType?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  const {
    page = 1,
    pageSize = 10,
    vehicleId,
    vehicleNumber,
    violationType,
    status,
    startDate,
    endDate,
  } = params

  // 过滤数据
  let filteredData = [...mockViolationRecords]

  if (vehicleId) {
    filteredData = filteredData.filter(item => item.vehicleId === vehicleId)
  }

  if (vehicleNumber) {
    filteredData = filteredData.filter(item =>
      item.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
    )
  }

  if (violationType) {
    filteredData = filteredData.filter(item => item.violationType === violationType)
  }

  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }

  if (startDate) {
    filteredData = filteredData.filter(item => item.violationDate >= startDate)
  }

  if (endDate) {
    filteredData = filteredData.filter(item => item.violationDate <= endDate)
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
 * 获取违章记录详情
 */
export const mockGetViolationRecordDetail = (id: number) => {
  const record = mockViolationRecords.find(item => item.id === id)

  if (!record) {
    return Promise.reject({
      code: 404,
      message: '违章记录不存在',
    })
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: record,
  })
}

/**
 * 创建违章记录
 */
export const mockCreateViolationRecord = (data: Partial<ViolationRecord>) => {
  const newRecord: ViolationRecord = {
    id: mockViolationRecords.length + 1,
    vehicleId: data.vehicleId!,
    vehicleNumber: data.vehicleNumber!,
    modelName: data.modelName!,
    violationType: data.violationType!,
    violationCode: data.violationCode!,
    violationDate: data.violationDate!,
    violationLocation: data.violationLocation!,
    violationDescription: data.violationDescription!,
    penaltyPoints: data.penaltyPoints!,
    fineAmount: data.fineAmount!,
    status: data.status || 'pending',
    driverName: data.driverName!,
    driverLicense: data.driverLicense!,
    processDate: data.processDate,
    paymentDate: data.paymentDate,
    paymentMethod: data.paymentMethod,
    handler: data.handler || '',
    remark: data.remark || '',
    attachments: data.attachments || [],
    createdBy: '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockViolationRecords.unshift(newRecord)

  return Promise.resolve({
    code: 200,
    message: '创建成功',
    data: newRecord,
  })
}

/**
 * 更新违章记录
 */
export const mockUpdateViolationRecord = (id: number, data: Partial<ViolationRecord>) => {
  const index = mockViolationRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '违章记录不存在',
    })
  }

  const updatedRecord = {
    ...mockViolationRecords[index],
    ...data,
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockViolationRecords[index] = updatedRecord

  return Promise.resolve({
    code: 200,
    message: '更新成功',
    data: updatedRecord,
  })
}

/**
 * 删除违章记录
 */
export const mockDeleteViolationRecord = (id: number) => {
  const index = mockViolationRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '违章记录不存在',
    })
  }

  mockViolationRecords.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: '删除成功',
  })
}

/**
 * 处理违章
 */
export const mockProcessViolation = (id: number, data: {
  processDate: string
  paymentDate?: string
  paymentMethod?: string
  handler: string
  remark?: string
}) => {
  const index = mockViolationRecords.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '违章记录不存在',
    })
  }

  const updatedRecord = {
    ...mockViolationRecords[index],
    ...data,
    status: data.paymentDate ? 'paid' : 'processing',
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockViolationRecords[index] = updatedRecord as ViolationRecord

  return Promise.resolve({
    code: 200,
    message: '处理成功',
    data: updatedRecord,
  })
}

/**
 * 获取违章统计
 */
export const mockGetViolationStats = () => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyRecords = mockViolationRecords.filter(r => {
    const recordDate = new Date(r.violationDate)
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
  })

  const stats: ViolationStats = {
    totalViolations: mockViolationRecords.length,
    pendingViolations: mockViolationRecords.filter(r => r.status === 'pending').length,
    processingViolations: mockViolationRecords.filter(r => r.status === 'processing').length,
    paidViolations: mockViolationRecords.filter(r => r.status === 'paid').length,
    totalPoints: mockViolationRecords.reduce((sum, r) => sum + r.penaltyPoints, 0),
    totalFines: mockViolationRecords.reduce((sum, r) => sum + r.fineAmount, 0),
    monthlyViolations: monthlyRecords.length,
    monthlyPoints: monthlyRecords.reduce((sum, r) => sum + r.penaltyPoints, 0),
    monthlyFines: monthlyRecords.reduce((sum, r) => sum + r.fineAmount, 0),
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}
