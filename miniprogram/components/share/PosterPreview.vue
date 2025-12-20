<template>
  <u-popup
    :show="show"
    mode="center"
    :round="20"
    :closeable="true"
    @close="handleClose"
  >
    <view class="poster-preview">
      <!-- 标题 -->
      <view class="poster-header">
        <text class="poster-title">分享海报</text>
        <text class="poster-subtitle">长按保存图片分享到朋友圈</text>
      </view>

      <!-- 海报图片 -->
      <view class="poster-image-wrapper">
        <image
          v-if="posterImage"
          :src="posterImage"
          class="poster-image"
          mode="widthFix"
          @longpress="handleLongPress"
        />
        <view v-else class="poster-loading">
          <u-loading-icon mode="circle" size="60"></u-loading-icon>
          <text class="loading-text">海报生成中...</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="poster-actions">
        <u-button
          type="primary"
          :loading="saving"
          :disabled="!posterImage"
          @click="handleSave"
        >
          <u-icon name="download" size="18" style="margin-right: 8rpx"></u-icon>
          保存到相册
        </u-button>
        <u-button
          plain
          type="info"
          style="margin-top: 20rpx"
          @click="handleClose"
        >
          关闭
        </u-button>
      </view>

      <!-- 提示文字 -->
      <view class="poster-tips">
        <u-icon name="info-circle" size="14" color="#909399"></u-icon>
        <text class="tips-text">保存后可分享到微信朋友圈</text>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logger } from '@/utils/logger'

/**
 * 海报预览组件
 * @description 基于 uView Plus 的 u-popup 封装的海报预览和保存功能
 */

interface Props {
  /** 是否显示 */
  show: boolean
  /** 海报图片路径 */
  posterImage: string
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'save'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  posterImage: ''
})

const emit = defineEmits<Emits>()

// 状态
const saving = ref(false)

/**
 * 处理保存到相册
 */
const handleSave = async () => {
  if (!props.posterImage) {
    uni.showToast({
      title: '海报未生成',
      icon: 'none'
    })
    return
  }

  try {
    saving.value = true

    // 请求保存权限
    const authResult = await uni.authorize({
      scope: 'scope.writePhotosAlbum'
    }).catch(() => {
      // 权限被拒绝，引导用户开启
      return uni.showModal({
        title: '提示',
        content: '需要您授权保存图片到相册',
        confirmText: '去设置'
      }).then((res) => {
        if (res.confirm) {
          uni.openSetting()
        }
        throw new Error('用户拒绝授权')
      })
    })

    // 保存图片
    await uni.saveImageToPhotosAlbum({
      filePath: props.posterImage
    })

    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })

    logger.info('海报保存成功')
    emit('save')

    // 延迟关闭弹窗
    setTimeout(() => {
      handleClose()
    }, 1500)
  } catch (error: unknown) {
    logger.error('海报保存失败', error)

    if (error && typeof error === 'object' && 'errMsg' in error) {
      const errMsg = (error as { errMsg: string }).errMsg
      if (!errMsg.includes('cancel') && !errMsg.includes('deny')) {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }
  } finally {
    saving.value = false
  }
}

/**
 * 处理长按图片
 */
const handleLongPress = () => {
  uni.showToast({
    title: '请点击下方按钮保存',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 处理关闭
 */
const handleClose = () => {
  emit('close')
  emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.poster-preview {
  width: 600rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 20rpx;
}

.poster-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;

  .poster-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10rpx;
  }

  .poster-subtitle {
    font-size: 24rpx;
    color: #909399;
  }
}

.poster-image-wrapper {
  width: 100%;
  min-height: 800rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 16rpx;
  overflow: hidden;

  .poster-image {
    width: 100%;
    display: block;
  }

  .poster-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .loading-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #909399;
    }
  }
}

.poster-actions {
  margin-top: 30rpx;
}

.poster-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  padding: 10rpx 0;

  .tips-text {
    margin-left: 8rpx;
    font-size: 24rpx;
    color: #909399;
  }
}
</style>
