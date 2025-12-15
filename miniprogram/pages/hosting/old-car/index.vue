<template>
  <view class="old-car-hosting">
    <!-- 顶部说明 -->
    <view class="info-banner">
      <text class="banner-title">自有车托管，让闲置房车为您赚钱</text>
      <text class="banner-desc">车主70%分成 · 平台统保 · 淡季补贴</text>
    </view>

    <!-- 托管流程 -->
    <view class="process-section">
      <view class="section-title">托管流程</view>
      <view class="process-steps">
        <view class="step-item" v-for="(step, index) in steps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <text class="step-text">{{ step }}</text>
        </view>
      </view>
    </view>

    <!-- 申请表单 -->
    <view class="form-section">
      <view class="section-title">车辆信息</view>

      <!-- 行驶证上传 -->
      <view class="form-item">
        <text class="form-label">行驶证 <text class="required">*</text></text>
        <view class="upload-area" @click="uploadLicense">
          <image v-if="formData.licenseImage" :src="formData.licenseImage" class="uploaded-img" mode="aspectFill"></image>
          <view v-else class="upload-placeholder">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击上传行驶证</text>
          </view>
        </view>
      </view>

      <!-- 车辆照片上传 -->
      <view class="form-item">
        <text class="form-label">车辆实拍照片（至少12张） <text class="required">*</text></text>
        <view class="photo-grid">
          <view v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
            <image :src="photo" class="photo-img" mode="aspectFill"></image>
            <view class="photo-delete" @click="deletePhoto(index)">×</view>
          </view>
          <view v-if="formData.photos.length < 20" class="photo-add" @click="uploadPhotos">
            <text class="add-icon">+</text>
            <text class="add-text">添加照片</text>
          </view>
        </view>
        <text class="form-tip">请拍摄车辆外观、内饰、仪表盘等，照片越详细审核越快</text>
      </view>

      <!-- 车主信息 -->
      <view class="form-item">
        <text class="form-label">车主姓名 <text class="required">*</text></text>
        <input class="form-input" v-model="formData.ownerName" placeholder="请输入车主姓名" />
      </view>

      <view class="form-item">
        <text class="form-label">联系电话 <text class="required">*</text></text>
        <input class="form-input" v-model="formData.phone" name="number" placeholder="请输入联系电话" />
      </view>

      <!-- 选择门店 -->
      <view class="form-item">
        <text class="form-label">交车门店 <text class="required">*</text></text>
        <picker mode="selector" :range="stores" range-key="name" @change="onStoreChange">
          <view class="picker-input">
            <text :class="formData.storeId ? '' : 'placeholder'">
              {{ formData.storeId ? stores.find(s => s.id === formData.storeId).name : '请选择就近门店' }}
            </text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 收益说明 -->
    <view class="income-section">
      <view class="section-title">收益说明</view>
      <view class="income-card">
        <view class="income-item">
          <text class="income-label">分成比例</text>
          <text class="income-value">车主70%</text>
        </view>
        <view class="income-item">
          <text class="income-label">淡季补贴</text>
          <text class="income-value">最高1000元/月</text>
        </view>
        <view class="income-item">
          <text class="income-label">保险费用</text>
          <text class="income-value">平台统保，零成本</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="handleSubmit">提交申请</button>
      <view class="agreement">
        <checkbox-group @change="onAgreementChange">
          <label>
            <checkbox :checked="agreed" />
            <text>我已阅读并同意</text>
            <text class="link" @click.stop="viewAgreement">《托管协议》</text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        '上传行驶证和车辆照片',
        '平台审核（24小时内）',
        '签署电子托管协议',
        '选择门店交车',
        '上架出租开始赚钱'
      ],
      formData: {
        licenseImage: '',
        photos: [],
        ownerName: '',
        phone: '',
        storeId: ''
      },
      stores: [
        { id: 1, name: '北京朝阳门店' },
        { id: 2, name: '北京海淀门店' },
        { id: 3, name: '上海浦东门店' }
      ],
      agreed: false
    }
  },

  methods: {
    // 上传行驶证
    uploadLicense() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.formData.licenseImage = res.tempFilePaths[0]
        }
      })
    },

    // 上传车辆照片
    uploadPhotos() {
      const maxCount = 20 - this.formData.photos.length
      uni.chooseImage({
        count: Math.min(maxCount, 9),
        success: (res) => {
          this.formData.photos.push(...res.tempFilePaths)
        }
      })
    },

    // 删除照片
    deletePhoto(index) {
      this.formData.photos.splice(index, 1)
    },

    // 选择门店
    onStoreChange(e) {
      this.formData.storeId = this.stores[e.detail.value].id
    },

    // 协议勾选
    onAgreementChange(e) {
      this.agreed = e.detail.value.length > 0
    },

    // 查看协议
    viewAgreement() {
      uni.navigateTo({
        url: '/pages/hosting/agreement/index'
      })
    },

    // 提交申请
    handleSubmit() {
      // 表单验证
      if (!this.formData.licenseImage) {
        uni.showToast({ title: '请上传行驶证', icon: 'none' })
        return
      }
      if (this.formData.photos.length < 12) {
        uni.showToast({ title: '请至少上传12张车辆照片', icon: 'none' })
        return
      }
      if (!this.formData.ownerName) {
        uni.showToast({ title: '请输入车主姓名', icon: 'none' })
        return
      }
      if (!this.formData.phone) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      if (!this.formData.storeId) {
        uni.showToast({ title: '请选择交车门店', icon: 'none' })
        return
      }
      if (!this.agreed) {
        uni.showToast({ title: '请阅读并同意托管协议', icon: 'none' })
        return
      }

      // 提交申请
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '提交成功',
          content: '您的托管申请已提交，我们将在24小时内完成审核',
          showCancel: false,
          success: () => {
            uni.navigateBack()
          }
        })
      }, 1500)
    }
  }
}
</script>

<style scoped>
.old-car-hosting {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 200rpx;
}

.info-banner {
  background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%);
  padding: 48rpx 32rpx;
  text-align: center;
  color: #FFFFFF;
}

.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.banner-desc {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
}

.process-section,
.form-section,
.income-section {
  margin: 24rpx 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: #FF9F29;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.step-text {
  font-size: 28rpx;
  color: #666666;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 16rpx;
}

.required {
  color: #FF4444;
}

.upload-area {
  width: 100%;
  height: 300rpx;
  border: 2rpx dashed #DDDDDD;
  border-radius: 12rpx;
  overflow: hidden;
}

.uploaded-img {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999999;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.photo-item {
  position: relative;
  padding-bottom: 100%;
}

.photo-img {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.photo-delete {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.photo-add {
  padding-bottom: 100%;
  border: 2rpx dashed #DDDDDD;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.add-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  font-size: 48rpx;
  color: #CCCCCC;
}

.add-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font-size: 20rpx;
  color: #999999;
}

.form-tip {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-top: 16rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.picker-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #CCCCCC;
}

.picker-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

.income-card {
  display: flex;
  justify-content: space-around;
  padding: 32rpx 0;
}

.income-item {
  text-align: center;
}

.income-label {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 16rpx;
}

.income-value {
  display: block;
  font-size: 32rpx;
  color: #FF9F29;
  font-weight: 600;
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #FF9F29;
  color: #FFFFFF;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  margin-bottom: 16rpx;
}

.agreement {
  text-align: center;
  font-size: 24rpx;
  color: #999999;
}

.link {
  color: #FF9F29;
}
</style>
