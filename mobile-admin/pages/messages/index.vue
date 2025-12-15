<template>
  <view class="messages-container">
    <!-- 消息分类 -->
    <view class="message-tabs">
      <view
        v-for="tab in messageTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="changeTab(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <text v-if="tab.unread > 0" class="unread-badge">{{ tab.unread }}</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <view class="message-list">
      <!-- 系统通知 -->
      <view v-if="currentTab === 'system'" class="message-section">
        <view
          v-for="message in systemMessages"
          :key="message.id"
          class="message-item"
          :class="{ unread: !message.read }"
          @click="viewMessage(message)"
        >
          <view class="message-icon system">
            <text>🔔</text>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ message.title }}</text>
              <text class="message-time">{{ formatTime(message.time) }}</text>
            </view>
            <text class="message-desc">{{ message.content }}</text>
          </view>
          <view v-if="!message.read" class="unread-dot"></view>
        </view>
      </view>

      <!-- 订单通知 -->
      <view v-if="currentTab === 'order'" class="message-section">
        <view
          v-for="message in orderMessages"
          :key="message.id"
          class="message-item"
          :class="{ unread: !message.read }"
          @click="viewOrderMessage(message)"
        >
          <view class="message-icon order">
            <text>📋</text>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ message.title }}</text>
              <text class="message-time">{{ formatTime(message.time) }}</text>
            </view>
            <text class="message-desc">{{ message.content }}</text>
          </view>
          <view v-if="!message.read" class="unread-dot"></view>
        </view>
      </view>

      <!-- 工单消息 -->
      <view v-if="currentTab === 'ticket'" class="message-section">
        <view
          v-for="message in ticketMessages"
          :key="message.id"
          class="message-item"
          :class="{ unread: !message.read }"
          @click="viewTicket(message)"
        >
          <view class="message-icon ticket">
            <text>💬</text>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ message.title }}</text>
              <text class="message-time">{{ formatTime(message.time) }}</text>
            </view>
            <text class="message-desc">{{ message.content }}</text>
          </view>
          <view v-if="!message.read" class="unread-dot"></view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="currentMessages.length === 0 && !loading" class="empty-state">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暂无消息</text>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <uni-load-more status="loading" />
      </view>
    </view>
  </view>
</template>

<script>
import { formatRelativeTime } from '@/utils/format'
import { getMessageList, markMessageRead, getUnreadCount } from '@/api/message'

export default {
  data() {
    return {
      currentTab: 'system',
      messageTabs: [
        { label: '系统通知', value: 'system', unread: 0 },
        { label: '订单通知', value: 'order', unread: 0 },
        { label: '工单消息', value: 'ticket', unread: 0 }
      ],
      systemMessages: [],
      orderMessages: [],
      ticketMessages: [],
      loading: false
    }
  },

  computed: {
    currentMessages() {
      if (this.currentTab === 'system') {
        return this.systemMessages
      } else if (this.currentTab === 'order') {
        return this.orderMessages
      } else if (this.currentTab === 'ticket') {
        return this.ticketMessages
      }
      return []
    }
  },

  onLoad() {
    this.loadMessages()
    this.loadUnreadCount()
  },

  onShow() {
    // 页面显示时刷新未读数
    this.loadUnreadCount()
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadMessages(),
      this.loadUnreadCount()
    ]).then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    formatTime(time) {
      return formatRelativeTime(time)
    },

    async loadMessages() {
      this.loading = true
      try {
        // 加载当前标签页的消息
        const data = await getMessageList({
          type: this.currentTab,
          page: 1,
          pageSize: 20
        })

        // 根据类型分配到对应的消息列表
        if (this.currentTab === 'system') {
          this.systemMessages = data.list.map(msg => ({
            id: msg.id,
            title: msg.title,
            content: msg.content,
            time: msg.createTime,
            read: msg.isRead
          }))
        } else if (this.currentTab === 'order') {
          this.orderMessages = data.list.map(msg => ({
            id: msg.id,
            orderId: msg.relatedId,
            orderNo: msg.title.match(/#(\w+)/)?.[1] || '',
            title: msg.title,
            content: msg.content,
            time: msg.createTime,
            read: msg.isRead
          }))
        } else if (this.currentTab === 'ticket') {
          this.ticketMessages = data.list.map(msg => ({
            id: msg.id,
            ticketId: msg.relatedId,
            title: msg.title,
            content: msg.content,
            time: msg.createTime,
            read: msg.isRead
          }))
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('加载消息失败:', error.message)
        } else {
          console.error('加载消息失败:', String(error))
        }
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async loadUnreadCount() {
      try {
        const counts = await getUnreadCount()
        this.messageTabs[0].unread = counts.system
        this.messageTabs[1].unread = counts.order
        this.messageTabs[2].unread = counts.ticket
      } catch (error) {
        if (error instanceof Error) {
          console.error('加载未读数失败:', error.message)
        } else {
          console.error('加载未读数失败:', String(error))
        }
      }
    },

    changeTab(tab) {
      this.currentTab = tab
      // 切换标签时重新加载消息
      this.loadMessages()
    },

    async viewMessage(message) {
      try {
        // 标记为已读
        if (!message.read) {
          await markMessageRead(message.id)
          message.read = true
          await this.loadUnreadCount()
        }

        // 显示消息详情
        uni.showModal({
          title: message.title,
          content: message.content,
          showCancel: false
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('标记已读失败:', error.message)
        } else {
          console.error('标记已读失败:', String(error))
        }
      }
    },

    async viewOrderMessage(message) {
      try {
        // 标记为已读
        if (!message.read) {
          await markMessageRead(message.id)
          message.read = true
          await this.loadUnreadCount()
        }

        // 跳转到订单详情页（非 tabbar 页面，使用 navigateTo）
        uni.navigateTo({
          url: `/pages/orders/detail?id=${message.orderId}`
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('标记已读失败:', error.message)
        } else {
          console.error('标记已读失败:', String(error))
        }
        // 即使标记失败也允许跳转
        uni.navigateTo({
          url: `/pages/orders/detail?id=${message.orderId}`
        })
      }
    },

    async viewTicket(message) {
      try {
        // 标记为已读
        if (!message.read) {
          await markMessageRead(message.id)
          message.read = true
          await this.loadUnreadCount()
        }

        // 跳转到工单列表页面
        uni.navigateTo({
          url: '/pages/messages/ticket-list'
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('标记已读失败:', error.message)
        } else {
          console.error('标记已读失败:', String(error))
        }
        // 即使标记失败也允许跳转
        uni.navigateTo({
          url: '/pages/messages/ticket-list'
        })
      }
    }
  }
}
</script>

<style scoped>
.messages-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.message-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  position: relative;
}

.tab-item.active {
  color: #3cc51f;
  border-bottom: 4rpx solid #3cc51f;
}

.tab-text {
  font-size: 28rpx;
}

.unread-badge {
  position: absolute;
  top: 10rpx;
  right: 20rpx;
  background: #f56c6c;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.message-list {
  padding: 20rpx;
}

.message-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.message-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  align-items: flex-start;
  position: relative;
}

.message-item.unread {
  background: #f0f9ff;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.message-icon.system {
  background: #e6f7ff;
}

.message-icon.order {
  background: #fff7e6;
}

.message-icon.ticket {
  background: #f0f9ff;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.message-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.message-time {
  font-size: 24rpx;
  color: #999;
}

.message-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.unread-dot {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #f56c6c;
}

.empty-state {
  text-align: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.loading-state {
  padding: 40rpx 0;
}
</style>
