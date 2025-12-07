<template>
  <view class="ticket-detail-container">
    <view v-if="loading" class="loading-wrapper">
      <LoadingSpinner text="加载中..." />
    </view>

    <view v-else-if="ticket" class="ticket-content">
      <!-- 工单基本信息 -->
      <view class="ticket-header">
        <view class="header-row">
          <text class="ticket-number">#{{ ticket.ticketNo }}</text>
          <u-tag
            :text="getStatusText(ticket.status)"
            :type="getStatusType(ticket.status)"
            size="small"
          />
        </view>
        <view class="ticket-title">{{ ticket.title }}</view>
        <view class="ticket-meta">
          <view class="meta-item">
            <text class="meta-label">优先级：</text>
            <u-tag
              :text="getPriorityText(ticket.priority)"
              :type="getPriorityType(ticket.priority)"
              size="mini"
              plain
            />
          </view>
          <view class="meta-item">
            <text class="meta-label">创建人：</text>
            <text class="meta-value">{{ ticket.creatorName }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">创建时间：</text>
            <text class="meta-value">{{ formatTime(ticket.createTime) }}</text>
          </view>
          <view v-if="ticket.assigneeName" class="meta-item">
            <text class="meta-label">处理人：</text>
            <text class="meta-value">{{ ticket.assigneeName }}</text>
          </view>
        </view>
      </view>

      <!-- 工单描述 -->
      <view class="ticket-section">
        <view class="section-title">问题描述</view>
        <view class="section-content">
          <text class="description-text">{{ ticket.description }}</text>
        </view>
        <!-- 附件图片 -->
        <view v-if="ticket.attachments && ticket.attachments.length > 0" class="attachments">
          <view class="attachment-title">附件</view>
          <view class="attachment-grid">
            <image
              v-for="(img, index) in ticket.attachments"
              :key="index"
              :src="img"
              mode="aspectFill"
              class="attachment-image"
              @click="previewImage(index)"
            />
          </view>
        </view>
      </view>

      <!-- 处理记录时间线 -->
      <view class="ticket-section">
        <view class="section-title">处理记录</view>
        <view class="timeline">
          <view
            v-for="(record, index) in ticket.records"
            :key="record.id"
            class="timeline-item"
          >
            <view class="timeline-dot" :class="{ active: index === 0 }"></view>
            <view class="timeline-content">
              <view class="record-header">
                <text class="record-user">{{ record.userName }}</text>
                <text class="record-time">{{ formatTime(record.createTime) }}</text>
              </view>
              <view class="record-action">
                <u-tag
                  :text="getActionText(record.action)"
                  :type="getActionType(record.action)"
                  size="mini"
                />
              </view>
              <view v-if="record.content" class="record-content">
                {{ record.content }}
              </view>
              <!-- 回复图片 -->
              <view v-if="record.images && record.images.length > 0" class="record-images">
                <image
                  v-for="(img, imgIndex) in record.images"
                  :key="imgIndex"
                  :src="img"
                  mode="aspectFill"
                  class="record-image"
                  @click="previewRecordImage(record.images, imgIndex)"
                />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 回复区域 -->
      <view v-if="ticket.status !== 'closed' && ticket.status !== 'completed'" class="reply-section">
        <view class="section-title">添加回复</view>
        <u-textarea
          v-model="replyContent"
          placeholder="请输入回复内容..."
          :maxlength="500"
          count
          :autoHeight="true"
        />
        <view class="reply-images">
          <view
            v-for="(img, index) in replyImages"
            :key="index"
            class="reply-image-item"
          >
            <image :src="img" mode="aspectFill" class="reply-image" />
            <view class="image-delete" @click="deleteReplyImage(index)">
              <u-icon name="close" size="16" color="#fff"></u-icon>
            </view>
          </view>
          <view v-if="replyImages.length < 4" class="upload-button" @click="chooseImage">
            <u-icon name="camera-fill" size="32" color="#999"></u-icon>
            <text class="upload-text">添加图片</text>
          </view>
        </view>
        <u-button
          type="primary"
          :disabled="!replyContent.trim() || submitting"
          :loading="submitting"
          @click="submitReply"
        >
          提交回复
        </u-button>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button
          v-if="ticket.status === 'pending'"
          type="primary"
          @click="acceptTicket"
        >
          接受工单
        </u-button>
        <u-button
          v-if="ticket.status === 'processing'"
          type="success"
          @click="completeTicket"
        >
          完成工单
        </u-button>
        <u-button
          v-if="ticket.status !== 'closed'"
          type="error"
          plain
          @click="closeTicket"
        >
          关闭工单
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getTicketDetail, updateTicketStatus, addTicketReply } from '@/api/ticket'
import { formatDateTime } from '@/utils/format'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    LoadingSpinner
  },

  data() {
    return {
      ticketId: '',
      ticket: null,
      loading: false,
      replyContent: '',
      replyImages: [],
      submitting: false
    }
  },

  onLoad(options) {
    if (options.id) {
      this.ticketId = options.id
      this.loadTicketDetail()
    }
  },

  methods: {
    formatTime(time) {
      return formatDateTime(time)
    },

    async loadTicketDetail() {
      this.loading = true
      try {
        const data = await getTicketDetail(this.ticketId)
        this.ticket = data
      } catch (error) {
        console.error('加载工单详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async acceptTicket() {
      try {
        await updateTicketStatus(this.ticketId, 'processing')
        uni.showToast({
          title: '已接受工单',
          icon: 'success'
        })
        this.loadTicketDetail()
      } catch (error) {
        console.error('接受工单失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    async completeTicket() {
      uni.showModal({
        title: '确认完成',
        content: '确认完成此工单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await updateTicketStatus(this.ticketId, 'completed')
              uni.showToast({
                title: '工单已完成',
                icon: 'success'
              })
              this.loadTicketDetail()
            } catch (error) {
              console.error('完成工单失败:', error)
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    async closeTicket() {
      uni.showModal({
        title: '确认关闭',
        content: '确认关闭此工单吗？关闭后将无法继续处理。',
        success: async (res) => {
          if (res.confirm) {
            try {
              await updateTicketStatus(this.ticketId, 'closed')
              uni.showToast({
                title: '工单已关闭',
                icon: 'success'
              })
              this.loadTicketDetail()
            } catch (error) {
              console.error('关闭工单失败:', error)
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    chooseImage() {
      uni.chooseImage({
        count: 4 - this.replyImages.length,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.replyImages = [...this.replyImages, ...res.tempFilePaths]
        }
      })
    },

    deleteReplyImage(index) {
      this.replyImages.splice(index, 1)
    },

    async submitReply() {
      if (!this.replyContent.trim()) {
        uni.showToast({
          title: '请输入回复内容',
          icon: 'none'
        })
        return
      }

      this.submitting = true
      try {
        await addTicketReply(this.ticketId, {
          content: this.replyContent,
          images: this.replyImages
        })
        uni.showToast({
          title: '回复成功',
          icon: 'success'
        })
        this.replyContent = ''
        this.replyImages = []
        this.loadTicketDetail()
      } catch (error) {
        console.error('提交回复失败:', error)
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    },

    previewImage(index) {
      uni.previewImage({
        urls: this.ticket.attachments,
        current: index
      })
    },

    previewRecordImage(images, index) {
      uni.previewImage({
        urls: images,
        current: index
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
    },

    getActionText(action) {
      const actionMap = {
        create: '创建工单',
        accept: '接受工单',
        reply: '添加回复',
        complete: '完成工单',
        close: '关闭工单',
        reopen: '重新打开'
      }
      return actionMap[action] || action
    },

    getActionType(action) {
      const typeMap = {
        create: 'primary',
        accept: 'success',
        reply: 'info',
        complete: 'success',
        close: 'warning',
        reopen: 'primary'
      }
      return typeMap[action] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.loading-wrapper {
  padding: 200rpx 0;
}

.ticket-content {
  padding: 20rpx;
}

.ticket-header {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.ticket-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #666;
}

.ticket-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 24rpx;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.meta-label {
  color: #999;
  margin-right: 12rpx;
}

.meta-value {
  color: #666;
}

.ticket-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.section-content {
  margin-bottom: 20rpx;
}

.description-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.attachments {
  margin-top: 24rpx;
}

.attachment-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.attachment-image {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
}

.timeline {
  position: relative;
  padding-left: 40rpx;
}

.timeline-item {
  position: relative;
  padding-bottom: 40rpx;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -32rpx;
  top: 16rpx;
  bottom: -24rpx;
  width: 2rpx;
  background: #e0e0e0;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: -40rpx;
  top: 8rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #e0e0e0;
  border: 4rpx solid #fff;
  box-shadow: 0 0 0 2rpx #e0e0e0;
}

.timeline-dot.active {
  background: #3cc51f;
  box-shadow: 0 0 0 2rpx #3cc51f;
}

.timeline-content {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.record-user {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-action {
  margin-bottom: 12rpx;
}

.record-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-top: 12rpx;
}

.record-images {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}

.record-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
}

.reply-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.reply-images {
  display: flex;
  gap: 16rpx;
  margin: 20rpx 0;
  flex-wrap: wrap;
}

.reply-image-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
}

.reply-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.image-delete {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx;
}
</style>
