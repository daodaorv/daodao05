<template>
	<view class="pay-page">
		<!-- 倒计时区域 -->
		<view class="timer-section">
			<text class="timer-label">支付剩余时间</text>
			<uni-countdown 
				:show-day="false" 
				:hour="0" 
				:minute="15" 
				:second="0" 
				color="#FF9F29" 
				splitor-color="#333"
				@timeup="onTimeUp"
			></uni-countdown>
			<view class="amount-box">
				<text class="currency">¥</text>
				<text class="amount">{{ orderAmount }}</text>
			</view>
			<text class="order-no">订单编号：{{ orderNo }}</text>
		</view>

		<!-- 支付方式列表 -->
		<view class="payment-list">
			<view class="section-title">选择支付方式</view>
			
			<!-- 余额支付 -->
			<view class="payment-item">
				<view class="payment-info">
					<view class="icon-box balance">
						<u-icon name="rmb-circle-fill" size="24" color="#FFFFFF"></u-icon>
					</view>
					<view class="payment-text">
						<text class="name">余额支付</text>
						<text class="desc">可用余额 ¥{{ userBalance }}</text>
					</view>
				</view>
				<view class="action-box">
					<text v-if="useBalance" class="deduction-text">-¥{{ deductionAmount }}</text>
					<switch 
						:checked="useBalance" 
						color="#FF9F29" 
						style="transform:scale(0.8)"
						@change="toggleBalance"
						:disabled="userBalance <= 0"
					/>
				</view>
			</view>

			<!-- 微信支付 -->
			<!-- #ifdef MP-WEIXIN || APP-PLUS || H5 -->
			<view
				class="payment-item"
				:class="{ disabled: isBalanceCovered }"
				@tap="selectPayment('wxpay')"
			>
				<view class="payment-info">
					<view class="icon-box wechat">
						<u-icon name="weixin-circle-fill" size="24" color="#FFFFFF"></u-icon>
					</view>
					<view class="payment-text">
						<text class="name">微信支付</text>
						<text class="desc">推荐使用微信支付</text>
					</view>
				</view>
				<u-icon 
					v-if="!isBalanceCovered"
					:name="selectedPayment === 'wxpay' ? 'checkmark-circle-fill' : 'checkmark-circle'" 
					size="24" 
					:color="selectedPayment === 'wxpay' ? '#FF9F29' : '#DDD'">
				</u-icon>
			</view>
			<!-- #endif -->

			<!-- 支付宝支付 -->
			<!-- #ifdef MP-ALIPAY || APP-PLUS || H5 -->
			<view 
				class="payment-item"
				:class="{ disabled: isBalanceCovered }"
				@tap="selectPayment('alipay')"
			>
				<view class="payment-info">
					<view class="icon-box alipay">
						<text class="alipay-text">支</text>
					</view>
					<view class="payment-text">
						<text class="name">支付宝支付</text>
						<text class="desc">数亿用户的选择</text>
					</view>
				</view>
				<u-icon 
					v-if="!isBalanceCovered"
					:name="selectedPayment === 'alipay' ? 'checkmark-circle-fill' : 'checkmark-circle'" 
					size="24" 
					:color="selectedPayment === 'alipay' ? '#FF9F29' : '#DDD'">
				</u-icon>
			</view>
			<!-- #endif -->
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="total-info">
				<text class="label">实际支付</text>
				<view class="price">
					<text class="currency">¥</text>
					<text class="value">{{ cashAmount }}</text>
				</view>
			</view>
			<button 
				class="pay-btn" 
				:loading="submitting"
				@tap="handlePay"
			>
				立即支付
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { updateOrderStatus, getOrderDetail } from '@/api/order';
import { lockVehicle } from '@/api/vehicle';
import { sendNotification, notifyStore } from '@/api/notification';
import { requireLogin, isLoggedIn, buildRedirectUrl } from '@/utils/auth';

// 模拟数据
const orderNo = ref('DD202512010001');
const orderAmount = ref(1280.00);
const pageReady = ref(false);
const redirectUrl = ref('/pages/order/pay');
let cachedRouteParams: Record<string, any> | null = null;
const userBalance = ref(500.00);

// 状态控制
const useBalance = ref(false);
// 根据平台设置默认支付方式
let defaultPayment = 'wxpay';
// #ifdef MP-ALIPAY
defaultPayment = 'alipay';
// #endif
const selectedPayment = ref(defaultPayment);
const submitting = ref(false);

// 计算属性：余额抵扣金额
const deductionAmount = computed(() => {
	if (!useBalance.value) return 0;
	return Math.min(orderAmount.value, userBalance.value);
});

// 计算属性：是否余额全额覆盖
const isBalanceCovered = computed(() => {
	return deductionAmount.value >= orderAmount.value;
});

// 计算属性：现金支付金额
const cashAmount = computed(() => {
	const amount = orderAmount.value - deductionAmount.value;
	return amount.toFixed(2);
});

// 切换余额支付
const toggleBalance = (e: any) => {
	useBalance.value = e.detail.value;

	// 如果余额全额覆盖，清除第三方支付选择
	if (isBalanceCovered.value) {
		selectedPayment.value = '';
	} else if (!selectedPayment.value) {
		// 如果取消全额覆盖，恢复默认支付方式
		// #ifdef MP-ALIPAY
		selectedPayment.value = 'alipay';
		// #endif
		// #ifndef MP-ALIPAY
		selectedPayment.value = 'wxpay';
		// #endif
	}
};

// 选择支付方式
const selectPayment = (type: string) => {
	if (isBalanceCovered.value) return;
	selectedPayment.value = type;
};

// 倒计时结束
const onTimeUp = () => {
	uni.showModal({
		title: '提示',
		content: '支付超时，订单已取消',
		showCancel: false,
		success: () => {
			uni.navigateBack();
		}
	});
};

// Mock支付实现
const mockPayment = (paymentData: any) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				paymentNo: 'PAY' + Date.now(),
				orderNo: paymentData.orderNo,
				amount: paymentData.amount,
				paymentMethod: paymentData.paymentMethod,
				paidAt: new Date().toISOString()
			});
		}, 1500);
	});
};

// 支付成功处理
const handlePaymentSuccess = async (result: any) => {
	try {
		// 1. 显示支付成功提示
		uni.showToast({
			title: '支付成功',
			icon: 'success',
			duration: 2000
		});

		// 2. 更新订单状态（待支付 → 待确认）
		await updateOrderStatus(result.orderNo, 'pending_confirmation');

		// 3. 获取订单详情用于后续操作
		const orderResponse: any = await getOrderDetail(result.orderNo);
		const orderDetail = orderResponse.data;

		// 4. 锁定车辆库存
		if (orderDetail.vehicle?.id) {
			await lockVehicle({
				vehicleId: orderDetail.vehicle.id,
				orderNo: result.orderNo,
				startDate: orderDetail.pickupTime,
				endDate: orderDetail.returnTime
			});
		}

		// 5. 发送用户通知
		await sendNotification({
			type: 'payment_success',
			orderNo: result.orderNo,
			userId: 'current_user_id', // 实际应从用户store获取
			title: '支付成功',
			content: `订单${result.orderNo}支付成功，等待门店确认`
		});

		// 6. 通知门店
		if (orderDetail.pickupStore?.id) {
			await notifyStore({
				storeId: orderDetail.pickupStore.id,
				orderNo: result.orderNo,
				type: 'payment_success'
			});
		}

		// 7. 延迟跳转到订单详情页
		setTimeout(() => {
			uni.redirectTo({
				url: `/pages/order/detail?orderNo=${result.orderNo}`
			});
		}, 2000);

	} catch (error) {
		logger.error('支付成功后处理失败:', error);
		// 即使后续处理失败，也跳转到订单详情页
		setTimeout(() => {
			uni.redirectTo({
				url: `/pages/order/detail?orderNo=${result.orderNo}`
			});
		}, 2000);
	}
};

// 支付处理
const handlePay = async () => {
	if (!isLoggedIn()) {
		requireLogin(redirectUrl.value);
		return;
	}
	if (submitting.value) return;

	// 验证支付方式
	if (!isBalanceCovered.value && !selectedPayment.value) {
		uni.showToast({
			title: '请选择支付方式',
			icon: 'none'
		});
		return;
	}

	submitting.value = true;

	try {
		// 构建支付数据
		const paymentData: any = {
			orderNo: orderNo.value,
			paymentMethod: selectedPayment.value || 'balance',
			amount: parseFloat(cashAmount.value),
			splitPayment: []
		};

		// 如果使用余额抵扣
		if (useBalance.value && deductionAmount.value > 0) {
			paymentData.splitPayment.push({
				method: 'balance',
				amount: deductionAmount.value
			});
		}

		// 如果需要第三方支付
		if (parseFloat(cashAmount.value) > 0) {
			paymentData.splitPayment.push({
				method: selectedPayment.value,
				amount: parseFloat(cashAmount.value)
			});
		}

		// 调用支付API（Mock实现）
		uni.showLoading({ title: '支付处理中...' });

		const result: any = await mockPayment(paymentData);

		uni.hideLoading();

		// 支付成功处理
		if (result.success) {
			await handlePaymentSuccess(result);
		} else {
			throw new Error(result.message || '支付失败');
		}

	} catch (error: any) {
		uni.hideLoading();
		uni.showToast({
			title: error.message || '支付失败，请重试',
			icon: 'none'
		});
	} finally {
		submitting.value = false;
	}
};

const setupPayPage = (options: any) => {
	if (options.orderNo) {
		orderNo.value = options.orderNo;
	}
	if (options.amount) {
		orderAmount.value = Number(options.amount);
	}
	pageReady.value = true;
};

const ensureAuth = (options: any) => {
	redirectUrl.value = buildRedirectUrl('/pages/order/pay', options || {});
	if (isLoggedIn()) {
		return true;
	}
	return requireLogin(redirectUrl.value);
};

onLoad((options: any) => {
	cachedRouteParams = options || {};
	pageReady.value = false;
	if (!ensureAuth(cachedRouteParams)) {
		return;
	}
	setupPayPage(cachedRouteParams);
});

onShow(() => {
	if (!pageReady.value && cachedRouteParams && isLoggedIn()) {
		setupPayPage(cachedRouteParams);
	}
});
</script>

<style scoped lang="scss">
.pay-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.timer-section {
	background-color: #FFFFFF;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $uni-spacing-md;
	margin-bottom: 20rpx;
	border-radius: $uni-radius-lg;
	margin: 0 $uni-spacing-lg $uni-spacing-md;
	box-shadow: $uni-shadow-card;
}

.timer-label {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.amount-box {
	margin: 20rpx 0;
	display: flex;
	align-items: baseline;
	color: $uni-text-color;

	.currency {
		font-size: 32rpx;
		font-weight: bold;
	}

	.amount {
		font-size: 60rpx;
		font-weight: bold;
		font-family: DIN;
	}
}

.order-no {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.payment-list {
	background-color: #FFFFFF;
	padding: 0 $uni-spacing-lg;
	border-radius: $uni-radius-lg;
	margin: 0 $uni-spacing-lg $uni-spacing-md;
	box-shadow: $uni-shadow-card;
}

.section-title {
	font-size: 28rpx;
	color: $uni-text-color-placeholder;
	padding: $uni-spacing-md 0;
}

.payment-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: $uni-spacing-lg 0;
	border-bottom: 1rpx solid $uni-border-color-light;

	&:last-child {
		border-bottom: none;
	}

	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}

.payment-info {
	display: flex;
	align-items: center;
	gap: $uni-spacing-md;
}

.icon-box {
	width: 64rpx;
	height: 64rpx;
	border-radius: $uni-radius-sm;
	display: flex;
	align-items: center;
	justify-content: center;

	&.balance {
		background: $uni-color-primary-gradient;
	}

	&.wechat {
		background-color: #07C160;
	}

	&.alipay {
		background-color: #1677FF;
	}
}

.alipay-text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

.payment-text {
	display: flex;
	flex-direction: column;
	gap: 4rpx;

	.name {
		font-size: 30rpx;
		color: $uni-text-color;
		font-weight: 500;
	}

	.desc {
		font-size: 24rpx;
		color: $uni-text-color-placeholder;
	}
}

.action-box {
	display: flex;
	align-items: center;
	gap: $uni-spacing-md;
}

.deduction-text {
	font-size: 28rpx;
	color: $uni-color-primary;
	font-weight: 500;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	padding: 20rpx $uni-spacing-lg;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.total-info {
	display: flex;
	flex-direction: column;

	.label {
		font-size: 24rpx;
		color: $uni-text-color-secondary;
	}

	.price {
		display: flex;
		align-items: baseline;
		color: $uni-color-primary;

		.currency {
			font-size: 24rpx;
			font-weight: bold;
		}

		.value {
			font-size: 40rpx;
			font-weight: bold;
			margin-left: 4rpx;
		}
	}
}

.pay-btn {
	margin: 0;
	padding: 0 64rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: $uni-color-primary-gradient;
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: bold;
	border-radius: $uni-radius-btn;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.35);
	transition: all 0.3s ease;

	&::after {
		border: none;
	}

	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.3);
	}
}
</style>
