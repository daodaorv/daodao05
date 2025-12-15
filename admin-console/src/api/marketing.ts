/**
 * 营销管理 API
 */
import request from '@/utils/request'
import {
  mockGetPricingStrategyList,
  mockGetCouponList,
  mockGetActivityList,
  mockGetPackageList,
  mockGetTourList,
  mockGetExtraFeeList,
  mockGetMarketingStats,
  type PricingStrategy,
  type PricingStrategyListParams,
  type Coupon,
  type CouponListParams,
  type MarketingActivity,
  type ActivityListParams,
  type Package,
  type PackageListParams,
  type Tour,
  type TourListParams,
  type ExtraFee,
  type ExtraFeeListParams,
  type MarketingStats
} from '@/mock/marketing'

// 导出类型
export type {
  PricingStrategy,
  PricingStrategyListParams,
  Coupon,
  CouponListParams,
  MarketingActivity,
  ActivityListParams,
  Package,
  PackageListParams,
  Tour,
  TourListParams,
  ExtraFee,
  ExtraFeeListParams,
  MarketingStats
}

// ==================== 价格策略管理 ====================

/**
 * 获取价格策略列表
 */
export const getPricingStrategyList = (params: PricingStrategyListParams) => {
  // return request.get('/marketing/pricing-strategies', { params })
  return mockGetPricingStrategyList(params)
}

// ==================== 优惠券管理 ====================

/**
 * 获取优惠券列表
 */
export const getCouponList = (params: CouponListParams) => {
  // return request.get('/marketing/coupons', { params })
  return mockGetCouponList(params)
}

// ==================== 营销活动管理 ====================

/**
 * 获取营销活动列表
 */
export const getActivityList = (params: ActivityListParams) => {
  // return request.get('/marketing/activities', { params })
  return mockGetActivityList(params)
}

// ==================== 特惠套餐管理 ====================

/**
 * 获取特惠套餐列表
 */
export const getPackageList = (params: PackageListParams) => {
  // return request.get('/marketing/packages', { params })
  return mockGetPackageList(params)
}

// ==================== 房车旅游管理 ====================

/**
 * 获取房车旅游列表
 */
export const getTourList = (params: TourListParams) => {
  // return request.get('/marketing/tours', { params })
  return mockGetTourList(params)
}

// ==================== 增值费用管理 ====================

/**
 * 获取增值费用列表
 */
export const getExtraFeeList = (params: ExtraFeeListParams) => {
  // return request.get('/marketing/extra-fees', { params })
  return mockGetExtraFeeList(params)
}

// ==================== 营销统计 ====================

/**
 * 获取营销统计
 */
export const getMarketingStats = () => {
  // return request.get('/marketing/stats')
  return mockGetMarketingStats()
}
