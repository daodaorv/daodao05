<template>
  <view class="chat-container">
    <!-- 聊天消息列表 -->
    <scroll-view
      scroll-y
      class="message-list"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @scrolltoupper="loadMoreMessages"
    >
      <!-- 加载更多提示 -->
      <view v-if="hasMore" class="load-more">
        <u-loading-icon v-if="loadingMore" mode="circle" />
        <text v-else class="load-more-text">下拉加载更多</text>
      </view>

      <!-- 日期分组 -->
      <view v-for="group in messageGroups" :key="group.date" class="message-group">
        <view class="date-divider">
          <text class="date-text">{{ group.date }}</text>
        </view>

        <!-- 消息列表 -->
        <view
          v-for="message in group.messages"
          :key="message.id"
          :id="`msg-${message.id}`"
          class="message-item"
          :class="{ 'message-self': message.isSelf }"
        >
          <!-- 对方消息 -->
          <view v-if="!message.isSelf" class="message-wrapper">
            <image :src="message.avatar" class="avatar" mode="aspectFill" />
            <view class="message-content-wrapper">
              <view class="sender-name">{{ message.senderName }}</view>
              <view class="message-bubble">
                <text v-if="message.type === 'text'" class="message-text">{{ message.content }}</text>
                <image
                  v-if="message.type === 'image'"
                  :src="message.content"
                  mode="aspectFill"
                  class="message-image"
                  @click="previewImage(message.content)"
                />
              </view>
              <view class="message-time">{{ formatTime(message.createTime) }}</view>
            </view>
          </view>

          <!-- 自己的消息 -->
          <view v-else class="message-wrapper">
            <view class="message-content-wrapper">
              <view class="message-bubble self">
                <text v-if="message.type === 'text'" class="message-text">{{ message.content }}</text>
                <image
                  v-if="message.type === 'image'"
                  :src="message.content"
                  mode="aspectFill"
                  class="message-image"
                  @click="previewImage(message.content)"
                />
                <!-- 发送状态 -->
                <view v-if="message.status === 'sending'" class="message-status">
                  <u-loading-icon mode="circle" size="16" />
                </view>
                <view v-if="message.status === 'failed'" class="message-status">
                  <u-icon name="error-circle" size="16" color="#f56c6c" @click="resendMessage(message)" />
                </view>
              </view>
              <view class="message-time">{{ formatTime(message.createTime) }}</view>
            </view>
            <image :src="message.avatar" class="avatar" mode="aspectFill" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入框 -->
    <view class="input-bar">
      <view class="input-wrapper">
        <u-icon name="photo" size="28" color="#666" @click="chooseImage" />
        <input
          v-model="inputText"
          class="message-input"
          placeholder="输入消息..."
          confirm-type="send"
          @confirm="sendMessage"
        />
        <u-button
          type="primary"
          size="small"
          :disabled="!inputText.trim() && !selectedImage"
          @click="sendMessage"
        >
          发送
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getChatMessages, sendChatMessage } from '@/api/chat'
import { formatTime as formatTimeUtil } from '@/utils/format'

export default {
  data() {
    return {
      conversationId: '',
      messages: [],
      messageGroups: [],
      inputText: '',
      selectedImage: null,
      scrollTop: 0,
      scrollIntoView: '',
      hasMore: true,
      loadingMore: false,
      page: 1,
      pageSize: 20
    }
  },

  onLoad(options) {
    if (options.conversationId) {
      this.conversationId = options.conversationId
      this.loadMessages()
    }
  },

  methods: {
    formatTime(time) {
      return formatTimeUtil(time, 'HH:mm')
    },

    async loadMessages() {
      try {
        const data = await getChatMessages({
          conversationId: this.conversationId,
          page: this.page,
          pageSize: this.pageSize
        })

        this.messages = [...data.list.reverse(), ...this.messages]
        this.hasMore = data.hasMore
        this.groupMessages()
        this.scrollToBottom()
      } catch (error) {
        console.error('加载消息失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    async loadMoreMessages() {
      if (this.loadingMore || !this.hasMore) {
        return
      }

      this.loadingMore = true
      this.page++
      try {
        await this.loadMessages()
      } finally {
        this.loadingMore = false
      }
    },

    groupMessages() {
      const groups = {}

      this.messages.forEach(message => {
        const date = this.formatDate(message.createTime)
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(message)
      })

      this.messageGroups = Object.keys(groups).map(date => ({
        date,
        messages: groups[date]
      }))
    },

    formatDate(time) {
      const date = new Date(time)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) {
        return '今天'
      } else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天'
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`
      }
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.selectedImage = res.tempFilePaths[0]
          this.sendMessage()
        }
      })
    },

    async sendMessage() {
      const content = this.inputText.trim()
      const image = this.selectedImage

      if (!content && !image) {
        return
      }

      // 创建临时消息
      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversationId: this.conversationId,
        type: image ? 'image' : 'text',
        content: image || content,
        isSelf: true,
        status: 'sending',
        createTime: new Date().toISOString(),
        avatar: '/static/avatar-default.png',
        senderName: '我'
      }

      this.messages.push(tempMessage)
      this.groupMessages()
      this.scrollToBottom()

      // 清空输入
      this.inputText = ''
      this.selectedImage = null

      try {
        const result = await sendChatMessage({
          conversationId: this.conversationId,
          type: tempMessage.type,
          content: tempMessage.content
        })

        // 更新消息状态
        const index = this.messages.findIndex(m => m.id === tempMessage.id)
        if (index !== -1) {
          this.messages[index] = {
            ...result,
            isSelf: true
          }
          this.groupMessages()
        }
      } catch (error) {
        console.error('发送消息失败:', error)
        // 标记为发送失败
        const index = this.messages.findIndex(m => m.id === tempMessage.id)
        if (index !== -1) {
          this.messages[index].status = 'failed'
          this.groupMessages()
        }
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    },

    async resendMessage(message) {
      message.status = 'sending'
      this.groupMessages()

      try {
        const result = await sendChatMessage({
          conversationId: this.conversationId,
          type: message.type,
          content: message.content
        })

        const index = this.messages.findIndex(m => m.id === message.id)
        if (index !== -1) {
          this.messages[index] = {
            ...result,
            isSelf: true
          }
          this.groupMessages()
        }
      } catch (error) {
        console.error('重发消息失败:', error)
        message.status = 'failed'
        this.groupMessages()
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    },

    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      })
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.messages.length > 0) {
          const lastMessage = this.messages[this.messages.length - 1]
          this.scrollIntoView = `msg-${lastMessage.id}`
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.load-more {
  text-align: center;
  padding: 20rpx 0;
}

.load-more-text {
  font-size: 24rpx;
  color: #999;
}

.message-group {
  margin-bottom: 40rpx;
}

.date-divider {
  text-align: center;
  margin: 20rpx 0;
}

.date-text {
  font-size: 24rpx;
  color: #999;
  background: rgba(0, 0, 0, 0.05);
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
}

.message-item {
  margin-bottom: 24rpx;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.message-item.message-self .message-wrapper {
  flex-direction: row-reverse;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-content-wrapper {
  max-width: 500rpx;
  display: flex;
  flex-direction: column;
}

.message-item.message-self .message-content-wrapper {
  align-items: flex-end;
}

.sender-name {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.message-bubble {
  background: #fff;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.message-bubble.self {
  background: #95ec69;
}

.message-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  word-break: break-all;
}

.message-image {
  max-width: 400rpx;
  max-height: 400rpx;
  border-radius: 12rpx;
}

.message-status {
  flex-shrink: 0;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.input-bar {
  background: #fff;
  padding: 20rpx;
  border-top: 1px solid #eee;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.message-input {
  flex: 1;
  background: #f5f5f5;
  padding: 16rpx 24rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>
