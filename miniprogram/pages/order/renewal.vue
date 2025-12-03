<template>
  <view class="renewal-page">
    <view class="order-info">
      <view class="info-item">
        <text class="label">当前订单</text>
        <text class="value">{{ order.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">当前还车时间</text>
        <text class="value">{{ formatDateTime(order.returnTime) }}</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-title">续租设置</view>
      <view class="form-item">
        <text class="label">续租天数</text>
        <view class="number-input">
          <button class="num-btn" @tap="decreaseDays">-</button>
          <input name="number" v-model="days" class="num-value" disabled />
          <button class="num-btn" @tap="increaseDays">+</button>
        </view>
      </view>
      <view class="form-item">
        <text class="label">新还车时间</text>
        <text class="value highlight">{{ newReturnTime }}</text>
      </view>
    </view>

    <view class="price-section">
      <view class="price-item">
        <text class="label">续租单价</text>
        <text class="value">¥{{ order.dailyPrice }}/天</text>
      </view>
      <view class="price-item total">
        <text class="label">预计费用</text>
        <text class="amount">¥{{ totalPrice }}</text>
      </view>
    </view>

    <view class="bottom-btn">
      <button class="submit-btn" @tap="submitRenewal">确认续租并支付</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const orderId = ref(null);
const order = ref({});
const days = ref(1);
const totalPrice = ref(0);

onLoad((options) => {
  if (options.orderId) {
    orderId.value = parseInt(options.orderId);
    loadOrderInfo();
  }
});

const loadOrderInfo = () => {
  // Mock data - replace with API call
  order.value = {
    orderNo: 'DD20231127001',
    returnTime: new Date().getTime() + 86400000 * 2, // 2 days later
    dailyPrice: 500
  };
  calculatePrice();
};

const newReturnTime = computed(() => {
  if (!order.value.returnTime) return '';
  const newTime = new Date(order.value.returnTime + days.value * 86400000);
  return formatDateTime(newTime);
});

const increaseDays = () => {
  if (days.value < 30) {
    days.value++;
    calculatePrice();
  }
};

const decreaseDays = () => {
  if (days.value > 1) {
    days.value--;
    calculatePrice();
  }
};

const calculatePrice = () => {
  totalPrice.value = days.value * (order.value.dailyPrice || 0);
};

const submitRenewal = () => {
  uni.showLoading({ title: '提交中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '续租申请已提交',
      icon: 'success'
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>

<style lang="scss" scoped>
.renewal-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.order-info, .form-section, .price-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.info-item, .form-item, .price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #333;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  padding-left: 16rpx;
  border-left: 8rpx solid #FF9F29;
}

.label {
  color: #666;
}

.value {
  font-weight: 500;
}

.highlight {
  color: #FF9F29;
  font-weight: bold;
}

.total {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #eee;
  
  .amount {
    color: #f5222d;
    font-size: 36rpx;
    font-weight: bold;
  }
}

.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

  .submit-btn {
    background-color: #FF9F29;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    
    &:active {
      opacity: 0.9;
    }
  }
}

.number-input {
  display: flex;
  align-items: center;
  gap: 10rpx;

  .num-btn {
    width: 60rpx;
    height: 60rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    font-size: 32rpx;
    color: #333;
    padding: 0;
    margin: 0;
    line-height: 60rpx;

    &::after {
      border: none;
    }
  }

  .num-value {
    width: 100rpx;
    height: 60rpx;
    text-align: center;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
  }
}
</style>
