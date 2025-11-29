<template>
  <view class="favorites-page">
    <view class="vehicle-list" v-if="favorites.length > 0">
      <view class="vehicle-item" v-for="vehicle in favorites" :key="vehicle.id">
        <vehicle-card :data="vehicle" @click="handleVehicleClick" />
      </view>
      <uni-load-more :status="loadMoreStatus" v-if="favorites.length > 0"></uni-load-more>
    </view>
    
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/empty-favorites.png" mode="aspectFit"></image>
      <text class="empty-text">暂无收藏的房车</text>
      <button class="browse-btn" @tap="goHome">去逛逛</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { useVehicleStore } from '@/stores/vehicle';
import VehicleCard from '@/components/business/vehicle/VehicleCard.vue';

const vehicleStore = useVehicleStore();
const favorites = ref<any[]>([]);
const loading = ref(true);
const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);
const loadMoreStatus = ref('more');

// 获取收藏列表
const loadFavorites = async (refresh = false) => {
  if (refresh) {
    page.value = 1;
    hasMore.value = true;
    loadMoreStatus.value = 'more';
  }
  
  if (!hasMore.value) return;
  
  loadMoreStatus.value = 'loading';
  
  const res = await vehicleStore.fetchFavoriteVehicles({
    page: page.value,
    limit: pageSize
  });
  
  if (res) {
    if (refresh) {
      favorites.value = res.list;
    } else {
      favorites.value = [...favorites.value, ...res.list];
    }
    
    if (favorites.value.length >= res.total) {
      hasMore.value = false;
      loadMoreStatus.value = 'noMore';
    } else {
      page.value++;
      loadMoreStatus.value = 'more';
    }
  } else {
    loadMoreStatus.value = 'more';
  }
  
  loading.value = false;
  uni.stopPullDownRefresh();
};

// 页面显示时刷新列表（因为可能在其他地方取消了收藏）
onShow(() => {
  loadFavorites(true);
});

// 下拉刷新
onPullDownRefresh(() => {
  loadFavorites(true);
});

// 上拉加载
onReachBottom(() => {
  loadFavorites();
});

// 点击车辆
const handleVehicleClick = (vehicle: any) => {
  uni.navigateTo({
    url: `/pages/vehicle/detail?id=${vehicle.id}`
  });
};

// 去首页
const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  });
};
</script>

<style scoped lang="scss">
.favorites-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 24rpx;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  
  .empty-image {
    width: 320rpx;
    height: 320rpx;
    margin-bottom: 32rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 48rpx;
  }
  
  .browse-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: 40rpx;
    
    &::after {
      border: none;
    }
  }
}
</style>
