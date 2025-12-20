/**
 * 分享配置文件
 * @description 分享选项、海报模板、文案模板等配置
 */

import type { ShareScene } from '@/types/share'

/**
 * 分享选项配置
 */
export const shareOptions = {
  // 分享给朋友
  shareToFriend: {
    name: '分享给朋友',
    icon: 'share',
    color: '#FF9F29',
    openType: 'share'
  },
  // 生成海报
  generatePoster: {
    name: '生成海报',
    icon: 'photo',
    color: '#FFB84D'
  },
  // 复制链接
  copyLink: {
    name: '复制链接',
    icon: 'copy',
    color: '#999'
  }
}

/**
 * 分享文案模板
 */
export const shareTitleTemplates: Record<ShareScene, string> = {
  vehicle: '【叨叨房车】{name} - 开启你的房车之旅',
  special_offer: '【限时特惠】{name} - 超值房车套餐',
  community: '【房车攻略】{title} - 值得一看',
  campsite: '【优质营地】{name} - 房车露营好去处',
  tour: '【房车旅游】{name} - 一起出发吧',
  hosting: '【托管赚钱】房车托管新方式 - 轻松获得收益',
  invite: '【邀请好友】注册叨叨房车，领取新人专享券'
}

/**
 * 分享描述模板
 */
export const shareDescTemplates: Record<ShareScene, string> = {
  vehicle: '日均¥{price}起，{features}，立即预订享优惠',
  special_offer: '限时特价¥{price}，仅剩{quota}个名额',
  community: '{summary}，点击查看完整内容',
  campsite: '{location}，{facilities}，预订享优惠',
  tour: '{days}天{nights}晚，¥{price}/人起',
  hosting: '保底收益+分成，轻松赚钱，了解详情',
  invite: '新用户注册送20元券，首单再送50元券'
}

/**
 * 海报模板配置
 */
export const posterTemplates = {
  // 默认模板
  default: {
    backgroundColor: ['#FF9F29', '#FFB84D'], // 渐变色
    titleColor: '#FFFFFF',
    titleFontSize: 48,
    titleFontWeight: 'bold',
    subtitleColor: 'rgba(255, 255, 255, 0.9)',
    subtitleFontSize: 32,
    priceColor: '#FFFFFF',
    priceFontSize: 56,
    brandColor: 'rgba(255, 255, 255, 0.8)',
    brandFontSize: 24
  },
  // 房车详情海报
  vehicle: {
    backgroundColor: ['#FF9F29', '#FFB84D'],
    titleColor: '#FFFFFF',
    titleFontSize: 48,
    titleFontWeight: 'bold',
    subtitleColor: 'rgba(255, 255, 255, 0.9)',
    subtitleFontSize: 32,
    priceColor: '#FFFFFF',
    priceFontSize: 56,
    brandColor: 'rgba(255, 255, 255, 0.8)',
    brandFontSize: 24
  },
  // 特惠套餐海报
  specialOffer: {
    backgroundColor: ['#FF6B6B', '#FF8E53'],
    titleColor: '#FFFFFF',
    titleFontSize: 48,
    titleFontWeight: 'bold',
    subtitleColor: 'rgba(255, 255, 255, 0.9)',
    subtitleFontSize: 32,
    priceColor: '#FFFFFF',
    priceFontSize: 56,
    brandColor: 'rgba(255, 255, 255, 0.8)',
    brandFontSize: 24
  },
  // 邀请海报
  invite: {
    backgroundColor: ['#4ECDC4', '#44A08D'],
    titleColor: '#FFFFFF',
    titleFontSize: 48,
    titleFontWeight: 'bold',
    subtitleColor: 'rgba(255, 255, 255, 0.9)',
    subtitleFontSize: 32,
    priceColor: '#FFFFFF',
    priceFontSize: 56,
    brandColor: 'rgba(255, 255, 255, 0.8)',
    brandFontSize: 24
  }
}

/**
 * 分享成功提示文案
 */
export const shareSuccessMessages: Record<ShareScene, string> = {
  vehicle: '分享成功！好友查看后你将获得积分奖励',
  special_offer: '分享成功！帮助好友抢到特惠套餐',
  community: '分享成功！你的内容将获得更多曝光',
  campsite: '分享成功！推荐好友预订营地',
  tour: '分享成功！邀请好友一起出发',
  hosting: '分享成功！让更多人了解托管赚钱',
  invite: '分享成功！好友注册后你将获得奖励'
}

/**
 * 分享奖励规则说明
 */
export const shareRewardRules = [
  {
    id: 1,
    title: '好友注册成功',
    description: '获得新人专享券1张',
    icon: '🎁'
  },
  {
    id: 2,
    title: '好友完成首单',
    description: '获得多张优惠券奖励',
    icon: '💰'
  },
  {
    id: 3,
    title: '好友也有奖励',
    description: '双方都得优惠',
    icon: '🎉'
  },
  {
    id: 4,
    title: '奖励自动发放',
    description: '无需手动领取',
    icon: '✨'
  },
  {
    id: 5,
    title: '无邀请上限',
    description: '邀请越多奖励越多',
    icon: '🚀'
  }
]

/**
 * 分享成就配置
 */
export const shareAchievementConfig = {
  // 分享新手
  beginner: {
    id: 'beginner',
    name: '分享新手',
    description: '完成首次分享',
    icon: '🎉',
    target: 1,
    reward: {
      type: 'points',
      amount: 10
    }
  },
  // 分享达人
  expert: {
    id: 'expert',
    name: '分享达人',
    description: '累计分享10次',
    icon: '🌟',
    target: 10,
    reward: {
      type: 'points',
      amount: 50
    }
  },
  // 分享专家
  master: {
    id: 'master',
    name: '分享专家',
    description: '累计分享50次',
    icon: '💎',
    target: 50,
    reward: {
      type: 'coupon',
      amount: 20
    }
  },
  // 影响力大师
  influencer: {
    id: 'influencer',
    name: '影响力大师',
    description: '分享带来100次转化',
    icon: '👑',
    target: 100,
    reward: {
      type: 'coupon',
      amount: 50
    }
  },
  // 邀请达人
  inviter: {
    id: 'inviter',
    name: '邀请达人',
    description: '成功邀请10位好友注册',
    icon: '🎁',
    target: 10,
    reward: {
      type: 'coupon',
      amount: 100
    }
  }
}

/**
 * 分享频次限制配置
 */
export const shareLimitConfig = {
  // 单内容限制
  singleContent: {
    interval: 5 * 60 * 1000, // 5分钟
    maxCount: 3 // 最多3次
  },
  // 全局限制
  global: {
    interval: 60 * 60 * 1000, // 1小时
    maxCount: 20 // 最多20次
  },
  // 每日限制
  daily: {
    maxCount: 50 // 每天最多50次
  }
}

/**
 * 分享场景默认图片
 */
export const shareDefaultImages: Record<ShareScene, string> = {
  vehicle: '/static/share/vehicle-default.jpg',
  special_offer: '/static/share/offer-default.jpg',
  community: '/static/share/community-default.jpg',
  campsite: '/static/share/campsite-default.jpg',
  tour: '/static/share/tour-default.jpg',
  hosting: '/static/share/hosting-default.jpg',
  invite: '/static/share/invite-default.jpg'
}

/**
 * 品牌信息配置
 */
export const brandConfig = {
  name: '叨叨房车',
  slogan: '长按识别小程序码，开启房车之旅',
  logo: '/static/logo.png',
  qrCodePlaceholder: '/static/qrcode-placeholder.png'
}
