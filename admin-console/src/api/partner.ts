/**
 * 合作商管理 API
 */
import request from '@/utils/request'
import {
  mockGetPartnerList,
  mockGetPartnerDetail,
  mockCreatePartner,
  mockUpdatePartner,
  mockDeletePartner,
  mockGetPartnerStats,
  mockGetPartnerStores,
  mockGetPartnerOrders,
  mockCreatePartnerOrder,
  mockUpdatePartnerOrder,
  mockGetPartnerSettlement,
  type Partner,
  type PartnerListParams,
  type CreatePartnerParams,
  type UpdatePartnerParams,
  type PartnerStats,
  type PartnerStore,
  type PartnerOrder,
  type CreatePartnerOrderParams,
  type UpdatePartnerOrderParams,
  type PartnerSettlement,
  type PartnerSettlementParams
} from '@/mock/partners'

// 导出类型
export type {
  Partner,
  PartnerListParams,
  CreatePartnerParams,
  UpdatePartnerParams,
  PartnerStats,
  PartnerStore,
  PartnerOrder,
  CreatePartnerOrderParams,
  UpdatePartnerOrderParams,
  PartnerSettlement,
  PartnerSettlementParams
}

/**
 * 获取合作商列表
 */
export const getPartnerList = (params: PartnerListParams) => {
  // return request.get('/partners', { params })
  return mockGetPartnerList(params)
}

/**
 * 获取合作商详情
 */
export const getPartnerDetail = (id: number) => {
  // return request.get(`/partners/${id}`)
  return mockGetPartnerDetail(id)
}

/**
 * 创建合作商
 */
export const createPartner = (data: CreatePartnerParams) => {
  // return request.post('/partners', data)
  return mockCreatePartner(data)
}

/**
 * 更新合作商
 */
export const updatePartner = (id: number, data: UpdatePartnerParams) => {
  // return request.put(`/partners/${id}`, data)
  return mockUpdatePartner(id, data)
}

/**
 * 删除合作商
 */
export const deletePartner = (id: number) => {
  // return request.delete(`/partners/${id}`)
  return mockDeletePartner(id)
}

/**
 * 获取合作商统计
 */
export const getPartnerStats = () => {
  // return request.get('/partners/stats')
  return mockGetPartnerStats()
}

/**
 * 获取合作商门店列表
 */
export const getPartnerStores = (partnerId: number) => {
  // return request.get(`/partners/${partnerId}/stores`)
  return mockGetPartnerStores(partnerId)
}

/**
 * 获取合作商订单列表
 */
export const getPartnerOrders = (params: { partnerId?: number; page: number; pageSize: number }) => {
  // return request.get('/partner-orders', { params })
  return mockGetPartnerOrders(params)
}

/**
 * 创建合作商订单信息
 */
export const createPartnerOrder = (data: CreatePartnerOrderParams) => {
  // return request.post('/partner-orders', data)
  return mockCreatePartnerOrder(data)
}

/**
 * 更新合作商订单信息
 */
export const updatePartnerOrder = (id: number, data: UpdatePartnerOrderParams) => {
  // return request.put(`/partner-orders/${id}`, data)
  return mockUpdatePartnerOrder(id, data)
}

/**
 * 获取合作商结算统计
 */
export const getPartnerSettlement = (params: PartnerSettlementParams) => {
  // return request.get('/partner-settlements', { params })
  return mockGetPartnerSettlement(params)
}
