<!-- 员工绩效管理页面 -->
<template>
  <div class="employee-performance-container">
    <PageHeader title="员工绩效管理" description="查看和管理员工绩效数据、评分和奖金发放" />

    <!-- 统计卡片 -->
    <StatsCard :stats="statsCards" />

    <!-- 搜索表单 -->
    <SearchForm v-model="searchParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :actions-width="120"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #score="{ row }">
        <el-progress
          :percentage="row.score"
          :color="getScoreColor(row.score)"
          :stroke-width="20"
        />
      </template>

      <template #rank="{ row }">
        <el-tag v-if="row.rank === 1" type="danger">第{{ row.rank }}名</el-tag>
        <el-tag v-else-if="row.rank <= 3" type="warning">第{{ row.rank }}名</el-tag>
        <el-tag v-else type="info">第{{ row.rank }}名</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, TrendCharts, Money, Trophy } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn } from '@/components/common/DataTable.vue'
import { employeeApi } from '@/api/employee'
import type { EmployeePerformance, EmployeePerformanceStats } from '@/api/employee'

const stats = ref<EmployeePerformanceStats>({
  totalEmployees: 0,
  avgScore: 0,
  avgBonus: 0,
  topPerformer: '',
})

// 统计卡片数据
const statsCards = computed(() => [
  {
    label: '考核员工数',
    value: stats.value.totalEmployees,
    icon: User,
    color: '#409eff',
    format: 'number' as const,
  },
  {
    label: '平均绩效分',
    value: stats.value.avgScore.toFixed(1),
    icon: TrendCharts,
    color: '#67c23a',
  },
  {
    label: '平均奖金',
    value: stats.value.avgBonus,
    icon: Money,
    color: '#e6a23c',
    format: 'currency' as const,
  },
  {
    label: '本月最佳',
    value: stats.value.topPerformer,
    icon: Trophy,
    color: '#f56c6c',
  },
])

const searchFields: SearchField[] = [
  {
    type: 'date',
    prop: 'month',
    label: '月份',
    placeholder: '请选择月份',
  },
  {
    type: 'input',
    prop: 'employeeId',
    label: '员工ID',
    placeholder: '请输入员工ID',
  },
]

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'employeeName', label: '员工姓名', width: 120 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'orderCount', label: '订单数', width: 100 },
  { prop: 'totalRevenue', label: '总营收(元)', width: 130 },
  { prop: 'customerSatisfaction', label: '客户满意度', width: 120 },
  { prop: 'attendanceRate', label: '出勤率', width: 100 },
  { prop: 'score', label: '综合评分', width: 150, slot: 'score' },
  { prop: 'rank', label: '排名', width: 100, slot: 'rank' },
  { prop: 'bonus', label: '奖金(元)', width: 120 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<EmployeePerformance[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  month: '',
  employeeId: undefined as number | undefined,
})

const getScoreColor = (score: number) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#e6a23c'
  if (score >= 60) return '#409eff'
  return '#f56c6c'
}

const fetchStats = async () => {
  try {
    const res = await employeeApi.getEmployeePerformanceStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await employeeApi.getEmployeePerformanceList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchParams,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    month: '',
    employeeId: undefined,
  })
  pagination.page = 1
  fetchList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const handleView = (row: EmployeePerformance) => {
  ElMessage.info(`查看详情: ${row.employeeName}`)
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.employee-performance-container {
  padding: 20px;
}
</style>
