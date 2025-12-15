<template>
  <div class="system-backup-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>数据备份</h2>
      <p class="page-description">管理数据库备份和恢复操作</p>
    </div>

    <!-- 备份统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon :size="40"><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">备份总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon size">
              <el-icon :size="40"><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalSize }} GB</div>
              <div class="stat-label">总大小</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon latest">
              <el-icon :size="40"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.latestBackup }}</div>
              <div class="stat-label">最近备份</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon auto">
              <el-icon :size="40"><Setting /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.autoBackup ? '已启用' : '已禁用' }}</div>
              <div class="stat-label">自动备份</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="备份类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option label="全量备份" value="full" />
            <el-option label="增量备份" value="incremental" />
            <el-option label="差异备份" value="differential" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="进行中" value="processing" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份时间">
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
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="toolbar-card" shadow="never">
      <el-button type="primary" :icon="Plus" @click="handleCreateBackup">
        立即备份
      </el-button>
      <el-button :icon="Setting" @click="handleAutoBackupSettings">
        自动备份设置
      </el-button>
      <el-button type="danger" :icon="Delete">批量删除</el-button>
    </el-card>

    <!-- 备份列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="backupList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="备份名称" width="250" />
        <el-table-column label="备份类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="备份状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="100">
          <template #default="{ row }">
            {{ row.duration }}s
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="120" />
        <el-table-column prop="createdAt" label="备份时间" width="180" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              :disabled="row.status !== 'success'"
              @click="handleRestore(row)"
            >
              恢复
            </el-button>
            <el-button
              link
              type="success"
              size="small"
              :disabled="row.status !== 'success'"
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button
              link
              type="warning"
              size="small"
              @click="handleVerify(row)"
            >
              验证
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
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

    <!-- 创建备份对话框 -->
    <el-dialog
      v-model="backupDialogVisible"
      title="创建备份"
      width="600px"
    >
      <el-form
        ref="backupFormRef"
        :model="backupForm"
        :rules="backupFormRules"
        label-width="120px"
      >
        <el-form-item label="备份名称" prop="name">
          <el-input v-model="backupForm.name" placeholder="请输入备份名称" />
        </el-form-item>
        <el-form-item label="备份类型" prop="type">
          <el-radio-group v-model="backupForm.type">
            <el-radio label="full">全量备份</el-radio>
            <el-radio label="incremental">增量备份</el-radio>
            <el-radio label="differential">差异备份</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="压缩备份" prop="compress">
          <el-switch
            v-model="backupForm.compress"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="备份表">
          <el-select
            v-model="backupForm.tables"
            multiple
            placeholder="请选择要备份的表（不选则备份全部）"
            style="width: 100%"
          >
            <el-option label="用户表" value="users" />
            <el-option label="订单表" value="orders" />
            <el-option label="车辆表" value="vehicles" />
            <el-option label="支付表" value="payments" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份备注" prop="remark">
          <el-input
            v-model="backupForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备份备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="backupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="backupLoading" @click="handleConfirmBackup">
          开始备份
        </el-button>
      </template>
    </el-dialog>

    <!-- 自动备份设置对话框 -->
    <el-dialog
      v-model="autoBackupDialogVisible"
      title="自动备份设置"
      width="600px"
    >
      <el-form
        ref="autoBackupFormRef"
        :model="autoBackupForm"
        label-width="120px"
      >
        <el-form-item label="启用自动备份">
          <el-switch
            v-model="autoBackupForm.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备份频率">
          <el-select
            v-model="autoBackupForm.frequency"
            :disabled="!autoBackupForm.enabled"
            style="width: 100%"
          >
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-picker
            v-model="autoBackupForm.time"
            :disabled="!autoBackupForm.enabled"
            format="HH:mm"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="保留份数">
          <el-input-number
            v-model="autoBackupForm.keepCount"
            :min="1"
            :max="30"
            :disabled="!autoBackupForm.enabled"
          />
          <span class="form-tip">份（超过后自动删除旧备份）</span>
        </el-form-item>
        <el-form-item label="备份类型">
          <el-radio-group
            v-model="autoBackupForm.type"
            :disabled="!autoBackupForm.enabled"
          >
            <el-radio label="full">全量备份</el-radio>
            <el-radio label="incremental">增量备份</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="autoBackupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAutoBackup">
          保存设置
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Setting,
  Delete,
  FolderOpened,
  Coin,
  Clock,
} from '@element-plus/icons-vue'

// 备份数据类型
interface Backup {
  id: number
  name: string
  type: string
  size: number
  status: string
  duration: number
  createdBy: string
  createdAt: string
  remark: string
}

// 统计数据
const stats = reactive({
  total: 15,
  totalSize: 25.6,
  latestBackup: '2小时前',
  autoBackup: true,
})

// 搜索表单
const searchForm = reactive({
  type: '',
  status: '',
  dateRange: [] as any[],
})

// 备份列表
const backupList = ref<Backup[]>([
  {
    id: 1,
    name: 'backup_full_20241130_190000',
    type: 'full',
    size: 2048576000,
    status: 'success',
    duration: 125,
    createdBy: '管理员',
    createdAt: '2024-11-30 19:00:00',
    remark: '每日自动全量备份',
  },
  {
    id: 2,
    name: 'backup_incremental_20241130_120000',
    type: 'incremental',
    size: 524288000,
    status: 'success',
    duration: 45,
    createdBy: '系统',
    createdAt: '2024-11-30 12:00:00',
    remark: '增量备份',
  },
  {
    id: 3,
    name: 'backup_full_20241129_190000',
    type: 'full',
    size: 2097152000,
    status: 'success',
    duration: 130,
    createdBy: '系统',
    createdAt: '2024-11-29 19:00:00',
    remark: '每日自动全量备份',
  },
  {
    id: 4,
    name: 'backup_manual_20241129_150000',
    type: 'differential',
    size: 1048576000,
    status: 'success',
    duration: 85,
    createdBy: '管理员',
    createdAt: '2024-11-29 15:00:00',
    remark: '手动差异备份',
  },
  {
    id: 5,
    name: 'backup_full_20241128_190000',
    type: 'full',
    size: 2073600000,
    status: 'failed',
    duration: 0,
    createdBy: '系统',
    createdAt: '2024-11-28 19:00:00',
    remark: '备份失败：磁盘空间不足',
  },
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 5,
})

// 创建备份对话框
const backupDialogVisible = ref(false)
const backupLoading = ref(false)
const backupFormRef = ref<FormInstance>()
const backupForm = reactive({
  name: '',
  type: 'full',
  compress: true,
  tables: [] as string[],
  remark: '',
})

const backupFormRules: FormRules = {
  name: [
    { required: true, message: '请输入备份名称', trigger: 'blur' },
  ],
}

// 自动备份设置对话框
const autoBackupDialogVisible = ref(false)
const autoBackupFormRef = ref<FormInstance>()
const autoBackupForm = reactive({
  enabled: true,
  frequency: 'daily',
  time: new Date(2024, 0, 1, 2, 0),
  keepCount: 7,
  type: 'full',
})

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
}

// 创建备份
const handleCreateBackup = () => {
  backupForm.name = `backup_manual_${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}`
  backupDialogVisible.value = true
}

// 确认备份
const handleConfirmBackup = async () => {
  if (!backupFormRef.value) return

  await backupFormRef.value.validate(async (valid) => {
    if (!valid) return

    backupLoading.value = true
    try {
      // TODO: 调用备份API
      await new Promise(resolve => setTimeout(resolve, 2000))
      ElMessage.success('备份任务已创建，正在后台执行...')
      backupDialogVisible.value = false
    } catch (error) {
      ElMessage.error('备份创建失败')
    } finally {
      backupLoading.value = false
    }
  })
}

// 自动备份设置
const handleAutoBackupSettings = () => {
  autoBackupDialogVisible.value = true
}

// 保存自动备份设置
const handleSaveAutoBackup = () => {
  ElMessage.success('自动备份设置已保存')
  autoBackupDialogVisible.value = false
}

// 恢复备份
const handleRestore = async (row: Backup) => {
  try {
    await ElMessageBox.confirm(
      `确定要恢复备份 "${row.name}" 吗？此操作将覆盖当前数据！`,
      '恢复确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('恢复任务已创建，正在后台执行...')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('恢复失败')
    }
  }
}

// 下载备份
const handleDownload = (_row: Backup) => {
  ElMessage.info('下载功能开发中...')
}

// 验证备份
const handleVerify = (_row: Backup) => {
  ElMessage.info('验证功能开发中...')
}

// 删除备份
const handleDelete = async (row: Backup) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除备份 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const index = backupList.value.findIndex(b => b.id === row.id)
    if (index > -1) {
      backupList.value.splice(index, 1)
      pagination.total--
    }
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
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

// 获取类型标签
const getTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    full: 'primary',
    incremental: 'success',
    differential: 'warning',
  }
  return tagMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    full: '全量备份',
    incremental: '增量备份',
    differential: '差异备份',
  }
  return labelMap[type] || type
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    processing: 'warning',
  }
  return tagMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    success: '成功',
    failed: '失败',
    processing: '进行中',
  }
  return labelMap[status] || status
}

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

// 页面加载
onMounted(() => {
  // TODO: 加载备份列表
})
</script>

<style scoped lang="scss">
.system-backup-container {
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

          &.total {
            background-color: #ecf5ff;
            color: #409eff;
          }

          &.size {
            background-color: #f0f9ff;
            color: #67c23a;
          }

          &.latest {
            background-color: #fdf6ec;
            color: #e6a23c;
          }

          &.auto {
            background-color: #fef0f0;
            color: #f56c6c;
          }
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
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

  .form-tip {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
