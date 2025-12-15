<template>
  <div class="system-monitor-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统监控</h2>
      <p class="page-description">实时监控系统性能和资源使用情况</p>
    </div>

    <!-- 系统状态卡片 -->
    <el-row :gutter="20" class="status-row">
      <el-col :span="6">
        <el-card shadow="hover" class="status-card">
          <div class="status-content">
            <div class="status-icon cpu">
              <el-icon :size="40"><Monitor /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-label">CPU使用率</div>
              <div class="status-value">{{ systemStatus.cpu }}%</div>
              <el-progress :percentage="systemStatus.cpu" :color="getProgressColor(systemStatus.cpu)" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="status-card">
          <div class="status-content">
            <div class="status-icon memory">
              <el-icon :size="40"><Coin /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-label">内存使用率</div>
              <div class="status-value">{{ systemStatus.memory }}%</div>
              <el-progress :percentage="systemStatus.memory" :color="getProgressColor(systemStatus.memory)" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="status-card">
          <div class="status-content">
            <div class="status-icon disk">
              <el-icon :size="40"><FolderOpened /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-label">磁盘使用率</div>
              <div class="status-value">{{ systemStatus.disk }}%</div>
              <el-progress :percentage="systemStatus.disk" :color="getProgressColor(systemStatus.disk)" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="status-card">
          <div class="status-content">
            <div class="status-icon network">
              <el-icon :size="40"><Connection /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-label">网络流量</div>
              <div class="status-value">{{ systemStatus.network }} MB/s</div>
              <div class="status-detail">
                <span>↑ {{ systemStatus.networkUp }} MB/s</span>
                <span>↓ {{ systemStatus.networkDown }} MB/s</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 服务状态 -->
    <el-card class="service-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>服务状态</span>
          <el-button type="primary" size="small" :icon="Refresh" @click="handleRefreshServices">
            刷新
          </el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="service in services" :key="service.name">
          <div class="service-item">
            <div class="service-icon" :class="service.status">
              <el-icon :size="24">
                <CircleCheck v-if="service.status === 'running'" />
                <CircleClose v-else />
              </el-icon>
            </div>
            <div class="service-info">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-status">
                <el-tag :type="service.status === 'running' ? 'success' : 'danger'" size="small">
                  {{ service.status === 'running' ? '运行中' : '已停止' }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据库连接池 -->
    <el-card class="database-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>数据库连接池</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="db-stat">
            <div class="db-label">活跃连接</div>
            <div class="db-value">{{ database.active }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="db-stat">
            <div class="db-label">空闲连接</div>
            <div class="db-value">{{ database.idle }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="db-stat">
            <div class="db-label">最大连接数</div>
            <div class="db-value">{{ database.max }}</div>
          </div>
        </el-col>
      </el-row>
      <el-progress
        :percentage="(database.active / database.max) * 100"
        :color="getProgressColor((database.active / database.max) * 100)"
        :stroke-width="20"
        style="margin-top: 20px"
      >
        <span>{{ database.active }} / {{ database.max }}</span>
      </el-progress>
    </el-card>

    <!-- API性能监控 -->
    <el-card class="api-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>API性能监控</span>
          <el-button type="primary" size="small" :icon="Refresh" @click="handleRefreshApi">
            刷新
          </el-button>
        </div>
      </template>
      <el-table :data="apiStats" stripe style="width: 100%">
        <el-table-column prop="path" label="API路径" width="300" />
        <el-table-column prop="method" label="请求方法" width="100">
          <template #default="{ row }">
            <el-tag :type="getMethodType(row.method)" size="small">
              {{ row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="avgTime" label="平均响应时间" width="150">
          <template #default="{ row }">
            <span :class="{ 'slow-api': row.avgTime > 1000 }">
              {{ row.avgTime }}ms
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="p95Time" label="P95响应时间" width="150">
          <template #default="{ row }">
            {{ row.p95Time }}ms
          </template>
        </el-table-column>
        <el-table-column prop="requestCount" label="请求次数" width="120" />
        <el-table-column prop="errorCount" label="错误次数" width="120">
          <template #default="{ row }">
            <span :class="{ 'error-count': row.errorCount > 0 }">
              {{ row.errorCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="errorRate" label="错误率" width="100">
          <template #default="{ row }">
            <el-tag :type="row.errorRate > 5 ? 'danger' : 'success'" size="small">
              {{ row.errorRate }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 系统日志 -->
    <el-card class="log-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>系统日志</span>
          <div>
            <el-select v-model="logLevel" size="small" style="width: 120px; margin-right: 10px">
              <el-option label="全部" value="all" />
              <el-option label="错误" value="error" />
              <el-option label="警告" value="warn" />
              <el-option label="信息" value="info" />
            </el-select>
            <el-button type="primary" size="small" :icon="Refresh" @click="handleRefreshLogs">
              刷新
            </el-button>
          </div>
        </div>
      </template>
      <div class="log-content">
        <div v-for="log in systemLogs" :key="log.id" class="log-item" :class="log.level">
          <span class="log-time">{{ log.time }}</span>
          <el-tag :type="getLogType(log.level)" size="small" class="log-level">
            {{ log.level.toUpperCase() }}
          </el-tag>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Coin,
  FolderOpened,
  Connection,
  Refresh,
  CircleCheck,
  CircleClose,
} from '@element-plus/icons-vue'

// 系统状态
const systemStatus = reactive({
  cpu: 45,
  memory: 68,
  disk: 52,
  network: 12.5,
  networkUp: 5.2,
  networkDown: 7.3,
})

// 服务列表
const services = ref([
  { name: 'Web服务', status: 'running' },
  { name: 'API服务', status: 'running' },
  { name: 'MySQL', status: 'running' },
  { name: 'Redis', status: 'running' },
  { name: '消息队列', status: 'running' },
  { name: '定时任务', status: 'running' },
  { name: '文件服务', status: 'running' },
  { name: '日志服务', status: 'running' },
])

// 数据库连接池
const database = reactive({
  active: 45,
  idle: 35,
  max: 100,
})

// API统计
const apiStats = ref([
  {
    path: '/api/v1/users',
    method: 'GET',
    avgTime: 245,
    p95Time: 450,
    requestCount: 1250,
    errorCount: 5,
    errorRate: 0.4,
  },
  {
    path: '/api/v1/orders',
    method: 'GET',
    avgTime: 580,
    p95Time: 920,
    requestCount: 850,
    errorCount: 12,
    errorRate: 1.4,
  },
  {
    path: '/api/v1/vehicles',
    method: 'GET',
    avgTime: 1250,
    p95Time: 2100,
    requestCount: 650,
    errorCount: 8,
    errorRate: 1.2,
  },
  {
    path: '/api/v1/auth/login',
    method: 'POST',
    avgTime: 320,
    p95Time: 580,
    requestCount: 450,
    errorCount: 25,
    errorRate: 5.6,
  },
])

// 系统日志
const logLevel = ref('all')
const systemLogs = ref([
  {
    id: 1,
    time: '2024-11-30 19:30:15',
    level: 'error',
    message: 'Database connection timeout: Connection pool exhausted',
  },
  {
    id: 2,
    time: '2024-11-30 19:29:45',
    level: 'warn',
    message: 'High memory usage detected: 85% of available memory in use',
  },
  {
    id: 3,
    time: '2024-11-30 19:29:20',
    level: 'info',
    message: 'Scheduled task completed: Daily backup finished successfully',
  },
  {
    id: 4,
    time: '2024-11-30 19:28:50',
    level: 'info',
    message: 'User login: admin@daodao.com from IP 192.168.1.100',
  },
  {
    id: 5,
    time: '2024-11-30 19:28:30',
    level: 'warn',
    message: 'API response time exceeded threshold: /api/v1/vehicles took 1250ms',
  },
])

let refreshTimer: number | null = null

// 刷新服务状态
const handleRefreshServices = () => {
  ElMessage.success('服务状态已刷新')
}

// 刷新API统计
const handleRefreshApi = () => {
  ElMessage.success('API统计已刷新')
}

// 刷新日志
const handleRefreshLogs = () => {
  ElMessage.success('系统日志已刷新')
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 60) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// 获取请求方法类型
const getMethodType = (method: string) => {
  const typeMap: Record<string, any> = {
    GET: 'success',
    POST: 'primary',
    PUT: 'warning',
    DELETE: 'danger',
  }
  return typeMap[method] || 'info'
}

// 获取日志类型
const getLogType = (level: string) => {
  const typeMap: Record<string, any> = {
    error: 'danger',
    warn: 'warning',
    info: 'info',
  }
  return typeMap[level] || 'info'
}

// 模拟实时数据更新
const startRefresh = () => {
  refreshTimer = window.setInterval(() => {
    // 随机更新系统状态
    systemStatus.cpu = Math.floor(Math.random() * 30) + 40
    systemStatus.memory = Math.floor(Math.random() * 20) + 60
    systemStatus.disk = Math.floor(Math.random() * 10) + 50
    systemStatus.network = (Math.random() * 10 + 10).toFixed(1) as any
    systemStatus.networkUp = (Math.random() * 5 + 3).toFixed(1) as any
    systemStatus.networkDown = (Math.random() * 8 + 5).toFixed(1) as any

    // 随机更新数据库连接
    database.active = Math.floor(Math.random() * 30) + 40
    database.idle = 100 - database.active - Math.floor(Math.random() * 10)
  }, 3000)
}

// 页面加载
onMounted(() => {
  startRefresh()
})

// 页面卸载
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped lang="scss">
.system-monitor-container {
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

  .status-row {
    margin-bottom: 20px;

    .status-card {
      .status-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;

          &.cpu {
            background-color: #ecf5ff;
            color: #409eff;
          }

          &.memory {
            background-color: #f0f9ff;
            color: #67c23a;
          }

          &.disk {
            background-color: #fdf6ec;
            color: #e6a23c;
          }

          &.network {
            background-color: #fef0f0;
            color: #f56c6c;
          }
        }

        .status-info {
          flex: 1;

          .status-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .status-value {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
          }

          .status-detail {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  .service-card,
  .database-card,
  .api-card,
  .log-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      margin-bottom: 15px;

      .service-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;

        &.running {
          background-color: #f0f9ff;
          color: #67c23a;
        }

        &.stopped {
          background-color: #fef0f0;
          color: #f56c6c;
        }
      }

      .service-info {
        flex: 1;

        .service-name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 5px;
        }
      }
    }

    .db-stat {
      text-align: center;
      padding: 20px;
      border: 1px solid #ebeef5;
      border-radius: 4px;

      .db-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .db-value {
        font-size: 28px;
        font-weight: 600;
        color: #409eff;
      }
    }

    .slow-api {
      color: #e6a23c;
      font-weight: 600;
    }

    .error-count {
      color: #f56c6c;
      font-weight: 600;
    }

    .log-content {
      max-height: 400px;
      overflow-y: auto;

      .log-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-bottom: 1px solid #ebeef5;
        font-family: 'Courier New', monospace;
        font-size: 13px;

        &:last-child {
          border-bottom: none;
        }

        &.error {
          background-color: #fef0f0;
        }

        &.warn {
          background-color: #fdf6ec;
        }

        .log-time {
          color: #909399;
          white-space: nowrap;
        }

        .log-level {
          white-space: nowrap;
        }

        .log-message {
          flex: 1;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
