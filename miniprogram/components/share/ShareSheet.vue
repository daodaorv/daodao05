<template>
  <u-action-sheet
    :show="show"
    :actions="actions"
    title="分享到"
    :description="description"
    @select="handleSelect"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 分享面板组件
 * @description 基于 uView Plus 的 u-action-sheet 封装的分享选项面板
 */

interface Props {
  /** 是否显示 */
  show: boolean
  /** 分享描述 */
  description?: string
  /** 是否显示复制链接选项 */
  showCopyLink?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'select', index: number): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  description: '选择分享方式',
  showCopyLink: true
})

const emit = defineEmits<Emits>()

/**
 * 分享选项配置
 */
const actions = computed(() => {
  const baseActions = [
    {
      name: '分享给朋友',
      subname: '分享小程序卡片',
      icon: 'share-fill',
      color: '#FF9F29'
    },
    {
      name: '生成海报',
      subname: '保存图片分享到朋友圈',
      icon: 'photo-fill',
      color: '#FFB84D'
    }
  ]

  if (props.showCopyLink) {
    baseActions.push({
      name: '复制链接',
      subname: '复制小程序路径',
      icon: 'copy-fill',
      color: '#909399'
    })
  }

  return baseActions
})

/**
 * 处理选项选择
 */
const handleSelect = (item: any) => {
  console.log('ShareSheet handleSelect 被调用', item)

  let index: number

  // 如果直接是数字索引
  if (typeof item === 'number') {
    index = item
  }
  // 如果是对象，通过匹配 name 和 icon 找到索引
  else if (item && typeof item === 'object') {
    index = actions.value.findIndex(action =>
      action.name === item.name && action.icon === item.icon
    )

    if (index === -1) {
      console.error('无法找到匹配的分享选项', item)
      return
    }
  }
  // 其他情况
  else {
    console.error('无法解析分享选项', item)
    return
  }

  console.log('解析后的索引', index)
  emit('select', index)
  emit('update:show', false)
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
.share-description {
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #909399;
}
</style>
