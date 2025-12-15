<!-- @ts-nocheck -->
<template>
  <div class="ticket-management-container">
    <PageHeader title="工单管理" description="管理客服工单，提升服务质量" />

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="4">
        <StatsCard
          title="总工单数"
          :value="stats.totalTickets"
          icon="Tickets"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="待处理"
          :value="stats.pendingTickets"
          icon="Clock"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="处理中"
          :value="stats.processingTickets"
          icon="Loading"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="已解决"
          :value="stats.resolvedTickets"
          icon="CircleCheck"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="平均响应"
          :value="`${stats.avgResponseTime}分钟`"
          icon="Timer"
          color="#909399"
        />
      </el-col>
      <el-col :span="4">
        <StatsCard
          title="平均满意度"
          :value="stats.avgSatisfaction.toFixed(1)"
          icon="Star"
          color="#F7BA2A"
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
      :data="ticketList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 工单类型 -->
      <template #type="{ row }">
        <el-tag :type="getTypeTagType(row.type)" size="small">
          {{ getTypeLabel(row.type) }}
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

      <!-- 客服人员 -->
      <template #assignee="{ row }">
        <span v-if="row.assigneeName">{{ row.assigneeName }}</span>
        <el-tag v-else type="info" size="small">未分配</el-tag>
      </template>

      <!-- 满意度 -->
      <template #satisfaction="{ row }">
        <el-rate
          v-if="row.satisfaction"
          :model-value="row.satisfaction"
          disabled
          size="small"
        />
        <span v-else class="no-rating">未评价</span>
      </template>
    </DataTable>

    <!-- 分配工单对话框 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配工单"
      width="500px"
      @close="handleAssignDialogClose"
    >
      <el-form :model="assignForm" :rules="assignRules" ref="assignFormRef" label-width="100px">
        <el-form-item label="客服人员" prop="assigneeId">
          <el-select v-model="assignForm.assigneeId" placeholder="请选择客服人员" style="width: 100%">
            <el-option
              v-for="agent in availableAgents"
              :key="agent.id"
              :label="`${agent.name} (${agent.currentTickets}/${agent.maxConcurrent})`"
              :value="agent.id"
              :disabled="agent.currentTickets >= agent.maxConcurrent"
            >
              <div class="agent-option">
                <span>{{ agent.name }}</span>
                <el-tag
                  :type="getAgentStatusType(agent.status)"
                  size="small"
                  style="margin-left: 8px"
                >
                  {{ getAgentStatusLabel(agent.status) }}
                </el-tag>
                <span style="margin-left: 8px; color: #909399; font-size: 12px">
                  {{ agent.currentTickets }}/{{ agent.maxConcurrent }}
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignSubmit" :loading="assigning">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 工单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentTicket" class="ticket-detail">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单编号">
            {{ currentTicket.ticketNo }}
          </el-descriptions-item>
          <el-descriptions-item label="工单类型">
            <el-tag :type="getTypeTagType(currentTicket.type)" size="small">
              {{ getTypeLabel(currentTicket.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTagType(currentTicket.priority)" size="small">
              {{ getPriorityLabel(currentTicket.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentTicket.status)" size="small">
              {{ getStatusLabel(currentTicket.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户">
            {{ currentTicket.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ currentTicket.userPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="客服人员">
            {{ currentTicket.assigneeName || '未分配' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentTicket.createdAt }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 工单内容 -->
        <div class="detail-section">
          <h4>工单标题</h4>
          <div class="content-box">{{ currentTicket.title }}</div>
        </div>

        <div class="detail-section">
          <h4>问题描述</h4>
          <div class="content-box">{{ currentTicket.description }}</div>
        </div>

        <!-- 附件 -->
        <div v-if="currentTicket.attachments.length > 0" class="detail-section">
          <h4>附件</h4>
          <div class="attachment-list">
            <el-link
              v-for="(file, index) in currentTicket.attachments"
              :key="index"
              :href="file"
              target="_blank"
              type="primary"
            >
              附件{{ index + 1 }}
            </el-link>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="currentTicket.tags.length > 0" class="detail-section">
          <h4>标签</h4>
          <el-tag
            v-for="(tag, index) in currentTicket.tags"
            :key="index"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 处理信息 -->
        <div v-if="currentTicket.resolvedAt" class="detail-section">
          <h4>处理信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="响应时长">
              {{ currentTicket.responseTime }}分钟
            </el-descriptions-item>
            <el-descriptions-item label="解决时长">
              {{ currentTicket.resolveTime }}小时
            </el-descriptions-item>
            <el-descriptions-item label="解决时间">
              {{ currentTicket.resolvedAt }}
            </el-descriptions-item>
            <el-descriptions-item label="关闭时间">
              {{ currentTicket.closedAt || '未关闭' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 满意度评价 -->
        <div v-if="currentTicket.satisfaction" class="detail-section">
          <h4>满意度评价</h4>
          <div class="satisfaction-box">
            <el-rate :model-value="currentTicket.satisfaction" disabled />
            <div v-if="currentTicket.satisfactionComment" class="satisfaction-comment">
              {{ currentTicket.satisfactionComment }}
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentTicket && currentTicket.status === 'pending'"
          type="primary"
          @click="handleAssignFromDetail"
        >
          分配
        </el-button>
        <el-button
          v-if="currentTicket && currentTicket.status === 'processing'"
          type="success"
          @click="handleResolveFromDetail"
        >
          标记为已解决
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import {
  getTickets,
  getTicketStats,
  assignTicket,
  updateTicketStatus,
  getServiceAgents,
  type Ticket,
  type TicketStats,
  type TicketStatus,
  type TicketType,
  type TicketPriority,
  type ServiceAgent,
  type ServiceStatus
} from '@/api/customerService'

// 统计数据
const stats = ref<TicketStats>({
  totalTickets: 0,
  pendingTickets: 0,
  processingTickets: 0,
  resolvedTickets: 0,
  closedTickets: 0,
  avgResponseTime: 0,
  avgResolveTime: 0,
  avgSatisfaction: 0,
  todayTickets: 0
})

// 搜索表单
const searchForm = ref({
  status: '',
  type: '',
  priority: '',
  assigneeId: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'status',
    label: '工单状态',
    placeholder: '请选择工单状态',
    options: [
      { label: '待处理', value: 'pending' },
      { label: '处理中', value: 'processing' },
      { label: '已解决', value: 'resolved' },
      { label: '已关闭', value: 'closed' },
      { label: '已重开', value: 'reopened' }
    ]
  },
  {
    type: 'select',
    prop: 'type',
    label: '工单类型',
    placeholder: '请选择工单类型',
    options: [
      { label: '咨询', value: 'consultation' },
      { label: '投诉', value: 'complaint' },
      { label: '建议', value: 'suggestion' },
      { label: '技术问题', value: 'technical' },
      { label: '退款', value: 'refund' },
      { label: '其他', value: 'other' }
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
    placeholder: '请输入工单编号、标题或用户名'
  }
]

// 表格数据
const ticketList = ref<Ticket[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { prop: 'ticketNo', label: '工单编号', width: 150 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'userName', label: '用户', width: 120 },
  { prop: 'priority', label: '优先级', width: 100, slot: 'priority' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'assignee', label: '客服', width: 120, slot: 'assignee' },
  { prop: 'satisfaction', label: '满意度', width: 150, slot: 'satisfaction' },
  { prop: 'createdAt', label: '创建时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '查看',
    type: 'primary',
    link: true,
    onClick: (row: Ticket) => handleViewDetail(row)
  },
  {
    label: '分配',
    type: 'success',
    link: true,
    onClick: (row: Ticket) => handleAssign(row),
    show: (row: Ticket) => row.status === 'pending'
  },
  {
    label: '标记已解决',
    type: 'warning',
    link: true,
    onClick: (row: Ticket) => handleResolve(row),
    show: (row: Ticket) => row.status === 'processing'
  }
]

// 分配对话框
const assignDialogVisible = ref(false)
const currentTicket = ref<Ticket | null>(null)
const assignForm = reactive({
  assigneeId: 0
})
const assignFormRef = ref()
const assignRules = {
  assigneeId: [{ required: true, message: '请选择客服人员', trigger: 'change' }]
}
const assigning = ref(false)
const availableAgents = ref<ServiceAgent[]>([])

// 详情对话框
const detailDialogVisible = ref(false)

// 获取统计数据
const fetchStats = async () => {
  try {
    stats.value = await getTicketStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取工单列表
const fetchTicketList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      status: searchForm.value.status as TicketStatus | undefined,
      type: searchForm.value.type as TicketType | undefined,
      priority: searchForm.value.priority as TicketPriority | undefined,
      assigneeId: searchForm.value.assigneeId ? Number(searchForm.value.assigneeId) : undefined,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getTickets(params)
    ticketList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取工单列表失败:', error)
    ElMessage.error('获取工单列表失败')
  } finally {
    loading.value = false
  }
}

// 获取可用客服
const fetchAvailableAgents = async () => {
  try {
    availableAgents.value = await getServiceAgents({ status: 'online' })
  } catch (error) {
    console.error('获取客服列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchTicketList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: '',
    type: '',
    priority: '',
    assigneeId: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchTicketList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchTicketList()
}

// 查看详情
const handleViewDetail = (row: Ticket) => {
  currentTicket.value = row
  detailDialogVisible.value = true
}

// 分配工单
const handleAssign = async (row: Ticket) => {
  currentTicket.value = row
  assignForm.assigneeId = 0
  await fetchAvailableAgents()
  assignDialogVisible.value = true
}

// 从详情页分配
const handleAssignFromDetail = () => {
  detailDialogVisible.value = false
  if (currentTicket.value) {
    handleAssign(currentTicket.value)
  }
}

// 提交分配
const handleAssignSubmit = async () => {
  if (!assignFormRef.value || !currentTicket.value) return

  await assignFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    assigning.value = true
    try {
      const agent = availableAgents.value.find((a) => a.id === assignForm.assigneeId)
      if (!agent) {
        ElMessage.error('客服人员不存在')
        return
      }

      await assignTicket(currentTicket.value!.id, agent.id, agent.name)
      ElMessage.success('分配成功')
      assignDialogVisible.value = false
      fetchTicketList()
      fetchStats()
    } catch (error) {
      console.error('分配失败:', error)
      ElMessage.error('分配失败')
    } finally {
      assigning.value = false
    }
  })
}

// 关闭分配对话框
const handleAssignDialogClose = () => {
  assignFormRef.value?.resetFields()
  currentTicket.value = null
}

// 标记为已解决
const handleResolve = async (row: Ticket) => {
  try {
    await ElMessageBox.confirm('确定要将此工单标记为已解决吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateTicketStatus(row.id, 'resolved')
    ElMessage.success('操作成功')
    fetchTicketList()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 从详情页标记为已解决
const handleResolveFromDetail = () => {
  detailDialogVisible.value = false
  if (currentTicket.value) {
    handleResolve(currentTicket.value)
  }
}

// 关闭详情对话框
const handleDetailDialogClose = () => {
  currentTicket.value = null
}

// 获取工单类型标签类型
const getTypeTagType = (type: TicketType) => {
  const typeMap: Record<TicketType, any> = {
    consultation: '',
    complaint: 'danger',
    suggestion: 'success',
    technical: 'warning',
    refund: 'info',
    other: ''
  }
  return typeMap[type] || 'info'
}

// 获取工单类型标签
const getTypeLabel = (type: TicketType) => {
  const typeMap: Record<TicketType, string> = {
    consultation: '咨询',
    complaint: '投诉',
    suggestion: '建议',
    technical: '技术问题',
    refund: '退款',
    other: '其他'
  }
  return typeMap[type] || type
}

// 获取优先级标签类型
const getPriorityTagType = (priority: TicketPriority) => {
  const priorityMap: Record<TicketPriority, any> = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return priorityMap[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: TicketPriority) => {
  const priorityMap: Record<TicketPriority, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

// 获取状态标签类型
const getStatusTagType = (status: TicketStatus) => {
  const statusMap: Record<TicketStatus, any> = {
    pending: 'warning',
    processing: '',
    resolved: 'success',
    closed: 'info',
    reopened: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: TicketStatus) => {
  const statusMap: Record<TicketStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
    reopened: '已重开'
  }
  return statusMap[status] || status
}

// 获取客服状态类型
const getAgentStatusType = (status: ServiceStatus) => {
  const statusMap: Record<ServiceStatus, any> = {
    online: 'success',
    busy: 'warning',
    offline: 'info',
    break: ''
  }
  return statusMap[status] || 'info'
}

// 获取客服状态标签
const getAgentStatusLabel = (status: ServiceStatus) => {
  const statusMap: Record<ServiceStatus, string> = {
    online: '在线',
    busy: '忙碌',
    offline: '离线',
    break: '休息'
  }
  return statusMap[status] || status
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchTicketList()
})
</script>

<style scoped lang="scss">
.ticket-management-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.no-rating {
  color: #909399;
  font-size: 12px;
}

.agent-option {
  display: flex;
  align-items: center;
}

.ticket-detail {
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

  .attachment-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .satisfaction-box {
    .satisfaction-comment {
      margin-top: 12px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;
      line-height: 1.8;
      color: #606266;
    }
  }
}
</style>
