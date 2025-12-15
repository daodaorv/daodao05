<!-- @ts-nocheck -->
<template>
  <div class="content-review-container">
    <PageHeader title="内容审核" description="AI+人工双重审核，确保社区内容质量" />

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="4">
        <StatsCard
          title="待审核"
          :value="stats.totalPending"
          icon="Clock"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="AI通过"
          :value="stats.aiApproved"
          icon="CircleCheck"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="AI拒绝"
          :value="stats.aiRejected"
          icon="CircleClose"
          color="#F56C6C"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="人工通过"
          :value="stats.manualApproved"
          icon="Select"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="人工拒绝"
          :value="stats.manualRejected"
          icon="Close"
          color="#909399"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="今日审核"
          :value="stats.todayReviewed"
          icon="Document"
          color="#409EFF"
        />
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 批量操作 -->
    <BatchOperation
      v-if="selectedIds.length > 0"
      :selected-ids="selectedIds"
      :actions="batchActions"
      @action="handleBatchAction"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="reviewList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 内容类型 -->
      <template #contentType="{ row }">
        <el-tag :type="getContentTypeTagType(row.contentType)" size="small">
          {{ getContentTypeLabel(row.contentType) }}
        </el-tag>
      </template>

      <!-- 审核状态 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- AI分数 -->
      <template #aiScore="{ row }">
        <el-progress
          :percentage="row.aiScore"
          :color="getScoreColor(row.aiScore)"
          :stroke-width="8"
        />
      </template>

      <!-- 用户信息 -->
      <template #user="{ row }">
        <div class="user-info">
          <el-avatar :src="row.userAvatar" :size="32" />
          <span class="user-name">{{ row.userName }}</span>
        </div>
      </template>

      <!-- 内容预览 -->
      <template #content="{ row }">
        <div class="content-preview">
          <div v-if="row.title" class="content-title">{{ row.title }}</div>
          <div class="content-text">{{ row.content }}</div>
          <div v-if="row.images.length > 0" class="content-images">
            <el-image
              v-for="(img, index) in row.images.slice(0, 3)"
              :key="index"
              :src="img"
              :preview-src-list="row.images"
              fit="cover"
              class="preview-image"
            />
            <span v-if="row.images.length > 3" class="more-images">
              +{{ row.images.length - 3 }}
            </span>
          </div>
        </div>
      </template>
    </DataTable>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      :title="reviewDialogTitle"
      width="600px"
      @close="handleReviewDialogClose"
    >
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef" label-width="100px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="reviewForm.status">
            <el-radio value="manual_approved">通过</el-radio>
            <el-radio value="manual_rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="reviewForm.status === 'manual_rejected'"
          label="违规类型"
          prop="violationType"
        >
          <el-select v-model="reviewForm.violationType" placeholder="请选择违规类型">
            <el-option label="垃圾广告" value="spam" />
            <el-option label="色情内容" value="pornography" />
            <el-option label="暴力内容" value="violence" />
            <el-option label="政治敏感" value="politics" />
            <el-option label="违法信息" value="illegal" />
            <el-option label="诈骗信息" value="fraud" />
            <el-option label="骚扰辱骂" value="harassment" />
            <el-option label="侵权内容" value="copyright" />
            <el-option label="其他违规" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="审核意见" prop="reason">
          <el-input
            v-model="reviewForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReviewSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="内容详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentReview" class="review-detail">
        <!-- 用户信息 -->
        <div class="detail-section">
          <h3>用户信息</h3>
          <div class="user-detail">
            <el-avatar :src="currentReview.userAvatar" :size="48" />
            <div class="user-detail-info">
              <div class="user-name">{{ currentReview.userName }}</div>
              <div class="user-id">用户ID: {{ currentReview.userId }}</div>
            </div>
          </div>
        </div>

        <!-- 内容信息 -->
        <div class="detail-section">
          <h3>内容信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="内容ID">
              {{ currentReview.contentId }}
            </el-descriptions-item>
            <el-descriptions-item label="内容类型">
              <el-tag :type="getContentTypeTagType(currentReview.contentType)" size="small">
                {{ getContentTypeLabel(currentReview.contentType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="所属版块">
              {{ currentReview.sectionName }}
            </el-descriptions-item>
            <el-descriptions-item label="发布时间">
              {{ currentReview.createdAt }}
            </el-descriptions-item>
          </el-descriptions>

          <div v-if="currentReview.title" class="detail-title">
            <strong>标题：</strong>{{ currentReview.title }}
          </div>
          <div class="detail-content">
            <strong>内容：</strong>{{ currentReview.content }}
          </div>

          <!-- 图片 -->
          <div v-if="currentReview.images.length > 0" class="detail-images">
            <strong>图片：</strong>
            <div class="image-grid">
              <el-image
                v-for="(img, index) in currentReview.images"
                :key="index"
                :src="img"
                :preview-src-list="currentReview.images"
                fit="cover"
                class="detail-image"
              />
            </div>
          </div>

          <!-- 视频 -->
          <div v-if="currentReview.videos.length > 0" class="detail-videos">
            <strong>视频：</strong>
            <div class="video-list">
              <div v-for="(video, index) in currentReview.videos" :key="index" class="video-item">
                <el-link :href="video" target="_blank" type="primary">
                  视频{{ index + 1 }}
                </el-link>
              </div>
            </div>
          </div>
        </div>

        <!-- AI审核结果 -->
        <div class="detail-section">
          <h3>AI审核结果</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="AI分数">
              <el-progress
                :percentage="currentReview.aiScore"
                :color="getScoreColor(currentReview.aiScore)"
                :stroke-width="12"
              />
            </el-descriptions-item>
            <el-descriptions-item label="AI结论">
              <el-tag :type="getStatusTagType(currentReview.status)" size="small">
                {{ getStatusLabel(currentReview.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="AI原因" :span="2">
              {{ currentReview.aiReason }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 人工审核结果 -->
        <div v-if="currentReview.reviewerId" class="detail-section">
          <h3>人工审核结果</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="审核员">
              {{ currentReview.reviewerName }}
            </el-descriptions-item>
            <el-descriptions-item label="审核时间">
              {{ currentReview.reviewedAt }}
            </el-descriptions-item>
            <el-descriptions-item v-if="currentReview.violationType" label="违规类型">
              {{ getViolationTypeLabel(currentReview.violationType) }}
            </el-descriptions-item>
            <el-descriptions-item label="审核意见" :span="2">
              {{ currentReview.reviewReason || '无' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentReview && currentReview.status === 'pending'"
          type="primary"
          @click="handleReviewFromDetail"
        >
          审核
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import BatchOperation from '@/components/common/BatchOperation.vue'
import DataTable from '@/components/common/DataTable.vue'
import {
  getContentReviews,
  getContentReviewStats,
  reviewContent,
  batchReviewContent,
  type ContentReview,
  type ContentReviewStats,
  type ReviewStatus,
  type ContentType,
  type ViolationType
} from '@/api/community'

// 统计数据
const stats = ref<ContentReviewStats>({
  totalPending: 0,
  aiApproved: 0,
  aiRejected: 0,
  manualApproved: 0,
  manualRejected: 0,
  todayReviewed: 0,
  avgReviewTime: 0
})

// 搜索表单
const searchForm = ref({
  status: '',
  contentType: '',
  sectionId: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'status',
    label: '审核状态',
    placeholder: '请选择审核状态',
    options: [
      { label: '待审核', value: 'pending' },
      { label: 'AI通过', value: 'ai_approved' },
      { label: 'AI拒绝', value: 'ai_rejected' },
      { label: '人工通过', value: 'manual_approved' },
      { label: '人工拒绝', value: 'manual_rejected' }
    ]
  },
  {
    type: 'select',
    prop: 'contentType',
    label: '内容类型',
    placeholder: '请选择内容类型',
    options: [
      { label: '帖子', value: 'post' },
      { label: '评论', value: 'comment' },
      { label: '回复', value: 'reply' },
      { label: '图片', value: 'image' },
      { label: '视频', value: 'video' }
    ]
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入标题、内容或用户名'
  }
]

// 表格数据
const reviewList = ref<ContentReview[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { type: 'selection', width: 55 },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'contentType', label: '类型', width: 100, slot: 'contentType' },
  { prop: 'user', label: '用户', width: 150, slot: 'user' },
  { prop: 'content', label: '内容', minWidth: 300, slot: 'content' },
  { prop: 'sectionName', label: '版块', width: 120 },
  { prop: 'status', label: '状态', width: 120, slot: 'status' },
  { prop: 'aiScore', label: 'AI分数', width: 150, slot: 'aiScore' },
  { prop: 'createdAt', label: '发布时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '查看',
    type: 'primary',
    link: true,
    onClick: (row: ContentReview) => handleViewDetail(row)
  },
  {
    label: '审核',
    type: 'success',
    link: true,
    onClick: (row: ContentReview) => handleReview(row),
    show: (row: ContentReview) => row.status === 'pending'
  }
]

// 批量操作
const batchActions = [
  {
    label: '批量通过',
    type: 'success',
    onClick: () => handleBatchReview('manual_approved')
  },
  {
    label: '批量拒绝',
    type: 'danger',
    onClick: () => handleBatchReview('manual_rejected')
  }
]

// 审核对话框
const reviewDialogVisible = ref(false)
const reviewDialogTitle = ref('内容审核')
const reviewForm = reactive({
  id: 0,
  status: 'manual_approved' as 'manual_approved' | 'manual_rejected',
  reason: '',
  violationType: '' as ViolationType | ''
})
const reviewFormRef = ref()
const reviewRules = {
  status: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  reason: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
  violationType: [
    {
      required: true,
      message: '请选择违规类型',
      trigger: 'change',
      validator: (_rule: any, value: any, callback: any) => {
        if (reviewForm.status === 'manual_rejected' && !value) {
          callback(new Error('请选择违规类型'))
        } else {
          callback()
        }
      }
    }
  ]
}
const submitting = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentReview = ref<ContentReview | null>(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    stats.value = await getContentReviewStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取审核列表
const fetchReviewList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      status: searchForm.value.status as ReviewStatus | undefined,
      contentType: searchForm.value.contentType as ContentType | undefined,
      sectionId: searchForm.value.sectionId ? Number(searchForm.value.sectionId) : undefined,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getContentReviews(params)
    reviewList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取审核列表失败:', error)
    ElMessage.error('获取审核列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchReviewList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: '',
    contentType: '',
    sectionId: '',
    keyword: ''
  }
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: ContentReview[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchReviewList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchReviewList()
}

// 查看详情
const handleViewDetail = (row: ContentReview) => {
  currentReview.value = row
  detailDialogVisible.value = true
}

// 审核
const handleReview = (row: ContentReview) => {
  reviewForm.id = row.id
  reviewForm.status = 'manual_approved'
  reviewForm.reason = ''
  reviewForm.violationType = ''
  reviewDialogTitle.value = `审核内容 - ${row.userName}`
  reviewDialogVisible.value = true
}

// 从详情页审核
const handleReviewFromDetail = () => {
  if (currentReview.value) {
    detailDialogVisible.value = false
    handleReview(currentReview.value)
  }
}

// 提交审核
const handleReviewSubmit = async () => {
  if (!reviewFormRef.value) return

  await reviewFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitting.value = true
    try {
      await reviewContent({
        id: reviewForm.id,
        status: reviewForm.status,
        reason: reviewForm.reason,
        violationType: reviewForm.violationType as ViolationType | undefined
      })
      ElMessage.success('审核成功')
      reviewDialogVisible.value = false
      fetchReviewList()
      fetchStats()
    } catch (error) {
      console.error('审核失败:', error)
      ElMessage.error('审核失败')
    } finally {
      submitting.value = false
    }
  })
}

// 批量审核
const handleBatchReview = async (status: 'manual_approved' | 'manual_rejected') => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要审核的内容')
    return
  }

  const action = status === 'manual_approved' ? '通过' : '拒绝'
  try {
    await ElMessageBox.prompt(`请输入批量${action}的原因`, `批量${action}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入原因'
    })

    await batchReviewContent({
      ids: selectedIds.value,
      status,
      reason: '批量审核'
    })

    ElMessage.success(`批量${action}成功`)
    selectedIds.value = []
    fetchReviewList()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量审核失败:', error)
      ElMessage.error('批量审核失败')
    }
  }
}

// 批量操作
const handleBatchAction = (action: string) => {
  if (action === '批量通过') {
    handleBatchReview('manual_approved')
  } else if (action === '批量拒绝') {
    handleBatchReview('manual_rejected')
  }
}

// 关闭审核对话框
const handleReviewDialogClose = () => {
  reviewFormRef.value?.resetFields()
}

// 关闭详情对话框
const handleDetailDialogClose = () => {
  currentReview.value = null
}

// 获取内容类型标签类型
const getContentTypeTagType = (type: ContentType) => {
  const typeMap: Record<ContentType, any> = {
    post: '',
    comment: 'success',
    reply: 'info',
    image: 'warning',
    video: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取内容类型标签
const getContentTypeLabel = (type: ContentType) => {
  const typeMap: Record<ContentType, string> = {
    post: '帖子',
    comment: '评论',
    reply: '回复',
    image: '图片',
    video: '视频'
  }
  return typeMap[type] || type
}

// 获取状态标签类型
const getStatusTagType = (status: ReviewStatus) => {
  const statusMap: Record<ReviewStatus, any> = {
    pending: 'warning',
    ai_approved: 'success',
    ai_rejected: 'danger',
    manual_approved: 'success',
    manual_rejected: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: ReviewStatus) => {
  const statusMap: Record<ReviewStatus, string> = {
    pending: '待审核',
    ai_approved: 'AI通过',
    ai_rejected: 'AI拒绝',
    manual_approved: '人工通过',
    manual_rejected: '人工拒绝'
  }
  return statusMap[status] || status
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 获取违规类型标签
const getViolationTypeLabel = (type: ViolationType) => {
  const typeMap: Record<ViolationType, string> = {
    spam: '垃圾广告',
    pornography: '色情内容',
    violence: '暴力内容',
    politics: '政治敏感',
    illegal: '违法信息',
    fraud: '诈骗信息',
    harassment: '骚扰辱骂',
    copyright: '侵权内容',
    other: '其他违规'
  }
  return typeMap[type] || type
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchReviewList()
})
</script>

<style scoped lang="scss">
.content-review-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .user-name {
    font-size: 14px;
  }
}

.content-preview {
  .content-title {
    font-weight: bold;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .content-text {
    color: #606266;
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .content-images {
    display: flex;
    gap: 4px;
    margin-top: 8px;

    .preview-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      cursor: pointer;
    }

    .more-images {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #f5f7fa;
      border-radius: 4px;
      color: #909399;
      font-size: 12px;
    }
  }
}

.review-detail {
  .detail-section {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .user-detail {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-detail-info {
      .user-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .user-id {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .detail-title,
  .detail-content {
    margin-top: 16px;
    line-height: 1.8;

    strong {
      color: #606266;
    }
  }

  .detail-images {
    margin-top: 16px;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #606266;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;

      .detail-image {
        width: 100%;
        height: 120px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }

  .detail-videos {
    margin-top: 16px;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #606266;
    }

    .video-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
