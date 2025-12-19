<template>
  <view class="hosting-center">
    <!-- 1. 顶部公告栏 -->
    <view class="notice-banner" v-if="notices.length > 0">
      <swiper class="notice-swiper" vertical :autoplay="true" :interval="3000" :circular="true">
        <swiper-item v-for="notice in notices" :key="notice.id">
          <view class="notice-item" @click="handleNoticeClick(notice)">
            <text class="notice-icon">📢</text>
            <text class="notice-text">{{ notice.content }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 2. 我的托管收益卡片 -->
    <view class="income-card">
      <!-- 未登录状态 -->
      <view v-if="!isLogin" class="login-prompt">
        <view class="prompt-title">开启托管，让闲置房车为您赚钱</view>
        <button class="start-hosting-btn" @click="scrollToFeatures">立即托管赚租金</button>
      </view>

      <!-- 已登录且有托管车辆 -->
      <view v-else-if="hasHostingVehicles" class="income-info">
        <view class="income-header">
          <text class="header-title">我的托管收益</text>
          <text class="header-tip">数据实时更新</text>
        </view>
        <view class="income-grid">
          <view class="income-item">
            <text class="income-label">累计收益</text>
            <text class="income-value">¥{{ incomeData.totalIncome }}</text>
          </view>
          <view class="income-item">
            <text class="income-label">今日待结算</text>
            <text class="income-value">¥{{ incomeData.todayPending }}</text>
          </view>
          <view class="income-item">
            <text class="income-label">本月预估收益</text>
            <text class="income-value">¥{{ incomeData.monthEstimate }}</text>
          </view>
        </view>
        <button
          class="withdraw-btn"
          :disabled="incomeData.totalIncome < 100"
          @click="handleWithdraw"
        >
          {{ incomeData.totalIncome < 100 ? '满100元可提现' : '立即提现' }}
        </button>
      </view>

      <!-- 已登录但无托管车辆 -->
      <view v-else class="no-vehicle-prompt">
        <image class="prompt-icon" src="/static/images/empty-vehicle.png" mode="aspectFit"></image>
        <text class="prompt-text">您还没有托管车辆</text>
        <button class="start-hosting-btn" @click="scrollToFeatures">立即托管</button>
      </view>
    </view>

    <!-- 3. 我的托管车辆 -->
    <view v-if="isLogin && hasHostingVehicles" class="my-vehicles">
      <view class="section-header">
        <text class="section-title">我的托管车辆</text>
        <text v-if="vehicles.length > 3" class="view-all" @click="viewAllVehicles">
          查看全部 <text class="arrow">›</text>
        </text>
      </view>
      <view class="vehicle-list">
        <view
          v-for="vehicle in displayVehicles"
          :key="vehicle.id"
          class="vehicle-card"
          @click="goToVehicleDetail(vehicle.id)"
        >
          <image :src="vehicle.thumbnail" class="vehicle-img" mode="aspectFill"></image>
          <view class="vehicle-info">
            <view class="vehicle-header">
              <text class="plate-number">{{ vehicle.plateNumber }}</text>
              <view class="status-badge" :class="'status-' + vehicle.status">
                {{ vehicle.statusText }}
              </view>
            </view>
            <view class="vehicle-income">
              <view class="income-row">
                <text class="label">今日收益</text>
                <text class="value">¥{{ vehicle.todayIncome }}</text>
              </view>
              <view class="income-row">
                <text class="label">本月收益</text>
                <text class="value">¥{{ vehicle.monthIncome }}</text>
              </view>
            </view>
          </view>
          <button class="self-use-btn" @click.stop="applySelfUse(vehicle)">
            自用申请
          </button>
        </view>
      </view>
    </view>

    <!-- 4. 收益明细 + 托管协议入口 -->
    <view class="quick-links">
      <view class="link-item" @click="goToAgreement">
        <text class="link-icon">📄</text>
        <text class="link-text">托管协议与帮助</text>
        <text class="link-arrow">›</text>
      </view>
    </view>

    <!-- 5. 主要功能区（2×2网格） -->
    <view class="feature-grid" id="features">
      <view class="feature-item" @click="goToOldCarHosting">
        <image class="feature-icon" src="/static/images/old-car-icon.png" mode="aspectFit"></image>
        <text class="feature-title">我要托管闲置房车</text>
        <text class="feature-subtitle">自有车免费入驻</text>
        <view class="feature-badge">车主70%分成</view>
      </view>
      <view class="feature-item" @click="goToNewCarHosting">
        <image class="feature-icon" src="/static/images/new-car-icon.png" mode="aspectFit"></image>
        <text class="feature-title">购车托管</text>
        <text class="feature-subtitle">保底+高分成</text>
        <view class="feature-badge">保底3500元/月</view>
      </view>
    </view>
  </view>
</template>

<script>
import { logger } from '@/utils/logger';

export default {
  data() {
    return {
      isLogin: false,
      hasHostingVehicles: false,
      notices: [
        { id: 1, content: '托管车辆享受平台统保，车主零保险成本' },
        { id: 2, content: '淡季补贴最高1000元/月，让您收益更稳定' },
        { id: 3, content: '新用户托管立享首月额外10%收益加成' }
      ],
      incomeData: {
        totalIncome: 0,
        todayPending: 0,
        monthEstimate: 0
      },
      vehicles: [],
      displayVehicles: []
    }
  },

  onLoad() {
    this.checkLoginStatus()
    if (this.isLogin) {
      this.loadHostingData()
    }
  },

  onPullDownRefresh() {
    this.loadHostingData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },

  methods: {
    // 检查登录状态
    checkLoginStatus() {
      // Mock数据：模拟已登录状态
      this.isLogin = true
      this.hasHostingVehicles = true
    },

    // 加载托管数据
    loadHostingData() {
      // Mock数据：托管收益
      this.incomeData = {
        totalIncome: 12580.50,
        todayPending: 350.00,
        monthEstimate: 8500.00
      }

      // Mock数据：托管车辆
      this.vehicles = [
        {
          id: 1,
          plateNumber: '京A·12345',
          thumbnail: 'https://placehold.co/200x150/FF9F29/FFFFFF?text=%E6%88%BF%E8%BD%A61',
          status: 'renting',
          statusText: '出租中',
          todayIncome: 350.00,
          monthIncome: 5200.00
        },
        {
          id: 2,
          plateNumber: '京B·67890',
          thumbnail: 'https://placehold.co/200x150/2196F3/FFFFFF?text=%E6%88%BF%E8%BD%A62',
          status: 'idle',
          statusText: '空闲',
          todayIncome: 0,
          monthIncome: 3300.00
        }
      ]

      this.displayVehicles = this.vehicles.slice(0, 3)
    },

    // 平滑滚动到功能区
    scrollToFeatures() {
      uni.pageScrollTo({
        selector: '#features',
        duration: 300
      })
    },

    // 提现
    handleWithdraw() {
      if (this.incomeData.totalIncome < 100) {
        uni.showToast({
          title: '满100元可提现',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/hosting/income/index?action=withdraw'
      })
    },

    // 查看全部车辆
    viewAllVehicles() {
      uni.navigateTo({
        url: '/pages/hosting/vehicle-list/index'
      })
    },

    // 车主自用申请
    applySelfUse(vehicle) {
      uni.navigateTo({
        url: `/pages/hosting/self-use/index?vehicleId=${vehicle.id}`
      })
    },

    // 跳转到车辆详情
    goToVehicleDetail(vehicleId) {
      uni.navigateTo({
        url: `/pages/hosting/vehicle-detail/index?id=${vehicleId}`
      })
    },

    // 跳转到托管协议
    goToAgreement() {
      uni.navigateTo({
        url: '/pages/hosting/agreement/index'
      })
    },

    // 跳转到自有车托管
    goToOldCarHosting() {
      uni.navigateTo({
        url: '/pages/hosting/old-car/index'
      })
    },

    // 跳转到购车托管
    goToNewCarHosting() {
      uni.navigateTo({
        url: '/pages/hosting/new-car/index'
      })
    },

    // 公告点击
    handleNoticeClick(notice) {
      logger.debug('点击公告:', notice)
    }
  }
}
</script>

<style scoped>
.hosting-center {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 40rpx;
}

/* 公告栏 */
.notice-banner {
  height: 80rpx;
  background: #FFF7E6;
  border-bottom: 1rpx solid #FFE7BA;
}

.notice-swiper {
  height: 100%;
}

.notice-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 32rpx;
}

.notice-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.notice-text {
  font-size: 24rpx;
  color: #FF9800;
  flex: 1;
}

/* 收益卡片 */
.income-card {
  margin: 24rpx 32rpx;
  background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.3);
}

.login-prompt,
.no-vehicle-prompt {
  text-align: center;
}

.prompt-title {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 600;
  margin-bottom: 32rpx;
}

.prompt-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.prompt-text {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32rpx;
}

.start-hosting-btn {
  background: #FFFFFF;
  color: #FF9F29;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
}

.income-info {
  color: #FFFFFF;
}

.income-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
}

.header-tip {
  font-size: 24rpx;
  opacity: 0.8;
}

.income-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.income-item {
  flex: 1;
  text-align: center;
}

.income-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 16rpx;
}

.income-value {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
}

.withdraw-btn {
  background: #FFFFFF;
  color: #FF9F29;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
}

.withdraw-btn[disabled] {
  opacity: 0.6;
}

/* 我的托管车辆 */
.my-vehicles {
  margin: 24rpx 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.view-all {
  font-size: 28rpx;
  color: #FF9F29;
}

.arrow {
  font-size: 32rpx;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.vehicle-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.vehicle-img {
  width: 160rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.vehicle-info {
  flex: 1;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.plate-number {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.status-badge {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.status-renting {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-idle {
  background: #E3F2FD;
  color: #2196F3;
}

.vehicle-income {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.income-row {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
}

.income-row .label {
  color: #999999;
}

.income-row .value {
  color: #FF9F29;
  font-weight: 600;
}

.self-use-btn {
  align-self: center;
  background: #FF9F29;
  color: #FFFFFF;
  border-radius: 8rpx;
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  border: none;
  height: auto;
  line-height: normal;
  flex-shrink: 0;
  margin-left: 16rpx;
}

/* 快捷链接 */
.quick-links {
  margin: 24rpx 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.link-item:last-child {
  border-bottom: none;
}

.link-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.link-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.link-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

/* 功能网格 */
.feature-grid {
  margin: 24rpx 32rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.feature-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 24rpx;
  text-align: center;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.feature-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 24rpx;
}

.feature-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8rpx;
}

.feature-subtitle {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 16rpx;
}

.feature-badge {
  display: inline-block;
  background: #FFF7E6;
  color: #FF9F29;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: 600;
}
</style>
