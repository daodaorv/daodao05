<!-- @ts-nocheck -->
<template>
  <div class="hosting-new-car-container">
    <PageHeader title="购车托管审核" description="审核购车托管申请和跟进购车进度" />

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
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #applicationNo="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleViewDetail(row)">
          {{ row.applicationNo }}
        </span>
      </template>
      <template #applicantInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.applicantName }}</div>
          <div style="color: #909399">{{ row.applicantPhone }}</div>
          <div style="color: #909399">{{ row.age }}岁 / 信用分{{ row.creditScore }}</div>
        </div>
      </template>
      <template #vehicleInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.vehicleBrand }} {{ row.vehicleModel }}</div>
          <div style="color: #f56c6c">¥{{ row.vehiclePrice.toLocaleString() }}</div>
        </div>
      </template>
      <template #loanInfo="{ row }">
        <div style="font-size: 12px">
          <div>首付: ¥{{ row.downPayment.toLocaleString() }}</div>
          <div>贷款: ¥{{ row.loanAmount.toLocaleString() }}</div>
          <div>月供: ¥{{ row.monthlyPayment.toLocaleString() }}</div>
        </div>
      </template>
      <template #guaranteedIncome="{ row }">
        <span style="color: #67c23a; font-weight: bold; font-size: 14px">
          ¥{{ row.guaranteedIncome }}/月
        </span>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #purchaseProgress="{ row }">
        <el-progress
          v-if="row.status === 'purchasing'"
          :percentage="row.purchaseProgress"
          :color="getProgressColor(row.purchaseProgress)"
        />
        <span v-else>-</span>
      </template>
    </DataTable>

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="购车托管申请详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <div v-if="currentApplication" class="application-detail">
        <!-- 申请人信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>申请人信息</span>
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
            <el-descriptions-item label="申请人姓名">
              {{ currentApplication.applicantName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ currentApplication.applicantPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ currentApplication.applicantIdCard }}
            </el-descriptions-item>
            <el-descriptions-item label="年龄">
              {{ currentApplication.age }}岁
            </el-descriptions-item>
        // @ts-ignore
            <el-descriptions-item label="信用评分">
              <el-tag :type="getCreditScoreTag(currentApplication.creditScore)" size="small">
                {{ currentApplication.creditScore }}分
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="月收入">
              ¥{{ currentApplication.monthlyIncome.toLocaleString() }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 车辆信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>车辆信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="车辆品牌">
              {{ currentApplication.vehicleBrand }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆型号">
              {{ currentApplication.vehicleModel }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆价格">
              <span style="color: #f56c6c; font-weight: bold; font-size: 16px">
                ¥{{ currentApplication.vehiclePrice.toLocaleString() }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 贷款信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>贷款信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="首付金额">
              ¥{{ currentApplication.downPayment.toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="贷款金额">
              ¥{{ currentApplication.loanAmount.toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="贷款期限">
              {{ currentApplication.loanTerm }}个月
            </el-descriptions-item>
            <el-descriptions-item label="月供金额">
              <span style="color: #f56c6c; font-weight: bold">
                ¥{{ currentApplication.monthlyPayment.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="保底收益">
              <span style="color: #67c23a; font-weight: bold; font-size: 16px">
                ¥{{ currentApplication.guaranteedIncome }}/月
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 购车进度 -->
        <el-card
          v-if="currentApplication.status === 'purchasing' || currentApplication.status === 'completed'"
          class="detail-card"
          shadow="never"
        >
          <template #header>
            <span>购车进度</span>
          </template>
          <div class="purchase-progress">
            <el-progress
              :percentage="currentApplication.purchaseProgress"
              :color="getProgressColor(currentApplication.purchaseProgress)"
              :stroke-width="20"
            >
              <span style="font-size: 14px; font-weight: bold">
                {{ currentApplication.purchaseProgress }}%
              </span>
            </el-progress>
            <div v-if="currentApplication.deliveryDate" class="delivery-info">
              <el-icon><Calendar /></el-icon>
              预计交付时间：{{ currentApplication.deliveryDate }}
            </div>
            <div v-if="currentApplication.status === 'purchasing'" class="progress-update">
              <el-input-number
                v-model="progressForm.progress"
                :min="0"
                :max="100"
                :step="10"
                style="width: 150px"
              />
              <el-button type="primary" @click="handleUpdateProgress">
                更新进度
              </el-button>
            </div>
          </div>
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
              <el-button type="success" @click="handleApprove">
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
import { Select, Close, Calendar } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getNewCarApplicationList,
  reviewNewCarApplication,
  updatePurchaseProgress,
  type NewCarHostingApplication,
  type NewCarApplicationListParams
} from '@/api/hosting'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 申请状态选项
const APPLICATION_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '购车中', value: 'purchasing' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 搜索表单
const searchForm = reactive<NewCarApplicationListParams>({
  keyword: '',
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '申请编号/申请人姓名/手机号',
    width: '250px'
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
  { prop: 'applicantInfo', label: '申请人信息', width: 180, slot: true },
  { prop: 'vehicleInfo', label: '车辆信息', width: 180, slot: true },
  { prop: 'loanInfo', label: '贷款信息', width: 150, slot: true },
  { prop: 'guaranteedIncome', label: '保底收益', width: 120, slot: true },
  { prop: 'status', label: '申请状态', width: 100, slot: true },
  { prop: 'purchaseProgress', label: '购车进度', width: 150, slot: true },
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
    show: (row: NewCarHostingApplication) => row.status === 'pending'
  },
  {
    label: '更新进度',
    type: 'warning',
    onClick: handleUpdateProgressDialog,
    show: (row: NewCarHostingApplication) => row.status === 'purchasing'
  }
])

// 数据列表
const applicationList = ref<NewCarHostingApplication[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentApplication = ref<NewCarHostingApplication | null>(null)

// 审核表单
const reviewForm = reactive({
  comment: ''
})

// 进度更新表单
const progressForm = reactive({
  progress: 0
})

// 获取申请列表
const fetchApplicationList = async () => {
  loading.value = true
  try {
    const res: any = await getNewCarApplicationList({
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
const handleViewDetail = (row: NewCarHostingApplication) => {
  currentApplication.value = row
  reviewForm.comment = ''
  progressForm.progress = row.purchaseProgress
  detailDialogVisible.value = true
}

// 审核
const handleReview = (row: NewCarHostingApplication) => {
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
    await ElMessageBox.confirm('确认通过该购车托管申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewNewCarApplication(currentApplication.value!.id, true, reviewForm.comment)
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
    await ElMessageBox.confirm('确认拒绝该购车托管申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewNewCarApplication(currentApplication.value!.id, false, reviewForm.comment)
    ElMessage.success('已拒绝申请')
    detailDialogVisible.value = false
    fetchApplicationList()
  } catch (error: any) {
    if (error !== 'cancel') {
      handleApiError(error, '审核失败')
    }
  }
}

// 更新进度对话框
const handleUpdateProgressDialog = (row: NewCarHostingApplication) => {
  currentApplication.value = row
  progressForm.progress = row.purchaseProgress
  detailDialogVisible.value = true
}

// 更新进度
const handleUpdateProgress = async () => {
  try {
    await updatePurchaseProgress(currentApplication.value!.id, progressForm.progress)
    ElMessage.success('进度更新成功')
    fetchApplicationList()
  } catch (error) {
    handleApiError(error, '进度更新失败')
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
    purchasing: 'primary',
    completed: 'success',
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
    purchasing: '购车中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labelMap[status] || status
}

// 获取信用评分标签类型
const getCreditScoreTag = (score: number) => {
  if (score >= 750) return 'success'
  if (score >= 650) return ''
  if (score >= 550) return 'warning'
  return 'danger'
}

// 获取进度颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#409eff'
  if (percentage >= 30) return '#e6a23c'
  return '#f56c6c'
}

// 初始化
onMounted(() => {
  fetchApplicationList()
})
</script>

<style scoped lang="scss">
.hosting-new-car-container {
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

  .purchase-progress {
    .delivery-info {
      margin-top: 15px;
      padding: 10px;
      background-color: #f0f9ff;
      border-radius: 4px;
      color: #409eff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-update {
      margin-top: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
