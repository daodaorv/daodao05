/**
 * 特惠租车API
 * 提供特惠套餐的查询、详情、预订等功能
 */

import { request } from '@/utils/request';

/**
 * 获取特惠套餐列表
 * @param params 查询参数
 * @returns 套餐列表
 */
export const getSpecialOfferList = (params: {
  route?: string;        // 路线筛选
  priceRange?: string;   // 价格区间
  sortBy?: string;       // 排序方式
  page?: number;         // 页码
  limit?: number;        // 每页数量
}) => {
  return request({
    url: '/api/v1/special-offers',
    method: 'GET',
    data: params
  });
};

/**
 * 获取特惠套餐详情
 * @param id 套餐ID
 * @returns 套餐详情
 */
export const getSpecialOfferDetail = (id: string) => {
  return request({
    url: `/api/v1/special-offers/${id}`,
    method: 'GET'
  });
};

/**
 * 创建特惠套餐订单
 * @param data 订单数据
 * @returns 订单信息
 */
export const createSpecialOfferOrder = (data: {
  offerId: string;           // 套餐ID
  pickupDate: string;        // 取车日期
  insuranceType: string;     // 保险类型
  selectedServices?: string[]; // 附加服务
  couponCode?: string;       // 优惠券码
  contactInfo: {             // 联系人信息
    name: string;
    phone: string;
    idCard: string;
    driverLicense: string;
  };
}) => {
  return request({
    url: '/api/v1/special-offers/orders',
    method: 'POST',
    data
  });
};

/**
 * 计算特惠套餐价格
 * @param data 计算参数
 * @returns 价格明细
 */
export const calculateSpecialOfferPrice = (data: {
  offerId: string;
  pickupDate: string;
  insuranceType: string;
  selectedServices?: string[];
  couponCode?: string;
}) => {
  return request({
    url: '/api/v1/special-offers/calculate-price',
    method: 'POST',
    data
  });
};

/**
 * 检查套餐可用性
 * @param offerId 套餐ID
 * @param pickupDate 取车日期
 * @returns 可用性信息
 */
export const checkSpecialOfferAvailability = (offerId: string, pickupDate: string) => {
  return request({
    url: `/api/v1/special-offers/${offerId}/availability`,
    method: 'GET',
    data: { pickupDate }
  });
};

export default {
  getSpecialOfferList,
  getSpecialOfferDetail,
  createSpecialOfferOrder,
  calculateSpecialOfferPrice,
  checkSpecialOfferAvailability
};
