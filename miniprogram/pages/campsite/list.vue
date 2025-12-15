<template>
  <view class="campsite-list-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: currentDistance }"
        @click="showDistanceFilter"
      >
        <text>{{ currentDistance || '距离' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view
        class="filter-item"
        :class="{ active: currentPrice }"
        @click="showPriceFilter"
      >
        <text>{{ currentPrice || '价格' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view
        class="filter-item"
        :class="{ active: currentType }"
        @click="showTypeFilter"
      >
        <text>{{ currentType || '类型' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
    </view>

    <!-- 营地列表 -->
    <scroll-view
      class="campsite-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 空状态 -->
      <view v-if="campsites.length === 0 && !loading" class="empty-state">
        <u-icon name="map" size="80" color="#DDD"></u-icon>
        <text class="empty-text">暂无营地信息</text>
        <text class="empty-tip">敬请期待更多营地</text>
      </view>

      <!-- 营地卡片 -->
      <view v-else>
        <view
          class="campsite-card"
          v-for="item in campsites"
          :key="item.id"
          @click="viewDetail(item)"
        >
          <image class="campsite-image" :src="item.image" mode="aspectFill"></image>

          <!-- 热门标签 -->
          <view v-if="item.isHot" class="hot-badge">
            <text class="hot-text">热门</text>
          </view>

          <view class="campsite-info">
            <text class="campsite-name">{{ item.name }}</text>

            <view class="campsite-tags">
              <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
            </view>

            <view class="campsite-meta">
              <view class="rating">
                <u-icon name="star-fill" size="14" color="#FF9F29"></u-icon>
                <text class="rating-text">{{ item.rating }}</text>
                <text class="review-count">({{ item.reviewCount }}条评价)</text>
              </view>
            </view>

            <view class="location-info">
              <u-icon name="map" size="14" color="#999"></u-icon>
              <text class="distance">距离{{ item.distance }}km</text>
            </view>

            <view class="price-box">
              <view class="price-main">
                <text class="price">¥{{ item.price }}</text>
                <text class="unit">/晚起</text>
              </view>
              <view class="site-count">
                <text class="count-text">剩余{{ item.availableSites }}个营位</text>
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
      <view class="no-more" v-if="!loading && !hasMore && campsites.length > 0">
        <text class="no-more-text">没有更多营地了</text>
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
            <u-icon
              v-if="item.value === currentFilterValue"
              name="checkbox-mark"
              size="18"
              color="#FF9F29"
            ></u-icon>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

// 状态管理
const campsites = ref<any[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const hasMore = ref(true);
const page = ref(1);

// 筛选状态
const currentDistance = ref('');
const currentPrice = ref('');
const currentType = ref('');
const filterPopup = ref<any>(null);
const filterTitle = ref('');
const filterOptions = ref<any[]>([]);
const currentFilterValue = ref('');
const currentFilterType = ref('');

// 页面加载
onMounted(() => {
  loadCampsites();
});

// 加载营地列表
const loadCampsites = async (isRefresh = false) => {
  if (loading.value && !isRefresh) return;

  try {
    loading.value = true;

    // Mock数据 - 扩展到6个营地
    const mockCampsites = [
      {
        id: '1',
        name: '千岛湖房车营地',
        image: 'https://placehold.co/350x200/8BC34A/FFFFFF?text=%E8%90%A5%E5%9C%B01',
        tags: ['湖景', '烧烤', 'WiFi'],
        rating: 4.8,
        reviewCount: 156,
        distance: 5.2,
        price: 280,
        availableSites: 8,
        isHot: true
      },
      {
        id: '2',
        name: '莫干山森林营地',
        image: 'https://placehold.co/350x200/4CAF50/FFFFFF?text=%E8%90%A5%E5%9C%B02',
        tags: ['山景', '徒步', '儿童乐园'],
        rating: 4.9,
        reviewCount: 203,
        distance: 12.8,
        price: 350,
        availableSites: 5,
        isHot: true
      },
      {
        id: '3',
        name: '海宁海滨营地',
        image: 'https://placehold.co/350x200/03A9F4/FFFFFF?text=%E8%90%A5%E5%9C%B03',
        tags: ['海景', '沙滩', '观潮'],
        rating: 4.7,
        reviewCount: 89,
        distance: 35.6,
        price: 320,
        availableSites: 12,
        isHot: false
      },
      {
        id: '4',
        name: '西湖山谷营地',
        image: 'https://placehold.co/350x200/009688/FFFFFF?text=%E8%90%A5%E5%9C%B04',
        tags: ['山谷', '溪流', '垂钓'],
        rating: 4.6,
        reviewCount: 67,
        distance: 8.5,
        price: 260,
        availableSites: 15,
        isHot: false
      },
      {
        id: '5',
        name: '天目山生态营地',
        image: 'https://placehold.co/350x200/9C27B0/FFFFFF?text=%E8%90%A5%E5%9C%B05',
        tags: ['生态', '温泉', '观星'],
        rating: 4.9,
        reviewCount: 178,
        distance: 45.3,
        price: 420,
        availableSites: 6,
        isHot: true
      },
      {
        id: '6',
        name: '富春江畔营地',
        image: 'https://placehold.co/350x200/FF9800/FFFFFF?text=%E8%90%A5%E5%9C%B06',
        tags: ['江景', '骑行', '露营'],
        rating: 4.5,
        reviewCount: 92,
        distance: 28.7,
        price: 300,
        availableSites: 10,
        isHot: false
      }
    ];

    if (isRefresh) {
      campsites.value = mockCampsites;
      page.value = 1;
      hasMore.value = false; // Mock数据只有一页
    } else {
      campsites.value.push(...mockCampsites);
      hasMore.value = false;
    }

  } catch (error) {
    console.error('加载营地列表失败:', error);
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
  loadCampsites(true);
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadCampsites();
  }
};

// 显示距离筛选
const showDistanceFilter = () => {
  filterTitle.value = '选择距离';
  currentFilterType.value = 'distance';
  currentFilterValue.value = currentDistance.value;
  filterOptions.value = [
    { label: '不限', value: '' },
    { label: '5km以内', value: '0-5' },
    { label: '5-10km', value: '5-10' },
    { label: '10-20km', value: '10-20' },
    { label: '20km以上', value: '20-' }
  ];
  filterPopup.value?.open();
};

// 显示价格筛选
const showPriceFilter = () => {
  filterTitle.value = '价格区间';
  currentFilterType.value = 'price';
  currentFilterValue.value = currentPrice.value;
  filterOptions.value = [
    { label: '不限', value: '' },
    { label: '200元以下', value: '0-200' },
    { label: '200-300元', value: '200-300' },
    { label: '300-400元', value: '300-400' },
    { label: '400元以上', value: '400-' }
  ];
  filterPopup.value?.open();
};

// 显示类型筛选
const showTypeFilter = () => {
  filterTitle.value = '营地类型';
  currentFilterType.value = 'type';
  currentFilterValue.value = currentType.value;
  filterOptions.value = [
    { label: '不限', value: '' },
    { label: '湖景营地', value: 'lake' },
    { label: '山景营地', value: 'mountain' },
    { label: '海景营地', value: 'sea' },
    { label: '森林营地', value: 'forest' }
  ];
  filterPopup.value?.open();
};

// 选择筛选项
const selectFilter = (item: any) => {
  currentFilterValue.value = item.value;

  if (currentFilterType.value === 'distance') {
    currentDistance.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'price') {
    currentPrice.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'type') {
    currentType.value = item.value ? item.label : '';
  }

  closeFilter();
  // 重新加载数据
  loadCampsites(true);
};

// 关闭筛选弹窗
const closeFilter = () => {
  filterPopup.value?.close();
};

// 查看详情
const viewDetail = (item: any) => {
  uni.navigateTo({
    url: `/pages/campsite/detail?id=${item.id}`
  });
};
</script>

<style scoped lang="scss">
.campsite-list-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
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
  font-size: 28rpx;
  color: #333;

  &.active {
    color: #FF9F29;
  }
}

// 营地列表
.campsite-list {
  flex: 1;
  padding: 24rpx;
  width: 100%;
  box-sizing: border-box;
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
  }
}

// 营地卡片
.campsite-card {
  position: relative;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.campsite-image {
  width: 100%;
  height: 350rpx;
}

// 热门标签
.hot-badge {
  position: absolute;
  top: 24rpx;
  left: 0;
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  padding: 8rpx 24rpx 8rpx 16rpx;
  border-radius: 0 20rpx 20rpx 0;

  .hot-text {
    font-size: 22rpx;
    font-weight: 600;
  }
}

.campsite-info {
  padding: 24rpx;
}

.campsite-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.campsite-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 6rpx 12rpx;
  background-color: rgba(255, 159, 41, 0.1);
  color: #FF9F29;
  font-size: 22rpx;
  border-radius: 6rpx;
}

.campsite-meta {
  margin-bottom: 12rpx;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4rpx;

  .rating-text {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
  }

  .review-count {
    font-size: 24rpx;
    color: #999;
    margin-left: 8rpx;
  }
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;

  .distance {
    font-size: 24rpx;
    color: #999;
  }
}

.price-box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .price-main {
    display: flex;
    align-items: baseline;

    .price {
      font-size: 36rpx;
      font-weight: bold;
      color: #F44336;
    }

    .unit {
      font-size: 24rpx;
      color: #999;
      margin-left: 4rpx;
    }
  }

  .site-count {
    .count-text {
      font-size: 24rpx;
      color: #67C23A;
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
</style>
