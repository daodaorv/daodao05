/**
 * 通用类型定义
 */

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API响应
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
  error?: unknown;
}

/**
 * 用户类型枚举
 */
export enum UserType {
  CUSTOMER = 'customer',
  MOBILE_ADMIN = 'mobile_admin',
  PC_ADMIN = 'pc_admin',
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  READY = 'ready',
  IN_USE = 'in_use',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * 车辆状态枚举
 */
export enum VehicleStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}
