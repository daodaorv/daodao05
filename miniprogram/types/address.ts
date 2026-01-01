/**
 * 地址相关类型定义
 */

/**
 * 地址信息
 */
export interface Address {
  /** 地址ID */
  id: string
  /** 收货人姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 省份 */
  province: string
  /** 城市 */
  city: string
  /** 区县 */
  district: string
  /** 详细地址 */
  detail: string
  /** 是否为默认地址 */
  isDefault: boolean
  /** 创建时间 */
  createdAt?: string
}

/**
 * 创建地址参数
 */
export interface CreateAddressParams {
  /** 收货人姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 省份 */
  province: string
  /** 城市 */
  city: string
  /** 区县 */
  district: string
  /** 详细地址 */
  detail: string
  /** 是否设为默认 */
  isDefault?: boolean
}

/**
 * 更新地址参数
 */
export interface UpdateAddressParams {
  /** 收货人姓名 */
  name?: string
  /** 手机号 */
  phone?: string
  /** 省份 */
  province?: string
  /** 城市 */
  city?: string
  /** 区县 */
  district?: string
  /** 详细地址 */
  detail?: string
  /** 是否设为默认 */
  isDefault?: boolean
}
