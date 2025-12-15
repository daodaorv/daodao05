<!-- @ts-nocheck -->
<template>
  <div class="finance-expenses-container">
    <PageHeader title="支出管理" description="管理和分析平台支出数据" />

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
        新增支出
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="expenseList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 类别 -->
      <template #category="{ row }">
        <el-tag :type="getCategoryTagType(row.category)" size="small">
          {{ getCategoryLabel(row.category) }}
        </el-tag>
      </template>

      <!-- 金额 -->
      <template #amount="{ row }">
        <span class="amount-text">¥{{ row.amount.toLocaleString() }}</span>
      </template>
    </DataTable>

    <!-- 支出编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="600px"
      @close="handleEditDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="支出类别" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择类别">
            <el-option label="车辆采购" value="vehicle" />
            <el-option label="维修保养" value="maintenance" />
            <el-option label="保险费用" value="insurance" />
            <el-option label="员工工资" value="salary" />
            <el-option label="门店租金" value="rent" />
            <el-option label="市场推广" value="marketing" />
            <el-option label="其他费用" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="支出金额" prop="amount">
          <el-input-number
            v-model="editForm.amount"
            :min="0"
            :precision="2"
            :step="100"
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

        <el-form-item label="收款方" prop="payee">
          <el-input v-model="editForm.payee" placeholder="请输入收款方名称" />
        </el-form-item>

        <el-form-item label="审批人" prop="approver">
          <el-input v-model="editForm.approver" placeholder="请输入审批人" />
        </el-form-item>

        <el-form-item label="支出说明" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入支出说明"
          />
        </el-form-item>

        <el-form-item label="凭证号" prop="voucher">
          <el-input v-model="editForm.voucher" placeholder="自动生成" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
          确定
        </el-button>
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
  getExpenseList,
  createExpense,
  updateExpense,
  deleteExpense,
  type ExpenseRecord,
  type ExpenseCategory
} from '@/api/finance'

// 搜索表单
const searchForm = ref({
  category: '',
  storeId: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'category',
    label: '支出类别',
    placeholder: '请选择类别',
    options: [
      { label: '车辆采购', value: 'vehicle' },
      { label: '维修保养', value: 'maintenance' },
      { label: '保险费用', value: 'insurance' },
      { label: '员工工资', value: 'salary' },
      { label: '门店租金', value: 'rent' },
      { label: '市场推广', value: 'marketing' },
      { label: '其他费用', value: 'other' }
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
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '收款方/凭证号'
  }
]

// 支出列表
const expenseList = ref<ExpenseRecord[]>([])
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
  { prop: 'category', label: '类别', width: 120, slot: 'category' },
  { prop: 'amount', label: '金额', width: 120, slot: 'amount' },
  { prop: 'storeName', label: '门店', width: 150 },
  { prop: 'payee', label: '收款方', width: 150 },
  { prop: 'approver', label: '审批人', width: 120 },
  { prop: 'voucher', label: '凭证号', width: 150 },
  { prop: 'description', label: '说明', minWidth: 200 },
  { prop: 'createdAt', label: '创建时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '编辑',
    type: 'primary',
    link: true,
    onClick: (row: ExpenseRecord) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    link: true,
    onClick: (row: ExpenseRecord) => handleDelete(row)
  }
]

// 编辑对话框
const editDialogVisible = ref(false)
const editDialogTitle = ref('新增支出')
const editForm = reactive({
  id: 0,
  category: 'other' as ExpenseCategory,
  amount: 0,
  storeId: 1,
  storeName: '',
  payee: '',
  approver: '',
  description: '',
  voucher: ''
})
const editFormRef = ref()
const editRules = {
  category: [{ required: true, message: '请选择支出类别', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入支出金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于0', trigger: 'blur' }
  ],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  payee: [{ required: true, message: '请输入收款方', trigger: 'blur' }],
  approver: [{ required: true, message: '请输入审批人', trigger: 'blur' }],
  description: [{ required: true, message: '请输入支出说明', trigger: 'blur' }]
}
const submitting = ref(false)

// 获取支出列表
const fetchExpenseList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      category: searchForm.value.category as ExpenseCategory | undefined,
      storeId: searchForm.value.storeId ? Number(searchForm.value.storeId) : undefined,
      startDate: searchForm.value.startDate,
      endDate: searchForm.value.endDate,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getExpenseList(params)
    expenseList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取支出列表失败:', error)
    ElMessage.error('获取支出列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchExpenseList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    category: '',
    storeId: '',
    startDate: '',
    endDate: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchExpenseList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchExpenseList()
}

// 新增支出
const handleAdd = () => {
  editForm.id = 0
  editForm.category = 'other'
  editForm.amount = 0
  editForm.storeId = 1
  editForm.storeName = ''
  editForm.payee = ''
  editForm.approver = ''
  editForm.description = ''
  editForm.voucher = ''
  editDialogTitle.value = '新增支出'
  editDialogVisible.value = true
}

// 编辑支出
const handleEdit = (row: ExpenseRecord) => {
  editForm.id = row.id
  editForm.category = row.category
  editForm.amount = row.amount
  editForm.storeId = row.storeId
  editForm.storeName = row.storeName
  editForm.payee = row.payee
  editForm.approver = row.approver
  editForm.description = row.description
  editForm.voucher = row.voucher
  editDialogTitle.value = '编辑支出'
  editDialogVisible.value = true
}

// 删除支出
const handleDelete = async (row: ExpenseRecord) => {
  try {
    await ElMessageBox.confirm(`确定要删除支出记录"${row.description}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteExpense(row.id)
    ElMessage.success('删除成功')
    fetchExpenseList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除支出失败:', error)
      ElMessage.error('删除支出失败')
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
      // 获取门店名称
      const storeNames = ['', '北京朝阳门店', '上海浦东门店', '深圳南山门店', '成都高新门店', '杭州西湖门店']
      editForm.storeName = storeNames[editForm.storeId]

      if (editForm.id) {
        await updateExpense(editForm.id, editForm)
        ElMessage.success('更新成功')
      } else {
        await createExpense(editForm)
        ElMessage.success('创建成功')
      }
      editDialogVisible.value = false
      fetchExpenseList()
    } catch (error) {
      console.error('保存支出失败:', error)
      ElMessage.error('保存支出失败')
    } finally {
      submitting.value = false
    }
  })
}

// 关闭编辑对话框
const handleEditDialogClose = () => {
  editFormRef.value?.resetFields()
}

// 获取类别标签类型
const getCategoryTagType = (category: ExpenseCategory) => {
  const categoryMap: Record<ExpenseCategory, any> = {
    vehicle: 'danger',
    maintenance: 'warning',
    insurance: 'success',
    salary: '',
    rent: 'info',
    marketing: 'warning',
    other: 'info'
  }
  return categoryMap[category] || 'info'
}

// 获取类别标签
const getCategoryLabel = (category: ExpenseCategory) => {
  const categoryMap: Record<ExpenseCategory, string> = {
    vehicle: '车辆采购',
    maintenance: '维修保养',
    insurance: '保险费用',
    salary: '员工工资',
    rent: '门店租金',
    marketing: '市场推广',
    other: '其他费用'
  }
  return categoryMap[category] || category
}

// 初始化
onMounted(() => {
  fetchExpenseList()
})
</script>

<style scoped lang="scss">
.finance-expenses-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.amount-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>
