<!-- @ts-nocheck -->
<template>
  <div class="profit-employee-container">
    <PageHeader title="员工激励分润管理" description="管理员工激励分润和结算" />

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
              <el-icon :size="32" color="#67c23a"><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">基础金额</div>
              <div class="stat-value" style="color: #67c23a">
                ¥{{ stats.totalBaseAmount.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0">
              <el-icon :size="32" color="#f56c6c"><TrophyBase /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">奖金金额</div>
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
              <div class="stat-label">员工数量</div>
              <div class="stat-value" style="color: #e6a23c">
                {{ stats.employeeCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 结算状态统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
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
      <el-col :span="8">
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
      <el-col :span="8">
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
      <template #employeeInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.employeeName }} ({{ row.employeeId }})</div>
          <div style="color: #909399">{{ row.department }} - {{ row.position }}</div>
        </div>
      </template>
      <template #incentiveType="{ row }">
        <el-tag :type="getIncentiveTypeTag(row.incentiveType)" size="small">
          {{ getIncentiveTypeLabel(row.incentiveType) }}
        </el-tag>
      </template>
      <template #amountBreakdown="{ row }">
        <div style="font-size: 12px">
          <div>基础: ¥{{ row.baseAmount.toLocaleString() }}</div>
          <div style="color: #f56c6c">奖金: ¥{{ row.bonusAmount.toLocaleString() }}</div>
          <div style="color: #409eff; font-weight: bold">总计: ¥{{ row.totalAmount.toLocaleString() }}</div>
        </div>
      </template>
      <template #performanceScore="{ row }">
        <div style="display: flex; align-items: center; gap: 8px">
          <el-progress
            :percentage="row.performanceScore"
            :color="getPerformanceColor(row.performanceScore)"
            :stroke-width="8"
            style="flex: 1"
          />
          <span style="font-weight: bold; min-width: 35px">{{ row.performanceScore }}</span>
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
      title="员工激励分润详情"
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
            <el-descriptions-item label="员工ID">
              {{ currentRecord.employeeId }}
            </el-descriptions-item>
            <el-descriptions-item label="员工姓名">
              {{ currentRecord.employeeName }}
            </el-descriptions-item>
            <el-descriptions-item label="部门">
              {{ currentRecord.department }}
            </el-descriptions-item>
            <el-descriptions-item label="职位">
              {{ currentRecord.position }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>激励信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="激励类型">
              <el-tag :type="getIncentiveTypeTag(currentRecord.incentiveType)" size="small">
                {{ getIncentiveTypeLabel(currentRecord.incentiveType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="关联订单数">
              {{ currentRecord.orderCount }}
            </el-descriptions-item>
            <el-descriptions-item label="绩效分数" :span="2">
              <div style="display: flex; align-items: center; gap: 10px">
                <el-progress
                  :percentage="currentRecord.performanceScore"
                  :color="getPerformanceColor(currentRecord.performanceScore)"
                  :stroke-width="10"
                  style="flex: 1"
                />
                <span style="font-weight: bold; font-size: 16px">
                  {{ currentRecord.performanceScore }}
                </span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>金额明细</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="基础金额">
              <span style="color: #67c23a; font-weight: bold">
                ¥{{ currentRecord.baseAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="奖金金额">
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
  Wallet,
  TrophyBase,
  User,
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
  getEmployeeProfitList,
  getEmployeeProfitStats,
  settleEmployeeProfit,
  batchSettleEmployeeProfit,
  payEmployeeProfit,
  exportEmployeeProfitRecords,
  type EmployeeProfitRecord,
  type EmployeeProfitListParams,
  type EmployeeProfitStats
} from '@/api/profit'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 激励类型选项
const INCENTIVE_TYPE_OPTIONS = [
  { label: '销售激励', value: 'sales' },
  { label: '服务激励', value: 'service' },
  { label: '绩效激励', value: 'performance' },
  { label: '其他激励', value: 'other' }
]

// 结算状态选项
const SETTLEMENT_STATUS_OPTIONS = [
  { label: '待结算', value: 'pending' },
  { label: '已结算', value: 'settled' },
  { label: '已支付', value: 'paid' }
]

// 部门选项（实际应该从后端获取）
const DEPARTMENT_OPTIONS = [
  { label: '销售部', value: '销售部' },
  { label: '客服部', value: '客服部' },
  { label: '运营部', value: '运营部' },
  { label: '技术部', value: '技术部' },
  { label: '市场部', value: '市场部' }
]

// 搜索表单
const searchForm = reactive<EmployeeProfitListParams>({
  keyword: '',
  department: undefined,
  incentiveType: undefined,
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
    placeholder: '记录编号/员工姓名/员工ID',
    width: '220px'
  },
  {
    prop: 'department',
    label: '部门',
    type: 'select',
    placeholder: '全部部门',
    options: DEPARTMENT_OPTIONS,
    width: '150px'
  },
  {
    prop: 'incentiveType',
    label: '激励类型',
    type: 'select',
    placeholder: '全部类型',
    options: INCENTIVE_TYPE_OPTIONS,
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
  { prop: 'employeeInfo', label: '员工信息', width: 200, slot: true },
  { prop: 'settlementMonth', label: '结算月份', width: 100 },
  { prop: 'incentiveType', label: '激励类型', width: 120, slot: true },
  { prop: 'amountBreakdown', label: '金额明细', width: 150, slot: true },
  { prop: 'performanceScore', label: '绩效分数', width: 180, slot: true },
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
    show: (row: EmployeeProfitRecord) => row.settlementStatus === 'pending'
  },
  {
    label: '支付',
    type: 'success',
    onClick: handlePay,
    show: (row: EmployeeProfitRecord) => row.settlementStatus === 'settled'
  }
])

// 数据列表
const recordList = ref<EmployeeProfitRecord[]>([])
const loading = ref(false)

// 统计数据
const stats = ref<EmployeeProfitStats>({
  totalAmount: 0,
  totalBaseAmount: 0,
  totalBonusAmount: 0,
  employeeCount: 0,
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
const currentRecord = ref<EmployeeProfitRecord | null>(null)

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
    const res: any = await getEmployeeProfitStats()
    stats.value = res.data
  } catch (error) {
    handleApiError(error, '获取统计数据失败')
  }
}

// 获取分润记录列表
const fetchRecordList = async () => {
  loading.value = true
  try {
    const res: any = await getEmployeeProfitList({
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
  searchForm.department = undefined
  searchForm.incentiveType = undefined
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
const handleSelectionChange = (selection: EmployeeProfitRecord[]) => {
  selectedIds.value = selection
    .filter((record) => record.settlementStatus === 'pending')
    .map((record) => record.id)
}

// 查看详情
const handleViewDetail = (row: EmployeeProfitRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 结算
const handleSettle = async (row: EmployeeProfitRecord) => {
  try {
    await ElMessageBox.confirm(
      `确认结算记录"${row.recordNo}"吗？结算后将生成支付任务。`,
      '结算确认',
      {
        type: 'warning'
      }
    )

    await settleEmployeeProfit(row.id)
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

    await batchSettleEmployeeProfit(selectedIds.value)
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
const handlePay = (row: EmployeeProfitRecord) => {
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
    await payEmployeeProfit(currentRecord.value!.id, paymentForm.paymentMethod)
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
    const res: any = await exportEmployeeProfitRecords(searchForm)
    ElMessage.success('导出成功')
    console.log('导出文件URL:', res.data.url)
  } catch (error) {
    handleApiError(error, '导出失败')
  }
}

// 获取激励类型标签类型
const getIncentiveTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    sales: 'success',
    service: 'primary',
    performance: 'warning',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取激励类型标签文本
const getIncentiveTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    sales: '销售激励',
    service: '服务激励',
    performance: '绩效激励',
    other: '其他激励'
  }
  return labelMap[type] || type
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

// 获取绩效分数颜色
const getPerformanceColor = (score: number) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchRecordList()
})
</script>

<style scoped lang="scss">
.profit-employee-container {
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
