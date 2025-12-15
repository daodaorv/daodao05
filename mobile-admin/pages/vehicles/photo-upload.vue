<template>
  <view class="photo-upload-container">
    <!-- 上传类型选择 -->
    <view class="type-section">
      <view class="section-title">照片类型</view>
      <view class="type-list">
        <view
          class="type-item"
          :class="{ active: form.type === type.value }"
          v-for="type in photoTypes"
          :key="type.value"
          @click="selectType(type.value)"
        >
          <text class="type-icon">{{ type.icon }}</text>
          <text class="type-name">{{ type.name }}</text>
        </view>
      </view>
    </view>

    <!-- 照片上传区域 -->
    <view class="upload-section">
      <view class="section-title">上传照片</view>
      <view class="upload-card">
        <view class="photo-grid">
          <view
            class="photo-item"
            v-for="(photo, index) in form.photos"
            :key="index"
          >
            <image :src="photo.url" mode="aspectFill" class="photo-preview" @click="previewPhoto(index)"></image>
            <view class="photo-info">
              <text class="photo-location" v-if="photo.location">📍 {{ photo.location }}</text>
              <text class="photo-time">{{ photo.time }}</text>
            </view>
            <view class="photo-delete" @click="deletePhoto(index)">✕</view>
          </view>
          <view class="photo-add" v-if="form.photos.length < maxPhotos" @click="choosePhoto">
            <text class="add-icon">📷</text>
            <text class="add-text">拍照/选择</text>
          </view>
        </view>
        <view class="upload-tip">
          <text>已上传 {{ form.photos.length }}/{{ maxPhotos }} 张</text>
          <text>支持拍照或从相册选择，自动记录GPS位置</text>
        </view>
      </view>
    </view>

    <!-- 备注信息 -->
    <view class="remark-section">
      <view class="section-title">备注信息（可选）</view>
      <view class="remark-card">
        <textarea
          class="remark-textarea"
          v-model="form.remark"
          placeholder="请输入备注信息，如车辆状况、拍摄原因等"
          :maxlength="200"
          :show-confirm-bar="false"
        ></textarea>
        <view class="textarea-counter">{{ form.remark.length }}/200</view>
      </view>
    </view>

    <!-- 车辆信息 -->
    <view class="vehicle-section" v-if="vehicleInfo">
      <view class="section-title">车辆信息</view>
      <view class="vehicle-card">
        <view class="vehicle-row">
          <text class="vehicle-label">车辆名称</text>
          <text class="vehicle-value">{{ vehicleInfo.name }}</text>
        </view>
        <view class="vehicle-row">
          <text class="vehicle-label">车牌号</text>
          <text class="vehicle-value">{{ vehicleInfo.plate }}</text>
        </view>
        <view class="vehicle-row">
          <text class="vehicle-label">当前里程</text>
          <text class="vehicle-value">{{ vehicleInfo.mileage }} km</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-button" @click="submitPhotos" :disabled="!canSubmit">提交照片</button>
    </view>

    <!-- 历史记录 -->
    <view class="history-section">
      <view class="history-header">
        <text class="history-title">上传历史</text>
        <text class="history-count">共{{ uploadHistory.length }}条</text>
      </view>
      <view class="history-list" v-if="uploadHistory.length > 0">
        <view
          class="history-item"
          v-for="item in uploadHistory"
          :key="item.id"
          @click="viewHistoryDetail(item)"
        >
          <view class="history-photos">
            <image
              v-for="(photo, index) in item.photos.slice(0, 3)"
              :key="index"
              :src="photo.url"
              mode="aspectFill"
              class="history-photo"
            ></image>
            <view class="history-more" v-if="item.photos.length > 3">
              +{{ item.photos.length - 3 }}
            </view>
          </view>
          <view class="history-info">
            <text class="history-type">{{ getTypeName(item.type) }}</text>
            <text class="history-time">{{ item.createTime }}</text>
            <text class="history-operator">{{ item.operator }}</text>
          </view>
          <text class="history-arrow">›</text>
        </view>
      </view>
      <view class="history-empty" v-else>
        <text class="empty-text">暂无上传记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { uploadVehiclePhotos, getUploadHistory } from '@/api/vehicle'
import { uploadImage } from '@/api/upload'
import { getVehicleDetail } from '@/api/vehicle'

export default {
  data() {
    return {
      vehicleId: null,
      vehicleInfo: null,
      maxPhotos: 9,
      form: {
        type: 'inspection',
        photos: [],
        remark: ''
      },
      photoTypes: [
        { value: 'inspection', name: '车辆检查', icon: '🔍' },
        { value: 'damage', name: '损伤记录', icon: '⚠️' },
        { value: 'maintenance', name: '维保记录', icon: '🔧' },
        { value: 'cleaning', name: '清洁记录', icon: '✨' },
        { value: 'other', name: '其他', icon: '📸' }
      ],
      uploadHistory: []
    }
  },

  computed: {
    canSubmit() {
      return this.form.type && this.form.photos.length > 0
    }
  },

  onLoad(options) {
    if (options.vehicleId) {
      this.vehicleId = options.vehicleId
      this.loadVehicleInfo()
      this.loadUploadHistory()
    }
  },

  methods: {
    async loadVehicleInfo() {
      try {
        const res = await getVehicleDetail(this.vehicleId)
        this.vehicleInfo = res
      } catch (error) {
        console.error('加载车辆信息失败:', error)
      }
    },

    async loadUploadHistory() {
      try {
        const res = await getUploadHistory({ vehicleId: this.vehicleId })
        if (res.code === 200) {
          this.uploadHistory = res.data.list
        }
      } catch (error) {
        console.error('加载上传历史失败:', error)
      }
    },

    selectType(type) {
      this.form.type = type
    },

    choosePhoto() {
      uni.showActionSheet({
        itemList: ['拍照', '从相册选择'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.takePhoto()
          } else if (res.tapIndex === 1) {
            this.chooseFromAlbum()
          }
        }
      })
    },

    takePhoto() {
      uni.chooseImage({
        count: this.maxPhotos - this.form.photos.length,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: (res) => {
          this.handlePhotos(res.tempFilePaths)
        }
      })
    },

    chooseFromAlbum() {
      uni.chooseImage({
        count: this.maxPhotos - this.form.photos.length,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.handlePhotos(res.tempFilePaths)
        }
      })
    },

    async handlePhotos(filePaths) {
      uni.showLoading({ title: '处理中...' })

      try {
        for (const filePath of filePaths) {
          // 获取GPS位置
          const location = await this.getLocation()

          // 上传图片
          const uploadRes = await uploadImage({ filePath })

          if (uploadRes.code === 200) {
            this.form.photos.push({
              url: uploadRes.data.url,
              location: location ? `${location.latitude},${location.longitude}` : '',
              locationName: location ? location.address : '',
              time: this.formatTime(new Date())
            })
          }
        }

        uni.hideLoading()
        uni.showToast({
          title: '照片添加成功',
          icon: 'success'
        })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '处理失败',
          icon: 'none'
        })
        console.error('处理照片失败:', error)
      }
    },

    async getLocation() {
      return new Promise((resolve) => {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            // 可以调用地理编码API获取地址
            resolve({
              latitude: res.latitude,
              longitude: res.longitude,
              address: '当前位置' // 实际应该调用逆地理编码API
            })
          },
          fail: () => {
            resolve(null)
          }
        })
      })
    },

    previewPhoto(index) {
      const urls = this.form.photos.map(photo => photo.url)
      uni.previewImage({
        urls: urls,
        current: index
      })
    },

    deletePhoto(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张照片吗？',
        success: (res) => {
          if (res.confirm) {
            this.form.photos.splice(index, 1)
          }
        }
      })
    },

    async submitPhotos() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请至少上传一张照片',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '提交中...' })

        const res = await uploadVehiclePhotos({
          vehicleId: this.vehicleId,
          type: this.form.type,
          photos: this.form.photos,
          remark: this.form.remark
        })

        uni.hideLoading()

        if (res.code === 200) {
          uni.showToast({
            title: '提交成功',
            icon: 'success'
          })

          // 重置表单
          this.form = {
            type: 'inspection',
            photos: [],
            remark: ''
          }

          // 刷新历史记录
          this.loadUploadHistory()
        } else {
          uni.showToast({
            title: res.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
        console.error('提交照片失败:', error)
      }
    },

    viewHistoryDetail(item) {
      uni.navigateTo({
        url: `/pages/vehicles/photo-detail?id=${item.id}`
      })
    },

    getTypeName(type) {
      const typeObj = this.photoTypes.find(t => t.value === type)
      return typeObj ? typeObj.name : '其他'
    },

    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style scoped>
.photo-upload-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 区块样式 */
.type-section,
.upload-section,
.remark-section,
.vehicle-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 照片类型 */
.type-list {
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.type-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e5e5e5;
  min-width: 140rpx;
}

.type-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.type-icon {
  font-size: 48rpx;
}

.type-name {
  font-size: 24rpx;
  color: #666;
}

.type-item.active .type-name {
  color: #667eea;
  font-weight: 500;
}

/* 照片上传 */
.upload-card,
.remark-card,
.vehicle-card {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12rpx;
  overflow: hidden;
}

.photo-preview {
  width: 100%;
  height: 100%;
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  padding: 8rpx 12rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.photo-location,
.photo-time {
  font-size: 20rpx;
  color: #fff;
}

.photo-delete {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.photo-add {
  aspect-ratio: 1;
  border: 2rpx dashed #ccc;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: #fafafa;
}

.add-icon {
  font-size: 48rpx;
}

.add-text {
  font-size: 24rpx;
  color: #999;
}

.upload-tip {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}

/* 备注信息 */
.remark-textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.textarea-counter {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

/* 车辆信息 */
.vehicle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.vehicle-row:last-child {
  border-bottom: none;
}

.vehicle-label {
  font-size: 28rpx;
  color: #666;
}

.vehicle-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 提交按钮 */
.submit-section {
  padding: 40rpx 20rpx;
}

.submit-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-button::after {
  border: none;
}

.submit-button[disabled] {
  opacity: 0.5;
}

/* 历史记录 */
.history-section {
  margin-top: 20rpx;
  padding: 0 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 10rpx 20rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-count {
  font-size: 24rpx;
  color: #999;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.history-photos {
  display: flex;
  gap: 8rpx;
  position: relative;
}

.history-photo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.history-more {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 120rpx;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-type {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-time,
.history-operator {
  font-size: 24rpx;
  color: #999;
}

.history-arrow {
  font-size: 40rpx;
  color: #ccc;
}

.history-empty {
  background: #fff;
  border-radius: 12rpx;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
