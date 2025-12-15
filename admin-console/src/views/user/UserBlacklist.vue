<template>
  <div class="user-blacklist-container">
    <PageHeader title="黑名单管理" description="管理平台黑名单用户，防范风险行为" />

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
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
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

      <template #reason="{ row }">
        <el-tag type="danger">
          {{ getBlacklistReasonLabel(row.reason) }}
        </el-tag>
      </template>

      <template #addedAt="{ row }">
        {{ formatDateTime(row.addedAt) }}
      </template>

      <template #status="{ row }">
        <el-tag :type="row.isActive ? 'danger' : 'info'">
          {{ row.isActive ? '生效中' : '已解除' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看详情
        </el-button>
        <el-button
          v-if="row.isActive"
          link
          type="success"
          size="small"
          @click="handleRemove(row)"
        >
          解除
        </el-button>
        <el-button
          v-else
          link
          type="danger"
          size="small"
          @click="handleReactivate(row)"
        >
          重新加入
        </el-button>
      </template>
    </DataTable>

    <FormDialog
      v-model="dialogVisible"
      title="添加黑名单"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      @submit="handleSubmit"
    />

    <el-dialog
      v-model="detailDialogVisible"
      title="黑名单详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentBlacklist">
        <el-descriptions-item label="用户ID">
          {{ currentBlacklist.id }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ currentBlacklist.username }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentBlacklist.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="加入原因">
          <el-tag type="danger">
            {{ getBlacklistReasonLabel(currentBlacklist.reason) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详细说明">
          {{ currentBlacklist.description }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentBlacklist.addedBy }}
        </el-descriptions-item>
        <el-descriptions-item label="加入时间">
          {{ formatDateTime(currentBlacklist.addedAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag :type="currentBlacklist.isActive ? 'danger' : 'info'">
            {{ currentBlacklist.isActive ? '生效中' : '已解除' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="!currentBlacklist.isActive" label="解除时间">
          {{ formatDateTime(currentBlacklist.removedAt) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="!currentBlacklist.isActive" label="解除原因">
          {{ currentBlacklist.removeReason }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { useDateFormat, useErrorHandler, useEnumLabel } from '@/composables'
import { BLACKLIST_REASON_OPTIONS } from '@/constants'
import { exportToCSV } from '@/utils/export'

// Composables
const { formatDateTime } = useDateFormat()
const { handleApiError } = useErrorHandler()
const { getBlacklistReasonLabel } = useEnumLabel()

// 黑名单数据类型
interface BlacklistUser {
  id: number
  username: string
  phone: string
  avatarUrl: string
  reason: 'fraud' | 'complaint' | 'violation' | 'other'
  description: string
  addedBy: string
  addedAt: string
  isActive: boolean
  removedAt?: string
  removeReason?: string
}

// 用户数据类型
interface UserInfo {
  id: number
  username: string
  phone: string
}

// Mock 数据（实际应该从 API 获取）
const list = ref<BlacklistUser[]>([
  {
    id: 1,
    username: '周八',
    phone: '13800138005',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reason: 'fraud',
    description: '多次使用虚假信息进行欺诈，造成平台损失',
    addedBy: '管理员',
    addedAt: '2024-11-25T10:00:00.000Z',
    isActive: true,
  },
  {
    id: 2,
    username: '钱十一',
    phone: '13900139004',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reason: 'complaint',
    description: '恶意投诉商家，影响平台正常运营',
    addedBy: '管理员',
    addedAt: '2024-11-20T14:00:00.000Z',
    isActive: true,
  },
  {
    id: 3,
    username: '孙十二',
    phone: '13900139005',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reason: 'violation',
    description: '违反平台规则，多次恶意刷单',
    addedBy: '管理员',
    addedAt: '2024-11-15T09:00:00.000Z',
    isActive: false,
    removedAt: '2024-11-28T10:00:00.000Z',
    removeReason: '用户申诉成功，经核实为误判',
  },
])

const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  reason: '',
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
    prop: 'reason',
    label: '加入原因',
    type: 'select',
    placeholder: '请选择原因',
    width: '150px',
    options: BLACKLIST_REASON_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'userInfo', label: '用户信息', width: 200, slot: 'userInfo' },
  { prop: 'reason', label: '加入原因', width: 120, slot: 'reason' },
  { prop: 'description', label: '详细说明', minWidth: 200, showOverflowTooltip: true },
  { prop: 'addedBy', label: '操作人', width: 120 },
  { prop: 'addedAt', label: '加入时间', width: 180, slot: 'addedAt' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '添加黑名单',
    type: 'primary',
    icon: Plus,
    onClick: handleAdd,
  },
  {
    label: '导出',
    icon: Download,
    onClick: handleExport,
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 用户列表（用于添加黑名单）
const userList = ref<UserInfo[]>([
  { id: 1, username: '张三', phone: '13800138000' },
  { id: 2, username: '李四', phone: '13800138001' },
  { id: 3, username: '王五', phone: '13800138002' },
])

// 对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)

const formData = reactive({
  userId: null as number | null,
  reason: '',
  description: '',
})

// 表单字段配置
const formFields: FormField[] = [
  {
    prop: 'userId',
    label: '选择用户',
    type: 'select',
    placeholder: '请输入手机号或用户名搜索',
    options: userList.value.map(u => ({
      label: `${u.username} (${u.phone})`,
      value: u.id
    })),
    filterable: true,
  },
  {
    prop: 'reason',
    label: '加入原因',
    type: 'select',
    placeholder: '请选择原因',
    options: BLACKLIST_REASON_OPTIONS,
  },
  {
    prop: 'description',
    label: '详细说明',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入详细说明',
  },
]

const formRules = {
  userId: [
    { required: true, message: '请选择用户', trigger: 'change' },
  ],
  reason: [
    { required: true, message: '请选择加入原因', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入详细说明', trigger: 'blur' },
    { min: 10, message: '详细说明至少10个字符', trigger: 'blur' },
  ],
}

// 详情对话框
const detailDialogVisible = ref(false)
const currentBlacklist = ref<BlacklistUser | null>(null)

// 搜索
function handleSearch() {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
function handleReset() {
  searchForm.keyword = ''
  searchForm.reason = ''
  pagination.page = 1
}

// 添加黑名单
function handleAdd() {
  Object.assign(formData, {
    userId: null,
    reason: '',
    description: '',
  })
  dialogVisible.value = true
}

// 提交添加
async function handleSubmit() {
  submitLoading.value = true
  try {
    const user = userList.value.find(u => u.id === formData.userId)
    if (user) {
      const newBlacklist: BlacklistUser = {
        id: list.value.length + 1,
        username: user.username,
        phone: user.phone,
        avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        reason: formData.reason as any,
        description: formData.description,
        addedBy: '当前管理员',
        addedAt: new Date().toISOString(),
        isActive: true,
      }
      list.value.unshift(newBlacklist)
      pagination.total++
    }
    ElMessage.success('添加成功')
    dialogVisible.value = false
  } catch (error) {
    handleApiError(error, '添加失败')
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
function handleView(row: BlacklistUser) {
  currentBlacklist.value = row
  detailDialogVisible.value = true
}

// 解除黑名单
async function handleRemove(row: BlacklistUser) {
  try {
    const { value } = await ElMessageBox.prompt(
      `确定要解除用户 "${row.username}" 的黑名单吗？请输入解除原因：`,
      '解除黑名单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{5,}/,
        inputErrorMessage: '解除原因至少5个字符',
      }
    )

    row.isActive = false
    row.removedAt = new Date().toISOString()
    row.removeReason = value
    ElMessage.success('解除成功')
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '解除失败')
    }
  }
}

// 重新加入黑名单
async function handleReactivate(row: BlacklistUser) {
  try {
    await ElMessageBox.confirm(
      `确定要重新将用户 "${row.username}" 加入黑名单吗？`,
      '重新加入确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    row.isActive = true
    row.removedAt = undefined
    row.removeReason = undefined
    ElMessage.success('重新加入成功')
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

// 导出数据
function handleExport() {
  if (list.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(list.value, columns, '黑名单')
}
</script>

<style scoped lang="scss">
.user-blacklist-container {
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
}
</style>
