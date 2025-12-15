<template>
  <view class="refresh-list-container">
    <!-- 下拉刷新区域 -->
    <view
      class="refresh-header"
      :style="refreshHeaderStyle"
    >
      <view class="refresh-content">
        <!-- 下拉状态 -->
        <view v-if="refreshStatus === 'pulling'" class="refresh-status">
          <text class="refresh-icon">↓</text>
          <text class="refresh-text">下拉刷新</text>
        </view>

        <!-- 释放状态 -->
        <view v-else-if="refreshStatus === 'loosing'" class="refresh-status">
          <text class="refresh-icon rotating">↑</text>
          <text class="refresh-text">释放刷新</text>
        </view>

        <!-- 刷新中 -->
        <view v-else-if="refreshStatus === 'refreshing'" class="refresh-status">
          <text class="refresh-icon spinning">⟳</text>
          <text class="refresh-text">刷新中...</text>
        </view>

        <!-- 刷新成功 -->
        <view v-else-if="refreshStatus === 'success'" class="refresh-status">
          <text class="refresh-icon">✓</text>
          <text class="refresh-text">刷新成功</text>
        </view>
      </view>
    </view>

    <!-- 滚动容器 -->
    <scroll-view
      class="scroll-container"
      :style="scrollStyle"
      scroll-y
      :scroll-top="scrollTop"
      :lower-threshold="lowerThreshold"
      @scroll="handleScroll"
      @scrolltolower="handleScrollToLower"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <!-- 内容插槽 -->
      <view class="list-content">
        <slot></slot>
      </view>

      <!-- 上拉加载区域 -->
      <view v-if="showLoadMore" class="load-more-footer">
        <!-- 加载中 -->
        <view v-if="loadMoreStatus === 'loading'" class="load-more-status">
          <text class="load-more-icon spinning">⟳</text>
          <text class="load-more-text">加载中...</text>
        </view>

        <!-- 没有更多 -->
        <view v-else-if="loadMoreStatus === 'nomore'" class="load-more-status">
          <text class="load-more-text">没有更多了</text>
        </view>

        <!-- 加载失败 -->
        <view v-else-if="loadMoreStatus === 'error'" class="load-more-status">
          <text class="load-more-text error">加载失败，点击重试</text>
        </view>

        <!-- 默认状态 -->
        <view v-else class="load-more-status">
          <text class="load-more-text">上拉加载更多</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="isEmpty && !refreshing" class="empty-state">
        <slot name="empty">
          <view class="empty-content">
            <text class="empty-icon">📭</text>
            <text class="empty-text">暂无数据</text>
          </view>
        </slot>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'RefreshList',

  props: {
    // 是否启用下拉刷新
    enableRefresh: {
      type: Boolean,
      default: true
    },
    // 是否启用上拉加载
    enableLoadMore: {
      type: Boolean,
      default: true
    },
    // 是否显示上拉加载
    showLoadMore: {
      type: Boolean,
      default: true
    },
    // 是否为空
    isEmpty: {
      type: Boolean,
      default: false
    },
    // 是否没有更多数据
    noMore: {
      type: Boolean,
      default: false
    },
    // 下拉刷新阈值
    refreshThreshold: {
      type: Number,
      default: 80
    },
    // 上拉加载阈值
    lowerThreshold: {
      type: Number,
      default: 100
    },
    // 容器高度
    height: {
      type: String,
      default: '100vh'
    }
  },

  data() {
    return {
      refreshStatus: 'idle', // idle, pulling, loosing, refreshing, success
      loadMoreStatus: 'idle', // idle, loading, nomore, error
      refreshing: false,
      loading: false,
      startY: 0,
      moveY: 0,
      scrollTop: 0,
      isScrolling: false,
      canRefresh: false
    }
  },

  computed: {
    refreshHeaderStyle() {
      const height = Math.min(Math.max(0, this.moveY), this.refreshThreshold * 1.5)
      return {
        height: height + 'px',
        opacity: Math.min(height / this.refreshThreshold, 1)
      }
    },

    scrollStyle() {
      return {
        height: this.height
      }
    }
  },

  watch: {
    noMore(val) {
      if (val) {
        this.loadMoreStatus = 'nomore'
      } else if (this.loadMoreStatus === 'nomore') {
        this.loadMoreStatus = 'idle'
      }
    }
  },

  methods: {
    handleTouchStart(e) {
      if (!this.enableRefresh || this.refreshing) return

      const touch = e.touches[0]
      this.startY = touch.clientY
      this.canRefresh = this.scrollTop <= 0
    },

    handleTouchMove(e) {
      if (!this.enableRefresh || this.refreshing || !this.canRefresh) return

      const touch = e.touches[0]
      const deltaY = touch.clientY - this.startY

      // 只处理下拉
      if (deltaY <= 0) {
        this.moveY = 0
        this.refreshStatus = 'idle'
        return
      }

      // 添加阻尼效果
      this.moveY = deltaY * 0.5

      // 更新状态
      if (this.moveY >= this.refreshThreshold) {
        this.refreshStatus = 'loosing'
      } else {
        this.refreshStatus = 'pulling'
      }
    },

    handleTouchEnd(e) {
      if (!this.enableRefresh || this.refreshing) return

      // 判断是否触发刷新
      if (this.moveY >= this.refreshThreshold) {
        this.triggerRefresh()
      } else {
        this.resetRefresh()
      }
    },

    handleScroll(e) {
      this.scrollTop = e.detail.scrollTop
      this.isScrolling = true

      // 重置下拉刷新状态
      if (this.scrollTop > 0) {
        this.canRefresh = false
      }

      this.$emit('scroll', e)
    },

    handleScrollToLower() {
      if (!this.enableLoadMore || this.loading || this.noMore) return

      this.triggerLoadMore()
    },

    async triggerRefresh() {
      if (this.refreshing) return

      this.refreshing = true
      this.refreshStatus = 'refreshing'

      try {
        await this.$emit('refresh')

        // 显示成功状态
        this.refreshStatus = 'success'
        setTimeout(() => {
          this.resetRefresh()
        }, 500)
      } catch (error) {
        console.error('刷新失败:', error)
        this.resetRefresh()
      }
    },

    async triggerLoadMore() {
      if (this.loading || this.noMore) return

      this.loading = true
      this.loadMoreStatus = 'loading'

      try {
        await this.$emit('load-more')
        this.loadMoreStatus = 'idle'
      } catch (error) {
        console.error('加载更多失败:', error)
        this.loadMoreStatus = 'error'
      } finally {
        this.loading = false
      }
    },

    resetRefresh() {
      this.refreshing = false
      this.refreshStatus = 'idle'
      this.moveY = 0
      this.canRefresh = false
    },

    // 手动触发刷新
    refresh() {
      this.moveY = this.refreshThreshold
      this.triggerRefresh()
    },

    // 完成刷新
    finishRefresh() {
      this.refreshStatus = 'success'
      setTimeout(() => {
        this.resetRefresh()
      }, 500)
    },

    // 完成加载
    finishLoadMore() {
      this.loading = false
      this.loadMoreStatus = 'idle'
    },

    // 设置没有更多
    setNoMore() {
      this.loading = false
      this.loadMoreStatus = 'nomore'
    },

    // 重置加载状态
    resetLoadMore() {
      this.loading = false
      this.loadMoreStatus = 'idle'
    }
  }
}
</script>

<style scoped>
.refresh-list-container {
  position: relative;
  overflow: hidden;
}

/* 下拉刷新头部 */
.refresh-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.2s;
}

.refresh-content {
  padding: 20rpx 0;
}

.refresh-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
  color: #667eea;
}

.refresh-icon.rotating {
  animation: rotate180 0.3s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

.refresh-text {
  font-size: 28rpx;
  color: #666;
}

/* 滚动容器 */
.scroll-container {
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.list-content {
  min-height: 100%;
}

/* 上拉加载底部 */
.load-more-footer {
  padding: 40rpx 0;
}

.load-more-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-more-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: #667eea;
}

.load-more-icon.spinning {
  animation: spin 1s linear infinite;
}

.load-more-text {
  font-size: 28rpx;
  color: #999;
}

.load-more-text.error {
  color: #f56c6c;
}

/* 空状态 */
.empty-state {
  padding: 120rpx 0;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

/* 深色主题适配 */
.dark-theme .refresh-text {
  color: #b3b3b3;
}

.dark-theme .load-more-text {
  color: #808080;
}

.dark-theme .empty-text {
  color: #808080;
}
</style>
