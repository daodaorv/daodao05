/**
 * 分润管理 API
 */
import request from '@/utils/request'
import {
  mockGetHostingProfitList,
  mockGetHostingProfitStats,
  mockSettleHostingProfit,
  mockBatchSettleHostingProfit,
  mockPayHostingProfit,
  mockExportHostingProfitRecords,
  mockGetPriceDiffProfitList,
  mockGetPriceDiffProfitStats,
  mockSettlePriceDiffProfit,
  mockBatchSettlePriceDiffProfit,
  mockPayPriceDiffProfit,
  mockExportPriceDiffProfitRecords,
  mockGetEmployeeProfitList,
  mockGetEmployeeProfitStats,
  mockSettleEmployeeProfit,
  mockBatchSettleEmployeeProfit,
  mockPayEmployeeProfit,
  mockExportEmployeeProfitRecords,
  mockGetPromotionProfitList,
  mockGetPromotionProfitStats,
  mockSettlePromotionProfit,
  mockBatchSettlePromotionProfit,
  mockPayPromotionProfit,
  mockExportPromotionProfitRecords,
  type HostingProfitRecord,
  type HostingProfitListParams,
  type HostingProfitStats,
  type PriceDiffProfitRecord,
  type PriceDiffProfitListParams,
  type PriceDiffProfitStats,
  type EmployeeProfitRecord,
  type EmployeeProfitListParams,
  type EmployeeProfitStats,
  type PromotionProfitRecord,
  type PromotionProfitListParams,
  type PromotionProfitStats
} from '@/mock/profit'

// 导出类型
export type {
  HostingProfitRecord,
  HostingProfitListParams,
  HostingProfitStats,
  PriceDiffProfitRecord,
  PriceDiffProfitListParams,
  PriceDiffProfitStats,
  EmployeeProfitRecord,
  EmployeeProfitListParams,
  EmployeeProfitStats,
  PromotionProfitRecord,
  PromotionProfitListParams,
  PromotionProfitStats
}

// ==================== 托管分润 ====================

/**
 * 获取托管分润记录列表
 */
export const getHostingProfitList = (params: HostingProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetHostingProfitList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/hosting', { params })
}

/**
 * 获取托管分润统计
 */
export const getHostingProfitStats = () => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetHostingProfitStats()

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/hosting/stats')
}

/**
 * 结算托管分润
 */
export const settleHostingProfit = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockSettleHostingProfit(id)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/hosting/${id}/settle`)
}

/**
 * 批量结算托管分润
 */
export const batchSettleHostingProfit = (ids: number[]) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockBatchSettleHostingProfit(ids)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/hosting/batch-settle', { ids })
}

/**
 * 支付托管分润
 */
export const payHostingProfit = (id: number, paymentMethod: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockPayHostingProfit(id, paymentMethod)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/hosting/${id}/pay`, { paymentMethod })
}

/**
 * 导出托管分润记录
 */
export const exportHostingProfitRecords = (params: HostingProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockExportHostingProfitRecords(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/hosting/export', params)
}

// ==================== 差价分润(合作商) ====================

/**
 * 获取差价分润记录列表
 */
export const getPriceDiffProfitList = (params: PriceDiffProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetPriceDiffProfitList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/price-diff', { params })
}

/**
 * 获取差价分润统计
 */
export const getPriceDiffProfitStats = () => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetPriceDiffProfitStats()

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/price-diff/stats')
}

/**
 * 结算差价分润
 */
export const settlePriceDiffProfit = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockSettlePriceDiffProfit(id)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/price-diff/${id}/settle`)
}

/**
 * 批量结算差价分润
 */
export const batchSettlePriceDiffProfit = (ids: number[]) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockBatchSettlePriceDiffProfit(ids)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/price-diff/batch-settle', { ids })
}

/**
 * 支付差价分润
 */
export const payPriceDiffProfit = (id: number, paymentMethod: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockPayPriceDiffProfit(id, paymentMethod)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/price-diff/${id}/pay`, { paymentMethod })
}

/**
 * 导出差价分润记录
 */
export const exportPriceDiffProfitRecords = (params: PriceDiffProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockExportPriceDiffProfitRecords(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/price-diff/export', params)
}

// ==================== 员工激励分润 ====================

/**
 * 获取员工激励分润记录列表
 */
export const getEmployeeProfitList = (params: EmployeeProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetEmployeeProfitList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/employee', { params })
}

/**
 * 获取员工激励分润统计
 */
export const getEmployeeProfitStats = () => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetEmployeeProfitStats()

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/employee/stats')
}

/**
 * 结算员工激励分润
 */
export const settleEmployeeProfit = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockSettleEmployeeProfit(id)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/employee/${id}/settle`)
}

/**
 * 批量结算员工激励分润
 */
export const batchSettleEmployeeProfit = (ids: number[]) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockBatchSettleEmployeeProfit(ids)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/employee/batch-settle', { ids })
}

/**
 * 支付员工激励分润
 */
export const payEmployeeProfit = (id: number, paymentMethod: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockPayEmployeeProfit(id, paymentMethod)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/employee/${id}/pay`, { paymentMethod })
}

/**
 * 导出员工激励分润记录
 */
export const exportEmployeeProfitRecords = (params: EmployeeProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockExportEmployeeProfitRecords(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/employee/export', params)
}

// ==================== 推广分润 ====================

/**
 * 获取推广分润记录列表
 */
export const getPromotionProfitList = (params: PromotionProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetPromotionProfitList(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/promotion', { params })
}

/**
 * 获取推广分润统计
 */
export const getPromotionProfitStats = () => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockGetPromotionProfitStats()

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.get('/api/profit/promotion/stats')
}

/**
 * 结算推广分润
 */
export const settlePromotionProfit = (id: number) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockSettlePromotionProfit(id)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/promotion/${id}/settle`)
}

/**
 * 批量结算推广分润
 */
export const batchSettlePromotionProfit = (ids: number[]) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockBatchSettlePromotionProfit(ids)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/promotion/batch-settle', { ids })
}

/**
 * 支付推广分润
 */
export const payPromotionProfit = (id: number, paymentMethod: string) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockPayPromotionProfit(id, paymentMethod)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post(`/api/profit/promotion/${id}/pay`, { paymentMethod })
}

/**
 * 导出推广分润记录
 */
export const exportPromotionProfitRecords = (params: PromotionProfitListParams) => {
  // 🟡 使用 Mock 数据（前端独立开发阶段）
  return mockExportPromotionProfitRecords(params)

  // 🔵 后端联调时使用真实 API（待后端开发）
  // return request.post('/api/profit/promotion/export', params)
}
