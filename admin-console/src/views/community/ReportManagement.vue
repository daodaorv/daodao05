<!-- @ts-nocheck -->
<template>
  <div class="report-management-container">
    <PageHeader title="举报管理" description="处理用户举报，维护社区秩序" />

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总举报数"
          :value="stats.totalReports"
          icon="Warning"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="待处理"
          :value="stats.pendingReports"
          icon="Clock"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="处理中"
          :value="stats.processingReports"
          icon="Loading"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="已解决"
          :value="stats.resolvedReports"
          icon="CircleCheck"
          color="#67C23A"
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

    <!-- 数据表格 -->
    <DataTable
      :data="reportList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 举报类型 -->
      <template #reportType="{ row }">
        <el-tag :type="row.reportType === 'content' ? '' : 'success'" size="small">
          {{ row.reportType === 'content' ? '内容举报' : '用户举报' }}
        </el-tag>
      </template>

      <!-- 优先级 -->
      <template #priority="{ row }">
        <el-tag :type="getPriorityTagType(row.priority)" size="small">
          {{ getPriorityLabel(row.priority) }}
        </el-tag>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 举报原因 -->
      <template #reportReason="{ row }">
        <el-tag type="warning" size="small">
          {{ getViolationTypeLabel(row.reportReason) }}
        </el-tag>
      </template>

      <!-- 被举报内容 -->
      <template #targetContent="{ row }">
        <div class="target-content">
          <div class="target-user">
            被举报人: <strong>{{ row.targetUserName }}</strong>
          </div>
          <div class="content-text">{{ row.targetContent || '(用户举报)' }}</div>
        </div>
      </template>

      <!-- 举报人 -->
      <template #reporter="{ row }">
        <div>{{ row.reporterName }}</div>
      </template>
    </DataTable>

    <!-- 处理对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="处理举报"
      width="600px"
      @close="handleDialogClose"
    >
      <div v-if="currentReport" class="report-detail">
        <!-- 举报信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="举报类型">
            <el-tag :type="currentReport.reportType === 'content' ? '' : 'success'" size="small">
              {{ currentReport.reportType === 'content' ? '内容举报' : '用户举报' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTagType(currentReport.priority)" size="small">
              {{ getPriorityLabel(currentReport.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报人">
            {{ currentReport.reporterName }}
          </el-descriptions-item>
          <el-descriptions-item label="举报时间">
            {{ currentReport.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="被举报人" :span="2">
            {{ currentReport.targetUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="举报原因" :span="2">
            <el-tag type="warning" size="small">
              {{ getViolationTypeLabel(currentReport.reportReason) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报说明" :span="2">
            {{ currentReport.reportDescription }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 被举报内容 -->
        <div v-if="currentReport.targetContent" class="detail-section">
          <h4>被举报内容</h4>
          <div class="content-box">{{ currentReport.targetContent }}</div>
        </div>

        <!-- 举报截图 -->
        <div v-if="currentReport.images.length > 0" class="detail-section">
          <h4>举报截图</h4>
          <div class="image-grid">
            <el-image
              v-for="(img, index) in currentReport.images"
              :key="index"
              :src="img"
              :preview-src-list="currentReport.images"
              fit="cover"
              class="report-image"
            />
          </div>
        </div>

        <!-- 处理表单 -->
        <div class="detail-section">
          <h4>处理结果</h4>
          <el-form :model="handleForm" :rules="handleRules" ref="handleFormRef" label-width="100px">
            <el-form-item label="处理结果" prop="status">
              <el-radio-group v-model="handleForm.status">
                <el-radio value="resolved">确认违规</el-radio>
                <el-radio value="rejected">驳回举报</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="处理说明" prop="handleResult">
              <el-input
                v-model="handleForm.handleResult"
                type="textarea"
                :rows="4"
                placeholder="请输入处理说明"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="举报详情"
      width="700px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentReport" class="report-detail">
        <!-- 举报信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="举报ID">
            {{ currentReport.id }}
          </el-descriptions-item>
          <el-descriptions-item label="举报类型">
            <el-tag :type="currentReport.reportType === 'content' ? '' : 'success'" size="small">
              {{ currentReport.reportType === 'content' ? '内容举报' : '用户举报' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTagType(currentReport.priority)" size="small">
              {{ getPriorityLabel(currentReport.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentReport.status)" size="small">
              {{ getStatusLabel(currentReport.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报人">
            {{ currentReport.reporterName }}
          </el-descriptions-item>
          <el-descriptions-item label="举报时间">
            {{ currentReport.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="被举报人" :span="2">
            {{ currentReport.targetUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="举报原因" :span="2">
            <el-tag type="warning" size="small">
              {{ getViolationTypeLabel(currentReport.reportReason) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报说明" :span="2">
            {{ currentReport.reportDescription }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 被举报内容 -->
        <div v-if="currentReport.targetContent" class="detail-section">
          <h4>被举报内容</h4>
          <div class="content-box">{{ currentReport.targetContent }}</div>
        </div>

        <!-- 举报截图 -->
        <div v-if="currentReport.images.length > 0" class="detail-section">
          <h4>举报截图</h4>
          <div class="image-grid">
            <el-image
              v-for="(img, index) in currentReport.images"
              :key="index"
              :src="img"
              :preview-src-list="currentReport.images"
              fit="cover"
              class="report-image"
            />
          </div>
        </div>

        <!-- 处理结果 -->
        <div v-if="currentReport.handlerId" class="detail-section">
          <h4>处理结果</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="处理人">
              {{ currentReport.handlerName }}
            </el-descriptions-item>
            <el-descriptions-item label="处理时间">
              {{ currentReport.handledAt }}
            </el-descriptions-item>
            <el-descriptions-item label="处理说明" :span="2">
              {{ currentReport.handleResult }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentReport && currentReport.status === 'pending'"
          type="primary"
          @click="handleProcessFromDetail"
        >
          处理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import {
  getReports,
  getReportStats,
  handleReport,
  type Report,
  type ReportStats,
  type HandleStatus,
  type ViolationType
} from '@/api/community'

// 统计数据
const stats = ref<ReportStats>({
  totalReports: 0,
  pendingReports: 0,
  processingReports: 0,
  resolvedReports: 0,
  rejectedReports: 0,
  avgHandleTime: 0
})

// 搜索表单
const searchForm = ref({
  status: '',
  reportType: '',
  priority: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'status',
    label: '处理状态',
    placeholder: '请选择处理状态',
    options: [
      { label: '待处理', value: 'pending' },
      { label: '处理中', value: 'processing' },
      { label: '已解决', value: 'resolved' },
      { label: '已驳回', value: 'rejected' }
    ]
  },
  {
    type: 'select',
    prop: 'reportType',
    label: '举报类型',
    placeholder: '请选择举报类型',
    options: [
      { label: '内容举报', value: 'content' },
      { label: '用户举报', value: 'user' }
    ]
  },
  {
    type: 'select',
    prop: 'priority',
    label: '优先级',
    placeholder: '请选择优先级',
    options: [
      { label: '低', value: 'low' },
      { label: '中', value: 'medium' },
      { label: '高', value: 'high' },
      { label: '紧急', value: 'urgent' }
    ]
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入举报人或被举报人'
  }
]

// 表格数据
const reportList = ref<Report[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'reportType', label: '类型', width: 100, slot: 'reportType' },
  { prop: 'priority', label: '优先级', width: 100, slot: 'priority' },
  { prop: 'reporter', label: '举报人', width: 120, slot: 'reporter' },
  { prop: 'targetContent', label: '被举报内容', minWidth: 250, slot: 'targetContent' },
  { prop: 'reportReason', label: '举报原因', width: 120, slot: 'reportReason' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '举报时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '查看',
    type: 'primary',
    link: true,
    onClick: (row: Report) => handleViewDetail(row)
  },
  {
    label: '处理',
    type: 'success',
    link: true,
    onClick: (row: Report) => handleProcess(row),
    show: (row: Report) => row.status === 'pending' || row.status === 'processing'
  }
]

// 处理对话框
const handleDialogVisible = ref(false)
const currentReport = ref<Report | null>(null)
const handleForm = reactive({
  status: 'resolved' as 'resolved' | 'rejected',
  handleResult: ''
})
const handleFormRef = ref()
const handleRules = {
  status: [{ required: true, message: '请选择处理结果', trigger: 'change' }],
  handleResult: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
}
const submitting = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)

// 获取统计数据
const fetchStats = async () => {
  try {
    stats.value = await getReportStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取举报列表
const fetchReportList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      status: searchForm.value.status as HandleStatus | undefined,
      reportType: searchForm.value.reportType as 'content' | 'user' | undefined,
      priority: searchForm.value.priority as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getReports(params)
    reportList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取举报列表失败:', error)
    ElMessage.error('获取举报列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchReportList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: '',
    reportType: '',
    priority: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchReportList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchReportList()
}

// 查看详情
const handleViewDetail = (row: Report) => {
  currentReport.value = row
  detailDialogVisible.value = true
}

// 处理举报
const handleProcess = (row: Report) => {
  currentReport.value = row
  handleForm.status = 'resolved'
  handleForm.handleResult = ''
  handleDialogVisible.value = true
}

// 从详情页处理
const handleProcessFromDetail = () => {
  detailDialogVisible.value = false
  if (currentReport.value) {
    handleProcess(currentReport.value)
  }
}

// 提交处理
const handleSubmit = async () => {
  if (!handleFormRef.value || !currentReport.value) return

  await handleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitting.value = true
    try {
      await handleReport({
        id: currentReport.value!.id,
        status: handleForm.status,
        handleResult: handleForm.handleResult
      })
      ElMessage.success('处理成功')
      handleDialogVisible.value = false
      fetchReportList()
      fetchStats()
    } catch (error) {
      console.error('处理失败:', error)
      ElMessage.error('处理失败')
    } finally {
      submitting.value = false
    }
  })
}

// 关闭处理对话框
const handleDialogClose = () => {
  handleFormRef.value?.resetFields()
  currentReport.value = null
}

// 关闭详情对话框
const handleDetailDialogClose = () => {
  currentReport.value = null
}

// 获取优先级标签类型
const getPriorityTagType = (priority: string) => {
  const priorityMap: Record<string, any> = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return priorityMap[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const priorityMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

// 获取状态标签类型
const getStatusTagType = (status: HandleStatus) => {
  const statusMap: Record<HandleStatus, any> = {
    pending: 'warning',
    processing: '',
    resolved: 'success',
    rejected: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: HandleStatus) => {
  const statusMap: Record<HandleStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    rejected: '已驳回'
  }
  return statusMap[status] || status
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
  fetchReportList()
})
</script>

<style scoped lang="scss">
.report-management-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.target-content {
  .target-user {
    margin-bottom: 4px;
    font-size: 13px;
    color: #606266;
  }

  .content-text {
    color: #909399;
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.report-detail {
  .detail-section {
    margin-top: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .content-box {
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
    line-height: 1.8;
    color: #606266;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;

    .report-image {
      width: 100%;
      height: 120px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
