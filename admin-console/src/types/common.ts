/**
 * 通用类型定义文件
 *
 * 包含项目中常用的类型定义、接口和类型守卫函数
 */

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  list?: T[]
  items?: T[]
  data?: T[]
  total?: number
  count?: number
}

/**
 * 列表页面选项
 */
export interface ListPageOptions<T> {
  pageSize?: number
  immediate?: boolean
  onSuccess?: (data: PaginationResponse<T>) => void
  onError?: (error: unknown) => void
}

/**
 * 错误类型守卫 - 检查是否为包含 message 的错误对象
 */
export function isApiError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

/**
 * Axios 错误类型守卫
 */
export function isAxiosError(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  )
}

/**
 * 检查 API 响应是否成功
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.code === 0 || response.code === 200
}

/**
 * 从错误对象中提取错误消息
 */
export function getErrorMessage(error: unknown, defaultMessage = '操作失败'): string {
  if (error instanceof Error) {
    return error.message
  }

  if (isApiError(error)) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return defaultMessage
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

/**
 * 车辆状态枚举
 */
export enum VehicleStatus {
  Available = 'available',
  Rented = 'rented',
  Maintenance = 'maintenance',
  Offline = 'offline',
}
