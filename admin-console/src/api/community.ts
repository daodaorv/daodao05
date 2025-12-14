/**
 * 社区管理 API
 */
import {
  getContentReviews as mockGetContentReviews,
  getContentReviewStats as mockGetContentReviewStats,
  reviewContent as mockReviewContent,
  batchReviewContent as mockBatchReviewContent,
  getCommunitySections as mockGetCommunitySections,
  createCommunitySection as mockCreateCommunitySection,
  updateCommunitySection as mockUpdateCommunitySection,
  deleteCommunitySection as mockDeleteCommunitySection,
  getReports as mockGetReports,
  getReportStats as mockGetReportStats,
  handleReport as mockHandleReport,
  assignReport as mockAssignReport,
  getCommunityConfig as mockGetCommunityConfig,
  updateCommunityConfig as mockUpdateCommunityConfig,
  type ContentReview,
  type ContentReviewStats,
  type ReviewStatus,
  type ContentType,
  type ViolationType,
  type CommunitySection,
  type SectionStatus,
  type Report,
  type ReportStats,
  type HandleStatus,
  type CommunityConfig
} from '@/mock/community'

// 导出类型
export type {
  ContentReview,
  ContentReviewStats,
  ReviewStatus,
  ContentType,
  ViolationType,
  CommunitySection,
  SectionStatus,
  Report,
  ReportStats,
  HandleStatus,
  CommunityConfig
}

/**
 * 获取内容审核列表
 */
export function getContentReviews(params: {
  page: number
  pageSize: number
  status?: ReviewStatus
  contentType?: ContentType
  sectionId?: number
  keyword?: string
}): Promise<{ list: ContentReview[]; total: number }> {
  // 使用 Mock 数据
  return mockGetContentReviews(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/content-reviews',
  //   method: 'get',
  //   params
  // })
}

/**
 * 获取内容审核统计
 */
export function getContentReviewStats(): Promise<ContentReviewStats> {
  // 使用 Mock 数据
  return mockGetContentReviewStats()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/content-reviews/stats',
  //   method: 'get'
  // })
}

/**
 * 审核内容
 */
export function reviewContent(params: {
  id: number
  status: 'manual_approved' | 'manual_rejected'
  reason: string
  violationType?: ViolationType
}): Promise<void> {
  // 使用 Mock 数据
  return mockReviewContent(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/community/content-reviews/${params.id}/review`,
  //   method: 'post',
  //   data: {
  //     status: params.status,
  //     reason: params.reason,
  //     violationType: params.violationType
  //   }
  // })
}

/**
 * 批量审核内容
 */
export function batchReviewContent(params: {
  ids: number[]
  status: 'manual_approved' | 'manual_rejected'
  reason: string
}): Promise<void> {
  // 使用 Mock 数据
  return mockBatchReviewContent(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/content-reviews/batch-review',
  //   method: 'post',
  //   data: params
  // })
}

/**
 * 获取社区版块列表
 */
export function getCommunitySections(params?: {
  status?: SectionStatus
  keyword?: string
}): Promise<CommunitySection[]> {
  // 使用 Mock 数据
  return mockGetCommunitySections(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/sections',
  //   method: 'get',
  //   params
  // })
}

/**
 * 创建社区版块
 */
export function createCommunitySection(data: Partial<CommunitySection>): Promise<CommunitySection> {
  // 使用 Mock 数据
  return mockCreateCommunitySection(data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/sections',
  //   method: 'post',
  //   data
  // })
}

/**
 * 更新社区版块
 */
export function updateCommunitySection(
  id: number,
  data: Partial<CommunitySection>
): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateCommunitySection(id, data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/community/sections/${id}`,
  //   method: 'put',
  //   data
  // })
}

/**
 * 删除社区版块
 */
export function deleteCommunitySection(id: number): Promise<void> {
  // 使用 Mock 数据
  return mockDeleteCommunitySection(id)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/community/sections/${id}`,
  //   method: 'delete'
  // })
}

/**
 * 获取举报列表
 */
export function getReports(params: {
  page: number
  pageSize: number
  status?: HandleStatus
  reportType?: 'content' | 'user'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  keyword?: string
}): Promise<{ list: Report[]; total: number }> {
  // 使用 Mock 数据
  return mockGetReports(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/reports',
  //   method: 'get',
  //   params
  // })
}

/**
 * 获取举报统计
 */
export function getReportStats(): Promise<ReportStats> {
  // 使用 Mock 数据
  return mockGetReportStats()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/reports/stats',
  //   method: 'get'
  // })
}

/**
 * 处理举报
 */
export function handleReport(params: {
  id: number
  status: 'resolved' | 'rejected'
  handleResult: string
}): Promise<void> {
  // 使用 Mock 数据
  return mockHandleReport(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/community/reports/${params.id}/handle`,
  //   method: 'post',
  //   data: {
  //     status: params.status,
  //     handleResult: params.handleResult
  //   }
  // })
}

/**
 * 分配举报处理人
 */
export function assignReport(id: number, handlerId: number, handlerName: string): Promise<void> {
  // 使用 Mock 数据
  return mockAssignReport(id, handlerId, handlerName)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/community/reports/${id}/assign`,
  //   method: 'post',
  //   data: {
  //     handlerId,
  //     handlerName
  //   }
  // })
}

/**
 * 获取社区配置
 */
export function getCommunityConfig(): Promise<CommunityConfig> {
  // 使用 Mock 数据
  return mockGetCommunityConfig()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/config',
  //   method: 'get'
  // })
}

/**
 * 更新社区配置
 */
export function updateCommunityConfig(data: Partial<CommunityConfig>): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateCommunityConfig(data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/community/config',
  //   method: 'put',
  //   data
  // })
}
