<template>
  <div class="notification-bell">
    <el-badge
      :value="unreadCount"
      :max="maxBadgeCount"
      :hidden="unreadCount === 0"
      :is-dot="showDot"
    >
      <el-button
        :icon="Bell"
        circle
        @click="handleToggle"
      />
    </el-badge>

    <!-- 通知弹出框 -->
    <el-drawer
      v-model="drawerVisible"
      :title="title"
      :size="drawerSize"
      :direction="direction"
      :append-to-body="appendToBody"
    >
      <!-- 头部标签页 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <template #label>
            <span class="tab-label">
              {{ tab.label }}
              <el-badge
                v-if="tab.count > 0"
                :value="tab.count"
                :max="maxBadgeCount"
                class="tab-badge"
              />
            </span>
          </template>

          <!-- 通知列表 -->
          <div v-loading="loading" class="notification-list">
            <!-- 空状态 -->
            <el-empty
              v-if="!loading && currentNotifications.length === 0"
              :description="emptyText"
              :image-size="120"
            />

            <!-- 通知项 -->
            <div
              v-for="notification in currentNotifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'is-unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <!-- 左侧图标 -->
              <div class="item-icon" :class="`type-${notification.type}`">
                <el-icon>
                  <component :is="getTypeIcon(notification.type)" />
                </el-icon>
              </div>

              <!-- 中间内容 -->
              <div class="item-content">
                <div class="item-title">
                  {{ notification.title }}
                  <el-tag
                    v-if="!notification.read"
                    type="danger"
                    size="small"
                    effect="dark"
                  >
                    新
                  </el-tag>
                </div>
                <div class="item-description">
                  {{ notification.description }}
                </div>
                <div class="item-time">
                  {{ formatTime(notification.time) }}
                </div>
              </div>

              <!-- 右侧操作 -->
              <div class="item-actions">
                <el-dropdown
                  trigger="click"
                  @command="(command) => handleAction(command, notification)"
                >
                  <el-button :icon="MoreFilled" text circle size="small" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="!notification.read"
                        command="markRead"
                      >
                        标记已读
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-else
                        command="markUnread"
                      >
                        标记未读
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" divided>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

            <!-- 加载更多 -->
            <div
              v-if="hasMore && !loading"
              class="load-more"
              @click="handleLoadMore"
            >
              <el-button text>加载更多</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 底部操作 -->
      <template #footer>
        <div class="drawer-footer">
          <el-button
            v-if="showMarkAllRead && unreadCount > 0"
            @click="handleMarkAllRead"
          >
            全部标记已读
          </el-button>
          <el-button
            v-if="showClearAll"
            @click="handleClearAll"
          >
            清空全部
          </el-button>
          <el-button
            v-if="showViewAll"
            type="primary"
            @click="handleViewAll"
          >
            查看全部
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  MoreFilled,
  InfoFilled,
  WarningFilled,
  SuccessFilled,
  CircleCloseFilled,
  MessageBox,
  ChatDotRound,
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

// 通知类型
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'comment'

// 通知项接口
export interface Notification {
  id: string | number           // 通知 ID
  type: NotificationType        // 通知类型
  title: string                 // 通知标题
  description: string           // 通知描述
  time: string | Date           // 通知时间
  read: boolean                 // 是否已读
  data?: any                    // 附加数据
}

// 标签页配置接口
export interface TabConfig {
  name: string                  // 标签名称
  label: string                 // 标签文本
  count: number                 // 未读数量
  type?: NotificationType[]     // 筛选的通知类型
}

// Props 定义
interface Props {
  notifications?: Notification[] // 通知列表
  tabs?: TabConfig[]            // 标签页配置
  title?: string                // 抽屉标题
  maxBadgeCount?: number        // 徽章最大显示数
  showDot?: boolean             // 是否显示小红点
  drawerSize?: string | number  // 抽屉大小
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt' // 抽屉方向
  appendToBody?: boolean        // 是否插入到 body
  emptyText?: string            // 空状态文本
  showMarkAllRead?: boolean     // 是否显示全部标记已读
  showClearAll?: boolean        // 是否显示清空全部
  showViewAll?: boolean         // 是否显示查看全部
  pageSize?: number             // 每页数量
  autoRefresh?: boolean         // 是否自动刷新
  refreshInterval?: number      // 刷新间隔（毫秒）
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => [],
  tabs: () => [
    { name: 'all', label: '全部', count: 0 },
    { name: 'unread', label: '未读', count: 0 },
    { name: 'message', label: '消息', count: 0, type: ['message'] },
    { name: 'comment', label: '评论', count: 0, type: ['comment'] },
  ],
  title: '通知中心',
  maxBadgeCount: 99,
  showDot: false,
  drawerSize: '400px',
  direction: 'rtl',
  appendToBody: true,
  emptyText: '暂无通知',
  showMarkAllRead: true,
  showClearAll: true,
  showViewAll: true,
  pageSize: 20,
  autoRefresh: false,
  refreshInterval: 30000,
})

// Emits 定义
const emit = defineEmits<{
  'click': [notification: Notification]
  'mark-read': [notification: Notification]
  'mark-unread': [notification: Notification]
  'delete': [notification: Notification]
  'mark-all-read': []
  'clear-all': []
  'view-all': []
  'load-more': [tab: string]
  'refresh': []
}>()

// 响应式数据
const drawerVisible = ref(false)
const activeTab = ref('all')
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

// 计算属性
const unreadCount = computed(() => {
  return props.notifications.filter(n => !n.read).length
})

const currentNotifications = computed(() => {
  const tab = props.tabs.find(t => t.name === activeTab.value)
  let filtered = props.notifications

  // 根据标签页筛选
  if (activeTab.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (tab?.type && tab.type.length > 0) {
    filtered = filtered.filter(n => tab.type!.includes(n.type))
  }

  // 分页
  return filtered.slice(0, currentPage.value * props.pageSize)
})

// 获取类型图标
const getTypeIcon = (type: NotificationType): Component => {
  const iconMap: Record<NotificationType, Component> = {
    info: InfoFilled,
    success: SuccessFilled,
    warning: WarningFilled,
    error: CircleCloseFilled,
    message: MessageBox,
    comment: ChatDotRound,
  }
  return iconMap[type] || InfoFilled
}

// 格式化时间
const formatTime = (time: string | Date): string => {
  const date = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 切换显示
const handleToggle = () => {
  drawerVisible.value = !drawerVisible.value
  if (drawerVisible.value) {
    emit('refresh')
  }
}

// 标签页切换
const handleTabChange = (tabName: string | number) => {
  currentPage.value = 1
  hasMore.value = true
}

// 通知点击
const handleNotificationClick = (notification: Notification) => {
  emit('click', notification)
  if (!notification.read) {
    emit('mark-read', notification)
  }
}

// 操作处理
const handleAction = (command: string, notification: Notification) => {
  switch (command) {
    case 'markRead':
      emit('mark-read', notification)
      break
    case 'markUnread':
      emit('mark-unread', notification)
      break
    case 'delete':
      emit('delete', notification)
      break
  }
}

// 全部标记已读
const handleMarkAllRead = async () => {
  try {
    await ElMessageBox.confirm('确定要将所有通知标记为已读吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })
    emit('mark-all-read')
    ElMessage.success('已全部标记为已读')
  } catch {
    // 用户取消
  }
}

// 清空全部
const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有通知吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    emit('clear-all')
    ElMessage.success('已清空所有通知')
  } catch {
    // 用户取消
  }
}

// 查看全部
const handleViewAll = () => {
  emit('view-all')
  drawerVisible.value = false
}

// 加载更多
const handleLoadMore = () => {
  currentPage.value++
  emit('load-more', activeTab.value)
}

// 自动刷新
let refreshTimer: number | null = null

if (props.autoRefresh) {
  refreshTimer = window.setInterval(() => {
    if (drawerVisible.value) {
      emit('refresh')
    }
  }, props.refreshInterval)
}

// 清理定时器
const _cleanup = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 暴露方法供父组件调用
defineExpose({
  open: () => { drawerVisible.value = true },
  close: () => { drawerVisible.value = false },
  refresh: () => emit('refresh'),
})
</script>

<script lang="ts">
export default {
  name: 'NotificationBell',
}
</script>

<style scoped lang="scss">
.notification-bell {
  display: inline-block;

  :deep(.el-badge) {
    .el-badge__content {
      border: 2px solid #fff;
    }
  }

  .tab-label {
    display: flex;
    align-items: center;
    gap: 8px;

    .tab-badge {
      :deep(.el-badge__content) {
        position: static;
        transform: none;
      }
    }
  }

  .notification-list {
    height: calc(100vh - 200px);
    overflow-y: auto;

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      &.is-unread {
        background-color: #ecf5ff;

        &:hover {
          background-color: #d9ecff;
        }
      }

      .item-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 20px;

        &.type-info {
          background-color: #e1f3ff;
          color: #409eff;
        }

        &.type-success {
          background-color: #e1f9e8;
          color: #67c23a;
        }

        &.type-warning {
          background-color: #fef0e6;
          color: #e6a23c;
        }

        &.type-error {
          background-color: #fde2e2;
          color: #f56c6c;
        }

        &.type-message {
          background-color: #f4f4f5;
          color: #909399;
        }

        &.type-comment {
          background-color: #f0f9ff;
          color: #67c23a;
        }
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .item-description {
          font-size: 13px;
          color: #606266;
          line-height: 1.5;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .item-actions {
        flex-shrink: 0;
      }
    }

    .load-more {
      text-align: center;
      padding: 16px;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
}
</style>
