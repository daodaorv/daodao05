/**
 * 分享功能类型定义
 * @description 定义分享相关的所有类型、接口和枚举
 */

import type { ApiResponse } from './common'

/**
 * 分享场景类型
 */
export enum ShareScene {
  /** 房车详情 */
  VEHICLE = 'vehicle',
  /** 特惠套餐 */
  SPECIAL_OFFER = 'special_offer',
  /** 社区内容 */
  COMMUNITY = 'community',
  /** 营地详情 */
  CAMPSITE = 'campsite',
  /** 旅游路线 */
  TOUR = 'tour',
  /** 托管中心 */
  HOSTING = 'hosting',
  /** 邀请好友 */
  INVITE = 'invite'
}

/**
 * 分享方式
 */
export enum ShareMethod {
  /** 小程序卡片 */
  MINI_PROGRAM = 'mini_program',
  /** 图片海报 */
  POSTER = 'poster',
  /** 朋友圈(通过海报) */
  MOMENTS = 'moments'
}

/**
 * 分享配置
 */
export interface ShareConfig {
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc?: string
  /** 分享图片URL */
  imageUrl?: string
  /** 分享路径 */
  path: string
  /** 分享场景 */
  scene: ShareScene
  /** 业务ID */
  businessId: string
  /** 额外参数 */
  query?: Record<string, string>
}

/**
 * 分享内容
 */
export interface ShareContent {
  /** 分享标题 */
  title: string
  /** 分享路径 */
  path: string
  /** 分享图片 */
  imageUrl?: string
}

/**
 * 分享记录
 */
export interface ShareRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string
  /** 分享场景 */
  scene: ShareScene
  /** 分享方式 */
  method: ShareMethod
  /** 业务ID */
  businessId: string
  /** 分享时间 */
  shareTime: string
  /** 访问次数 */
  viewCount: number
  /** 转化次数 */
  conversionCount: number
}

/**
 * 分享统计
 */
export interface ShareStats {
  /** 总分享次数 */
  totalShares: number
  /** 总访问次数 */
  totalViews: number
  /** 总转化次数 */
  totalConversions: number
  /** 按场景统计 */
  byScene: Record<ShareScene, {
    shares: number
    views: number
    conversions: number
  }>
}

/**
 * 邀请记录
 */
export interface InviteRecord {
  /** 记录ID */
  id: string
  /** 被邀请用户名 */
  username: string
  /** 头像 */
  avatar?: string
  /** 注册时间 */
  registerTime: string
  /** 状态 */
  status: 'registered' | 'first_order_completed'
  /** 奖励状态 */
  rewardStatus: 'pending' | 'granted'
  /** 奖励金额 */
  rewardAmount?: number
}

/**
 * 邀请统计
 */
export interface InviteStats {
  /** 累计邀请 */
  totalInvites: number
  /** 成功注册 */
  successfulRegistrations: number
  /** 完成首单 */
  completedFirstOrders: number
  /** 累计奖励 */
  totalRewards: number
}

/**
 * 海报配置
 */
export interface PosterConfig {
  /** 业务类型 */
  scene: ShareScene
  /** 业务ID */
  businessId: string
  /** 主图 */
  mainImage: string
  /** 标题 */
  title: string
  /** 副标题 */
  subtitle?: string
  /** 价格 */
  price?: string
  /** 二维码 */
  qrCode: string
  /** 邀请码 */
  inviteCode?: string
}

/**
 * 分享缓存（用于频次限制）
 */
export interface ShareCache {
  [businessId: string]: {
    /** 分享次数 */
    count: number
    /** 最后分享时间 */
    lastShareTime: number
    /** 分享时间戳数组 */
    timestamps: number[]
  }
}

/**
 * 分享来源信息
 */
export interface ShareSource {
  /** 分享场景 */
  scene: string
  /** 业务ID */
  businessId: string
  /** 分享者用户ID */
  shareFrom: string
}

/**
 * 分享成就
 */
export interface ShareAchievement {
  /** 成就ID */
  id: string
  /** 成就名称 */
  name: string
  /** 成就描述 */
  description: string
  /** 成就图标 */
  icon: string
  /** 是否已解锁 */
  unlocked: boolean
  /** 解锁时间 */
  unlockTime?: string
  /** 进度 */
  progress: number
  /** 目标 */
  target: number
}

/**
 * 分享奖励规则
 */
export interface ShareRewardRule {
  /** 规则ID */
  id: string
  /** 规则名称 */
  name: string
  /** 分享场景 */
  scene: ShareScene
  /** 奖励类型 */
  rewardType: 'coupon' | 'points' | 'cash'
  /** 奖励金额/数量 */
  rewardAmount: number
  /** 触发条件 */
  condition: 'share' | 'view' | 'conversion'
  /** 是否启用 */
  enabled: boolean
}

/**
 * API响应类型
 */
export interface ShareRecordResponse extends ApiResponse<ShareRecord> {}
export interface ShareStatsResponse extends ApiResponse<ShareStats> {}
export interface InviteRecordsResponse extends ApiResponse<InviteRecord[]> {}
export interface InviteStatsResponse extends ApiResponse<InviteStats> {}
export interface PosterUrlResponse extends ApiResponse<{ url: string }> {}
export interface ShareAchievementsResponse extends ApiResponse<ShareAchievement[]> {}
