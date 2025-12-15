<template>
  <view class="password-page">
    <view class="tips">为了保护账号安全，请定期修改登录密码。</view>
    <view class="form-box">
      <u-form ref="formRef" :model="formData" :rules="rules">
        <u-form-item label="当前密码" prop="oldPassword" required>
          <u-input v-model="formData.oldPassword" type="password" placeholder="请输入当前密码" />
        </u-form-item>
        <u-form-item label="新密码" prop="newPassword" required>
          <u-input v-model="formData.newPassword" type="password" placeholder="至少6位，建议字母+数字" />
        </u-form-item>
        <u-form-item label="确认新密码" prop="confirmPassword" required>
          <u-input v-model="formData.confirmPassword" type="password" placeholder="再次输入新密码" />
        </u-form-item>
      </u-form>
    </view>

    <view class="btn-box">
      <button class="submit-btn" :loading="submitting" @tap="handleSubmit">确认修改</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref<any>(null)
const submitting = ref(false)
const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirm = (rule: any, value: string, callback: (error?: string) => void) => {
  if (value !== formData.value.newPassword) {
    callback('两次密码输入不一致')
  } else {
    callback()
  }
}

const rules = {
  oldPassword: {
    rules: [{ required: true, errorMessage: '请输入当前密码' }]
  },
  newPassword: {
    rules: [
      { required: true, errorMessage: '请输入新密码' },
      { minLength: 6, errorMessage: '新密码不少于6位' }
    ]
  },
  confirmPassword: {
    rules: [
      { required: true, errorMessage: '请确认新密码' },
      { validator: validateConfirm }
    ]
  }
}

const handleSubmit = () => {
  formRef.value.validate().then(async () => {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      uni.showToast({ title: '修改成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    }, 1000)
  }).catch(() => {
    uni.showToast({ title: '请完善信息', icon: 'none' })
  })
}
</script>

<style scoped lang="scss">
.password-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 24rpx;
}

.tips {
  background-color: #FFF3E0;
  color: #C97A12;
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  line-height: 1.6;
}

.form-box {
  margin-top: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
}

.btn-box {
  margin: 60rpx 24rpx;
}

.submit-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  
  &::after {
    border: none;
  }
}
</style>
