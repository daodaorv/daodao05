<template>
  <view class="vehicle-detail">
    <image :src="vehicle.image" class="header-img" mode="aspectFill"></image>

    <view class="info-section">
      <text class="vehicle-name">{{ vehicle.name }}</text>
      <text class="plate">{{ vehicle.plate }}</text>
      <view class="status-badge" :class="vehicle.status">{{ vehicle.statusText }}</view>
    </view>

    <view class="data-section">
      <view class="data-item">
        <text class="data-label">今日收益</text>
        <text class="data-value">¥{{ vehicle.todayIncome }}</text>
      </view>
      <view class="data-item">
        <text class="data-label">本月收益</text>
        <text class="data-value">¥{{ vehicle.monthIncome }}</text>
      </view>
      <view class="data-item">
        <text class="data-label">累计收益</text>
        <text class="data-value">¥{{ vehicle.totalIncome }}</text>
      </view>
    </view>

    <view class="detail-section">
      <view class="detail-item">
        <text class="label">当前位置</text>
        <text class="value">{{ vehicle.location }}</text>
      </view>
      <view class="detail-item">
        <text class="label">保险状态</text>
        <text class="value">{{ vehicle.insurance }}</text>
      </view>
      <view class="detail-item">
        <text class="label">下次维保</text>
        <text class="value">{{ vehicle.nextMaintenance }}</text>
      </view>
    </view>

    <button class="action-btn" @click="applySelfUse">申请自用</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      vehicle: {
        name: '上汽大通V90',
        plate: '京A·12345',
        image: '/static/logo.png',
        status: 'renting',
        statusText: '出租中',
        todayIncome: 350,
        monthIncome: 5200,
        totalIncome: 28500,
        location: '北京市朝阳区叨叨房车朝阳门店',
        insurance: '已投保（太平洋保险）',
        nextMaintenance: '2025-12-15'
      }
    }
  },
  methods: {
    applySelfUse() {
      uni.navigateTo({
        url: '/pages/hosting/self-use/index?vehicleId=' + this.vehicle.id
      })
    }
  }
}
</script>

<style scoped>
.vehicle-detail { min-height: 100vh; background: #F5F5F5; padding-bottom: 120rpx; }
.header-img { width: 100%; height: 400rpx; }
.info-section { background: #FFF; padding: 32rpx; }
.vehicle-name { display: block; font-size: 36rpx; font-weight: 600; margin-bottom: 8rpx; }
.plate { display: block; font-size: 28rpx; color: #999; margin-bottom: 16rpx; }
.status-badge { display: inline-block; padding: 8rpx 24rpx; border-radius: 8rpx; font-size: 24rpx; }
.status-badge.renting { background: #E8F5E9; color: #4CAF50; }
.data-section { display: flex; background: #FFF; margin-top: 24rpx; padding: 32rpx; }
.data-item { flex: 1; text-align: center; }
.data-label { display: block; font-size: 24rpx; color: #999; margin-bottom: 16rpx; }
.data-value { display: block; font-size: 36rpx; font-weight: 600; color: #FF9F29; }
.detail-section { background: #FFF; margin-top: 24rpx; padding: 32rpx; }
.detail-item { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid #F5F5F5; }
.detail-item:last-child { border-bottom: none; }
.label { font-size: 28rpx; color: #333; }
.value { font-size: 28rpx; color: #666; }
.action-btn { position: fixed; bottom: 32rpx; left: 32rpx; right: 32rpx; height: 88rpx; background: #FF9F29; color: #FFF; border-radius: 48rpx; font-size: 32rpx; font-weight: 600; border: none; }
</style>
