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
									<u-icon name="map-fill" size="14" color="#86909C"></u-icon>
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
import { logger } from '@/utils/logger';
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getUserOrders } from '@/api/order';
import { requireLogin, isLoggedIn, buildRedirectUrl } from '@/utils/auth';

// Mock Data
const statusList = [
	{ label: '全部', value: 'all' },
	{ label: '待付款', value: 'pending_payment' },
	{ label: '待取车', value: 'pending_pickup' },
	{ label: '租赁中', value: 'in_progress' },
	{ label: '已完成', value: 'completed' },
	{ label: '已取消', value: 'cancelled' }
];

const currentStatus = ref('all');
const refreshing = ref(false);
const loading = ref(false);
const orders = ref<any[]>([]);
const statusBarHeight = ref(0);
const pageReady = ref(false);
const redirectUrl = ref('/pages/order/list');
let cachedRouteParams: Record<string, any> | null = null;

onMounted(() => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;
});

const goBack = () => {
	uni.navigateBack();
};

const loadOrders = async () => {
	// 检查登录状态
	if (!isLoggedIn()) {
		orders.value = [];
		return;
	}

	loading.value = true;
	try {
		const params: any = {};
		if (currentStatus.value !== 'all') {
			params.status = currentStatus.value;
		}

		const res: any = await getUserOrders(params);
		if (res.code === 0 && res.data) {
			// 映射数据结构为列表页需要的格式
			orders.value = res.data.orders.map((order: any) => ({
				id: order.id,
				orderNo: order.orderNo,
				vehicleName: order.vehicle?.name || '未知车辆',
				vehicleImage: order.vehicle?.images?.[0] || '/static/logo.png',
				status: order.status.code,
				statusText: order.status.name,
				pickupTime: order.pickupTime,
				returnTime: order.returnTime,
				pickupStoreName: order.pickupStore?.name || '未知门店',
				totalAmount: order.actualAmount,
				vehicleId: order.vehicle?.id || '',
				storePhone: '400-123-4567'
			}));
		}
	} catch (error) {
		logger.error('加载订单列表失败:', error);
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		});
	} finally {
		loading.value = false;
		refreshing.value = false;
	}
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
	// 租赁中状态：支持 in_progress 和 renting 两种状态码
	if (status === 'in_progress' || status === 'renting') {
		return [
			{ text: '车辆异常', primary: false, code: 'report' },
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

// 按钮处理函数
const handleAction = (action: any, order: any) => {
	switch (action.code) {
		case 'pay':
			handlePay(order);
			break;
		case 'cancel':
			handleCancel(order);
			break;
		case 'contact':
			handleContact(order);
			break;
		case 'renew':
			handleRenew(order);
			break;
		case 'report':
			handleReport(order);
			break;
		case 'delete':
			handleDelete(order);
			break;
		case 'rebook':
			handleRebook(order);
			break;
	}
};

// 去支付
const handlePay = (order: any) => {
	uni.navigateTo({
		url: `/pages/order/pay?orderNo=${order.orderNo}&amount=${order.totalAmount}`
	});
};

// 取消订单
const handleCancel = async (order: any) => {
	try {
		const res = await uni.showModal({
			title: '确认取消',
			content: '确定要取消该订单吗？',
			confirmText: '确认取消',
			cancelText: '我再想想'
		});

		if (res.confirm) {
			// 更新订单状态
			order.status = 'cancelled';
			order.statusText = '已取消';
			uni.showToast({ title: '订单已取消', icon: 'success' });

			// 刷新列表
			await loadOrders();
		}
	} catch (error) {
		// 用户取消操作
	}
};

// 联系门店
const handleContact = (order: any) => {
	if (!order.storePhone) {
		uni.showToast({ title: '暂无门店电话', icon: 'none' });
		return;
	}

	uni.makePhoneCall({
		phoneNumber: order.storePhone,
		fail: () => {
			uni.showToast({ title: '拨号失败', icon: 'none' });
		}
	});
};

// 续租
const handleRenew = (order: any) => {
	uni.navigateTo({
		url: `/pages/order/renewal?orderNo=${order.orderNo}`
	});
};

// 车辆异常
const handleReport = (order: any) => {
	uni.navigateTo({
		url: `/pages/order/report?orderId=${order.id}&orderNo=${order.orderNo}`
	});
};

// 删除订单
const handleDelete = async (order: any) => {
	try {
		const res = await uni.showModal({
			title: '确认删除',
			content: '删除后无法恢复，确定要删除该订单吗？',
			confirmText: '确认删除',
			cancelText: '取消'
		});

		if (res.confirm) {
			// 从列表中移除
			const index = orders.value.findIndex(o => o.id === order.id);
			if (index > -1) {
				orders.value.splice(index, 1);
			}

			uni.showToast({ title: '订单已删除', icon: 'success' });
		}
	} catch (error) {
		// 用户取消操作
	}
};

// 再次预订
const handleRebook = (order: any) => {
	if (!order.vehicleId) {
		uni.showToast({ title: '车辆信息缺失', icon: 'none' });
		return;
	}

	uni.navigateTo({
		url: `/pages/vehicle/detail?id=${order.vehicleId}`
	});
};

const goToDetail = (order: any) => {
	uni.navigateTo({
		url: `/pages/order/detail?id=${order.id}`
	});
};

// 页面初始化时的设置
const setupOrderListPage = (options: any) => {
	// 如果有状态参数，设置当前状态
	if (options.status) {
		currentStatus.value = options.status;
	}
	pageReady.value = true;
	loadOrders();
};

// 确保用户已登录
const ensureAuth = (options: any) => {
	redirectUrl.value = buildRedirectUrl('/pages/order/list', options || {});
	if (isLoggedIn()) {
		return true;
	}
	return requireLogin(redirectUrl.value);
};

// 页面加载时检查登录状态
onLoad((options: any) => {
	cachedRouteParams = options || {};
	pageReady.value = false;
	if (!ensureAuth(cachedRouteParams)) {
		return;
	}
	setupOrderListPage(cachedRouteParams);
});

// 页面显示时检查登录状态（从登录页返回时）
onShow(() => {
	if (!pageReady.value && cachedRouteParams && isLoggedIn()) {
		setupOrderListPage(cachedRouteParams);
	}
});
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
