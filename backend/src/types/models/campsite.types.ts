/**
 * 营地预订模块类型定义
 */

/**
 * 营地基础信息
 */
export interface Campsite {
  id: number;
  name: string;
  image: string;
  images: string; // JSON字符串
  tags: string; // JSON字符串
  rating: number;
  review_count: number;
  distance?: number;
  min_price: number;
  available_sites: number;
  is_hot: boolean;
  address: string;
  latitude: number;
  longitude: number;
  features: string; // JSON字符串
  facilities: string; // JSON字符串
  description: string;
  check_in_notices: string; // JSON字符串
  cancellation_policy: string; // JSON字符串
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
}

/**
 * 营位类型
 */
export interface CampsiteSiteType {
  id: number;
  campsite_id: number;
  name: string;
  description: string;
  area: number;
  capacity: number;
  price: number;
  available: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 营地查询参数
 */
export interface CampsiteQueryParams {
  page?: number;
  pageSize?: number;
  distance?: string;
  price?: string;
  type?: string;
  keyword?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * 营地预订创建参数
 */
export interface CreateCampsiteBookingParams {
  campsiteId: string;
  siteTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  contactName: string;
  contactPhone: string;
  remark?: string;
}
