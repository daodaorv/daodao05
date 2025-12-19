<template>
  <view class="report-page">
    <view class="form-section">
      <view class="section-title">申报类型</view>
      <view class="type-options">
        <view
          class="type-item"
          :class="{ active: reportType === 'accident' }"
          @tap="reportType = 'accident'"
        >
          <u-icon name="info-circle-fill" size="24" :color="reportType === 'accident' ? '#FF4D4F' : '#999'"></u-icon>
          <text>交通事故</text>
        </view>
        <view
          class="type-item"
          :class="{ active: reportType === 'breakdown' }"
          @tap="reportType = 'breakdown'"
        >
          <u-icon name="setting-fill" size="24" :color="reportType === 'breakdown' ? '#FF9F29' : '#999'"></u-icon>
          <text>车辆故障</text>
        </view>
      </view>
    </view>

    <view class="form-section">
      <view class="section-title">情况描述</view>
      <u-textarea
        v-model="description"
        placeholder="请描述事故/故障具体情况、造成的影响以及当前状态..."
        maxlength="200"
        auto-height
      />
      <text class="count">{{ description.length }}/200</text>
    </view>

    <view class="form-section">
      <view class="section-title">现场照片</view>
      <view class="image-grid">
        <view
          v-for="(item, index) in imageList"
          :key="`${item}-${index}`"
          class="image-item"
          @tap="previewImage(index)"
        >
          <image class="evidence-image" :src="item" mode="aspectFill" />
          <view class="remove-btn" @tap.stop="removeImage(index)">
            <u-icon name="close" size="20" color="#ffffff"></u-icon>
          </view>
        </view>
        <view v-if="imageList.length < maxImages" class="upload-btn" @tap="addImages">
          <u-icon name="photo" size="32" color="#FF9F29"></u-icon>
          <text>添加照片</text>
        </view>
      </view>
      <text class="count">已添加 {{ imageList.length }}/{{ maxImages }}</text>
    </view>

    <view class="form-section">
      <view class="section-title">联系电话</view>
      <u-input
        type="number"
        v-model="contactPhone"
        placeholder="请输入联系电话，方便客服联系您"
        maxlength="11"
        clearable
      />
    </view>

    <view class="form-section">
      <view class="section-title">当前位置</view>
      <view class="location-actions">
        <view
          class="location-btn primary"
          :class="{ disabled: locating }"
          @tap="chooseLocation"
        >
          <u-icon name="map-fill" size="18" color="#ffffff"></u-icon>
          <text>{{ locating ? '定位中...' : '自动定位' }}</text>
        </view>
        <view class="location-btn ghost" v-if="currentAddress" @tap="clearLocation">
          <u-icon name="close-circle" size="18" color="#FF9F29"></u-icon>
          <text>清空</text>
        </view>
      </view>
      <u-textarea
        v-model="currentAddress"
        placeholder="定位失败时可手动输入或粘贴详细地址信息"
        maxlength="120"
        auto-height
      />
      <text class="helper-text">若无法定位，请在此输入事故发生的准确位置</text>
    </view>

    <view class="submit-section">
      <button class="btn-submit" @tap="submitReport" :loading="submitting">提交申报</button>
      <view class="tips">
        <u-icon name="info" size="14" color="#999"></u-icon>
        <text>提交后客服将第一时间联系您，请保持手机畅通</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const orderId = ref('')
const orderNo = ref('')
const reportType = ref<'accident' | 'breakdown'>('accident')
const description = ref('')
const maxImages = 6
const imageList = ref<string[]>([])
const contactPhone = ref('')
const currentAddress = ref('')
const currentLocation = ref<{ latitude?: number; longitude?: number }>({})
const submitting = ref(false)
const locating = ref(false)

// 腾讯地图API密钥 - 需要在 https://lbs.qq.com/ 申请
const TENCENT_MAP_KEY = 'XOUBZ-CASKW-PXZRP-6T7UV-QNKO7-YNFBH'

// 接收订单参数
onLoad((options: any) => {
  if (options.orderId) {
    orderId.value = options.orderId
  }
  if (options.orderNo) {
    orderNo.value = options.orderNo
  }
})

const chooseLocation = () => {
  if (locating.value) return
  locating.value = true
  const finish = () => {
    locating.value = false
  }

  // 直接获取当前位置
  uni.getLocation({
    type: 'gcj02',
    success: async (res) => {
      currentLocation.value = { latitude: res.latitude, longitude: res.longitude }

      // 使用腾讯地图WebService API逆地理编码
      try {
        const result: any = await uni.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: `${res.latitude},${res.longitude}`,
            key: TENCENT_MAP_KEY,
            get_poi: 1
          }
        })

        logger.debug('逆地理编码结果:', result)

        if (result.statusCode === 200 && result.data.status === 0) {
          const addressData = result.data.result
          const formattedAddress = addressData.formatted_addresses?.recommend ||
                                   addressData.address ||
                                   `${addressData.address_component?.province || ''}${addressData.address_component?.city || ''}${addressData.address_component?.district || ''}${addressData.address_component?.street || ''}`

          currentAddress.value = formattedAddress
          logger.debug('解析的地址:', formattedAddress)
        } else {
          logger.error('地址解析失败:', result.data)
          currentAddress.value = `${res.latitude.toFixed(6)}, ${res.longitude.toFixed(6)}`
          uni.showToast({ title: '地址解析失败，请手动输入', icon: 'none' })
        }
      } catch (error) {
        logger.error('逆地理编码请求失败:', error)
        currentAddress.value = `${res.latitude.toFixed(6)}, ${res.longitude.toFixed(6)}`
        uni.showToast({ title: '地址解析失败，请手动输入', icon: 'none' })
      }

      finish()
    },
    fail: (err) => {
      logger.error('定位失败:', err)
      uni.showToast({ title: '定位失败，请检查定位权限或手动输入地址', icon: 'none' })
      finish()
    }
  })
}

const clearLocation = () => {
  currentAddress.value = ''
  currentLocation.value = {}
}

const resetForm = () => {
  description.value = ''
  imageList.value = []
  contactPhone.value = ''
  currentAddress.value = ''
  currentLocation.value = {}
  reportType.value = 'accident'
}

const addImages = () => {
  const remain = maxImages - imageList.value.length
  if (remain <= 0) {
    uni.showToast({ title: `最多可选择${maxImages}张照片`, icon: 'none' })
    return
  }
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed', 'original'],
    sourceType: ['album', 'camera'],
    success: res => {
      imageList.value = imageList.value.concat(res.tempFilePaths)
    }
  })
}

const removeImage = (index: number) => {
  imageList.value.splice(index, 1)
}

const previewImage = (index: number) => {
  if (!imageList.value.length) return
  uni.previewImage({
    current: imageList.value[index],
    urls: imageList.value
  })
}

const submitReport = () => {
  if (!description.value.trim()) {
    uni.showToast({ title: '请填写情况描述', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(contactPhone.value)) {
    uni.showToast({ title: '请输入有效手机号', icon: 'none' })
    return
  }
  if (!currentAddress.value) {
    uni.showToast({ title: '请提供当前位置', icon: 'none' })
    return
  }

  // 构建提交数据
  const reportData = {
    orderId: orderId.value,
    orderNo: orderNo.value,
    reportType: reportType.value,
    description: description.value,
    images: imageList.value,
    contactPhone: contactPhone.value,
    location: {
      address: currentAddress.value,
      latitude: currentLocation.value.latitude,
      longitude: currentLocation.value.longitude
    }
  }

  logger.debug('提交异常申报:', reportData)

  submitting.value = true
  uni.showLoading({ title: '提交中...' })
  setTimeout(() => {
    submitting.value = false
    uni.hideLoading()
    uni.showModal({
      title: '申报已提交',
      content: '我们已收到您的事故/故障申报，客服会尽快联系您。',
      showCancel: false,
      success: () => {
        resetForm()
        uni.navigateBack()
      }
    })
  }, 1200)
}
</script>

<style scoped lang="scss">
.report-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 24rpx;
  padding-bottom: 140rpx;
}

.form-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.type-options {
  display: flex;
  gap: 24rpx;
}

.type-item {
  flex: 1;
  height: 150rpx;
  border: 2rpx solid #ffe7d1;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  color: #ff9f29;
  font-size: 28rpx;
}

.type-item.active {
  background: linear-gradient(135deg, #ff9f29 0%, #ffb84d 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.25);
}

.count {
  display: block;
  text-align: right;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999999;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  width: 210rpx;
  height: 210rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
}

.evidence-image {
  width: 100%;
  height: 100%;
}

.remove-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 46rpx;
  height: 46rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 210rpx;
  height: 210rpx;
  border-radius: 12rpx;
  border: 2rpx dashed rgba(255, 159, 41, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff9f29;
  background-color: #fff7ef;
  gap: 12rpx;
}

.location-actions {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
  flex-wrap: wrap;
}

.location-btn {
  min-width: 200rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 26rpx;
  font-weight: 500;
  padding: 0 24rpx;
}

.location-btn.primary {
  background: linear-gradient(135deg, #ff9f29 0%, #ffb84d 100%);
  color: #ffffff;
}

.location-btn.ghost {
  border: 2rpx solid rgba(255, 159, 41, 0.4);
  color: #ff9f29;
  background-color: #fff;
}

.location-btn.disabled {
  opacity: 0.6;
}

.helper-text {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #999;
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -6rpx 16rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.btn-submit {
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 600;
  background: linear-gradient(135deg, #ff9f29 0%, #ffb84d 100%);
  color: #ffffff;
}

.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: #999999;
  line-height: 1.4;
}
</style>
