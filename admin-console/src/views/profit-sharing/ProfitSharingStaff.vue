<!-- @ts-nocheck -->
<!-- 员工激励管理页面 -->
<template>
  <div class="profit-sharing-staff-container">
    <PageHeader title="员工激励" description="管理员工业绩激励统计和发放" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <StatsCard
          title="总营收"
          :value="`¥${stats.totalRevenue.toLocaleString()}`"
          icon="Money"
          color="#409eff"
        />
      </el-col>
      <el-col :span="8">
        <StatsCard
          title="总激励"
          :value="`¥${stats.totalIncentive.toLocaleString()}`"
          icon="Present"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="8">
        <StatsCard
          title="员工数量"
          :value="stats.employeeCount"
          icon="User"
          color="#e6a23c"
        />
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <SearchForm :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #status="{ row }">
        <el-tag v-if="row.status === 'pending'" type="warning">待发放</el-tag>
        <el-tag v-else-if="row.status === 'settled'" type="info">已结算</el-tag>
        <el-tag v-else-if="row.status === 'paid'" type="success">已发放</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { StaffProfit, StaffProfitStats } from '@/api/profitSharing'

const stats = ref<StaffProfitStats>({
  totalRevenue: 0,
  totalIncentive: 0,
  employeeCount: 0,
})

const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '员工姓名/部门',
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '待发放', value: 'pending' },
      { label: '已结算', value: 'settled' },
      { label: '已发放', value: 'paid' },
    ],
  },
  {
    type: 'month',
    prop: 'month',
    label: '月份',
    placeholder: '请选择月份',
  },
]

const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'employeeName', label: '员工姓名', width: 120 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'orderCount', label: '订单数', width: 100 },
  { prop: 'totalRevenue', label: '总营收(元)', width: 130, formatter: (row: StaffProfit) => `¥${row.totalRevenue.toLocaleString()}` },
  { prop: 'incentiveAmount', label: '激励金额(元)', width: 130, formatter: (row: StaffProfit) => `¥${row.incentiveAmount.toLocaleString()}` },
  { prop: 'incentiveRatio', label: '激励比例', width: 100 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' },
]

const tableData = ref<StaffProfit[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  status: '',
  month: '',
})

const fetchStats = async () => {
  try {
    const res = await profitSharingApi.getStaffProfitStats()
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
    const res = await profitSharingApi.getStaffProfitList({
      page: pagination.currentPage,
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

const handleSearch = (params: any) => {
  Object.assign(searchParams, params)
  pagination.currentPage = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    keyword: '',
    status: '',
    month: '',
  })
  pagination.currentPage = 1
  fetchList()
}

const handlePageChange = (page: number) => {
  pagination.currentPage = page
  fetchList()
}

const handleView = (row: StaffProfit) => {
  ElMessage.info(`查看详情: ${row.employeeName}`)
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-staff-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }
}
</style>
