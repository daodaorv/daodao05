<template>
  <view class="image-uploader">
    <!-- 图片列表 -->
    <view class="image-list">
      <view
        v-for="(image, index) in imageList"
        :key="index"
        class="image-item"
      >
        <image
          :src="image.url"
          mode="aspectFill"
          class="image"
          @click="handlePreview(index)"
        />

        <!-- 上传进度 -->
        <view v-if="image.uploading" class="upload-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: image.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ image.progress }}%</text>
        </view>

        <!-- 删除按钮 -->
        <view v-if="!image.uploading && !disabled" class="delete-btn" @click.stop="handleDelete(index)">
          <text class="delete-icon">×</text>
        </view>

        <!-- 上传失败标识 -->
        <view v-if="image.error" class="error-mask">
          <text class="error-text">上传失败</text>
          <text class="retry-btn" @click.stop="handleRetry(index)">重试</text>
        </view>
      </view>

      <!-- 添加按钮 -->
      <view
        v-if="imageList.length < maxCount && !disabled"
        class="add-btn"
        @click="handleChoose"
      >
        <text class="add-icon">+</text>
        <text class="add-text">{{ addText }}</text>
      </view>
    </view>

    <!-- 提示文字 -->
    <view v-if="tip" class="tip-text">{{ tip }}</view>
  </view>
</template>

<script>
import { chooseImage, uploadImage, previewImage } from '@/utils/upload'

// 常量配置
const MAX_IMAGE_COUNT = 9
const PROGRESS_INCREMENT = 10
const PROGRESS_INTERVAL = 100
const MOCK_UPLOAD_DELAY = 1000

export default {
  name: 'ImageUploader',

  props: {
    // 已上传的图片列表
    modelValue: {
      type: Array,
      default: () => []
    },
    // 最大上传数量
    maxCount: {
      type: Number,
      default: MAX_IMAGE_COUNT
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否压缩图片
    compress: {
      type: Boolean,
      default: true
    },
    // 上传地址
    uploadUrl: {
      type: String,
      default: '/api/v1/upload/image'
    },
    // 添加按钮文字
    addText: {
      type: String,
      default: '添加图片'
    },
    // 提示文字
    tip: {
      type: String,
      default: ''
    },
    // 是否使用Mock上传
    useMock: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:modelValue', 'change', 'upload-success', 'upload-error'],

  data() {
    return {
      imageList: []
    }
  },

  watch: {
    modelValue: {
      handler(val) {
        this.imageList = val.map(url => ({
          url,
          uploading: false,
          progress: 100,
          error: false
        }))
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 创建图片对象
    createImageObject(path) {
      return {
        url: path,
        uploading: true,
        progress: 0,
        error: false,
        tempPath: path
      }
    },

    // 处理选择图片错误
    handleChooseError(err) {
      if (err instanceof Error) {
        console.error('选择图片失败:', err.message)
      } else {
        console.error('选择图片失败:', String(err))
      }
      if (err && typeof err === 'object' && 'errMsg' in err) {
        const errMsg = (err as any).errMsg
        if (errMsg && !errMsg.includes('cancel')) {
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      }
    },

    // 选择图片
    async handleChoose() {
      try {
        const remainCount = this.maxCount - this.imageList.length

        const tempFilePaths = await chooseImage({
          count: remainCount,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })

        // 添加到列表并开始上传
        tempFilePaths.forEach(path => {
          const image = this.createImageObject(path)
          this.imageList.push(image)
          this.uploadImage(image)
        })
      } catch (err) {
        this.handleChooseError(err)
      }
    },

    // 执行上传
    async performUpload(image) {
      const progressCallback = (progress) => {
        image.progress = progress.progress
      }

      if (this.useMock) {
        return await this.mockUpload(image.tempPath, {
          onProgress: progressCallback
        })
      } else {
        return await uploadImage(image.tempPath, {
          url: this.uploadUrl,
          compress: this.compress,
          onProgress: progressCallback
        })
      }
    },

    // 处理上传成功
    handleUploadSuccess(image, result) {
      image.url = result.url
      image.uploading = false
      image.progress = 100
      image.error = false

      this.emitChange()
      this.$emit('upload-success', result)

      uni.showToast({
        title: '上传成功',
        icon: 'success'
      })
    },

    // 处理上传失败
    handleUploadError(image, err) {
      if (err instanceof Error) {
        console.error('上传图片失败:', err.message)
      } else {
        console.error('上传图片失败:', String(err))
      }

      image.uploading = false
      image.error = true

      this.$emit('upload-error', err)

      uni.showToast({
        title: '上传失败',
        icon: 'none'
      })
    },

    // 上传图片
    async uploadImage(image) {
      try {
        const result = await this.performUpload(image)
        this.handleUploadSuccess(image, result)
      } catch (err) {
        this.handleUploadError(image, err)
      }
    },

    // Mock上传
    mockUpload(filePath, options) {
      return new Promise((resolve) => {
        // 模拟上传进度
        let progress = 0
        const timer = setInterval(() => {
          progress += PROGRESS_INCREMENT
          if (options.onProgress) {
            options.onProgress({ progress })
          }
          if (progress >= 100) {
            clearInterval(timer)
          }
        }, PROGRESS_INTERVAL)

        // 模拟上传延迟
        setTimeout(() => {
          resolve({
            url: filePath, // 开发环境直接返回本地路径
            fileName: filePath.split('/').pop(),
            fileSize: Math.floor(Math.random() * 1000000)
          })
        }, MOCK_UPLOAD_DELAY)
      })
    },

    // 删除图片
    handleDelete(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.imageList.splice(index, 1)
            this.emitChange()
          }
        }
      })
    },

    // 重试上传
    handleRetry(index) {
      const image = this.imageList[index]
      image.uploading = true
      image.progress = 0
      image.error = false
      this.uploadImage(image)
    },

    // 预览图片
    handlePreview(index) {
      const urls = this.imageList
        .filter(img => !img.uploading && !img.error)
        .map(img => img.url)

      if (urls.length === 0) {
        return
      }

      previewImage({
        urls,
        current: index
      })
    },

    // 触发change事件
    emitChange() {
      const urls = this.imageList
        .filter(img => !img.uploading && !img.error)
        .map(img => img.url)

      this.$emit('update:modelValue', urls)
      this.$emit('change', urls)
    }
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 10rpx;
}

.progress-bar {
  height: 6rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.progress-fill {
  height: 100%;
  background: #3cc51f;
  transition: width 0.3s;
}

.progress-text {
  font-size: 20rpx;
  color: #fff;
  text-align: center;
  display: block;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: #fff;
  font-size: 32rpx;
  line-height: 1;
}

.error-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.error-text {
  font-size: 24rpx;
  color: #fff;
}

.retry-btn {
  font-size: 24rpx;
  color: #3cc51f;
  padding: 8rpx 20rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.add-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: #fafafa;
}

.add-icon {
  font-size: 60rpx;
  color: #999;
  line-height: 1;
}

.add-text {
  font-size: 24rpx;
  color: #999;
}

.tip-text {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}
</style>
