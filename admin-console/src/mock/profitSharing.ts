import type {
  HostingProfit,
  HostingProfitStats,
  HostingProfitListParams,
  CooperationProfit,
  CooperationProfitStats,
  CooperationProfitListParams,
  StaffProfit,
  StaffProfitStats,
  StaffProfitListParams,
  PromotionProfit,
  PromotionProfitStats,
  PromotionProfitListParams,
  ProfitConfig,
  UpdateProfitConfigParams,
  Settlement,
  SettlementStats,
  SettlementListParams,
  CreateSettlementParams,
  Withdrawal,
  WithdrawalStats,
  WithdrawalListParams,
  ApproveWithdrawalParams,
  RejectWithdrawalParams,
} from '@/api/profitSharing'

// ==================== 托管分润 Mock 数据 ====================
const mockHostingProfits: HostingProfit[] = [
  {
    id: 1,
    vehicleId: 1,
    vehiclePlate: '京A12345',
    ownerId: 1,
    ownerName: '张三',
    orderCount: 15,
    totalRevenue: 45000,
    ownerShare: 31500,
    platformShare: 13500,
    shareRatio: '70/30',
    month: '2024-11',
    status: 'paid',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    vehicleId: 2,
    vehiclePlate: '京B67890',
    ownerId: 2,
    ownerName: '李四',
    orderCount: 12,
    totalRevenue: 38000,
    ownerShare: 26600,
    platformShare: 11400,
    shareRatio: '70/30',
    month: '2024-11',
    status: 'settled',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 3,
    vehicleId: 3,
    vehiclePlate: '京C11111',
    ownerId: 3,
    ownerName: '王五',
    orderCount: 18,
    totalRevenue: 52000,
    ownerShare: 36400,
    platformShare: 15600,
    shareRatio: '70/30',
    month: '2024-12',
    status: 'pending',
    createdAt: '2024-12-01T00:00:00.000Z',
  },
]

export function mockGetHostingProfitList(params: HostingProfitListParams) {
  let filteredData = [...mockHostingProfits]

  if (params.keyword) {
    filteredData = filteredData.filter(
      (item) =>
        item.vehiclePlate.includes(params.keyword!) || item.ownerName.includes(params.keyword!)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.month) {
    filteredData = filteredData.filter((item) => item.month === params.month)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetHostingProfitStats() {
  const stats: HostingProfitStats = {
    totalRevenue: 135000,
    totalOwnerShare: 94500,
    totalPlatformShare: 40500,
    vehicleCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

// ==================== 差价分润 Mock 数据 ====================
const mockCooperationProfits: CooperationProfit[] = [
  {
    id: 1,
    orderId: 1001,
    orderNo: 'ORD202411001',
    partnerId: 1,
    partnerName: '房车生活家',
    storeId: 1,
    storeName: '北京朝阳店',
    daodaoPrice: 5000,
    partnerPrice: 4500,
    priceDiff: 500,
    storeShare: 150,
    platformShare: 350,
    shareRatio: '30/70',
    month: '2024-11',
    status: 'paid',
    createdAt: '2024-11-15T10:00:00.000Z',
  },
  {
    id: 2,
    orderId: 1002,
    orderNo: 'ORD202411002',
    partnerId: 1,
    partnerName: '房车生活家',
    storeId: 2,
    storeName: '上海浦东店',
    daodaoPrice: 6000,
    partnerPrice: 5200,
    priceDiff: 800,
    storeShare: 240,
    platformShare: 560,
    shareRatio: '30/70',
    month: '2024-11',
    status: 'settled',
    createdAt: '2024-11-20T14:30:00.000Z',
  },
  {
    id: 3,
    orderId: 1003,
    orderNo: 'ORD202412001',
    partnerId: 2,
    partnerName: '途居露营',
    storeId: 3,
    storeName: '深圳南山店',
    daodaoPrice: 4800,
    partnerPrice: 4200,
    priceDiff: 600,
    storeShare: 180,
    platformShare: 420,
    shareRatio: '30/70',
    month: '2024-12',
    status: 'pending',
    createdAt: '2024-12-05T09:15:00.000Z',
  },
]

export function mockGetCooperationProfitList(params: CooperationProfitListParams) {
  let filteredData = [...mockCooperationProfits]

  if (params.keyword) {
    filteredData = filteredData.filter(
      (item) =>
        item.orderNo.includes(params.keyword!) ||
        item.partnerName.includes(params.keyword!) ||
        item.storeName.includes(params.keyword!)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.month) {
    filteredData = filteredData.filter((item) => item.month === params.month)
  }

  if (params.partnerId) {
    filteredData = filteredData.filter((item) => item.partnerId === params.partnerId)
  }

  if (params.storeId) {
    filteredData = filteredData.filter((item) => item.storeId === params.storeId)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetCooperationProfitStats() {
  const stats: CooperationProfitStats = {
    totalPriceDiff: 1900,
    totalStoreShare: 570,
    totalPlatformShare: 1330,
    orderCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

// ==================== 员工激励 Mock 数据 ====================
const mockStaffProfits: StaffProfit[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '赵六',
    department: '销售部',
    orderCount: 25,
    totalRevenue: 125000,
    incentiveAmount: 6250,
    incentiveRatio: '5%',
    month: '2024-11',
    status: 'paid',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '孙七',
    department: '客服部',
    orderCount: 30,
    totalRevenue: 150000,
    incentiveAmount: 7500,
    incentiveRatio: '5%',
    month: '2024-11',
    status: 'settled',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '周八',
    department: '运营部',
    orderCount: 20,
    totalRevenue: 100000,
    incentiveAmount: 5000,
    incentiveRatio: '5%',
    month: '2024-12',
    status: 'pending',
    createdAt: '2024-12-01T00:00:00.000Z',
  },
]

export function mockGetStaffProfitList(params: StaffProfitListParams) {
  let filteredData = [...mockStaffProfits]

  if (params.keyword) {
    filteredData = filteredData.filter(
      (item) => item.employeeName.includes(params.keyword!) || item.department.includes(params.keyword!)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.month) {
    filteredData = filteredData.filter((item) => item.month === params.month)
  }

  if (params.department) {
    filteredData = filteredData.filter((item) => item.department === params.department)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetStaffProfitStats() {
  const stats: StaffProfitStats = {
    totalRevenue: 375000,
    totalIncentive: 18750,
    employeeCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

// ==================== 推广分润 Mock 数据 ====================
const mockPromotionProfits: PromotionProfit[] = [
  {
    id: 1,
    promoterId: 1,
    promoterName: '推广员A',
    promoterType: 'agent',
    inviteeCount: 50,
    orderCount: 120,
    totalRevenue: 360000,
    commissionAmount: 36000,
    commissionRatio: '10%',
    month: '2024-11',
    status: 'paid',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    promoterId: 2,
    promoterName: '推广员B',
    promoterType: 'user',
    inviteeCount: 30,
    orderCount: 80,
    totalRevenue: 240000,
    commissionAmount: 12000,
    commissionRatio: '5%',
    month: '2024-11',
    status: 'settled',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 3,
    promoterId: 3,
    promoterName: '推广员C',
    promoterType: 'partner',
    inviteeCount: 40,
    orderCount: 100,
    totalRevenue: 300000,
    commissionAmount: 45000,
    commissionRatio: '15%',
    month: '2024-12',
    status: 'pending',
    createdAt: '2024-12-01T00:00:00.000Z',
  },
]

export function mockGetPromotionProfitList(params: PromotionProfitListParams) {
  let filteredData = [...mockPromotionProfits]

  if (params.keyword) {
    filteredData = filteredData.filter((item) => item.promoterName.includes(params.keyword!))
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.month) {
    filteredData = filteredData.filter((item) => item.month === params.month)
  }

  if (params.promoterType) {
    filteredData = filteredData.filter((item) => item.promoterType === params.promoterType)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetPromotionProfitStats() {
  const stats: PromotionProfitStats = {
    totalRevenue: 900000,
    totalCommission: 93000,
    promoterCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

// ==================== 分润配置 Mock 数据 ====================
const mockProfitConfigs: ProfitConfig[] = [
  {
    id: 1,
    configType: 'hosting',
    configName: '托管分润比例',
    shareRatio: 70,
    minAmount: 0,
    maxAmount: 999999,
    targetUserTags: [],  // 所有托管车主
    description: '车主分成70%，平台分成30%',
    enabled: true,
    updatedAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    configType: 'cooperation',
    configName: '合作商订单门店分润比例',
    shareRatio: 30,
    minAmount: 0,
    maxAmount: 999999,
    targetUserTags: [6],  // 企业用户标签
    description: '门店分成30%，平台分成70%',
    enabled: true,
    updatedAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 3,
    configType: 'staff',
    configName: '员工激励比例',
    shareRatio: 5,
    minAmount: 0,
    maxAmount: 999999,
    targetUserTags: [],  // 所有员工
    description: '员工激励5%',
    enabled: true,
    updatedAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 4,
    configType: 'promotion',
    configName: '推广分润比例',
    shareRatio: 10,
    minAmount: 0,
    maxAmount: 999999,
    targetUserTags: [1, 7],  // VIP用户和优质客户
    description: '推广员分成10%',
    enabled: true,
    updatedAt: '2024-11-01T00:00:00.000Z',
  },
]

export function mockGetProfitConfig() {
  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: mockProfitConfigs,
  })
}

export function mockUpdateProfitConfig(data: UpdateProfitConfigParams) {
  const config = mockProfitConfigs.find((c) => c.id === data.id)
  if (config) {
    if (data.shareRatio !== undefined) config.shareRatio = data.shareRatio
    if (data.minAmount !== undefined) config.minAmount = data.minAmount
    if (data.maxAmount !== undefined) config.maxAmount = data.maxAmount
    if (data.description !== undefined) config.description = data.description
    if (data.enabled !== undefined) config.enabled = data.enabled
    config.updatedAt = new Date().toISOString()
  }

  return Promise.resolve({
    code: 200,
    message: '更新成功',
    data: null,
  })
}

// ==================== 结算管理 Mock 数据 ====================
const mockSettlements: Settlement[] = [
  {
    id: 1,
    settlementNo: 'STL202411001',
    settlementType: 'hosting',
    targetId: 1,
    targetName: '张三',
    totalAmount: 31500,
    itemCount: 1,
    month: '2024-11',
    status: 'completed',
    createdAt: '2024-11-30T10:00:00.000Z',
    completedAt: '2024-12-01T14:30:00.000Z',
  },
  {
    id: 2,
    settlementNo: 'STL202411002',
    settlementType: 'cooperation',
    targetId: 1,
    targetName: '北京朝阳店',
    totalAmount: 150,
    itemCount: 1,
    month: '2024-11',
    status: 'processing',
    createdAt: '2024-11-30T11:00:00.000Z',
  },
  {
    id: 3,
    settlementNo: 'STL202412001',
    settlementType: 'staff',
    targetId: 3,
    targetName: '周八',
    totalAmount: 5000,
    itemCount: 1,
    month: '2024-12',
    status: 'pending',
    createdAt: '2024-12-05T09:00:00.000Z',
  },
]

export function mockGetSettlementList(params: SettlementListParams) {
  let filteredData = [...mockSettlements]

  if (params.keyword) {
    filteredData = filteredData.filter(
      (item) => item.settlementNo.includes(params.keyword!) || item.targetName.includes(params.keyword!)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.settlementType) {
    filteredData = filteredData.filter((item) => item.settlementType === params.settlementType)
  }

  if (params.month) {
    filteredData = filteredData.filter((item) => item.month === params.month)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetSettlementStats() {
  const stats: SettlementStats = {
    totalAmount: 36650,
    pendingAmount: 5000,
    completedAmount: 31500,
    settlementCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

export function mockCreateSettlement(data: CreateSettlementParams) {
  const newSettlement: Settlement = {
    id: mockSettlements.length + 1,
    settlementNo: `STL${Date.now()}`,
    settlementType: data.settlementType,
    targetId: data.targetIds[0],
    targetName: '新结算对象',
    totalAmount: 0,
    itemCount: data.targetIds.length,
    month: data.month,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  mockSettlements.push(newSettlement)

  return Promise.resolve({
    code: 200,
    message: '创建成功',
    data: newSettlement,
  })
}

// ==================== 提现审核 Mock 数据 ====================
const mockWithdrawals: Withdrawal[] = [
  {
    id: 1,
    withdrawalNo: 'WD202411001',
    userId: 1,
    userName: '张三',
    userType: 'owner',
    amount: 31500,
    bankName: '中国工商银行',
    bankAccount: '6222 **** **** 1234',
    status: 'completed',
    applyReason: '托管收益提现',
    createdAt: '2024-11-25T10:00:00.000Z',
    approvedAt: '2024-11-26T14:30:00.000Z',
    completedAt: '2024-11-27T16:00:00.000Z',
  },
  {
    id: 2,
    withdrawalNo: 'WD202411002',
    userId: 2,
    userName: '赵六',
    userType: 'employee',
    amount: 6250,
    bankName: '中国建设银行',
    bankAccount: '6217 **** **** 5678',
    status: 'approved',
    applyReason: '员工激励提现',
    createdAt: '2024-11-28T09:00:00.000Z',
    approvedAt: '2024-11-29T10:30:00.000Z',
  },
  {
    id: 3,
    withdrawalNo: 'WD202412001',
    userId: 3,
    userName: '推广员A',
    userType: 'promoter',
    amount: 36000,
    bankName: '中国农业银行',
    bankAccount: '6228 **** **** 9012',
    status: 'pending',
    applyReason: '推广佣金提现',
    createdAt: '2024-12-05T11:00:00.000Z',
  },
]

export function mockGetWithdrawalList(params: WithdrawalListParams) {
  let filteredData = [...mockWithdrawals]

  if (params.keyword) {
    filteredData = filteredData.filter(
      (item) => item.withdrawalNo.includes(params.keyword!) || item.userName.includes(params.keyword!)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  if (params.userType) {
    filteredData = filteredData.filter((item) => item.userType === params.userType)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list: filteredData.slice(start, end),
      total: filteredData.length,
    },
  })
}

export function mockGetWithdrawalStats() {
  const stats: WithdrawalStats = {
    totalAmount: 73750,
    pendingAmount: 36000,
    approvedAmount: 6250,
    withdrawalCount: 3,
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: stats,
  })
}

export function mockApproveWithdrawal(data: ApproveWithdrawalParams) {
  const withdrawal = mockWithdrawals.find((w) => w.id === data.id)
  if (withdrawal) {
    withdrawal.status = 'approved'
    withdrawal.approvedAt = new Date().toISOString()
  }

  return Promise.resolve({
    code: 200,
    message: '审核通过',
    data: null,
  })
}

export function mockRejectWithdrawal(data: RejectWithdrawalParams) {
  const withdrawal = mockWithdrawals.find((w) => w.id === data.id)
  if (withdrawal) {
    withdrawal.status = 'rejected'
    withdrawal.rejectReason = data.reason
  }

  return Promise.resolve({
    code: 200,
    message: '已拒绝',
    data: null,
  })
}
