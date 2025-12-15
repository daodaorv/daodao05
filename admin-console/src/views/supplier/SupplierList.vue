<!-- @ts-nocheck -->
<template>
  <div class="supplier-list-container">
    <PageHeader :title="pageTitle" :description="pageDescription" />

    <StatsCard v-if="showStats" :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="supplierList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #cooperationStatus="{ row }">
        <el-tag :type="row.cooperationStatus === 'active' ? 'success' : 'info'" size="small">
          {{ row.cooperationStatus === 'active' ? '合作中' : '已停止' }}
        </el-tag>
      </template>
      <template #qualityRating="{ row }">
        <el-rate v-model="row.qualityRating" disabled show-score text-color="#ff9900" />
      </template>
      <template #totalCost="{ row }">
        ¥{{ row.totalCost.toLocaleString() }}
      </template>
    </DataTable>

    <!-- 新增/编辑供应商对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="服务范围" prop="serviceScope">
          <el-input v-model="form.serviceScope" type="textarea" :rows="2" placeholder="请输入服务范围" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格区间" prop="priceRange">
              <el-input v-model="form.priceRange" placeholder="例如：500-5000元/次" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质量评级" prop="qualityRating">
              <el-rate v-model="form.qualityRating" show-text />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合作状态" prop="cooperationStatus">
              <el-select v-model="form.cooperationStatus" placeholder="请选择合作状态" style="width: 100%">
                <el-option label="合作中" value="active" />
                <el-option label="已停止" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作协议" prop="contractUrl">
              <el-input v-model="form.contractUrl" placeholder="请输入合作协议URL" />
            </el-form-item>
          </el-col>
        </el-row>
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
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getSupplierList,
  getSupplierStats,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
  type SupplierListParams,
  type CreateSupplierParams,
  type SupplierType
} from '@/api/supplier'

// Props
interface Props {
  supplierType?: SupplierType
  pageTitle: string
  pageDescription: string
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true
})

// 搜索表单
const searchForm = ref({
  keyword: '',
  cooperationStatus: ''
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '供应商名称/联系人/电话'
  },
  {
    type: 'select',
    prop: 'cooperationStatus',
    label: '合作状态',
    placeholder: '请选择合作状态',
    options: [
      { label: '合作中', value: 'active' },
      { label: '已停止', value: 'inactive' }
    ]
  }
]

// 统计数据
const stats = ref({
  totalSuppliers: 0,
  maintenanceSuppliers: 0,
  insuranceSuppliers: 0,
  otherSuppliers: 0,
  activeSuppliers: 0,
  totalServiceCount: 0,
  totalCost: 0,
  averageRating: 0
})

const statsConfig = computed(() => {
  const baseStats = [
    {
      label: '供应商总数',
      value: stats.value.totalSuppliers,
      icon: 'OfficeBuilding',
      color: '#409EFF'
    },
    {
      label: '合作中',
      value: stats.value.activeSuppliers,
      icon: 'Check',
      color: '#67C23A'
    },
    {
      label: '服务次数',
      value: stats.value.totalServiceCount,
      icon: 'Document',
      color: '#E6A23C'
    },
    {
      label: '总成本',
      value: `¥${stats.value.totalCost.toLocaleString()}`,
      icon: 'Money',
      color: '#F56C6C'
    },
    {
      label: '平均评级',
      value: stats.value.averageRating.toFixed(1) + '星',
      icon: 'Star',
      color: '#FF9900'
    }
  ]

  if (!props.supplierType) {
    return [
      ...baseStats,
      {
        label: '维保供应商',
        value: stats.value.maintenanceSuppliers,
        icon: 'Tools',
        color: '#909399'
      },
      {
        label: '保险供应商',
        value: stats.value.insuranceSuppliers,
        icon: 'Document',
        color: '#409EFF'
      },
      {
        label: '其他供应商',
        value: stats.value.otherSuppliers,
        icon: 'More',
        color: '#67C23A'
      }
    ]
  }

  return baseStats
})

// 表格数据
const supplierList = ref<Supplier[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '供应商名称', width: 180 },
  { prop: 'contactPerson', label: '联系人', width: 100 },
  { prop: 'phone', label: '联系电话', width: 130 },
  { prop: 'serviceScope', label: '服务范围', minWidth: 200 },
  { prop: 'priceRange', label: '价格区间', width: 150 },
  { prop: 'qualityRating', label: '质量评级', width: 150, slot: 'qualityRating' },
  { prop: 'cooperationStatus', label: '合作状态', width: 100, slot: 'cooperationStatus' },
  { prop: 'serviceCount', label: '服务次数', width: 100 },
  { prop: 'totalCost', label: '总成本', width: 120, slot: 'totalCost' }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '编辑',
    type: 'primary',
    icon: Edit,
    onClick: (row: Supplier) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    icon: Delete,
    onClick: (row: Supplier) => handleDelete(row)
  }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增供应商',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate
  }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<CreateSupplierParams>({
  name: '',
  type: props.supplierType || 'maintenance',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  serviceScope: '',
  priceRange: '',
  qualityRating: 5,
  cooperationStatus: 'active',
  contractUrl: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  serviceScope: [{ required: true, message: '请输入服务范围', trigger: 'blur' }],
  priceRange: [{ required: true, message: '请输入价格区间', trigger: 'blur' }],
  cooperationStatus: [{ required: true, message: '请选择合作状态', trigger: 'change' }]
}

// 获取统计数据
async function fetchStats() {
  if (!props.showStats) return

  try {
    const data = await getSupplierStats()
    stats.value = data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取供应商列表
async function fetchSupplierList() {
  loading.value = true
  try {
    const params: SupplierListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      type: props.supplierType,
      ...searchForm.value
    }
    const { list, total } = await getSupplierList(params)
    supplierList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取供应商列表失败:', error)
    ElMessage.error('获取供应商列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchSupplierList()
}

// 重置
function handleReset() {
  searchForm.value = {
    keyword: '',
    cooperationStatus: ''
  }
  pagination.page = 1
  fetchSupplierList()
}

// 新增
function handleCreate() {
  dialogTitle.value = '新增供应商'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: Supplier) {
  dialogTitle.value = '编辑供应商'
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    type: row.type,
    contactPerson: row.contactPerson,
    phone: row.phone,
    email: row.email,
    address: row.address,
    serviceScope: row.serviceScope,
    priceRange: row.priceRange,
    qualityRating: row.qualityRating,
    cooperationStatus: row.cooperationStatus,
    contractUrl: row.contractUrl
  })
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: Supplier) {
  try {
    await ElMessageBox.confirm(`确定要删除供应商"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteSupplier(row.id)
    ElMessage.success('删除成功')
    fetchSupplierList()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if (editingId.value) {
      await updateSupplier(editingId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createSupplier(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchSupplierList()
    fetchStats()
  } catch (error) {
    if (error !== false) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭对话框
function handleDialogClose() {
  resetForm()
}

// 重置表单
function resetForm() {
  Object.assign(form, {
    name: '',
    type: props.supplierType || 'maintenance',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    serviceScope: '',
    priceRange: '',
    qualityRating: 5,
    cooperationStatus: 'active',
    contractUrl: ''
  })
  formRef.value?.clearValidate()
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  fetchSupplierList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchSupplierList()
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchSupplierList()
})
</script>

<style scoped lang="scss">
.supplier-list-container {
  padding: 20px;
}
</style>
