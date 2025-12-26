/**
 * 托管管理 API
 */
import {
  mockGetOldCarApplicationList,
  mockReviewOldCarApplication,
  mockGetNewCarApplicationList,
  mockReviewNewCarApplication,
  mockGetHostingVehicleList,
  mockGetOwnerUsageApplicationList,
  mockReviewOwnerUsageApplication,
  mockGetIncomeRecordList,
  mockGetIncomeStats,
  mockGetCrowdfundingModelList,
  mockUpdateCrowdfundingModelConfig,
  mockBatchSetHotCrowdfunding,
  mockUpdateCrowdfundingModelOrder,
  mockGetCrowdfundingProjectList,
  mockGetCrowdfundingProjectDetail,
  mockReviewCrowdfundingProject,
  mockUpdateCrowdfundingProjectStatus,
  mockGetCrowdfundingOwnerList,
  mockGetUserCrowdfundingRecords,
  mockGetCrowdfundingShareList,
  mockToggleShareLock,
  mockGetCrowdfundingTransactionList,
  mockCancelCrowdfundingTransaction,
  mockGetCrowdfundingIncomeList,
  mockGetCrowdfundingIncomeStats,
  mockDistributeCrowdfundingIncome,
  mockOwnerUsageFeeConfigs,
  type OwnerUsageFeeConfig,
  type OldCarHostingApplication,
  type OldCarApplicationListParams,
  type NewCarHostingApplication,
  type NewCarApplicationListParams,
  type HostingVehicle,
  type HostingVehicleListParams,
  type OwnerUsageApplication,
  type OwnerUsageApplicationListParams,
  type IncomeRecord,
  type IncomeRecordListParams,
  type IncomeStats,
  type CrowdfundingModel,
  type CrowdfundingModelListParams,
  type UpdateCrowdfundingModelConfigParams,
  type CrowdfundingOwnerListParams,
  type CrowdfundingOwner,
  type CrowdfundingShareListParams,
  type CrowdfundingShare,
  type CrowdfundingTransactionListParams,
  type CrowdfundingTransaction,
  type CrowdfundingIncomeListParams,
  type CrowdfundingIncomeRecord,
  type CrowdfundingIncomeStats
} from '@/mock/hosting'

// 导出类型
export type {
  OldCarHostingApplication,
  OldCarApplicationListParams,
  NewCarHostingApplication,
  NewCarApplicationListParams,
  HostingVehicle,
  HostingVehicleListParams,
  OwnerUsageApplication,
  OwnerUsageApplicationListParams,
  IncomeRecord,
  IncomeRecordListParams,
  IncomeStats,
  CrowdfundingModel,
  CrowdfundingModelListParams,
  UpdateCrowdfundingModelConfigParams,
  CrowdfundingOwnerListParams,
  CrowdfundingOwner,
  CrowdfundingShareListParams,
  CrowdfundingShare,
  CrowdfundingTransactionListParams,
  CrowdfundingTransaction,
  CrowdfundingIncomeListParams,
  CrowdfundingIncomeRecord,
  CrowdfundingIncomeStats
}

// ==================== 自有车托管申请 ====================

/**
 * 获取自有车托管申请列表
 */
export const getOldCarApplicationList = (params: OldCarApplicationListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetOldCarApplicationList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/old-car/applications', { params })
}

/**
 * 获取自有车托管申请详情
 */
export const getOldCarApplicationDetail = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetOldCarApplicationList({ page: 1, pageSize: 100 }).then((res: any) => {
    const application = res.data.list.find((a: OldCarHostingApplication) => a.id === id)
    return {
      code: 200,
      data: application,
      message: '获取成功'
    }
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get(`/api/hosting/old-car/applications/${id}`)
}

/**
 * 审核自有车托管申请
 */
export const reviewOldCarApplication = (id: number, approved: boolean, comment: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockReviewOldCarApplication(id, approved, comment)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/hosting/old-car/applications/${id}/review`, { approved, comment })
}

// ==================== 购车托管申请 ====================

/**
 * 获取购车托管申请列表
 */
export const getNewCarApplicationList = (params: NewCarApplicationListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetNewCarApplicationList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/new-car/applications', { params })
}

/**
 * 获取购车托管申请详情
 */
export const getNewCarApplicationDetail = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetNewCarApplicationList({ page: 1, pageSize: 100 }).then((res: any) => {
    const application = res.data.list.find((a: NewCarHostingApplication) => a.id === id)
    return {
      code: 200,
      data: application,
      message: '获取成功'
    }
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get(`/api/hosting/new-car/applications/${id}`)
}

/**
 * 审核购车托管申请
 */
export const reviewNewCarApplication = (id: number, approved: boolean, comment: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockReviewNewCarApplication(id, approved, comment)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/hosting/new-car/applications/${id}/review`, { approved, comment })
}

/**
 * 更新购车进度
 */
export const updatePurchaseProgress = (id: number, progress: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, progress },
        message: '更新成功'
      })
    }, 300)
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.put(`/api/hosting/new-car/applications/${id}/progress`, { progress })
}

// ==================== 托管车辆管理 ====================

/**
 * 获取托管车辆列表
 */
export const getHostingVehicleList = (params: HostingVehicleListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetHostingVehicleList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/vehicles', { params })
}

/**
 * 获取托管车辆详情
 */
export const getHostingVehicleDetail = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetHostingVehicleList({ page: 1, pageSize: 100 }).then((res: any) => {
    const vehicle = res.data.list.find((v: HostingVehicle) => v.id === id)
    return {
      code: 200,
      data: vehicle,
      message: '获取成功'
    }
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get(`/api/hosting/vehicles/${id}`)
}

/**
 * 更新托管车辆状态
 */
export const updateHostingVehicleStatus = (id: number, status: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { id, status },
        message: '更新成功'
      })
    }, 300)
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.put(`/api/hosting/vehicles/${id}/status`, { status })
}

// ==================== 车主自用申请 ====================

/**
 * 获取车主自用申请列表
 */
export const getOwnerUsageApplicationList = (params: OwnerUsageApplicationListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetOwnerUsageApplicationList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/owner-usage/applications', { params })
}

/**
 * 获取车主自用申请详情
 */
export const getOwnerUsageApplicationDetail = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetOwnerUsageApplicationList({ page: 1, pageSize: 100 }).then((res: any) => {
    const application = res.data.list.find((a: OwnerUsageApplication) => a.id === id)
    return {
      code: 200,
      data: application,
      message: '获取成功'
    }
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get(`/api/hosting/owner-usage/applications/${id}`)
}

/**
 * 审核车主自用申请
 */
export const reviewOwnerUsageApplication = (id: number, approved: boolean, comment: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockReviewOwnerUsageApplication(id, approved, comment)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/hosting/owner-usage/applications/${id}/review`, { approved, comment })
}

// ==================== 收益管理 ====================

/**
 * 获取收益记录列表
 */
export const getIncomeRecordList = (params: IncomeRecordListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetIncomeRecordList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/income/records', { params })
}

/**
 * 获取收益统计
 */
export const getIncomeStats = () => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetIncomeStats()

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/income/stats')
}

/**
 * 导出收益记录
 */
export const exportIncomeRecords = (_params: IncomeRecordListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { url: 'https://example.com/income-records.xlsx' },
        message: '导出成功'
      })
    }, 1000)
  })

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/hosting/income/records/export', params)
}

// ==================== 众筹车型管理 ====================

/**
 * 获取众筹车型列表
 */
export const getCrowdfundingModelList = (params: CrowdfundingModelListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetCrowdfundingModelList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/hosting/crowdfunding/models', { params })
}

/**
 * 更新车型众筹配置
 */
export const updateCrowdfundingModelConfig = (id: number, data: UpdateCrowdfundingModelConfigParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockUpdateCrowdfundingModelConfig(id, data)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.put(`/api/hosting/crowdfunding/models/${id}/config`, data)
}

/**
 * 批量设置热门推荐
 */
export const batchSetHotCrowdfunding = (ids: number[], isHot: boolean) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockBatchSetHotCrowdfunding(ids, isHot)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/hosting/crowdfunding/models/batch-hot', { ids, isHot })
}

/**
 * 更新展示排序
 */
export const updateCrowdfundingModelOrder = (id: number, order: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockUpdateCrowdfundingModelOrder(id, order)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.put(`/api/hosting/crowdfunding/models/${id}/order`, { order })
}

// ==================== 众筹项目管理 ====================

/**
 * 获取众筹项目列表
 */
export const getCrowdfundingProjectList = (params: any) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingProjectList(params)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/projects', { params })
}

/**
 * 获取众筹项目详情
 */
export const getCrowdfundingProjectDetail = (id: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingProjectDetail(id)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get(`/api/hosting/crowdfunding/projects/${id}`)
}

/**
 * 审核众筹项目
 */
export const reviewCrowdfundingProject = (id: number, approved: boolean, comment: string) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockReviewCrowdfundingProject(id, approved, comment)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post(`/api/hosting/crowdfunding/projects/${id}/review`, { approved, comment })
}

/**
 * 更新众筹项目状态
 */
export const updateCrowdfundingProjectStatus = (id: number, status: string, remark: string) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockUpdateCrowdfundingProjectStatus(id, status, remark)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post(`/api/hosting/crowdfunding/projects/${id}/status`, { status, remark })
}

// ==================== 众筹车主管理 ====================

/**
 * 获取众筹车主列表
 */
export const getCrowdfundingOwnerList = (params: CrowdfundingOwnerListParams) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingOwnerList(params)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/owners', { params })
}

/**
 * 获取用户众筹参与记录
 */
export const getUserCrowdfundingRecords = (userId: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetUserCrowdfundingRecords(userId)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get(`/api/hosting/crowdfunding/owners/${userId}/records`)
}

// ==================== 份额管理 ====================

/**
 * 获取份额列表
 */
export const getCrowdfundingShareList = (params: CrowdfundingShareListParams) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingShareList(params)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/shares', { params })
}

/**
 * 锁定/解锁份额
 */
export const toggleShareLock = (id: number, locked: boolean) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockToggleShareLock(id, locked)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post(`/api/hosting/crowdfunding/shares/${id}/lock`, { locked })
}

// ==================== 份额交易监管 ====================

/**
 * 获取份额交易列表
 */
export const getCrowdfundingTransactionList = (params: CrowdfundingTransactionListParams) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingTransactionList(params)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/transactions', { params })
}

/**
 * 取消交易
 */
export const cancelCrowdfundingTransaction = (id: number, reason: string) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockCancelCrowdfundingTransaction(id, reason)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post(`/api/hosting/crowdfunding/transactions/${id}/cancel`, { reason })
}

// ==================== 收益分配管理 ====================

/**
 * 获取收益分配列表
 */
export const getCrowdfundingIncomeList = (params: CrowdfundingIncomeListParams) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingIncomeList(params)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/income', { params })
}

/**
 * 获取收益统计
 */
export const getCrowdfundingIncomeStats = () => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockGetCrowdfundingIncomeStats()

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/crowdfunding/income/stats')
}

/**
 * 执行收益分配
 */
export const distributeCrowdfundingIncome = (data: {
  projectId: number
  orderId: string
  totalIncome: number
}) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return mockDistributeCrowdfundingIncome(data)

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post('/api/hosting/crowdfunding/income/distribute', data)
}
// ==================== 淡季补贴配置 ====================

/**
 * 获取淡季补贴配置列表
 */
export const getSeasonalSubsidyConfigList = (params: any) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({
    data: {
      list: [],
      total: 0
    }
  })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/seasonal-subsidy-config', { params })
}

/**
 * 创建淡季补贴配置
 */
export const createSeasonalSubsidyConfig = (data: any) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({ data: { id: Date.now() } })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post('/api/hosting/seasonal-subsidy-config', data)
}

/**
 * 更新淡季补贴配置
 */
export const updateSeasonalSubsidyConfig = (id: number, data: any) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({ data: { success: true } })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.put(`/api/hosting/seasonal-subsidy-config/${id}`, data)
}

/**
 * 删除淡季补贴配置
 */
export const deleteSeasonalSubsidyConfig = (id: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({ data: { success: true } })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.delete(`/api/hosting/seasonal-subsidy-config/${id}`)
}

/**
 * 获取淡季补贴配置历史记录
 */
export const getSeasonalSubsidyConfigHistory = (configId: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({ data: [] })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get(`/api/hosting/seasonal-subsidy-config/${configId}/history`)
}

// ==================== 车主自用费用配置 API ====================

/**
 * 获取车主自用费用配置列表
 */
export const getOwnerUsageFeeConfigList = (params: any) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  let filteredConfigs = [...mockOwnerUsageFeeConfigs]

  // 搜索过滤
  if (params.keyword) {
    filteredConfigs = filteredConfigs.filter(
      (config) =>
        config.configName.includes(params.keyword) ||
        config.description?.includes(params.keyword)
    )
  }

  // 状态过滤
  if (params.enabled !== undefined) {
    filteredConfigs = filteredConfigs.filter((config) => config.enabled === params.enabled)
  }

  // 分页
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredConfigs.slice(start, end)

  return Promise.resolve({
    data: {
      list,
      total: filteredConfigs.length,
      page,
      pageSize,
    },
  })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get('/api/hosting/owner-usage-fee-config', { params })
}

/**
 * 创建车主自用费用配置
 */
export const createOwnerUsageFeeConfig = (data: Partial<OwnerUsageFeeConfig>) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  const newConfig: OwnerUsageFeeConfig = {
    id: Date.now(),
    configName: data.configName || '',
    serviceFeeMin: data.serviceFeeMin || 0,
    serviceFeeMax: data.serviceFeeMax || 0,
    serviceFeeDefault: data.serviceFeeDefault || 0,
    relocationFee: data.relocationFee || 0,
    relocationFreeCount: data.relocationFreeCount || 0,
    maxUsageDaysPerMonth: data.maxUsageDaysPerMonth || 0,
    advanceNoticeDays: data.advanceNoticeDays || 0,
    enabled: data.enabled !== undefined ? data.enabled : true,
    effectiveDate: data.effectiveDate || '',
    expiryDate: data.expiryDate,
    description: data.description,
    createdBy: '当前用户',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  }

  mockOwnerUsageFeeConfigs.push(newConfig)

  return Promise.resolve({
    data: { success: true, config: newConfig },
  })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.post('/api/hosting/owner-usage-fee-config', data)
}

/**
 * 更新车主自用费用配置
 */
export const updateOwnerUsageFeeConfig = (id: number, data: Partial<OwnerUsageFeeConfig>) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  const index = mockOwnerUsageFeeConfigs.findIndex((config) => config.id === id)
  if (index !== -1) {
    mockOwnerUsageFeeConfigs[index] = {
      ...mockOwnerUsageFeeConfigs[index],
      ...data,
      updatedBy: '当前用户',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }
  }

  return Promise.resolve({ data: { success: true } })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.put(`/api/hosting/owner-usage-fee-config/${id}`, data)
}

/**
 * 删除车主自用费用配置
 */
export const deleteOwnerUsageFeeConfig = (id: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  const index = mockOwnerUsageFeeConfigs.findIndex((config) => config.id === id)
  if (index !== -1) {
    mockOwnerUsageFeeConfigs.splice(index, 1)
  }

  return Promise.resolve({ data: { success: true } })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.delete(`/api/hosting/owner-usage-fee-config/${id}`)
}

/**
 * 获取车主自用费用配置历史记录
 */
export const getOwnerUsageFeeConfigHistory = (configId: number) => {
  // 🟡 使用 Mock 数据(前端独立开发阶段)
  return Promise.resolve({ data: [] })

  // 🔵 后端联调时使用真实 API(待后端开发)
  // return request.get(`/api/hosting/owner-usage-fee-config/${configId}/history`)
}
