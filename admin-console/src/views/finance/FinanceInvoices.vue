<!-- @ts-nocheck -->
<template>
  <div class="finance-invoices-container">
    <PageHeader title="发票管理" description="管理订单发票开具和状态" />

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
        开具发票
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="invoiceList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 发票类型 -->
      <template #type="{ row }">
        <el-tag size="small">{{ row.type }}</el-tag>
      </template>

      <!-- 金额 -->
      <template #amount="{ row }">
        <div class="amount-info">
          <div>金额: ¥{{ row.amount.toLocaleString() }}</div>
          <div class="tax-info">税额: ¥{{ row.taxAmount.toLocaleString() }}</div>
          <div class="total-info">合计: ¥{{ row.totalAmount.toLocaleString() }}</div>
        </div>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 发票编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="700px"
      @close="handleEditDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="editForm.orderId" placeholder="请输入订单号" />
        </el-form-item>

        <el-form-item label="发票类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择类型">
            <el-option label="增值税普通发票" value="增值税普通发票" />
            <el-option label="增值税专用发票" value="增值税专用发票" />
          </el-select>
        </el-form-item>

        <el-form-item label="开票金额" prop="amount">
          <el-input-number
            v-model="editForm.amount"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%"
            @change="handleAmountChange"
          />
        </el-form-item>

        <el-form-item label="税额">
          <el-input :value="`¥${editForm.taxAmount.toLocaleString()}`" disabled />
          <span class="form-tip">税率: 13%</span>
        </el-form-item>

        <el-form-item label="价税合计">
          <el-input :value="`¥${editForm.totalAmount.toLocaleString()}`" disabled />
        </el-form-item>

        <el-form-item label="购买方名称" prop="buyerName">
          <el-input v-model="editForm.buyerName" placeholder="请输入购买方名称" />
        </el-form-item>

        <el-form-item label="纳税人识别号" prop="buyerTaxNo">
          <el-input v-model="editForm.buyerTaxNo" placeholder="请输入纳税人识别号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 发票详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="发票详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentInvoice" class="invoice-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="发票号码">
            {{ currentInvoice.invoiceNo }}
          </el-descriptions-item>
          <el-descriptions-item label="订单号">
            {{ currentInvoice.orderId }}
          </el-descriptions-item>
          <el-descriptions-item label="发票类型">
            {{ currentInvoice.type }}
          </el-descriptions-item>
          <el-descriptions-item label="发票状态">
            <el-tag :type="getStatusTagType(currentInvoice.status)" size="small">
              {{ getStatusLabel(currentInvoice.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开票金额">
            ¥{{ currentInvoice.amount.toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="税额">
            ¥{{ currentInvoice.taxAmount.toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="价税合计">
            <span class="total-amount">¥{{ currentInvoice.totalAmount.toLocaleString() }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="税率">
            13%
          </el-descriptions-item>
          <el-descriptions-item label="购买方名称" :span="2">
            {{ currentInvoice.buyerName }}
          </el-descriptions-item>
          <el-descriptions-item label="纳税人识别号" :span="2">
            {{ currentInvoice.buyerTaxNo }}
          </el-descriptions-item>
          <el-descriptions-item label="开票时间">
            {{ currentInvoice.issuedAt || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="发送时间">
            {{ currentInvoice.sentAt || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ currentInvoice.paidAt || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentInvoice.createdAt }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <el-button
            v-if="currentInvoice.status === 'pending'"
            type="success"
            @click="handleUpdateStatus(currentInvoice, 'issued')"
          >
            开具发票
          </el-button>
          <el-button
            v-if="currentInvoice.status === 'issued'"
            type="primary"
            @click="handleUpdateStatus(currentInvoice, 'sent')"
          >
            发送发票
          </el-button>
          <el-button
            v-if="currentInvoice.status === 'sent'"
            type="warning"
            @click="handleUpdateStatus(currentInvoice, 'paid')"
          >
            确认支付
          </el-button>
          <el-button
            v-if="['pending', 'issued'].includes(currentInvoice.status)"
            type="danger"
            @click="handleUpdateStatus(currentInvoice, 'cancelled')"
          >
            作废发票
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
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
  getInvoiceList,
  createInvoice,
  updateInvoice,
  type Invoice,
  type InvoiceStatus
} from '@/api/finance'

// 搜索表单
const searchForm = ref({
  status: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'status',
    label: '发票状态',
    placeholder: '请选择状态',
    options: [
      { label: '待开具', value: 'pending' },
      { label: '已开具', value: 'issued' },
      { label: '已发送', value: 'sent' },
      { label: '已支付', value: 'paid' },
      { label: '已作废', value: 'cancelled' }
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
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '发票号/订单号/购买方'
  }
]

// 发票列表
const invoiceList = ref<Invoice[]>([])
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
  { prop: 'invoiceNo', label: '发票号码', width: 150 },
  { prop: 'orderId', label: '订单号', width: 150 },
  { prop: 'type', label: '发票类型', width: 150, slot: 'type' },
  { prop: 'amount', label: '金额信息', width: 180, slot: 'amount' },
  { prop: 'buyerName', label: '购买方', minWidth: 200 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '详情',
    type: 'primary',
    link: true,
    onClick: (row: Invoice) => handleDetail(row)
  }
]

// 编辑对话框
const editDialogVisible = ref(false)
const editDialogTitle = ref('开具发票')
const editForm = reactive({
  id: 0,
  orderId: '',
  type: '增值税普通发票',
  amount: 0,
  taxAmount: 0,
  totalAmount: 0,
  buyerName: '',
  buyerTaxNo: ''
})
const editFormRef = ref()
const editRules = {
  orderId: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入开票金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于0', trigger: 'blur' }
  ],
  buyerName: [{ required: true, message: '请输入购买方名称', trigger: 'blur' }],
  buyerTaxNo: [
    { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
    { pattern: /^\d{15}$|^\d{18}$|^\d{20}$/, message: '纳税人识别号格式不正确', trigger: 'blur' }
  ]
}
const submitting = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentInvoice = ref<Invoice | null>(null)

// 获取发票列表
const fetchInvoiceList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      status: searchForm.value.status as InvoiceStatus | undefined,
      startDate: searchForm.value.startDate,
      endDate: searchForm.value.endDate,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getInvoiceList(params)
    invoiceList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取发票列表失败:', error)
    ElMessage.error('获取发票列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchInvoiceList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: '',
    startDate: '',
    endDate: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchInvoiceList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchInvoiceList()
}

// 开具发票
const handleAdd = () => {
  editForm.id = 0
  editForm.orderId = ''
  editForm.type = '增值税普通发票'
  editForm.amount = 0
  editForm.taxAmount = 0
  editForm.totalAmount = 0
  editForm.buyerName = ''
  editForm.buyerTaxNo = ''
  editDialogTitle.value = '开具发票'
  editDialogVisible.value = true
}

// 金额变化
const handleAmountChange = (value: number) => {
  editForm.taxAmount = Math.floor(value * 0.13)
  editForm.totalAmount = value + editForm.taxAmount
}

// 查看详情
const handleDetail = (row: Invoice) => {
  currentInvoice.value = row
  detailDialogVisible.value = true
}

// 更新发票状态
const handleUpdateStatus = async (invoice: Invoice, status: InvoiceStatus) => {
  try {
    const statusMap: Record<InvoiceStatus, string> = {
      pending: '待开具',
      issued: '已开具',
      sent: '已发送',
      paid: '已支付',
      cancelled: '已作废'
    }

    await ElMessageBox.confirm(
      `确定要将发票状态更新为"${statusMap[status]}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const updateData: Partial<Invoice> = { status }
    const now = new Date().toISOString()

    if (status === 'issued') {
      updateData.issuedAt = now
    } else if (status === 'sent') {
      updateData.sentAt = now
    } else if (status === 'paid') {
      updateData.paidAt = now
    }

    await updateInvoice(invoice.id, updateData)
    ElMessage.success('状态更新成功')
    detailDialogVisible.value = false
    fetchInvoiceList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error('更新状态失败')
    }
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitting.value = true
    try {
      await createInvoice(editForm)
      ElMessage.success('开具成功')
      editDialogVisible.value = false
      fetchInvoiceList()
    } catch (error) {
      console.error('开具发票失败:', error)
      ElMessage.error('开具发票失败')
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
  currentInvoice.value = null
}

// 获取状态标签类型
const getStatusTagType = (status: InvoiceStatus) => {
  const statusMap: Record<InvoiceStatus, any> = {
    pending: 'info',
    issued: 'warning',
    sent: '',
    paid: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || ''
}

// 获取状态标签
const getStatusLabel = (status: InvoiceStatus) => {
  const statusMap: Record<InvoiceStatus, string> = {
    pending: '待开具',
    issued: '已开具',
    sent: '已发送',
    paid: '已支付',
    cancelled: '已作废'
  }
  return statusMap[status] || status
}

// 初始化
onMounted(() => {
  fetchInvoiceList()
})
</script>

<style scoped lang="scss">
.finance-invoices-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.amount-info {
  font-size: 13px;

  .tax-info {
    color: #909399;
    margin-top: 4px;
  }

  .total-info {
    color: #303133;
    font-weight: 600;
    margin-top: 4px;
  }
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

.invoice-detail {
  padding: 20px 0;

  .total-amount {
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
  }
}

.detail-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 12px;
}
</style>
