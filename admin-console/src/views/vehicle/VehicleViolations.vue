<!-- @ts-nocheck -->
<template>
  <div class="vehicle-violations-container">
    <PageHeader title="违章管理" description="管理车辆违章记录、违章处理和罚款缴纳" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="violationList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #fineAmount="{ row }">
        ¥{{ row.fineAmount }}
      </template>

      <template #status="{ row }">
        <el-tag :type="(getViolationStatusTag(row.status)) as any" size="small">
          {{ getViolationStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 新增/编辑对话框 -->
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
            <el-form-item label="车辆" prop="vehicleId">
              <el-select v-model="form.vehicleId" placeholder="请选择车辆" style="width: 100%">
                <el-option
                  v-for="option in VEHICLE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章类型" prop="violationType">
              <el-select v-model="form.violationType" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="option in VIOLATION_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="违章代码" prop="violationCode">
              <el-input v-model="form.violationCode" placeholder="请输入违章代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章日期" prop="violationDate">
              <el-date-picker
                v-model="form.violationDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="违章地点" prop="violationLocation">
          <el-input v-model="form.violationLocation" placeholder="请输入违章地点" />
        </el-form-item>
        <el-form-item label="违章描述" prop="violationDescription">
          <el-input
            v-model="form.violationDescription"
            type="textarea"
            :rows="2"
            placeholder="请输入违章描述"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="扣分" prop="penaltyPoints">
              <el-input-number
                v-model="form.penaltyPoints"
                :min="0"
                :max="12"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="罚款金额" prop="fineAmount">
              <el-input-number
                v-model="form.fineAmount"
                :min="0"
                :step="50"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="驾驶人" prop="driverName">
              <el-input v-model="form.driverName" placeholder="请输入驾驶人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶证号" prop="driverLicense">
              <el-input v-model="form.driverLicense" placeholder="请输入驾驶证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 违章详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="违章记录详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentRecord">
        <el-descriptions-item label="车牌号">
          {{ currentRecord.vehicleNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="车型">
          {{ currentRecord.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="违章类型">
          {{ currentRecord.violationType }}
        </el-descriptions-item>
        <el-descriptions-item label="违章代码">
          {{ currentRecord.violationCode }}
        </el-descriptions-item>
        <el-descriptions-item label="违章日期">
          {{ currentRecord.violationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="违章状态">
          <el-tag :type="(getViolationStatusTag(currentRecord.status)) as any" size="small">
            {{ getViolationStatusLabel(currentRecord.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="违章地点" :span="2">
          {{ currentRecord.violationLocation }}
        </el-descriptions-item>
        <el-descriptions-item label="违章描述" :span="2">
          {{ currentRecord.violationDescription }}
        </el-descriptions-item>
        <el-descriptions-item label="扣分">
          {{ currentRecord.penaltyPoints }}分
        </el-descriptions-item>
        <el-descriptions-item label="罚款金额">
          ¥{{ currentRecord.fineAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="驾驶人">
          {{ currentRecord.driverName }}
        </el-descriptions-item>
        <el-descriptions-item label="驾驶证号">
          {{ currentRecord.driverLicense }}
        </el-descriptions-item>
        <el-descriptions-item label="处理日期">
          {{ currentRecord.processDate || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="缴款日期">
          {{ currentRecord.paymentDate || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="缴款方式">
          {{ currentRecord.paymentMethod || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="处理人">
          {{ currentRecord.handler || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentRecord.remark || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Download, Warning, Clock, CircleCheck, Money } from '@element-plus/icons-vue'
import {
  getViolationRecords,
  getViolationRecordDetail,
  createViolationRecord,
  updateViolationRecord,
  deleteViolationRecord,
  processViolation,
  getViolationStats,
  type ViolationRecord,
} from '@/api/vehicle'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import { useErrorHandler, useEnumLabel } from '@/composables'
import { VIOLATION_STATUS_OPTIONS } from '@/constants'
import { exportToCSV } from '@/utils/export'

// Composables
const { handleApiError } = useErrorHandler()
const { getViolationStatusLabel } = useEnumLabel()

// 违章类型选项
const VIOLATION_TYPE_OPTIONS = [
  { label: '超速行驶', value: '超速行驶' },
  { label: '违法停车', value: '违法停车' },
  { label: '闯红灯', value: '闯红灯' },
  { label: '未系安全带', value: '未系安全带' },
  { label: '违法变道', value: '违法变道' },
]

// 车辆选项 (Mock数据)
const VEHICLE_OPTIONS = [
  { label: '京A12345 - 大通RV80', value: 1 },
  { label: '沪B67890 - 福特全顺', value: 2 },
  { label: '粤C11111 - 依维柯拖挂', value: 3 },
]

// 搜索表单
const searchForm = reactive({
  vehicleNumber: '',
  violationType: '',
  status: '',
  dateRange: [] as Date[],
})

// 统计数据
const stats = reactive({
  pendingViolations: 0,
  processingViolations: 0,
  paidViolations: 0,
  totalFines: 0,
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '待处理',
    value: stats.pendingViolations,
    icon: Warning,
    color: '#e6a23c',
  },
  {
    label: '处理中',
    value: stats.processingViolations,
    icon: Clock,
    color: '#409eff',
  },
  {
    label: '已缴款',
    value: stats.paidViolations,
    icon: CircleCheck,
    color: '#67c23a',
  },
  {
    label: '总罚款',
    value: stats.totalFines,
    icon: Money,
    color: '#f56c6c',
    format: 'currency',
  },
])

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'vehicleNumber',
    label: '车牌号',
    type: 'input',
    placeholder: '请输入车牌号',
  },
  {
    prop: 'violationType',
    label: '违章类型',
    type: 'select',
    options: VIOLATION_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '违章状态',
    type: 'select',
    options: VIOLATION_STATUS_OPTIONS,
  },
  {
    prop: 'dateRange',
    label: '时间范围',
    type: 'daterange',
    width: '240px',
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'vehicleNumber', label: '车牌号', width: 120 },
  { prop: 'modelName', label: '车型', width: 150 },
  { prop: 'violationType', label: '违章类型', width: 120 },
  { prop: 'violationLocation', label: '违章地点', minWidth: 200, showOverflowTooltip: true },
  { prop: 'violationDate', label: '违章日期', width: 120 },
  { prop: 'penaltyPoints', label: '扣分', width: 80 },
  { prop: 'fineAmount', label: '罚款', width: 100, slot: 'fineAmount' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'driverName', label: '驾驶人', width: 100 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增违章记录',
    type: 'primary',
    icon: Plus,
    onClick: handleCreate,
  },
  {
    label: '导出记录',
    icon: Download,
    onClick: handleExport,
  },
]

// 表格操作配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: handleView,
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: handleEdit,
  },
  {
    label: '处理',
    type: 'success',
    onClick: handleProcess,
    show: (row) => row.status === 'pending' || row.status === 'processing',
  },
  {
    label: '删除',
    type: 'danger',
    onClick: handleDelete,
  },
]

// 违章记录列表
const violationList = ref<ViolationRecord[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增违章记录')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  vehicleId: null as number | null,
  violationType: '',
  violationCode: '',
  violationDate: '',
  violationLocation: '',
  violationDescription: '',
  penaltyPoints: 0,
  fineAmount: 0,
  driverName: '',
  driverLicense: '',
  remark: '',
})

const formRules: FormRules = {
  vehicleId: [{ required: true, message: '请选择车辆', trigger: 'change' }],
  violationType: [{ required: true, message: '请选择违章类型', trigger: 'change' }],
  violationCode: [{ required: true, message: '请输入违章代码', trigger: 'blur' }],
  violationDate: [{ required: true, message: '请选择违章日期', trigger: 'change' }],
  violationLocation: [{ required: true, message: '请输入违章地点', trigger: 'blur' }],
  violationDescription: [{ required: true, message: '请输入违章描述', trigger: 'blur' }],
  penaltyPoints: [{ required: true, message: '请输入扣分', trigger: 'blur' }],
  fineAmount: [{ required: true, message: '请输入罚款金额', trigger: 'blur' }],
  driverName: [{ required: true, message: '请输入驾驶人姓名', trigger: 'blur' }],
  driverLicense: [{ required: true, message: '请输入驾驶证号', trigger: 'blur' }],
}

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<ViolationRecord | null>(null)

// 加载违章记录列表
const loadViolationRecords = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      vehicleNumber: searchForm.vehicleNumber,
      violationType: searchForm.violationType,
      status: searchForm.status,
    }

    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0].toISOString().split('T')[0]
      params.endDate = searchForm.dateRange[1].toISOString().split('T')[0]
    }

    const res = await getViolationRecords(params)
    violationList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载违章记录失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getViolationStats()
    stats.pendingViolations = res.data.pendingViolations
    stats.processingViolations = res.data.processingViolations
    stats.paidViolations = res.data.paidViolations
    stats.totalFines = res.data.totalFines
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadViolationRecords()
}

// 重置
const handleReset = () => {
  searchForm.vehicleNumber = ''
  searchForm.violationType = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
  loadViolationRecords()
}

// 新增违章记录
function handleCreate() {
  dialogTitle.value = '新增违章记录'
  isEdit.value = false
  dialogVisible.value = true
}

// 查看违章记录
async function handleView(row: ViolationRecord) {
  try {
    const res = await getViolationRecordDetail(row.id)
    currentRecord.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    handleApiError(error, '加载违章记录详情失败')
  }
}

// 编辑违章记录
function handleEdit(row: ViolationRecord) {
  dialogTitle.value = '编辑违章记录'
  isEdit.value = true
  form.id = row.id
  form.vehicleId = row.vehicleId
  form.violationType = row.violationType
  form.violationCode = row.violationCode
  form.violationDate = row.violationDate
  form.violationLocation = row.violationLocation
  form.violationDescription = row.violationDescription
  form.penaltyPoints = row.penaltyPoints
  form.fineAmount = row.fineAmount
  form.driverName = row.driverName
  form.driverLicense = row.driverLicense
  form.remark = row.remark || ''
  dialogVisible.value = true
}

// 处理违章
async function handleProcess(row: ViolationRecord) {
  try {
    await ElMessageBox.prompt('请输入处理备注', '处理违章', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入处理备注',
    })

    await processViolation(row.id, {
      processDate: new Date().toISOString().split('T')[0],
      handler: '当前用户',
      remark: '已处理',
    })

    ElMessage.success('处理成功')
    loadViolationRecords()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '处理失败')
    }
  }
}

// 删除违章记录
async function handleDelete(row: ViolationRecord) {
  try {
    await ElMessageBox.confirm(
      `确定要删除违章记录 "${row.violationType}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteViolationRecord(row.id)
    ElMessage.success('删除成功')
    loadViolationRecords()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const data: any = {
        vehicleId: form.vehicleId,
        vehicleNumber: '',
        modelName: '',
        violationType: form.violationType,
        violationCode: form.violationCode,
        violationDate: form.violationDate,
        violationLocation: form.violationLocation,
        violationDescription: form.violationDescription,
        penaltyPoints: form.penaltyPoints,
        fineAmount: form.fineAmount,
        driverName: form.driverName,
        driverLicense: form.driverLicense,
        remark: form.remark,
        status: 'pending',
        handler: '',
        attachments: [],
      }

      if (isEdit.value) {
        await updateViolationRecord(form.id, data)
        ElMessage.success('更新成功')
      } else {
        await createViolationRecord(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadViolationRecords()
      loadStats()
    } catch (error) {
      handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.vehicleId = null
  form.violationType = ''
  form.violationCode = ''
  form.violationDate = ''
  form.violationLocation = ''
  form.violationDescription = ''
  form.penaltyPoints = 0
  form.fineAmount = 0
  form.driverName = ''
  form.driverLicense = ''
  form.remark = ''
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadViolationRecords()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadViolationRecords()
}

// 获取违章状态标签类型
const getViolationStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    paid: 'success',
    appealing: 'info',
    cancelled: 'danger',
  }
  return tagMap[status] || 'info'
}

// 页面加载
onMounted(() => {
  loadViolationRecords()
  loadStats()
})

// 导出数据
function handleExport() {
  if (violationList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(violationList.value, columns, '违章记录')
}
</script>

<style scoped lang="scss">
.vehicle-violations-container {
  padding: 20px;
}
</style>
