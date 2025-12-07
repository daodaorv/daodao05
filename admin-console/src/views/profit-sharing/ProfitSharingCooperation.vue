<!-- 差价分润管理页面 -->
<template>
  <div class="profit-sharing-cooperation-container">
    <PageHeader title="差价分润" description="管理合作商订单差价分润统计和结算" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总差价"
          :value="`¥${stats.totalPriceDiff.toLocaleString()}`"
          icon="Money"
          color="#409eff"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="门店分成"
          :value="`¥${stats.totalStoreShare.toLocaleString()}`"
          icon="Shop"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="平台分成"
          :value="`¥${stats.totalPlatformShare.toLocaleString()}`"
          icon="OfficeBuilding"
          color="#f56c6c"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="订单数量"
          :value="stats.orderCount"
          icon="Document"
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { CooperationProfit, CooperationProfitStats } from '@/api/profitSharing'

// 统计数据
const stats = ref<CooperationProfitStats>({
  totalPriceDiff: 0,
  totalStoreShare: 0,
  totalPlatformShare: 0,
  orderCount: 0,
})

// 搜索字段配置
const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '订单号/合作商/门店',
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
  { prop: 'orderNo', label: '订单号', width: 150 },
  { prop: 'partnerName', label: '合作商', width: 120 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'daodaoPrice', label: '叨叨价格(元)', width: 130, formatter: (row: CooperationProfit) => `¥${row.daodaoPrice.toLocaleString()}` },
  { prop: 'partnerPrice', label: '合作商价格(元)', width: 140, formatter: (row: CooperationProfit) => `¥${row.partnerPrice.toLocaleString()}` },
  { prop: 'priceDiff', label: '差价(元)', width: 110, formatter: (row: CooperationProfit) => `¥${row.priceDiff.toLocaleString()}` },
  { prop: 'storeShare', label: '门店分成(元)', width: 130, formatter: (row: CooperationProfit) => `¥${row.storeShare.toLocaleString()}` },
  { prop: 'platformShare', label: '平台分成(元)', width: 130, formatter: (row: CooperationProfit) => `¥${row.platformShare.toLocaleString()}` },
  { prop: 'shareRatio', label: '分成比例', width: 100 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' },
]

// 表格数据
const tableData = ref<CooperationProfit[]>([])
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
    const res = await profitSharingApi.getCooperationProfitStats()
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
    const res = await profitSharingApi.getCooperationProfitList({
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
const handleView = (row: CooperationProfit) => {
  ElMessage.info(`查看详情: ${row.orderNo}`)
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-cooperation-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }
}
</style>
