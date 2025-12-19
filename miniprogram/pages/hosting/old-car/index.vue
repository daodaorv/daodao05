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
        <text class="form-label">车况照片（最多9张） <text class="required">*</text></text>
        <view class="photo-grid">
          <view v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
            <image :src="photo" class="photo-img" mode="aspectFill"></image>
            <view class="photo-delete" @click="deletePhoto(index)">×</view>
          </view>
          <view v-if="formData.photos.length < 9" class="photo-add" @click="uploadPhotos">
            <text class="add-icon">+</text>
            <text class="add-text">添加照片</text>
          </view>
        </view>
        <text class="form-tip">请拍摄车辆外观、内饰、仪表盘等。更详细的车况图片等资源将在线下验车时由门店处理</text>
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

      <!-- 选择城市 -->
      <view class="form-item">
        <text class="form-label">选择城市 <text class="required">*</text></text>
        <picker mode="selector" :range="cities" range-key="name" @change="onCityChange">
          <view class="picker-input">
            <text :class="formData.cityId ? '' : 'placeholder'">
              {{ formData.cityId ? cities.find(c => c.id === formData.cityId)?.name : '请选择城市' }}
            </text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>

      <!-- 选择门店 -->
      <view class="form-item">
        <text class="form-label">交车门店 <text class="required">*</text></text>
        <picker mode="selector" :range="stores" range-key="name" @change="onStoreChange" :disabled="!formData.cityId">
          <view class="picker-input" :class="!formData.cityId ? 'disabled' : ''">
            <text :class="formData.storeId ? '' : 'placeholder'">
              {{ formData.storeId ? stores.find(s => s.id === formData.storeId)?.name : (formData.cityId ? '请选择门店' : '请先选择城市') }}
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
import { logger } from '@/utils/logger';
import hostingMock from '@/api/mock/hosting'

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
        cityId: '',
        storeId: ''
      },
      cities: [],
      stores: [],
      userLocation: null,
      agreed: false
    }
  },

  onLoad() {
    this.loadCities()
    this.getUserLocation()
  },

  methods: {
    // 加载城市列表
    loadCities() {
      this.cities = hostingMock.getCityList()
    },

    // 获取用户定位
    getUserLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.userLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          this.autoSelectCityAndStore()
        },
        fail: () => {
          logger.debug('获取定位失败，使用默认城市')
          // 定位失败时默认选择第一个城市
          if (this.cities.length > 0) {
            this.formData.cityId = this.cities[0].id
            this.loadStores()
          }
        }
      })
    },

    // 自动选择最近的城市和门店
    autoSelectCityAndStore() {
      if (!this.userLocation || this.cities.length === 0) return

      // 计算距离并找到最近的城市
      let nearestCity = null
      let minDistance = Infinity

      this.cities.forEach(city => {
        const distance = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          city.latitude,
          city.longitude
        )
        if (distance < minDistance) {
          minDistance = distance
          nearestCity = city
        }
      })

      if (nearestCity) {
        this.formData.cityId = nearestCity.id
        this.loadStores()

        // 自动选择该城市最近的门店
        this.$nextTick(() => {
          this.autoSelectNearestStore()
        })
      }
    },

    // 自动选择最近的门店
    autoSelectNearestStore() {
      if (!this.userLocation || this.stores.length === 0) return

      let nearestStore = null
      let minDistance = Infinity

      this.stores.forEach(store => {
        const distance = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          store.latitude,
          store.longitude
        )
        if (distance < minDistance) {
          minDistance = distance
          nearestStore = store
        }
      })

      if (nearestStore) {
        this.formData.storeId = nearestStore.id
      }
    },

    // 计算两点之间的距离（单位：公里）
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // 地球半径（公里）
      const dLat = this.toRad(lat2 - lat1)
      const dLon = this.toRad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },

    // 角度转弧度
    toRad(degrees) {
      return degrees * (Math.PI / 180)
    },

    // 加载门店列表
    loadStores() {
      if (this.formData.cityId) {
        this.stores = hostingMock.getStoreList(this.formData.cityId)
        // 如果当前选择的门店不在新城市的门店列表中，清空门店选择
        if (this.formData.storeId) {
          const storeExists = this.stores.some(s => s.id === this.formData.storeId)
          if (!storeExists) {
            this.formData.storeId = ''
          }
        }
      } else {
        this.stores = []
        this.formData.storeId = ''
      }
    },

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
      const maxCount = 9 - this.formData.photos.length
      uni.chooseImage({
        count: maxCount,
        success: (res) => {
          this.formData.photos.push(...res.tempFilePaths)
        }
      })
    },

    // 删除照片
    deletePhoto(index) {
      this.formData.photos.splice(index, 1)
    },

    // 选择城市
    onCityChange(e) {
      this.formData.cityId = this.cities[e.detail.value].id
      this.loadStores()
      // 自动选择该城市最近的门店
      if (this.userLocation) {
        this.$nextTick(() => {
          this.autoSelectNearestStore()
        })
      }
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
      if (this.formData.photos.length === 0) {
        uni.showToast({ title: '请上传车况照片', icon: 'none' })
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
      if (!this.formData.cityId) {
        uni.showToast({ title: '请选择城市', icon: 'none' })
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

.picker-input.disabled {
  opacity: 0.5;
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
