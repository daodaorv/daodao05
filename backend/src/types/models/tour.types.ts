/**
 * 房车旅游模块类型定义
 */

/**
 * 旅游线路基础信息
 */
export interface Tour {
  id: number;
  title: string;
  image: string;
  images: string; // JSON字符串
  tags: string; // JSON字符串
  duration: number;
  min_people: number;
  max_people: number;
  destination: string;
  price_per_person: number;
  child_price: number;
  is_hot: boolean;
  itinerary: string; // JSON字符串
  price_includes: string; // JSON字符串
  price_excludes: string; // JSON字符串
  booking_notices: string; // JSON字符串
  cancellation_policy: string; // JSON字符串
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
}

/**
 * 旅游批次
 */
export interface TourBatch {
  id: number;
  tour_id: number;
  departure_date: string;
  status: 'recruiting' | 'confirmed' | 'departed' | 'completed' | 'cancelled';
  current_people: number;
  max_people: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 旅游线路查询参数
 */
export interface TourQueryParams {
  page?: number;
  pageSize?: number;
  duration?: string;
  price?: string;
  status?: string;
  keyword?: string;
}

/**
 * 旅游预订创建参数
 */
export interface CreateTourBookingParams {
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
}
