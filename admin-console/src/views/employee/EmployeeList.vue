<template>
  <div class="employee-list-container">
    <PageHeader title="员工管理" description="管理平台员工信息、角色分配和在职状态" />

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
            <div class="job-number">工号：{{ row.jobNumber }}</div>
          </div>
        </div>
      </template>

      <template #role="{ row }">
        <el-tag :type="getRoleTypeTag(row.role)" size="small">
          {{ row.role }}
        </el-tag>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
          {{ row.status === 'active' ? '在职' : '离职' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="handleAssignRole(row)">
          分配角色
        </el-button>
        <el-button
          link
          :type="row.status === 'active' ? 'danger' : 'success'"
          size="small"
          @click="handleStatusChange(row)"
        >
          {{ row.status === 'active' ? '离职' : '复职' }}
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
      width="700px"
      @submit="handleSubmit"
    />

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
          <strong>员工：</strong>{{ currentEmployee?.realName }} ({{ currentEmployee?.jobNumber }})
        </div>
      </template>
    </FormDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Upload } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { useErrorHandler } from '@/composables'
import { EMPLOYEE_STATUS_OPTIONS } from '@/constants'

const router = useRouter()

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
}

// Mock 数据（实际应该从 API 获取）
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
    options: EMPLOYEE_STATUS_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'employeeInfo', label: '员工信息', width: 200, slot: 'employeeInfo' },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180, showOverflowTooltip: true },
  { prop: 'role', label: '角色', width: 120, slot: 'role' },
  { prop: 'storeName', label: '所属门店', width: 150 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'joinDate', label: '入职日期', width: 120 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增员工',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate,
  },
  {
    label: '导出',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
  {
    label: '导入',
    icon: Upload,
    onClick: () => ElMessage.info('导入功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')
const isEdit = ref(false)
const submitLoading = ref(false)

const formData = reactive({
  id: 0,
  realName: '',
  jobNumber: '',
  phone: '',
  email: '',
  storeId: null as number | null,
  department: '',
  joinDate: '',
  status: 'active' as Employee['status'],
})

// 表单字段配置
const formFields: FormField[] = [
  {
    type: 'row',
    prop: 'row1',
    label: '',
    columns: [
      {
        prop: 'realName',
        label: '真实姓名',
        type: 'input',
        placeholder: '请输入真实姓名',
        span: 12,
      },
      {
        prop: 'jobNumber',
        label: '工号',
        type: 'input',
        placeholder: '请输入工号',
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
        prop: 'storeId',
        label: '所属门店',
        type: 'select',
        placeholder: '请选择门店',
        options: STORE_OPTIONS,
        span: 12,
      },
      {
        prop: 'department',
        label: '部门',
        type: 'input',
        placeholder: '请输入部门',
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    prop: 'row4',
    label: '',
    columns: [
      {
        prop: 'joinDate',
        label: '入职日期',
        type: 'date',
        placeholder: '选择日期',
        span: 12,
      },
      {
        prop: 'status',
        label: '员工状态',
        type: 'radio',
        options: EMPLOYEE_STATUS_OPTIONS,
        span: 12,
      },
    ],
  },
]

const formRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ],
  jobNumber: [
    { required: true, message: '请输入工号', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  storeId: [
    { required: true, message: '请选择所属门店', trigger: 'change' },
  ],
}

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

// 新增员工
function handleCreate() {
  dialogTitle.value = '新增员工'
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    realName: '',
    jobNumber: '',
    phone: '',
    email: '',
    storeId: null,
    department: '',
    joinDate: '',
    status: 'active',
  })
  dialogVisible.value = true
}

// 查看员工
function handleView(row: Employee) {
  router.push(`/employees/detail/${row.id}`)
}

// 编辑员工
function handleEdit(row: Employee) {
  dialogTitle.value = '编辑员工'
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    realName: row.realName,
    jobNumber: row.jobNumber,
    phone: row.phone,
    email: row.email,
    storeId: row.storeId,
    department: row.department,
    joinDate: row.joinDate,
    status: row.status,
  })
  dialogVisible.value = true
}

// 分配角色
function handleAssignRole(row: Employee) {
  currentEmployee.value = row
  roleFormData.roles = []
  roleDialogVisible.value = true
}

// 状态变更
async function handleStatusChange(row: Employee) {
  const action = row.status === 'active' ? '离职' : '复职'
  try {
    await ElMessageBox.confirm(
      `确定要将员工 "${row.realName}" 设置为${action}状态吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, `${action}失败`)
    }
  }
}

// 提交表单
async function handleSubmit() {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      const index = list.value.findIndex(e => e.id === formData.id)
      if (index > -1) {
        list.value[index] = {
          ...list.value[index],
          realName: formData.realName,
          jobNumber: formData.jobNumber,
          phone: formData.phone,
          email: formData.email,
          storeId: formData.storeId!,
          department: formData.department,
          joinDate: formData.joinDate,
          status: formData.status,
        }
      }
      ElMessage.success('更新成功')
    } else {
      const newEmployee: Employee = {
        id: list.value.length + 1,
        realName: formData.realName,
        jobNumber: formData.jobNumber,
        phone: formData.phone,
        email: formData.email,
        role: '门店员工',
        storeId: formData.storeId!,
        storeName: '北京朝阳店',
        department: formData.department,
        status: formData.status,
        avatar: '',
        joinDate: formData.joinDate,
      }
      list.value.push(newEmployee)
      pagination.total++
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
  } catch (error) {
    handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
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
.employee-list-container {
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
}
</style>
