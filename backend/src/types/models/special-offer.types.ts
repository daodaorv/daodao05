/**
 * 特惠租车模块类型定义
 */

/**
 * 特惠套餐基础信息
 */
export interface SpecialOffer {
  id: number;
  route_from: string;
  route_to: string;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_image: string;
  vehicle_features: string; // JSON字符串
  package_price: number;
  original_price: number;
  rental_days: number;
  available_time_start: string;
  available_time_end: string;
  remaining_quota: number;
  total_quota: number;
  pickup_store_id: number;
  return_store_id: number;
  package_includes: string; // JSON字符串
  booking_notices: string; // JSON字符串
  cancellation_policy: string; // JSON字符串
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT';
  created_at: Date;
  updated_at: Date;
}

/**
 * 特惠套餐查询参数
 */
export interface SpecialOfferQueryParams {
  route?: string;
  priceRange?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'quota';
  page?: number;
  limit?: number;
}

/**
 * 特惠套餐订单创建参数
 */
export interface CreateSpecialOfferOrderParams {
  offerId: string;
  pickupDate: string;
  insuranceType: string;
  selectedServices?: string[];
  couponCode?: string;
  contactInfo: {
    name: string;
    phone: string;
    idCard: string;
    driverLicense: string;
  };
}

/**
 * 特惠套餐价格计算参数
 */
export interface CalculateSpecialOfferPriceParams {
  offerId: string;
  pickupDate: string;
  insuranceType: string;
  selectedServices?: string[];
  couponCode?: string;
}
