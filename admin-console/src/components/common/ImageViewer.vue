<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    :fullscreen="isFullscreen"
    append-to-body
    class="image-viewer-dialog"
    @close="handleClose"
  >
    <div class="image-viewer-container">
      <!-- 主图展示区 -->
      <div class="main-image-wrapper">
        <div class="image-container" :class="{ 'compare-mode': compareMode && compareIndex !== null }">
          <!-- 主图 -->
          <div class="image-box" :style="imageStyle">
            <img
              :src="currentImage"
              :style="{ transform: `scale(${scale}) rotate(${rotate}deg)` }"
              alt="查看图片"
              @mousedown="handleMouseDown"
            />
          </div>

          <!-- 对比图（对比模式） -->
          <div v-if="compareMode && compareIndex !== null" class="image-box compare-image" :style="imageStyle">
            <img
              :src="images[compareIndex]"
              :style="{ transform: `scale(${scale}) rotate(${rotate}deg)` }"
              alt="对比图片"
            />
          </div>
        </div>

        <!-- 图片信息 -->
        <div class="image-info">
          <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
          <span v-if="showFileName" class="file-name">{{ currentFileName }}</span>
        </div>

        <!-- 操作工具栏 -->
        <div class="toolbar">
          <!-- 左侧工具 -->
          <div class="toolbar-left">
            <el-button-group>
              <el-button :icon="ZoomOut" @click="handleZoomOut" title="缩小">缩小</el-button>
              <el-button @click="handleResetZoom" title="重置">{{ Math.round(scale * 100) }}%</el-button>
              <el-button :icon="ZoomIn" @click="handleZoomIn" title="放大">放大</el-button>
            </el-button-group>

            <el-button-group style="margin-left: 12px">
              <el-button :icon="RefreshLeft" @click="handleRotateLeft" title="逆时针旋转">逆时针</el-button>
              <el-button :icon="RefreshRight" @click="handleRotateRight" title="顺时针旋转">顺时针</el-button>
            </el-button-group>

            <el-button
              v-if="images.length > 1"
              :icon="compareMode ? View : Grid"
              style="margin-left: 12px"
              @click="toggleCompareMode"
              :type="compareMode ? 'primary' : 'default'"
            >
              {{ compareMode ? '退出对比' : '对比模式' }}
            </el-button>
          </div>

          <!-- 右侧工具 -->
          <div class="toolbar-right">
            <el-button :icon="Download" @click="handleDownload" title="下载">下载</el-button>
            <el-button
              :icon="isFullscreen ? FullScreen : FullScreen"
              @click="toggleFullscreen"
              :title="isFullscreen ? '退出全屏' : '全屏'"
            >
              {{ isFullscreen ? '退出全屏' : '全屏' }}
            </el-button>
          </div>
        </div>

        <!-- 左右切换按钮 -->
        <div v-if="images.length > 1" class="nav-buttons">
          <el-button
            circle
            :icon="ArrowLeft"
            :disabled="currentIndex === 0"
            @click="handlePrev"
            class="nav-btn nav-btn-prev"
          />
          <el-button
            circle
            :icon="ArrowRight"
            :disabled="currentIndex === images.length - 1"
            @click="handleNext"
            class="nav-btn nav-btn-next"
          />
        </div>
      </div>

      <!-- 缩略图列表 -->
      <div v-if="showThumbnails && images.length > 1" class="thumbnails-wrapper">
        <div class="thumbnails-container">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="thumbnail-item"
            :class="{
              active: index === currentIndex,
              compare: compareMode && index === compareIndex,
            }"
            @click="handleThumbnailClick(index)"
          >
            <img :src="image" :alt="`缩略图 ${index + 1}`" />
            <div v-if="compareMode && index === compareIndex" class="compare-badge">对比</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ZoomIn,
  ZoomOut,
  RefreshLeft,
  RefreshRight,
  Download,
  FullScreen,
  ArrowLeft,
  ArrowRight,
  View,
  Grid,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// Props 定义
interface Props {
  modelValue: boolean           // 是否显示对话框
  images: string[]              // 图片 URL 数组
  initialIndex?: number         // 初始显示的图片索引
  title?: string                // 对话框标题
  showThumbnails?: boolean      // 是否显示缩略图
  showFileName?: boolean        // 是否显示文件名
  dialogWidth?: string          // 对话框宽度
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  images: () => [],
  initialIndex: 0,
  title: '图片查看',
  showThumbnails: true,
  showFileName: false,
  dialogWidth: '90%',
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [index: number]
  'close': []
}>()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const currentIndex = ref(0)
const scale = ref(1)
const rotate = ref(0)
const isFullscreen = ref(false)
const compareMode = ref(false)
const compareIndex = ref<number | null>(null)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })

// 计算属性
const currentImage = computed(() => props.images[currentIndex.value] || '')
const currentFileName = computed(() => {
  const url = currentImage.value
  return url.split('/').pop() || '未知文件'
})

const imageStyle = computed(() => ({
  transform: `translate(${imagePosition.value.x}px, ${imagePosition.value.y}px)`,
}))

// 监听初始索引变化
watch(
  () => props.initialIndex,
  (newVal) => {
    currentIndex.value = newVal
  },
  { immediate: true }
)

// 监听对话框显示状态
watch(visible, (newVal) => {
  if (newVal) {
    resetView()
    currentIndex.value = props.initialIndex
  }
})

// 重置视图
const resetView = () => {
  scale.value = 1
  rotate.value = 0
  imagePosition.value = { x: 0, y: 0 }
  compareMode.value = false
  compareIndex.value = null
}

// 缩放操作
const handleZoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 5)
}

const handleZoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.2)
}

const handleResetZoom = () => {
  scale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

// 旋转操作
const handleRotateLeft = () => {
  rotate.value -= 90
}

const handleRotateRight = () => {
  rotate.value += 90
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 切换对比模式
const toggleCompareMode = () => {
  compareMode.value = !compareMode.value
  if (compareMode.value && compareIndex.value === null) {
    // 默认选择下一张作为对比图
    compareIndex.value = currentIndex.value < props.images.length - 1 ? currentIndex.value + 1 : 0
  }
}

// 上一张
const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetView()
    emit('change', currentIndex.value)
  }
}

// 下一张
const handleNext = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    resetView()
    emit('change', currentIndex.value)
  }
}

// 缩略图点击
const handleThumbnailClick = (index: number) => {
  if (compareMode.value) {
    // 对比模式下，点击设置为对比图
    if (index !== currentIndex.value) {
      compareIndex.value = index
    }
  } else {
    // 普通模式下，切换当前图片
    currentIndex.value = index
    resetView()
    emit('change', currentIndex.value)
  }
}

// 下载图片
const handleDownload = async () => {
  try {
    const url = currentImage.value
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = currentFileName.value
    link.click()
    URL.revokeObjectURL(link.href)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载失败:', error)
  }
}

// 鼠标拖拽
const handleMouseDown = (e: MouseEvent) => {
  if (scale.value <= 1) return // 只有放大时才能拖拽
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - imagePosition.value.x,
    y: e.clientY - imagePosition.value.y,
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    imagePosition.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y,
    }
  }

  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 关闭对话框
const handleClose = () => {
  emit('close')
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (!visible.value) return

  switch (e.key) {
    case 'ArrowLeft':
      handlePrev()
      break
    case 'ArrowRight':
      handleNext()
      break
    case 'Escape':
      visible.value = false
      break
    case '+':
    case '=':
      handleZoomIn()
      break
    case '-':
      handleZoomOut()
      break
  }
}

// 挂载键盘事件
watch(visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<script lang="ts">
export default {
  name: 'ImageViewer',
}
</script>

<style scoped lang="scss">
.image-viewer-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    height: calc(100vh - 120px);
  }
}

.image-viewer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
}

.main-image-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;

  .image-container {
    display: flex;
    gap: 20px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;

    &.compare-mode {
      .image-box {
        width: calc(50% - 10px);
      }
    }

    .image-box {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s;
        user-select: none;
      }

      &.compare-image {
        border-left: 2px solid var(--el-color-primary);
      }
    }
  }

  .image-info {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    gap: 16px;

    .file-name {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .toolbar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    min-width: 600px;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      gap: 12px;
    }
  }

  .nav-buttons {
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      background-color: rgba(255, 255, 255, 0.9);
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &:hover:not(:disabled) {
        background-color: #fff;
      }

      &.nav-btn-prev {
        left: 20px;
      }

      &.nav-btn-next {
        right: 20px;
      }
    }
  }
}

.thumbnails-wrapper {
  height: 120px;
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  padding: 12px;
  overflow-x: auto;
  overflow-y: hidden;

  .thumbnails-container {
    display: flex;
    gap: 12px;
    height: 100%;

    .thumbnail-item {
      position: relative;
      flex-shrink: 0;
      width: 96px;
      height: 96px;
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
        transform: scale(1.05);
      }

      &.active {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 8px rgba(64, 158, 255, 0.5);
      }

      &.compare {
        border-color: var(--el-color-success);
        box-shadow: 0 0 8px rgba(103, 194, 58, 0.5);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .compare-badge {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 6px;
        background-color: var(--el-color-success);
        color: #fff;
        font-size: 12px;
        border-bottom-left-radius: 4px;
      }
    }
  }
}
</style>
