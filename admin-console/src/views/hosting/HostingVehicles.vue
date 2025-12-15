<!-- @ts-nocheck -->
<template>
  <div class="hosting-vehicles-container">
    <PageHeader title="托管车辆管理" description="管理托管车辆运营状态和收益数据" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="vehicleList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="150"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #vehicleNo="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleViewDetail(row)">
          {{ row.vehicleNo }}
        </span>
      </template>
      <template #vehicleInfo="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: bold">{{ row.vehicleBrand }} {{ row.vehicleModel }}</div>
          <div style="color: #909399">{{ row.licensePlate }}</div>
        </div>
      </template>
      <template #hostingType="{ row }">
        <el-tag :type="row.hostingType === 'old_car' ? 'success' : 'primary'" size="small">
          {{ row.hostingType === 'old_car' ? '自有车托管' : '购车托管' }}
        </el-tag>
      </template>
      <template #ownerInfo="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.ownerName }}</div>
          <div style="color: #909399">{{ row.ownerPhone }}</div>
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #income="{ row }">
        <div style="font-size: 12px">
          <div style="color: #f56c6c; font-weight: bold">总: ¥{{ row.totalIncome.toLocaleString() }}</div>
          <div style="color: #67c23a">车主: ¥{{ row.ownerIncome.toLocaleString() }}</div>
          <div style="color: #409eff">平台: ¥{{ row.platformIncome.toLocaleString() }}</div>
        </div>
      </template>
      <template #utilizationRate="{ row }">
        <el-progress
          :percentage="row.utilizationRate"
          :color="getUtilizationColor(row.utilizationRate)"
        />
      </template>
    </DataTable>

    <!-- 车辆详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="托管车辆详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <div v-if="currentVehicle" class="vehicle-detail">
        <!-- 基本信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
              <el-tag :type="getStatusTag(currentVehicle.status)" size="small">
                {{ getStatusLabel(currentVehicle.status) }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="车辆编号">
              {{ currentVehicle.vehicleNo }}
            </el-descriptions-item>
            <el-descriptions-item label="托管类型">
              <el-tag :type="currentVehicle.hostingType === 'old_car' ? 'success' : 'primary'" size="small">
                {{ currentVehicle.hostingType === 'old_car' ? '自有车托管' : '购车托管' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="车主姓名">
              {{ currentVehicle.ownerName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ currentVehicle.ownerPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆品牌">
              {{ currentVehicle.vehicleBrand }}
            </el-descriptions-item>
            <el-descriptions-item label="车辆型号">
              {{ currentVehicle.vehicleModel }}
            </el-descriptions-item>
            <el-descriptions-item label="车牌号">
              {{ currentVehicle.licensePlate }}
            </el-descriptions-item>
            <el-descriptions-item label="托管开始日期">
              {{ currentVehicle.hostingStartDate }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 运营数据 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>运营数据</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-label">订单数量</div>
                <div class="stat-value">{{ currentVehicle.orderCount }}单</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-label">使用率</div>
                <div class="stat-value">{{ currentVehicle.utilizationRate }}%</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-label">总收益</div>
                <div class="stat-value" style="color: #f56c6c">
                  ¥{{ currentVehicle.totalIncome.toLocaleString() }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-label">车主收益</div>
                <div class="stat-value" style="color: #67c23a">
                  ¥{{ currentVehicle.ownerIncome.toLocaleString() }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-label">平台收益</div>
                <div class="stat-value" style="color: #409eff">
                  ¥{{ currentVehicle.platformIncome.toLocaleString() }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 维保信息 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>维保信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="上次维保日期">
              {{ currentVehicle.lastMaintenanceDate }}
            </el-descriptions-item>
            <el-descriptions-item label="下次维保日期">
              {{ currentVehicle.nextMaintenanceDate }}
            </el-descriptions-item>
            <el-descriptions-item label="保险到期日期">
              {{ currentVehicle.insuranceExpireDate }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 状态管理 -->
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span>状态管理</span>
          </template>
          <el-form label-width="100px">
            <el-form-item label="当前状态">
              <el-tag :type="getStatusTag(currentVehicle.status)" size="large">
                {{ getStatusLabel(currentVehicle.status) }}
              </el-tag>
            </el-form-item>
            <el-form-item label="更改状态">
              <el-select v-model="statusForm.status" placeholder="请选择状态" style="width: 200px">
                <el-option label="运营中" value="operating" />
                <el-option label="维护中" value="maintenance" />
                <el-option label="车主自用" value="owner_using" />
                <el-option label="已下线" value="offline" />
              </el-select>
              <el-button type="primary" style="margin-left: 10px" @click="handleUpdateStatus">
                更新状态
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableAction } from '@/components/common/DataTable.vue'
import {
  getHostingVehicleList,
  updateHostingVehicleStatus,
  type HostingVehicle,
  type HostingVehicleListParams
} from '@/api/hosting'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 托管类型选项
const HOSTING_TYPE_OPTIONS = [
  { label: '自有车托管', value: 'old_car' },
  { label: '购车托管', value: 'new_car' }
]

// 车辆状态选项
const VEHICLE_STATUS_OPTIONS = [
  { label: '运营中', value: 'operating' },
  { label: '维护中', value: 'maintenance' },
  { label: '车主自用', value: 'owner_using' },
  { label: '已下线', value: 'offline' }
]

// 搜索表单
const searchForm = reactive<HostingVehicleListParams>({
  keyword: '',
  hostingType: undefined,
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '车辆编号/车主姓名/车牌号',
    width: '220px'
  },
  {
    prop: 'hostingType',
    label: '托管类型',
    type: 'select',
    placeholder: '全部类型',
    options: HOSTING_TYPE_OPTIONS,
    width: '150px'
  },
  {
    prop: 'status',
    label: '车辆状态',
    type: 'select',
    placeholder: '全部状态',
    options: VEHICLE_STATUS_OPTIONS,
    width: '150px'
  }
])

// 表格列配置
const tableColumns = computed(() => [
  { prop: 'vehicleNo', label: '车辆编号', width: 130, slot: true },
  { prop: 'vehicleInfo', label: '车辆信息', width: 180, slot: true },
  { prop: 'hostingType', label: '托管类型', width: 120, slot: true },
  { prop: 'ownerInfo', label: '车主信息', width: 140, slot: true },
  { prop: 'status', label: '车辆状态', width: 100, slot: true },
  { prop: 'orderCount', label: '订单数', width: 80 },
  { prop: 'income', label: '收益统计', width: 150, slot: true },
  { prop: 'utilizationRate', label: '使用率', width: 150, slot: true },
  { prop: 'hostingStartDate', label: '托管开始日期', width: 120 }
]) as any

// 表格操作配置
const tableActions = computed<TableAction[]>(() => [
  {
    label: '查看详情',
    type: 'primary',
    onClick: handleViewDetail
  }
])

// 数据列表
const vehicleList = ref<HostingVehicle[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentVehicle = ref<HostingVehicle | null>(null)

// 状态更新表单
const statusForm = reactive({
  status: ''
})

// 获取车辆列表
const fetchVehicleList = async () => {
  loading.value = true
  try {
    const res: any = await getHostingVehicleList({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    vehicleList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '获取车辆列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchVehicleList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.hostingType = undefined
  searchForm.status = undefined
  pagination.page = 1
  fetchVehicleList()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchVehicleList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchVehicleList()
}

// 查看详情
const handleViewDetail = (row: HostingVehicle) => {
  currentVehicle.value = row
  statusForm.status = row.status
  detailDialogVisible.value = true
}

// 更新状态
const handleUpdateStatus = async () => {
  if (!statusForm.status) {
    ElMessage.warning('请选择状态')
    return
  }

  try {
    await updateHostingVehicleStatus(currentVehicle.value!.id, statusForm.status)
    ElMessage.success('状态更新成功')
    detailDialogVisible.value = false
    fetchVehicleList()
  } catch (error) {
    handleApiError(error, '状态更新失败')
  }
}

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    operating: 'success',
    maintenance: 'warning',
    owner_using: 'primary',
    offline: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    operating: '运营中',
    maintenance: '维护中',
    owner_using: '车主自用',
    offline: '已下线'
  }
  return labelMap[status] || status
}

// 获取使用率颜色
const getUtilizationColor = (rate: number) => {
  if (rate >= 70) return '#67c23a'
  if (rate >= 50) return '#409eff'
  if (rate >= 30) return '#e6a23c'
  return '#f56c6c'
}

// 初始化
onMounted(() => {
  fetchVehicleList()
})
</script>

<style scoped lang="scss">
.hosting-vehicles-container {
  padding: 20px;
}

.vehicle-detail {
  .detail-card {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .stat-item {
    text-align: center;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
  }
}
</style>
