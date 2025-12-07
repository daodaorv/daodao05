<!-- @ts-nocheck -->
<template>
  <div class="finance-income-container">
    <PageHeader title="收入统计" description="查看和分析平台收入数据" />

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总收入"
          :value="`¥${stats.totalIncome.toLocaleString()}`"
          icon="Money"
          color="#67C23A"
        >
          <template #extra>
            <div class="stat-extra">
              <span :class="stats.incomeGrowth >= 0 ? 'growth-up' : 'growth-down'">
                {{ stats.incomeGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.incomeGrowth) }}%
              </span>
            </div>
          </template>
        </StatsCard>
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="订单收入"
          :value="`¥${stats.orderIncome.toLocaleString()}`"
          icon="List"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="增值收入"
          :value="`¥${stats.extraIncome.toLocaleString()}`"
          icon="Plus"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="押金收入"
          :value="`¥${stats.depositIncome.toLocaleString()}`"
          icon="Wallet"
          color="#909399"
        />
      </el-col>
    </el-row>

    <!-- 时间维度统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <div class="page-card">
          <div class="card-header">
            <h3>今日收入</h3>
          </div>
          <div class="amount-display">¥{{ stats.todayIncome.toLocaleString() }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="page-card">
          <div class="card-header">
            <h3>本月收入</h3>
          </div>
          <div class="amount-display">¥{{ stats.monthIncome.toLocaleString() }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="page-card">
          <div class="card-header">
            <h3>本年收入</h3>
          </div>
          <div class="amount-display">¥{{ stats.yearIncome.toLocaleString() }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 门店收入排行 -->
    <div class="page-card">
      <div class="card-header">
        <h3>门店收入排行</h3>
      </div>
      <el-table :data="stats.incomeByStore" border stripe>
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="storeName" label="门店名称" min-width="200" />
        <el-table-column label="收入金额" width="150">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.income.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="增长率" width="120">
          <template #default="{ row }">
            <span :class="row.growth >= 0 ? 'growth-up' : 'growth-down'">
              {{ row.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(row.growth) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="占比" width="150">
          <template #default="{ row }">
            <el-progress
              :percentage="(row.income / stats.totalIncome * 100)"
              :color="getProgressColor(row.income / stats.totalIncome * 100)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 月度收入趋势 -->
    <div class="page-card">
      <div class="card-header">
        <h3>月度收入趋势</h3>
      </div>
      <ChartCard
        title=""
        :chart-data="incomeChartData"
        chart-type="line"
        :height="300"
      />
    </div>

    <!-- 收入明细列表 -->
    <div class="page-card">
      <div class="card-header">
        <h3>收入明细</h3>
      </div>

      <!-- 搜索和筛选 -->
      <div class="toolbar">
        <SearchForm
          v-model="searchForm"
          :fields="searchFields"
          @search="handleSearch"
          @reset="handleReset"
        />
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>

      <!-- 数据表格 -->
      <DataTable
        :data="incomeList"
        :columns="tableColumns"
        :loading="loading"
        :pagination="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <!-- 订单类型 -->
        <template #orderType="{ row }">
          <el-tag :type="getOrderTypeTag(row.orderType)" size="small">
            {{ row.orderType }}
          </el-tag>
        </template>

        <!-- 金额 -->
        <template #amount="{ row }">
          <span class="amount-text">¥{{ row.amount.toLocaleString() }}</span>
        </template>

        <!-- 支付方式 -->
        <template #paymentMethod="{ row }">
          <el-tag size="small">{{ row.paymentMethod }}</el-tag>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import ChartCard from '@/components/common/ChartCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import {
  getIncomeStats,
  getIncomeList,
  type IncomeStats,
  type IncomeRecord
} from '@/api/finance'
import { exportToCSV } from '@/utils/export'

// 统计数据
const stats = ref<IncomeStats>({
  totalIncome: 0,
  orderIncome: 0,
  extraIncome: 0,
  depositIncome: 0,
  incomeGrowth: 0,
  todayIncome: 0,
  monthIncome: 0,
  yearIncome: 0,
  incomeByStore: [],
  incomeByMonth: []
})

// 搜索表单
const searchForm = ref({
  storeId: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'storeId',
    label: '门店',
    placeholder: '请选择门店',
    options: [
      { label: '北京朝阳门店', value: 1 },
      { label: '上海浦东门店', value: 2 },
      { label: '深圳南山门店', value: 3 },
      { label: '成都高新门店', value: 4 },
      { label: '杭州西湖门店', value: 5 }
    ]
  },
  {
    type: 'date',
    prop: 'startDate',
    label: '开始日期',
    placeholder: '请选择开始日期'
  },
  {
    type: 'date',
    prop: 'endDate',
    label: '结束日期',
    placeholder: '请选择结束日期'
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '订单号/用户名'
  }
]

// 收入列表
const incomeList = ref<IncomeRecord[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderId', label: '订单号', width: 150 },
  { prop: 'orderType', label: '订单类型', width: 120, slot: 'orderType' },
  { prop: 'amount', label: '金额', width: 120, slot: 'amount' },
  { prop: 'paymentMethod', label: '支付方式', width: 120, slot: 'paymentMethod' },
  { prop: 'storeName', label: '门店', width: 150 },
  { prop: 'userName', label: '用户', width: 120 },
  { prop: 'description', label: '说明', minWidth: 200 },
  { prop: 'createdAt', label: '时间', width: 160 }
]

// 收入趋势图表数据
const incomeChartData = computed(() => ({
  labels: stats.value.incomeByMonth.map(item => item.month),
  datasets: [
    {
      label: '月度收入',
      data: stats.value.incomeByMonth.map(item => item.income),
      borderColor: '#67C23A',
      backgroundColor: 'rgba(103, 194, 58, 0.1)',
      tension: 0.4
    }
  ]
}))

// 获取统计数据
const fetchStats = async () => {
  try {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), 0, 1).toISOString()
    const endDate = now.toISOString()
    stats.value = await getIncomeStats({ startDate, endDate })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 获取收入列表
const fetchIncomeList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      storeId: searchForm.value.storeId ? Number(searchForm.value.storeId) : undefined,
      startDate: searchForm.value.startDate,
      endDate: searchForm.value.endDate,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getIncomeList(params)
    incomeList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取收入列表失败:', error)
    ElMessage.error('获取收入列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchIncomeList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    storeId: '',
    startDate: '',
    endDate: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchIncomeList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchIncomeList()
}

// 导出数据
const handleExport = () => {
  if (incomeList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(incomeList.value, columns, '收入明细')
}

// 获取订单类型标签
const getOrderTypeTag = (type: string) => {
  const typeMap: Record<string, any> = {
    '租车订单': 'success',
    '增值服务': 'warning',
    '押金': 'info',
    '违章罚款': 'danger'
  }
  return typeMap[type] || ''
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 30) return '#67C23A'
  if (percentage >= 20) return '#E6A23C'
  return '#F56C6C'
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchIncomeList()
})
</script>

<style scoped lang="scss">
.finance-income-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-extra {
  margin-top: 8px;
  font-size: 14px;
}

.growth-up {
  color: #67c23a;
  font-weight: 600;
}

.growth-down {
  color: #f56c6c;
  font-weight: 600;
}

.amount-display {
  font-size: 32px;
  font-weight: 600;
  color: #67c23a;
  text-align: center;
  padding: 20px 0;
}

.amount-text {
  color: #67c23a;
  font-weight: 600;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
