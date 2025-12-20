<template>
  <view class="invite-records-page">
    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="stats-header">
          <text class="stats-title">邀请统计</text>
        </view>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ stats.totalInvites }}</text>
            <text class="stat-label">累计邀请</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.successfulRegistrations }}</text>
            <text class="stat-label">成功注册</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.completedFirstOrders }}</text>
            <text class="stat-label">完成首单</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ stats.totalRewards }}</text>
            <text class="stat-label">累计奖励</text>
          </view>
        </view>
      </view>

      <!-- 筛选器 -->
      <view class="filter-bar">
        <u-tabs
          :list="filterTabs"
          :current="currentFilter"
          @change="handleFilterChange"
        />
      </view>

      <!-- 邀请记录列表 -->
      <view class="records-list">
        <view
          v-for="record in filteredRecords"
          :key="record.id"
          class="record-item"
        >
          <!-- 用户信息 -->
          <view class="record-user">
            <u-avatar
              :src="record.avatar"
              size="60"
            />
            <view class="user-info">
              <view class="user-name">{{ record.username }}</view>
              <view class="register-time">
                注册时间：{{ formatTime(record.registerTime) }}
              </view>
            </view>
          </view>

          <!-- 状态和奖励 -->
          <view class="record-status">
            <u-tag
              :text="getStatusText(record.status)"
              :type="getStatusType(record.status)"
              size="mini"
            />
            <view class="reward-info">
              <text class="reward-label">奖励：</text>
              <text class="reward-amount">¥{{ record.rewardAmount }}</text>
              <u-tag
                :text="getRewardStatusText(record.rewardStatus)"
                :type="getRewardStatusType(record.rewardStatus)"
                size="mini"
                style="margin-left: 8rpx"
              />
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <u-empty
          v-if="!loading && filteredRecords.length === 0"
          mode="list"
          text="暂无邀请记录"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore" class="load-more">
        <u-loading-icon v-if="loadingMore" mode="circle" />
        <text v-else @click="handleLoadMore">加载更多</text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <u-loading-icon mode="circle" size="50"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { InviteRecord, InviteStats } from '@/types/share'
import { shareApi } from '@/api/share'
import { logger } from '@/utils/logger'

/**
 * 邀请记录页面
 * @description 展示用户的邀请记录和统计信息
 */

// 状态
const loading = ref(false)
const loadingMore = ref(false)
const records = ref<InviteRecord[]>([])
const stats = ref<InviteStats>({
  totalInvites: 0,
  successfulRegistrations: 0,
  completedFirstOrders: 0,
  totalRewards: 0
})
const currentFilter = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

/**
 * 筛选标签
 */
const filterTabs = [
  { name: '全部' },
  { name: '已注册' },
  { name: '已完成首单' }
]

/**
 * 筛选后的记录
 */
const filteredRecords = computed(() => {
  if (currentFilter.value === 0) {
    return records.value
  } else if (currentFilter.value === 1) {
    return records.value.filter(r => r.status === 'registered')
  } else {
    return records.value.filter(r => r.status === 'first_order_completed')
  }
})

/**
 * 加载邀请统计
 */
const loadStats = async () => {
  try {
    const res = await shareApi.getInviteStats()
    stats.value = res.data
  } catch (error) {
    logger.error('加载邀请统计失败', error)
  }
}

/**
 * 加载邀请记录
 */
const loadRecords = async (page: number = 1) => {
  try {
    if (page === 1) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const res = await shareApi.getInviteRecords({
      page,
      pageSize: pageSize.value
    })

    if (page === 1) {
      records.value = res.data
    } else {
      records.value.push(...res.data)
    }

    hasMore.value = res.data.length >= pageSize.value
    currentPage.value = page
  } catch (error) {
    logger.error('加载邀请记录失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

/**
 * 处理筛选切换
 */
const handleFilterChange = (index: number) => {
  currentFilter.value = index
}

/**
 * 加载更多
 */
const handleLoadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadRecords(currentPage.value + 1)
  }
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
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
 * 获取奖励状态文本
 */
const getRewardStatusText = (status: string) => {
  return status === 'pending' ? '待发放' : '已发放'
}

/**
 * 获取奖励状态类型
 */
const getRewardStatusType = (status: string) => {
  return status === 'pending' ? 'warning' : 'success'
}

/**
 * 初始化
 */
onMounted(() => {
  loadStats()
  loadRecords()
})
</script>

<style lang="scss" scoped>
.invite-records-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-content {
  padding: 20rpx;
}

.stats-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .stats-header {
    margin-bottom: 30rpx;

    .stats-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #303133;
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

      .stat-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #FF9F29;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #909399;
      }
    }
  }
}

.filter-bar {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.records-list {
  .record-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .record-user {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .user-info {
        flex: 1;
        margin-left: 20rpx;

        .user-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #303133;
          margin-bottom: 8rpx;
        }

        .register-time {
          font-size: 24rpx;
          color: #909399;
        }
      }
    }

    .record-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;

      .reward-info {
        display: flex;
        align-items: center;

        .reward-label {
          font-size: 24rpx;
          color: #909399;
        }

        .reward-amount {
          font-size: 28rpx;
          font-weight: bold;
          color: #FF9F29;
          margin: 0 8rpx;
        }
      }
    }
  }
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #909399;
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
