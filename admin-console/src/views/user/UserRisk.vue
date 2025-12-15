<!-- @ts-nocheck -->
<template>
  <div class="user-risk-container">
    <PageHeader title="风险用户管理" description="监控和管理平台风险用户，及时处理异常行为" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="list"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="250"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #userInfo="{ row }">
        <div class="user-info">
          <el-avatar :src="row.avatarUrl" :size="40">
            {{ row.username?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="user-detail">
            <div>{{ row.username }}</div>
            <div class="phone">{{ row.phone }}</div>
          </div>
        </div>
      </template>

      // @ts-ignore
      <template #riskLevel="{ row }">
        <el-tag :type="getRiskLevelTag(row.riskLevel)">
          {{ getRiskLevelLabel(row.riskLevel) }}
        </el-tag>
      </template>

      <template #riskType="{ row }">
        <el-tag type="info">
          {{ getRiskTypeLabel(row.riskType) }}
        </el-tag>
      </template>

      <template #riskScore="{ row }">
        <span :class="getRiskScoreClass(row.riskScore)">
          {{ row.riskScore }}
        </span>
      </template>

      <template #detectedAt="{ row }">
        {{ formatDateTime(row.detectedAt) }}
      </template>

      // @ts-ignore
      <template #status="{ row }">
        <el-tag :type="getRiskStatusTag(row.status)">
          {{ getRiskStatusLabel(row.status) }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看详情
        </el-button>
        <el-button
          v-if="row.status === 'pending'"
          link
          type="success"
          size="small"
          @click="handleProcess(row)"
        >
          处理
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="handleAddBlacklist(row)"
        >
          加入黑名单
        </el-button>
      </template>
    </DataTable>

    <FormDialog
      v-model="dialogVisible"
      title="处理风险用户"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      @submit="handleSubmit"
    >
      <template #header>
        <div style="margin-bottom: 16px;">
          <div style="margin-bottom: 8px;">
            <strong>用户信息：</strong>{{ currentRisk?.username }} ({{ currentRisk?.phone }})
        // @ts-ignore
          </div>
      // @ts-ignore
          <div>
            <strong>风险等级：</strong>
            <el-tag :type="getRiskLevelTag(currentRisk?.riskLevel)">
              {{ getRiskLevelLabel(currentRisk?.riskLevel) }}
            </el-tag>
          </div>
        </div>
      </template>
    </FormDialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  WarningFilled,
  Warning,
  InfoFilled,
  User,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { useDateFormat, useErrorHandler, useEnumLabel } from '@/composables'
import { RISK_LEVEL_OPTIONS, RISK_TYPE_OPTIONS } from '@/constants'

// Composables
const { formatDateTime } = useDateFormat()
const { handleApiError } = useErrorHandler()
const { getRiskLevelLabel, getRiskTypeLabel, getRiskStatusLabel } = useEnumLabel()

// 风险用户数据类型
interface RiskUser {
  id: number
  username: string
  phone: string
  avatarUrl: string
  riskLevel: 'high' | 'medium' | 'low'
  riskType: 'login' | 'behavior' | 'payment' | 'credit'
  riskScore: number
  riskReason: string
  detectedAt: string
  status: 'pending' | 'processed' | 'ignored'
}

// Mock 数据（实际应该从 API 获取）
const list = ref<RiskUser[]>([
  {
    id: 1,
    username: '张三',
    phone: '13800138000',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    riskLevel: 'high',
    riskType: 'login',
    riskScore: 85,
    riskReason: '短时间内多次登录失败，疑似账号被盗',
    detectedAt: '2024-11-29T10:30:00.000Z',
    status: 'pending',
  },
  {
    id: 2,
    username: '李四',
    phone: '13800138001',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    riskLevel: 'medium',
    riskType: 'behavior',
    riskScore: 65,
    riskReason: '异常浏览行为，频繁切换账号',
    detectedAt: '2024-11-29T09:15:00.000Z',
    status: 'pending',
  },
  {
    id: 3,
    username: '王五',
    phone: '13800138002',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    riskLevel: 'low',
    riskType: 'payment',
    riskScore: 45,
    riskReason: '支付金额异常，超出正常范围',
    detectedAt: '2024-11-29T08:00:00.000Z',
    status: 'processed',
  },
])

const loading = ref(false)

// 统计数据
const stats = reactive({
  highRisk: 5,
  mediumRisk: 12,
  lowRisk: 8,
  total: 25,
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '高风险用户',
    value: stats.highRisk,
    icon: WarningFilled,
    color: '#f56c6c',
  },
  {
    label: '中风险用户',
    value: stats.mediumRisk,
    icon: Warning,
    color: '#e6a23c',
  },
  {
    label: '低风险用户',
    value: stats.lowRisk,
    icon: InfoFilled,
    color: '#909399',
  },
  {
    label: '总风险用户',
    value: stats.total,
    icon: User,
    color: '#409eff',
  },
])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  riskLevel: '',
  riskType: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3,
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'keyword',
    label: '用户信息',
    type: 'input',
    placeholder: '手机号/用户名',
    width: '200px',
  },
  {
    prop: 'riskLevel',
    label: '风险等级',
    type: 'select',
    placeholder: '请选择风险等级',
    width: '150px',
    options: RISK_LEVEL_OPTIONS,
  },
  {
    prop: 'riskType',
    label: '风险类型',
    type: 'select',
    placeholder: '请选择风险类型',
    width: '150px',
    options: RISK_TYPE_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'userInfo', label: '用户信息', width: 200, slot: 'userInfo' },
  { prop: 'riskLevel', label: '风险等级', width: 120, slot: 'riskLevel' },
  { prop: 'riskType', label: '风险类型', width: 120, slot: 'riskType' },
  { prop: 'riskScore', label: '风险评分', width: 100, slot: 'riskScore' },
  { prop: 'riskReason', label: '风险原因', minWidth: 200, showOverflowTooltip: true },
  { prop: 'detectedAt', label: '检测时间', width: 180, slot: 'detectedAt' },
  { prop: 'status', label: '处理状态', width: 100, slot: 'status' },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)
const currentRisk = ref<RiskUser | null>(null)

const formData = reactive({
  action: 'warning',
  remark: '',
})

// 表单字段配置
const formFields: FormField[] = [
  {
    prop: 'action',
    label: '处理方式',
    type: 'radio',
    options: [
      { label: '忽略', value: 'ignore' },
      { label: '警告', value: 'warning' },
      { label: '限制', value: 'restrict' },
      { label: '加入黑名单', value: 'blacklist' },
    ],
  },
  {
    prop: 'remark',
    label: '处理说明',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入处理说明',
  },
]

const formRules = {
  action: [
    { required: true, message: '请选择处理方式', trigger: 'change' },
  ],
  remark: [
    { required: true, message: '请输入处理说明', trigger: 'blur' },
  ],
}

// 搜索
function handleSearch() {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
function handleReset() {
  searchForm.keyword = ''
  searchForm.riskLevel = ''
  searchForm.riskType = ''
  pagination.page = 1
}

// 查看详情
function handleView(row: RiskUser) {
  ElMessage.info('查看风险用户详情功能开发中...')
}

// 处理风险
function handleProcess(row: RiskUser) {
  currentRisk.value = row
  Object.assign(formData, {
    action: 'warning',
    remark: '',
  })
  dialogVisible.value = true
}

// 提交处理
async function handleSubmit() {
  submitLoading.value = true
  try {
    ElMessage.success('处理成功')
    dialogVisible.value = false
    if (currentRisk.value) {
      currentRisk.value.status = 'processed'
    }
  } catch (error) {
    handleApiError(error, '处理失败')
  } finally {
    submitLoading.value = false
  }
}

// 加入黑名单
async function handleAddBlacklist(row: RiskUser) {
  try {
    await ElMessageBox.confirm(
      `确定要将用户 "${row.username}" 加入黑名单吗？`,
      '加入黑名单确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    ElMessage.success('已加入黑名单')
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '操作失败')
    }
  }
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
}

function handleCurrentChange(page: number) {
  pagination.page = page
}

// 获取风险等级标签
function getRiskLevelTag(level?: string) {
  const tagMap: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return tagMap[level || 'info'] || 'info'
}

// 获取风险评分样式
function getRiskScoreClass(score: number) {
  if (score >= 80) return 'risk-score-high'
  if (score >= 60) return 'risk-score-medium'
  return 'risk-score-low'
}

// 获取状态标签
function getRiskStatusTag(status: string) {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    processed: 'success',
    ignored: 'info',
  }
  return tagMap[status] || 'info'
}
</script>

<style scoped lang="scss">
.user-risk-container {
  padding: 20px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-detail {
      .phone {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }

  .risk-score-high {
    color: #f56c6c;
    font-weight: 600;
  }

  .risk-score-medium {
    color: #e6a23c;
    font-weight: 600;
  }

  .risk-score-low {
    color: #909399;
  }
}
</style>
