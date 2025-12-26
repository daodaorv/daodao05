<!-- @ts-nocheck -->
<template>
  <div class="store-detail-container">
    

    <el-card v-if="store" class="detail-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" size="small" @click="handleEdit">
            编辑
          </el-button>
        </div>
      </template>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="门店名称">
          {{ store.name }}
        </el-descriptions-item>
        <el-descriptions-item label="门店编码">
          {{ store.code }}
        </el-descriptions-item>
        // @ts-ignore
        <el-descriptions-item label="门店类型">
          <el-tag :type="getStoreTypeTag(store.type)" size="small">
            {{ getStoreTypeLabel(store.type) }}
          </el-tag>
        </el-descriptions-item>
        // @ts-ignore
        <el-descriptions-item label="门店状态">
          <el-tag :type="getStoreStatusTag(store.status)" size="small">
            {{ getStoreStatusLabel(store.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属区域">
          {{ store.regionName }}
        </el-descriptions-item>
        <el-descriptions-item label="所属城市">
          {{ store.cityName }}
        </el-descriptions-item>
        <el-descriptions-item v-if="store.type === 'cooperative'" label="协助门店">
          {{ store.assistStoreName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="门店地址" :span="store.type === 'cooperative' ? 3 : 3">
          {{ store.address }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ store.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="电子邮箱">
          {{ store.email }}
        </el-descriptions-item>
        <el-descriptions-item label="门店经理">
          {{ store.manager }}
        </el-descriptions-item>
        <el-descriptions-item label="营业时间">
          {{ store.businessHours }}
        </el-descriptions-item>
        <el-descriptions-item label="服务范围" :span="2">
          <el-tag
            v-for="service in store.serviceScope"
            :key="service"
            size="small"
            style="margin-right: 8px"
          >
            {{ service }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="经纬度">
          {{ store.latitude }}, {{ store.longitude }}
        </el-descriptions-item>
        <el-descriptions-item label="门店评分">
          <el-rate v-model="store.rating" disabled show-score text-color="#ff9900" />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(store.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="可托管验车">
          <el-tag :type="store.canHostingInspection ? 'success' : 'info'" size="small">
            {{ store.canHostingInspection ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="门店描述" :span="3">
          {{ store.description || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <StatsCard v-if="store" :stats="statsConfig" style="margin-top: 20px" />

    <el-card v-if="store && store.images.length > 0" class="images-card">
      <template #header>
        <span>门店图片</span>
      </template>
      <div class="images-grid">
        <el-image
          v-for="(image, index) in store.images"
          :key="index"
          :src="image"
          :preview-src-list="store.images"
          :initial-index="index"
          fit="cover"
          class="store-image"
        />
      </div>
    </el-card>

    <el-card v-if="store" class="location-card">
      <template #header>
        <span>门店位置信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="门店地址" :span="2">
          {{ store.address }}
        </el-descriptions-item>
        <el-descriptions-item label="纬度">
          {{ store.latitude }}
        </el-descriptions-item>
        <el-descriptions-item label="经度">
          {{ store.longitude }}
        </el-descriptions-item>
        <el-descriptions-item label="用途说明" :span="2">
          <el-text type="info" size="small">
            经纬度信息用于小程序端获取导航、计算异地还车距离等功能
          </el-text>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="store" class="vehicles-card">
      <template #header>
        <div class="card-header">
          <span>门店车辆 ({{ storeVehicles.length }})</span>
          <el-button type="primary" size="small" @click="handleManageVehicles">
            管理车辆
          </el-button>
        </div>
      </template>
      <el-table
        v-if="storeVehicles.length > 0"
        :data="storeVehicles"
        border
        style="width: 100%"
      >
        <el-table-column prop="vehicleNumber" label="车牌号" width="120" />
        <el-table-column prop="modelName" label="车型" min-width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getVehicleStatusTag(row.status)" size="small">
              {{ getVehicleStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ownershipType" label="所有权类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.ownershipType === 'owned' ? 'success' : 'warning'" size="small">
              {{ row.ownershipType === 'owned' ? '自有' : '众筹' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mileage" label="里程(km)" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewVehicle(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无车辆数据" />
    </el-card>

    <el-card v-if="store" class="employees-card">
      <template #header>
        <div class="card-header">
          <span>门店员工 ({{ storeEmployees.length }})</span>
          <el-button type="primary" size="small" @click="handleManageEmployees">
            管理员工
          </el-button>
        </div>
      </template>
      <el-table
        v-if="storeEmployees.length > 0"
        :data="storeEmployees"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hireDate" label="入职日期" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewEmployee(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无员工数据" />
    </el-card>

    <!-- 门店特色服务卡片 -->
    <el-card class="special-services-card">
      <template #header>
        <div class="card-header">
          <span>门店特色服务 ({{ specialServices.length }})</span>
          <el-button type="primary" size="small" @click="handleCreateService">
            新增服务
          </el-button>
        </div>
      </template>
      <el-table
        v-if="specialServices.length > 0"
        :data="specialServices"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="服务名称" min-width="150" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">
              ¥{{ row.price }}/{{ row.unit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '生效中' : '未生效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isRequired" label="是否必选" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isRequired ? 'danger' : 'info'" size="small">
              {{ row.isRequired ? '必选' : '可选' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="服务说明" min-width="200" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEditService(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDeleteService(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无特色服务，点击右上角按钮添加" />
    </el-card>

    <!-- 编辑门店对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑门店"
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
                  v-for="s in assistStoreOptions"
                  :key="s.id"
                  :label="s.name"
                  :value="s.id"
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

    <!-- 门店特色服务编辑对话框 -->
    <el-dialog
      v-model="serviceDialogVisible"
      :title="serviceDialogTitle"
      width="600px"
      @close="handleServiceDialogClose"
    >
      <el-form
        ref="serviceFormRef"
        :model="serviceForm"
        :rules="serviceFormRules"
        label-width="120px"
      >
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="serviceForm.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务价格" prop="price">
              <el-input-number
                v-model="serviceForm.price"
                :min="0"
                :precision="2"
                placeholder="请输入价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费单位" prop="unit">
              <el-select v-model="serviceForm.unit" placeholder="请选择单位" style="width: 100%">
                <el-option label="次" value="次" />
                <el-option label="天" value="天" />
                <el-option label="小时" value="小时" />
                <el-option label="套" value="套" />
                <el-option label="瓶" value="瓶" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务状态" prop="status">
              <el-select v-model="serviceForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="生效中" value="active" />
                <el-option label="未生效" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否必选" prop="isRequired">
              <el-switch
                v-model="serviceForm.isRequired"
                active-text="必选"
                inactive-text="可选"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务说明" prop="description">
          <el-input
            v-model="serviceForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="serviceDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="serviceSubmitLoading" @click="handleServiceSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Shop, TrendCharts, User, Money } from '@element-plus/icons-vue'
import StatsCard from '@/components/common/StatsCard.vue'
import type { StatItem } from '@/components/common/StatsCard.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import {
  getStoreDetail,
  getStoreList,
  updateStore,
  getCityList,
  getRegionList,
  getStoreSpecialServices,
  createStoreSpecialService,
  updateStoreSpecialService,
  deleteStoreSpecialService,
  type Store,
  type City,
  type Region,
  type StoreSpecialService
} from '@/api/store'
import { getVehicles, type Vehicle } from '@/api/vehicle'
import { useErrorHandler } from '@/composables'

// Composables
const route = useRoute()
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

// 门店详情
const store = ref<Store | null>(null)
const loading = ref(false)

// 城市和区域列表
const cityList = ref<City[]>([])
const regionList = ref<Region[]>([])

// 所有门店列表（用于协助门店选择）
const allStores = ref<Store[]>([])

// 协助门店选项（只包含直营店和加盟店，排除合作商户）
const assistStoreOptions = computed(() => {
  return allStores.value.filter(s =>
    (s.type === 'direct' || s.type === 'franchise') && s.id !== store.value?.id
  )
})

// 根据选择的城市筛选区域
const filteredRegionList = computed(() => {
  if (!form.cityId) return []
  return regionList.value.filter(region => region.cityIds.includes(form.cityId!))
})

// 统计卡片配置
const statsConfig = computed<StatItem[]>(() => [
  {
    label: '车辆数量',
    value: store.value?.vehicleCount || 0,
    icon: Shop,
    color: '#409eff'
  },
  {
    label: '员工数量',
    value: store.value?.employeeCount || 0,
    icon: User,
    color: '#67c23a'
  },
  {
    label: '月度营收',
    value: store.value?.monthlyRevenue || 0,
    icon: Money,
    color: '#f56c6c',
    format: 'currency'
  },
  {
    label: '门店评分',
    value: store.value?.rating || 0,
    icon: TrendCharts,
    color: '#e6a23c',
    format: 'number',
    precision: 1
  }
])

// 对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  code: '',
  type: 'direct' as 'direct' | 'franchise' | 'cooperative',
  status: 'active' as 'active' | 'inactive' | 'suspended',
  cityId: undefined as number | undefined,
  regionId: undefined as number | undefined,
  address: '',
  phone: '',
  email: '',
  businessHours: '',
  serviceScope: [] as string[],
  description: '',
  canHostingInspection: false,
  assistStoreId: undefined as number | undefined,
  images: [] as string[],
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined
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
  businessHours: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ]
}

// 加载门店详情
const loadStoreDetail = async () => {
  const storeId = Number(route.params.id)
  if (!storeId) {
    ElMessage.error('门店ID无效')
    router.push('/store/list')
    return
  }

  loading.value = true
  try {
    const res = await getStoreDetail(storeId) as any
    store.value = res.data
  } catch (error) {
    handleApiError(error, '加载门店详情失败')
    router.push('/store/list')
  } finally {
    loading.value = false
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

// 加载所有门店列表（用于协助门店选择）
const loadAllStores = async () => {
  try {
    const res = await getStoreList({ page: 1, pageSize: 1000 }) as any
    allStores.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载门店列表失败')
  }
}

// 编辑门店
const handleEdit = () => {
  if (!store.value) return

  form.name = store.value.name
  form.code = store.value.code
  form.type = store.value.type
  form.status = store.value.status
  form.cityId = store.value.cityId
  form.regionId = store.value.regionId
  form.address = store.value.address
  form.phone = store.value.phone
  form.email = store.value.email
  form.businessHours = store.value.businessHours
  form.serviceScope = store.value.serviceScope
  form.description = store.value.description
  form.canHostingInspection = store.value.canHostingInspection
  form.assistStoreId = store.value.assistStoreId
  form.images = store.value.images || []
  form.latitude = store.value.latitude
  form.longitude = store.value.longitude
  dialogVisible.value = true
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value || !store.value) return

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
        phone: form.phone,
        email: form.email,
        businessHours: form.businessHours,
        serviceScope: form.serviceScope,
        description: form.description,
        canHostingInspection: form.canHostingInspection,
        images: form.images,
        latitude: form.latitude,
        longitude: form.longitude
      }

      // 如果是合作商门店，添加协助门店信息
      if (form.type === 'cooperative') {
        data.assistStoreId = form.assistStoreId
      }

      await updateStore(store.value.id, data)
      ElMessage.success('更新成功')
      dialogVisible.value = false
      loadStoreDetail()
    } catch (error) {
      handleApiError(error, '更新失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 加载门店车辆列表
const loadStoreVehicles = async () => {
  if (!store.value) return

  try {
    const res = await getVehicles({
      page: 1,
      pageSize: 100,
      storeId: store.value.id
    }) as any
    storeVehicles.value = res.data.list || []
  } catch (error) {
    handleApiError(error, '加载门店车辆失败')
  }
}

// 加载门店员工列表（Mock数据）
const loadStoreEmployees = async () => {
  if (!store.value) return

  // 使用Mock数据
  storeEmployees.value = [
    {
      id: 1,
      name: '张三',
      phone: '13800138001',
      position: '门店经理',
      status: 'active',
      hireDate: '2023-01-15'
    },
    {
      id: 2,
      name: '李四',
      phone: '13800138002',
      position: '销售顾问',
      status: 'active',
      hireDate: '2023-03-20'
    },
    {
      id: 3,
      name: '王五',
      phone: '13800138003',
      position: '客服专员',
      status: 'active',
      hireDate: '2023-05-10'
    }
  ]
}

// 管理车辆
const handleManageVehicles = () => {
  if (!store.value) return
  // 跳转到车辆列表页,并通过URL参数传递门店ID进行筛选
  router.push({
    path: '/vehicles/list',
    query: {
      storeId: store.value.id,
      storeName: store.value.name
    }
  })
}

// 查看车辆详情
const handleViewVehicle = (vehicle: Vehicle) => {
  router.push(`/vehicles/detail/${vehicle.id}`)
}

// 管理员工
const handleManageEmployees = () => {
  if (!store.value) return
  // 跳转到门店员工页,并通过URL参数传递门店ID进行筛选
  router.push({
    path: '/employees/store-staff',
    query: {
      storeId: store.value.id,
      storeName: store.value.name
    }
  })
}

// 查看员工详情
const handleViewEmployee = (employee: StoreEmployee) => {
  ElMessage.info(`查看员工详情: ${employee.name}`)
}

// 获取车辆状态标签类型
const getVehicleStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    available: 'success',
    rented: 'warning',
    maintenance: 'info',
    retired: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取车辆状态标签文本
const getVehicleStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    available: '可用',
    rented: '已租出',
    maintenance: '维护中',
    retired: '已退役'
  }
  return labelMap[status] || status
}

// ==================== 门店特色服务管理 ====================

// 门店特色服务列表
const specialServices = ref<StoreSpecialService[]>([])

// 门店车辆列表
const storeVehicles = ref<Vehicle[]>([])

// 门店员工列表
interface StoreEmployee {
  id: number
  name: string
  phone: string
  position: string
  status: 'active' | 'inactive'
  hireDate: string
}
const storeEmployees = ref<StoreEmployee[]>([])

// 特色服务对话框
const serviceDialogVisible = ref(false)
const serviceDialogTitle = ref('')
const serviceFormRef = ref<FormInstance>()
const serviceSubmitLoading = ref(false)
const isEditingService = ref(false)
const currentServiceId = ref<number | null>(null)

// 特色服务表单
const serviceForm = reactive({
  name: '',
  price: 0,
  unit: '次',
  status: 'active' as 'active' | 'inactive',
  isRequired: false,
  description: ''
})

// 特色服务表单验证规则
const serviceFormRules: FormRules = {
  name: [
    { required: true, message: '请输入服务名称', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入服务价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请选择计费单位', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择服务状态', trigger: 'change' }
  ]
}

// 加载门店特色服务列表
const loadSpecialServices = async () => {
  if (!store.value) return

  try {
    const res = await getStoreSpecialServices(store.value.id) as any
    specialServices.value = res.data
  } catch (error) {
    handleApiError(error, '加载门店特色服务失败')
  }
}

// 重置特色服务表单
const resetServiceForm = () => {
  serviceForm.name = ''
  serviceForm.price = 0
  serviceForm.unit = '次'
  serviceForm.status = 'active'
  serviceForm.isRequired = false
  serviceForm.description = ''
}

// 创建特色服务
const handleCreateService = () => {
  resetServiceForm()
  isEditingService.value = false
  currentServiceId.value = null
  serviceDialogTitle.value = '新增门店特色服务'
  serviceDialogVisible.value = true
}

// 编辑特色服务
const handleEditService = (row: StoreSpecialService) => {
  isEditingService.value = true
  currentServiceId.value = row.id
  serviceDialogTitle.value = '编辑门店特色服务'

  // 填充表单数据
  serviceForm.name = row.name
  serviceForm.price = row.price
  serviceForm.unit = row.unit
  serviceForm.status = row.status
  serviceForm.isRequired = row.isRequired
  serviceForm.description = row.description

  serviceDialogVisible.value = true
}

// 删除特色服务
const handleDeleteService = async (row: StoreSpecialService) => {
  if (!store.value) return

  try {
    await ElMessageBox.confirm(
      `确定要删除特色服务"${row.name}"吗?`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteStoreSpecialService(store.value.id, row.id)
    ElMessage.success('删除成功')
    loadSpecialServices()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除特色服务失败')
    }
  }
}

// 提交特色服务表单
const handleServiceSubmit = async () => {
  if (!serviceFormRef.value || !store.value) return

  await serviceFormRef.value.validate(async (valid) => {
    if (!valid) return

    serviceSubmitLoading.value = true
    try {
      const data = {
        name: serviceForm.name,
        price: serviceForm.price,
        unit: serviceForm.unit,
        status: serviceForm.status,
        isRequired: serviceForm.isRequired,
        description: serviceForm.description
      }

      if (isEditingService.value && currentServiceId.value) {
        await updateStoreSpecialService(store.value.id, currentServiceId.value, data)
        ElMessage.success('编辑成功')
      } else {
        await createStoreSpecialService(store.value.id, data)
        ElMessage.success('创建成功')
      }

      serviceDialogVisible.value = false
      loadSpecialServices()
    } catch (error) {
      handleApiError(error, isEditingService.value ? '编辑特色服务失败' : '创建特色服务失败')
    } finally {
      serviceSubmitLoading.value = false
    }
  })
}

// 特色服务对话框关闭
const handleServiceDialogClose = () => {
  serviceFormRef.value?.resetFields()
  resetServiceForm()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  loadAllStores()
  loadStoreDetail()
  loadSpecialServices()
  loadStoreVehicles()
  loadStoreEmployees()
})
</script>

<style scoped lang="scss">
.store-detail-container {
  padding: 20px;

  .detail-card,
  .images-card,
  .location-card,
  .vehicles-card,
  .employees-card,
  .special-services-card {
    margin-top: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;

    .store-image {
      width: 100%;
      height: 150px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
