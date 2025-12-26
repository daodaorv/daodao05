<template>
  <el-dialog
    v-model="visible"
    title="异常费用结算"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <!-- 异常信息 -->
      <el-card class="info-card" shadow="never">
        <template #header><span class="card-title">异常信息</span></template>
        <el-descriptions :column="2" size="small">
          <el-descriptions-item label="订单号">
            {{ exceptionInfo?.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="异常类型">
            <el-tag :type="getExceptionTypeTag(exceptionInfo?.type)" size="small">
              {{ getExceptionTypeLabel(exceptionInfo?.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="异常标题" :span="2">
            {{ exceptionInfo?.title }}
          </el-descriptions-item>
          <el-descriptions-item label="预估损失" :span="2">
            <span class="amount-text">¥{{ exceptionInfo?.estimatedLoss?.toFixed(2) || '0.00' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 费用明细 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header-with-action">
            <span class="card-title">费用明细</span>
            <el-button type="primary" size="small" @click="handleAddFeeItem">添加费用项</el-button>
          </div>
        </template>

        <el-empty v-if="form.feeItems.length === 0" description="暂无费用项" :image-size="80" />

        <div v-else class="fee-list">
          <el-card
            v-for="(item, index) in form.feeItems"
            :key="index"
            class="fee-item"
            shadow="hover"
          >
            <template #header>
              <div class="fee-header">
                <span>费用项 {{ index + 1 }}</span>
                <el-button type="danger" size="small" text @click="handleRemoveFeeItem(index)">
                  删除
                </el-button>
              </div>
            </template>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="`费用类型`" :prop="`feeItems.${index}.type`">
                  <el-select v-model="item.type" placeholder="请选择费用类型" style="width: 100%">
                    <el-option label="车辆维修费" value="repair" />
                    <el-option label="车辆清洁费" value="cleaning" />
                    <el-option label="违章罚款" value="violation_fine" />
                    <el-option label="事故赔偿" value="accident_compensation" />
                    <el-option label="拖车费用" value="towing" />
                    <el-option label="停车费用" value="parking" />
                    <el-option label="其他费用" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`费用金额`" :prop="`feeItems.${index}.amount`">
                  <el-input-number
                    v-model="item.amount"
                    :min="0"
                    :max="999999"
                    :precision="2"
                    placeholder="请输入费用金额"
                    style="width: 100%"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="`费用说明`" :prop="`feeItems.${index}.description`">
              <el-input
                v-model="item.description"
                type="textarea"
                :rows="2"
                placeholder="请详细说明费用产生原因"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-card>
        </div>
      </el-card>

      <!-- 结算方式 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">结算方式</span></template>

        <el-form-item label="扣款方式" prop="settlementMethod">
          <el-radio-group v-model="form.settlementMethod">
            <el-radio value="deposit">从押金扣除</el-radio>
            <el-radio value="additional">向用户追加收费</el-radio>
            <el-radio value="compensation">平台承担赔偿</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="结算金额" prop="settlementAmount">
          <el-input-number
            v-model="form.settlementAmount"
            :min="0"
            :max="999999"
            :precision="2"
            :disabled="true"
            style="width: 100%"
          >
            <template #append>元</template>
          </el-input-number>
          <div class="field-tip">
            自动计算：{{ totalFeeAmount.toFixed(2) }} 元
          </div>
        </el-form-item>

        <el-form-item label="结算凭证">
          <div class="upload-section">
            <div class="upload-tip">请上传结算相关凭证（发票、收据等）</div>
            <el-upload
              v-model:file-list="form.vouchers"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="5"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="结算备注">
          <el-input
            v-model="form.settlementNote"
            type="textarea"
            :rows="3"
            placeholder="请输入结算备注（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-card>

      <!-- 费用汇总 -->
      <el-card class="summary-card" shadow="never">
        <template #header><span class="card-title">费用汇总</span></template>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">费用项数量：</span>
            <span class="summary-value">{{ form.feeItems.length }} 项</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">费用总计：</span>
            <span class="summary-value text-danger">¥{{ totalFeeAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">结算方式：</span>
            <span class="summary-value">{{ getSettlementMethodLabel(form.settlementMethod) }}</span>
          </div>
        </div>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确认结算</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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
  feeItems: [] as Array<{
    type: string
    amount: number
    description: string
  }>,
  settlementMethod: 'deposit',
  settlementAmount: 0,
  vouchers: [] as any[],
  settlementNote: ''
})

// 表单验证规则
const formRules: FormRules = {
  settlementMethod: [
    { required: true, message: '请选择扣款方式', trigger: 'change' }
  ],
  settlementAmount: [
    { required: true, message: '请输入结算金额', trigger: 'blur' }
  ]
}

// 计算总费用
const totalFeeAmount = computed(() => {
  return form.feeItems.reduce((sum, item) => sum + (item.amount || 0), 0)
})

// 监听总费用变化，自动更新结算金额
watch(totalFeeAmount, (val) => {
  form.settlementAmount = val
})

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

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

// 获取结算方式文本
const getSettlementMethodLabel = (method: string) => {
  const labelMap: Record<string, string> = {
    deposit: '从押金扣除',
    additional: '向用户追加收费',
    compensation: '平台承担赔偿'
  }
  return labelMap[method] || method
}

// 添加费用项
const handleAddFeeItem = () => {
  form.feeItems.push({
    type: '',
    amount: 0,
    description: ''
  })
}

// 删除费用项
const handleRemoveFeeItem = (index: number) => {
  form.feeItems.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  // 检查是否有费用项
  if (form.feeItems.length === 0) {
    ElMessage.warning('请至少添加一项费用')
    return
  }

  // 检查费用项是否填写完整
  for (let i = 0; i < form.feeItems.length; i++) {
    const item = form.feeItems[i]
    if (!item.type) {
      ElMessage.warning(`请选择费用项 ${i + 1} 的费用类型`)
      return
    }
    if (!item.amount || item.amount <= 0) {
      ElMessage.warning(`请输入费用项 ${i + 1} 的费用金额`)
      return
    }
    if (!item.description) {
      ElMessage.warning(`请填写费用项 ${i + 1} 的费用说明`)
      return
    }
  }

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const submitData = {
        exceptionId: props.exceptionInfo?.id,
        feeItems: form.feeItems,
        settlementMethod: form.settlementMethod,
        settlementAmount: form.settlementAmount,
        vouchers: form.vouchers.map(file => file.url || URL.createObjectURL(file.raw)),
        settlementNote: form.settlementNote
      }

      emit('submit', submitData)
      ElMessage.success('费用结算成功')
      handleClose()
    } catch (error) {
      console.error('费用结算失败:', error)
      ElMessage.error('费用结算失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.feeItems = []
  form.settlementMethod = 'deposit'
  form.settlementAmount = 0
  form.vouchers = []
  form.settlementNote = ''
  visible.value = false
}
</script>

<style scoped lang="scss">
.info-card,
.section-card,
.summary-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
}

.fee-list {
  .fee-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .fee-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.upload-section {
  .upload-tip {
    margin-bottom: 10px;
    color: #909399;
    font-size: 12px;
  }
}

.field-tip {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}

.summary-content {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .summary-label {
      font-size: 14px;
      color: #606266;
    }

    .summary-value {
      font-size: 16px;
      font-weight: 600;
      color: #303133;

      &.text-danger {
        color: #f56c6c;
      }
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

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}
</style>
