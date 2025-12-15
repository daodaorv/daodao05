<!-- @ts-nocheck -->
<template>
  <div class="employee-roles-container">
    <PageHeader title="员工角色分配" description="为员工分配系统角色，控制其访问权限和数据范围" />

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
      :actions-width="250"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #employeeInfo="{ row }">
        <div class="employee-info">
          <el-avatar :src="row.avatar" :size="40">
            {{ row.realName?.charAt(0) || 'E' }}
          </el-avatar>
          <div class="employee-detail">
            <div class="name">{{ row.realName }}</div>
            <div class="job-number">工号:{{ row.jobNumber }}</div>
          </div>
        </div>
      </template>

      <template #role="{ row }">
        <el-tag :type="(getRoleTypeTag(row.role)) as any" size="small">
          {{ row.role }}
        </el-tag>
      </template>

      <template #loginPlatforms="{ row }">
        <div class="login-platforms">
          <el-tag
            v-if="row.loginPlatforms.includes('pc')"
            type="primary"
            size="small"
            style="margin-right: 4px"
          >
            PC端
          </el-tag>
          <el-tag
            v-if="row.loginPlatforms.includes('mobile')"
            type="success"
            size="small"
          >
            移动端
          </el-tag>
        </div>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
          {{ row.status === 'active' ? '在职' : '离职' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleAssignRole(row)">
          分配角色
        </el-button>
      </template>
    </DataTable>

    <FormDialog
      v-model="roleDialogVisible"
      title="分配角色"
      :fields="roleFormFields"
      :form-data="roleFormData"
      :loading="roleSubmitLoading"
      width="500px"
      @submit="handleRoleSubmit"
    >
      <template #header>
        <div style="margin-bottom: 16px;">
          <strong>员工:</strong>{{ currentEmployee?.realName }} ({{ currentEmployee?.jobNumber }})
        </div>
      </template>
    </FormDialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { useErrorHandler } from '@/composables'
import { VEHICLE_STATUS_OPTIONS } from '@/constants'

// Composables
const { handleApiError } = useErrorHandler()

// 员工数据类型
interface Employee {
  id: number
  realName: string
  jobNumber: string
  phone: string
  email: string
  role: string
  storeId: number
  storeName: string
  department: string
  status: 'active' | 'inactive'
  avatar: string
  joinDate: string
  loginPlatforms: ('pc' | 'mobile')[]
}

// Mock 数据(实际应该从 API 获取)
const list = ref<Employee[]>([
  {
    id: 1,
    realName: '张三',
    jobNumber: 'EMP001',
    phone: '13800138000',
    email: 'zhangsan@daodao.com',
    role: '平台管理员',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '技术部',
    status: 'active',
    avatar: '',
    joinDate: '2024-01-15',
    loginPlatforms: ['pc', 'mobile'],
  },
  {
    id: 2,
    realName: '李四',
    jobNumber: 'EMP002',
    phone: '13800138001',
    email: 'lisi@daodao.com',
    role: '区域经理',
    storeId: 1,
    storeName: '北京朝阳店',
    department: '运营部',
    status: 'active',
    avatar: '',
    joinDate: '2024-02-10',
    loginPlatforms: ['pc', 'mobile'],
  },
  {
    id: 3,
    realName: '王五',
    jobNumber: 'EMP003',
    phone: '13800138002',
    email: 'wangwu@daodao.com',
    role: '门店经理',
    storeId: 2,
    storeName: '上海浦东店',
    department: '门店管理',
    status: 'active',
    avatar: '',
    joinDate: '2024-03-05',
    loginPlatforms: ['mobile'],
  },
])

const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  storeId: null as number | null,
  roleId: null as number | null,
  status: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3,
})

// 门店选项
const STORE_OPTIONS = [
  { label: '北京朝阳店', value: 1 },
  { label: '上海浦东店', value: 2 },
  { label: '深圳南山店', value: 3 },
]

// 角色选项
const ROLE_OPTIONS = [
  { label: '平台管理员', value: 1 },
  { label: '区域经理', value: 2 },
  { label: '门店经理', value: 3 },
  { label: '门店员工', value: 4 },
]

// 登录平台选项
const _LOGIN_PLATFORM_OPTIONS = [
  { label: 'PC管理端', value: 'pc' },
  { label: '移动管理端', value: 'mobile' },
]

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'keyword',
    label: '员工信息',
    type: 'input',
    placeholder: '姓名/手机号/工号',
    width: '200px',
  },
  {
    prop: 'storeId',
    label: '所属门店',
    type: 'select',
    placeholder: '请选择门店',
    width: '150px',
    options: STORE_OPTIONS,
  },
  {
    prop: 'roleId',
    label: '员工角色',
    type: 'select',
    placeholder: '请选择角色',
    width: '150px',
    options: ROLE_OPTIONS,
  },
  {
    prop: 'status',
    label: '员工状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: VEHICLE_STATUS_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'employeeInfo', label: '员工信息', width: 200, slot: 'employeeInfo' },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180, showOverflowTooltip: true },
  { prop: 'role', label: '角色', width: 120, slot: 'role' },
  { prop: 'loginPlatforms', label: '可登录平台', width: 150, slot: 'loginPlatforms' },
  { prop: 'storeName', label: '所属门店', width: 150 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'joinDate', label: '入职日期', width: 120 },
]

// 工具栏按钮配置 - 角色分配页面不需要工具栏按钮
const toolbarButtons = []

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 角色分配对话框
const roleDialogVisible = ref(false)
const currentEmployee = ref<Employee | null>(null)
const roleSubmitLoading = ref(false)

const roleFormData = reactive({
  roles: [] as number[],
})

const roleFormFields: FormField[] = [
  {
    prop: 'roles',
    label: '选择角色',
    type: 'select',
    placeholder: '请选择角色',
    options: ROLE_OPTIONS,
    multiple: true,
  },
]

// 搜索
function handleSearch() {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
function handleReset() {
  searchForm.keyword = ''
  searchForm.storeId = null
  searchForm.roleId = null
  searchForm.status = ''
  pagination.page = 1
}

// 分配角色
function handleAssignRole(row: Employee) {
  currentEmployee.value = row
  roleFormData.roles = []
  roleDialogVisible.value = true
}

// 提交角色分配
async function handleRoleSubmit() {
  if (roleFormData.roles.length === 0) {
    ElMessage.warning('请选择至少一个角色')
    return
  }

  roleSubmitLoading.value = true
  try {
    ElMessage.success('角色分配成功')
    roleDialogVisible.value = false
  } catch (error) {
    handleApiError(error, '角色分配失败')
  } finally {
    roleSubmitLoading.value = false
  }
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
}

function handleCurrentChange(page: number) {
  pagination.page = page
}

// 获取角色类型标签
function getRoleTypeTag(role: string) {
  const typeMap: Record<string, string> = {
    '平台管理员': 'danger',
    '区域经理': 'warning',
    '门店经理': 'success',
    '门店员工': 'info',
  }
  return typeMap[role] || 'info'
}
</script>

<style scoped lang="scss">
.employee-roles-container {
  padding: 20px;

  .employee-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .employee-detail {
      .name {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .job-number {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .login-platforms {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
