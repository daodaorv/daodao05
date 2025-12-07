<!-- @ts-nocheck -->
<template>
  <div class="user-list-container">
    <PageHeader title="用户列表" description="管理小程序注册用户信息和状态" />

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
      :actions-width="280"
      :show-selection="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template #avatar="{ row }">
        <el-avatar :src="row.avatarUrl" :size="40">
          {{ row.username?.charAt(0) || 'U' }}
        </el-avatar>
      </template>

      <template #tags="{ row }">
        <div class="user-tags">
          <el-tag
            v-for="tag in row.tags"
            :key="tag.id"
            :type="tag.color"
            size="small"
            style="margin-right: 4px"
          >
            {{ tag.name }}
          </el-tag>
          <el-button
            v-if="!row.tags || row.tags.length === 0"
            link
            type="primary"
            size="small"
            @click="handleManageTags(row)"
          >
            添加标签
          </el-button>
          <el-button
            v-else
            link
            type="primary"
            size="small"
            @click="handleManageTags(row)"
          >
            管理
          </el-button>
        </div>
      </template>

      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getUserStatusLabel(row.status) }}
        </el-tag>
      </template>

      <template #lastLoginAt="{ row }">
        {{ formatDateTime(row.lastLoginAt) }}
      </template>

      <template #createdAt="{ row }">
        {{ formatDateTime(row.createdAt) }}
      </template>

    </DataTable>

    <!-- 用户表单对话框 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      @submit="handleSubmit"
    />

    <!-- 标签管理对话框 -->
    <el-dialog
      v-model="tagManageDialogVisible"
      title="管理用户标签"
      width="500px"
    >
      <div v-if="currentUser">
        <h4>当前标签</h4>
        <div class="current-tags">
          <el-tag
            v-for="tag in currentUser.tags"
            :key="tag.id"
            :type="tag.color"
            closable
            @close="handleRemoveTag(currentUser, tag.id)"
            style="margin-right: 8px; margin-bottom: 8px"
          >
            {{ tag.name }}
          </el-tag>
          <span v-if="!currentUser.tags || currentUser.tags.length === 0">
            暂无标签
          </span>
        </div>

        <el-divider />

        <h4>添加标签</h4>
        <el-select
          v-model="selectedTagIds"
          multiple
          placeholder="请选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in availableTags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
            :disabled="currentUser.tags?.some(t => t.id === tag.id)"
          />
        </el-select>
      </div>

      <template #footer>
        <el-button @click="tagManageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTags">
          添加标签
        </el-button>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入用户"
      width="600px"
    >
      <div class="import-container">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        >
          <ul>
            <li>支持 CSV、Excel 格式文件</li>
            <li>文件大小不超过 10MB</li>
            <li>单次最多导入 1000 条数据</li>
            <li>必填字段:用户名、手机号</li>
            <li>可选字段:真实姓名、邮箱、备注</li>
          </ul>
        </el-alert>

        <el-button
          type="primary"
          link
          @click="handleDownloadTemplate"
          style="margin-bottom: 16px"
        >
          <el-icon><Download /></el-icon>
          下载导入模板
        </el-button>

        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".csv,.xlsx,.xls"
          drag
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处,或<em>点击上传</em>
          </div>
        </el-upload>

        <!-- 导入结果 -->
        <div v-if="importResult" class="import-result">
          <el-divider />
          <h4>导入结果</h4>
          <p>成功: {{ importResult.success }} 条</p>
          <p>失败: {{ importResult.failed }} 条</p>

          <el-table
            v-if="importResult.errors.length > 0"
            :data="importResult.errors"
            style="margin-top: 16px"
            max-height="200"
          >
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="message" label="错误信息" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="importLoading"
          @click="handleImportSubmit"
        >
          开始导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Upload, ArrowDown, UploadFilled } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { userApi, tagApi } from '@/api/user'
import type { UserInfo, Tag } from '@/api/user'
import { useListPage, useDateFormat, useErrorHandler, useEnumLabel } from '@/composables'
import { USER_STATUS_OPTIONS } from '@/constants'
import { mockGetTagList } from '@/mock/tags'
import { exportToCSV } from '@/utils/export'

const router = useRouter()

// Composables
const { formatDateTime } = useDateFormat()
const { handleApiError } = useErrorHandler()
const { getUserStatusLabel } = useEnumLabel()

// 标签列表
const tagList = ref<Tag[]>([])

// 使用 useListPage 统一管理列表逻辑
const {
  searchForm,
  list,
  loading,
  pagination,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  refresh
} = useListPage<UserInfo>(userApi.getUserList, {
  phone: '',
  username: '',
  tagId: undefined,
  status: '',
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'phone',
    label: '手机号',
    type: 'input',
    placeholder: '请输入手机号',
    width: '200px',
  },
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    width: '200px',
  },
  {
    prop: 'tagId',
    label: '用户标签',
    type: 'select',
    placeholder: '请选择标签',
    width: '150px',
    options: tagList.value.map(tag => ({
      label: tag.name,
      value: tag.id
    })),
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '120px',
    options: USER_STATUS_OPTIONS,
  },
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'avatar', label: '头像', width: 80, slot: 'avatar' },
  { prop: 'username', label: '用户名', width: 120 },
  { prop: 'realName', label: '真实姓名', width: 120 },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180, showOverflowTooltip: true },
  { prop: 'tags', label: '用户标签', width: 200, slot: 'tags' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'lastLoginAt', label: '最后登录', width: 160, slot: 'lastLoginAt' },
  { prop: 'createdAt', label: '注册时间', width: 160, slot: 'createdAt' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增用户',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate,
  },
  {
    label: '导入用户',
    type: 'success',
    icon: Upload,
    onClick: handleImport,
  },
  {
    label: '导出',
    icon: Download,
    onClick: handleExport,
  },
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: UserInfo) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: UserInfo) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: UserInfo) => handleDelete(row)
  }
]

// 选中的用户
const selectedUsers = ref<UserInfo[]>([])

// 用户表单对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const submitLoading = ref(false)

const formData = reactive({
  id: 0,
  username: '',
  realName: '',
  phone: '',
  email: '',
  password: '',
  status: 'active' as 'active' | 'inactive' | 'banned',
})

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'row',
    prop: 'row1',
    label: '',
    columns: [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        placeholder: '请输入用户名',
        span: 12,
      },
      {
        prop: 'realName',
        label: '真实姓名',
        type: 'input',
        placeholder: '请输入真实姓名',
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row2',
    label: '',
    columns: [
      {
        prop: 'phone',
        label: '手机号',
        type: 'input',
        placeholder: '请输入手机号',
        span: 12,
        disabled: isEdit.value,
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        placeholder: '请输入邮箱',
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row3',
    label: '',
    columns: [
      ...(isEdit.value ? [{
        prop: 'status',
        label: '状态',
        type: 'radio',
        options: USER_STATUS_OPTIONS,
        span: 12,
      }] : [{
        prop: 'password',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        span: 12,
      }]),
    ],
  },
]) as any

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

// 标签管理对话框
const tagManageDialogVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)
const availableTags = ref<Tag[]>([])
const selectedTagIds = ref<number[]>([])

// 用户导入对话框
const importDialogVisible = ref(false)
const importFile = ref<File | null>(null)
const importLoading = ref(false)
const importResult = ref<{
  success: number
  failed: number
  errors: Array<{ row: number; message: string }>
} | null>(null)
const uploadRef = ref()

// 加载标签列表
async function loadTags() {
  try {
    tagList.value = await mockGetTagList()
  } catch (error) {
    console.error('加载标签列表失败:', error)
  }
}

// 新增用户
function handleCreate() {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    username: '',
    realName: '',
    phone: '',
    email: '',
    password: '',
    status: 'active',
  })
  dialogVisible.value = true
}

// 查看用户
function handleView(row: UserInfo) {
  router.push(`/users/detail/${row.id}`)
}

// 编辑用户
function handleEdit(row: UserInfo) {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    realName: row.realName || '',
    phone: row.phone,
    email: row.email || '',
    password: '',
    status: row.status,
  })
  dialogVisible.value = true
}

// 删除用户
async function handleDelete(row: UserInfo) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗?此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await userApi.deleteUser(row.id)
    ElMessage.success('删除成功')
    refresh()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 更改用户状态
async function handleStatusChange(row: UserInfo, status: 'active' | 'inactive' | 'banned') {
  try {
    const statusText = getUserStatusLabel(status)
    await ElMessageBox.confirm(
      `确定要将用户 "${row.username}" 的状态改为 "${statusText}" 吗?`,
      '状态变更确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await userApi.changeUserStatus(row.id, status)
    ElMessage.success('状态更新成功')
    refresh()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '状态更新失败')
    }
  }
}

// 提交表单
async function handleSubmit() {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      await userApi.updateUser({
        id: formData.id,
        username: formData.username,
        email: formData.email,
        userType: 'customer',
        status: formData.status,
        realName: formData.realName,
      })
      ElMessage.success('更新成功')
    } else {
      await userApi.createUser({
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
        email: formData.email,
        userType: 'customer',
        realName: formData.realName,
      })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    refresh()
  } catch (error) {
    handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 选择变化
function handleSelectionChange(selection: UserInfo[]) {
  selectedUsers.value = selection
}

// 打开标签管理对话框
async function handleManageTags(user: UserInfo) {
  currentUser.value = user
  selectedTagIds.value = []

  // 加载所有标签
  try {
    availableTags.value = await mockGetTagList()
  } catch (error) {
    console.error('加载标签列表失败:', error)
    ElMessage.error('加载标签列表失败')
    return
  }

  tagManageDialogVisible.value = true
}

// 添加标签
async function handleAddTags() {
  if (!currentUser.value || selectedTagIds.value.length === 0) {
    ElMessage.warning('请选择要添加的标签')
    return
  }

  try {
    await tagApi.addUserTags(currentUser.value.id, selectedTagIds.value)
    ElMessage.success('添加成功')
    refresh()
    tagManageDialogVisible.value = false
  } catch (error) {
    console.error('添加标签失败:', error)
    ElMessage.error('添加标签失败')
  }
}

// 移除标签
async function handleRemoveTag(user: UserInfo, tagId: number) {
  try {
    await ElMessageBox.confirm('确定要移除该标签吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await tagApi.removeUserTag(user.id, tagId)
    ElMessage.success('移除成功')
    refresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除标签失败:', error)
      ElMessage.error('移除标签失败')
    }
  }
}

// 打开导入对话框
function handleImport() {
  importFile.value = null
  importResult.value = null
  importDialogVisible.value = true
}

// 文件选择
function handleFileChange(file: any) {
  importFile.value = file.raw
  return false // 阻止自动上传
}

// 执行导入
async function handleImportSubmit() {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importLoading.value = true
  try {
    const result = await userApi.importUsers(importFile.value)
    importResult.value = result
    ElMessage.success(`导入成功 ${result.success} 条,失败 ${result.failed} 条`)

    if (result.success > 0) {
      refresh() // 刷新列表
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importLoading.value = false
  }
}

// 下载导入模板
function handleDownloadTemplate() {
  // 创建 CSV 模板
  const template = [
    ['用户名', '真实姓名', '手机号', '邮箱', '备注'],
    ['zhangsan', '张三', '13800138001', 'zhangsan@example.com', '示例用户1'],
    ['lisi', '李四', '13800138002', 'lisi@example.com', '示例用户2']
  ]

  const csvContent = template.map(row => row.join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '用户导入模板.csv'
  link.click()
}

// 导出用户列表
function handleExport() {
  if (list.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 定义导出列
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: '用户名' },
    { key: 'realName', label: '真实姓名' },
    { key: 'phone', label: '手机号' },
    { key: 'email', label: '邮箱' },
    { key: 'tags', label: '用户标签' },
    { key: 'status', label: '状态' },
    { key: 'lastLoginAt', label: '最后登录时间' },
    { key: 'createdAt', label: '注册时间' }
  ]

  // 处理数据
  const exportData = list.value.map(user => ({
    ...user,
    tags: user.tags?.map(tag => tag.name).join('、') || '',
    status: getUserStatusLabel(user.status),
    lastLoginAt: formatDateTime(user.lastLoginAt),
    createdAt: formatDateTime(user.createdAt)
  }))

  // 导出
  exportToCSV(exportData, columns, '用户列表')
}

// 获取状态标签
function getStatusTag(status: string) {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    banned: 'danger',
  }
  return tagMap[status] || ''
}

// 组件挂载时加载标签
onMounted(() => {
  loadTags()
})
</script>

<style scoped lang="scss">
.user-list-container {
  padding: 20px;
}

.user-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.current-tags {
  min-height: 40px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.import-container {
  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin: 4px 0;
    }
  }
}

.import-result {
  h4 {
    margin: 16px 0 8px;
  }

  p {
    margin: 4px 0;
  }
}
</style>
