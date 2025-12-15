<template>
  <view class="sync-container">
    <!-- 同步状态卡片 -->
    <view class="status-card">
      <view class="status-icon" :class="'status-' + syncStatus.status">
        <text class="icon-text">{{ getStatusIcon(syncStatus.status) }}</text>
      </view>
      <view class="status-info">
        <text class="status-text">{{ getStatusText(syncStatus.status) }}</text>
        <text class="status-time" v-if="syncStatus.lastSyncTime">
          上次同步：{{ syncStatus.lastSyncTime }}
        </text>
      </view>
      <view class="status-progress" v-if="syncStatus.status === 'syncing'">
        <u-line-progress :percentage="syncProgress" :show-percent="true" :striped="true" :striped-active="true"></u-line-progress>
      </view>
    </view>

    <!-- 同步统计 -->
    <view class="stats-section">
      <view class="section-title">同步统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ syncStats.totalCount }}</text>
          <text class="stat-label">总同步次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ syncStats.successCount }}</text>
          <text class="stat-label">成功次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ syncStats.failCount }}</text>
          <text class="stat-label">失败次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ syncStats.pendingCount }}</text>
          <text class="stat-label">待同步数据</text>
        </view>
      </view>
    </view>

    <!-- 同步配置 -->
    <view class="config-section">
      <view class="section-title">同步配置</view>
      <view class="config-card">
        <view class="config-item">
          <view class="config-left">
            <text class="config-icon">🔄</text>
            <view class="config-info">
              <text class="config-label">自动同步</text>
              <text class="config-desc">网络恢复时自动同步数据</text>
            </view>
          </view>
          <switch :checked="syncConfig.autoSync" @change="handleAutoSyncChange" color="#667eea" />
        </view>

        <view class="config-item">
          <view class="config-left">
            <text class="config-icon">📶</text>
            <view class="config-info">
              <text class="config-label">仅WiFi同步</text>
              <text class="config-desc">仅在WiFi环境下自动同步</text>
            </view>
          </view>
          <switch :checked="syncConfig.wifiOnly" @change="handleWifiOnlyChange" color="#667eea" />
        </view>

        <view class="config-item" @click="showIntervalPicker">
          <view class="config-left">
            <text class="config-icon">⏰</text>
            <view class="config-info">
              <text class="config-label">同步间隔</text>
              <text class="config-desc">{{ getSyncIntervalText(syncConfig.syncInterval) }}</text>
            </view>
          </view>
          <text class="config-arrow">›</text>
        </view>

        <view class="config-item">
          <view class="config-left">
            <text class="config-icon">🔔</text>
            <view class="config-info">
              <text class="config-label">同步通知</text>
              <text class="config-desc">同步完成后显示通知</text>
            </view>
          </view>
          <switch :checked="syncConfig.notification" @change="handleNotificationChange" color="#667eea" />
        </view>
      </view>
    </view>

    <!-- 同步数据类型 -->
    <view class="data-type-section">
      <view class="section-title">同步数据类型</view>
      <view class="data-type-card">
        <view
          class="data-type-item"
          v-for="type in dataTypes"
          :key="type.value"
        >
          <view class="type-left">
            <text class="type-icon">{{ type.icon }}</text>
            <view class="type-info">
              <text class="type-label">{{ type.name }}</text>
              <text class="type-count">{{ type.count }} 条待同步</text>
            </view>
          </view>
          <switch :checked="type.enabled" @change="(e) => handleTypeToggle(type.value, e)" color="#667eea" />
        </view>
      </view>
    </view>

    <!-- 同步按钮 -->
    <view class="action-section">
      <button
        class="sync-button"
        :class="{ syncing: syncStatus.status === 'syncing' }"
        @click="startSync"
        :disabled="syncStatus.status === 'syncing'"
      >
        <text class="button-icon">{{ syncStatus.status === 'syncing' ? '⏳' : '🔄' }}</text>
        <text class="button-text">{{ syncStatus.status === 'syncing' ? '同步中...' : '立即同步' }}</text>
      </button>
      <button class="clear-button" @click="clearSyncData">清除同步数据</button>
    </view>

    <!-- 同步历史 -->
    <view class="history-section">
      <view class="history-header">
        <text class="history-title">同步历史</text>
        <text class="history-count">最近{{ syncHistory.length }}条</text>
      </view>
      <view class="history-list" v-if="syncHistory.length > 0">
        <view
          class="history-item"
          v-for="item in syncHistory"
          :key="item.id"
          @click="viewHistoryDetail(item)"
        >
          <view class="history-icon" :class="'status-' + item.status">
            {{ item.status === 'success' ? '✓' : '✕' }}
          </view>
          <view class="history-info">
            <text class="history-type">{{ item.type }}</text>
            <text class="history-time">{{ item.time }}</text>
            <text class="history-detail">{{ item.detail }}</text>
          </view>
          <text class="history-arrow">›</text>
        </view>
      </view>
      <view class="history-empty" v-else>
        <text class="empty-text">暂无同步记录</text>
      </view>
    </view>

    <!-- 同步间隔选择器 -->
    <u-action-sheet
      :show="showIntervalSheet"
      :actions="intervalActions"
      @close="showIntervalSheet = false"
      @select="handleIntervalSelect"
      title="选择同步间隔"
    ></u-action-sheet>
  </view>
</template>

<script>
import { getSyncStatus, getSyncStats, getSyncConfig, updateSyncConfig, startManualSync, getSyncHistory, clearSyncQueue } from '@/api/sync'
import syncManager from '@/utils/sync'

export default {
  data() {
    return {
      syncStatus: {
        status: 'idle', // idle, syncing, success, failed
        lastSyncTime: null,
        queueSize: 0
      },
      syncProgress: 0,
      syncStats: {
        totalCount: 0,
        successCount: 0,
        failCount: 0,
        pendingCount: 0
      },
      syncConfig: {
        autoSync: true,
        wifiOnly: false,
        syncInterval: 5, // 分钟
        notification: true
      },
      dataTypes: [
        { value: 'order', name: '订单数据', icon: '📋', count: 0, enabled: true },
        { value: 'vehicle', name: '车辆数据', icon: '🚗', count: 0, enabled: true },
        { value: 'hosting', name: '托管数据', icon: '🏠', count: 0, enabled: true },
        { value: 'message', name: '消息数据', icon: '💬', count: 0, enabled: true },
        { value: 'photo', name: '照片数据', icon: '📷', count: 0, enabled: true }
      ],
      syncHistory: [],
      showIntervalSheet: false,
      intervalActions: [
        { name: '1分钟', value: 1 },
        { name: '5分钟', value: 5 },
        { name: '10分钟', value: 10 },
        { name: '30分钟', value: 30 },
        { name: '1小时', value: 60 }
      ]
    }
  },

  onLoad() {
    this.loadSyncStatus()
    this.loadSyncStats()
    this.loadSyncConfig()
    this.loadSyncHistory()
  },

  onShow() {
    // 页面显示时刷新状态
    this.loadSyncStatus()
  },

  methods: {
    async loadSyncStatus() {
      try {
        const status = syncManager.getSyncStatus()
        this.syncStatus = {
          status: status.syncing ? 'syncing' : (status.status || 'idle'),
          lastSyncTime: status.lastSyncTime ? this.formatTime(new Date(status.lastSyncTime)) : null,
          queueSize: status.queueSize || 0
        }
      } catch (error) {
        console.error('加载同步状态失败:', error)
      }
    },

    async loadSyncStats() {
      try {
        const res = await getSyncStats()
        if (res.code === 200) {
          this.syncStats = res.data
        }
      } catch (error) {
        console.error('加载同步统计失败:', error)
      }
    },

    async loadSyncConfig() {
      try {
        const res = await getSyncConfig()
        if (res.code === 200) {
          this.syncConfig = res.data
        }
      } catch (error) {
        console.error('加载同步配置失败:', error)
      }
    },

    async loadSyncHistory() {
      try {
        const res = await getSyncHistory()
        if (res.code === 200) {
          this.syncHistory = res.data.list
        }
      } catch (error) {
        console.error('加载同步历史失败:', error)
      }
    },

    async handleAutoSyncChange(e) {
      this.syncConfig.autoSync = e.detail.value
      await this.saveSyncConfig()

      if (e.detail.value) {
        syncManager.enableAutoSync()
      } else {
        syncManager.disableAutoSync()
      }
    },

    async handleWifiOnlyChange(e) {
      this.syncConfig.wifiOnly = e.detail.value
      await this.saveSyncConfig()
    },

    async handleNotificationChange(e) {
      this.syncConfig.notification = e.detail.value
      await this.saveSyncConfig()
    },

    async handleTypeToggle(type, e) {
      const dataType = this.dataTypes.find(t => t.value === type)
      if (dataType) {
        dataType.enabled = e.detail.value
        await this.saveSyncConfig()
      }
    },

    showIntervalPicker() {
      this.showIntervalSheet = true
    },

    async handleIntervalSelect(item) {
      this.syncConfig.syncInterval = item.value
      await this.saveSyncConfig()
      this.showIntervalSheet = false

      // 更新同步间隔
      syncManager.startAutoSync(item.value * 60 * 1000)
    },

    async saveSyncConfig() {
      try {
        const res = await updateSyncConfig(this.syncConfig)
        if (res.code === 200) {
          uni.showToast({
            title: '配置已保存',
            icon: 'success',
            duration: 1500
          })
        }
      } catch (error) {
        console.error('保存同步配置失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },

    async startSync() {
      if (this.syncStatus.status === 'syncing') {
        return
      }

      try {
        this.syncStatus.status = 'syncing'
        this.syncProgress = 0

        // 模拟同步进度
        const progressInterval = setInterval(() => {
          if (this.syncProgress < 90) {
            this.syncProgress += 10
          }
        }, 500)

        const res = await syncManager.syncNow()

        clearInterval(progressInterval)
        this.syncProgress = 100

        if (res.success) {
          this.syncStatus.status = 'success'
          uni.showToast({
            title: '同步成功',
            icon: 'success'
          })

          // 刷新数据
          setTimeout(() => {
            this.loadSyncStatus()
            this.loadSyncStats()
            this.loadSyncHistory()
          }, 1000)
        } else {
          this.syncStatus.status = 'failed'
          uni.showToast({
            title: res.message || '同步失败',
            icon: 'none'
          })
        }
      } catch (error) {
        this.syncStatus.status = 'failed'
        uni.showToast({
          title: '同步失败',
          icon: 'none'
        })
        console.error('同步失败:', error)
      }
    },

    clearSyncData() {
      uni.showModal({
        title: '清除同步数据',
        content: '确定要清除所有待同步数据吗？此操作不可恢复。',
        success: async (res) => {
          if (res.confirm) {
            try {
              syncManager.clearQueue()
              uni.showToast({
                title: '已清除',
                icon: 'success'
              })

              // 刷新状态
              this.loadSyncStatus()
              this.loadSyncStats()
            } catch (error) {
              uni.showToast({
                title: '清除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    viewHistoryDetail(item) {
      uni.showModal({
        title: '同步详情',
        content: `类型：${item.type}\n时间：${item.time}\n状态：${item.status === 'success' ? '成功' : '失败'}\n详情：${item.detail}`,
        showCancel: false
      })
    },

    getStatusIcon(status) {
      const icons = {
        idle: '⏸️',
        syncing: '🔄',
        success: '✅',
        failed: '❌'
      }
      return icons[status] || '⏸️'
    },

    getStatusText(status) {
      const texts = {
        idle: '等待同步',
        syncing: '正在同步',
        success: '同步成功',
        failed: '同步失败'
      }
      return texts[status] || '未知状态'
    },

    getSyncIntervalText(minutes) {
      if (minutes < 60) {
        return `${minutes}分钟`
      } else {
        return `${minutes / 60}小时`
      }
    },

    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style scoped>
.sync-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 状态卡片 */
.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.status-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 60rpx;
}

.status-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.status-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.status-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.status-progress {
  width: 100%;
  margin-top: 20rpx;
}

/* 同步统计 */
.stats-section {
  margin: 20rpx;
}

.section-title {
  padding: 0 10rpx 20rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 26rpx;
  color: #999;
}

/* 同步配置 */
.config-section,
.data-type-section {
  margin: 20rpx;
}

.config-card,
.data-type-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.config-item,
.data-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.config-item:last-child,
.data-type-item:last-child {
  border-bottom: none;
}

.config-left,
.type-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.config-icon,
.type-icon {
  font-size: 40rpx;
}

.config-info,
.type-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.config-label,
.type-label {
  font-size: 28rpx;
  color: #333;
}

.config-desc,
.type-count {
  font-size: 24rpx;
  color: #999;
}

.config-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 同步按钮 */
.action-section {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.sync-button,
.clear-button {
  width: 100%;
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.sync-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.sync-button.syncing {
  opacity: 0.7;
}

.sync-button::after,
.clear-button::after {
  border: none;
}

.clear-button {
  background: #f5f5f5;
  color: #666;
}

.button-icon {
  font-size: 40rpx;
}

/* 同步历史 */
.history-section {
  margin: 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx 20rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-count {
  font-size: 24rpx;
  color: #999;
}

.history-list {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
}

.history-icon.status-success {
  background: #67c23a;
}

.history-icon.status-failed {
  background: #f56c6c;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-type {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-time,
.history-detail {
  font-size: 24rpx;
  color: #999;
}

.history-arrow {
  font-size: 40rpx;
  color: #ccc;
}

.history-empty {
  background: #fff;
  border-radius: 12rpx;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
