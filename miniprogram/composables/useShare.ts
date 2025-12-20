/**
 * 分享功能组合式函数
 * @description 基于 uView Plus 组件库封装的分享逻辑
 */

import { ref, computed } from 'vue'
import type { ShareConfig, ShareMethod, PosterConfig } from '@/types/share'
import { ShareScene } from '@/types/share'
import { generateShareContent, recordShare, checkShareLimit } from '@/utils/share'
import { generatePoster, savePosterToAlbum } from '@/utils/poster'
import { shareApi } from '@/api/share'
import { logger } from '@/utils/logger'

/**
 * 分享功能组合式函数
 * @param config 分享配置
 */
export function useShare(config: ShareConfig) {
  // 状态
  const showShareSheet = ref(false)
  const showPosterPopup = ref(false)
  const posterImage = ref('')
  const isGeneratingPoster = ref(false)

  /**
   * 分享选项配置（用于 u-action-sheet）
   */
  const shareActions = computed(() => [
    {
      name: '分享给朋友',
      icon: 'share',
      color: '#FF9F29',
      openType: 'share' // 微信原生分享
    },
    {
      name: '生成海报',
      icon: 'photo',
      color: '#FFB84D'
    },
    {
      name: '复制链接',
      icon: 'copy',
      color: '#999'
    }
  ])

  /**
   * 打开分享面板
   */
  const openShareSheet = () => {
    // 检查分享频次限制
    const limitCheck = checkShareLimit(config.businessId)
    if (!limitCheck.allowed) {
      uni.showToast({
        title: limitCheck.message || '分享失败',
        icon: 'none',
        duration: 2000
      })
      return
    }

    showShareSheet.value = true
  }

  /**
   * 关闭分享面板
   */
  const closeShareSheet = () => {
    showShareSheet.value = false
  }

  /**
   * 处理分享选项选择
   * @param index 选项索引
   */
  const handleShareSelect = async (index: number) => {
    logger.info('分享选项被选择', { index })
    closeShareSheet()

    try {
      switch (index) {
        case 0:
          // 分享给朋友（微信原生分享）
          await handleMiniProgramShare()
          break
        case 1:
          // 生成海报
          await handlePosterShare()
          break
        case 2:
          // 复制链接
          await handleCopyLink()
          break
        default:
          logger.warn('未知的分享选项', { index })
      }
    } catch (error) {
      logger.error('分享操作失败', { index, error })
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }

  /**
   * 处理小程序卡片分享
   */
  const handleMiniProgramShare = async () => {
    try {
      // 记录分享行为
      await recordShare(config, 'mini_program' as ShareMethod)

      uni.showToast({
        title: '请点击右上角分享',
        icon: 'none',
        duration: 2000
      })
    } catch (error) {
      logger.error('小程序分享失败', error)
      uni.showToast({
        title: '分享失败',
        icon: 'none'
      })
    }
  }

  /**
   * 处理海报分享
   */
  const handlePosterShare = async () => {
    try {
      isGeneratingPoster.value = true

      // TODO: 完整的海报生成功能需要 Canvas 支持
      // 当前使用简化方案：直接使用业务图片
      logger.info('开始生成海报（简化版）', { config })

      // 使用业务图片作为临时海报
      // 在实际项目中，这里应该调用后端 API 生成带二维码的海报图片
      posterImage.value = config.imageUrl || '/static/logo.png'

      // 显示海报预览
      showPosterPopup.value = true

      // 记录分享行为
      await recordShare(config, 'poster' as ShareMethod)

      isGeneratingPoster.value = false

      uni.showToast({
        title: '海报已生成',
        icon: 'success',
        duration: 1500
      })
    } catch (error) {
      isGeneratingPoster.value = false
      logger.error('海报生成失败', error)
      uni.showToast({
        title: '海报生成失败',
        icon: 'none'
      })
    }
  }

  /**
   * 保存海报到相册
   */
  const savePoster = async () => {
    try {
      await savePosterToAlbum(posterImage.value)
      closePosterPopup()
    } catch (error) {
      logger.error('保存海报失败', error)
    }
  }

  /**
   * 关闭海报预览
   */
  const closePosterPopup = () => {
    showPosterPopup.value = false
    posterImage.value = ''
  }

  /**
   * 处理复制链接
   */
  const handleCopyLink = async () => {
    try {
      // 生成分享内容
      const shareContent = generateShareContent(config)
      const shareUrl = `pages${shareContent.path}`

      // 复制到剪贴板
      await uni.setClipboardData({
        data: shareUrl
      })

      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })

      // 记录分享行为
      await recordShare(config, 'mini_program' as ShareMethod)
    } catch (error) {
      logger.error('复制链接失败', error)
      uni.showToast({
        title: '复制失败',
        icon: 'none'
      })
    }
  }

  /**
   * 获取微信分享内容（用于 onShareAppMessage）
   */
  const getShareContent = () => {
    return generateShareContent(config)
  }

  return {
    // 状态
    showShareSheet,
    showPosterPopup,
    posterImage,
    isGeneratingPoster,
    shareActions,

    // 方法
    openShareSheet,
    closeShareSheet,
    handleShareSelect,
    savePoster,
    closePosterPopup,
    getShareContent
  }
}

/**
 * 邀请功能组合式函数
 * @param userId 用户ID
 */
export function useInvite(userId: string) {
  const inviteCode = ref('')
  const showInviteSheet = ref(false)
  const showInvitePoster = ref(false)
  const invitePosterImage = ref('')
  const isGeneratingPoster = ref(false)

  /**
   * 生成邀请码
   */
  const generateInviteCode = () => {
    const prefix = 'DD'
    const timestamp = Date.now().toString(36).toUpperCase()
    const userHash = userId.slice(0, 4).toUpperCase()
    inviteCode.value = `${prefix}${userHash}${timestamp}`
    return inviteCode.value
  }

  /**
   * 打开邀请面板
   */
  const openInviteSheet = () => {
    if (!inviteCode.value) {
      generateInviteCode()
    }
    showInviteSheet.value = true
  }

  /**
   * 关闭邀请面板
   */
  const closeInviteSheet = () => {
    showInviteSheet.value = false
  }

  /**
   * 复制邀请码
   */
  const copyInviteCode = async () => {
    try {
      await uni.setClipboardData({
        data: inviteCode.value
      })

      uni.showToast({
        title: '邀请码已复制',
        icon: 'success'
      })
    } catch (error) {
      logger.error('复制邀请码失败', error)
      uni.showToast({
        title: '复制失败',
        icon: 'none'
      })
    }
  }

  /**
   * 生成邀请海报
   */
  const generateInvitePoster = async () => {
    try {
      isGeneratingPoster.value = true

      // 生成小程序码
      const qrCodeRes = await shareApi.generateMiniProgramCode({
        scene: inviteCode.value,
        page: '/pages/index/index',
        width: 200
      })

      // 生成海报配置
      const posterConfig: PosterConfig = {
        scene: ShareScene.INVITE,
        businessId: userId,
        mainImage: '/static/share/invite-bg.jpg',
        title: '邀请好友，共享优惠',
        subtitle: '注册即送新人专享券',
        qrCode: qrCodeRes.data.url,
        inviteCode: inviteCode.value
      }

      // 生成海报
      const imagePath = await generatePoster(posterConfig)
      invitePosterImage.value = imagePath

      // 显示海报预览
      showInvitePoster.value = true

      isGeneratingPoster.value = false
    } catch (error) {
      isGeneratingPoster.value = false
      logger.error('邀请海报生成失败', error)
      uni.showToast({
        title: '海报生成失败',
        icon: 'none'
      })
    }
  }

  /**
   * 保存邀请海报
   */
  const saveInvitePoster = async () => {
    try {
      await savePosterToAlbum(invitePosterImage.value)
      closeInvitePoster()
    } catch (error) {
      logger.error('保存邀请海报失败', error)
    }
  }

  /**
   * 关闭邀请海报
   */
  const closeInvitePoster = () => {
    showInvitePoster.value = false
    invitePosterImage.value = ''
  }

  return {
    // 状态
    inviteCode,
    showInviteSheet,
    showInvitePoster,
    invitePosterImage,
    isGeneratingPoster,

    // 方法
    generateInviteCode,
    openInviteSheet,
    closeInviteSheet,
    copyInviteCode,
    generateInvitePoster,
    saveInvitePoster,
    closeInvitePoster
  }
}
