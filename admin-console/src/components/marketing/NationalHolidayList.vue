<!-- @ts-nocheck -->
<template>
  <div class="national-holiday-list">
    <el-alert
      type="warning"
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #title>
        <div style="font-size: 13px">
          法定节假日价格调整优先级固定为 90，高于所有自定义时间规则
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
      :data="holidayList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
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
      width="700px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  year: new Date().getFullYear()
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '节假日名称',
    width: '200px'
  },
  {
    prop: 'year',
    label: '年份',
    type: 'select',
    placeholder: '请选择年份',
    width: '150px',
    options: [
      { label: '2024年', value: 2024 },
      { label: '2025年', value: 2025 },
      { label: '2026年', value: 2026 }
    ]
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '节假日名称', minWidth: 150 },
  { prop: 'dateRange', label: '日期范围', width: 180, slot: 'dateRange' },
  { prop: 'adjustmentType', label: '调整类型', width: 120, slot: 'adjustmentType' },
  { prop: 'adjustmentValue', label: '调整值', width: 120, slot: 'adjustmentValue' },
  { prop: 'priority', label: '优先级', width: 100 },
  { prop: 'description', label: '说明', minWidth: 200 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增节假日',
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
const holidayList = ref([
  {
    id: 1,
    name: '春节',
    startDate: '2025-01-28',
    endDate: '2025-02-03',
    adjustmentType: 'percentage',
    adjustmentValue: 50,
    priority: 90,
    description: '2025年春节假期，价格上涨50%'
  },
  {
    id: 2,
    name: '清明节',
    startDate: '2025-04-04',
    endDate: '2025-04-06',
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    priority: 90,
    description: '2025年清明节假期，价格上涨30%'
  },
  {
    id: 3,
    name: '劳动节',
    startDate: '2025-05-01',
    endDate: '2025-05-05',
    adjustmentType: 'percentage',
    adjustmentValue: 40,
    priority: 90,
    description: '2025年劳动节假期，价格上涨40%'
  },
  {
    id: 4,
    name: '端午节',
    startDate: '2025-05-31',
    endDate: '2025-06-02',
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    priority: 90,
    description: '2025年端午节假期，价格上涨30%'
  },
  {
    id: 5,
    name: '中秋节',
    startDate: '2025-10-06',
    endDate: '2025-10-08',
    adjustmentType: 'percentage',
    adjustmentValue: 35,
    priority: 90,
    description: '2025年中秋节假期，价格上涨35%'
  },
  {
    id: 6,
    name: '国庆节',
    startDate: '2025-10-01',
    endDate: '2025-10-07',
    adjustmentType: 'percentage',
    adjustmentValue: 50,
    priority: 90,
    description: '2025年国庆节假期，价格上涨50%'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: holidayList.value.length
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
  startDate: '',
  endDate: '',
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  description: ''
})

// 表单字段配置
const formFields = computed<FormField[]>(() => [
  {
    prop: 'name',
    label: '节假日名称',
    type: 'input',
    placeholder: '请输入节假日名称'
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
    label: '说明',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入节假日说明',
    maxlength: 200
  }
])

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入节假日名称', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }]
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // TODO: 调用搜索API
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.year = new Date().getFullYear()
  pagination.page = 1
  // TODO: 重新加载数据
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.startDate = ''
  formData.endDate = ''
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.description = ''
}

// 创建
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增法定节假日'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑法定节假日'

  formData.name = row.name
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.description = row.description

  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除法定节假日"${row.name}"吗？`,
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
const handleSubmit = async (data: any) => {
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
.national-holiday-list {
  // 组件样式
}
</style>
