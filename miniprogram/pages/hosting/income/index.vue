<template>
  <view class="income-page">
    <view class="summary-card">
      <text class="summary-title">累计收益</text>
      <text class="summary-value">¥{{ totalIncome }}</text>
      <button class="withdraw-btn" @click="withdraw">提现</button>
    </view>

    <view class="tabs">
      <view :class="['tab', activeTab === 0 && 'active']" @click="activeTab = 0">收益明细</view>
      <view :class="['tab', activeTab === 1 && 'active']" @click="activeTab = 1">提现记录</view>
    </view>

    <view v-if="activeTab === 0" class="list">
      <view v-for="item in incomeList" :key="item.id" class="income-card">
        <view class="card-header">
          <text class="order-no">订单号 {{ item.orderNo }}</text>
          <text class="status-tag">{{ item.statusText }}</text>
        </view>
        <view class="card-body">
          <view class="info-row">
            <text class="info-label">车辆</text>
            <text class="info-value">{{ item.vehicle }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">执行日期</text>
            <text class="info-value">{{ item.period }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">订单金额</text>
            <text class="info-value">¥{{ item.orderAmount }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">结算收益</text>
            <text class="info-value highlight">+¥{{ item.amount }}</text>
          </view>
        </view>
        <view class="card-footer">
          <text class="footer-text">{{ item.settleDate }} 结算</text>
        </view>
      </view>
    </view>

    <view v-else class="list">
      <view v-for="item in withdrawList" :key="item.id" class="withdraw-item">
        <view class="item-left">
          <text class="item-title">提现</text>
          <text class="item-date">{{ item.date }}</text>
        </view>
        <view class="item-right">
          <text class="item-amount">-¥{{ item.amount }}</text>
          <text :class="['status', item.status]">{{ item.statusText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      totalIncome: 12580.50,
      activeTab: 0,
      incomeList: [
        {
          id: 'INC001',
          orderNo: 'DD20241201001',
          vehicle: '上汽大通V90',
          period: '2024-12-01 至 2024-12-05',
          orderAmount: 4800,
          amount: 360,
          settleDate: '2024-12-06',
          statusText: '已结算'
        },
        {
          id: 'INC002',
          orderNo: 'DD20241128005',
          vehicle: '览众勇士C7',
          period: '2024-11-26 至 2024-11-29',
          orderAmount: 4200,
          amount: 315,
          settleDate: '2024-11-30',
          statusText: '已结算'
        }
      ],
      withdrawList: [
        { id: 'WD001', date: '2024-11-25', amount: 5000, status: 'success', statusText: '已到账' },
        { id: 'WD002', date: '2024-10-12', amount: 3200, status: 'processing', statusText: '处理中' }
      ]
    }
  },
  methods: {
    withdraw() {
      uni.showModal({
        title: '提现',
        content: `确认提现 ¥${this.totalIncome}？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '提现申请已提交' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.income-page { min-height: 100vh; background: #F5F5F5; }
.summary-card { background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%); padding: 48rpx 32rpx; text-align: center; color: #FFF; }
.summary-title { display: block; font-size: 28rpx; opacity: 0.9; margin-bottom: 16rpx; }
.summary-value { display: block; font-size: 64rpx; font-weight: 600; margin-bottom: 32rpx; }
.withdraw-btn { background: #FFF; color: #FF9F29; border-radius: 48rpx; height: 72rpx; line-height: 72rpx; font-size: 28rpx; font-weight: 600; border: none; width: 300rpx; }
.tabs { display: flex; background: #FFF; }
.tab { flex: 1; text-align: center; padding: 32rpx 0; font-size: 28rpx; color: #666; }
.tab.active { color: #FF9F29; border-bottom: 4rpx solid #FF9F29; }
.list { padding: 24rpx 32rpx; }
.income-card { background: #FFF; border-radius: 16rpx; padding: 32rpx; margin-bottom: 24rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.order-no { font-size: 26rpx; color: #666; }
.status-tag { font-size: 24rpx; color: #52C41A; background: rgba(82,196,26,0.12); padding: 6rpx 18rpx; border-radius: 24rpx; }
.card-body { display: flex; flex-direction: column; gap: 16rpx; }
.info-row { display: flex; justify-content: space-between; font-size: 26rpx; color: #666; }
.info-label { color: #999; }
.info-value { color: #333; font-weight: 500; }
.info-value.highlight { color: #FF9F29; font-size: 32rpx; }
.card-footer { margin-top: 24rpx; padding-top: 16rpx; border-top: 1rpx solid #F5F5F5; }
.footer-text { font-size: 24rpx; color: #999; }
.withdraw-item { display: flex; justify-content: space-between; background: #FFF; border-radius: 12rpx; padding: 32rpx; margin-bottom: 16rpx; }
.item-title { display: block; font-size: 28rpx; color: #333; margin-bottom: 8rpx; }
.item-date { display: block; font-size: 24rpx; color: #999; }
.item-amount { font-size: 32rpx; font-weight: 600; color: #FF9F29; }
.item-right { text-align: right; }
.status { display: block; font-size: 24rpx; margin-top: 8rpx; }
.status.success { color: #4CAF50; }
.status.processing { color: #FFA940; }
</style>
