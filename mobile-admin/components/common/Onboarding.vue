<template>
  <view v-if="visible" class="onboarding-container">
    <!-- 遮罩层 -->
    <view class="onboarding-mask" :style="maskStyle" @tap="handleMaskClick"></view>

    <!-- 高亮区域 -->
    <view v-if="currentStep" class="highlight-area" :style="highlightStyle"></view>

    <!-- 引导内容 -->
    <view v-if="currentStep" class="guide-content" :style="contentStyle">
      <!-- 箭头指示器 -->
      <view v-if="showArrow" class="guide-arrow" :class="'arrow-' + arrowPosition"></view>

      <!-- 内容卡片 -->
      <view class="guide-card">
        <!-- 标题 -->
        <view class="guide-header">
          <text class="guide-title">{{ currentStep.title }}</text>
          <text v-if="showSkip" class="guide-skip" @tap="handleSkip">跳过</text>
        </view>

        <!-- 描述 -->
        <view class="guide-body">
          <text class="guide-description">{{ currentStep.description }}</text>

          <!-- 图片(可选) -->
          <image
            v-if="currentStep.image"
            :src="currentStep.image"
            class="guide-image"
            mode="aspectFit"
          />
        </view>

        <!-- 底部操作 -->
        <view class="guide-footer">
          <!-- 步骤指示器 -->
          <view class="step-indicators">
            <view
              v-for="(step, index) in steps"
              :key="index"
              class="step-dot"
              :class="{ active: index === currentStepIndex }"
            ></view>
          </view>

          <!-- 操作按钮 -->
          <view class="guide-actions">
            <button
              v-if="currentStepIndex > 0"
              class="guide-button secondary"
              @tap="handlePrev"
            >
              上一步
            </button>
            <button
              class="guide-button primary"
              @tap="handleNext"
            >
              {{ isLastStep ? '完成' : '下一步' }}
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Onboarding',

  props: {
    // 引导步骤配置
    steps: {
      type: Array,
      required: true,
      default: () => []
      // 格式: [{ title, description, target, image, position }]
    },
    // 是否显示跳过按钮
    showSkip: {
      type: Boolean,
      default: true
    },
    // 是否显示箭头
    showArrow: {
      type: Boolean,
      default: true
    },
    // 遮罩透明度
    maskOpacity: {
      type: Number,
      default: 0.7
    },
    // 高亮区域内边距
    highlightPadding: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      visible: false,
      currentStepIndex: 0,
      targetRect: null,
      windowWidth: 0,
      windowHeight: 0
    }
  },

  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex]
    },

    isLastStep() {
      return this.currentStepIndex === this.steps.length - 1
    },

    maskStyle() {
      return {
        backgroundColor: `rgba(0, 0, 0, ${this.maskOpacity})`
      }
    },

    highlightStyle() {
      if (!this.targetRect) return {}

      const padding = this.highlightPadding

      return {
        left: (this.targetRect.left - padding) + 'px',
        top: (this.targetRect.top - padding) + 'px',
        width: (this.targetRect.width + padding * 2) + 'px',
        height: (this.targetRect.height + padding * 2) + 'px',
        borderRadius: '8px'
      }
    },

    contentStyle() {
      if (!this.targetRect) return {}

      const position = this.currentStep.position || 'bottom'
      const margin = 20

      let style = {}

      switch (position) {
        case 'top':
          style = {
            left: '50%',
            bottom: (this.windowHeight - this.targetRect.top + margin) + 'px',
            transform: 'translateX(-50%)'
          }
          break
        case 'bottom':
          style = {
            left: '50%',
            top: (this.targetRect.bottom + margin) + 'px',
            transform: 'translateX(-50%)'
          }
          break
        case 'left':
          style = {
            right: (this.windowWidth - this.targetRect.left + margin) + 'px',
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
        case 'center':
        default:
          style = {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }
      }

      return style
    },

    arrowPosition() {
      const position = this.currentStep.position || 'bottom'
      const arrowMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
        center: 'none'
      }
      return arrowMap[position]
    }
  },

  mounted() {
    this.getSystemInfo()
  },

  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.windowWidth = systemInfo.windowWidth
      this.windowHeight = systemInfo.windowHeight
    },

    async start() {
      this.currentStepIndex = 0
      this.visible = true
      await this.updateTargetRect()
      this.$emit('start')
    },

    async updateTargetRect() {
      const step = this.currentStep
      if (!step || !step.target) {
        this.targetRect = null
        return
      }

      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this)
        query.select(step.target).boundingClientRect(data => {
          if (data) {
            this.targetRect = data
          }
          resolve()
        }).exec()
      })
    },

    async handleNext() {
      if (this.isLastStep) {
        this.finish()
      } else {
        this.currentStepIndex++
        await this.updateTargetRect()
        this.$emit('step-change', this.currentStepIndex)
      }
    },

    async handlePrev() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--
        await this.updateTargetRect()
        this.$emit('step-change', this.currentStepIndex)
      }
    },

    handleSkip() {
      this.visible = false
      this.$emit('skip', this.currentStepIndex)
    },

    handleMaskClick() {
      // 点击遮罩不做任何操作,防止误触
    },

    finish() {
      this.visible = false
      this.$emit('finish')
    },

    reset() {
      this.currentStepIndex = 0
      this.targetRect = null
      this.visible = false
    }
  }
}
</script>

<style scoped>
.onboarding-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}

/* 遮罩层 */
.onboarding-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

/* 高亮区域 */
.highlight-area {
  position: absolute;
  background-color: transparent;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
  z-index: 10001;
  transition: all 0.3s ease;
}

/* 引导内容 */
.guide-content {
  position: absolute;
  z-index: 10002;
  max-width: 600rpx;
  padding: 0 40rpx;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 箭头指示器 */
.guide-arrow {
  width: 0;
  height: 0;
  border: 20rpx solid transparent;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.guide-arrow.arrow-top {
  top: -40rpx;
  border-bottom-color: #fff;
}

.guide-arrow.arrow-bottom {
  bottom: -40rpx;
  border-top-color: #fff;
}

.guide-arrow.arrow-left {
  left: -40rpx;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #fff;
}

.guide-arrow.arrow-right {
  right: -40rpx;
  left: auto;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #fff;
}

/* 内容卡片 */
.guide-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

/* 头部 */
.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.guide-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.guide-skip {
  font-size: 28rpx;
  color: #999;
  padding: 8rpx 16rpx;
}

/* 内容 */
.guide-body {
  margin-bottom: 32rpx;
}

.guide-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

.guide-image {
  width: 100%;
  height: 300rpx;
  margin-top: 24rpx;
  border-radius: 12rpx;
}

/* 底部 */
.guide-footer {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 步骤指示器 */
.step-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.step-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  transition: all 0.3s ease;
}

.step-dot.active {
  width: 40rpx;
  border-radius: 8rpx;
  background-color: #667eea;
}

/* 操作按钮 */
.guide-actions {
  display: flex;
  gap: 24rpx;
}

.guide-button {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.guide-button.secondary {
  background-color: #f5f5f5;
  color: #666;
}

.guide-button::after {
  border: none;
}

/* 深色主题适配 */
.dark-theme .guide-card {
  background-color: #2d2d2d;
}

.dark-theme .guide-title {
  color: #e5e5e5;
}

.dark-theme .guide-description {
  color: #b3b3b3;
}

.dark-theme .guide-button.secondary {
  background-color: #3a3a3a;
  color: #b3b3b3;
}
</style>
