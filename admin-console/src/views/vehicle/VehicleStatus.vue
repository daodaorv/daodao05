<template>
  <div class="vehicle-status-container">
    <!-- 页面标题 -->
    <PageHeader title="车辆状态管理" description="实时管理车辆可用性、维修、保养状态" />

    <!-- 统计卡片 -->
    <StatsCard :stats="statsConfig" />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="vehicleStatusList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="350"
      :show-selection="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 车辆来源列 -->
      <template #ownershipType="{ row }">
        <el-tag :type="row.ownershipType === 'crowdfunding' ? 'primary' : 'success'" size="small">
          {{ row.ownershipType === 'crowdfunding' ? '众筹车辆' : '合作车辆' }}
        </el-tag>
      </template>

      <!-- 当前状态列 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 最后更新列 -->
      <template #updatedAt="{ row }">
        {{ row.updatedAt }}
      </template>

      <!-- 状态持续时间列 -->
      <template #duration="{ row }">
        {{ getStatusDuration(row.updatedAt) }}
      </template>

      <!-- 自定义操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleViewHistory(row)">
          状态历史
        </el-button>
        <el-button
          link
          type="success"
          size="small"
          @click="handleChangeStatus(row, 'available')"
          :disabled="row.status === 'available'"
        >
          设为可用
        </el-button>
        <el-button
          link
          type="info"
          size="small"
          @click="handleChangeStatus(row, 'maintenance')"
          :disabled="row.status === 'maintenance'"
        >
          保养
        </el-button>
        <el-button
          link
          type="warning"
          size="small"
          @click="handleChangeStatus(row, 'repair')"
          :disabled="row.status === 'repair'"
        >
          维修
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="handleChangeStatus(row, 'retired')"
          :disabled="row.status === 'retired'"
        >
          退役
        </el-button>
      </template>
    </DataTable>

    <!-- 状态变更对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="statusDialogTitle"
      width="600px"
    >
      <el-form
        ref="statusFormRef"
        :model="statusForm"
        :rules="statusFormRules"
        label-width="120px"
      >
        <el-form-item label="车辆信息">
          <div>{{ currentVehicle?.vehicleNumber }} - {{ currentVehicle?.modelName }}</div>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag :type="getStatusTag(currentVehicle?.status || '')" size="small">
            {{ getStatusLabel(currentVehicle?.status || '') }}
          </el-tag>
        </el-form-item>
        <el-form-item label="变更为" prop="newStatus">
          <el-select v-model="statusForm.newStatus" placeholder="请选择新状态" style="width: 100%">
            <el-option label="可用" value="available" />
            <el-option label="租用中" value="rented" />
            <el-option label="保养中" value="maintenance" />
            <el-option label="维修中" value="repair" />
            <el-option label="已退役" value="retired" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更原因" prop="reason">
          <el-input
            v-model="statusForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入状态变更原因"
          />
        </el-form-item>
        <el-form-item label="预计恢复时间" v-if="statusForm.newStatus === 'maintenance' || statusForm.newStatus === 'repair'">
          <el-date-picker
            v-model="statusForm.estimatedRecoveryTime"
            type="datetime"
            placeholder="选择预计恢复时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="statusForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleStatusSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 状态历史对话框 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="状态变更历史"
      width="900px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="item in statusHistory"
          :key="item.id"
          :timestamp="item.createdAt"
          placement="top"
          :type="getTimelineType(item.newStatus)"
        >
          <el-card>
            <div class="history-item">
              <div class="history-header">
                <el-tag :type="getStatusTag(item.oldStatus)" size="small">
                  {{ getStatusLabel(item.oldStatus) }}
                </el-tag>
                <el-icon><Right /></el-icon>
                <el-tag :type="getStatusTag(item.newStatus)" size="small">
                  {{ getStatusLabel(item.newStatus) }}
                </el-tag>
              </div>
              <div class="history-content">
                <p><strong>变更原因：</strong>{{ item.reason }}</p>
                <p v-if="item.remark"><strong>备注：</strong>{{ item.remark }}</p>
                <p><strong>操作人：</strong>{{ item.operator }}</p>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh,
  Download,
  CircleCheck,
  CircleClose,
  Tools,
  Van,
  Right,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getVehicles,
  getVehicleStatusStats,
  getVehicleStatusHistory,
  createStatusHistory,
  type Vehicle,
  type VehicleStatusHistory,
} from '@/api/vehicle'

// 搜索表单
const searchForm = reactive({
  plateNumber: '',
  status: '',
  storeId: null as number | null,
  source: '',
})

// 统计数据
const stats = reactive({
  available: 0,
  rented: 0,
  maintenance: 0,
  repair: 0,
  retired: 0,
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '可用车辆',
    value: stats.available,
    icon: CircleCheck,
    color: '#67c23a',
  },
  {
    label: '租用中',
    value: stats.rented,
    icon: Van,
    color: '#e6a23c',
  },
  {
    label: '保养中',
    value: stats.maintenance,
    icon: Tools,
    color: '#909399',
  },
  {
    label: '维修中',
    value: stats.repair,
    icon: CircleClose,
    color: '#f56c6c',
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
    prop: 'status',
    label: '车辆状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: [
      { label: '可用', value: 'available' },
      { label: '租用中', value: 'rented' },
      { label: '保养中', value: 'maintenance' },
      { label: '维修中', value: 'repair' },
      { label: '已退役', value: 'retired' },
    ],
  },
  {
    prop: 'storeId',
    label: '所属门店',
    type: 'select',
    placeholder: '请选择门店',
    width: '150px',
    options: [
      { label: '北京朝阳店', value: 1 },
      { label: '上海浦东店', value: 2 },
      { label: '深圳南山店', value: 3 },
    ],
  },
  {
    prop: 'source',
    label: '车辆来源',
    type: 'select',
    placeholder: '请选择来源',
    width: '150px',
    options: [
      { label: '众筹车辆', value: 'crowdfunding' },
      { label: '合作车辆', value: 'cooperative' },
    ],
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'vehicleNumber', label: '车牌号', width: 120 },
  { prop: 'modelName', label: '车型', width: 150 },
  { prop: 'ownershipType', label: '车辆来源', width: 120, slot: 'ownershipType' },
  { prop: 'status', label: '当前状态', width: 120, slot: 'status' },
  { prop: 'storeName', label: '所属门店', width: 150 },
  { prop: 'location', label: '当前位置', width: 150, showOverflowTooltip: true },
  { prop: 'updatedAt', label: '最后更新', width: 180, slot: 'updatedAt' },
  { prop: 'duration', label: '状态持续时间', width: 120, slot: 'duration' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '刷新状态',
    type: 'primary',
    icon: Refresh,
    onClick: () => handleRefresh(),
  },
  {
    label: '导出状态报表',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
  {
    label: '批量设为可用',
    type: 'success',
    icon: CircleCheck,
    onClick: () => ElMessage.info('批量操作功能开发中'),
  },
  {
    label: '批量维修',
    type: 'warning',
    icon: Tools,
    onClick: () => ElMessage.info('批量操作功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 车辆状态列表
const vehicleStatusList = ref<Vehicle[]>([])

const loading = ref(false)
const selectedVehicles = ref<Vehicle[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 状态变更对话框
const statusDialogVisible = ref(false)
const statusDialogTitle = ref('变更车辆状态')
const currentVehicle = ref<Vehicle | null>(null)
const submitLoading = ref(false)
const statusFormRef = ref<FormInstance>()

const statusForm = reactive({
  newStatus: '',
  reason: '',
  estimatedRecoveryTime: '',
  remark: '',
})

const statusFormRules: FormRules = {
  newStatus: [
    { required: true, message: '请选择新状态', trigger: 'change' },
  ],
  reason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' },
  ],
}

// 状态历史对话框
const historyDialogVisible = ref(false)
const statusHistory = ref<VehicleStatusHistory[]>([])

// 加载车辆列表
const loadVehicles = async () => {
  loading.value = true
  try {
    const res = await getVehicles({
      page: pagination.page,
      pageSize: pagination.pageSize,
      vehicleNumber: searchForm.plateNumber,
      storeId: searchForm.storeId,
      status: searchForm.status,
      ownershipType: searchForm.source,
    })
    vehicleStatusList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('加载车辆列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getVehicleStatusStats()
    Object.assign(stats, res.data)
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadVehicles()
}

// 重置
const handleReset = () => {
  searchForm.plateNumber = ''
  searchForm.status = ''
  searchForm.storeId = null
  searchForm.source = ''
  pagination.page = 1
  loadVehicles()
}

// 刷新状态
const handleRefresh = () => {
  loadVehicles()
  loadStats()
  ElMessage.success('状态已刷新')
}

// 选择变更
const handleSelectionChange = (selection: Vehicle[]) => {
  selectedVehicles.value = selection
}

// 查看状态历史
const handleViewHistory = async (row: Vehicle) => {
  currentVehicle.value = row
  try {
    const res = await getVehicleStatusHistory(row.id)
    statusHistory.value = res.data
    historyDialogVisible.value = true
  } catch (error) {
    ElMessage.error('加载状态历史失败')
  }
}

// 变更状态
const handleChangeStatus = (row: Vehicle, newStatus: string) => {
  currentVehicle.value = row
  statusForm.newStatus = newStatus
  statusForm.reason = ''
  statusForm.estimatedRecoveryTime = ''
  statusForm.remark = ''
  statusDialogTitle.value = `变更车辆状态：${row.vehicleNumber}`
  statusDialogVisible.value = true
}

// 提交状态变更
const handleStatusSubmit = async () => {
  if (!statusFormRef.value || !currentVehicle.value) return

  await statusFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await createStatusHistory({
        vehicleId: currentVehicle.value!.id,
        newStatus: statusForm.newStatus as any,
        reason: statusForm.reason,
        remark: statusForm.remark,
        estimatedRecoveryTime: statusForm.estimatedRecoveryTime,
      })

      ElMessage.success('状态变更成功')
      statusDialogVisible.value = false

      // 重新加载数据
      loadVehicles()
      loadStats()
    } catch (error) {
      ElMessage.error('状态变更失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadVehicles()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadVehicles()
}

// 计算状态持续时间
const getStatusDuration = (updatedAt: string) => {
  const now = new Date()
  const updateTime = new Date(updatedAt)
  const diff = now.getTime() - updateTime.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}天`
  if (hours > 0) return `${hours}小时`
  if (minutes > 0) return `${minutes}分钟`
  return '刚刚'
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    available: 'success',
    rented: 'warning',
    maintenance: 'info',
    repair: 'danger',
    retired: '',
  }
  return tagMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    available: '可用',
    rented: '租用中',
    maintenance: '保养中',
    repair: '维修中',
    retired: '已退役',
  }
  return labelMap[status] || status
}

// 获取时间线类型
const getTimelineType = (status: string) => {
  const typeMap: Record<string, any> = {
    available: 'success',
    rented: 'warning',
    maintenance: 'info',
    repair: 'danger',
    retired: '',
  }
  return typeMap[status] || 'primary'
}

// 页面加载
onMounted(() => {
  loadStats()
  loadVehicles()
})
</script>

<style scoped lang="scss">
.vehicle-status-container {
  padding: 20px;

  .history-item {
    .history-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .history-content {
      p {
        margin: 8px 0;
        font-size: 14px;
        color: #606266;

        strong {
          color: #303133;
        }
      }
    }
  }
}
</style>
