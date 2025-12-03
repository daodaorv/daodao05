<template>
  <div class="user-risk-container">
    <!-- 页面标题 -->
    <PageHeader title="风险用户管理" description="监控和管理平台风险用户，及时处理异常行为" />

    <!-- 统计卡片 -->
    <StatsCard :stats="statsConfig" />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="riskList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="250"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 用户信息列 -->
      <template #userInfo="{ row }">
        <div class="user-info">
          <el-avatar :src="row.avatarUrl" :size="40">
            {{ row.username.charAt(0) }}
          </el-avatar>
          <div class="user-detail">
            <div>{{ row.username }}</div>
            <div class="phone">{{ row.phone }}</div>
          </div>
        </div>
      </template>

      <!-- 风险等级列 -->
      <template #riskLevel="{ row }">
        <el-tag :type="getRiskLevelType(row.riskLevel)">
          {{ getRiskLevelLabel(row.riskLevel) }}
        </el-tag>
      </template>

      <!-- 风险类型列 -->
      <template #riskType="{ row }">
        <el-tag type="info">
          {{ getRiskTypeLabel(row.riskType) }}
        </el-tag>
      </template>

      <!-- 风险评分列 -->
      <template #riskScore="{ row }">
        <span :class="getRiskScoreClass(row.riskScore)">
          {{ row.riskScore }}
        </span>
      </template>

      <!-- 检测时间列 -->
      <template #detectedAt="{ row }">
        {{ formatDateTime(row.detectedAt) }}
      </template>

      <!-- 处理状态列 -->
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 自定义操作列 -->
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

    <!-- 处理风险对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理风险用户"
      width="600px"
    >
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processFormRules"
        label-width="100px"
      >
        <el-form-item label="用户信息">
          <div>{{ currentRisk?.username }} ({{ currentRisk?.phone }})</div>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-tag :type="getRiskLevelType(currentRisk?.riskLevel)">
            {{ getRiskLevelLabel(currentRisk?.riskLevel) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="处理方式" prop="action">
          <el-radio-group v-model="processForm.action">
            <el-radio label="ignore">忽略</el-radio>
            <el-radio label="warning">警告</el-radio>
            <el-radio label="restrict">限制</el-radio>
            <el-radio label="blacklist">加入黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" prop="remark">
          <el-input
            v-model="processForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProcessSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
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
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'

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
    options: [
      { label: '高风险', value: 'high' },
      { label: '中风险', value: 'medium' },
      { label: '低风险', value: 'low' },
    ],
  },
  {
    prop: 'riskType',
    label: '风险类型',
    type: 'select',
    placeholder: '请选择风险类型',
    width: '150px',
    options: [
      { label: '登录异常', value: 'login' },
      { label: '行为异常', value: 'behavior' },
      { label: '支付异常', value: 'payment' },
      { label: '信用异常', value: 'credit' },
    ],
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

// 风险用户列表
const riskList = ref<RiskUser[]>([
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

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3,
})

// 处理对话框
const processDialogVisible = ref(false)
const currentRisk = ref<RiskUser | null>(null)
const processFormRef = ref<FormInstance>()

const processForm = reactive({
  action: 'warning',
  remark: '',
})

const processFormRules: FormRules = {
  action: [
    { required: true, message: '请选择处理方式', trigger: 'change' },
  ],
  remark: [
    { required: true, message: '请输入处理说明', trigger: 'blur' },
  ],
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // TODO: 调用搜索API
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.riskLevel = ''
  searchForm.riskType = ''
  pagination.page = 1
  // TODO: 重新加载数据
}

// 查看详情
const handleView = (row: RiskUser) => {
  ElMessage.info('查看风险用户详情功能开发中...')
  // TODO: 跳转到详情页面或打开详情对话框
}

// 处理风险
const handleProcess = (row: RiskUser) => {
  currentRisk.value = row
  processForm.action = 'warning'
  processForm.remark = ''
  processDialogVisible.value = true
}

// 提交处理
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return

  await processFormRef.value.validate(async (valid) => {
    if (!valid) return

    ElMessage.success('处理成功')
    processDialogVisible.value = false
    // TODO: 调用处理API
    if (currentRisk.value) {
      currentRisk.value.status = 'processed'
    }
  })
}

// 加入黑名单
const handleAddBlacklist = async (row: RiskUser) => {
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
    // TODO: 调用加入黑名单API
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // TODO: 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  // TODO: 重新加载数据
}

// 获取风险等级类型
const getRiskLevelType = (level?: string) => {
  const typeMap: Record<string, any> = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return typeMap[level || ''] || 'info'
}

// 获取风险等级标签
const getRiskLevelLabel = (level?: string) => {
  const labelMap: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  }
  return labelMap[level || ''] || level
}

// 获取风险类型标签
const getRiskTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    login: '登录异常',
    behavior: '行为异常',
    payment: '支付异常',
    credit: '信用异常',
  }
  return labelMap[type] || type
}

// 获取风险评分样式
const getRiskScoreClass = (score: number) => {
  if (score >= 80) return 'risk-score-high'
  if (score >= 60) return 'risk-score-medium'
  return 'risk-score-low'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    processed: 'success',
    ignored: 'info',
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待处理',
    processed: '已处理',
    ignored: '已忽略',
  }
  return labelMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 页面加载
onMounted(() => {
  // TODO: 加载风险用户列表
})
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
