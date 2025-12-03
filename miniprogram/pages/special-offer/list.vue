<template>
  <view class="special-offer-page">
    <!-- 顶部筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @tap="showRouteFilter">
        <text class="filter-text">{{ currentRoute || '全部路线' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view class="filter-item" @tap="showPriceFilter">
        <text class="filter-text">{{ currentPrice || '价格' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view class="filter-item" @tap="showSortFilter">
        <text class="filter-text">{{ currentSort || '综合排序' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
    </view>

    <!-- 套餐列表 -->
    <scroll-view
      class="offer-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 空状态 -->
      <view v-if="offers.length === 0 && !loading" class="empty-state">
        <u-icon name="gift" size="80" color="#DDD"></u-icon>
        <text class="empty-text">暂无特惠套餐</text>
        <text class="empty-tip">敬请期待更多优惠活动</text>
      </view>

      <!-- 套餐卡片列表 -->
      <view v-else class="offer-cards">
        <view
          v-for="offer in offers"
          :key="offer.id"
          class="offer-card"
          @tap="goToDetail(offer.id)"
        >
          <!-- 套餐图片 -->
          <view class="card-image-wrapper">
            <image
              class="card-image"
              :src="offer.vehicle.image"
              mode="aspectFill"
            ></image>
            <!-- 限量标签 -->
            <view v-if="offer.remainingQuota <= 5" class="quota-badge hot">
              仅剩{{ offer.remainingQuota }}个名额
            </view>
            <view v-else-if="offer.remainingQuota <= 10" class="quota-badge">
              剩余{{ offer.remainingQuota }}个名额
            </view>
            <!-- 特惠标签 -->
            <view class="special-tag">
              <text class="tag-text">特惠</text>
            </view>
          </view>

          <!-- 套餐信息 -->
          <view class="card-content">
            <!-- 路线标题 -->
            <view class="route-info">
              <text class="route-text">{{ offer.route.from }} → {{ offer.route.to }}</text>
              <view class="route-badge">
                <text class="badge-text">{{ offer.rentalDays }}天{{ offer.rentalDays - 1 }}晚</text>
              </view>
            </view>

            <!-- 车辆名称 -->
            <text class="vehicle-name">{{ offer.vehicle.name }}</text>

            <!-- 车辆特点 -->
            <view class="vehicle-features">
              <text class="feature-item" v-for="feature in offer.vehicle.features.slice(0, 3)" :key="feature">
                {{ feature }}
              </text>
            </view>

            <!-- 时间段信息 -->
            <view class="time-info">
              <u-icon name="calendar" size="14" color="#999"></u-icon>
              <text class="time-text">{{ formatDateRange(offer.availableTimeRange) }}</text>
            </view>

            <!-- 价格和操作 -->
            <view class="card-footer">
              <view class="price-box">
                <view class="price-main">
                  <text class="price-symbol">¥</text>
                  <text class="price-amount">{{ offer.packagePrice }}</text>
                  <text class="price-unit">/套餐</text>
                </view>
                <text class="price-original" v-if="offer.originalPrice">
                  原价¥{{ offer.originalPrice }}
                </text>
              </view>
              <view class="action-btn">
                <text class="btn-text">立即预订</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-more" v-if="loading">
        <text class="load-text">加载中...</text>
      </view>

      <!-- 没有更多 -->
      <view class="no-more" v-if="!loading && !hasMore && offers.length > 0">
        <text class="no-more-text">没有更多套餐了</text>
      </view>
    </scroll-view>

    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-popup">
        <view class="popup-header">
          <text class="popup-title">{{ filterTitle }}</text>
          <u-icon name="close" size="20" color="#666" @tap="closeFilter"></u-icon>
        </view>
        <view class="popup-content">
          <view
            v-for="item in filterOptions"
            :key="item.value"
            class="filter-option"
            :class="{ active: item.value === currentFilterValue }"
            @tap="selectFilter(item)"
          >
            <text class="option-text">{{ item.label }}</text>
            <u-icon v-if="item.value === currentFilterValue" name="checkbox-mark" size="18" color="#FF9F29"></u-icon>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 状态管理
const offers = ref<any[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const hasMore = ref(true);
const page = ref(1);

// 筛选状态
const currentRoute = ref('');
const currentPrice = ref('');
const currentSort = ref('');
const filterPopup = ref<any>(null);
const filterTitle = ref('');
const filterOptions = ref<any[]>([]);
const currentFilterValue = ref('');
const currentFilterType = ref('');

// 页面加载
onLoad(() => {
  loadOffers();
});

// 加载套餐列表
const loadOffers = async (isRefresh = false) => {
  if (loading.value && !isRefresh) return;

  try {
    loading.value = true;

    // Mock数据
    const mockOffers = [
      {
        id: '1',
        route: {
          from: '杭州',
          to: '千岛湖'
        },
        vehicle: {
          name: '依维柯欧胜C型房车',
          image: 'https://picsum.photos/350/200?random=1',
          features: ['自动挡', '4-6人', '独立卫浴', '太阳能']
        },
        packagePrice: 1280,
        originalPrice: 1680,
        rentalDays: 3,
        availableTimeRange: {
          start: '2025-12-01',
          end: '2025-12-31'
        },
        remainingQuota: 3,
        totalQuota: 10
      },
      {
        id: '2',
        route: {
          from: '上海',
          to: '舟山'
        },
        vehicle: {
          name: '大通V90 B型房车',
          image: 'https://picsum.photos/350/200?random=2',
          features: ['自动挡', '2-4人', '升顶设计', '智能系统']
        },
        packagePrice: 980,
        originalPrice: 1380,
        rentalDays: 2,
        availableTimeRange: {
          start: '2025-12-05',
          end: '2025-12-25'
        },
        remainingQuota: 8,
        totalQuota: 15
      },
      {
        id: '3',
        route: {
          from: '南京',
          to: '黄山'
        },
        vehicle: {
          name: '福特全顺C型房车',
          image: 'https://picsum.photos/350/200?random=3',
          features: ['手自一体', '4-6人', '大额头床', '驻车空调']
        },
        packagePrice: 1580,
        originalPrice: 2080,
        rentalDays: 4,
        availableTimeRange: {
          start: '2025-12-10',
          end: '2026-01-10'
        },
        remainingQuota: 12,
        totalQuota: 20
      },
      {
        id: '4',
        route: {
          from: '杭州',
          to: '莫干山'
        },
        vehicle: {
          name: '奔驰斯宾特B型房车',
          image: 'https://picsum.photos/350/200?random=4',
          features: ['自动挡', '2-4人', '豪华内饰', '智能驾驶']
        },
        packagePrice: 2280,
        originalPrice: 2980,
        rentalDays: 2,
        availableTimeRange: {
          start: '2025-12-01',
          end: '2025-12-20'
        },
        remainingQuota: 5,
        totalQuota: 8
      }
    ];

    if (isRefresh) {
      offers.value = mockOffers;
      page.value = 1;
      hasMore.value = true;
    } else {
      offers.value.push(...mockOffers);
      hasMore.value = false; // Mock数据只有一页
    }

  } catch (error) {
    console.error('加载套餐列表失败:', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true;
  loadOffers(true);
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadOffers();
  }
};

// 格式化日期范围
const formatDateRange = (range: any) => {
  const start = new Date(range.start);
  const end = new Date(range.end);
  return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
};

// 显示路线筛选
const showRouteFilter = () => {
  filterTitle.value = '选择路线';
  currentFilterType.value = 'route';
  currentFilterValue.value = currentRoute.value;
  filterOptions.value = [
    { label: '全部路线', value: '' },
    { label: '杭州出发', value: 'hangzhou' },
    { label: '上海出发', value: 'shanghai' },
    { label: '南京出发', value: 'nanjing' },
    { label: '苏州出发', value: 'suzhou' }
  ];
  filterPopup.value?.open();
};

// 显示价格筛选
const showPriceFilter = () => {
  filterTitle.value = '价格区间';
  currentFilterType.value = 'price';
  currentFilterValue.value = currentPrice.value;
  filterOptions.value = [
    { label: '全部价格', value: '' },
    { label: '1000元以下', value: '0-1000' },
    { label: '1000-1500元', value: '1000-1500' },
    { label: '1500-2000元', value: '1500-2000' },
    { label: '2000元以上', value: '2000-' }
  ];
  filterPopup.value?.open();
};

// 显示排序筛选
const showSortFilter = () => {
  filterTitle.value = '排序方式';
  currentFilterType.value = 'sort';
  currentFilterValue.value = currentSort.value;
  filterOptions.value = [
    { label: '综合排序', value: '' },
    { label: '价格从低到高', value: 'price-asc' },
    { label: '价格从高到低', value: 'price-desc' },
    { label: '剩余名额', value: 'quota' }
  ];
  filterPopup.value?.open();
};

// 选择筛选项
const selectFilter = (item: any) => {
  currentFilterValue.value = item.value;

  if (currentFilterType.value === 'route') {
    currentRoute.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'price') {
    currentPrice.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'sort') {
    currentSort.value = item.value ? item.label : '';
  }

  closeFilter();
  // 重新加载数据
  loadOffers(true);
};

// 关闭筛选弹窗
const closeFilter = () => {
  filterPopup.value?.close();
};

// 跳转到详情页
const goToDetail = (offerId: string) => {
  uni.navigateTo({
    url: `/pages/special-offer/detail?id=${offerId}`
  });
};
</script>

<style scoped lang="scss">
.special-offer-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
}

// 筛选栏
.filter-bar {
  background-color: #FFFFFF;
  display: flex;
  padding: 24rpx 32rpx;
  gap: 48rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .filter-text {
    font-size: 28rpx;
    color: #333;
  }
}

// 套餐列表
.offer-list {
  flex: 1;
  padding: 24rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 32rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 16rpx;
  }

  .empty-tip {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.4);
  }
}

// 套餐卡片
.offer-cards {
  .offer-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

    .card-image-wrapper {
      position: relative;
      width: 100%;
      height: 350rpx;

      .card-image {
        width: 100%;
        height: 100%;
      }

      // 限量标签
      .quota-badge {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        background-color: rgba(255, 159, 41, 0.9);
        color: #FFFFFF;
        font-size: 22rpx;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;

        &.hot {
          background-color: rgba(244, 67, 54, 0.9);
          animation: pulse 1.5s ease-in-out infinite;
        }
      }

      // 特惠标签
      .special-tag {
        position: absolute;
        top: 24rpx;
        left: 0;
        background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
        color: #FFFFFF;
        padding: 8rpx 24rpx 8rpx 16rpx;
        border-radius: 0 20rpx 20rpx 0;

        .tag-text {
          font-size: 24rpx;
          font-weight: 600;
        }
      }
    }

    .card-content {
      padding: 24rpx;

      // 路线信息
      .route-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .route-text {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .route-badge {
          background-color: rgba(75, 145, 255, 0.1);
          color: #4B91FF;
          font-size: 22rpx;
          padding: 6rpx 12rpx;
          border-radius: 8rpx;

          .badge-text {
            font-weight: 500;
          }
        }
      }

      // 车辆名称
      .vehicle-name {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 16rpx;
      }

      // 车辆特点
      .vehicle-features {
        display: flex;
        gap: 12rpx;
        margin-bottom: 16rpx;
        flex-wrap: wrap;

        .feature-item {
          font-size: 22rpx;
          color: #999;
          background-color: #F8F8F8;
          padding: 6rpx 12rpx;
          border-radius: 6rpx;
        }
      }

      // 时间信息
      .time-info {
        display: flex;
        align-items: center;
        gap: 8rpx;
        margin-bottom: 24rpx;

        .time-text {
          font-size: 24rpx;
          color: #999;
        }
      }

      // 底部价格和操作
      .card-footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        .price-box {
          .price-main {
            display: flex;
            align-items: baseline;
            margin-bottom: 8rpx;

            .price-symbol {
              font-size: 28rpx;
              color: #F44336;
              font-weight: 600;
            }

            .price-amount {
              font-size: 48rpx;
              color: #F44336;
              font-weight: 700;
              margin: 0 4rpx;
            }

            .price-unit {
              font-size: 24rpx;
              color: #999;
            }
          }

          .price-original {
            font-size: 22rpx;
            color: #999;
            text-decoration: line-through;
          }
        }

        .action-btn {
          background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
          color: #FFFFFF;
          padding: 20rpx 48rpx;
          border-radius: 44rpx;

          .btn-text {
            font-size: 28rpx;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 加载状态
.load-more {
  text-align: center;
  padding: 32rpx 0;

  .load-text {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.6);
  }
}

// 没有更多
.no-more {
  text-align: center;
  padding: 32rpx 0;

  .no-more-text {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.4);
  }
}

// 筛选弹窗
.filter-popup {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 2rpx solid #F0F0F0;

    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .popup-content {
    max-height: 600rpx;
    overflow-y: auto;

    .filter-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      border-bottom: 2rpx solid #F8F8F8;

      &:last-child {
        border-bottom: none;
      }

      .option-text {
        font-size: 28rpx;
        color: #333;
      }

      &.active {
        .option-text {
          color: #FF9F29;
          font-weight: 500;
        }
      }
    }
  }
}

// 脉冲动画
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
