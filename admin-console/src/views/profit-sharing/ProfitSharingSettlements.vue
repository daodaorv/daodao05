<!-- 结算管理页面 -->
<template>
  <div class="profit-sharing-settlements-container">
    <PageHeader title="结算管理" description="管理各类分润结算记录和状态" />

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
          title="待结算"
          :value="`¥${stats.pendingAmount.toLocaleString()}`"
          icon="Clock"
          color="#e6a23c"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="已完成"
          :value="`¥${stats.completedAmount.toLocaleString()}`"
          icon="CircleCheck"
          color="#67c23a"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="结算数量"
          :value="stats.settlementCount"
          icon="Document"
          color="#909399"
        />
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <SearchForm :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建结算
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #settlementType="{ row }">
        <el-tag v-if="row.settlementType === 'hosting'" type="primary">托管分润</el-tag>
        <el-tag v-else-if="row.settlementType === 'cooperation'" type="success">差价分润</el-tag>
        <el-tag v-else-if="row.settlementType === 'staff'" type="warning">员工激励</el-tag>
        <el-tag v-else-if="row.settlementType === 'promotion'" type="info">推广分润</el-tag>
      </template>

      <template #status="{ row }">
        <el-tag v-if="row.status === 'pending'" type="warning">待处理</el-tag>
        <el-tag v-else-if="row.status === 'processing'" type="info">处理中</el-tag>
        <el-tag v-else-if="row.status === 'completed'" type="success">已完成</el-tag>
        <el-tag v-else-if="row.status === 'failed'" type="danger">失败</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
      </template>
    </DataTable>

    <!-- 创建结算对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="创建结算"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="结算类型" prop="settlementType">
          <el-select v-model="formData.settlementType" placeholder="请选择结算类型">
            <el-option label="托管分润" value="hosting" />
            <el-option label="差价分润" value="cooperation" />
            <el-option label="员工激励" value="staff" />
            <el-option label="推广分润" value="promotion" />
          </el-select>
        </el-form-item>
        <el-form-item label="结算月份" prop="month">
          <el-date-picker
            v-model="formData.month"
            type="month"
            placeholder="请选择月份"
            format="YYYY-MM"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item label="结算对象" prop="targetIds">
          <el-input
            v-model="formData.targetIdsStr"
            type="textarea"
            :rows="3"
            placeholder="请输入结算对象ID，多个用逗号分隔"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { profitSharingApi } from '@/api/profitSharing'
import type { Settlement, SettlementStats } from '@/api/profitSharing'

const stats = ref<SettlementStats>({
  totalAmount: 0,
  pendingAmount: 0,
  completedAmount: 0,
  settlementCount: 0,
})

const searchFields = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '结算单号/对象名称',
  },
  {
    type: 'select',
    prop: 'settlementType',
    label: '结算类型',
    placeholder: '请选择类型',
    options: [
      { label: '托管分润', value: 'hosting' },
      { label: '差价分润', value: 'cooperation' },
      { label: '员工激励', value: 'staff' },
      { label: '推广分润', value: 'promotion' },
    ],
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '待处理', value: 'pending' },
      { label: '处理中', value: 'processing' },
      { label: '已完成', value: 'completed' },
      { label: '失败', value: 'failed' },
    ],
  },
  {
    type: 'month',
    prop: 'month',
    label: '月份',
    placeholder: '请选择月份',
  },
]

const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'settlementNo', label: '结算单号', width: 150 },
  { prop: 'settlementType', label: '结算类型', width: 120, slot: 'settlementType' },
  { prop: 'targetName', label: '结算对象', width: 150 },
  { prop: 'totalAmount', label: '结算金额(元)', width: 130, formatter: (row: Settlement) => `¥${row.totalAmount.toLocaleString()}` },
  { prop: 'itemCount', label: '项目数', width: 100 },
  { prop: 'month', label: '月份', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'completedAt', label: '完成时间', width: 160 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' },
]

const tableData = ref<Settlement[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  settlementType: '',
  status: '',
  month: '',
})

const dialogVisible = ref(false)
const submitLoading = ref(false)

const formRef = ref<FormInstance>()
const formData = reactive({
  settlementType: '',
  month: '',
  targetIdsStr: '',
})

const formRules: FormRules = {
  settlementType: [{ required: true, message: '请选择结算类型', trigger: 'change' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  targetIdsStr: [{ required: true, message: '请输入结算对象ID', trigger: 'blur' }],
}

const fetchStats = async () => {
  try {
    const res = await profitSharingApi.getSettlementStats()
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
    const res = await profitSharingApi.getSettlementList({
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
    settlementType: '',
    status: '',
    month: '',
  })
  pagination.currentPage = 1
  fetchList()
}

const handlePageChange = (page: number) => {
  pagination.currentPage = page
  fetchList()
}

const handleCreate = () => {
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const targetIds = formData.targetIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))

      await profitSharingApi.createSettlement({
        settlementType: formData.settlementType as any,
        targetIds,
        month: formData.month,
      })
      ElMessage.success('创建成功')
      dialogVisible.value = false
      fetchStats()
      fetchList()
    } catch (error) {
      console.error('创建失败:', error)
      ElMessage.error('创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleView = (row: Settlement) => {
  ElMessage.info(`查看详情: ${row.settlementNo}`)
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.profit-sharing-settlements-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }

  .toolbar {
    margin-bottom: 16px;
  }
}
</style>
