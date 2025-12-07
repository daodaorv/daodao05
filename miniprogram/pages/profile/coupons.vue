<template>
	<view class="coupons-page">
		<!-- 顶部Tab切换 -->
		<view class="tabs-header">
			<view
				v-for="(tab, index) in tabs"
				:key="index"
				class="tab-item"
				:class="{ 'active': currentTab === index }"
				@tap="switchTab(index)"
			>
				<text class="tab-text">{{ tab.name }}</text>
				<text v-if="tab.count > 0" class="tab-count">({{ tab.count }})</text>
			</view>
		</view>

		<!-- 使用统计卡片 -->
		<view class="stats-card">
			<view class="stats-header">
				<u-icon name="chart-fill" size="20" color="#FF9F29"></u-icon>
				<text class="stats-title">优惠券统计</text>
			</view>
			<view class="stats-content">
				<view class="stat-item">
					<text class="stat-value">{{ couponStats.totalSaved }}</text>
					<text class="stat-label">累计节省(元)</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ couponStats.usedCount }}</text>
					<text class="stat-label">已使用(张)</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ couponStats.availableCount }}</text>
					<text class="stat-label">可用(张)</text>
				</view>
			</view>
		</view>

		<!-- 优惠券列表 -->
		<scroll-view class="coupons-list" scroll-y="true">
			<!-- 空状态 -->
			<view v-if="filteredCoupons.length === 0" class="empty-state">
				<u-icon name="gift" size="80" color="#DDD"></u-icon>
				<text class="empty-text">暂无{{ tabs[currentTab].name }}优惠券</text>
			</view>

			<!-- 优惠券卡片 -->
			<view v-else class="coupon-cards">
				<view
					v-for="coupon in filteredCoupons"
					:key="coupon.id"
					class="coupon-card"
					:class="{ 'disabled': coupon.status !== 'available', 'expiring-soon': isExpiringSoon(coupon) }"
				>
					<!-- 即将过期标签 -->
					<view v-if="isExpiringSoon(coupon)" class="expiring-badge">
						<u-icon name="info-circle-fill" size="14" color="#FF4D4F"></u-icon>
						<text class="badge-text">即将过期</text>
					</view>

					<view class="coupon-left">
						<view class="coupon-amount">
							<text class="amount-symbol">¥</text>
							<text class="amount-value">{{ coupon.amount }}</text>
						</view>
						<text class="coupon-condition">满{{ coupon.minAmount }}元可用</text>
					</view>
					<view class="coupon-right">
						<text class="coupon-name">{{ coupon.name }}</text>
						<text class="coupon-desc">{{ coupon.description }}</text>
						<view class="coupon-time-row">
							<text class="coupon-time">有效期:{{ formatDate(coupon.validFrom) }} - {{ formatDate(coupon.validTo) }}</text>
							<text v-if="isExpiringSoon(coupon)" class="expiring-days">还剩{{ getDaysUntilExpiry(coupon) }}天</text>
						</view>
						<view class="coupon-actions">
							<button
								v-if="coupon.status === 'available'"
								class="use-btn"
								@tap="useCoupon(coupon)"
							>
								立即使用
							</button>
							<text v-else-if="coupon.status === 'used'" class="status-tag used">已使用</text>
							<text v-else class="status-tag expired">已过期</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部兑换入口 -->
		<view class="exchange-footer">
			<button class="exchange-btn" @tap="showExchangeDialog">兑换优惠券</button>
		</view>

		<!-- 兑换弹窗 -->
		<uni-popup ref="exchangePopup" name="center">
			<view class="exchange-dialog">
				<text class="dialog-title">兑换优惠券</text>
				<input 
					class="exchange-input" 
					v-model="exchangeCode"
					placeholder="请输入兑换码"
					maxlength="20"
				/>
				<view class="dialog-actions">
					<button class="cancel-btn" @tap="closeExchangeDialog">取消</button>
					<button class="confirm-btn" @tap="confirmExchange">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Tab选项
const tabs = ref([
	{ name: '可用', status: 'available', count: 3 },
	{ name: '已使用', status: 'used', count: 5 },
	{ name: '已过期', status: 'expired', count: 2 }
]);

const currentTab = ref(0);

// 兑换码
const exchangeCode = ref('');
const exchangePopup = ref(null);

// Mock优惠券数据
const coupons = ref([
	{
		id: 'CP001',
		name: '租车满减券',
		description: '适用于所有房车租赁订单',
		type: 'discount',
		amount: 100,
		minAmount: 500,
		validFrom: '2025-11-01',
		validTo: '2025-12-31',
		status: 'available'
	},
	{
		id: 'CP002',
		name: '新用户专享券',
		description: '首次下单专享优惠',
		type: 'discount',
		amount: 200,
		minAmount: 1000,
		validFrom: '2025-11-01',
		validTo: '2025-12-31',
		status: 'available'
	},
	{
		id: 'CP003',
		name: '周末特惠券',
		description: '周末租车享优惠',
		type: 'discount',
		amount: 50,
		minAmount: 300,
		validFrom: '2025-11-01',
		validTo: '2025-12-31',
		status: 'available'
	},
	{
		id: 'CP004',
		name: '已使用券1',
		description: '已使用的优惠券示例',
		type: 'discount',
		amount: 100,
		minAmount: 500,
		validFrom: '2025-10-01',
		validTo: '2025-11-30',
		status: 'used'
	},
	{
		id: 'CP005',
		name: '已使用券2',
		description: '已使用的优惠券示例',
		type: 'discount',
		amount: 200,
		minAmount: 1000,
		validFrom: '2025-10-01',
		validTo: '2025-11-30',
		status: 'used'
	},
	{
		id: 'CP006',
		name: '已使用券3',
		description: '已使用的优惠券示例',
		type: 'discount',
		amount: 150,
		minAmount: 800,
		validFrom: '2025-10-01',
		validTo: '2025-11-30',
		status: 'used'
	},
	{
		id: 'CP007',
		name: '已使用券4',
		description: '已使用的优惠券示例',
		type: 'discount',
		amount: 80,
		minAmount: 400,
		validFrom: '2025-10-01',
		validTo: '2025-11-30',
		status: 'used'
	},
	{
		id: 'CP008',
		name: '已使用券5',
		description: '已使用的优惠券示例',
		type: 'discount',
		amount: 120,
		minAmount: 600,
		validFrom: '2025-10-01',
		validTo: '2025-11-30',
		status: 'used'
	},
	{
		id: 'CP009',
		name: '已过期券',
		description: '已过期的优惠券示例',
		type: 'discount',
		amount: 150,
		minAmount: 800,
		validFrom: '2025-09-01',
		validTo: '2025-10-31',
		status: 'expired'
	}
]);

// 优惠券统计数据
const couponStats = computed(() => {
	const usedCoupons = coupons.value.filter(c => c.status === 'used');
	const availableCoupons = coupons.value.filter(c => c.status === 'available');

	// 计算累计节省金额
	const totalSaved = usedCoupons.reduce((sum, coupon) => sum + coupon.amount, 0);

	return {
		totalSaved: totalSaved,
		usedCount: usedCoupons.length,
		availableCount: availableCoupons.length
	};
});

// 过滤优惠券
const filteredCoupons = computed(() => {
	const status = tabs.value[currentTab.value].status;
	return coupons.value.filter(c => c.status === status);
});

// 切换Tab
const switchTab = (index: number) => {
	currentTab.value = index;
};

// 格式化日期
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${month}.${day}`;
};

// 使用优惠券
const useCoupon = (coupon: any) => {
	uni.showModal({
		title: '使用优惠券',
		content: '是否前往选择房车使用此优惠券?',
		success: (res) => {
			if (res.confirm) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	});
};

// 显示兑换弹窗
const showExchangeDialog = () => {
	exchangePopup.value?.open();
};

// 关闭兑换弹窗
const closeExchangeDialog = () => {
	exchangePopup.value?.close();
	exchangeCode.value = '';
};

// 确认兑换
const confirmExchange = () => {
	if (!exchangeCode.value) {
		uni.showToast({
			title: '请输入兑换码',
			icon: 'none'
		});
		return;
	}

	// Mock兑换成功
	uni.showToast({
		title: '兑换成功!',
		icon: 'success'
	});

	closeExchangeDialog();

	// 刷新数据
	tabs.value[0].count++;
};

// 判断优惠券是否即将过期（7天内）
const isExpiringSoon = (coupon: any) => {
	if (coupon.status !== 'available') return false;

	const today = new Date();
	const expiryDate = new Date(coupon.validTo);
	const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
};

// 获取距离过期的天数
const getDaysUntilExpiry = (coupon: any) => {
	const today = new Date();
	const expiryDate = new Date(coupon.validTo);
	const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	return Math.max(0, daysUntilExpiry);
};
</script>

<style lang="scss" scoped>
.coupons-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

// Tab头部
.tabs-header {
	background-color: #FFFFFF;
	display: flex;
	padding: 0 $uni-spacing-lg;
	border-bottom: 2rpx solid $uni-border-color-light;

	.tab-item {
		flex: 1;
		text-align: center;
		padding: $uni-spacing-lg 0;
		position: relative;

		.tab-text {
			font-size: 30rpx;
			color: $uni-text-color-secondary;
		}

		.tab-count {
			font-size: 24rpx;
			color: $uni-text-color-placeholder;
			margin-left: $uni-spacing-xs;
		}

		&.active {
			.tab-text {
				color: $uni-color-primary;
				font-weight: 600;
			}

			.tab-count {
				color: $uni-color-primary;
			}

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 4rpx;
				background-color: $uni-color-primary;
				border-radius: 2rpx;
			}
		}
	}
}

// 统计卡片
.stats-card {
	margin: $uni-spacing-md;
	padding: $uni-spacing-lg;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFF5E6 100%);
	border-radius: $uni-radius-lg;
	border: 2rpx solid #FFE8CC;
}

.stats-header {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
	margin-bottom: $uni-spacing-md;
}

.stats-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-color-primary;
}

.stats-content {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $uni-spacing-sm;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: $uni-color-primary;
}

.stat-label {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.stat-divider {
	width: 2rpx;
	height: 80rpx;
	background-color: #FFE8CC;
}

// 优惠券列表
.coupons-list {
	flex: 1;
	padding: $uni-spacing-md;
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;

	.empty-text {
		font-size: 28rpx;
		color: $uni-text-color-placeholder;
		margin-top: $uni-spacing-md;
	}
}

// 优惠券卡片
.coupon-cards {
	.coupon-card {
		position: relative;
		background-color: #FFFFFF;
		border-radius: $uni-radius-md;
		margin-bottom: $uni-spacing-md;
		display: flex;
		overflow: hidden;
		box-shadow: $uni-shadow-card;

		&.disabled {
			opacity: 0.6;
		}

		&.expiring-soon {
			border: 2rpx solid #FF4D4F;
		}

		.coupon-left {
			width: 220rpx;
			background: $uni-color-primary-gradient;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: $uni-spacing-lg $uni-spacing-md;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				right: -12rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 24rpx;
				height: 24rpx;
				background-color: $uni-bg-color;
				border-radius: 50%;
			}

			.coupon-amount {
				color: #FFFFFF;
				display: flex;
				align-items: baseline;
				margin-bottom: $uni-spacing-xs;

				.amount-symbol {
					font-size: 32rpx;
					font-weight: 600;
				}

				.amount-value {
					font-size: 56rpx;
					font-weight: bold;
				}
			}

			.coupon-condition {
				color: rgba(255, 255, 255, 0.9);
				font-size: 22rpx;
			}
		}

		// 即将过期标签
		.expiring-badge {
			position: absolute;
			top: $uni-spacing-md;
			right: $uni-spacing-md;
			display: flex;
			align-items: center;
			gap: 4rpx;
			padding: 6rpx $uni-spacing-sm;
			background-color: rgba(255, 77, 79, 0.1);
			border-radius: $uni-radius-xs;
			z-index: 1;

			.badge-text {
				font-size: 20rpx;
				color: #FF4D4F;
				font-weight: 500;
			}
		}

		.coupon-right {
			flex: 1;
			padding: $uni-spacing-md;
			display: flex;
			flex-direction: column;

			.coupon-name {
				font-size: 32rpx;
				font-weight: 600;
				color: $uni-text-color;
				margin-bottom: $uni-spacing-xs;
			}

			.coupon-desc {
				font-size: 24rpx;
				color: $uni-text-color-secondary;
				margin-bottom: $uni-spacing-md;
			}

			.coupon-time-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: $uni-spacing-md;
			}

			.coupon-time {
				font-size: 22rpx;
				color: $uni-text-color-placeholder;
			}

			.expiring-days {
				font-size: 22rpx;
				color: #FF4D4F;
				font-weight: 500;
			}

			.coupon-actions {
				margin-top: auto;

				.use-btn {
					padding: $uni-spacing-sm $uni-spacing-lg;
					background: $uni-color-primary-gradient;
					color: #FFFFFF;
					border-radius: $uni-radius-lg;
					font-size: 26rpx;
					border: none;
					transition: all 0.3s ease;

					&:active {
						opacity: 0.8;
						transform: scale(0.98);
					}
				}

				.status-tag {
					display: inline-block;
					padding: $uni-spacing-xs 20rpx;
					border-radius: 20rpx;
					font-size: 24rpx;

					&.used {
						background-color: $uni-bg-color;
						color: $uni-text-color-placeholder;
					}

					&.expired {
						background-color: rgba(255, 77, 79, 0.1);
						color: #FF4D4F;
					}
				}
			}
		}
	}
}

// 底部兑换入口
.exchange-footer {
	background-color: #FFFFFF;
	padding: $uni-spacing-md $uni-spacing-lg;
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

	.exchange-btn {
		width: 100%;
		padding: $uni-spacing-md;
		background: $uni-color-primary-gradient;
		color: #FFFFFF;
		border-radius: $uni-radius-btn;
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		transition: all 0.3s ease;

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}
	}
}

// 兑换弹窗
.exchange-dialog {
	width: 560rpx;
	background-color: #FFFFFF;
	border-radius: $uni-radius-md;
	padding: 48rpx $uni-spacing-lg $uni-spacing-lg;

	.dialog-title {
		display: block;
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 40rpx;
	}

	.exchange-input {
		width: 100%;
		padding: $uni-spacing-md;
		border: 2rpx solid $uni-border-color-light;
		border-radius: $uni-radius-sm;
		font-size: 28rpx;
		margin-bottom: 40rpx;
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
