<!-- @ts-nocheck -->
<template>
  <div class="vehicle-maintenance-container">
    <PageHeader title="维保管理" description="管理车辆维修保养计划、记录和成本" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="maintenanceList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="250"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #type="{ row }">
        <el-tag :type="(getMaintenanceTypeTag(row.type)) as any" size="small">
          {{ getVehicleStatusLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="(getMaintenanceStatusTag(row.status)) as any" size="small">
          {{ getVehicleStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #cost="{ row }">
        ¥{{ row.cost.toLocaleString() }}
      </template>
    </DataTable>

    <!-- 新增/编辑维保记录对话框 -->
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
            <el-form-item label="维保类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="option in MAINTENANCE_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="维保内容" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入维保内容"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务商" prop="serviceProvider">
              <el-input v-model="form.serviceProvider" placeholder="请输入服务商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划日期" prop="scheduledDate">
              <el-date-picker
                v-model="form.scheduledDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计费用" prop="estimatedCost">
              <el-input-number
                v-model="form.estimatedCost"
                :min="0"
                :step="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="当前里程">
              <el-input-number
                v-model="form.currentMileage"
                :min="0"
                :step="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次保养里程">
              <el-input-number
                v-model="form.nextMaintenanceMileage"
                :min="0"
                :step="1000"
                style="width: 100%"
              />
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

    <!-- 维保详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="维保记录详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentRecord">
        <el-descriptions-item label="车牌号">
          {{ currentRecord.vehicleNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="车型">
          {{ currentRecord.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="维保类型">
          <el-tag :type="(getMaintenanceTypeTag(currentRecord.type)) as any" size="small">
            {{ getVehicleStatusLabel(currentRecord.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="维保状态">
          <el-tag :type="(getMaintenanceStatusTag(currentRecord.status)) as any" size="small">
            {{ getVehicleStatusLabel(currentRecord.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="维保内容" :span="2">
          {{ currentRecord.description }}
        </el-descriptions-item>
        <el-descriptions-item label="服务商">
          {{ currentRecord.serviceProvider }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ (currentRecord as any).contactPhone ?? '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="计划日期">
          {{ currentRecord.maintenanceDate }}
        </el-descriptions-item>
        <el-descriptions-item label="完成日期">
          {{ currentRecord.completionDate || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="工时费">
          ¥{{ (currentRecord.laborCost ?? 0).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="配件费">
          ¥{{ (currentRecord.partsCost ?? 0).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="总费用">
          ¥{{ (currentRecord.totalCost ?? 0).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="当前里程">
          {{ currentRecord.mileage ?? 0 }}km
        </el-descriptions-item>
        <el-descriptions-item label="下次保养里程">
          {{ (currentRecord.mileage || 0) + 5000 }}km
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Calendar,
  Tools,
  CircleCheck,
  Money,
  DocumentCopy,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getMaintenanceRecords,
  getMaintenanceRecordDetail,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceStats,
  getVehicles,
  type MaintenanceRecord,
} from '@/api/vehicle'
import { useErrorHandler, useEnumLabel } from '@/composables'
import { MAINTENANCE_STATUS_OPTIONS } from '@/constants'
import { exportToCSV } from '@/utils/export'

// Composables
const { handleApiError } = useErrorHandler()
const { getVehicleStatusLabel } = useEnumLabel()

// 维保类型选项
const MAINTENANCE_TYPE_OPTIONS = [
  { label: '常规保养', value: 'regular' },
  { label: '维修', value: 'repair' },
  { label: '年检', value: 'inspection' },
  { label: '紧急维修', value: 'emergency' },
]

// 车辆选项 (Mock数据)
const VEHICLE_OPTIONS = [
  { label: '京A12345 - 大通RV80', value: 1 },
  { label: '沪B67890 - 福特全顺', value: 2 },
  { label: '粤C11111 - 依维柯拖挂', value: 3 },
]

// 搜索表单
const searchForm = reactive({
  plateNumber: '',
  type: '',
  status: '',
  dateRange: [] as Date[],
})

// 统计数据
const stats = reactive({
  planned: 0,
  inProgress: 0,
  completed: 0,
  totalCost: 0,
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '计划维保',
    value: stats.planned,
    icon: Calendar,
    color: '#409eff',
  },
  {
    label: '维保中',
    value: stats.inProgress,
    icon: Tools,
    color: '#e6a23c',
  },
  {
    label: '已完成',
    value: stats.completed,
    icon: CircleCheck,
    color: '#67c23a',
  },
  {
    label: '本月成本',
    value: stats.totalCost,
    icon: Money,
    color: '#f56c6c',
    format: 'currency',
  },
])

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'plateNumber',
    label: '车牌号',
    type: 'input',
    placeholder: '请输入车牌号',
    width: '150px',
  },
  {
    prop: 'type',
    label: '维保类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: MAINTENANCE_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '维保状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: MAINTENANCE_STATUS_OPTIONS,
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
  { prop: 'plateNumber', label: '车牌号', width: 120 },
  { prop: 'modelName', label: '车型', width: 150 },
  { prop: 'type', label: '维保类型', width: 120, slot: 'type' },
  { prop: 'description', label: '维保内容', minWidth: 200, showOverflowTooltip: true },
  { prop: 'status', label: '维保状态', width: 100, slot: 'status' },
  { prop: 'serviceProvider', label: '服务商', width: 150 },
  { prop: 'cost', label: '费用', width: 120, slot: 'cost' },
  { prop: 'scheduledDate', label: '计划日期', width: 120 },
  { prop: 'completedDate', label: '完成日期', width: 120 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增维保记录',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
  {
    label: '维保计划',
    icon: Calendar,
    onClick: () => ElMessage.info('维保计划功能开发中'),
  },
  {
    label: '导出记录',
    icon: Download,
    onClick: handleExport,
  },
  {
    label: '成本报表',
    icon: DocumentCopy,
    onClick: () => ElMessage.info('成本报表功能开发中'),
  },
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: MaintenanceRecord) => handleView(row),
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: MaintenanceRecord) => handleEdit(row),
  },
  {
    label: '完成',
    type: 'success',
    onClick: (row: MaintenanceRecord) => handleComplete(row),
    show: (row: MaintenanceRecord) => row.status !== 'completed' && row.status !== 'cancelled',
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: MaintenanceRecord) => handleDelete(row),
  },
]

// 维保记录列表
const maintenanceList = ref<MaintenanceRecord[]>([])
const vehicleList = ref<any[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 5,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增维保记录')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  vehicleId: null as number | null,
  type: '',
  description: '',
  serviceProvider: '',
  contactPhone: '',
  scheduledDate: '',
  estimatedCost: 0,
  currentMileage: 0,
  nextMaintenanceMileage: 0,
  remark: '',
})

const formRules: FormRules = {
  vehicleId: [
    { required: true, message: '请选择车辆', trigger: 'change' },
  ],
  type: [
    { required: true, message: '请选择维保类型', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入维保内容', trigger: 'blur' },
  ],
  serviceProvider: [
    { required: true, message: '请输入服务商名称', trigger: 'blur' },
  ],
  scheduledDate: [
    { required: true, message: '请选择计划日期', trigger: 'change' },
  ],
  estimatedCost: [
    { required: true, message: '请输入预计费用', trigger: 'blur' },
  ],
}

// 详情对话框
const detailDialogVisible = ref(false)
const currentRecord = ref<MaintenanceRecord | null>(null)

// 加载维保记录列表
const loadMaintenanceRecords = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      vehicleNumber: searchForm.plateNumber,
      type: searchForm.type,
      status: searchForm.status,
    }

    // 处理日期范围
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0].toISOString().split('T')[0]
      params.endDate = searchForm.dateRange[1].toISOString().split('T')[0]
    }

    const res = await getMaintenanceRecords(params)
    maintenanceList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载维保记录失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getMaintenanceStats()
    stats.planned = res.data.pendingRecords
    stats.inProgress = res.data.inProgressRecords
    stats.completed = res.data.completedRecords
    stats.totalCost = res.data.totalCost
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 加载车辆列表
const loadVehicles = async () => {
  try {
    const res = await getVehicles({ page: 1, pageSize: 100 })
    vehicleList.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载车辆列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadMaintenanceRecords()
}

// 重置
const handleReset = () => {
  searchForm.plateNumber = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
  loadMaintenanceRecords()
}

// 新增维保记录
const handleCreate = () => {
  dialogTitle.value = '新增维保记录'
  isEdit.value = false
  dialogVisible.value = true
}

// 查看维保记录
const handleView = async (row: MaintenanceRecord) => {
  try {
    const res = await getMaintenanceRecordDetail(row.id)
    currentRecord.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    handleApiError(error, '加载维保记录详情失败')
  }
}

// 编辑维保记录
const handleEdit = (row: MaintenanceRecord) => {
  dialogTitle.value = '编辑维保记录'
  isEdit.value = true
  form.id = row.id
  form.vehicleId = row.vehicleId
  form.type = row.type
  form.description = row.description
  form.serviceProvider = row.serviceProvider
  form.contactPhone = (row as any).contactPhone || ''
  form.scheduledDate = row.maintenanceDate
  form.estimatedCost = row.totalCost
  form.currentMileage = row.mileage
  form.nextMaintenanceMileage = 0
  form.remark = row.remark
  dialogVisible.value = true
}

// 完成维保
const handleComplete = async (row: MaintenanceRecord) => {
  try {
    await ElMessageBox.confirm(
      `确定要将维保记录 "${row.description}" 标记为已完成吗？`,
      '完成确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      }
    )

    await updateMaintenanceRecord(row.id, {
      status: 'completed',
      completionDate: new Date().toISOString().split('T')[0],
    })

    ElMessage.success('维保记录已完成')
    loadMaintenanceRecords()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '操作失败')
    }
  }
}

// 删除维保记录
const handleDelete = async (row: MaintenanceRecord) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除维保记录 "${row.description}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteMaintenanceRecord(row.id)
    ElMessage.success('删除成功')
    loadMaintenanceRecords()
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
        type: form.type,
        category: form.type === 'maintenance' ? '定期保养' : '故障维修',
        mileage: form.currentMileage ?? 0,
        maintenanceDate: form.scheduledDate,
        status: 'pending',
        serviceProvider: form.serviceProvider,
        serviceLocation: '',
        items: [],
        totalCost: form.estimatedCost ?? 0,
        laborCost: 0,
        partsCost: 0,
        description: form.description,
        solution: '',
        technician: '',
        inspector: '',
        remark: form.remark,
        attachments: [],
      }

      if (isEdit.value) {
        await updateMaintenanceRecord(form.id, data)
        ElMessage.success('更新成功')
      } else {
        await createMaintenanceRecord(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadMaintenanceRecords()
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
  form.type = ''
  form.description = ''
  form.serviceProvider = ''
  form.contactPhone = ''
  form.scheduledDate = ''
  form.estimatedCost = 0
  form.currentMileage = 0
  form.nextMaintenanceMileage = 0
  form.remark = ''
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadMaintenanceRecords()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadMaintenanceRecords()
}

// 获取维保类型标签类型
const getMaintenanceTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    regular: 'primary',
    repair: 'warning',
    inspection: 'success',
    emergency: 'danger',
  }
  return tagMap[type] || 'info'
}

// 获取维保状态标签类型
const getMaintenanceStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    planned: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return tagMap[status] || 'info'
}

// 页面加载
onMounted(() => {
  loadMaintenanceRecords()
  loadStats()
  loadVehicles()
})

// 导出数据
function handleExport() {
  if (maintenanceList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(maintenanceList.value, columns, '维保记录')
}
</script>

<style scoped lang="scss">
.vehicle-maintenance-container {
  padding: 20px;
}
</style>
