/**
 * 托管相关API
 */
import { get, post, put } from '@/utils/request'
import * as mockHosting from './mock/hosting'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 获取托管申请列表
 * @param {Object} params - 查询参数
 * @param {String} params.type - 申请类型 (own_car/buy_car/self_use)
 * @param {String} params.status - 申请状态 (pending/approved/rejected)
 * @param {String} params.keyword - 搜索关键词
 */
export function getHostingApplications(params) {
  if (USE_MOCK) {
    return mockHosting.getHostingApplications(params)
  }
  return get('/api/v1/hosting/applications', params)
}

/**
 * 获取自有车托管详情
 * @param {Number|String} id - 申请ID
 */
export function getOwnCarDetail(id) {
  if (USE_MOCK) {
    return mockHosting.getOwnCarDetail(id)
  }
  return get(`/api/v1/hosting/own-car/${id}`)
}

/**
 * 提交自有车托管审核
 * @param {Number|String} id - 申请ID
 * @param {Object} reviewData - 审核数据
 * @param {Boolean} reviewData.approved - 是否通过
 * @param {String} reviewData.comment - 审核意见
 */
export function submitOwnCarReview(id, reviewData) {
  if (USE_MOCK) {
    return mockHosting.submitOwnCarReview(id, reviewData)
  }
  return post(`/api/v1/hosting/own-car/${id}/review`, reviewData)
}

/**
 * 获取购车托管详情
 * @param {Number|String} id - 申请ID
 */
export function getBuyCarDetail(id) {
  if (USE_MOCK) {
    return mockHosting.getBuyCarDetail(id)
  }
  return get(`/api/v1/hosting/buy-car/${id}`)
}

/**
 * 提交购车托管审核
 * @param {Number|String} id - 申请ID
 * @param {Object} reviewData - 审核数据
 * @param {Boolean} reviewData.approved - 是否通过
 * @param {String} reviewData.comment - 审核意见
 */
export function submitBuyCarReview(id, reviewData) {
  if (USE_MOCK) {
    return mockHosting.submitBuyCarReview(id, reviewData)
  }
  return post(`/api/v1/hosting/buy-car/${id}/review`, reviewData)
}

/**
 * 获取车主自用详情
 * @param {Number|String} id - 申请ID
 */
export function getSelfUseDetail(id) {
  if (USE_MOCK) {
    return mockHosting.getSelfUseDetail(id)
  }
  return get(`/api/v1/hosting/self-use/${id}`)
}

/**
 * 提交车主自用审核
 * @param {Number|String} id - 申请ID
 * @param {Object} reviewData - 审核数据
 * @param {Boolean} reviewData.approved - 是否通过
 * @param {String} reviewData.comment - 审核意见
 */
export function submitSelfUseReview(id, reviewData) {
  if (USE_MOCK) {
    return mockHosting.submitSelfUseReview(id, reviewData)
  }
  return post(`/api/v1/hosting/self-use/${id}/review`, reviewData)
}

/**
 * 获取托管车辆列表
 * @param {Object} params - 查询参数
 * @param {String} params.status - 车辆状态 (available/in_use/maintenance)
 * @param {String} params.keyword - 搜索关键词
 */
export function getHostingVehicles(params) {
  if (USE_MOCK) {
    return mockHosting.getHostingVehicles(params)
  }
  return get('/api/v1/hosting/vehicles', params)
}

/**
 * 获取托管车辆详情
 * @param {Number|String} id - 车辆ID
 */
export function getHostingVehicleDetail(id) {
  if (USE_MOCK) {
    return mockHosting.getHostingVehicleDetail(id)
  }
  return get(`/api/v1/hosting/vehicles/${id}`)
}
