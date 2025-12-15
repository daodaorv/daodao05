<template>
  <view class="favorites-page">
    <view class="vehicle-list" v-if="favorites.length">
      <vehicle-card
        v-for="vehicle in favorites"
        :key="vehicle.id"
        :data="vehicle"
        :favorited="vehicle.isFavorite"
        @click="handleVehicleClick"
        @favorite-change="(state) => handleFavoriteChange(vehicle, state)"
      />
      <uni-load-more :status="loadMoreStatus"></uni-load-more>
    </view>

    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/empty-favorites.png" mode="aspectFit"></image>
      <text class="empty-text">暂无收藏的房车</text>
      <button class="browse-btn" @tap="goHome">去逛逛</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { useVehicleStore } from '@/stores/vehicle'
import VehicleCard, { type VehicleCardData } from '@/components/business/vehicle/VehicleCard.vue'

type FavoriteVehicle = VehicleCardData & { isFavorite: boolean; favoritedAt?: string }

const vehicleStore = useVehicleStore()
const favorites = ref<FavoriteVehicle[]>([])
const loading = ref(true)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadMoreStatus = ref<'more' | 'loading' | 'noMore'>('more')
const totalCount = ref(0)

const normalizeFavoriteVehicle = (item: any): FavoriteVehicle => {
  const source = item?.vehicle || item || {}
  const seats =
    source.seats ??
    source.specs?.seats ??
    source.specifications?.seats ??
    source.capacity?.seats
  const beds =
    source.beds ??
    source.specs?.beds ??
    source.specifications?.beds ??
    source.capacity?.beds
  const images = source.images || source.gallery || []
  const price =
    source.price ??
    source.pricePerDay ??
    source.dailyPrice ??
    source.basePrice ??
    source.amount?.price ??
    source.rentalPrice

  return {
    id: source.id || item?.vehicleId || `favorite-${Date.now()}`,
    name: source.name || source.title || '房车',
    image: source.image || source.cover || source.coverUrl || images[0],
    images,
    type: source.type || source.vehicleType || source.category,
    seats,
    beds,
    transmission:
      source.transmission ||
      source.specs?.transmission ||
      source.specifications?.transmission,
    specs: source.specs || source.specifications,
    tags: source.tags || source.features || [],
    price,
    brand: source.brand,
    isFavorite: item?.isFavorite ?? true,
    favoritedAt: item?.favoritedAt
  }
}

const parseFavoriteResponse = (res: any) => {
  const list = res?.list || res?.data?.list || res?.records || []
  const pagination = res?.pagination || res?.data?.pagination || {}
  const total = pagination.total ?? res?.total ?? list.length
  return { list, total }
}

const loadFavorites = async (refresh = false) => {
  if (refresh) {
    page.value = 1
    hasMore.value = true
    loadMoreStatus.value = 'loading'
  }

  if (!hasMore.value && !refresh) return

  loadMoreStatus.value = 'loading'

  const response = await vehicleStore.fetchFavoriteVehicles({
    page: page.value,
    limit: pageSize
  })

  if (response) {
    const { list, total } = parseFavoriteResponse(response)
    totalCount.value = total
    const mapped = list.map(normalizeFavoriteVehicle)
    favorites.value = refresh ? mapped : [...favorites.value, ...mapped]

    if (favorites.value.length >= totalCount.value || mapped.length < pageSize) {
      hasMore.value = false
      loadMoreStatus.value = 'noMore'
    } else {
      page.value += 1
      loadMoreStatus.value = 'more'
    }
  } else {
    loadMoreStatus.value = 'more'
  }

  loading.value = false
  uni.stopPullDownRefresh()
}

onShow(() => {
  loadFavorites(true)
})

onPullDownRefresh(() => {
  loadFavorites(true)
})

onReachBottom(() => {
  loadFavorites()
})

const handleVehicleClick = (vehicle: VehicleCardData) => {
  uni.navigateTo({
    url: `/pages/vehicle/detail?id=${vehicle.id}`
  })
}

const handleFavoriteChange = async (vehicle: FavoriteVehicle, nextState: boolean) => {
  const previous = vehicle.isFavorite
  vehicle.isFavorite = nextState
  const result = await vehicleStore.toggleFavorite(vehicle.id)

  if (result === nextState) {
    if (!nextState) {
      favorites.value = favorites.value.filter((item) => item.id !== vehicle.id)
      if (!favorites.value.length) {
        hasMore.value = false
        loadMoreStatus.value = 'noMore'
      }
      uni.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      uni.showToast({ title: '收藏成功', icon: 'none' })
    }
  } else {
    vehicle.isFavorite = previous
    uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' })
  }
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style scoped lang="scss">
.favorites-page {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding: $uni-spacing-md;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: $uni-spacing-md;
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
    margin-bottom: $uni-spacing-lg;
  }

  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-placeholder;
    margin-bottom: 48rpx;
  }

  .browse-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: $uni-color-primary-gradient;
    color: #ffffff;
    font-size: 28rpx;
    border-radius: $uni-radius-btn;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }

    &::after {
      border: none;
    }
  }
}
</style>
