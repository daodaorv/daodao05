<!-- @ts-nocheck -->
<template>
  <div class="partner-settlement-container">
    <PageHeader title="合作商结算" description="查看合作商订单结算统计和分润明细" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="settlementList"
      :columns="tableColumns"
      :loading="loading"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #totalPriceDifference="{ row }">
        ¥{{ row.totalPriceDifference.toLocaleString() }}
      </template>
      <template #totalStoreProfit="{ row }">
        <el-tag type="warning" size="small">
          ¥{{ row.totalStoreProfit.toLocaleString() }}
        </el-tag>
      </template>
      <template #totalPlatformProfit="{ row }">
        <el-tag type="primary" size="small">
          ¥{{ row.totalPlatformProfit.toLocaleString() }}
        </el-tag>
      </template>
      <template #settlementStatus="{ row }">
        <el-tag :type="row.settlementStatus === 'completed' ? 'success' : 'warning'" size="small">
          {{ row.settlementStatus === 'completed' ? '已结算' : '待结算' }}
        </el-tag>
      </template>
      <template #settlementDate="{ row }">
        {{ row.settlementDate ? formatDate(row.settlementDate) : '-' }}
      </template>
    </DataTable>

    <!-- 结算统计卡片 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-label">总订单数</div>
            <div class="stat-value">{{ totalStats.totalOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-label">总差价</div>
            <div class="stat-value">¥{{ totalStats.totalPriceDifference.toLocaleString() }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-label">门店总分润</div>
            <div class="stat-value" style="color: #e6a23c">
              ¥{{ totalStats.totalStoreProfit.toLocaleString() }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-label">平台总收益</div>
            <div class="stat-value" style="color: #409eff">
              ¥{{ totalStats.totalPlatformProfit.toLocaleString() }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, ToolbarButton } from '@/components/common/DataTable.vue'
import { getPartnerList, getPartnerSettlement, type PartnerSettlement } from '@/api/partner'
import { exportToCSV } from '@/utils/export'

// 搜索表单
const searchForm = ref({
  partnerId: null as number | null,
  startDate: '',
  endDate: ''
})

// 合作商列表
const partnerOptions = ref<Array<{ label: string; value: number }>>([])

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'select',
    prop: 'partnerId',
    label: '合作商',
    placeholder: '请选择合作商',
    options: partnerOptions
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
  }
]

// 表格数据
const settlementList = ref<PartnerSettlement[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'partnerId', label: '合作商ID', width: 100 },
  { prop: 'partnerName', label: '合作商名称', width: 150 },
  { prop: 'settlementPeriod', label: '结算周期', width: 120 },
  { prop: 'totalOrders', label: '订单数', width: 100 },
  { prop: 'totalPriceDifference', label: '总差价', width: 120, slot: 'totalPriceDifference' },
  { prop: 'totalStoreProfit', label: '门店总分润', width: 120, slot: 'totalStoreProfit' },
  { prop: 'totalPlatformProfit', label: '平台总收益', width: 120, slot: 'totalPlatformProfit' },
  { prop: 'settlementStatus', label: '结算状态', width: 100, slot: 'settlementStatus' },
  { prop: 'settlementDate', label: '结算日期', width: 120, slot: 'settlementDate' }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '导出',
    icon: Download,
    onClick: handleExport
  }
]

// 统计数据
const totalStats = computed(() => {
  return {
    totalOrders: settlementList.value.reduce((sum, item) => sum + item.totalOrders, 0),
    totalPriceDifference: settlementList.value.reduce((sum, item) => sum + item.totalPriceDifference, 0),
    totalStoreProfit: settlementList.value.reduce((sum, item) => sum + item.totalStoreProfit, 0),
    totalPlatformProfit: settlementList.value.reduce((sum, item) => sum + item.totalPlatformProfit, 0)
  }
})

// 获取合作商列表
async function fetchPartnerList() {
  try {
    const { list } = await getPartnerList({ page: 1, pageSize: 100 })
    partnerOptions.value = list.map((partner) => ({
      label: partner.name,
      value: partner.id
    }))
  } catch (error) {
    console.error('获取合作商列表失败:', error)
  }
}

// 获取结算列表
async function fetchSettlementList() {
  loading.value = true
  try {
    const params = {
      partnerId: searchForm.value.partnerId || undefined,
      startDate: searchForm.value.startDate || undefined,
      endDate: searchForm.value.endDate || undefined
    }
    const list = await getPartnerSettlement(params)

    // 分页处理
    pagination.total = list.length
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    settlementList.value = list.slice(start, end)
  } catch (error) {
    console.error('获取结算列表失败:', error)
    ElMessage.error('获取结算列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchSettlementList()
}

// 重置
function handleReset() {
  searchForm.value = {
    partnerId: null,
    startDate: '',
    endDate: ''
  }
  pagination.page = 1
  fetchSettlementList()
}

// 导出
function handleExport() {
  if (settlementList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'partnerId', label: '合作商ID' },
    { key: 'partnerName', label: '合作商名称' },
    { key: 'settlementPeriod', label: '结算周期' },
    { key: 'totalOrders', label: '订单数' },
    { key: 'totalPriceDifference', label: '总差价' },
    { key: 'totalStoreProfit', label: '门店总分润' },
    { key: 'totalPlatformProfit', label: '平台总收益' },
    { key: 'settlementStatus', label: '结算状态' },
    { key: 'settlementDate', label: '结算日期' }
  ]

  const exportData = settlementList.value.map((item) => ({
    ...item,
    settlementStatus: item.settlementStatus === 'completed' ? '已结算' : '待结算',
    settlementDate: item.settlementDate ? formatDate(item.settlementDate) : '-'
  }))

  exportToCSV(exportData, columns, '合作商结算统计')
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  fetchSettlementList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchSettlementList()
}

// 初始化
onMounted(() => {
  fetchPartnerList()
  fetchSettlementList()
})
</script>

<style scoped lang="scss">
.partner-settlement-container {
  padding: 20px;
}

.stat-item {
  text-align: center;

  .stat-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }
}
</style>
