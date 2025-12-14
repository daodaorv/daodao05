<!-- @ts-nocheck -->
<template>
  <div class="partner-orders-container">
    <PageHeader title="合作商订单" description="管理合作商订单信息，填写订单号和价格，自动计算差价和分润" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="orderList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #daodaoOrderPrice="{ row }">
        ¥{{ row.daodaoOrderPrice.toLocaleString() }}
      </template>
      <template #partnerOrderPrice="{ row }">
        ¥{{ row.partnerOrderPrice.toLocaleString() }}
      </template>
      <template #priceDifference="{ row }">
        <el-tag type="success" size="small">
          ¥{{ row.priceDifference.toLocaleString() }}
        </el-tag>
      </template>
      <template #storeProfitAmount="{ row }">
        <el-tag type="warning" size="small">
          ¥{{ row.storeProfitAmount.toLocaleString() }}
        </el-tag>
      </template>
      <template #platformProfitAmount="{ row }">
        <el-tag type="primary" size="small">
          ¥{{ row.platformProfitAmount.toLocaleString() }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 新增/编辑合作商订单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-form-item label="叨叨订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入叨叨订单号" type="number" />
        </el-form-item>
        <el-form-item label="合作商" prop="partnerId">
          <el-select v-model="form.partnerId" placeholder="请选择合作商" style="width: 100%">
            <el-option
              v-for="partner in partnerOptions"
              :key="partner.value"
              :label="partner.label"
              :value="partner.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合作商订单号" prop="partnerOrderNo">
          <el-input v-model="form.partnerOrderNo" placeholder="请输入合作商订单号" />
        </el-form-item>
        <el-form-item label="合作商订单价格" prop="partnerOrderPrice">
          <el-input-number
            v-model="form.partnerOrderPrice"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-divider />
        <el-alert
          title="差价和分润说明"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        >
          <ul style="margin: 0; padding-left: 20px;">
            <li>订单差价 = 叨叨订单价格 - 合作商订单价格</li>
            <li>门店分润金额 = 订单差价 × 门店分润比例（默认30%）</li>
            <li>平台收益 = 订单差价 - 门店分润金额</li>
          </ul>
        </el-alert>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getPartnerList,
  getPartnerOrders,
  createPartnerOrder,
  updatePartnerOrder,
  type PartnerOrder,
  type CreatePartnerOrderParams
} from '@/api/partner'
import { exportToCSV } from '@/utils/export'

// 搜索表单
const searchForm = ref({
  partnerId: null as number | null
})

// 合作商列表
const partnerOptions = ref<Array<{ label: string; value: number }>>([])

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'select',
    prop: 'partnerId',
    label: '合作商',
    placeholder: '请选择合作商',
    options: partnerOptions
  }
]

// 表格数据
const orderList = ref<PartnerOrder[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'orderNo', label: '叨叨订单号', width: 160 },
  { prop: 'partnerName', label: '合作商', width: 120 },
  { prop: 'partnerOrderNo', label: '合作商订单号', width: 160 },
  { prop: 'daodaoOrderPrice', label: '叨叨订单价格', width: 120, slot: 'daodaoOrderPrice' },
  { prop: 'partnerOrderPrice', label: '合作商订单价格', width: 130, slot: 'partnerOrderPrice' },
  { prop: 'priceDifference', label: '订单差价', width: 100, slot: 'priceDifference' },
  { prop: 'profitSharingRatio', label: '分润比例', width: 100 },
  { prop: 'storeProfitAmount', label: '门店分润', width: 100, slot: 'storeProfitAmount' },
  { prop: 'platformProfitAmount', label: '平台收益', width: 100, slot: 'platformProfitAmount' },
  { prop: 'storeName', label: '服务门店', width: 150 },
  { prop: 'createdBy', label: '创建人', width: 100 }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '编辑',
    type: 'primary',
    icon: Edit,
    onClick: (row: PartnerOrder) => handleEdit(row)
  }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增订单信息',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate
  },
  {
    label: '导出',
    icon: Download,
    onClick: handleExport
  }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const editingId = ref<number | null>(null)

const form = reactive<CreatePartnerOrderParams>({
  orderId: 0,
  partnerId: 0,
  partnerOrderNo: '',
  partnerOrderPrice: 0
})

const formRules: FormRules = {
  orderId: [{ required: true, message: '请输入叨叨订单号', trigger: 'blur' }],
  partnerId: [{ required: true, message: '请选择合作商', trigger: 'change' }],
  partnerOrderNo: [{ required: true, message: '请输入合作商订单号', trigger: 'blur' }],
  partnerOrderPrice: [{ required: true, message: '请输入合作商订单价格', trigger: 'blur' }]
}

// 获取合作商列表
async function fetchPartnerList() {
  try {
    const { list } = await getPartnerList({ page: 1, pageSize: 100 })
    partnerOptions.value = list.map((partner) => ({
      label: partner.name,
      value: partner.id
    }))
  } catch (error) {
    console.error('获取合作商列表失败:', error)
  }
}

// 获取订单列表
async function fetchOrderList() {
  loading.value = true
  try {
    const params = {
      partnerId: searchForm.value.partnerId || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const { list, total } = await getPartnerOrders(params)
    orderList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchOrderList()
}

// 重置
function handleReset() {
  searchForm.value = {
    partnerId: null
  }
  pagination.page = 1
  fetchOrderList()
}

// 新增
function handleCreate() {
  dialogTitle.value = '新增合作商订单信息'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: PartnerOrder) {
  dialogTitle.value = '编辑合作商订单信息'
  editingId.value = row.id
  Object.assign(form, {
    orderId: row.orderId,
    partnerId: row.partnerId,
    partnerOrderNo: row.partnerOrderNo,
    partnerOrderPrice: row.partnerOrderPrice
  })
  dialogVisible.value = true
}

// 导出
function handleExport() {
  if (orderList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'orderNo', label: '叨叨订单号' },
    { key: 'partnerName', label: '合作商' },
    { key: 'partnerOrderNo', label: '合作商订单号' },
    { key: 'daodaoOrderPrice', label: '叨叨订单价格' },
    { key: 'partnerOrderPrice', label: '合作商订单价格' },
    { key: 'priceDifference', label: '订单差价' },
    { key: 'profitSharingRatio', label: '分润比例(%)' },
    { key: 'storeProfitAmount', label: '门店分润' },
    { key: 'platformProfitAmount', label: '平台收益' },
    { key: 'storeName', label: '服务门店' },
    { key: 'createdBy', label: '创建人' },
    { key: 'createdAt', label: '创建时间' }
  ]

  exportToCSV(orderList.value, columns, '合作商订单列表')
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if (editingId.value) {
      await updatePartnerOrder(editingId.value, {
        partnerOrderNo: form.partnerOrderNo,
        partnerOrderPrice: form.partnerOrderPrice
      })
      ElMessage.success('更新成功')
    } else {
      await createPartnerOrder(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchOrderList()
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
    orderId: 0,
    partnerId: 0,
    partnerOrderNo: '',
    partnerOrderPrice: 0
  })
  formRef.value?.clearValidate()
}

// 分页
function handleSizeChange(size: number) {
  pagination.pageSize = size
  fetchOrderList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchOrderList()
}

// 初始化
onMounted(() => {
  fetchPartnerList()
  fetchOrderList()
})
</script>

<style scoped lang="scss">
.partner-orders-container {
  padding: 20px;
}
</style>
