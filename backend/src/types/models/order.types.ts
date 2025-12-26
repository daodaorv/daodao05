/**
 * 订单相关类型定义
 */
import { RowDataPacket } from 'mysql2/promise';

/**
 * 订单状态枚举
 */
export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'picked_up' | 'returned' | 'completed' | 'cancelled';

/**
 * 支付状态枚举
 */
export type PaymentStatus = 'unpaid' | 'paid' | 'refunding' | 'refunded';

/**
 * 订单接口
 */
export interface Order extends RowDataPacket {
  id: number;
  order_no: string;
  user_id: number;
  vehicle_id: number;
  store_id: number;
  return_store_id?: number;
  start_date: Date;
  end_date: Date;
  days: number;
  daily_price: number;
  total_amount: number;
  deposit: number;
  discount_amount: number;
  actual_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  pickup_time?: Date;
  return_time?: Date;
  pickup_confirmed_by?: number;
  return_confirmed_by?: number;
  cancel_reason?: string;
  cancelled_by?: number;
  cancelled_at?: Date;
  remark?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * 订单详情接口(包含关联信息)
 */
export interface OrderDetail extends Order {
  // 用户信息
  user_name?: string;
  user_phone?: string;

  // 车辆信息
  vehicle_no?: string;
  vehicle_name?: string;
  vehicle_brand?: string;
  license_plate?: string;

  // 门店信息
  store_name?: string;
  store_address?: string;
  return_store_name?: string;
  return_store_address?: string;
}

/**
 * 创建订单请求参数
 */
export interface CreateOrderParams {
  user_id: number;
  vehicle_id: number;
  store_id: number;
  return_store_id?: number;
  start_date: string;
  end_date: string;
  remark?: string;
}

/**
 * 订单查询参数
 */
export interface OrderQueryParams {
  user_id?: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 取消订单参数
 */
export interface CancelOrderParams {
  order_id: number;
  cancel_reason: string;
  cancelled_by: number;
}
