<template>
  <div class="app-config-form">
    <el-card v-loading="loading" shadow="never">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- 联系方式 -->
        <el-divider content-position="left">联系方式</el-divider>

        <el-form-item label="客服电话" prop="servicePhone">
          <el-input v-model="formData.servicePhone" placeholder="如：400-888-8888" clearable />
        </el-form-item>

        <el-form-item label="客服微信" prop="serviceWechat">
          <el-input v-model="formData.serviceWechat" placeholder="如：daodao_service" clearable />
        </el-form-item>

        <el-form-item label="公司地址" prop="companyAddress">
          <el-input
            v-model="formData.companyAddress"
            type="textarea"
            :rows="2"
            placeholder="如：北京市朝阳区某某大厦10层"
            clearable
          />
        </el-form-item>

        <el-form-item label="营业时间" prop="businessHours">
          <el-input
            v-model="formData.businessHours"
            placeholder="如：周一至周日 9:00-21:00"
            clearable
          />
        </el-form-item>

        <!-- 关于我们 -->
        <el-divider content-position="left">关于我们</el-divider>

        <el-form-item label="公司介绍" prop="aboutUs">
          <RichTextEditor v-model="formData.aboutUs" height="400px" />
        </el-form-item>

        <!-- 版本信息 -->
        <el-divider content-position="left">版本信息</el-divider>

        <el-form-item label="当前版本" prop="version">
          <el-input v-model="formData.version" placeholder="如：v1.0.0" clearable />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSave">
            保存配置
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
import type { FormInstance, FormRules } from 'element-plus'
import { getAppConfig, updateAppConfig } from '@/api/miniprogramResources'
import type { AppConfig } from '@/types/miniprogramResources'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<AppConfig>({
  servicePhone: '',
  serviceWechat: '',
  companyAddress: '',
  businessHours: '',
  aboutUs: '',
  version: '',
})

// 原始数据备份（用于重置）
let originalData: AppConfig | null = null

// 表单验证规则
const formRules: FormRules = {
  servicePhone: [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
  serviceWechat: [{ required: true, message: '请输入客服微信', trigger: 'blur' }],
  companyAddress: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
  businessHours: [{ required: true, message: '请输入营业时间', trigger: 'blur' }],
  aboutUs: [{ required: true, message: '请输入公司介绍', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
}

// 加载应用配置
const loadConfig = async () => {
  loading.value = true
  try {
    const res = await getAppConfig()
    const config = res.data
    originalData = JSON.parse(JSON.stringify(config))

    Object.assign(formData, {
      servicePhone: config.servicePhone,
      serviceWechat: config.serviceWechat,
      companyAddress: config.companyAddress,
      businessHours: config.businessHours,
      aboutUs: config.aboutUs,
      version: config.version,
    })
  } catch (error) {
    ElMessage.error('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 保存配置
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      await updateAppConfig(formData)
      ElMessage.success('保存成功')
      loadConfig()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 重置表单
const handleReset = () => {
  if (originalData) {
    Object.assign(formData, {
      servicePhone: originalData.servicePhone,
      serviceWechat: originalData.serviceWechat,
      companyAddress: originalData.companyAddress,
      businessHours: originalData.businessHours,
      aboutUs: originalData.aboutUs,
      version: originalData.version,
    })
    ElMessage.info('已重置为原始配置')
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.app-config-form {
  // 样式继承自父组件
}
</style>
