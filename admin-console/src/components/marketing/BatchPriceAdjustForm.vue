<!-- @ts-nocheck -->
<template>
  <el-dialog
    v-model="visible"
    title="批量调价"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-alert
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <template #title>
          <div style="font-size: 13px">
            已选择 <strong style="color: #409eff">{{ selectedDates.length }}</strong> 个日期进行批量调价
          </div>
        </template>
      </el-alert>

      <el-form-item label="调整类型" prop="adjustmentType">
        <el-radio-group v-model="formData.adjustmentType">
          <el-radio value="percentage">百分比调整</el-radio>
          <el-radio value="fixed">固定金额调整</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="调整值" prop="adjustmentValue">
        <el-input-number
          v-model="formData.adjustmentValue"
          :precision="2"
          :step="formData.adjustmentType === 'percentage' ? 1 : 10"
          style="width: 200px"
        />
        <span style="margin-left: 10px; color: #909399">
          {{ formData.adjustmentType === 'percentage' ? '%' : '元' }}
        </span>
        <div style="margin-top: 8px; font-size: 12px; color: #909399">
          正数表示涨价，负数表示降价
        </div>
      </el-form-item>

      <el-form-item label="调整原因" prop="reason">
        <el-input
          v-model="formData.reason"
          type="textarea"
          :rows="3"
          placeholder="请输入调整原因（选填）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-divider />

      <el-form-item label="预览效果">
        <div class="preview-container">
          <div class="preview-item">
            <div class="preview-label">原价示例</div>
            <div class="preview-value">¥500</div>
          </div>
          <div class="preview-arrow">→</div>
          <div class="preview-item">
            <div class="preview-label">调整后</div>
            <div class="preview-value" :style="{ color: getAdjustedPriceColor() }">
              ¥{{ calculateAdjustedPrice(500) }}
            </div>
          </div>
          <div class="preview-item">
            <div class="preview-label">变化</div>
            <div class="preview-value" :style="{ color: getAdjustedPriceColor() }">
              {{ formData.adjustmentValue > 0 ? '+' : '' }}{{ formData.adjustmentValue }}{{ formData.adjustmentType === 'percentage' ? '%' : '元' }}
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="选中日期">
        <div class="selected-dates-container">
          <el-tag
            v-for="date in selectedDates.slice(0, 10)"
            :key="date"
            size="small"
            style="margin-right: 8px; margin-bottom: 8px"
          >
            {{ date }}
          </el-tag>
          <el-tag
            v-if="selectedDates.length > 10"
            size="small"
            type="info"
          >
            +{{ selectedDates.length - 10 }} 个日期
          </el-tag>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认调价
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  modelValue: boolean
  selectedDates: string[]
  modelId?: number
  storeId?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  selectedDates: () => []
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 表单数据
const formData = reactive({
  adjustmentType: 'percentage' as 'percentage' | 'fixed',
  adjustmentValue: 0,
  reason: ''
})

// 表单验证规则
const formRules: FormRules = {
  adjustmentType: [
    { required: true, message: '请选择调整类型', trigger: 'change' }
  ],
  adjustmentValue: [
    { required: true, message: '请输入调整值', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('调整值不能为0'))
        } else if (formData.adjustmentType === 'percentage' && Math.abs(value) > 100) {
          callback(new Error('百分比调整值不能超过±100%'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算调整后的价格
const calculateAdjustedPrice = (basePrice: number): string => {
  let adjustedPrice = basePrice

  if (formData.adjustmentType === 'percentage') {
    adjustedPrice = basePrice * (1 + formData.adjustmentValue / 100)
  } else {
    adjustedPrice = basePrice + formData.adjustmentValue
  }

  return adjustedPrice.toFixed(2)
}

// 获取调整后价格的颜色
const getAdjustedPriceColor = (): string => {
  if (formData.adjustmentValue > 0) {
    return '#f56c6c' // 涨价红色
  } else if (formData.adjustmentValue < 0) {
    return '#67c23a' // 降价绿色
  }
  return '#606266' // 不变灰色
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (props.selectedDates.length === 0) {
      ElMessage.warning('请先选择要调价的日期')
      return
    }

    loading.value = true

    // 构建批量调价请求数据
    const requestData = {
      modelId: props.modelId!,
      storeId: props.storeId!,
      dates: props.selectedDates,
      adjustType: 'add_factor' as const,
      factorConfig: {
        factorName: `批量调价-${new Date().toISOString().split('T')[0]}`,
        adjustmentType: formData.adjustmentType,
        adjustmentValue: formData.adjustmentValue,
        priority: 50
      },
      changeReason: formData.reason || '批量调价'
    }

    // 调用批量调价API
    const { batchAdjustPrice } = await import('@/api/priceCalendar')
    const result = await batchAdjustPrice(requestData)

    if (result.success) {
      ElMessage.success(`成功调整 ${result.data.affectedCount} 个日期的价格`)
      emit('success')
      handleClose()
    } else {
      ElMessage.error(result.message || '批量调价失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量调价失败:', error)
      ElMessage.error('批量调价失败')
    }
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.reason = ''
  visible.value = false
}

// 监听对话框打开，重置表单
watch(visible, (newVal) => {
  if (newVal) {
    formRef.value?.clearValidate()
  }
})
</script>

<style scoped lang="scss">
.preview-container {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .preview-label {
      font-size: 12px;
      color: #909399;
    }

    .preview-value {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
    }
  }

  .preview-arrow {
    font-size: 20px;
    color: #409eff;
    font-weight: bold;
  }
}

.selected-dates-container {
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
