<template>
  <view class="login-page">
    <!-- Logo区域 -->
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">叨叨房车</text>
      <text class="app-slogan">让房车旅行更简单</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <!-- Tab切换 -->
      <view class="login-tabs">
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'password' }"
          @tap="switchLoginType('password')"
        >
          <text>密码登录</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'code' }"
          @tap="switchLoginType('code')"
        >
          <text>验证码登录</text>
        </view>
      </view>

      <!-- 手机号输入 -->
      <view class="form-item">
        <uni-icons type="phone" size="20" color="#999"></uni-icons>
        <input 
          class="input" 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>

      <!-- 密码登录 -->
      <view v-if="loginType === 'password'" class="form-item">
        <uni-icons type="locked" size="20" color="#999"></uni-icons>
        <input 
          class="input" 
          :type="showPassword ? 'text' : 'password'"
          v-model="password" 
          placeholder="请输入密码"
        />
        <uni-icons 
          :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" 
          size="20" 
          color="#999"
          @tap="showPassword = !showPassword"
        ></uni-icons>
      </view>

      <!-- 验证码登录 -->
      <view v-else class="form-item">
        <uni-icons type="chatbubble" size="20" color="#999"></uni-icons>
        <input 
          class="input" 
          type="number" 
          v-model="verificationCode" 
          placeholder="请输入验证码"
          maxlength="6"
        />
        <button 
          class="code-btn" 
          :disabled="codeCountdown > 0"
          @tap="sendCode"
        >
          {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
        </button>
      </view>

      <!-- 登录按钮 -->
      <button class="login-btn" :loading="loading" @tap="handleLogin">
        登录
      </button>

      <!-- 注册链接 -->
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link-text" @tap="goToRegister">立即注册</text>
      </view>

      <!-- 协议 -->
      <view class="agreement">
        <checkbox-group @change="onAgreementChange">
          <label>
            <checkbox :checked="agreedToTerms" color="#3cc51f" />
            <text class="agreement-text">我已阅读并同意</text>
            <text class="link-text">《用户协议》</text>
            <text class="agreement-text">和</text>
            <text class="link-text">《隐私政策》</text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { authApi } from '@/api/auth';

const userStore = useUserStore();

const loginType = ref('password'); // 'password' or 'code'
const phone = ref('');
const password = ref('');
const verificationCode = ref('');
const showPassword = ref(false);
const agreedToTerms = ref(false);
const loading = ref(false);
const codeCountdown = ref(0);

let countdownTimer = null;

const switchLoginType = (type) => {
  loginType.value = type;
};

const sendCode = async () => {
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' });
    return;
  }

  try {
    await authApi.sendCode({
      phone: phone.value,
      code_type: 'login'
    });
    
    uni.showToast({ title: '验证码已发送', icon: 'success' });
    
    // 开始倒计时
    codeCountdown.value = 60;
    countdownTimer = setInterval(() => {
      codeCountdown.value--;
      if (codeCountdown.value <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);
  } catch (error) {
    uni.showToast({ 
      title: error.message || '发送失败', 
      icon: 'none' 
    });
  }
};

const handleLogin = async () => {
  // 验证输入
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' });
    return;
  }

  if (loginType.value === 'password') {
    if (!password.value) {
      uni.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
  } else {
    if (!verificationCode.value) {
      uni.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
  }

  if (!agreedToTerms.value) {
    uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' });
    return;
  }

  loading.value = true;

  try {
    let result;
    if (loginType.value === 'password') {
      result = await authApi.login({
        phone: phone.value,
        password: password.value,
        platform: 'miniprogram'
      });
    } else {
      result = await authApi.loginWithCode({
        phone: phone.value,
        verification_code: verificationCode.value,
        platform: 'miniprogram'
      });
    }

    // 保存用户信息和token
    userStore.setToken(result.token);
    userStore.setUserInfo(result.user);

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      uni.switchTab({ url: '/pages/profile/index' });
    }, 1500);
  } catch (error) {
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const onAgreementChange = (e) => {
  agreedToTerms.value = e.detail.value.length > 0;
};

const goToRegister = () => {
  uni.showToast({ title: '注册功能开发中', icon: 'none' });
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background-color: #fff;
  padding: 40px 30px;
}

.logo-section {
  text-align: center;
  margin-bottom: 50px;

  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
  }

  .app-name {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .app-slogan {
    display: block;
    font-size: 14px;
    color: #999;
  }
}

.login-form {
  .login-tabs {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 12px 0;
      font-size: 16px;
      color: #666;
      position: relative;

      &.active {
        color: #3cc51f;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background-color: #3cc51f;
          border-radius: 2px;
        }
      }
    }
  }

  .form-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin-bottom: 15px;
    background-color: #f5f5f5;
    border-radius: 8px;

    .input {
      flex: 1;
      margin-left: 10px;
      font-size: 15px;
    }

    .code-btn {
      padding: 5px 12px;
      font-size: 13px;
      color: #3cc51f;
      background-color: transparent;
      border: 1px solid #3cc51f;
      border-radius: 4px;
      line-height: 1.2;

      &[disabled] {
        color: #999;
        border-color: #ddd;
      }
    }
  }

  .login-btn {
    margin-top: 30px;
    background: linear-gradient(135deg, #3cc51f 0%, #2ea516 100%);
    color: #fff;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
  }

  .register-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;

    .link-text {
      color: #3cc51f;
      margin-left: 5px;
    }
  }

  .agreement {
    margin-top: 30px;

    label {
      display: flex;
      align-items: center;
      font-size: 12px;

      .agreement-text {
        color: #999;
        margin: 0 3px;
      }

      .link-text {
        color: #3cc51f;
      }
    }
  }
}
</style>

