<template>
  <view class="order-detail-page">
    <!-- 订单状态头部 -->
    <view class="status-header" :style="{ backgroundColor: getStatusColor(order.statusId) }">
      <view class="status-icon">
        <u-icon :name="getStatusIcon(order.statusId)" size="32" color="#fff"></u-icon>
      </view>
      <view class="status-info">
        <text class="status-title">{{ getStatusText(order.statusId) }}</text>
        <text class="status-desc">{{ getStatusDesc(order.statusId) }}</text>
      </view>
      <view class="status-actions" v-if="showStatusActions">
        <button
          v-if="order.statusId === 1"
          class="action-btn cancel-btn"
          @tap="cancelOrder"
        >
          取消订单
        </button>
        <button
          v-if="order.statusId === 4"
          class="action-btn primary-btn"
          @tap="confirmReturn"
        >
          确认还车
        </button>
        <button
          v-if="order.statusId === 2"
          class="action-btn primary-btn"
          @tap="goToPayment"
        >
          去支付
        </button>
      </view>
    </view>

    <!-- 进度时间线 -->
    <view class="timeline-section">
      <view class="section-title">
        <text class="title-text">订单进度</text>
      </view>
      <view class="timeline">
        <view
          v-for="(item, index) in timeline"
          :key="item.id"
          class="timeline-item"
          :class="{ 'active': index <= currentTimelineIndex, 'current': index === currentTimelineIndex }"
        >
          <view class="timeline-dot"></view>
          <view class="timeline-content">
            <view class="timeline-header">
              <text class="timeline-title">{{ item.statusName }}</text>
              <text class="timeline-time">{{ formatDateTime(item.createdAt) }}</text>
            </view>
            <text class="timeline-desc" v-if="item.description">{{ item.description }}</text>
            <view class="timeline-images" v-if="item.images && item.images.length > 0">
              <image
                v-for="(image, idx) in item.images.slice(0, 3)"
                :key="idx"
                class="timeline-image"
                :src="image"
                mode="aspectFill"
                @tap="previewImage(item.images, idx)"
              ></image>
              <view
                v-if="item.images.length > 3"
                class="more-images"
                @tap="previewImage(item.images, 3)"
              >
                +{{ item.images.length - 3 }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 车辆信息 -->
    <view class="vehicle-section">
      <view class="section-title">
        <text class="title-text">车辆信息</text>
        <text class="view-detail" @tap="goToVehicle(order.vehicle?.id)">查看详情 ></text>
      </view>
      <view class="vehicle-card" v-if="order.vehicle">
        <image
          class="vehicle-image"
          :src="order.vehicle.images?.[0] || '/static/default-vehicle.png'"
          mode="aspectFill"
          @tap="previewImage(order.vehicle.images)"
        ></image>
        <view class="vehicle-info">
          <text class="vehicle-name">{{ order.vehicle.name }}</text>
          <view class="vehicle-meta">
            <text class="meta-item">{{ order.vehicle.brand }} {{ order.vehicle.model }}</text>
            <text class="meta-item">{{ order.vehicle.plateNumber }}</text>
          </view>
          <view class="vehicle-features" v-if="order.vehicle.features && order.vehicle.features.length > 0">
            <text
              v-for="feature in order.vehicle.features.slice(0, 3)"
              :key="feature"
              class="feature-tag"
            >
              {{ feature }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间地点信息 -->
    <view class="location-section">
      <view class="section-title">
        <text class="title-text">时间地点</text>
      </view>
      <view class="location-card">
        <view class="location-item">
          <view class="location-header">
            <u-icon name="location" size="20" color="#FF9F29"></u-icon>
            <text class="location-title">取车</text>
          </view>
          <view class="location-info">
            <text class="location-name">{{ order.pickupStore?.name || '取车门店' }}</text>
            <text class="location-address">{{ order.pickupStore?.address || '门店地址' }}</text>
            <text class="location-time">{{ formatDateTime(order.pickupTime) }}</text>
          </view>
        </view>

        <view class="location-separator">
          <view class="separator-line"></view>
          <u-icon name="right" size="16" color="#ccc"></u-icon>
        </view>

        <view class="location-item">
          <view class="location-header">
            <u-icon name="location-fill" size="20" color="#52C41A"></u-icon>
            <text class="location-title">还车</text>
          </view>
          <view class="location-info">
            <text class="location-name">{{ order.returnStore?.name || '还车门店' }}</text>
            <text class="location-address">{{ order.returnStore?.address || '门店地址' }}</text>
            <text class="location-time">{{ formatDateTime(order.returnTime) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="fee-section">
      <view class="section-title">
        <text class="title-text">费用明细</text>
      </view>
      <view class="fee-list">
        <view
          v-for="fee in feeDetails"
          :key="fee.id"
          class="fee-item"
        >
          <view class="fee-info">
            <text class="fee-name">{{ fee.feeName }}</text>
            <text class="fee-desc" v-if="fee.description">{{ fee.description }}</text>
          </view>
          <text class="fee-amount" :class="{ 'discount': fee.amount < 0 }">
            {{ fee.amount < 0 ? '-' : '+' }}¥{{ Math.abs(fee.amount) }}
          </text>
        </view>

        <view class="fee-divider"></view>

        <view class="fee-total">
          <text class="total-label">实付金额</text>
          <text class="total-amount">¥{{ order.actualAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 联系信息 -->
    <view class="contact-section" v-if="order.pickupContactName || order.pickupContactPhone">
      <view class="section-title">
        <text class="title-text">联系信息</text>
      </view>
      <view class="contact-card">
        <view class="contact-item">
          <text class="contact-label">取车人</text>
          <text class="contact-value">{{ order.pickupContactName || '本人' }}</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">联系电话</text>
          <view class="contact-phone" @tap="makePhoneCall(order.pickupContactPhone)">
            <text class="phone-number">{{ order.pickupContactPhone }}</text>
            <u-icon name="phone" size="16" color="#FF9F29"></u-icon>
          </view>
        </view>
        <view class="contact-item" v-if="order.specialRequirements">
          <text class="contact-label">特殊要求</text>
          <text class="contact-value">{{ order.specialRequirements }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button
        v-if="order.statusId === 6 && !hasRefundRequest"
        class="action-btn refund-btn"
        @tap="requestRefund"
      >
        申请退款
      </button>
      <button
        class="action-btn contact-btn"
        @tap="contactService"
      >
        联系客服
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { orderApi } from '@/api/order';

const userStore = useUserStore();

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
});

// 状态管理
const order = ref({});
const timeline = ref([]);
const feeDetails = ref([]);
const hasRefundRequest = ref(false);

// 计算属性
const currentTimelineIndex = computed(() => {
  const statusIndexMap = {
    1: 0, // 待支付
    2: 1, // 待确认
    3: 2, // 待取车
    4: 3, // 使用中
    5: 4, // 待还车
    6: 5, // 已完成
    7: -1, // 已取消
    8: -1  // 已退款
  };
  return statusIndexMap[order.value.statusId] || 0;
});

const showStatusActions = computed(() => {
  return [1, 2, 4].includes(order.value.statusId);
});

// 页面加载
onMounted(() => {
  loadOrderDetail();
});

// 加载订单详情
const loadOrderDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' });
    const response = await orderApi.getOrderDetail(props.orderId);

    order.value = response.data;

    // 模拟时间线数据（实际应从API获取）
    timeline.value = generateMockTimeline();

    // 模拟费用明细数据（实际应从API获取）
    feeDetails.value = generateMockFeeDetails();

    // 检查是否有退款申请
    checkRefundStatus();
  } catch (error) {
    console.error('加载订单详情失败:', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 检查退款状态
const checkRefundStatus = () => {
  hasRefundRequest.value = order.value.statusId === 8;
};

// 生成模拟时间线数据
const generateMockTimeline = () => {
  const now = new Date();
  return [
    {
      id: 1,
      statusName: '订单创建',
      description: '订单创建成功，等待支付',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      statusName: '支付完成',
      description: '订单支付成功，等待商家确认',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000)
    }
  ];
};

// 生成模拟费用明细数据
const generateMockFeeDetails = () => {
  return [
    {
      id: 1,
      feeName: '车辆租金',
      amount: order.value.vehicleFee || 500,
      description: '5天 × ¥100/天'
    },
    {
      id: 2,
      feeName: '保险费用',
      amount: order.value.insuranceFee || 50,
      description: '基础保险'
    },
    {
      id: 3,
      feeName: '服务费用',
      amount: order.value.serviceFee || 30,
      description: '平台服务费'
    }
  ];
};

// 状态相关
const getStatusColor = (statusId) => {
  const colors = {
    1: '#FFB800', // 待支付 - 橙色
    2: '#1890FF', // 待确认 - 蓝色
    3: '#52C41A', // 待取车 - 绿色
    4: '#722ED1', // 使用中 - 紫色
    5: '#FA8C16', // 待还车 - 橙红色
    6: '#52C41A', // 已完成 - 绿色
    7: '#F5222D', // 已取消 - 红色
    8: '#F5222D'  // 已退款 - 红色
  };
  return colors[statusId] || '#999';
};

const getStatusIcon = (statusId) => {
  const icons = {
    1: 'wallet',
    2: 'clock',
    3: 'checkmarkempty',
    4: 'loop',
    5: 'flag',
    6: 'checkbox-filled',
    7: 'close',
    8: 'refresh'
  };
  return icons[statusId] || 'help';
};

const getStatusText = (statusId) => {
  const texts = {
    1: '待支付',
    2: '待确认',
    3: '待取车',
    4: '使用中',
    5: '待还车',
    6: '已完成',
    7: '已取消',
    8: '已退款'
  };
  return texts[statusId] || '未知状态';
};

const getStatusDesc = (statusId) => {
  const descs = {
    1: '请在30分钟内完成支付',
    2: '商家正在确认您的订单',
    3: '请在取车时间到达门店',
    4: '正在使用中，请安全驾驶',
    5: '请按时到达还车地点',
    6: '订单已完成，感谢您的使用',
    7: '订单已取消',
    8: '退款已处理'
  };
  return descs[statusId] || '';
};

// 操作方法
const cancelOrder = () => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这个订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 这里应该调用取消订单的API
          // await orderApi.cancelOrder(props.orderId);

          uni.showToast({
            title: '订单已取消',
            icon: 'success'
          });

          // 重新加载订单数据
          loadOrderDetail();
        } catch (error) {
          uni.showToast({
            title: '取消失败，请重试',
            icon: 'none'
          });
        }
      }
    }
  });
};

const confirmReturn = () => {
  uni.navigateTo({
    url: `/pages/order/return?orderId=${props.orderId}`
  });
};

const goToPayment = () => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${props.orderId}`
  });
};

const goToVehicle = (vehicleId) => {
  if (vehicleId) {
    uni.navigateTo({
      url: `/pages/vehicles/detail?id=${vehicleId}`
    });
  }
};

const contactService = () => {
  uni.switchTab({
    url: '/pages/service/index'
  });
};

const makePhoneCall = (phoneNumber) => {
  if (phoneNumber) {
    uni.makePhoneCall({
      phoneNumber
    });
  }
};

const requestRefund = () => {
  uni.showModal({
    title: '申请退款',
    content: '确定要申请退款吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: `/pages/order/refund?orderId=${props.orderId}`
        });
      }
    }
  });
};

const previewImage = (images, current = 0) => {
  if (images && images.length > 0) {
    uni.previewImage({
      urls: images,
      current
    });
  }
};

// 工具方法
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>