<template>
  <el-dialog
    v-model="visible"
    title="添加评价"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <!-- 订单选择 -->
      <el-form-item label="选择订单" prop="orderId">
        <el-select
          v-model="form.orderId"
          placeholder="请选择订单"
          filterable
          style="width: 100%"
          @change="handleOrderChange"
        >
          <el-option
            v-for="order in orderList"
            :key="order.id"
            :label="`${order.orderNo} - ${order.userName}`"
            :value="order.id"
          >
            <div class="order-option">
              <span>{{ order.orderNo }}</span>
              <span class="order-info">{{ order.userName }} | {{ order.vehicleName }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 订单信息展示 -->
      <el-card v-if="selectedOrder" class="info-card" shadow="never">
        <template #header><span class="card-title">订单信息</span></template>
        <el-descriptions :column="2" size="small">
          <el-descriptions-item label="订单号">
            {{ selectedOrder.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="用户">
            {{ selectedOrder.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="车辆">
            {{ selectedOrder.vehicleName }}
          </el-descriptions-item>
          <el-descriptions-item label="完成时间">
            {{ selectedOrder.completedAt }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 评分 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">评分</span></template>

        <el-form-item label="综合评分" prop="overallRating">
          <el-rate
            v-model="form.overallRating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-score
            text-color="#ff9900"
          />
        </el-form-item>

        <el-form-item label="车辆评分" prop="vehicleRating">
          <el-rate
            v-model="form.vehicleRating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-score
            text-color="#ff9900"
          />
        </el-form-item>

        <el-form-item label="服务评分" prop="serviceRating">
          <el-rate
            v-model="form.serviceRating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-score
            text-color="#ff9900"
          />
        </el-form-item>

        <el-form-item label="清洁度评分" prop="cleanlinessRating">
          <el-rate
            v-model="form.cleanlinessRating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-score
            text-color="#ff9900"
          />
        </el-form-item>
      </el-card>

      <!-- 评价内容 -->
      <el-form-item label="评价内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="请输入评价内容"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 评价图片 -->
      <el-form-item label="评价图片">
        <div class="upload-section">
          <div class="upload-tip">最多上传6张图片</div>
          <el-upload
            v-model:file-list="form.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="6"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 评价来源 -->
      <el-form-item label="评价来源" prop="source">
        <el-radio-group v-model="form.source">
          <el-radio value="admin_offline">线下补录</el-radio>
          <el-radio value="admin_test">测试数据</el-radio>
          <el-radio value="user">用户评价</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 来源说明 -->
      <el-form-item v-if="form.source !== 'user'" label="来源说明" prop="sourceNote">
        <el-input
          v-model="form.sourceNote"
          type="textarea"
          :rows="3"
          placeholder="请说明评价来源（如：电话反馈、微信沟通等）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- 是否显示 -->
      <el-form-item label="是否显示">
        <el-switch
          v-model="form.isPublished"
          active-text="显示"
          inactive-text="隐藏"
        />
        <div class="field-tip">
          隐藏的评价不会在前端展示
        </div>
      </el-form-item>

      <!-- 温馨提示 -->
      <el-alert
        title="温馨提示"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul class="tips-list">
            <li>后台添加的评价会标记来源，便于区分</li>
            <li>请确保评价内容真实、客观</li>
            <li>测试数据请在正式上线前清理</li>
            <li>线下补录的评价建议注明来源渠道</li>
          </ul>
        </template>
      </el-alert>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认添加
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// Props
interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

// 响应式数据
const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref<FormInstance>()

// 订单列表（Mock数据，实际应从API获取）
const orderList = ref([
  {
    id: 1,
    orderNo: 'ORD202401200001',
    userName: '张三',
    vehicleName: '奔驰V260',
    completedAt: '2024-01-20 18:00:00'
  },
  {
    id: 2,
    orderNo: 'ORD202401200002',
    userName: '李四',
    vehicleName: '大通V90',
    completedAt: '2024-01-20 19:00:00'
  }
])

// 选中的订单
const selectedOrder = ref<any>(null)

// 表单数据
const form = reactive({
  orderId: null as number | null,
  overallRating: 5,
  vehicleRating: 5,
  serviceRating: 5,
  cleanlinessRating: 5,
  content: '',
  images: [] as any[],
  source: 'admin_offline',
  sourceNote: '',
  isPublished: true
})

// 表单验证规则
const formRules: FormRules = {
  orderId: [
    { required: true, message: '请选择订单', trigger: 'change' }
  ],
  overallRating: [
    { required: true, message: '请选择综合评分', trigger: 'change' },
    { type: 'number', min: 1, max: 5, message: '评分范围为1-5星', trigger: 'change' }
  ],
  vehicleRating: [
    { required: true, message: '请选择车辆评分', trigger: 'change' },
    { type: 'number', min: 1, max: 5, message: '评分范围为1-5星', trigger: 'change' }
  ],
  serviceRating: [
    { required: true, message: '请选择服务评分', trigger: 'change' },
    { type: 'number', min: 1, max: 5, message: '评分范围为1-5星', trigger: 'change' }
  ],
  cleanlinessRating: [
    { required: true, message: '请选择清洁度评分', trigger: 'change' },
    { type: 'number', min: 1, max: 5, message: '评分范围为1-5星', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入评价内容', trigger: 'blur' },
    { min: 10, message: '评价内容至少10个字符', trigger: 'blur' }
  ],
  source: [
    { required: true, message: '请选择评价来源', trigger: 'change' }
  ],
  sourceNote: [
    { required: true, message: '请说明评价来源', trigger: 'blur' },
    { min: 5, message: '来源说明至少5个字符', trigger: 'blur' }
  ]
}

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 订单选择变化
const handleOrderChange = (orderId: number) => {
  selectedOrder.value = orderList.value.find(order => order.id === orderId)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const submitData = {
        orderId: form.orderId,
        overallRating: form.overallRating,
        vehicleRating: form.vehicleRating,
        serviceRating: form.serviceRating,
        cleanlinessRating: form.cleanlinessRating,
        content: form.content,
        images: form.images.map(file => file.url || URL.createObjectURL(file.raw)),
        source: form.source,
        sourceNote: form.sourceNote,
        isPublished: form.isPublished
      }

      emit('submit', submitData)
      ElMessage.success('评价添加成功')
      handleClose()
    } catch (error) {
      console.error('添加评价失败:', error)
      ElMessage.error('添加评价失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.orderId = null
  form.overallRating = 5
  form.vehicleRating = 5
  form.serviceRating = 5
  form.cleanlinessRating = 5
  form.content = ''
  form.images = []
  form.source = 'admin_offline'
  form.sourceNote = ''
  form.isPublished = true
  selectedOrder.value = null
  visible.value = false
}
</script>

<style scoped lang="scss">
.order-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .order-info {
    color: #909399;
    font-size: 12px;
  }
}

.info-card,
.section-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.upload-section {
  .upload-tip {
    margin-bottom: 10px;
    color: #909399;
    font-size: 12px;
  }
}

.field-tip {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    color: #606266;
    font-size: 13px;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}

:deep(.el-alert) {
  margin-top: 16px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-rate) {
  height: 32px;
}
</style>
