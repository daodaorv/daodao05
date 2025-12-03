<template>
  <view class="campsite-detail">
    <!-- 图片轮播 -->
    <swiper v-if="campsiteDetail.images && campsiteDetail.images.length > 0" class="image-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
      <swiper-item v-for="(image, index) in campsiteDetail.images" :key="index">
        <image class="swiper-image" :src="image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 营地基本信息 -->
    <view class="campsite-info-section">
      <view class="name-header">
        <text class="campsite-name">{{ campsiteDetail.name }}</text>
        <view v-if="campsiteDetail.isHot" class="hot-badge">
          <text class="badge-text">热门</text>
        </view>
      </view>

      <!-- 评分信息 -->
      <view class="rating-section">
        <view class="rating-main">
          <u-icon name="star-fill" size="18" color="#FF9F29"></u-icon>
          <text class="rating-score">{{ campsiteDetail.rating }}</text>
          <text class="rating-count">({{ campsiteDetail.reviewCount }}条评价)</text>
        </view>
      </view>

      <!-- 位置信息 -->
      <view class="location-section">
        <u-icon name="location" size="16" color="#FF9F29"></u-icon>
        <text class="location-text">{{ campsiteDetail.address }}</text>
        <text class="distance-text">距离{{ campsiteDetail.distance }}km</text>
      </view>

      <!-- 价格信息 -->
      <view class="price-section">
        <view class="price-main">
          <text class="price-symbol">¥</text>
          <text class="price-amount">{{ campsiteDetail.minPrice }}</text>
          <text class="price-unit">/晚起</text>
        </view>
      </view>
    </view>

    <!-- 营地特色标签 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地特色</text>
      </view>
      <view class="feature-tags">
        <view class="feature-tag" v-for="feature in (campsiteDetail.features || [])" :key="feature">
          <u-icon name="checkbox-mark" size="16" color="#67C23A"></u-icon>
          <text class="feature-text">{{ feature }}</text>
        </view>
      </view>
    </view>

    <!-- 营地设施 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地设施</text>
      </view>
      <view class="facility-grid">
        <view class="facility-item" v-for="facility in (campsiteDetail.facilities || [])" :key="facility.name">
          <u-icon :name="facility.icon" size="24" color="#FF9F29"></u-icon>
          <text class="facility-name">{{ facility.name }}</text>
        </view>
      </view>
    </view>

    <!-- 营位类型 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营位类型</text>
      </view>
      <view class="site-types">
        <view class="site-type-card" v-for="siteType in (campsiteDetail.siteTypes || [])" :key="siteType.id">
          <view class="site-type-header">
            <text class="site-type-name">{{ siteType.name }}</text>
            <view class="site-type-badge" :class="{ unavailable: siteType.available === 0 }">
              <text class="badge-text">{{ siteType.available > 0 ? `剩余${siteType.available}个` : '已满' }}</text>
            </view>
          </view>
          <text class="site-type-desc">{{ siteType.description }}</text>
          <view class="site-type-specs">
            <text class="spec-item">面积：{{ siteType.area }}㎡</text>
            <text class="spec-item">容纳：{{ siteType.capacity }}人</text>
          </view>
          <view class="site-type-footer">
            <view class="site-price">
              <text class="price-amount">¥{{ siteType.price }}</text>
              <text class="price-unit">/晚</text>
            </view>
            <button
              class="book-btn"
              :class="{ disabled: siteType.available === 0 }"
              :disabled="siteType.available === 0"
              @tap="bookSite(siteType)"
            >
              {{ siteType.available > 0 ? '立即预订' : '已满' }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 营地介绍 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地介绍</text>
      </view>
      <text class="description-text">{{ campsiteDetail.description }}</text>
    </view>

    <!-- 入住须知 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">入住须知</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in (campsiteDetail.checkInNotices || [])" :key="index">
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
        <view class="policy-item" v-for="policy in (campsiteDetail.cancellationPolicy || [])" :key="policy.condition">
          <view class="policy-condition">
            <u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
            <text class="condition-text">{{ policy.condition }}</text>
          </view>
          <text class="policy-result">{{ policy.result }}</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">用户评价</text>
        <text class="title-count">({{ campsiteDetail.reviewCount }}条)</text>
      </view>
      <view class="review-list">
        <view class="review-item" v-for="review in (campsiteDetail.reviews || [])" :key="review.id">
          <view class="review-header">
            <image class="user-avatar" :src="review.userAvatar" mode="aspectFill"></image>
            <view class="user-info">
              <text class="user-name">{{ review.userName }}</text>
              <view class="review-rating">
                <u-icon
                  v-for="star in 5"
                  :key="star"
                  name="star-fill"
                  size="12"
                  :color="star <= review.rating ? '#FF9F29' : '#E0E0E0'"
                ></u-icon>
              </view>
            </view>
            <text class="review-date">{{ formatDate(review.createdAt) }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <view v-if="review.images && review.images.length > 0" class="review-images">
            <image
              v-for="(img, idx) in review.images"
              :key="idx"
              class="review-image"
              :src="img"
              mode="aspectFill"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-price">
          <text class="bar-symbol">¥</text>
          <text class="bar-amount">{{ campsiteDetail.minPrice }}</text>
        </view>
        <text class="bar-tip">/晚起</text>
      </view>
      <view class="bar-actions">
        <button class="contact-btn" @tap="contactService">
          <u-icon name="chat" size="18" color="#FF9F29"></u-icon>
          <text>咨询</text>
        </button>
        <button class="book-btn" @tap="showBookingOptions">
          立即预订
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 获取路由参数
const campsiteId = ref('');

onLoad((options: any) => {
  campsiteId.value = options.id || '';
  loadCampsiteDetail();
});

// 营地详情数据
const campsiteDetail = ref<any>({
  id: '',
  name: '加载中...',
  images: [],
  rating: 0,
  reviewCount: 0,
  address: '',
  distance: 0,
  minPrice: 0,
  isHot: false,
  features: [],
  facilities: [],
  siteTypes: [],
  description: '',
  checkInNotices: [],
  cancellationPolicy: [],
  reviews: []
});

// 加载营地详情
const loadCampsiteDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' });

    // Mock数据
    const mockDetail = {
      id: campsiteId.value,
      name: '千岛湖房车营地',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=750&h=500&fit=crop',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=750&h=500&fit=crop',
        'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=750&h=500&fit=crop',
        'https://images.unsplash.com/photo-1537565732299-5b5e9cdf2f87?w=750&h=500&fit=crop'
      ],
      rating: 4.8,
      reviewCount: 156,
      address: '浙江省杭州市淳安县千岛湖镇环湖路88号',
      distance: 5.2,
      minPrice: 280,
      isHot: true,
      features: ['湖景', '烧烤区', 'WiFi覆盖', '24小时热水', '儿童乐园', '宠物友好'],
      facilities: [
        { name: '淋浴间', icon: 'fire' },
        { name: '卫生间', icon: 'home' },
        { name: '洗衣房', icon: 'gear' },
        { name: '充电桩', icon: 'bolt' },
        { name: '烧烤区', icon: 'fire-filled' },
        { name: '停车场', icon: 'navigate' },
        { name: '便利店', icon: 'shop' },
        { name: 'WiFi', icon: 'wifi' }
      ],
      siteTypes: [
        {
          id: '1',
          name: '标准营位',
          description: '适合小型房车或帐篷，配备基础设施',
          area: 50,
          capacity: 4,
          price: 280,
          available: 8
        },
        {
          id: '2',
          name: '豪华营位A',
          description: '湖景位置，配备独立水电，适合中大型房车',
          area: 80,
          capacity: 6,
          price: 380,
          available: 3
        },
        {
          id: '3',
          name: '豪华营位B',
          description: '一线湖景，配备独立卫浴，超大空间',
          area: 120,
          capacity: 8,
          price: 580,
          available: 0
        }
      ],
      description: '千岛湖房车营地位于风景秀丽的千岛湖畔，占地面积约50亩，是华东地区首屈一指的高端房车营地。营地依山傍水，环境优美，设施完善，为房车爱好者提供了一个理想的休闲度假场所。\n\n营地配备了现代化的水电设施、24小时热水淋浴、独立卫生间、洗衣房等基础设施。同时还设有烧烤区、儿童游乐场、湖边观景台等休闲娱乐设施。营地全区域覆盖WiFi，让您在享受大自然的同时也能保持与外界的联系。',
      checkInNotices: [
        '入住时间：14:00后，退房时间：12:00前',
        '请携带有效身份证件办理入住手续',
        '营地内禁止明火，烧烤请在指定区域进行',
        '请保持营地环境卫生，垃圾分类投放',
        '夜间22:00后请保持安静，避免影响他人休息',
        '宠物需牵绳，并清理宠物粪便',
        '车辆限速5km/h，注意行人安全'
      ],
      cancellationPolicy: [
        { condition: '入住前3天以上取消', result: '全额退款' },
        { condition: '入住前1-3天取消', result: '退款50%' },
        { condition: '入住当天取消', result: '不予退款' }
      ],
      reviews: [
        {
          id: '1',
          userName: '房车旅行家',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          rating: 5,
          content: '营地环境非常好，设施齐全，工作人员服务态度很好。湖景位置视野开阔，晚上可以看星星。强烈推荐！',
          images: [
            'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=150&fit=crop'
          ],
          createdAt: '2025-11-25'
        },
        {
          id: '2',
          userName: '自驾游爱好者',
          userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
          rating: 4,
          content: '整体不错，就是周末人比较多。建议工作日来会更安静一些。',
          images: [],
          createdAt: '2025-11-20'
        }
      ]
    };

    campsiteDetail.value = mockDetail;

  } catch (error) {
    console.error('加载营地详情失败:', error);
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
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 联系客服
const contactService = () => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567'
  });
};

// 预订营位
const bookSite = (siteType: any) => {
  if (siteType.available === 0) {
    uni.showToast({
      title: '该营位已满',
      icon: 'none'
    });
    return;
  }

  // 跳转到预订页面
  uni.navigateTo({
    url: `/pages/campsite/booking?campsiteId=${campsiteId.value}&siteTypeId=${siteType.id}`
  });
};

// 显示预订选项
const showBookingOptions = () => {
  // 如果只有一个可用营位类型，直接跳转
  const availableTypes = campsiteDetail.value.siteTypes.filter((t: any) => t.available > 0);

  if (availableTypes.length === 0) {
    uni.showToast({
      title: '暂无可用营位',
      icon: 'none'
    });
    return;
  }

  if (availableTypes.length === 1) {
    bookSite(availableTypes[0]);
  } else {
    // 滚动到营位类型区域
    uni.showToast({
      title: '请选择营位类型',
      icon: 'none'
    });
  }
};
</script>

<style scoped lang="scss">
.campsite-detail {
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

// 营地基本信息
.campsite-info-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .name-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;

    .campsite-name {
      font-size: 36rpx;
      font-weight: 700;
      color: #333;
    }

    .hot-badge {
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

  .rating-section {
    margin-bottom: 16rpx;

    .rating-main {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .rating-score {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }

      .rating-count {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .location-section {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 24rpx;

    .location-text {
      flex: 1;
      font-size: 26rpx;
      color: #666;
    }

    .distance-text {
      font-size: 24rpx;
      color: #999;
    }
  }

  .price-section {
    .price-main {
      display: flex;
      align-items: baseline;

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

    .title-count {
      font-size: 24rpx;
      color: #999;
      margin-left: 12rpx;
    }
  }
}

// 特色标签
.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .feature-tag {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background-color: rgba(103, 194, 58, 0.1);
    padding: 12rpx 20rpx;
    border-radius: 8rpx;

    .feature-text {
      font-size: 26rpx;
      color: #67C23A;
      font-weight: 500;
    }
  }
}

// 设施网格
.facility-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32rpx;

  .facility-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .facility-name {
      font-size: 24rpx;
      color: #666;
      text-align: center;
    }
  }
}

// 营位类型
.site-types {
  .site-type-card {
    background-color: #F8F8F8;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .site-type-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .site-type-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }

      .site-type-badge {
        background-color: rgba(103, 194, 58, 0.1);
        color: #67C23A;
        font-size: 22rpx;
        padding: 6rpx 12rpx;
        border-radius: 8rpx;

        &.unavailable {
          background-color: rgba(0, 0, 0, 0.1);
          color: #999;
        }
      }
    }

    .site-type-desc {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
      display: block;
    }

    .site-type-specs {
      display: flex;
      gap: 24rpx;
      margin-bottom: 20rpx;

      .spec-item {
        font-size: 24rpx;
        color: #999;
      }
    }

    .site-type-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .site-price {
        display: flex;
        align-items: baseline;

        .price-amount {
          font-size: 36rpx;
          font-weight: 700;
          color: #F44336;
        }

        .price-unit {
          font-size: 24rpx;
          color: #999;
          margin-left: 4rpx;
        }
      }

      .book-btn {
        padding: 16rpx 32rpx;
        background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
        color: #FFFFFF;
        border-radius: 44rpx;
        font-size: 26rpx;
        border: none;

        &::after {
          border: none;
        }

        &.disabled {
          background: #E0E0E0;
          color: #999;
        }
      }
    }
  }
}

// 营地介绍
.description-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
}

// 入住须知
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

// 用户评价
.review-list {
  .review-item {
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;
    border-bottom: 2rpx solid #F0F0F0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 16rpx;

      .user-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
      }

      .user-info {
        flex: 1;

        .user-name {
          display: block;
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }

        .review-rating {
          display: flex;
          gap: 4rpx;
        }
      }

      .review-date {
        font-size: 24rpx;
        color: #999;
      }
    }

    .review-content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16rpx;
      display: block;
    }

    .review-images {
      display: flex;
      gap: 12rpx;

      .review-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 8rpx;
      }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .bar-left {
    display: flex;
    align-items: baseline;
    
    .bar-price {
      display: flex;
      align-items: baseline;
      
      .bar-symbol {
        font-size: 28rpx;
        color: #F44336;
        font-weight: 600;
      }
      
      .bar-amount {
        font-size: 44rpx;
        color: #F44336;
        font-weight: 700;
        margin: 0 4rpx;
      }
    }
    
    .bar-tip {
      font-size: 24rpx;
      color: #999;
      margin-left: 4rpx;
    }
  }

  .bar-actions {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .contact-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: none;
      padding: 0 16rpx;
      line-height: 1.2;

      &::after { border: none; }

      text {
        font-size: 20rpx;
        color: #666;
        margin-top: 4rpx;
      }
    }

    .book-btn {
      background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
      color: #FFFFFF;
      font-size: 26rpx;
      font-weight: 600;
      padding: 0 40rpx;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: 34rpx;
      margin: 0;

      &::after { border: none; }

      &:active { opacity: 0.9; }
    }
  }
}
</style>
