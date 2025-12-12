<!-- @ts-nocheck -->
<template>
  <div class="finance-reconciliation-container">
    <PageHeader title="对账结算" description="管理门店对账和结算流程" />

    <!-- 搜索和操作 -->
    <div class="toolbar">
      <SearchForm
        v-model="searchForm"
        :fields="searchFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        创建对账
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="reconciliationList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 总收入 -->
      <template #totalIncome="{ row }">
        <span class="income-text">¥{{ row.totalIncome.toLocaleString() }}</span>
      </template>

      <!-- 总支出 -->
      <template #totalExpense="{ row }">
        <span class="expense-text">¥{{ row.totalExpense.toLocaleString() }}</span>
      </template>

      <!-- 净利润 -->
      <template #netProfit="{ row }">
        <span :class="row.netProfit >= 0 ? 'profit-text' : 'loss-text'">
          ¥{{ row.netProfit.toLocaleString() }}
        </span>
      </template>
    </DataTable>

    <!-- 对账编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="700px"
      @close="handleEditDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="对账周期" prop="period">
          <el-date-picker
            v-model="editForm.period"
            type="month"
            placeholder="选择月份"
            format="YYYY-MM"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="所属门店" prop="storeId">
          <el-select v-model="editForm.storeId" placeholder="请选择门店">
            <el-option label="北京朝阳门店" :value="1" />
            <el-option label="上海浦东门店" :value="2" />
            <el-option label="深圳南山门店" :value="3" />
            <el-option label="成都高新门店" :value="4" />
            <el-option label="杭州西湖门店" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="总收入" prop="totalIncome">
          <el-input-number
            v-model="editForm.totalIncome"
            :min="0"
            :precision="2"
            :step="1000"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="总支出" prop="totalExpense">
          <el-input-number
            v-model="editForm.totalExpense"
            :min="0"
            :precision="2"
            :step="1000"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="净利润">
          <el-input
            :value="`¥${(editForm.totalIncome - editForm.totalExpense).toLocaleString()}`"
            disabled
          />
        </el-form-item>

        <el-form-item label="对账人" prop="reconciler">
          <el-input v-model="editForm.reconciler" placeholder="请输入对账人" />
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="editForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 对账详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="对账详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentRecord" class="reconciliation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="对账周期">
            {{ currentRecord.period }}
          </el-descriptions-item>
          <el-descriptions-item label="门店名称">
            {{ currentRecord.storeName }}
          </el-descriptions-item>
          <el-descriptions-item label="总收入">
            <span class="income-text">¥{{ currentRecord.totalIncome.toLocaleString() }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="总支出">
            <span class="expense-text">¥{{ currentRecord.totalExpense.toLocaleString() }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="净利润">
            <span :class="currentRecord.netProfit >= 0 ? 'profit-text' : 'loss-text'">
              ¥{{ currentRecord.netProfit.toLocaleString() }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="利润率">
            {{ ((currentRecord.netProfit / currentRecord.totalIncome) * 100).toFixed(2) }}%
          </el-descriptions-item>
          <el-descriptions-item label="对账状态">
            <el-tag :type="getStatusTagType(currentRecord.status)" size="small">
              {{ getStatusLabel(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="对账人">
            {{ currentRecord.reconciler }}
          </el-descriptions-item>
          <el-descriptions-item label="对账时间">
            {{ currentRecord.reconciledAt }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentRecord.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ currentRecord.notes || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEditFromDetail">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import {
  getReconciliationList,
  createReconciliation,
  type ReconciliationRecord,
  type ReconciliationStatus
} from '@/api/finance'

// 搜索表单
const searchForm = ref({
  status: '',
  storeId: '',
  startDate: '',
  endDate: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'status',
    label: '对账状态',
    placeholder: '请选择状态',
    options: [
      { label: '待处理', value: 'pending' },
      { label: '处理中', value: 'processing' },
      { label: '已完成', value: 'completed' },
      { label: '失败', value: 'failed' }
    ]
  },
  {
    type: 'select',
    prop: 'storeId',
    label: '门店',
    placeholder: '请选择门店',
    options: [
      { label: '北京朝阳门店', value: 1 },
      { label: '上海浦东门店', value: 2 },
      { label: '深圳南山门店', value: 3 },
      { label: '成都高新门店', value: 4 },
      { label: '杭州西湖门店', value: 5 }
    ]
  },
  {
    type: 'date',
    prop: 'startDate',
    label: '开始日期',
    placeholder: '请选择开始日期'
  },
  {
    type: 'date',
    prop: 'endDate',
    label: '结束日期',
    placeholder: '请选择结束日期'
  }
]

// 对账列表
const reconciliationList = ref<ReconciliationRecord[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'period', label: '对账周期', width: 120 },
  { prop: 'storeName', label: '门店', width: 150 },
  { prop: 'totalIncome', label: '总收入', width: 130, slot: 'totalIncome' },
  { prop: 'totalExpense', label: '总支出', width: 130, slot: 'totalExpense' },
  { prop: 'netProfit', label: '净利润', width: 130, slot: 'netProfit' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'reconciler', label: '对账人', width: 120 },
  { prop: 'reconciledAt', label: '对账时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '详情',
    type: 'primary',
    link: true,
    onClick: (row: ReconciliationRecord) => handleDetail(row)
  }
]

// 编辑对话框
const editDialogVisible = ref(false)
const editDialogTitle = ref('创建对账')
const editForm = reactive({
  id: 0,
  period: '',
  storeId: 1,
  storeName: '',
  totalIncome: 0,
  totalExpense: 0,
  reconciler: '',
  notes: ''
})
const editFormRef = ref()
const editRules = {
  period: [{ required: true, message: '请选择对账周期', trigger: 'change' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  totalIncome: [
    { required: true, message: '请输入总收入', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于等于0', trigger: 'blur' }
  ],
  totalExpense: [
    { required: true, message: '请输入总支出', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于等于0', trigger: 'blur' }
  ],
  reconciler: [{ required: true, message: '请输入对账人', trigger: 'blur' }]
}
const submitting = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<ReconciliationRecord | null>(null)

// 获取对账列表
const fetchReconciliationList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      status: searchForm.value.status as ReconciliationStatus | undefined,
      storeId: searchForm.value.storeId ? Number(searchForm.value.storeId) : undefined,
      startDate: searchForm.value.startDate,
      endDate: searchForm.value.endDate
    }
    const { list, total } = await getReconciliationList(params)
    reconciliationList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取对账列表失败:', error)
    ElMessage.error('获取对账列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchReconciliationList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: '',
    storeId: '',
    startDate: '',
    endDate: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchReconciliationList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchReconciliationList()
}

// 创建对账
const handleAdd = () => {
  editForm.id = 0
  editForm.period = ''
  editForm.storeId = 1
  editForm.storeName = ''
  editForm.totalIncome = 0
  editForm.totalExpense = 0
  editForm.reconciler = ''
  editForm.notes = ''
  editDialogTitle.value = '创建对账'
  editDialogVisible.value = true
}

// 查看详情
const handleDetail = (row: ReconciliationRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 从详情页编辑
const handleEditFromDetail = () => {
  detailDialogVisible.value = false
  if (currentRecord.value) {
    editForm.id = currentRecord.value.id
    editForm.period = currentRecord.value.period
    editForm.storeId = currentRecord.value.storeId
    editForm.storeName = currentRecord.value.storeName
    editForm.totalIncome = currentRecord.value.totalIncome
    editForm.totalExpense = currentRecord.value.totalExpense
    editForm.reconciler = currentRecord.value.reconciler
    editForm.notes = currentRecord.value.notes
    editDialogTitle.value = '编辑对账'
    editDialogVisible.value = true
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitting.value = true
    try {
      // 获取门店名称
      const storeNames = ['', '北京朝阳门店', '上海浦东门店', '深圳南山门店', '成都高新门店', '杭州西湖门店']
      editForm.storeName = storeNames[editForm.storeId]

      await createReconciliation(editForm)
      ElMessage.success('创建成功')
      editDialogVisible.value = false
      fetchReconciliationList()
    } catch (error) {
      console.error('保存对账失败:', error)
      ElMessage.error('保存对账失败')
    } finally {
      submitting.value = false
    }
  })
}

// 关闭编辑对话框
const handleEditDialogClose = () => {
  editFormRef.value?.resetFields()
}

// 关闭详情对话框
const handleDetailDialogClose = () => {
  currentRecord.value = null
}

// 获取状态标签类型
const getStatusTagType = (status: ReconciliationStatus) => {
  const statusMap: Record<ReconciliationStatus, any> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: ReconciliationStatus) => {
  const statusMap: Record<ReconciliationStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return statusMap[status] || status
}

// 初始化
onMounted(() => {
  fetchReconciliationList()
})
</script>

<style scoped lang="scss">
.finance-reconciliation-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.income-text {
  color: #67c23a;
  font-weight: 600;
}

.expense-text {
  color: #f56c6c;
  font-weight: 600;
}

.profit-text {
  color: #67c23a;
  font-weight: 600;
}

.loss-text {
  color: #f56c6c;
  font-weight: 600;
}

.reconciliation-detail {
  padding: 20px 0;
}
</style>
