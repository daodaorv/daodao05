<template>
  <view class="project-detail-page">
    <!-- 顶部图片轮播 -->
    <swiper class="detail-swiper" circular autoplay interval="5000" duration="500" indicator-dots indicator-active-color="#FF9F29">
      <swiper-item v-for="(img, index) in project.images" :key="index">
        <image class="swiper-image" :src="img" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 项目基本信息 -->
    <view class="info-section">
      <view class="title-row">
        <text class="title">{{ project.title }}</text>
        <view class="status-tag" :class="project.status">{{ getStatusText(project.status) }}</view>
      </view>
      <text class="desc">{{ project.desc }}</text>
      
      <!-- 进度数据 -->
      <view class="progress-card">
        <view class="progress-box">
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: project.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ project.progress }}%</text>
        </view>
        <view class="data-grid">
          <view class="data-item">
            <text class="value">¥{{ project.raised }}</text>
            <text class="label">已筹金额</text>
          </view>
          <view class="data-item">
            <text class="value">{{ project.backers }}</text>
            <text class="label">支持人数</text>
          </view>
          <view class="data-item">
            <text class="value">{{ project.annualReturn }}%</text>
            <text class="label">年化收益</text>
          </view>
          <view class="data-item">
            <text class="value">{{ project.daysLeft }}</text>
            <text class="label">剩余天数</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 项目详情/购买份额 -->
    <view class="content-section">
      <view class="tab-header">
        <view class="tab-item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">项目详情</view>
        <view class="tab-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">购买份额</view>
      </view>
      
      <view class="tab-content" v-if="currentTab === 0">
        <view class="rich-text">
          <text class="section-title">项目介绍</text>
          <text class="content-text">{{ project.description }}</text>
          <image src="https://picsum.photos/700/500?random=30" mode="widthFix" style="width: 100%; margin: 20rpx 0; border-radius: 12rpx;"></image>
          
          <text class="section-title">投资说明</text>
          <view class="info-item">
            <text class="info-label">单份价格:</text>
            <text class="info-value">¥{{ project.sharePrice }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">最低购买:</text>
            <text class="info-value">1份</text>
          </view>
          <view class="info-item">
            <text class="info-label">购买限制:</text>
            <text class="info-value">无限制</text>
          </view>
          <view class="info-item">
            <text class="info-label">收益发放:</text>
            <text class="info-value">次月5号</text>
          </view>
          
          <text class="section-title">风险提示</text>
          <text class="content-text warning">众筹有风险,投资需谨慎。预期年化收益率仅为参考,实际收益可能受多种因素影响而有所波动。</text>
        </view>
      </view>
      
      <view class="tab-content" v-if="currentTab === 1">
        <view class="purchase-form">
          <view class="form-item">
            <text class="form-label">单份价格</text>
            <text class="price-value">¥{{ project.sharePrice }}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">购买份数</text>
            <view class="number-input">
              <button class="number-btn" :disabled="shares <= 1" @click="decreaseShares">-</button>
              <input class="number-value" type="number" v-model.number="shares" @input="handleSharesInput" />
              <button class="number-btn" @click="increaseShares">+</button>
            </view>
          </view>
          
          <view class="form-item total">
            <text class="form-label">支付金额</text>
            <text class="total-amount">¥{{ totalAmount }}</text>
          </view>
          
          <view class="agreement">
            <checkbox-group @change="handleAgreeChange">
              <label class="agreement-label">
                <checkbox value="agree" :checked="agreed" />
                <text>我已阅读并同意</text>
                <text class="link">《众筹协议》</text>
              </label>
            </checkbox-group>
          </view>
          
          <button class="purchase-btn" :disabled="!agreed || shares < 1" @click="handlePurchase">
            立即支付 ¥{{ totalAmount }}
          </button>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-bar">
      <view class="footer-actions">
        <view class="action-btn" @click="handleShare">
          <uni-icons type="redo" size="20" color="#666"></uni-icons>
          <text>分享</text>
        </view>
        <view class="action-btn" @click="handleCollect">
          <uni-icons type="star" size="20" color="#666"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <button class="invest-btn" @click="currentTab = 1">立即支持</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const currentTab = ref(0);
const shares = ref(1);
const agreed = ref(false);

const project = ref<any>({
  title: '加载中...',
  images: [],
  status: 'funding',
  progress: 0,
  raised: '0',
  backers: 0,
  annualReturn: 0,
  daysLeft: 0,
  sharePrice: 10000,
  description: ''
});

onLoad((options: any) => {
  const id = options.id;
  setTimeout(() => {
    project.value = {
      id: id,
      title: '道道房车2025新款 - 探索者号',
      desc: '专为家庭出游打造,超大空间,智能家居系统,让旅行更舒适。',
      description: '本项目采用最新款房车进行众筹,车型为2025年最新款探索者号,配备智能家居系统、超大空间设计、完善的安全配置。预期年化收益率8-12%,收益按月发放,次月5号到账。',
      images: [
        'https://picsum.photos/750/500?random=20',
        'https://picsum.photos/750/500?random=21',
        'https://picsum.photos/750/500?random=22'
      ],
      status: 'funding',
      progress: 68,
      raised: '1,250,000',
      backers: 356,
      annualReturn: 12.5,
      daysLeft: 15,
      sharePrice: 10000
    };
  }, 500);
});

const totalAmount = computed(() => {
  return shares.value * project.value.sharePrice;
});

const getStatusText = (status: string) => {
  const map: any = {
    funding: '众筹中',
    completed: '已成功',
    failed: '已结束'
  };
  return map[status] || status;
};

const decreaseShares = () => {
  if (shares.value > 1) {
    shares.value--;
  }
};

const increaseShares = () => {
  shares.value++;
};

const handleSharesInput = (e: any) => {
  const value = parseInt(e.detail.value);
  if (value < 1) {
    shares.value = 1;
  } else {
    shares.value = value;
  }
};

const handleAgreeChange = (e: any) => {
  agreed.value = e.detail.value.includes('agree');
};

const handlePurchase = () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先阅读并同意众筹协议', icon: 'none' });
    return;
  }
  
  uni.showModal({
    title: '确认支付',
    content: `即将支付¥${totalAmount.value}购买${shares.value}份众筹份额`,
    confirmText: '确认支付',
    success: (res) => {
      if (res.confirm) {
        // 跳转到支付页面
        uni.redirectTo({
          url: `/pages/order/pay?type=crowdfunding&amount=${totalAmount.value}&shares=${shares.value}`
        });
      }
    }
  });
};

const handleShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

const handleCollect = () => {
  uni.showToast({ title: '收藏成功', icon: 'none' });
};
</script>

<style scoped lang="scss">
.project-detail-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 160rpx;
}

.detail-swiper {
  width: 100%;
  height: 500rpx;
  
  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.info-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
  gap: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.status-tag {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #FFFFFF;
  white-space: nowrap;
  
  &.funding {
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  }
  
  &.completed {
    background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  }
  
  &.failed {
    background-color: #999;
  }
}

.desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32rpx;
  display: block;
}

.progress-card {
  background-color: #F9F9F9;
  border-radius: 12rpx;
  padding: 24rpx;
}

.progress-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background-color: #E0E0E0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #FF9F29 0%, #FFB84D 100%);
  border-radius: 6rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #FF9F29;
  font-weight: bold;
}

.data-grid {
  display: flex;
  justify-content: space-between;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  
  .value {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .label {
    font-size: 22rpx;
    color: #999;
  }
}

.content-section {
  background-color: #FFFFFF;
  min-height: 500rpx;
}

.tab-header {
  display: flex;
  border-bottom: 1rpx solid #F5F5F5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 32rpx 0;
  font-size: 30rpx;
  color: #666;
  position: relative;
  
  &.active {
    color: #FF9F29;
    font-weight: bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: #FF9F29;
      border-radius: 2rpx;
    }
  }
}

.tab-content {
  padding: 32rpx;
}

.rich-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 32rpx 0 16rpx;
  
  &:first-child {
    margin-top: 0;
  }
}

.content-text {
  display: block;
  color: #666;
  line-height: 1.8;
  margin-bottom: 16rpx;
  
  &.warning {
    background-color: #FFF3E0;
    padding: 16rpx;
    border-radius: 8rpx;
    color: #F57C00;
    font-size: 26rpx;
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: #999;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.purchase-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &.total {
    padding-top: 24rpx;
    border-top: 2rpx solid #F5F5F5;
  }
}

.form-label {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.price-value {
  font-size: 36rpx;
  color: #FF9F29;
  font-weight: bold;
}

.number-input {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.number-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 1rpx solid #DDD;
  background-color: #FFFFFF;
  font-size: 32rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  
  &:disabled {
    background-color: #F5F5F5;
    color: #CCC;
  }
  
  &::after {
    border: none;
  }
}

.number-value {
  width: 120rpx;
  height: 60rpx;
  border: 1rpx solid #DDD;
  border-radius: 8rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.total-amount {
  font-size: 40rpx;
  color: #F44336;
  font-weight: bold;
}

.agreement {
  margin-top: 16rpx;
}

.agreement-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: #666;
  
  .link {
    color: #FF9F29;
  }
}

.purchase-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  margin-top: 24rpx;
  
  &:disabled {
    opacity: 0.5;
  }
  
  &::after {
    border: none;
  }
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  gap: 24rpx;
}

.footer-actions {
  display: flex;
  gap: 32rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  font-size: 20rpx;
  color: #666;
}

.invest-btn {
  flex: 1;
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0;
  
  &::after {
    border: none;
  }
}
</style>
