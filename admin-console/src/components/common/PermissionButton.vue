<template>
  <component
    :is="componentType"
    v-if="hasPermission"
    v-bind="componentProps"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </component>
  <el-tooltip
    v-else-if="showTooltip"
    :content="tooltipContent"
    placement="top"
  >
    <component
      :is="componentType"
      v-bind="disabledProps"
      disabled
    >
      <slot>{{ label }}</slot>
    </component>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElLink } from 'element-plus'
import type { Component } from 'vue'

// Props 定义
interface Props {
  permission?: string | string[]  // 权限标识（单个或多个）
  permissions?: string[]          // 用户拥有的权限列表
  checkMode?: 'some' | 'every'    // 权限检查模式（满足任一 or 全部满足）
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'large' | 'default' | 'small'
  icon?: Component                // 按钮图标
  plain?: boolean                 // 是否朴素按钮
  round?: boolean                 // 是否圆角按钮
  circle?: boolean                // 是否圆形按钮
  text?: boolean                  // 是否文字按钮
  link?: boolean                  // 是否链接按钮
  loading?: boolean               // 是否加载中
  disabled?: boolean              // 是否禁用
  label?: string                  // 按钮文本
  showTooltip?: boolean           // 无权限时是否显示提示
  tooltipContent?: string         // 提示内容
  hideWhenNoPermission?: boolean  // 无权限时是否隐藏
  customCheck?: (permissions: string[]) => boolean // 自定义权限检查函数
}

const props = withDefaults(defineProps<Props>(), {
  permission: '',
  permissions: () => [],
  checkMode: 'some',
  type: 'default',
  size: 'default',
  plain: false,
  round: false,
  circle: false,
  text: false,
  link: false,
  loading: false,
  disabled: false,
  label: '',
  showTooltip: true,
  tooltipContent: '您没有权限执行此操作',
  hideWhenNoPermission: false,
})

// Emits 定义
const emit = defineEmits<{
  'click': [event: MouseEvent]
  'permission-denied': []
}>()

// 计算属性：权限检查
const hasPermission = computed(() => {
  // 如果没有设置权限要求，默认有权限
  if (!props.permission || (Array.isArray(props.permission) && props.permission.length === 0)) {
    return true
  }

  // 如果有自定义检查函数，使用自定义函数
  if (props.customCheck) {
    return props.customCheck(props.permissions)
  }

  // 标准化权限为数组
  const requiredPermissions = Array.isArray(props.permission)
    ? props.permission
    : [props.permission]

  // 根据检查模式判断权限
  if (props.checkMode === 'every') {
    // 必须拥有所有权限
    return requiredPermissions.every(perm => props.permissions.includes(perm))
  } else {
    // 拥有任一权限即可
    return requiredPermissions.some(perm => props.permissions.includes(perm))
  }
})

// 计算属性：组件类型
const componentType = computed(() => {
  return props.link ? ElLink : ElButton
})

// 计算属性：组件属性
const componentProps = computed(() => {
  const baseProps: any = {
    type: props.type,
    size: props.size,
    icon: props.icon,
    loading: props.loading,
    disabled: props.disabled,
  }

  if (!props.link) {
    // ElButton 特有属性
    baseProps.plain = props.plain
    baseProps.round = props.round
    baseProps.circle = props.circle
    baseProps.text = props.text
  } else {
    // ElLink 特有属性
    baseProps.underline = false
  }

  return baseProps
})

// 计算属性：禁用状态的属性
const disabledProps = computed(() => {
  return {
    ...componentProps.value,
    disabled: true,
  }
})

// 点击处理
const handleClick = (event: MouseEvent) => {
  if (hasPermission.value && !props.disabled) {
    emit('click', event)
  } else if (!hasPermission.value) {
    emit('permission-denied')
  }
}
</script>

<script lang="ts">
export default {
  name: 'PermissionButton',
}
</script>

<style scoped lang="scss">
// 无需额外样式，使用 Element Plus 原生样式
</style>
