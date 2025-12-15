<template>
  <div class="filter-panel">
    <el-card shadow="never" :body-style="{ padding: '16px' }">
      <!-- 头部 -->
      <div class="filter-header">
        <div class="header-left">
          <el-icon class="filter-icon"><Filter /></el-icon>
          <span class="filter-title">{{ title }}</span>
        </div>
        <div class="header-right">
          <el-button
            v-if="showReset"
            size="small"
            @click="handleReset"
          >
            重置
          </el-button>
          <el-button
            v-if="collapsible"
            :icon="collapsed ? ArrowDown : ArrowUp"
            size="small"
            text
            @click="toggleCollapse"
          >
            {{ collapsed ? '展开' : '收起' }}
          </el-button>
        </div>
      </div>

      <!-- 筛选内容 -->
      <el-collapse-transition>
        <div v-show="!collapsed" class="filter-content">
          <el-form
            ref="formRef"
            :model="localFilters"
            :label-width="labelWidth"
            :label-position="labelPosition"
          >
            <el-row :gutter="gutter">
              <el-col
                v-for="(filter, index) in filters"
                :key="index"
                :span="filter.span || defaultSpan"
              >
                <el-form-item :label="filter.label" :prop="filter.prop">
                  <!-- 输入框 -->
                  <el-input
                    v-if="filter.type === 'input'"
                    v-model="localFilters[filter.prop]"
                    :placeholder="filter.placeholder || `请输入${filter.label}`"
                    :clearable="filter.clearable !== false"
                    @change="handleFilterChange"
                  />

                  <!-- 数字输入框 -->
                  <el-input-number
                    v-else-if="filter.type === 'number'"
                    v-model="localFilters[filter.prop]"
                    :min="filter.min"
                    :max="filter.max"
                    :step="filter.step || 1"
                    :precision="filter.precision"
                    :controls-position="filter.controlsPosition || 'right'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 下拉选择 -->
                  <el-select
                    v-else-if="filter.type === 'select'"
                    v-model="localFilters[filter.prop]"
                    :placeholder="filter.placeholder || `请选择${filter.label}`"
                    :clearable="filter.clearable !== false"
                    :multiple="filter.multiple"
                    :collapse-tags="filter.collapseTags"
                    :filterable="filter.filterable"
                    style="width: 100%"
                    @change="handleFilterChange"
                  >
                    <el-option
                      v-for="option in filter.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                      :disabled="option.disabled"
                    />
                  </el-select>

                  <!-- 级联选择 -->
                  <el-cascader
                    v-else-if="filter.type === 'cascader'"
                    v-model="localFilters[filter.prop]"
                    :options="filter.options"
                    :props="filter.cascaderProps"
                    :placeholder="filter.placeholder || `请选择${filter.label}`"
                    :clearable="filter.clearable !== false"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 日期选择 -->
                  <el-date-picker
                    v-else-if="filter.type === 'date'"
                    v-model="localFilters[filter.prop]"
                    type="date"
                    :placeholder="filter.placeholder || `请选择${filter.label}`"
                    :clearable="filter.clearable !== false"
                    :format="filter.format || 'YYYY-MM-DD'"
                    :value-format="filter.valueFormat || 'YYYY-MM-DD'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 日期范围选择 -->
                  <el-date-picker
                    v-else-if="filter.type === 'daterange'"
                    v-model="localFilters[filter.prop]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="filter.clearable !== false"
                    :format="filter.format || 'YYYY-MM-DD'"
                    :value-format="filter.valueFormat || 'YYYY-MM-DD'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 时间选择 -->
                  <el-time-picker
                    v-else-if="filter.type === 'time'"
                    v-model="localFilters[filter.prop]"
                    :placeholder="filter.placeholder || `请选择${filter.label}`"
                    :clearable="filter.clearable !== false"
                    :format="filter.format || 'HH:mm:ss'"
                    :value-format="filter.valueFormat || 'HH:mm:ss'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 时间范围选择 -->
                  <el-time-picker
                    v-else-if="filter.type === 'timerange'"
                    v-model="localFilters[filter.prop]"
                    is-range
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :clearable="filter.clearable !== false"
                    :format="filter.format || 'HH:mm:ss'"
                    :value-format="filter.valueFormat || 'HH:mm:ss'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 日期时间选择 -->
                  <el-date-picker
                    v-else-if="filter.type === 'datetime'"
                    v-model="localFilters[filter.prop]"
                    type="datetime"
                    :placeholder="filter.placeholder || `请选择${filter.label}`"
                    :clearable="filter.clearable !== false"
                    :format="filter.format || 'YYYY-MM-DD HH:mm:ss'"
                    :value-format="filter.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                    style="width: 100%"
                    @change="handleFilterChange"
                  />

                  <!-- 单选框组 -->
                  <el-radio-group
                    v-else-if="filter.type === 'radio'"
                    v-model="localFilters[filter.prop]"
                    @change="handleFilterChange"
                  >
                    <el-radio
                      v-for="option in filter.options"
                      :key="option.value"
                      :label="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </el-radio>
                  </el-radio-group>

                  <!-- 复选框组 -->
                  <el-checkbox-group
                    v-else-if="filter.type === 'checkbox'"
                    v-model="localFilters[filter.prop]"
                    @change="handleFilterChange"
                  >
                    <el-checkbox
                      v-for="option in filter.options"
                      :key="option.value"
                      :label="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </el-checkbox>
                  </el-checkbox-group>

                  <!-- 滑块 -->
                  <el-slider
                    v-else-if="filter.type === 'slider'"
                    v-model="localFilters[filter.prop]"
                    :min="filter.min || 0"
                    :max="filter.max || 100"
                    :step="filter.step || 1"
                    :range="filter.range"
                    :show-stops="filter.showStops"
                    :show-tooltip="filter.showTooltip !== false"
                    @change="handleFilterChange"
                  />

                  <!-- 开关 -->
                  <el-switch
                    v-else-if="filter.type === 'switch'"
                    v-model="localFilters[filter.prop]"
                    :active-text="filter.activeText"
                    :inactive-text="filter.inactiveText"
                    :active-value="filter.activeValue !== undefined ? filter.activeValue : true"
                    :inactive-value="filter.inactiveValue !== undefined ? filter.inactiveValue : false"
                    @change="handleFilterChange"
                  />

                  <!-- 自定义插槽 -->
                  <slot
                    v-else-if="filter.type === 'custom'"
                    :name="filter.slotName || filter.prop"
                    :filter="filter"
                    :value="localFilters[filter.prop]"
                    :onChange="handleFilterChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- 操作按钮 -->
          <div v-if="showActions" class="filter-actions">
            <el-button type="primary" :icon="Search" @click="handleSearch">
              {{ searchText }}
            </el-button>
            <el-button @click="handleReset">
              {{ resetText }}
            </el-button>
            <slot name="actions"></slot>
          </div>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import {
  Filter,
  Search,
  ArrowDown,
  ArrowUp,
} from '@element-plus/icons-vue'

// 筛选项配置接口
export interface FilterConfig {
  prop: string                    // 字段名
  label: string                   // 标签文本
  type: 'input' | 'number' | 'select' | 'cascader' | 'date' | 'daterange' |
        'time' | 'timerange' | 'datetime' | 'radio' | 'checkbox' | 'slider' | 'switch' | 'custom'
  span?: number                   // 栅格占位
  placeholder?: string            // 占位符
  clearable?: boolean             // 是否可清空
  options?: Array<{               // 选项列表（select/radio/checkbox）
    label: string
    value: any
    disabled?: boolean
  }>
  cascaderProps?: any             // 级联选择器配置
  multiple?: boolean              // 是否多选（select）
  collapseTags?: boolean          // 是否折叠标签（select multiple）
  filterable?: boolean            // 是否可搜索（select）
  min?: number                    // 最小值（number/slider）
  max?: number                    // 最大值（number/slider）
  step?: number                   // 步长（number/slider）
  precision?: number              // 精度（number）
  controlsPosition?: 'right' | '' // 控制按钮位置（number）
  format?: string                 // 显示格式（date/time）
  valueFormat?: string            // 值格式（date/time）
  range?: boolean                 // 是否范围选择（slider）
  showStops?: boolean             // 是否显示间断点（slider）
  showTooltip?: boolean           // 是否显示提示（slider）
  activeText?: string             // 开启文本（switch）
  inactiveText?: string           // 关闭文本（switch）
  activeValue?: any               // 开启值（switch）
  inactiveValue?: any             // 关闭值（switch）
  slotName?: string               // 自定义插槽名称（custom）
}

// Props 定义
interface Props {
  title?: string                  // 面板标题
  filters: FilterConfig[]         // 筛选项配置
  modelValue?: Record<string, any> // v-model 绑定的筛选值
  defaultSpan?: number            // 默认栅格占位
  gutter?: number                 // 栅格间距
  labelWidth?: string             // 标签宽度
  labelPosition?: 'left' | 'right' | 'top' // 标签位置
  collapsible?: boolean           // 是否可折叠
  defaultCollapsed?: boolean      // 默认是否折叠
  showActions?: boolean           // 是否显示操作按钮
  showReset?: boolean             // 是否显示重置按钮
  searchText?: string             // 搜索按钮文本
  resetText?: string              // 重置按钮文本
  autoSearch?: boolean            // 是否自动搜索（值变化时）
}

const props = withDefaults(defineProps<Props>(), {
  title: '高级筛选',
  modelValue: () => ({}),
  defaultSpan: 8,
  gutter: 16,
  labelWidth: '100px',
  labelPosition: 'right',
  collapsible: true,
  defaultCollapsed: false,
  showActions: true,
  showReset: true,
  searchText: '搜索',
  resetText: '重置',
  autoSearch: false,
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'search': [filters: Record<string, any>]
  'reset': []
  'change': [filters: Record<string, any>]
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const collapsed = ref(props.defaultCollapsed)
const localFilters = reactive<Record<string, any>>({})

// 初始化筛选值
const initFilters = () => {
  props.filters.forEach(filter => {
    if (props.modelValue[filter.prop] !== undefined) {
      localFilters[filter.prop] = props.modelValue[filter.prop]
    } else {
      // 设置默认值
      if (filter.type === 'checkbox') {
        localFilters[filter.prop] = []
      } else if (filter.type === 'switch') {
        localFilters[filter.prop] = filter.inactiveValue !== undefined ? filter.inactiveValue : false
      } else {
        localFilters[filter.prop] = ''
      }
    }
  })
}

initFilters()

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    Object.keys(newVal).forEach(key => {
      if (localFilters[key] !== newVal[key]) {
        localFilters[key] = newVal[key]
      }
    })
  },
  { deep: true }
)

// 切换折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 筛选值变化
const handleFilterChange = () => {
  emit('update:modelValue', { ...localFilters })
  emit('change', { ...localFilters })

  if (props.autoSearch) {
    handleSearch()
  }
}

// 搜索
const handleSearch = () => {
  emit('search', { ...localFilters })
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()

  // 重置为默认值
  props.filters.forEach(filter => {
    if (filter.type === 'checkbox') {
      localFilters[filter.prop] = []
    } else if (filter.type === 'switch') {
      localFilters[filter.prop] = filter.inactiveValue !== undefined ? filter.inactiveValue : false
    } else {
      localFilters[filter.prop] = ''
    }
  })

  emit('update:modelValue', { ...localFilters })
  emit('reset')
}

// 暴露方法供父组件调用
defineExpose({
  search: handleSearch,
  reset: handleReset,
  getFilters: () => ({ ...localFilters }),
})
</script>

<script lang="ts">
export default {
  name: 'FilterPanel',
}
</script>

<style scoped lang="scss">
.filter-panel {
  margin-bottom: 16px;

  :deep(.el-card) {
    border-radius: 4px;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .filter-icon {
        font-size: 18px;
        color: #409eff;
      }

      .filter-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .filter-content {
    :deep(.el-form) {
      .el-form-item {
        margin-bottom: 16px;
      }

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }
    }
  }

  .filter-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
