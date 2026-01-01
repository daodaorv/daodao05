/**
 * 用户相关类型定义
 */

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户ID */
  id: string
  /** 用户名 */
  username?: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar: string
  /** 手机号 */
  phone?: string
  /** 实名认证状态 */
  isVerified: boolean
  /** 会员等级 */
  memberLevel: number
  /** 会员等级名称 */
  memberLevelName?: string
  /** 积分 */
  points: number
  /** 余额 */
  balance: number
  /** 创建时间 */
  createdAt?: string
}

/**
 * 登录参数
 */
export interface LoginParams {
  /** 手机号 */
  phone: string
  /** 密码或验证码 */
  code: string
  /** 登录类型: password | sms */
  type: 'password' | 'sms'
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** 访问令牌 */
  token: string
  /** 刷新令牌 */
  refreshToken?: string
  /** 用户信息 */
  userInfo: UserInfo
}

/**
 * 驾驶证信息
 */
export interface DriverLicense {
  /** 驾驶证号 */
  licenseNo: string
  /** 姓名 */
  name: string
  /** 有效期开始 */
  validFrom: string
  /** 有效期结束 */
  validTo: string
  /** 准驾车型 */
  vehicleType: string
  /** 驾驶证正面照 */
  frontImage: string
  /** 驾驶证反面照 */
  backImage: string
  /** 审核状态 */
  status: 'pending' | 'approved' | 'rejected'
}

/**
 * 用户统计信息
 */
export interface UserStats {
  /** 订单总数 */
  totalOrders: number
  /** 进行中订单 */
  ongoingOrders: number
  /** 已完成订单 */
  completedOrders: number
  /** 优惠券数量 */
  couponCount: number
  /** 积分 */
  points: number
}
