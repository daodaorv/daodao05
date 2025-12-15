<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :disabled="disabled"
    >
      <template v-for="field in fields" :key="field.prop">
        <!-- 行布局 -->
        <el-row v-if="field.type === 'row'" :gutter="gutter">
          <el-col
            v-for="col in field.columns"
            :key="col.prop"
            :span="col.span || 12"
          >
            <FormItem :field="col" :form-data="formData">
              <template v-if="col.slot" #default>
                <slot :name="col.slot" :form-data="formData" :field="col" />
              </template>
            </FormItem>
          </el-col>
        </el-row>

        <!-- 分组标题 -->
        <div v-else-if="field.type === 'divider'" class="form-divider">
          <el-divider content-position="left">{{ field.label }}</el-divider>
        </div>

        <!-- 单个表单项 -->
        <FormItem v-else :field="field" :form-data="formData">
          <template v-if="field.slot" #default>
            <slot :name="field.slot" :form-data="formData" :field="field" />
          </template>
        </FormItem>
      </template>

      <!-- 额外的自定义内容 -->
      <slot name="extra" :form-data="formData" />
    </el-form>

    <template #footer>
      <slot name="footer" :form-data="formData" :submit="handleSubmit" :close="handleClose">
        <el-button @click="handleClose" :disabled="loading">
          {{ cancelText }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ submitText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import FormItem from './FormDialogItem.vue'

export interface FormField {
  prop: string
  label: string
  type:
    | 'input'
    | 'password'
    | 'textarea'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'datetime'
    | 'daterange'
    | 'time'
    | 'timerange'
    | 'cascader'
    | 'upload'
    | 'row'
    | 'divider'
    | 'custom'
  placeholder?: string
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  rows?: number
  min?: number
  max?: number
  step?: number
  span?: number
  columns?: FormField[]
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  showPassword?: boolean
  maxlength?: number
  minlength?: number
  format?: string
  valueFormat?: string
  slot?: string
  props?: Record<string, any>
  style?: Record<string, any>
  class?: string
  tip?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    fields: FormField[]
    formData: Record<string, any>
    rules?: FormRules
    width?: string | number
    labelWidth?: string
    labelPosition?: 'left' | 'right' | 'top'
    loading?: boolean
    disabled?: boolean
    closeOnClickModal?: boolean
    closeOnPressEscape?: boolean
    showClose?: boolean
    destroyOnClose?: boolean
    gutter?: number
    submitText?: string
    cancelText?: string
    resetOnClose?: boolean
  }>(),
  {
    width: '800px',
    labelWidth: '120px',
    labelPosition: 'right',
    loading: false,
    disabled: false,
    closeOnClickModal: false,
    closeOnPressEscape: true,
    showClose: true,
    destroyOnClose: false,
    gutter: 20,
    submitText: '确定',
    cancelText: '取消',
    resetOnClose: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', formData: Record<string, any>): void
  (e: 'close'): void
  (e: 'validate', valid: boolean): void
}>()

const formRef = ref<FormInstance>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    emit('validate', valid)
    if (valid) {
      emit('submit', props.formData)
    }
  } catch (error) {
    emit('validate', false)
    console.error('表单验证失败:', error)
  }
}

// 暴露方法给父组件
const validate = () => {
  return formRef.value?.validate()
}

const resetFields = () => {
  formRef.value?.resetFields()
}

const clearValidate = (props?: string | string[]) => {
  formRef.value?.clearValidate(props)
}

defineExpose({
  validate,
  resetFields,
  clearValidate,
})

// 监听对话框关闭，重置表单
watch(
  () => props.modelValue,
  (val) => {
    if (!val && props.resetOnClose) {
      // 延迟重置，避免关闭动画时看到表单重置
      setTimeout(() => {
        formRef.value?.resetFields()
      }, 300)
    }
  }
)
</script>

<style scoped lang="scss">
.form-divider {
  margin: 10px 0;

  :deep(.el-divider__text) {
    font-weight: 600;
    color: #303133;
  }
}
</style>
