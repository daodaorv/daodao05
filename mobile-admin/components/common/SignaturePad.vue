<template>
  <view class="signature-pad">
    <canvas
      :canvas-id="canvasId"
      class="signature-canvas"
      :style="{ height: `${height}rpx` }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    ></canvas>
    <view class="signature-toolbar">
      <u-button
        size="small"
        type="info"
        plain
        text="清除"
        @click="handleClear"
      ></u-button>
      <u-button
        size="small"
        type="primary"
        text="确认签名"
        :loading="exporting"
        @click="exportSignature"
      ></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, toRefs, watch } from 'vue'

interface Props {
  modelValue: string
  height: number
  strokeWidth: number
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 300,
  strokeWidth: 3,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const { height } = toRefs(props)

const canvasId = `signature-pad-${Math.random().toString(36).slice(2, 10)}`
const exporting = ref(false)
const drawing = ref(false)
const signatureContext = ref<UniApp.CanvasContext | null>(null)
const instance = getCurrentInstance()

const canvasSize = computed(() => ({
  width: 750,
  height: props.height
}))

function initCanvas() {
  if (!instance) return
  const ctx = uni.createCanvasContext(canvasId, instance)
  ctx.setStrokeStyle('#111')
  ctx.setLineWidth(props.strokeWidth)
  ctx.setLineCap('round')
  ctx.setLineJoin('round')
  signatureContext.value = ctx
}

function handleTouchStart(e: any) {
  if (props.disabled || !signatureContext.value) return
  const touch = e.touches && e.touches[0]
  if (!touch) return
  drawing.value = true
  signatureContext.value.beginPath()
  signatureContext.value.moveTo(touch.x, touch.y)
}

function handleTouchMove(e: any) {
  if (!drawing.value || props.disabled || !signatureContext.value) return
  const touch = e.touches && e.touches[0]
  if (!touch) return
  signatureContext.value.lineTo(touch.x, touch.y)
  signatureContext.value.stroke()
  signatureContext.value.draw(true)
}

function handleTouchEnd() {
  if (!drawing.value || props.disabled) return
  drawing.value = false
  exportSignature()
}

function resetCanvas() {
  if (!signatureContext.value) return
  signatureContext.value.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
  signatureContext.value.draw()
}

function handleClear() {
  resetCanvas()
  emit('update:modelValue', '')
  emit('change', '')
}

function exportSignature() {
  if (props.disabled || exporting.value) return
  exporting.value = true
  const context = instance?.proxy
  uni.canvasToTempFilePath(
    {
      canvasId,
      success: (res) => {
        emit('update:modelValue', res.tempFilePath)
        emit('change', res.tempFilePath)
      },
      fail: (error) => {
        console.error('导出签名失败', error)
        uni.showToast({ title: '签名导出失败', icon: 'none' })
      },
      complete: () => {
        exporting.value = false
      }
    },
    context as any
  )
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetCanvas()
    }
  }
)

onMounted(() => {
  nextTick(() => {
    initCanvas()
  })
})
</script>

<style lang="scss" scoped>
.signature-pad {
  width: 100%;
}

.signature-canvas {
  width: 100%;
  border: 1px dashed #c0c4cc;
  border-radius: 12rpx;
  background-color: #fff;
}

.signature-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 20rpx;
}
</style>
