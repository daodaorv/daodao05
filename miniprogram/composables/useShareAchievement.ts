/**
 * 分享成就组合式函数
 * @description 基于 uView Plus 组件库封装的成就展示逻辑
 */

import { ref, computed, onMounted } from 'vue'
import type { ShareAchievement, ShareStats } from '@/types/share'
import { shareApi } from '@/api/share'
import { logger } from '@/utils/logger'
import { shareAchievementConfig } from '@/config/share-config'

/**
 * 分享成就组合式函数
 */
export function useShareAchievement() {
  // 状态
  const achievements = ref<ShareAchievement[]>([])
  const stats = ref<ShareStats | null>(null)
  const loading = ref(false)

  /**
   * 已解锁的成就
   */
  const unlockedAchievements = computed(() => {
    return achievements.value.filter(item => item.unlocked)
  })

  /**
   * 未解锁的成就
   */
  const lockedAchievements = computed(() => {
    return achievements.value.filter(item => !item.unlocked)
  })

  /**
   * 成就完成度（百分比）
   */
  const completionRate = computed(() => {
    if (achievements.value.length === 0) return 0
    const unlocked = unlockedAchievements.value.length
    const total = achievements.value.length
    return Math.round((unlocked / total) * 100)
  })

  /**
   * 总分享次数
   */
  const totalShares = computed(() => {
    return stats.value?.totalShares || 0
  })

  /**
   * 总访问次数
   */
  const totalViews = computed(() => {
    return stats.value?.totalViews || 0
  })

  /**
   * 总转化次数
   */
  const totalConversions = computed(() => {
    return stats.value?.totalConversions || 0
  })

  /**
   * 转化率（百分比）
   */
  const conversionRate = computed(() => {
    if (!stats.value || stats.value.totalViews === 0) return 0
    return Math.round((stats.value.totalConversions / stats.value.totalViews) * 100)
  })

  /**
   * 加载成就数据
   */
  const loadAchievements = async () => {
    try {
      loading.value = true
      const res = await shareApi.getShareAchievements()
      achievements.value = res.data
    } catch (error) {
      logger.error('加载成就数据失败', error)
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载分享统计
   */
  const loadStats = async () => {
    try {
      const res = await shareApi.getShareStats()
      stats.value = res.data
    } catch (error) {
      logger.error('加载统计数据失败', error)
    }
  }

  /**
   * 刷新数据
   */
  const refresh = async () => {
    await Promise.all([
      loadAchievements(),
      loadStats()
    ])
  }

  /**
   * 获取成就进度百分比
   * @param achievement 成就对象
   */
  const getProgressPercentage = (achievement: ShareAchievement): number => {
    if (achievement.unlocked) return 100
    return Math.min(Math.round((achievement.progress / achievement.target) * 100), 100)
  }

  /**
   * 获取成就进度文本
   * @param achievement 成就对象
   */
  const getProgressText = (achievement: ShareAchievement): string => {
    if (achievement.unlocked) {
      return '已完成'
    }
    return `${achievement.progress}/${achievement.target}`
  }

  /**
   * 获取成就徽章颜色（用于 u-badge）
   * @param achievement 成就对象
   */
  const getBadgeType = (achievement: ShareAchievement): string => {
    if (achievement.unlocked) {
      return 'success'
    }
    const percentage = getProgressPercentage(achievement)
    if (percentage >= 80) {
      return 'warning'
    }
    return 'info'
  }

  /**
   * 获取进度条颜色（用于 u-progress）
   * @param achievement 成就对象
   */
  const getProgressColor = (achievement: ShareAchievement): string => {
    if (achievement.unlocked) {
      return '#19be6b'
    }
    const percentage = getProgressPercentage(achievement)
    if (percentage >= 80) {
      return '#ff9900'
    }
    if (percentage >= 50) {
      return '#2979ff'
    }
    return '#909399'
  }

  /**
   * 检查是否有新成就解锁
   */
  const checkNewAchievements = () => {
    const newUnlocked = achievements.value.filter(item => {
      return item.unlocked && !item.unlockTime
    })

    if (newUnlocked.length > 0) {
      // 显示成就解锁提示
      newUnlocked.forEach(achievement => {
        uni.showToast({
          title: `🎉 解锁成就：${achievement.name}`,
          icon: 'none',
          duration: 3000
        })
      })
    }
  }

  /**
   * 获取下一个待解锁成就
   */
  const getNextAchievement = computed(() => {
    const locked = lockedAchievements.value
    if (locked.length === 0) return null

    // 按进度百分比排序，返回最接近完成的
    return locked.sort((a, b) => {
      const percentA = getProgressPercentage(a)
      const percentB = getProgressPercentage(b)
      return percentB - percentA
    })[0]
  })

  /**
   * 初始化
   */
  onMounted(() => {
    refresh()
  })

  return {
    // 状态
    achievements,
    stats,
    loading,

    // 计算属性
    unlockedAchievements,
    lockedAchievements,
    completionRate,
    totalShares,
    totalViews,
    totalConversions,
    conversionRate,
    getNextAchievement,

    // 方法
    loadAchievements,
    loadStats,
    refresh,
    getProgressPercentage,
    getProgressText,
    getBadgeType,
    getProgressColor,
    checkNewAchievements
  }
}

/**
 * 分享排行榜组合式函数
 */
export function useShareRanking() {
  const rankings = ref<Array<{
    rank: number
    userId: string
    username: string
    avatar: string
    shareCount: number
    viewCount: number
    conversionCount: number
  }>>([])
  const loading = ref(false)
  const myRank = ref<number | null>(null)

  /**
   * 加载排行榜数据
   */
  const loadRankings = async () => {
    try {
      loading.value = true
      // TODO: 调用排行榜API
      // const res = await shareApi.getShareRankings()
      // rankings.value = res.data

      // Mock数据
      rankings.value = [
        {
          rank: 1,
          userId: 'user_001',
          username: '张***',
          avatar: 'https://picsum.photos/100/100?random=1',
          shareCount: 156,
          viewCount: 1248,
          conversionCount: 89
        },
        {
          rank: 2,
          userId: 'user_002',
          username: '李***',
          avatar: 'https://picsum.photos/100/100?random=2',
          shareCount: 142,
          viewCount: 1156,
          conversionCount: 78
        },
        {
          rank: 3,
          userId: 'user_003',
          username: '王***',
          avatar: 'https://picsum.photos/100/100?random=3',
          shareCount: 128,
          viewCount: 1024,
          conversionCount: 65
        }
      ]

      myRank.value = 15
    } catch (error) {
      logger.error('加载排行榜失败', error)
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取排名徽章颜色
   * @param rank 排名
   */
  const getRankBadgeColor = (rank: number): string => {
    if (rank === 1) return '#FFD700' // 金色
    if (rank === 2) return '#C0C0C0' // 银色
    if (rank === 3) return '#CD7F32' // 铜色
    return '#909399'
  }

  /**
   * 获取排名图标
   * @param rank 排名
   */
  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
  }

  /**
   * 刷新排行榜
   */
  const refresh = async () => {
    await loadRankings()
  }

  onMounted(() => {
    loadRankings()
  })

  return {
    // 状态
    rankings,
    loading,
    myRank,

    // 方法
    loadRankings,
    refresh,
    getRankBadgeColor,
    getRankIcon
  }
}
