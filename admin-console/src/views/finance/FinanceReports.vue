<!-- @ts-nocheck -->
<template>
  <div class="finance-reports-container">
    <PageHeader title="财务报表" description="查看和分析财务报表数据" />

    <!-- 报表筛选 -->
    <div class="page-card filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="报表类型">
          <el-select v-model="filterForm.type" placeholder="请选择类型" @change="handleFilterChange">
            <el-option label="日报" value="daily" />
            <el-option label="周报" value="weekly" />
            <el-option label="月报" value="monthly" />
            <el-option label="季报" value="quarterly" />
            <el-option label="年报" value="yearly" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker
            v-model="filterForm.startDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            @change="handleFilterChange"
          />
        </el-form-item>

        <el-form-item label="结束日期">
          <el-date-picker
            v-model="filterForm.endDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            @change="handleFilterChange"
          />
        </el-form-item>

        <el-form-item label="门店">
          <el-select v-model="filterForm.storeId" placeholder="全部门店" clearable @change="handleFilterChange">
            <el-option label="北京朝阳门店" :value="1" />
            <el-option label="上海浦东门店" :value="2" />
            <el-option label="深圳南山门店" :value="3" />
            <el-option label="成都高新门店" :value="4" />
            <el-option label="杭州西湖门店" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleGenerate" :loading="loading">
            <el-icon><Document /></el-icon>
            生成报表
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出报表
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 报表概览 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总收入"
          :value="`¥${report.totalIncome.toLocaleString()}`"
          icon="Money"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="总支出"
          :value="`¥${report.totalExpense.toLocaleString()}`"
          icon="Wallet"
          color="#F56C6C"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="净利润"
          :value="`¥${report.netProfit.toLocaleString()}`"
          icon="TrendCharts"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="利润率"
          :value="`${report.profitMargin.toFixed(2)}%`"
          icon="DataAnalysis"
          color="#E6A23C"
        />
      </el-col>
    </el-row>

    <!-- 收入明细 -->
    <div class="page-card">
      <div class="card-header">
        <h3>收入明细</h3>
      </div>
      <el-row :gutter="16">
        <el-col :span="12">
          <ChartCard
            title=""
            :chart-data="incomeChartData"
            chart-type="pie"
            :height="300"
          />
        </el-col>
        <el-col :span="12">
          <el-table :data="report.incomeDetails" border stripe>
            <el-table-column prop="category" label="类别" />
            <el-table-column label="金额">
              <template #default="{ row }">
                <span class="income-text">¥{{ row.amount.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="'#67C23A'" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- 支出明细 -->
    <div class="page-card">
      <div class="card-header">
        <h3>支出明细</h3>
      </div>
      <el-row :gutter="16">
        <el-col :span="12">
          <ChartCard
            title=""
            :chart-data="expenseChartData"
            chart-type="pie"
            :height="300"
          />
        </el-col>
        <el-col :span="12">
          <el-table :data="report.expenseDetails" border stripe>
            <el-table-column prop="category" label="类别" />
            <el-table-column label="金额">
              <template #default="{ row }">
                <span class="expense-text">¥{{ row.amount.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="'#F56C6C'" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- 趋势分析 -->
    <div class="page-card">
      <div class="card-header">
        <h3>趋势分析</h3>
      </div>
      <ChartCard
        title=""
        :chart-data="trendChartData"
        chart-type="line"
        :height="350"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import ChartCard from '@/components/common/ChartCard.vue'
import {
  getFinancialReports,
  type FinancialReport,
  type ReportType
} from '@/api/finance'

// 筛选表单
const filterForm = reactive({
  type: 'monthly' as ReportType,
  startDate: '',
  endDate: '',
  storeId: undefined as number | undefined
})

// 报表数据
const report = ref<FinancialReport>({
  type: 'monthly',
  period: '',
  totalIncome: 0,
  totalExpense: 0,
  netProfit: 0,
  profitMargin: 0,
  incomeDetails: [],
  expenseDetails: [],
  trends: []
})

const loading = ref(false)

// 收入饼图数据
const incomeChartData = computed(() => ({
  labels: report.value.incomeDetails.map(item => item.category),
  datasets: [
    {
      data: report.value.incomeDetails.map(item => item.amount),
      backgroundColor: [
        '#67C23A',
        '#409EFF',
        '#E6A23C',
        '#F56C6C',
        '#909399'
      ]
    }
  ]
}))

// 支出饼图数据
const expenseChartData = computed(() => ({
  labels: report.value.expenseDetails.map(item => item.category),
  datasets: [
    {
      data: report.value.expenseDetails.map(item => item.amount),
      backgroundColor: [
        '#F56C6C',
        '#E6A23C',
        '#409EFF',
        '#67C23A',
        '#909399'
      ]
    }
  ]
}))

// 趋势图数据
const trendChartData = computed(() => ({
  labels: report.value.trends.map(item => item.date),
  datasets: [
    {
      label: '收入',
      data: report.value.trends.map(item => item.income),
      borderColor: '#67C23A',
      backgroundColor: 'rgba(103, 194, 58, 0.1)',
      tension: 0.4
    },
    {
      label: '支出',
      data: report.value.trends.map(item => item.expense),
      borderColor: '#F56C6C',
      backgroundColor: 'rgba(245, 108, 108, 0.1)',
      tension: 0.4
    },
    {
      label: '利润',
      data: report.value.trends.map(item => item.profit),
      borderColor: '#409EFF',
      backgroundColor: 'rgba(64, 158, 255, 0.1)',
      tension: 0.4
    }
  ]
}))

// 获取报表数据
const fetchReport = async () => {
  loading.value = true
  try {
    // 设置默认日期范围
    if (!filterForm.startDate || !filterForm.endDate) {
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      filterForm.startDate = startDate.toISOString().split('T')[0]
      filterForm.endDate = endDate.toISOString().split('T')[0]
    }

    const params = {
      type: filterForm.type,
      startDate: filterForm.startDate,
      endDate: filterForm.endDate,
      storeId: filterForm.storeId
    }
    report.value = await getFinancialReports(params)
  } catch (error) {
    console.error('获取报表数据失败:', error)
    ElMessage.error('获取报表数据失败')
  } finally {
    loading.value = false
  }
}

// 筛选变化
const handleFilterChange = () => {
  // 自动生成报表
  if (filterForm.startDate && filterForm.endDate) {
    fetchReport()
  }
}

// 生成报表
const handleGenerate = () => {
  if (!filterForm.startDate || !filterForm.endDate) {
    ElMessage.warning('请选择日期范围')
    return
  }
  fetchReport()
}

// 导出报表
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 初始化
onMounted(() => {
  fetchReport()
})
</script>

<style scoped lang="scss">
.finance-reports-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;

  .el-form {
    margin-bottom: 0;
  }
}

.stats-row {
  margin-bottom: 20px;
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

.income-text {
  color: #67c23a;
  font-weight: 600;
}

.expense-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>
