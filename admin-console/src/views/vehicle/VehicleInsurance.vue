<template>
  <div class="vehicle-insurance-container">
    <PageHeader title="保险管理" description="管理车辆保险记录、理赔记录和续保提醒" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="list"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #insuranceType="{ row }">
        <el-tag :type="getInsuranceTypeTag(row.insuranceType)" size="small">
          {{ getInsuranceTypeLabel(row.insuranceType) }}
        </el-tag>
      </template>
      <template #premium="{ row }">
        ¥{{ row.premium.toLocaleString() }}
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getInsuranceStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DataTable>

    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      @submit="handleSubmit"
    />

    <el-dialog
      v-model="detailDialogVisible"
      title="保险记录详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentRecord">
        <el-descriptions-item label="车牌号">
          {{ currentRecord.vehicleNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="车型">
          {{ currentRecord.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="保险类型">
          <el-tag :type="getInsuranceTypeTag(currentRecord.insuranceType)" size="small">
            {{ getInsuranceTypeLabel(currentRecord.insuranceType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="保险状态">
          <el-tag :type="getStatusTag(currentRecord.status)" size="small">
            {{ getInsuranceStatusLabel(currentRecord.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="保险公司">
          {{ currentRecord.insuranceCompany }}
        </el-descriptions-item>
        <el-descriptions-item label="保单号">
          {{ currentRecord.policyNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="生效日期">
          {{ formatDate(currentRecord.startDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="到期日期">
          {{ formatDate(currentRecord.endDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="保费">
          ¥{{ currentRecord.premium.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="保额">
          ¥{{ currentRecord.coverageAmount?.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="保险项目" :span="2">
          {{ currentRecord.coverageItems }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentRecord.remark || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Download,
  Document,
  Bell,
  CircleCheck,
  CircleClose,
  Warning,
  Money,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import {
  getInsuranceRecords,
  getInsuranceRecordDetail,
  createInsuranceRecord,
  updateInsuranceRecord,
  deleteInsuranceRecord,
  getInsuranceStats,
  type InsuranceRecord,
} from '@/api/vehicle'
import { useListPage, useDateFormat, useErrorHandler } from '@/composables'
import { INSURANCE_STATUS_OPTIONS } from '@/constants'

// Composables
const { formatDate } = useDateFormat()
const { handleApiError } = useErrorHandler()

// 使用 useListPage 统一管理列表逻辑
const {
  searchForm,
  list,
  loading,
  pagination,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  refresh
} = useListPage<InsuranceRecord>(getInsuranceRecords, {
  vehicleNumber: '',
  insuranceType: '',
  insuranceCompany: '',
  status: '',
})

// 统计数据
const stats = reactive({
  activeInsurance: 0,
  expiringInsurance: 0,
  expiredInsurance: 0,
  totalPremium: 0,
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '有效保险',
    value: stats.activeInsurance,
    icon: CircleCheck,
    color: '#67c23a',
  },
  {
    label: '即将到期',
    value: stats.expiringInsurance,
    icon: Warning,
    color: '#e6a23c',
  },
  {
    label: '已过期',
    value: stats.expiredInsurance,
    icon: CircleClose,
    color: '#f56c6c',
  },
  {
    label: '总保费',
    value: stats.totalPremium,
    icon: Money,
    color: '#409eff',
    format: 'currency',
  },
])

// 保险类型选项
const INSURANCE_TYPE_OPTIONS = [
  { label: '交强险', value: 'compulsory' },
  { label: '商业险', value: 'commercial' },
  { label: '组合险', value: 'combined' },
]

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'vehicleNumber',
    label: '车牌号',
    type: 'input',
    placeholder: '请输入车牌号',
    width: '150px',
  },
  {
    prop: 'insuranceType',
    label: '保险类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: INSURANCE_TYPE_OPTIONS,
  },
  {
    prop: 'insuranceCompany',
    label: '保险公司',
    type: 'input',
    placeholder: '请输入保险公司',
    width: '150px',
  },
  {
    prop: 'status',
    label: '保险状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: INSURANCE_STATUS_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'vehicleNumber', label: '车牌号', width: 120 },
  { prop: 'modelName', label: '车型', width: 150 },
  { prop: 'insuranceType', label: '保险类型', width: 120, slot: 'insuranceType' },
  { prop: 'insuranceCompany', label: '保险公司', width: 150 },
  { prop: 'policyNumber', label: '保单号', width: 180, showOverflowTooltip: true },
  { prop: 'premium', label: '保费', width: 120, slot: 'premium' },
  { prop: 'startDate', label: '生效日期', width: 120 },
  { prop: 'endDate', label: '到期日期', width: 120 },
  { prop: 'status', label: '保险状态', width: 100, slot: 'status' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增保险记录',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate,
  },
  {
    label: '理赔记录',
    icon: Document,
    onClick: () => ElMessage.info('理赔记录功能开发中'),
  },
  {
    label: '续保提醒',
    icon: Bell,
    onClick: () => ElMessage.info('续保提醒功能开发中'),
  },
  {
    label: '导出记录',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: handleView,
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: handleEdit,
  },
  {
    label: '删除',
    type: 'danger',
    onClick: handleDelete,
  },
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增保险记录')
const isEdit = ref(false)
const submitLoading = ref(false)

const formData = reactive({
  id: 0,
  vehicleId: null as number | null,
  insuranceType: '',
  insuranceCompany: '',
  policyNumber: '',
  startDate: '',
  endDate: '',
  premium: 0,
  coverageAmount: 0,
  coverageItems: '',
  remark: '',
})

// 表单字段配置
const formFields: FormField[] = [
  {
    type: 'row',
    prop: 'row1',
    label: '',
    columns: [
      {
        prop: 'vehicleId',
        label: '车辆',
        type: 'select',
        placeholder: '请选择车辆',
        options: [
          { label: '京A12345 - 大通RV80', value: 1 },
          { label: '沪B67890 - 福特全顺', value: 2 },
          { label: '粤C11111 - 依维柯拖挂', value: 3 },
        ],
        span: 12,
      },
      {
        prop: 'insuranceType',
        label: '保险类型',
        type: 'select',
        placeholder: '请选择类型',
        options: INSURANCE_TYPE_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row2',
    label: '',
    columns: [
      {
        prop: 'insuranceCompany',
        label: '保险公司',
        type: 'input',
        placeholder: '请输入保险公司',
        span: 12,
      },
      {
        prop: 'policyNumber',
        label: '保单号',
        type: 'input',
        placeholder: '请输入保单号',
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row3',
    label: '',
    columns: [
      {
        prop: 'startDate',
        label: '生效日期',
        type: 'date',
        placeholder: '选择日期',
        span: 12,
      },
      {
        prop: 'endDate',
        label: '到期日期',
        type: 'date',
        placeholder: '选择日期',
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row4',
    label: '',
    columns: [
      {
        prop: 'premium',
        label: '保费',
        type: 'number',
        min: 0,
        step: 100,
        span: 12,
      },
      {
        prop: 'coverageAmount',
        label: '保额',
        type: 'number',
        min: 0,
        step: 10000,
        span: 12,
      },
    ],
  },
  {
    prop: 'coverageItems',
    label: '保险项目',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入保险项目，多个项目用逗号分隔',
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入备注信息',
  },
]

const formRules = {
  vehicleId: [
    { required: true, message: '请选择车辆', trigger: 'change' },
  ],
  insuranceType: [
    { required: true, message: '请选择保险类型', trigger: 'change' },
  ],
  insuranceCompany: [
    { required: true, message: '请输入保险公司', trigger: 'blur' },
  ],
  policyNumber: [
    { required: true, message: '请输入保单号', trigger: 'blur' },
  ],
  startDate: [
    { required: true, message: '请选择生效日期', trigger: 'change' },
  ],
  endDate: [
    { required: true, message: '请选择到期日期', trigger: 'change' },
  ],
  premium: [
    { required: true, message: '请输入保费', trigger: 'blur' },
  ],
}

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<InsuranceRecord | null>(null)

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getInsuranceStats()
    if (res.code === 200) {
      Object.assign(stats, res.data)
    }
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 新增保险记录
function handleCreate() {
  dialogTitle.value = '新增保险记录'
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    vehicleId: null,
    insuranceType: '',
    insuranceCompany: '',
    policyNumber: '',
    startDate: '',
    endDate: '',
    premium: 0,
    coverageAmount: 0,
    coverageItems: '',
    remark: '',
  })
  dialogVisible.value = true
}

// 查看保险记录
async function handleView(row: InsuranceRecord) {
  try {
    const res = await getInsuranceRecordDetail(row.id)
    if (res.code === 200) {
      currentRecord.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    handleApiError(error, '加载保险记录详情失败')
  }
}

// 编辑保险记录
function handleEdit(row: InsuranceRecord) {
  dialogTitle.value = '编辑保险记录'
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    vehicleId: row.vehicleId,
    insuranceType: row.insuranceType,
    insuranceCompany: row.insuranceCompany,
    policyNumber: row.policyNumber,
    startDate: row.startDate,
    endDate: row.endDate,
    premium: row.premium,
    coverageAmount: row.coverageAmount || 0,
    coverageItems: row.coverageItems || '',
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 删除保险记录
async function handleDelete(row: InsuranceRecord) {
  try {
    await ElMessageBox.confirm(
      `确定要删除保单号 "${row.policyNumber}" 的保险记录吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteInsuranceRecord(row.id)
    ElMessage.success('删除成功')
    refresh()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 提交表单
async function handleSubmit() {
  submitLoading.value = true
  try {
    const data = {
      vehicleId: formData.vehicleId,
      insuranceType: formData.insuranceType,
      insuranceCompany: formData.insuranceCompany,
      policyNumber: formData.policyNumber,
      startDate: formData.startDate,
      endDate: formData.endDate,
      premium: formData.premium,
      coverageAmount: formData.coverageAmount,
      coverageItems: formData.coverageItems,
      remark: formData.remark,
    }

    if (isEdit.value) {
      await updateInsuranceRecord(formData.id, data)
      ElMessage.success('更新成功')
    } else {
      await createInsuranceRecord(data)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    refresh()
    loadStats()
  } catch (error) {
    handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 获取保险类型标签
function getInsuranceTypeTag(type: string) {
  const tagMap: Record<string, string> = {
    compulsory: 'danger',
    commercial: 'primary',
    combined: 'success',
  }
  return tagMap[type] || 'info'
}

// 获取保险类型标签文本
function getInsuranceTypeLabel(type: string) {
  const labelMap: Record<string, string> = {
    compulsory: '交强险',
    commercial: '商业险',
    combined: '组合险',
  }
  return labelMap[type] || type
}

// 获取状态标签
function getStatusTag(status: string) {
  const tagMap: Record<string, string> = {
    active: 'success',
    expired: 'danger',
    cancelled: 'info',
  }
  return tagMap[status] || 'info'
}

// 获取保险状态标签文本
function getInsuranceStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    active: '有效',
    expired: '已过期',
    cancelled: '已取消',
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadStats()
})
</script>

<style scoped lang="scss">
.vehicle-insurance-container {
  padding: 20px;
}
</style>
