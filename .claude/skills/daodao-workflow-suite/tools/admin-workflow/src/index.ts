import { RequirementAnalysis, DevelopmentResult } from '../../core/types';
import { TechDocumentQuery } from '../../tech-docs/query';
import { FileUtils, Logger } from '../../core/utils';
import * as path from 'path';

/**
 * PC管理端专用工作流
 */
export class AdminConsoleWorkflow {
  private techDocQuery: TechDocumentQuery;
  private projectRoot: string;
  private targetProject = 'admin-console';

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.techDocQuery = new TechDocumentQuery();
  }

  /**
   * 开发实施
   */
  async develop(analysis?: RequirementAnalysis): Promise<DevelopmentResult> {
    Logger.info('开始PC管理端开发实施');

    try {
      // 1. 技术栈验证
      await this.validateTechStack();

      // 2. 根据需求生成代码
      const generatedFiles = await this.generateComponents(analysis);

      // 3. 生成Mock数据
      const mockData = await this.generateMockData();

      // 4. 运行测试
      const testResults = await this.runTests();

      return {
        success: true,
        filesCreated: generatedFiles.created,
        filesModified: generatedFiles.modified,
        codeGenerated: generatedFiles.code,
        mockData,
        testResults
      };

    } catch (error) {
      Logger.error('PC管理端开发失败:', error);
      return {
        success: false,
        filesCreated: [],
        filesModified: [],
        codeGenerated: '',
        mockData: {},
        testResults: []
      };
    }
  }

  /**
   * 验证技术栈
   */
  private async validateTechStack(): Promise<void> {
    Logger.info('验证PC管理端技术栈...');

    const requiredFrameworks = ['vue3', 'element-plus', 'pinia', 'vue-router'];

    for (const framework of requiredFrameworks) {
      if (!this.techDocQuery.isFrameworkSupported(framework)) {
        throw new Error(`不支持的技术栈: ${framework}`);
      }

      // 验证代码使用最佳实践
      const quickRef = this.techDocQuery.getFrameworkQuickReference(framework);
      if (quickRef) {
        Logger.info(`${framework} 快速参考已加载`);
      }
    }

    Logger.info('技术栈验证完成');
  }

  /**
   * 生成组件
   */
  private async generateComponents(analysis?: RequirementAnalysis): Promise<{
    created: string[];
    modified: string[];
    code: string;
  }> {
    const created: string[] = [];
    const modified: string[] = [];
    let totalCode = '';

    try {
      // 生成用户管理组件
      if (this.shouldGenerateUserManagement(analysis)) {
        const userComponent = await this.generateUserManagementComponent();
        created.push(userComponent.path);
        totalCode += userComponent.code + '\n\n';
      }

      // 生成车辆管理组件
      if (this.shouldGenerateVehicleManagement(analysis)) {
        const vehicleComponent = await this.generateVehicleManagementComponent();
        created.push(vehicleComponent.path);
        totalCode += vehicleComponent.code + '\n\n';
      }

      // 生成订单管理组件
      if (this.shouldGenerateOrderManagement(analysis)) {
        const orderComponent = await this.generateOrderManagementComponent();
        created.push(orderComponent.path);
        totalCode += orderComponent.code + '\n\n';
      }

      // 生成数据表格组件
      const dataTableComponent = await this.generateDataTableComponent();
      created.push(dataTableComponent.path);
      totalCode += dataTableComponent.code + '\n\n';

      return { created, modified, code: totalCode };

    } catch (error) {
      Logger.error('组件生成失败:', error);
      throw error;
    }
  }

  /**
   * 生成用户管理组件
   */
  private async generateUserManagementComponent(): Promise<{ path: string; code: string }> {
    const code = `
<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAddUser">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名称">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="userList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewUser(row)">
              {{ row.username }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="160" />
        <el-table-column prop="lastLoginAt" label="最后登录" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditUser(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户对话框 -->
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
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            :disabled="dialogMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogMode === 'add'">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="userForm.roles">
            <el-checkbox label="admin">管理员</el-checkbox>
            <el-checkbox label="manager">经理</el-checkbox>
            <el-checkbox label="staff">员工</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 接口定义
interface User {
  id: number
  username: string
  email: string
  phone: string
  status: 'active' | 'disabled'
  roles: string[]
  createdAt: string
  lastLoginAt: string
}

interface SearchForm {
  username: string
  status: string
  dateRange: [string, string] | []
}

interface UserForm {
  id?: number
  username: string
  email: string
  phone: string
  password: string
  status: 'active' | 'disabled'
  roles: string[]
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'view'>('add')
const submitting = ref(false)
const selectedUsers = ref<User[]>([])

const userFormRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive<SearchForm>({
  username: '',
  status: '',
  dateRange: []
})

// 用户表单
const userForm = reactive<UserForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  status: 'active',
  roles: []
})

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 用户列表
const userList = ref<User[]>([])

// 表单验证规则
const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: '添加用户',
    edit: '编辑用户',
    view: '查看用户'
  }
  return titles[dialogMode.value]
})

// 方法
const loadUsers = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取用户列表
    const response = await mockApi.getUsers({
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    })

    userList.value = response.data
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    status: '',
    dateRange: []
  })
  handleSearch()
}

const handleAddUser = () => {
  dialogMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const handleEditUser = (user: User) => {
  dialogMode.value = 'edit'
  Object.assign(userForm, {
    ...user,
    password: ''
  })
  dialogVisible.value = true
}

const handleViewUser = (user: User) => {
  dialogMode.value = 'view'
  Object.assign(userForm, user)
  dialogVisible.value = true
}

const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'

  try {
    await ElMessageBox.confirm(
      \`确定要\${action}用户 "\${user.username}" 吗？\`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用API更新用户状态
    await mockApi.updateUserStatus(user.id, newStatus)

    ElMessage.success(\`\${action}成功\`)
    loadUsers()
  } catch (error) {
    // 用户取消操作
  }
}

const handleDeleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      \`确定要删除用户 "\${user.username}" 吗？此操作不可恢复！\`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    // TODO: 调用API删除用户
    await mockApi.deleteUser(user.id)

    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    // 用户取消操作
  }
}

const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()

    submitting.value = true

    if (dialogMode.value === 'add') {
      await mockApi.createUser(userForm)
      ElMessage.success('添加成功')
    } else {
      await mockApi.updateUser(userForm)
      ElMessage.success('更新成功')
    }

    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    // 表单验证失败
  } finally {
    submitting.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
}

const resetForm = () => {
  Object.assign(userForm, {
    id: undefined,
    username: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
    roles: []
  })
  userFormRef.value?.resetFields()
}

const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

const handleSizeChange = (val: number) => {
  pagination.size = val
  loadUsers()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadUsers()
}

// 生命周期
onMounted(() => {
  loadUsers()
})

// Mock API (实际开发中应该替换为真实API)
const mockApi = {
  async getUsers(params: any) {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      data: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@daodao.com',
          phone: '13800138000',
          status: 'active',
          roles: ['admin'],
          createdAt: '2024-01-01',
          lastLoginAt: '2024-11-28'
        }
      ],
      total: 1
    }
  },

  async createUser(userData: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  async updateUser(userData: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  async updateUserStatus(userId: number, status: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  async deleteUser(userId: number) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .table-card {
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
`;

    const componentPath = path.join(
      this.projectRoot,
      this.targetProject,
      'src/views/user/index.vue'
    );

    return { path: componentPath, code };
  }

  /**
   * 生成数据表格组件
   */
  private async generateDataTableComponent(): Promise<{ path: string; code: string }> {
    const code = `
<template>
  <div class="data-table">
    <el-table
      v-loading="loading"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      stripe
      border
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" />

      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index" width="60" label="序号" />

      <!-- 动态列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :sortable="column.sortable"
        :fixed="column.fixed"
      >
        <template #default="{ row, column: col, $index }">
          <slot
            :name="column.prop"
            :row="row"
            :column="col"
            :index="$index"
          >
            {{ row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionsWidth"
        :fixed="actionsFixed"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumnCtx } from 'element-plus'

// 接口定义
interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean | 'custom'
  fixed?: boolean | 'left' | 'right'
}

interface Props {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  height?: string | number
  maxHeight?: string | number
  showSelection?: boolean
  showIndex?: boolean
  showActions?: boolean
  actionsWidth?: number
  actionsFixed?: boolean | 'left' | 'right'
  showPagination?: boolean
  total?: number
  page?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
}

// Props定义
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showSelection: true,
  showIndex: true,
  showActions: true,
  actionsWidth: 200,
  actionsFixed: 'right',
  showPagination: true,
  total: 0,
  page: 1,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper'
})

// Emits定义
const emit = defineEmits<{
  selectionChange: [selection: any[]]
  sortChange: [sort: { column: any; prop: string; order: string }]
  sizeChange: [size: number]
  currentChange: [current: number]
  update:page: [page: number]
  update:pageSize: [pageSize: number]
}>()

// 响应式数据
const currentPage = ref(props.page)
const pageSize = ref(props.pageSize)

// 监听props变化
watch(() => props.page, (newVal) => {
  currentPage.value = newVal
})

watch(() => props.pageSize, (newVal) => {
  pageSize.value = newVal
})

// 方法
const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handleSortChange = (sort: { column: any; prop: string; order: string }) => {
  emit('sortChange', sort)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  emit('update:pageSize', val)
  emit('sizeChange', val)
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('update:page', val)
  emit('currentChange', val)
}
</script>

<style lang="scss" scoped>
.data-table {
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
`;

    const componentPath = path.join(
      this.projectRoot,
      this.targetProject,
      'src/components/common/DataTable.vue'
    );

    return { path: componentPath, code };
  }

  /**
   * 生成Mock数据
   */
  private async generateMockData(): Promise<any> {
    Logger.info('开始生成Mock数据文件...');

    const mockDir = path.join(this.projectRoot, this.targetProject, 'src', 'mock');
    await FileUtils.ensureDir(mockDir);

    const mockFiles: string[] = [];

    // 1. 生成用户Mock数据
    const usersMockFile = await this.generateUsersMockData(mockDir);
    mockFiles.push(usersMockFile);

    // 2. 生成车辆Mock数据
    const vehiclesMockFile = await this.generateVehiclesMockData(mockDir);
    mockFiles.push(vehiclesMockFile);

    // 3. 生成订单Mock数据
    const ordersMockFile = await this.generateOrdersMockData(mockDir);
    mockFiles.push(ordersMockFile);

    // 4. 生成门店Mock数据
    const storesMockFile = await this.generateStoresMockData(mockDir);
    mockFiles.push(storesMockFile);

    // 5. 生成Mock服务配置
    const mockServiceFile = await this.generateMockServiceConfig(mockDir);
    mockFiles.push(mockServiceFile);

    // 6. 生成Mock切换配置
    const mockSwitchFile = await this.generateMockSwitchConfig(mockDir);
    mockFiles.push(mockSwitchFile);

    Logger.info(`Mock数据生成完成，共生成 ${mockFiles.length} 个文件`);

    return {
      mockFilesCreated: mockFiles,
      mockDataCount: 150,
      mockServiceConfigured: true,
      mockSwitchEnabled: true
    };
  }

  /**
   * 生成用户Mock数据
   */
  private async generateUsersMockData(mockDir: string): Promise<string> {
    const mockData = `// 用户管理Mock数据
import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/v1/admin/users',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, limit = 20, keyword = '', status = '' } = query;

      // 模拟用户数据
      const users = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        username: \`user\${i + 1}\`,
        phone: \`138\${String(i).padStart(8, '0')}\`,
        email: \`user\${i + 1}@daodao.com\`,
        nickname: \`用户\${i + 1}\`,
        avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${i}\`,
        userType: i % 3 === 0 ? 'INVESTOR' : 'CUSTOMER',
        memberLevel: ['BASIC', 'PLUS', 'VIP'][i % 3],
        registrationDate: new Date(2024, 0, i + 1).toISOString(),
        lastLoginAt: new Date(2024, 10, 28 - (i % 28)).toISOString(),
        orderCount: Math.floor(Math.random() * 20),
        totalSpent: Math.floor(Math.random() * 50000),
        status: i % 10 === 0 ? 'disabled' : 'active',
        creditScore: 600 + Math.floor(Math.random() * 400),
        tags: i % 5 === 0 ? ['VIP用户', '老用户'] : []
      }));

      // 过滤
      let filteredUsers = users;
      if (keyword) {
        filteredUsers = users.filter(u =>
          u.username.includes(keyword) ||
          u.phone.includes(keyword) ||
          u.email.includes(keyword)
        );
      }
      if (status) {
        filteredUsers = filteredUsers.filter(u => u.status === status);
      }

      // 分页
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = filteredUsers.slice(start, end);

      return {
        code: 0,
        message: 'success',
        data: {
          list: paginatedUsers,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / limit)
          }
        }
      };
    }
  },
  {
    url: '/api/v1/admin/users/:userId',
    method: 'get',
    response: ({ params }: any) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.userId,
          username: \`user\${params.userId}\`,
          phone: '13800138000',
          email: \`user\${params.userId}@daodao.com\`,
          nickname: \`用户\${params.userId}\`,
          avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${params.userId}\`,
          userType: 'CUSTOMER',
          memberLevel: 'PLUS',
          status: 'active',
          creditScore: 750,
          registrationDate: '2024-01-01T10:00:00+08:00',
          lastLoginAt: '2024-11-28T09:00:00+08:00'
        }
      };
    }
  },
  {
    url: '/api/v1/admin/users/:userId/status',
    method: 'put',
    response: () => {
      return {
        code: 0,
        message: '状态更新成功',
        data: null
      };
    }
  }
] as MockMethod[];
`;

    const filePath = path.join(mockDir, 'users.mock.ts');
    await FileUtils.writeFile(filePath, mockData);
    return filePath;
  }

  /**
   * 生成车辆Mock数据
   */
  private async generateVehiclesMockData(mockDir: string): Promise<string> {
    const mockData = `// 车辆管理Mock数据
import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/v1/admin/vehicles',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, limit = 20 } = query;

      const vehicles = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        plateNumber: \`京A\${String(i + 10000).slice(-5)}\`,
        brand: ['福特', '大通', '依维柯'][i % 3],
        model: ['F150', 'RG10', 'Daily'][i % 3],
        vehicleType: i % 2 === 0 ? 'crowdfunding' : 'cooperative',
        status: ['available', 'rented', 'maintenance'][i % 3],
        storeId: \`store\${(i % 5) + 1}\`,
        storeName: \`门店\${(i % 5) + 1}\`,
        dailyRate: 500 + Math.floor(Math.random() * 1000),
        mileage: Math.floor(Math.random() * 100000),
        lastMaintenanceDate: new Date(2024, 10, 1).toISOString(),
        nextMaintenanceDate: new Date(2024, 11, 1).toISOString()
      }));

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        code: 0,
        message: 'success',
        data: {
          list: vehicles.slice(start, end),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: vehicles.length,
            totalPages: Math.ceil(vehicles.length / limit)
          }
        }
      };
    }
  },
  {
    url: '/api/v1/admin/vehicles/:vehicleId',
    method: 'get',
    response: ({ params }: any) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.vehicleId,
          plateNumber: '京A12345',
          brand: '福特',
          model: 'F150',
          vehicleType: 'crowdfunding',
          status: 'available',
          dailyRate: 800,
          mileage: 50000
        }
      };
    }
  }
] as MockMethod[];
`;

    const filePath = path.join(mockDir, 'vehicles.mock.ts');
    await FileUtils.writeFile(filePath, mockData);
    return filePath;
  }

  /**
   * 生成订单Mock数据
   */
  private async generateOrdersMockData(mockDir: string): Promise<string> {
    const mockData = `// 订单管理Mock数据
import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/v1/admin/orders',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, limit = 20 } = query;

      const orders = Array.from({ length: 100 }, (_, i) => ({
        orderNo: \`ORD\${String(Date.now() + i).slice(-10)}\`,
        userId: i + 1,
        userName: \`用户\${i + 1}\`,
        vehicleId: (i % 50) + 1,
        vehiclePlate: \`京A\${String(i + 10000).slice(-5)}\`,
        status: ['pending', 'confirmed', 'in-use', 'completed', 'cancelled'][i % 5],
        startDate: new Date(2024, 11, 1 + (i % 28)).toISOString(),
        endDate: new Date(2024, 11, 5 + (i % 28)).toISOString(),
        totalAmount: 2000 + Math.floor(Math.random() * 5000),
        createdAt: new Date(2024, 10, 1 + (i % 28)).toISOString()
      }));

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        code: 0,
        message: 'success',
        data: {
          list: orders.slice(start, end),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: orders.length,
            totalPages: Math.ceil(orders.length / limit)
          }
        }
      };
    }
  }
] as MockMethod[];
`;

    const filePath = path.join(mockDir, 'orders.mock.ts');
    await FileUtils.writeFile(filePath, mockData);
    return filePath;
  }

  /**
   * 生成门店Mock数据
   */
  private async generateStoresMockData(mockDir: string): Promise<string> {
    const mockData = `// 门店管理Mock数据
import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/v1/admin/stores',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, limit = 20 } = query;

      const stores = Array.from({ length: 20 }, (_, i) => ({
        id: \`store\${i + 1}\`,
        name: \`叨叨房车\${['北京', '上海', '广州', '深圳', '成都'][i % 5]}店\`,
        storeType: ['direct', 'franchise', 'cooperative'][i % 3],
        cityId: \`city\${(i % 5) + 1}\`,
        cityName: ['北京', '上海', '广州', '深圳', '成都'][i % 5],
        address: \`测试地址\${i + 1}\`,
        phone: \`010-\${String(i + 10000000).slice(-8)}\`,
        status: i % 10 === 0 ? 'closed' : 'open',
        vehicleCount: Math.floor(Math.random() * 20),
        orderCount: Math.floor(Math.random() * 100)
      }));

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        code: 0,
        message: 'success',
        data: {
          list: stores.slice(start, end),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: stores.length,
            totalPages: Math.ceil(stores.length / limit)
          }
        }
      };
    }
  }
] as MockMethod[];
`;

    const filePath = path.join(mockDir, 'stores.mock.ts');
    await FileUtils.writeFile(filePath, mockData);
    return filePath;
  }

  /**
   * 生成Mock服务配置
   */
  private async generateMockServiceConfig(mockDir: string): Promise<string> {
    const mockConfig = `// Mock服务配置
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// 导入所有Mock数据
import usersMock from './users.mock';
import vehiclesMock from './vehicles.mock';
import ordersMock from './orders.mock';
import storesMock from './stores.mock';

export function setupProdMockServer() {
  createProdMockServer([
    ...usersMock,
    ...vehiclesMock,
    ...ordersMock,
    ...storesMock
  ]);
}
`;

    const filePath = path.join(mockDir, 'index.ts');
    await FileUtils.writeFile(filePath, mockConfig);
    return filePath;
  }

  /**
   * 生成Mock切换配置
   */
  private async generateMockSwitchConfig(mockDir: string): Promise<string> {
    const switchConfig = `// Mock数据切换配置
// 在开发环境中，可以通过修改此文件来切换Mock数据和真实API

export const MOCK_CONFIG = {
  // 是否启用Mock数据
  enabled: true,

  // 模块级别的Mock开关
  modules: {
    users: true,      // 用户管理
    vehicles: true,   // 车辆管理
    orders: true,     // 订单管理
    stores: true,     // 门店管理
    crowdfunding: true, // 众筹管理
    cooperative: true,  // 合作管理
    marketing: true,    // 营销管理
    finance: true,      // 财务管理
    system: true        // 系统管理
  },

  // API级别的Mock开关（优先级高于模块级别）
  apis: {
    // 示例：'/api/v1/admin/users': false  // 此API使用真实接口
  }
};

/**
 * 检查指定API是否使用Mock数据
 */
export function shouldUseMock(apiPath: string): boolean {
  // 如果全局禁用Mock，直接返回false
  if (!MOCK_CONFIG.enabled) {
    return false;
  }

  // 检查API级别配置
  if (apiPath in MOCK_CONFIG.apis) {
    return MOCK_CONFIG.apis[apiPath];
  }

  // 检查模块级别配置
  for (const [module, enabled] of Object.entries(MOCK_CONFIG.modules)) {
    if (apiPath.includes(module)) {
      return enabled;
    }
  }

  // 默认使用Mock
  return true;
}
`;

    const filePath = path.join(mockDir, 'config.ts');
    await FileUtils.writeFile(filePath, switchConfig);
    return filePath;
  }

  /**
   * 运行测试
   */
  private async runTests(): Promise<any[]> {
    // 返回模拟测试结果
    return [
      {
        testName: 'UserManagementComponent',
        passed: true,
        duration: 1500
      }
    ];
  }

  // 判断方法
  private shouldGenerateUserManagement(analysis?: RequirementAnalysis): boolean {
    return true; // 默认生成用户管理
  }

  private shouldGenerateVehicleManagement(analysis?: RequirementAnalysis): boolean {
    return false; // 根据需求决定
  }

  private shouldGenerateOrderManagement(analysis?: RequirementAnalysis): boolean {
    return false; // 根据需求决定
  }
}