<template>
  <view class="tour-list-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @tap="showDurationFilter">
        <text class="filter-text">{{ currentDuration || '行程天数' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view class="filter-item" @tap="showPriceFilter">
        <text class="filter-text">{{ currentPrice || '价格' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
      <view class="filter-item" @tap="showStatusFilter">
        <text class="filter-text">{{ currentStatus || '状态' }}</text>
        <u-icon name="arrow-down" size="12" color="#666"></u-icon>
      </view>
    </view>

    <!-- 路线列表 -->
    <scroll-view
      class="tour-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 空状态 -->
      <view v-if="tours.length === 0 && !loading" class="empty-state">
        <u-empty mode="list" text="暂无旅游线路" icon="http://cdn.uviewui.com/uview/empty/list.png">
        </u-empty>
      </view>

      <!-- 线路卡片 -->
      <view v-else>
        <view class="tour-card" v-for="item in tours" :key="item.id" @tap="viewDetail(item)">
          <view class="image-wrapper">
             <u-image :src="item.image" width="100%" height="400rpx" mode="aspectFill" radius="16rpx 16rpx 0 0"></u-image>
             <!-- 状态标签 -->
             <view class="tour-badge-wrapper">
                 <u-tag :text="getStatusText(item.status)" :type="getStatusType(item.status)" shape="checkmark-circle" size="mini"></u-tag>
             </view>
             <!-- 热门标签 -->
             <view v-if="item.isHot" class="hot-tag-wrapper">
                 <u-tag text="热门" type="error" shape="checkmark-circle" size="mini" icon="star-fill"></u-tag>
             </view>
          </view>

          <view class="tour-info">
            <text class="tour-title">{{ item.title }}</text>

            <!-- 线路标签 -->
            <view class="tour-tags">
              <u-tag v-for="tag in item.tags" :key="tag" :text="tag" plain size="mini" type="warning" style="margin-right: 10rpx;"></u-tag>
            </view>

            <view class="tour-details">
              <view class="detail-item">
                <u-icon name="calendar" size="14" color="#999"></u-icon>
                <text class="detail-text">{{ item.days }}天{{ item.days - 1 }}晚</text>
              </view>
              <view class="detail-item">
                <u-icon name="account-fill" size="14" color="#999"></u-icon>
                <text class="detail-text">{{ item.minPeople }}-{{ item.maxPeople }}人成团</text>
              </view>
            </view>

            <!-- 成团进度 -->
            <view class="group-progress" v-if="item.status === 'recruiting'">
              <u-line-progress :percentage="(item.currentPeople / item.maxPeople) * 100" activeColor="#67C23A" height="8"></u-line-progress>
              <text class="progress-text">已报名{{ item.currentPeople }}人/{{ item.maxPeople }}人</text>
            </view>

            <view class="price-row">
              <view class="price-box">
                <text class="price">¥{{ item.price }}</text>
                <text class="unit">/人起</text>
                <text class="child-price" v-if="item.childPrice">儿童¥{{ item.childPrice }}</text>
              </view>
              <u-button 
                :type="getBtnType(item.status)" 
                shape="checkmark-circle" 
                size="small" 
                :text="getActionText(item.status)"
                :disabled="item.status === 'departed' || item.status === 'completed'"
                customStyle="width: 180rpx; height: 64rpx;"
              ></u-button>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <u-loadmore :status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" />
      
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
import { logger } from '@/utils/logger';
import { ref, onMounted } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

// 状态管理
const tours = ref<any[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const hasMore = ref(true);
const page = ref(1);

// 筛选状态
const currentDuration = ref('');
const currentPrice = ref('');
const currentStatus = ref('');
const filterPopup = ref<any>(null);
const filterTitle = ref('');
const filterOptions = ref<any[]>([]);
const currentFilterValue = ref('');
const currentFilterType = ref('');

// 页面加载
onMounted(() => {
  loadTours();
});

// 加载旅游线路列表
const loadTours = async (isRefresh = false) => {
  if (loading.value && !isRefresh) return;

  try {
    loading.value = true;

    // Mock数据 - 5个完整线路
    const mockTours = [
      {
        id: '1',
        title: '川西秘境·稻城亚丁房车深度游',
        image: 'https://placehold.co/700x400/FF5722/FFFFFF?text=%E7%BA%BF%E8%B7%AF1',
        tags: ['高原风光', '摄影天堂', '藏族文化'],
        days: 7,
        minPeople: 5,
        maxPeople: 12,
        currentPeople: 8,
        price: 4980,
        childPrice: 2490,
        status: 'recruiting',
        isHot: true,
        available: 4
      },
      {
        id: '2',
        title: '大西北环线·青海湖敦煌房车之旅',
        image: 'https://placehold.co/700x400/3F51B5/FFFFFF?text=%E7%BA%BF%E8%B7%AF2',
        tags: ['大漠风光', '丝绸之路', '星空露营'],
        days: 8,
        minPeople: 5,
        maxPeople: 10,
        currentPeople: 10,
        price: 5680,
        childPrice: 2840,
        status: 'confirmed',
        isHot: true,
        available: 0
      },
      {
        id: '3',
        title: '云南秘境·香格里拉梅里雪山行',
        image: 'https://placehold.co/700x400/607D8B/FFFFFF?text=%E7%BA%BF%E8%B7%AF3',
        tags: ['雪山风光', '藏区文化', '徒步探险'],
        days: 6,
        minPeople: 5,
        maxPeople: 12,
        currentPeople: 6,
        price: 4280,
        childPrice: 2140,
        status: 'recruiting',
        isHot: false,
        available: 6
      },
      {
        id: '4',
        title: '新疆伊犁·天山草原房车自驾',
        image: 'https://placehold.co/700x400/4CAF50/FFFFFF?text=%E7%BA%BF%E8%B7%AF4',
        tags: ['草原风光', '哈萨克文化', '野生动物'],
        days: 9,
        minPeople: 5,
        maxPeople: 15,
        currentPeople: 3,
        price: 6280,
        childPrice: 3140,
        status: 'recruiting',
        isHot: false,
        available: 12
      },
      {
        id: '5',
        title: '内蒙古草原·呼伦贝尔房车穿越',
        image: 'https://placehold.co/700x400/795548/FFFFFF?text=%E7%BA%BF%E8%B7%AF5',
        tags: ['大草原', '蒙古文化', '骑马体验'],
        days: 5,
        minPeople: 5,
        maxPeople: 12,
        currentPeople: 12,
        price: 3680,
        childPrice: 1840,
        status: 'departed',
        isHot: false,
        available: 0
      }
    ];

    if (isRefresh) {
      tours.value = mockTours;
      page.value = 1;
      hasMore.value = false;
    } else {
      tours.value.push(...mockTours);
      hasMore.value = false;
    }

  } catch (error) {
    logger.error('加载旅游线路失败:', error);
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
  loadTours(true);
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadTours();
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    recruiting: '招募中',
    confirmed: '已成团',
    departed: '已出发',
    completed: '已结束'
  };
  return map[status] || status;
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    recruiting: 'success',
    confirmed: 'warning',
    departed: 'info',
    completed: 'info'
  };
  return map[status] || 'primary';
};

// 获取按钮类型
const getBtnType = (status: string) => {
   const map: Record<string, string> = {
    recruiting: 'primary',
    confirmed: 'warning',
    departed: 'info',
    completed: 'info'
  };
  return map[status] || 'primary';
};

// 获取操作按钮文本
const getActionText = (status: string) => {
  const map: Record<string, string> = {
    recruiting: '立即报名',
    confirmed: '查看详情',
    departed: '已出发',
    completed: '已结束'
  };
  return map[status] || '查看详情';
};

// 计算成团进度宽度
const getProgressWidth = (tour: any) => {
  const percentage = (tour.currentPeople / tour.maxPeople) * 100;
  return `${Math.min(percentage, 100)}%`;
};

// 显示天数筛选
const showDurationFilter = () => {
  filterTitle.value = '行程天数';
  currentFilterType.value = 'duration';
  currentFilterValue.value = currentDuration.value;
  filterOptions.value = [
    { label: '不限', value: '' },
    { label: '3-5天', value: '3-5' },
    { label: '6-8天', value: '6-8' },
    { label: '9天以上', value: '9-' }
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
    { label: '3000元以下', value: '0-3000' },
    { label: '3000-5000元', value: '3000-5000' },
    { label: '5000-7000元', value: '5000-7000' },
    { label: '7000元以上', value: '7000-' }
  ];
  filterPopup.value?.open();
};

// 显示状态筛选
const showStatusFilter = () => {
  filterTitle.value = '线路状态';
  currentFilterType.value = 'status';
  currentFilterValue.value = currentStatus.value;
  filterOptions.value = [
    { label: '全部状态', value: '' },
    { label: '招募中', value: 'recruiting' },
    { label: '已成团', value: 'confirmed' },
    { label: '已出发', value: 'departed' }
  ];
  filterPopup.value?.open();
};

// 选择筛选项
const selectFilter = (item: any) => {
  currentFilterValue.value = item.value;

  if (currentFilterType.value === 'duration') {
    currentDuration.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'price') {
    currentPrice.value = item.value ? item.label : '';
  } else if (currentFilterType.value === 'status') {
    currentStatus.value = item.value ? item.label : '';
  }

  closeFilter();
  loadTours(true);
};

// 关闭筛选弹窗
const closeFilter = () => {
  filterPopup.value?.close();
};

// 查看详情
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

  .filter-text {
    font-size: 28rpx;
    color: #333;
  }
}

// 线路列表
.tour-list {
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
    margin-bottom: 16rpx;
  }

  .empty-tip {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.4);
  }
}

// 线路卡片
.tour-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 400rpx;
}

// 状态标签
.tour-badge-wrapper {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  z-index: 1;
}

// 热门标签
.hot-tag-wrapper {
  position: absolute;
  top: 24rpx;
  left: 0;
  z-index: 1;
}

.tour-info {
  padding: 24rpx;
}

.tour-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
  line-height: 1.4;
}

// 线路标签
.tour-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
  flex-wrap: wrap;

  .tag-item {
    font-size: 22rpx;
    color: #FF9F29;
    background-color: rgba(255, 159, 41, 0.1);
    padding: 6rpx 12rpx;
    border-radius: 6rpx;
  }
}

.tour-details {
  display: flex;
  gap: 24rpx;
  margin-bottom: 16rpx;

  .detail-item {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .detail-text {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 成团进度
.group-progress {
  margin-bottom: 20rpx;

  .progress-bar {
    width: 100%;
    height: 8rpx;
    background-color: #F0F0F0;
    border-radius: 4rpx;
    overflow: hidden;
    margin-bottom: 12rpx;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #67C23A 0%, #85CE61 100%);
      border-radius: 4rpx;
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    font-size: 24rpx;
    color: #67C23A;
  }
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-box {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  .price {
    font-size: 48rpx;
    font-weight: 700;
    color: #F44336;
  }

  .unit {
    font-size: 24rpx;
    color: #999;
    margin-left: 4rpx;
  }

  .child-price {
    font-size: 22rpx;
    color: #999;
  }
}

.action-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  padding: 20rpx 48rpx;
  border-radius: 44rpx;

  &.disabled {
    background: #E0E0E0;
    color: #999;
  }

  .btn-text {
    font-size: 28rpx;
    font-weight: 500;
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
