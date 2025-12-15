/**
 * 订单相关API
 */
import { get, post, put } from '@/utils/request'
import mockOrder from './mock/order'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 获取订单列表
 */
export function getOrderList(params) {
  if (USE_MOCK) {
    return mockOrder.getOrderList(params)
  }
  return get('/api/v1/orders', params)
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  if (USE_MOCK) {
    return mockOrder.getOrderDetail(id)
  }
  return get(`/api/v1/orders/${id}`)
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(id, status, remark) {
  if (USE_MOCK) {
    return mockOrder.updateOrderStatus(id, status, remark)
  }
  return put(`/api/v1/orders/${id}/status`, { status, remark })
}

/**
 * 确认订单
 */
export function confirmOrder(id, data) {
  if (USE_MOCK) {
    return mockOrder.confirmOrder(id, data)
  }
  return post(`/api/v1/orders/${id}/confirm`, data)
}

/**
 * 取消订单
 */
export function cancelOrder(id, reason) {
  if (USE_MOCK) {
    return mockOrder.cancelOrder(id, reason)
  }
  return post(`/api/v1/orders/${id}/cancel`, { reason })
}

/**
 * 完成订单
 */
export function completeOrder(id, data) {
  if (USE_MOCK) {
    return mockOrder.completeOrder(id, data)
  }
  return post(`/api/v1/orders/${id}/complete`, data)
}

/**
 * 开始取车流程
 */
export function startPickup(orderId) {
  if (USE_MOCK) {
    return mockOrder.startPickup(orderId)
  }
  return post(`/api/v1/orders/${orderId}/pickup/start`)
}

/**
 * 提交取车检查数据
 */
export function submitPickupInspection(orderId, data) {
  if (USE_MOCK) {
    return mockOrder.submitPickupInspection(orderId, data)
  }
  return post(`/api/v1/orders/${orderId}/pickup/inspection`, data)
}

/**
 * 上传取车照片
 */
export function uploadPickupPhotos(orderId, photos) {
  if (USE_MOCK) {
    return mockOrder.uploadPickupPhotos(orderId, photos)
  }
  return post(`/api/v1/orders/${orderId}/pickup/photos`, { photos })
}

/**
 * 完成取车流程
 */
export function completePickup(orderId, data) {
  if (USE_MOCK) {
    return mockOrder.completePickup(orderId, data)
  }
  return post(`/api/v1/orders/${orderId}/pickup/complete`, data)
}

/**
 * 开始还车流程
 */
export function startReturn(orderId) {
  if (USE_MOCK) {
    return mockOrder.startReturn(orderId)
  }
  return post(`/api/v1/orders/${orderId}/return/start`)
}

/**
 * 提交还车检查数据
 */
export function submitReturnInspection(orderId, data) {
  if (USE_MOCK) {
    return mockOrder.submitReturnInspection(orderId, data)
  }
  return post(`/api/v1/orders/${orderId}/return/inspection`, data)
}

/**
 * 上传还车照片
 */
export function uploadReturnPhotos(orderId, photos) {
  if (USE_MOCK) {
    return mockOrder.uploadReturnPhotos(orderId, photos)
  }
  return post(`/api/v1/orders/${orderId}/return/photos`, { photos })
}

/**
 * 提交损坏评估
 */
export function submitDamageAssessment(orderId, damages) {
  if (USE_MOCK) {
    return mockOrder.submitDamageAssessment(orderId, damages)
  }
  return post(`/api/v1/orders/${orderId}/return/damages`, { damages })
}

/**
 * 计算还车费用
 */
export function calculateReturnFees(orderId, data) {
  if (USE_MOCK) {
    return mockOrder.calculateReturnFees(orderId, data)
  }
  return post(`/api/v1/orders/${orderId}/return/calculate-fees`, data)
}

/**
 * 完成还车流程
 */
export function completeReturn(orderId, data) {
  if (USE_MOCK) {
    return mockOrder.completeReturn(orderId, data)
  }
  return post(`/api/v1/orders/${orderId}/return/complete`, data)
}

/**
 * 获取取车照片
 */
export function getPickupPhotos(orderId) {
  if (USE_MOCK) {
    return mockOrder.getPickupPhotos(orderId)
  }
  return get(`/api/v1/orders/${orderId}/pickup/photos`)
}

/**
 * 获取还车照片
 */
export function getReturnPhotos(orderId) {
  if (USE_MOCK) {
    return mockOrder.getReturnPhotos(orderId)
  }
  return get(`/api/v1/orders/${orderId}/return/photos`)
}

export default {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  confirmOrder,
  cancelOrder,
  completeOrder,
  // 取车相关
  startPickup,
  submitPickupInspection,
  uploadPickupPhotos,
  completePickup,
  // 还车相关
  startReturn,
  submitReturnInspection,
  uploadReturnPhotos,
  submitDamageAssessment,
  calculateReturnFees,
  completeReturn,
  // 照片相关
  getPickupPhotos,
  getReturnPhotos
}
