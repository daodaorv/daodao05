<!-- @ts-nocheck -->
<template>
  <div class="batch-operation">
    <el-card shadow="never" :body-style="{ padding: '12px 16px' }">
      <div class="batch-content">
        <!-- 左侧：选中信息 -->
        <div class="batch-left">
          <el-checkbox
            v-if="showSelectAll"
            v-model="selectAll"
            :indeterminate="indeterminate"
    // @ts-ignore
            @change="handleSelectAllChange"
          >
            全选
          </el-checkbox>
          <span class="selected-info">
            已选择 <span class="selected-count">{{ selectedCount }}</span> 项
          </span>
          <el-button
            v-if="showClearSelection && selectedCount > 0"
            type="text"
            size="small"
            @click="handleClearSelection"
          >
            清空
          </el-button>
        </div>

        <!-- 右侧：批量操作按钮 -->
        <div class="batch-right">
          <template v-for="(action, index) in visibleActions" :key="index">
            <!-- 普通按钮 -->
            <el-button
              v-if="!action.dropdown"
              :type="action.type || 'default'"
              :icon="action.icon"
              :size="action.size || 'small'"
              :disabled="action.disabled || selectedCount === 0"
              :loading="action.loading"
              @click="handleAction(action)"
            >
              {{ action.label }}
            </el-button>

            <!-- 下拉菜单按钮 -->
            <el-dropdown
              v-else
              :disabled="action.disabled || selectedCount === 0"
              @command="(command) => handleDropdownCommand(action, command)"
            >
              <el-button
                :type="action.type || 'default'"
                :icon="action.icon"
                :size="action.size || 'small'"
                :disabled="action.disabled || selectedCount === 0"
              >
                {{ action.label }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, itemIndex) in action.items"
                    :key="itemIndex"
                    :command="item.command"
                    :disabled="item.disabled"
                    :divided="item.divided"
                  >
                    <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>

          <!-- 更多操作 -->
          <el-dropdown
            v-if="moreActions.length > 0"
            @command="handleMoreCommand"
          >
            <el-button size="small">
              更多
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(action, index) in moreActions"
                  :key="index"
                  :command="index"
                  :disabled="action.disabled || selectedCount === 0"
                  :divided="action.divided"
                >
                  <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
                  {{ action.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>

    <!-- 确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      :title="confirmTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="confirm-content">
        <el-icon class="confirm-icon" :class="confirmType">
          <component :is="confirmIconComponent" />
        </el-icon>
        <div class="confirm-message">
          {{ confirmMessage }}
        </div>
        <div v-if="showSelectedItems" class="selected-items">
          <div class="items-title">将要操作的项目：</div>
          <div class="items-list">
            <el-tag
              v-for="(item, index) in selectedItemsPreview"
              :key="index"
              size="small"
              style="margin: 4px"
            >
              {{ item }}
            </el-tag>
            <span v-if="selectedCount > maxPreviewItems" class="more-items">
              等 {{ selectedCount }} 项
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button
          :type="confirmType === 'danger' ? 'danger' : 'primary'"
          :loading="confirmLoading"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  WarningFilled,
  InfoFilled,
  SuccessFilled,
  CircleCloseFilled,
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

// 批量操作配置接口
export interface BatchAction {
  label: string                   // 按钮文本
  command?: string                // 操作命令
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  icon?: Component                // 按钮图标
  size?: 'large' | 'default' | 'small'
  disabled?: boolean              // 是否禁用
  loading?: boolean               // 加载状态
  confirm?: boolean               // 是否需要确认
  confirmTitle?: string           // 确认对话框标题
  confirmMessage?: string         // 确认对话框消息
  confirmType?: 'warning' | 'info' | 'success' | 'danger'
  showSelectedItems?: boolean     // 是否显示选中项
  dropdown?: boolean              // 是否为下拉菜单
  items?: Array<{                 // 下拉菜单项
    label: string
    command: string
    icon?: Component
    disabled?: boolean
    divided?: boolean
  }>
  divided?: boolean               // 是否显示分割线
  onClick?: (selectedIds: any[], selectedRows: any[]) => void | Promise<void>
}

// Props 定义
interface Props {
  selectedIds?: any[]             // 选中的 ID 数组
  selectedRows?: any[]            // 选中的行数据数组
  total?: number                  // 总数据量
  actions?: BatchAction[]         // 批量操作配置
  maxVisibleActions?: number      // 最大显示操作数
  showSelectAll?: boolean         // 是否显示全选
  showClearSelection?: boolean    // 是否显示清空选择
  maxPreviewItems?: number        // 最大预览项数
  getItemLabel?: (row: any) => string // 获取项目标签的方法
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
  selectedRows: () => [],
  total: 0,
  actions: () => [],
  maxVisibleActions: 5,
  showSelectAll: true,
  showClearSelection: true,
  maxPreviewItems: 10,
  getItemLabel: (row: any) => row.name || row.title || row.id || '未命名',
})

// Emits 定义
const emit = defineEmits<{
  'select-all': [selected: boolean]
  'clear-selection': []
  'action': [action: BatchAction, selectedIds: any[], selectedRows: any[]]
}>()

// 响应式数据
const selectAll = ref(false)
const indeterminate = ref(false)
const confirmDialogVisible = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmType = ref<'warning' | 'info' | 'success' | 'danger'>('warning')
const confirmLoading = ref(false)
const showSelectedItems = ref(false)
const currentAction = ref<BatchAction | null>(null)

// 计算属性
const selectedCount = computed(() => props.selectedIds.length)

const visibleActions = computed(() => {
  return props.actions.slice(0, props.maxVisibleActions)
})

const moreActions = computed(() => {
  return props.actions.slice(props.maxVisibleActions)
})

const selectedItemsPreview = computed(() => {
  return props.selectedRows
    .slice(0, props.maxPreviewItems)
    .map(row => props.getItemLabel(row))
})

const confirmIconComponent = computed(() => {
  const iconMap = {
    warning: WarningFilled,
    info: InfoFilled,
    success: SuccessFilled,
    danger: CircleCloseFilled,
  }
  return iconMap[confirmType.value] || InfoFilled
})

// 监听选中数量变化，更新全选状态
const updateSelectAllState = () => {
  if (selectedCount.value === 0) {
    selectAll.value = false
    indeterminate.value = false
  } else if (selectedCount.value === props.total) {
    selectAll.value = true
    indeterminate.value = false
  } else {
    selectAll.value = false
    indeterminate.value = true
  }
}

// 全选变化
const handleSelectAllChange = (value: boolean) => {
  emit('select-all', value)
}

// 清空选择
const handleClearSelection = () => {
  emit('clear-selection')
}

// 处理操作
const handleAction = async (action: BatchAction) => {
  if (selectedCount.value === 0) {
    ElMessage.warning('请先选择要操作的项目')
    return
  }

  currentAction.value = action

  // 如果需要确认
  if (action.confirm) {
    confirmTitle.value = action.confirmTitle || '确认操作'
    confirmMessage.value = action.confirmMessage || `确定要对选中的 ${selectedCount.value} 项执行此操作吗？`
    confirmType.value = action.confirmType || 'warning'
    showSelectedItems.value = action.showSelectedItems || false
    confirmDialogVisible.value = true
    return
  }

  // 直接执行
  await executeAction(action)
}

// 执行操作
const executeAction = async (action: BatchAction) => {
  try {
    if (action.onClick) {
      await action.onClick(props.selectedIds, props.selectedRows)
    }
    emit('action', action, props.selectedIds, props.selectedRows)
  } catch (error) {
    console.error('批量操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 确认对话框确认
const handleConfirm = async () => {
  if (!currentAction.value) return

  confirmLoading.value = true
  try {
    await executeAction(currentAction.value)
    confirmDialogVisible.value = false
  } finally {
    confirmLoading.value = false
  }
}

// 处理下拉菜单命令
const handleDropdownCommand = (action: BatchAction, command: string) => {
  const item = action.items?.find(i => i.command === command)
  if (item) {
    const dropdownAction: BatchAction = {
      ...action,
      label: item.label,
      command: command,
      icon: item.icon,
    }
    handleAction(dropdownAction)
  }
}

// 处理更多操作命令
const handleMoreCommand = (index: number) => {
  const action = moreActions.value[index]
  if (action) {
    handleAction(action)
  }
}

// 监听选中数量变化
updateSelectAllState()

// 暴露方法供父组件调用
defineExpose({
  clearSelection: handleClearSelection,
})
</script>

<script lang="ts">
export default {
  name: 'BatchOperation',
}
</script>

<style scoped lang="scss">
.batch-operation {
  margin-bottom: 16px;

  :deep(.el-card) {
    border-radius: 4px;
    background-color: #f5f7fa;
  }

  .batch-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .batch-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .selected-info {
        font-size: 14px;
        color: #606266;

        .selected-count {
          font-weight: 600;
          color: #409eff;
          font-size: 16px;
        }
      }
    }

    .batch-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .confirm-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    .confirm-icon {
      font-size: 48px;
      margin-bottom: 16px;

      &.warning {
        color: #e6a23c;
      }

      &.info {
        color: #409eff;
      }

      &.success {
        color: #67c23a;
      }

      &.danger {
        color: #f56c6c;
      }
    }

    .confirm-message {
      font-size: 16px;
      color: #303133;
      text-align: center;
      margin-bottom: 16px;
    }

    .selected-items {
      width: 100%;
      margin-top: 16px;
      padding: 12px;
      background-color: #f5f7fa;
      border-radius: 4px;

      .items-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }

      .items-list {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;

        .more-items {
          font-size: 12px;
          color: #909399;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
