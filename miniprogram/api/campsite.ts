/**
 * 营地预订相关API
 */

import { request, type ResponseData } from '@/utils/request';

/**
 * 营地列表查询参数
 */
export interface CampsiteListParams {
  page?: number;
  pageSize?: number;
  distance?: string; // 距离筛选: '0-5', '5-10', '10-20', '20-'
  price?: string; // 价格筛选: '0-200', '200-300', '300-400', '400-'
  type?: string; // 类型筛选: 'lake', 'mountain', 'sea', 'forest'
  keyword?: string; // 搜索关键词
  latitude?: number; // 用户纬度
  longitude?: number; // 用户经度
}

/**
 * 营地列表响应
 */
export interface CampsiteListResponse {
  list: Campsite[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 营地基本信息
 */
export interface Campsite {
  id: string;
  name: string;
  image: string;
  images?: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  distance: number;
  price: number;
  availableSites: number;
  isHot: boolean;
  address: string;
}

/**
 * 营地详情
 */
export interface CampsiteDetail {
  id: string;
  name: string;
  images: string[];
  rating: number;
  reviewCount: number;
  address: string;
  distance: number;
  minPrice: number;
  isHot: boolean;
  announcement: string; // 营地公告（从后端获取）
  features: string[];
  facilities: Facility[];
  siteTypes: SiteType[];
  description: string;
  descriptionHtml?: string; // 富文本描述（可选）
  checkInNotices: string[]; // 入住须知列表（从后端获取）
  cancellationPolicy: CancellationPolicy[]; // 取消政策列表（从后端获取）
  reviews: Review[];
}

/**
 * 设施信息
 */
export interface Facility {
  name: string;
  icon: string;
}

/**
 * 营位类型
 */
export interface SiteType {
  id: string;
  name: string;
  description: string;
  area: number;
  capacity: number;
  price: number;
  available: number;
}

/**
 * 取消政策
 */
export interface CancellationPolicy {
  condition: string;
  result: string;
}

/**
 * 评价信息
 */
export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
}

/**
 * 营地预订参数
 */
export interface CampsiteBookingParams {
  campsiteId: string;
  siteTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  contactName: string;
  contactPhone: string;
  remark?: string;
  couponId?: string;
  contactId?: string;
  insurancePlanId?: string;
  insurancePlanName?: string;
  additionalServices?: Array<{
    id: string;
    name: string;
    quantity: number;
    perPerson?: boolean;
    price?: number;
  }>;
}

/**
 * 营地预订响应
 */
export interface CampsiteBookingResponse {
  orderId: string;
  orderNo: string;
  status: string;
  totalPrice: number;
  paymentDeadline: string;
}

/**
 * 价格计算参数
 */
export interface PriceCalculateParams {
  campsiteId: string;
  siteTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

/**
 * 价格计算响应
 */
export interface PriceCalculateResponse {
  siteFee: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  nights: number;
}

/**
 * 营位可用性检查参数
 */
export interface AvailabilityCheckParams {
  campsiteId: string;
  siteTypeId: string;
  checkInDate: string;
  checkOutDate: string;
}

/**
 * 营位可用性响应
 */
export interface AvailabilityCheckResponse {
  available: boolean;
  remainingCount: number;
  message?: string;
}

/**
 * 获取营地列表
 * @param params 查询参数
 */
export const getCampsiteList = (params: CampsiteListParams): Promise<ResponseData<CampsiteListResponse>> => {
  return request({
    url: '/api/v1/campsites',
    method: 'GET',
    data: params
  });
};

/**
 * 获取营地详情
 * @param id 营地ID
 */
export const getCampsiteDetail = (id: string): Promise<ResponseData<CampsiteDetail>> => {
  return request({
    url: `/api/v1/campsites/${id}`,
    method: 'GET'
  });
};

/**
 * 创建营地预订订单
 * @param params 预订参数
 */
export const createCampsiteBooking = (params: CampsiteBookingParams): Promise<ResponseData<CampsiteBookingResponse>> => {
  return request({
    url: '/api/v1/campsites/bookings',
    method: 'POST',
    data: params
  });
};

/**
 * 计算营地预订价格
 * @param params 价格计算参数
 */
export const calculateCampsitePrice = (params: PriceCalculateParams): Promise<ResponseData<PriceCalculateResponse>> => {
  return request({
    url: '/api/v1/campsites/calculate-price',
    method: 'POST',
    data: params
  });
};

/**
 * 检查营位可用性
 * @param params 可用性检查参数
 */
export const checkCampsiteAvailability = (params: AvailabilityCheckParams): Promise<ResponseData<AvailabilityCheckResponse>> => {
  return request({
    url: '/api/v1/campsites/check-availability',
    method: 'POST',
    data: params
  });
};

/**
 * 获取营地评价列表
 * @param campsiteId 营地ID
 * @param page 页码
 * @param pageSize 每页数量
 */
export const getCampsiteReviews = (
  campsiteId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ResponseData<{ list: Review[]; total: number; hasMore: boolean }>> => {
  return request({
    url: `/api/v1/campsites/${campsiteId}/reviews`,
    method: 'GET',
    data: { page, pageSize }
  });
};

/**
 * 获取附近营地
 * @param latitude 纬度
 * @param longitude 经度
 * @param radius 半径（公里）
 * @param limit 返回数量
 */
export const getNearbyCampsites = (
  latitude: number,
  longitude: number,
  radius: number = 50,
  limit: number = 10
): Promise<ResponseData<Campsite[]>> => {
  return request({
    url: '/api/v1/campsites/nearby',
    method: 'GET',
    data: { latitude, longitude, radius, limit }
  });
};

/**
 * 获取热门营地
 * @param limit 返回数量
 */
export const getHotCampsites = (limit: number = 10): Promise<ResponseData<Campsite[]>> => {
  return request({
    url: '/api/v1/campsites/hot',
    method: 'GET',
    data: { limit }
  });
};
