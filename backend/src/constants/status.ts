/**
 * 状态枚举常量定义
 */

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const;

// 用户类型
export const USER_TYPE = {
  CUSTOMER: 'customer',
  MOBILE_ADMIN: 'mobile_admin',
  PC_ADMIN: 'pc_admin',
} as const;

// 订单状态
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CONFIRMED: 'confirmed',
  READY: 'ready',
  IN_USE: 'in_use',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// 车辆状态
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable',
} as const;

// 支付状态
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDING: 'refunding',
  REFUNDED: 'refunded',
} as const;
