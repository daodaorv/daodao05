<template>
  <el-dialog
    v-model="visible"
    title="分配异常"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
    >
      <!-- 异常信息 -->
      <el-card class="info-card" shadow="never">
        <template #header><span class="card-title">异常信息</span></template>
        <el-descriptions :column="2" size="small">
          <el-descriptions-item label="异常类型">
            <el-tag :type="getExceptionTypeTag(exceptionInfo?.type)" size="small">
              {{ getExceptionTypeLabel(exceptionInfo?.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前优先级">
            <el-tag :type="getPriorityTag(exceptionInfo?.priority)" size="small">
              {{ getPriorityLabel(exceptionInfo?.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="异常标题" :span="2">
            {{ exceptionInfo?.title }}
          </el-descriptions-item>
          <el-descriptions-item label="异常描述" :span="2">
            {{ exceptionInfo?.description }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 分配信息 -->
      <el-form-item label="分配给" prop="assignedTo" style="margin-top: 20px">
        <el-select
          v-model="form.assignedTo"
          placeholder="请选择处理人员"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="staff in staffList"
            :key="staff.id"
            :label="staff.name"
            :value="staff.id"
          >
            <span style="float: left">{{ staff.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ staff.department }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="处理期限" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="请选择处理期限"
          style="width: 100%"
          :disabled-date="disabledDate"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="优先级调整" prop="priority">
        <el-radio-group v-model="form.priority">
          <el-radio value="low">低</el-radio>
          <el-radio value="medium">中</el-radio>
          <el-radio value="high">高</el-radio>
          <el-radio value="critical">紧急</el-radio>
        </el-radio-group>
        <div class="field-tip">
          当前优先级：{{ getPriorityLabel(exceptionInfo?.priority) }}
        </div>
      </el-form-item>

      <el-form-item label="分配说明" prop="assignNote">
        <el-input
          v-model="form.assignNote"
          type="textarea"
          :rows="4"
          placeholder="请输入分配说明（选填）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="是否通知">
        <el-switch
          v-model="form.notifyAssignee"
          active-text="发送通知"
          inactive-text="不通知"
        />
        <div class="field-tip">
          开启后将通过系统消息和邮件通知处理人员
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确认分配</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// Props
interface Props {
  modelValue: boolean
  exceptionInfo: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  exceptionInfo: null
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

// 响应式数据
const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  assignedTo: null as number | null,
  deadline: '',
  priority: 'medium',
  assignNote: '',
  notifyAssignee: true
})

// 表单验证规则
const formRules: FormRules = {
  assignedTo: [
    { required: true, message: '请选择处理人员', trigger: 'change' }
  ],
  deadline: [
    { required: true, message: '请选择处理期限', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
}

// 员工列表（Mock数据，实际应从API获取）
const staffList = ref([
  { id: 1, name: '张三', department: '客服部' },
  { id: 2, name: '李四', department: '客服部' },
  { id: 3, name: '王五', department: '运营部' },
  { id: 4, name: '赵六', department: '运营部' },
  { id: 5, name: '钱七', department: '技术部' }
])

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.exceptionInfo) {
    // 初始化表单数据
    form.priority = props.exceptionInfo.priority || 'medium'
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用昨天之前的日期
}

// 获取异常类型标签
const getExceptionTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    damage: 'danger',
    overdue: 'warning',
    violation: 'warning',
    accident: 'danger',
    complaint: 'info',
    payment: 'warning',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取异常类型文本
const getExceptionTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    damage: '车辆损坏',
    overdue: '逾期未还',
    violation: '交通违章',
    accident: '交通事故',
    complaint: '客户投诉',
    payment: '支付纠纷',
    other: '其他'
  }
  return labelMap[type] || type
}

// 获取优先级标签
const getPriorityTag = (priority: string) => {
  const tagMap: Record<string, string> = {
    low: 'info',
    medium: 'primary',
    high: 'warning',
    critical: 'danger'
  }
  return tagMap[priority] || 'info'
}

// 获取优先级文本
const getPriorityLabel = (priority: string) => {
  const labelMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急'
  }
  return labelMap[priority] || priority
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const submitData = {
        exceptionId: props.exceptionInfo?.id,
        assignedTo: form.assignedTo,
        deadline: form.deadline,
        priority: form.priority,
        assignNote: form.assignNote,
        notifyAssignee: form.notifyAssignee
      }

      emit('submit', submitData)
      ElMessage.success('异常分配成功')
      handleClose()
    } catch (error) {
      console.error('异常分配失败:', error)
      ElMessage.error('异常分配失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.assignedTo = null
  form.deadline = ''
  form.priority = 'medium'
  form.assignNote = ''
  form.notifyAssignee = true
  visible.value = false
}
</script>

<style scoped lang="scss">
.info-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.field-tip {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}

:deep(.el-descriptions__label) {
  width: 100px;
}
</style>
