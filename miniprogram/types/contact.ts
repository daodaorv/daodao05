/**
 * 联系人相关类型定义
 */

/**
 * 联系人信息
 */
export interface Contact {
  /** 联系人ID */
  id: string
  /** 姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 是否为默认联系人 */
  isDefault: boolean
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

/**
 * 创建联系人参数
 */
export interface CreateContactParams {
  /** 姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 是否设为默认 */
  isDefault?: boolean
}

/**
 * 更新联系人参数
 */
export interface UpdateContactParams {
  /** 姓名 */
  name?: string
  /** 手机号 */
  phone?: string
  /** 是否设为默认 */
  isDefault?: boolean
}
