/**
 * 房车旅游相关API
 */

import { request, type ResponseData } from '@/utils/request';

/**
 * 旅游线路列表查询参数
 */
export interface TourListParams {
  page?: number;
  pageSize?: number;
  duration?: string; // 行程天数筛选: '3-5', '6-8', '9-'
  price?: string; // 价格筛选: '0-3000', '3000-5000', '5000-7000', '7000-'
  status?: string; // 状态筛选: 'recruiting', 'confirmed', 'departed'
  keyword?: string; // 搜索关键词
}

/**
 * 旅游线路列表响应
 */
export interface TourListResponse {
  list: Tour[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 旅游线路基本信息
 */
export interface Tour {
  id: string;
  title: string;
  image: string;
  images?: string[];
  tags: string[];
  days: number;
  minPeople: number;
  maxPeople: number;
  currentPeople: number;
  price: number;
  childPrice: number;
  status: 'recruiting' | 'confirmed' | 'departed';
  isHot: boolean;
  available: number;
}

/**
 * 旅游线路详情
 */
export interface TourDetail {
  id: string;
  title: string;
  images: string[];
  tags: string[];
  duration: number;
  minPeople: number;
  maxPeople: number;
  destination: string;
  pricePerPerson: number;
  childPrice: number;
  isHot: boolean;
  batches: TourBatch[];
  itinerary: ItineraryDay[];
  priceIncludes: string[];
  priceExcludes: string[];
  bookingNotices: string[];
  cancellationPolicy: CancellationPolicy[];
}

/**
 * 旅游批次信息
 */
export interface TourBatch {
  id: string;
  departureDate: string;
  status: 'recruiting' | 'confirmed' | 'departed';
  currentPeople: number;
  maxPeople: number;
}

/**
 * 行程安排
 */
export interface ItineraryDay {
  title: string;
  content: string;
  highlights: string[];
}

/**
 * 取消政策
 */
export interface CancellationPolicy {
  condition: string;
  result: string;
}

/**
 * 旅游预订参数
 */
export interface TourBookingParams {
  tourId: string;
  batchId: string;
  adults: number;
  children: number;
  contactName: string;
  contactPhone: string;
  idCard: string;
  emergencyContact: string;
  emergencyPhone: string;
  remark?: string;
  couponId?: string;
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
 * 旅游预订响应
 */
export interface TourBookingResponse {
  orderId: string;
  orderNo: string;
  status: string;
  totalPrice: number;
  paymentDeadline: string;
}

/**
 * 价格计算参数
 */
export interface TourPriceCalculateParams {
  tourId: string;
  batchId: string;
  adults: number;
  children: number;
}

/**
 * 价格计算响应
 */
export interface TourPriceCalculateResponse {
  adultFee: number;
  childFee: number;
  insuranceFee: number;
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
}

/**
 * 价格明细项
 */
export interface PriceBreakdownItem {
  name: string;
  amount: number;
  description: string;
}

/**
 * 批次可用性检查参数
 */
export interface TourAvailabilityCheckParams {
  tourId: string;
  batchId: string;
  people: number;
}

/**
 * 批次可用性响应
 */
export interface TourAvailabilityCheckResponse {
  available: boolean;
  remainingSeats: number;
  message?: string;
}

/**
 * 获取旅游线路列表
 * @param params 查询参数
 */
export const getTourList = (params: TourListParams): Promise<ResponseData<TourListResponse>> => {
  return request({
    url: '/api/v1/tours',
    method: 'GET',
    data: params
  });
};

/**
 * 获取旅游线路详情
 * @param id 线路ID
 */
export const getTourDetail = (id: string): Promise<ResponseData<TourDetail>> => {
  return request({
    url: `/api/v1/tours/${id}`,
    method: 'GET'
  });
};

/**
 * 创建旅游预订订单
 * @param params 预订参数
 */
export const createTourBooking = (params: TourBookingParams): Promise<ResponseData<TourBookingResponse>> => {
  return request({
    url: '/api/v1/tours/bookings',
    method: 'POST',
    data: params
  });
};

/**
 * 计算旅游预订价格
 * @param params 价格计算参数
 */
export const calculateTourPrice = (params: TourPriceCalculateParams): Promise<ResponseData<TourPriceCalculateResponse>> => {
  return request({
    url: '/api/v1/tours/calculate-price',
    method: 'POST',
    data: params
  });
};

/**
 * 检查批次可用性
 * @param params 可用性检查参数
 */
export const checkTourAvailability = (params: TourAvailabilityCheckParams): Promise<ResponseData<TourAvailabilityCheckResponse>> => {
  return request({
    url: '/api/v1/tours/check-availability',
    method: 'POST',
    data: params
  });
};

/**
 * 获取热门旅游线路
 * @param limit 返回数量
 */
export const getHotTours = (limit: number = 10): Promise<ResponseData<Tour[]>> => {
  return request({
    url: '/api/v1/tours/hot',
    method: 'GET',
    data: { limit }
  });
};

/**
 * 获取推荐旅游线路
 * @param limit 返回数量
 */
export const getRecommendedTours = (limit: number = 10): Promise<ResponseData<Tour[]>> => {
  return request({
    url: '/api/v1/tours/recommended',
    method: 'GET',
    data: { limit }
  });
};

/**
 * 获取批次列表
 * @param tourId 线路ID
 */
export const getTourBatches = (tourId: string): Promise<ResponseData<TourBatch[]>> => {
  return request({
    url: `/api/v1/tours/${tourId}/batches`,
    method: 'GET'
  });
};
