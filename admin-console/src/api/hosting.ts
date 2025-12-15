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
  type IncomeStats
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
  IncomeStats
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
