<!-- @ts-nocheck -->
<!-- 提现审核管理页面 -->
<template>
  <div class="profit-sharing-withdrawals-container">
    <PageHeader title="提现审核" description="管理用户提现申请审核和处理" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总金额"
          :value="`¥${stats.totalAmount.toLocaleString()}`"
          icon="Money"
          color="#409eff"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="待审核"
          :value="`¥${stats.pendingAmount.toLocaleString()}`"
          icon="Clock"
          color="#e6a23c"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="已批准"
          :value="`¥${stats.approvedAmount.toLocaleString()}`"
          icon="CircleCheck"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="提现数量"
          :value="stats.withdrawalCount"
          icon="Document"
          color="#909399"
        />
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <SearchForm :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #userType="{ row }">
        <el-tag v-if="row.userType === 'owner'" type="primary">车主</el-tag>
        <el-tag v-else-if="row.userType === 'employee'" type="success">员工</el-tag>
        <el-tag v-else-if="row.userType === 'promoter'" type="warning">推广员</el-tag>
      </template>

      <template #status="{ row }">
        <el-tag v-if="row.status === 'pending'" type="warning">待审核</el-tag>
        <el-tag v-else-if="row.status === 'approved'" type="success">已批准</el-tag>
        <el-tag v-else-if="row.status === 'rejected'" type="danger">已拒绝</el-tag>
        <el-tag v-else-if="row.status === 'processing'" type="info">处理中</el-tag>
        <el-tag v-else-if="row.status === 'completed'" type="success">已完成</el-tag>
        <el-tag v-else-if="row.status === 'failed'" type="danger">失败</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button
          v-if="row.status === 'pending'"
          link
          type="success"
          size="small"
          @click="handleApprove(row)"
        >
          批准
        </el-button>
        <el-button
          v-if="row.status === 'pending'"
          link
          type="danger"
          size="small"
          @click="handleReject(row)"
        >
          拒绝
        </el-button>
        <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
      </template>
    </DataTable>

    <!-- 拒绝对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝提现"
      width="500px"
      @close="handleRejectDialogClose"
    >
      <el-form
        ref="rejectFormRef"
        :model="rejectFormData"
        :rules="rejectFormRules"
        label-width="100px"
      >
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            v-model="rejectFormData.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="rejectLoading" @click="handleRejectSubmit">
          确认拒绝
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { Withdrawal, WithdrawalStats } from '@/api/profitSharing'

const stats = ref<WithdrawalStats>({
  totalAmount: 0,
  pendingAmount: 0,
  approvedAmount: 0,
  withdrawalCount: 0,
})

const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '提现单号/用户姓名',
  },
  {
    type: 'select',
    prop: 'userType',
    label: '用户类型',
    placeholder: '请选择类型',
    options: [
      { label: '车主', value: 'owner' },
      { label: '员工', value: 'employee' },
      { label: '推广员', value: 'promoter' },
    ],
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '待审核', value: 'pending' },
      { label: '已批准', value: 'approved' },
      { label: '已拒绝', value: 'rejected' },
      { label: '处理中', value: 'processing' },
      { label: '已完成', value: 'completed' },
      { label: '失败', value: 'failed' },
    ],
  },
]

const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'withdrawalNo', label: '提现单号', width: 150 },
  { prop: 'userName', label: '用户姓名', width: 120 },
  { prop: 'userType', label: '用户类型', width: 100, slot: 'userType' },
  { prop: 'amount', label: '提现金额(元)', width: 130, formatter: (row: Withdrawal) => `¥${row.amount.toLocaleString()}` },
  { prop: 'bankName', label: '银行', width: 150 },
  { prop: 'bankAccount', label: '银行账号', width: 180 },
  { prop: 'applyReason', label: '申请原因', width: 150 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '申请时间', width: 160 },
  { prop: 'approvedAt', label: '审核时间', width: 160 },
  { prop: 'actions', label: '操作', width: 180, slot: 'actions', fixed: 'right' },
]

const tableData = ref<Withdrawal[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  userType: '',
  status: '',
})

// 拒绝对话框
const rejectDialogVisible = ref(false)
const rejectLoading = ref(false)
const currentWithdrawal = ref<Withdrawal | null>(null)

const rejectFormRef = ref<FormInstance>()
const rejectFormData = reactive({
  reason: '',
})

const rejectFormRules: FormRules = {
  reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }],
}

const fetchStats = async () => {
  try {
    const res = await profitSharingApi.getWithdrawalStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await profitSharingApi.getWithdrawalList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchParams,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = (params: any) => {
  Object.assign(searchParams, params)
  pagination.currentPage = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    keyword: '',
    userType: '',
    status: '',
  })
  pagination.currentPage = 1
  fetchList()
}

const handlePageChange = (page: number) => {
  pagination.currentPage = page
  fetchList()
}

const handleApprove = async (row: Withdrawal) => {
  try {
    await ElMessageBox.confirm(
      `确定批准 ${row.userName} 的提现申请吗？提现金额：¥${row.amount.toLocaleString()}`,
      '批准提现',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await profitSharingApi.approveWithdrawal({ id: row.id })
    ElMessage.success('批准成功')
    fetchStats()
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批准失败:', error)
      ElMessage.error('批准失败')
    }
  }
}

const handleReject = (row: Withdrawal) => {
  currentWithdrawal.value = row
  rejectDialogVisible.value = true
}

const handleRejectSubmit = async () => {
  if (!rejectFormRef.value || !currentWithdrawal.value) return

  await rejectFormRef.value.validate(async (valid) => {
    if (!valid) return

    rejectLoading.value = true
    try {
      await profitSharingApi.rejectWithdrawal({
        id: currentWithdrawal.value!.id,
        reason: rejectFormData.reason,
      })
      ElMessage.success('已拒绝')
      rejectDialogVisible.value = false
      fetchStats()
      fetchList()
    } catch (error) {
      console.error('拒绝失败:', error)
      ElMessage.error('拒绝失败')
    } finally {
      rejectLoading.value = false
    }
  })
}

const handleRejectDialogClose = () => {
  rejectFormRef.value?.resetFields()
  currentWithdrawal.value = null
}

const handleView = (row: Withdrawal) => {
  ElMessage.info(`查看详情: ${row.withdrawalNo}`)
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-withdrawals-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }
}
</style>
