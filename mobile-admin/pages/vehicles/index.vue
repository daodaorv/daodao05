<template>
  <view class="vehicles-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索车辆名称/车牌号"
        :show-action="false"
        @search="handleSearch"
        @clear="handleClear"
      ></u-search>
    </view>

    <!-- 状态筛选 -->
    <u-tabs
      :list="statusTabs"
      :current="currentStatusIndex"
      @change="changeStatus"
      :scrollable="false"
      lineWidth="40"
      lineHeight="4"
      :activeStyle="{
        color: '#3cc51f',
        fontWeight: 'bold'
      }"
    ></u-tabs>

    <!-- 车辆列表 -->
    <view class="vehicle-list">
      <view
        v-for="vehicle in vehicleList"
        :key="vehicle.id"
        class="vehicle-card"
        @click="viewDetail(vehicle.id)"
      >
        <!-- 车辆图片 -->
        <view class="vehicle-image">
          <image :src="vehicle.image" mode="aspectFill" />
          <u-tag
            :text="vehicle.statusText"
            :type="getStatusType(vehicle.status)"
            size="mini"
            class="status-badge"
          />
        </view>

        <!-- 车辆信息 -->
        <view class="vehicle-info">
          <view class="vehicle-header">
            <text class="vehicle-name">{{ vehicle.name }}</text>
            <text class="vehicle-price">¥{{ vehicle.dailyPrice }}/天</text>
          </view>

          <view class="vehicle-details">
            <view class="detail-item">
              <text class="label">车牌:</text>
              <text class="value">{{ vehicle.plate }}</text>
            </view>
            <view class="detail-item">
              <text class="label">类型:</text>
              <text class="value">{{ vehicle.type }}</text>
            </view>
            <view class="detail-item">
              <text class="label">座位:</text>
              <text class="value">{{ vehicle.seats }}座 / {{ vehicle.beds }}床</text>
            </view>
            <view class="detail-item">
              <text class="label">里程:</text>
              <text class="value">{{ vehicle.mileage }}km</text>
            </view>
            <view class="detail-item">
              <text class="label">位置:</text>
              <text class="value">{{ vehicle.location }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="vehicle-actions">
            <u-button
              v-if="vehicle.status === 'available'"
              text="租用"
              type="primary"
              size="small"
              @click.stop="rentVehicle(vehicle)"
            ></u-button>
            <u-button
              v-if="vehicle.status === 'maintenance'"
              text="查看维保"
              type="warning"
              size="small"
              plain
              @click.stop="viewMaintenance(vehicle)"
            ></u-button>
            <u-button
              text="更新状态"
              type="info"
              size="small"
              plain
              @click.stop="updateStatus(vehicle)"
            ></u-button>
            <u-button
              text="详情"
              type="info"
              size="small"
              plain
              @click.stop="viewDetail(vehicle.id)"
            ></u-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <u-empty
        v-if="vehicleList.length === 0 && !loading"
        mode="car"
        text="暂无车辆"
        :icon-size="120"
      ></u-empty>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <u-loading-icon mode="circle" size="60"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getVehicleList, updateVehicleStatus } from '@/api/vehicle'

export default {
  data() {
    return {
      searchKeyword: '',
      currentStatus: 'all',
      currentStatusIndex: 0,
      statusTabs: [
        { name: '全部', value: 'all', count: 0 },
        { name: '可用', value: 'available', count: 0 },
        { name: '租用中', value: 'rented', count: 0 },
        { name: '维护中', value: 'maintenance', count: 0 },
        { name: '禁用', value: 'disabled', count: 0 }
      ],
      vehicleList: [],
      loading: false
    }
  },

  onLoad() {
    this.loadVehicles()
  },

  onPullDownRefresh() {
    this.loadVehicles().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    async loadVehicles() {
      this.loading = true
      try {
        const params = {}
        if (this.currentStatus !== 'all') {
          params.status = this.currentStatus
        }
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword
        }

        const data = await getVehicleList(params)
        this.vehicleList = data.list

        // 更新状态计数
        this.updateStatusCount()
      } catch (error) {
        console.error('加载车辆失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    updateStatusCount() {
      this.statusTabs[1].count = this.vehicleList.filter(v => v.status === 'available').length
      this.statusTabs[2].count = this.vehicleList.filter(v => v.status === 'rented').length
      this.statusTabs[3].count = this.vehicleList.filter(v => v.status === 'maintenance').length
    },

    changeStatus(e) {
      const index = e.index !== undefined ? e.index : e
      this.currentStatusIndex = index
      this.currentStatus = this.statusTabs[index].value
      this.loadVehicles()
    },

    getStatusType(status) {
      const map = {
        available: 'success',
        rented: 'primary',
        maintenance: 'warning',
        disabled: 'info'
      }
      return map[status] || 'info'
    },

    handleSearch() {
      this.loadVehicles()
    },

    handleClear() {
      this.searchKeyword = ''
      this.loadVehicles()
    },

    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/vehicles/detail?id=${id}`
      })
    },

    rentVehicle(vehicle) {
      uni.navigateTo({
        url: `/pages/orders/create?vehicleId=${vehicle.id}`
      })
    },

    viewMaintenance(vehicle) {
      uni.navigateTo({
        url: `/pages/vehicles/detail?id=${vehicle.id}&tab=maintenance`
      })
    },

    updateStatus(vehicle) {
      const statusOptions = [
        { text: '可用', value: 'available' },
        { text: '租用中', value: 'rented' },
        { text: '维护中', value: 'maintenance' },
        { text: '禁用', value: 'disabled' }
      ]

      uni.showActionSheet({
        itemList: statusOptions.map(s => s.text),
        success: async (res) => {
          const newStatus = statusOptions[res.tapIndex].value
          if (newStatus !== vehicle.status) {
            try {
              await updateVehicleStatus(vehicle.id, newStatus, '')
              uni.showToast({
                title: '状态更新成功',
                icon: 'success'
              })
              this.loadVehicles()
            } catch (error) {
              uni.showToast({
                title: '更新失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.vehicles-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  background: #fff;
  padding: 20rpx;
}

.vehicle-list {
  padding: 20rpx;
}

.vehicle-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.vehicle-image {
  position: relative;
  width: 100%;
  height: 400rpx;
}

.vehicle-image image {
  width: 100%;
  height: 100%;
}

.status-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}

.vehicle-info {
  padding: 24rpx;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.vehicle-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.vehicle-price {
  font-size: 28rpx;
  color: #f56c6c;
  font-weight: bold;
}

.vehicle-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.detail-item {
  font-size: 26rpx;
}

.label {
  color: #999;
  margin-right: 8rpx;
}

.value {
  color: #333;
}

.vehicle-actions {
  display: flex;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1px solid #eee;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  padding: 60rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
</style>
