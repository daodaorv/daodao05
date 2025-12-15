<template>
  <div class="payment-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="180px"
    >
      <!-- 微信支付配置 -->
      <div class="config-section">
        <h3 class="section-title">微信支付配置</h3>
        <el-form-item label="启用微信支付" prop="wechatPayEnabled">
          <el-switch
            v-model="form.wechatPayEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="商户号" prop="wechatMerchantId">
          <el-input
            v-model="form.wechatMerchantId"
            placeholder="请输入微信支付商户号"
            :disabled="!form.wechatPayEnabled"
          />
        </el-form-item>
        <el-form-item label="API密钥" prop="wechatApiKey">
          <el-input
            v-model="form.wechatApiKey"
            type="password"
            placeholder="请输入微信支付API密钥"
            show-password
            :disabled="!form.wechatPayEnabled"
          />
        </el-form-item>
        <el-form-item label="证书路径" prop="wechatCertPath">
          <el-input
            v-model="form.wechatCertPath"
            placeholder="请输入证书文件路径"
            :disabled="!form.wechatPayEnabled"
          />
        </el-form-item>
      </div>

      <!-- 支付宝配置 -->
      <div class="config-section">
        <h3 class="section-title">支付宝配置</h3>
        <el-form-item label="启用支付宝" prop="alipayEnabled">
          <el-switch
            v-model="form.alipayEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="应用ID" prop="alipayAppId">
          <el-input
            v-model="form.alipayAppId"
            placeholder="请输入支付宝应用ID"
            :disabled="!form.alipayEnabled"
          />
        </el-form-item>
        <el-form-item label="应用私钥" prop="alipayPrivateKey">
          <el-input
            v-model="form.alipayPrivateKey"
            type="textarea"
            :rows="4"
            placeholder="请输入应用私钥"
            :disabled="!form.alipayEnabled"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="alipayPublicKey">
          <el-input
            v-model="form.alipayPublicKey"
            type="textarea"
            :rows="4"
            placeholder="请输入支付宝公钥"
            :disabled="!form.alipayEnabled"
          />
        </el-form-item>
      </div>

      <!-- 退款配置 -->
      <div class="config-section">
        <h3 class="section-title">退款配置</h3>
        <el-form-item label="自动退款" prop="autoRefund">
          <el-switch
            v-model="form.autoRefund"
            active-text="开启"
            inactive-text="关闭"
          />
          <span class="form-tip">符合条件的退款申请自动处理</span>
        </el-form-item>
        <el-form-item label="退款审核" prop="refundReview">
          <el-switch
            v-model="form.refundReview"
            active-text="需要审核"
            inactive-text="自动通过"
          />
        </el-form-item>
        <el-form-item label="退款手续费率" prop="refundFeeRate">
          <el-input-number
            v-model="form.refundFeeRate"
            :min="0"
            :max="10"
            :step="0.1"
            :precision="1"
          />
          <span class="form-tip">%</span>
        </el-form-item>
        <el-form-item label="退款到账时间" prop="refundArrivalTime">
          <el-input-number
            v-model="form.refundArrivalTime"
            :min="1"
            :max="15"
            :step="1"
          />
          <span class="form-tip">工作日</span>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存配置
        </el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="warning" @click="handleTest">测试连接</el-button>
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
  // 微信支付
  wechatPayEnabled: true,
  wechatMerchantId: '1234567890',
  wechatApiKey: '',
  wechatCertPath: '/path/to/cert.pem',

  // 支付宝
  alipayEnabled: true,
  alipayAppId: '2021001234567890',
  alipayPrivateKey: '',
  alipayPublicKey: '',

  // 退款配置
  autoRefund: false,
  refundReview: true,
  refundFeeRate: 0.5,
  refundArrivalTime: 3,
})

const formRules: FormRules = {
  wechatMerchantId: [
    { required: true, message: '请输入微信支付商户号', trigger: 'blur' },
  ],
  alipayAppId: [
    { required: true, message: '请输入支付宝应用ID', trigger: 'blur' },
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
      ElMessage.success('支付配置保存成功')
    } catch (error) {
      ElMessage.error('支付配置保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}

const handleTest = () => {
  ElMessage.info('测试连接功能开发中...')
}
</script>

<style scoped lang="scss">
.payment-config {
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
