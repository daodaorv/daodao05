<template>
  <view class="edit-profile-container">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" fullscreen text="加载中..." />

    <!-- 编辑表单 -->
    <view v-else class="edit-form">
      <!-- 头像上传 -->
      <view class="form-section">
        <view class="section-title">头像</view>
        <view class="avatar-upload" @click="uploadAvatar">
          <image :src="formData.avatar" mode="aspectFill" class="avatar-preview" />
          <view class="upload-mask">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击更换</text>
          </view>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        <view class="form-list">
          <view class="form-item">
            <text class="form-label">姓名</text>
            <input
              v-model="formData.name"
              class="form-input"
              placeholder="请输入姓名"
              maxlength="20"
            />
          </view>
          <view class="form-item">
            <text class="form-label">手机号</text>
            <input
              v-model="formData.phone"
              class="form-input"
              type="number"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </view>
          <view class="form-item">
            <text class="form-label">角色</text>
            <text class="form-value disabled">{{ getRoleText(formData.role) }}</text>
          </view>
        </view>
      </view>

      <!-- 密码修改 -->
      <view class="form-section">
        <view class="section-title">
          <text>修改密码</text>
          <text class="section-tip">（不修改请留空）</text>
        </view>
        <view class="form-list">
          <view class="form-item">
            <text class="form-label">原密码</text>
            <input
              v-model="formData.oldPassword"
              class="form-input"
              type="password"
              placeholder="请输入原密码"
              password
            />
          </view>
          <view class="form-item">
            <text class="form-label">新密码</text>
            <input
              v-model="formData.newPassword"
              class="form-input"
              type="password"
              placeholder="请输入新密码（6-20位）"
              password
              maxlength="20"
            />
          </view>
          <view class="form-item">
            <text class="form-label">确认密码</text>
            <input
              v-model="formData.confirmPassword"
              class="form-input"
              type="password"
              placeholder="请再次输入新密码"
              password
              maxlength="20"
            />
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <button class="action-btn" @click="handleCancel">
          取消
        </button>
        <button class="action-btn primary" type="primary" @click="handleSubmit">
          保存
        </button>
      </view>
    </view>

  </view>
</template>

<script>
import { getUserInfo } from '@/api/auth'
import { chooseImage, uploadImage } from '@/utils/upload'
import { validatePhone } from '@/utils/validate'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    LoadingSpinner
  },

  data() {
    return {
      loading: false,

      formData: {
        avatar: '',
        name: '',
        phone: '',
        role: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },

      originalData: {} // 保存原始数据用于对比
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  methods: {
    async loadUserInfo() {
      this.loading = true
      try {
        const data = await getUserInfo()
        this.formData = {
          avatar: data.avatar || '',
          name: data.name || '',
          phone: data.phone || '',
          role: data.role || '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        // 保存原始数据
        this.originalData = JSON.parse(JSON.stringify(this.formData))
      } catch (error) {
        console.error('加载用户信息失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async uploadAvatar() {
      try {
        // 选择图片
        const tempFilePath = await chooseImage({
          count: 1,
          sizeType: ['compressed']
        })

        uni.showLoading({
          title: '上传中...'
        })

        // 上传图片
        const result = await uploadImage(tempFilePath)
        this.formData.avatar = result.url

        uni.hideLoading()
        uni.showToast({
          title: '头像上传成功',
          icon: 'success'
        })
      } catch (error) {
        uni.hideLoading()
        console.error('上传头像失败:', error)
        uni.showToast({
          title: error.message || '上传失败',
          icon: 'none'
        })
      }
    },

    validateForm() {
      // 验证姓名
      if (!this.formData.name || this.formData.name.trim() === '') {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return false
      }

      // 验证手机号
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false
      }

      if (!validatePhone(this.formData.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return false
      }

      // 如果填写了密码相关字段，进行密码验证
      if (this.formData.oldPassword || this.formData.newPassword || this.formData.confirmPassword) {
        // 验证原密码
        if (!this.formData.oldPassword) {
          uni.showToast({
            title: '请输入原密码',
            icon: 'none'
          })
          return false
        }

        // 验证新密码
        if (!this.formData.newPassword) {
          uni.showToast({
            title: '请输入新密码',
            icon: 'none'
          })
          return false
        }

        if (this.formData.newPassword.length < 6 || this.formData.newPassword.length > 20) {
          uni.showToast({
            title: '新密码长度为6-20位',
            icon: 'none'
          })
          return false
        }

        // 验证确认密码
        if (this.formData.newPassword !== this.formData.confirmPassword) {
          uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
          })
          return false
        }
      }

      return true
    },

    handleCancel() {
      // 检查是否有修改
      const hasChanges =
        this.formData.avatar !== this.originalData.avatar ||
        this.formData.name !== this.originalData.name ||
        this.formData.phone !== this.originalData.phone ||
        this.formData.oldPassword ||
        this.formData.newPassword ||
        this.formData.confirmPassword

      if (hasChanges) {
        uni.showModal({
          title: '取消编辑',
          content: '您有未保存的修改，确定要取消吗？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack()
            }
          }
        })
      } else {
        uni.navigateBack()
      }
    },

    handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      uni.showModal({
        title: '保存修改',
        content: '确认保存个人信息修改吗？',
        success: (res) => {
          if (res.confirm) {
            this.submitForm()
          }
        }
      })
    },

    async submitForm() {
      try {
        uni.showLoading({
          title: '保存中...'
        })

        // 准备提交数据
        const submitData = {
          avatar: this.formData.avatar,
          name: this.formData.name,
          phone: this.formData.phone
        }

        // 如果修改了密码，添加密码字段
        if (this.formData.oldPassword && this.formData.newPassword) {
          submitData.oldPassword = this.formData.oldPassword
          submitData.newPassword = this.formData.newPassword
        }

        // TODO: 调用API提交数据
        // await updateUserInfo(submitData)

        // Mock延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        uni.hideLoading()

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })

        // 如果修改了密码，提示重新登录
        if (submitData.oldPassword && submitData.newPassword) {
          setTimeout(() => {
            uni.showModal({
              title: '密码已修改',
              content: '密码修改成功，请重新登录',
              showCancel: false,
              success: () => {
                uni.reLaunch({
                  url: '/pages/login/login'
                })
              }
            })
          }, 1500)
        } else {
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (error) {
        uni.hideLoading()
        console.error('保存失败:', error)
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      }
    },

    getRoleText(role) {
      const roleMap = {
        admin: '超级管理员',
        manager: '门店经理',
        staff: '门店员工',
        service: '客服人员'
      }
      return roleMap[role] || '未知角色'
    }
  }
}
</script>

<style scoped>
.edit-profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.edit-form {
  padding: 20rpx;
}

/* 表单区块 */
.form-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.section-tip {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
  margin-left: 12rpx;
}

/* 头像上传 */
.avatar-upload {
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview {
  width: 100%;
  height: 100%;
}

.upload-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.upload-icon {
  font-size: 24rpx;
}

.upload-text {
  font-size: 20rpx;
  margin-top: 4rpx;
}

/* 表单列表 */
.form-list {
  display: flex;
  flex-direction: column;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.form-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  text-align: right;
}

.form-value.disabled {
  color: #999;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}
</style>
