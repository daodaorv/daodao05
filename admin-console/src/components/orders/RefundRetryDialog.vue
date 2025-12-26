<template>
  <el-dialog
    v-model="visible"
    title="退款重试"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <!-- 退款信息 -->
      <el-card class="info-card" shadow="never">
        <template #header><span class="card-title">退款信息</span></template>
        <el-descriptions :column="2" size="small">
          <el-descriptions-item label="退款单号">
            {{ refundInfo?.refundNo }}
          </el-descriptions-item>
          <el-descriptions-item label="退款金额">
            <span class="amount-text">¥{{ refundInfo?.amount?.toFixed(2) || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退款方式" :span="2">
            {{ getRefundMethodLabel(refundInfo?.method) }}
          </el-descriptions-item>
          <el-descriptions-item label="重试次数" :span="2">
            <el-tag type="warning" size="small">
              {{ refundInfo?.retryCount || 0 }} / {{ refundInfo?.maxRetryCount || 3 }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 失败原因 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">失败原因</span></template>
        <el-alert
          :title="refundInfo?.failureReason || '未知错误'"
          type="error"
          :closable="false"
          show-icon
        />
      </el-card>

      <!-- 重试选项 -->
      <el-form-item label="重试方式" prop="retryMethod">
        <el-radio-group v-model="form.retryMethod">
          <el-radio value="auto">自动重试（使用原退款方式）</el-radio>
          <el-radio value="manual">手动重试（可调整参数）</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 手动重试选项 -->
      <template v-if="form.retryMethod === 'manual'">
        <el-form-item label="退款渠道" prop="channel">
          <el-select v-model="form.channel" placeholder="请选择退款渠道" style="width: 100%">
            <el-option label="原路退回" value="original" />
            <el-option label="退到余额" value="balance" />
            <el-option label="银行卡" value="bank_card" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.channel === 'bank_card'" label="银行卡号" prop="bankCard">
          <el-input
            v-model="form.bankCard"
            placeholder="请输入银行卡号"
            maxlength="19"
          />
        </el-form-item>
      </template>

      <!-- 重试说明 -->
      <el-form-item label="重试说明" prop="note">
        <el-input
          v-model="form.note"
          type="textarea"
          :rows="3"
          placeholder="请输入重试说明（选填）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- 风险提示 -->
      <el-alert
        title="重要提示"
        type="warning"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul class="tips-list">
            <li>重试前请确认失败原因已解决</li>
            <li>重试次数达到上限后将无法继续自动重试</li>
            <li>建议联系支付平台确认账户状态</li>
            <li v-if="form.retryMethod === 'manual'">手动重试可能需要用户重新确认</li>
          </ul>
        </template>
      </el-alert>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="isRetryLimitReached"
        @click="handleSubmit"
      >
        {{ isRetryLimitReached ? '已达重试上限' : '确认重试' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// Props
interface Props {
  modelValue: boolean
  refundInfo: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  refundInfo: null
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
  retryMethod: 'auto',
  channel: 'original',
  bankCard: '',
  note: ''
})

// 表单验证规则
const formRules: FormRules = {
  retryMethod: [
    { required: true, message: '请选择重试方式', trigger: 'change' }
  ],
  channel: [
    { required: true, message: '请选择退款渠道', trigger: 'change' }
  ],
  bankCard: [
    { required: true, message: '请输入银行卡号', trigger: 'blur' },
    { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', trigger: 'blur' }
  ]
}

// 是否达到重试上限
const isRetryLimitReached = computed(() => {
  if (!props.refundInfo) return false
  return props.refundInfo.retryCount >= props.refundInfo.maxRetryCount
})

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 获取退款方式标签
const getRefundMethodLabel = (method: string) => {
  const labelMap: Record<string, string> = {
    original: '原路退回',
    balance: '退到余额',
    bank_card: '银行卡',
    alipay: '支付宝',
    wechat: '微信'
  }
  return labelMap[method] || method
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  // 检查是否达到重试上限
  if (isRetryLimitReached.value) {
    ElMessage.warning('已达到重试上限，请联系技术支持')
    return
  }

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const submitData = {
        refundId: props.refundInfo?.id,
        retryMethod: form.retryMethod,
        channel: form.retryMethod === 'manual' ? form.channel : undefined,
        bankCard: form.channel === 'bank_card' ? form.bankCard : undefined,
        note: form.note
      }

      emit('submit', submitData)
      ElMessage.success('退款重试已提交')
      handleClose()
    } catch (error) {
      console.error('退款重试失败:', error)
      ElMessage.error('退款重试失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.retryMethod = 'auto'
  form.channel = 'original'
  form.bankCard = ''
  form.note = ''
  visible.value = false
}
</script>

<style scoped lang="scss">
.info-card,
.section-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.amount-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    color: #606266;
    font-size: 13px;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}

:deep(.el-alert) {
  margin-bottom: 16px;
}
</style>
