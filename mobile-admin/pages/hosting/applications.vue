<template>
  <view class="applications-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索申请人/手机号/申请编号"
        :show-action="false"
        bg-color="#f5f5f5"
        @search="handleSearch"
        @clear="handleSearch"
      />
    </view>

    <!-- 类型标签页 -->
    <view class="tabs-wrapper">
      <u-tabs
        :list="typeTabs"
        :current="currentTypeTab"
        :is-scroll="false"
        @change="handleTypeChange"
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

    <!-- 申请列表 -->
    <view class="applications-list">
      <u-list @scrolltolower="loadMore">
        <u-list-item v-for="item in applicationList" :key="item.id">
          <!-- 自有车托管申请卡片 -->
          <view
            v-if="item.type === 'own_car'"
            class="application-card"
            @click="handleViewDetail(item)"
          >
            <view class="card-header">
              <view class="application-no">{{ item.applicationNo }}</view>
              <u-tag
                :text="item.statusText"
                :type="getStatusType(item.status)"
                size="mini"
              />
            </view>

            <view class="card-body">
              <view class="info-row">
                <text class="label">车主姓名：</text>
                <text class="value">{{ item.ownerName }}</text>
              </view>
              <view class="info-row">
                <text class="label">联系电话：</text>
                <text class="value">{{ item.ownerPhone }}</text>
              </view>
              <view class="info-row">
                <text class="label">车辆信息：</text>
                <text class="value">{{ item.vehicleInfo.brand }} {{ item.vehicleInfo.model }} ({{ item.vehicleInfo.year }}年)</text>
              </view>
              <view class="info-row">
                <text class="label">车牌号码：</text>
                <text class="value">{{ item.vehicleInfo.plate }}</text>
              </view>
              <view class="info-row">
                <text class="label">预期收益：</text>
                <text class="value highlight">¥{{ item.expectedIncome }}/月</text>
              </view>
              <view class="info-row">
                <text class="label">托管期限：</text>
                <text class="value">{{ item.hostingPeriod }}个月</text>
              </view>
              <view class="info-row">
                <text class="label">申请时间：</text>
                <text class="value">{{ item.createTime }}</text>
              </view>
            </view>

            <view v-if="item.status === 'pending'" class="card-footer">
              <u-button
                type="primary"
                size="small"
                @click.stop="handleReview(item)"
              >
                立即审核
              </u-button>
            </view>
          </view>

          <!-- 购车托管申请卡片 -->
          <view
            v-else-if="item.type === 'buy_car'"
            class="application-card"
            @click="handleViewDetail(item)"
          >
            <view class="card-header">
              <view class="application-no">{{ item.applicationNo }}</view>
              <u-tag
                :text="item.statusText"
                :type="getStatusType(item.status)"
                size="mini"
              />
            </view>

            <view class="card-body">
              <view class="info-row">
                <text class="label">申请人：</text>
                <text class="value">{{ item.applicantName }}</text>
              </view>
              <view class="info-row">
                <text class="label">联系电话：</text>
                <text class="value">{{ item.applicantPhone }}</text>
              </view>
              <view class="info-row">
                <text class="label">年龄：</text>
                <text class="value">{{ item.age }}岁</text>
              </view>
              <view class="info-row">
                <text class="label">选择车型：</text>
                <text class="value">{{ item.selectedVehicle.brand }} {{ item.selectedVehicle.model }}</text>
              </view>
              <view class="info-row">
                <text class="label">车辆价格：</text>
                <text class="value">¥{{ item.selectedVehicle.price.toLocaleString() }}</text>
              </view>
              <view class="info-row">
                <text class="label">首付金额：</text>
                <text class="value">¥{{ item.selectedVehicle.downPayment.toLocaleString() }}</text>
              </view>
              <view class="info-row">
                <text class="label">分期期数：</text>
                <text class="value">{{ item.installmentPlan.period }}期</text>
              </view>
              <view class="info-row">
                <text class="label">月供金额：</text>
                <text class="value highlight">¥{{ item.installmentPlan.monthlyPayment.toLocaleString() }}/月</text>
              </view>
              <view class="info-row">
                <text class="label">预期收益：</text>
                <text class="value highlight">¥{{ item.expectedIncome }}/月</text>
              </view>
              <view class="info-row">
                <text class="label">申请时间：</text>
                <text class="value">{{ item.createTime }}</text>
              </view>
            </view>

            <view v-if="item.status === 'pending'" class="card-footer">
              <u-button
                type="primary"
                size="small"
                @click.stop="handleReview(item)"
              >
                立即审核
              </u-button>
            </view>
          </view>

          <!-- 车主自用申请卡片 -->
          <view
            v-else-if="item.type === 'self_use'"
            class="application-card"
            @click="handleViewDetail(item)"
          >
            <view class="card-header">
              <view class="application-no">{{ item.applicationNo }}</view>
              <u-tag
                :text="item.statusText"
                :type="getStatusType(item.status)"
                size="mini"
              />
            </view>

            <view class="card-body">
              <view class="info-row">
                <text class="label">车主姓名：</text>
                <text class="value">{{ item.ownerName }}</text>
              </view>
              <view class="info-row">
                <text class="label">联系电话：</text>
                <text class="value">{{ item.ownerPhone }}</text>
              </view>
              <view class="info-row">
                <text class="label">车辆信息：</text>
                <text class="value">{{ item.vehicleInfo.brand }} {{ item.vehicleInfo.model }}</text>
              </view>
              <view class="info-row">
                <text class="label">车牌号码：</text>
                <text class="value">{{ item.vehicleInfo.plate }}</text>
              </view>
              <view class="info-row">
                <text class="label">使用时间：</text>
                <text class="value">{{ item.useInfo.startDate }} 至 {{ item.useInfo.endDate }}</text>
              </view>
              <view class="info-row">
                <text class="label">使用天数：</text>
                <text class="value">{{ item.useInfo.days }}天</text>
              </view>
              <view class="info-row">
                <text class="label">取车门店：</text>
                <text class="value">{{ item.useInfo.pickupStore }}</text>
              </view>
              <view class="info-row">
                <text class="label">还车门店：</text>
                <text class="value">{{ item.useInfo.returnStore }}</text>
              </view>
              <view class="info-row">
                <text class="label">服务费用：</text>
                <text class="value highlight">¥{{ item.fees.totalFee }}</text>
              </view>
              <view class="info-row">
                <text class="label">申请时间：</text>
                <text class="value">{{ item.createTime }}</text>
              </view>
            </view>

            <view v-if="item.status === 'pending'" class="card-footer">
              <u-button
                type="primary"
                size="small"
                @click.stop="handleReview(item)"
              >
                立即审核
              </u-button>
            </view>
          </view>
        </u-list-item>

        <!-- 空状态 -->
        <u-empty
          v-if="!loading && applicationList.length === 0"
          mode="list"
          text="暂无申请记录"
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
import { getHostingApplications } from '@/api/hosting'

export default {
  data() {
    return {
      // 搜索关键词
      searchKeyword: '',

      // 类型标签页
      typeTabs: [
        { name: '全部' },
        { name: '自有车托管' },
        { name: '购车托管' },
        { name: '车主自用' }
      ],
      currentTypeTab: 0,

      // 状态筛选
      statusFilters: [
        { label: '全部', value: '' },
        { label: '待审核', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已拒绝', value: 'rejected' }
      ],
      currentStatus: '',

      // 申请列表
      applicationList: [],

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

  computed: {
    // 当前类型
    currentType() {
      const typeMap = ['', 'own_car', 'buy_car', 'self_use']
      return typeMap[this.currentTypeTab]
    }
  },

  onLoad() {
    this.loadApplications()
  },

  onPullDownRefresh() {
    this.page = 1
    this.loadApplications().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    // 加载申请列表
    async loadApplications() {
      if (this.loading) return

      this.loading = true
      this.loadmoreStatus = 'loading'

      try {
        const params = {
          type: this.currentType,
          status: this.currentStatus,
          keyword: this.searchKeyword,
          page: this.page,
          pageSize: this.pageSize
        }

        const res = await getHostingApplications(params)

        if (res.code === 200) {
          if (this.page === 1) {
            this.applicationList = res.data.list
          } else {
            this.applicationList = [...this.applicationList, ...res.data.list]
          }

          this.total = res.data.total

          // 更新加载状态
          if (this.applicationList.length >= this.total) {
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
        console.error('加载申请列表失败:', error)
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
      this.loadApplications()
    },

    // 切换类型
    handleTypeChange(index) {
      this.currentTypeTab = index
      this.page = 1
      this.loadApplications()
    },

    // 切换状态
    handleStatusChange(status) {
      this.currentStatus = status
      this.page = 1
      this.loadApplications()
    },

    // 加载更多
    loadMore() {
      if (this.loadmoreStatus === 'loadmore' && !this.loading) {
        this.page++
        this.loadApplications()
      }
    },

    // 查看详情
    handleViewDetail(item) {
      let url = ''
      if (item.type === 'own_car') {
        url = `/pages/hosting/own-car-review?id=${item.id}`
      } else if (item.type === 'buy_car') {
        url = `/pages/hosting/buy-car-review?id=${item.id}`
      } else if (item.type === 'self_use') {
        url = `/pages/hosting/self-use-review?id=${item.id}`
      }

      if (url) {
        uni.navigateTo({ url })
      }
    },

    // 审核
    handleReview(item) {
      this.handleViewDetail(item)
    },

    // 获取状态类型
    getStatusType(status) {
      const typeMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error'
      }
      return typeMap[status] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.applications-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
}

.tabs-wrapper {
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
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

.applications-list {
  padding: 20rpx;
}

.application-card {
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

.application-no {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.card-body {
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

.card-footer {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  justify-content: flex-end;
}
</style>
