<!-- 客服质量监控页面 -->
<template>
  <div class="customer-service-quality-container">
    <PageHeader title="客服质量监控" description="实时监控客服人员服务质量和绩效指标" />

    <!-- 统计卡片 -->
    <StatsCard :stats="statsCards" />

    <!-- 搜索表单 -->
    <SearchForm v-model="searchParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #agent="{ row }">
        <div class="agent-info">
          <el-avatar :src="row.avatar" :size="32" />
          <span class="agent-name">{{ row.agentName }}</span>
        </div>
      </template>

      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <template #responseRate="{ row }">
        <el-progress
          :percentage="row.responseRate"
          :color="getScoreColor(row.responseRate)"
          :stroke-width="20"
        />
      </template>

      <template #resolveRate="{ row }">
        <el-progress
          :percentage="row.resolveRate"
          :color="getScoreColor(row.resolveRate)"
          :stroke-width="20"
        />
      </template>

      <template #satisfaction="{ row }">
        <div class="satisfaction-cell">
          <el-rate :model-value="row.satisfaction" disabled size="small" />
          <span class="satisfaction-score">{{ row.satisfaction.toFixed(1) }}</span>
        </div>
      </template>

      <template #qualityScore="{ row }">
        <el-tag :type="getQualityScoreTag(row.qualityScore)" size="large">
          {{ row.qualityScore }}分
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
      </template>
    </DataTable>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客服质量详情"
      width="900px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentAgent" class="quality-detail">
        <!-- 客服信息 -->
        <div class="detail-section">
          <h3>客服信息</h3>
          <div class="agent-detail">
            <el-avatar :src="currentAgent.avatar" :size="64" />
            <div class="agent-detail-info">
              <div class="agent-name">{{ currentAgent.agentName }}</div>
              <div class="agent-id">工号: {{ currentAgent.agentId }}</div>
              <div class="agent-status">
                状态:
                <el-tag :type="getStatusTag(currentAgent.status)" size="small">
                  {{ getStatusLabel(currentAgent.status) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 质量指标 -->
        <div class="detail-section">
          <h3>质量指标</h3>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <span>响应率</span>
                </template>
                <el-progress
                  :percentage="currentAgent.responseRate"
                  :color="getScoreColor(currentAgent.responseRate)"
                  :stroke-width="24"
                />
                <div class="metric-detail">
                  <span>已响应: {{ currentAgent.respondedTickets }}</span>
                  <span>总工单: {{ currentAgent.totalTickets }}</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <span>解决率</span>
                </template>
                <el-progress
                  :percentage="currentAgent.resolveRate"
                  :color="getScoreColor(currentAgent.resolveRate)"
                  :stroke-width="24"
                />
                <div class="metric-detail">
                  <span>已解决: {{ currentAgent.resolvedTickets }}</span>
                  <span>总工单: {{ currentAgent.totalTickets }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="16" style="margin-top: 16px">
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <span>平均响应时间</span>
                </template>
                <div class="time-metric">
                  <span class="time-value">{{ currentAgent.avgResponseTime }}</span>
                  <span class="time-unit">分钟</span>
                </div>
                <div class="metric-tip">
                  目标: ≤ 5分钟
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <span>平均解决时间</span>
                </template>
                <div class="time-metric">
                  <span class="time-value">{{ currentAgent.avgResolveTime }}</span>
                  <span class="time-unit">小时</span>
                </div>
                <div class="metric-tip">
                  目标: ≤ 24小时
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 满意度评价 -->
        <div class="detail-section">
          <h3>满意度评价</h3>
          <el-card shadow="never">
            <div class="satisfaction-detail">
              <div class="satisfaction-main">
                <el-rate :model-value="currentAgent.satisfaction" disabled :size="32" />
                <span class="satisfaction-score-large">{{ currentAgent.satisfaction.toFixed(1) }}</span>
              </div>
              <div class="satisfaction-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">5星:</span>
                  <el-progress
                    :percentage="(currentAgent.fiveStarCount / currentAgent.totalRatings) * 100"
                    :show-text="false"
                  />
                  <span class="breakdown-count">{{ currentAgent.fiveStarCount }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">4星:</span>
                  <el-progress
                    :percentage="(currentAgent.fourStarCount / currentAgent.totalRatings) * 100"
                    :show-text="false"
                  />
                  <span class="breakdown-count">{{ currentAgent.fourStarCount }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">3星:</span>
                  <el-progress
                    :percentage="(currentAgent.threeStarCount / currentAgent.totalRatings) * 100"
                    :show-text="false"
                  />
                  <span class="breakdown-count">{{ currentAgent.threeStarCount }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">2星:</span>
                  <el-progress
                    :percentage="(currentAgent.twoStarCount / currentAgent.totalRatings) * 100"
                    :show-text="false"
                  />
                  <span class="breakdown-count">{{ currentAgent.twoStarCount }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">1星:</span>
                  <el-progress
                    :percentage="(currentAgent.oneStarCount / currentAgent.totalRatings) * 100"
                    :show-text="false"
                  />
                  <span class="breakdown-count">{{ currentAgent.oneStarCount }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 综合评分 -->
        <div class="detail-section">
          <h3>综合质量评分</h3>
          <el-card shadow="never">
            <div class="quality-score-detail">
              <div class="score-main">
                <span class="score-value">{{ currentAgent.qualityScore }}</span>
                <span class="score-label">分</span>
              </div>
              <div class="score-breakdown">
                <div class="score-item">
                  <span class="score-item-label">响应率 (30%)</span>
                  <span class="score-item-value">{{ (currentAgent.responseRate * 0.3).toFixed(1) }}分</span>
                </div>
                <div class="score-item">
                  <span class="score-item-label">解决率 (30%)</span>
                  <span class="score-item-value">{{ (currentAgent.resolveRate * 0.3).toFixed(1) }}分</span>
                </div>
                <div class="score-item">
                  <span class="score-item-label">满意度 (40%)</span>
                  <span class="score-item-value">{{ (currentAgent.satisfaction * 20 * 0.4).toFixed(1) }}分</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, TrendCharts, Timer, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn } from '@/components/common/DataTable.vue'

// 客服状态
type AgentStatus = 'online' | 'busy' | 'offline' | 'break'

// 客服质量数据接口
interface AgentQuality {
  id: number
  agentId: string
  agentName: string
  avatar: string
  status: AgentStatus
  totalTickets: number
  respondedTickets: number
  resolvedTickets: number
  responseRate: number
  resolveRate: number
  avgResponseTime: number
  avgResolveTime: number
  satisfaction: number
  totalRatings: number
  fiveStarCount: number
  fourStarCount: number
  threeStarCount: number
  twoStarCount: number
  oneStarCount: number
  qualityScore: number
  period: string
}

// 统计数据
interface QualityStats {
  totalAgents: number
  avgResponseRate: number
  avgResolveRate: number
  avgSatisfaction: number
}

const stats = ref<QualityStats>({
  totalAgents: 0,
  avgResponseRate: 0,
  avgResolveRate: 0,
  avgSatisfaction: 0,
})

// 统计卡片数据
const statsCards = computed(() => [
  {
    label: '客服人数',
    value: stats.value.totalAgents,
    icon: User,
    color: '#409eff',
    format: 'number' as const,
  },
  {
    label: '平均响应率',
    value: `${stats.value.avgResponseRate.toFixed(1)}%`,
    icon: TrendCharts,
    color: '#67c23a',
  },
  {
    label: '平均解决率',
    value: `${stats.value.avgResolveRate.toFixed(1)}%`,
    icon: Timer,
    color: '#e6a23c',
  },
  {
    label: '平均满意度',
    value: stats.value.avgSatisfaction.toFixed(1),
    icon: Star,
    color: '#f56c6c',
  },
])

const searchFields: SearchField[] = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入客服姓名或工号',
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '在线', value: 'online' },
      { label: '忙碌', value: 'busy' },
      { label: '离线', value: 'offline' },
      { label: '休息', value: 'break' },
    ],
  },
  {
    type: 'date',
    prop: 'period',
    label: '统计周期',
    placeholder: '请选择统计周期',
  },
]

const tableColumns: TableColumn[] = [
  { prop: 'agentId', label: '工号', width: 100 },
  { prop: 'agent', label: '客服', width: 150, slot: 'agent' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'totalTickets', label: '总工单', width: 100 },
  { prop: 'responseRate', label: '响应率', width: 150, slot: 'responseRate' },
  { prop: 'resolveRate', label: '解决率', width: 150, slot: 'resolveRate' },
  { prop: 'avgResponseTime', label: '平均响应(分钟)', width: 140 },
  { prop: 'avgResolveTime', label: '平均解决(小时)', width: 140 },
  { prop: 'satisfaction', label: '满意度', width: 180, slot: 'satisfaction' },
  { prop: 'qualityScore', label: '质量评分', width: 120, slot: 'qualityScore' },
  { prop: 'actions', label: '操作', width: 150, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<AgentQuality[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  status: '',
  period: '',
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentAgent = ref<AgentQuality | null>(null)

// Mock数据
const mockAgents: AgentQuality[] = [
  {
    id: 1,
    agentId: 'CS001',
    agentName: '张小美',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'online',
    totalTickets: 156,
    respondedTickets: 152,
    resolvedTickets: 145,
    responseRate: 97.4,
    resolveRate: 92.9,
    avgResponseTime: 3.2,
    avgResolveTime: 18.5,
    satisfaction: 4.8,
    totalRatings: 145,
    fiveStarCount: 120,
    fourStarCount: 20,
    threeStarCount: 3,
    twoStarCount: 1,
    oneStarCount: 1,
    qualityScore: 95,
    period: '2025-12',
  },
  {
    id: 2,
    agentId: 'CS002',
    agentName: '李明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    status: 'busy',
    totalTickets: 142,
    respondedTickets: 138,
    resolvedTickets: 130,
    responseRate: 97.2,
    resolveRate: 91.5,
    avgResponseTime: 4.1,
    avgResolveTime: 20.3,
    satisfaction: 4.6,
    totalRatings: 130,
    fiveStarCount: 105,
    fourStarCount: 18,
    threeStarCount: 5,
    twoStarCount: 1,
    oneStarCount: 1,
    qualityScore: 92,
    period: '2025-12',
  },
  {
    id: 3,
    agentId: 'CS003',
    agentName: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    status: 'online',
    totalTickets: 128,
    respondedTickets: 120,
    resolvedTickets: 115,
    responseRate: 93.8,
    resolveRate: 89.8,
    avgResponseTime: 5.8,
    avgResolveTime: 22.1,
    satisfaction: 4.4,
    totalRatings: 115,
    fiveStarCount: 90,
    fourStarCount: 18,
    threeStarCount: 5,
    twoStarCount: 1,
    oneStarCount: 1,
    qualityScore: 88,
    period: '2025-12',
  },
  {
    id: 4,
    agentId: 'CS004',
    agentName: '赵强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    status: 'offline',
    totalTickets: 98,
    respondedTickets: 90,
    resolvedTickets: 85,
    responseRate: 91.8,
    resolveRate: 86.7,
    avgResponseTime: 6.5,
    avgResolveTime: 25.8,
    satisfaction: 4.2,
    totalRatings: 85,
    fiveStarCount: 65,
    fourStarCount: 15,
    threeStarCount: 3,
    twoStarCount: 1,
    oneStarCount: 1,
    qualityScore: 85,
    period: '2025-12',
  },
  {
    id: 5,
    agentId: 'CS005',
    agentName: '刘洋',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    status: 'online',
    totalTickets: 165,
    respondedTickets: 160,
    resolvedTickets: 155,
    responseRate: 96.9,
    resolveRate: 93.9,
    avgResponseTime: 3.8,
    avgResolveTime: 19.2,
    satisfaction: 4.7,
    totalRatings: 155,
    fiveStarCount: 130,
    fourStarCount: 20,
    threeStarCount: 3,
    twoStarCount: 1,
    oneStarCount: 1,
    qualityScore: 94,
    period: '2025-12',
  },
]

const fetchStats = async () => {
  try {
    // Mock统计数据
    const totalAgents = mockAgents.length
    const avgResponseRate =
      mockAgents.reduce((sum, agent) => sum + agent.responseRate, 0) / totalAgents
    const avgResolveRate =
      mockAgents.reduce((sum, agent) => sum + agent.resolveRate, 0) / totalAgents
    const avgSatisfaction =
      mockAgents.reduce((sum, agent) => sum + agent.satisfaction, 0) / totalAgents

    stats.value = {
      totalAgents,
      avgResponseRate,
      avgResolveRate,
      avgSatisfaction,
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    // Mock数据过滤
    let filteredData = [...mockAgents]

    if (searchParams.keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.agentName.includes(searchParams.keyword) ||
          item.agentId.includes(searchParams.keyword)
      )
    }

    if (searchParams.status) {
      filteredData = filteredData.filter((item) => item.status === searchParams.status)
    }

    // 分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    keyword: '',
    status: '',
    period: '',
  })
  pagination.page = 1
  fetchList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const handleView = (row: AgentQuality) => {
  currentAgent.value = row
  detailDialogVisible.value = true
}

const handleDetailDialogClose = () => {
  currentAgent.value = null
}

const getStatusTag = (status: AgentStatus) => {
  const statusMap: Record<AgentStatus, any> = {
    online: 'success',
    busy: 'warning',
    offline: 'info',
    break: '',
  }
  return statusMap[status] || ''
}

const getStatusLabel = (status: AgentStatus) => {
  const statusMap: Record<AgentStatus, string> = {
    online: '在线',
    busy: '忙碌',
    offline: '离线',
    break: '休息',
  }
  return statusMap[status] || status
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#e6a23c'
  if (score >= 70) return '#f56c6c'
  return '#909399'
}

const getQualityScoreTag = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return ''
  if (score >= 70) return 'warning'
  return 'danger'
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.customer-service-quality-container {
  padding: 20px;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .agent-name {
    font-size: 14px;
  }
}

.satisfaction-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .satisfaction-score {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }
}

.quality-detail {
  .detail-section {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .agent-detail {
    display: flex;
    align-items: center;
    gap: 16px;

    .agent-detail-info {
      .agent-name {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .agent-id,
      .agent-status {
        font-size: 14px;
        color: #909399;
        margin-bottom: 4px;
      }
    }
  }

  .metric-detail {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 13px;
    color: #606266;
  }

  .time-metric {
    text-align: center;
    padding: 20px 0;

    .time-value {
      font-size: 36px;
      font-weight: 600;
      color: #409eff;
    }

    .time-unit {
      font-size: 14px;
      color: #909399;
      margin-left: 4px;
    }
  }

  .metric-tip {
    text-align: center;
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }

  .satisfaction-detail {
    .satisfaction-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px 0;

      .satisfaction-score-large {
        font-size: 48px;
        font-weight: 600;
        color: #f7ba2a;
      }
    }

    .satisfaction-breakdown {
      margin-top: 20px;

      .breakdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .breakdown-label {
          width: 50px;
          font-size: 14px;
          color: #606266;
        }

        .breakdown-count {
          width: 40px;
          text-align: right;
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .quality-score-detail {
    .score-main {
      text-align: center;
      padding: 20px 0;

      .score-value {
        font-size: 64px;
        font-weight: 600;
        color: #67c23a;
      }

      .score-label {
        font-size: 18px;
        color: #909399;
        margin-left: 8px;
      }
    }

    .score-breakdown {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;

      .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        font-size: 14px;

        .score-item-label {
          color: #606266;
        }

        .score-item-value {
          font-weight: 500;
          color: #409eff;
        }
      }
    }
  }
}
</style>
