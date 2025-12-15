<template>
	<view class="order-detail-page">
		<!-- 沉浸式头部背景 -->
		<view class="header-bg" :style="{ background: statusMeta.bgGradient }">
			<view class="bg-mask"></view>
		</view>

		<!-- 导航栏占位 (透明) -->
		<view :style="{ height: statusBarHeight + 44 + 'px' }">
			<!-- 这里可以放自定义返回按钮 -->
			<view class="nav-back" :style="{ top: statusBarHeight + 8 + 'px' }" @tap="goBack">
				<u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
				<text class="nav-title">订单详情</text>
			</view>
		</view>

		<scroll-view scroll-y class="detail-scroll">
			<view class="content-container">
				<!-- 状态卡片 -->
				<view class="status-card">
					<view class="status-main">
						<u-icon :name="statusMeta.icon" size="32" color="#FFFFFF"></u-icon>
						<text class="status-title">{{ statusMeta.title }}</text>
					</view>
					<text class="status-desc">{{ statusMeta.desc }}</text>
					
					<!-- 状态操作栏 (仅在部分状态显示) -->
					<view v-if="showStatusActions" class="status-actions">
						<button v-if="canCancel" class="status-btn ghost" @tap="cancelOrder">取消订单</button>
						<button v-if="canPay" class="status-btn primary" @tap="goToPayment">立即支付</button>
					</view>
				</view>

				<!-- 车辆卡片 -->
				<view class="detail-card vehicle-card" @tap="goToVehicle">
					<view class="card-header">
						<text class="card-title">预订车辆</text>
						<u-icon name="arrow-right" size="12" color="#CCC"></u-icon>
					</view>
					<view class="vehicle-body">
						<image class="vehicle-img" :src="order.vehicleImage" mode="aspectFill"></image>
						<view class="vehicle-info">
							<text class="v-name">{{ order.vehicleName }}</text>
							<text class="v-spec">{{ order.vehicleSpec || '自动挡 | 4座2卧' }}</text>
							<view class="v-tags">
								<text class="tag">免费取消</text>
								<text class="tag">到店付</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 行程卡片 (Timeline Visual) -->
				<view class="detail-card trip-card">
					<view class="trip-row">
						<view class="trip-point">
							<view class="time-label">取车</view>
							<text class="time-val">{{ formatTime(order.pickupTime) }}</text>
							<text class="date-val">{{ formatDate(order.pickupTime) }}</text>
							<text class="store-val">{{ order.pickupStoreName }}</text>
						</view>
						
						<view class="trip-duration">
							<view class="line"></view>
							<view class="day-badge">{{ duration }}天</view>
						</view>
						
						<view class="trip-point right">
							<view class="time-label">还车</view>
							<text class="time-val">{{ formatTime(order.returnTime) }}</text>
							<text class="date-val">{{ formatDate(order.returnTime) }}</text>
							<text class="store-val">{{ order.returnStoreName }}</text>
						</view>
					</view>
				</view>

				<!-- 费用明细 -->
				<view class="detail-card fee-card">
					<view class="card-header">
						<text class="card-title">费用明细</text>
					</view>
					<view class="fee-list">
						<view class="fee-item">
							<text class="fee-name">车辆租金 ({{ duration }}天)</text>
							<text class="fee-amount">¥{{ order.rentalFee }}</text>
						</view>
						<view class="fee-item">
							<text class="fee-name">基础服务费</text>
							<text class="fee-amount">¥{{ order.serviceFee }}</text>
						</view>
						<view class="fee-item discount" v-if="order.discountAmount > 0">
							<text class="fee-name">优惠减免</text>
							<text class="fee-amount">-¥{{ order.discountAmount }}</text>
						</view>
						<view class="divider"></view>
						<view class="total-row">
							<text class="total-label">实付金额</text>
							<text class="total-amount">¥{{ order.totalAmount }}</text>
						</view>
					</view>
				</view>

				<!-- 订单信息 -->
				<view class="detail-card info-card">
					<view class="card-header">
						<text class="card-title">订单信息</text>
					</view>
					<view class="info-list">
						<view class="info-item">
							<text class="label">订单编号</text>
							<view class="value-box">
								<text class="value">{{ order.orderNo }}</text>
								<text class="copy-btn" @tap="copyText(order.orderNo)">复制</text>
							</view>
						</view>
						<view class="info-item">
							<text class="label">下单时间</text>
							<text class="value">{{ order.createdAt }}</text>
						</view>
						<view class="info-item">
							<text class="label">联系人</text>
							<text class="value">{{ order.contactName }} {{ order.contactPhone }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="bottom-safe-area"></view>
		</scroll-view>

		<!-- 底部操作栏 (Fixed) -->
		<view class="bottom-bar">
			<view class="service-btn" @tap="contactService">
				<u-icon name="server-fill" size="20" color="#4E5969"></u-icon>
				<text>客服</text>
			</view>
			<view class="action-group">
				<button v-if="canCancel" class="btn ghost" @tap="cancelOrder">取消订单</button>
				<button v-if="canPay" class="btn primary" @tap="goToPayment">去支付</button>
				<button v-if="order.status === 'completed'" class="btn ghost" @tap="rebook">再次预订</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { getOrderDetail } from '@/api/order';

const statusBarHeight = ref(0);
const order = ref<any>({
	id: '1',
	orderNo: 'ORD20241206001',
	status: 'pending_payment',
	vehicleName: '上汽大通RG10 生活家V90',
	vehicleImage: '/static/场景推荐2.jpg',
	vehicleSpec: '自动挡 | 4座2卧 | 2.0T柴油',
	pickupTime: '2024-12-10 10:00:00',
	returnTime: '2024-12-12 10:00:00',
	pickupStoreName: '深圳宝安店',
	returnStoreName: '深圳宝安店',
	rentalFee: 1200,
	serviceFee: 160,
	discountAmount: 0,
	totalAmount: 1360,
	createdAt: '2024-12-06 14:30:20',
	contactName: '张三',
	contactPhone: '13800138000'
});

onLoad(async (options: any) => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;

	if (options.id) {
		// 从 Mock 数据加载订单详情
		try {
			const res: any = await getOrderDetail(options.id);
			if (res.code === 0 && res.data) {
				// 映射数据结构
				const orderData = res.data;
				order.value = {
					id: orderData.id,
					orderNo: orderData.orderNo,
					status: orderData.status.code,
					vehicleName: orderData.vehicle?.name || '未知车辆',
					vehicleImage: orderData.vehicle?.images?.[0] || '/static/logo.png',
					vehicleSpec: `${orderData.vehicle?.specifications?.transmission || ''} | ${orderData.vehicle?.specifications?.seats || ''}座 | ${orderData.vehicle?.specifications?.fuelType || ''}`,
					pickupTime: orderData.pickupTime,
					returnTime: orderData.returnTime,
					pickupStoreName: orderData.pickupStore?.name || '未知门店',
					returnStoreName: orderData.returnStore?.name || '未知门店',
					rentalFee: orderData.totalAmount - (orderData.actualAmount - orderData.totalAmount),
					serviceFee: 160,
					discountAmount: orderData.totalAmount - orderData.actualAmount,
					totalAmount: orderData.actualAmount,
					createdAt: dayjs(orderData.createdAt).format('YYYY-MM-DD HH:mm:ss'),
					contactName: '张三',
					contactPhone: '138****0000'
				};
				console.log('成功加载订单详情:', options.id, order.value);
			}
		} catch (error) {
			console.error('加载订单详情失败:', error);
			uni.showToast({
				title: '订单不存在',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	}
});

// Computed Properties
const statusMeta = computed(() => {
	const map: any = {
		pending_payment: {
			title: '待支付',
			desc: '请在 29:59 内完成支付，超时将自动取消',
			icon: 'clock',
			bgGradient: 'linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%)'
		},
		pending_confirmation: {
			title: '待确认',
			desc: '订单已提交，等待商家确认',
			icon: 'hourglass',
			bgGradient: 'linear-gradient(135deg, #FFB84D 0%, #FFC966 100%)'
		},
		pending_pickup: {
			title: '待取车',
			desc: '订单已确认，请按时到店取车',
			icon: 'calendar',
			bgGradient: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)'
		},
		in_progress: {
			title: '租赁中',
			desc: '祝您旅途愉快，注意行车安全',
			icon: 'car-fill',
			bgGradient: 'linear-gradient(135deg, #00B578 0%, #4CAF50 100%)'
		},
		pending_return: {
			title: '待还车',
			desc: '请按时到店还车，感谢您的使用',
			icon: 'map',
			bgGradient: 'linear-gradient(135deg, #1890FF 0%, #40A9FF 100%)'
		},
		completed: {
			title: '已完成',
			desc: '订单已完成，期待下次为您服务',
			icon: 'checkmark-circle-fill',
			bgGradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)'
		},
		cancelled: {
			title: '已取消',
			desc: '订单已取消',
			icon: 'close-circle-fill',
			bgGradient: 'linear-gradient(135deg, #999999 0%, #BBBBBB 100%)'
		}
	};
	return map[order.value.status] || map.pending_payment;
});

const duration = computed(() => {
	return dayjs(order.value.returnTime).diff(dayjs(order.value.pickupTime), 'day');
});

const canCancel = computed(() => ['pending_payment', 'pending_pickup'].includes(order.value.status));
const canPay = computed(() => order.value.status === 'pending_payment');
const showStatusActions = computed(() => canCancel.value || canPay.value);

// Methods
const goBack = () => uni.navigateBack();

const formatTime = (str: string) => dayjs(str).format('HH:mm');
const formatDate = (str: string) => dayjs(str).format('MM月DD日');

const cancelOrder = () => uni.showToast({ title: '取消订单', icon: 'none' });
const goToPayment = () => uni.showToast({ title: '去支付', icon: 'none' });
const rebook = () => uni.showToast({ title: '再次预订', icon: 'none' });
const contactService = () => uni.showToast({ title: '联系客服', icon: 'none' });
const goToVehicle = () => uni.showToast({ title: '查看车辆', icon: 'none' });

const copyText = (text: string) => {
	uni.setClipboardData({
		data: text,
		success: () => uni.showToast({ title: '已复制' })
	});
};
</script>

<style scoped lang="scss">
.order-detail-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

.header-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 400rpx;
	z-index: 0;
}

.nav-back {
	position: fixed;
	left: 32rpx;
	z-index: 100;
	display: flex;
	align-items: center;
	gap: 8rpx;
	
	.nav-title {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: 600;
	}
}

.detail-scroll {
	flex: 1;
	height: 0;
	position: relative;
	z-index: 1;
}

.content-container {
	padding: 0 $uni-spacing-lg;
}

/* 状态卡片 */
.status-card {
	margin-top: 20rpx;
	margin-bottom: $uni-spacing-lg;
	color: #FFFFFF;
	
	.status-main {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 8rpx;
	}
	
	.status-title {
		font-size: 40rpx;
		font-weight: bold;
	}
	
	.status-desc {
		font-size: 26rpx;
		opacity: 0.9;
	}
	
	.status-actions {
		margin-top: $uni-spacing-md;
		display: flex;
		gap: 20rpx;
	}
	
	.status-btn {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 26rpx;
		border-radius: 32rpx;
		padding: 0 32rpx;
		
		&.ghost {
			background: rgba(255,255,255,0.2);
			color: #FFFFFF;
			border: 1rpx solid rgba(255,255,255,0.4);
		}
		
		&.primary {
			background: #FFFFFF;
			color: $uni-color-primary;
			font-weight: bold;
			border: none;
		}
	}
}

/* 通用卡片 */
.detail-card {
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;
	box-shadow: $uni-shadow-card;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: $uni-spacing-md;

	.card-title {
		font-size: 30rpx;
		font-weight: bold;
		color: $uni-text-color;
	}
}

/* 车辆卡片 */
.vehicle-body {
	display: flex;
	gap: $uni-spacing-md;
}

.vehicle-img {
	width: 160rpx;
	height: 120rpx;
	border-radius: $uni-radius-sm;
	background-color: #F2F3F5;
}

.vehicle-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	
	.v-name { font-size: 30rpx; font-weight: bold; color: $uni-text-color; }
	.v-spec { font-size: 24rpx; color: $uni-text-color-secondary; }
	
	.v-tags {
		display: flex;
		gap: $uni-spacing-xs;

		.tag {
			font-size: 20rpx;
			color: $uni-color-primary;
			background-color: rgba(255, 159, 41, 0.1);
			padding: 2rpx $uni-spacing-xs;
			border-radius: 6rpx;
		}
	}
}

/* 行程卡片 */
.trip-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.trip-point {
	display: flex;
	flex-direction: column;
	
	&.right { align-items: flex-end; text-align: right; }
	
	.time-label { font-size: 22rpx; color: $uni-text-color-secondary; margin-bottom: 4rpx; }
	.time-val { font-size: 36rpx; font-weight: bold; color: $uni-text-color; font-family: 'DIN Alternate'; }
	.date-val { font-size: 24rpx; color: $uni-text-color; margin-bottom: 4rpx; }
	.store-val { font-size: 22rpx; color: $uni-text-color-secondary; }
}

.trip-duration {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20rpx;
	gap: $uni-spacing-xs;

	.line {
		width: 100%;
		height: 2rpx;
		background-color: $uni-border-color-light;
	}

	.day-badge {
		font-size: 20rpx;
		color: $uni-text-color-secondary;
		background-color: $uni-bg-color;
		padding: 2rpx $uni-spacing-sm;
		border-radius: 20rpx;
	}
}

/* 费用卡片 */
.fee-list {
	display: flex;
	flex-direction: column;
	gap: $uni-spacing-md;
}

.fee-item {
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
	color: $uni-text-color-secondary;

	&.discount { color: #FF4D4F; }

	.fee-amount { font-weight: 500; }
}

.divider {
	height: 1rpx;
	background-color: #F2F3F5;
	margin: $uni-spacing-md 0;
}

.total-row {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.total-label { font-size: 28rpx; font-weight: bold; color: $uni-text-color; }
	.total-amount { font-size: 36rpx; font-weight: bold; color: $uni-color-primary; font-family: 'DIN Alternate'; }
}

/* 信息卡片 */
.info-list {
	display: flex;
	flex-direction: column;
	gap: $uni-spacing-md;
}

.info-item {
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;

	.label { color: $uni-text-color-secondary; }
	.value { color: $uni-text-color; }

	.value-box {
		display: flex;
		align-items: center;
		gap: $uni-spacing-sm;
	}

	.copy-btn {
		font-size: 20rpx;
		color: $uni-color-primary;
		border: 1rpx solid $uni-color-primary;
		padding: 2rpx 10rpx;
		border-radius: 6rpx;
	}
}

.bottom-safe-area {
	height: 180rpx;
}

/* 底部操作栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #FFFFFF;
	padding: 20rpx $uni-spacing-lg;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 99;
}

.service-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	font-size: 20rpx;
	color: $uni-text-color-secondary;
}

.action-group {
	display: flex;
	gap: 20rpx;
}

.btn {
	margin: 0;
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 40rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	transition: all 0.3s ease;

	&.ghost {
		background: #FFFFFF;
		color: $uni-text-color;
		border: 1rpx solid $uni-border-color-light;
	}

	&.primary {
		background: $uni-color-primary-gradient;
		color: #FFFFFF;
		border: none;
		font-weight: bold;
		box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);
	}

	&:active {
		opacity: 0.8;
		transform: scale(0.98);
	}

	&::after { border: none; }
}
</style>