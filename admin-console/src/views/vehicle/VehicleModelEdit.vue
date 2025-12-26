<!-- @ts-nocheck -->
<template>
  <div class="vehicle-model-edit-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <h2 class="page-title">{{ isEdit ? '编辑车型' : '新增车型' }}</h2>
      </div>
      <div class="header-right">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="page-content">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="model-form"
      >
        <!-- 基础信息卡片 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">基础信息</span>
            </div>
          </template>

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
        </el-card>

        <!-- 车型图片卡片 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">车型图片</span>
              <span class="card-subtitle">最多上传9张图片，用于车型详情轮播展示</span>
            </div>
          </template>

          <el-form-item prop="images">
            <div class="image-upload-container">
              <draggable
                v-model="form.images"
                class="image-list"
                item-key="uid"
                :animation="200"
              >
                <template #item="{ element, index }">
                  <div class="image-item">
                    <el-image
                      :src="element.url"
                      fit="cover"
                      class="uploaded-image"
                      :preview-src-list="form.images.map(img => img.url)"
                      :initial-index="index"
                    />
                    <div class="image-actions">
                      <el-icon class="action-icon" @click="handlePreviewImage(index)">
                        <ZoomIn />
                      </el-icon>
                      <el-icon class="action-icon" @click="handleRemoveImage(index)">
                        <Delete />
                      </el-icon>
                    </div>
                    <div v-if="index === 0" class="image-badge">封面</div>
                  </div>
                </template>
              </draggable>

              <!-- 上传按钮 -->
              <el-upload
                v-if="form.images.length < 9"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImageChange"
                accept="image/*"
                class="image-uploader"
              >
                <div class="upload-placeholder">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <div class="upload-text">上传图片</div>
                </div>
              </el-upload>
            </div>
            <div class="upload-tip">
              支持 JPG、PNG、GIF 格式，单张图片不超过 5MB，可拖拽调整顺序，第一张为封面图
            </div>
          </el-form-item>
        </el-card>

        <!-- 车型描述卡片 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">车型描述</span>
              <span class="card-subtitle">支持富文本编辑，可插入图片、视频等内容</span>
            </div>
          </template>

          <el-form-item prop="description">
            <RichTextEditor
              v-model="form.description"
              :height="'500px'"
              :upload-url="uploadUrl"
              placeholder="请输入车型详细描述，支持图片、视频、文本等内容..."
            />
          </el-form-item>
        </el-card>

        <!-- 配置参数卡片 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">配置参数</span>
            </div>
          </template>

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
              <el-checkbox value="空调">空调</el-checkbox>
              <el-checkbox value="冰箱">冰箱</el-checkbox>
              <el-checkbox value="微波炉">微波炉</el-checkbox>
              <el-checkbox value="卫生间">卫生间</el-checkbox>
              <el-checkbox value="淋浴">淋浴</el-checkbox>
              <el-checkbox value="太阳能">太阳能</el-checkbox>
              <el-checkbox value="发电机">发电机</el-checkbox>
              <el-checkbox value="倒车影像">倒车影像</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-card>

        <!-- 众筹配置卡片 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">众筹配置</span>
              <span class="card-subtitle">配置车型的众筹托管参数</span>
            </div>
          </template>

          <el-form-item label="启用众筹">
            <el-switch v-model="form.supportCrowdfunding" />
            <span style="margin-left: 12px; font-size: 13px; color: #909399">
              启用后,该车型将出现在小程序众筹车型列表中
            </span>
          </el-form-item>

          <template v-if="form.supportCrowdfunding">
            <el-divider />

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="购置价格" prop="purchasePrice">
                  <el-input-number
                    v-model="form.purchasePrice"
                    :min="0"
                    :step="10000"
                    :precision="0"
                    style="width: 100%"
                  />
                  <div class="form-tip">
                    车辆购置价格(不含税费、上牌等附加费用)
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建议份额数" prop="suggestedShares">
                  <el-input-number
                    v-model="form.suggestedShares"
                    :min="2"
                    :max="20"
                    style="width: 100%"
                  />
                  <div class="form-tip">
                    单份价格: ¥{{ suggestedPricePerShare.toLocaleString() }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="预估月收益" prop="estimatedMonthlyIncome">
                  <el-input-number
                    v-model="form.estimatedMonthlyIncome"
                    :min="0"
                    :step="100"
                    :precision="0"
                    style="width: 100%"
                  />
                  <div class="form-tip">
                    预估年化收益率: {{ estimatedAnnualReturn }}%
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="展示排序">
                  <el-input-number
                    v-model="form.crowdfundingDisplayOrder"
                    :min="0"
                    style="width: 100%"
                  />
                  <div class="form-tip">
                    数值越大越靠前
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="热门推荐">
              <el-switch v-model="form.isHotCrowdfunding" />
              <span style="margin-left: 12px; font-size: 13px; color: #909399">
                标记为热门后,在小程序众筹首页优先展示,带"热门"角标
              </span>
            </el-form-item>

            <el-form-item label="众筹描述">
              <el-input
                v-model="form.crowdfundingDescription"
                type="textarea"
                :rows="4"
                placeholder="针对众筹场景的车型介绍,如不填写则使用车型基本描述"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </template>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  ZoomIn,
  Delete,
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import {
  getVehicleModelDetail as getVehicleModelById,
  createVehicleModel,
  updateVehicleModel,
  getBrands,
} from '@/api/vehicle'
import { useErrorHandler } from '@/composables'

// Composables
const router = useRouter()
const route = useRoute()
const { handleApiError } = useErrorHandler()

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

// 富文本编辑器图片上传地址
const uploadUrl = ref('/api/v1/upload/image')

// 图片接口
interface ImageItem {
  uid: string
  url: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object'

const normalizeImageUrl = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (isRecord(value) && typeof value.url === 'string') return value.url
  return null
}

// 表单数据
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
  images: [] as ImageItem[],
  description: '',
  features: [] as string[],
  // 众筹配置字段
  supportCrowdfunding: false,
  purchasePrice: 0,
  suggestedShares: 10,
  estimatedMonthlyIncome: 0,
  isHotCrowdfunding: false,
  crowdfundingDisplayOrder: 0,
  crowdfundingDescription: '',
})

// 表单验证规则
const formRules: FormRules = {
  brandId: [
    { required: true, message: '请选择品牌', trigger: 'change' },
  ],
  modelName: [
    { required: true, message: '请输入车型名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  vehicleType: [
    { required: true, message: '请选择车辆类型', trigger: 'change' },
  ],
  dailyPrice: [
    { required: true, message: '请输入日租金', trigger: 'blur' },
  ],
  images: [
    {
      validator: (_rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请至少上传一张车型图片'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  purchasePrice: [
    {
      validator: (_rule, value, callback) => {
        if (form.supportCrowdfunding && (!value || value <= 0)) {
          callback(new Error('启用众筹时,购置价格必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  estimatedMonthlyIncome: [
    {
      validator: (_rule, value, callback) => {
        if (form.supportCrowdfunding && (!value || value <= 0)) {
          callback(new Error('启用众筹时,预估月收益必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const isEdit = computed(() => !!route.params.id)

// 计算属性：建议单份价格
const suggestedPricePerShare = computed(() => {
  if (form.purchasePrice > 0 && form.suggestedShares > 0) {
    return Math.round(form.purchasePrice / form.suggestedShares)
  }
  return 0
})

// 计算属性：预估年化收益率
const estimatedAnnualReturn = computed(() => {
  if (form.purchasePrice > 0 && form.estimatedMonthlyIncome > 0) {
    return ((form.estimatedMonthlyIncome * 12 / form.purchasePrice) * 100).toFixed(2)
  }
  return '0.00'
})

// 图片上传处理（Mock 模式：转换为 base64）
const handleImageChange = (file: any) => {
  const rawFile = file.raw

  // 验证文件类型
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return
  }

  // 验证文件大小
  const isLt5M = rawFile.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  // 将图片转换为 base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Url = e.target?.result as string
    form.images.push({
      uid: `${Date.now()}-${Math.random()}`,
      url: base64Url,
    })
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(rawFile)
}

// 预览图片
const handlePreviewImage = (_index: number) => {
  // Element Plus 的 el-image 组件会自动处理预览
}

// 删除图片
const handleRemoveImage = (index: number) => {
  ElMessageBox.confirm('确定要删除这张图片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      form.images.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 用户取消
    })
}

// 加载品牌列表
const loadBrands = async () => {
  try {
    const res = await getBrands()
    brandsList.value = res.data
  } catch (error) {
    handleApiError(error, '加载品牌列表失败')
  }
}

// 加载车型详情
const loadVehicleModel = async (id: number) => {
  try {
    const res = await getVehicleModelById(id)
    const model = res.data

    form.id = model.id
    form.brandId = model.brandId
    form.modelName = model.modelName
    form.vehicleType = model.vehicleType
    form.seats = model.seats
    form.beds = model.beds
    form.length = model.length
    form.width = model.width
    form.height = model.height
    form.fuelCapacity = model.fuelCapacity
    form.dailyPrice = model.dailyPrice
    form.description = model.description
    form.features = Array.isArray(model.features) ? [...model.features] : []

    // 加载众筹配置数据
    form.supportCrowdfunding = model.supportCrowdfunding || false
    form.purchasePrice = model.purchasePrice || 0
    form.suggestedShares = model.suggestedShares || 10
    form.estimatedMonthlyIncome = model.estimatedMonthlyIncome || 0
    form.isHotCrowdfunding = model.isHotCrowdfunding || false
    form.crowdfundingDisplayOrder = model.crowdfundingDisplayOrder || 0
    form.crowdfundingDescription = model.crowdfundingDescription || ''

    // 处理图片数据（兼容 image: string / images: string[] / images: {url:string}[]）
    const urls: string[] = []

    if (Array.isArray(model.images)) {
      for (const item of model.images) {
        const url = normalizeImageUrl(item)
        if (url) urls.push(url)
      }
    }

    if (urls.length === 0) {
      const url = normalizeImageUrl(model.image)
      if (url) urls.push(url)
    }

    form.images = urls.map((url, index) => ({
      uid: `${Date.now()}-${index}`,
      url,
    }))
  } catch (error) {
    handleApiError(error, '加载车型详情失败')
    router.back()
  }
}

// 返回
const handleBack = () => {
  ElMessageBox.confirm('确定要离开吗？未保存的内容将会丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      router.back()
    })
    .catch(() => {
      // 用户取消
    })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请完善表单信息')
      return
    }

    submitLoading.value = true
    try {
      const submitData = {
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
        image: form.images[0]?.url || '', // 第一张作为封面
        images: form.images.map(img => img.url), // 所有图片URL数组
        description: form.description,
        features: [...form.features],
        // 众筹配置数据
        supportCrowdfunding: form.supportCrowdfunding,
        purchasePrice: form.supportCrowdfunding ? form.purchasePrice : 0,
        suggestedShares: form.supportCrowdfunding ? form.suggestedShares : 10,
        estimatedMonthlyIncome: form.supportCrowdfunding ? form.estimatedMonthlyIncome : 0,
        isHotCrowdfunding: form.supportCrowdfunding ? form.isHotCrowdfunding : false,
        crowdfundingDisplayOrder: form.supportCrowdfunding ? form.crowdfundingDisplayOrder : 0,
        crowdfundingDescription: form.supportCrowdfunding ? form.crowdfundingDescription : '',
      }

      if (isEdit.value) {
        await updateVehicleModel(form.id, submitData)
        ElMessage.success('更新成功')
      } else {
        await createVehicleModel(submitData)
        ElMessage.success('创建成功')
      }

      router.push({ name: 'VehicleModels' })
    } catch (error) {
      handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 页面加载
onMounted(async () => {
  await loadBrands()

  if (isEdit.value) {
    const id = Number(route.params.id)
    if (id) {
      await loadVehicleModel(id)
    }
  }
})
</script>

<style scoped lang="scss">
.vehicle-model-edit-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .page-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;

    .model-form {
      max-width: 1200px;
      margin: 0 auto;

      .form-card {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;

          .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }

          .card-subtitle {
            font-size: 13px;
            color: #909399;
          }
        }
      }
    }
  }

  .image-upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .image-item {
      position: relative;
      width: 148px;
      height: 148px;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      overflow: hidden;
      cursor: move;

      &:hover .image-actions {
        opacity: 1;
      }

      .uploaded-image {
        width: 100%;
        height: 100%;
      }

      .image-actions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s;

        .action-icon {
          font-size: 20px;
          color: #fff;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }
      }

      .image-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        padding: 2px 8px;
        background-color: #409eff;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
      }
    }

    .image-uploader {
      .upload-placeholder {
        width: 148px;
        height: 148px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px dashed #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;

          .upload-icon {
            color: #409eff;
          }
        }

        .upload-icon {
          font-size: 32px;
          color: #8c939d;
          margin-bottom: 8px;
          transition: color 0.3s;
        }

        .upload-text {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }

  .form-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
    line-height: 1.4;
  }
}
</style>
