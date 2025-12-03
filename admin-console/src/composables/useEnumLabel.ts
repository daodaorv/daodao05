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
  BLACKLIST_REASON_MAP
} from '@/constants/enums'

/**
 * 枚举标签映射 Composable
 *
 * @description 统一管理各种枚举值到中文标签的映射，避免在每个页面重复定义
 *
 * @example
 * ```ts
 * const { getUserTypeLabel, getStatusLabel } = useEnumLabel()
 *
 * const typeLabel = getUserTypeLabel('customer') // '普通用户'
 * const statusLabel = getVehicleStatusLabel('available') // '可用'
 * ```
 */
export function useEnumLabel() {
  /**
   * 获取用户类型标签
   */
  const getUserTypeLabel = (type: string): string => {
    return USER_TYPE_MAP[type] || type
  }

  /**
   * 获取用户状态标签
   */
  const getUserStatusLabel = (status: string): string => {
    return USER_STATUS_MAP[status] || status
  }

  /**
   * 获取风险等级标签
   */
  const getRiskLevelLabel = (level: string): string => {
    return RISK_LEVEL_MAP[level] || level
  }

  /**
   * 获取风险类型标签
   */
  const getRiskTypeLabel = (type: string): string => {
    return RISK_TYPE_MAP[type] || type
  }

  /**
   * 获取风险状态标签
   */
  const getRiskStatusLabel = (status: string): string => {
    return RISK_STATUS_MAP[status] || status
  }

  /**
   * 获取车辆状态标签
   */
  const getVehicleStatusLabel = (status: string): string => {
    return VEHICLE_STATUS_MAP[status] || status
  }

  /**
   * 获取车辆所有权类型标签
   */
  const getVehicleOwnershipTypeLabel = (type: string): string => {
    return VEHICLE_OWNERSHIP_TYPE_MAP[type] || type
  }

  /**
   * 获取订单状态标签
   */
  const getOrderStatusLabel = (status: string): string => {
    return ORDER_STATUS_MAP[status] || status
  }

  /**
   * 获取支付状态标签
   */
  const getPaymentStatusLabel = (status: string): string => {
    return PAYMENT_STATUS_MAP[status] || status
  }

  /**
   * 获取支付方式标签
   */
  const getPaymentMethodLabel = (method: string): string => {
    return PAYMENT_METHOD_MAP[method] || method
  }

  /**
   * 获取性别标签
   */
  const getGenderLabel = (gender: string): string => {
    return GENDER_MAP[gender] || gender
  }

  /**
   * 获取黑名单原因标签
   */
  const getBlacklistReasonLabel = (reason: string): string => {
    return BLACKLIST_REASON_MAP[reason] || reason
  }

  /**
   * 通用枚举标签获取
   * @param value 枚举值
   * @param map 枚举映射对象
   */
  const getEnumLabel = (value: string, map: Record<string, string>): string => {
    return map[value] || value
  }

  return {
    getUserTypeLabel,
    getUserStatusLabel,
    getRiskLevelLabel,
    getRiskTypeLabel,
    getRiskStatusLabel,
    getVehicleStatusLabel,
    getVehicleOwnershipTypeLabel,
    getOrderStatusLabel,
    getPaymentStatusLabel,
    getPaymentMethodLabel,
    getGenderLabel,
    getBlacklistReasonLabel,
    getEnumLabel
  }
}
