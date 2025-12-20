<template>
  <u-popup
    :show="show"
    mode="bottom"
    :round="20"
    :closeable="true"
    @close="handleClose"
  >
    <view class="invite-sheet">
      <!-- 标题 -->
      <view class="invite-header">
        <text class="invite-title">邀请好友</text>
        <text class="invite-subtitle">邀请好友注册，双方都得优惠券</text>
      </view>

      <!-- 邀请码展示 -->
      <view class="invite-code-section">
        <view class="invite-code-label">我的邀请码</view>
        <view class="invite-code-box">
          <text class="invite-code-text">{{ inviteCode }}</text>
          <u-button
            type="primary"
            size="small"
            @click="handleCopyCode"
          >
            <u-icon name="copy" size="16" style="margin-right: 4rpx"></u-icon>
            复制
          </u-button>
        </view>
      </view>

      <!-- 奖励规则 -->
      <view class="reward-rules">
        <view class="rules-title">
          <u-icon name="gift" size="18" color="#FF9F29"></u-icon>
          <text>奖励规则</text>
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

      <!-- 操作按钮 -->
      <view class="invite-actions">
        <u-button
          type="primary"
          :loading="generating"
          @click="handleGeneratePoster"
        >
          <u-icon name="photo" size="18" style="margin-right: 8rpx"></u-icon>
          生成邀请海报
        </u-button>
        <u-button
          plain
          type="primary"
          style="margin-top: 20rpx"
          @click="handleShareToFriend"
        >
          <u-icon name="share" size="18" style="margin-right: 8rpx"></u-icon>
          分享给朋友
        </u-button>
      </view>

      <!-- 统计信息 -->
      <view class="invite-stats">
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalInvites }}</text>
          <text class="stat-label">累计邀请</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.successfulRegistrations }}</text>
          <text class="stat-label">成功注册</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">¥{{ stats.totalRewards }}</text>
          <text class="stat-label">累计奖励</text>
        </view>
      </view>

      <!-- 查看邀请记录 -->
      <view class="invite-records-link" @click="handleViewRecords">
        <text>查看邀请记录</text>
        <u-icon name="arrow-right" size="14"></u-icon>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InviteStats } from '@/types/share'
import { shareRewardRules } from '@/config/share-config'
import { logger } from '@/utils/logger'

/**
 * 邀请面板组件
 * @description 基于 uView Plus 的 u-popup 封装的邀请功能面板
 */

interface Props {
  /** 是否显示 */
  show: boolean
  /** 邀请码 */
  inviteCode: string
  /** 邀请统计 */
  stats: InviteStats
  /** 是否正在生成海报 */
  generating?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'copy-code'): void
  (e: 'generate-poster'): void
  (e: 'share-to-friend'): void
  (e: 'view-records'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  inviteCode: '',
  generating: false,
  stats: () => ({
    totalInvites: 0,
    successfulRegistrations: 0,
    completedFirstOrders: 0,
    totalRewards: 0
  })
})

const emit = defineEmits<Emits>()

/**
 * 奖励规则列表
 */
const rewardRules = computed(() => shareRewardRules)

/**
 * 复制邀请码
 */
const handleCopyCode = async () => {
  try {
    await uni.setClipboardData({
      data: props.inviteCode
    })

    uni.showToast({
      title: '邀请码已复制',
      icon: 'success'
    })

    emit('copy-code')
    logger.info('邀请码已复制', { code: props.inviteCode })
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
const handleGeneratePoster = () => {
  emit('generate-poster')
}

/**
 * 分享给朋友
 */
const handleShareToFriend = () => {
  emit('share-to-friend')
  uni.showToast({
    title: '请点击右上角分享',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 查看邀请记录
 */
const handleViewRecords = () => {
  emit('view-records')
  handleClose()
}

/**
 * 关闭面板
 */
const handleClose = () => {
  emit('close')
  emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.invite-sheet {
  padding: 40rpx;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.invite-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;

  .invite-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10rpx;
  }

  .invite-subtitle {
    font-size: 26rpx;
    color: #909399;
  }
}

.invite-code-section {
  margin-bottom: 40rpx;

  .invite-code-label {
    font-size: 28rpx;
    color: #606266;
    margin-bottom: 20rpx;
  }

  .invite-code-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    border-radius: 16rpx;

    .invite-code-text {
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      letter-spacing: 4rpx;
    }
  }
}

.reward-rules {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;

  .rules-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #303133;

    text {
      margin-left: 8rpx;
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

.invite-actions {
  margin-bottom: 40rpx;
}

.invite-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 30rpx 0;
  margin-bottom: 20rpx;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      color: #FF9F29;
      margin-bottom: 8rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: #909399;
    }
  }

  .stat-divider {
    width: 1rpx;
    height: 60rpx;
    background: #e4e7ed;
  }
}

.invite-records-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #2979ff;

  text {
    margin-right: 8rpx;
  }
}
</style>
