<template>
  <div class="campsite-inquiries-container">
    <PageHeader title="营地咨询管理" description="管理用户咨询和回复" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="inquiryList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #status="{ row }">
        <el-tag :type="(getInquiryStatusTag(row.status)) as any" size="small">
          {{ getInquiryStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #question="{ row }">
        <div class="question-cell">
          {{ row.question }}
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

    <!-- 回复咨询对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复咨询"
      width="700px"
      @close="handleReplyDialogClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="营地名称">
          {{ currentInquiry?.campsiteName }}
        </el-descriptions-item>
        <el-descriptions-item label="用户">
          {{ currentInquiry?.userName }} - {{ currentInquiry?.userPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="咨询时间">
          {{ currentInquiry?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="咨询内容">
          <div style="white-space: pre-wrap">{{ currentInquiry?.question }}</div>
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

    <!-- 查看咨询详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="咨询详情"
      width="700px"
      @close="handleDetailDialogClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="咨询ID">
          {{ currentInquiry?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="咨询状态">
          <el-tag :type="(getInquiryStatusTag(currentInquiry?.status || 'info')) as any" size="small">
            {{ getInquiryStatusLabel(currentInquiry?.status || 'info') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="营地名称">
          {{ currentInquiry?.campsiteName }}
        </el-descriptions-item>
        <el-descriptions-item label="用户姓名">
          {{ currentInquiry?.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ currentInquiry?.userPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="咨询时间">
          {{ currentInquiry?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="咨询内容">
          <div style="white-space: pre-wrap">{{ currentInquiry?.question }}</div>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentInquiry?.reply" label="回复内容">
          <div style="white-space: pre-wrap">{{ currentInquiry?.reply }}</div>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentInquiry?.repliedBy" label="回复人">
          {{ currentInquiry?.repliedBy }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentInquiry?.repliedAt" label="回复时间">
          {{ currentInquiry?.repliedAt }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ currentInquiry?.updatedAt }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentInquiry?.status === 'pending'"
          type="primary"
          @click="handleReplyFromDetail"
        >
          回复咨询
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Document, Clock, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getInquiryList,
  replyInquiry,
  type CampsiteInquiry,
  type InquiryListParams
} from '@/api/campsite'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 咨询状态选项
const INQUIRY_STATUS_OPTIONS = [
  { label: '待回复', value: 'pending' },
  { label: '已回复', value: 'replied' },
  { label: '已关闭', value: 'closed' }
]

// 搜索表单
const searchForm = reactive<InquiryListParams>({
  keyword: '',
  campsiteId: undefined,
  status: undefined
})

// 统计数据
const stats = reactive({
  totalInquiries: 0,
  pending: 0,
  replied: 0,
  closed: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '咨询总数',
    value: stats.totalInquiries,
    icon: Document,
    color: '#409eff'
  },
  {
    label: '待回复',
    value: stats.pending,
    icon: Clock,
    color: '#e6a23c'
  },
  {
    label: '已回复',
    value: stats.replied,
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    label: '已关闭',
    value: stats.closed,
    icon: CircleClose,
    color: '#909399'
  }
])

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '营地名称/用户/咨询内容',
    width: '200px'
  },
  {
    prop: 'status',
    label: '咨询状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: INQUIRY_STATUS_OPTIONS
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'campsiteName', label: '营地名称', minWidth: 180 },
  { prop: 'userName', label: '用户', width: 100 },
  { prop: 'userPhone', label: '手机号', width: 120 },
  { prop: 'question', label: '咨询内容', minWidth: 250, slot: 'question' },
  { prop: 'reply', label: '回复内容', minWidth: 200, slot: 'reply' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '咨询时间', width: 180 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '回复',
    type: 'primary',
    onClick: (row: CampsiteInquiry) => handleReply(row),
    show: (row: CampsiteInquiry) => row.status === 'pending'
  },
  {
    label: '查看',
    type: 'info',
    onClick: (row: CampsiteInquiry) => handleView(row)
  }
]

// 咨询列表
const inquiryList = ref<CampsiteInquiry[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 回复咨询对话框
const replyDialogVisible = ref(false)
const replyLoading = ref(false)
const replyFormRef = ref<FormInstance>()
const currentInquiry = ref<CampsiteInquiry | null>(null)

const replyForm = reactive({
  reply: ''
})

const replyFormRules: FormRules = {
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 5, message: '回复内容至少5个字符', trigger: 'blur' }
  ]
}

// 查看详情对话框
const detailDialogVisible = ref(false)

// 加载咨询列表
const loadInquiryList = async () => {
  loading.value = true
  try {
    const params: InquiryListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getInquiryList(params) as any
    inquiryList.value = res.data.list
    pagination.total = res.data.total

    // 更新统计数据
    updateStats(res.data.list)
  } catch (error) {
    handleApiError(error, '加载咨询列表失败')
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStats = (list: CampsiteInquiry[]) => {
  stats.totalInquiries = list.length
  stats.pending = list.filter(i => i.status === 'pending').length
  stats.replied = list.filter(i => i.status === 'replied').length
  stats.closed = list.filter(i => i.status === 'closed').length
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadInquiryList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.campsiteId = undefined
  searchForm.status = undefined
  pagination.page = 1
  loadInquiryList()
}

// 回复咨询
const handleReply = (row: CampsiteInquiry) => {
  currentInquiry.value = row
  replyForm.reply = row.reply || 'info'
  replyDialogVisible.value = true
}

// 查看咨询详情
const handleView = (row: CampsiteInquiry) => {
  currentInquiry.value = row
  detailDialogVisible.value = true
}

// 从详情对话框打开回复对话框
const handleReplyFromDetail = () => {
  detailDialogVisible.value = false
  replyForm.reply = currentInquiry.value?.reply || 'info'
  replyDialogVisible.value = true
}

// 提交回复
const handleReplySubmit = async () => {
  if (!replyFormRef.value || !currentInquiry.value) return

  await replyFormRef.value.validate(async (valid) => {
    if (!valid) return

    replyLoading.value = true
    try {
      await replyInquiry(currentInquiry.value!.id, replyForm.reply)
      ElMessage.success('回复成功')
      replyDialogVisible.value = false
      loadInquiryList()
    } catch (error) {
      handleApiError(error, '回复失败')
    } finally {
      replyLoading.value = false
    }
  })
}

// 回复对话框关闭
const handleReplyDialogClose = () => {
  replyFormRef.value?.resetFields()
  replyForm.reply = ''
  currentInquiry.value = null
}

// 详情对话框关闭
const handleDetailDialogClose = () => {
  currentInquiry.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadInquiryList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadInquiryList()
}

// 获取咨询状态标签类型
const getInquiryStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    replied: 'success',
    closed: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取咨询状态标签文本
const getInquiryStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待回复',
    replied: '已回复',
    closed: '已关闭'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadInquiryList()
})
</script>

<style scoped lang="scss">
.campsite-inquiries-container {
  padding: 20px;
}

.question-cell {
  line-height: 1.5;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.reply-cell {
  .reply-text {
    margin-bottom: 4px;
    line-height: 1.5;
    color: #606266;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .reply-info {
    font-size: 12px;
    color: #909399;
  }
}
</style>
