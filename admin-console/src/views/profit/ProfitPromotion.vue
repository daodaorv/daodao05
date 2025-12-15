<!-- @ts-nocheck -->
<template>
  <div class="profit-promotion-container">
    <PageHeader title="推广分润管理" description="管理推广员分润和结算" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #ecf5ff">
              <el-icon :size="32" color="#409eff"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">总金额</div>
              <div class="stat-value">¥{{ stats.totalAmount.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="32" color="#67c23a"><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">佣金金额</div>
              <div class="stat-value" style="color: #67c23a">
                ¥{{ stats.totalCommissionAmount.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0">
              <el-icon :size="32" color="#f56c6c"><Present /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">奖励金额</div>
              <div class="stat-value" style="color: #f56c6c">
                ¥{{ stats.totalBonusAmount.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fdf6ec">
              <el-icon :size="32" color="#e6a23c"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">推广员数量</div>
              <div class="stat-value" style="color: #e6a23c">
                {{ stats.promoterCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单金额统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="28" color="#409eff"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">订单总金额</div>
              <div class="stat-value">¥{{ stats.totalOrderAmount.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fdf6ec">
              <el-icon :size="28" color="#e6a23c"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待结算</div>
              <div class="stat-value">{{ stats.pendingCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="28" color="#409eff"><DocumentChecked /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已结算</div>
              <div class="stat-value">{{ stats.settledCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="28" color="#67c23a"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已支付</div>
              <div class="stat-value">{{ stats.paidCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="table-toolbar">
      <el-button
        type="primary"
        :disabled="selectedIds.length === 0"
        @click="handleBatchSettle"
      >
        <el-icon><DocumentChecked /></el-icon>
        批量结算
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出记录
      </el-button>
    </div>

    <DataTable
      :data="recordList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      :show-selection="true"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #recordNo="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleViewDetail(row)">
          {{ row.recordNo }}
        </span>
      </template>
      <template #promoterInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.promoterName }} ({{ row.promoterId }})</div>
          <div style="color: #909399">{{ row.promoterPhone }}</div>
        </div>
      </template>
      <template #promoterLevel="{ row }">
        <el-tag :type="row.promoterLevel === 'primary' ? 'success' : 'warning'" size="small">
          {{ row.promoterLevel === 'primary' ? '一级推广' : '二级推广' }}
        </el-tag>
      </template>
      <template #orderInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.orderNo }}</div>
          <div style="color: #909399">{{ row.customerName }}</div>
        </div>
      </template>
      <template #promotionChannel="{ row }">
        <el-tag :type="getChannelTag(row.promotionChannel)" size="small">
          {{ getChannelLabel(row.promotionChannel) }}
        </el-tag>
      </template>
      <template #amountBreakdown="{ row }">
        <div style="font-size: 12px">
          <div>订单: ¥{{ row.orderAmount.toLocaleString() }}</div>
          <div style="color: #67c23a">佣金: ¥{{ row.commissionAmount.toLocaleString() }} ({{ row.commissionRate }}%)</div>
          <div v-if="row.bonusAmount > 0" style="color: #f56c6c">奖励: ¥{{ row.bonusAmount.toLocaleString() }}</div>
          <div style="color: #409eff; font-weight: bold">总计: ¥{{ row.totalAmount.toLocaleString() }}</div>
        </div>
      </template>
      <template #settlementStatus="{ row }">
        <el-tag :type="getSettlementStatusTag(row.settlementStatus)" size="small">
          {{ getSettlementStatusLabel(row.settlementStatus) }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="推广分润详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentRecord" class="record-detail">
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="记录编号">
              {{ currentRecord.recordNo }}
            </el-descriptions-item>
            <el-descriptions-item label="结算月份">
              {{ currentRecord.settlementMonth }}
            </el-descriptions-item>
            <el-descriptions-item label="推广员ID">
              {{ currentRecord.promoterId }}
            </el-descriptions-item>
            <el-descriptions-item label="推广员姓名">
              {{ currentRecord.promoterName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ currentRecord.promoterPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="推广级别">
              <el-tag :type="currentRecord.promoterLevel === 'primary' ? 'success' : 'warning'" size="small">
                {{ currentRecord.promoterLevel === 'primary' ? '一级推广' : '二级推广' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>订单信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单编号">
              {{ currentRecord.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item label="客户姓名">
              {{ currentRecord.customerName }}
            </el-descriptions-item>
            <el-descriptions-item label="客户ID">
              {{ currentRecord.customerId }}
            </el-descriptions-item>
            <el-descriptions-item label="推广渠道">
              <el-tag :type="getChannelTag(currentRecord.promotionChannel)" size="small">
                {{ getChannelLabel(currentRecord.promotionChannel) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="订单金额">
              <span style="color: #409eff; font-weight: bold">
                ¥{{ currentRecord.orderAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="推广订单数">
              {{ currentRecord.orderCount }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>分润明细</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="佣金比例">
              <span style="font-weight: bold">{{ currentRecord.commissionRate }}%</span>
            </el-descriptions-item>
            <el-descriptions-item label="佣金金额">
              <span style="color: #67c23a; font-weight: bold">
                ¥{{ currentRecord.commissionAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="额外奖励">
              <span style="color: #f56c6c; font-weight: bold">
                ¥{{ currentRecord.bonusAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="总金额">
              <span style="color: #409eff; font-weight: bold; font-size: 18px">
                ¥{{ currentRecord.totalAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>结算信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="结算状态">
              <el-tag :type="getSettlementStatusTag(currentRecord.settlementStatus)" size="small">
                {{ getSettlementStatusLabel(currentRecord.settlementStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="结算日期">
              {{ currentRecord.settlementDate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="支付日期">
              {{ currentRecord.paymentDate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ currentRecord.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ currentRecord.remark || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentRecord && currentRecord.settlementStatus === 'pending'"
          type="primary"
          @click="handleSettle(currentRecord)"
        >
          结算
        </el-button>
        <el-button
          v-if="currentRecord && currentRecord.settlementStatus === 'settled'"
          type="success"
          @click="handlePay(currentRecord)"
        >
          支付
        </el-button>
      </template>
    </el-dialog>

    <!-- 支付对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="支付确认"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="paymentForm" label-width="100px">
        <el-form-item label="支付金额">
          <span style="color: #f56c6c; font-weight: bold; font-size: 18px">
            ¥{{ currentRecord?.totalAmount.toLocaleString() }}
          </span>
        </el-form-item>
        <el-form-item label="支付方式" required>
          <el-select v-model="paymentForm.paymentMethod" placeholder="请选择支付方式">
            <el-option label="银行转账" value="bank_transfer" />
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="success" @click="handleConfirmPayment">
          确认支付
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Money,
  Coin,
  Present,
  User,
  ShoppingCart,
  Clock,
  DocumentChecked,
  CircleCheck,
  Download
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getPromotionProfitList,
  getPromotionProfitStats,
  settlePromotionProfit,
  batchSettlePromotionProfit,
  payPromotionProfit,
  exportPromotionProfitRecords,
  type PromotionProfitRecord,
  type PromotionProfitListParams,
  type PromotionProfitStats
} from '@/api/profit'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 推广级别选项
const PROMOTER_LEVEL_OPTIONS = [
  { label: '一级推广', value: 'primary' },
  { label: '二级推广', value: 'secondary' }
]

// 推广渠道选项
const PROMOTION_CHANNEL_OPTIONS = [
  { label: '微信', value: 'wechat' },
  { label: 'APP', value: 'app' },
  { label: '官网', value: 'web' },
  { label: '线下', value: 'offline' },
  { label: '其他', value: 'other' }
]

// 结算状态选项
const SETTLEMENT_STATUS_OPTIONS = [
  { label: '待结算', value: 'pending' },
  { label: '已结算', value: 'settled' },
  { label: '已支付', value: 'paid' }
]

// 搜索表单
const searchForm = reactive<PromotionProfitListParams>({
  keyword: '',
  promoterLevel: undefined,
  promotionChannel: undefined,
  settlementStatus: undefined,
  settlementMonth: '',
  page: 1,
  pageSize: 10
})

// 搜索字段配置
const searchFields = computed(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '记录编号/推广员姓名/推广员ID',
    width: '240px'
  },
  {
    prop: 'promoterLevel',
    label: '推广级别',
    type: 'select',
    placeholder: '全部级别',
    options: PROMOTER_LEVEL_OPTIONS,
    width: '150px'
  },
  {
    prop: 'promotionChannel',
    label: '推广渠道',
    type: 'select',
    placeholder: '全部渠道',
    options: PROMOTION_CHANNEL_OPTIONS,
    width: '150px'
  },
  {
    prop: 'settlementStatus',
    label: '结算状态',
    type: 'select',
    placeholder: '全部状态',
    options: SETTLEMENT_STATUS_OPTIONS,
    width: '150px'
  },
  {
    prop: 'settlementMonth',
    label: '结算月份',
    type: 'month',
    placeholder: '选择月份',
    valueFormat: 'YYYY-MM',
    width: '150px'
  }
]) as any

// 表格列配置
const tableColumns = computed(() => [
  { prop: 'recordNo', label: '记录编号', width: 150, slot: true },
  { prop: 'promoterInfo', label: '推广员信息', width: 180, slot: true },
  { prop: 'promoterLevel', label: '推广级别', width: 100, slot: true },
  { prop: 'orderInfo', label: '订单信息', width: 150, slot: true },
  { prop: 'settlementMonth', label: '结算月份', width: 100 },
  { prop: 'promotionChannel', label: '推广渠道', width: 100, slot: true },
  { prop: 'amountBreakdown', label: '金额明细', width: 180, slot: true },
  { prop: 'settlementStatus', label: '结算状态', width: 100, slot: true },
  { prop: 'settlementDate', label: '结算日期', width: 120 }
]) as any

// 表格操作配置
const tableActions = computed<TableAction[]>(() => [
  {
    label: '查看详情',
    type: 'primary',
    onClick: handleViewDetail
  },
  {
    label: '结算',
    type: 'primary',
    onClick: handleSettle,
    show: (row: PromotionProfitRecord) => row.settlementStatus === 'pending'
  },
  {
    label: '支付',
    type: 'success',
    onClick: handlePay,
    show: (row: PromotionProfitRecord) => row.settlementStatus === 'settled'
  }
])

// 数据列表
const recordList = ref<PromotionProfitRecord[]>([])
const loading = ref(false)

// 统计数据
const stats = ref<PromotionProfitStats>({
  totalAmount: 0,
  totalCommissionAmount: 0,
  totalBonusAmount: 0,
  totalOrderAmount: 0,
  promoterCount: 0,
  pendingCount: 0,
  settledCount: 0,
  paidCount: 0
})

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<PromotionProfitRecord | null>(null)

// 支付对话框
const paymentDialogVisible = ref(false)
const paymentForm = reactive({
  paymentMethod: ''
})

// 选中的记录ID
const selectedIds = ref<number[]>([])

// 获取统计数据
const fetchStats = async () => {
  try {
    const res: any = await getPromotionProfitStats()
    stats.value = res.data
  } catch (error) {
    handleApiError(error, '获取统计数据失败')
  }
}

// 获取分润记录列表
const fetchRecordList = async () => {
  loading.value = true
  try {
    const res: any = await getPromotionProfitList({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    recordList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '获取分润记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRecordList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.promoterLevel = undefined
  searchForm.promotionChannel = undefined
  searchForm.settlementStatus = undefined
  searchForm.settlementMonth = ''
  pagination.page = 1
  fetchRecordList()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchRecordList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchRecordList()
}

// 选择变化
const handleSelectionChange = (selection: PromotionProfitRecord[]) => {
  selectedIds.value = selection
    .filter((record) => record.settlementStatus === 'pending')
    .map((record) => record.id)
}

// 查看详情
const handleViewDetail = (row: PromotionProfitRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 结算
const handleSettle = async (row: PromotionProfitRecord) => {
  try {
    await ElMessageBox.confirm(
      `确认结算记录"${row.recordNo}"吗？结算后将生成支付任务。`,
      '结算确认',
      {
        type: 'warning'
      }
    )

    await settlePromotionProfit(row.id)
    ElMessage.success('结算成功')
    detailDialogVisible.value = false
    fetchRecordList()
    fetchStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      handleApiError(error, '结算失败')
    }
  }
}

// 批量结算
const handleBatchSettle = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择待结算的记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认批量结算${selectedIds.value.length}条记录吗？`,
      '批量结算确认',
      {
        type: 'warning'
      }
    )

    await batchSettlePromotionProfit(selectedIds.value)
    ElMessage.success('批量结算成功')
    fetchRecordList()
    fetchStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      handleApiError(error, '批量结算失败')
    }
  }
}

// 支付
const handlePay = (row: PromotionProfitRecord) => {
  currentRecord.value = row
  paymentForm.paymentMethod = ''
  paymentDialogVisible.value = true
}

// 确认支付
const handleConfirmPayment = async () => {
  if (!paymentForm.paymentMethod) {
    ElMessage.warning('请选择支付方式')
    return
  }

  try {
    await payPromotionProfit(currentRecord.value!.id, paymentForm.paymentMethod)
    ElMessage.success('支付成功')
    paymentDialogVisible.value = false
    detailDialogVisible.value = false
    fetchRecordList()
    fetchStats()
  } catch (error) {
    handleApiError(error, '支付失败')
  }
}

// 导出记录
const handleExport = async () => {
  try {
    const res: any = await exportPromotionProfitRecords(searchForm)
    ElMessage.success('导出成功')
    console.log('导出文件URL:', res.data.url)
  } catch (error) {
    handleApiError(error, '导出失败')
  }
}

// 获取推广渠道标签类型
const getChannelTag = (channel: string) => {
  const tagMap: Record<string, any> = {
    wechat: 'success',
    app: 'primary',
    web: 'warning',
    offline: 'info',
    other: ''
  }
  return tagMap[channel] || 'info'
}

// 获取推广渠道标签文本
const getChannelLabel = (channel: string) => {
  const labelMap: Record<string, string> = {
    wechat: '微信',
    app: 'APP',
    web: '官网',
    offline: '线下',
    other: '其他'
  }
  return labelMap[channel] || channel
}

// 获取结算状态标签类型
const getSettlementStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    pending: 'warning',
    settled: 'primary',
    paid: 'success'
  }
  return tagMap[status] || 'info'
}

// 获取结算状态标签文本
const getSettlementStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待结算',
    settled: '已结算',
    paid: '已支付'
  }
  return labelMap[status] || status
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchRecordList()
})
</script>

<style scoped lang="scss">
.profit-promotion-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 15px;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          flex: 1;

          .stat-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
          }
        }
      }
    }
  }

  .table-toolbar {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }

  .record-detail {
    .detail-card {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
