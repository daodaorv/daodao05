<template>
  <div class="notification-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="180px"
    >
      <!-- 短信通知配置 -->
      <div class="config-section">
        <h3 class="section-title">短信通知配置</h3>
        <el-form-item label="启用短信通知" prop="smsEnabled">
          <el-switch
            v-model="form.smsEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="短信服务商" prop="smsProvider">
          <el-select
            v-model="form.smsProvider"
            placeholder="请选择"
            :disabled="!form.smsEnabled"
          >
            <el-option label="阿里云" value="aliyun" />
            <el-option label="腾讯云" value="tencent" />
            <el-option label="华为云" value="huawei" />
          </el-select>
        </el-form-item>
        <el-form-item label="AccessKey ID" prop="smsAccessKeyId">
          <el-input
            v-model="form.smsAccessKeyId"
            placeholder="请输入AccessKey ID"
            :disabled="!form.smsEnabled"
          />
        </el-form-item>
        <el-form-item label="AccessKey Secret" prop="smsAccessKeySecret">
          <el-input
            v-model="form.smsAccessKeySecret"
            type="password"
            placeholder="请输入AccessKey Secret"
            show-password
            :disabled="!form.smsEnabled"
          />
        </el-form-item>
        <el-form-item label="短信签名" prop="smsSignature">
          <el-input
            v-model="form.smsSignature"
            placeholder="请输入短信签名"
            :disabled="!form.smsEnabled"
          />
        </el-form-item>
      </div>

      <!-- 邮件通知配置 -->
      <div class="config-section">
        <h3 class="section-title">邮件通知配置</h3>
        <el-form-item label="启用邮件通知" prop="emailEnabled">
          <el-switch
            v-model="form.emailEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="SMTP服务器" prop="smtpHost">
          <el-input
            v-model="form.smtpHost"
            placeholder="请输入SMTP服务器地址"
            :disabled="!form.emailEnabled"
          />
        </el-form-item>
        <el-form-item label="SMTP端口" prop="smtpPort">
          <el-input-number
            v-model="form.smtpPort"
            :min="1"
            :max="65535"
            :disabled="!form.emailEnabled"
          />
        </el-form-item>
        <el-form-item label="发件人邮箱" prop="emailFrom">
          <el-input
            v-model="form.emailFrom"
            placeholder="请输入发件人邮箱"
            :disabled="!form.emailEnabled"
          />
        </el-form-item>
        <el-form-item label="邮箱密码" prop="emailPassword">
          <el-input
            v-model="form.emailPassword"
            type="password"
            placeholder="请输入邮箱密码或授权码"
            show-password
            :disabled="!form.emailEnabled"
          />
        </el-form-item>
        <el-form-item label="使用SSL" prop="emailSsl">
          <el-switch
            v-model="form.emailSsl"
            active-text="是"
            inactive-text="否"
            :disabled="!form.emailEnabled"
          />
        </el-form-item>
      </div>

      <!-- 微信通知配置 -->
      <div class="config-section">
        <h3 class="section-title">微信通知配置</h3>
        <el-form-item label="启用微信通知" prop="wechatNotifyEnabled">
          <el-switch
            v-model="form.wechatNotifyEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="小程序AppID" prop="wechatAppId">
          <el-input
            v-model="form.wechatAppId"
            placeholder="请输入小程序AppID"
            :disabled="!form.wechatNotifyEnabled"
          />
        </el-form-item>
        <el-form-item label="小程序AppSecret" prop="wechatAppSecret">
          <el-input
            v-model="form.wechatAppSecret"
            type="password"
            placeholder="请输入小程序AppSecret"
            show-password
            :disabled="!form.wechatNotifyEnabled"
          />
        </el-form-item>
      </div>

      <!-- 通知场景配置 -->
      <div class="config-section">
        <h3 class="section-title">通知场景配置</h3>
        <el-form-item label="订单创建通知">
          <el-checkbox-group v-model="form.orderCreateNotify">
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="wechat">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="订单支付通知">
          <el-checkbox-group v-model="form.orderPayNotify">
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="wechat">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="订单完成通知">
          <el-checkbox-group v-model="form.orderCompleteNotify">
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="wechat">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="退款通知">
          <el-checkbox-group v-model="form.refundNotify">
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="wechat">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存配置
        </el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="warning" @click="handleTestSms">测试短信</el-button>
        <el-button type="warning" @click="handleTestEmail">测试邮件</el-button>
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
  // 短信配置
  smsEnabled: true,
  smsProvider: 'aliyun',
  smsAccessKeyId: '',
  smsAccessKeySecret: '',
  smsSignature: '叨叨房车',

  // 邮件配置
  emailEnabled: true,
  smtpHost: 'smtp.qq.com',
  smtpPort: 465,
  emailFrom: 'service@daodao.com',
  emailPassword: '',
  emailSsl: true,

  // 微信配置
  wechatNotifyEnabled: true,
  wechatAppId: '',
  wechatAppSecret: '',

  // 通知场景
  orderCreateNotify: ['sms', 'wechat'],
  orderPayNotify: ['sms', 'wechat'],
  orderCompleteNotify: ['wechat'],
  refundNotify: ['sms', 'wechat'],
})

const formRules: FormRules = {
  smsAccessKeyId: [
    { required: true, message: '请输入AccessKey ID', trigger: 'blur' },
  ],
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' },
  ],
  emailFrom: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
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
      ElMessage.success('通知配置保存成功')
    } catch (error) {
      ElMessage.error('通知配置保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}

const handleTestSms = () => {
  ElMessage.info('测试短信功能开发中...')
}

const handleTestEmail = () => {
  ElMessage.info('测试邮件功能开发中...')
}
</script>

<style scoped lang="scss">
.notification-config {
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
