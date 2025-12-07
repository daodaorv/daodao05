<template>
  <view v-if="hasPermission">
    <slot></slot>
  </view>
  <view v-else-if="showFallback">
    <slot name="fallback">
      <view class="permission-denied">
        <text class="denied-icon">🔒</text>
        <text class="denied-text">{{ deniedMessage }}</text>
      </view>
    </slot>
  </view>
</template>

<script>
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permission'

/**
 * 权限视图组件
 * 根据用户权限显示或隐藏内容
 *
 * 使用示例：
 * <PermissionView permission="view_finance">
 *   <view>财务数据</view>
 * </PermissionView>
 *
 * <PermissionView :permissions="['update_order', 'delete_order']" show-fallback>
 *   <view>订单操作</view>
 *   <template #fallback>
 *     <view>您没有权限查看此内容</view>
 *   </template>
 * </PermissionView>
 */
export default {
  name: 'PermissionView',

  props: {
    // 单个权限
    permission: {
      type: String,
      default: ''
    },
    // 多个权限
    permissions: {
      type: Array,
      default: () => []
    },
    // 是否需要所有权限
    requireAll: {
      type: Boolean,
      default: false
    },
    // 无权限时是否显示fallback内容
    showFallback: {
      type: Boolean,
      default: false
    },
    // 无权限时的提示消息
    deniedMessage: {
      type: String,
      default: '您没有权限查看此内容'
    }
  },

  computed: {
    hasPermission() {
      // 检查单个权限
      if (this.permission) {
        return hasPermission(this.permission)
      }

      // 检查多个权限
      if (this.permissions.length > 0) {
        if (this.requireAll) {
          // 需要所有权限
          return hasAllPermissions(this.permissions)
        } else {
          // 需要任一权限
          return hasAnyPermission(this.permissions)
        }
      }

      // 没有设置权限要求，默认显示
      return true
    }
  }
}
</script>

<style scoped>
.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.denied-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.denied-text {
  font-size: 28rpx;
  color: #999;
  line-height: 1.6;
}
</style>
