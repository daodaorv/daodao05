<!-- @ts-nocheck -->
<template>
  <div class="vehicle-list-container">
    <!-- 页面标题 -->
    <PageHeader
      title="车辆列表"
      description="管理平台所有车辆档案、状态跟踪和位置管理(包含平台自有、托管、合作车辆)"
    />

    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="vehicleList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="280"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 车辆图片列 -->
      <template #images="{ row }">
        <el-image
          :src="row.images[0]"
          :preview-src-list="row.images"
          fit="cover"
          style="width: 80px; height: 60px; border-radius: 4px"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </template>

      <!-- 所有权类型列 -->
      <template #ownershipType="{ row }">
        <el-tag :type="getOwnershipTypeTag(row.ownershipType)" size="small">
          {{ getVehicleStatusLabel(row.ownershipType) }}
        </el-tag>
        <div v-if="row.ownershipType === 'hosting'" style="font-size: 12px; color: #909399; margin-top: 2px;">
          {{ row.hostingOwnerName }}
        </div>
        <div v-if="row.ownershipType === 'cooperative'" style="font-size: 12px; color: #909399; margin-top: 2px;">
          {{ row.cooperativePartnerName }}
        </div>
      </template>

      <!-- 车辆状态列 -->
      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getVehicleStatusLabel(row.status) }}
        </el-tag>
      </template>

      <!-- 总里程列 -->
      <template #currentMileage="{ row }">
        {{ row.currentMileage.toLocaleString() }}
      </template>

      <!-- 日租金列 -->
      <template #dailyPrice="{ row }">
        ¥{{ row.dailyPrice }}
      </template>
    </DataTable>

    <!-- 新增/编辑车辆对话框 -->
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
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车牌号" prop="vehicleNumber">
                  <el-input v-model="form.vehicleNumber" placeholder="请输入车牌号或生成虚拟牌照">
                    <template #append>
                      <el-button @click="handleGenerateVirtualPlate">生成虚拟牌照</el-button>
                    </template>
                  </el-input>
                  <div v-if="form.vehicleNumber" style="margin-top: 4px; font-size: 12px; color: #909399">
                    {{ formatPlateDisplay(form.vehicleNumber) }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车型" prop="modelId">
                  <el-select
                    v-model="form.modelId"
                    placeholder="请选择车型"
                    style="width: 100%"
                    @change="handleModelChange"
                  >
                    <el-option
                      v-for="model in vehicleModelsList"
                      :key="model.id"
                      :label="model.modelName"
                      :value="model.id"
                    />
                  </el-select>
                  <div v-if="selectedModelPriceInfo" style="margin-top: 4px; font-size: 12px; color: #909399">
                    建议租金范围: {{ selectedModelPriceInfo.formattedRange }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所有权类型" prop="ownershipType">
                  <el-select v-model="form.ownershipType" placeholder="请选择所有权类型" style="width: 100%">
                    <el-option
                      v-for="option in VEHICLE_STATUS_OPTIONS"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属门店" prop="storeId">
                  <el-select v-model="form.storeId" placeholder="请选择门店" style="width: 100%">
                    <el-option
                      v-for="option in STORE_OPTIONS"
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
                <el-form-item label="购入日期" prop="purchaseDate">
                  <el-date-picker
                    v-model="form.purchaseDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购入价格" prop="purchasePrice">
                  <el-input-number
                    v-model="form.purchasePrice"
                    :min="0"
                    :step="10000"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="当前里程(km)" prop="currentMileage">
                  <el-input-number
                    v-model="form.currentMileage"
                    :min="0"
                    :step="100"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日租金" prop="dailyPrice">
                  <el-input-number
                    v-model="form.dailyPrice"
                    :min="0"
                    :step="50"
                    style="width: 100%"
                  />
                  <div v-if="suggestedPrice > 0" style="margin-top: 4px; font-size: 12px; color: #67c23a">
                    建议租金: ¥{{ suggestedPrice }}
                    <el-button link type="primary" size="small" @click="applySuggestedPrice">
                      应用
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="当前位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入当前位置" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="保险信息" name="insurance">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="保险公司">
                  <el-input v-model="form.insuranceCompany" placeholder="请输入保险公司" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险到期日期">
                  <el-date-picker
                    v-model="form.insuranceExpireDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="年检日期">
              <el-date-picker
                v-model="form.annualInspectionDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="维保信息" name="maintenance">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最后保养日期">
                  <el-date-picker
                    v-model="form.lastMaintenanceDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下次保养日期">
                  <el-date-picker
                    v-model="form.nextMaintenanceDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Upload,
  Picture,
  ArrowDown,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getVehicles,
  getVehicleModels,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeVehicleStatus,
  type Vehicle,
  type VehicleModel,
} from '@/api/vehicle'
import { useErrorHandler, useEnumLabel } from '@/composables'
import { VEHICLE_STATUS_OPTIONS, STORE_OPTIONS } from '@/constants'
import { exportToCSV } from '@/utils/export'
import {
  generateVirtualPlate,
  isValidVirtualPlate,
  formatPlateDisplay,
  isVirtualPlate
} from '@/utils/vehicleHelper'
import {
  getBasePrice,
  getPriceRange,
  calculateSuggestedPrice,
  getVehicleTypePriceInfo
} from '@/utils/pricingHelper'

// Composables
const { handleApiError } = useErrorHandler()
const { getVehicleStatusLabel } = useEnumLabel()

// 搜索表单
const searchForm = reactive({
  vehicleNumber: '',
  modelId: null as number | null,
  status: '',
  storeId: null as number | null,
  ownershipType: '',
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'vehicleNumber',
    label: '车牌号',
    type: 'input',
    placeholder: '请输入车牌号',
    width: '150px',
  },
  {
    prop: 'modelId',
    label: '车型',
    type: 'select',
    placeholder: '请选择车型',
    width: '180px',
    options: [], // 动态加载
  },
  {
    prop: 'status',
    label: '车辆状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: VEHICLE_STATUS_OPTIONS,
  },
  {
    prop: 'storeId',
    label: '所属门店',
    type: 'select',
    placeholder: '请选择门店',
    width: '150px',
    options: STORE_OPTIONS,
  },
  {
    prop: 'ownershipType',
    label: '所有权类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: VEHICLE_STATUS_OPTIONS,
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'images', label: '车辆图片', width: 120, slot: 'images' },
  { prop: 'vehicleNumber', label: '车牌号', width: 120 },
  { prop: 'modelName', label: '车型', width: 180 },
  { prop: 'ownershipType', label: '所有权类型', width: 150, slot: 'ownershipType' },
  { prop: 'status', label: '车辆状态', width: 100, slot: 'status' },
  { prop: 'storeName', label: '所属门店', width: 150 },
  { prop: 'location', label: '当前位置', width: 150, showOverflowTooltip: true },
  { prop: 'currentMileage', label: '总里程(km)', width: 120, slot: 'currentMileage' },
  { prop: 'dailyPrice', label: '日租金', width: 100, slot: 'dailyPrice' },
  { prop: 'purchaseDate', label: '购入日期', width: 120 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增车辆',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
  {
    label: '导出车辆',
    icon: Download,
    onClick: handleExport,
  },
  {
    label: '导入车辆',
    icon: Upload,
    onClick: () => ElMessage.info('导入功能开发中'),
  },
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Vehicle) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Vehicle) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Vehicle) => handleDelete(row)
  }
]

// 车辆列表
const vehicleList = ref<Vehicle[]>([])
const vehicleModelsList = ref<VehicleModel[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增车辆')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const activeTab = ref('basic')

const form = reactive({
  id: 0,
  vehicleNumber: '',
  modelId: null as number | null,
  ownershipType: 'platform' as 'platform' | 'hosting' | 'cooperative',
  storeId: null as number | null,
  storeName: '',
  purchaseDate: '',
  purchasePrice: 0,
  currentMileage: 0,
  dailyPrice: 0,
  location: '',
  insuranceCompany: '',
  insuranceExpireDate: '',
  annualInspectionDate: '',
  lastMaintenanceDate: '',
  nextMaintenanceDate: '',
  remark: '',
})

// 车型价格信息
const selectedModelPriceInfo = ref<ReturnType<typeof getVehicleTypePriceInfo> | null>(null)
// 建议租金
const suggestedPrice = ref(0)

const formRules: FormRules = {
  vehicleNumber: [
    { required: true, message: '请输入车牌号', trigger: 'blur' },
  ],
  modelId: [
    { required: true, message: '请选择车型', trigger: 'change' },
  ],
  storeId: [
    { required: true, message: '请选择所属门店', trigger: 'change' },
  ],
  purchaseDate: [
    { required: true, message: '请选择购入日期', trigger: 'change' },
  ],
  purchasePrice: [
    { required: true, message: '请输入购入价格', trigger: 'blur' },
  ],
}

// 加载车辆列表
const loadVehicles = async () => {
  loading.value = true
  try {
    const res = await getVehicles({
      page: pagination.page,
      pageSize: pagination.pageSize,
      vehicleNumber: searchForm.vehicleNumber,
      modelId: searchForm.modelId,
      storeId: searchForm.storeId,
      status: searchForm.status,
      ownershipType: searchForm.ownershipType,
    })
    vehicleList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载车辆列表失败')
  } finally {
    loading.value = false
  }
}

// 加载车型列表
const loadVehicleModels = async () => {
  try {
    const res = await getVehicleModels({
      page: 1,
      pageSize: 100,
      status: 'active',
    })
    vehicleModelsList.value = res.data.list
    // 动态更新搜索字段的车型选项
    const modelField = searchFields.find(f => f.prop === 'modelId')
    if (modelField) {
      modelField.options = res.data.list.map((m: VehicleModel) => ({
        label: m.modelName,
        value: m.id,
      }))
    }
  } catch (error) {
    handleApiError(error, '加载车型列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadVehicles()
}

// 重置
const handleReset = () => {
  searchForm.vehicleNumber = ''
  searchForm.modelId = null
  searchForm.status = ''
  searchForm.storeId = null
  searchForm.ownershipType = ''
  pagination.page = 1
  loadVehicles()
}

// 新增车辆
const handleCreate = () => {
  dialogTitle.value = '新增车辆'
  isEdit.value = false
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 查看车辆
const handleView = (row: Vehicle) => {
  ElMessage.info('查看功能开发中...')
}

// 编辑车辆
const handleEdit = (row: Vehicle) => {
  dialogTitle.value = '编辑车辆'
  isEdit.value = true
  activeTab.value = 'basic'
  form.id = row.id
  form.vehicleNumber = row.vehicleNumber
  form.modelId = row.modelId
  form.storeId = row.storeId
  form.storeName = row.storeName
  form.purchaseDate = row.purchaseDate
  form.purchasePrice = row.purchasePrice
  form.currentMileage = row.currentMileage
  form.dailyPrice = row.dailyPrice
  form.location = row.location
  form.insuranceCompany = row.insuranceCompany
  form.insuranceExpireDate = row.insuranceExpireDate
  form.annualInspectionDate = row.annualInspectionDate
  form.lastMaintenanceDate = row.lastMaintenanceDate
  form.nextMaintenanceDate = row.nextMaintenanceDate
  form.remark = row.remark
  dialogVisible.value = true
}

// 状态变更
const handleStatusChange = async (row: Vehicle, status: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要将车辆 "${row.vehicleNumber}" 状态设置为"${getVehicleStatusLabel(status)}"吗？`,
      '状态变更确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await changeVehicleStatus(row.id, status as any)
    ElMessage.success('状态更新成功')
    loadVehicles()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '状态更新失败')
    }
  }
}

// 删除车辆
const handleDelete = async (row: Vehicle) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除车辆 "${row.vehicleNumber}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteVehicle(row.id)
    ElMessage.success('删除成功')
    loadVehicles()
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
      const data = {
        vehicleNumber: form.vehicleNumber,
        modelId: form.modelId!,
        ownershipType: form.ownershipType,
        storeId: form.storeId!,
        storeName: form.storeName,
        purchaseDate: form.purchaseDate,
        purchasePrice: form.purchasePrice,
        currentMileage: form.currentMileage,
        dailyPrice: form.dailyPrice,
        location: form.location,
        insuranceCompany: form.insuranceCompany,
        insuranceExpireDate: form.insuranceExpireDate,
        annualInspectionDate: form.annualInspectionDate,
        lastMaintenanceDate: form.lastMaintenanceDate,
        nextMaintenanceDate: form.nextMaintenanceDate,
        remark: form.remark,
      }

      if (isEdit.value) {
        await updateVehicle(form.id, data)
        ElMessage.success('更新成功')
      } else {
        await createVehicle(data)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadVehicles()
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
  form.vehicleNumber = ''
  form.modelId = null
  form.storeId = null
  form.storeName = ''
  form.purchaseDate = ''
  form.purchasePrice = 0
  form.currentMileage = 0
  form.dailyPrice = 0
  form.location = ''
  form.insuranceCompany = ''
  form.insuranceExpireDate = ''
  form.annualInspectionDate = ''
  form.lastMaintenanceDate = ''
  form.nextMaintenanceDate = ''
  form.remark = ''
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

// 获取状态标签类型
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

// 获取所有权类型标签类型
const getOwnershipTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    platform: 'primary',
    hosting: 'success',
    cooperative: 'warning',
  }
  return tagMap[type] || 'info'
}

// 生成虚拟牌照
const handleGenerateVirtualPlate = () => {
  // 获取所有已存在的虚拟牌照
  const existingPlates = vehicleList.value
    .map(v => v.vehicleNumber)
    .filter(plate => isVirtualPlate(plate))

  // 生成新的虚拟牌照
  const newPlate = generateVirtualPlate(form.ownershipType, existingPlates)
  form.vehicleNumber = newPlate

  ElMessage.success(`已生成虚拟牌照: ${newPlate}`)
}

// 车型变更处理
const handleModelChange = (modelId: number) => {
  const selectedModel = vehicleModelsList.value.find(m => m.id === modelId)
  if (!selectedModel) {
    selectedModelPriceInfo.value = null
    suggestedPrice.value = 0
    return
  }

  // 获取车型价格信息
  selectedModelPriceInfo.value = getVehicleTypePriceInfo(selectedModel.vehicleType)

  // 计算建议租金
  const purchaseYear = form.purchaseDate ? new Date(form.purchaseDate).getFullYear() : new Date().getFullYear()
  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - purchaseYear

  suggestedPrice.value = calculateSuggestedPrice({
    vehicleType: selectedModel.vehicleType,
    ownershipType: form.ownershipType,
    condition: 'good', // 默认良好
    mileage: form.currentMileage,
    age: vehicleAge
  })

  // 如果当前日租金为0,自动应用建议租金
  if (form.dailyPrice === 0) {
    form.dailyPrice = suggestedPrice.value
  }
}

// 应用建议租金
const applySuggestedPrice = () => {
  form.dailyPrice = suggestedPrice.value
  ElMessage.success('已应用建议租金')
}

// 页面加载
onMounted(() => {
  loadVehicleModels()
  loadVehicles()
})

// 导出数据
function handleExport() {
  if (vehicleList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(vehicleList.value, columns, '车辆列表')
}
</script>

<style scoped lang="scss">
.vehicle-list-container {
  padding: 20px;

  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 60px;
    background-color: #f5f7fa;
    color: #909399;
    font-size: 24px;
  }
}
</style>
