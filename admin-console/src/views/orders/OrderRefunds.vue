<!-- @ts-nocheck -->
<template>
  <div class="order-refunds-container">
    <PageHeader title="退款管理" description="处理订单退款申请和审核" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="refundList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      // @ts-ignore
      <template #status="{ row }">
        <el-tag :type="getRefundStatusTag(row.status)" size="small">
          {{ getRefundStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #refundAmount="{ row }">
        <span style="color: #f56c6c; font-weight: bold">
          ¥{{ row.refundAmount.toLocaleString() }}
        </span>
      </template>
      <template #refundMethod="{ row }">
        {{ getRefundMethodLabel(row.refundMethod) }}
      </template>
    </DataTable>

    <!-- 审核退款对话框 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="审核退款"
      width="600px"
      @close="handleApproveDialogClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ currentRefund?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentRefund?.userName }} - {{ currentRefund?.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">
          <span style="color: #f56c6c; font-weight: bold">
            ¥{{ currentRefund?.refundAmount.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="退款原因">{{ currentRefund?.refundReason }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentRefund?.applyTime }}</el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveFormRules"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-form-item label="审核结果" prop="approved">
          <el-radio-group v-model="approveForm.approved">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!approveForm.approved" label="拒绝原因" prop="reason">
          <el-input
            v-model="approveForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="approveLoading" @click="handleApproveSubmit">
          确定
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
  getRefundList,
  getRefundStats,
  approveRefund,
  type Refund,
  type RefundListParams
} from '@/api/order'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 退款状态选项
const REFUND_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已批准', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '退款中', value: 'processing' },
  { label: '已完成', value: 'completed' },
  { label: '退款失败', value: 'failed' }
]

// 搜索表单
const searchForm = reactive<RefundListParams>({
  keyword: '',
  status: undefined
})

// 统计数据
const stats = reactive({
  totalRefunds: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  totalAmount: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '退款总数',
    value: stats.totalRefunds,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待审核',
    value: stats.pending,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '退款中',
    value: stats.processing,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '退款总额',
    value: stats.totalAmount,
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
    placeholder: '订单号/用户/手机号',
    width: '200px'
  },
  {
    prop: 'status',
    label: '退款状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: REFUND_STATUS_OPTIONS
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderNo', label: '订单号', width: 180 },
  { prop: 'userName', label: '用户', width: 100 },
  { prop: 'userPhone', label: '手机号', width: 120 },
  { prop: 'refundAmount', label: '退款金额', width: 120, slot: 'refundAmount' },
  { prop: 'refundReason', label: '退款原因', minWidth: 200 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'refundMethod', label: '退款方式', width: 120, slot: 'refundMethod' },
  { prop: 'applyTime', label: '申请时间', width: 180 },
  { prop: 'approvedBy', label: '审核人', width: 120 },
  { prop: 'completedTime', label: '完成时间', width: 180 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '审核',
    type: 'primary',
    onClick: (row: Refund) => handleApprove(row),
    show: (row: Refund) => row.status === 'pending'
  },
  {
    label: '查看',
    type: 'info',
    onClick: (row: Refund) => handleView(row)
  }
]

// 退款列表
const refundList = ref<Refund[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 审核退款对话框
const approveDialogVisible = ref(false)
const approveLoading = ref(false)
const approveFormRef = ref<FormInstance>()
const currentRefund = ref<Refund | null>(null)

const approveForm = reactive({
  approved: true,
  reason: ''
})

const approveFormRules: FormRules = {
  approved: [
    { required: true, message: '请选择审核结果', trigger: 'change' }
  ],
  reason: [
    { required: true, message: '请输入拒绝原因', trigger: 'blur' },
    { min: 5, message: '拒绝原因至少5个字符', trigger: 'blur' }
  ]
}

// 加载退款列表
const loadRefundList = async () => {
  loading.value = true
  try {
    const params: RefundListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getRefundList(params) as any
    refundList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载退款列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getRefundStats() as any
    stats.totalRefunds = res.data.totalRefunds
    stats.pending = res.data.pending
    stats.processing = res.data.processing
    stats.completed = res.data.completed
    stats.totalAmount = res.data.totalAmount
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadRefundList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  pagination.page = 1
  loadRefundList()
}

// 审核退款
const handleApprove = (row: Refund) => {
  currentRefund.value = row
  approveForm.approved = true
  approveForm.reason = ''
  approveDialogVisible.value = true
}

// 查看退款
const handleView = (row: Refund) => {
  ElMessage.info(`查看退款详情功能开发中，退款ID: ${row.id}`)
}

// 提交审核
const handleApproveSubmit = async () => {
  if (!approveFormRef.value || !currentRefund.value) return

  // 如果拒绝，需要验证拒绝原因
  if (!approveForm.approved) {
    await approveFormRef.value.validate(async (valid) => {
      if (!valid) return
      await submitApprove()
    })
  } else {
    await submitApprove()
  }
}

const submitApprove = async () => {
  approveLoading.value = true
  try {
    await approveRefund(
      currentRefund.value!.id,
      approveForm.approved,
      approveForm.reason
    )
    ElMessage.success(approveForm.approved ? '审核通过' : '审核拒绝')
    approveDialogVisible.value = false
    loadRefundList()
    loadStats()
  } catch (error) {
    handleApiError(error, '审核失败')
  } finally {
    approveLoading.value = false
  }
}

// 对话框关闭
const handleApproveDialogClose = () => {
  approveFormRef.value?.resetFields()
  approveForm.approved = true
  approveForm.reason = ''
  currentRefund.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadRefundList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadRefundList()
}

// 获取退款状态标签类型
const getRefundStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    processing: 'primary',
    completed: 'success',
    failed: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取退款状态标签文本
const getRefundStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待审核',
    approved: '已批准',
    rejected: '已拒绝',
    processing: '退款中',
    completed: '已完成',
    failed: '退款失败'
  }
  return labelMap[status] || status
}

// 获取退款方式标签文本
const getRefundMethodLabel = (method: string) => {
  const labelMap: Record<string, string> = {
    original: '原路退回',
    bank: '银行卡',
    alipay: '支付宝',
    wechat: '微信'
  }
  return labelMap[method] || method
}

// 页面加载
onMounted(() => {
  loadRefundList()
  loadStats()
})
</script>

<style scoped lang="scss">
.order-refunds-container {
  padding: 20px;
}
</style>
