<template>
  <div class="permission-logs-container">
    <!-- 页面标题 -->
    <PageHeader title="操作日志" description="查看和管理系统操作日志记录" />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="logList"
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
            {{ row.operator.charAt(0) }}
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

      <!-- 执行结果列 -->
      <template #status="{ row }">
        <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
          {{ row.status === 'success' ? '成功' : '失败' }}
        </el-tag>
      </template>

      <!-- 操作时间列 -->
      <template #createdAt="{ row }">
        {{ formatDateTime(row.createdAt) }}
      </template>

      <!-- 自定义操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看详情
        </el-button>
      </template>
    </DataTable>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="操作日志详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志ID">
          {{ currentLog?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentLog?.operator }}
        </el-descriptions-item>
        <el-descriptions-item label="操作模块">
          {{ getModuleLabel(currentLog?.module) }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getActionType(currentLog?.action)" size="small">
            {{ getActionLabel(currentLog?.action) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作描述" :span="2">
          {{ currentLog?.description }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ currentLog?.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">
          {{ formatDateTime(currentLog?.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="浏览器" :span="2">
          {{ currentLog?.userAgent }}
        </el-descriptions-item>
        <el-descriptions-item label="执行结果">
          <el-tag :type="currentLog?.status === 'success' ? 'success' : 'danger'">
            {{ currentLog?.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="执行耗时">
          {{ currentLog?.duration }}ms
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <el-input
            v-model="currentLog.requestParams"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-descriptions-item>
        <el-descriptions-item label="响应结果" :span="2">
          <el-input
            v-model="currentLog.responseData"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'

// 日志数据类型
interface OperationLog {
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
      { label: '车辆管理', value: 'vehicle' },
      { label: '订单管理', value: 'order' },
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
  { prop: 'userAgent', label: '浏览器', width: 200, showOverflowTooltip: true },
  { prop: 'status', label: '执行结果', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '操作时间', width: 180, slot: 'createdAt' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '导出日志',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
  {
    label: '清理日志',
    type: 'danger',
    icon: Delete,
    onClick: () => ElMessage.info('清理功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 日志列表
const logList = ref<OperationLog[]>([
  {
    id: 1,
    operator: '管理员',
    operatorAvatar: '',
    module: 'user',
    action: 'create',
    description: '创建用户：张三',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 125,
    requestParams: '{"username":"张三","phone":"13800138000"}',
    responseData: '{"code":200,"message":"创建成功"}',
    createdAt: '2024-11-30T10:30:00.000Z',
  },
  {
    id: 2,
    operator: '区域经理',
    operatorAvatar: '',
    module: 'role',
    action: 'update',
    description: '更新角色权限：门店经理',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success',
    duration: 89,
    requestParams: '{"roleId":3,"permissions":["user:view","order:view"]}',
    responseData: '{"code":200,"message":"更新成功"}',
    createdAt: '2024-11-30T09:15:00.000Z',
  },
  {
    id: 3,
    operator: '门店经理',
    operatorAvatar: '',
    module: 'vehicle',
    action: 'delete',
    description: '删除车辆：京A12345',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'failed',
    duration: 45,
    requestParams: '{"vehicleId":123}',
    responseData: '{"code":403,"message":"权限不足"}',
    createdAt: '2024-11-30T08:00:00.000Z',
  },
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3,
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentLog = ref<OperationLog | null>(null)

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
  searchForm.dateRange = []
  pagination.page = 1
}

// 查看详情
const handleView = (row: OperationLog) => {
  currentLog.value = row
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
    vehicle: '车辆管理',
    order: '订单管理',
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
  }
  return labelMap[action || ''] || action
}

// 格式化日期时间
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 页面加载
onMounted(() => {
  // TODO: 加载操作日志列表
})
</script>

<style scoped lang="scss">
.permission-logs-container {
  padding: 20px;

  .operator-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .operator-name {
      font-size: 14px;
    }
  }
}
</style>
