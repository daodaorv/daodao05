<template>
  <div class="approval-flow">
    <!-- 审批流程时间线 -->
    <el-timeline>
      <el-timeline-item
        v-for="(step, index) in flowSteps"
        :key="index"
        :timestamp="step.timestamp"
        :type="getStepType(step.status)"
        :icon="getStepIcon(step.status)"
        :color="getStepColor(step.status)"
        placement="top"
      >
        <el-card shadow="hover" :class="['step-card', `status-${step.status}`]">
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

          <!-- 审批意见 -->
          <div v-if="step.comment" class="step-comment">
            <div class="comment-label">审批意见：</div>
            <div class="comment-content">{{ step.comment }}</div>
          </div>

          <!-- 附件 -->
          <div v-if="step.attachments && step.attachments.length > 0" class="step-attachments">
            <div class="attachments-label">附件：</div>
            <div class="attachments-list">
              <el-link
                v-for="(file, fileIndex) in step.attachments"
                :key="fileIndex"
                :href="file.url"
                target="_blank"
                :icon="Document"
                type="primary"
              >
                {{ file.name }}
              </el-link>
            </div>
          </div>

          <!-- 时效提醒 -->
          <div v-if="step.deadline && step.status === 'pending'" class="step-deadline">
            <el-icon><Clock /></el-icon>
            <span :class="{ 'deadline-warning': isDeadlineWarning(step.deadline) }">
              {{ getDeadlineText(step.deadline) }}
            </span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 当前审批操作区 -->
    <div v-if="showApprovalActions && currentStep" class="approval-actions">
      <el-card shadow="always">
        <template #header>
          <div class="actions-header">
            <span>审批操作</span>
            <el-tag type="warning">待您审批</el-tag>
          </div>
        </template>

        <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef" label-width="100px">
          <!-- 审批结果 -->
          <el-form-item label="审批结果" prop="result" required>
            <el-radio-group v-model="approvalForm.result">
              <el-radio value="approved">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                通过
              </el-radio>
              <el-radio value="rejected">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                拒绝
              </el-radio>
              <el-radio v-if="allowReturn" value="returned">
                <el-icon color="#e6a23c"><RefreshLeft /></el-icon>
                退回
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 审批意见 -->
          <el-form-item label="审批意见" prop="comment" required>
            <el-input
              v-model="approvalForm.comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审批意见"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <!-- 附件上传 -->
          <el-form-item v-if="allowAttachment" label="附件">
            <el-upload
              v-model:file-list="approvalForm.attachments"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :limit="5"
              :on-exceed="handleExceed"
            >
              <el-button :icon="Upload">上传附件</el-button>
              <template #tip>
                <div class="upload-tip">支持上传最多5个文件，单个文件不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              提交审批
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import {
  Clock,
  Document,
  Upload,
  CircleCheck,
  CircleClose,
  RefreshLeft,
  SuccessFilled,
  CircleCloseFilled,
  Clock as ClockIcon,
  QuestionFilled,
} from '@element-plus/icons-vue'

// 审批步骤状态类型
type StepStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'processing'

// 审批步骤接口
interface ApprovalStep {
  name: string                    // 步骤名称
  status: StepStatus              // 步骤状态
  operator?: string               // 操作人
  operatorAvatar?: string         // 操作人头像
  timestamp?: string              // 操作时间
  comment?: string                // 审批意见
  attachments?: Array<{           // 附件
    name: string
    url: string
  }>
  deadline?: string               // 截止时间
}

// Props 定义
interface Props {
  steps: ApprovalStep[]           // 审批流程步骤
  currentStepIndex?: number       // 当前步骤索引
  showApprovalActions?: boolean   // 是否显示审批操作区
  allowReturn?: boolean           // 是否允许退回
  allowAttachment?: boolean       // 是否允许上传附件
  uploadUrl?: string              // 附件上传地址
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  currentStepIndex: -1,
  showApprovalActions: false,
  allowReturn: true,
  allowAttachment: true,
  uploadUrl: '/api/upload/file',
})

// Emits 定义
const emit = defineEmits<{
  'submit': [data: {
    result: 'approved' | 'rejected' | 'returned'
    comment: string
    attachments: any[]
  }]
}>()

// 响应式数据
const approvalFormRef = ref<FormInstance>()
const submitting = ref(false)
const approvalForm = ref({
  result: '' as 'approved' | 'rejected' | 'returned' | '',
  comment: '',
  attachments: [] as any[],
})

// 表单验证规则
const approvalRules: FormRules = {
  result: [
    { required: true, message: '请选择审批结果', trigger: 'change' },
  ],
  comment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' },
    { min: 5, message: '审批意见至少5个字符', trigger: 'blur' },
  ],
}

// 计算属性
const flowSteps = computed(() => props.steps)
const currentStep = computed(() => {
  if (props.currentStepIndex >= 0 && props.currentStepIndex < props.steps.length) {
    return props.steps[props.currentStepIndex]
  }
  return null
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
  }
})

// 获取步骤类型
const getStepType = (status: StepStatus): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const typeMap: Record<StepStatus, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'info',
    approved: 'success',
    rejected: 'danger',
    returned: 'warning',
    processing: 'primary',
  }
  return typeMap[status] || 'info'
}

// 获取步骤图标
const getStepIcon = (status: StepStatus) => {
  const iconMap: Record<StepStatus, any> = {
    pending: QuestionFilled,
    approved: SuccessFilled,
    rejected: CircleCloseFilled,
    returned: RefreshLeft,
    processing: ClockIcon,
  }
  return iconMap[status] || QuestionFilled
}

// 获取步骤颜色
const getStepColor = (status: StepStatus) => {
  const colorMap: Record<StepStatus, string> = {
    pending: '#909399',
    approved: '#67c23a',
    rejected: '#f56c6c',
    returned: '#e6a23c',
    processing: '#409eff',
  }
  return colorMap[status] || '#909399'
}

// 获取状态标签类型
const getStatusTagType = (status: StepStatus): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const tagTypeMap: Record<any, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'info',
    approved: 'success',
    rejected: 'danger',
    returned: 'warning',
    processing: 'primary',
  }
  return tagTypeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: StepStatus) => {
  const textMap: Record<StepStatus, string> = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    returned: '已退回',
    processing: '审批中',
  }
  return textMap[status] || '未知'
}

// 判断是否临近截止时间
const isDeadlineWarning = (deadline: string) => {
  const deadlineTime = new Date(deadline).getTime()
  const now = Date.now()
  const diff = deadlineTime - now
  const oneDayMs = 24 * 60 * 60 * 1000
  return diff > 0 && diff < oneDayMs // 距离截止时间不足1天
}

// 获取截止时间文本
const getDeadlineText = (deadline: string) => {
  const deadlineTime = new Date(deadline).getTime()
  const now = Date.now()
  const diff = deadlineTime - now

  if (diff < 0) {
    return '已超期'
  }

  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

  if (days > 0) {
    return `剩余 ${days} 天 ${hours} 小时`
  } else if (hours > 0) {
    return `剩余 ${hours} 小时`
  } else {
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    return `剩余 ${minutes} 分钟`
  }
}

// 文件超出数量限制
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多只能上传5个附件')
}

// 提交审批
const handleSubmit = async () => {
  if (!approvalFormRef.value) return

  await approvalFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await ElMessageBox.confirm(
        `确定要${approvalForm.value.result === 'approved' ? '通过' : approvalForm.value.result === 'rejected' ? '拒绝' : '退回'}此审批吗？`,
        '确认操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )

      submitting.value = true

      emit('submit', {
        result: approvalForm.value.result as 'approved' | 'rejected' | 'returned',
        comment: approvalForm.value.comment,
        attachments: approvalForm.value.attachments,
      })

      ElMessage.success('审批提交成功')
      handleReset()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('审批提交失败:', error)
      }
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
const handleReset = () => {
  approvalFormRef.value?.resetFields()
  approvalForm.value = {
    result: '',
    comment: '',
    attachments: [],
  }
}
</script>

<script lang="ts">
export default {
  name: 'ApprovalFlow',
}
</script>

<style scoped lang="scss">
.approval-flow {
  .step-card {
    margin-bottom: 0;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.status-approved {
      border-left: 3px solid #67c23a;
    }

    &.status-rejected {
      border-left: 3px solid #f56c6c;
    }

    &.status-returned {
      border-left: 3px solid #e6a23c;
    }

    &.status-processing {
      border-left: 3px solid #409eff;
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

    .step-comment {
      margin-bottom: 12px;

      .comment-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 4px;
      }

      .comment-content {
        padding: 8px 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
      }
    }

    .step-attachments {
      margin-bottom: 12px;

      .attachments-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .attachments-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
    }

    .step-deadline {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background-color: #fef0f0;
      border-radius: 4px;
      font-size: 14px;
      color: #f56c6c;

      .deadline-warning {
        font-weight: 600;
        animation: blink 1.5s infinite;
      }
    }
  }

  .approval-actions {
    margin-top: 24px;

    .actions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }

    :deep(.el-radio) {
      display: flex;
      align-items: center;
      margin-right: 24px;

      .el-radio__label {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .upload-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
