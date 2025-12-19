<template>
  <view class="renewal-page">
    <view class="card order-info">
      <view class="info-row">
        <text class="label">订单编号</text>
        <text class="value">{{ orderInfo.orderNo || '--' }}</text>
      </view>
      <view class="info-row">
        <text class="label">当前还车时间</text>
        <text class="value">{{ formatDateTime(orderInfo.returnTime) }}</text>
      </view>
    </view>

    <view class="card form-section">
      <view class="section-title">续租设置</view>
      <view class="form-row">
        <text class="label">续租天数</text>
        <view class="number-input">
          <button class="num-btn" @tap="changeDays(-1)" :disabled="days <= 1">-</button>
          <text class="num-value">{{ days }}</text>
          <button class="num-btn" @tap="changeDays(1)" :disabled="days >= 30">+</button>
        </view>
      </view>
      <view class="form-row">
        <text class="label">新的还车时间</text>
        <text class="time-value">{{ newReturnTimeText }}</text>
      </view>
    </view>

    <view class="card price-section">
      <view class="price-row">
        <text class="label">续租日均价</text>
        <text class="value">￥{{ orderInfo.dailyPrice }}</text>
      </view>
      <view class="price-row total">
        <text class="label">续租费用</text>
        <text class="amount">￥{{ totalPrice }}</text>
      </view>
      <view class="tip">
        <u-icon name="info" color="#FF9F29" size="14"></u-icon>
        <text>支付成功后系统将自动确认续租，如无法续租将自动退款</text>
      </view>
    </view>

    <view class="bottom-actions">
      <button class="ghost-btn" @tap="contactStore">联系门店</button>
      <button class="primary-btn" @tap="goToPayment" :loading="submitting">立即支付续租费用</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { orderApi } from '@/api/order'

interface RenewalInfo {
  orderId?: string
  orderNo?: string
  returnTime?: string
  pickupTime?: string
  dailyPrice: number
  storePhone?: string
}

const orderInfo = ref<RenewalInfo>({
  orderId: '',
  orderNo: '',
  returnTime: '',
  pickupTime: '',
  dailyPrice: 0
})
const days = ref(1)
const submitting = ref(false)

const totalPrice = computed(() =>
  Number((days.value * (orderInfo.value.dailyPrice || 0)).toFixed(2))
)

const newReturnTimeText = computed(() => {
  if (!orderInfo.value.returnTime) return '--'
  const base = new Date(orderInfo.value.returnTime).getTime()
  if (Number.isNaN(base)) return '--'
  const next = base + days.value * 24 * 60 * 60 * 1000
  return formatDateTime(new Date(next).toISOString())
})

const changeDays = (step: number) => {
  const target = days.value + step
  if (target < 1 || target > 30) return
  days.value = target
}

const contactStore = () => {
  if (orderInfo.value.storePhone) {
    uni.makePhoneCall({ phoneNumber: orderInfo.value.storePhone })
    return
  }
  uni.showToast({
    title: '暂无门店电话',
    icon: 'none'
  })
}

const goToPayment = () => {
  if (!orderInfo.value.orderId && !orderInfo.value.orderNo) {
    uni.showToast({ title: '缺少订单信息', icon: 'none' })
    return
  }

  if (totalPrice.value <= 0) {
    uni.showToast({ title: '续租费用异常', icon: 'none' })
    return
  }

  // 构建支付页面参数
  const params = {
    orderNo: orderInfo.value.orderNo,
    amount: totalPrice.value,
    type: 'renewal', // 标识这是续租支付
    renewalDays: days.value,
    newReturnTime: encodeURIComponent(newReturnTimeText.value)
  }

  // 跳转到支付页面
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  uni.navigateTo({
    url: `/pages/order/pay?${queryString}`
  })
}

const loadOrderInfo = async (orderId?: string) => {
  if (!orderId) return
  try {
    uni.showLoading({ title: '加载中...' })
    const response: any = await orderApi.getOrderDetail(orderId)
    const payload = response?.data || response
    if (payload) {
      orderInfo.value = {
        orderId: payload.id || orderId,
        orderNo: payload.orderNo,
        returnTime: payload.returnTime,
        pickupTime: payload.pickupTime,
        dailyPrice: resolveDailyPrice(payload),
        storePhone: payload.pickupStore?.phone || payload.returnStore?.phone
      }
    }
  } catch (error) {
    logger.error('加载订单失败', error)
    uni.showToast({ title: '加载订单失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const resolveDailyPrice = (payload: any) => {
  if (typeof payload?.vehicle?.dailyPrice === 'number') {
    return payload.vehicle.dailyPrice
  }
  if (typeof payload?.dailyPrice === 'number') {
    return payload.dailyPrice
  }
  if (typeof payload?.amount?.dailyPrice === 'number') {
    return payload.amount.dailyPrice
  }
  const pickup = payload?.pickupTime ? new Date(payload.pickupTime).getTime() : 0
  const dropoff = payload?.returnTime ? new Date(payload.returnTime).getTime() : 0
  const days =
    pickup && dropoff && dropoff > pickup
      ? Math.max(1, Math.round((dropoff - pickup) / (24 * 60 * 60 * 1000)))
      : 1
  const base =
    payload?.vehicleFee ||
    payload?.amount?.totalAmount ||
    payload?.actualAmount ||
    payload?.totalAmount ||
    0
  if (!base) return 0
  return Number((base / days).toFixed(2))
}

onLoad((options: Record<string, any>) => {
  const decodeValue = (val?: string) => {
    if (!val) return ''
    try {
      return decodeURIComponent(decodeURIComponent(val))
    } catch (error) {
      try {
        return decodeURIComponent(val)
      } catch (err) {
        return val
      }
    }
  }
  orderInfo.value = {
    orderId: options.orderId || '',
    orderNo: options.orderNo || '',
    returnTime: decodeValue(options.returnTime),
    pickupTime: decodeValue(options.pickupTime),
    dailyPrice: Number(options.dailyPrice) || 0
  }
  if (!orderInfo.value.returnTime || !orderInfo.value.dailyPrice) {
    loadOrderInfo(orderInfo.value.orderId || orderInfo.value.orderNo)
  }
})

const formatDateTime = (value?: string) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}
</script>

<style scoped lang="scss">
.renewal-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 24rpx;
  padding-bottom: 140rpx;
}

.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.info-row,
.form-row,
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 24rpx;
}

.info-row:last-child,
.form-row:last-child,
.price-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #999999;
}

.value {
  font-weight: 600;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  color: #333333;
}

.number-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.num-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  background-color: #f1f1f1;
  font-size: 32rpx;
  color: #333333;
  padding: 0;
  line-height: 64rpx;
}

.num-btn::after {
  border: none;
}

.num-value {
  width: 80rpx;
  text-align: center;
  font-size: 30rpx;
}

.time-value {
  color: #ff9f29;
  font-weight: 600;
}

.price-section .total {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
  margin-top: 12rpx;
}

.amount {
  font-size: 36rpx;
  font-weight: 700;
  color: #f5222d;
}

.tip {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999999;
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -6rpx 20rpx rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 20rpx;
}

.primary-btn,
.ghost-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.primary-btn {
  background: linear-gradient(135deg, #ff9f29 0%, #ffb84d 100%);
  color: #ffffff;
}

.ghost-btn {
  background-color: #ffffff;
  color: #ff9f29;
  border: 2rpx solid rgba(255, 159, 41, 0.4);
}
</style>
