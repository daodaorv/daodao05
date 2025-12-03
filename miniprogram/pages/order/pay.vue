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
						<u-icon name="wallet-fill" size="24" color="#FFFFFF"></u-icon>
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
						<u-icon name="weixin" size="24" color="#FFFFFF"></u-icon>
					</view>
					<view class="payment-text">
						<text class="name">微信支付</text>
						<text class="desc">推荐使用微信支付</text>
					</view>
				</view>
				<u-icon 
					v-if="!isBalanceCovered"
					:name="selectedPayment === 'wxpay' ? 'checkbox-filled' : 'circle'" 
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
					:name="selectedPayment === 'alipay' ? 'checkbox-filled' : 'circle'" 
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
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 模拟数据
const orderNo = ref('DD202411270001');
const orderAmount = ref(1280.00);
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

// 支付处理
const handlePay = async () => {
	if (submitting.value) return;
	
	submitting.value = true;
	
	try {
		// 模拟支付过程
		uni.showLoading({ title: '支付中...' });
		
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		uni.hideLoading();
		
		// 支付功能开发中
		uni.showToast({
			title: '支付功能开发中',
			icon: 'none'
		});
		
		// 模拟跳转(可选，如果只是提示开发中，可能不需要跳转)
		// setTimeout(() => {
		// 	uni.navigateBack({
		// 		delta: 2
		// 	});
		// }, 1500);
		
	} catch (e) {
		uni.showToast({
			title: '支付失败',
			icon: 'none'
		});
	} finally {
		submitting.value = false;
	}
};

onLoad((options: any) => {
	if (options.orderNo) {
		orderNo.value = options.orderNo;
	}
	if (options.amount) {
		orderAmount.value = Number(options.amount);
	}
});
</script>

<style scoped lang="scss">
.pay-page {
	min-height: 100vh;
	background-color: #F8F8F8;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.timer-section {
	background-color: #FFFFFF;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.timer-label {
	font-size: 24rpx;
	color: #666;
}

.amount-box {
	margin: 20rpx 0;
	display: flex;
	align-items: baseline;
	color: #333;
	
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
	color: #999;
}

.payment-list {
	background-color: #FFFFFF;
	padding: 0 32rpx;
}

.section-title {
	font-size: 28rpx;
	color: #999;
	padding: 24rpx 0;
}

.payment-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	
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
	gap: 24rpx;
}

.icon-box {
	width: 64rpx;
	height: 64rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&.balance {
		background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
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
		color: #333;
		font-weight: 500;
	}
	
	.desc {
		font-size: 24rpx;
		color: #999;
	}
}

.action-box {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.deduction-text {
	font-size: 28rpx;
	color: #FF9F29;
	font-weight: 500;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	padding: 20rpx 32rpx;
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
		color: #666;
	}
	
	.price {
		display: flex;
		align-items: baseline;
		color: #FF9F29;
		
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
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: bold;
	border-radius: 40rpx;
	
	&::after {
		border: none;
	}
}
</style>
