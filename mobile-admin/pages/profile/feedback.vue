<template>
  <view class="feedback-container">
    <!-- 反馈类型 -->
    <view class="form-section">
      <view class="section-title">反馈类型</view>
      <view class="type-list">
        <view
          class="type-item"
          :class="{ active: form.type === type.value }"
          v-for="type in feedbackTypes"
          :key="type.value"
          @click="selectType(type.value)"
        >
          <text class="type-icon">{{ type.icon }}</text>
          <text class="type-name">{{ type.name }}</text>
        </view>
      </view>
    </view>

    <!-- 反馈内容 -->
    <view class="form-section">
      <view class="section-title">反馈内容</view>
      <view class="form-card">
        <textarea
          class="feedback-textarea"
          v-model="form.content"
          placeholder="请详细描述您遇到的问题或建议，我们会认真对待每一条反馈"
          :maxlength="500"
          :show-confirm-bar="false"
        ></textarea>
        <view class="textarea-counter">{{ form.content.length }}/500</view>
      </view>
    </view>

    <!-- 上传图片 -->
    <view class="form-section">
      <view class="section-title">上传图片（可选）</view>
      <view class="form-card">
        <view class="image-upload">
          <view
            class="image-item"
            v-for="(image, index) in form.images"
            :key="index"
          >
            <image :src="image" mode="aspectFill" class="image-preview" @click="previewImage(index)"></image>
            <view class="image-delete" @click="deleteImage(index)">✕</view>
          </view>
          <view class="image-add" v-if="form.images.length < 4" @click="chooseImage">
            <text class="add-icon">+</text>
            <text class="add-text">添加图片</text>
          </view>
        </view>
        <view class="upload-tip">最多上传4张图片，每张不超过5MB</view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="form-section">
      <view class="section-title">联系方式（可选）</view>
      <view class="form-card">
        <view class="input-item">
          <text class="input-label">手机号</text>
          <input
            class="input-field"
            v-model="form.phone"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        <view class="input-item">
          <text class="input-label">邮箱</text>
          <input
            class="input-field"
            v-model="form.email"
            type="text"
            placeholder="请输入邮箱地址"
          />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-button" @click="submitFeedback" :disabled="!canSubmit">提交反馈</button>
    </view>

    <!-- 历史反馈 -->
    <view class="history-section">
      <view class="history-header">
        <text class="history-title">我的反馈</text>
        <text class="history-count">共{{ feedbackHistory.length }}条</text>
      </view>
      <view class="history-list" v-if="feedbackHistory.length > 0">
        <view
          class="history-item"
          v-for="item in feedbackHistory"
          :key="item.id"
          @click="viewFeedbackDetail(item)"
        >
          <view class="history-header-row">
            <text class="history-type">{{ getTypeName(item.type) }}</text>
            <text class="history-status" :class="'status-' + item.status">{{ getStatusText(item.status) }}</text>
          </view>
          <text class="history-content">{{ item.content }}</text>
          <view class="history-footer">
            <text class="history-time">{{ item.createTime }}</text>
            <text class="history-arrow">›</text>
          </view>
        </view>
      </view>
      <view class="history-empty" v-else>
        <text class="empty-text">暂无反馈记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { submitFeedback, getFeedbackHistory } from '@/api/help'
import { uploadImage } from '@/api/upload'

export default {
  data() {
    return {
      form: {
        type: 'bug',
        content: '',
        images: [],
        phone: '',
        email: ''
      },
      feedbackTypes: [
        { value: 'bug', name: '功能异常', icon: '🐛' },
        { value: 'suggestion', name: '功能建议', icon: '💡' },
        { value: 'complaint', name: '投诉建议', icon: '📢' },
        { value: 'other', name: '其他问题', icon: '💬' }
      ],
      feedbackHistory: []
    }
  },

  computed: {
    canSubmit() {
      return this.form.type && this.form.content.trim().length >= 10
    }
  },

  onLoad() {
    this.loadFeedbackHistory()
  },

  methods: {
    selectType(type) {
      this.form.type = type
    },

    chooseImage() {
      uni.chooseImage({
        count: 4 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          this.uploadImages(tempFilePaths)
        }
      })
    },

    async uploadImages(filePaths) {
      uni.showLoading({ title: '上传中...' })

      try {
        for (const filePath of filePaths) {
          const res = await uploadImage({ filePath })
          if (res.code === 200) {
            this.form.images.push(res.data.url)
          }
        }
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    },

    previewImage(index) {
      uni.previewImage({
        urls: this.form.images,
        current: index
      })
    },

    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.form.images.splice(index, 1)
          }
        }
      })
    },

    async submitFeedback() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      // 验证手机号格式（如果填写了）
      if (this.form.phone && !/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }

      // 验证邮箱格式（如果填写了）
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        uni.showToast({
          title: '邮箱格式不正确',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '提交中...' })

        const res = await submitFeedback({
          type: this.form.type,
          content: this.form.content,
          images: this.form.images,
          phone: this.form.phone,
          email: this.form.email
        })

        uni.hideLoading()

        if (res.code === 200) {
          uni.showToast({
            title: '提交成功',
            icon: 'success'
          })

          // 重置表单
          this.form = {
            type: 'bug',
            content: '',
            images: [],
            phone: '',
            email: ''
          }

          // 刷新历史记录
          this.loadFeedbackHistory()
        } else {
          uni.showToast({
            title: res.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    },

    async loadFeedbackHistory() {
      try {
        const res = await getFeedbackHistory()
        if (res.code === 200) {
          this.feedbackHistory = res.data.list
        }
      } catch (error) {
        console.error('加载反馈历史失败:', error)
      }
    },

    viewFeedbackDetail(item) {
      uni.navigateTo({
        url: `/pages/profile/feedback-detail?id=${item.id}`
      })
    },

    getTypeName(type) {
      const typeObj = this.feedbackTypes.find(t => t.value === type)
      return typeObj ? typeObj.name : '其他问题'
    },

    getStatusText(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        closed: '已关闭'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.feedback-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 表单区块 */
.form-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.form-card {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
}

/* 反馈类型 */
.type-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 0 20rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 30rpx 20rpx;
  background: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e5e5e5;
}

.type-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.type-icon {
  font-size: 48rpx;
}

.type-name {
  font-size: 24rpx;
  color: #666;
}

.type-item.active .type-name {
  color: #667eea;
  font-weight: 500;
}

/* 反馈内容 */
.feedback-textarea {
  width: 100%;
  min-height: 300rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.textarea-counter {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 图片上传 */
.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.image-delete {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: #f56c6c;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.image-add {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #ccc;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.add-icon {
  font-size: 48rpx;
  color: #999;
}

.add-text {
  font-size: 24rpx;
  color: #999;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 联系方式 */
.input-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.input-item:last-child {
  border-bottom: none;
}

.input-label {
  width: 120rpx;
  font-size: 28rpx;
  color: #333;
}

.input-field {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* 提交按钮 */
.submit-section {
  padding: 40rpx 20rpx;
}

.submit-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-button::after {
  border: none;
}

.submit-button[disabled] {
  opacity: 0.5;
}

/* 历史反馈 */
.history-section {
  margin-top: 20rpx;
  padding: 0 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 10rpx 20rpx;
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
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.history-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.history-type {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.history-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.status-pending {
  background: #fff3e0;
  color: #e6a23c;
}

.status-processing {
  background: #e3f2fd;
  color: #409eff;
}

.status-completed {
  background: #e8f5e9;
  color: #67c23a;
}

.status-closed {
  background: #f5f5f5;
  color: #999;
}

.history-content {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.history-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-time {
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
