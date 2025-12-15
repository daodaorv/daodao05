<!-- @ts-nocheck -->
<template>
  <div class="partner-list-container">
    <PageHeader title="合作商列表" description="管理房车租赁合作商信息和合作状态" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="partnerList"
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
      <template #creditRating="{ row }">
        <el-tag :type="getCreditRatingTag(row.creditRating)" size="small">
          {{ row.creditRating }}级
        </el-tag>
      </template>
      <template #profitSharingRatio="{ row }">
        {{ row.profitSharingRatio }}%
      </template>
      <template #totalRevenue="{ row }">
        ¥{{ row.totalRevenue.toLocaleString() }}
      </template>
    </DataTable>

    <!-- 新增/编辑合作商对话框 -->
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
            <el-form-item label="合作商名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入合作商名称" />
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
            <el-form-item label="信用评级" prop="creditRating">
              <el-select v-model="form.creditRating" placeholder="请选择信用评级" style="width: 100%">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
                <el-option label="D级" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店分润比例" prop="profitSharingRatio">
              <el-input-number
                v-model="form.profitSharingRatio"
                :min="0"
                :max="100"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 8px; color: #909399;">%</span>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete, View } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getPartnerList,
  getPartnerStats,
  createPartner,
  updatePartner,
  deletePartner,
  type Partner,
  type PartnerListParams,
  type CreatePartnerParams
} from '@/api/partner'

const router = useRouter()

// 搜索表单
const searchForm = ref({
  keyword: '',
  cooperationStatus: '',
  creditRating: ''
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '合作商名称/联系人/电话'
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
  },
  {
    type: 'select',
    prop: 'creditRating',
    label: '信用评级',
    placeholder: '请选择信用评级',
    options: [
      { label: 'A级', value: 'A' },
      { label: 'B级', value: 'B' },
      { label: 'C级', value: 'C' },
      { label: 'D级', value: 'D' }
    ]
  }
]

// 统计数据
const stats = ref({
  totalPartners: 0,
  activePartners: 0,
  totalStores: 0,
  totalVehicles: 0,
  totalOrders: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  averagePriceDifference: 0
})

const statsConfig = computed(() => [
  {
    label: '合作商总数',
    value: stats.value.totalPartners,
    icon: 'User',
    color: '#409EFF'
  },
  {
    label: '合作中',
    value: stats.value.activePartners,
    icon: 'Check',
    color: '#67C23A'
  },
  {
    label: '合作门店',
    value: stats.value.totalStores,
    icon: 'Shop',
    color: '#E6A23C'
  },
  {
    label: '合作车辆',
    value: stats.value.totalVehicles,
    icon: 'Van',
    color: '#909399'
  },
  {
    label: '总订单数',
    value: stats.value.totalOrders,
    icon: 'Document',
    color: '#409EFF'
  },
  {
    label: '总营收',
    value: `¥${stats.value.totalRevenue.toLocaleString()}`,
    icon: 'Money',
    color: '#F56C6C'
  },
  {
    label: '本月营收',
    value: `¥${stats.value.monthlyRevenue.toLocaleString()}`,
    icon: 'TrendCharts',
    color: '#67C23A'
  },
  {
    label: '平均差价',
    value: `¥${stats.value.averagePriceDifference}`,
    icon: 'Coin',
    color: '#E6A23C'
  }
])

// 表格数据
const partnerList = ref<Partner[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '合作商名称', width: 150 },
  { prop: 'contactPerson', label: '联系人', width: 100 },
  { prop: 'phone', label: '联系电话', width: 130 },
  { prop: 'cooperationStatus', label: '合作状态', width: 100, slot: 'cooperationStatus' },
  { prop: 'creditRating', label: '信用评级', width: 100, slot: 'creditRating' },
  { prop: 'profitSharingRatio', label: '门店分润比例', width: 120, slot: 'profitSharingRatio' },
  { prop: 'storeCount', label: '门店数', width: 80 },
  { prop: 'vehicleCount', label: '车辆数', width: 80 },
  { prop: 'totalOrders', label: '订单数', width: 80 },
  { prop: 'totalRevenue', label: '总营收', width: 120, slot: 'totalRevenue' }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    icon: View,
    onClick: (row: Partner) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    icon: Edit,
    onClick: (row: Partner) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    icon: Delete,
    onClick: (row: Partner) => handleDelete(row)
  }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增合作商',
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

const form = reactive<CreatePartnerParams>({
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  cooperationStatus: 'active',
  creditRating: 'A',
  contractUrl: '',
  profitSharingRatio: 30
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入合作商名称', trigger: 'blur' }],
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
  cooperationStatus: [{ required: true, message: '请选择合作状态', trigger: 'change' }],
  creditRating: [{ required: true, message: '请选择信用评级', trigger: 'change' }]
}

// 获取统计数据
async function fetchStats() {
  try {
    const data = await getPartnerStats()
    stats.value = data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取合作商列表
async function fetchPartnerList() {
  loading.value = true
  try {
    const params: PartnerListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm.value
    }
    const { list, total } = await getPartnerList(params)
    partnerList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取合作商列表失败:', error)
    ElMessage.error('获取合作商列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchPartnerList()
}

// 重置
function handleReset() {
  searchForm.value = {
    keyword: '',
    cooperationStatus: '',
    creditRating: ''
  }
  pagination.page = 1
  fetchPartnerList()
}

// 新增
function handleCreate() {
  dialogTitle.value = '新增合作商'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

// 查看
function handleView(row: Partner) {
  router.push(`/partner/detail/${row.id}`)
}

// 编辑
function handleEdit(row: Partner) {
  dialogTitle.value = '编辑合作商'
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    contactPerson: row.contactPerson,
    phone: row.phone,
    email: row.email,
    address: row.address,
    cooperationStatus: row.cooperationStatus,
    creditRating: row.creditRating,
    contractUrl: row.contractUrl,
    profitSharingRatio: row.profitSharingRatio
  })
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: Partner) {
  try {
    await ElMessageBox.confirm(`确定要删除合作商"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deletePartner(row.id)
    ElMessage.success('删除成功')
    fetchPartnerList()
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
      await updatePartner(editingId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createPartner(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchPartnerList()
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
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    cooperationStatus: 'active',
    creditRating: 'A',
    contractUrl: '',
    profitSharingRatio: 30
  })
  formRef.value?.clearValidate()
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  fetchPartnerList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchPartnerList()
}

// 获取信用评级标签类型
function getCreditRatingTag(rating: string) {
  const map: Record<string, string> = {
    A: 'success',
    B: 'primary',
    C: 'warning',
    D: 'danger'
  }
  return map[rating] || 'info'
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchPartnerList()
})
</script>

<style scoped lang="scss">
.partner-list-container {
  padding: 20px;
}
</style>
