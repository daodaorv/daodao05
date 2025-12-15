import type { ElTagType } from '@/types/element-plus'

/**
 * 创建状态到 ElTag type 的映射函数
 * 确保始终返回有效的 type 值，避免空字符串导致的警告
 *
 * @param mapping - 状态映射配置对象
 * @param defaultType - 默认类型，当找不到匹配时返回（默认为 'info'）
 * @returns 映射函数
 *
 * @example
 * // 订单状态映射
 * const getOrderStatusType = createTagTypeMapper({
 *   pending: 'warning',
 *   confirmed: 'primary',
 *   completed: 'success',
 *   cancelled: 'danger'
 * })
 *
 * getOrderStatusType('pending') // 'warning'
 * getOrderStatusType('unknown') // 'info' (默认值)
 */
export function createTagTypeMapper<T extends string | number>(
  mapping: Record<string, ElTagType>,
  defaultType: ElTagType = 'info'
): (status: T) => ElTagType {
  return (status: T): ElTagType => {
    const key = String(status)
    return mapping[key] || defaultType
  }
}

/**
 * 安全的 ElTag type 值转换
 * 确保返回值始终是有效的 ElTag type
 *
 * @param value - 输入值
 * @param defaultType - 默认类型（默认为 'info'）
 * @returns 有效的 ElTag type
 *
 * @example
 * safeTagType('') // 'info'
 * safeTagType('success') // 'success'
 * safeTagType('invalid') // 'info'
 */
export function safeTagType(value: string | undefined | null, defaultType: ElTagType = 'info'): ElTagType {
  const validTypes: ElTagType[] = ['primary', 'success', 'info', 'warning', 'danger']

  if (!value || value === '') {
    return defaultType
  }

  if (validTypes.includes(value as ElTagType)) {
    return value as ElTagType
  }

  return defaultType
}
