<template>
  <view class="empty-state">
    <u-empty
      :text="title"
      :icon="iconUrl"
      :mode="mode"
      :icon-size="iconSize"
      :text-size="textSize"
    >
      <template v-if="description || buttonText" #bottom>
        <text v-if="description" class="empty-description">{{ description }}</text>
        <u-button
          v-if="buttonText"
          :text="buttonText"
          :type="buttonType"
          size="small"
          @click="handleClick"
          style="margin-top: 20rpx;"
        ></u-button>
      </template>
    </u-empty>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    // 图标（emoji 或 图标名称）
    icon: {
      type: String,
      default: '📭'
    },
    // 图标 URL（优先级高于 icon）
    iconUrl: {
      type: String,
      default: ''
    },
    // 模式：data（数据为空）、search（搜索为空）、error（错误）、network（网络错误）、permission（无权限）、page（页面不存在）、car（车辆）
    mode: {
      type: String,
      default: 'data'
    },
    // 标题
    title: {
      type: String,
      default: '暂无数据'
    },
    // 描述文字
    description: {
      type: String,
      default: ''
    },
    // 按钮文字
    buttonText: {
      type: String,
      default: ''
    },
    // 按钮类型
    buttonType: {
      type: String,
      default: 'primary'
    },
    // 图标大小
    iconSize: {
      type: [String, Number],
      default: 160
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: 28
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.empty-state {
  padding: 60rpx 40rpx;
}

.empty-description {
  display: block;
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
  text-align: center;
  margin-top: 20rpx;
  max-width: 500rpx;
}
</style>
