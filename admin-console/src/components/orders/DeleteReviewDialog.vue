<template>
  <el-dialog
    v-model="visible"
    title="删除评价"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 评价信息展示 -->
    <el-card class="info-card" shadow="never">
      <template #header><span class="card-title">评价信息</span></template>
      <el-descriptions :column="2" size="small">
        <el-descriptions-item label="订单号">
          {{ reviewInfo?.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item label="用户">
          {{ reviewInfo?.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="综合评分">
          <el-rate
            v-model="reviewInfo.overallRating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
        <el-descriptions-item label="评价时间">
          {{ reviewInfo?.createdAt }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <div class="review-content">
        <div class="content-label">评价内容：</div>
        <div class="content-text">{{ reviewInfo?.content }}</div>
      </div>

      <div v-if="reviewInfo?.images && reviewInfo.images.length > 0" class="review-images">
        <div class="content-label">评价图片：</div>
        <div class="images-grid">
          <el-image
            v-for="(image, index) in reviewInfo.images"
            :key="index"
            :src="image"
            :preview-src-list="reviewInfo.images"
            :initial-index="index"
            fit="cover"
            class="review-image"
          />
        </div>
      </div>

      <el-divider />

      <el-descriptions :column="2" size="small">
        <el-descriptions-item label="车辆评分">
          <el-rate
            v-model="reviewInfo.vehicleRating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
        <el-descriptions-item label="服务评分">
          <el-rate
            v-model="reviewInfo.serviceRating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
        <el-descriptions-item label="清洁度评分" :span="2">
          <el-rate
            v-model="reviewInfo.cleanlinessRating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 删除原因表单 -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
      style="margin-top: 20px"
    >
      <el-form-item label="删除原因" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="6"
          placeholder="请详细说明删除此评价的原因（至少10个字符）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="删除类型" prop="deleteType">
        <el-radio-group v-model="form.deleteType">
          <el-radio value="inappropriate">不当内容</el-radio>
          <el-radio value="duplicate">重复评价</el-radio>
          <el-radio value="spam">垃圾信息</el-radio>
          <el-radio value="user_request">用户要求</el-radio>
          <el-radio value="other">其他原因</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 重要提示 -->
    <el-alert
      title="重要提示"
      type="warning"
      :closable="false"
      show-icon
    >
      <template #default>
        <ul class="tips-list">
          <li>删除操作为软删除，评价数据将被保留但不再显示</li>
          <li>删除记录将被永久保存，包括删除人和删除原因</li>
          <li>删除后的评价可以在历史记录中查看</li>
          <li>请谨慎操作，确保删除原因真实有效</li>
        </ul>
      </template>
    </el-alert>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" :loading="loading" @click="handleSubmit">
        确认删除
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

// Props
interface Props {
  modelValue: boolean
  reviewInfo: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  reviewInfo: null
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

// 表单数据
const form = reactive({
  reason: '',
  deleteType: 'inappropriate'
})

// 表单验证规则
const formRules: FormRules = {
  reason: [
    { required: true, message: '请输入删除原因', trigger: 'blur' },
    { min: 10, message: '删除原因至少10个字符', trigger: 'blur' }
  ],
  deleteType: [
    { required: true, message: '请选择删除类型', trigger: 'change' }
  ]
}

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 提交删除
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 二次确认
      await ElMessageBox.confirm(
        '删除后的评价将不再前端展示，但会保留在历史记录中。确定要删除这条评价吗？',
        '确认删除',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          distinguishCancelAndClose: true
        }
      )

      loading.value = true

      const submitData = {
        reviewId: props.reviewInfo?.id,
        reason: form.reason,
        deleteType: form.deleteType,
        deletedAt: new Date().toISOString()
      }

      emit('submit', submitData)
      ElMessage.success('评价删除成功')
      handleClose()
    } catch (error) {
      if (error !== 'cancel' && error !== 'close') {
        console.error('删除评价失败:', error)
        ElMessage.error('删除评价失败，请重试')
      }
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.reason = ''
  form.deleteType = 'inappropriate'
  visible.value = false
}
</script>

<style scoped lang="scss">
.info-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.review-content {
  margin-bottom: 16px;

  .content-label {
    margin-bottom: 8px;
    color: #606266;
    font-weight: 500;
    font-size: 13px;
  }

  .content-text {
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #303133;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.review-images {
  margin-bottom: 16px;

  .content-label {
    margin-bottom: 8px;
    color: #606266;
    font-weight: 500;
    font-size: 13px;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .review-image {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    cursor: pointer;
  }
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

:deep(.el-rate) {
  height: 32px;
}

:deep(.el-divider) {
  margin: 16px 0;
}
</style>
