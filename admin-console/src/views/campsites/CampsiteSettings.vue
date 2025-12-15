<!-- @ts-nocheck -->
<template>
  <div class="campsite-settings-container">
    <PageHeader title="营地设置" description="配置营地基本信息和设施" />

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>营地基本信息</span>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="settings-form"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="营地名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入营地名称" />
        </el-form-item>

        <el-form-item label="营地类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择营地类型">
            <el-option label="景区营地" value="scenic" />
            <el-option label="森林营地" value="forest" />
            <el-option label="湖畔营地" value="lakeside" />
            <el-option label="山地营地" value="mountain" />
            <el-option label="沙漠营地" value="desert" />
            <el-option label="草原营地" value="grassland" />
          </el-select>
        </el-form-item>

        <el-form-item label="运营状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">运营中</el-radio>
            <el-radio label="inactive">已停业</el-radio>
            <el-radio label="maintenance">维护中</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-divider content-position="left">位置信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份" prop="province">
              <el-input v-model="form.province" placeholder="请输入省份" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-input v-model="form.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县" prop="district">
              <el-input v-model="form.district" placeholder="请输入区县" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                :precision="6"
                :step="0.000001"
                :min="-180"
                :max="180"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                :precision="6"
                :step="0.000001"
                :min="-90"
                :max="90"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">容量与价格</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="营地面积" prop="area">
              <el-input-number
                v-model="form.area"
                :min="0"
                :step="100"
                style="width: 100%"
              />
              <span style="margin-left: 10px">平方米</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总车位数" prop="capacity">
              <el-input-number
                v-model="form.capacity"
                :min="1"
                :step="1"
                style="width: 100%"
              />
              <span style="margin-left: 10px">个</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可用车位" prop="availableSpots">
              <el-input-number
                v-model="form.availableSpots"
                :min="0"
                :max="form.capacity"
                :step="1"
                style="width: 100%"
              />
              <span style="margin-left: 10px">个</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="平日价格" prop="pricePerNight">
              <el-input-number
                v-model="form.pricePerNight"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周末价格" prop="weekendPrice">
              <el-input-number
                v-model="form.weekendPrice"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="假日价格" prop="holidayPrice">
              <el-input-number
                v-model="form.holidayPrice"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">营业时间</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业时间" prop="openTime">
              <el-input v-model="form.openTime" placeholder="例如：全年开放 或 3月-11月" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关闭时间" prop="closeTime">
              <el-input v-model="form.closeTime" placeholder="例如：12月-2月（可选）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入住时间" prop="checkInTime">
              <el-time-picker
                v-model="form.checkInTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择入住时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退房时间" prop="checkOutTime">
              <el-time-picker
                v-model="form.checkOutTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择退房时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">联系方式</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">营地设施</el-divider>

        <el-form-item label="设施配置">
          <div class="facilities-grid">
            <el-checkbox
              v-for="facility in availableFacilities"
              :key="facility.id"
              v-model="facility.available"
              :label="facility.name"
            />
          </div>
        </el-form-item>

        <el-divider content-position="left">营地介绍</el-divider>

        <el-form-item label="营地描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入营地描述"
          />
        </el-form-item>

        <el-form-item label="营地规则" prop="rules">
          <el-input
            v-model="form.rules"
            type="textarea"
            :rows="6"
            placeholder="请输入营地规则，每行一条"
          />
        </el-form-item>

        <el-divider content-position="left">营地图片</el-divider>

        <el-form-item label="图片管理">
          <div class="images-container">
            <div v-for="(image, index) in form.images" :key="index" class="image-item">
              <el-tag closable @close="handleRemoveImage(index)">
                图片{{ index + 1 }}: {{ image }}
              </el-tag>
            </div>
            <el-button type="primary" size="small" @click="handleAddImage">
              添加图片
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加图片对话框 -->
    <el-dialog v-model="imageDialogVisible" title="添加图片" width="500px">
      <el-input
        v-model="newImageUrl"
        placeholder="请输入图片URL"
        @keyup.enter="handleConfirmAddImage"
      />
      <template #footer>
        <el-button @click="imageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddImage">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

// 营地设施类型
interface CampsiteFacility {
  id: string
  name: string
  icon: string
  available: boolean
}
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  name: '',
  type: 'scenic',
  status: 'active',
  province: '',
  city: '',
  district: '',
  address: '',
  longitude: 0,
  latitude: 0,
  area: 0,
  capacity: 0,
  availableSpots: 0,
  pricePerNight: 0,
  weekendPrice: 0,
  holidayPrice: 0,
  openTime: '',
  closeTime: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  contactPerson: '',
  contactPhone: '',
  description: '',
  rules: '',
  images: [] as string[]
})

// 可用设施列表
const availableFacilities = ref<CampsiteFacility[]>([
  { id: 'power', name: '电源接口', icon: 'electric', available: false },
  { id: 'water', name: '供水设施', icon: 'water', available: false },
  { id: 'toilet', name: '卫生间', icon: 'toilet', available: false },
  { id: 'shower', name: '淋浴间', icon: 'shower', available: false },
  { id: 'wifi', name: 'WiFi', icon: 'wifi', available: false },
  { id: 'bbq', name: '烧烤区', icon: 'bbq', available: false },
  { id: 'parking', name: '停车场', icon: 'parking', available: false },
  { id: 'store', name: '便利店', icon: 'store', available: false },
  { id: 'restaurant', name: '餐厅', icon: 'restaurant', available: false },
  { id: 'playground', name: '儿童游乐场', icon: 'playground', available: false },
  { id: 'laundry', name: '洗衣房', icon: 'laundry', available: false },
  { id: 'security', name: '24小时安保', icon: 'security', available: false }
])

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入营地名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择营地类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择运营状态', trigger: 'change' }
  ],
  province: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  district: [
    { required: true, message: '请输入区县', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入营地面积', trigger: 'blur' },
    { type: 'number', min: 1, message: '面积必须大于0', trigger: 'blur' }
  ],
  capacity: [
    { required: true, message: '请输入总车位数', trigger: 'blur' },
    { type: 'number', min: 1, message: '车位数必须大于0', trigger: 'blur' }
  ],
  availableSpots: [
    { required: true, message: '请输入可用车位数', trigger: 'blur' },
    { type: 'number', min: 0, message: '可用车位数不能小于0', trigger: 'blur' }
  ],
  pricePerNight: [
    { required: true, message: '请输入平日价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  weekendPrice: [
    { required: true, message: '请输入周末价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  holidayPrice: [
    { required: true, message: '请输入假日价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  openTime: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ],
  checkInTime: [
    { required: true, message: '请选择入住时间', trigger: 'change' }
  ],
  checkOutTime: [
    { required: true, message: '请选择退房时间', trigger: 'change' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入营地描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ],
  rules: [
    { required: true, message: '请输入营地规则', trigger: 'blur' }
  ]
}

// 图片对话框
const imageDialogVisible = ref(false)
const newImageUrl = ref('')

// 添加图片
const handleAddImage = () => {
  imageDialogVisible.value = true
  newImageUrl.value = ''
}

// 确认添加图片
const handleConfirmAddImage = () => {
  if (!newImageUrl.value.trim()) {
    ElMessage.warning('请输入图片URL')
    return
  }
  form.images.push(newImageUrl.value.trim())
  imageDialogVisible.value = false
  ElMessage.success('图片添加成功')
}

// 删除图片
const handleRemoveImage = (index: number) => {
  form.images.splice(index, 1)
  ElMessage.success('图片删除成功')
}

// 保存设置
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 验证可用车位不能超过总车位
      if (form.availableSpots > form.capacity) {
        ElMessage.error('可用车位数不能超过总车位数')
        return
      }

      // 这里应该调用API保存数据
      // await updateCampsiteSettings(form)

      ElMessage.success('营地设置保存成功')

      // 模拟保存成功后的操作
      console.log('保存的表单数据:', {
        ...form,
        facilities: availableFacilities.value.filter(f => f.available)
      })
    } catch (error) {
      handleApiError(error, '保存营地设置失败')
    }
  })
}

// 加载营地数据（示例）
const loadCampsiteData = () => {
  // 这里可以从路由参数获取营地ID，然后加载数据
  // 示例：填充一些默认数据
  form.name = '北京怀柔雁栖湖房车营地'
  form.type = 'lakeside'
  form.status = 'active'
  form.province = '北京市'
  form.city = '北京市'
  form.district = '怀柔区'
  form.address = '北京市怀柔区雁栖湖畔'
  form.longitude = 116.6333
  form.latitude = 40.3889
  form.area = 5000
  form.capacity = 50
  form.availableSpots = 35
  form.pricePerNight = 200
  form.weekendPrice = 280
  form.holidayPrice = 350
  form.openTime = '全年开放'
  form.closeTime = ''
  form.checkInTime = '14:00'
  form.checkOutTime = '12:00'
  form.contactPerson = '张经理'
  form.contactPhone = '13800138000'
  form.description = '位于雁栖湖畔的优质房车营地，环境优美，设施齐全，适合家庭出游和团队活动。'
  form.rules = '1. 禁止明火\n2. 保持安静，晚上10点后禁止喧哗\n3. 爱护环境，垃圾分类\n4. 宠物需牵绳'
  form.images = ['/images/campsite1-1.jpg', '/images/campsite1-2.jpg', '/images/campsite1-3.jpg']

  // 设置设施
  availableFacilities.value.forEach(facility => {
    if (['power', 'water', 'toilet', 'shower', 'wifi', 'bbq', 'parking', 'store'].includes(facility.id)) {
      facility.available = true
    }
  })
}

// 页面加载
onMounted(() => {
  loadCampsiteData()
})
</script>

<style scoped lang="scss">
.campsite-settings-container {
  padding: 20px;
}

.settings-card {
  margin-top: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.settings-form {
  max-width: 1200px;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.images-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .image-item {
    display: flex;
    align-items: center;
  }
}
</style>
