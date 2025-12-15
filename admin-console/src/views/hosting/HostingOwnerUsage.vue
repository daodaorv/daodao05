<!-- @ts-nocheck -->
<template>
  <div class="hosting-owner-usage-container">
    <PageHeader title="车主自用审核" description="审核车主自用申请和管理自用记录" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="applicationList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #applicationNo="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleViewDetail(row)">
          {{ row.applicationNo }}
        </span>
      </template>
      <template #vehicleInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.vehicleBrand }} {{ row.vehicleModel }}</div>
          <div style="color: #909399">{{ row.licensePlate }}</div>
        </div>
      </template>
      <template #ownerInfo="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.ownerName }}</div>
          <div style="color: #909399">{{ row.ownerPhone }}</div>
        </div>
      </template>
      <template #usagePeriod="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.startDate }}</div>
          <div>{{ row.endDate }}</div>
          <div style="color: #409eff">{{ row.days }}天</div>
        </div>
      </template>
      <template #fees="{ row }">
        <div style="font-size: 12px">
          <div>服务费: ¥{{ row.serviceFee }}</div>
          <div>异地费: ¥{{ row.relocationFee }}</div>
          <div style="color: #f56c6c; font-weight: bold">合计: ¥{{ row.totalFee }}</div>
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #conflictOrders="{ row }">
        <el-tag v-if="row.conflictOrders > 0" type="danger" size="small">
          {{ row.conflictOrders }}个冲突
        </el-tag>
        <el-tag v-else type="success" size="small">
          无冲突
        </el-tag>
      </template>
    </DataTable>

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="车主自用申请详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentApplication" class="application-detail">
        <!-- 基本信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
              <el-tag :type="getStatusTag(currentApplication.status)" size="small">
                {{ getStatusLabel(currentApplication.status) }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="申请编号">
              {{ currentApplication.applicationNo }}
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">
              {{ formatDateTime(currentApplication.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆编号">
              {{ currentApplication.vehicleNo }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆信息">
              {{ currentApplication.vehicleBrand }} {{ currentApplication.vehicleModel }}
            </el-descriptions-item>
            <el-descriptions-item label="车牌号">
              {{ currentApplication.licensePlate }}
            </el-descriptions-item>
            <el-descriptions-item label="车主姓名">
              {{ currentApplication.ownerName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ currentApplication.ownerPhone }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 自用信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>自用信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="开始日期">
              {{ currentApplication.startDate }}
            </el-descriptions-item>
            <el-descriptions-item label="结束日期">
              {{ currentApplication.endDate }}
            </el-descriptions-item>
            <el-descriptions-item label="使用天数">
              <span style="color: #409eff; font-weight: bold">{{ currentApplication.days }}天</span>
            </el-descriptions-item>
            <el-descriptions-item label="使用目的">
              {{ currentApplication.purpose }}
            </el-descriptions-item>
            <el-descriptions-item label="目的地" :span="2">
              {{ currentApplication.destination }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 费用信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>费用信息</span>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="服务费">
              ¥{{ currentApplication.serviceFee }}
            </el-descriptions-item>
            <el-descriptions-item label="异地还车费">
              ¥{{ currentApplication.relocationFee }}
            </el-descriptions-item>
            <el-descriptions-item label="总费用">
              <span style="color: #f56c6c; font-weight: bold; font-size: 16px">
                ¥{{ currentApplication.totalFee }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 订单冲突检查 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>订单冲突检查</span>
          </template>
          <el-alert
            v-if="currentApplication.conflictOrders > 0"
            type="error"
            :closable="false"
            show-icon
          >
            <template #title>
              发现 {{ currentApplication.conflictOrders }} 个订单冲突，请先处理冲突订单
            </template>
          </el-alert>
          <el-alert
            v-else
            type="success"
            :closable="false"
            show-icon
          >
            <template #title>
              无订单冲突，可以批准自用申请
            </template>
          </el-alert>
        </el-card>

        <!-- 审核信息 -->
        <el-card
          v-if="currentApplication.status !== 'pending'"
          class="detail-card"
          shadow="never"
        >
          <template #header>
            <span>审核信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="审核结果">
              <el-tag :type="getStatusTag(currentApplication.status)" size="small">
                {{ getStatusLabel(currentApplication.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="审核意见">
              {{ currentApplication.reviewComment || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="审核人">
              {{ currentApplication.reviewedBy || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="审核时间">
              {{ currentApplication.reviewedAt ? formatDateTime(currentApplication.reviewedAt) : '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 审核操作 -->
        <el-card
          v-if="currentApplication.status === 'pending'"
          class="detail-card"
          shadow="never"
        >
          <template #header>
            <span>审核操作</span>
          </template>
          <el-form :model="reviewForm" label-width="100px">
            <el-form-item label="审核意见" required>
              <el-input
                v-model="reviewForm.comment"
                type="textarea"
                :rows="4"
                placeholder="请输入审核意见"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                :disabled="currentApplication.conflictOrders > 0"
                @click="handleApprove"
              >
                <el-icon><Select /></el-icon>
                通过
              </el-button>
              <el-button type="danger" @click="handleReject">
                <el-icon><Close /></el-icon>
                拒绝
              </el-button>
            </el-form-item>
          </el-form>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Select, Close } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getOwnerUsageApplicationList,
  reviewOwnerUsageApplication,
  type OwnerUsageApplication,
  type OwnerUsageApplicationListParams
} from '@/api/hosting'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 申请状态选项
const APPLICATION_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '使用中', value: 'using' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 搜索表单
const searchForm = reactive<OwnerUsageApplicationListParams>({
  keyword: '',
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '申请编号/车主姓名/车牌号',
    width: '220px'
  },
  {
    prop: 'status',
    label: '申请状态',
    type: 'select',
    placeholder: '全部状态',
    options: APPLICATION_STATUS_OPTIONS,
    width: '150px'
  }
])

// 表格列配置
const tableColumns = computed(() => [
  { prop: 'applicationNo', label: '申请编号', width: 150, slot: true },
  { prop: 'vehicleInfo', label: '车辆信息', width: 180, slot: true },
  { prop: 'ownerInfo', label: '车主信息', width: 140, slot: true },
  { prop: 'usagePeriod', label: '使用期间', width: 150, slot: true },
  { prop: 'purpose', label: '使用目的', width: 120 },
  { prop: 'fees', label: '费用信息', width: 140, slot: true },
  { prop: 'conflictOrders', label: '订单冲突', width: 100, slot: true },
  { prop: 'status', label: '申请状态', width: 100, slot: true },
  { prop: 'createdAt', label: '申请时间', width: 160, formatter: formatDateTime }
]) as any

// 表格操作配置
const tableActions = computed<TableAction[]>(() => [
  {
    label: '查看详情',
    type: 'primary',
    onClick: handleViewDetail
  },
  {
    label: '审核',
    type: 'success',
    onClick: handleReview,
    show: (row: OwnerUsageApplication) => row.status === 'pending'
  }
])

// 数据列表
const applicationList = ref<OwnerUsageApplication[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentApplication = ref<OwnerUsageApplication | null>(null)

// 审核表单
const reviewForm = reactive({
  comment: ''
})

// 获取申请列表
const fetchApplicationList = async () => {
  loading.value = true
  try {
    const res: any = await getOwnerUsageApplicationList({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    applicationList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '获取申请列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchApplicationList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  pagination.page = 1
  fetchApplicationList()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchApplicationList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchApplicationList()
}

// 查看详情
const handleViewDetail = (row: OwnerUsageApplication) => {
  currentApplication.value = row
  reviewForm.comment = ''
  detailDialogVisible.value = true
}

// 审核
const handleReview = (row: OwnerUsageApplication) => {
  currentApplication.value = row
  reviewForm.comment = ''
  detailDialogVisible.value = true
}

// 通过审核
const handleApprove = async () => {
  if (!reviewForm.comment.trim()) {
    ElMessage.warning('请输入审核意见')
    return
  }

  try {
    await ElMessageBox.confirm('确认通过该自用申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewOwnerUsageApplication(currentApplication.value!.id, true, reviewForm.comment)
    ElMessage.success('审核通过')
    detailDialogVisible.value = false
    fetchApplicationList()
  } catch (error: any) {
    if (error !== 'cancel') {
      handleApiError(error, '审核失败')
    }
  }
}

// 拒绝审核
const handleReject = async () => {
  if (!reviewForm.comment.trim()) {
    ElMessage.warning('请输入审核意见')
    return
  }

  try {
    await ElMessageBox.confirm('确认拒绝该自用申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewOwnerUsageApplication(currentApplication.value!.id, false, reviewForm.comment)
    ElMessage.success('已拒绝申请')
    detailDialogVisible.value = false
    fetchApplicationList()
  } catch (error: any) {
    if (error !== 'cancel') {
      handleApiError(error, '审核失败')
    }
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

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    using: 'primary',
    completed: 'info',
    cancelled: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    using: '使用中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labelMap[status] || status
}

// 初始化
onMounted(() => {
  fetchApplicationList()
})
</script>

<style scoped lang="scss">
.hosting-owner-usage-container {
  padding: 20px;
}

.application-detail {
  .detail-card {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
