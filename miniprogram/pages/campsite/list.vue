<template>
  <view class="campsite-list-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @click="showDistanceFilter">
        <text>距离</text>
        <uni-icons type="arrowdown" size="12" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @click="showPriceFilter">
        <text>价格</text>
        <uni-icons type="arrowdown" size="12" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @click="showTypeFilter">
        <text>类型</text>
        <uni-icons type="arrowdown" size="12" color="#666"></uni-icons>
      </view>
    </view>

    <!-- 营地列表 -->
    <scroll-view class="campsite-list" scroll-y>
      <view class="campsite-card" v-for="item in campsites" :key="item.id" @click="viewDetail(item)">
        <image class="campsite-image" :src="item.image" mode="aspectFill"></image>
        <view class="campsite-info">
          <text class="campsite-name">{{ item.name }}</text>
          <view class="campsite-tags">
            <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="campsite-meta">
            <view class="rating">
              <uni-icons type="star-filled" size="14" color="#FF9F29"></uni-icons>
              <text>{{ item.rating }}</text>
            </view>
            <text class="distance">{{ item.distance }}km</text>
          </view>
          <view class="price-box">
            <text class="price">¥{{ item.price }}</text>
            <text class="unit">/晚起</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const campsites = ref([
  {
    id: '1',
    name: '千岛湖房车营地',
    image: 'https://picsum.photos/350/200?random=1',
    tags: ['湖景', '烧烤', 'WiFi'],
    rating: 4.8,
    distance: 5.2,
    price: 280
  },
  {
    id: '2',
    name: '莫干山森林营地',
    image: 'https://picsum.photos/350/200?random=2',
    tags: ['山景', '徒步', '儿童乐园'],
    rating: 4.9,
    distance: 12.8,
    price: 350
  },
  {
    id: '3',
    name: '海宁海滨营地',
    image: 'https://picsum.photos/350/200?random=3',
    tags: ['海景', '沙滩', '观潮'],
    rating: 4.7,  
    distance: 35.6,
    price: 320
  }
]);

const showDistanceFilter = () => {
  // 实际项目中这里应该打开筛选弹窗
};

const showPriceFilter = () => {
  // 实际项目中这里应该打开筛选弹窗
};

const showTypeFilter = () => {
  // 实际项目中这里应该打开筛选弹窗
};

const viewDetail = (item: any) => {
  uni.navigateTo({ url: `/pages/campsite/detail?id=${item.id}` });
};
</script>

<style scoped lang="scss">
.campsite-list-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  background-color: #FFFFFF;
  display: flex;
  padding: 16rpx 32rpx;
  gap: 48rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.campsite-list {
  flex: 1;
  padding: 24rpx;
}

.campsite-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.campsite-image {
  width: 100%;
  height: 350rpx;
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
}

.tag {
  padding: 4rpx 12rpx;
  background-color: rgba(255, 159, 41, 0.1);
  color: #FF9F29;
  font-size: 22rpx;
  border-radius: 4rpx;
}

.campsite-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 26rpx;
  color: #666;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.price-box {
  display: flex;
  align-items: baseline;
}

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
</style>
