<template>
  <view class="location-container">
    <!-- 地图容器 -->
    <map
      id="vehicleMap"
      class="map"
      :latitude="mapCenter.latitude"
      :longitude="mapCenter.longitude"
      :scale="mapScale"
      :markers="markers"
      :show-location="true"
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
    >
      <!-- 地图控件 -->
      <cover-view class="map-controls">
        <cover-view class="control-button" @tap="centerToVehicle">
          <cover-image src="/static/icons/location.png" class="control-icon" />
        </cover-view>
        <cover-view class="control-button" @tap="refreshLocation">
          <cover-image src="/static/icons/refresh.png" class="control-icon" />
        </cover-view>
      </cover-view>
    </map>

    <!-- 车辆信息卡片 -->
    <view class="vehicle-info-card" v-if="vehicle">
      <view class="card-header">
        <view class="vehicle-basic">
          <text class="vehicle-name">{{ vehicle.name }}</text>
          <text class="vehicle-plate">{{ vehicle.plate }}</text>
        </view>
        <u-tag
          :text="getStatusText(vehicle.status)"
          :type="getStatusType(vehicle.status)"
          size="small"
        />
      </view>

      <view class="card-content">
        <view class="info-row">
          <view class="info-item">
            <u-icon name="map-pin" size="18" color="#666"></u-icon>
            <text class="info-label">当前位置</text>
          </view>
          <text class="info-value">{{ vehicle.location || '未知' }}</text>
        </view>

        <view class="info-row">
          <view class="info-item">
            <u-icon name="clock" size="18" color="#666"></u-icon>
            <text class="info-label">更新时间</text>
          </view>
          <text class="info-value">{{ formatTime(vehicle.lastUpdateTime) }}</text>
        </view>

        <view class="info-row">
          <view class="info-item">
            <u-icon name="car" size="18" color="#666"></u-icon>
            <text class="info-label">行驶里程</text>
          </view>
          <text class="info-value">{{ vehicle.mileage || 0 }} km</text>
        </view>

        <view v-if="vehicle.speed !== undefined" class="info-row">
          <view class="info-item">
            <u-icon name="play-circle" size="18" color="#666"></u-icon>
            <text class="info-label">当前速度</text>
          </view>
          <text class="info-value">{{ vehicle.speed }} km/h</text>
        </view>
      </view>

      <view class="card-actions">
        <u-button
          type="primary"
          size="small"
          plain
          @click="viewTrack"
        >
          查看轨迹
        </u-button>
        <u-button
          type="success"
          size="small"
          @click="createDispatch"
        >
          创建调度
        </u-button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <LoadingSpinner text="加载中..." />
    </view>

    <!-- 轨迹查看弹窗 -->
    <u-popup v-model="showTrackDialog" mode="bottom" :round="20">
      <view class="track-dialog">
        <view class="dialog-header">
          <text class="dialog-title">车辆轨迹</text>
          <u-icon name="close" size="24" @click="showTrackDialog = false"></u-icon>
        </view>

        <view class="track-filter">
          <u-radio-group v-model="trackPeriod" @change="loadTrack">
            <u-radio
              v-for="item in trackPeriodOptions"
              :key="item.value"
              :name="item.value"
              :label="item.label"
              size="small"
            />
          </u-radio-group>
        </view>

        <view class="track-list">
          <view
            v-for="point in trackPoints"
            :key="point.id"
            class="track-point"
          >
            <view class="point-time">{{ formatTime(point.time) }}</view>
            <view class="point-location">{{ point.location }}</view>
            <view class="point-speed">速度: {{ point.speed }} km/h</view>
          </view>
        </view>

        <view v-if="trackPoints.length === 0" class="empty-track">
          <text>暂无轨迹数据</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getVehicleLocation, getVehicleTrack } from '@/api/dispatch'
import { formatDateTime } from '@/utils/format'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    LoadingSpinner
  },

  data() {
    return {
      vehicleId: '',
      vehicle: null,
      mapCenter: {
        latitude: 39.9042,  // 北京天安门坐标
        longitude: 116.4074
      },
      mapScale: 15,
      markers: [],
      loading: false,
      showTrackDialog: false,
      trackPeriod: 'today',
      trackPeriodOptions: [
        { label: '今天', value: 'today' },
        { label: '最近3天', value: '3days' },
        { label: '最近7天', value: '7days' }
      ],
      trackPoints: []
    }
  },

  onLoad(options) {
    if (options.id) {
      this.vehicleId = options.id
      this.loadVehicleLocation()
    }
  },

  methods: {
    formatTime(time) {
      return formatDateTime(time)
    },

    async loadVehicleLocation() {
      this.loading = true
      try {
        const data = await getVehicleLocation(this.vehicleId)
        this.vehicle = data

        // 更新地图中心点
        if (data.latitude && data.longitude) {
          this.mapCenter = {
            latitude: data.latitude,
            longitude: data.longitude
          }

          // 添加车辆标记
          this.markers = [
            {
              id: 1,
              latitude: data.latitude,
              longitude: data.longitude,
              iconPath: '/static/icons/vehicle-marker.png',
              width: 40,
              height: 40,
              title: data.name,
              callout: {
                content: `${data.name}\n${data.plate}`,
                color: '#333',
                fontSize: 12,
                borderRadius: 8,
                padding: 10,
                display: 'ALWAYS'
              }
            }
          ]
        }
      } catch (error) {
        console.error('加载车辆位置失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    async refreshLocation() {
      uni.showLoading({ title: '刷新中...' })
      try {
        await this.loadVehicleLocation()
        uni.showToast({
          title: '位置已更新',
          icon: 'success'
        })
      } finally {
        uni.hideLoading()
      }
    },

    centerToVehicle() {
      if (this.vehicle && this.vehicle.latitude && this.vehicle.longitude) {
        this.mapCenter = {
          latitude: this.vehicle.latitude,
          longitude: this.vehicle.longitude
        }
        this.mapScale = 15
      }
    },

    onMarkerTap(e) {
      console.log('点击标记:', e)
    },

    onRegionChange(e) {
      console.log('地图区域变化:', e)
    },

    async viewTrack() {
      this.showTrackDialog = true
      await this.loadTrack()
    },

    async loadTrack() {
      try {
        const data = await getVehicleTrack(this.vehicleId, {
          period: this.trackPeriod
        })
        this.trackPoints = data.list
      } catch (error) {
        console.error('加载轨迹失败:', error)
        uni.showToast({
          title: '加载轨迹失败',
          icon: 'none'
        })
      }
    },

    createDispatch() {
      uni.navigateTo({
        url: `/pages/vehicles/dispatch?vehicleId=${this.vehicleId}`
      })
    },

    getStatusText(status) {
      const statusMap = {
        available: '可用',
        in_use: '使用中',
        maintenance: '维护中',
        disabled: '禁用'
      }
      return statusMap[status] || status
    },

    getStatusType(status) {
      const typeMap = {
        available: 'success',
        in_use: 'primary',
        maintenance: 'warning',
        disabled: 'info'
      }
      return typeMap[status] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.location-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.map {
  flex: 1;
  width: 100%;
}

.map-controls {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.control-button {
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.control-icon {
  width: 40rpx;
  height: 40rpx;
}

.vehicle-info-card {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  max-height: 50vh;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.vehicle-basic {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.vehicle-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.vehicle-plate {
  font-size: 26rpx;
  color: #666;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.card-actions {
  display: flex;
  gap: 16rpx;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.track-dialog {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 32rpx;
  max-height: 70vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.track-filter {
  margin-bottom: 24rpx;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.track-point {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
}

.point-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.point-location {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.point-speed {
  font-size: 24rpx;
  color: #666;
}

.empty-track {
  text-align: center;
  padding: 80rpx 0;
  font-size: 28rpx;
  color: #999;
}
</style>
