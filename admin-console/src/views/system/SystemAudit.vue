<template>
  <div class="system-audit-container">
    <!-- 页面标题 -->
    <PageHeader title="审计日志" description="查看和管理系统操作审计日志" />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="auditList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="120"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 操作人列 -->
      <template #operator="{ row }">
        <div class="operator-info">
          <el-avatar :size="32" :src="row.operatorAvatar">
            {{ row.operator?.charAt(0) || 'O' }}
          </el-avatar>
          <span class="operator-name">{{ row.operator }}</span>
        </div>
      </template>

      <!-- 操作模块列 -->
      <template #module="{ row }">
        <el-tag type="info" size="small">
          {{ getModuleLabel(row.module) }}
        </el-tag>
      </template>

      <!-- 操作类型列 -->
      <template #action="{ row }">
        <el-tag :type="getActionType(row.action)" size="small">
          {{ getActionLabel(row.action) }}
        </el-tag>
      </template>

      <!-- 操作结果列 -->
      <template #status="{ row }">
        <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
          {{ row.status === 'success' ? '成功' : '失败' }}
        </el-tag>
      </template>

      <!-- 耗时列 -->
      <template #duration="{ row }">
        {{ row.duration }}ms
      </template>

      <!-- 自定义操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看详情
        </el-button>
      </template>
    </DataTable>

    <!-- 审计日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="审计日志详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志ID">
          {{ currentAudit?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentAudit?.operator }}
        </el-descriptions-item>
        <el-descriptions-item label="操作模块">
          {{ getModuleLabel(currentAudit?.module) }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getActionType(currentAudit?.action)" size="small">
            {{ getActionLabel(currentAudit?.action) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作描述" :span="2">
          {{ currentAudit?.description }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ currentAudit?.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">
          {{ currentAudit?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="浏览器" :span="2">
          {{ currentAudit?.userAgent }}
        </el-descriptions-item>
        <el-descriptions-item label="操作结果">
          <el-tag :type="currentAudit?.status === 'success' ? 'success' : 'danger'">
            {{ currentAudit?.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="执行耗时">
          {{ currentAudit?.duration }}ms
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <el-input
            v-model="currentAudit.requestParams"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-descriptions-item>
        <el-descriptions-item label="响应结果" :span="2">
          <el-input
            v-model="currentAudit.responseData"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 清理日志对话框 -->
    <el-dialog
      v-model="cleanDialogVisible"
      title="清理日志"
      width="500px"
    >
      <el-form :model="cleanForm" label-width="120px">
        <el-form-item label="清理策略">
          <el-radio-group v-model="cleanForm.strategy">
            <el-radio label="date">按日期清理</el-radio>
            <el-radio label="count">按数量清理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="cleanForm.strategy === 'date'" label="保留天数">
          <el-input-number
            v-model="cleanForm.days"
            :min="7"
            :max="365"
            :step="1"
          />
          <span class="form-tip">天（保留最近N天的日志）</span>
        </el-form-item>
        <el-form-item v-if="cleanForm.strategy === 'count'" label="保留数量">
          <el-input-number
            v-model="cleanForm.count"
            :min="1000"
            :max="1000000"
            :step="1000"
          />
          <span class="form-tip">条（保留最近N条日志）</span>
        </el-form-item>
        <el-alert
          title="警告：清理操作不可恢复，请谨慎操作！"
          type="warning"
          :closable="false"
          style="margin-top: 20px"
        />
      </el-form>
      <template #footer>
        <el-button @click="cleanDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleConfirmClean">
          确认清理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Delete, Setting } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'

// 审计日志数据类型
interface AuditLog {
  id: number
  operator: string
  operatorAvatar: string
  module: string
  action: string
  description: string
  ip: string
  userAgent: string
  status: 'success' | 'failed'
  duration: number
  requestParams: string
  responseData: string
  createdAt: string
}

// 搜索表单
const searchForm = reactive({
  operator: '',
  module: '',
  action: '',
  status: '',
  dateRange: [] as any[],
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'operator',
    label: '操作人',
    type: 'input',
    placeholder: '请输入操作人',
    width: '150px',
  },
  {
    prop: 'module',
    label: '操作模块',
    type: 'select',
    placeholder: '请选择模块',
    width: '150px',
    options: [
      { label: '用户管理', value: 'user' },
      { label: '角色管理', value: 'role' },
      { label: '权限管理', value: 'permission' },
      { label: '系统配置', value: 'system' },
      { label: '数据备份', value: 'backup' },
    ],
  },
  {
    prop: 'action',
    label: '操作类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: [
      { label: '创建', value: 'create' },
      { label: '更新', value: 'update' },
      { label: '删除', value: 'delete' },
      { label: '查询', value: 'query' },
      { label: '导出', value: 'export' },
    ],
  },
  {
    prop: 'status',
    label: '操作结果',
    type: 'select',
    placeholder: '请选择结果',
    width: '150px',
    options: [
      { label: '成功', value: 'success' },
      { label: '失败', value: 'failed' },
    ],
  },
  {
    prop: 'dateRange',
    label: '操作时间',
    type: 'daterange',
    width: '240px',
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'operator', label: '操作人', width: 150, slot: 'operator' },
  { prop: 'module', label: '操作模块', width: 120, slot: 'module' },
  { prop: 'action', label: '操作类型', width: 100, slot: 'action' },
  { prop: 'description', label: '操作描述', minWidth: 200, showOverflowTooltip: true },
  { prop: 'ip', label: 'IP地址', width: 150 },
  { prop: 'status', label: '操作结果', width: 100, slot: 'status' },
  { prop: 'duration', label: '耗时', width: 100, slot: 'duration' },
  { prop: 'createdAt', label: '操作时间', width: 180 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '导出日志',
    icon: Download,
    onClick: () => handleExport(),
  },
  {
    label: '清理日志',
    type: 'danger',
    icon: Delete,
    onClick: () => handleClean(),
  },
  {
    label: '日志设置',
    icon: Setting,
    onClick: () => handleSettings(),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 审计日志列表
const auditList = ref<AuditLog[]>([
  {
    id: 1,
    operator: '管理员',
    operatorAvatar: '',
    module: 'system',
    action: 'update',
    description: '修改系统配置：会话超时时间从30分钟改为60分钟',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 125,
    requestParams: '{"key":"session_timeout","value":"60"}',
    responseData: '{"code":200,"message":"配置更新成功"}',
    createdAt: '2024-11-30 19:30:00',
  },
  {
    id: 2,
    operator: '区域经理',
    operatorAvatar: '',
    module: 'role',
    action: 'update',
    description: '更新角色权限：门店经理角色添加车辆管理权限',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 89,
    requestParams: '{"roleId":3,"permissions":["vehicle:view","vehicle:edit"]}',
    responseData: '{"code":200,"message":"权限更新成功"}',
    createdAt: '2024-11-30 19:15:00',
  },
  {
    id: 3,
    operator: '门店经理',
    operatorAvatar: '',
    module: 'user',
    action: 'delete',
    description: '删除用户：张三（ID:12345）',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'failed',
    duration: 45,
    requestParams: '{"userId":12345}',
    responseData: '{"code":403,"message":"权限不足"}',
    createdAt: '2024-11-30 19:00:00',
  },
  {
    id: 4,
    operator: '管理员',
    operatorAvatar: '',
    module: 'backup',
    action: 'create',
    description: '创建数据备份：全量备份',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 15000,
    requestParams: '{"type":"full","compress":true}',
    responseData: '{"code":200,"message":"备份创建成功","backupId":123}',
    createdAt: '2024-11-30 18:45:00',
  },
  {
    id: 5,
    operator: '管理员',
    operatorAvatar: '',
    module: 'permission',
    action: 'export',
    description: '导出操作日志：2024-11-01至2024-11-30',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 2500,
    requestParams: '{"startDate":"2024-11-01","endDate":"2024-11-30"}',
    responseData: '{"code":200,"message":"导出成功","fileUrl":"..."}',
    createdAt: '2024-11-30 18:30:00',
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
const currentAudit = ref<AuditLog | null>(null)

// 清理对话框
const cleanDialogVisible = ref(false)
const cleanForm = reactive({
  strategy: 'date',
  days: 90,
  count: 10000,
})

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.operator = ''
  searchForm.module = ''
  searchForm.action = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
}

// 导出日志
const handleExport = () => {
  ElMessage.info('导出日志功能开发中...')
}

// 清理日志
const handleClean = () => {
  cleanDialogVisible.value = true
}

// 确认清理
const handleConfirmClean = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理日志吗？此操作不可恢复！',
      '清理确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // TODO: 调用清理API
    ElMessage.success('日志清理成功')
    cleanDialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('日志清理失败')
    }
  }
}

// 日志设置
const handleSettings = () => {
  ElMessage.info('日志设置功能开发中...')
}

// 查看详情
const handleView = (row: AuditLog) => {
  currentAudit.value = row
  detailDialogVisible.value = true
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

// 获取模块标签
const getModuleLabel = (module?: string) => {
  const labelMap: Record<string, string> = {
    user: '用户管理',
    role: '角色管理',
    permission: '权限管理',
    system: '系统配置',
    backup: '数据备份',
  }
  return labelMap[module || ''] || module
}

// 获取操作类型标签
const getActionType = (action?: string) => {
  const typeMap: Record<string, any> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    query: 'info',
    export: 'primary',
  }
  return typeMap[action || ''] || 'info'
}

// 获取操作类型标签文本
const getActionLabel = (action?: string) => {
  const labelMap: Record<string, string> = {
    create: '创建',
    update: '更新',
    delete: '删除',
    query: '查询',
    export: '导出',
  }
  return labelMap[action || ''] || action
}

// 页面加载
onMounted(() => {
  // TODO: 加载审计日志列表
})
</script>

<style scoped lang="scss">
.system-audit-container {
  padding: 20px;

  .operator-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .operator-name {
      font-size: 14px;
    }
  }

  .form-tip {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
