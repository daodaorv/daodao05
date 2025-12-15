<!-- @ts-nocheck -->
<template>
  <div class="custom-time-rule-list">
    <el-alert
      type="info"
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #title>
        <div style="font-size: 13px">
          自定义时间规则用于设置特定日期或周期的价格调整，优先级低于法定节假日（优先级 &lt; 90）
        </div>
      </template>
    </el-alert>

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="ruleList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #ruleType="{ row }">
        <el-tag :type="getRuleTypeTag(row.ruleType)" size="small">
          {{ getRuleTypeLabel(row.ruleType) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status === 'active' ? '生效中' : '未生效' }}
        </el-tag>
      </template>
      <template #adjustmentType="{ row }">
        <el-tag :type="row.adjustmentType === 'percentage' ? 'success' : 'primary'" size="small">
          {{ row.adjustmentType === 'percentage' ? '百分比' : '固定金额' }}
        </el-tag>
      </template>
      <template #adjustmentValue="{ row }">
        <span :style="{ color: row.adjustmentValue > 0 ? '#f56c6c' : '#67c23a', fontWeight: 'bold' }">
          {{ row.adjustmentValue > 0 ? '+' : '' }}{{ row.adjustmentValue }}{{ row.adjustmentType === 'percentage' ? '%' : '元' }}
        </span>
      </template>
      <template #dateRange="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.startDate }}</div>
          <div>{{ row.endDate }}</div>
        </div>
      </template>
    </DataTable>

    <!-- 创建/编辑对话框 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      width="800px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'

// 规则类型选项
const RULE_TYPE_OPTIONS = [
  { label: '周末规则', value: 'weekend' },
  { label: '旺季规则', value: 'peak_season' },
  { label: '淡季规则', value: 'low_season' },
  { label: '特殊活动', value: 'special_event' },
  { label: '自定义日期', value: 'custom_date' }
]

// 搜索表单
const searchForm = reactive({
  keyword: '',
  ruleType: undefined,
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '规则名称',
    width: '200px'
  },
  {
    prop: 'ruleType',
    label: '规则类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: RULE_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: [
      { label: '生效中', value: 'active' },
      { label: '未生效', value: 'inactive' }
    ]
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '规则名称', minWidth: 150 },
  { prop: 'ruleType', label: '规则类型', width: 120, slot: 'ruleType' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'dateRange', label: '生效时间', width: 180, slot: 'dateRange' },
  { prop: 'adjustmentType', label: '调整类型', width: 120, slot: 'adjustmentType' },
  { prop: 'adjustmentValue', label: '调整值', width: 120, slot: 'adjustmentValue' },
  { prop: 'priority', label: '优先级', width: 100 },
  { prop: 'description', label: '说明', minWidth: 200 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增规则',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: any) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: any) => handleDelete(row)
  }
]

// Mock 数据
const ruleList = ref([
  {
    id: 1,
    name: '周末价格上涨',
    ruleType: 'weekend',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    priority: 50,
    description: '每周六日价格上涨20%'
  },
  {
    id: 2,
    name: '暑期旺季',
    ruleType: 'peak_season',
    status: 'active',
    startDate: '2025-07-01',
    endDate: '2025-08-31',
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    priority: 60,
    description: '暑期旺季价格上涨30%'
  },
  {
    id: 3,
    name: '冬季淡季',
    ruleType: 'low_season',
    status: 'active',
    startDate: '2025-11-15',
    endDate: '2026-03-15',
    adjustmentType: 'percentage',
    adjustmentValue: -20,
    priority: 40,
    description: '冬季淡季价格下降20%'
  },
  {
    id: 4,
    name: '音乐节活动',
    ruleType: 'special_event',
    status: 'inactive',
    startDate: '2025-09-15',
    endDate: '2025-09-17',
    adjustmentType: 'percentage',
    adjustmentValue: 40,
    priority: 70,
    description: '音乐节期间价格上涨40%'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: ruleList.value.length
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  ruleType: 'weekend',
  status: 'inactive',
  startDate: '',
  endDate: '',
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  priority: 50,
  description: ''
})

// 表单字段配置
const formFields = computed<FormField[]>(() => [
  {
    type: 'divider',
    label: '基本信息'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'name',
        label: '规则名称',
        type: 'input',
        placeholder: '请输入规则名称',
        span: 12
      },
      {
        prop: 'ruleType',
        label: '规则类型',
        type: 'select',
        options: RULE_TYPE_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '生效中', value: 'active' },
          { label: '未生效', value: 'inactive' }
        ],
        span: 12
      },
      {
        prop: 'priority',
        label: '优先级',
        type: 'number',
        min: 1,
        max: 89,
        span: 12,
        tip: '数字越大优先级越高，最大89（法定节假日固定90）'
      }
    ]
  },
  {
    type: 'divider',
    label: '生效时间'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'startDate',
        label: '开始日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      },
      {
        prop: 'endDate',
        label: '结束日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      }
    ]
  },
  {
    type: 'divider',
    label: '价格调整'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'adjustmentType',
        label: '调整类型',
        type: 'select',
        options: [
          { label: '百分比', value: 'percentage' },
          { label: '固定金额', value: 'fixed' }
        ],
        span: 12
      },
      {
        prop: 'adjustmentValue',
        label: '调整值',
        type: 'number',
        span: 12,
        tip: '正数表示涨价，负数表示降价'
      }
    ]
  },
  {
    prop: 'description',
    label: '规则说明',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入规则说明',
    maxlength: 200
  }
])

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }]
}

// 获取规则类型标签类型
const getRuleTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    weekend: 'primary',
    peak_season: 'danger',
    low_season: 'success',
    special_event: 'warning',
    custom_date: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取规则类型标签文本
const getRuleTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    weekend: '周末规则',
    peak_season: '旺季规则',
    low_season: '淡季规则',
    special_event: '特殊活动',
    custom_date: '自定义日期'
  }
  return labelMap[type] || type
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // TODO: 调用搜索API
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.ruleType = undefined
  searchForm.status = undefined
  pagination.page = 1
  // TODO: 重新加载数据
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.ruleType = 'weekend'
  formData.status = 'inactive'
  formData.startDate = ''
  formData.endDate = ''
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.priority = 50
  formData.description = ''
}

// 创建
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增自定义时间规则'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑自定义时间规则'

  formData.name = row.name
  formData.ruleType = row.ruleType
  formData.status = row.status
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.priority = row.priority
  formData.description = row.description

  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除自定义时间规则"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('删除成功')
    // TODO: 调用删除API
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async (_data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    // TODO: 重新加载数据
  } catch (error) {
    ElMessage.error(isEdit.value ? '编辑失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // TODO: 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  // TODO: 重新加载数据
}
</script>

<style scoped lang="scss">
.custom-time-rule-list {
  // 组件样式
}
</style>
