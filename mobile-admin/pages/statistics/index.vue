<template>
  <view class="statistics-page">
    <!-- 时间周期选择 -->
    <view class="period-selector">
      <u-button
        v-for="period in periods"
        :key="period.value"
        :type="currentPeriod === period.value ? 'primary' : 'default'"
        :plain="currentPeriod !== period.value"
        size="small"
        @click="handlePeriodChange(period.value)"
      >
        {{ period.label }}
      </u-button>
    </view>

    <!-- 统计类型标签页 -->
    <view class="tabs-wrapper">
      <u-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />
    </view>

    <!-- 个人统计 -->
    <view v-if="currentTab === 0" class="statistics-content">
      <u-loading-page :loading="loading" loading-text="加载中..." />

      <view v-if="!loading && personalData" class="content-wrapper">
        <!-- 核心指标卡片 -->
        <view class="metrics-section">
          <view class="section-title">核心指标</view>
          <u-grid :col="2" :border="false">
            <u-grid-item>
              <view class="metric-card card-1">
                <view class="metric-value">{{ personalData.statistics.ordersProcessed }}</view>
                <view class="metric-label">处理订单</view>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="metric-card card-2">
                <view class="metric-value">{{ personalData.statistics.ordersCompleted }}</view>
                <view class="metric-label">完成订单</view>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="metric-card card-3">
                <view class="metric-value">{{ personalData.statistics.vehiclesInspected }}</view>
                <view class="metric-label">检查车辆</view>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="metric-card card-4">
                <view class="metric-value">{{ personalData.statistics.customersServed }}</view>
                <view class="metric-label">服务客户</view>
              </view>
            </u-grid-item>
          </u-grid>
        </view>

        <!-- 工作效率 -->
        <view class="efficiency-section">
          <view class="section-title">工作效率</view>
          <view class="efficiency-card">
            <view class="efficiency-item">
              <view class="efficiency-label">工作时长</view>
              <view class="efficiency-value">{{ personalData.statistics.workHours }}小时</view>
            </view>
            <view class="efficiency-item">
              <view class="efficiency-label">工作效率</view>
              <view class="efficiency-value highlight">{{ personalData.statistics.efficiency }}%</view>
            </view>
            <view class="efficiency-item">
              <view class="efficiency-label">客户满意度</view>
              <view class="efficiency-value highlight">{{ personalData.statistics.satisfaction }}分</view>
            </view>
          </view>
        </view>

        <!-- 订单类型分布 -->
        <view class="distribution-section">
          <view class="section-title">订单类型分布</view>
          <view class="distribution-card">
            <view
              v-for="item in personalData.orderTypes"
              :key="item.type"
              class="distribution-item"
            >
              <view class="distribution-header">
                <text class="distribution-type">{{ item.type }}</text>
                <text class="distribution-count">{{ item.count }}单</text>
              </view>
              <view class="distribution-bar">
                <view
                  class="distribution-progress"
                  :style="{ width: item.percentage + '%' }"
                />
              </view>
              <text class="distribution-percentage">{{ item.percentage }}%</text>
            </view>
          </view>
        </view>

        <!-- 工作时段分布 -->
        <view class="time-distribution-section">
          <view class="section-title">工作时段分布</view>
          <view class="time-chart">
            <view
              v-for="item in personalData.workTimeDistribution"
              :key="item.hour"
              class="time-bar-wrapper"
            >
              <view class="time-bar">
                <view
                  class="time-bar-fill"
                  :style="{ height: (item.count / 10 * 100) + '%' }"
                />
              </view>
              <text class="time-label">{{ item.hour.slice(0, 2) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 团队统计 -->
    <view v-if="currentTab === 1" class="statistics-content">
      <u-loading-page :loading="loading" loading-text="加载中..." />

      <view v-if="!loading && teamData" class="content-wrapper">
        <!-- 团队总览 -->
        <view class="team-overview-section">
          <view class="section-title">团队总览</view>
          <view class="overview-grid">
            <view class="overview-item">
              <view class="overview-value">{{ teamData.overview.totalMembers }}</view>
              <view class="overview-label">团队成员</view>
            </view>
            <view class="overview-item">
              <view class="overview-value">{{ teamData.overview.activeMembers }}</view>
              <view class="overview-label">在线成员</view>
            </view>
            <view class="overview-item">
              <view class="overview-value">{{ teamData.overview.totalOrders }}</view>
              <view class="overview-label">总订单数</view>
            </view>
            <view class="overview-item">
              <view class="overview-value">{{ teamData.overview.averageEfficiency }}%</view>
              <view class="overview-label">平均效率</view>
            </view>
          </view>
        </view>

        <!-- 成员排名 -->
        <view class="ranking-section">
          <view class="section-title">成员排名</view>
          <view class="ranking-list">
            <view
              v-for="member in teamData.memberRanking"
              :key="member.id"
              class="ranking-item"
            >
              <view class="ranking-left">
                <view class="ranking-badge" :class="'rank-' + member.rank">
                  {{ member.rank }}
                </view>
                <view class="member-info">
                  <text class="member-name">{{ member.name }}</text>
                  <text class="member-orders">{{ member.ordersProcessed }}单</text>
                </view>
              </view>
              <view class="ranking-right">
                <view class="member-stats">
                  <text class="stat-item">效率 {{ member.efficiency }}%</text>
                  <text class="stat-item">满意度 {{ member.satisfaction }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 部门分布 -->
        <view class="department-section">
          <view class="section-title">部门分布</view>
          <view class="department-list">
            <view
              v-for="dept in teamData.departmentDistribution"
              :key="dept.department"
              class="department-item"
            >
              <view class="department-header">
                <text class="department-name">{{ dept.department }}</text>
                <text class="department-count">{{ dept.members }}人 / {{ dept.orders }}单</text>
              </view>
              <view class="department-bar">
                <view
                  class="department-progress"
                  :style="{ width: dept.percentage + '%' }"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 车辆统计 -->
    <view v-if="currentTab === 2" class="statistics-content">
      <u-loading-page :loading="loading" loading-text="加载中..." />

      <view v-if="!loading && vehicleData" class="content-wrapper">
        <!-- 车辆总览 -->
        <view class="vehicle-overview-section">
          <view class="section-title">车辆总览</view>
          <view class="vehicle-overview-grid">
            <view class="vehicle-overview-item">
              <view class="vehicle-overview-value">{{ vehicleData.overview.totalVehicles }}</view>
              <view class="vehicle-overview-label">总车辆数</view>
            </view>
            <view class="vehicle-overview-item">
              <view class="vehicle-overview-value">{{ vehicleData.overview.availableVehicles }}</view>
              <view class="vehicle-overview-label">可用车辆</view>
            </view>
            <view class="vehicle-overview-item">
              <view class="vehicle-overview-value">{{ vehicleData.overview.rentedVehicles }}</view>
              <view class="vehicle-overview-label">租用中</view>
            </view>
            <view class="vehicle-overview-item">
              <view class="vehicle-overview-value">{{ (vehicleData.overview.utilizationRate * 100).toFixed(0) }}%</view>
              <view class="vehicle-overview-label">使用率</view>
            </view>
          </view>
        </view>

        <!-- 车辆状态分布 -->
        <view class="status-distribution-section">
          <view class="section-title">车辆状态分布</view>
          <view class="status-pie-chart">
            <view
              v-for="item in vehicleData.statusDistribution"
              :key="item.status"
              class="status-item"
            >
              <view class="status-dot" :style="{ backgroundColor: item.color }" />
              <text class="status-label">{{ item.status }}</text>
              <text class="status-count">{{ item.count }}辆 ({{ item.percentage }}%)</text>
            </view>
          </view>
        </view>

        <!-- 热门车辆 Top 5 -->
        <view class="top-vehicles-section">
          <view class="section-title">热门车辆 Top 5</view>
          <view class="top-vehicles-list">
            <view
              v-for="(vehicle, index) in vehicleData.topVehicles"
              :key="vehicle.id"
              class="top-vehicle-item"
            >
              <view class="vehicle-rank">{{ index + 1 }}</view>
              <view class="vehicle-info">
                <view class="vehicle-header">
                  <text class="vehicle-no">{{ vehicle.vehicleNo }}</text>
                  <text class="vehicle-model">{{ vehicle.brand }}</text>
                </view>
                <view class="vehicle-stats">
                  <text class="vehicle-stat">{{ vehicle.orders }}单</text>
                  <text class="vehicle-stat">¥{{ vehicle.revenue.toLocaleString() }}</text>
                  <text class="vehicle-stat">使用率 {{ (vehicle.utilizationRate * 100).toFixed(0) }}%</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 维保统计 -->
        <view class="maintenance-section">
          <view class="section-title">维保统计</view>
          <view class="maintenance-card">
            <view class="maintenance-row">
              <text class="maintenance-label">总维保次数</text>
              <text class="maintenance-value">{{ vehicleData.maintenanceStats.totalMaintenance }}次</text>
            </view>
            <view class="maintenance-row">
              <text class="maintenance-label">计划维保</text>
              <text class="maintenance-value">{{ vehicleData.maintenanceStats.scheduledMaintenance }}次</text>
            </view>
            <view class="maintenance-row">
              <text class="maintenance-label">紧急维修</text>
              <text class="maintenance-value highlight">{{ vehicleData.maintenanceStats.emergencyRepair }}次</text>
            </view>
            <view class="maintenance-row">
              <text class="maintenance-label">平均费用</text>
              <text class="maintenance-value">¥{{ vehicleData.maintenanceStats.averageCost.toLocaleString() }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getPersonalStatistics,
  getTeamStatistics,
  getVehicleStatistics
} from '@/api/statistics'
import logger from '@/utils/logger'

export default {
  data() {
    return {
      // 时间周期
      periods: [
        { label: '今日', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' }
      ],
      currentPeriod: 'today',

      // 标签页
      tabList: [
        { name: '个人统计' },
        { name: '团队统计' },
        { name: '车辆统计' }
      ],
      currentTab: 0,

      // 数据
      personalData: null,
      teamData: null,
      vehicleData: null,

      // 加载状态
      loading: false
    }
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    // 切换时间周期
    handlePeriodChange(period) {
      this.currentPeriod = period
      this.loadData()
    },

    // 切换标签页
    handleTabChange(index) {
      this.currentTab = index
      this.loadData()
    },

    // 加载数据
    async loadData() {
      this.loading = true

      try {
        const params = { period: this.currentPeriod }

        if (this.currentTab === 0) {
          // 加载个人统计
          const res = await getPersonalStatistics(params)
          if (res && res.code === 200) {
            this.personalData = res.data
          }
        } else if (this.currentTab === 1) {
          // 加载团队统计
          const res = await getTeamStatistics(params)
          if (res && res.code === 200) {
            this.teamData = res.data
          }
        } else if (this.currentTab === 2) {
          // 加载车辆统计
          const res = await getVehicleStatistics(params)
          if (res && res.code === 200) {
            this.vehicleData = res.data
          }
        }
      } catch (error) {
        logger.error('Statistics', '加载统计数据失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20rpx;
}

/* 时间周期选择 */
.period-selector {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

/* 标签页 */
.tabs-wrapper {
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

/* 统计内容 */
.statistics-content {
  min-height: calc(100vh - 200rpx);
}

.content-wrapper {
  padding: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

/* 核心指标卡片 */
.metrics-section {
  margin-bottom: 20rpx;
}

.metric-card {
  border-radius: 16rpx;
  padding: 30rpx;
  color: #fff;
  text-align: center;
  min-height: 160rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-card.card-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.metric-card.card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.metric-card.card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.metric-card.card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.metric-value {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.metric-label {
  font-size: 26rpx;
  opacity: 0.9;
}

/* 工作效率 */
.efficiency-section {
  margin-bottom: 20rpx;
}

.efficiency-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-around;
}

.efficiency-item {
  text-align: center;
}

.efficiency-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.efficiency-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;

  &.highlight {
    color: #2979ff;
  }
}

/* 订单类型分布 */
.distribution-section {
  margin-bottom: 20rpx;
}

.distribution-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.distribution-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
  font-size: 26rpx;
}

.distribution-type {
  color: #333;
  font-weight: 500;
}

.distribution-count {
  color: #666;
}

.distribution-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.distribution-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
}

.distribution-percentage {
  font-size: 24rpx;
  color: #999;
}

/* 工作时段分布 */
.time-distribution-section {
  margin-bottom: 20rpx;
}

.time-chart {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 300rpx;
}

.time-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.time-bar {
  flex: 1;
  width: 40rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx 8rpx 0 0;
  display: flex;
  align-items: flex-end;
  margin-bottom: 12rpx;
}

.time-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx 8rpx 0 0;
  min-height: 10rpx;
}

.time-label {
  font-size: 20rpx;
  color: #999;
}

/* 团队总览 */
.team-overview-section {
  margin-bottom: 20rpx;
}

.overview-grid {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.overview-item {
  text-align: center;
}

.overview-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #2979ff;
  margin-bottom: 8rpx;
}

.overview-label {
  font-size: 24rpx;
  color: #666;
}

/* 成员排名 */
.ranking-section {
  margin-bottom: 20rpx;
}

.ranking-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.ranking-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.ranking-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  background-color: #999;

  &.rank-1 {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #333;
  }

  &.rank-2 {
    background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
    color: #333;
  }

  &.rank-3 {
    background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
    color: #fff;
  }
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.member-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.member-orders {
  font-size: 24rpx;
  color: #666;
}

.ranking-right {
  text-align: right;
}

.member-stats {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #666;
}

/* 部门分布 */
.department-section {
  margin-bottom: 20rpx;
}

.department-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.department-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.department-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
  font-size: 26rpx;
}

.department-name {
  color: #333;
  font-weight: 500;
}

.department-count {
  color: #666;
}

.department-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}

.department-progress {
  height: 100%;
  background: linear-gradient(90deg, #2979ff 0%, #00f2fe 100%);
  border-radius: 8rpx;
}

/* 车辆总览 */
.vehicle-overview-section {
  margin-bottom: 20rpx;
}

.vehicle-overview-grid {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.vehicle-overview-item {
  text-align: center;
}

.vehicle-overview-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #43e97b;
  margin-bottom: 8rpx;
}

.vehicle-overview-label {
  font-size: 24rpx;
  color: #666;
}

/* 车辆状态分布 */
.status-distribution-section {
  margin-bottom: 20rpx;
}

.status-pie-chart {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.status-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
}

.status-label {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.status-count {
  font-size: 24rpx;
  color: #666;
}

/* 热门车辆 */
.top-vehicles-section {
  margin-bottom: 20rpx;
}

.top-vehicles-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.top-vehicle-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.vehicle-rank {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #666;
}

.vehicle-info {
  flex: 1;
}

.vehicle-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.vehicle-no {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.vehicle-model {
  font-size: 24rpx;
  color: #666;
}

.vehicle-stats {
  display: flex;
  gap: 24rpx;
}

.vehicle-stat {
  font-size: 24rpx;
  color: #999;
}

/* 维保统计 */
.maintenance-section {
  margin-bottom: 20rpx;
}

.maintenance-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.maintenance-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.maintenance-label {
  font-size: 26rpx;
  color: #666;
}

.maintenance-value {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;

  &.highlight {
    color: #ff9900;
  }
}
</style>
