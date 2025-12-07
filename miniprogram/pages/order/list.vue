<template>
	<view class="order-list-page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="navbar-content">
				<view class="nav-back" @tap="goBack">
					<u-icon name="arrow-left" size="20" color="#333"></u-icon>
				</view>
				<text class="nav-title">我的订单</text>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<!-- 头部导航 (Sticky) -->
		<view class="header-sticky" :style="{ top: (statusBarHeight + 44) + 'px' }">
			<!-- 状态标签栏 -->
			<view class="status-tabs">
				<scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
					<view class="tabs-wrapper">
						<view 
							v-for="(item, index) in statusList" 
							:key="index"
							class="tab-item"
							:class="{ active: currentStatus === item.value }"
							@tap="switchStatus(item.value)"
						>
							<text>{{ item.label }}</text>
							<view v-if="currentStatus === item.value" class="active-line"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view 
			scroll-y 
			class="list-scroll"
			:style="{ paddingTop: (statusBarHeight + 44 + 44) + 'px' }"
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
		>
			<view class="list-container">
				<view 
					v-for="order in orders" 
					:key="order.id"
					class="order-card"
					@tap="goToDetail(order)"
				>
					<!-- 左侧状态条 -->
					<view class="status-bar" :style="{ background: getStatusColor(order.status) }"></view>
					
					<view class="card-content">
						<!-- 头部：车辆信息 & 状态 -->
						<view class="card-header">
							<text class="vehicle-name">{{ order.vehicleName }}</text>
							<text class="status-text" :style="{ color: getStatusColor(order.status) }">
								{{ order.statusText }}
							</text>
						</view>
						
						<!-- 中部：图文详情 -->
						<view class="card-body">
							<image class="vehicle-img" :src="order.vehicleImage" mode="aspectFill"></image>
							<view class="info-box">
								<view class="info-row">
									<u-icon name="clock" size="14" color="#86909C"></u-icon>
									<text class="info-text">
										{{ formatDate(order.pickupTime) }} - {{ formatDate(order.returnTime) }}
									</text>
								</view>
								<view class="info-row">
									<u-icon name="map" size="14" color="#86909C"></u-icon>
									<text class="info-text">{{ order.pickupStoreName }}</text>
								</view>
								<view class="price-row">
									<text class="label">总价</text>
									<text class="amount">¥{{ order.totalAmount }}</text>
								</view>
							</view>
						</view>
						
						<!-- 底部：操作按钮 -->
						<view class="card-footer" v-if="getOrderActions(order).length > 0">
							<view 
								v-for="(action, idx) in getOrderActions(order)"
								:key="idx"
								class="action-btn"
								:class="{ primary: action.primary }"
								@tap.stop="handleAction(action, order)"
							>
								{{ action.text }}
							</view>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-if="!loading && orders.length === 0" class="empty-state">
					<u-icon name="order" size="64" color="#E5E6EB"></u-icon>
					<text class="empty-text">暂无相关订单</text>
				</view>
				
				<!-- 加载更多 -->
				<view v-if="loading" class="loading-more">
					<u-loading-icon mode="circle" color="#999"></u-loading-icon>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';

// Mock Data
const statusList = [
	{ label: '全部', value: 'all' },
	{ label: '待付款', value: 'pending_payment' },
	{ label: '待取车', value: 'pending_pickup' },
	{ label: '租赁中', value: 'renting' },
	{ label: '已完成', value: 'completed' },
	{ label: '已取消', value: 'cancelled' }
];

const currentStatus = ref('all');
const refreshing = ref(false);
const loading = ref(false);
const orders = ref<any[]>([]);
const statusBarHeight = ref(0);

// Mock Orders
const mockOrders = [
	{
		id: '1',
		orderNo: 'ORD20241206001',
		vehicleName: '上汽大通RG10 生活家V90',
		vehicleImage: '/static/场景推荐2.jpg',
		status: 'pending_payment',
		statusText: '待付款',
		pickupTime: '2024-12-10 10:00',
		returnTime: '2024-12-12 10:00',
		pickupStoreName: '深圳宝安店',
		totalAmount: '1360.00'
	},
	{
		id: '2',
		orderNo: 'ORD20241120002',
		vehicleName: '宇通B530 舒适版',
		vehicleImage: '/static/优惠政策.jpg',
		status: 'renting',
		statusText: '租赁中',
		pickupTime: '2024-12-05 14:00',
		returnTime: '2024-12-08 14:00',
		pickupStoreName: '广州天河店',
		totalAmount: '2580.00'
	},
	{
		id: '3',
		orderNo: 'ORD20241001003',
		vehicleName: '览众C7 经典版',
		vehicleImage: '/static/场景推荐2.jpg',
		status: 'completed',
		statusText: '已完成',
		pickupTime: '2024-10-01 09:00',
		returnTime: '2024-10-05 18:00',
		pickupStoreName: '杭州西湖店',
		totalAmount: '4200.00'
	}
];

onMounted(() => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;
	loadOrders();
});

const goBack = () => {
	uni.navigateBack();
};

const loadOrders = () => {
	loading.value = true;
	setTimeout(() => {
		if (currentStatus.value === 'all') {
			orders.value = [...mockOrders];
		} else {
			orders.value = mockOrders.filter(o => o.status === currentStatus.value);
		}
		loading.value = false;
		refreshing.value = false;
	}, 500);
};

const switchStatus = (status: string) => {
	currentStatus.value = status;
	loadOrders();
};

const onRefresh = () => {
	refreshing.value = true;
	loadOrders();
};

const loadMore = () => {
	// Mock load more
};

const formatDate = (dateStr: string) => {
	return dayjs(dateStr).format('MM月DD日 HH:mm');
};

const getStatusColor = (status: string) => {
	const map: any = {
		pending_payment: '#FF4D4F',
		pending_pickup: '#FF9F29',
		renting: '#00B578',
		completed: '#2196F3',
		cancelled: '#999999'
	};
	return map[status] || '#999999';
};

const getOrderActions = (order: any) => {
	const status = order.status;
	if (status === 'pending_payment') {
		return [
			{ text: '取消订单', primary: false, code: 'cancel' },
			{ text: '去支付', primary: true, code: 'pay' }
		];
	}
	if (status === 'renting') {
		return [
			{ text: '联系门店', primary: false, code: 'contact' },
			{ text: '续租', primary: true, code: 'renew' }
		];
	}
	if (status === 'completed') {
		return [
			{ text: '删除订单', primary: false, code: 'delete' },
			{ text: '再次预订', primary: true, code: 'rebook' }
		];
	}
	return [];
};

const handleAction = (action: any, order: any) => {
	console.log('Action:', action.code, order.id);
	uni.showToast({ title: `点击了${action.text}`, icon: 'none' });
};

const goToDetail = (order: any) => {
	uni.navigateTo({
		url: `/pages/order/detail?id=${order.id}`
	});
};
</script>

<style scoped lang="scss">
.order-list-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

.custom-navbar {
	background-color: #FFFFFF;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	border-bottom: 1rpx solid $uni-border-color-light;
}

.navbar-content {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 $uni-spacing-lg;
}

.nav-back {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.nav-placeholder {
	width: 40rpx;
}

.header-sticky {
	position: fixed;
	left: 0;
	width: 100%;
	z-index: 99;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.status-tabs {
	height: 88rpx;
}

.tabs-scroll {
	width: 100%;
	height: 100%;
}

.tabs-wrapper {
	display: flex;
	height: 100%;
	padding: 0 24rpx;
}

.tab-item {
	position: relative;
	padding: 0 32rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: $uni-text-color-secondary;
	white-space: nowrap;
	transition: color 0.3s;
	
	&.active {
		color: $uni-color-primary;
		font-weight: 600;
		font-size: 30rpx;
	}
}

.active-line {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 32rpx;
	height: 6rpx;
	background-color: $uni-color-primary;
	border-radius: 3rpx;
}

.list-scroll {
	flex: 1;
	height: 0;
}

.list-container {
	padding: 24rpx 32rpx;
}

.order-card {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: $uni-shadow-card;
	margin-bottom: 24rpx;
	display: flex;
	position: relative;
	transition: transform 0.2s;
	
	&:active {
		transform: scale(0.99);
	}
}

.status-bar {
	width: 8rpx;
	background-color: $uni-color-primary;
	flex-shrink: 0;
}

.card-content {
	flex: 1;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.vehicle-name {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.status-text {
	font-size: 26rpx;
	font-weight: 600;
}

.card-body {
	display: flex;
	gap: 24rpx;
	margin-bottom: 20rpx;
}

.vehicle-img {
	width: 160rpx;
	height: 120rpx;
	border-radius: 12rpx;
	background-color: #F2F3F5;
}

.info-box {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.info-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.info-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.price-row {
	display: flex;
	align-items: baseline;
	justify-content: flex-end;
	margin-top: 8rpx;
}

.label {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
	margin-right: 8rpx;
}

.amount {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
	font-family: 'DIN Alternate', sans-serif;
}

.card-footer {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid $uni-border-color-light;
}

.action-btn {
	padding: 0 28rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	border: 1rpx solid $uni-border-color-light;
	transition: all 0.3s ease;

	&.primary {
		color: #FFFFFF;
		background: $uni-color-primary-gradient;
		border: none;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.25);
	}

	&:active {
		opacity: 0.8;
		transform: scale(0.98);
	}
}

.empty-state {
	padding: 120rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32rpx;
}

.empty-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.loading-more {
	padding: 32rpx 0;
	display: flex;
	justify-content: center;
}
</style>
