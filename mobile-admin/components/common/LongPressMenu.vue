<template>
  <view class="long-press-container">
    <!-- 触发区域 -->
    <view
      class="long-press-trigger"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
    >
      <slot></slot>
    </view>

    <!-- 菜单弹窗 -->
    <view v-if="showMenu" class="menu-overlay" @tap="closeMenu">
      <view
        class="menu-container"
        :style="menuStyle"
        @tap.stop
      >
        <!-- 菜单标题 -->
        <view v-if="title" class="menu-header">
          <text class="menu-title">{{ title }}</text>
        </view>

        <!-- 菜单项列表 -->
        <view class="menu-list">
          <view
            v-for="(item, index) in menuItems"
            :key="index"
            class="menu-item"
            :class="{ disabled: item.disabled }"
            @tap="handleMenuClick(item, index)"
          >
            <text v-if="item.icon" class="menu-icon">{{ item.icon }}</text>
            <text class="menu-text">{{ item.text }}</text>
            <text v-if="item.badge" class="menu-badge">{{ item.badge }}</text>
          </view>
        </view>

        <!-- 取消按钮 -->
        <view v-if="showCancel" class="menu-cancel" @tap="closeMenu">
          <text class="cancel-text">取消</text>
        </view>
      </view>
    </view>

    <!-- 震动反馈提示 -->
    <view v-if="showFeedback" class="feedback-overlay">
      <view class="feedback-ripple"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LongPressMenu',

  props: {
    // 菜单项配置
    menuItems: {
      type: Array,
      default: () => []
      // 格式: [{ text: '编辑', icon: '✏️', value: 'edit', disabled: false, badge: '' }]
    },
    // 菜单标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: true
    },
    // 长按触发时间（毫秒）
    duration: {
      type: Number,
      default: 500
    },
    // 是否启用震动反馈
    vibrate: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 菜单位置 'center' | 'bottom'
    position: {
      type: String,
      default: 'center'
    }
  },

  data() {
    return {
      showMenu: false,
      showFeedback: false,
      timer: null,
      startX: 0,
      startY: 0,
      moved: false,
      menuStyle: {}
    }
  },

  methods: {
    handleTouchStart(e) {
      if (this.disabled) return

      const touch = e.touches[0]
      this.startX = touch.clientX
      this.startY = touch.clientY
      this.moved = false

      // 开始计时
      this.timer = setTimeout(() => {
        this.triggerLongPress(e)
      }, this.duration)
    },

    handleTouchMove(e) {
      if (this.disabled) return

      const touch = e.touches[0]
      const deltaX = Math.abs(touch.clientX - this.startX)
      const deltaY = Math.abs(touch.clientY - this.startY)

      // 如果移动距离超过10px，取消长按
      if (deltaX > 10 || deltaY > 10) {
        this.moved = true
        this.cancelLongPress()
      }
    },

    handleTouchEnd(e) {
      this.cancelLongPress()
    },

    handleTouchCancel(e) {
      this.cancelLongPress()
    },

    triggerLongPress(e) {
      if (this.moved) return

      // 震动反馈
      if (this.vibrate) {
        uni.vibrateShort({
          type: 'medium'
        })
      }

      // 显示反馈动画
      this.showFeedback = true
      setTimeout(() => {
        this.showFeedback = false
      }, 300)

      // 计算菜单位置
      this.calculateMenuPosition(e)

      // 显示菜单
      this.showMenu = true

      this.$emit('long-press')
    },

    cancelLongPress() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },

    calculateMenuPosition(e) {
      if (this.position === 'bottom') {
        // 底部弹出
        this.menuStyle = {
          bottom: '0',
          left: '0',
          right: '0',
          transform: 'translateY(0)'
        }
      } else {
        // 居中显示
        this.menuStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      }
    },

    handleMenuClick(item, index) {
      if (item.disabled) return

      this.$emit('menu-click', { item, index })

      // 自动关闭菜单
      if (item.autoClose !== false) {
        this.closeMenu()
      }
    },

    closeMenu() {
      this.showMenu = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.long-press-container {
  position: relative;
}

.long-press-trigger {
  position: relative;
}

/* 菜单遮罩 */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 菜单容器 */
.menu-container {
  position: absolute;
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  min-width: 400rpx;
  max-width: 600rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, -40%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

/* 底部弹出动画 */
.menu-container[style*="bottom: 0"] {
  animation: slideUpFromBottom 0.3s ease;
  border-radius: 24rpx 24rpx 0 0;
}

@keyframes slideUpFromBottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 菜单头部 */
.menu-header {
  padding: 32rpx 40rpx 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.menu-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 菜单列表 */
.menu-list {
  padding: 16rpx 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 40rpx;
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #f5f5f5;
}

.menu-item.disabled {
  opacity: 0.4;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-badge {
  padding: 4rpx 12rpx;
  background-color: #f56c6c;
  color: #fff;
  font-size: 20rpx;
  border-radius: 20rpx;
  margin-left: 16rpx;
}

/* 取消按钮 */
.menu-cancel {
  border-top: 16rpx solid #f5f5f5;
  padding: 28rpx 40rpx;
  text-align: center;
}

.cancel-text {
  font-size: 30rpx;
  color: #666;
}

/* 反馈动画 */
.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-ripple {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background-color: rgba(102, 126, 234, 0.2);
  animation: ripple 0.3s ease;
}

@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(1);
    opacity: 0;
  }
}

/* 深色主题适配 */
.dark-theme .menu-container {
  background-color: #2d2d2d;
}

.dark-theme .menu-header {
  border-bottom-color: #404040;
}

.dark-theme .menu-title {
  color: #e5e5e5;
}

.dark-theme .menu-item:active {
  background-color: #3a3a3a;
}

.dark-theme .menu-text {
  color: #e5e5e5;
}

.dark-theme .cancel-text {
  color: #b3b3b3;
}

.dark-theme .menu-cancel {
  border-top-color: #404040;
}
</style>
