<template>
  <div class="agreement-manager">
    <!-- 协议类型选择 -->
    <el-radio-group
      v-model="agreementType"
      class="agreement-type-selector"
      @change="handleTypeChange as any"
    >
      <el-radio-button value="user_agreement">用户服务协议</el-radio-button>
      <el-radio-button value="privacy_policy">隐私政策</el-radio-button>
      <el-radio-button value="cancellation_policy">取消政策</el-radio-button>
    </el-radio-group>

    <!-- 协议编辑器 -->
    <el-card v-loading="loading" class="agreement-editor" shadow="never">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="协议标题">
          <el-input v-model="formData.title" placeholder="请输入协议标题" />
        </el-form-item>

        <el-form-item label="版本号">
          <el-input v-model="formData.version" placeholder="如：v1.0.0" style="width: 200px" />
        </el-form-item>

        <el-form-item label="生效日期">
          <el-date-picker
            v-model="formData.effectiveDate"
            type="date"
            placeholder="选择生效日期"
            value-format="YYYY-MM-DD"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="协议内容">
          <RichTextEditor v-model="formData.content" height="500px" />
        </el-form-item>

        <el-form-item label="强制阅读">
          <el-switch v-model="formData.requireRead" />
          <span class="form-tip">开启后，用户注册时必须同意此协议</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSave">
            保存协议
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAgreement, updateAgreement } from '@/api/miniprogramResources'
import type { Agreement, AgreementType, AgreementFormData } from '@/types/miniprogramResources'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const agreementType = ref<AgreementType>('user_agreement')

// 表单数据
const formData = reactive<AgreementFormData>({
  type: 'user_agreement',
  title: '',
  content: '',
  version: '',
  effectiveDate: '',
  requireRead: true,
})

// 原始数据备份（用于重置）
let originalData: Agreement | null = null

// 加载协议内容
const loadAgreement = async (type: AgreementType) => {
  loading.value = true
  try {
    const res = await getAgreement(type)
    const agreement = res.data
    originalData = agreement

    Object.assign(formData, {
      type: agreement.type,
      title: agreement.title,
      content: agreement.content,
      version: agreement.version,
      effectiveDate: agreement.effectiveDate,
      requireRead: agreement.requireRead,
    })
  } catch (error) {
    ElMessage.error('加载协议失败')
  } finally {
    loading.value = false
  }
}

// 切换协议类型
const handleTypeChange = (type: AgreementType) => {
  loadAgreement(type)
}

// 保存协议
const handleSave = async () => {
  submitLoading.value = true
  try {
    await updateAgreement(agreementType.value, formData)
    ElMessage.success('保存成功')
    loadAgreement(agreementType.value)
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (originalData) {
    Object.assign(formData, {
      type: originalData.type,
      title: originalData.title,
      content: originalData.content,
      version: originalData.version,
      effectiveDate: originalData.effectiveDate,
      requireRead: originalData.requireRead,
    })
    ElMessage.info('已重置为原始内容')
  }
}

onMounted(() => {
  loadAgreement(agreementType.value)
})
</script>

<style scoped lang="scss">
.agreement-manager {
  .agreement-type-selector {
    margin-bottom: 20px;
  }

  .agreement-editor {
    .form-tip {
      margin-left: 8px;
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
