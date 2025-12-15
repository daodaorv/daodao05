<template>
  <el-card class="search-card" shadow="never">
    <el-form :model="modelValue" inline>
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        :label="field.label"
      >
        <!-- 输入框 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="modelValue[field.prop]"
          :placeholder="field.placeholder || `请输入${field.label}`"
          clearable
          :style="{ width: field.width || '150px' }"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="modelValue[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          clearable
          :style="{ width: field.width || '150px' }"
        >
          <el-option
            v-for="option in field.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <!-- 日期范围选择 -->
        <el-date-picker
          v-else-if="field.type === 'daterange'"
          v-model="modelValue[field.prop]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :style="{ width: field.width || '240px' }"
        />

        <!-- 日期选择 -->
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="modelValue[field.prop]"
          type="date"
          :placeholder="field.placeholder || '选择日期'"
          :style="{ width: field.width || '150px' }"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'

export interface SearchField {
  prop: string
  label: string
  type: 'input' | 'select' | 'daterange' | 'date'
  placeholder?: string
  width?: string
  options?: Array<{ label: string; value: string | number }>
}

const props = defineProps<{
  modelValue: Record<string, any>
  fields: SearchField[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('reset')
}
</script>

<style scoped lang="scss">
.search-card {
  margin-bottom: 20px;
}
</style>
