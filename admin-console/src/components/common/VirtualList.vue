<template>
  <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: `${totalHeight}px` }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="getItemKey(item)"
        class="virtual-list-item"
        :style="{ height: `${itemHeight}px` }"
      >
        <slot :item="item" :index="item.__index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T = any">
import { ref, computed, watch } from 'vue'

interface Props {
  /** 列表数据 */
  data: T[]
  /** 每项高度 */
  itemHeight: number
  /** 容器高度 */
  height?: number | string
  /** 缓冲区数量（上下各渲染多少项） */
  buffer?: number
  /** 获取项的唯一key */
  itemKey?: string | ((item: T) => string | number)
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
  buffer: 5,
  itemKey: 'id'
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// 容器高度（像素）
const containerHeight = computed(() => {
  if (typeof props.height === 'number') {
    return props.height
  }
  if (typeof props.height === 'string' && props.height.endsWith('px')) {
    return parseInt(props.height)
  }
  return containerRef.value?.clientHeight || 600
})

// 总高度
const totalHeight = computed(() => {
  return props.data.length * props.itemHeight
})

// 可见区域可以显示的项数
const visibleCount = computed(() => {
  return Math.ceil(containerHeight.value / props.itemHeight)
})

// 开始索引
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - props.buffer)
})

// 结束索引
const endIndex = computed(() => {
  const index = startIndex.value + visibleCount.value
  return Math.min(props.data.length, index + props.buffer)
})

// 可见数据
const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    __index: startIndex.value + index
  }))
})

// 偏移量
const offset = computed(() => {
  return startIndex.value * props.itemHeight
})

// 获取项的key
const getItemKey = (item: any): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  return item[props.itemKey] || item.__index
}

// 滚动处理
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// 滚动到指定索引
const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
  if (!containerRef.value) return

  const targetScrollTop = index * props.itemHeight
  containerRef.value.scrollTo({
    top: targetScrollTop,
    behavior
  })
}

// 滚动到顶部
const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  scrollToIndex(0, behavior)
}

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  scrollToIndex(props.data.length - 1, behavior)
}

// 暴露方法
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom
})

// 监听数据变化，重置滚动位置
watch(() => props.data.length, () => {
  if (scrollTop.value > totalHeight.value) {
    scrollTop.value = 0
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }
})
</script>

<style scoped lang="scss">
.virtual-list {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: v-bind(height);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 3px;

    &:hover {
      background-color: #c0c4cc;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
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
}

.virtual-list-item {
  box-sizing: border-box;
}
</style>
