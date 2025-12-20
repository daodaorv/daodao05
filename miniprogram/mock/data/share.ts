/**
 * 分享功能Mock数据
 * @description 用于前端独立开发的模拟数据
 */

import type {
  ShareRecord,
  ShareStats,
  InviteRecord,
  InviteStats,
  ShareAchievement,
  ShareRewardRule
} from '@/types/share'
import { ShareScene, ShareMethod } from '@/types/share'

/**
 * 分享记录Mock数据
 */
export const mockShareRecords: ShareRecord[] = [
  {
    id: 'share_001',
    userId: 'user_001',
    scene: ShareScene.VEHICLE,
    method: ShareMethod.MINI_PROGRAM,
    businessId: 'vehicle_001',
    shareTime: '2025-12-18T10:30:00Z',
    viewCount: 15,
    conversionCount: 3
  },
  {
    id: 'share_002',
    userId: 'user_001',
    scene: ShareScene.COMMUNITY,
    method: ShareMethod.POSTER,
    businessId: 'post_001',
    shareTime: '2025-12-17T14:20:00Z',
    viewCount: 28,
    conversionCount: 5
  },
  {
    id: 'share_003',
    userId: 'user_001',
    scene: ShareScene.SPECIAL_OFFER,
    method: ShareMethod.MINI_PROGRAM,
    businessId: 'offer_001',
    shareTime: '2025-12-16T09:15:00Z',
    viewCount: 42,
    conversionCount: 8
  }
]

/**
 * 分享统计Mock数据
 */
export const mockShareStats: ShareStats = {
  totalShares: 156,
  totalViews: 1248,
  totalConversions: 89,
  byScene: {
    [ShareScene.VEHICLE]: {
      shares: 45,
      views: 380,
      conversions: 28
    },
    [ShareScene.SPECIAL_OFFER]: {
      shares: 38,
      views: 320,
      conversions: 25
    },
    [ShareScene.COMMUNITY]: {
      shares: 32,
      views: 256,
      conversions: 18
    },
    [ShareScene.CAMPSITE]: {
      shares: 18,
      views: 144,
      conversions: 8
    },
    [ShareScene.TOUR]: {
      shares: 15,
      views: 98,
      conversions: 6
    },
    [ShareScene.HOSTING]: {
      shares: 5,
      views: 35,
      conversions: 2
    },
    [ShareScene.INVITE]: {
      shares: 3,
      views: 15,
      conversions: 2
    }
  }
}

/**
 * 邀请记录Mock数据
 */
export const mockInviteRecords: InviteRecord[] = [
  {
    id: 'invite_001',
    username: '张***',
    avatar: 'https://picsum.photos/100/100?random=1',
    registerTime: '2025-12-18T10:30:00Z',
    status: 'first_order_completed',
    rewardStatus: 'granted',
    rewardAmount: 50
  },
  {
    id: 'invite_002',
    username: '李***',
    avatar: 'https://picsum.photos/100/100?random=2',
    registerTime: '2025-12-17T15:20:00Z',
    status: 'first_order_completed',
    rewardStatus: 'granted',
    rewardAmount: 50
  },
  {
    id: 'invite_003',
    username: '王***',
    avatar: 'https://picsum.photos/100/100?random=3',
    registerTime: '2025-12-16T09:45:00Z',
    status: 'registered',
    rewardStatus: 'pending',
    rewardAmount: 20
  },
  {
    id: 'invite_004',
    username: '赵***',
    avatar: 'https://picsum.photos/100/100?random=4',
    registerTime: '2025-12-15T14:10:00Z',
    status: 'registered',
    rewardStatus: 'granted',
    rewardAmount: 20
  },
  {
    id: 'invite_005',
    username: '刘***',
    avatar: 'https://picsum.photos/100/100?random=5',
    registerTime: '2025-12-14T11:30:00Z',
    status: 'first_order_completed',
    rewardStatus: 'granted',
    rewardAmount: 50
  }
]

/**
 * 邀请统计Mock数据
 */
export const mockInviteStats: InviteStats = {
  totalInvites: 12,
  successfulRegistrations: 12,
  completedFirstOrders: 8,
  totalRewards: 520
}

/**
 * 分享成就Mock数据
 */
export const mockShareAchievements: ShareAchievement[] = [
  {
    id: 'achievement_001',
    name: '分享新手',
    description: '完成首次分享',
    icon: '🎉',
    unlocked: true,
    unlockTime: '2025-12-10T10:00:00Z',
    progress: 1,
    target: 1
  },
  {
    id: 'achievement_002',
    name: '分享达人',
    description: '累计分享10次',
    icon: '🌟',
    unlocked: true,
    unlockTime: '2025-12-15T14:30:00Z',
    progress: 10,
    target: 10
  },
  {
    id: 'achievement_003',
    name: '分享专家',
    description: '累计分享50次',
    icon: '💎',
    unlocked: false,
    progress: 32,
    target: 50
  },
  {
    id: 'achievement_004',
    name: '影响力大师',
    description: '分享带来100次转化',
    icon: '👑',
    unlocked: false,
    progress: 68,
    target: 100
  },
  {
    id: 'achievement_005',
    name: '邀请达人',
    description: '成功邀请10位好友注册',
    icon: '🎁',
    unlocked: true,
    unlockTime: '2025-12-18T09:00:00Z',
    progress: 12,
    target: 10
  }
]

/**
 * 分享奖励规则Mock数据
 */
export const mockShareRewardRules: ShareRewardRule[] = [
  {
    id: 'rule_001',
    name: '社区内容分享奖励',
    scene: ShareScene.COMMUNITY,
    rewardType: 'points',
    rewardAmount: 10,
    condition: 'view',
    enabled: true
  },
  {
    id: 'rule_002',
    name: '邀请注册奖励',
    scene: ShareScene.INVITE,
    rewardType: 'coupon',
    rewardAmount: 20,
    condition: 'conversion',
    enabled: true
  },
  {
    id: 'rule_003',
    name: '邀请首单奖励',
    scene: ShareScene.INVITE,
    rewardType: 'coupon',
    rewardAmount: 50,
    condition: 'conversion',
    enabled: true
  }
]

/**
 * 生成随机分享记录
 * @param count 数量
 * @returns 分享记录数组
 */
export function generateMockShareRecords(count: number): ShareRecord[] {
  const scenes = Object.values(ShareScene)
  const methods = Object.values(ShareMethod)
  const records: ShareRecord[] = []

  for (let i = 0; i < count; i++) {
    const scene = scenes[Math.floor(Math.random() * scenes.length)]
    const method = methods[Math.floor(Math.random() * methods.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    records.push({
      id: `share_${String(i + 1).padStart(3, '0')}`,
      userId: 'user_001',
      scene,
      method,
      businessId: `business_${String(i + 1).padStart(3, '0')}`,
      shareTime: date.toISOString(),
      viewCount: Math.floor(Math.random() * 50),
      conversionCount: Math.floor(Math.random() * 10)
    })
  }

  return records.sort((a, b) =>
    new Date(b.shareTime).getTime() - new Date(a.shareTime).getTime()
  )
}

/**
 * 生成随机邀请记录
 * @param count 数量
 * @returns 邀请记录数组
 */
export function generateMockInviteRecords(count: number): InviteRecord[] {
  const surnames = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴']
  const statuses: Array<'registered' | 'first_order_completed'> = ['registered', 'first_order_completed']
  const rewardStatuses: Array<'pending' | 'granted'> = ['pending', 'granted']
  const records: InviteRecord[] = []

  for (let i = 0; i < count; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const rewardStatus = rewardStatuses[Math.floor(Math.random() * rewardStatuses.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))

    records.push({
      id: `invite_${String(i + 1).padStart(3, '0')}`,
      username: `${surname}***`,
      avatar: `https://picsum.photos/100/100?random=${i + 1}`,
      registerTime: date.toISOString(),
      status,
      rewardStatus,
      rewardAmount: status === 'first_order_completed' ? 50 : 20
    })
  }

  return records.sort((a, b) =>
    new Date(b.registerTime).getTime() - new Date(a.registerTime).getTime()
  )
}
