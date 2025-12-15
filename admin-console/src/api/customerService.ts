/**
 * 客服管理 API
 */
import request from '@/utils/request'
import {
  getTickets as mockGetTickets,
  getTicketStats as mockGetTicketStats,
  assignTicket as mockAssignTicket,
  updateTicketStatus as mockUpdateTicketStatus,
  getServiceAgents as mockGetServiceAgents,
  updateServiceAgentStatus as mockUpdateServiceAgentStatus,
  getRoutingConfig as mockGetRoutingConfig,
  updateRoutingConfig as mockUpdateRoutingConfig,
  getKnowledgeArticles as mockGetKnowledgeArticles,
  getKnowledgeStats as mockGetKnowledgeStats,
  createKnowledgeArticle as mockCreateKnowledgeArticle,
  updateKnowledgeArticle as mockUpdateKnowledgeArticle,
  deleteKnowledgeArticle as mockDeleteKnowledgeArticle,
  type Ticket,
  type TicketStats,
  type TicketStatus,
  type TicketType,
  type TicketPriority,
  type ServiceAgent,
  type ServiceStatus,
  type ServiceSkill,
  type RoutingConfig,
  type KnowledgeArticle,
  type KnowledgeStats,
  type KnowledgeCategory
} from '@/mock/customerService'

// 导出类型
export type {
  Ticket,
  TicketStats,
  TicketStatus,
  TicketType,
  TicketPriority,
  ServiceAgent,
  ServiceStatus,
  ServiceSkill,
  RoutingConfig,
  KnowledgeArticle,
  KnowledgeStats,
  KnowledgeCategory
}

/**
 * 获取工单列表
 */
export function getTickets(params: {
  page: number
  pageSize: number
  status?: TicketStatus
  type?: TicketType
  priority?: TicketPriority
  assigneeId?: number
  keyword?: string
}): Promise<{ list: Ticket[]; total: number }> {
  // 使用 Mock 数据
  return mockGetTickets(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/tickets',
  //   method: 'get',
  //   params
  // })
}

/**
 * 获取工单统计
 */
export function getTicketStats(): Promise<TicketStats> {
  // 使用 Mock 数据
  return mockGetTicketStats()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/tickets/stats',
  //   method: 'get'
  // })
}

/**
 * 分配工单
 */
export function assignTicket(id: number, assigneeId: number, assigneeName: string): Promise<void> {
  // 使用 Mock 数据
  return mockAssignTicket(id, assigneeId, assigneeName)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/customer-service/tickets/${id}/assign`,
  //   method: 'post',
  //   data: {
  //     assigneeId,
  //     assigneeName
  //   }
  // })
}

/**
 * 更新工单状态
 */
export function updateTicketStatus(id: number, status: TicketStatus): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateTicketStatus(id, status)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/customer-service/tickets/${id}/status`,
  //   method: 'put',
  //   data: { status }
  // })
}

/**
 * 获取客服人员列表
 */
export function getServiceAgents(params?: {
  status?: ServiceStatus
  skill?: ServiceSkill
}): Promise<ServiceAgent[]> {
  // 使用 Mock 数据
  return mockGetServiceAgents(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/agents',
  //   method: 'get',
  //   params
  // })
}

/**
 * 更新客服状态
 */
export function updateServiceAgentStatus(id: number, status: ServiceStatus): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateServiceAgentStatus(id, status)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/customer-service/agents/${id}/status`,
  //   method: 'put',
  //   data: { status }
  // })
}

/**
 * 获取智能路由配置
 */
export function getRoutingConfig(): Promise<RoutingConfig> {
  // 使用 Mock 数据
  return mockGetRoutingConfig()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/routing-config',
  //   method: 'get'
  // })
}

/**
 * 更新智能路由配置
 */
export function updateRoutingConfig(data: Partial<RoutingConfig>): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateRoutingConfig(data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/routing-config',
  //   method: 'put',
  //   data
  // })
}

/**
 * 获取知识库文章列表
 */
export function getKnowledgeArticles(params: {
  page: number
  pageSize: number
  category?: KnowledgeCategory
  isPublished?: boolean
  keyword?: string
}): Promise<{ list: KnowledgeArticle[]; total: number }> {
  // 使用 Mock 数据
  return mockGetKnowledgeArticles(params)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/knowledge',
  //   method: 'get',
  //   params
  // })
}

/**
 * 获取知识库统计
 */
export function getKnowledgeStats(): Promise<KnowledgeStats> {
  // 使用 Mock 数据
  return mockGetKnowledgeStats()

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/knowledge/stats',
  //   method: 'get'
  // })
}

/**
 * 创建知识库文章
 */
export function createKnowledgeArticle(
  data: Partial<KnowledgeArticle>
): Promise<KnowledgeArticle> {
  // 使用 Mock 数据
  return mockCreateKnowledgeArticle(data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: '/api/customer-service/knowledge',
  //   method: 'post',
  //   data
  // })
}

/**
 * 更新知识库文章
 */
export function updateKnowledgeArticle(
  id: number,
  data: Partial<KnowledgeArticle>
): Promise<void> {
  // 使用 Mock 数据
  return mockUpdateKnowledgeArticle(id, data)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/customer-service/knowledge/${id}`,
  //   method: 'put',
  //   data
  // })
}

/**
 * 删除知识库文章
 */
export function deleteKnowledgeArticle(id: number): Promise<void> {
  // 使用 Mock 数据
  return mockDeleteKnowledgeArticle(id)

  // 真实 API 调用（待后端开发）
  // return request({
  //   url: `/api/customer-service/knowledge/${id}`,
  //   method: 'delete'
  // })
}
