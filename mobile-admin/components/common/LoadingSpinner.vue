<template>
  <view class="loading-spinner" :class="{ fullscreen: fullscreen }">
    <view class="spinner-container">
      <u-loading-icon
        :size="size"
        :color="color"
        mode="circle"
      ></u-loading-icon>
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    // 是否全屏显示
    fullscreen: {
      type: Boolean,
      default: false
    },
    // 加载提示文字
    text: {
      type: String,
      default: '加载中...'
    },
    // 尺寸大小（rpx）
    size: {
      type: Number,
      default: 60
    },
    // 颜色
    color: {
      type: String,
      default: '#3cc51f'
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
</style>
