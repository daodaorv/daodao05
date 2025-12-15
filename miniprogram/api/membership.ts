/**
 * 会员服务API
 * 提供PLUS会员相关的接口服务
 */

import { request } from '@/utils/request'

/**
 * 会员信息接口响应
 * 注意: PLUS会员现在通过用户标签系统管理,此接口主要用于会员订阅信息
 */
export interface MembershipInfo {
  id: string
  userId: string
  tagName: string  // 标签名称,如 'PLUS会员'
  startDate: string
  endDate: string
  autoRenew: boolean
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  benefits: MemberBenefit[]
}

/**
 * 会员权益
 */
export interface MemberBenefit {
  id: string
  name: string
  description: string
  icon: string
  type: 'DISCOUNT' | 'SERVICE' | 'PRIVILEGE'
  value?: string
}

/**
 * 会员套餐
 */
export interface MembershipPackage {
  id: string
  name: string
  price: number
  originalPrice: number
  duration: number // 月数
  benefits: MemberBenefit[]
  isRecommended: boolean
}

/**
 * 购买会员请求参数
 */
export interface PurchaseMembershipParams {
  packageId: string
  autoRenew: boolean
  paymentMethod: 'wechat' | 'alipay' | 'balance'
}

/**
 * 购买会员响应
 */
export interface PurchaseMembershipResponse {
  orderId: string
  orderNo: string
  amount: number
  paymentParams?: any
}

/**
 * 获取会员信息
 */
export const getMembershipInfo = () => {
  return request<MembershipInfo>({
    url: '/api/v1/membership/info',
    method: 'GET'
  })
}

/**
 * 获取会员套餐列表
 */
export const getMembershipPackages = () => {
  return request<MembershipPackage[]>({
    url: '/api/v1/membership/packages',
    method: 'GET'
  })
}

/**
 * 获取会员权益列表
 */
export const getMembershipBenefits = () => {
  return request<MemberBenefit[]>({
    url: '/api/v1/membership/benefits',
    method: 'GET'
  })
}

/**
 * 购买会员
 */
export const purchaseMembership = (data: PurchaseMembershipParams) => {
  return request<PurchaseMembershipResponse>({
    url: '/api/v1/membership/purchase',
    method: 'POST',
    data
  })
}

/**
 * 续费会员
 */
export const renewMembership = (data: PurchaseMembershipParams) => {
  return request<PurchaseMembershipResponse>({
    url: '/api/v1/membership/renew',
    method: 'POST',
    data
  })
}

/**
 * 取消自动续费
 */
export const cancelAutoRenew = () => {
  return request({
    url: '/api/v1/membership/cancel-auto-renew',
    method: 'POST'
  })
}

/**
 * 开启自动续费
 */
export const enableAutoRenew = () => {
  return request({
    url: '/api/v1/membership/enable-auto-renew',
    method: 'POST'
  })
}

// ==================== Mock 数据 ====================

/**
 * Mock: 获取会员信息
 */
export const mockGetMembershipInfo = (): Promise<MembershipInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'mem_001',
        userId: 'user_001',
        tagName: 'PLUS会员',
        startDate: '2024-01-15',
        endDate: '2025-01-15',
        autoRenew: true,
        status: 'ACTIVE',
        benefits: [
          {
            id: 'benefit_001',
            name: '租车95折',
            description: '房车租赁享受95折优惠',
            icon: 'coupon',
            type: 'DISCOUNT',
            value: '95%'
          },
          {
            id: 'benefit_002',
            name: '免费取消',
            description: '取车前24小时内免费取消',
            icon: 'close-circle',
            type: 'PRIVILEGE'
          },
          {
            id: 'benefit_003',
            name: '专属客服',
            description: '专属客服优先响应',
            icon: 'server-fill',
            type: 'SERVICE'
          },
          {
            id: 'benefit_004',
            name: '生日优惠',
            description: '生日当月8折优惠券',
            icon: 'gift',
            type: 'PRIVILEGE'
          }
        ]
      })
    }, 500)
  })
}

/**
 * Mock: 获取会员套餐列表
 */
export const mockGetMembershipPackages = (): Promise<MembershipPackage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'package_001',
          name: 'PLUS会员年卡',
          price: 99,
          originalPrice: 199,
          duration: 12,
          isRecommended: true,
          benefits: [
            {
              id: 'benefit_001',
              name: '租车95折',
              description: '房车租赁享受95折优惠（特惠套餐除外）',
              icon: 'coupon',
              type: 'DISCOUNT',
              value: '95%'
            },
            {
              id: 'benefit_002',
              name: '免费取消',
              description: '取车前24小时内免费取消订单',
              icon: 'close-circle',
              type: 'PRIVILEGE'
            },
            {
              id: 'benefit_003',
              name: '专属客服',
              description: '专属客服通道，优先响应',
              icon: 'server-fill',
              type: 'SERVICE'
            },
            {
              id: 'benefit_004',
              name: '生日优惠',
              description: '生日当月赠送8折优惠券',
              icon: 'gift',
              type: 'PRIVILEGE'
            },
            {
              id: 'benefit_005',
              name: '积分翻倍',
              description: '消费积分双倍返还',
              icon: 'integral',
              type: 'PRIVILEGE'
            },
            {
              id: 'benefit_006',
              name: '优先取车',
              description: '门店取车享受优先服务',
              icon: 'arrow-upward',
              type: 'SERVICE'
            }
          ]
        }
      ])
    }, 500)
  })
}

/**
 * Mock: 购买会员
 */
export const mockPurchaseMembership = (data: PurchaseMembershipParams): Promise<PurchaseMembershipResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: 'order_' + Date.now(),
        orderNo: 'MEM' + Date.now(),
        amount: 99,
        paymentParams: {
          // 微信支付参数
          appId: 'wx545d8668053b84a8',
          timeStamp: String(Date.now()),
          nonceStr: 'mock_nonce_' + Date.now(),
          package: 'prepay_id=mock_prepay_id',
          signType: 'MD5',
          paySign: 'mock_sign'
        }
      })
    }, 800)
  })
}
