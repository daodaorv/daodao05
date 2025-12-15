<!-- @ts-nocheck -->
<template>
  <div class="hosting-old-car-container">
    <PageHeader title="自有车托管审核" description="审核车主自有车辆托管申请" />

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
      :actions-width="180"
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
          <div style="color: #909399">{{ row.vehicleYear }}年 / {{ row.vehicleAge }}年车龄</div>
        </div>
      </template>
      <template #ownerInfo="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.ownerName }}</div>
          <div style="color: #909399">{{ row.ownerPhone }}</div>
        </div>
      </template>
      <template #conditionRating="{ row }">
        <el-tag :type="getConditionRatingTag(row.conditionRating)" size="small">
          {{ getConditionRatingLabel(row.conditionRating) }}
        </el-tag>
      </template>
      <template #expectedIncome="{ row }">
        <div style="font-size: 12px">
          <div style="color: #f56c6c; font-weight: bold">¥{{ row.expectedIncome }}/月</div>
          <div style="color: #67c23a">车主: {{ row.ownerShare }}%</div>
          <div style="color: #409eff">平台: {{ row.platformShare }}%</div>
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="托管申请详情"
      width="900px"
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
            <el-descriptions-item label="车主姓名">
              {{ currentApplication.ownerName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ currentApplication.ownerPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ currentApplication.ownerIdCard }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆品牌">
              {{ currentApplication.vehicleBrand }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆型号">
              {{ currentApplication.vehicleModel }}
            </el-descriptions-item>
            <el-descriptions-item label="车牌号">
              {{ currentApplication.licensePlate }}
            </el-descriptions-item>
            <el-descriptions-item label="出厂年份">
              {{ currentApplication.vehicleYear }}年
            </el-descriptions-item>
            <el-descriptions-item label="车龄">
              {{ currentApplication.vehicleAge }}年
            </el-descriptions-item>
            <el-descriptions-item label="行驶里程">
              {{ currentApplication.mileage.toLocaleString() }} 公里
            </el-descriptions-item>
            <el-descriptions-item label="车况评级">
              <el-tag :type="getConditionRatingTag(currentApplication.conditionRating)" size="small">
                {{ getConditionRatingLabel(currentApplication.conditionRating) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 收益信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>收益信息</span>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="预期月收益">
              <span style="color: #f56c6c; font-weight: bold; font-size: 16px">
                ¥{{ currentApplication.expectedIncome }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="车主分成">
              <span style="color: #67c23a; font-weight: bold">
                {{ currentApplication.ownerShare }}%
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="平台分成">
              <span style="color: #409eff; font-weight: bold">
                {{ currentApplication.platformShare }}%
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 车辆照片 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>车辆照片</span>
          </template>
          <div class="photo-section">
            <div class="photo-group">
              <div class="photo-group-title">行驶证照片</div>
              <div class="photo-list">
                <el-image
                  v-for="(photo, index) in currentApplication.registrationPhotos"
                  :key="index"
                  :src="photo"
                  :preview-src-list="currentApplication.registrationPhotos"
                  :initial-index="index"
                  fit="cover"
                  class="photo-item"
                />
              </div>
            </div>
            <div class="photo-group">
              <div class="photo-group-title">车辆外观照片</div>
              <div class="photo-list">
                <el-image
                  v-for="(photo, index) in currentApplication.vehiclePhotos"
                  :key="index"
                  :src="photo"
                  :preview-src-list="currentApplication.vehiclePhotos"
                  :initial-index="index"
                  fit="cover"
                  class="photo-item"
                />
              </div>
            </div>
            <div class="photo-group">
              <div class="photo-group-title">车辆内饰照片</div>
              <div class="photo-list">
                <el-image
                  v-for="(photo, index) in currentApplication.interiorPhotos"
                  :key="index"
                  :src="photo"
                  :preview-src-list="currentApplication.interiorPhotos"
                  :initial-index="index"
                  fit="cover"
                  class="photo-item"
                />
              </div>
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
import { Select, Close } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableAction } from '@/components/common/DataTable.vue'
import {
  getOldCarApplicationList,
  reviewOldCarApplication,
  type OldCarHostingApplication,
  type OldCarApplicationListParams
} from '@/api/hosting'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 申请状态选项
const APPLICATION_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已取消', value: 'cancelled' }
]

// 车况评级选项
const _CONDITION_RATING_OPTIONS = [
  { label: '优秀', value: 'excellent' },
  { label: '良好', value: 'good' },
  { label: '一般', value: 'fair' },
  { label: '较差', value: 'poor' }
]

// 搜索表单
const searchForm = reactive<OldCarApplicationListParams>({
  keyword: '',
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '申请编号/车主姓名/手机号/车牌号',
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
  { prop: 'vehicleInfo', label: '车辆信息', width: 200, slot: true },
  { prop: 'ownerInfo', label: '车主信息', width: 150, slot: true },
  { prop: 'conditionRating', label: '车况评级', width: 100, slot: true },
  { prop: 'expectedIncome', label: '预期收益', width: 150, slot: true },
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
    show: (row: OldCarHostingApplication) => row.status === 'pending'
  }
])

// 数据列表
const applicationList = ref<OldCarHostingApplication[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentApplication = ref<OldCarHostingApplication | null>(null)

// 审核表单
const reviewForm = reactive({
  comment: ''
})

// 获取申请列表
const fetchApplicationList = async () => {
  loading.value = true
  try {
    const res: any = await getOldCarApplicationList({
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
const handleViewDetail = (row: OldCarHostingApplication) => {
  currentApplication.value = row
  reviewForm.comment = ''
  detailDialogVisible.value = true
}

// 审核
const handleReview = (row: OldCarHostingApplication) => {
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
    await ElMessageBox.confirm('确认通过该托管申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewOldCarApplication(currentApplication.value!.id, true, reviewForm.comment)
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
    await ElMessageBox.confirm('确认拒绝该托管申请吗？', '确认操作', {
      type: 'warning'
    })

    await reviewOldCarApplication(currentApplication.value!.id, false, reviewForm.comment)
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
    cancelled: '已取消'
  }
  return labelMap[status] || status
}

// 获取车况评级标签类型
const getConditionRatingTag = (rating: string) => {
  const tagMap: Record<string, any> = {
    excellent: 'success',
    good: '',
    fair: 'warning',
    poor: 'danger'
  }
  return tagMap[rating] || 'info'
}

// 获取车况评级标签文本
const getConditionRatingLabel = (rating: string) => {
  const labelMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return labelMap[rating] || rating
}

// 初始化
onMounted(() => {
  fetchApplicationList()
})
</script>

<style scoped lang="scss">
.hosting-old-car-container {
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

  .photo-section {
    .photo-group {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .photo-group-title {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 10px;
      }

      .photo-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .photo-item {
          width: 150px;
          height: 150px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid #dcdfe6;

          &:hover {
            border-color: #409eff;
          }
        }
      }
    }
  }
}
</style>
