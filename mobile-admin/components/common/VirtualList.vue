<template>
  <scroll-view
    class="virtual-list"
    :scroll-y="true"
    :style="{ height: height }"
    :scroll-top="scrollTop"
    @scroll="handleScroll"
    :enable-back-to-top="true"
  >
    <view class="virtual-list-phantom" :style="{ height: phantomHeight + 'px' }"></view>
    <view class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <view
        v-for="item in visibleData"
        :key="item[itemKey]"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item._index"></slot>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'VirtualList',

  props: {
    // 列表数据
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    // 每项的高度
    itemHeight: {
      type: Number,
      required: true
    },
    // 容器高度
    height: {
      type: String,
      default: '100vh'
    },
    // 数据项的唯一标识字段
    itemKey: {
      type: String,
      default: 'id'
    },
    // 缓冲区大小（渲染可视区域外的项数）
    buffer: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
      scrollTop: 0,
      containerHeight: 0,
      visibleCount: 0,
      startIndex: 0,
      endIndex: 0
    }
  },

  computed: {
    // 列表总高度
    phantomHeight() {
      return this.data.length * this.itemHeight
    },

    // 可见数据
    visibleData() {
      const start = Math.max(0, this.startIndex - this.buffer)
      const end = Math.min(this.data.length, this.endIndex + this.buffer)

      return this.data.slice(start, end).map((item, index) => ({
        ...item,
        _index: start + index
      }))
    },

    // 偏移量
    offset() {
      return Math.max(0, this.startIndex - this.buffer) * this.itemHeight
    }
  },

  mounted() {
    this.initContainerHeight()
    this.calculateVisibleCount()
  },

  watch: {
    data: {
      handler() {
        this.calculateVisibleCount()
      },
      deep: true
    }
  },

  methods: {
    initContainerHeight() {
      // 获取容器高度
      const query = uni.createSelectorQuery().in(this)
      query.select('.virtual-list').boundingClientRect(data => {
        if (data) {
          this.containerHeight = data.height
          this.calculateVisibleCount()
        }
      }).exec()
    },

    calculateVisibleCount() {
      if (this.containerHeight && this.itemHeight) {
        this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight)
        this.updateVisibleRange()
      }
    },

    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.scrollTop = scrollTop

      // 计算当前滚动位置对应的起始索引
      const newStartIndex = Math.floor(scrollTop / this.itemHeight)

      if (newStartIndex !== this.startIndex) {
        this.startIndex = newStartIndex
        this.updateVisibleRange()
      }

      this.$emit('scroll', e)
    },

    updateVisibleRange() {
      this.startIndex = Math.max(0, this.startIndex)
      this.endIndex = Math.min(
        this.data.length,
        this.startIndex + this.visibleCount
      )
    },

    // 滚动到指定索引
    scrollToIndex(index) {
      const scrollTop = index * this.itemHeight
      this.scrollTop = scrollTop
      this.startIndex = index
      this.updateVisibleRange()
    },

    // 滚动到顶部
    scrollToTop() {
      this.scrollToIndex(0)
    },

    // 滚动到底部
    scrollToBottom() {
      this.scrollToIndex(this.data.length - this.visibleCount)
    }
  }
}
</script>

<style scoped>
.virtual-list {
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}

.virtual-list-item {
  overflow: hidden;
}
</style>
