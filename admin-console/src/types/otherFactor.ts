/**
 * 其他因子相关类型定义
 * 用途：支持后续扩展任意新因子类型（租期因子、会员等级、提前预订、优惠券等）
 */

/**
 * 其他因子类型
 */
export type OtherFactorType =
  | 'rental_duration' // 租期因子
  | 'member_level' // 会员等级
  | 'advance_booking' // 提前预订
  | 'coupon' // 优惠券
  | 'custom' // 自定义

/**
 * 调整方式
 */
export type AdjustmentType = 'percentage' | 'fixed'

/**
 * 其他因子状态
 */
export type OtherFactorStatus = 'active' | 'inactive'

/**
 * 触发条件配置
 * 根据 factorType 不同而不同
 */
export interface TriggerCondition {
  // 租期因子配置
  minDays?: number // 最少租期天数
  maxDays?: number // 最多租期天数

  // 会员等级配置
  memberLevel?: string // 会员等级（VIP、黄金会员等）

  // 提前预订配置
  advanceDays?: number // 提前天数

  // 优惠券配置
  couponCode?: string // 优惠券代码
  couponType?: string // 优惠券类型

  // 自定义配置（JSON 格式）
  customConfig?: Record<string, any>
}

/**
 * 其他因子配置
 * 用途：支持后续扩展任意新因子类型
 */
export interface OtherFactor {
  id: number
  factorName: string // 因子名称
  factorType: OtherFactorType // 因子类型
  priority: number // 优先级（1-99）
  adjustmentType: AdjustmentType // 调整方式
  adjustmentValue: number // 调整值
  triggerCondition: TriggerCondition // 触发条件配置
  description: string // 触发条件描述
  status: OtherFactorStatus // 状态
  startDate?: string // 生效日期（可选）
  endDate?: string // 失效日期（可选）
  remark: string // 备注
  createdBy: string // 创建人
  createdAt: string
  updatedAt: string
}

/**
 * 其他因子列表项
 */
export interface OtherFactorListItem extends OtherFactor {
  // 可扩展字段
}

/**
 * 其他因子表单数据
 */
export interface OtherFactorFormData {
  factorName: string
  factorType: OtherFactorType
  priority: number
  adjustmentType: AdjustmentType
  adjustmentValue: number
  triggerCondition: TriggerCondition
  description: string
  status: OtherFactorStatus
  startDate?: string
  endDate?: string
  remark: string
}

/**
 * 其他因子列表查询参数
 */
export interface OtherFactorListParams {
  page?: number
  pageSize?: number
  factorType?: OtherFactorType
  status?: OtherFactorStatus
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 其他因子列表响应
 */
export interface OtherFactorListResponse {
  list: OtherFactorListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 创建其他因子请求
 */
export interface CreateOtherFactorRequest {
  factorName: string
  factorType: OtherFactorType
  priority: number
  adjustmentType: AdjustmentType
  adjustmentValue: number
  triggerCondition: TriggerCondition
  description: string
  status: OtherFactorStatus
  startDate?: string
  endDate?: string
  remark: string
}

/**
 * 创建其他因子响应
 */
export interface CreateOtherFactorResponse {
  success: boolean
  data: OtherFactor
  message: string
}

/**
 * 更新其他因子请求
 */
export interface UpdateOtherFactorRequest {
  id: number
  factorName?: string
  priority?: number
  adjustmentType?: AdjustmentType
  adjustmentValue?: number
  triggerCondition?: TriggerCondition
  description?: string
  status?: OtherFactorStatus
  startDate?: string
  endDate?: string
  remark?: string
}

/**
 * 更新其他因子响应
 */
export interface UpdateOtherFactorResponse {
  success: boolean
  data: OtherFactor
  message: string
}

/**
 * 删除其他因子请求
 */
export interface DeleteOtherFactorRequest {
  id: number
}

/**
 * 删除其他因子响应
 */
export interface DeleteOtherFactorResponse {
  success: boolean
  message: string
}
