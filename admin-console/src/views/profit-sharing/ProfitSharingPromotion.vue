<!-- 推广分润管理页面 -->
<template>
  <div class="profit-sharing-promotion-container">
    <PageHeader title="推广分润" description="管理推广员佣金统计和发放" />

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
          title="总佣金"
          :value="`¥${stats.totalCommission.toLocaleString()}`"
          icon="Present"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="8">
        <StatsCard
          title="推广员数量"
          :value="stats.promoterCount"
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
      <template #promoterType="{ row }">
        <el-tag v-if="row.promoterType === 'user'" type="info">普通用户</el-tag>
        <el-tag v-else-if="row.promoterType === 'agent'" type="warning">代理商</el-tag>
        <el-tag v-else-if="row.promoterType === 'partner'" type="success">合作伙伴</el-tag>
      </template>

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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { PromotionProfit, PromotionProfitStats } from '@/api/profitSharing'

const stats = ref<PromotionProfitStats>({
  totalRevenue: 0,
  totalCommission: 0,
  promoterCount: 0,
})

const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '推广员姓名',
  },
  {
    type: 'select',
    prop: 'promoterType',
    label: '推广员类型',
    placeholder: '请选择类型',
    options: [
      { label: '普通用户', value: 'user' },
      { label: '代理商', value: 'agent' },
      { label: '合作伙伴', value: 'partner' },
    ],
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
  { prop: 'promoterName', label: '推广员', width: 120 },
  { prop: 'promoterType', label: '类型', width: 120, slot: 'promoterType' },
  { prop: 'inviteeCount', label: '邀请人数', width: 100 },
  { prop: 'orderCount', label: '订单数', width: 100 },
  { prop: 'totalRevenue', label: '总营收(元)', width: 130, formatter: (row: PromotionProfit) => `¥${row.totalRevenue.toLocaleString()}` },
  { prop: 'commissionAmount', label: '佣金(元)', width: 120, formatter: (row: PromotionProfit) => `¥${row.commissionAmount.toLocaleString()}` },
  { prop: 'commissionRatio', label: '佣金比例', width: 100 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' },
]

const tableData = ref<PromotionProfit[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  promoterType: '',
  status: '',
  month: '',
})

const fetchStats = async () => {
  try {
    const res = await profitSharingApi.getPromotionProfitStats()
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
    const res = await profitSharingApi.getPromotionProfitList({
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
    promoterType: '',
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

const handleView = (row: PromotionProfit) => {
  ElMessage.info(`查看详情: ${row.promoterName}`)
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-promotion-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }
}
</style>
