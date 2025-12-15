<template>
  <div class="thirdparty-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="180px"
    >
      <!-- 对象存储配置 -->
      <div class="config-section">
        <h3 class="section-title">对象存储配置 (OSS)</h3>
        <el-form-item label="存储服务商" prop="ossProvider">
          <el-select v-model="form.ossProvider" placeholder="请选择">
            <el-option label="阿里云OSS" value="aliyun" />
            <el-option label="腾讯云COS" value="tencent" />
            <el-option label="七牛云" value="qiniu" />
          </el-select>
        </el-form-item>
        <el-form-item label="AccessKey ID" prop="ossAccessKeyId">
          <el-input
            v-model="form.ossAccessKeyId"
            placeholder="请输入AccessKey ID"
          />
        </el-form-item>
        <el-form-item label="AccessKey Secret" prop="ossAccessKeySecret">
          <el-input
            v-model="form.ossAccessKeySecret"
            type="password"
            placeholder="请输入AccessKey Secret"
            show-password
          />
        </el-form-item>
        <el-form-item label="Bucket名称" prop="ossBucket">
          <el-input
            v-model="form.ossBucket"
            placeholder="请输入Bucket名称"
          />
        </el-form-item>
        <el-form-item label="访问域名" prop="ossDomain">
          <el-input
            v-model="form.ossDomain"
            placeholder="请输入访问域名"
          />
        </el-form-item>
      </div>

      <!-- 地图服务配置 -->
      <div class="config-section">
        <h3 class="section-title">地图服务配置</h3>
        <el-form-item label="地图服务商" prop="mapProvider">
          <el-select v-model="form.mapProvider" placeholder="请选择">
            <el-option label="高德地图" value="amap" />
            <el-option label="腾讯地图" value="tencent" />
            <el-option label="百度地图" value="baidu" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key" prop="mapApiKey">
          <el-input
            v-model="form.mapApiKey"
            placeholder="请输入地图API Key"
          />
        </el-form-item>
        <el-form-item label="Secret Key" prop="mapSecretKey">
          <el-input
            v-model="form.mapSecretKey"
            type="password"
            placeholder="请输入Secret Key"
            show-password
          />
        </el-form-item>
      </div>

      <!-- 实名认证配置 -->
      <div class="config-section">
        <h3 class="section-title">实名认证配置</h3>
        <el-form-item label="启用实名认证" prop="idVerifyEnabled">
          <el-switch
            v-model="form.idVerifyEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="认证服务商" prop="idVerifyProvider">
          <el-select
            v-model="form.idVerifyProvider"
            placeholder="请选择"
            :disabled="!form.idVerifyEnabled"
          >
            <el-option label="阿里云" value="aliyun" />
            <el-option label="腾讯云" value="tencent" />
          </el-select>
        </el-form-item>
        <el-form-item label="AppCode" prop="idVerifyAppCode">
          <el-input
            v-model="form.idVerifyAppCode"
            placeholder="请输入AppCode"
            :disabled="!form.idVerifyEnabled"
          />
        </el-form-item>
      </div>

      <!-- 人脸识别配置 -->
      <div class="config-section">
        <h3 class="section-title">人脸识别配置</h3>
        <el-form-item label="启用人脸识别" prop="faceRecognitionEnabled">
          <el-switch
            v-model="form.faceRecognitionEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="识别服务商" prop="faceRecognitionProvider">
          <el-select
            v-model="form.faceRecognitionProvider"
            placeholder="请选择"
            :disabled="!form.faceRecognitionEnabled"
          >
            <el-option label="阿里云" value="aliyun" />
            <el-option label="腾讯云" value="tencent" />
            <el-option label="百度AI" value="baidu" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key" prop="faceRecognitionApiKey">
          <el-input
            v-model="form.faceRecognitionApiKey"
            placeholder="请输入API Key"
            :disabled="!form.faceRecognitionEnabled"
          />
        </el-form-item>
        <el-form-item label="Secret Key" prop="faceRecognitionSecretKey">
          <el-input
            v-model="form.faceRecognitionSecretKey"
            type="password"
            placeholder="请输入Secret Key"
            show-password
            :disabled="!form.faceRecognitionEnabled"
          />
        </el-form-item>
      </div>

      <!-- 内容审核配置 -->
      <div class="config-section">
        <h3 class="section-title">内容审核配置</h3>
        <el-form-item label="启用内容审核" prop="contentModerationEnabled">
          <el-switch
            v-model="form.contentModerationEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="审核服务商" prop="contentModerationProvider">
          <el-select
            v-model="form.contentModerationProvider"
            placeholder="请选择"
            :disabled="!form.contentModerationEnabled"
          >
            <el-option label="阿里云" value="aliyun" />
            <el-option label="腾讯云" value="tencent" />
          </el-select>
        </el-form-item>
        <el-form-item label="AccessKey ID" prop="contentModerationAccessKeyId">
          <el-input
            v-model="form.contentModerationAccessKeyId"
            placeholder="请输入AccessKey ID"
            :disabled="!form.contentModerationEnabled"
          />
        </el-form-item>
        <el-form-item label="AccessKey Secret" prop="contentModerationAccessKeySecret">
          <el-input
            v-model="form.contentModerationAccessKeySecret"
            type="password"
            placeholder="请输入AccessKey Secret"
            show-password
            :disabled="!form.contentModerationEnabled"
          />
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存配置
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  // 对象存储
  ossProvider: 'aliyun',
  ossAccessKeyId: '',
  ossAccessKeySecret: '',
  ossBucket: 'daodao-rv',
  ossDomain: 'https://oss.daodao.com',

  // 地图服务
  mapProvider: 'amap',
  mapApiKey: '',
  mapSecretKey: '',

  // 实名认证
  idVerifyEnabled: true,
  idVerifyProvider: 'aliyun',
  idVerifyAppCode: '',

  // 人脸识别
  faceRecognitionEnabled: true,
  faceRecognitionProvider: 'aliyun',
  faceRecognitionApiKey: '',
  faceRecognitionSecretKey: '',

  // 内容审核
  contentModerationEnabled: true,
  contentModerationProvider: 'aliyun',
  contentModerationAccessKeyId: '',
  contentModerationAccessKeySecret: '',
})

const formRules: FormRules = {
  ossAccessKeyId: [
    { required: true, message: '请输入AccessKey ID', trigger: 'blur' },
  ],
  ossBucket: [
    { required: true, message: '请输入Bucket名称', trigger: 'blur' },
  ],
  mapApiKey: [
    { required: true, message: '请输入地图API Key', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      // TODO: 调用保存配置API
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('第三方服务配置保存成功')
    } catch (error) {
      ElMessage.error('第三方服务配置保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.thirdparty-config {
  .config-section {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-left: 10px;
      border-left: 3px solid #409eff;
    }
  }

  .form-tip {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
