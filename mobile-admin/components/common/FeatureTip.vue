<template>
  <view v-if="visible" class="feature-tip-container">
    <!-- 提示气泡 -->
    <view class="tip-bubble" :style="bubbleStyle">
      <!-- 箭头 -->
      <view class="tip-arrow" :class="'arrow-' + arrowPosition"></view>

      <!-- 内容 -->
      <view class="tip-content">
        <!-- 图标 -->
        <text v-if="icon" class="tip-icon">{{ icon }}</text>

        <!-- 文字 -->
        <view class="tip-text">
          <text class="tip-title">{{ title }}</text>
          <text v-if="description" class="tip-description">{{ description }}</text>
        </view>

        <!-- 关闭按钮 -->
        <text v-if="closable" class="tip-close" @tap="handleClose">✕</text>
      </view>

      <!-- 操作按钮 -->
      <view v-if="showAction" class="tip-action">
        <button class="action-button" @tap="handleAction">
          {{ actionText }}
        </button>
      </view>
    </view>

    <!-- 遮罩(可选) -->
    <view v-if="showMask" class="tip-mask" @tap="handleMaskClick"></view>
  </view>
</template>

<script>
export default {
  name: 'FeatureTip',

  props: {
    // 标题
    title: {
      type: String,
      required: true
    },
    // 描述
    description: {
      type: String,
      default: ''
    },
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 目标元素选择器
    target: {
      type: String,
      required: true
    },
    // 提示位置 'top' | 'bottom' | 'left' | 'right'
    position: {
      type: String,
      default: 'bottom'
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      default: true
    },
    // 是否显示遮罩
    showMask: {
      type: Boolean,
      default: false
    },
    // 是否显示操作按钮
    showAction: {
      type: Boolean,
      default: false
    },
    // 操作按钮文字
    actionText: {
      type: String,
      default: '知道了'
    },
    // 自动关闭时间(毫秒,0表示不自动关闭)
    autoClose: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      visible: false,
      targetRect: null,
      timer: null
    }
  },

  computed: {
    bubbleStyle() {
      if (!this.targetRect) return {}

      const margin = 10
      let style = {}

      switch (this.position) {
        case 'top':
          style = {
            left: (this.targetRect.left + this.targetRect.width / 2) + 'px',
            bottom: `calc(100vh - ${this.targetRect.top - margin}px)`,
            transform: 'translateX(-50%)'
          }
          break
        case 'bottom':
          style = {
            left: (this.targetRect.left + this.targetRect.width / 2) + 'px',
            top: (this.targetRect.bottom + margin) + 'px',
            transform: 'translateX(-50%)'
          }
          break
        case 'left':
          style = {
            right: `calc(100vw - ${this.targetRect.left - margin}px)`,
            top: (this.targetRect.top + this.targetRect.height / 2) + 'px',
            transform: 'translateY(-50%)'
          }
          break
        case 'right':
          style = {
            left: (this.targetRect.right + margin) + 'px',
            top: (this.targetRect.top + this.targetRect.height / 2) + 'px',
            transform: 'translateY(-50%)'
          }
          break
      }

      return style
    },

    arrowPosition() {
      const arrowMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }
      return arrowMap[this.position]
    }
  },

  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    async show() {
      await this.updateTargetRect()
      this.visible = true

      // 自动关闭
      if (this.autoClose > 0) {
        this.timer = setTimeout(() => {
          this.hide()
        }, this.autoClose)
      }

      this.$emit('show')
    },

    hide() {
      this.visible = false
      this.clearTimer()
      this.$emit('hide')
    },

    async updateTargetRect() {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this)
        query.select(this.target).boundingClientRect(data => {
          if (data) {
            this.targetRect = data
          }
          resolve()
        }).exec()
      })
    },

    handleClose() {
      this.hide()
      this.$emit('close')
    },

    handleAction() {
      this.$emit('action')
      this.hide()
    },

    handleMaskClick() {
      if (this.closable) {
        this.hide()
      }
    },

    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style scoped>
.feature-tip-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

/* 遮罩 */
.tip-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}

/* 提示气泡 */
.tip-bubble {
  position: absolute;
  max-width: 600rpx;
  background-color: #667eea;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  animation: tipFadeIn 0.3s ease;
}

@keyframes tipFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 箭头 */
.tip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 16rpx solid transparent;
}

.tip-arrow.arrow-top {
  top: -32rpx;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #667eea;
}

.tip-arrow.arrow-bottom {
  bottom: -32rpx;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #667eea;
}

.tip-arrow.arrow-left {
  left: -32rpx;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #667eea;
}

.tip-arrow.arrow-right {
  right: -32rpx;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #667eea;
}

/* 内容 */
.tip-content {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.tip-icon {
  font-size: 40rpx;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.tip-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.tip-description {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.tip-close {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
  padding: 0 8rpx;
  flex-shrink: 0;
}

/* 操作按钮 */
.tip-action {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.action-button {
  width: 100%;
  height: 64rpx;
  background-color: #fff;
  color: #667eea;
  border-radius: 32rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button::after {
  border: none;
}
</style>
