/**
 * 订单管理 API
 */
import request from '@/utils/request'
import {
  mockGetOrderList,
  mockGetOrderDetail,
  mockCreateOrder,
  mockUpdateOrder,
  mockCancelOrder,
  mockConfirmOrder,
  mockCompleteOrder,
  mockGetOrderStats,
  mockGetExceptionList,
  mockGetExceptionDetail,
  mockHandleException,
  mockGetExceptionStats,
  mockGetRefundList,
  mockApproveRefund,
  mockGetRefundStats,
  mockGetReviewList,
  mockReplyReview,
  mockToggleReviewStatus,
  mockGetReviewStats,
  type Order,
  type OrderListParams,
  type CreateOrderParams,
  type UpdateOrderParams,
  type OrderStats,
  type OrderException,
  type ExceptionListParams,
  type Refund,
  type RefundListParams,
  type OrderReview,
  type ReviewListParams
} from '@/mock/orders'

// 导出类型
export type {
  Order,
  OrderListParams,
  CreateOrderParams,
  UpdateOrderParams,
  OrderStats,
  OrderException,
  ExceptionListParams,
  Refund,
  RefundListParams,
  OrderReview,
  ReviewListParams
}

/**
 * 获取订单列表
 */
export const getOrderList = (params: OrderListParams) => {
  // return request.get('/orders', { params })
  return mockGetOrderList(params)
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (id: number) => {
  // return request.get(`/orders/${id}`)
  return mockGetOrderDetail(id)
}

/**
 * 创建订单
 */
export const createOrder = (data: CreateOrderParams) => {
  // return request.post('/orders', data)
  return mockCreateOrder(data)
}

/**
 * 更新订单
 */
export const updateOrder = (id: number, data: UpdateOrderParams) => {
  // return request.put(`/orders/${id}`, data)
  return mockUpdateOrder(id, data)
}

/**
 * 取消订单
 */
export const cancelOrder = (id: number, reason: string) => {
  // return request.post(`/orders/${id}/cancel`, { reason })
  return mockCancelOrder(id, reason)
}

/**
 * 确认订单
 */
export const confirmOrder = (id: number) => {
  // return request.post(`/orders/${id}/confirm`)
  return mockConfirmOrder(id)
}

/**
 * 完成订单
 */
export const completeOrder = (id: number) => {
  // return request.post(`/orders/${id}/complete`)
  return mockCompleteOrder(id)
}

/**
 * 获取订单统计
 */
export const getOrderStats = () => {
  // return request.get('/orders/stats')
  return mockGetOrderStats()
}

// ==================== 异常订单管理 ====================

/**
 * 获取异常订单列表
 */
export const getExceptionList = (params: ExceptionListParams) => {
  // return request.get('/orders/exceptions', { params })
  return mockGetExceptionList(params)
}

/**
 * 获取异常订单详情
 */
export const getExceptionDetail = (id: number) => {
  // return request.get(`/orders/exceptions/${id}`)
  return mockGetExceptionDetail(id)
}

/**
 * 处理异常订单
 */
export const handleException = (id: number, resolution: string) => {
  // return request.post(`/orders/exceptions/${id}/handle`, { resolution })
  return mockHandleException(id, resolution)
}

/**
 * 获取异常统计
 */
export const getExceptionStats = () => {
  // return request.get('/orders/exceptions/stats')
  return mockGetExceptionStats()
}

// ==================== 退款管理 ====================

/**
 * 获取退款列表
 */
export const getRefundList = (params: RefundListParams) => {
  // return request.get('/orders/refunds', { params })
  return mockGetRefundList(params)
}

/**
 * 审核退款
 */
export const approveRefund = (id: number, approved: boolean, reason?: string) => {
  // return request.post(`/orders/refunds/${id}/approve`, { approved, reason })
  return mockApproveRefund(id, approved, reason)
}

/**
 * 获取退款统计
 */
export const getRefundStats = () => {
  // return request.get('/orders/refunds/stats')
  return mockGetRefundStats()
}

// ==================== 订单评价管理 ====================

/**
 * 获取评价列表
 */
export const getReviewList = (params: ReviewListParams) => {
  // return request.get('/orders/reviews', { params })
  return mockGetReviewList(params)
}

/**
 * 回复评价
 */
export const replyReview = (id: number, reply: string) => {
  // return request.post(`/orders/reviews/${id}/reply`, { reply })
  return mockReplyReview(id, reply)
}

/**
 * 隐藏/显示评价
 */
export const toggleReviewStatus = (id: number, status: 'published' | 'hidden') => {
  // return request.post(`/orders/reviews/${id}/toggle`, { status })
  return mockToggleReviewStatus(id, status)
}

/**
 * 获取评价统计
 */
export const getReviewStats = () => {
  // return request.get('/orders/reviews/stats')
  return mockGetReviewStats()
}
