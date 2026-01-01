<template>
  <div class="special-offers-container">
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="offerList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #route="{ row }">
        <div style="font-size: 14px; font-weight: 500">
          {{ row.route.fromCityName }} → {{ row.route.toCityName }}
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getOfferStatusTag(row.status) as any" size="small">
          {{ getOfferStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #price="{ row }">
        <div style="font-size: 12px">
          <div style="text-decoration: line-through; color: #909399">
            原价: ¥{{ row.originalPrice }}
          </div>
          <div style="color: #f56c6c; font-weight: bold">套餐价: ¥{{ row.packagePrice }}</div>
          <div style="color: #67c23a">已省: ¥{{ row.originalPrice - row.packagePrice }}</div>
        </div>
      </template>
      <template #quota="{ row }">
        <div style="font-size: 12px">
          <div>总量: {{ row.totalQuota }}</div>
          <div :style="{ color: row.remainingQuota <= 5 ? '#f56c6c' : '#67c23a' }">
            剩余: {{ row.remainingQuota }}
          </div>
        </div>
      </template>
      <template #vehicle="{ row }">
        <div style="font-size: 12px">
          <div style="font-weight: 500">{{ row.brandName }} {{ row.modelName }}</div>
          <div style="color: #909399">{{ row.rentalDays }}天{{ row.rentalDays - 1 }}晚</div>
        </div>
      </template>
    </DataTable>

    <!-- 创建/编辑对话框 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      width="1000px"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="特惠租车详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentOffer" :column="2" border>
        <el-descriptions-item label="套餐ID">{{ currentOffer.id }}</el-descriptions-item>
        <el-descriptions-item label="路线">
          {{ currentOffer.route.fromCityName }} → {{ currentOffer.route.toCityName }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getOfferStatusTag(currentOffer.status) as any" size="small">
            {{ getOfferStatusLabel(currentOffer.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="租期"
          >{{ currentOffer.rentalDays }}天{{ currentOffer.rentalDays - 1 }}晚</el-descriptions-item
        >
        <el-descriptions-item label="原价">¥{{ currentOffer.originalPrice }}</el-descriptions-item>
        <el-descriptions-item label="套餐价">¥{{ currentOffer.packagePrice }}</el-descriptions-item>
        <el-descriptions-item label="总配额">{{ currentOffer.totalQuota }}</el-descriptions-item>
        <el-descriptions-item label="剩余配额">{{
          currentOffer.remainingQuota
        }}</el-descriptions-item>
        <el-descriptions-item label="车辆名称" :span="2">{{
          currentOffer.vehicle.name
        }}</el-descriptions-item>
        <el-descriptions-item label="车辆特色" :span="2">
          <el-tag
            v-for="(feature, index) in currentOffer.vehicle.features"
            :key="index"
            size="small"
            type="success"
            style="margin-right: 8px"
          >
            {{ feature }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="取车门店" :span="2">
          <div>{{ currentOffer.pickupStore.name }}</div>
          <div style="color: #909399; font-size: 12px">{{ currentOffer.pickupStore.address }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="还车门店" :span="2">
          <div>{{ currentOffer.returnStore.name }}</div>
          <div style="color: #909399; font-size: 12px">{{ currentOffer.returnStore.address }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="可预订时间" :span="2">
          {{ currentOffer.availableTimeRange.start }} 至 {{ currentOffer.availableTimeRange.end }}
        </el-descriptions-item>
        <el-descriptions-item label="套餐包含" :span="2">
          <div
            v-for="(item, index) in currentOffer.packageIncludes"
            :key="index"
            style="margin-bottom: 8px"
          >
            <span style="font-weight: 500">{{ item.name }}</span>
            <span style="color: #909399; margin-left: 8px">{{ item.description }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="预订须知" :span="2">
          <div
            v-for="(notice, index) in currentOffer.bookingNotices"
            :key="index"
            style="margin-bottom: 4px"
          >
            {{ index + 1 }}. {{ notice }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentOffer.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentOffer.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getSpecialOfferList,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  type SpecialOffer,
  type PackageListParams,
} from '@/api/marketing'
import { getStoreList, getCityList, type Store, type City } from '@/api/store'
import { getVehicles, getVehicleModelDetail, type Vehicle } from '@/api/vehicle'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

const OFFER_STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '未生效', value: 'inactive' },
  { label: '已售罄', value: 'soldout' },
]

const searchForm = reactive<PackageListParams>({
  keyword: '',
  status: undefined,
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '路线（如：杭州、千岛湖）',
    width: '200px',
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: OFFER_STATUS_OPTIONS,
  },
])

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'route', label: '路线', width: 180, slot: 'route' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'vehicle', label: '车辆信息', width: 200, slot: 'vehicle' },
  { prop: 'price', label: '价格信息', width: 160, slot: 'price' },
  { prop: 'quota', label: '配额统计', width: 120, slot: 'quota' },
  { prop: 'availableTimeRange.start', label: '开始时间', width: 120 },
  { prop: 'availableTimeRange.end', label: '结束时间', width: 120 },
]

const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增特惠租车',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: SpecialOffer) => handleView(row),
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: SpecialOffer) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: SpecialOffer) => handleDelete(row),
  },
]

const offerList = ref<SpecialOffer[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentOfferId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentOffer = ref<SpecialOffer | null>(null)

// 表单数据
const formData = reactive({
  // 路线信息
  fromCityId: null as number | null,
  fromCityName: '',
  toCityId: null as number | null,
  toCityName: '',

  // 车辆信息
  vehicleId: null as number | null,
  vehicleNumber: '',
  modelId: null as number | null,
  modelName: '',
  brandName: '',
  vehicleImages: [] as string[],
  vehicleSpecifications: [] as Array<{ label: string; value: string }>,

  // 门店信息
  pickupStoreId: null as number | null,
  returnStoreId: null as number | null,

  // 其他字段
  vehicleName: '',
  rentalDays: 3,
  originalPrice: 0,
  packagePrice: 0,
  totalQuota: 10,
  remainingQuota: 10,
  pickupStoreName: '',
  pickupStoreAddress: '',
  returnStoreName: '',
  returnStoreAddress: '',
  availableStartDate: '',
  availableEndDate: '',
  status: 'active' as const,
  announcement: '',
  vehicleFeatures: '',
  packageIncludes: '',
  bookingNotices: '',
})

// 城市、门店和车辆数据
const cities = ref<City[]>([])
const pickupStores = ref<Store[]>([])
const returnStores = ref<Store[]>([])
const availableVehicles = ref<Vehicle[]>([])

// 计算属性：城市选项
const cityOptions = computed(() =>
  cities.value.map(city => ({
    label: city.name,
    value: city.id,
  }))
)

// 计算属性：门店选项
const pickupStoreOptions = computed(() =>
  pickupStores.value.map(store => ({
    label: `${store.name} (${store.address})`,
    value: store.id,
  }))
)

const returnStoreOptions = computed(() =>
  returnStores.value.map(store => ({
    label: `${store.name} (${store.address})`,
    value: store.id,
  }))
)

// 计算属性：车辆选项
const vehicleOptions = computed(() =>
  availableVehicles.value
    .filter(v => v.status === 'available')
    .map(vehicle => ({
      label: `${vehicle.vehicleNumber} - ${vehicle.brandName} ${vehicle.modelName}`,
      value: vehicle.id,
    }))
)

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'divider',
    label: '路线信息',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'fromCityId',
        label: '出发城市',
        type: 'select',
        placeholder: '请选择出发城市',
        options: cityOptions.value,
        span: 12,
      },
      {
        prop: 'toCityId',
        label: '目的地城市',
        type: 'select',
        placeholder: '请选择目的地城市',
        options: cityOptions.value,
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '门店信息',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'pickupStoreId',
        label: '取车门店',
        type: 'select',
        placeholder: '请先选择出发城市',
        disabled: !formData.fromCityId,
        options: pickupStoreOptions.value,
        span: 12,
      },
      {
        prop: 'returnStoreId',
        label: '还车门店',
        type: 'select',
        placeholder: '请先选择目的地城市',
        disabled: !formData.toCityId,
        options: returnStoreOptions.value,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'pickupStoreAddress',
        label: '取车地址',
        type: 'input',
        placeholder: '选择门店后自动填充',
        disabled: true,
        readonly: true,
        span: 12,
      },
      {
        prop: 'returnStoreAddress',
        label: '还车地址',
        type: 'input',
        placeholder: '选择门店后自动填充',
        disabled: true,
        readonly: true,
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '车辆信息',
  },
  {
    prop: 'vehicleId',
    label: '执行车辆',
    type: 'select',
    placeholder: '请先选择取车门店',
    disabled: !formData.pickupStoreId,
    options: vehicleOptions.value,
  },
  {
    type: 'divider',
    label: '价格配额',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'rentalDays',
        label: '租期天数',
        type: 'number',
        min: 1,
        span: 8,
        tip: '单位：天',
      },
      {
        prop: 'originalPrice',
        label: '原价',
        type: 'number',
        min: 0,
        span: 8,
        tip: '单位：元',
      },
      {
        prop: 'packagePrice',
        label: '套餐价',
        type: 'number',
        min: 0,
        span: 8,
        tip: '单位：元',
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'totalQuota',
        label: '总配额',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：个',
      },
      {
        prop: 'remainingQuota',
        label: '剩余配额',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：个',
      },
    ],
  },
  {
    type: 'divider',
    label: '时间范围',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'availableStartDate',
        label: '开始时间',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12,
      },
      {
        prop: 'availableEndDate',
        label: '结束时间',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '套餐详情',
  },
  {
    prop: 'announcement',
    label: '套餐公告',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入套餐公告',
    maxlength: 500,
  },
  {
    prop: 'packageIncludes',
    label: '套餐包含',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入套餐包含内容，每行一项',
    tip: '格式：项目名称|项目描述，例如：车辆租金|3天2晚固定租期',
  },
  {
    prop: 'bookingNotices',
    label: '预订须知',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入预订须知，每行一条',
    tip: '每行一条须知',
  },
  {
    type: 'divider',
    label: '状态设置',
  },
  {
    prop: 'status',
    label: '套餐状态',
    type: 'select',
    options: OFFER_STATUS_OPTIONS,
  },
]) as any

// 表单验证规则
const formRules = {
  // 路线信息
  fromCityId: [{ required: true, message: '请选择出发城市', trigger: 'change' }],
  toCityId: [{ required: true, message: '请选择目的地城市', trigger: 'change' }],

  // 门店信息
  pickupStoreId: [{ required: true, message: '请选择取车门店', trigger: 'change' }],
  returnStoreId: [{ required: true, message: '请选择还车门店', trigger: 'change' }],

  // 车辆信息
  vehicleId: [{ required: true, message: '请选择执行车辆', trigger: 'change' }],

  // 价格配额
  rentalDays: [{ required: true, message: '请输入租期天数', trigger: 'blur' }],
  originalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  packagePrice: [{ required: true, message: '请输入套餐价', trigger: 'blur' }],
  totalQuota: [{ required: true, message: '请输入总配额', trigger: 'blur' }],
  remainingQuota: [{ required: true, message: '请输入剩余配额', trigger: 'blur' }],

  // 时间范围
  availableStartDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  availableEndDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],

  // 状态
  status: [{ required: true, message: '请选择套餐状态', trigger: 'change' }],
}

// 加载城市列表
const loadCities = async () => {
  try {
    const res = (await getCityList({ status: 'active', page: 1, pageSize: 100 })) as any
    cities.value = res.data
  } catch (error) {
    handleApiError(error, '加载城市列表失败')
  }
}

// 加载取车门店列表
const loadPickupStores = async (cityId: number) => {
  try {
    const res = (await getStoreList({ cityId, status: 'active', page: 1, pageSize: 100 })) as any
    pickupStores.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载取车门店失败')
  }
}

// 加载还车门店列表
const loadReturnStores = async (cityId: number) => {
  try {
    const res = (await getStoreList({ cityId, status: 'active', page: 1, pageSize: 100 })) as any
    returnStores.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载还车门店失败')
  }
}

// 加载可用车辆列表
const loadAvailableVehicles = async (storeId: number) => {
  try {
    const res = (await getVehicles({ storeId, status: 'available', page: 1, pageSize: 100 })) as any
    availableVehicles.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载可用车辆失败')
  }
}

// 加载车型详情
const loadVehicleModelDetails = async (modelId: number) => {
  try {
    const res = (await getVehicleModelDetail(modelId)) as any
    const model = res.data

    // 自动填充规格和特色
    formData.vehicleSpecifications = [
      { label: '车型', value: model.vehicleType },
      { label: '座位数', value: `${model.seats}座` },
      { label: '床位数', value: `${model.beds}床` },
      { label: '车长', value: `${model.length}米` },
    ]
    formData.vehicleFeatures = model.features.join(',')
  } catch (error) {
    handleApiError(error, '加载车型详情失败')
  }
}

const loadOfferList = async () => {
  loading.value = true
  try {
    const params: PackageListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = (await getSpecialOfferList(params)) as any
    offerList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载特惠租车列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadOfferList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  pagination.page = 1
  loadOfferList()
}

// 重置表单
const resetForm = () => {
  // 路线信息
  formData.fromCityId = null
  formData.fromCityName = ''
  formData.toCityId = null
  formData.toCityName = ''

  // 车辆信息
  formData.vehicleId = null
  formData.vehicleNumber = ''
  formData.modelId = null
  formData.modelName = ''
  formData.brandName = ''
  formData.vehicleImages = []
  formData.vehicleSpecifications = []
  formData.vehicleName = ''

  // 门店信息
  formData.pickupStoreId = null
  formData.returnStoreId = null
  formData.pickupStoreName = ''
  formData.pickupStoreAddress = ''
  formData.returnStoreName = ''
  formData.returnStoreAddress = ''

  // 其他字段
  formData.rentalDays = 3
  formData.originalPrice = 0
  formData.packagePrice = 0
  formData.totalQuota = 10
  formData.remainingQuota = 10
  formData.availableStartDate = ''
  formData.availableEndDate = ''
  formData.status = 'active'
  formData.announcement = ''
  formData.vehicleFeatures = ''
  formData.packageIncludes = ''
  formData.bookingNotices = ''

  // 清空门店和车辆列表
  pickupStores.value = []
  returnStores.value = []
  availableVehicles.value = []
}

// 创建特惠租车
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentOfferId.value = null
  dialogTitle.value = '新增特惠租车'
  dialogVisible.value = true
}

// 编辑特惠租车
const handleEdit = (row: SpecialOffer) => {
  resetForm()
  isEdit.value = true
  currentOfferId.value = row.id
  dialogTitle.value = '编辑特惠租车'

  // 填充路线信息
  formData.fromCityId = row.route.fromCityId
  formData.fromCityName = row.route.fromCityName
  loadPickupStores(row.route.fromCityId)

  formData.toCityId = row.route.toCityId
  formData.toCityName = row.route.toCityName
  loadReturnStores(row.route.toCityId)

  // 填充车辆信息
  formData.vehicleId = row.vehicleId
  formData.vehicleNumber = row.vehicleNumber
  formData.modelId = row.modelId
  formData.modelName = row.modelName
  formData.brandName = row.brandName
  formData.vehicleName = `${row.brandName} ${row.modelName}`

  // 填充门店信息
  formData.pickupStoreId = row.pickupStoreId
  formData.pickupStoreName = row.pickupStoreName
  formData.pickupStoreAddress = row.pickupStoreAddress
  loadAvailableVehicles(row.pickupStoreId)

  formData.returnStoreId = row.returnStoreId
  formData.returnStoreName = row.returnStoreName
  formData.returnStoreAddress = row.returnStoreAddress

  // 填充其他字段
  formData.rentalDays = row.rentalDays
  formData.originalPrice = row.originalPrice
  formData.packagePrice = row.packagePrice
  formData.totalQuota = row.totalQuota
  formData.remainingQuota = row.remainingQuota
  formData.availableStartDate = row.availableTimeRange.start
  formData.availableEndDate = row.availableTimeRange.end
  formData.status = row.status
  formData.announcement = row.announcement
  formData.vehicleFeatures = row.vehicle.features.join(',')
  formData.packageIncludes = row.packageIncludes
    .map(item => `${item.name}|${item.description}`)
    .join('\n')
  formData.bookingNotices = row.bookingNotices.join('\n')

  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    // 构建提交数据
    const submitData: Partial<SpecialOffer> = {
      route: {
        fromCityId: data.fromCityId,
        fromCityName: data.fromCityName,
        toCityId: data.toCityId,
        toCityName: data.toCityName,
      },

      // 车辆字段
      vehicleId: data.vehicleId,
      vehicleNumber: data.vehicleNumber,
      modelId: data.modelId,
      modelName: data.modelName,
      brandName: data.brandName,

      vehicle: {
        images: data.vehicleImages || [],
        specifications: data.vehicleSpecifications || [],
        features: data.vehicleFeatures
          .split(',')
          .map((f: string) => f.trim())
          .filter((f: string) => f),
      },

      // 门店字段
      pickupStoreId: data.pickupStoreId,
      pickupStoreName: data.pickupStoreName,
      pickupStoreAddress: data.pickupStoreAddress,
      returnStoreId: data.returnStoreId,
      returnStoreName: data.returnStoreName,
      returnStoreAddress: data.returnStoreAddress,

      // 其他字段
      rentalDays: data.rentalDays,
      originalPrice: data.originalPrice,
      packagePrice: data.packagePrice,
      totalQuota: data.totalQuota,
      remainingQuota: data.remainingQuota,
      availableTimeRange: {
        start: data.availableStartDate,
        end: data.availableEndDate,
      },
      status: data.status,
      announcement: data.announcement,
      packageIncludes: data.packageIncludes
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => {
          const [name, description] = line.split('|').map((s: string) => s.trim())
          return { name: name || '', description: description || '' }
        }),
      bookingNotices: data.bookingNotices
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line),
      cancellationPolicy: [],
    }

    if (isEdit.value && currentOfferId.value) {
      await updateSpecialOffer(currentOfferId.value, submitData)
      ElMessage.success('编辑成功')
    } else {
      await createSpecialOffer(submitData)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadOfferList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑特惠租车失败' : '创建特惠租车失败')
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
const handleView = (row: SpecialOffer) => {
  currentOffer.value = row
  detailDialogVisible.value = true
}

// 删除特惠租车
const handleDelete = async (row: SpecialOffer) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除特惠租车"${row.route.fromCityName}→${row.route.toCityName}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteSpecialOffer(row.id)
    ElMessage.success('删除成功')
    loadOfferList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除特惠租车失败')
    }
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadOfferList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadOfferList()
}

const getOfferStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    soldout: 'danger',
  }
  return tagMap[status] || 'info'
}

const getOfferStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
    soldout: '已售罄',
  }
  return labelMap[status] || status
}

// 监听城市选择变化
watch(
  () => formData.fromCityId,
  newCityId => {
    if (newCityId) {
      const city = cities.value.find(c => c.id === newCityId)
      if (city) {
        formData.fromCityName = city.name
      }
      // 清空取车门店和车辆
      formData.pickupStoreId = null
      formData.pickupStoreName = ''
      formData.pickupStoreAddress = ''
      formData.vehicleId = null
      pickupStores.value = []
      availableVehicles.value = []
      // 加载取车门店列表
      loadPickupStores(newCityId)
    } else {
      formData.fromCityName = ''
      formData.pickupStoreId = null
      formData.pickupStoreName = ''
      formData.pickupStoreAddress = ''
      formData.vehicleId = null
      pickupStores.value = []
      availableVehicles.value = []
    }
  }
)

watch(
  () => formData.toCityId,
  newCityId => {
    if (newCityId) {
      const city = cities.value.find(c => c.id === newCityId)
      if (city) {
        formData.toCityName = city.name
      }
      // 清空还车门店
      formData.returnStoreId = null
      formData.returnStoreName = ''
      formData.returnStoreAddress = ''
      returnStores.value = []
      // 加载还车门店列表
      loadReturnStores(newCityId)
    } else {
      formData.toCityName = ''
      formData.returnStoreId = null
      formData.returnStoreName = ''
      formData.returnStoreAddress = ''
      returnStores.value = []
    }
  }
)

// 监听门店选择变化
watch(
  () => formData.pickupStoreId,
  newStoreId => {
    if (newStoreId) {
      const store = pickupStores.value.find(s => s.id === newStoreId)
      if (store) {
        formData.pickupStoreName = store.name
        formData.pickupStoreAddress = store.address
      }
      // 清空车辆选择
      formData.vehicleId = null
      formData.vehicleNumber = ''
      formData.modelId = null
      formData.modelName = ''
      formData.brandName = ''
      formData.vehicleName = ''
      availableVehicles.value = []
      // 加载可用车辆列表
      loadAvailableVehicles(newStoreId)
    }
  }
)

watch(
  () => formData.returnStoreId,
  newStoreId => {
    if (newStoreId) {
      const store = returnStores.value.find(s => s.id === newStoreId)
      if (store) {
        formData.returnStoreName = store.name
        formData.returnStoreAddress = store.address
      }
    }
  }
)

// 监听车辆选择变化
watch(
  () => formData.vehicleId,
  newVehicleId => {
    if (newVehicleId) {
      const vehicle = availableVehicles.value.find(v => v.id === newVehicleId)
      if (vehicle) {
        formData.vehicleNumber = vehicle.vehicleNumber
        formData.modelId = vehicle.modelId
        formData.modelName = vehicle.modelName
        formData.brandName = vehicle.brandName
        formData.vehicleName = `${vehicle.brandName} ${vehicle.modelName}`
        // 加载车型详情
        if (vehicle.modelId) {
          loadVehicleModelDetails(vehicle.modelId)
        }
      }
    }
  }
)

onMounted(() => {
  loadCities()
  loadOfferList()
})
</script>

<style scoped lang="scss">
.special-offers-container {
  padding: 20px;
}
</style>
