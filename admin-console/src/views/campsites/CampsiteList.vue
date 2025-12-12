<!-- @ts-nocheck -->
<template>
  <div class="campsite-list-container">
    <PageHeader title="营地管理" description="管理房车营地信息和运营状态" />

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="campsiteList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="180"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #type="{ row }">
        <el-tag :type="(getCampsiteTypeTag(row.type)) as any" size="small">
          {{ getCampsiteTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="(getCampsiteStatusTag(row.status)) as any" size="small">
          {{ getCampsiteStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #location="{ row }">
        <div>{{ row.province }} {{ row.city }} {{ row.district }}</div>
      </template>
      <template #capacity="{ row }">
        <div>
          <span style="color: #67c23a; font-weight: bold">{{ row.availableSpots }}</span>
          <span style="color: #909399"> / {{ row.capacity }}</span>
        </div>
      </template>
      <template #pricing="{ row }">
        <div style="font-size: 12px">
          <div>平日: ¥{{ row.pricePerNight }}</div>
          <div>周末: ¥{{ row.weekendPrice }}</div>
          <div>假日: ¥{{ row.holidayPrice }}</div>
        </div>
      </template>
      <template #rating="{ row }">
        <div>
          <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          <div style="font-size: 12px; color: #909399; margin-top: 4px">
            {{ row.reviewCount }}条评价
          </div>
        </div>
      </template>
      <template #revenue="{ row }">
        <span style="color: #67c23a; font-weight: bold">
          ¥{{ row.revenue.toLocaleString() }}
        </span>
      </template>
    </DataTable>

    <!-- 营地详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="营地详情"
      width="900px"
      @close="handleDetailDialogClose"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="营地名称" :span="2">
          {{ currentCampsite?.name }}
        </el-descriptions-item>
        <el-descriptions-item label="营地类型">
          <el-tag :type="(getCampsiteTypeTag(currentCampsite?.type || 'info')) as any" size="small">
            {{ getCampsiteTypeLabel(currentCampsite?.type || 'info') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运营状态">
          <el-tag :type="(getCampsiteStatusTag(currentCampsite?.status || 'info')) as any" size="small">
            {{ getCampsiteStatusLabel(currentCampsite?.status || 'info') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">
          {{ currentCampsite?.address }}
        </el-descriptions-item>
        <el-descriptions-item label="营地面积">
          {{ currentCampsite?.area }}平方米
        </el-descriptions-item>
        <el-descriptions-item label="容纳车位">
          {{ currentCampsite?.capacity }}个
        </el-descriptions-item>
        <el-descriptions-item label="可用车位">
          <span style="color: #67c23a; font-weight: bold">
            {{ currentCampsite?.availableSpots }}个
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="入住率">
          <span style="color: #409eff; font-weight: bold">
            {{ ((1 - (currentCampsite?.availableSpots || 0) / (currentCampsite?.capacity || 1)) * 100).toFixed(1) }}%
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="平日价格">
          ¥{{ currentCampsite?.pricePerNight }}/晚
        </el-descriptions-item>
        <el-descriptions-item label="周末价格">
          ¥{{ currentCampsite?.weekendPrice }}/晚
        </el-descriptions-item>
        <el-descriptions-item label="假日价格">
          ¥{{ currentCampsite?.holidayPrice }}/晚
        </el-descriptions-item>
        <el-descriptions-item label="综合评分">
          <el-rate v-model="currentCampsite!.rating" disabled show-score text-color="#ff9900" />
          <span style="margin-left: 10px; color: #909399">
            ({{ currentCampsite?.reviewCount }}条评价)
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="累计预订">
          {{ currentCampsite?.bookingCount }}次
        </el-descriptions-item>
        <el-descriptions-item label="累计营收">
          <span style="color: #67c23a; font-weight: bold">
            ¥{{ currentCampsite?.revenue.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="营业时间" :span="2">
          {{ currentCampsite?.openTime }}
          <span v-if="currentCampsite?.closeTime">
            ({{ currentCampsite?.closeTime }}期间关闭)
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="入住时间">
          {{ currentCampsite?.checkInTime }}
        </el-descriptions-item>
        <el-descriptions-item label="退房时间">
          {{ currentCampsite?.checkOutTime }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          {{ currentCampsite?.contactPerson }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ currentCampsite?.contactPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="营地设施" :span="2">
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <el-tag
              v-for="facility in currentCampsite?.facilities"
              :key="facility.id"
              :type="facility.available ? 'success' : 'info'"
              size="small"
            >
              {{ facility.name }}
              <span v-if="!facility.available">(不可用)</span>
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="营地描述" :span="2">
          {{ currentCampsite?.description }}
        </el-descriptions-item>
        <el-descriptions-item label="营地规则" :span="2">
          <pre style="white-space: pre-wrap; margin: 0">{{ currentCampsite?.rules }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="营地图片" :span="2">
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <el-tag
              v-for="(image, index) in currentCampsite?.images"
              :key="index"
              type="info"
              size="small"
            >
              图片{{ index + 1 }}
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentCampsite?.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ currentCampsite?.updatedAt }}
        </el-descriptions-item>
      </el-descriptions>
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
import { House, TrendCharts, User, Money } from '@element-plus/icons-vue'

import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction } from '@/components/common/DataTable.vue'
import {
  getCampsiteList,
  getCampsiteStats,
  getCampsiteDetail,
  type Campsite,
  type CampsiteListParams,
  type CampsiteStats
} from '@/api/campsite'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 营地类型选项
const CAMPSITE_TYPE_OPTIONS = [
  { label: '景区营地', value: 'scenic' },
  { label: '森林营地', value: 'forest' },
  { label: '湖畔营地', value: 'lakeside' },
  { label: '山地营地', value: 'mountain' },
  { label: '沙漠营地', value: 'desert' },
  { label: '草原营地', value: 'grassland' }
]

// 营地状态选项
const CAMPSITE_STATUS_OPTIONS = [
  { label: '运营中', value: 'active' },
  { label: '已停业', value: 'inactive' },
  { label: '维护中', value: 'maintenance' }
]

// 搜索表单
const searchForm = reactive<CampsiteListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  province: '',
  city: ''
})

// 统计数据
const stats = reactive<CampsiteStats>({
  totalCampsites: 0,
  activeCampsites: 0,
  totalCapacity: 0,
  occupancyRate: 0,
  totalRevenue: 0,
  todayBookings: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '营地总数',
    value: stats.totalCampsites,
    icon: House,
    color: '#409eff'
  },
  {
    label: '运营中',
    value: stats.activeCampsites,
    icon: TrendCharts,
    color: '#67c23a'
  },
  {
    label: '总容量',
    value: stats.totalCapacity,
    icon: User,
    color: '#e6a23c',
    suffix: '个车位'
  },
  {
    label: '入住率',
    value: (stats.occupancyRate * 100).toFixed(1),
    icon: TrendCharts,
    color: '#409eff',
    suffix: '%'
  },
  {
    label: '总营收',
    value: stats.totalRevenue,
    icon: Money,
    color: '#f56c6c',
    format: 'currency'
  },
  {
    label: '今日预订',
    value: stats.todayBookings,
    icon: User,
    color: '#909399'
  }
])

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '营地名称/地址',
    width: '200px'
  },
  {
    prop: 'type',
    label: '营地类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: CAMPSITE_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '运营状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: CAMPSITE_STATUS_OPTIONS
  },
  {
    prop: 'province',
    label: '省份',
    type: 'input',
    placeholder: '请输入省份',
    width: '120px'
  },
  {
    prop: 'city',
    label: '城市',
    type: 'input',
    placeholder: '请输入城市',
    width: '120px'
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '营地名称', minWidth: 200 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'location', label: '位置', width: 200, slot: 'location' },
  { prop: 'capacity', label: '车位(可用/总数)', width: 140, slot: 'capacity' },
  { prop: 'pricing', label: '价格(元/晚)', width: 120, slot: 'pricing' },
  { prop: 'rating', label: '评分', width: 180, slot: 'rating' },
  { prop: 'bookingCount', label: '预订次数', width: 100 },
  { prop: 'revenue', label: '累计营收', width: 120, slot: 'revenue' }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Campsite) => handleView(row)
  },
  {
    label: '编辑',
    type: 'warning',
    onClick: (row: Campsite) => handleEdit(row)
  },
  {
    label: '设置',
    type: 'info',
    onClick: (row: Campsite) => handleSettings(row)
  }
]

// 营地列表
const campsiteList = ref<Campsite[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 营地详情对话框
const detailDialogVisible = ref(false)
const currentCampsite = ref<Campsite | null>(null)

// 加载营地列表
const loadCampsiteList = async () => {
  loading.value = true
  try {
    const params: CampsiteListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getCampsiteList(params) as any
    campsiteList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载营地列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getCampsiteStats() as any
    Object.assign(stats, res.data)
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadCampsiteList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.province = ''
  searchForm.city = ''
  pagination.page = 1
  loadCampsiteList()
}

// 查看营地详情
const handleView = async (row: Campsite) => {
  try {
    const res = await getCampsiteDetail(row.id) as any
    currentCampsite.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    handleApiError(error, '加载营地详情失败')
  }
}

// 编辑营地
const handleEdit = (row: Campsite) => {
  ElMessage.info(`编辑营地功能开发中，营地ID: ${row.id}`)
}

// 营地设置
const handleSettings = (row: Campsite) => {
  ElMessage.info(`营地设置功能开发中，营地ID: ${row.id}`)
}

// 对话框关闭
const handleDetailDialogClose = () => {
  currentCampsite.value = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadCampsiteList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadCampsiteList()
}

// 获取营地类型标签类型
const getCampsiteTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    scenic: 'primary',
    forest: 'success',
    lakeside: 'info',
    mountain: 'warning',
    desert: 'danger',
    grassland: 'success'
  }
  return tagMap[type] || 'info'
}

// 获取营地类型标签文本
const getCampsiteTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    scenic: '景区营地',
    forest: '森林营地',
    lakeside: '湖畔营地',
    mountain: '山地营地',
    desert: '沙漠营地',
    grassland: '草原营地'
  }
  return labelMap[type] || type
}

// 获取营地状态标签类型
const getCampsiteStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    maintenance: 'warning'
  }
  return tagMap[status] || 'info'
}

// 获取营地状态标签文本
const getCampsiteStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '运营中',
    inactive: '已停业',
    maintenance: '维护中'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadCampsiteList()
  loadStats()
})
</script>

<style scoped lang="scss">
.campsite-list-container {
  padding: 20px;
}
</style>
