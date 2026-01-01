<template>
  <div class="system-alerts-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>智能预警</h2>
      <p class="page-description">监控业务异常和系统异常，及时预警处理</p>
    </div>

    <!-- 预警统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card critical">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.critical }}</div>
              <div class="stat-label">严重预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card warning">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><WarningFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.warning }}</div>
              <div class="stat-label">警告预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card info">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><InfoFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.info }}</div>
              <div class="stat-label">提示预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card resolved">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.resolved }}</div>
              <div class="stat-label">已处理</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="预警级别">
          <el-select
            v-model="searchForm.level"
            placeholder="请选择级别"
            clearable
            style="width: 150px"
          >
            <el-option label="严重" value="critical" />
            <el-option label="警告" value="warning" />
            <el-option label="提示" value="info" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option label="业务异常" value="business" />
            <el-option label="系统异常" value="system" />
            <el-option label="性能异常" value="performance" />
            <el-option label="安全异常" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="resolved" />
            <el-option label="已忽略" value="ignored" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="toolbar-card" shadow="never">
      <el-button type="primary" :icon="Plus" @click="handleCreateRule"> 新增预警规则 </el-button>
      <el-button :icon="Setting" @click="handleManageRules"> 管理规则 </el-button>
      <el-button type="danger" :icon="Delete">批量删除</el-button>
      <el-button :icon="Download">导出记录</el-button>
    </el-card>

    <!-- 预警列表 -->
    <el-card class="table-card" shadow="never">
      <el-table v-loading="loading" :data="alertsList" stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ getLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预警类型" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="预警标题" width="200" />
        <el-table-column prop="message" label="预警内容" show-overflow-tooltip />
        <el-table-column prop="source" label="预警来源" width="150" />
        <el-table-column label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="预警时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              查看详情
            </el-button>
            <el-button
              link
              type="success"
              size="small"
              :disabled="row.status === 'resolved'"
              @click="handleResolve(row)"
            >
              标记处理
            </el-button>
            <el-button
              link
              type="warning"
              size="small"
              :disabled="row.status === 'ignored'"
              @click="handleIgnore(row)"
            >
              忽略
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 预警详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预警详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预警ID">
          {{ currentAlert?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="预警级别">
          <el-tag :type="getLevelType(currentAlert?.level)" size="small">
            {{ getLevelLabel(currentAlert?.level) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预警类型">
          <el-tag type="info" size="small">
            {{ getTypeLabel(currentAlert?.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag :type="getStatusType(currentAlert?.status)" size="small">
            {{ getStatusLabel(currentAlert?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预警标题" :span="2">
          {{ currentAlert?.title }}
        </el-descriptions-item>
        <el-descriptions-item label="预警内容" :span="2">
          {{ currentAlert?.message }}
        </el-descriptions-item>
        <el-descriptions-item label="预警来源">
          {{ currentAlert?.source }}
        </el-descriptions-item>
        <el-descriptions-item label="预警时间">
          {{ currentAlert?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="详细信息" :span="2">
          // @ts-ignore
          <el-input v-model="currentAlert.details" type="textarea" :rows="6" readonly />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          type="success"
          :disabled="currentAlert?.status === 'resolved'"
          @click="handleResolve(currentAlert)"
        >
          标记处理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Setting,
  Delete,
  Download,
  Warning,
  WarningFilled,
  InfoFilled,
  CircleCheck,
} from '@element-plus/icons-vue'

// 预警数据类型
interface Alert {
  id: number
  level: string
  type: string
  title: string
  message: string
  source: string
  status: string
  details: string
  createdAt: string
}

// 统计数据
const stats = reactive({
  critical: 5,
  warning: 12,
  info: 8,
  resolved: 45,
})

// 搜索表单
const searchForm = reactive({
  level: '',
  type: '',
  status: '',
  dateRange: [] as any[],
})

// 预警列表
const alertsList = ref<Alert[]>([
  {
    id: 1,
    level: 'critical',
    type: 'business',
    title: '订单支付异常率过高',
    message: '最近1小时订单支付失败率达到15%，超过阈值10%',
    source: '订单监控系统',
    status: 'pending',
    details: '详细信息：支付失败订单数：45，总订单数：300，失败率：15%',
    createdAt: '2024-11-30 18:30:00',
  },
  {
    id: 2,
    level: 'warning',
    type: 'system',
    title: '数据库连接池使用率过高',
    message: '数据库连接池使用率达到85%，建议扩容',
    source: '系统监控',
    status: 'processing',
    details: '当前连接数：85，最大连接数：100，使用率：85%',
    createdAt: '2024-11-30 18:15:00',
  },
  {
    id: 3,
    level: 'info',
    type: 'performance',
    title: 'API响应时间增加',
    message: '用户列表API平均响应时间从200ms增加到500ms',
    source: '性能监控',
    status: 'resolved',
    details: '平均响应时间：500ms，P95响应时间：800ms',
    createdAt: '2024-11-30 18:00:00',
  },
  {
    id: 4,
    level: 'critical',
    type: 'security',
    title: '检测到异常登录行为',
    message: '用户账号在短时间内从多个IP地址登录',
    source: '安全监控',
    status: 'pending',
    details: '用户ID：12345，登录IP数：5，时间跨度：10分钟',
    createdAt: '2024-11-30 17:45:00',
  },
  {
    id: 5,
    level: 'warning',
    type: 'business',
    title: '车辆库存不足',
    message: '北京朝阳店可用车辆数量低于安全库存',
    source: '库存监控',
    status: 'pending',
    details: '当前可用车辆：3，安全库存：5',
    createdAt: '2024-11-30 17:30:00',
  },
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 5,
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentAlert = ref<Alert | null>(null)

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.level = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
}

// 新增预警规则
const handleCreateRule = () => {
  ElMessage.info('新增预警规则功能开发中...')
}

// 管理规则
const handleManageRules = () => {
  ElMessage.info('管理规则功能开发中...')
}

// 查看详情
const handleView = (row: Alert) => {
  currentAlert.value = row
  detailDialogVisible.value = true
}

// 标记处理
const handleResolve = async (row: Alert | null) => {
  if (!row) return

  try {
    await ElMessageBox.confirm(`确定要将预警 "${row.title}" 标记为已处理吗？`, '处理确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
    })
    row.status = 'resolved'
    stats.resolved++
    if (row.level === 'critical') stats.critical--
    else if (row.level === 'warning') stats.warning--
    else if (row.level === 'info') stats.info--
    ElMessage.success('标记成功')
    detailDialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('标记失败')
    }
  }
}

// 忽略预警
const handleIgnore = async (row: Alert) => {
  try {
    await ElMessageBox.confirm(`确定要忽略预警 "${row.title}" 吗？`, '忽略确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    row.status = 'ignored'
    ElMessage.success('已忽略')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

// 获取级别类型标签
const getLevelType = (level?: string) => {
  const typeMap: Record<any, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    critical: 'danger',
    warning: 'warning',
    info: 'info',
  }
  return typeMap[level || 'info'] || 'info'
}

// 获取级别标签文本
const getLevelLabel = (level?: string) => {
  const labelMap: Record<string, string> = {
    critical: '严重',
    warning: '警告',
    info: '提示',
  }
  return labelMap[level || 'info'] || level
}

// 获取类型标签文本
const getTypeLabel = (type?: string) => {
  const labelMap: Record<string, string> = {
    business: '业务异常',
    system: '系统异常',
    performance: '性能异常',
    security: '安全异常',
  }
  return labelMap[type || 'info'] || type
}

// 获取状态类型标签
const getStatusType = (status?: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const typeMap: Record<any, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    ignored: 'info',
  }
  return typeMap[status || 'info'] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status?: string) => {
  const labelMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已处理',
    ignored: '已忽略',
  }
  return labelMap[status || 'info'] || status
}

// 页面加载
onMounted(() => {
  // TODO: 加载预警列表
})
</script>

<style scoped lang="scss">
.system-alerts-container {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #303133;
    }

    .page-description {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      &.critical {
        .stat-icon {
          background-color: #fef0f0;
          color: #f56c6c;
        }

        .stat-value {
          color: #f56c6c;
        }
      }

      &.warning {
        .stat-icon {
          background-color: #fdf6ec;
          color: #e6a23c;
        }

        .stat-value {
          color: #e6a23c;
        }
      }

      &.info {
        .stat-icon {
          background-color: #f4f4f5;
          color: #909399;
        }

        .stat-value {
          color: #909399;
        }
      }

      &.resolved {
        .stat-icon {
          background-color: #f0f9ff;
          color: #67c23a;
        }

        .stat-value {
          color: #67c23a;
        }
      }
    }
  }

  .search-card,
  .toolbar-card,
  .table-card {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
