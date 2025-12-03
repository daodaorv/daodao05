<template>
  <div class="user-list-container">
    <PageHeader title="用户管理" description="管理平台用户信息、权限和状态" />

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

      <template #userType="{ row }">
        <el-tag :type="getUserTypeTag(row.userType)" size="small">
          {{ getUserTypeLabel(row.userType) }}
        </el-tag>
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

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-dropdown @command="(cmd) => handleStatusChange(row, cmd)">
          <el-button link type="primary" size="small">
            状态<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="active" :disabled="row.status === 'active'">
                启用
              </el-dropdown-item>
              <el-dropdown-item command="inactive" :disabled="row.status === 'inactive'">
                禁用
              </el-dropdown-item>
              <el-dropdown-item command="banned" :disabled="row.status === 'banned'">
                封禁
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </DataTable>

    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, ArrowDown } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { userApi } from '@/api/user'
import type { UserInfo } from '@/api/user'
import { useListPage, useDateFormat, useErrorHandler, useEnumLabel } from '@/composables'
import { USER_TYPE_OPTIONS, USER_STATUS_OPTIONS } from '@/constants'

const router = useRouter()

// Composables
const { formatDateTime } = useDateFormat()
const { handleApiError } = useErrorHandler()
const { getUserTypeLabel, getUserStatusLabel } = useEnumLabel()

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
  userType: '',
  status: '',
})

// 搜索字段配置
const searchFields: SearchField[] = [
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
    prop: 'userType',
    label: '用户类型',
    type: 'select',
    placeholder: '请选择用户类型',
    width: '150px',
    options: USER_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '120px',
    options: USER_STATUS_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'avatar', label: '头像', width: 80, slot: 'avatar' },
  { prop: 'username', label: '用户名', width: 120 },
  { prop: 'realName', label: '真实姓名', width: 120 },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180, showOverflowTooltip: true },
  { prop: 'userType', label: '用户类型', width: 120, slot: 'userType' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'lastLoginAt', label: '最后登录', width: 180, slot: 'lastLoginAt' },
  { prop: 'createdAt', label: '创建时间', width: 180, slot: 'createdAt' },
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
    label: '导出',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 选中的用户
const selectedUsers = ref<UserInfo[]>([])

// 对话框
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
  userType: 'customer' as 'customer' | 'mobile_admin' | 'pc_admin',
  password: '',
  status: 'active' as 'active' | 'inactive' | 'banned',
})

// 表单字段配置
const formFields = computed<FormField[]>(() => [
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
      {
        prop: 'userType',
        label: '用户类型',
        type: 'select',
        placeholder: '请选择用户类型',
        options: USER_TYPE_OPTIONS,
        span: 12,
      },
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
])

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
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
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
    userType: 'customer',
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
    userType: row.userType,
    password: '',
    status: row.status,
  })
  dialogVisible.value = true
}

// 删除用户
async function handleDelete(row: UserInfo) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？此操作不可恢复。`,
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
      `确定要将用户 "${row.username}" 的状态改为 "${statusText}" 吗？`,
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
        userType: formData.userType,
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
        userType: formData.userType,
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

// 获取用户类型标签
function getUserTypeTag(type: string) {
  const tagMap: Record<string, string> = {
    customer: '',
    mobile_admin: 'success',
    pc_admin: 'warning',
  }
  return tagMap[type] || ''
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
</script>

<style scoped lang="scss">
.user-list-container {
  padding: 20px;
}
</style>
