<template>
  <view class="hosting-vehicles-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索车主/车牌号/车辆编号"
        :show-action="false"
        bg-color="#f5f5f5"
        @search="handleSearch"
        @clear="handleSearch"
      />
    </view>

    <!-- 状态筛选 -->
    <view class="status-filter">
      <u-button
        v-for="status in statusFilters"
        :key="status.value"
        :type="currentStatus === status.value ? 'primary' : 'default'"
        :plain="currentStatus !== status.value"
        size="small"
        @click="handleStatusChange(status.value)"
      >
        {{ status.label }}
      </u-button>
    </view>

    <!-- 车辆列表 -->
    <view class="vehicles-list">
      <u-list @scrolltolower="loadMore">
        <u-list-item v-for="item in vehicleList" :key="item.id">
          <view class="vehicle-card" @click="handleViewDetail(item)">
            <!-- 卡片头部 -->
            <view class="card-header">
              <view class="vehicle-no">{{ item.vehicleNo }}</view>
              <u-tag
                :text="item.currentStatusText"
                :type="getStatusType(item.currentStatus)"
                size="mini"
              />
            </view>

            <!-- 车辆信息 -->
            <view class="vehicle-info">
              <view class="info-row">
                <text class="label">车辆信息：</text>
                <text class="value">{{ item.vehicleInfo.brand }} {{ item.vehicleInfo.model }} ({{ item.vehicleInfo.year }}年)</text>
              </view>
              <view class="info-row">
                <text class="label">车牌号码：</text>
                <text class="value">{{ item.vehicleInfo.plate }}</text>
              </view>
              <view class="info-row">
                <text class="label">车主姓名：</text>
                <text class="value">{{ item.ownerName }}</text>
              </view>
              <view class="info-row">
                <text class="label">联系电话：</text>
                <text class="value">{{ item.ownerPhone }}</text>
              </view>
            </view>

            <!-- 托管信息 -->
            <view class="hosting-info">
              <view class="info-row">
                <text class="label">托管期限：</text>
                <text class="value">{{ item.hostingInfo.startDate }} 至 {{ item.hostingInfo.endDate }}</text>
              </view>
              <view class="info-row">
                <text class="label">月收益：</text>
                <text class="value highlight">¥{{ item.hostingInfo.monthlyIncome }}/月</text>
              </view>
            </view>

            <!-- 收益统计 -->
            <view class="earnings-section">
              <view class="earnings-title">收益统计</view>
              <view class="earnings-grid">
                <view class="earnings-item">
                  <text class="earnings-label">累计收益</text>
                  <text class="earnings-value">¥{{ item.earnings.totalEarnings.toLocaleString() }}</text>
                </view>
                <view class="earnings-item">
                  <text class="earnings-label">月均收益</text>
                  <text class="earnings-value">¥{{ item.earnings.monthlyAverage.toLocaleString() }}</text>
                </view>
                <view class="earnings-item">
                  <text class="earnings-label">上月收益</text>
                  <text class="earnings-value">¥{{ item.earnings.lastMonthEarnings.toLocaleString() }}</text>
                </view>
                <view class="earnings-item">
                  <text class="earnings-label">待结算</text>
                  <text class="earnings-value pending">¥{{ item.earnings.unpaidEarnings.toLocaleString() }}</text>
                </view>
              </view>
            </view>

            <!-- 运营统计 -->
            <view class="statistics-section">
              <view class="statistics-grid">
                <view class="statistics-item">
                  <text class="statistics-value">{{ item.statistics.totalOrders }}</text>
                  <text class="statistics-label">订单数</text>
                </view>
                <view class="statistics-item">
                  <text class="statistics-value">{{ item.statistics.totalDays }}</text>
                  <text class="statistics-label">出租天数</text>
                </view>
                <view class="statistics-item">
                  <text class="statistics-value">{{ (item.statistics.utilizationRate * 100).toFixed(0) }}%</text>
                  <text class="statistics-label">使用率</text>
                </view>
              </view>
            </view>

            <!-- 操作按钮 -->
            <view class="card-footer">
              <u-button
                type="primary"
                size="small"
                plain
                @click.stop="handleViewDetail(item)"
              >
                查看详情
              </u-button>
            </view>
          </view>
        </u-list-item>

        <!-- 空状态 -->
        <u-empty
          v-if="!loading && vehicleList.length === 0"
          mode="car"
          text="暂无托管车辆"
        />

        <!-- 加载状态 -->
        <u-loadmore
          :status="loadmoreStatus"
          :loading-text="loadingText"
          :loadmore-text="loadmoreText"
          :nomore-text="nomoreText"
        />
      </u-list>
    </view>
  </view>
</template>

<script>
import { getHostingVehicles } from '@/api/hosting'

export default {
  data() {
    return {
      // 搜索关键词
      searchKeyword: '',

      // 状态筛选
      statusFilters: [
        { label: '全部', value: '' },
        { label: '可用', value: 'available' },
        { label: '使用中', value: 'in_use' },
        { label: '维保中', value: 'maintenance' }
      ],
      currentStatus: '',

      // 车辆列表
      vehicleList: [],

      // 分页
      page: 1,
      pageSize: 10,
      total: 0,

      // 加载状态
      loading: false,
      loadmoreStatus: 'loadmore',
      loadingText: '加载中...',
      loadmoreText: '上拉加载更多',
      nomoreText: '没有更多了'
    }
  },

  onLoad() {
    this.loadVehicles()
  },

  onPullDownRefresh() {
    this.page = 1
    this.loadVehicles().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    // 加载车辆列表
    async loadVehicles() {
      if (this.loading) return

      this.loading = true
      this.loadmoreStatus = 'loading'

      try {
        const params = {
          status: this.currentStatus,
          keyword: this.searchKeyword,
          page: this.page,
          pageSize: this.pageSize
        }

        const res = await getHostingVehicles(params)

        if (res.code === 200) {
          if (this.page === 1) {
            this.vehicleList = res.data.list
          } else {
            this.vehicleList = [...this.vehicleList, ...res.data.list]
          }

          this.total = res.data.total

          // 更新加载状态
          if (this.vehicleList.length >= this.total) {
            this.loadmoreStatus = 'nomore'
          } else {
            this.loadmoreStatus = 'loadmore'
          }
        } else {
          uni.showToast({
            title: res.message || '加载失败',
            icon: 'none'
          })
          this.loadmoreStatus = 'loadmore'
        }
      } catch (error) {
        console.error('加载车辆列表失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
        this.loadmoreStatus = 'loadmore'
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.loadVehicles()
    },

    // 切换状态
    handleStatusChange(status) {
      this.currentStatus = status
      this.page = 1
      this.loadVehicles()
    },

    // 加载更多
    loadMore() {
      if (this.loadmoreStatus === 'loadmore' && !this.loading) {
        this.page++
        this.loadVehicles()
      }
    },

    // 查看详情
    handleViewDetail(item) {
      uni.navigateTo({
        url: `/pages/vehicles/detail?id=${item.vehicleId}`
      })
    },

    // 获取状态类型
    getStatusType(status) {
      const typeMap = {
        available: 'success',
        in_use: 'warning',
        maintenance: 'error'
      }
      return typeMap[status] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.hosting-vehicles-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
}

.status-filter {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  overflow-x: auto;
  white-space: nowrap;
}

.vehicles-list {
  padding: 20rpx;
}

.vehicle-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.vehicle-no {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.vehicle-info,
.hosting-info {
  margin-bottom: 20rpx;

  .info-row {
    display: flex;
    margin-bottom: 16rpx;
    font-size: 26rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #999;
      min-width: 160rpx;
    }

    .value {
      flex: 1;
      color: #333;

      &.highlight {
        color: #ff6b00;
        font-weight: 600;
      }
    }
  }
}

.earnings-section {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;
}

.earnings-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.earnings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.earnings-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.earnings-label {
  font-size: 24rpx;
  color: #999;
}

.earnings-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #ff6b00;

  &.pending {
    color: #ff9900;
  }
}

.statistics-section {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background-color: #f0f9ff;
  border-radius: 12rpx;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.statistics-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.statistics-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #2979ff;
}

.statistics-label {
  font-size: 24rpx;
  color: #666;
}

.card-footer {
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  justify-content: flex-end;
}
</style>
