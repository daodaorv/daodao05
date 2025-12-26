<!-- @ts-nocheck -->
<template>
  <div class="store-list-container">
    

    <StatsCard :stats="statsConfig" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="storeList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      // @ts-ignore
      <template #type="{ row }">
        <el-tag :type="getStoreTypeTag(row.type)" size="small">
          {{ getStoreTypeLabel(row.type) }}
        </el-tag>
      </template>
      // @ts-ignore
      <template #status="{ row }">
        <el-tag :type="getStoreStatusTag(row.status)" size="small">
          {{ getStoreStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #monthlyRevenue="{ row }">
        ¥{{ row.monthlyRevenue.toLocaleString() }}
      </template>
      <template #rating="{ row }">
        <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
      </template>
    </DataTable>

    <!-- 新增/编辑门店对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
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
            <el-form-item label="门店名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入门店名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入门店编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择门店类型" style="width: 100%">
                <el-option
                  v-for="option in STORE_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option
                  v-for="option in STORE_STATUS_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type === 'cooperative'" :gutter="20">
          <el-col :span="12">
            <el-form-item label="协助门店" prop="assistStoreId">
              <el-select v-model="form.assistStoreId" placeholder="请选择协助门店" style="width: 100%">
                <el-option
                  v-for="store in assistStoreOptions"
                  :key="store.id"
                  :label="store.name"
                  :value="store.id"
                />
              </el-select>
              <div style="color: #909399; font-size: 12px; margin-top: 4px;">
                合作商门店只负责车辆取还服务，订单咨询及管理由协助门店完成
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属城市" prop="cityId">
              <el-select
                v-model="form.cityId"
                placeholder="请选择城市"
                style="width: 100%"
                @change="handleCityChange"
              >
                <el-option
                  v-for="city in cityList"
                  :key="city.id"
                  :label="city.name"
                  :value="city.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="regionId">
              <el-select
                v-model="form.regionId"
                placeholder="请选择区域"
                style="width: 100%"
                :disabled="!form.cityId"
              >
                <el-option
                  v-for="region in filteredRegionList"
                  :key="region.id"
                  :label="region.name"
                  :value="region.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店经理" prop="managerId">
              <el-select v-model="form.managerId" placeholder="请选择门店经理" style="width: 100%">
                <el-option
                  v-for="option in MANAGER_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入门店地址">
            <template #append>
              <el-button @click="handleGeocodeAddress">获取经纬度</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业时间" prop="businessHours">
              <el-input v-model="form.businessHours" placeholder="例如：09:00-21:00" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务范围" prop="serviceScope">
              <el-select
                v-model="form.serviceScope"
                multiple
                placeholder="请选择服务范围"
                style="width: 100%"
              >
                <el-option label="租赁" value="租赁" />
                <el-option label="维修" value="维修" />
                <el-option label="保养" value="保养" />
                <el-option label="保险" value="保险" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                :precision="6"
                :step="0.000001"
                :min="-90"
                :max="90"
                placeholder="请输入纬度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                :precision="6"
                :step="0.000001"
                :min="-180"
                :max="180"
                placeholder="请输入经度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="可托管验车">
          <el-switch
            v-model="form.canHostingInspection"
            active-text="是"
            inactive-text="否"
          />
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            开启后，该门店将在小程序托管页面显示，用户可选择此门店进行线下车辆核验及交付
          </div>
        </el-form-item>
        <el-form-item label="门店图片">
          <ImageUploader
            v-model="form.images"
            :limit="12"
            :max-size="5"
          />
        </el-form-item>
        <el-form-item label="门店描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入门店描述"
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
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Shop,
  TrendCharts,
  User,
  Money
} from '@element-plus/icons-vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getStoreList,
  createStore,
  updateStore,
  deleteStore,
  getStoreStats,
  getCityList,
  getRegionList,
  type Store,
  type StoreListParams,
  type City,
  type Region
} from '@/api/store'
import { useErrorHandler } from '@/composables'
import { exportToCSV } from '@/utils/export'

// Composables
const router = useRouter()
const { handleApiError } = useErrorHandler()

// 门店类型选项
const STORE_TYPE_OPTIONS = [
  { label: '直营店', value: 'direct' },
  { label: '加盟店', value: 'franchise' },
  { label: '合作商户', value: 'cooperative' }
]

// 门店状态选项
const STORE_STATUS_OPTIONS = [
  { label: '营业中', value: 'active' },
  { label: '已停业', value: 'inactive' },
  { label: '已暂停', value: 'suspended' }
]

// 门店经理选项 (Mock数据)
const MANAGER_OPTIONS = [
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
  { label: '孙七', value: 5 },
  { label: '周八', value: 6 },
  { label: '吴九', value: 7 },
  { label: '郑十', value: 8 }
]

// 搜索表单
const searchForm = reactive<StoreListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  cityId: undefined,
  regionId: undefined
})

// 统计数据
const stats = reactive({
  totalStores: 0,
  activeStores: 0,
  directStores: 0,
  totalRevenue: 0
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '门店总数',
    value: stats.totalStores,
    icon: Shop,
    color: '#409eff'
  },
  {
    label: '营业中',
    value: stats.activeStores,
    icon: TrendCharts,
    color: '#67c23a'
  },
  {
    label: '直营店',
    value: stats.directStores,
    icon: User,
    color: '#e6a23c'
  },
  {
    label: '月度营收',
    value: stats.totalRevenue,
    icon: Money,
    color: '#f56c6c',
    format: 'currency'
  }
])

// 城市和区域列表
const cityList = ref<City[]>([])
const regionList = ref<Region[]>([])

// 协助门店选项（只包含直营店和加盟店，排除合作商户）
const assistStoreOptions = computed(() => {
  return storeList.value.filter(store =>
    store.type === 'direct' || store.type === 'franchise'
  )
})

// 根据选择的城市筛选区域
const filteredRegionList = computed(() => {
  if (!form.cityId) return []
  return regionList.value.filter(region => region.cityIds.includes(form.cityId!))
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '门店名称/编码/地址',
    width: '200px'
  },
  {
    prop: 'type',
    label: '门店类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: STORE_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '门店状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: STORE_STATUS_OPTIONS
  },
  {
    prop: 'regionId',
    label: '所属区域',
    type: 'select',
    placeholder: '请选择区域',
    width: '150px',
    options: regionList.value.map((r) => ({ label: r.name, value: r.id }))
  },
  {
    prop: 'cityId',
    label: '所属城市',
    type: 'select',
    placeholder: '请选择城市',
    width: '150px',
    options: cityList.value.map((c) => ({ label: c.name, value: c.id }))
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '门店名称', width: 150 },
  { prop: 'code', label: '门店编码', width: 120 },
  { prop: 'type', label: '门店类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'cityName', label: '所属城市', width: 100 },
  { prop: 'regionName', label: '所属区域', width: 100 },
  { prop: 'assistStoreName', label: '协助门店', width: 120 },
  { prop: 'manager', label: '门店经理', width: 100 },
  { prop: 'vehicleCount', label: '车辆数', width: 80 },
  { prop: 'employeeCount', label: '员工数', width: 80 },
  { prop: 'monthlyRevenue', label: '月度营收', width: 120, slot: 'monthlyRevenue' },
  { prop: 'rating', label: '评分', width: 150, slot: 'rating' }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增门店',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  },
  {
    label: '导出数据',
    icon: Download,
    onClick: handleExport
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Store) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Store) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Store) => handleDelete(row)
  }
]

// 门店列表
const storeList = ref<Store[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增门店')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  code: '',
  type: 'direct' as 'direct' | 'franchise' | 'cooperative',
  status: 'active' as 'active' | 'inactive' | 'suspended',
  cityId: undefined as number | undefined,
  regionId: undefined as number | undefined,
  address: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  phone: '',
  email: '',
  managerId: undefined as number | undefined,
  businessHours: '',
  serviceScope: [] as string[],
  description: '',
  canHostingInspection: false,
  assistStoreId: undefined as number | undefined,
  images: [] as string[]
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入门店名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入门店编码', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择门店类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择门店状态', trigger: 'change' }
  ],
  regionId: [
    { required: true, message: '请选择所属区域', trigger: 'change' }
  ],
  cityId: [
    { required: true, message: '请选择所属城市', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入门店地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/,
      message: '请输入正确的手机号码或座机号码',
      trigger: 'blur'
    }
  ],
  email: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          callback()
          return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  managerId: [
    { required: true, message: '请选择门店经理', trigger: 'change' }
  ],
  businessHours: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ],
  assistStoreId: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.type === 'cooperative' && !value) {
          callback(new Error('合作商门店必须选择协助门店'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 加载门店列表
const loadStoreList = async () => {
  loading.value = true
  try {
    const params: StoreListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getStoreList(params) as any
    storeList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载门店列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getStoreStats() as any
    stats.totalStores = res.data.totalStores
    stats.activeStores = res.data.activeStores
    stats.directStores = res.data.directStores
    stats.totalRevenue = res.data.totalRevenue
  } catch (error) {
    handleApiError(error, '加载统计数据失败')
  }
}

// 加载城市列表
const loadCityList = async () => {
  try {
    const res = await getCityList() as any
    cityList.value = res.data
  } catch (error) {
    handleApiError(error, '加载城市列表失败')
  }
}

// 加载区域列表
const loadRegionList = async () => {
  try {
    const res = await getRegionList() as any
    regionList.value = res.data
  } catch (error) {
    handleApiError(error, '加载区域列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadStoreList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.cityId = undefined
  searchForm.regionId = undefined
  pagination.page = 1
  loadStoreList()
}

// 新增门店
const handleCreate = () => {
  dialogTitle.value = '新增门店'
  isEdit.value = false
  dialogVisible.value = true
}

// 查看门店
const handleView = (row: Store) => {
  router.push(`/stores/detail/${row.id}`)
}

// 编辑门店
const handleEdit = (row: Store) => {
  dialogTitle.value = '编辑门店'
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.type = row.type
  form.status = row.status
  form.cityId = row.cityId
  form.regionId = row.regionId
  form.address = row.address
  form.latitude = row.latitude
  form.longitude = row.longitude
  form.phone = row.phone
  form.email = row.email
  form.managerId = row.managerId
  form.businessHours = row.businessHours
  form.serviceScope = row.serviceScope
  form.description = row.description
  form.canHostingInspection = row.canHostingInspection
  form.assistStoreId = row.assistStoreId
  form.images = row.images || []
  dialogVisible.value = true
}

// 删除门店
const handleDelete = async (row: Store) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除门店 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteStore(row.id)
    ElMessage.success('删除成功')
    loadStoreList()
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
        name: form.name,
        code: form.code,
        type: form.type,
        status: form.status,
        cityId: form.cityId!,
        regionId: form.regionId!,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        phone: form.phone,
        email: form.email,
        managerId: form.managerId!,
        businessHours: form.businessHours,
        serviceScope: form.serviceScope,
        description: form.description,
        canHostingInspection: form.canHostingInspection,
        images: form.images
      }

      // 如果是合作商门店，添加协助门店信息
      if (form.type === 'cooperative') {
        data.assistStoreId = form.assistStoreId
      }

      if (isEdit.value) {
        await updateStore(form.id, data)
        ElMessage.success('更新成功')
      } else {
        await createStore(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadStoreList()
      loadStats()
    } catch (error) {
      handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 城市变更时自动筛选区域
const handleCityChange = () => {
  // 如果当前选择的区域不在筛选后的区域列表中,则清空区域选择
  if (form.regionId) {
    const isRegionValid = filteredRegionList.value.some(r => r.id === form.regionId)
    if (!isRegionValid) {
      form.regionId = undefined
    }
  }
  // 如果只有一个区域选项,自动选择
  if (filteredRegionList.value.length === 1) {
    form.regionId = filteredRegionList.value[0].id
  }
}

// 根据地址获取经纬度(模拟地理编码)
const handleGeocodeAddress = () => {
  if (!form.address) {
    ElMessage.warning('请先输入门店地址')
    return
  }

  // 模拟地理编码 - 实际项目中应调用高德地图或百度地图API
  // 这里根据城市名称提供一些模拟的经纬度
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    '北京': { lat: 39.9042, lng: 116.4074 },
    '上海': { lat: 31.2304, lng: 121.4737 },
    '广州': { lat: 23.1291, lng: 113.2644 },
    '深圳': { lat: 22.5431, lng: 114.0579 },
    '成都': { lat: 30.5728, lng: 104.0668 },
    '杭州': { lat: 30.2741, lng: 120.1551 }
  }

  // 从地址中提取城市名称
  let cityFound = false
  for (const [cityName, coords] of Object.entries(cityCoordinates)) {
    if (form.address.includes(cityName)) {
      form.latitude = coords.lat
      form.longitude = coords.lng
      cityFound = true
      ElMessage.success(`已自动获取${cityName}的经纬度`)
      break
    }
  }

  if (!cityFound) {
    ElMessage.info('未能自动识别城市,请手动输入经纬度。实际项目中可接入地图API进行精确定位')
  }
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.name = ''
  form.code = ''
  form.type = 'direct'
  form.status = 'active'
  form.cityId = undefined
  form.regionId = undefined
  form.address = ''
  form.latitude = undefined
  form.longitude = undefined
  form.phone = ''
  form.email = ''
  form.managerId = undefined
  form.businessHours = ''
  form.serviceScope = []
  form.description = ''
  form.canHostingInspection = false
  form.assistStoreId = undefined
  form.images = []
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadStoreList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadStoreList()
}

// 获取门店类型标签类型
const getStoreTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    direct: 'primary',
    franchise: 'success',
    cooperative: 'warning'
  }
  return tagMap[type] || 'info'
}

// 获取门店类型标签文本
const getStoreTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    direct: '直营店',
    franchise: '加盟店',
    cooperative: '合作商户'
  }
  return labelMap[type] || type
}

// 获取门店状态标签类型
const getStoreStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    suspended: 'warning'
  }
  return tagMap[status] || 'info'
}

// 获取门店状态标签文本
const getStoreStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '营业中',
    inactive: '已停业',
    suspended: '已暂停'
  }
  return labelMap[status] || status
}

// 页面加载
onMounted(() => {
  loadCityList()
  loadRegionList()
  loadStoreList()
  loadStats()
})

// 导出数据
function handleExport() {
  if (storeList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(storeList.value, columns, '门店列表')
}
</script>

<style scoped lang="scss">
.store-list-container {
  padding: 20px;
}
</style>
