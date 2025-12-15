<!-- @ts-nocheck -->
<!-- 托管分润管理页面 -->
<template>
  <div class="profit-sharing-hosting-container">
    <PageHeader title="托管分润" description="管理托管车辆收益分润统计和结算" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总收益"
          :value="`¥${stats.totalRevenue.toLocaleString()}`"
          icon="Money"
          color="#409eff"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="车主分成"
          :value="`¥${stats.totalOwnerShare.toLocaleString()}`"
          icon="User"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="平台分成"
          :value="`¥${stats.totalPlatformShare.toLocaleString()}`"
          icon="Shop"
          color="#f56c6c"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="车辆数量"
          :value="stats.vehicleCount"
          icon="Van"
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
        <el-tag v-if="row.status === 'pending'" type="warning">待结算</el-tag>
        <el-tag v-else-if="row.status === 'settled'" type="info">已结算</el-tag>
        <el-tag v-else-if="row.status === 'paid'" type="success">已支付</el-tag>
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
import type { HostingProfit, HostingProfitStats } from '@/api/profitSharing'

// 统计数据
const stats = ref<HostingProfitStats>({
  totalRevenue: 0,
  totalOwnerShare: 0,
  totalPlatformShare: 0,
  vehicleCount: 0,
})

// 搜索字段配置
const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '车牌号/车主姓名',
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '待结算', value: 'pending' },
      { label: '已结算', value: 'settled' },
      { label: '已支付', value: 'paid' },
    ],
  },
  {
    type: 'month',
    prop: 'month',
    label: '月份',
    placeholder: '请选择月份',
  },
]

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'vehiclePlate', label: '车牌号', width: 120 },
  { prop: 'ownerName', label: '车主姓名', width: 120 },
  { prop: 'orderCount', label: '订单数', width: 100 },
  { prop: 'totalRevenue', label: '总收益(元)', width: 120, formatter: (row: HostingProfit) => `¥${row.totalRevenue.toLocaleString()}` },
  { prop: 'ownerShare', label: '车主分成(元)', width: 130, formatter: (row: HostingProfit) => `¥${row.ownerShare.toLocaleString()}` },
  { prop: 'platformShare', label: '平台分成(元)', width: 130, formatter: (row: HostingProfit) => `¥${row.platformShare.toLocaleString()}` },
  { prop: 'shareRatio', label: '分成比例', width: 100 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' },
]

// 表格数据
const tableData = ref<HostingProfit[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 搜索参数
const searchParams = reactive({
  keyword: '',
  status: '',
  month: '',
})

// 获取统计数据
const fetchStats = async () => {
  try {
    const res = await profitSharingApi.getHostingProfitStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const res = await profitSharingApi.getHostingProfitList({
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

// 搜索
const handleSearch = (params: any) => {
  Object.assign(searchParams, params)
  pagination.currentPage = 1
  fetchList()
}

// 重置
const handleReset = () => {
  Object.assign(searchParams, {
    keyword: '',
    status: '',
    month: '',
  })
  pagination.currentPage = 1
  fetchList()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
  fetchList()
}

// 查看详情
const handleView = (row: HostingProfit) => {
  ElMessage.info(`查看详情: ${row.vehiclePlate}`)
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-hosting-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }
}
</style>
