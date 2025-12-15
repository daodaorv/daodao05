/**
 * 分润管理 Mock 数据
 */

// ==================== 托管分润 ====================

/**
 * 托管分润记录
 */
export interface HostingProfitRecord {
  id: number
  recordNo: string // 记录编号
  vehicleNo: string // 车辆编号
  vehicleBrand: string // 车辆品牌
  vehicleModel: string // 车辆型号
  licensePlate: string // 车牌号
  hostingType: 'old_car' | 'new_car' // 托管类型
  ownerName: string // 车主姓名
  ownerPhone: string // 车主电话
  settlementMonth: string // 结算月份
  totalIncome: number // 总收益
  ownerShare: number // 车主分成比例
  platformShare: number // 平台分成比例
  ownerAmount: number // 车主金额
  platformAmount: number // 平台金额
  guaranteedIncome: number // 保底收益(购车托管)
  subsidyAmount: number // 淡季补贴
  ownerUsageFee: number // 车主自用费用
  settlementStatus: 'pending' | 'settled' | 'paid' // 结算状态
  settlementDate: string // 结算日期
  paymentDate: string // 支付日期
  remark: string // 备注
  createdAt: string
  updatedAt: string
}

/**
 * 托管分润列表查询参数
 */
export interface HostingProfitListParams {
  keyword?: string // 关键词(记录编号/车主姓名/车牌号)
  hostingType?: 'old_car' | 'new_car' // 托管类型
  settlementStatus?: 'pending' | 'settled' | 'paid' // 结算状态
  settlementMonth?: string // 结算月份
  page: number
  pageSize: number
}

/**
 * 托管分润统计
 */
export interface HostingProfitStats {
  totalIncome: number // 总收益
  totalOwnerAmount: number // 车主总金额
  totalPlatformAmount: number // 平台总金额
  totalSubsidy: number // 总补贴
  pendingCount: number // 待结算数量
  settledCount: number // 已结算数量
  paidCount: number // 已支付数量
}

// Mock 数据
const mockHostingProfitRecords: HostingProfitRecord[] = [
  {
    id: 1,
    recordNo: 'HP202512001',
    vehicleNo: 'V2024001',
    vehicleBrand: '上汽大通',
    vehicleModel: 'RV80',
    licensePlate: '京A12345',
    hostingType: 'old_car',
    ownerName: '张三',
    ownerPhone: '13800138001',
    settlementMonth: '2025-11',
    totalIncome: 15000,
    ownerShare: 70,
    platformShare: 30,
    ownerAmount: 10500,
    platformAmount: 4500,
    guaranteedIncome: 0,
    subsidyAmount: 0,
    ownerUsageFee: 0,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '11月份正常结算',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 2,
    recordNo: 'HP202512002',
    vehicleNo: 'V2024002',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜',
    licensePlate: '京B67890',
    hostingType: 'new_car',
    ownerName: '李四',
    ownerPhone: '13800138002',
    settlementMonth: '2025-11',
    totalIncome: 12000,
    ownerShare: 0,
    platformShare: 0,
    ownerAmount: 3500,
    platformAmount: 8500,
    guaranteedIncome: 3500,
    subsidyAmount: 0,
    ownerUsageFee: 0,
    settlementStatus: 'settled',
    settlementDate: '2025-12-01',
    paymentDate: '',
    remark: '购车托管保底收益',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-01 16:00:00'
  },
  {
    id: 3,
    recordNo: 'HP202512003',
    vehicleNo: 'V2024003',
    vehicleBrand: '福特',
    vehicleModel: '全顺',
    licensePlate: '京C11111',
    hostingType: 'old_car',
    ownerName: '王五',
    ownerPhone: '13800138003',
    settlementMonth: '2025-12',
    totalIncome: 8000,
    ownerShare: 70,
    platformShare: 30,
    ownerAmount: 5600,
    platformAmount: 2400,
    guaranteedIncome: 0,
    subsidyAmount: 1500,
    ownerUsageFee: 500,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '淡季补贴1500元，车主自用费用500元',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  },
  {
    id: 4,
    recordNo: 'HP202512004',
    vehicleNo: 'V2024004',
    vehicleBrand: '奔驰',
    vehicleModel: 'Sprinter',
    licensePlate: '京D22222',
    hostingType: 'new_car',
    ownerName: '赵六',
    ownerPhone: '13800138004',
    settlementMonth: '2025-11',
    totalIncome: 18000,
    ownerShare: 50,
    platformShare: 50,
    ownerAmount: 5750,
    platformAmount: 12250,
    guaranteedIncome: 3500,
    subsidyAmount: 0,
    ownerUsageFee: 0,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '超额收益分成：(18000-3500)*50%=7250，车主总收益：3500+2250=5750',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 5,
    recordNo: 'HP202512005',
    vehicleNo: 'V2024005',
    vehicleBrand: '上汽大通',
    vehicleModel: 'RV90',
    licensePlate: '京E33333',
    hostingType: 'old_car',
    ownerName: '孙七',
    ownerPhone: '13800138005',
    settlementMonth: '2025-12',
    totalIncome: 6000,
    ownerShare: 70,
    platformShare: 30,
    ownerAmount: 4200,
    platformAmount: 1800,
    guaranteedIncome: 0,
    subsidyAmount: 2000,
    ownerUsageFee: 0,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '淡季补贴2000元',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  }
]

/**
 * 获取托管分润记录列表
 */
export const mockGetHostingProfitList = (params: HostingProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockHostingProfitRecords]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (record) =>
            record.recordNo.toLowerCase().includes(keyword) ||
            record.ownerName.includes(keyword) ||
            record.licensePlate.toLowerCase().includes(keyword)
        )
      }

      // 托管类型筛选
      if (params.hostingType) {
        filteredList = filteredList.filter((record) => record.hostingType === params.hostingType)
      }

      // 结算状态筛选
      if (params.settlementStatus) {
        filteredList = filteredList.filter(
          (record) => record.settlementStatus === params.settlementStatus
        )
      }

      // 结算月份筛选
      if (params.settlementMonth) {
        filteredList = filteredList.filter(
          (record) => record.settlementMonth === params.settlementMonth
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total: filteredList.length
        },
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 获取托管分润统计
 */
export const mockGetHostingProfitStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: HostingProfitStats = {
        totalIncome: mockHostingProfitRecords.reduce((sum, r) => sum + r.totalIncome, 0),
        totalOwnerAmount: mockHostingProfitRecords.reduce((sum, r) => sum + r.ownerAmount, 0),
        totalPlatformAmount: mockHostingProfitRecords.reduce(
          (sum, r) => sum + r.platformAmount,
          0
        ),
        totalSubsidy: mockHostingProfitRecords.reduce((sum, r) => sum + r.subsidyAmount, 0),
        pendingCount: mockHostingProfitRecords.filter((r) => r.settlementStatus === 'pending')
          .length,
        settledCount: mockHostingProfitRecords.filter((r) => r.settlementStatus === 'settled')
          .length,
        paidCount: mockHostingProfitRecords.filter((r) => r.settlementStatus === 'paid').length
      }

      resolve({
        code: 200,
        data: stats,
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 结算托管分润
 */
export const mockSettleHostingProfit = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id },
        message: '结算成功'
      })
    }, 500)
  })
}

/**
 * 批量结算托管分润
 */
export const mockBatchSettleHostingProfit = (ids: number[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { ids, count: ids.length },
        message: `批量结算成功，共${ids.length}条记录`
      })
    }, 800)
  })
}

/**
 * 支付托管分润
 */
export const mockPayHostingProfit = (id: number, paymentMethod: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, paymentMethod },
        message: '支付成功'
      })
    }, 500)
  })
}

/**
 * 导出托管分润记录
 */
export const mockExportHostingProfitRecords = (_params: HostingProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { url: 'https://example.com/hosting-profit-records.xlsx' },
        message: '导出成功'
      })
    }, 1000)
  })
}

// ==================== 差价分润(合作商) ====================

/**
 * 差价分润记录
 */
export interface PriceDiffProfitRecord {
  id: number
  recordNo: string // 记录编号
  orderNo: string // 订单编号
  vehicleNo: string // 车辆编号
  vehicleBrand: string // 车辆品牌
  vehicleModel: string // 车辆型号
  licensePlate: string // 车牌号
  partnerName: string // 合作商名称
  partnerContact: string // 合作商联系人
  partnerPhone: string // 合作商电话
  settlementMonth: string // 结算月份
  platformPrice: number // 平台价格
  partnerPrice: number // 合作商价格
  priceDiff: number // 差价
  profitShare: number // 分润比例(%)
  partnerAmount: number // 合作商金额
  platformAmount: number // 平台金额
  orderCount: number // 订单数量
  settlementStatus: 'pending' | 'settled' | 'paid' // 结算状态
  settlementDate: string // 结算日期
  paymentDate: string // 支付日期
  remark: string // 备注
  createdAt: string
  updatedAt: string
}

/**
 * 差价分润列表查询参数
 */
export interface PriceDiffProfitListParams {
  keyword?: string // 关键词(记录编号/合作商名称/订单编号)
  settlementStatus?: 'pending' | 'settled' | 'paid' // 结算状态
  settlementMonth?: string // 结算月份
  page: number
  pageSize: number
}

/**
 * 差价分润统计
 */
export interface PriceDiffProfitStats {
  totalPriceDiff: number // 总差价
  totalPartnerAmount: number // 合作商总金额
  totalPlatformAmount: number // 平台总金额
  totalOrderCount: number // 总订单数
  pendingCount: number // 待结算数量
  settledCount: number // 已结算数量
  paidCount: number // 已支付数量
}

// Mock 数据
const mockPriceDiffProfitRecords: PriceDiffProfitRecord[] = [
  {
    id: 1,
    recordNo: 'PP202512001',
    orderNo: 'O202511001',
    vehicleNo: 'V2024006',
    vehicleBrand: '上汽大通',
    vehicleModel: 'RV80',
    licensePlate: '沪A11111',
    partnerName: '上海房车租赁公司',
    partnerContact: '张经理',
    partnerPhone: '13900139001',
    settlementMonth: '2025-11',
    platformPrice: 800,
    partnerPrice: 600,
    priceDiff: 200,
    profitShare: 50,
    partnerAmount: 100,
    platformAmount: 100,
    orderCount: 1,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '11月份正常结算',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 2,
    recordNo: 'PP202512002',
    orderNo: 'O202511002',
    vehicleNo: 'V2024007',
    vehicleBrand: '依维柯',
    vehicleModel: '欧胜',
    licensePlate: '沪B22222',
    partnerName: '杭州旅游车队',
    partnerContact: '李经理',
    partnerPhone: '13900139002',
    settlementMonth: '2025-11',
    platformPrice: 1000,
    partnerPrice: 750,
    priceDiff: 250,
    profitShare: 60,
    partnerAmount: 150,
    platformAmount: 100,
    orderCount: 1,
    settlementStatus: 'settled',
    settlementDate: '2025-12-01',
    paymentDate: '',
    remark: '合作商优质客户,分成比例60%',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-01 16:00:00'
  },
  {
    id: 3,
    recordNo: 'PP202512003',
    orderNo: 'O202512001',
    vehicleNo: 'V2024008',
    vehicleBrand: '福特',
    vehicleModel: '全顺',
    licensePlate: '浙A33333',
    partnerName: '宁波商旅服务',
    partnerContact: '王经理',
    partnerPhone: '13900139003',
    settlementMonth: '2025-12',
    platformPrice: 1200,
    partnerPrice: 900,
    priceDiff: 300,
    profitShare: 50,
    partnerAmount: 150,
    platformAmount: 150,
    orderCount: 1,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '12月份待结算',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  },
  {
    id: 4,
    recordNo: 'PP202512004',
    orderNo: 'O202511003',
    vehicleNo: 'V2024009',
    vehicleBrand: '奔驰',
    vehicleModel: 'Sprinter',
    licensePlate: '苏A44444',
    partnerName: '南京商务租车',
    partnerContact: '赵经理',
    partnerPhone: '13900139004',
    settlementMonth: '2025-11',
    platformPrice: 1500,
    partnerPrice: 1200,
    priceDiff: 300,
    profitShare: 40,
    partnerAmount: 120,
    platformAmount: 180,
    orderCount: 1,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '高端车型,平台分成比例较高',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 5,
    recordNo: 'PP202512005',
    orderNo: 'O202512002',
    vehicleNo: 'V2024010',
    vehicleBrand: '上汽大通',
    vehicleModel: 'RV90',
    licensePlate: '苏B55555',
    partnerName: '苏州旅行社',
    partnerContact: '孙经理',
    partnerPhone: '13900139005',
    settlementMonth: '2025-12',
    platformPrice: 900,
    partnerPrice: 700,
    priceDiff: 200,
    profitShare: 50,
    partnerAmount: 100,
    platformAmount: 100,
    orderCount: 1,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '12月份待结算',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  }
]

/**
 * 获取差价分润记录列表
 */
export const mockGetPriceDiffProfitList = (params: PriceDiffProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockPriceDiffProfitRecords]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (record) =>
            record.recordNo.toLowerCase().includes(keyword) ||
            record.partnerName.includes(keyword) ||
            record.orderNo.toLowerCase().includes(keyword)
        )
      }

      // 结算状态筛选
      if (params.settlementStatus) {
        filteredList = filteredList.filter(
          (record) => record.settlementStatus === params.settlementStatus
        )
      }

      // 结算月份筛选
      if (params.settlementMonth) {
        filteredList = filteredList.filter(
          (record) => record.settlementMonth === params.settlementMonth
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total: filteredList.length
        },
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 获取差价分润统计
 */
export const mockGetPriceDiffProfitStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: PriceDiffProfitStats = {
        totalPriceDiff: mockPriceDiffProfitRecords.reduce((sum, r) => sum + r.priceDiff, 0),
        totalPartnerAmount: mockPriceDiffProfitRecords.reduce(
          (sum, r) => sum + r.partnerAmount,
          0
        ),
        totalPlatformAmount: mockPriceDiffProfitRecords.reduce(
          (sum, r) => sum + r.platformAmount,
          0
        ),
        totalOrderCount: mockPriceDiffProfitRecords.reduce((sum, r) => sum + r.orderCount, 0),
        pendingCount: mockPriceDiffProfitRecords.filter((r) => r.settlementStatus === 'pending')
          .length,
        settledCount: mockPriceDiffProfitRecords.filter((r) => r.settlementStatus === 'settled')
          .length,
        paidCount: mockPriceDiffProfitRecords.filter((r) => r.settlementStatus === 'paid').length
      }

      resolve({
        code: 200,
        data: stats,
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 结算差价分润
 */
export const mockSettlePriceDiffProfit = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id },
        message: '结算成功'
      })
    }, 500)
  })
}

/**
 * 批量结算差价分润
 */
export const mockBatchSettlePriceDiffProfit = (ids: number[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { ids, count: ids.length },
        message: `批量结算成功，共${ids.length}条记录`
      })
    }, 800)
  })
}

/**
 * 支付差价分润
 */
export const mockPayPriceDiffProfit = (id: number, paymentMethod: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, paymentMethod },
        message: '支付成功'
      })
    }, 500)
  })
}

/**
 * 导出差价分润记录
 */
export const mockExportPriceDiffProfitRecords = (_params: PriceDiffProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { url: 'https://example.com/price-diff-profit-records.xlsx' },
        message: '导出成功'
      })
    }, 1000)
  })
}

// ==================== 员工激励分润 ====================

/**
 * 员工激励分润记录
 */
export interface EmployeeProfitRecord {
  id: number
  recordNo: string // 记录编号
  employeeId: string // 员工ID
  employeeName: string // 员工姓名
  department: string // 部门
  position: string // 职位
  settlementMonth: string // 结算月份
  incentiveType: 'sales' | 'service' | 'performance' | 'other' // 激励类型
  baseAmount: number // 基础金额
  bonusAmount: number // 奖金金额
  totalAmount: number // 总金额
  orderCount: number // 关联订单数
  performanceScore: number // 绩效分数
  settlementStatus: 'pending' | 'settled' | 'paid' // 结算状态
  settlementDate: string // 结算日期
  paymentDate: string // 支付日期
  remark: string // 备注
  createdAt: string
  updatedAt: string
}

/**
 * 员工激励分润列表查询参数
 */
export interface EmployeeProfitListParams {
  keyword?: string // 关键词(记录编号/员工姓名/员工ID)
  department?: string // 部门
  incentiveType?: 'sales' | 'service' | 'performance' | 'other' // 激励类型
  settlementStatus?: 'pending' | 'settled' | 'paid' // 结算状态
  settlementMonth?: string // 结算月份
  page: number
  pageSize: number
}

/**
 * 员工激励分润统计
 */
export interface EmployeeProfitStats {
  totalAmount: number // 总金额
  totalBaseAmount: number // 总基础金额
  totalBonusAmount: number // 总奖金金额
  employeeCount: number // 员工数量
  pendingCount: number // 待结算数量
  settledCount: number // 已结算数量
  paidCount: number // 已支付数量
}

// Mock 数据
const mockEmployeeProfitRecords: EmployeeProfitRecord[] = [
  {
    id: 1,
    recordNo: 'EP202512001',
    employeeId: 'E001',
    employeeName: '张销售',
    department: '销售部',
    position: '销售经理',
    settlementMonth: '2025-11',
    incentiveType: 'sales',
    baseAmount: 8000,
    bonusAmount: 5000,
    totalAmount: 13000,
    orderCount: 15,
    performanceScore: 95,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '11月份销售业绩优秀',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 2,
    recordNo: 'EP202512002',
    employeeId: 'E002',
    employeeName: '李客服',
    department: '客服部',
    position: '客服主管',
    settlementMonth: '2025-11',
    incentiveType: 'service',
    baseAmount: 6000,
    bonusAmount: 2000,
    totalAmount: 8000,
    orderCount: 0,
    performanceScore: 88,
    settlementStatus: 'settled',
    settlementDate: '2025-12-01',
    paymentDate: '',
    remark: '客户满意度高',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-01 16:00:00'
  },
  {
    id: 3,
    recordNo: 'EP202512003',
    employeeId: 'E003',
    employeeName: '王运营',
    department: '运营部',
    position: '运营专员',
    settlementMonth: '2025-12',
    incentiveType: 'performance',
    baseAmount: 7000,
    bonusAmount: 3000,
    totalAmount: 10000,
    orderCount: 0,
    performanceScore: 92,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '12月份待结算',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  },
  {
    id: 4,
    recordNo: 'EP202512004',
    employeeId: 'E004',
    employeeName: '赵技术',
    department: '技术部',
    position: '技术总监',
    settlementMonth: '2025-11',
    incentiveType: 'performance',
    baseAmount: 12000,
    bonusAmount: 8000,
    totalAmount: 20000,
    orderCount: 0,
    performanceScore: 98,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '技术创新奖励',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 5,
    recordNo: 'EP202512005',
    employeeId: 'E005',
    employeeName: '孙市场',
    department: '市场部',
    position: '市场经理',
    settlementMonth: '2025-12',
    incentiveType: 'sales',
    baseAmount: 9000,
    bonusAmount: 4000,
    totalAmount: 13000,
    orderCount: 12,
    performanceScore: 90,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '12月份待结算',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  }
]

/**
 * 获取员工激励分润记录列表
 */
export const mockGetEmployeeProfitList = (params: EmployeeProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockEmployeeProfitRecords]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (record) =>
            record.recordNo.toLowerCase().includes(keyword) ||
            record.employeeName.includes(keyword) ||
            record.employeeId.toLowerCase().includes(keyword)
        )
      }

      // 部门筛选
      if (params.department) {
        filteredList = filteredList.filter((record) => record.department === params.department)
      }

      // 激励类型筛选
      if (params.incentiveType) {
        filteredList = filteredList.filter((record) => record.incentiveType === params.incentiveType)
      }

      // 结算状态筛选
      if (params.settlementStatus) {
        filteredList = filteredList.filter(
          (record) => record.settlementStatus === params.settlementStatus
        )
      }

      // 结算月份筛选
      if (params.settlementMonth) {
        filteredList = filteredList.filter(
          (record) => record.settlementMonth === params.settlementMonth
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total: filteredList.length
        },
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 获取员工激励分润统计
 */
export const mockGetEmployeeProfitStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: EmployeeProfitStats = {
        totalAmount: mockEmployeeProfitRecords.reduce((sum, r) => sum + r.totalAmount, 0),
        totalBaseAmount: mockEmployeeProfitRecords.reduce((sum, r) => sum + r.baseAmount, 0),
        totalBonusAmount: mockEmployeeProfitRecords.reduce((sum, r) => sum + r.bonusAmount, 0),
        employeeCount: new Set(mockEmployeeProfitRecords.map((r) => r.employeeId)).size,
        pendingCount: mockEmployeeProfitRecords.filter((r) => r.settlementStatus === 'pending')
          .length,
        settledCount: mockEmployeeProfitRecords.filter((r) => r.settlementStatus === 'settled')
          .length,
        paidCount: mockEmployeeProfitRecords.filter((r) => r.settlementStatus === 'paid').length
      }

      resolve({
        code: 200,
        data: stats,
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 结算员工激励分润
 */
export const mockSettleEmployeeProfit = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id },
        message: '结算成功'
      })
    }, 500)
  })
}

/**
 * 批量结算员工激励分润
 */
export const mockBatchSettleEmployeeProfit = (ids: number[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { ids, count: ids.length },
        message: `批量结算成功，共${ids.length}条记录`
      })
    }, 800)
  })
}

/**
 * 支付员工激励分润
 */
export const mockPayEmployeeProfit = (id: number, paymentMethod: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, paymentMethod },
        message: '支付成功'
      })
    }, 500)
  })
}

/**
 * 导出员工激励分润记录
 */
export const mockExportEmployeeProfitRecords = (_params: EmployeeProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { url: 'https://example.com/employee-profit-records.xlsx' },
        message: '导出成功'
      })
    }, 1000)
  })
}

// ==================== 推广分润 ====================

/**
 * 推广分润记录
 */
export interface PromotionProfitRecord {
  id: number
  recordNo: string // 记录编号
  promoterId: string // 推广员ID
  promoterName: string // 推广员姓名
  promoterPhone: string // 推广员电话
  promoterLevel: 'primary' | 'secondary' // 推广级别
  orderNo: string // 订单编号
  customerId: string // 客户ID
  customerName: string // 客户姓名
  settlementMonth: string // 结算月份
  orderAmount: number // 订单金额
  commissionRate: number // 佣金比例(%)
  commissionAmount: number // 佣金金额
  bonusAmount: number // 额外奖励
  totalAmount: number // 总金额
  promotionChannel: 'wechat' | 'app' | 'web' | 'offline' | 'other' // 推广渠道
  orderCount: number // 推广订单数
  settlementStatus: 'pending' | 'settled' | 'paid' // 结算状态
  settlementDate: string // 结算日期
  paymentDate: string // 支付日期
  remark: string // 备注
  createdAt: string
  updatedAt: string
}

/**
 * 推广分润列表查询参数
 */
export interface PromotionProfitListParams {
  keyword?: string // 关键词(记录编号/推广员姓名/推广员ID)
  promoterLevel?: 'primary' | 'secondary' // 推广级别
  promotionChannel?: 'wechat' | 'app' | 'web' | 'offline' | 'other' // 推广渠道
  settlementStatus?: 'pending' | 'settled' | 'paid' // 结算状态
  settlementMonth?: string // 结算月份
  page: number
  pageSize: number
}

/**
 * 推广分润统计
 */
export interface PromotionProfitStats {
  totalAmount: number // 总金额
  totalCommissionAmount: number // 总佣金金额
  totalBonusAmount: number // 总奖励金额
  totalOrderAmount: number // 总订单金额
  promoterCount: number // 推广员数量
  pendingCount: number // 待结算数量
  settledCount: number // 已结算数量
  paidCount: number // 已支付数量
}

// Mock 数据
const mockPromotionProfitRecords: PromotionProfitRecord[] = [
  {
    id: 1,
    recordNo: 'RP202512001',
    promoterId: 'P001',
    promoterName: '张推广',
    promoterPhone: '13800138001',
    promoterLevel: 'primary',
    orderNo: 'O202511001',
    customerId: 'C001',
    customerName: '李客户',
    settlementMonth: '2025-11',
    orderAmount: 8000,
    commissionRate: 10,
    commissionAmount: 800,
    bonusAmount: 200,
    totalAmount: 1000,
    promotionChannel: 'wechat',
    orderCount: 1,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '一级推广,微信渠道',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 2,
    recordNo: 'RP202512002',
    promoterId: 'P002',
    promoterName: '王推广',
    promoterPhone: '13800138002',
    promoterLevel: 'secondary',
    orderNo: 'O202511002',
    customerId: 'C002',
    customerName: '赵客户',
    settlementMonth: '2025-11',
    orderAmount: 10000,
    commissionRate: 5,
    commissionAmount: 500,
    bonusAmount: 0,
    totalAmount: 500,
    promotionChannel: 'app',
    orderCount: 1,
    settlementStatus: 'settled',
    settlementDate: '2025-12-01',
    paymentDate: '',
    remark: '二级推广,APP渠道',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-01 16:00:00'
  },
  {
    id: 3,
    recordNo: 'RP202512003',
    promoterId: 'P003',
    promoterName: '刘推广',
    promoterPhone: '13800138003',
    promoterLevel: 'primary',
    orderNo: 'O202512001',
    customerId: 'C003',
    customerName: '孙客户',
    settlementMonth: '2025-12',
    orderAmount: 12000,
    commissionRate: 10,
    commissionAmount: 1200,
    bonusAmount: 300,
    totalAmount: 1500,
    promotionChannel: 'web',
    orderCount: 1,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '一级推广,官网渠道',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  },
  {
    id: 4,
    recordNo: 'RP202512004',
    promoterId: 'P001',
    promoterName: '张推广',
    promoterPhone: '13800138001',
    promoterLevel: 'primary',
    orderNo: 'O202511003',
    customerId: 'C004',
    customerName: '周客户',
    settlementMonth: '2025-11',
    orderAmount: 15000,
    commissionRate: 10,
    commissionAmount: 1500,
    bonusAmount: 500,
    totalAmount: 2000,
    promotionChannel: 'offline',
    orderCount: 1,
    settlementStatus: 'paid',
    settlementDate: '2025-12-01',
    paymentDate: '2025-12-02',
    remark: '一级推广,线下活动',
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-02 15:30:00'
  },
  {
    id: 5,
    recordNo: 'RP202512005',
    promoterId: 'P004',
    promoterName: '陈推广',
    promoterPhone: '13800138004',
    promoterLevel: 'primary',
    orderNo: 'O202512002',
    customerId: 'C005',
    customerName: '吴客户',
    settlementMonth: '2025-12',
    orderAmount: 9000,
    commissionRate: 10,
    commissionAmount: 900,
    bonusAmount: 100,
    totalAmount: 1000,
    promotionChannel: 'wechat',
    orderCount: 1,
    settlementStatus: 'pending',
    settlementDate: '',
    paymentDate: '',
    remark: '一级推广,微信朋友圈',
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:00:00'
  }
]

/**
 * 获取推广分润记录列表
 */
export const mockGetPromotionProfitList = (params: PromotionProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockPromotionProfitRecords]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (record) =>
            record.recordNo.toLowerCase().includes(keyword) ||
            record.promoterName.includes(keyword) ||
            record.promoterId.toLowerCase().includes(keyword)
        )
      }

      // 推广级别筛选
      if (params.promoterLevel) {
        filteredList = filteredList.filter((record) => record.promoterLevel === params.promoterLevel)
      }

      // 推广渠道筛选
      if (params.promotionChannel) {
        filteredList = filteredList.filter(
          (record) => record.promotionChannel === params.promotionChannel
        )
      }

      // 结算状态筛选
      if (params.settlementStatus) {
        filteredList = filteredList.filter(
          (record) => record.settlementStatus === params.settlementStatus
        )
      }

      // 结算月份筛选
      if (params.settlementMonth) {
        filteredList = filteredList.filter(
          (record) => record.settlementMonth === params.settlementMonth
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 200,
        data: {
          list,
          total: filteredList.length
        },
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 获取推广分润统计
 */
export const mockGetPromotionProfitStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: PromotionProfitStats = {
        totalAmount: mockPromotionProfitRecords.reduce((sum, r) => sum + r.totalAmount, 0),
        totalCommissionAmount: mockPromotionProfitRecords.reduce(
          (sum, r) => sum + r.commissionAmount,
          0
        ),
        totalBonusAmount: mockPromotionProfitRecords.reduce((sum, r) => sum + r.bonusAmount, 0),
        totalOrderAmount: mockPromotionProfitRecords.reduce((sum, r) => sum + r.orderAmount, 0),
        promoterCount: new Set(mockPromotionProfitRecords.map((r) => r.promoterId)).size,
        pendingCount: mockPromotionProfitRecords.filter((r) => r.settlementStatus === 'pending')
          .length,
        settledCount: mockPromotionProfitRecords.filter((r) => r.settlementStatus === 'settled')
          .length,
        paidCount: mockPromotionProfitRecords.filter((r) => r.settlementStatus === 'paid').length
      }

      resolve({
        code: 200,
        data: stats,
        message: '获取成功'
      })
    }, 300)
  })
}

/**
 * 结算推广分润
 */
export const mockSettlePromotionProfit = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id },
        message: '结算成功'
      })
    }, 500)
  })
}

/**
 * 批量结算推广分润
 */
export const mockBatchSettlePromotionProfit = (ids: number[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { ids, count: ids.length },
        message: `批量结算成功,共${ids.length}条记录`
      })
    }, 800)
  })
}

/**
 * 支付推广分润
 */
export const mockPayPromotionProfit = (id: number, paymentMethod: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, paymentMethod },
        message: '支付成功'
      })
    }, 500)
  })
}

/**
 * 导出推广分润记录
 */
export const mockExportPromotionProfitRecords = (_params: PromotionProfitListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { url: 'https://example.com/promotion-profit-records.xlsx' },
        message: '导出成功'
      })
    }, 1000)
  })
}
