<template>
  <view class="swipe-action-container">
    <view
      class="swipe-content"
      :style="contentStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <!-- 主内容插槽 -->
      <slot></slot>
    </view>

    <!-- 右侧操作按钮 -->
    <view class="swipe-actions" :style="actionsStyle">
      <view
        v-for="(action, index) in actions"
        :key="index"
        class="swipe-action-item"
        :class="'action-' + action.type"
        :style="getActionStyle(action)"
        @tap.stop="handleActionClick(action, index)"
      >
        <text v-if="action.icon" class="action-icon">{{ action.icon }}</text>
        <text class="action-text">{{ action.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SwipeAction',

  props: {
    // 操作按钮配置
    actions: {
      type: Array,
      default: () => []
      // 格式: [{ text: '删除', type: 'danger', icon: '🗑️', width: 80 }]
    },
    // 是否禁用滑动
    disabled: {
      type: Boolean,
      default: false
    },
    // 滑动阈值（超过此值自动展开）
    threshold: {
      type: Number,
      default: 30
    },
    // 是否自动关闭其他项
    autoClose: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      isMoving: false,
      isOpen: false,
      actionsWidth: 0,
      direction: '', // 滑动方向
      startTime: 0
    }
  },

  computed: {
    contentStyle() {
      return {
        transform: `translateX(${this.moveX}px)`,
        transition: this.isMoving ? 'none' : 'transform 0.3s ease'
      }
    },

    actionsStyle() {
      return {
        width: this.actionsWidth + 'px'
      }
    }
  },

  mounted() {
    this.calculateActionsWidth()

    // 监听全局关闭事件
    if (this.autoClose) {
      uni.$on('swipe-action-close', this.handleGlobalClose)
    }
  },

  beforeDestroy() {
    if (this.autoClose) {
      uni.$off('swipe-action-close', this.handleGlobalClose)
    }
  },

  methods: {
    calculateActionsWidth() {
      let width = 0
      this.actions.forEach(action => {
        width += action.width || 80
      })
      this.actionsWidth = width
    },

    handleTouchStart(e) {
      if (this.disabled) return

      const touch = e.touches[0]
      this.startX = touch.clientX
      this.startY = touch.clientY
      this.startTime = Date.now()
      this.direction = ''
    },

    handleTouchMove(e) {
      if (this.disabled) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - this.startX
      const deltaY = touch.clientY - this.startY

      // 判断滑动方向
      if (!this.direction) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.direction = 'horizontal'
        } else {
          this.direction = 'vertical'
          return
        }
      }

      // 只处理水平滑动
      if (this.direction !== 'horizontal') return

      // 阻止页面滚动
      e.preventDefault()

      this.isMoving = true

      // 计算移动距离
      let moveX = deltaX
      if (this.isOpen) {
        moveX = deltaX - this.actionsWidth
      }

      // 限制移动范围
      if (moveX > 0) {
        // 向右滑动，添加阻尼效果
        moveX = moveX * 0.3
      } else if (Math.abs(moveX) > this.actionsWidth) {
        // 向左滑动超出范围，添加阻尼效果
        const overflow = Math.abs(moveX) - this.actionsWidth
        moveX = -(this.actionsWidth + overflow * 0.3)
      }

      this.moveX = moveX
    },

    handleTouchEnd(e) {
      if (this.disabled || !this.isMoving) return

      this.isMoving = false

      const duration = Date.now() - this.startTime
      const deltaX = this.moveX

      // 快速滑动判断（300ms内滑动超过30px）
      const isFastSwipe = duration < 300 && Math.abs(deltaX) > 30

      // 判断是否展开
      if (isFastSwipe) {
        // 快速滑动
        if (deltaX < 0) {
          this.open()
        } else {
          this.close()
        }
      } else {
        // 慢速滑动，根据阈值判断
        if (Math.abs(deltaX) > this.threshold) {
          if (deltaX < 0) {
            this.open()
          } else {
            this.close()
          }
        } else {
          // 未超过阈值，恢复原状
          if (this.isOpen) {
            this.open()
          } else {
            this.close()
          }
        }
      }
    },

    open() {
      if (this.isOpen) return

      this.isOpen = true
      this.moveX = -this.actionsWidth

      // 通知其他实例关闭
      if (this.autoClose) {
        uni.$emit('swipe-action-close', this._uid)
      }

      this.$emit('open')
    },

    close() {
      if (!this.isOpen && this.moveX === 0) return

      this.isOpen = false
      this.moveX = 0

      this.$emit('close')
    },

    handleGlobalClose(uid) {
      // 如果不是当前实例触发的关闭事件，则关闭自己
      if (uid !== this._uid) {
        this.close()
      }
    },

    handleActionClick(action, index) {
      this.$emit('action-click', { action, index })

      // 执行操作后关闭
      if (action.autoClose !== false) {
        this.close()
      }
    },

    getActionStyle(action) {
      const style = {
        width: (action.width || 80) + 'px'
      }

      if (action.backgroundColor) {
        style.backgroundColor = action.backgroundColor
      }

      return style
    }
  }
}
</script>

<style scoped>
.swipe-action-container {
  position: relative;
  overflow: hidden;
}

.swipe-content {
  position: relative;
  z-index: 2;
  background-color: #fff;
  will-change: transform;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: row;
}

.swipe-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  color: #fff;
  font-size: 28rpx;
  white-space: nowrap;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.action-text {
  font-size: 24rpx;
}

/* 操作按钮类型样式 */
.action-default {
  background-color: #909399;
}

.action-primary {
  background-color: #667eea;
}

.action-success {
  background-color: #67c23a;
}

.action-warning {
  background-color: #e6a23c;
}

.action-danger {
  background-color: #f56c6c;
}

.action-info {
  background-color: #909399;
}
</style>
