<template>
  <view class="order-list-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-item back-btn" @tap="goBack">
          <uni-icons type="arrowleft" size="20" color="#333"></uni-icons>
        </view>
        <text class="nav-title">我的订单</text>
        <view class="nav-item"></view>
      </view>

      <!-- 状态筛选 -->
      <view class="status-tabs">
        <view
          class="tab-item"
          :class="{ 'active': currentStatus === '' }"
          @tap="switchStatus('')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          v-for="status in statusList"
          :key="status.code"
          class="tab-item"
          :class="{ 'active': currentStatus === status.code }"
          @tap="switchStatus(status.code)"
        >
          <text class="tab-text">{{ status.name }}</text>
          <view class="tab-badge" v-if="status.count > 0">
            {{ status.count }}
          </view>
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view
      class="order-list"
  loadOrders(true);
};

// 下拉刷新
const onRefresh = () => {
  refreshOrders();
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadOrders();
  }
};

// 切换状态筛选
const switchStatus = (status) => {
  if (currentStatus.value === status) return;

  currentStatus.value = status;
  page.value = 1;
  hasMore.value = true;
  loadOrders(true);
};

// 获取状态样式类
const getStatusClass = (statusCode) => {
  const statusClasses = {
    'pending_payment': 'pending',
    'pending_confirmation': 'pending',
    'pending_pickup': 'processing',
    'in_progress': 'processing',
    'pending_return': 'processing',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };
  return statusClasses[statusCode] || 'default';
};

// 获取车辆规格信息
const getVehicleSpec = (vehicle, spec) => {
  if (!vehicle.specifications) return '';
  return vehicle.specifications[spec] || '';
};

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60 * 1000) {
    return '刚刚';
  } else if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前';
  } else if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}-${day}`;
  }
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 跳转到订单详情
const goToOrderDetail = (orderId) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${orderId}`
  });
};

// 支付订单
const payOrder = (order) => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${order.id}&orderNo=${order.orderNo}`
  });
};

// 取消订单
const cancelOrder = (order) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个订单吗？取消后可能需要重新下单。',
    confirmText: '确定取消',
    cancelText: '再想想',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.cancelOrder(order.id);
          uni.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          refreshOrders();
        } catch (error) {
          console.error('取消订单失败:', error);
          uni.showToast({
            title: error.message || '取消失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 联系客服
const contactService = (order) => {
  uni.navigateTo({
    url: `/pages/service/chat?orderId=${order.id}`
  });
};

// 评价订单
const rateOrder = (order) => {
  uni.navigateTo({
    url: `/pages/order/rate?orderId=${order.id}`
  });
};

// 申请延期
const extendOrder = (order) => {
  uni.navigateTo({
    url: `/pages/order/extend?orderId=${order.id}`
  });
};

// 再次下单
const reorder = (order) => {
  uni.navigateTo({
    url: `/pages/order/confirm?vehicleId=${order.vehicle.id}&pickupStoreId=${order.pickupStore.id}&returnStoreId=${order.returnStore.id}&pickupTime=${order.pickupTime}&returnTime=${order.returnTime}`
  });
};

// 删除订单
const deleteOrder = (order) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后将无法恢复，确定要删除这个订单吗？',
    confirmText: '确定删除',
    cancelText: '取消',
    confirmColor: '#FF4D4F',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.deleteOrder(order.id);
          uni.showToast({
            title: '订单已删除',
            icon: 'success'
          });
          refreshOrders();
        } catch (error) {
          console.error('删除订单失败:', error);
          uni.showToast({
            title: error.message || '删除失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 去看看房车
const browseVehicles = () => {
  uni.switchTab({
    url: '/pages/home/index'
  });
};

// 返回
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 头部
.header {
  background-color: #ffffff;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 32rpx;
    height: 88rpx;

    .nav-item {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
    }
  }

  // 状态筛选标签
  .status-tabs {
    display: flex;
    padding: 24rpx 32rpx;
    gap: 32rpx;
    overflow-x: auto;
    border-bottom: 2rpx solid #f0f0f0;

    .tab-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8rpx;
      white-space: nowrap;
      padding: 16rpx 0;

      .tab-text {
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.6);
        transition: color 0.3s ease;
      }

      .tab-badge {
        background-color: #FF4D4F;
        color: #ffffff;
        font-size: 20rpx;
        padding: 4rpx 8rpx;
        border-radius: 10rpx;
        min-width: 20rpx;
        text-align: center;
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
}

// 订单列表
.order-list {
  height: calc(100vh - 200rpx);
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
    margin-bottom: 48rpx;
  }

  .browse-btn {
    padding: 20rpx 48rpx;
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    color: #ffffff;
    border-radius: 44rpx;
    font-size: 28rpx;
    border: none;
  }
}

// 订单卡片
.order-cards {
  .order-card {
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

    // 订单头部
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 32rpx;
      border-bottom: 2rpx solid #f8f8f8;

      .order-info {
        flex: 1;

        .order-no {
          display: block;
          font-size: 28rpx;
          color: rgba(0, 0, 0, 0.9);
          margin-bottom: 8rpx;
        }

        .order-time {
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .order-status {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: 500;

        &.pending {
          background-color: rgba(255, 159, 41, 0.1);
          color: #FF9F29;
        }

        &.processing {
          background-color: rgba(75, 145, 255, 0.1);
          color: #4B91FF;
        }

        &.completed {
          background-color: rgba(103, 194, 58, 0.1);
          color: #67C23A;
        }

        &.cancelled {
          background-color: rgba(0, 0, 0, 0.1);
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    // 车辆信息
    .order-vehicle {
      display: flex;
      padding: 32rpx;
      gap: 24rpx;

      .vehicle-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 12rpx;
        background-color: #f0f0f0;
      }

      .vehicle-info {
        flex: 1;

        .vehicle-name {
          display: block;
          font-size: 32rpx;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.9);
          margin-bottom: 12rpx;
          line-height: 1.4;
        }

        .vehicle-specs {
          display: flex;
          gap: 16rpx;

          .spec-item {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.6);
            background-color: #f8f8f8;
            padding: 6rpx 12rpx;
            border-radius: 8rpx;
          }
        }
      }
    }

    // 租赁信息
    .order-rental {
      padding: 0 32rpx 24rpx;

      .rental-item {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .last-child {
          margin-bottom: 0;
        }

        .rental-text {
          font-size: 26rpx;
          color: rgba(0, 0, 0, 0.8);
          line-height: 1.4;
        }
      }
    }

    // 费用信息
    .order-price {
      display: flex;
      align-items: baseline;
      padding: 0 32rpx 24rpx;

      .price-label {
        font-size: 26rpx;
        color: rgba(0, 0, 0, 0.8);
      }

      .price-amount {
        font-size: 32rpx;
        font-weight: 600;
        color: #FF9F29;
        margin-left: 8rpx;
      }

      .deposit-info {
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.6);
        margin-left: 12rpx;
      }
    }

    // 操作按钮
    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16rpx;
      padding: 24rpx 32rpx 32rpx;
      border-top: 2rpx solid #f8f8f8;

      .action-btn {
        padding: 16rpx 32rpx;
        border-radius: 25rpx;
        font-size: 26rpx;
        border: 2rpx solid #f0f0f0;
        background-color: #ffffff;
        color: rgba(0, 0, 0, 0.8);
        line-height: 1.2;

        &.primary {
          background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
          color: #ffffff;
          border-color: transparent;
        }

        &.delete {
          border-color: #FF4D4F;
          color: #FF4D4F;
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
</style>