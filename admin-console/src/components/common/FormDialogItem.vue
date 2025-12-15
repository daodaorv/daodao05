<template>
  <el-form-item
    :label="field.label"
    :prop="field.prop"
    :class="field.class"
    :style="field.style"
  >
    <!-- 输入框 -->
    <el-input
      v-if="field.type === 'input'"
      v-model="formData[field.prop]"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :maxlength="field.maxlength"
      :minlength="field.minlength"
      :show-word-limit="!!field.maxlength"
    />

    <!-- 密码输入框 -->
    <el-input
      v-else-if="field.type === 'password'"
      v-model="formData[field.prop]"
      type="password"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :show-password="field.showPassword !== false"
      :maxlength="field.maxlength"
      :minlength="field.minlength"
    />

    <!-- 文本域 -->
    <el-input
      v-else-if="field.type === 'textarea'"
      v-model="formData[field.prop]"
      type="textarea"
      :rows="field.rows || 3"
      :placeholder="field.placeholder || `请输入${field.label}`"
      :disabled="field.disabled"
      :maxlength="field.maxlength"
      :show-word-limit="!!field.maxlength"
    />

    <!-- 数字输入框 -->
    <el-input-number
      v-else-if="field.type === 'number'"
      v-model="formData[field.prop]"
      :min="field.min"
      :max="field.max"
      :step="field.step || 1"
      :disabled="field.disabled"
      style="width: 100%"
    />

    <!-- 下拉选择 -->
    <el-select
      v-else-if="field.type === 'select'"
      v-model="formData[field.prop]"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :multiple="field.multiple"
      :filterable="field.filterable"
      style="width: 100%"
    >
      <el-option
        v-for="option in field.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </el-select>

    <!-- 单选框组 -->
    <el-radio-group
      v-else-if="field.type === 'radio'"
      v-model="formData[field.prop]"
      :disabled="field.disabled"
    >
      <el-radio
        v-for="option in field.options"
        :key="option.value"
        :label="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <!-- 多选框组 -->
    <el-checkbox-group
      v-else-if="field.type === 'checkbox'"
      v-model="formData[field.prop]"
      :disabled="field.disabled"
    >
      <el-checkbox
        v-for="option in field.options"
        :key="option.value"
        :label="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 开关 -->
    <el-switch
      v-else-if="field.type === 'switch'"
      v-model="formData[field.prop]"
      :disabled="field.disabled"
    />

    <!-- 日期选择器 -->
    <el-date-picker
      v-else-if="field.type === 'date'"
      v-model="formData[field.prop]"
      type="date"
      :placeholder="field.placeholder || '选择日期'"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :format="field.format || 'YYYY-MM-DD'"
      :value-format="field.valueFormat || 'YYYY-MM-DD'"
      style="width: 100%"
    />

    <!-- 日期时间选择器 -->
    <el-date-picker
      v-else-if="field.type === 'datetime'"
      v-model="formData[field.prop]"
      type="datetime"
      :placeholder="field.placeholder || '选择日期时间'"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :format="field.format || 'YYYY-MM-DD HH:mm:ss'"
      :value-format="field.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
      style="width: 100%"
    />

    <!-- 日期范围选择器 -->
    <el-date-picker
      v-else-if="field.type === 'daterange'"
      v-model="formData[field.prop]"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :format="field.format || 'YYYY-MM-DD'"
      :value-format="field.valueFormat || 'YYYY-MM-DD'"
      style="width: 100%"
    />

    <!-- 时间选择器 -->
    <el-time-picker
      v-else-if="field.type === 'time'"
      v-model="formData[field.prop]"
      :placeholder="field.placeholder || '选择时间'"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :format="field.format || 'HH:mm:ss'"
      :value-format="field.valueFormat || 'HH:mm:ss'"
      style="width: 100%"
    />

    <!-- 时间范围选择器 -->
    <el-time-picker
      v-else-if="field.type === 'timerange'"
      v-model="formData[field.prop]"
      is-range
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :format="field.format || 'HH:mm:ss'"
      :value-format="field.valueFormat || 'HH:mm:ss'"
      style="width: 100%"
    />

    <!-- 级联选择器 -->
    <el-cascader
      v-else-if="field.type === 'cascader'"
      v-model="formData[field.prop]"
      :options="field.options"
      :placeholder="field.placeholder || `请选择${field.label}`"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      :filterable="field.filterable"
      :props="field.props"
      style="width: 100%"
    />

    <!-- 自定义插槽 -->
    <slot v-else-if="field.type === 'custom'" />

    <!-- 提示信息 -->
    <template v-if="field.tip" #extra>
      <div class="form-item-tip">{{ field.tip }}</div>
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import type { FormField } from './FormDialog.vue'

defineProps<{
  field: FormField
  formData: Record<string, any>
}>()
</script>

<style scoped lang="scss">
.form-item-tip {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
}
</style>
