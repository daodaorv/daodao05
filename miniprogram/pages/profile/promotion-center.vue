<template>
  <view class="promotion-center-page">
    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 推广数据卡片 -->
      <view class="stats-card">
        <view class="stats-header">
          <view class="header-left">
            <u-icon name="grid-fill" size="24" color="#FFFFFF"></u-icon>
            <text class="header-title">我的推广数据</text>
          </view>
          <u-icon name="reload" size="20" color="#FFFFFF" @click="handleRefresh"></u-icon>
        </view>

        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ totalShares }}</text>
            <text class="stat-label">总分享次数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ totalViews }}</text>
            <text class="stat-label">总访问次数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ totalConversions }}</text>
            <text class="stat-label">总转化次数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ conversionRate }}%</text>
            <text class="stat-label">转化率</text>
          </view>
        </view>
      </view>

      <!-- 邀请统计卡片 -->
      <view class="invite-stats-card">
        <view class="card-header">
          <view class="header-left">
            <u-icon name="account-fill" size="24" color="#FF9F29"></u-icon>
            <text class="header-title">邀请统计</text>
          </view>
          <view class="header-right" @click="navigateTo('/pages/share/invite-records')">
            <text class="more-text">查看记录</text>
            <u-icon name="arrow-right" size="14" color="#909399"></u-icon>
          </view>
        </view>

        <view class="invite-grid">
          <view class="invite-item">
            <text class="invite-value">{{ inviteStats.totalInvites }}</text>
            <text class="invite-label">累计邀请</text>
          </view>
          <view class="invite-item">
            <text class="invite-value">{{ inviteStats.successfulRegistrations }}</text>
            <text class="invite-label">成功注册</text>
          </view>
          <view class="invite-item">
            <text class="invite-value">{{ inviteStats.completedFirstOrders }}</text>
            <text class="invite-label">完成首单</text>
          </view>
          <view class="invite-item">
            <text class="invite-value highlight">¥{{ inviteStats.totalRewards }}</text>
            <text class="invite-label">累计奖励</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions-card">
        <view class="card-header">
          <text class="header-title">快捷操作</text>
        </view>

        <view class="actions-grid">
          <view class="action-item" @click="handleInviteFriend">
            <view class="action-icon-box" style="background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);">
              <u-icon name="share" size="28" color="#FFFFFF"></u-icon>
            </view>
            <text class="action-name">邀请好友</text>
          </view>

          <view class="action-item" @click="handleGeneratePoster">
            <view class="action-icon-box" style="background: linear-gradient(135deg, #2979FF 0%, #42A5F5 100%);">
              <u-icon name="photo" size="28" color="#FFFFFF"></u-icon>
            </view>
            <text class="action-name">生成海报</text>
          </view>

          <view class="action-item" @click="navigateTo('/pages/share/achievements')">
            <view class="action-icon-box" style="background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);">
              <u-icon name="star" size="28" color="#FFFFFF"></u-icon>
            </view>
            <text class="action-name">我的成就</text>
          </view>

          <view class="action-item" @click="handleCopyInviteCode">
            <view class="action-icon-box" style="background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);">
              <u-icon name="file-text" size="28" color="#FFFFFF"></u-icon>
            </view>
            <text class="action-name">复制邀请码</text>
          </view>
        </view>
      </view>

      <!-- 我的邀请码 -->
      <view class="invite-code-card">
        <view class="card-header">
          <text class="header-title">我的邀请码</text>
        </view>

        <view class="invite-code-box">
          <text class="invite-code-text">{{ inviteCode }}</text>
          <u-button
            type="primary"
            size="small"
            @click="handleCopyInviteCode"
          >
            <u-icon name="copy" size="16" style="margin-right: 4rpx"></u-icon>
            复制
          </u-button>
        </view>

        <view class="invite-code-tip">
          <u-icon name="info-circle" size="14" color="#909399"></u-icon>
          <text>好友使用您的邀请码注册，双方都可获得奖励</text>
        </view>
      </view>

      <!-- 奖励规则 -->
      <view class="reward-rules-card">
        <view class="card-header">
          <view class="header-left">
            <u-icon name="gift-fill" size="24" color="#FF9F29"></u-icon>
            <text class="header-title">奖励规则</text>
          </view>
        </view>

        <view class="rules-list">
          <view
            v-for="rule in rewardRules"
            :key="rule.id"
            class="rule-item"
          >
            <text class="rule-icon">{{ rule.icon }}</text>
            <view class="rule-content">
              <text class="rule-title">{{ rule.title }}</text>
              <text class="rule-desc">{{ rule.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 推广记录 -->
      <view class="promotion-records-card">
        <view class="card-header">
          <text class="header-title">最近推广记录</text>
          <view class="header-right" @click="navigateTo('/pages/share/invite-records')">
            <text class="more-text">查看全部</text>
            <u-icon name="arrow-right" size="14" color="#909399"></u-icon>
          </view>
        </view>

        <view class="records-list">
          <view
            v-for="record in recentRecords"
            :key="record.id"
            class="record-item"
          >
            <u-avatar
              :src="record.avatar"
              size="50"
            />
            <view class="record-info">
              <view class="record-name">{{ record.username }}</view>
              <view class="record-time">{{ formatTime(record.registerTime) }}</view>
            </view>
            <view class="record-status">
              <u-tag
                :text="getStatusText(record.status)"
                :type="getStatusType(record.status)"
                size="mini"
              />
            </view>
          </view>

          <!-- 空状态 -->
          <u-empty
            v-if="recentRecords.length === 0"
            mode="list"
            text="暂无推广记录"
            :show="!loading"
          />
        </view>
      </view>
    </view>

    <!-- 邀请面板 -->
    <InviteSheet
      v-model:show="showInviteSheet"
      :invite-code="inviteCode"
      :stats="inviteStats"
      :generating="isGeneratingPoster"
      @copy-code="handleCopyInviteCode"
      @generate-poster="handleGeneratePoster"
      @share-to-friend="handleShareToFriend"
      @view-records="navigateTo('/pages/share/invite-records')"
    />

    <!-- 海报预览 -->
    <PosterPreview
      v-model:show="showPosterPopup"
      :poster-image="posterImage"
      @save="handleSavePoster"
    />

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <u-loading-icon mode="circle" size="50"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 隐藏的Canvas用于生成海报 -->
    <canvas
      id="poster-canvas"
      type="2d"
      style="position: fixed; left: -9999px; top: -9999px; width: 750px; height: 1334px;"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { InviteRecord, InviteStats } from '@/types/share'
import { ShareScene } from '@/types/share'
import { useInvite } from '@/composables/useShare'
import { useShareAchievement } from '@/composables/useShareAchievement'
import { shareApi } from '@/api/share'
import { shareRewardRules } from '@/config/share-config'
import { generatePoster, savePosterToAlbum } from '@/utils/poster'
import { logger } from '@/utils/logger'
import InviteSheet from '@/components/share/InviteSheet.vue'
import PosterPreview from '@/components/share/PosterPreview.vue'

/**
 * 推广中心页面
 * @description 整合所有分享推广功能的中心页面
 */

// 状态
const loading = ref(false)
const recentRecords = ref<InviteRecord[]>([])
const showPosterPopup = ref(false)
const posterImage = ref('')
const isGeneratingPoster = ref(false)

// 使用邀请功能
const {
  inviteCode,
  showInviteSheet,
  openInviteSheet,
  generateInviteCode
} = useInvite('user_001')

// 使用分享成就功能
const {
  stats,
  totalShares,
  totalViews,
  totalConversions,
  conversionRate,
  refresh: refreshStats
} = useShareAchievement()

// 邀请统计
const inviteStats = ref<InviteStats>({
  totalInvites: 0,
  successfulRegistrations: 0,
  completedFirstOrders: 0,
  totalRewards: 0
})

// 奖励规则
const rewardRules = computed(() => shareRewardRules)

/**
 * 加载邀请统计
 */
const loadInviteStats = async () => {
  try {
    const res = await shareApi.getInviteStats()
    inviteStats.value = res.data
  } catch (error) {
    logger.error('加载邀请统计失败', error)
  }
}

/**
 * 加载最近推广记录
 */
const loadRecentRecords = async () => {
  try {
    loading.value = true
    const res = await shareApi.getInviteRecords({
      page: 1,
      pageSize: 5
    })
    recentRecords.value = res.data
  } catch (error) {
    logger.error('加载推广记录失败', error)
  } finally {
    loading.value = false
  }
}

/**
 * 刷新数据
 */
const handleRefresh = async () => {
  try {
    await Promise.all([
      refreshStats(),
      loadInviteStats(),
      loadRecentRecords()
    ])
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  } catch (error) {
    logger.error('刷新失败', error)
  }
}

/**
 * 邀请好友
 */
const handleInviteFriend = () => {
  if (!inviteCode.value) {
    generateInviteCode()
  }
  openInviteSheet()
}

/**
 * 生成海报
 */
const handleGeneratePoster = async () => {
  try {
    isGeneratingPoster.value = true

    // 生成小程序码
    const qrCodeRes = await shareApi.generateMiniProgramCode({
      scene: inviteCode.value,
      page: '/pages/index/index',
      width: 200
    })

    // 生成海报配置
    const posterConfig = {
      scene: ShareScene.INVITE,
      businessId: 'user_001',
      mainImage: 'https://picsum.photos/670/500?random=invite',
      title: '邀请好友，共享优惠',
      subtitle: '注册即送新人专享券',
      qrCode: qrCodeRes.data.url,
      inviteCode: inviteCode.value
    }

    // 生成海报
    const imagePath = await generatePoster(posterConfig)
    posterImage.value = imagePath

    // 显示海报预览
    showPosterPopup.value = true

    isGeneratingPoster.value = false
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
 * 保存海报
 */
const handleSavePoster = async () => {
  try {
    await savePosterToAlbum(posterImage.value)
    showPosterPopup.value = false
  } catch (error) {
    logger.error('保存海报失败', error)
  }
}

/**
 * 分享给朋友
 */
const handleShareToFriend = () => {
  uni.showToast({
    title: '请点击右上角分享',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 复制邀请码
 */
const handleCopyInviteCode = async () => {
  try {
    if (!inviteCode.value) {
      generateInviteCode()
    }

    await uni.setClipboardData({
      data: inviteCode.value
    })

    uni.showToast({
      title: '邀请码已复制',
      icon: 'success'
    })

    logger.info('邀请码已复制', { code: inviteCode.value })
  } catch (error) {
    logger.error('复制邀请码失败', error)
    uni.showToast({
      title: '复制失败',
      icon: 'none'
    })
  }
}

/**
 * 导航到指定页面
 */
const navigateTo = (url: string) => {
  uni.navigateTo({ url })
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于1天
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }

  // 超过7天显示日期
  return `${date.getMonth() + 1}-${date.getDate()}`
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  return status === 'registered' ? '已注册' : '已完成首单'
}

/**
 * 获取状态类型
 */
const getStatusType = (status: string) => {
  return status === 'registered' ? 'info' : 'success'
}

/**
 * 初始化
 */
onMounted(() => {
  if (!inviteCode.value) {
    generateInviteCode()
  }
  loadInviteStats()
  loadRecentRecords()
})
</script>

<style lang="scss" scoped>
.promotion-center-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-content {
  padding: 20rpx;
}

// 统计卡片
.stats-card {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.3);

  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .header-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #FFFFFF;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12rpx;
      padding: 20rpx;

      .stat-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #FFFFFF;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

// 邀请统计卡片
.invite-stats-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .header-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .more-text {
        font-size: 24rpx;
        color: #909399;
      }
    }
  }

  .invite-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;

    .invite-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .invite-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #303133;
        margin-bottom: 8rpx;

        &.highlight {
          color: #FF9F29;
        }
      }

      .invite-label {
        font-size: 24rpx;
        color: #909399;
      }
    }
  }
}

// 快捷操作卡片
.quick-actions-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .card-header {
    margin-bottom: 30rpx;

    .header-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #303133;
    }
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;

      .action-icon-box {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      }

      .action-name {
        font-size: 24rpx;
        color: #606266;
      }
    }
  }
}

// 邀请码卡片
.invite-code-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .card-header {
    margin-bottom: 20rpx;

    .header-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #303133;
    }
  }

  .invite-code-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    border-radius: 16rpx;
    margin-bottom: 20rpx;

    .invite-code-text {
      font-size: 40rpx;
      font-weight: bold;
      color: #FFFFFF;
      letter-spacing: 4rpx;
    }
  }

  .invite-code-tip {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #909399;
  }
}

// 奖励规则卡片
.reward-rules-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .card-header {
    margin-bottom: 20rpx;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .header-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .rules-list {
    .rule-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .rule-icon {
        font-size: 32rpx;
        margin-right: 16rpx;
        flex-shrink: 0;
      }

      .rule-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .rule-title {
          font-size: 28rpx;
          color: #303133;
          margin-bottom: 4rpx;
        }

        .rule-desc {
          font-size: 24rpx;
          color: #909399;
        }
      }
    }
  }
}

// 推广记录卡片
.promotion-records-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .header-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #303133;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .more-text {
        font-size: 24rpx;
        color: #909399;
      }
    }
  }

  .records-list {
    .record-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .record-info {
        flex: 1;
        margin-left: 20rpx;

        .record-name {
          font-size: 28rpx;
          color: #303133;
          margin-bottom: 8rpx;
        }

        .record-time {
          font-size: 24rpx;
          color: #909399;
        }
      }

      .record-status {
        flex-shrink: 0;
      }
    }
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #909399;
  }
}
</style>
