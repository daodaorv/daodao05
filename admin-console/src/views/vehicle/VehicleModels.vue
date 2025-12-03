<template>
  <div class="vehicle-models-container">
    <PageHeader title="车型库管理" description="管理车辆品牌、型号和配置参数" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="modelsList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="250"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #image="{ row }">
        <el-image
          :src="row.image"
          :preview-src-list="[row.image]"
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

      <template #vehicleType="{ row }">
        <el-tag :type="getVehicleTypeTag(row.vehicleType)" size="small">
          {{ getVehicleTypeLabel(row.vehicleType) }}
        </el-tag>
      </template>

      <template #seats="{ row }">
        {{ row.seats }}人
      </template>

      <template #beds="{ row }">
        {{ row.beds }}个
      </template>

      <template #dailyPrice="{ row }">
        ¥{{ row.dailyPrice }}
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status === 'active' ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          link
          :type="row.status === 'active' ? 'warning' : 'success'"
          size="small"
          @click="handleStatusChange(row)"
        >
          {{ row.status === 'active' ? '禁用' : '启用' }}
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </DataTable>

    <!-- 新增/编辑车型对话框 -->
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
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="品牌" prop="brandId">
                  <el-select v-model="form.brandId" placeholder="请选择品牌" style="width: 100%">
                    <el-option
                      v-for="brand in brandsList"
                      :key="brand.id"
                      :label="brand.name"
                      :value="brand.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车型名称" prop="modelName">
                  <el-input v-model="form.modelName" placeholder="请输入车型名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车辆类型" prop="vehicleType">
                  <el-select v-model="form.vehicleType" placeholder="请选择类型" style="width: 100%">
                    <el-option
                      v-for="option in VEHICLE_TYPE_OPTIONS"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日租金" prop="dailyPrice">
                  <el-input-number
                    v-model="form.dailyPrice"
                    :min="0"
                    :step="100"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="车型图片" prop="image">
              <el-upload
                class="image-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
              >
                <img v-if="form.image" :src="form.image" class="uploaded-image" />
                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="车型描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入车型描述"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="配置参数" name="config">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="核载人数" prop="seats">
                  <el-input-number
                    v-model="form.seats"
                    :min="1"
                    :max="20"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="床位数" prop="beds">
                  <el-input-number
                    v-model="form.beds"
                    :min="1"
                    :max="10"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车长(米)" prop="length">
                  <el-input-number
                    v-model="form.length"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车宽(米)" prop="width">
                  <el-input-number
                    v-model="form.width"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车高(米)" prop="height">
                  <el-input-number
                    v-model="form.height"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油箱容量(升)" prop="fuelCapacity">
                  <el-input-number
                    v-model="form.fuelCapacity"
                    :min="0"
                    :step="10"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="配置特点">
              <el-checkbox-group v-model="form.features">
                <el-checkbox label="空调">空调</el-checkbox>
                <el-checkbox label="冰箱">冰箱</el-checkbox>
                <el-checkbox label="微波炉">微波炉</el-checkbox>
                <el-checkbox label="卫生间">卫生间</el-checkbox>
                <el-checkbox label="淋浴">淋浴</el-checkbox>
                <el-checkbox label="太阳能">太阳能</el-checkbox>
                <el-checkbox label="发电机">发电机</el-checkbox>
                <el-checkbox label="倒车影像">倒车影像</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Upload,
  Picture,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getVehicleModels,
  createVehicleModel,
  updateVehicleModel,
  deleteVehicleModel,
  changeVehicleModelStatus,
  getBrands,
} from '@/api/vehicle'
import type { VehicleModel } from '@/mock/vehicles'
import { useErrorHandler, useEnumLabel } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()
const { getVehicleTypeLabel } = useEnumLabel()

// 车辆类型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: '自行式C型', value: 'c_type' },
  { label: '自行式B型', value: 'b_type' },
  { label: '拖挂式', value: 'trailer' },
]

// 品牌列表
interface Brand {
  id: number
  name: string
  logo: string
  status: string
}

const brandsList = ref<Brand[]>([])

// 搜索表单
const searchForm = reactive({
  brandId: null as number | null,
  keyword: '',
  vehicleType: '',
  status: '',
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'brandId',
    label: '品牌',
    type: 'select',
    placeholder: '请选择品牌',
    width: '150px',
    options: [], // 动态加载
  },
  {
    prop: 'keyword',
    label: '车型名称',
    type: 'input',
    placeholder: '请输入车型名称',
    width: '200px',
  },
  {
    prop: 'vehicleType',
    label: '车辆类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: VEHICLE_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'image', label: '车型图片', width: 120, slot: 'image' },
  { prop: 'brandName', label: '品牌', width: 120 },
  { prop: 'modelName', label: '车型名称', width: 200 },
  { prop: 'vehicleType', label: '车辆类型', width: 120, slot: 'vehicleType' },
  { prop: 'seats', label: '核载人数', width: 100, slot: 'seats' },
  { prop: 'beds', label: '床位数', width: 100, slot: 'beds' },
  { prop: 'dailyPrice', label: '日租金', width: 120, slot: 'dailyPrice' },
  { prop: 'vehicleCount', label: '车辆数量', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 180 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增车型',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
  {
    label: '导出车型',
    icon: Download,
    onClick: () => ElMessage.info('导出功能开发中'),
  },
  {
    label: '导入车型',
    icon: Upload,
    onClick: () => ElMessage.info('导入功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 车型列表
const modelsList = ref<VehicleModel[]>([])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增车型')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const activeTab = ref('basic')

const form = reactive({
  id: 0,
  brandId: null as number | null,
  modelName: '',
  vehicleType: '',
  seats: 4,
  beds: 2,
  length: 5.0,
  width: 2.0,
  height: 2.8,
  fuelCapacity: 70,
  dailyPrice: 500,
  image: '',
  description: '',
  features: [] as string[],
})

const formRules: FormRules = {
  brandId: [
    { required: true, message: '请选择品牌', trigger: 'change' },
  ],
  modelName: [
    { required: true, message: '请输入车型名称', trigger: 'blur' },
  ],
  vehicleType: [
    { required: true, message: '请选择车辆类型', trigger: 'change' },
  ],
  dailyPrice: [
    { required: true, message: '请输入日租金', trigger: 'blur' },
  ],
}

// 加载车型列表
const loadVehicleModels = async () => {
  loading.value = true
  try {
    const res = await getVehicleModels({
      page: pagination.page,
      pageSize: pagination.pageSize,
      brandId: searchForm.brandId,
      keyword: searchForm.keyword,
      vehicleType: searchForm.vehicleType,
      status: searchForm.status,
    })
    modelsList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载车型列表失败')
  } finally {
    loading.value = false
  }
}

// 加载品牌列表
const loadBrands = async () => {
  try {
    const res = await getBrands()
    brandsList.value = res.data
    // 动态更新搜索字段的品牌选项
    const brandField = searchFields.find(f => f.prop === 'brandId')
    if (brandField) {
      brandField.options = res.data.map((b: Brand) => ({
        label: b.name,
        value: b.id,
      }))
    }
  } catch (error) {
    handleApiError(error, '加载品牌列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadVehicleModels()
}

// 重置
const handleReset = () => {
  searchForm.brandId = null
  searchForm.keyword = ''
  searchForm.vehicleType = ''
  searchForm.status = ''
  pagination.page = 1
  loadVehicleModels()
}

// 新增车型
const handleCreate = () => {
  dialogTitle.value = '新增车型'
  isEdit.value = false
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 查看车型
const handleView = (row: VehicleModel) => {
  ElMessage.info('查看功能开发中...')
}

// 编辑车型
const handleEdit = (row: VehicleModel) => {
  dialogTitle.value = '编辑车型'
  isEdit.value = true
  activeTab.value = 'basic'
  form.id = row.id
  form.brandId = row.brandId
  form.modelName = row.modelName
  form.vehicleType = row.vehicleType
  form.seats = row.seats
  form.beds = row.beds
  form.length = row.length
  form.width = row.width
  form.height = row.height
  form.fuelCapacity = row.fuelCapacity
  form.dailyPrice = row.dailyPrice
  form.image = row.image
  form.description = row.description
  form.features = [...row.features]
  dialogVisible.value = true
}

// 状态变更
const handleStatusChange = async (row: VehicleModel) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  const newStatus = row.status === 'active' ? 'inactive' : 'active'

  try {
    await ElMessageBox.confirm(
      `确定要${action}车型 "${row.modelName}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await changeVehicleModelStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, `${action}失败`)
    }
  }
}

// 删除车型
const handleDelete = async (row: VehicleModel) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除车型 "${row.modelName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteVehicleModel(row.id)
    ElMessage.success('删除成功')
    loadVehicleModels()
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
      if (isEdit.value) {
        await updateVehicleModel(form.id, {
          brandId: form.brandId!,
          modelName: form.modelName,
          vehicleType: form.vehicleType as any,
          seats: form.seats,
          beds: form.beds,
          length: form.length,
          width: form.width,
          height: form.height,
          fuelCapacity: form.fuelCapacity,
          dailyPrice: form.dailyPrice,
          image: form.image,
          description: form.description,
          features: [...form.features],
        })
        ElMessage.success('更新成功')
      } else {
        await createVehicleModel({
          brandId: form.brandId!,
          modelName: form.modelName,
          vehicleType: form.vehicleType as any,
          seats: form.seats,
          beds: form.beds,
          length: form.length,
          width: form.width,
          height: form.height,
          fuelCapacity: form.fuelCapacity,
          dailyPrice: form.dailyPrice,
          image: form.image,
          description: form.description,
          features: [...form.features],
        })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadVehicleModels()
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
  form.brandId = null
  form.modelName = ''
  form.vehicleType = ''
  form.seats = 4
  form.beds = 2
  form.length = 5.0
  form.width = 2.0
  form.height = 2.8
  form.fuelCapacity = 70
  form.dailyPrice = 500
  form.image = ''
  form.description = ''
  form.features = []
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadVehicleModels()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadVehicleModels()
}

// 获取车辆类型标签类型
const getVehicleTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    c_type: 'primary',
    b_type: 'success',
    trailer: 'warning',
  }
  return tagMap[type] || 'info'
}

// 页面加载
onMounted(() => {
  loadBrands()
  loadVehicleModels()
})
</script>

<style scoped lang="scss">
.vehicle-models-container {
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

  .image-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }

    .uploaded-image {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
  }
}
</style>
