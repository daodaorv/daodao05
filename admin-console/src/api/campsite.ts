/**
 * 营地管理 API
 */
import {
  mockGetCampsiteList,
  mockGetCampsiteDetail,
  mockGetCampsiteStats,
  mockGetReservationList,
  mockConfirmReservation,
  mockCancelReservation,
  mockGetInquiryList,
  mockReplyInquiry,
  type Campsite,
  type CampsiteListParams,
  type CampsiteStats,
  type CampsiteReservation,
  type ReservationListParams,
  type CampsiteInquiry,
  type InquiryListParams
} from '@/mock/campsites'

// 导出类型
export type {
  Campsite,
  CampsiteListParams,
  CampsiteStats,
  CampsiteReservation,
  ReservationListParams,
  CampsiteInquiry,
  InquiryListParams
}

// ==================== 营地管理 ====================

/**
 * 获取营地列表
 */
export const getCampsiteList = (params: CampsiteListParams) => {
  // return request.get('/campsites', { params })
  return mockGetCampsiteList(params)
}

/**
 * 获取营地详情
 */
export const getCampsiteDetail = (id: number) => {
  // return request.get(`/campsites/${id}`)
  return mockGetCampsiteDetail(id)
}

/**
 * 获取营地统计
 */
export const getCampsiteStats = () => {
  // return request.get('/campsites/stats')
  return mockGetCampsiteStats()
}

// ==================== 预订管理 ====================

/**
 * 获取预订列表
 */
export const getReservationList = (params: ReservationListParams) => {
  // return request.get('/campsites/reservations', { params })
  return mockGetReservationList(params)
}

/**
 * 确认预订
 */
export const confirmReservation = (id: number) => {
  // return request.post(`/campsites/reservations/${id}/confirm`)
  return mockConfirmReservation(id)
}

/**
 * 取消预订
 */
export const cancelReservation = (id: number) => {
  // return request.post(`/campsites/reservations/${id}/cancel`)
  return mockCancelReservation(id)
}

// ==================== 咨询管理 ====================

/**
 * 获取咨询列表
 */
export const getInquiryList = (params: InquiryListParams) => {
  // return request.get('/campsites/inquiries', { params })
  return mockGetInquiryList(params)
}

/**
 * 回复咨询
 */
export const replyInquiry = (id: number, reply: string) => {
  // return request.post(`/campsites/inquiries/${id}/reply`, { reply })
  return mockReplyInquiry(id, reply)
}
