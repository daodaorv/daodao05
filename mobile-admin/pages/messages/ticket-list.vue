<template>
  <view class="ticket-list-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索工单号或标题"
        :show-action="false"
        @search="handleSearch"
        @clear="handleClear"
      ></u-search>
    </view>

    <!-- 状态筛选 -->
    <view class="filter-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: currentStatus === tab.value }"
        @click="changeStatus(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <text v-if="tab.count > 0" class="tab-count">{{ tab.count }}</text>
      </view>
    </view>

    <!-- 工单列表 -->
    <view class="ticket-list">
      <view
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="ticket-item"
        @click="viewTicket(ticket)"
      >
        <view class="ticket-header">
          <view class="ticket-number">
            <text class="number-label">#{{ ticket.ticketNo }}</text>
            <u-tag
              :text="getStatusText(ticket.status)"
              :type="getStatusType(ticket.status)"
              size="mini"
            />
          </view>
          <view class="ticket-priority">
            <u-tag
              :text="getPriorityText(ticket.priority)"
              :type="getPriorityType(ticket.priority)"
              size="mini"
              plain
            />
          </view>
        </view>

        <view class="ticket-title">{{ ticket.title }}</view>

        <view class="ticket-desc">{{ ticket.description }}</view>

        <view class="ticket-footer">
          <view class="ticket-info">
            <text class="info-item">
              <text class="info-icon">👤</text>
              {{ ticket.creatorName }}
            </text>
            <text class="info-item">
              <text class="info-icon">📅</text>
              {{ formatTime(ticket.createTime) }}
            </text>
          </view>
          <view v-if="ticket.replyCount > 0" class="reply-count">
            <text class="reply-icon">💬</text>
            <text class="reply-text">{{ ticket.replyCount }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredTickets.length === 0 && !loading" class="empty-state">
        <EmptyState
          icon="📋"
          text="暂无工单"
          :description="currentStatus === 'all' ? '还没有创建任何工单' : `暂无${getStatusText(currentStatus)}工单`"
        />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <LoadingSpinner text="加载中..." />
      </view>
    </view>

    <!-- 创建工单按钮 -->
    <view class="create-button" @click="createTicket">
      <u-icon name="plus" size="24" color="#fff"></u-icon>
      <text class="create-text">创建工单</text>
    </view>
  </view>
</template>

<script>
import { getTicketList, getTicketStats } from '@/api/ticket'
import { formatRelativeTime } from '@/utils/format'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    EmptyState,
    LoadingSpinner
  },

  data() {
    return {
      searchKeyword: '',
      currentStatus: 'all',
      statusTabs: [
        { label: '全部', value: 'all', count: 0 },
        { label: '待处理', value: 'pending', count: 0 },
        { label: '处理中', value: 'processing', count: 0 },
        { label: '已完成', value: 'completed', count: 0 },
        { label: '已关闭', value: 'closed', count: 0 }
      ],
      tickets: [],
      loading: false
    }
  },

  computed: {
    filteredTickets() {
      let result = this.tickets

      // 按状态筛选
      if (this.currentStatus !== 'all') {
        result = result.filter(ticket => ticket.status === this.currentStatus)
      }

      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        result = result.filter(ticket =>
          ticket.ticketNo.toLowerCase().includes(keyword) ||
          ticket.title.toLowerCase().includes(keyword) ||
          ticket.description.toLowerCase().includes(keyword)
        )
      }

      return result
    }
  },

  onLoad() {
    this.loadTickets()
    this.loadStats()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadTickets()
    this.loadStats()
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadTickets(),
      this.loadStats()
    ]).then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    formatTime(time) {
      return formatRelativeTime(time)
    },

    async loadTickets() {
      this.loading = true
      try {
        const data = await getTicketList({
          status: this.currentStatus === 'all' ? undefined : this.currentStatus,
          page: 1,
          pageSize: 50
        })

        this.tickets = data.list.map(ticket => ({
          id: ticket.id,
          ticketNo: ticket.ticketNo,
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          creatorName: ticket.creatorName,
          createTime: ticket.createTime,
          replyCount: ticket.replyCount || 0
        }))
      } catch (error) {
        console.error('加载工单列表失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const stats = await getTicketStats()
        this.statusTabs[0].count = stats.total
        this.statusTabs[1].count = stats.pending
        this.statusTabs[2].count = stats.processing
        this.statusTabs[3].count = stats.completed
        this.statusTabs[4].count = stats.closed
      } catch (error) {
        console.error('加载工单统计失败:', error)
      }
    },

    changeStatus(status) {
      this.currentStatus = status
      this.loadTickets()
    },

    handleSearch() {
      // 搜索已通过computed自动过滤
    },

    handleClear() {
      this.searchKeyword = ''
    },

    viewTicket(ticket) {
      uni.navigateTo({
        url: `/pages/messages/ticket-detail?id=${ticket.id}`
      })
    },

    createTicket() {
      uni.navigateTo({
        url: '/pages/messages/ticket-create'
      })
    },

    getStatusText(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        closed: '已关闭'
      }
      return statusMap[status] || status
    },

    getStatusType(status) {
      const typeMap = {
        pending: 'warning',
        processing: 'primary',
        completed: 'success',
        closed: 'info'
      }
      return typeMap[status] || 'default'
    },

    getPriorityText(priority) {
      const priorityMap = {
        low: '低',
        normal: '普通',
        high: '高',
        urgent: '紧急'
      }
      return priorityMap[priority] || priority
    },

    getPriorityType(priority) {
      const typeMap = {
        low: 'info',
        normal: 'primary',
        high: 'warning',
        urgent: 'error'
      }
      return typeMap[priority] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.search-bar {
  background: #fff;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}

.filter-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-tab {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  border-radius: 40rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.filter-tab.active {
  background: #3cc51f;
  color: #fff;
}

.tab-text {
  font-size: 28rpx;
}

.filter-tab.active .tab-text {
  color: #fff;
}

.tab-count {
  font-size: 24rpx;
  background: rgba(255, 255, 255, 0.3);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  min-width: 40rpx;
  text-align: center;
}

.ticket-list {
  padding: 20rpx;
}

.ticket-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.ticket-number {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.number-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.ticket-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.ticket-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-info {
  display: flex;
  gap: 24rpx;
}

.info-item {
  font-size: 24rpx;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.info-icon {
  font-size: 28rpx;
}

.reply-count {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: #f0f9ff;
  border-radius: 20rpx;
}

.reply-icon {
  font-size: 28rpx;
}

.reply-text {
  font-size: 24rpx;
  color: #1890ff;
  font-weight: 600;
}

.empty-state {
  padding: 120rpx 0;
}

.loading-state {
  padding: 80rpx 0;
}

.create-button {
  position: fixed;
  bottom: 100rpx;
  right: 40rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #3cc51f 0%, #2aa515 100%);
  box-shadow: 0 8rpx 24rpx rgba(60, 197, 31, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  z-index: 100;
}

.create-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
}
</style>
