<template>
  <view class="tour-list-page">
    <!-- 筛选 -->
    <view class="filter-bar">
      <view class="filter-item" v-for="(item, index) in filters" :key="index" :class="{ active: currentFilter === index }" @click="currentFilter = index">
        {{ item }}
      </view>
    </view>

    <!-- 路线列表 -->
    <scroll-view class="tour-list" scroll-y>
      <view class="tour-card" v-for="item in tours" :key="item.id" @click="viewDetail(item)">
        <image class="tour-image" :src="item.image" mode="aspectFill"></image>
        <view class="tour-badge" :class="item.status">{{ getStatusText(item.status) }}</view>
        <view class="tour-info">
          <text class="tour-title">{{ item.title }}</text>
          <view class="tour-details">
            <text class="detail-item">{{ item.days }}天{{ item.days - 1 }}晚</text>
            <text class="detail-item">{{ item.minPeople }}-{{ item.maxPeople }}人成团</text>
          </view>
          <view class="price-row">
            <view class="price-box">
              <text class="price">¥{{ item.price }}</text>
              <text class="unit">/人</text>
            </view>
            <text class="availability">剩余{{ item.available }}名额</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const filters = ['全部', '招募中', '已成团', '即将出发'];
const currentFilter = ref(0);

const tours = ref([
  {
    id: '1',
    title: '川西小环线7日游',
    image: 'https://picsum.photos/700/400?random=10',
    days: 7,
    minPeople: 3,
    maxPeople: 10,
    price: 5999,
    status: 'recruiting',
    available: 3
  },
  {
    id: '2',
    title: '新疆独库公路10日游',
    image: 'https://picsum.photos/700/400?random=11',
    days: 10,
    minPeople: 5,
    maxPeople: 12,
    price: 8999,
    status: 'confirmed',
    available: 2
  },
  {
    id: '3',
    title: '环青海湖5日游',
    image: 'https://picsum.photos/700/400?random=12',
    days: 5,
    minPeople: 3,
    maxPeople: 8,
    price: 3999,
    status: 'recruiting',
    available: 6
  }
]);

const getStatusText = (status: string) => {
  const map: any = {
    recruiting: '招募中',
    confirmed: '已成团',
    departed: '已出发',
    completed: '已结束'
  };
  return map[status] || status;
};

const viewDetail = (item: any) => {
  uni.navigateTo({ url: `/pages/tour/detail?id=${item.id}` });
};
</script>

<style scoped lang="scss">
.tour-list-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  background-color: #FFFFFF;
  display: flex;
  padding: 16rpx 32rpx;
  gap: 32rpx;
  overflow-x: auto;
}

.filter-item {
  font-size: 28rpx;
  color: #666;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  white-space: nowrap;
  
  &.active {
    background-color: rgba(255, 159, 41, 0.1);
    color: #FF9F29;
    font-weight: bold;
  }
}

.tour-list {
  flex: 1;
  padding: 24rpx;
}

.tour-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  position: relative;
}

.tour-image {
  width: 100%;
  height: 400rpx;
}

.tour-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #FFFFFF;
  
  &.recruiting {
    background-color: #FF9F29;
  }
  
  &.confirmed {
    background-color: #4CAF50;
  }
  
  &.departed {
    background-color: #2196F3;
  }
  
  &.completed {
    background-color: #999;
  }
}

.tour-info {
  padding: 24rpx;
}

.tour-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.tour-details {
  display: flex;
  gap: 24rpx;
  margin-bottom: 16rpx;
}

.detail-item {
  font-size: 24rpx;
  color: #999;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.availability {
  font-size: 24rpx;
  color: #FF9F29;
}
</style>
