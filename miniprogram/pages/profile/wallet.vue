<template>
	<view class="wallet-page">
		<!-- 余额卡片 -->
		<view class="balance-card">
			<text class="balance-label">账户余额(元)</text>
			<view class="balance-amount">
				<text class="amount-symbol">¥</text>
				<text class="amount-value">{{ walletInfo.balance.toFixed(2) }}</text>
			</view>
			<view class="balance-actions">
				<button class="action-btn primary" @tap="showRechargeDialog">充值</button>
				<button class="action-btn" @tap="showWithdrawDialog">提现</button>
			</view>
			<view v-if="walletInfo.frozenAmount > 0" class="frozen-tip">
				<u-icon name="info" size="14" color="#FF9F29"></u-icon>
				<text>冻结金额:¥{{ walletInfo.frozenAmount.toFixed(2) }}</text>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-links">
			<view class="link-item" @tap="goToPoints">
				<view class="link-icon points">
					<u-icon name="integral" size="24" color="#FF9F29"></u-icon>
				</view>
				<view class="link-info">
					<text class="link-title">积分中心</text>
					<text class="link-desc">当前积分: 1580</text>
				</view>
				<u-icon name="arrow-right" size="16" color="#999"></u-icon>
			</view>
			<view class="link-item" @tap="goToCoupons">
				<view class="link-icon coupons">
					<u-icon name="gift-fill" size="24" color="#F44336"></u-icon>
				</view>
				<view class="link-info">
					<text class="link-title">我的优惠券</text>
					<text class="link-desc">3张可用</text>
				</view>
				<u-icon name="arrow-right" size="16" color="#999"></u-icon>
			</view>
		</view>

		<!-- 交易记录 -->
		<view class="transactions-section">
			<view class="section-header">
				<text class="title">交易记录</text>
			</view>

			<!-- 空状态 -->
			<view v-if="transactions.length === 0" class="empty-state">
				<u-icon name="list" size="80" color="#DDD"></u-icon>
				<text class="empty-text">暂无交易记录</text>
			</view>

			<!-- 交易列表 -->
			<view v-else class="transaction-list">
				<view 
					v-for="item in transactions" 
					:key="item.id"
					class="transaction-item"
				>
					<view class="transaction-info">
						<view class="transaction-type">
							<u-icon 
								:name="getTransactionIcon(item.type)" 
								size="20" 
								:color="getTransactionColor(item.type)"
							></u-icon>
							<text class="type-text">{{ item.description }}</text>
						</view>
						<text class="transaction-time">{{ item.time }}</text>
					</view>
					<view class="transaction-amount" :class="{ 'income': item.type !== 'payment' && item.type !== 'withdraw' }">
						<text>{{ getAmountPrefix(item.type) }}¥{{ item.amount.toFixed(2) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 充值弹窗 -->
		<u-popup :show="showRechargePopup" @close="closeRechargeDialog" mode="center" :closeable="true">
			<view class="dialog">
				<text class="dialog-title">充值</text>
				<view class="amount-options">
					<view
						v-for="amount in rechargeOptions"
						:key="amount"
						class="amount-option"
						:class="{ 'selected': rechargeAmount === amount }"
						@tap="selectRechargeAmount(amount)"
					>
						<text>¥{{ amount }}</text>
					</view>
				</view>
				<input
					class="custom-input"
					v-model.number="customAmount"
					name="digit"
					placeholder="自定义金额"
				/>
				<view class="dialog-actions">
					<button class="cancel-btn" @tap="closeRechargeDialog">取消</button>
					<button class="confirm-btn" @tap="confirmRecharge">确定充值</button>
				</view>
			</view>
		</u-popup>

		<!-- 提现弹窗 -->
		<u-popup :show="showWithdrawPopup" @close="closeWithdrawDialog" mode="center" :closeable="true">
			<view class="dialog">
				<text class="dialog-title">提现</text>
				<view class="withdraw-info">
					<text class="info-text">可提现余额:¥{{ walletInfo.balance.toFixed(2) }}</text>
					<text class="info-tip">提现将在1-3个工作日到账</text>
				</view>
				<input
					class="custom-input"
					v-model.number="withdrawAmount"
					name="digit"
					placeholder="请输入提现金额"
				/>
				<view class="dialog-actions">
					<button class="cancel-btn" @tap="closeWithdrawDialog">取消</button>
					<button class="confirm-btn" @tap="confirmWithdraw">确定提现</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 钱包信息
const walletInfo = ref({
	balance: 1280.50,
	frozenAmount: 0
});

// 充值选项
const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];
const rechargeAmount = ref(0);
const customAmount = ref<number | null>(null);

// 提现金额
const withdrawAmount = ref<number | null>(null);

// 弹窗显示状态
const showRechargePopup = ref(false);
const showWithdrawPopup = ref(false);

// Mock交易记录
const transactions = ref([
	{
		id: 'TX001',
		type: 'recharge',
		amount: 500,
		balance: 1280.50,
		time: '2025-11-29 10:30:00',
		description: '微信充值'
	},
	{
		id: 'TX002',
		type: 'payment',
		amount: 360,
		balance: 780.50,
		time: '2025-11-28 15:20:00',
		description: '订单支付'
	},
	{
		id: 'TX003',
		type: 'refund',
		amount: 360,
		balance: 1140.50,
		time: '2025-11-27 09:15:00',
		description: '订单退款'
	},
	{
		id: 'TX004',
		type: 'withdraw',
		amount: 200,
		balance: 940.50,
		time: '2025-11-26 14:00:00',
		description: '提现到微信'
	}
]);

// 获取交易图标
const getTransactionIcon = (type: string) => {
	const icons: Record<string, string> = {
		recharge: 'plus-circle-fill',
		payment: 'minus-circle-fill',
		refund: 'reload',
		withdraw: 'download'
	};
	return icons[type] || 'info-circle';
};

// 获取交易颜色
const getTransactionColor = (type: string) => {
	const colors: Record<string, string> = {
		recharge: '#4CAF50',
		payment: '#FF4D4F',
		refund: '#FF9F29',
		withdraw: '#2196F3'
	};
	return colors[type] || '#999';
};

// 获取金额前缀
const getAmountPrefix = (type: string) => {
	return (type === 'recharge' || type === 'refund') ? '+' : '-';
};

// 选择充值金额
const selectRechargeAmount = (amount: number) => {
	rechargeAmount.value = amount;
	customAmount.value = null;
};

// 显示充值弹窗
const showRechargeDialog = () => {
	showRechargePopup.value = true;
};

// 关闭充值弹窗
const closeRechargeDialog = () => {
	showRechargePopup.value = false;
	rechargeAmount.value = 0;
	customAmount.value = null;
};

// 确认充值
const confirmRecharge = () => {
	const amount = customAmount.value || rechargeAmount.value;
	
	if (!amount || amount <= 0) {
		uni.showToast({
			title: '请选择或输入充值金额',
			icon: 'none'
		});
		return;
	}

	// Mock充值成功
	walletInfo.value.balance += amount;
	
	// 添加交易记录
	transactions.value.unshift({
		id: `TX${Date.now()}`,
		type: 'recharge',
		amount: amount,
		balance: walletInfo.value.balance,
		time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
		description: '微信充值'
	});

	uni.showToast({
		title: '充值成功!',
		icon: 'success'
	});

	closeRechargeDialog();
};

// 显示提现弹窗
const showWithdrawDialog = () => {
	showWithdrawPopup.value = true;
};

// 关闭提现弹窗
const closeWithdrawDialog = () => {
	showWithdrawPopup.value = false;
	withdrawAmount.value = null;
};

// 确认提现
const confirmWithdraw = () => {
	const amount = withdrawAmount.value;

	if (!amount || amount <= 0) {
		uni.showToast({
			title: '请输入提现金额',
			icon: 'none'
		});
		return;
	}

	if (amount > walletInfo.value.balance) {
		uni.showToast({
			title: '余额不足',
			icon: 'none'
		});
		return;
	}

	// Mock提现成功
	walletInfo.value.balance -= amount;

	// 添加交易记录
	transactions.value.unshift({
		id: `TX${Date.now()}`,
		type: 'withdraw',
		amount: amount,
		balance: walletInfo.value.balance,
		time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
		description: '提现到微信'
	});

	uni.showToast({
		title: '提现申请已提交!',
		icon: 'success'
	});

	closeWithdrawDialog();
};

// 跳转到积分中心
const goToPoints = () => {
	uni.navigateTo({
		url: '/pages/profile/points'
	});
};

// 跳转到优惠券页面
const goToCoupons = () => {
	uni.navigateTo({
		url: '/pages/profile/coupons'
	});
};
</script>

<style lang="scss" scoped>
.wallet-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
}

// 余额卡片
.balance-card {
	background: $uni-color-primary-gradient;
	margin: $uni-spacing-md $uni-spacing-md 0;
	border-radius: $uni-radius-lg;
	padding: 48rpx $uni-spacing-lg;
	color: #FFFFFF;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.3);

	.balance-label {
		font-size: 28rpx;
		opacity: 0.9;
		display: block;
		margin-bottom: $uni-spacing-md;
	}

	.balance-amount {
		display: flex;
		align-items: baseline;
		margin-bottom: $uni-spacing-lg;

		.amount-symbol {
			font-size: 40rpx;
			font-weight: 600;
		}

		.amount-value {
			font-size: 72rpx;
			font-weight: bold;
			margin-left: $uni-spacing-xs;
		}
	}

	.balance-actions {
		display: flex;
		gap: $uni-spacing-md;

		.action-btn {
			flex: 1;
			padding: 20rpx;
			border-radius: $uni-radius-btn;
			font-size: 30rpx;
			border: none;
			transition: all 0.3s ease;

			&.primary {
				background-color: #FFFFFF;
				color: $uni-color-primary;
			}

			&:not(.primary) {
				background-color: rgba(255, 255, 255, 0.2);
				color: #FFFFFF;
			}

			&:active {
				opacity: 0.8;
				transform: scale(0.98);
			}
		}
	}

	.frozen-tip {
		margin-top: $uni-spacing-md;
		display: flex;
		align-items: center;
		gap: $uni-spacing-xs;
		font-size: 24rpx;
		opacity: 0.9;
	}
}

// 快捷入口
.quick-links {
	background-color: #FFFFFF;
	margin: $uni-spacing-md;
	border-radius: $uni-radius-md;
	padding: 0 $uni-spacing-md;

	.link-item {
		display: flex;
		align-items: center;
		padding: $uni-spacing-lg 0;
		border-bottom: 2rpx solid $uni-border-color-light;

		&:last-child {
			border-bottom: none;
		}

		&:active {
			opacity: 0.7;
		}

		.link-icon {
			width: 72rpx;
			height: 72rpx;
			border-radius: $uni-radius-md;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: $uni-spacing-md;

			&.points {
				background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
			}

			&.coupons {
				background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
			}
		}

		.link-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: $uni-spacing-xs;

			.link-title {
				font-size: 30rpx;
				font-weight: 500;
				color: $uni-text-color;
			}

			.link-desc {
				font-size: 24rpx;
				color: $uni-text-color-secondary;
			}
		}
	}
}

// 交易记录区
.transactions-section {
	background-color: #FFFFFF;
	margin: $uni-spacing-md;
	border-radius: $uni-radius-md;
	padding: $uni-spacing-md;

	.section-header {
		margin-bottom: $uni-spacing-md;

		.title {
			font-size: 32rpx;
			font-weight: 600;
			color: $uni-text-color;
		}
	}
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;

	.empty-text {
		font-size: 28rpx;
		color: $uni-text-color-placeholder;
		margin-top: $uni-spacing-md;
	}
}

// 交易列表
.transaction-list {
	.transaction-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: $uni-spacing-md 0;
		border-bottom: 2rpx solid $uni-border-color-light;

		&:last-child {
			border-bottom: none;
		}

		.transaction-info {
			flex: 1;

			.transaction-type {
				display: flex;
				align-items: center;
				gap: $uni-spacing-sm;
				margin-bottom: $uni-spacing-xs;

				.type-text {
					font-size: 30rpx;
					color: $uni-text-color;
				}
			}

			.transaction-time {
				font-size: 24rpx;
				color: $uni-text-color-placeholder;
			}
		}

		.transaction-amount {
			font-size: 32rpx;
			font-weight: 600;
			color: #FF4D4F;

			&.income {
				color: #4CAF50;
			}
		}
	}
}

// 弹窗样式
.dialog {
	width: 600rpx;
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	padding: 48rpx $uni-spacing-lg $uni-spacing-lg;

	.dialog-title {
		display: block;
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 40rpx;
	}

	.amount-options {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $uni-spacing-md;
		margin-bottom: $uni-spacing-md;

		.amount-option {
			padding: $uni-spacing-md;
			text-align: center;
			border: 2rpx solid $uni-border-color-light;
			border-radius: $uni-radius-sm;
			font-size: 30rpx;
			color: $uni-text-color-secondary;
			transition: all 0.3s ease;

			&.selected {
				border-color: $uni-color-primary;
				background-color: rgba(255, 159, 41, 0.1);
				color: $uni-color-primary;
				font-weight: 600;
			}

			&:active {
				opacity: 0.7;
			}
		}
	}

	.custom-input {
		width: 100%;
		padding: $uni-spacing-md;
		border: 2rpx solid $uni-border-color-light;
		border-radius: $uni-radius-sm;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.withdraw-info {
		background-color: $uni-bg-color;
		padding: $uni-spacing-md;
		border-radius: $uni-radius-sm;
		margin-bottom: $uni-spacing-md;

		.info-text {
			display: block;
			font-size: 28rpx;
			color: $uni-text-color;
			margin-bottom: $uni-spacing-xs;
		}

		.info-tip {
			display: block;
			font-size: 24rpx;
			color: $uni-text-color-secondary;
		}
	}

	.dialog-actions {
		display: flex;
		gap: $uni-spacing-md;

		button {
			flex: 1;
			padding: 20rpx;
			border-radius: $uni-radius-btn;
			font-size: 30rpx;
			border: none;
			transition: all 0.3s ease;

			&:active {
				opacity: 0.8;
				transform: scale(0.98);
			}
		}

		.cancel-btn {
			background-color: $uni-bg-color;
			color: $uni-text-color-secondary;
		}

		.confirm-btn {
			background: $uni-color-primary-gradient;
			color: #FFFFFF;
		}
	}
}
</style>
