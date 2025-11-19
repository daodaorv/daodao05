<template>
  <view class="home-page">
    <!-- 顶部通知栏 -->
    <view class="notice-bar">
      <uni-icons type="notification" size="16" color="#FF9F29"></uni-icons>
      <text class="notice-text">【活动】国庆黄金周全场租赁8折，限...</text>
      <uni-icons type="right" size="14" color="#999"></uni-icons>
    </view>

    <!-- Banner轮播 -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots circular autoplay interval="3000">
        <swiper-item>
          <view class="banner-item banner1">
            <text class="banner-text">Banner1</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="banner-item banner2">
            <text class="banner-text">Banner2</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 房车预订区域 -->
    <view class="booking-section">
      <view class="booking-title">房车预订</view>

      <!-- 取车城市 -->
      <view class="booking-item" @tap="selectCity">
        <view class="item-label">
          <uni-icons type="location" size="18" color="#FF9F29"></uni-icons>
          <text class="label-text">取车城市</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !pickupCity }">
            {{ pickupCity || '请选择城市' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 取车门店 -->
      <view class="booking-item" @tap="selectStore('pickup')">
        <view class="item-label">
          <uni-icons type="shop" size="18" color="#FF9F29"></uni-icons>
          <text class="label-text">取车门店</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !pickupStore }">
            {{ pickupStore || '请选择门店' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 异地还车选项 -->
      <view class="booking-item">
        <view class="item-label">
          <uni-icons type="flag" size="18" color="#FF9F29"></uni-icons>
          <text class="label-text">异地还车</text>
        </view>
        <view class="item-value">
          <switch :checked="isDifferentReturn" @change="onDifferentReturnChange" color="#FF9F29" />
        </view>
      </view>

      <!-- 还车城市（异地还车时显示） -->
      <view v-if="isDifferentReturn" class="booking-item" @tap="selectReturnCity">
        <view class="item-label">
          <uni-icons type="location" size="18" color="#4B91FF"></uni-icons>
          <text class="label-text">还车城市</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !returnCity }">
            {{ returnCity || '请选择城市' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 还车门店（异地还车时显示） -->
      <view v-if="isDifferentReturn" class="booking-item" @tap="selectStore('return')">
        <view class="item-label">
          <uni-icons type="shop" size="18" color="#4B91FF"></uni-icons>
          <text class="label-text">还车门店</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !returnStore }">
            {{ returnStore || '请选择门店' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 取车时间 -->
      <view class="booking-item" @tap="selectDateTime('pickup')">
        <view class="item-label">
          <uni-icons type="calendar" size="18" color="#FF9F29"></uni-icons>
          <text class="label-text">取车时间</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !pickupTime }">
            {{ pickupTime || '请选择时间' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 还车时间 -->
      <view class="booking-item" @tap="selectDateTime('return')">
        <view class="item-label">
          <uni-icons type="calendar" size="18" color="#FF9F29"></uni-icons>
          <text class="label-text">还车时间</text>
        </view>
        <view class="item-value">
          <text class="value-text" :class="{ 'placeholder': !returnTime }">
            {{ returnTime || '请选择时间' }}
          </text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 查询按钮 -->
      <button
        class="search-button"
        :class="{ 'disabled': !canSearch }"
        :disabled="!canSearch"
        @tap="searchVehicles"
      >
        查询可用房车
      </button>

      <!-- 提示文字 -->
      <view v-if="!canSearch" class="booking-tip">
        <uni-icons type="info" size="14" color="#FF9F29"></uni-icons>
        <text class="tip-text">请完整填写取车城市、门店和时间</text>
      </view>
    </view>



    <!-- 特惠商城 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">特惠商城</text>
        <text class="section-more" @tap="goToMore">更多 ></text>
      </view>
      <view class="coupon-grid">
        <view class="coupon-item coupon-orange">
          <view class="coupon-amount">¥50</view>
          <text class="coupon-desc">券车租赁券</text>
          <text class="coupon-valid">适用于</text>
          <button class="coupon-btn">购买</button>
        </view>
        <view class="coupon-item coupon-orange">
          <view class="coupon-amount">¥200</view>
          <text class="coupon-desc">租车券</text>
          <text class="coupon-valid">专享优惠</text>
          <button class="coupon-btn">购买</button>
        </view>
        <view class="coupon-item coupon-orange">
          <view class="coupon-amount">¥500</view>
          <text class="coupon-desc">马车租赁券</text>
          <text class="coupon-valid">适用于</text>
          <button class="coupon-btn">购买</button>
        </view>
        <view class="coupon-item coupon-orange">
          <view class="coupon-amount">¥1000</view>
          <text class="coupon-desc">租车券</text>
          <text class="coupon-valid">适用于</text>
          <button class="coupon-btn">购买</button>
        </view>
      </view>
    </view>

    <!-- 快捷服务 -->
    <view class="service-grid">
      <view class="service-item" @tap="goToService('rental')">
        <uni-icons type="car" size="24" color="#FF9F29"></uni-icons>
        <text class="service-name">短期租车</text>
      </view>
      <view class="service-item" @tap="goToService('crowd')">
        <uni-icons type="person" size="24" color="#FF9F29"></uni-icons>
        <text class="service-name">众筹众包</text>
      </view>
      <view class="service-item" @tap="goToService('consign')">
        <uni-icons type="paperplane" size="24" color="#FF9F29"></uni-icons>
        <text class="service-name">寄运托运</text>
      </view>
      <view class="service-item" @tap="goToService('travel')">
        <uni-icons type="map" size="24" color="#FF9F29"></uni-icons>
        <text class="service-name">房车旅行</text>
      </view>
    </view>

    <!-- 加入会员 -->
    <view class="member-card">
      <view class="member-header">
        <text class="member-title">加入会员</text>
        <text class="member-subtitle">享受专属高端服务</text>
      </view>
      <view class="member-benefits">
        <view class="benefit-item">
          <uni-icons type="vip" size="16" color="#FFFFFF"></uni-icons>
          <text class="benefit-text">金融分期</text>
        </view>
        <view class="benefit-item">
          <uni-icons type="gift" size="16" color="#FFFFFF"></uni-icons>
          <text class="benefit-text">以租代购</text>
        </view>
        <view class="benefit-item">
          <uni-icons type="star" size="16" color="#FFFFFF"></uni-icons>
          <text class="benefit-text">专属礼包</text>
        </view>
      </view>
      <button class="member-join-btn">立即加入</button>
    </view>

    <!-- 推荐内容 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐内容</text>
        <text class="section-more" @tap="goToMore">更多 ></text>
      </view>

      <!-- Tab切换 -->
      <view class="recommend-tabs">
        <view
          class="tab-item"
          :class="{ 'active': recommendTab === 'vehicle' }"
          @tap="switchRecommendTab('vehicle')"
        >
          <text class="tab-text">优质房车</text>
        </view>
        <view
          class="tab-item"
          :class="{ 'active': recommendTab === 'crowdfunding' }"
          @tap="switchRecommendTab('crowdfunding')"
        >
          <text class="tab-text">众筹项目</text>
        </view>
        <view
          class="tab-item"
          :class="{ 'active': recommendTab === 'community' }"
          @tap="switchRecommendTab('community')"
        >
          <text class="tab-text">社区精选</text>
        </view>
      </view>

      <!-- 优质房车 -->
      <view v-if="recommendTab === 'vehicle'" class="recommend-list">
        <view class="vehicle-card">
          <image class="vehicle-image" src="/static/placeholder-vehicle.png" mode="aspectFill"></image>
          <view class="vehicle-info">
            <text class="vehicle-name">奔驰Sprinter房车</text>
            <view class="vehicle-meta">
              <text class="vehicle-price">¥500/天起</text>
              <view class="vehicle-rating">
                <uni-icons type="star-filled" size="14" color="#FF9F29"></uni-icons>
                <text class="rating-text">4.8</text>
              </view>
            </view>
          </view>
        </view>
        <view class="vehicle-card">
          <image class="vehicle-image" src="/static/placeholder-vehicle.png" mode="aspectFill"></image>
          <view class="vehicle-info">
            <text class="vehicle-name">福特全顺房车</text>
            <view class="vehicle-meta">
              <text class="vehicle-price">¥380/天起</text>
              <view class="vehicle-rating">
                <uni-icons type="star-filled" size="14" color="#FF9F29"></uni-icons>
                <text class="rating-text">4.6</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 众筹项目 -->
      <view v-if="recommendTab === 'crowdfunding'" class="recommend-list">
        <view class="crowdfunding-card">
          <view class="card-header">
            <text class="project-name">【众筹】奔驰Sprinter豪华房车</text>
            <view class="project-tag">进行中</view>
          </view>
          <view class="card-body">
            <view class="progress-info">
              <text class="progress-text">已筹集</text>
              <text class="progress-amount">¥850,000</text>
              <text class="progress-target">/ ¥1,000,000</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 85%"></view>
            </view>
            <view class="project-meta">
              <view class="meta-item">
                <text class="meta-label">预期年化</text>
                <text class="meta-value highlight">12%</text>
              </view>
              <view class="meta-item">
                <text class="meta-label">剩余天数</text>
                <text class="meta-value">15天</text>
              </view>
              <view class="meta-item">
                <text class="meta-label">参与人数</text>
                <text class="meta-value">128人</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 社区精选 -->
      <view v-if="recommendTab === 'community'" class="recommend-list">
        <view class="post-item">
          <view class="post-card post-purple">
            <text class="post-title">Post 1</text>
          </view>
          <text class="post-desc">西藏自驾游记：从成都到拉萨的房车之旅</text>
          <view class="post-meta">
            <view class="meta-item">
              <uni-icons type="eye" size="14" color="#999"></uni-icons>
              <text class="meta-text">1234</text>
            </view>
            <view class="meta-item">
              <uni-icons type="heart" size="14" color="#999"></uni-icons>
              <text class="meta-text">234</text>
            </view>
          </view>
        </view>
        <view class="post-item">
          <view class="post-card post-green">
            <text class="post-title">Post 2</text>
          </view>
          <text class="post-desc">新疆环线攻略：最适合的房车在路上</text>
          <view class="post-meta">
            <view class="meta-item">
              <uni-icons type="eye" size="14" color="#999"></uni-icons>
              <text class="meta-text">2345</text>
            </view>
            <view class="meta-item">
              <uni-icons type="heart" size="14" color="#999"></uni-icons>
              <text class="meta-text">855</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 房车预订相关状态
const pickupCity = ref('');
const pickupStore = ref('');
const isDifferentReturn = ref(false);
const returnCity = ref('');
const returnStore = ref('');
const pickupTime = ref('');
const returnTime = ref('');

// 推荐内容Tab
const recommendTab = ref('vehicle'); // vehicle, crowdfunding, community

// 计算是否可以查询（强制条件：城市、门店、取车时间）
const canSearch = computed(() => {
  return pickupCity.value && pickupStore.value && pickupTime.value;
});

// 页面加载时自动获取当前城市
onMounted(() => {
  getCurrentCity();
});

// 获取当前城市
const getCurrentCity = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      // 这里应该调用地理编码API将经纬度转换为城市名
      // 暂时使用模拟数据
      pickupCity.value = '深圳';
    },
    fail: () => {
      uni.showToast({ title: '定位失败，请手动选择城市', icon: 'none' });
    }
  });
};

// 选择取车城市
const selectCity = () => {
  uni.showActionSheet({
    itemList: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
    success: (res) => {
      const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州'];
      pickupCity.value = cities[res.tapIndex];
      // 切换城市后清空门店选择
      pickupStore.value = '';
    }
  });
};

// 选择还车城市
const selectReturnCity = () => {
  uni.showActionSheet({
    itemList: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
    success: (res) => {
      const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州'];
      returnCity.value = cities[res.tapIndex];
      // 切换城市后清空门店选择
      returnStore.value = '';
    }
  });
};

// 选择门店
const selectStore = (type) => {
  const city = type === 'pickup' ? pickupCity.value : returnCity.value;

  if (!city) {
    uni.showToast({
      title: type === 'pickup' ? '请先选择取车城市' : '请先选择还车城市',
      icon: 'none'
    });
    return;
  }

  // 模拟门店列表（实际应从后台获取）
  uni.showActionSheet({
    itemList: [
      `${city}机场店`,
      `${city}市中心店`,
      `${city}火车站店`,
      `${city}商业区店`
    ],
    success: (res) => {
      const stores = [
        `${city}机场店`,
        `${city}市中心店`,
        `${city}火车站店`,
        `${city}商业区店`
      ];
      if (type === 'pickup') {
        pickupStore.value = stores[res.tapIndex];
      } else {
        returnStore.value = stores[res.tapIndex];
      }
    }
  });
};

// 异地还车开关变化
const onDifferentReturnChange = (e) => {
  isDifferentReturn.value = e.detail.value;
  if (!e.detail.value) {
    // 关闭异地还车时清空还车城市和门店
    returnCity.value = '';
    returnStore.value = '';
  }
};

// 选择日期时间
const selectDateTime = (type) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  uni.showModal({
    title: type === 'pickup' ? '选择取车时间' : '选择还车时间',
    content: '日期时间选择功能开发中，暂时使用模拟数据',
    success: (res) => {
      if (res.confirm) {
        // 模拟选择时间
        const mockDate = new Date(year, month, day + (type === 'pickup' ? 1 : 3));
        const dateStr = `${mockDate.getMonth() + 1}月${mockDate.getDate()}日 10:00`;

        if (type === 'pickup') {
          pickupTime.value = dateStr;
        } else {
          returnTime.value = dateStr;
        }
      }
    }
  });
};

// 查询可用房车
const searchVehicles = () => {
  if (!canSearch.value) {
    uni.showToast({
      title: '请完整填写取车城市、门店和时间',
      icon: 'none'
    });
    return;
  }

  // 构建查询参数
  const params = {
    pickupCity: pickupCity.value,
    pickupStore: pickupStore.value,
    pickupTime: pickupTime.value,
    returnTime: returnTime.value,
    isDifferentReturn: isDifferentReturn.value,
    returnCity: returnCity.value,
    returnStore: returnStore.value
  };

  console.log('查询参数:', params);

  // 跳转到车辆列表页（需要创建）
  uni.showToast({
    title: '车辆列表页面开发中',
    icon: 'none'
  });
};

const goToMore = () => {
  uni.showToast({ title: '更多优惠开发中', icon: 'none' });
};

const goToService = (type) => {
  uni.showToast({ title: '服务功能开发中', icon: 'none' });
};

const goToCommunity = () => {
  uni.switchTab({ url: '/pages/community/index' });
};

// 切换推荐内容Tab
const switchRecommendTab = (tab) => {
  recommendTab.value = tab;
};
</script>



<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 32rpx;
}

// 通知栏
.notice-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #ffffff;
  gap: 16rpx;

  .notice-text {
    flex: 1;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.6);
  }
}

// Banner轮播
.banner-section {
  margin: 24rpx 32rpx;

  .banner-swiper {
    height: 320rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .banner-item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16rpx;

      &.banner1 {
        background: linear-gradient(135deg, #4B91FF 0%, #67C23A 100%);
      }

      &.banner2 {
        background: linear-gradient(135deg, #FF9F29 0%, #FF4D4F 100%);
      }

      .banner-text {
        font-size: 48rpx;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
}

// 房车预订区域
.booking-section {
  margin: 0 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;

  .booking-title {
    font-size: 32rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 24rpx;
  }

  .booking-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 2rpx solid #f0f0f0;

    &:last-of-type {
      border-bottom: none;
    }

    .item-label {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .label-text {
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    .item-value {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .value-text {
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.9);

        &.placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }

  .search-button {
    width: 100%;
    height: 88rpx;
    background: #FF9F29;
    color: #ffffff;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: 500;
    border: none;
    margin-top: 32rpx;
    box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);

    &::after {
      border: none;
    }

    &.disabled {
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.3);
      box-shadow: none;
    }
  }

  .booking-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    margin-top: 16rpx;

    .tip-text {
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.6);
    }
  }
}

// 通用区块
.section {
  margin: 0 32rpx 24rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      margin-left: 8rpx;
    }

    .section-more {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.4);
    }
  }


}
// 优惠券网格
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;

  .coupon-item {
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    &.coupon-orange {
      background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    }

    .coupon-amount {
      font-size: 48rpx;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 8rpx;
    }

    .coupon-desc {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 4rpx;
    }

    .coupon-valid {
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 16rpx;
    }

    .coupon-btn {
      width: 100%;
      height: 56rpx;
      background: rgba(255, 255, 255, 0.3);
      color: #ffffff;
      border-radius: 8rpx;
      font-size: 24rpx;
      border: none;
      line-height: 56rpx;
      padding: 0;

      &::after {
        border: none;
      }
    }
  }
}

// 快捷服务
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  margin: 0 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;

  .service-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .service-name {
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.9);
    }
  }
}

// 会员卡片
.member-card {
  margin: 0 32rpx 24rpx;
  background: linear-gradient(135deg, #8860D0 0%, #A78BDB 100%);
  border-radius: 16rpx;
  padding: 32rpx;

  .member-header {
    margin-bottom: 24rpx;

    .member-title {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 8rpx;
    }

    .member-subtitle {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .member-benefits {
    display: flex;
    gap: 24rpx;
    margin-bottom: 24rpx;

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .benefit-text {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .member-join-btn {
    width: 100%;
    height: 72rpx;
    background: rgba(255, 255, 255, 0.3);
    color: #ffffff;
    border-radius: 12rpx;
    font-size: 28rpx;
    font-weight: 500;
    border: none;

    &::after {
      border: none;
    }
  }
}

// 推荐内容Tab
.recommend-tabs {
  display: flex;
  gap: 32rpx;
  margin-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;

  .tab-item {
    padding: 16rpx 0;
    position: relative;

    .tab-text {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.6);
    }

    &.active {
      .tab-text {
        color: #FF9F29;
        font-weight: 500;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4rpx;
        background: #FF9F29;
        border-radius: 2rpx;
      }
    }
  }
}

// 推荐列表
.recommend-list {
  display: flex;
  gap: 24rpx;
  overflow-x: auto;

  // 房车卡片
  .vehicle-card {
    flex-shrink: 0;
    width: 280rpx;
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

    .vehicle-image {
      width: 100%;
      height: 180rpx;
      background: #f0f0f0;
    }

    .vehicle-info {
      padding: 16rpx;

      .vehicle-name {
        display: block;
        font-size: 28rpx;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        margin-bottom: 12rpx;
      }

      .vehicle-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .vehicle-price {
          font-size: 32rpx;
          font-weight: 600;
          color: #FF9F29;
        }

        .vehicle-rating {
          display: flex;
          align-items: center;
          gap: 4rpx;

          .rating-text {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }

  // 众筹卡片
  .crowdfunding-card {
    flex-shrink: 0;
    width: 580rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .project-name {
        flex: 1;
        font-size: 30rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
      }

      .project-tag {
        padding: 8rpx 16rpx;
        background: rgba(255, 159, 41, 0.1);
        color: #FF9F29;
        font-size: 24rpx;
        border-radius: 8rpx;
      }
    }

    .card-body {
      .progress-info {
        display: flex;
        align-items: baseline;
        gap: 8rpx;
        margin-bottom: 12rpx;

        .progress-text {
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.6);
        }

        .progress-amount {
          font-size: 36rpx;
          font-weight: 600;
          color: #FF9F29;
        }

        .progress-target {
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.4);
        }
      }

      .progress-bar {
        height: 12rpx;
        background: #f0f0f0;
        border-radius: 6rpx;
        overflow: hidden;
        margin-bottom: 20rpx;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF9F29 0%, #FFB84D 100%);
        }
      }

      .project-meta {
        display: flex;
        justify-content: space-between;

        .meta-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8rpx;

          .meta-label {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.6);
          }

          .meta-value {
            font-size: 28rpx;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);

            &.highlight {
              color: #FF4D4F;
              font-size: 32rpx;
              font-weight: 600;
            }
          }
        }
      }
    }
  }

  // 帖子卡片
  .post-item {
    flex-shrink: 0;
    width: 280rpx;

    .post-card {
      width: 100%;
      height: 200rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;

      &.post-purple {
        background: linear-gradient(135deg, #8860D0 0%, #A78BDB 100%);
      }

      &.post-green {
        background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
      }

      .post-title {
        font-size: 40rpx;
        font-weight: 600;
        color: #ffffff;
      }
    }

    .post-desc {
      display: block;
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.9);
      margin-bottom: 12rpx;
      line-height: 1.5;
    }

    .post-meta {
      display: flex;
      gap: 24rpx;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .meta-text {
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>


