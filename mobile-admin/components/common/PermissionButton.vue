<template>
  <u-button
    v-if="hasPermission"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot></slot>
  </u-button>
</template>

<script>
import { hasPermission, hasAnyPermission, handlePermissionDenied } from '@/utils/permission'

/**
 * 权限按钮组件
 * 根据用户权限显示或隐藏按钮
 *
 * 使用示例：
 * <PermissionButton permission="create_order" type="primary">创建订单</PermissionButton>
 * <PermissionButton :permissions="['update_order', 'delete_order']" type="error">删除</PermissionButton>
 */
export default {
  name: 'PermissionButton',

  props: {
    // 单个权限
    permission: {
      type: String,
      default: ''
    },
    // 多个权限（满足任一即可）
    permissions: {
      type: Array,
      default: () => []
    },
    // 是否需要所有权限
    requireAll: {
      type: Boolean,
      default: false
    },
    // 无权限时是否显示禁用状态（而不是隐藏）
    showDisabled: {
      type: Boolean,
      default: false
    },
    // 无权限时的提示消息
    deniedMessage: {
      type: String,
      default: '您没有权限执行此操作'
    }
  },

  computed: {
    hasPermission() {
      // 如果设置了showDisabled，总是显示按钮
      if (this.showDisabled) {
        return true
      }

      // 检查单个权限
      if (this.permission) {
        return hasPermission(this.permission)
      }

      // 检查多个权限
      if (this.permissions.length > 0) {
        if (this.requireAll) {
          // 需要所有权限
          return this.permissions.every(p => hasPermission(p))
        } else {
          // 需要任一权限
          return hasAnyPermission(this.permissions)
        }
      }

      // 没有设置权限要求，默认显示
      return true
    },

    isDisabled() {
      if (!this.showDisabled) {
        return false
      }

      // 检查是否有权限
      if (this.permission) {
        return !hasPermission(this.permission)
      }

      if (this.permissions.length > 0) {
        if (this.requireAll) {
          return !this.permissions.every(p => hasPermission(p))
        } else {
          return !hasAnyPermission(this.permissions)
        }
      }

      return false
    }
  },

  methods: {
    handleClick(event) {
      // 如果没有权限，显示提示
      if (this.isDisabled) {
        handlePermissionDenied(this.deniedMessage)
        return
      }

      // 触发点击事件
      this.$emit('click', event)
    }
  }
}
</script>
