<!-- @ts-nocheck -->
<template>
  <div class="order-reviews-container">
    <PageHeader title="订单评价管理" description="管理用户订单评价和回复" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="reviewList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="220"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #overallRating="{ row }">
        <el-rate v-model="row.overallRating" disabled show-score />
      </template>
      // @ts-ignore
      <template #status="{ row }">
        <el-tag :type="getReviewStatusTag(row.status)" size="small">
          {{ getReviewStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #comment="{ row }">
        <div class="comment-cell">
          <div class="comment-text">{{ row.comment }}</div>
          <div v-if="row.images && row.images.length > 0" class="comment-images">
            <el-tag size="small" type="info">{{ row.images.length }}张图片</el-tag>
          </div>
        </div>
      </template>
      <template #reply="{ row }">
        <div v-if="row.reply" class="reply-cell">
          <div class="reply-text">{{ row.reply }}</div>
          <div class="reply-info">{{ row.repliedBy }} - {{ row.repliedAt }}</div>
        </div>
        <span v-else style="color: #909399">未回复</span>
      </template>
    </DataTable>

    <!-- 回复评价对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复评价"
      width="700px"
      @close="handleReplyDialogClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ currentReview?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentReview?.userName }}</el-descriptions-item>
        <el-descriptions-item label="车辆">{{ currentReview?.vehicleName }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ currentReview?.storeName }}</el-descriptions-item>
        <el-descriptions-item label="综合评分">
          <el-rate v-model="currentReview!.overallRating" disabled show-score />
        </el-descriptions-item>
        <el-descriptions-item label="评价内容">
          <div>{{ currentReview?.comment }}</div>
          <div v-if="currentReview?.images && currentReview.images.length > 0" style="margin-top: 10px">
            <el-tag size="small" type="info">{{ currentReview.images.length }}张图片</el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="replyFormRef"
        :model="replyForm"
        :rules="replyFormRules"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-form-item label="回复内容" prop="reply">
          <el-input
            v-model="replyForm.reply"
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="replyLoading" @click="handleReplySubmit">
          确定回复
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Document, Clock, CircleCheck, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getReviewList,
  getReviewStats,
  replyReview,
  toggleReviewStatus,
  type OrderReview,
  type ReviewListParams
} from '@/api/order'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 评价状态选项
const REVIEW_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已发布', value: 'published' },
  { label: '已隐藏', value: 'hidden' }
]

// 搜索表单
const searchForm = reactive<ReviewListParams>({
  keyword: '',
  status: undefined,
  minRating: undefined,
  maxRating: undefined
})

// 统计数据
const stats = reactive({
  totalReviews: 0,
  pending: 0,
  published: 0,
  averageRating: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '评价总数',
    value: stats.totalReviews,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待审核',
    value: stats.pending,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '已发布',
    value: stats.published,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '平均评分',
    value: stats.averageRating.toFixed(1),
    icon: Star,
    color: '#f56c6c'
  }
])

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '订单号/用户/评价内容',
    width: '200px'
  },
  {
    prop: 'status',
    label: '评价状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: REVIEW_STATUS_OPTIONS
  },
  {
    prop: 'minRating',
    label: '最低评分',
    type: 'select',
    placeholder: '最低评分',
    width: '120px',
    options: [
      { label: '1分', value: 1 },
      { label: '2分', value: 2 },
      { label: '3分', value: 3 },
      { label: '4分', value: 4 },
      { label: '5分', value: 5 }
    ]
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderNo', label: '订单号', width: 180 },
  { prop: 'userName', label: '用户', width: 100 },
  { prop: 'vehicleName', label: '车辆', width: 150 },
  { prop: 'storeName', label: '门店', width: 120 },
  { prop: 'overallRating', label: '综合评分', width: 150, slot: 'overallRating' },
  { prop: 'comment', label: '评价内容', minWidth: 250, slot: 'comment' },
  { prop: 'reply', label: '回复内容', minWidth: 200, slot: 'reply' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '评价时间', width: 180 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '回复',
    type: 'primary',
    onClick: (row: OrderReview) => handleReply(row),
    show: (row: OrderReview) => !row.reply
  },
  {
    label: '隐藏',
    type: 'warning',
    onClick: (row: OrderReview) => handleToggleStatus(row, 'hidden'),
    show: (row: OrderReview) => row.status === 'published'
  },
  {
    label: '显示',
    type: 'success',
    onClick: (row: OrderReview) => handleToggleStatus(row, 'published'),
    show: (row: OrderReview) => row.status === 'hidden'
  },
  {
    label: '查看',
    type: 'info',
    onClick: (row: OrderReview) => handleView(row)
  }
]

// 评价列表
const reviewList = ref<OrderReview[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 回复评价对话框
const replyDialogVisible = ref(false)
const replyLoading = ref(false)
const replyFormRef = ref<FormInstance>()
const currentReview = ref<OrderReview | null>(null)

const replyForm = reactive({
  reply: ''
})

const replyFormRules: FormRules = {
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 5, message: '回复内容至少5个字符', trigger: 'blur' }
  ]
}

// 加载评价列表
const loadReviewList = async () => {
  loading.value = true
  try {
    const params: ReviewListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getReviewList(params) as any
    reviewList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载评价列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getReviewStats() as any
    stats.totalReviews = res.data.totalReviews
    stats.pending = res.data.pending
    stats.published = res.data.published
    stats.averageRating = res.data.averageRating
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadReviewList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  searchForm.minRating = undefined
  searchForm.maxRating = undefined
  pagination.page = 1
  loadReviewList()
}

// 回复评价
const handleReply = (row: OrderReview) => {
  currentReview.value = row
  replyForm.reply = row.reply || 'info'
  replyDialogVisible.value = true
}

// 查看评价
const handleView = (row: OrderReview) => {
  ElMessage.info(`查看评价详情功能开发中，评价ID: ${row.id}`)
}

// 切换评价状态
const handleToggleStatus = async (row: OrderReview, status: 'published' | 'hidden') => {
  try {
    await ElMessageBox.confirm(
      `确定要${status === 'published' ? '显示' : '隐藏'}该评价吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await toggleReviewStatus(row.id, status)
    ElMessage.success(status === 'published' ? '已显示' : '已隐藏')
    loadReviewList()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '操作失败')
    }
  }
}

// 提交回复
const handleReplySubmit = async () => {
  if (!replyFormRef.value || !currentReview.value) return

  await replyFormRef.value.validate(async (valid) => {
    if (!valid) return

    replyLoading.value = true
    try {
      await replyReview(currentReview.value!.id, replyForm.reply)
      ElMessage.success('回复成功')
      replyDialogVisible.value = false
      loadReviewList()
      loadStats()
    } catch (error) {
      handleApiError(error, '回复失败')
    } finally {
      replyLoading.value = false
    }
  })
}

// 对话框关闭
const handleReplyDialogClose = () => {
  replyFormRef.value?.resetFields()
  replyForm.reply = ''
  currentReview.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadReviewList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadReviewList()
}

// 获取评价状态标签类型
const getReviewStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    published: 'success',
    hidden: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取评价状态标签文本
const getReviewStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待审核',
    published: '已发布',
    hidden: '已隐藏'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadReviewList()
  loadStats()
})
</script>

<style scoped lang="scss">
.order-reviews-container {
  padding: 20px;
}

.comment-cell {
  .comment-text {
    margin-bottom: 8px;
    line-height: 1.5;
  }
  .comment-images {
    margin-top: 4px;
  }
}

.reply-cell {
  .reply-text {
    margin-bottom: 4px;
    line-height: 1.5;
    color: #606266;
  }
  .reply-info {
    font-size: 12px;
    color: #909399;
  }
}
</style>
