<template>
  <div class="campsite-reservations-container">
    <PageHeader title="营地预订管理" description="管理营地预订和入住信息" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="reservationList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #status="{ row }">
        <el-tag :type="(getReservationStatusTag(row.status)) as any" size="small">
          {{ getReservationStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #dates="{ row }">
        <div style="font-size: 12px">
          <div>入住: {{ row.checkInDate }}</div>
          <div>退房: {{ row.checkOutDate }}</div>
          <div style="color: #909399">{{ row.nights }}晚</div>
        </div>
      </template>
      <template #totalAmount="{ row }">
        <div>
          <div style="color: #67c23a; font-weight: bold">
            ¥{{ row.totalAmount.toLocaleString() }}
          </div>
          <div style="font-size: 12px; color: #909399">
            已付: ¥{{ row.paidAmount.toLocaleString() }}
          </div>
        </div>
      </template>
    </DataTable>

    <!-- 预订详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="预订详情"
      width="700px"
      @close="handleDetailDialogClose"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预订ID">
          {{ currentReservation?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="预订状态">
          <el-tag :type="(getReservationStatusTag(currentReservation?.status || 'info')) as any" size="small">
            {{ getReservationStatusLabel(currentReservation?.status || 'info') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="营地名称" :span="2">
          {{ currentReservation?.campsiteName }}
        </el-descriptions-item>
        <el-descriptions-item label="用户姓名">
          {{ currentReservation?.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ currentReservation?.userPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="入住日期">
          {{ currentReservation?.checkInDate }}
        </el-descriptions-item>
        <el-descriptions-item label="退房日期">
          {{ currentReservation?.checkOutDate }}
        </el-descriptions-item>
        <el-descriptions-item label="入住天数">
          {{ currentReservation?.nights }}晚
        </el-descriptions-item>
        <el-descriptions-item label="预订车位">
          {{ currentReservation?.spots }}个
        </el-descriptions-item>
        <el-descriptions-item label="订单总额">
          <span style="color: #67c23a; font-weight: bold">
            ¥{{ currentReservation?.totalAmount.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="已付金额">
          <span style="color: #409eff; font-weight: bold">
            ¥{{ currentReservation?.paidAmount.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="特殊要求" :span="2">
          {{ currentReservation?.specialRequests || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentReservation?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ currentReservation?.updatedAt }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Clock, CircleCheck } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getReservationList,
  confirmReservation,
  cancelReservation,
  type CampsiteReservation,
  type ReservationListParams
} from '@/api/campsite'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 预订状态选项
const RESERVATION_STATUS_OPTIONS = [
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已入住', value: 'checked_in' },
  { label: '已退房', value: 'checked_out' },
  { label: '已取消', value: 'cancelled' }
]

// 搜索表单
const searchForm = reactive<ReservationListParams>({
  keyword: '',
  campsiteId: undefined,
  status: undefined
})

// 统计数据
const stats = reactive({
  totalReservations: 0,
  pending: 0,
  confirmed: 0,
  checkedIn: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '预订总数',
    value: stats.totalReservations,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待确认',
    value: stats.pending,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '已确认',
    value: stats.confirmed,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '已入住',
    value: stats.checkedIn,
    icon: CircleCheck,
    color: '#409eff'
  }
])

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '营地名称/用户/手机号',
    width: '200px'
  },
  {
    prop: 'status',
    label: '预订状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: RESERVATION_STATUS_OPTIONS
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'campsiteName', label: '营地名称', minWidth: 200 },
  { prop: 'userName', label: '用户', width: 100 },
  { prop: 'userPhone', label: '手机号', width: 120 },
  { prop: 'dates', label: '入住信息', width: 180, slot: 'dates' },
  { prop: 'spots', label: '车位数', width: 80 },
  { prop: 'totalAmount', label: '金额', width: 140, slot: 'totalAmount' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '预订时间', width: 180 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '确认',
    type: 'success',
    onClick: (row: CampsiteReservation) => handleConfirm(row),
    show: (row: CampsiteReservation) => row.status === 'pending'
  },
  {
    label: '取消',
    type: 'danger',
    onClick: (row: CampsiteReservation) => handleCancel(row),
    show: (row: CampsiteReservation) => row.status === 'pending' || row.status === 'confirmed'
  },
  {
    label: '查看',
    type: 'primary',
    onClick: (row: CampsiteReservation) => handleView(row)
  }
]

// 预订列表
const reservationList = ref<CampsiteReservation[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 预订详情对话框
const detailDialogVisible = ref(false)
const currentReservation = ref<CampsiteReservation | null>(null)

// 加载预订列表
const loadReservationList = async () => {
  loading.value = true
  try {
    const params: ReservationListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getReservationList(params) as any
    reservationList.value = res.data.list
    pagination.total = res.data.total

    // 更新统计数据
    updateStats(res.data.list)
  } catch (error) {
    handleApiError(error, '加载预订列表失败')
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStats = (list: CampsiteReservation[]) => {
  stats.totalReservations = list.length
  stats.pending = list.filter(r => r.status === 'pending').length
  stats.confirmed = list.filter(r => r.status === 'confirmed').length
  stats.checkedIn = list.filter(r => r.status === 'checked_in').length
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadReservationList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.campsiteId = undefined
  searchForm.status = undefined
  pagination.page = 1
  loadReservationList()
}

// 确认预订
const handleConfirm = async (row: CampsiteReservation) => {
  try {
    await ElMessageBox.confirm(
      `确定要确认预订吗？\n营地：${row.campsiteName}\n用户：${row.userName}`,
      '确认预订',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await confirmReservation(row.id)
    ElMessage.success('预订确认成功')
    loadReservationList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '确认预订失败')
    }
  }
}

// 取消预订
const handleCancel = async (row: CampsiteReservation) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消预订吗？\n营地：${row.campsiteName}\n用户：${row.userName}`,
      '取消预订',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await cancelReservation(row.id)
    ElMessage.success('预订取消成功')
    loadReservationList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '取消预订失败')
    }
  }
}

// 查看预订详情
const handleView = (row: CampsiteReservation) => {
  currentReservation.value = row
  detailDialogVisible.value = true
}

// 对话框关闭
const handleDetailDialogClose = () => {
  currentReservation.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadReservationList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadReservationList()
}

// 获取预订状态标签类型
const getReservationStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    checked_in: 'primary',
    checked_out: 'info',
    cancelled: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取预订状态标签文本
const getReservationStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    checked_in: '已入住',
    checked_out: '已退房',
    cancelled: '已取消'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadReservationList()
})
</script>

<style scoped lang="scss">
.campsite-reservations-container {
  padding: 20px;
}
</style>
