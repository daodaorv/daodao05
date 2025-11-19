<template>
  <view class="login-container">
    <view class="login-header">
      <text class="title">叨叨房车</text>
      <text class="subtitle">移动管理端</text>
    </view>
    
    <view class="login-form">
      <view class="form-item">
        <input v-model="phone" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-item">
        <input v-model="password" type="password" placeholder="请输入密码" password />
      </view>
      <button class="login-btn" @click="handleLogin" :loading="loading">登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { authApi } from '../../api/auth'

const phone = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  // 验证手机号
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }

  // 验证密码
  if (!password.value) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  if (password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }

  loading.value = true
  try {
    // 使用API模块进行登录
    const result = await authApi.login({
      phone: phone.value,
      password: password.value
    })

    // 保存token和用户信息（使用mobile_admin_前缀）
    uni.setStorageSync('mobile_admin_token', result.token)
    uni.setStorageSync('mobile_admin_userInfo', result.user)

    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100rpx 60rpx;
}

.login-header {
  text-align: center;
  margin-bottom: 100rpx;
}

.title {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20rpx;
}

.subtitle {
  display: block;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-item input {
  width: 100%;
  height: 90rpx;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 10rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.login-btn:active {
  opacity: 0.8;
}
</style>

