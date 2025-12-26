<template>
  <view class="text-expandable">
    <!-- 折叠状态：显示3行 -->
    <view v-if="!isExpanded" class="collapsed-content" @tap="showFullContent">
      <view class="text-wrapper">
        <slot name="collapsed">
          <text class="text-content">{{ content }}</text>
        </slot>
      </view>
      <view class="expand-btn">
        <text class="expand-text">点击查看全文</text>
        <u-icon name="arrow-down" size="12" color="#FF9F29"></u-icon>
      </view>
    </view>

    <!-- 全文弹窗 -->
    <u-popup
      v-model:show="isExpanded"
      mode="center"
      :round="20"
      :closeable="true"
      :closeOnClickOverlay="true"
      @close="isExpanded = false"
    >
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ title }}</text>
        </view>
        <scroll-view class="popup-body" scroll-y>
          <slot name="full">
            <text class="full-text">{{ content }}</text>
          </slot>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  content?: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  title: '详细内容'
});

const isExpanded = ref(false);

const showFullContent = () => {
  isExpanded.value = true;
};
</script>

<style scoped lang="scss">
.text-expandable {
  width: 100%;
}

.collapsed-content {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.8;
  }
}

.text-wrapper {
  max-height: 132rpx; // 3行高度 (44rpx * 3)
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 44rpx;
    background: linear-gradient(to bottom, transparent, #fff);
  }
}

.text-content {
  font-size: 28rpx;
  color: $uni-text-color-secondary;
  line-height: 1.6;
  display: block;
  word-break: break-all;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: $uni-spacing-md;
  padding: $uni-spacing-sm 0;

  .expand-text {
    font-size: 26rpx;
    color: $uni-color-primary;
  }
}

// 弹窗样式
.popup-content {
  width: 90vw;
  max-width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20rpx;
  box-sizing: border-box;
}

.popup-header {
  padding: $uni-spacing-xl;
  border-bottom: 2rpx solid $uni-border-color-light;

  .popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }
}

.popup-body {
  flex: 1;
  padding: $uni-spacing-xl;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;

  .full-text {
    font-size: 28rpx;
    color: $uni-text-color-secondary;
    line-height: 1.8;
    display: block;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
  }
}
</style>
