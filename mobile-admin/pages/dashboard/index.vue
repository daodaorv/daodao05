<template>
  <view class="dashboard-container">
    <!-- 数据概览卡片 -->
    <view class="overview-section">
      <view class="section-title">数据概览</view>
      <u-grid :col="2" :border="false">
        <u-grid-item @click="navigateTo('/pages/orders/index')">
          <view class="overview-card card-1">
            <view class="card-value">{{ overview.todayOrders.total }}</view>
            <view class="card-label">今日订单</view>
            <view class="card-detail">
              <text class="detail-item">待确认: {{ overview.todayOrders.pending }}</text>
            </view>
          </view>
        </u-grid-item>

        <u-grid-item>
          <view class="overview-card card-2">
            <view class="card-value">{{ overview.activeUsers.total }}</view>
            <view class="card-label">活跃用户</view>
            <view class="card-detail">
              <text class="detail-item">新增: {{ overview.activeUsers.new }}</text>
            </view>
          </view>
        </u-grid-item>

        <u-grid-item>
          <view class="overview-card card-3">
            <view class="card-value">¥{{ formatMoney(overview.revenue.today) }}</view>
            <view class="card-label">今日收入</view>
            <view class="card-detail">
              <text class="detail-item success">+{{ overview.revenue.growth }}%</text>
            </view>
          </view>
        </u-grid-item>

        <u-grid-item @click="navigateTo('/pages/vehicles/index')">
          <view class="overview-card card-4">
            <view class="card-value">{{ overview.vehicles.available }}</view>
            <view class="card-label">可用车辆</view>
            <view class="card-detail">
              <text class="detail-item">总数: {{ overview.vehicles.total }}</text>
            </view>
          </view>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 待办任务 -->
    <view class="todo-section">
      <view class="section-header">
        <view class="section-title">待办任务</view>
        <u-button
          text="查看全部"
          type="text"
          size="small"
          @click="showAllTodos"
        >
          <template #suffix>
            <u-icon name="arrow-right" size="16"></u-icon>
          </template>
        </u-button>
      </view>

      <view class="todo-list">
        <u-card
          v-for="todo in todoList"
          :key="todo.id"
          :padding="24"
          :margin="0"
          :border-radius="12"
          class="todo-card"
          :class="'priority-' + todo.priority"
        >
          <view class="todo-header">
            <view class="todo-title">{{ todo.title }}</view>
            <u-tag
              :text="getPriorityText(todo.priority)"
              :type="getPriorityTagType(todo.priority)"
              size="mini"
              plain
            />
          </view>
          <view class="todo-desc">{{ todo.description }}</view>
          <view class="todo-footer">
            <text class="todo-time">截止: {{ formatDateTime(todo.deadline) }}</text>
            <u-button
              text="处理"
              type="primary"
              size="mini"
              @click="handleTodo(todo)"
            />
          </view>
        </u-card>

        <u-empty
          v-if="todoList.length === 0"
          mode="data"
          text="暂无待办任务"
          :icon-size="120"
        />
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-title">快捷操作</view>
      <u-grid :col="4" :border="false">
        <u-grid-item
          v-for="action in quickActions"
          :key="action.id"
          @click="handleQuickAction(action)"
        >
          <view class="action-item">
            <view class="action-icon" :style="{ backgroundColor: action.color }">
              <u-icon :name="action.iconName" size="48" color="#fff" v-if="action.iconName"></u-icon>
              <text class="icon" v-else>{{ action.icon }}</text>
            </view>
            <text class="action-label">{{ action.label }}</text>
          </view>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script>
import { getDashboardOverview, getTodoList } from '@/api/dashboard'
import { formatMoney, formatDateTime } from '@/utils/format'

export default {
  data() {
    return {
      overview: {
        todayOrders: { total: 0, pending: 0, confirmed: 0, completed: 0 },
        activeUsers: { total: 0, new: 0, active: 0 },
        revenue: { today: 0, month: 0, growth: 0 },
        vehicles: { total: 0, available: 0, rented: 0, maintenance: 0 }
      },
      todoList: [],
      quickActions: [
        { id: 1, label: '订单管理', icon: '📋', iconName: 'list', color: '#3cc51f', path: '/pages/orders/index' },
        { id: 2, label: '车辆管理', icon: '🚗', iconName: 'car', color: '#ff9500', path: '/pages/vehicles/index' },
        { id: 3, label: '消息通知', icon: '💬', iconName: 'chat', color: '#007aff', path: '/pages/messages/index' },
        { id: 4, label: '数据统计', icon: '📊', iconName: 'chart', color: '#5856d6', path: '/pages/statistics/index' }
      ],
      loading: false
    }
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    formatMoney,
    formatDateTime,

    async loadData() {
      this.loading = true
      try {
        // 加载数据概览
        const overviewData = await getDashboardOverview()
        this.overview = overviewData

        // 加载待办任务（只显示前3条）
        const todoData = await getTodoList({ status: 'pending' })
        this.todoList = todoData.list.slice(0, 3)
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    navigateTo(url) {
      // 判断是否为 tabbar 页面
      const tabbarPages = [
        '/pages/dashboard/index',
        '/pages/orders/index',
        '/pages/vehicles/index',
        '/pages/messages/index',
        '/pages/profile/index'
      ]

      if (tabbarPages.includes(url)) {
        // tabbar 页面使用 switchTab
        uni.switchTab({ url })
      } else {
        // 非 tabbar 页面使用 navigateTo
        uni.navigateTo({ url })
      }
    },

    showAllTodos() {
      // 待办任务列表页面开发中
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    handleTodo(todo) {
      // 根据任务类型跳转到对应页面
      if (todo.type === 'order') {
        this.navigateTo('/pages/orders/index')
      } else if (todo.type === 'vehicle') {
        this.navigateTo('/pages/vehicles/index')
      }
    },

    handleQuickAction(action) {
      if (action.path) {
        this.navigateTo(action.path)
      }
    },

    getPriorityText(priority) {
      const map = {
        high: '紧急',
        medium: '普通',
        low: '低'
      }
      return map[priority] || '普通'
    },

    getPriorityTagType(priority) {
      const map = {
        high: 'error',
        medium: 'warning',
        low: 'info'
      }
      return map[priority] || 'info'
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20rpx;
}

/* 数据概览 */
.overview-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.overview-card {
  border-radius: 16rpx;
  padding: 30rpx;
  color: #fff;
  min-height: 180rpx;
}

.overview-card.card-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.overview-card.card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.overview-card.card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.overview-card.card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.card-value {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.card-label {
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 10rpx;
}

.card-detail {
  font-size: 24rpx;
  opacity: 0.8;
}

.detail-item {
  margin-right: 20rpx;
}

.detail-item.success {
  color: #67c23a;
}

/* 待办任务 */
.todo-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.todo-card {
  background: #f8f8f8;
  border-left: 6rpx solid #3cc51f;
  margin-bottom: 20rpx;
}

.todo-card.priority-high {
  border-left-color: #f56c6c;
}

.todo-card.priority-medium {
  border-left-color: #e6a23c;
}

.todo-card.priority-low {
  border-left-color: #909399;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.todo-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.todo-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  line-height: 1.6;
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-time {
  font-size: 24rpx;
  color: #999;
}

/* 快捷操作 */
.quick-actions {
  background: #fff;
  padding: 30rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.action-icon .icon {
  font-size: 48rpx;
}

.action-label {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style>
