<template>
  <div class="basic-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="150px"
    >
      <!-- 平台基础信息 -->
      <div class="config-section">
        <h3 class="section-title">平台基础信息</h3>
        <el-form-item label="平台名称" prop="platformName">
          <el-input v-model="form.platformName" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="平台Logo" prop="platformLogo">
          <el-upload
            class="logo-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
          >
            <img v-if="form.platformLogo" :src="form.platformLogo" class="logo" />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="客服电话" prop="servicePhone">
          <el-input v-model="form.servicePhone" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="客服邮箱" prop="serviceEmail">
          <el-input v-model="form.serviceEmail" placeholder="请输入客服邮箱" />
        </el-form-item>
        <el-form-item label="ICP备案号" prop="icpNumber">
          <el-input v-model="form.icpNumber" placeholder="请输入ICP备案号" />
        </el-form-item>
      </div>

      <!-- 系统运行参数 -->
      <div class="config-section">
        <h3 class="section-title">系统运行参数</h3>
        <el-form-item label="系统维护模式" prop="maintenanceMode">
          <el-switch
            v-model="form.maintenanceMode"
            active-text="开启"
            inactive-text="关闭"
          />
          <span class="form-tip">开启后用户端将无法访问</span>
        </el-form-item>
        <el-form-item label="维护提示信息" prop="maintenanceMessage">
          <el-input
            v-model="form.maintenanceMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入维护提示信息"
          />
        </el-form-item>
        <el-form-item label="会话超时时间" prop="sessionTimeout">
          <el-input-number
            v-model="form.sessionTimeout"
            :min="5"
            :max="1440"
            :step="5"
          />
          <span class="form-tip">分钟</span>
        </el-form-item>
        <el-form-item label="文件上传大小限制" prop="uploadSizeLimit">
          <el-input-number
            v-model="form.uploadSizeLimit"
            :min="1"
            :max="100"
            :step="1"
          />
          <span class="form-tip">MB</span>
        </el-form-item>
      </div>

      <!-- 安全设置 -->
      <div class="config-section">
        <h3 class="section-title">安全设置</h3>
        <el-form-item label="密码最小长度" prop="passwordMinLength">
          <el-input-number
            v-model="form.passwordMinLength"
            :min="6"
            :max="20"
            :step="1"
          />
          <span class="form-tip">字符</span>
        </el-form-item>
        <el-form-item label="密码复杂度要求" prop="passwordComplexity">
          <el-checkbox-group v-model="form.passwordComplexity">
            <el-checkbox label="uppercase">包含大写字母</el-checkbox>
            <el-checkbox label="lowercase">包含小写字母</el-checkbox>
            <el-checkbox label="number">包含数字</el-checkbox>
            <el-checkbox label="special">包含特殊字符</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="登录失败锁定" prop="loginFailLock">
          <el-switch
            v-model="form.loginFailLock"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="失败次数阈值" prop="loginFailThreshold">
          <el-input-number
            v-model="form.loginFailThreshold"
            :min="3"
            :max="10"
            :step="1"
            :disabled="!form.loginFailLock"
          />
          <span class="form-tip">次</span>
        </el-form-item>
        <el-form-item label="锁定时长" prop="loginLockDuration">
          <el-input-number
            v-model="form.loginLockDuration"
            :min="5"
            :max="1440"
            :step="5"
            :disabled="!form.loginFailLock"
          />
          <span class="form-tip">分钟</span>
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
import { Plus } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  // 平台基础信息
  platformName: '叨叨房车',
  platformLogo: '',
  servicePhone: '400-888-8888',
  serviceEmail: 'service@daodao.com',
  icpNumber: '京ICP备12345678号',

  // 系统运行参数
  maintenanceMode: false,
  maintenanceMessage: '系统维护中，预计30分钟后恢复',
  sessionTimeout: 30,
  uploadSizeLimit: 10,

  // 安全设置
  passwordMinLength: 8,
  passwordComplexity: ['lowercase', 'number'],
  loginFailLock: true,
  loginFailThreshold: 5,
  loginLockDuration: 30,
})

const formRules: FormRules = {
  platformName: [
    { required: true, message: '请输入平台名称', trigger: 'blur' },
  ],
  servicePhone: [
    { required: true, message: '请输入客服电话', trigger: 'blur' },
    { pattern: /^[\d-]+$/, message: '请输入正确的电话号码', trigger: 'blur' },
  ],
  serviceEmail: [
    { required: true, message: '请输入客服邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
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
      ElMessage.success('配置保存成功')
    } catch (error) {
      ElMessage.error('配置保存失败')
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
.basic-config {
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

  .logo-uploader {
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

    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }

    .logo {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: contain;
    }
  }
}
</style>
