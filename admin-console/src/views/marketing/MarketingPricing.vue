<!-- @ts-nocheck -->
<template>
  <div class="marketing-pricing-container">
    <PageHeader title="价格策略管理" description="管理动态定价策略和价格调整规则" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="strategyList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #type="{ row }">
        <el-tag :type="(getStrategyTypeTag(row.type)) as any" size="small">
          {{ getStrategyTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="(getStrategyStatusTag(row.status)) as any" size="small">
          {{ getStrategyStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #adjustment="{ row }">
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
      <template #targetUserTags="{ row }">
        <el-tag
          v-for="tagId in row.targetUserTags"
          :key="tagId"
          size="small"
          style="margin-right: 4px"
        >
          {{ getTagName(tagId) }}
        </el-tag>
        <span v-if="!row.targetUserTags || row.targetUserTags.length === 0" style="color: #909399">
          全部用户
        </span>
      </template>
      <template #vehicleTypes="{ row }">
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <el-tag v-for="(type, index) in row.vehicleTypes" :key="index" size="small" type="info">
            {{ type }}
          </el-tag>
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
      width="900px"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="价格策略详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentStrategy" :column="2" border>
        <el-descriptions-item label="策略ID">{{ currentStrategy.id }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{ currentStrategy.name }}</el-descriptions-item>
        <el-descriptions-item label="策略类型">
          <el-tag :type="(getStrategyTypeTag(currentStrategy.type)) as any" size="small">
            {{ getStrategyTypeLabel(currentStrategy.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="策略状态">
          <el-tag :type="(getStrategyStatusTag(currentStrategy.status)) as any" size="small">
            {{ getStrategyStatusLabel(currentStrategy.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整类型">
          {{ currentStrategy.adjustmentType === 'percentage' ? '百分比' : '固定金额' }}
        </el-descriptions-item>
        <el-descriptions-item label="调整值">
          <span :style="{ color: currentStrategy.adjustmentValue > 0 ? '#f56c6c' : '#67c23a', fontWeight: 'bold' }">
            {{ currentStrategy.adjustmentValue > 0 ? '+' : '' }}{{ currentStrategy.adjustmentValue }}{{ currentStrategy.adjustmentType === 'percentage' ? '%' : '元' }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="生效时间">{{ currentStrategy.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentStrategy.endDate }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ currentStrategy.priority }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentStrategy.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="目标用户标签" :span="2">
          <el-tag v-for="tagId in currentStrategy.targetUserTags" :key="tagId" size="small" style="margin-right: 8px">
            {{ getTagName(tagId) }}
          </el-tag>
          <span v-if="!currentStrategy.targetUserTags || currentStrategy.targetUserTags.length === 0" style="color: #909399">
            全部用户
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="适用车型" :span="2">
          <el-tag v-for="(type, index) in currentStrategy.vehicleTypes" :key="index" size="small" type="info" style="margin-right: 8px">
            {{ type }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="策略描述" :span="2">
          {{ currentStrategy.description }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentStrategy.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import {
  getPricingStrategyList,
  type PricingStrategy,
  type PricingStrategyListParams
} from '@/api/marketing'
import { tagApi, type Tag } from '@/api/user'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 标签列表
const tagList = ref<Tag[]>([])
const tagOptions = computed(() =>
  tagList.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
)

// 策略类型选项
const STRATEGY_TYPE_OPTIONS = [
  { label: '季节性', value: 'seasonal' },
  { label: '节假日', value: 'holiday' },
  { label: '供需调节', value: 'demand' },
  { label: '促销活动', value: 'promotion' }
]

// 策略状态选项
const STRATEGY_STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '未生效', value: 'inactive' },
  { label: '已过期', value: 'expired' }
]

// 调整类型选项
const ADJUSTMENT_TYPE_OPTIONS = [
  { label: '百分比', value: 'percentage' },
  { label: '固定金额', value: 'fixed' }
]

// 车型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: 'A型房车', value: 'A型房车' },
  { label: 'B型房车', value: 'B型房车' },
  { label: 'C型房车', value: 'C型房车' },
  { label: '拖挂房车', value: '拖挂房车' },
  { label: '所有车型', value: '所有车型' }
]

// 搜索表单
const searchForm = reactive<PricingStrategyListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  tagId: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '策略名称',
    width: '200px'
  },
  {
    prop: 'type',
    label: '策略类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: STRATEGY_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '策略状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: STRATEGY_STATUS_OPTIONS
  },
  {
    prop: 'tagId',
    label: '用户标签',
    type: 'select',
    placeholder: '请选择标签',
    width: '150px',
    options: tagOptions.value
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '策略名称', minWidth: 180 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'adjustment', label: '价格调整', width: 120, slot: 'adjustment' },
  { prop: 'targetUserTags', label: '目标用户标签', width: 150, slot: 'targetUserTags' },
  { prop: 'dateRange', label: '生效时间', width: 180, slot: 'dateRange' },
  { prop: 'priority', label: '优先级', width: 80 },
  { prop: 'vehicleTypes', label: '适用车型', minWidth: 200, slot: 'vehicleTypes' },
  { prop: 'createdBy', label: '创建人', width: 120 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增策略',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: PricingStrategy) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: PricingStrategy) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: PricingStrategy) => handleDelete(row)
  }
]

// 策略列表
const strategyList = ref<PricingStrategy[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentStrategyId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentStrategy = ref<PricingStrategy | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  type: 'seasonal',
  status: 'inactive',
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  startDate: '',
  endDate: '',
  priority: 1,
  targetUserTags: [] as number[],
  vehicleTypes: [] as string[],
  description: ''
})

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'divider',
    label: '基本信息'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'name',
        label: '策略名称',
        type: 'input',
        placeholder: '请输入策略名称',
        span: 12
      },
      {
        prop: 'type',
        label: '策略类型',
        type: 'select',
        options: STRATEGY_TYPE_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'status',
        label: '策略状态',
        type: 'select',
        options: STRATEGY_STATUS_OPTIONS,
        span: 12
      },
      {
        prop: 'priority',
        label: '优先级',
        type: 'number',
        min: 1,
        max: 100,
        span: 12,
        tip: '数字越小优先级越高'
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
        options: ADJUSTMENT_TYPE_OPTIONS,
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
    label: '适用范围'
  },
  {
    prop: 'targetUserTags',
    label: '目标用户标签',
    type: 'select',
    multiple: true,
    options: tagOptions.value,
    placeholder: '请选择目标用户标签（不选则全部用户可用）',
    tip: '选择可使用此价格策略的用户标签，不选则全部用户可用'
  },
  {
    prop: 'vehicleTypes',
    label: '适用车型',
    type: 'checkbox',
    options: VEHICLE_TYPE_OPTIONS
  },
  {
    prop: 'description',
    label: '策略描述',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入策略描述',
    maxlength: 500
  }
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择策略类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择策略状态', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  vehicleTypes: [{ required: true, message: '请选择适用车型', trigger: 'change' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }]
}

// 加载策略列表
const loadStrategyList = async () => {
  loading.value = true
  try {
    const params: PricingStrategyListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getPricingStrategyList(params) as any
    strategyList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载价格策略列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadStrategyList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.tagId = undefined
  pagination.page = 1
  loadStrategyList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = 'seasonal'
  formData.status = 'inactive'
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.startDate = ''
  formData.endDate = ''
  formData.priority = 1
  formData.targetUserTags = []
  formData.vehicleTypes = []
  formData.description = ''
}

// 创建策略
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentStrategyId.value = null
  dialogTitle.value = '新增价格策略'
  dialogVisible.value = true
}

// 编辑策略
const handleEdit = (row: PricingStrategy) => {
  resetForm()
  isEdit.value = true
  currentStrategyId.value = row.id
  dialogTitle.value = '编辑价格策略'

  // 填充表单数据
  formData.name = row.name
  formData.type = row.type
  formData.status = row.status
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.priority = row.priority
  formData.targetUserTags = row.targetUserTags ? [...row.targetUserTags] : []
  formData.vehicleTypes = [...row.vehicleTypes]
  formData.description = row.description

  dialogVisible.value = true
}

// 查看策略详情
const handleView = (row: PricingStrategy) => {
  currentStrategy.value = row
  detailDialogVisible.value = true
}

// 删除策略
const handleDelete = async (row: PricingStrategy) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除价格策略"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadStrategyList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除价格策略失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      // TODO: 调用编辑API
      ElMessage.success('编辑成功')
    } else {
      // TODO: 调用创建API
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadStrategyList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑价格策略失败' : '创建价格策略失败')
  } finally {
    submitLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadStrategyList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadStrategyList()
}

// 获取策略类型标签类型
const getStrategyTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    seasonal: 'primary',
    holiday: 'danger',
    demand: 'warning',
    promotion: 'success'
  }
  return tagMap[type] || 'info'
}

// 获取策略类型标签文本
const getStrategyTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    seasonal: '季节性',
    holiday: '节假日',
    demand: '供需调节',
    promotion: '促销活动'
  }
  return labelMap[type] || type
}

// 获取策略状态标签类型
const getStrategyStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    expired: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取策略状态标签文本
const getStrategyStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
    expired: '已过期'
  }
  return labelMap[status] || status
}

// 获取标签名称
const getTagName = (tagId: number) => {
  const tag = tagList.value.find(t => t.id === tagId)
  return tag ? tag.name : `标签${tagId}`
}

// 加载标签列表
const loadTagList = async () => {
  try {
    const res = await tagApi.getTagList({
      page: 1,
      pageSize: 100,
      status: 'active'
    }) as any

    // 安全地访问数据
    if (res && res.data) {
      tagList.value = res.data.list || res.data || []
    } else if (res && res.list) {
      tagList.value = res.list
    } else {
      tagList.value = []
    }
  } catch (error) {
    console.error('加载标签列表失败:', error)
    tagList.value = []
    // handleApiError(error, '加载标签列表失败')
  }
}

// 页面加载
onMounted(() => {
  loadTagList()
  loadStrategyList()
})
</script>

<style scoped lang="scss">
.marketing-pricing-container {
  padding: 20px;
}
</style>
