<template>
  <view class="ticket-create-container">
    <view class="form-section">
      <view class="form-item">
        <view class="form-label required">工单标题</view>
        <u-input
          v-model="form.title"
          placeholder="请输入工单标题"
          border="surround"
          :maxlength="50"
        />
      </view>

      <view class="form-item">
        <view class="form-label required">工单类型</view>
        <u-radio-group v-model="form.type" placement="row">
          <u-radio
            v-for="item in typeOptions"
            :key="item.value"
            :name="item.value"
            :label="item.label"
          />
        </u-radio-group>
      </view>

      <view class="form-item">
        <view class="form-label required">优先级</view>
        <u-radio-group v-model="form.priority" placement="row">
          <u-radio
            v-for="item in priorityOptions"
            :key="item.value"
            :name="item.value"
            :label="item.label"
          />
        </u-radio-group>
      </view>

      <view class="form-item">
        <view class="form-label required">问题描述</view>
        <u-textarea
          v-model="form.description"
          placeholder="请详细描述遇到的问题..."
          :maxlength="500"
          count
          :autoHeight="true"
        />
      </view>

      <view class="form-item">
        <view class="form-label">附件图片</view>
        <view class="image-upload">
          <view
            v-for="(img, index) in form.images"
            :key="index"
            class="image-item"
          >
            <image :src="img" mode="aspectFill" class="preview-image" />
            <view class="image-delete" @click="deleteImage(index)">
              <u-icon name="close" size="16" color="#fff"></u-icon>
            </view>
          </view>
          <view v-if="form.images.length < 4" class="upload-button" @click="chooseImage">
            <u-icon name="camera-fill" size="40" color="#999"></u-icon>
            <text class="upload-text">添加图片</text>
            <text class="upload-hint">最多4张</text>
          </view>
        </view>
      </view>

      <view class="form-tips">
        <text class="tips-icon">💡</text>
        <text class="tips-text">请详细描述问题，以便我们更快地为您解决</text>
      </view>
    </view>

    <view class="action-buttons">
      <u-button type="info" plain @click="handleCancel">取消</u-button>
      <u-button
        type="primary"
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleSubmit"
      >
        提交工单
      </u-button>
    </view>
  </view>
</template>

<script>
import { createTicket } from '@/api/ticket'

export default {
  data() {
    return {
      form: {
        title: '',
        type: 'technical',
        priority: 'normal',
        description: '',
        images: []
      },
      typeOptions: [
        { label: '技术问题', value: 'technical' },
        { label: '业务咨询', value: 'business' },
        { label: '功能建议', value: 'feature' },
        { label: '其他', value: 'other' }
      ],
      priorityOptions: [
        { label: '低', value: 'low' },
        { label: '普通', value: 'normal' },
        { label: '高', value: 'high' },
        { label: '紧急', value: 'urgent' }
      ],
      submitting: false
    }
  },

  computed: {
    canSubmit() {
      return (
        this.form.title.trim() &&
        this.form.description.trim() &&
        !this.submitting
      )
    }
  },

  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 4 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.form.images = [...this.form.images, ...res.tempFilePaths]
        }
      })
    },

    deleteImage(index) {
      this.form.images.splice(index, 1)
    },

    handleCancel() {
      if (this.form.title || this.form.description || this.form.images.length > 0) {
        uni.showModal({
          title: '确认取消',
          content: '确定要取消创建工单吗？已填写的内容将丢失。',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack()
            }
          }
        })
      } else {
        uni.navigateBack()
      }
    },

    async handleSubmit() {
      if (!this.canSubmit) {
        return
      }

      // 表单验证
      if (!this.form.title.trim()) {
        uni.showToast({
          title: '请输入工单标题',
          icon: 'none'
        })
        return
      }

      if (!this.form.description.trim()) {
        uni.showToast({
          title: '请输入问题描述',
          icon: 'none'
        })
        return
      }

      this.submitting = true
      try {
        await createTicket({
          title: this.form.title.trim(),
          type: this.form.type,
          priority: this.form.priority,
          description: this.form.description.trim(),
          images: this.form.images
        })

        uni.showToast({
          title: '工单创建成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        console.error('创建工单失败:', error)
        uni.showToast({
          title: error.message || '创建失败，请重试',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-create-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.form-label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 8rpx;
  font-size: 32rpx;
}

.image-upload {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.image-delete {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #666;
}

.upload-hint {
  font-size: 22rpx;
  color: #999;
}

.form-tips {
  margin-top: 32rpx;
  padding: 24rpx;
  background: #f0f9ff;
  border-radius: 12rpx;
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.tips-icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.tips-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 20rpx;
}
</style>
