<template>
	<view class="select-coupon-page">
		<!-- 顶部提示 -->
		<view class="tip-section">
			<u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
			<text class="tip-text">选择适用于本订单的优惠券</text>
		</view>

		<!-- 订单金额信息 -->
		<view class="order-info">
			<text class="info-label">订单金额</text>
			<text class="info-value">¥{{ orderAmount }}</text>
		</view>

		<!-- 智能推荐 -->
		<view v-if="recommendedCoupon" class="recommend-section">
			<view class="recommend-header">
				<u-icon name="star-fill" size="18" color="#FF9F29"></u-icon>
				<text class="recommend-title">智能推荐</text>
				<text class="recommend-subtitle">为您推荐最优惠券</text>
			</view>
			<view
				class="recommend-card"
				:class="{ 'selected': selectedCouponId === recommendedCoupon.id }"
				@tap="selectCoupon(recommendedCoupon)"
			>
				<view class="recommend-badge">推荐</view>
				<view class="coupon-left">
					<view class="coupon-amount">
						<text class="amount-symbol">¥</text>
						<text class="amount-value">{{ recommendedCoupon.amount }}</text>
					</view>
					<text class="coupon-condition">满{{ recommendedCoupon.minAmount }}元可用</text>
				</view>
				<view class="coupon-right">
					<text class="coupon-name">{{ recommendedCoupon.name }}</text>
					<text class="coupon-desc">{{ recommendedCoupon.description }}</text>
					<text class="coupon-scope">适用：{{ getCouponScopeLabel(recommendedCoupon) }}</text>
					<view class="recommend-reason">
						<u-icon name="info" size="14" color="#52C41A"></u-icon>
						<text class="reason-text">{{ recommendedCoupon.recommendReason }}</text>
					</view>
				</view>
				<view class="coupon-check">
					<u-icon
						:name="selectedCouponId === recommendedCoupon.id ? 'checkmark-circle' : 'checkmark-circle'"
						size="24"
						:color="selectedCouponId === recommendedCoupon.id ? '#FF9F29' : '#DDD'">
					</u-icon>
				</view>
			</view>
		</view>

		<!-- 可用优惠券列表 -->
		<view class="coupon-section">
			<view class="section-title">可用优惠券 ({{ availableCoupons.length }})</view>
			<view v-if="availableCoupons.length === 0" class="empty-state">
				<u-icon name="gift" size="60" color="#DDD"></u-icon>
				<text class="empty-text">暂无可用优惠券</text>
				<button class="go-mall-btn" @tap="goToCouponMall">去领券</button>
			</view>
			<view v-else class="coupon-list">
				<view
					v-for="coupon in availableCoupons"
					:key="coupon.id"
					class="coupon-card"
					:class="{ 'selected': selectedCouponId === coupon.id }"
					@tap="selectCoupon(coupon)"
				>
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
						<text class="coupon-scope">适用：{{ getCouponScopeLabel(coupon) }}</text>
						<text class="coupon-time">有效期至 {{ formatDate(coupon.validTo) }}</text>
					</view>
					<view class="coupon-check">
						<u-icon
							:name="selectedCouponId === coupon.id ? 'checkmark-circle' : 'checkmark-circle'"
							size="24"
							:color="selectedCouponId === coupon.id ? '#FF9F29' : '#DDD'">
						</u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 不可用优惠券列表 -->
		<view v-if="unavailableCoupons.length > 0" class="coupon-section">
			<view class="section-title">不可用优惠券 ({{ unavailableCoupons.length }})</view>
			<view class="coupon-list">
				<view
					v-for="coupon in unavailableCoupons"
					:key="coupon.id"
					class="coupon-card disabled"
				>
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
						<text class="coupon-scope">适用：{{ getCouponScopeLabel(coupon) }}</text>
						<text class="coupon-reason">{{ coupon.unavailableReason }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<button class="cancel-btn" @tap="handleCancel">不使用优惠券</button>
			<button class="confirm-btn" @tap="handleConfirm" :disabled="!selectedCouponId">确定</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getMyCoupons } from '@/api/coupon';

// 页面参数
const orderAmount = ref(0);
const selectedCouponId = ref('');
const productType = ref<'vehicle' | 'campsite' | 'tour'>('vehicle');

const productTypeLabels: Record<string, string> = {
	vehicle: '房车租赁订单',
	campsite: '营地预订订单',
	tour: '旅游线路订单'
};

// 优惠券列表
const allCoupons = ref<any[]>([]);

const getCouponScopeLabel = (coupon: any) => {
	if (coupon.scope) return coupon.scope;
	if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
		return coupon.applicableProducts.map((key: string) => productTypeLabels[key] || key).join('、');
	}
	return '全品类';
};

const buildScopeReason = (coupon: any) => {
	const scopeLabel = getCouponScopeLabel(coupon);
	return scopeLabel ? `仅限${scopeLabel}` : '优惠券适用范围不匹配';
};

const isCouponApplicable = (coupon: any) => {
	if (!coupon.applicableProducts || coupon.applicableProducts.length === 0) {
		return true;
	}
	return coupon.applicableProducts.includes(productType.value);
};

// 可用优惠券
const availableCoupons = computed(() => {
	return allCoupons.value.filter(coupon => {
		coupon.unavailableReason = '';
		// 检查订单金额是否满足最低使用条件
		if (orderAmount.value < coupon.minAmount) {
			coupon.unavailableReason = `订单金额需满${coupon.minAmount}元`;
			return false;
		}
		// 检查优惠券状态
		if (coupon.status !== 'available') {
			coupon.unavailableReason = '优惠券已使用或过期';
			return false;
		}
		// 检查适用范围
		if (!isCouponApplicable(coupon)) {
			coupon.unavailableReason = buildScopeReason(coupon);
			return false;
		}
		return true;
	});
});

// 智能推荐优惠券
const recommendedCoupon = computed(() => {
	if (availableCoupons.value.length === 0) return null;

	// 计算每个优惠券的优惠率和推荐分数
	const couponsWithScore = availableCoupons.value.map(coupon => {
		// 计算优惠金额
		const discountAmount = coupon.amount;
		// 计算优惠率
		const discountRate = (discountAmount / orderAmount.value) * 100;
		// 计算距离门槛的差值（越接近门槛越好）
		const thresholdDiff = orderAmount.value - coupon.minAmount;
		// 计算推荐分数（优惠金额权重60%，优惠率权重30%，门槛接近度权重10%）
		const score = discountAmount * 0.6 + discountRate * 0.3 + (thresholdDiff > 0 ? 100 / (thresholdDiff + 1) : 0) * 0.1;

		// 生成推荐理由
		let recommendReason = '';
		if (discountRate >= 20) {
			recommendReason = `优惠力度最大，可省${discountAmount}元`;
		} else if (thresholdDiff < 100) {
			recommendReason = `刚好满足使用条件，可省${discountAmount}元`;
		} else {
			recommendReason = `性价比最高，可省${discountAmount}元`;
		}

		return {
			...coupon,
			score,
			recommendReason
		};
	});

	// 按分数排序，返回最高分的优惠券
	couponsWithScore.sort((a, b) => b.score - a.score);
	return couponsWithScore[0];
});

// 不可用优惠券
const unavailableCoupons = computed(() => {
	return allCoupons.value.filter(coupon => {
		coupon.unavailableReason = '';
		if (orderAmount.value < coupon.minAmount) {
			coupon.unavailableReason = `订单金额需满${coupon.minAmount}元`;
			return true;
		}
		if (coupon.status !== 'available') {
			coupon.unavailableReason = '优惠券已使用或过期';
			return true;
		}
		if (!isCouponApplicable(coupon)) {
			coupon.unavailableReason = buildScopeReason(coupon);
			return true;
		}
		return false;
	});
});

onLoad((options: any) => {
	if (options.amount) {
		orderAmount.value = parseFloat(options.amount);
	}
	if (options.selectedId) {
		selectedCouponId.value = options.selectedId;
	}
	if (options.productType && ['vehicle', 'campsite', 'tour'].includes(options.productType)) {
		productType.value = options.productType;
	}
	loadCoupons();
});

// 加载优惠券列表
const loadCoupons = async () => {
	try {
		uni.showLoading({ title: '加载中...' });

		// Mock实现 - 待后端API开发
		// const response = await getMyCoupons({ status: 'unused' });
		// allCoupons.value = response.data;

		// Mock数据
		allCoupons.value = [
			{
				id: 'CP001',
				name: '房车租赁满减券',
				description: '适用于所有房车租赁订单',
				type: 'discount',
				amount: 200,
				minAmount: 800,
				validFrom: '2025-11-01',
				validTo: '2025-12-31',
				status: 'available',
				applicableProducts: ['vehicle'],
				scope: '房车租赁订单'
			},
			{
				id: 'CP002',
				name: '房车新用户专享券',
				description: '首次租车专享优惠',
				type: 'discount',
				amount: 300,
				minAmount: 1200,
				validFrom: '2025-11-01',
				validTo: '2025-12-31',
				status: 'available',
				applicableProducts: ['vehicle'],
				scope: '房车租赁订单'
			},
			{
				id: 'CP003',
				name: '营地预订立减券',
				description: '指定营地预订可用',
				type: 'discount',
				amount: 120,
				minAmount: 600,
				validFrom: '2025-11-01',
				validTo: '2025-12-31',
				status: 'available',
				applicableProducts: ['campsite'],
				scope: '营地预订'
			},
			{
				id: 'CP004',
				name: '旅游线路优惠券',
				description: '适用于旅游线路订单',
				type: 'discount',
				amount: 400,
				minAmount: 3000,
				validFrom: '2025-11-01',
				validTo: '2025-12-31',
				status: 'available',
				applicableProducts: ['tour'],
				scope: '旅游线路订单'
			},
			{
				id: 'CP005',
				name: '营地周末券',
				description: '限周末营地入住使用',
				type: 'discount',
				amount: 80,
				minAmount: 500,
				validFrom: '2025-11-15',
				validTo: '2025-12-31',
				status: 'available',
				applicableProducts: ['campsite'],
				scope: '营地预订'
			},
			{
				id: 'CP006',
				name: '已使用房车券',
				description: '已使用的优惠券示例',
				type: 'discount',
				amount: 150,
				minAmount: 700,
				validFrom: '2025-10-01',
				validTo: '2025-11-30',
				status: 'used',
				applicableProducts: ['vehicle'],
				scope: '房车租赁订单'
			}
		];

		uni.hideLoading();
	} catch (error) {
		logger.error('加载优惠券失败:', error);
		uni.hideLoading();
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		});
	}
};

// 选择优惠券
const selectCoupon = (coupon: any) => {
	if (selectedCouponId.value === coupon.id) {
		// 取消选择
		selectedCouponId.value = '';
	} else {
		// 选择优惠券
		selectedCouponId.value = coupon.id;
	}
};

// 格式化日期
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}.${month}.${day}`;
};

// 去优惠券商城
const goToCouponMall = () => {
	uni.navigateTo({
		url: '/pages/coupon-mall/index'
	});
};

// 取消选择
const handleCancel = () => {
	selectedCouponId.value = '';
	uni.$emit('couponSelected', null);
	uni.navigateBack();
};

// 确认选择
const handleConfirm = () => {
	if (!selectedCouponId.value) {
		uni.showToast({
			title: '请选择优惠券',
			icon: 'none'
		});
		return;
	}

	// 找到选中的优惠券
	const selectedCoupon = availableCoupons.value.find(c => c.id === selectedCouponId.value);
	if (!selectedCoupon) {
		uni.showToast({
			title: '优惠券不可用',
			icon: 'none'
		});
		return;
	}

	// 使用 uni.$emit 传递选中的优惠券
	uni.$emit('couponSelected', selectedCoupon);
	uni.navigateBack();
};
</script>

<style scoped lang="scss">
.select-coupon-page {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 180rpx;
}

// 顶部提示
.tip-section {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 24rpx 32rpx;
	background-color: #FFF9F0;
	border-bottom: 1rpx solid #FFE8CC;
}

.tip-text {
	font-size: 26rpx;
	color: #666;
}

// 订单金额信息
.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background-color: #FFFFFF;
	margin-bottom: 16rpx;
}

.info-label {
	font-size: 28rpx;
	color: #666;
}

.info-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #FF9F29;
}

// 智能推荐区域
.recommend-section {
	margin: 0 24rpx 24rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFF5E6 100%);
	border-radius: 24rpx;
	border: 2rpx solid #FFE8CC;
}

.recommend-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.recommend-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #FF9F29;
}

.recommend-subtitle {
	font-size: 24rpx;
	color: #999;
	margin-left: auto;
}

.recommend-card {
	position: relative;
	display: flex;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.15);
	transition: all 0.3s ease;

	&.selected {
		border: 2rpx solid #FF9F29;
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.3);
	}
}

.recommend-badge {
	position: absolute;
	top: 0;
	left: 0;
	padding: 6rpx 16rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: bold;
	border-radius: 16rpx 0 16rpx 0;
	z-index: 1;
}

.recommend-reason {
	display: flex;
	align-items: center;
	gap: 6rpx;
	margin-top: 8rpx;
}

.reason-text {
	font-size: 22rpx;
	color: #52C41A;
	font-weight: 500;
}

// 优惠券区域
.coupon-section {
	margin-bottom: 24rpx;
}

.section-title {
	padding: 24rpx 32rpx 16rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
	background-color: #FFFFFF;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin: 24rpx 0 32rpx;
}

.go-mall-btn {
	padding: 16rpx 48rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 48rpx;
	font-size: 28rpx;
	border: none;
}

// 优惠券列表
.coupon-list {
	padding: 0 24rpx;
}

.coupon-card {
	display: flex;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	position: relative;
	transition: all 0.3s ease;

	&.selected {
		border: 2rpx solid #FF9F29;
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.2);
	}

	&.disabled {
		opacity: 0.5;
	}
}

.coupon-left {
	width: 200rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32rpx 24rpx;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		right: -12rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 24rpx;
		height: 24rpx;
		background-color: #F5F5F5;
		border-radius: 50%;
	}
}

.coupon-amount {
	color: #FFFFFF;
	display: flex;
	align-items: baseline;
	margin-bottom: 8rpx;
}

.amount-symbol {
	font-size: 28rpx;
	font-weight: 600;
}

.amount-value {
	font-size: 56rpx;
	font-weight: bold;
}

.coupon-condition {
	color: rgba(255, 255, 255, 0.9);
	font-size: 22rpx;
}

.coupon-right {
	flex: 1;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.coupon-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.coupon-desc {
	font-size: 24rpx;
	color: #666;
}

.coupon-scope {
	font-size: 22rpx;
	color: #999;
}

.coupon-time {
	font-size: 22rpx;
	color: #999;
	margin-top: 8rpx;
}

.coupon-reason {
	font-size: 22rpx;
	color: #FF4D4F;
	margin-top: 8rpx;
}

.coupon-check {
	position: absolute;
	right: 24rpx;
	top: 50%;
	transform: translateY(-50%);
}

// 底部操作栏
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 24rpx;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
}

.cancel-btn {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	background-color: #F5F5F5;
	color: #666;
	border-radius: 44rpx;
	border: none;

	&::after {
		border: none;
	}
}

.confirm-btn {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 44rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.35);
	border: none;

	&::after {
		border: none;
	}

	&:disabled {
		opacity: 0.5;
	}
}
</style>
