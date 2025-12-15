<!-- @ts-nocheck -->
<template>
  <div class="order-exceptions-container">
    <PageHeader title="异常订单处理" description="处理订单异常情况和纠纷解决" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="exceptionList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #type="{ row }">
        <el-tag :type="getExceptionTypeTag(row.type)" size="small">
          {{ getExceptionTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getExceptionStatusTag(row.status)" size="small">
          {{ getExceptionStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #priority="{ row }">
        <el-tag :type="getPriorityTag(row.priority)" size="small">
          {{ getPriorityLabel(row.priority) }}
        </el-tag>
      </template>
      <template #estimatedLoss="{ row }">
        <span :style="{ color: row.estimatedLoss > 0 ? '#f56c6c' : '#67c23a' }">
          ¥{{ row.estimatedLoss.toLocaleString() }}
        </span>
      </template>
      <template #actualLoss="{ row }">
        <span :style="{ color: row.actualLoss > 0 ? '#f56c6c' : '#67c23a' }">
          ¥{{ row.actualLoss.toLocaleString() }}
        </span>
      </template>
    </DataTable>

    <!-- 处理异常对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="处理异常"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="handleFormRef"
        :model="handleForm"
        :rules="handleFormRules"
        label-width="100px"
      >
        <el-form-item label="异常标题">
          <el-input :value="currentException?.title" disabled />
        </el-form-item>
        <el-form-item label="异常描述">
          <el-input
            :value="currentException?.description"
            type="textarea"
            :rows="3"
            disabled
          />
        </el-form-item>
        <el-form-item label="处理方案" prop="resolution">
          <el-input
            v-model="handleForm.resolution"
            type="textarea"
            :rows="5"
            placeholder="请输入处理方案和结果"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="handleLoading" @click="handleSubmit">
          确定处理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Document, Clock, CircleCheck, Money } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getExceptionList,
  getExceptionStats,
  handleException,
  type OrderException,
  type ExceptionListParams
} from '@/api/order'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 异常类型选项
const EXCEPTION_TYPE_OPTIONS = [
  { label: '车辆损坏', value: 'vehicle_damage' },
  { label: '逾期未还', value: 'late_return' },
  { label: '交通违章', value: 'traffic_violation' },
  { label: '交通事故', value: 'accident' },
  { label: '客户投诉', value: 'customer_complaint' },
  { label: '支付纠纷', value: 'payment_dispute' },
  { label: '其他异常', value: 'other' }
]

// 异常状态选项
const EXCEPTION_STATUS_OPTIONS = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已解决', value: 'resolved' },
  { label: '已关闭', value: 'closed' }
]

// 优先级选项
const PRIORITY_OPTIONS = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
  { label: '紧急', value: 'urgent' }
]

// 搜索表单
const searchForm = reactive<ExceptionListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  priority: undefined
})

// 统计数据
const stats = reactive({
  totalExceptions: 0,
  pending: 0,
  processing: 0,
  resolved: 0,
  totalLoss: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '异常总数',
    value: stats.totalExceptions,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待处理',
    value: stats.pending,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '处理中',
    value: stats.processing,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '总损失',
    value: stats.totalLoss,
    icon: Money,
    color: '#f56c6c',
    format: 'currency'
  }
])

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '订单号/标题/描述',
    width: '200px'
  },
  {
    prop: 'type',
    label: '异常类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: EXCEPTION_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '异常状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: EXCEPTION_STATUS_OPTIONS
  },
  {
    prop: 'priority',
    label: '优先级',
    type: 'select',
    placeholder: '请选择优先级',
    width: '120px',
    options: PRIORITY_OPTIONS
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderNo', label: '订单号', width: 180 },
  { prop: 'type', label: '异常类型', width: 120, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'priority', label: '优先级', width: 100, slot: 'priority' },
  { prop: 'title', label: '异常标题', minWidth: 200 },
  { prop: 'reportedBy', label: '报告人', width: 120 },
  { prop: 'assignedTo', label: '处理人', width: 120 },
  { prop: 'estimatedLoss', label: '预估损失', width: 120, slot: 'estimatedLoss' },
  { prop: 'actualLoss', label: '实际损失', width: 120, slot: 'actualLoss' },
  { prop: 'reportedAt', label: '报告时间', width: 180 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '处理',
    type: 'primary',
    onClick: (row: OrderException) => handleProcess(row),
    show: (row: OrderException) => row.status === 'pending' || row.status === 'processing'
  },
  {
    label: '查看',
    type: 'info',
    onClick: (row: OrderException) => handleView(row)
  }
]

// 异常列表
const exceptionList = ref<OrderException[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 处理异常对话框
const handleDialogVisible = ref(false)
const handleLoading = ref(false)
const handleFormRef = ref<FormInstance>()
const currentException = ref<OrderException | null>(null)

const handleForm = reactive({
  resolution: ''
})

const handleFormRules: FormRules = {
  resolution: [
    { required: true, message: '请输入处理方案', trigger: 'blur' },
    { min: 10, message: '处理方案至少10个字符', trigger: 'blur' }
  ]
}

// 加载异常列表
const loadExceptionList = async () => {
  loading.value = true
  try {
    const params: ExceptionListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getExceptionList(params) as any
    exceptionList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载异常列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getExceptionStats() as any
    stats.totalExceptions = res.data.totalExceptions
    stats.pending = res.data.pending
    stats.processing = res.data.processing
    stats.resolved = res.data.resolved
    stats.totalLoss = res.data.totalLoss
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadExceptionList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.priority = undefined
  pagination.page = 1
  loadExceptionList()
}

// 处理异常
const handleProcess = (row: OrderException) => {
  currentException.value = row
  handleForm.resolution = row.resolution || 'info'
  handleDialogVisible.value = true
}

// 查看异常
const handleView = (row: OrderException) => {
  ElMessage.info(`查看异常详情功能开发中，异常ID: ${row.id}`)
}

// 提交处理
const handleSubmit = async () => {
  if (!handleFormRef.value || !currentException.value) return

  await handleFormRef.value.validate(async (valid) => {
    if (!valid) return

    handleLoading.value = true
    try {
      await handleException(currentException.value!.id, handleForm.resolution)
      ElMessage.success('处理成功')
      handleDialogVisible.value = false
      loadExceptionList()
      loadStats()
    } catch (error) {
      handleApiError(error, '处理失败')
    } finally {
      handleLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  handleFormRef.value?.resetFields()
  handleForm.resolution = ''
  currentException.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadExceptionList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadExceptionList()
}

// 获取异常类型标签类型
const getExceptionTypeTag = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const tagMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    vehicle_damage: 'danger',
    late_return: 'warning',
    traffic_violation: 'warning',
    accident: 'danger',
    customer_complaint: 'info',
    payment_dispute: 'warning',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取异常类型标签文本
const getExceptionTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    vehicle_damage: '车辆损坏',
    late_return: '逾期未还',
    traffic_violation: '交通违章',
    accident: '交通事故',
    customer_complaint: '客户投诉',
    payment_dispute: '支付纠纷',
    other: '其他异常'
  }
  return labelMap[type] || type
}

// 获取异常状态标签类型
const getExceptionStatusTag = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const tagMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    closed: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取异常状态标签文本
const getExceptionStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return labelMap[status] || status
}

// 获取优先级标签类型
const getPriorityTag = (priority: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const tagMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger'
  }
  return tagMap[priority] || 'info'
}

// 获取优先级标签文本
const getPriorityLabel = (priority: string) => {
  const labelMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return labelMap[priority] || priority
}

// 页面加载
onMounted(() => {
  loadExceptionList()
  loadStats()
})
</script>

<style scoped lang="scss">
.order-exceptions-container {
  padding: 20px;
}
</style>
