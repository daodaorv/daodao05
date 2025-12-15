<template>
  <view class="error-boundary">
    <view v-if="hasError" class="error-container">
      <view class="error-icon">⚠️</view>
      <text class="error-title">页面加载失败</text>
      <text class="error-message">{{ errorMessage }}</text>
      <button class="retry-button" type="primary" @click="handleRetry">
        重新加载
      </button>
    </view>
    <slot v-else></slot>
  </view>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      errorMessage: ''
    }
  },
  // uni-app 不支持 errorCaptured，需要手动调用
  methods: {
    catchError(error) {
      this.hasError = true
      this.errorMessage = error.message || '未知错误'
      console.error('[ErrorBoundary] 捕获错误:', error)
      this.$emit('error', error)
    },
    handleRetry() {
      this.hasError = false
      this.errorMessage = ''
      this.$emit('retry')

      // 刷新页面
      setTimeout(() => {
        // 可以在这里重新加载数据
        this.$emit('reload')
      }, 100)
    }
  }
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
  min-height: 100vh;
}

.error-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.error-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.error-message {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
  margin-bottom: 40rpx;
  max-width: 500rpx;
}

.retry-button {
  min-width: 200rpx;
}
</style>
