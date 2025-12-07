<!-- @ts-nocheck -->
<template>
  <div class="order-list-container">
    <PageHeader title="订单管理" description="管理租赁订单、异常处理和退款管理" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="orderList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="280"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #orderNo="{ row }">
        <el-link type="primary" @click="handleView(row)">
          {{ row.orderNo }}
        </el-link>
      </template>
      // @ts-ignore
      <template #type="{ row }">
        <el-tag :type="getOrderTypeTag(row.type)" size="small">
          {{ getOrderTypeLabel(row.type) }}
        </el-tag>
      </template>
      // @ts-ignore
      <template #status="{ row }">
        <el-tag :type="getOrderStatusTag(row.status)" size="small">
          {{ getOrderStatusLabel(row.status) }}
        </el-tag>
      </template>
      // @ts-ignore
      <template #paymentStatus="{ row }">
        <el-tag :type="getPaymentStatusTag(row.paymentStatus)" size="small">
          {{ getPaymentStatusLabel(row.paymentStatus) }}
        </el-tag>
      </template>
      <template #actualAmount="{ row }">
        ¥{{ row.actualAmount.toLocaleString() }}
      </template>
    </DataTable>

    <!-- 取消订单对话框 -->
    <el-dialog
      v-model="cancelDialogVisible"
      title="取消订单"
      width="500px"
      @close="handleCancelDialogClose"
    >
      <el-form
        ref="cancelFormRef"
        :model="cancelForm"
        :rules="cancelFormRules"
        label-width="100px"
      >
        <el-form-item label="取消原因" prop="reason">
          <el-input
            v-model="cancelForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="cancelLoading" @click="handleCancelSubmit">
          确定取消订单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Document,
  Clock,
  CircleCheck,
  Money
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getOrderList,
  getOrderStats,
  confirmOrder,
  completeOrder,
  cancelOrder,
  type Order,
  type OrderListParams
} from '@/api/order'
import { useErrorHandler } from '@/composables'
import { exportToCSV } from '@/utils/export'
import { STORE_OPTIONS } from '@/constants/options'

// Composables
const router = useRouter()
const { handleApiError } = useErrorHandler()

// 订单类型选项
const ORDER_TYPE_OPTIONS = [
  { label: '托管订单', value: 'hosting' },
  { label: '合作订单', value: 'cooperative' }
]

// 订单状态选项
const ORDER_STATUS_OPTIONS = [
  { label: '待支付', value: 'pending_payment' },
  { label: '待确认', value: 'pending_confirm' },
  { label: '已确认', value: 'confirmed' },
  { label: '使用中', value: 'in_use' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '退款中', value: 'refunding' },
  { label: '已退款', value: 'refunded' }
]

// 支付状态选项
const PAYMENT_STATUS_OPTIONS = [
  { label: '未支付', value: 'unpaid' },
  { label: '已支付', value: 'paid' },
  { label: '退款中', value: 'refunding' },
  { label: '已退款', value: 'refunded' }
]

// 搜索表单
const searchForm = reactive<OrderListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  paymentStatus: undefined,
  storeId: undefined,
  startDate: '',
  endDate: ''
})

// 统计数据
const stats = reactive({
  totalOrders: 0,
  pendingConfirm: 0,
  inUse: 0,
  totalRevenue: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '订单总数',
    value: stats.totalOrders,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待确认',
    value: stats.pendingConfirm,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '使用中',
    value: stats.inUse,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '总营收',
    value: stats.totalRevenue,
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
    placeholder: '订单号/用户/车辆',
    width: '200px'
  },
  {
    prop: 'type',
    label: '订单类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: ORDER_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '订单状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: ORDER_STATUS_OPTIONS
  },
  {
    prop: 'paymentStatus',
    label: '支付状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: PAYMENT_STATUS_OPTIONS
  },
  {
    prop: 'storeId',
    label: '所属门店',
    type: 'select',
    placeholder: '请选择门店',
    width: '150px',
    options: STORE_OPTIONS
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderNo', label: '订单号', width: 180, slot: 'orderNo' },
  { prop: 'type', label: '订单类型', width: 100, slot: 'type' },
  { prop: 'userName', label: '用户', width: 100 },
  { prop: 'userPhone', label: '手机号', width: 120 },
  { prop: 'vehicleName', label: '车辆', width: 150 },
  { prop: 'vehicleNumber', label: '车牌号', width: 100 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'status', label: '订单状态', width: 100, slot: 'status' },
  { prop: 'paymentStatus', label: '支付状态', width: 100, slot: 'paymentStatus' },
  { prop: 'startDate', label: '开始日期', width: 110 },
  { prop: 'endDate', label: '结束日期', width: 110 },
  { prop: 'days', label: '天数', width: 80 },
  { prop: 'actualAmount', label: '实付金额', width: 120, slot: 'actualAmount' },
  { prop: 'createdAt', label: '创建时间', width: 180 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增订单',
    type: 'primary',
    icon: Plus,
    onClick: () => ElMessage.info('新增订单功能开发中')
  },
  {
    label: '导出订单',
    icon: Download,
    onClick: handleExport
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Order) => handleView(row)
  },
  {
    label: '确认',
    type: 'success',
    onClick: (row: Order) => handleConfirm(row),
    show: (row: Order) => row.status === 'pending_confirm'
  },
  {
    label: '完成',
    type: 'success',
    onClick: (row: Order) => handleComplete(row),
    show: (row: Order) => row.status === 'in_use'
  },
  {
    label: '取消',
    type: 'danger',
    onClick: (row: Order) => handleCancel(row),
    show: (row: Order) =>
      row.status === 'pending_payment' ||
      row.status === 'pending_confirm' ||
      row.status === 'confirmed'
  }
]

// 订单列表
const orderList = ref<Order[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 取消订单对话框
const cancelDialogVisible = ref(false)
const cancelLoading = ref(false)
const cancelFormRef = ref<FormInstance>()
const currentCancelOrder = ref<Order | null>(null)

const cancelForm = reactive({
  reason: ''
})

const cancelFormRules: FormRules = {
  reason: [
    { required: true, message: '请输入取消原因', trigger: 'blur' },
    { min: 5, message: '取消原因至少5个字符', trigger: 'blur' }
  ]
}

// 加载订单列表
const loadOrderList = async () => {
  loading.value = true
  try {
    const params: OrderListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getOrderList(params) as any
    orderList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getOrderStats() as any
    stats.totalOrders = res.data.totalOrders
    stats.pendingConfirm = res.data.pendingConfirm
    stats.inUse = res.data.inUse
    stats.totalRevenue = res.data.totalRevenue
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadOrderList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.paymentStatus = undefined
  searchForm.storeId = undefined
  searchForm.startDate = ''
  searchForm.endDate = ''
  pagination.page = 1
  loadOrderList()
}

// 查看订单
const handleView = (row: Order) => {
  router.push(`/orders/detail/${row.id}`)
}

// 确认订单
const handleConfirm = async (row: Order) => {
  try {
    await ElMessageBox.confirm(
      `确定要确认订单 "${row.orderNo}" 吗？确认后将通知用户取车。`,
      '确认订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }
    )

    await confirmOrder(row.id)
    ElMessage.success('订单已确认')
    loadOrderList()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '确认订单失败')
    }
  }
}

// 完成订单
const handleComplete = async (row: Order) => {
  try {
    await ElMessageBox.confirm(
      `确定要完成订单 "${row.orderNo}" 吗？完成后将退还押金并结算费用。`,
      '完成订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }
    )

    await completeOrder(row.id)
    ElMessage.success('订单已完成')
    loadOrderList()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '完成订单失败')
    }
  }
}

// 取消订单
const handleCancel = (row: Order) => {
  currentCancelOrder.value = row
  cancelDialogVisible.value = true
}

// 提交取消订单
const handleCancelSubmit = async () => {
  if (!cancelFormRef.value || !currentCancelOrder.value) return

  await cancelFormRef.value.validate(async (valid) => {
    if (!valid) return

    cancelLoading.value = true
    try {
      await cancelOrder(currentCancelOrder.value!.id, cancelForm.reason)
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      loadOrderList()
      loadStats()
    } catch (error) {
      handleApiError(error, '取消订单失败')
    } finally {
      cancelLoading.value = false
    }
  })
}

// 取消对话框关闭
const handleCancelDialogClose = () => {
  cancelFormRef.value?.resetFields()
  cancelForm.reason = ''
  currentCancelOrder.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadOrderList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadOrderList()
}

// 获取订单类型标签类型
const getOrderTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    hosting: 'primary',
    cooperative: 'success'
  }
  return tagMap[type] || 'info'
}

// 获取订单类型标签文本
const getOrderTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    hosting: '托管订单',
    cooperative: '合作订单'
  }
  return labelMap[type] || type
}

// 获取订单状态标签类型
const getOrderStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending_payment: 'warning',
    pending_confirm: 'warning',
    confirmed: 'primary',
    in_use: 'success',
    completed: 'info',
    cancelled: 'danger',
    refunding: 'warning',
    refunded: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取订单状态标签文本
const getOrderStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending_payment: '待支付',
    pending_confirm: '待确认',
    confirmed: '已确认',
    in_use: '使用中',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款'
  }
  return labelMap[status] || status
}

// 获取支付状态标签类型
const getPaymentStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    unpaid: 'danger',
    paid: 'success',
    refunding: 'warning',
    refunded: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取支付状态标签文本
const getPaymentStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    unpaid: '未支付',
    paid: '已支付',
    refunding: '退款中',
    refunded: '已退款'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadOrderList()
  loadStats()
})

// 导出数据
function handleExport() {
  if (orderList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(orderList.value, columns, '订单列表')
}
</script>

<style scoped lang="scss">
.order-list-container {
  padding: 20px;
}
</style>
