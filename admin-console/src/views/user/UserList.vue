<template>
  <div class="user-list-container">
    <!-- 页面标题 -->
    <PageHeader title="用户管理" description="管理平台用户信息、权限和状态" />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="userList"
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
      <!-- 头像列 -->
      <template #avatar="{ row }">
        <el-avatar :src="row.avatarUrl" :size="40">
          {{ row.username?.charAt(0) || 'U' }}
        </el-avatar>
      </template>

      <!-- 用户类型列 -->
      <template #userType="{ row }">
        <el-tag :type="getUserTypeTagType(row.userType)" size="small">
          {{ getUserTypeLabel(row.userType) }}
        </el-tag>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 最后登录列 -->
      <template #lastLoginAt="{ row }">
        {{ formatDateTime(row.lastLoginAt) }}
      </template>

      <!-- 创建时间列 -->
      <template #createdAt="{ row }">
        {{ formatDateTime(row.createdAt) }}
      </template>

      <!-- 自定义操作列 -->
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

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="userForm.userType" placeholder="请选择用户类型" style="width: 100%">
            <el-option label="普通用户" value="customer" />
            <el-option label="移动管理员" value="mobile_admin" />
            <el-option label="PC管理员" value="pc_admin" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="inactive">禁用</el-radio>
            <el-radio label="banned">封禁</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Download, ArrowDown } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import { userApi } from '@/api/user'
import type { UserInfo, UserListParams } from '@/api/user'

const router = useRouter()

// 搜索表单
const searchForm = reactive<UserListParams>({
  page: 1,
  pageSize: 10,
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
    options: [
      { label: '普通用户', value: 'customer' },
      { label: '移动管理员', value: 'mobile_admin' },
      { label: 'PC管理员', value: 'pc_admin' },
    ],
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '120px',
    options: [
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'inactive' },
      { label: '封禁', value: 'banned' },
    ],
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
    onClick: () => handleCreate(),
  },
  {
    label: '导出',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 用户列表
const userList = ref<UserInfo[]>([])
const loading = ref(false)
const selectedUsers = ref<UserInfo[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const submitLoading = ref(false)
const userFormRef = ref<FormInstance>()

// 用户表单
const userForm = reactive({
  id: 0,
  username: '',
  realName: '',
  phone: '',
  email: '',
  userType: 'customer' as 'customer' | 'mobile_admin' | 'pc_admin',
  password: '',
  status: 'active' as 'active' | 'inactive' | 'banned',
})

// 表单验证规则
const userFormRules: FormRules = {
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

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
    const response = await userApi.getUserList(params)
    if (response.code === 200) {
      userList.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getUserList()
}

// 重置
const handleReset = () => {
  searchForm.phone = ''
  searchForm.username = ''
  searchForm.userType = ''
  searchForm.status = ''
  pagination.page = 1
  getUserList()
}

// 新增用户
const handleCreate = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  dialogVisible.value = true
}

// 查看用户
const handleView = (row: UserInfo) => {
  router.push(`/users/detail/${row.id}`)
}

// 编辑用户
const handleEdit = (row: UserInfo) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  userForm.id = row.id
  userForm.username = row.username
  userForm.realName = row.realName || ''
  userForm.phone = row.phone
  userForm.email = row.email || ''
  userForm.userType = row.userType
  userForm.status = row.status
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row: UserInfo) => {
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

    const response = await userApi.deleteUser(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      getUserList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 更改用户状态
const handleStatusChange = async (row: UserInfo, status: 'active' | 'inactive' | 'banned') => {
  try {
    const statusText = getStatusLabel(status)
    await ElMessageBox.confirm(
      `确定要将用户 "${row.username}" 的状态改为 "${statusText}" 吗？`,
      '状态变更确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const response = await userApi.changeUserStatus(row.id, status)
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
      getUserList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('状态更新失败')
      console.error(error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value) {
        // 编辑用户
        const response = await userApi.updateUser({
          id: userForm.id,
          username: userForm.username,
          email: userForm.email,
          userType: userForm.userType,
          status: userForm.status,
          realName: userForm.realName,
        })
        if (response.code === 200) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          getUserList()
        }
      } else {
        // 新增用户
        const response = await userApi.createUser({
          username: userForm.username,
          phone: userForm.phone,
          password: userForm.password,
          email: userForm.email,
          userType: userForm.userType,
          realName: userForm.realName,
        })
        if (response.code === 200) {
          ElMessage.success('创建成功')
          dialogVisible.value = false
          getUserList()
        }
      }
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      console.error(error)
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  userFormRef.value?.resetFields()
  userForm.id = 0
  userForm.username = ''
  userForm.realName = ''
  userForm.phone = ''
  userForm.email = ''
  userForm.userType = 'customer'
  userForm.password = ''
  userForm.status = 'active'
}

// 选择变化
const handleSelectionChange = (selection: UserInfo[]) => {
  selectedUsers.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getUserList()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.page = page
  getUserList()
}

// 获取用户类型标签类型
const getUserTypeTagType = (type: string) => {
  const typeMap: Record<string, any> = {
    customer: '',
    mobile_admin: 'success',
    pc_admin: 'warning',
  }
  return typeMap[type] || ''
}

// 获取用户类型标签文本
const getUserTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    customer: '普通用户',
    mobile_admin: '移动管理员',
    pc_admin: 'PC管理员',
  }
  return typeMap[type] || type
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, any> = {
    active: 'success',
    inactive: 'warning',
    banned: 'danger',
  }
  return statusMap[status] || ''
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    banned: '封禁',
  }
  return statusMap[status] || status
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
  })
}

// 页面加载时获取用户列表
onMounted(() => {
  getUserList()
})
</script>

<style scoped lang="scss">
.user-list-container {
  padding: 20px;
}
</style>
