<template>
  <div class="owner-usage-fee-config-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="配置总数"
          :value="stats.totalCount"
          icon="Document"
          color="#409eff"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="启用配置"
          :value="stats.enabledCount"
          icon="Check"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="当前生效"
          :value="stats.effectiveCount"
          icon="CircleCheck"
          color="#e6a23c"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="历史变更"
          :value="stats.historyCount"
          icon="Clock"
          color="#f56c6c"
        />
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建配置
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="configList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #serviceFeeRange="{ row }">
        <div style="font-size: 12px">
          <div>范围: ¥{{ row.serviceFeeMin }} - ¥{{ row.serviceFeeMax }}</div>
          <div style="color: #409eff">默认: ¥{{ row.serviceFeeDefault }}</div>
        </div>
      </template>
      <template #enabled="{ row }">
        <el-switch
          v-model="row.enabled"
          @change="handleToggleEnabled(row)"
        />
      </template>
    </DataTable>

    <!-- 创建/编辑对话框 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      width="800px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { useErrorHandler } from '@/composables'
import {
  getOwnerUsageFeeConfigList,
  createOwnerUsageFeeConfig,
  updateOwnerUsageFeeConfig,
  deleteOwnerUsageFeeConfig,
} from '@/api/hosting'

const { handleApiError } = useErrorHandler()

// 统计数据
const stats = ref({
  totalCount: 0,
  enabledCount: 0,
  effectiveCount: 0,
  historyCount: 0,
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  enabled: undefined,
})

// 搜索字段配置
const searchFields = computed(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '配置名称',
    width: '200px',
  },
  {
    prop: 'enabled',
    label: '状态',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { label: '启用', value: true },
      { label: '禁用', value: false },
    ],
    width: '150px',
  },
])

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'configName', label: '配置名称', width: 180 },
  { prop: 'serviceFeeRange', label: '服务费', width: 160, slot: true },
  { prop: 'relocationFee', label: '异地还车费', width: 120 },
  { prop: 'maxUsageDaysPerMonth', label: '最大自用天数', width: 120 },
  { prop: 'effectiveDate', label: '生效日期', width: 120 },
  { prop: 'enabled', label: '状态', width: 100, slot: true },
]

// 表格操作配置
const tableActions = [
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: any) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: any) => handleDelete(row),
  },
]

// 数据列表
const configList = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10,
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentConfigId = ref<number | null>(null)

// 表单数据
const formData = reactive({
  configName: '',
  serviceFeeMin: 200,
  serviceFeeMax: 500,
  serviceFeeDefault: 300,
  relocationFee: 500,
  relocationFreeCount: 1,
  maxUsageDaysPerMonth: 7,
  advanceNoticeDays: 3,
  effectiveDate: '',
  expiryDate: '',
  description: '',
  changeDescription: '',
})

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'divider',
    label: '基本信息',
  },
  {
    prop: 'configName',
    label: '配置名称',
    type: 'input',
    placeholder: '请输入配置名称',
  },
  {
    prop: 'description',
    label: '配置说明',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入配置说明',
  },
])

// 表单验证规则
const formRules = {
  configName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
}

// 加载配置列表
const loadConfigList = async () => {
  loading.value = true
  try {
    const response = await getOwnerUsageFeeConfigList({
      keyword: searchForm.keyword,
      enabled: searchForm.enabled,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    configList.value = response.data.list
    pagination.total = response.data.total

    // 更新统计数据
    stats.value.totalCount = response.data.total
    stats.value.enabledCount = response.data.list.filter((c: any) => c.enabled).length
    stats.value.effectiveCount = response.data.list.filter((c: any) => {
      const now = new Date()
      const effectiveDate = new Date(c.effectiveDate)
      const expiryDate = c.expiryDate ? new Date(c.expiryDate) : null
      return c.enabled && effectiveDate <= now && (!expiryDate || expiryDate >= now)
    }).length
  } catch (error) {
    handleApiError(error, '加载配置列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadConfigList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.enabled = undefined
  pagination.page = 1
  loadConfigList()
}

// 创建配置
const handleCreate = () => {
  isEdit.value = false
  currentConfigId.value = null
  dialogTitle.value = '创建配置'
  dialogVisible.value = true
}

// 编辑配置
const handleEdit = (row: any) => {
  isEdit.value = true
  currentConfigId.value = row.id
  dialogTitle.value = '编辑配置'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value && currentConfigId.value) {
      await updateOwnerUsageFeeConfig(currentConfigId.value, data)
      ElMessage.success('编辑成功')
    } else {
      await createOwnerUsageFeeConfig(data)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadConfigList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 删除配置
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除配置"${row.configName}"吗？`, '删除确认', {
      type: 'warning',
    })
    await deleteOwnerUsageFeeConfig(row.id)
    ElMessage.success('删除成功')
    loadConfigList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 启用/禁用切换
const handleToggleEnabled = async (row: any) => {
  try {
    await updateOwnerUsageFeeConfig(row.id, { enabled: row.enabled })
    const statusText = row.enabled ? '启用' : '禁用'
    ElMessage.success(`已${statusText}配置: ${row.configName}`)
  } catch (error) {
    row.enabled = !row.enabled // 恢复原状态
    handleApiError(error, '状态切换失败')
  }
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadConfigList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadConfigList()
}

onMounted(() => {
  loadConfigList()
})
</script>

<style scoped lang="scss">
.owner-usage-fee-config-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
}
</style>
