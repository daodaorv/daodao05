/**
 * 选项配置
 *
 * @description 统一管理下拉选择、单选、多选等组件的选项配置
 */

import {
  USER_TYPE_MAP,
  USER_STATUS_MAP,
  RISK_LEVEL_MAP,
  RISK_TYPE_MAP,
  RISK_STATUS_MAP,
  VEHICLE_STATUS_MAP,
  VEHICLE_OWNERSHIP_TYPE_MAP,
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  PAYMENT_METHOD_MAP,
  GENDER_MAP,
  AUDIT_STATUS_MAP,
  HOSTING_STATUS_MAP,
  WITHDRAWAL_STATUS_MAP,
  COUPON_TYPE_MAP,
  COUPON_STATUS_MAP,
  INSURANCE_STATUS_MAP,
  VIOLATION_STATUS_MAP,
  MAINTENANCE_TYPE_MAP,
  MAINTENANCE_STATUS_MAP,
  CAMPSITE_TYPE_MAP,
  TOUR_TYPE_MAP,
  TOUR_DIFFICULTY_MAP,
  PERMISSION_TYPE_MAP,
  LOG_TYPE_MAP,
  LOG_MODULE_MAP,
  LOG_ACTION_MAP,
  NOTIFICATION_TYPE_MAP,
  NOTIFICATION_STATUS_MAP,
  BLACKLIST_REASON_MAP,
  VEHICLE_TYPE_MAP,
  STORE_MAP,
  ROLE_STATUS_MAP,
  ROLE_TYPE_MAP,
  DATA_SCOPE_MAP
} from './enums'

/**
 * 选项类型
 */
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: any
}

/**
 * 将枚举映射转换为选项数组
 */
const mapToOptions = (map: Record<string, string>): Option[] => {
  return Object.entries(map).map(([value, label]) => ({
    label,
    value
  }))
}

/**
 * 用户类型选项
 */
export const USER_TYPE_OPTIONS = mapToOptions(USER_TYPE_MAP)

/**
 * 用户状态选项
 */
export const USER_STATUS_OPTIONS = mapToOptions(USER_STATUS_MAP)

/**
 * 风险等级选项
 */
export const RISK_LEVEL_OPTIONS = mapToOptions(RISK_LEVEL_MAP)

/**
 * 风险类型选项
 */
export const RISK_TYPE_OPTIONS = mapToOptions(RISK_TYPE_MAP)

/**
 * 风险状态选项
 */
export const RISK_STATUS_OPTIONS = mapToOptions(RISK_STATUS_MAP)

/**
 * 车辆状态选项
 */
export const VEHICLE_STATUS_OPTIONS = mapToOptions(VEHICLE_STATUS_MAP)

/**
 * 车辆所有权类型选项
 */
export const VEHICLE_OWNERSHIP_TYPE_OPTIONS = mapToOptions(VEHICLE_OWNERSHIP_TYPE_MAP)

/**
 * 订单状态选项
 */
export const ORDER_STATUS_OPTIONS = mapToOptions(ORDER_STATUS_MAP)

/**
 * 支付状态选项
 */
export const PAYMENT_STATUS_OPTIONS = mapToOptions(PAYMENT_STATUS_MAP)

/**
 * 支付方式选项
 */
export const PAYMENT_METHOD_OPTIONS = mapToOptions(PAYMENT_METHOD_MAP)

/**
 * 性别选项
 */
export const GENDER_OPTIONS = mapToOptions(GENDER_MAP)

/**
 * 审核状态选项
 */
export const AUDIT_STATUS_OPTIONS = mapToOptions(AUDIT_STATUS_MAP)

/**
 * 托管状态选项
 */
export const HOSTING_STATUS_OPTIONS = mapToOptions(HOSTING_STATUS_MAP)

/**
 * 提现状态选项
 */
export const WITHDRAWAL_STATUS_OPTIONS = mapToOptions(WITHDRAWAL_STATUS_MAP)

/**
 * 优惠券类型选项
 */
export const COUPON_TYPE_OPTIONS = mapToOptions(COUPON_TYPE_MAP)

/**
 * 优惠券状态选项
 */
export const COUPON_STATUS_OPTIONS = mapToOptions(COUPON_STATUS_MAP)

/**
 * 保险状态选项
 */
export const INSURANCE_STATUS_OPTIONS = mapToOptions(INSURANCE_STATUS_MAP)

/**
 * 违章状态选项
 */
export const VIOLATION_STATUS_OPTIONS = mapToOptions(VIOLATION_STATUS_MAP)

/**
 * 保养类型选项
 */
export const MAINTENANCE_TYPE_OPTIONS = mapToOptions(MAINTENANCE_TYPE_MAP)

/**
 * 保养状态选项
 */
export const MAINTENANCE_STATUS_OPTIONS = mapToOptions(MAINTENANCE_STATUS_MAP)

/**
 * 营地类型选项
 */
export const CAMPSITE_TYPE_OPTIONS = mapToOptions(CAMPSITE_TYPE_MAP)

/**
 * 旅游线路类型选项
 */
export const TOUR_TYPE_OPTIONS = mapToOptions(TOUR_TYPE_MAP)

/**
 * 旅游线路难度选项
 */
export const TOUR_DIFFICULTY_OPTIONS = mapToOptions(TOUR_DIFFICULTY_MAP)

/**
 * 权限类型选项
 */
export const PERMISSION_TYPE_OPTIONS = mapToOptions(PERMISSION_TYPE_MAP)

/**
 * 日志类型选项
 */
export const LOG_TYPE_OPTIONS = mapToOptions(LOG_TYPE_MAP)

/**
 * 日志模块选项
 */
export const LOG_MODULE_OPTIONS = mapToOptions(LOG_MODULE_MAP)

/**
 * 日志操作类型选项
 */
export const LOG_ACTION_OPTIONS = mapToOptions(LOG_ACTION_MAP)

/**
 * 通知类型选项
 */
export const NOTIFICATION_TYPE_OPTIONS = mapToOptions(NOTIFICATION_TYPE_MAP)

/**
 * 通知状态选项
 */
export const NOTIFICATION_STATUS_OPTIONS = mapToOptions(NOTIFICATION_STATUS_MAP)

/**
 * 黑名单原因选项
 */
export const BLACKLIST_REASON_OPTIONS = mapToOptions(BLACKLIST_REASON_MAP)

/**
 * 车辆类型选项
 */
export const VEHICLE_TYPE_OPTIONS = mapToOptions(VEHICLE_TYPE_MAP)

/**
 * 门店选项
 */
export const STORE_OPTIONS: Option[] = Object.entries(STORE_MAP).map(([value, label]) => ({
  label,
  value: Number(value)
}))

/**
 * 角色状态选项
 */
export const ROLE_STATUS_OPTIONS = mapToOptions(ROLE_STATUS_MAP)

/**
 * 角色类型选项
 */
export const ROLE_TYPE_OPTIONS = mapToOptions(ROLE_TYPE_MAP)

/**
 * 数据权限范围选项
 */
export const DATA_SCOPE_OPTIONS = mapToOptions(DATA_SCOPE_MAP)

/**
 * 是/否选项
 */
export const YES_NO_OPTIONS: Option[] = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

/**
 * 启用/禁用选项
 */
export const ENABLE_DISABLE_OPTIONS: Option[] = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

/**
 * 分页大小选项
 */
export const PAGE_SIZE_OPTIONS: number[] = [10, 20, 50, 100]

/**
 * 日期快捷选项
 */
export const DATE_SHORTCUTS = [
  {
    text: '今天',
    value: () => {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: '昨天',
    value: () => {
      const start = new Date()
      start.setDate(start.getDate() - 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setDate(end.getDate() - 1)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: '本月',
    value: () => {
      const start = new Date()
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setMonth(end.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: '上月',
    value: () => {
      const start = new Date()
      start.setMonth(start.getMonth() - 1, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setDate(0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  }
]
