<template>
  <view class="lazy-image-container" :style="containerStyle">
    <image
      v-if="loaded || error"
      :src="error ? errorImage : currentSrc"
      :mode="mode"
      :class="['lazy-image', { loaded: loaded, error: error }]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    ></image>
    <view v-else class="lazy-placeholder" :style="placeholderStyle">
      <view class="loading-spinner">
        <text class="spinner-icon">⏳</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LazyImage',

  props: {
    // 图片地址
    src: {
      type: String,
      required: true
    },
    // 占位图
    placeholder: {
      type: String,
      default: ''
    },
    // 错误图
    errorImage: {
      type: String,
      default: '/static/images/error.png'
    },
    // 图片裁剪模式
    mode: {
      type: String,
      default: 'aspectFill'
    },
    // 容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // 容器高度
    height: {
      type: String,
      default: 'auto'
    },
    // 圆角
    borderRadius: {
      type: String,
      default: '0'
    },
    // 是否立即加载
    immediate: {
      type: Boolean,
      default: false
    },
    // 懒加载阈值（距离可视区域多少像素时开始加载）
    threshold: {
      type: Number,
      default: 100
    }
  },

  data() {
    return {
      loaded: false,
      error: false,
      currentSrc: '',
      observer: null,
      isInView: false
    }
  },

  computed: {
    containerStyle() {
      return {
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius,
        overflow: 'hidden'
      }
    },

    imageStyle() {
      return {
        width: '100%',
        height: '100%',
        borderRadius: this.borderRadius
      }
    },

    placeholderStyle() {
      return {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        backgroundImage: this.placeholder ? `url(${this.placeholder})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
  },

  mounted() {
    if (this.immediate) {
      this.loadImage()
    } else {
      this.initIntersectionObserver()
    }
  },

  beforeDestroy() {
    this.destroyObserver()
  },

  methods: {
    initIntersectionObserver() {
      // uni-app 的 IntersectionObserver
      this.observer = uni.createIntersectionObserver(this, {
        thresholdCallbacks: true
      })

      this.observer
        .relativeToViewport({ bottom: this.threshold })
        .observe('.lazy-image-container', (res) => {
          if (res.intersectionRatio > 0 && !this.loaded && !this.error) {
            this.isInView = true
            this.loadImage()
            this.destroyObserver()
          }
        })
    },

    loadImage() {
      if (this.loaded || this.error || !this.src) {
        return
      }

      // 预加载图片
      uni.getImageInfo({
        src: this.src,
        success: () => {
          this.currentSrc = this.src
          this.loaded = true
          this.$emit('load', this.src)
        },
        fail: () => {
          this.error = true
          this.$emit('error', this.src)
        }
      })
    },

    handleLoad() {
      this.loaded = true
      this.$emit('load', this.src)
    },

    handleError() {
      this.error = true
      this.$emit('error', this.src)
    },

    destroyObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },

    // 手动触发加载
    reload() {
      this.loaded = false
      this.error = false
      this.currentSrc = ''
      this.loadImage()
    }
  }
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: block;
}

.lazy-image {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

.lazy-image.error {
  opacity: 0.5;
}

.lazy-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  font-size: 48rpx;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
