/**
 * 分享工具函数
 * @description 封装微信小程序分享功能，包括分享内容生成、追踪记录、频次限制等
 */

import { logger } from './logger'
import type {
  ShareConfig,
  ShareContent,
  ShareScene,
  ShareMethod,
  ShareCache,
  ShareSource
} from '@/types/share'
import { shareApi } from '@/api/share'

/**
 * 分享管理器
 */
class ShareManager {
  private readonly CACHE_KEY = 'share_cache'
  private readonly SOURCE_KEY = 'share_source'

  // 频次限制配置
  private readonly LIMITS = {
    // 单内容5分钟内最多分享3次
    SINGLE_CONTENT_INTERVAL: 5 * 60 * 1000,
    SINGLE_CONTENT_MAX_COUNT: 3,
    // 全局1小时内最多分享20次
    GLOBAL_INTERVAL: 60 * 60 * 1000,
    GLOBAL_MAX_COUNT: 20
  }

  /**
   * 生成分享内容
   * @param config 分享配置
   * @returns 分享内容（含追踪参数）
   */
  generateShareContent(config: ShareConfig): ShareContent {
    const { title, path, imageUrl, query = {} } = config

    // 添加分享追踪参数
    const shareParams = {
      ...query,
      share_scene: config.scene,
      share_id: config.businessId,
      share_from: this.getSharerUserId()
    }

    // 构建完整路径
    const fullPath = this.buildPath(path, shareParams)

    return {
      title,
      path: fullPath,
      imageUrl: imageUrl || this.getDefaultShareImage(config.scene)
    }
  }

  /**
   * 构建路径（添加查询参数）
   * @param path 基础路径
   * @param params 查询参数
   * @returns 完整路径
   */
  private buildPath(path: string, params: Record<string, string>): string {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    return queryString ? `${path}?${queryString}` : path
  }

  /**
   * 获取分享者用户ID
   * @returns 用户ID或'guest'
   */
  private getSharerUserId(): string {
    try {
      const userInfo = uni.getStorageSync('userInfo')
      return userInfo?.id || 'guest'
    } catch (error) {
      logger.error('获取用户ID失败', error)
      return 'guest'
    }
  }

  /**
   * 获取默认分享图片
   * @param scene 分享场景
   * @returns 图片URL
   */
  private getDefaultShareImage(scene: ShareScene): string {
    const imageMap: Record<ShareScene, string> = {
      [ShareScene.VEHICLE]: '/static/share/vehicle-default.jpg',
      [ShareScene.SPECIAL_OFFER]: '/static/share/offer-default.jpg',
      [ShareScene.COMMUNITY]: '/static/share/community-default.jpg',
      [ShareScene.CAMPSITE]: '/static/share/campsite-default.jpg',
      [ShareScene.TOUR]: '/static/share/tour-default.jpg',
      [ShareScene.HOSTING]: '/static/share/hosting-default.jpg',
      [ShareScene.INVITE]: '/static/share/invite-default.jpg'
    }

    return imageMap[scene] || '/static/share/default.jpg'
  }

  /**
   * 检查分享频次限制
   * @param businessId 业务ID
   * @returns 是否允许分享
   */
  checkShareLimit(businessId: string): { allowed: boolean; message?: string; remainingTime?: number } {
    const cache = this.getShareCache()
    const now = Date.now()

    // 检查单内容频次限制
    const contentCache = cache[businessId]
    if (contentCache) {
      const recentShares = contentCache.timestamps.filter(
        time => now - time < this.LIMITS.SINGLE_CONTENT_INTERVAL
      )

      if (recentShares.length >= this.LIMITS.SINGLE_CONTENT_MAX_COUNT) {
        const oldestShare = Math.min(...recentShares)
        const remainingTime = Math.ceil(
          (this.LIMITS.SINGLE_CONTENT_INTERVAL - (now - oldestShare)) / 1000
        )
        return {
          allowed: false,
          message: '分享过于频繁，请稍后再试',
          remainingTime
        }
      }
    }

    // 检查全局频次限制
    const allTimestamps: number[] = []
    Object.values(cache).forEach(item => {
      allTimestamps.push(...item.timestamps)
    })
    const recentGlobalShares = allTimestamps.filter(
      time => now - time < this.LIMITS.GLOBAL_INTERVAL
    )

    if (recentGlobalShares.length >= this.LIMITS.GLOBAL_MAX_COUNT) {
      const oldestShare = Math.min(...recentGlobalShares)
      const remainingTime = Math.ceil(
        (this.LIMITS.GLOBAL_INTERVAL - (now - oldestShare)) / 1000
      )
      return {
        allowed: false,
        message: '今日分享次数已达上限，请明天再试',
        remainingTime
      }
    }

    return { allowed: true }
  }

  /**
   * 记录分享行为
   * @param config 分享配置
   * @param method 分享方式
   */
  async recordShare(config: ShareConfig, method: ShareMethod): Promise<void> {
    try {
      // 检查频次限制
      const limitCheck = this.checkShareLimit(config.businessId)
      if (!limitCheck.allowed) {
        uni.showToast({
          title: limitCheck.message || '分享失败',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 更新本地缓存
      this.updateShareCache(config.businessId)

      // 调用API记录分享
      await shareApi.recordShare({
        scene: config.scene,
        method,
        businessId: config.businessId,
        shareTime: new Date().toISOString()
      })

      logger.info('分享记录成功', { scene: config.scene, method })
    } catch (error) {
      logger.error('分享记录失败', error)
    }
  }

  /**
   * 更新分享缓存
   * @param businessId 业务ID
   */
  private updateShareCache(businessId: string): void {
    try {
      const cache = this.getShareCache()
      const now = Date.now()

      if (!cache[businessId]) {
        cache[businessId] = {
          count: 0,
          lastShareTime: now,
          timestamps: []
        }
      }

      cache[businessId].count++
      cache[businessId].lastShareTime = now
      cache[businessId].timestamps.push(now)

      // 清理过期的时间戳（保留最近1小时的）
      cache[businessId].timestamps = cache[businessId].timestamps.filter(
        time => now - time < this.LIMITS.GLOBAL_INTERVAL
      )

      uni.setStorageSync(this.CACHE_KEY, cache)
    } catch (error) {
      logger.error('更新分享缓存失败', error)
    }
  }

  /**
   * 获取分享缓存
   * @returns 分享缓存对象
   */
  private getShareCache(): ShareCache {
    try {
      return uni.getStorageSync(this.CACHE_KEY) || {}
    } catch (error) {
      logger.error('获取分享缓存失败', error)
      return {}
    }
  }

  /**
   * 处理分享来源
   * @description 在页面onLoad时调用，处理分享参数
   * @param query 页面查询参数
   */
  handleShareSource(query: Record<string, any>): void {
    const { share_scene, share_id, share_from } = query

    if (share_scene && share_id && share_from) {
      // 记录分享访问
      this.recordShareView(share_scene, share_id, share_from)

      // 存储分享来源信息
      this.storeShareSource({
        scene: share_scene,
        businessId: share_id,
        shareFrom: share_from
      })
    }
  }

  /**
   * 记录分享访问
   * @param scene 分享场景
   * @param businessId 业务ID
   * @param shareFrom 分享者ID
   */
  private async recordShareView(
    scene: string,
    businessId: string,
    shareFrom: string
  ): Promise<void> {
    try {
      await shareApi.recordShareView({
        scene,
        businessId,
        shareFrom,
        viewTime: new Date().toISOString()
      })

      logger.info('分享访问记录成功', { scene, businessId })
    } catch (error) {
      logger.error('分享访问记录失败', error)
    }
  }

  /**
   * 存储分享来源信息
   * @param source 分享来源
   */
  private storeShareSource(source: ShareSource): void {
    try {
      uni.setStorageSync(this.SOURCE_KEY, source)
    } catch (error) {
      logger.error('存储分享来源失败', error)
    }
  }

  /**
   * 获取分享来源信息
   * @returns 分享来源或null
   */
  getShareSource(): ShareSource | null {
    try {
      return uni.getStorageSync(this.SOURCE_KEY)
    } catch (error) {
      logger.error('获取分享来源失败', error)
      return null
    }
  }

  /**
   * 清除分享来源信息
   */
  clearShareSource(): void {
    try {
      uni.removeStorageSync(this.SOURCE_KEY)
    } catch (error) {
      logger.error('清除分享来源失败', error)
    }
  }

  /**
   * 生成邀请码
   * @param userId 用户ID
   * @returns 邀请码
   */
  generateInviteCode(userId: string): string {
    const prefix = 'DD'
    const timestamp = Date.now().toString(36).toUpperCase()
    const userHash = userId.slice(0, 4).toUpperCase()
    return `${prefix}${userHash}${timestamp}`
  }

  /**
   * 清理过期的分享缓存
   * @description 定期调用以清理过期数据
   */
  cleanExpiredCache(): void {
    try {
      const cache = this.getShareCache()
      const now = Date.now()
      const cleanedCache: ShareCache = {}

      Object.entries(cache).forEach(([businessId, data]) => {
        const validTimestamps = data.timestamps.filter(
          time => now - time < this.LIMITS.GLOBAL_INTERVAL
        )

        if (validTimestamps.length > 0) {
          cleanedCache[businessId] = {
            count: validTimestamps.length,
            lastShareTime: Math.max(...validTimestamps),
            timestamps: validTimestamps
          }
        }
      })

      uni.setStorageSync(this.CACHE_KEY, cleanedCache)
      logger.info('分享缓存清理完成')
    } catch (error) {
      logger.error('清理分享缓存失败', error)
    }
  }
}

// 导出单例
export const shareManager = new ShareManager()

/**
 * 便捷方法：生成分享内容
 */
export function generateShareContent(config: ShareConfig): ShareContent {
  return shareManager.generateShareContent(config)
}

/**
 * 便捷方法：记录分享
 */
export function recordShare(config: ShareConfig, method: ShareMethod): Promise<void> {
  return shareManager.recordShare(config, method)
}

/**
 * 便捷方法：处理分享来源
 */
export function handleShareSource(query: Record<string, any>): void {
  return shareManager.handleShareSource(query)
}

/**
 * 便捷方法：检查分享限制
 */
export function checkShareLimit(businessId: string): ReturnType<typeof shareManager.checkShareLimit> {
  return shareManager.checkShareLimit(businessId)
}

/**
 * 便捷方法：生成邀请码
 */
export function generateInviteCode(userId: string): string {
  return shareManager.generateInviteCode(userId)
}
