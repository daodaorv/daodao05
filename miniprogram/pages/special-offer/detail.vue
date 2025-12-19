<template>
  <view class="special-offer-detail">
    <!-- 图片轮播 -->
    <swiper class="image-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
      <swiper-item v-for="(image, index) in offerDetail.vehicle.images" :key="index">
        <image class="swiper-image" :src="photo" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 套餐基本信息 -->
    <view class="offer-info-section">
      <view class="route-header">
        <view class="route-main">
          <text class="route-text">{{ offerDetail.route.from }} → {{ offerDetail.route.to }}</text>
          <view class="special-badge">
            <text class="badge-text">特惠套餐</text>
          </view>
        </view>
        <view class="rental-days">
          <text class="days-text">{{ offerDetail.rentalDays }}天{{ offerDetail.rentalDays - 1 }}晚</text>
        </view>
      </view>

      <!-- 价格信息 -->
      <view class="price-section">
        <view class="price-main">
          <text class="price-symbol">¥</text>
          <text class="price-amount">{{ offerDetail.packagePrice }}</text>
          <text class="price-unit">/套餐</text>
        </view>
        <view class="price-detail">
          <text class="original-price" v-if="offerDetail.originalPrice">原价¥{{ offerDetail.originalPrice }}</text>
          <text class="save-amount">已省¥{{ offerDetail.originalPrice - offerDetail.packagePrice }}</text>
        </view>
      </view>

      <!-- 名额提示 -->
      <view class="quota-tip" :class="{ warning: offerDetail.remainingQuota <= 5 }">
        <u-icon name="info" size="16" :color="offerDetail.remainingQuota <= 5 ? '#F44336' : '#FF9F29'"></u-icon>
        <text class="tip-text">
          {{ offerDetail.remainingQuota <= 5 ? '名额紧张！' : '' }}
          仅剩{{ offerDetail.remainingQuota }}个名额，先订先得
        </text>
      </view>
    </view>

    <!-- 车辆信息 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">车辆信息</text>
      </view>
      <view class="vehicle-info">
        <text class="vehicle-name">{{ offerDetail.vehicle.name }}</text>
        <view class="vehicle-specs">
          <view class="spec-item" v-for="spec in offerDetail.vehicle.specifications" :key="spec.label">
            <text class="spec-label">{{ spec.label }}</text>
            <text class="spec-value">{{ spec.value }}</text>
          </view>
        </view>
        <view class="vehicle-features">
          <text class="feature-tag" v-for="feature in offerDetail.vehicle.features" :key="feature">
            {{ feature }}
          </text>
        </view>
      </view>
    </view>

    <!-- 行程信息 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">行程安排</text>
        <text class="title-tip">（固定路线，不可更改）</text>
      </view>
      <view class="route-detail">
        <!-- 取车信息 -->
        <view class="route-item">
          <view class="route-icon pickup">
            <u-icon name="map-fill" size="20" color="#FFFFFF"></u-icon>
          </view>
          <view class="route-content">
            <text class="route-label">取车门店</text>
            <text class="route-value">{{ offerDetail.pickupStore.name }}</text>
            <text class="route-address">{{ offerDetail.pickupStore.address }}</text>
          </view>
        </view>

        <!-- 连接线 -->
        <view class="route-line"></view>

        <!-- 还车信息 -->
        <view class="route-item">
          <view class="route-icon return">
            <u-icon name="pushpin-fill" size="20" color="#FFFFFF"></u-icon>
          </view>
          <view class="route-content">
            <text class="route-label">还车门店</text>
            <text class="route-value">{{ offerDetail.returnStore.name }}</text>
            <text class="route-address">{{ offerDetail.returnStore.address }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 可选时间段 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">可选取车时间</text>
      </view>
      <view class="time-range">
        <view class="time-item">
          <u-icon name="calendar" size="18" color="#FF9F29"></u-icon>
          <text class="time-text">{{ formatDate(offerDetail.availableTimeRange.start) }} 至 {{ formatDate(offerDetail.availableTimeRange.end) }}</text>
        </view>
        <text class="time-tip">预订时可在此时间段内选择取车日期</text>
      </view>
    </view>

    <!-- 套餐包含 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">套餐包含</text>
      </view>
      <view class="package-includes">
        <view class="include-item" v-for="item in offerDetail.packageIncludes" :key="item.name">
          <u-icon name="checkbox-mark" size="18" color="#67C23A"></u-icon>
          <text class="include-text">{{ item.name }}</text>
          <text class="include-desc" v-if="item.description">{{ item.description }}</text>
        </view>
      </view>
    </view>

    <!-- 预订须知 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">预订须知</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in offerDetail.bookingNotices" :key="index">
          <text class="notice-number">{{ index + 1 }}.</text>
          <text class="notice-text">{{ notice }}</text>
        </view>
      </view>
    </view>

    <!-- 取消政策 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">取消政策</text>
      </view>
      <view class="policy-list">
        <view class="policy-item" v-for="policy in offerDetail.cancellationPolicy" :key="policy.condition">
          <view class="policy-condition">
            <u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
            <text class="condition-text">{{ policy.condition }}</text>
          </view>
          <text class="policy-result">{{ policy.result }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-price">
          <text class="bar-symbol">¥</text>
          <text class="bar-amount">{{ offerDetail.packagePrice }}</text>
        </view>
        <text class="bar-tip">套餐价</text>
      </view>
      <view class="bar-actions">
        <button class="contact-btn" @tap="contactService">
          <u-icon name="chat" size="18" color="#FF9F29"></u-icon>
          <text>咨询</text>
        </button>
        <button class="book-btn" @tap="bookOffer">
          立即预订
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 获取路由参数
const offerId = ref('');

onLoad((options: any) => {
  offerId.value = options.id || '';
  loadOfferDetail();
});

// 套餐详情数据
const offerDetail = ref<any>({
  id: '',
  route: {
    from: '',
    to: ''
  },
  vehicle: {
    name: '',
    images: [],
    specifications: [],
    features: []
  },
  packagePrice: 0,
  originalPrice: 0,
  rentalDays: 0,
  remainingQuota: 0,
  totalQuota: 0,
  pickupStore: {
    name: '',
    address: ''
  },
  returnStore: {
    name: '',
    address: ''
  },
  availableTimeRange: {
    start: '',
    end: ''
  },
  packageIncludes: [],
  bookingNotices: [],
  cancellationPolicy: []
});

// 加载套餐详情
const loadOfferDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' });

    // Mock数据
    const mockDetail = {
      id: offerId.value,
      route: {
        from: '杭州',
        to: '千岛湖'
      },
      vehicle: {
        name: '依维柯欧胜C型房车',
        images: [
          '/static/logo.png',
          '/static/logo.png',
          '/static/logo.png',
          '/static/logo.png'
        ],
        specifications: [
          { label: '车型', value: 'C型房车' },
          { label: '座位数', value: '4-6座' },
          { label: '变速箱', value: '自动挡' },
          { label: '燃料类型', value: '柴油' },
          { label: '车长', value: '5.99米' },
          { label: '核载人数', value: '6人' }
        ],
        features: ['独立卫浴', '太阳能系统', '驻车空调', '智能导航', '倒车影像', '冰箱', '微波炉', '热水器']
      },
      packagePrice: 1280,
      originalPrice: 1680,
      rentalDays: 3,
      remainingQuota: 3,
      totalQuota: 10,
      pickupStore: {
        name: '杭州西湖门店',
        address: '浙江省杭州市西湖区文三路123号'
      },
      returnStore: {
        name: '千岛湖景区门店',
        address: '浙江省杭州市淳安县千岛湖镇环湖路88号'
      },
      availableTimeRange: {
        start: '2025-12-01',
        end: '2025-12-31'
      },
      packageIncludes: [
        { name: '车辆租金', description: '3天2晚固定租期' },
        { name: '基础保险', description: '第三者责任险' },
        { name: '异地还车费', description: '杭州-千岛湖单程' },
        { name: '首箱燃油', description: '满油交付' },
        { name: '不限公里数', description: '无里程限制' },
        { name: '24小时道路救援', description: '全程保障' }
      ],
      bookingNotices: [
        '本套餐为特惠固定套餐，取车门店、还车门店、租期均不可更改',
        '取车时间可在可选时间段内自由选择，系统将自动计算还车时间',
        '必须选择保险方案（基础险/标准险/全险），保险费用另计',
        '可选择附加服务（如儿童座椅、GPS等），费用另计',
        '取车时需支付押金，还车后无违章自动退还',
        '驾驶人需持有效驾驶证满1年以上',
        '名额有限，预订成功后不可退改，请谨慎下单'
      ],
      cancellationPolicy: [
        { condition: '出发前7天以上取消', result: '全额退款' },
        { condition: '出发前3-7天取消', result: '退款70%' },
        { condition: '出发前1-3天取消', result: '退款30%' },
        { condition: '出发当天取消', result: '不予退款' }
      ]
    };

    offerDetail.value = mockDetail;

  } catch (error) {
    logger.error('加载套餐详情失败:', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 联系客服
const contactService = () => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567'
  });
};

// 预订套餐
const bookOffer = () => {
  if (offerDetail.value.remainingQuota <= 0) {
    uni.showToast({
      title: '名额已满',
      icon: 'none'
    });
    return;
  }

  // 跳转到预订页面（复用订单确认页面，传入特惠套餐标识）
  uni.navigateTo({
    url: `/pages/order/confirm?type=special-offer&offerId=${offerId.value}`
  });
};
</script>

<style scoped lang="scss">
.special-offer-detail {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 120rpx;
}

// 图片轮播
.image-swiper {
  width: 100%;
  height: 500rpx;

  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

// 套餐基本信息
.offer-info-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .route-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .route-main {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .route-text {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
      }

      .special-badge {
        background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
        color: #FFFFFF;
        font-size: 22rpx;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;

        .badge-text {
          font-weight: 600;
        }
      }
    }

    .rental-days {
      background-color: rgba(75, 145, 255, 0.1);
      color: #4B91FF;
      padding: 8rpx 16rpx;
      border-radius: 8rpx;

      .days-text {
        font-size: 24rpx;
        font-weight: 500;
      }
    }
  }

  .price-section {
    margin-bottom: 24rpx;

    .price-main {
      display: flex;
      align-items: baseline;
      margin-bottom: 12rpx;

      .price-symbol {
        font-size: 32rpx;
        color: #F44336;
        font-weight: 600;
      }

      .price-amount {
        font-size: 56rpx;
        color: #F44336;
        font-weight: 700;
        margin: 0 8rpx;
      }

      .price-unit {
        font-size: 28rpx;
        color: #999;
      }
    }

    .price-detail {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .original-price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }

      .save-amount {
        font-size: 24rpx;
        color: #F44336;
        background-color: rgba(244, 67, 54, 0.1);
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
      }
    }
  }

  .quota-tip {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background-color: rgba(255, 159, 41, 0.1);
    padding: 16rpx;
    border-radius: 12rpx;

    &.warning {
      background-color: rgba(244, 67, 54, 0.1);

      .tip-text {
        color: #F44336;
      }
    }

    .tip-text {
      font-size: 26rpx;
      color: #FF9F29;
      font-weight: 500;
    }
  }
}

// 通用卡片样式
.section-card {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .section-title {
    display: flex;
    align-items: baseline;
    margin-bottom: 24rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .title-tip {
      font-size: 24rpx;
      color: #999;
      margin-left: 12rpx;
    }
  }
}

// 车辆信息
.vehicle-info {
  .vehicle-name {
    display: block;
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 24rpx;
  }

  .vehicle-specs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    margin-bottom: 24rpx;

    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 16rpx;
      background-color: #F8F8F8;
      border-radius: 8rpx;

      .spec-label {
        font-size: 26rpx;
        color: #999;
      }

      .spec-value {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }

  .vehicle-features {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .feature-tag {
      font-size: 24rpx;
      color: #FF9F29;
      background-color: rgba(255, 159, 41, 0.1);
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
    }
  }
}

// 行程信息
.route-detail {
  .route-item {
    display: flex;
    gap: 24rpx;

    .route-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.pickup {
        background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
      }

      &.return {
        background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
      }
    }

    .route-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .route-label {
        font-size: 24rpx;
        color: #999;
      }

      .route-value {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }

      .route-address {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .route-line {
    width: 2rpx;
    height: 40rpx;
    background-color: #E0E0E0;
    margin-left: 23rpx;
    margin: 16rpx 0 16rpx 23rpx;
  }
}

// 时间范围
.time-range {
  .time-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .time-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .time-tip {
    font-size: 24rpx;
    color: #999;
  }
}

// 套餐包含
.package-includes {
  .include-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .include-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .include-desc {
      font-size: 24rpx;
      color: #999;
      margin-left: auto;
    }
  }
}

// 预订须知
.notice-list {
  .notice-item {
    display: flex;
    gap: 12rpx;
    margin-bottom: 20rpx;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }

    .notice-number {
      font-size: 26rpx;
      color: #FF9F29;
      font-weight: 600;
      flex-shrink: 0;
    }

    .notice-text {
      flex: 1;
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 取消政策
.policy-list {
  .policy-item {
    padding: 20rpx;
    background-color: #F8F8F8;
    border-radius: 12rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .policy-condition {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-bottom: 12rpx;

      .condition-text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .policy-result {
      font-size: 26rpx;
      color: #666;
      padding-left: 26rpx;
    }
  }
}

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;

  .bar-left {
    .bar-price {
      display: flex;
      align-items: baseline;
      margin-bottom: 4rpx;

      .bar-symbol {
        font-size: 24rpx;
        color: #F44336;
        font-weight: 600;
      }

      .bar-amount {
        font-size: 40rpx;
        color: #F44336;
        font-weight: 700;
        margin-left: 4rpx;
      }
    }

    .bar-tip {
      font-size: 22rpx;
      color: #999;
    }
  }

  .bar-actions {
    display: flex;
    gap: 16rpx;

    .contact-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 20rpx 32rpx;
      background-color: #FFFFFF;
      border: 2rpx solid #FF9F29;
      color: #FF9F29;
      border-radius: 44rpx;
      font-size: 28rpx;

      &::after {
        border: none;
      }
    }

    .book-btn {
      padding: 20rpx 48rpx;
      background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
      color: #FFFFFF;
      border-radius: 44rpx;
      font-size: 28rpx;
      font-weight: 600;
      border: none;

      &::after {
        border: none;
      }
    }
  }
}
</style>
