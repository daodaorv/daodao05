<!-- @ts-nocheck -->
<template>
  <div class="hosting-income-container">
    <PageHeader title="收益管理" description="管理托管车辆收益统计和分成记录" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #ecf5ff">
              <el-icon :size="32" color="#409eff"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">总收益</div>
              <div class="stat-value">¥{{ stats.totalIncome.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="32" color="#67c23a"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">车主收益</div>
              <div class="stat-value" style="color: #67c23a">
                ¥{{ stats.ownerIncome.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0">
              <el-icon :size="32" color="#f56c6c"><Shop /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">平台收益</div>
              <div class="stat-value" style="color: #f56c6c">
                ¥{{ stats.platformIncome.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fdf6ec">
              <el-icon :size="32" color="#e6a23c"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">本月收益</div>
              <div class="stat-value" style="color: #e6a23c">
                ¥{{ stats.monthlyIncome.toLocaleString() }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 车辆统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f4f4f5">
              <el-icon :size="28" color="#909399"><Van /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">托管车辆数</div>
              <div class="stat-value">{{ stats.vehicleCount }}</div>
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
              <div class="stat-label">运营中车辆</div>
              <div class="stat-value">{{ stats.activeVehicleCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0">
              <el-icon :size="28" color="#409eff"><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">平均使用率</div>
              <div class="stat-value">{{ stats.averageUtilization }}%</div>
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
      <el-button type="primary" @click="handleExport">
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
      :actions-width="120"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #recordNo="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleViewDetail(row)">
          {{ row.recordNo }}
        </span>
      </template>
      <template #vehicleInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.vehicleBrand }} {{ row.vehicleModel }}</div>
          <div style="color: #909399">{{ row.licensePlate }}</div>
        </div>
      </template>
      <template #type="{ row }">
        <el-tag :type="getTypeTag(row.type)" size="small">
          {{ getTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #amount="{ row }">
        <span style="color: #f56c6c; font-weight: bold; font-size: 14px">
          ¥{{ row.amount.toLocaleString() }}
        </span>
      </template>
      <template #distribution="{ row }">
        <div style="font-size: 12px">
          <div style="color: #67c23a">车主: ¥{{ row.ownerAmount.toLocaleString() }} ({{ row.ownerShare }}%)</div>
          <div style="color: #409eff">平台: ¥{{ row.platformAmount.toLocaleString() }} ({{ row.platformShare }}%)</div>
        </div>
      </template>
      <template #settlementStatus="{ row }">
        <el-tag :type="row.settlementStatus === 'settled' ? 'success' : 'warning'" size="small">
          {{ row.settlementStatus === 'settled' ? '已结算' : '待结算' }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 收益详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="收益记录详情"
      width="700px"
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
            <el-descriptions-item label="记录日期">
              {{ currentRecord.recordDate }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆编号">
              {{ currentRecord.vehicleNo }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆信息">
              {{ currentRecord.vehicleBrand }} {{ currentRecord.vehicleModel }}
            </el-descriptions-item>
            <el-descriptions-item label="车牌号">
              {{ currentRecord.licensePlate }}
            </el-descriptions-item>
            <el-descriptions-item label="车主姓名">
              {{ currentRecord.ownerName }}
            </el-descriptions-item>
            <el-descriptions-item label="收益类型">
              <el-tag :type="getTypeTag(currentRecord.type)" size="small">
                {{ getTypeLabel(currentRecord.type) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="关联订单">
              {{ currentRecord.orderNo || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>收益分配</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="总金额">
              <span style="color: #f56c6c; font-weight: bold; font-size: 18px">
                ¥{{ currentRecord.amount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="车主分成">
              <span style="color: #67c23a; font-weight: bold">
                {{ currentRecord.ownerShare }}% = ¥{{ currentRecord.ownerAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="平台分成">
              <span style="color: #409eff; font-weight: bold">
                {{ currentRecord.platformShare }}% = ¥{{ currentRecord.platformAmount.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="结算状态">
              <el-tag :type="currentRecord.settlementStatus === 'settled' ? 'success' : 'warning'" size="small">
                {{ currentRecord.settlementStatus === 'settled' ? '已结算' : '待结算' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDateTime(currentRecord.createdAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Money,
  User,
  Shop,
  TrendCharts,
  Van,
  CircleCheck,
  DataLine,
  Download
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableAction } from '@/components/common/DataTable.vue'
import {
  getIncomeRecordList,
  getIncomeStats,
  exportIncomeRecords,
  type IncomeRecord,
  type IncomeRecordListParams,
  type IncomeStats
} from '@/api/hosting'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 收益类型选项
const INCOME_TYPE_OPTIONS = [
  { label: '租赁收益', value: 'rental' },
  { label: '车主自用', value: 'owner_usage' },
  { label: '违约罚款', value: 'penalty' },
  { label: '淡季补贴', value: 'subsidy' },
  { label: '其他', value: 'other' }
]

// 结算状态选项
const SETTLEMENT_STATUS_OPTIONS = [
  { label: '待结算', value: 'pending' },
  { label: '已结算', value: 'settled' }
]

// 搜索表单
const searchForm = reactive<IncomeRecordListParams>({
  keyword: '',
  type: undefined,
  settlementStatus: undefined,
  startDate: '',
  endDate: ''
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '记录编号/车辆编号/车主姓名',
    width: '220px'
  },
  {
    prop: 'type',
    label: '收益类型',
    type: 'select',
    placeholder: '全部类型',
    options: INCOME_TYPE_OPTIONS,
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
    prop: 'startDate',
    label: '开始日期',
    type: 'date',
    placeholder: '开始日期',
    width: '150px'
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'date',
    placeholder: '结束日期',
    width: '150px'
  }
])

// 表格列配置
const tableColumns = computed(() => [
  { prop: 'recordNo', label: '记录编号', width: 150, slot: true },
  { prop: 'vehicleInfo', label: '车辆信息', width: 180, slot: true },
  { prop: 'ownerName', label: '车主姓名', width: 100 },
  { prop: 'type', label: '收益类型', width: 100, slot: true },
  { prop: 'orderNo', label: '关联订单', width: 150 },
  { prop: 'amount', label: '总金额', width: 120, slot: true },
  { prop: 'distribution', label: '收益分配', width: 180, slot: true },
  { prop: 'settlementStatus', label: '结算状态', width: 100, slot: true },
  { prop: 'recordDate', label: '记录日期', width: 120 }
]) as any

// 表格操作配置
const tableActions = computed<TableAction[]>(() => [
  {
    label: '查看详情',
    type: 'primary',
    onClick: handleViewDetail
  }
])

// 数据列表
const recordList = ref<IncomeRecord[]>([])
const loading = ref(false)

// 统计数据
const stats = ref<IncomeStats>({
  totalIncome: 0,
  ownerIncome: 0,
  platformIncome: 0,
  monthlyIncome: 0,
  vehicleCount: 0,
  activeVehicleCount: 0,
  averageUtilization: 0
})

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<IncomeRecord | null>(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    const res: any = await getIncomeStats()
    stats.value = res.data
  } catch (error) {
    handleApiError(error, '获取统计数据失败')
  }
}

// 获取收益记录列表
const fetchRecordList = async () => {
  loading.value = true
  try {
    const res: any = await getIncomeRecordList({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    recordList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '获取收益记录失败')
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
  searchForm.type = undefined
  searchForm.settlementStatus = undefined
  searchForm.startDate = ''
  searchForm.endDate = ''
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

// 查看详情
const handleViewDetail = (row: IncomeRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 导出记录
const handleExport = async () => {
  try {
    const res: any = await exportIncomeRecords(searchForm)
    ElMessage.success('导出成功')
    // 这里可以添加下载文件的逻辑
    console.log('导出文件URL:', res.data.url)
  } catch (error) {
    handleApiError(error, '导出失败')
  }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取类型标签类型
const getTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    rental: 'success',
    owner_usage: 'primary',
    penalty: 'danger',
    subsidy: 'warning',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    rental: '租赁收益',
    owner_usage: '车主自用',
    penalty: '违约罚款',
    subsidy: '淡季补贴',
    other: '其他'
  }
  return labelMap[type] || type
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchRecordList()
})
</script>

<style scoped lang="scss">
.hosting-income-container {
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
    justify-content: flex-end;
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
