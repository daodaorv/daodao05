<template>
  <view class="login-page">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-container">
        <image src="/static/logo.png" mode="aspectFit" class="logo-image" />
      </view>
      <view class="app-name">叨叨房车移动管理端</view>
      <view class="app-slogan">专业的房车租赁管理平台</view>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <view class="form-container">
        <!-- 用户名输入 -->
        <view class="form-item">
          <view class="input-wrapper">
            <u-icon name="account" size="20" color="#999" class="input-icon" />
            <input
              v-model="formData.username"
              type="text"
              placeholder="请输入用户名"
              class="input-field"
              :maxlength="20"
              @input="clearError"
            />
          </view>
        </view>

        <!-- 密码输入 -->
        <view class="form-item">
          <view class="input-wrapper">
            <u-icon name="lock" size="20" color="#999" class="input-icon" />
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="input-field"
              :maxlength="20"
              @input="clearError"
            />
            <u-icon
              :name="showPassword ? 'eye' : 'eye-off'"
              size="20"
              color="#999"
              class="password-toggle"
              @click="togglePassword"
            />
          </view>
        </view>

        <!-- 错误提示 -->
        <view v-if="errorMessage" class="error-message">
          <u-icon name="info-circle" size="16" color="#f56c6c" />
          <text>{{ errorMessage }}</text>
        </view>

        <!-- 记住密码 -->
        <view class="remember-section">
          <u-checkbox-group v-model="checkboxGroup">
            <u-checkbox
              name="remember"
              shape="circle"
              label="记住密码"
              label-size="14"
            />
          </u-checkbox-group>
        </view>

        <!-- 登录按钮 -->
        <view class="button-section">
          <u-button
            type="primary"
            size="large"
            :loading="loading"
            :disabled="!canSubmit"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </u-button>
        </view>

        <!-- 测试账号提示 -->
        <view class="test-account-tips">
          <view class="tips-title">测试账号</view>
          <view class="tips-item">管理员: admin / 123456</view>
          <view class="tips-item">员工: staff / 123456</view>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 v1.0.0</text>
    </view>
  </view>
</template>

<script>
import { login } from '@/api/auth'
import { setStorage, getStorage, STORAGE_KEYS } from '@/utils/storage'
import logger from '@/utils/logger'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        username: '',
        password: ''
      },

      // 显示密码
      showPassword: false,

      // 复选框组（用于记住密码）
      checkboxGroup: [],

      // 错误信息
      errorMessage: '',

      // 加载状态
      loading: false
    }
  },

  computed: {
    // 是否可以提交
    canSubmit() {
      return this.formData.username.trim() !== '' &&
             this.formData.password.trim() !== '' &&
             !this.loading
    },

    // 是否记住密码
    rememberPassword() {
      return this.checkboxGroup.includes('remember')
    }
  },

  onLoad() {
    // 加载记住的账号密码
    this.loadRememberedAccount()
  },

  methods: {
    // 加载记住的账号密码
    loadRememberedAccount() {
      const remembered = getStorage('remembered_account')
      if (remembered) {
        this.formData.username = remembered.username || ''
        this.formData.password = remembered.password || ''
        this.checkboxGroup = ['remember']
      }
    },

    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    // 清除错误信息
    clearError() {
      this.errorMessage = ''
    },

    // 表单验证
    validateForm() {
      // 验证用户名
      if (!this.formData.username.trim()) {
        this.errorMessage = '请输入用户名'
        return false
      }

      if (this.formData.username.length < 3) {
        this.errorMessage = '用户名至少3个字符'
        return false
      }

      // 验证密码
      if (!this.formData.password.trim()) {
        this.errorMessage = '请输入密码'
        return false
      }

      if (this.formData.password.length < 6) {
        this.errorMessage = '密码至少6个字符'
        return false
      }

      return true
    },

    // 处理登录
    async handleLogin() {
      // 清除错误信息
      this.clearError()

      // 表单验证
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        // 调用登录API
        const res = await login({
          username: this.formData.username,
          password: this.formData.password
        })

        // 登录成功
        if (res && res.token) {
          // 保存token和用户信息
          setStorage(STORAGE_KEYS.TOKEN, res.token)
          setStorage(STORAGE_KEYS.USER_INFO, res.userInfo)

          // 记住密码
          if (this.rememberPassword) {
            setStorage('remembered_account', {
              username: this.formData.username,
              password: this.formData.password
            })
          } else {
            // 清除记住的账号
            setStorage('remembered_account', null)
          }

          // 显示成功提示
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })

          // 延迟跳转到首页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/dashboard/index'
            })
          }, 1500)
        } else {
          this.errorMessage = '登录失败，请重试'
        }
      } catch (error) {
        logger.error('Login', '登录失败:', error)

        // 显示错误信息
        if (error && error.message) {
          this.errorMessage = error.message
        } else {
          this.errorMessage = '登录失败，请检查网络连接'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
}

/* Logo区域 */
.logo-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;
  padding-bottom: 60rpx;
}

.logo-container {
  width: 160rpx;
  height: 160rpx;
  background-color: #fff;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  margin-bottom: 40rpx;
}

.logo-image {
  width: 120rpx;
  height: 120rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.app-slogan {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 表单区域 */
.form-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-container {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 32rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 96rpx;
  position: relative;
}

.input-icon {
  margin-right: 16rpx;
}

.input-field {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 100%;
}

.password-toggle {
  margin-left: 16rpx;
  cursor: pointer;
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background-color: #fef0f0;
  border-radius: 8rpx;
  margin-bottom: 24rpx;
  font-size: 24rpx;
  color: #f56c6c;
}

/* 记住密码 */
.remember-section {
  margin-bottom: 32rpx;
}

/* 按钮区域 */
.button-section {
  margin-bottom: 32rpx;
}

/* 测试账号提示 */
.test-account-tips {
  padding: 24rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  border-left: 4rpx solid #667eea;
}

.tips-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.tips-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
  font-family: 'Courier New', monospace;
}

/* 版本信息 */
.version-info {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}
</style>
