<!-- @ts-nocheck -->
<template>
  <div class="status-timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(step, index) in timelineSteps"
        :key="index"
        :timestamp="step.timestamp"
        :type="getStepType(step.status)"
        :icon="getStepIcon(step.status)"
        :color="getStepColor(step.status)"
        :hollow="step.status === 'pending'"
        :size="step.status === 'current' ? 'large' : 'normal'"
        placement="top"
      >
        <el-card shadow="hover" :class="['timeline-card', `status-${step.status}`]">
          <!-- 步骤标题 -->
          <div class="step-header">
            <div class="step-title">
              <span class="step-name">{{ step.name }}</span>
              <el-tag :type="getStatusTagType(step.status)" size="small">
                {{ getStatusText(step.status) }}
              </el-tag>
            </div>
            <div v-if="step.operator" class="step-operator">
              <el-avatar :size="24" :src="step.operatorAvatar">
                {{ step.operator.charAt(0) }}
              </el-avatar>
              <span>{{ step.operator }}</span>
            </div>
          </div>

          <!-- 步骤描述 -->
          <div v-if="step.description" class="step-description">
            {{ step.description }}
          </div>

          <!-- 步骤详情 -->
          <div v-if="step.details && step.details.length > 0" class="step-details">
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item
                v-for="(detail, detailIndex) in step.details"
                :key="detailIndex"
                :label="detail.label"
              >
                {{ detail.value }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 附加信息 -->
          <div v-if="step.extra" class="step-extra">
            <el-alert
              :title="step.extra.title"
              :type="step.extra.type || 'info'"
              :closable="false"
              show-icon
            >
              {{ step.extra.message }}
            </el-alert>
          </div>

          <!-- 预计时间（待处理状态） -->
          <div v-if="step.status === 'pending' && step.estimatedTime" class="step-estimated">
            <el-icon><Clock /></el-icon>
            <span>预计 {{ step.estimatedTime }}</span>
          </div>

          <!-- 耗时（已完成状态） -->
          <div v-if="step.status === 'completed' && step.duration" class="step-duration">
            <el-icon><Timer /></el-icon>
            <span>耗时 {{ step.duration }}</span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 空状态 -->
    <el-empty
      v-if="!timelineSteps || timelineSteps.length === 0"
      description="暂无流程记录"
      :image-size="120"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import {
  Clock,
  Timer,
  SuccessFilled,
  CircleCloseFilled,
  Clock as ClockIcon,
  Loading,
  QuestionFilled,
} from '@element-plus/icons-vue'

// 步骤状态类型
type StepStatus = 'pending' | 'current' | 'completed' | 'failed' | 'cancelled'

// 步骤详情接口
interface StepDetail {
  label: string
  value: string | number
}

// 步骤附加信息接口
interface StepExtra {
  title: string
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
}

// 时间线步骤接口
export interface TimelineStep {
  name: string                    // 步骤名称
  status: StepStatus              // 步骤状态
  timestamp?: string              // 时间戳
  operator?: string               // 操作人
  operatorAvatar?: string         // 操作人头像
  description?: string            // 步骤描述
  details?: StepDetail[]          // 步骤详情
  extra?: StepExtra               // 附加信息
  estimatedTime?: string          // 预计时间（待处理状态）
  duration?: string               // 耗时（已完成状态）
}

// Props 定义
interface Props {
  steps: TimelineStep[]           // 时间线步骤数组
  reverse?: boolean               // 是否倒序显示
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  reverse: false,
})

// 计算属性：处理步骤顺序
const timelineSteps = computed(() => {
  return props.reverse ? [...props.steps].reverse() : props.steps
})

// 获取步骤类型
const getStepType = (status: StepStatus): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const typeMap: Record<StepStatus, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'info',
    current: 'primary',
    completed: 'success',
    failed: 'danger',
    cancelled: 'warning',
  }
  return typeMap[status] || 'info'
}

// 获取步骤图标
const getStepIcon = (status: StepStatus) => {
  const iconMap: Record<StepStatus, any> = {
    pending: QuestionFilled,
    current: Loading,
    completed: SuccessFilled,
    failed: CircleCloseFilled,
    cancelled: ClockIcon,
  }
  return iconMap[status] || QuestionFilled
}

// 获取步骤颜色
const getStepColor = (status: StepStatus): string => {
  const colorMap: Record<StepStatus, string> = {
    pending: '#909399',
    current: '#409eff',
    completed: '#67c23a',
    failed: '#f56c6c',
    cancelled: '#e6a23c',
  }
  return colorMap[status] || '#909399'
}

// 获取状态标签类型
const getStatusTagType = (status: StepStatus): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const tagTypeMap: Record<StepStatus, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'info',
    current: 'primary',
    completed: 'success',
    failed: 'danger',
    cancelled: 'warning',
  }
  return tagTypeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: StepStatus): string => {
  const textMap: Record<StepStatus, string> = {
    pending: '待处理',
    current: '进行中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消',
  }
  return textMap[status] || '未知'
}
</script>

<script lang="ts">
export default {
  name: 'StatusTimeline',
}
</script>

<style scoped lang="scss">
.status-timeline {
  padding: 20px 0;

  :deep(.el-timeline) {
    padding-left: 0;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 32px;
  }

  :deep(.el-timeline-item__timestamp) {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
  }

  .timeline-card {
    margin-bottom: 0;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.status-completed {
      border-left: 3px solid #67c23a;
    }

    &.status-failed {
      border-left: 3px solid #f56c6c;
    }

    &.status-current {
      border-left: 3px solid #409eff;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
    }

    &.status-cancelled {
      border-left: 3px solid #e6a23c;
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .step-title {
        display: flex;
        align-items: center;
        gap: 12px;

        .step-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .step-operator {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #606266;
      }
    }

    .step-description {
      margin-bottom: 12px;
      padding: 8px 12px;
      background-color: #f5f7fa;
      border-radius: 4px;
      font-size: 14px;
      color: #606266;
      line-height: 1.6;
    }

    .step-details {
      margin-bottom: 12px;

      :deep(.el-descriptions) {
        .el-descriptions__label {
          width: 120px;
          background-color: #fafafa;
        }
      }
    }

    .step-extra {
      margin-bottom: 12px;

      :deep(.el-alert) {
        padding: 8px 12px;
      }
    }

    .step-estimated,
    .step-duration {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background-color: #f0f9ff;
      border-radius: 4px;
      font-size: 13px;
      color: #409eff;

      .el-icon {
        font-size: 14px;
      }
    }

    .step-duration {
      background-color: #f0f9ff;
      color: #67c23a;
    }
  }

  :deep(.el-empty) {
    padding: 40px 0;
  }
}
</style>
