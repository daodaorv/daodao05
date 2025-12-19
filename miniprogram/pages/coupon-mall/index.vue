<template>
	<view class="coupon-mall">
		<!-- 顶部Banner区 -->
		<view class="banner-section">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
				<swiper-item v-for="(banner, index) in banners" :key="index">
					<image :src="banner.image" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 积分余额卡片 -->
		<view class="points-card" @tap="goToPointsCenter">
			<view class="points-info">
				<view class="points-label">我的积分</view>
				<view class="points-value">{{ userPoints }}</view>
			</view>
			<view class="points-action">
				<text class="action-text">查看明细</text>
				<u-icon name="arrow-right" size="16" color="#999"></u-icon>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entry">
			<view class="entry-item" @tap="goToNewUserZone">
				<u-icon name="gift" size="24" color="#FF6B6B"></u-icon>
				<text class="entry-text">新人专区</text>
			</view>
			<view class="entry-item" @tap="goToMemberZone">
				<u-icon name="level" size="24" color="#FFD700"></u-icon>
				<text class="entry-text">会员专属</text>
			</view>
			<view class="entry-item" @tap="goToExpiringSoon">
				<u-icon name="clock" size="24" color="#FF9F29"></u-icon>
				<text class="entry-text">即将过期</text>
			</view>
		</view>

		<!-- 分类导航 -->
		<scroll-view class="category-nav" scroll-x="true" :show-scrollbar="false">
			<view
				v-for="(category, index) in categories"
				:key="index"
				class="category-item"
				:class="{ active: currentCategory === category.id }"
				@tap="selectCategory(category.id)"
			>
				<text class="category-text">{{ category.name }}</text>
			</view>
		</scroll-view>

		<!-- 热门推荐区 -->
		<view class="hot-section" v-if="hotCoupons.length > 0">
			<view class="section-header">
				<view class="header-left">
					<u-icon name="star-fill" size="20" color="#FF6B6B"></u-icon>
					<text class="section-title">热门推荐</text>
				</view>
			</view>
			<scroll-view class="hot-scroll" scroll-x="true" :show-scrollbar="false">
				<view class="hot-list">
					<view
						v-for="coupon in hotCoupons"
						:key="coupon.id"
						class="hot-coupon-card"
						@tap="goToCouponDetail(coupon.id)"
					>
						<view class="coupon-badge" v-if="coupon.badge">{{ coupon.badge }}</view>
						<view class="coupon-amount">
							<text class="amount-symbol">¥</text>
							<text class="amount-value">{{ coupon.amount }}</text>
						</view>
						<view class="coupon-name">{{ coupon.name }}</view>
						<view class="coupon-condition">{{ coupon.condition }}</view>
						<view class="coupon-action">
							<text class="action-price" v-if="coupon.price > 0">{{ coupon.price }}积分</text>
							<text class="action-price" v-else>免费领取</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 优惠券列表 -->
		<view class="coupon-list">
			<view class="section-header">
				<text class="section-title">全部优惠券</text>
			</view>
			<view
				v-for="coupon in filteredCoupons"
				:key="coupon.id"
				class="coupon-item"
				@tap="goToCouponDetail(coupon.id)"
			>
				<!-- 优惠券左侧 -->
				<view class="coupon-left" :class="getCouponTypeClass(coupon.type)">
					<view class="coupon-amount-large">
						<text class="amount-symbol">¥</text>
						<text class="amount-value">{{ coupon.amount }}</text>
					</view>
					<view class="coupon-type-label">{{ getCouponTypeLabel(coupon.type) }}</view>
				</view>

				<!-- 优惠券右侧 -->
				<view class="coupon-right">
					<view class="coupon-header">
						<text class="coupon-name">{{ coupon.name }}</text>
						<view class="coupon-tags">
							<text class="tag" v-if="coupon.isNew">新人专享</text>
							<text class="tag vip" v-if="coupon.isVip">会员专属</text>
							<text class="tag hot" v-if="coupon.isHot">热门</text>
						</view>
					</view>
					<view class="coupon-info">
						<text class="info-text">{{ coupon.condition }}</text>
					</view>
					<view class="coupon-scope">
						<text class="scope-text">适用：{{ coupon.scope }}</text>
					</view>
					<view class="coupon-footer">
						<view class="coupon-validity">
							<u-icon name="calendar" size="14" color="#999"></u-icon>
							<text class="validity-text">{{ coupon.validity }}</text>
						</view>
						<view class="coupon-stock" v-if="coupon.stock">
							<text class="stock-text">剩余{{ coupon.stock }}张</text>
						</view>
					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="coupon-action-btn" @tap.stop="handleCouponAction(coupon)">
					<text class="btn-text" v-if="coupon.claimed">已领取</text>
					<text class="btn-text" v-else-if="coupon.soldOut">已售罄</text>
					<text class="btn-text active" v-else-if="coupon.price === 0">免费领</text>
					<text class="btn-text active" v-else-if="coupon.pointsPrice > 0 && coupon.price > 0">
						{{ coupon.pointsPrice }}积分+¥{{ coupon.price }}
					</text>
					<text class="btn-text active" v-else-if="coupon.pointsPrice > 0">
						{{ coupon.pointsPrice }}积分
					</text>
					<text class="btn-text active" v-else>¥{{ coupon.price }}</text>
				</view>
			</view>

			<!-- 加载更多 -->
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';
import { mockCoupons, getHotCoupons, getCouponsByType, type CouponData } from '@/mock/data/coupon';

// 类型定义
interface Banner {
	id: string;
	image: string;
	link?: string;
}

interface Category {
	id: string;
	name: string;
}

// 响应式数据
const userPoints = ref(1580);
const currentCategory = ref('all');
const loadMoreStatus = ref('noMore');

// Banner数据
const banners = ref<Banner[]>([
	{ id: '1', image: '/static/c1.png' },
	{ id: '2', image: '/static/c2.png' },
	{ id: '3', image: '/static/c3.png' }
]);

// 分类数据
const categories = ref<Category[]>([
	{ id: 'all', name: '全部' },
	{ id: 'discount', name: '满减券' },
	{ id: 'rate', name: '折扣券' },
	{ id: 'daily', name: '日租抵扣' },
	{ id: 'service', name: '服务费减免' },
	{ id: 'special', name: '特殊券种' }
]);

// 使用统一的 Mock 数据源
const hotCoupons = ref<CouponData[]>([]);
const allCoupons = ref<CouponData[]>([]);

// 初始化数据
onMounted(() => {
	hotCoupons.value = getHotCoupons();
	allCoupons.value = [...mockCoupons];
});

// 计算属性：筛选后的优惠券列表
const filteredCoupons = computed(() => {
	if (currentCategory.value === 'all') {
		return allCoupons.value;
	}
	return allCoupons.value.filter((coupon: CouponData) => coupon.type === currentCategory.value);
});

// 方法
const goToPointsCenter = () => {
	uni.navigateTo({
		url: '/pages/profile/points'
	});
};

const goToNewUserZone = () => {
	currentCategory.value = 'all';
	// 筛选新人专享优惠券
	uni.showToast({
		title: '新人专区',
		icon: 'none'
	});
};

const goToMemberZone = () => {
	currentCategory.value = 'all';
	// 筛选会员专属优惠券
	uni.showToast({
		title: '会员专区',
		icon: 'none'
	});
};

const goToExpiringSoon = () => {
	uni.navigateTo({
		url: '/pages/profile/coupons?tab=expiring'
	});
};

const selectCategory = (categoryId: string) => {
	currentCategory.value = categoryId;
};

const goToCouponDetail = (couponId: string) => {
	uni.navigateTo({
		url: `/pages/coupon-mall/detail?id=${couponId}`
	});
};

const handleCouponAction = (coupon: CouponData) => {
	if (coupon.claimed) {
		uni.showToast({
			title: '已领取该优惠券',
			icon: 'none'
		});
		return;
	}

	if (coupon.soldOut) {
		uni.showToast({
			title: '优惠券已售罄',
			icon: 'none'
		});
		return;
	}

	// 显示领取/购买确认弹窗
	let actionText = '';
	if (coupon.price === 0 && coupon.pointsPrice === 0) {
		actionText = '免费领取';
	} else if (coupon.pointsPrice > 0 && coupon.price > 0) {
		actionText = `使用${coupon.pointsPrice}积分+¥${coupon.price}购买`;
	} else if (coupon.pointsPrice > 0) {
		actionText = `使用${coupon.pointsPrice}积分兑换`;
	} else {
		actionText = `支付¥${coupon.price}购买`;
	}

	uni.showModal({
		title: '确认操作',
		content: `确定${actionText}该优惠券吗？`,
		success: (res: { confirm: boolean; cancel: boolean }) => {
			if (res.confirm) {
				claimCoupon(coupon);
			}
		}
	});
};

const claimCoupon = (coupon: CouponData) => {
	// Mock实现 - 待后端API开发
	uni.showLoading({
		title: '领取中...'
	});

	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '领取成功',
			icon: 'success'
		});
		coupon.claimed = true;
	}, 1000);
};

const getCouponTypeClass = (type: string) => {
	const classMap: Record<string, string> = {
		discount: 'type-discount',
		rate: 'type-rate',
		daily: 'type-daily',
		service: 'type-service',
		special: 'type-special'
	};
	return classMap[type] || '';
};

const getCouponTypeLabel = (type: string) => {
	const labelMap: Record<string, string> = {
		discount: '满减券',
		rate: '折扣券',
		daily: '日租抵扣',
		service: '服务费减免',
		special: '特殊券'
	};
	return labelMap[type] || '优惠券';
};

// 生命周期
onReachBottom(() => {
	// 加载更多
	if (loadMoreStatus.value === 'more') {
		loadMoreStatus.value = 'loading';
		// Mock实现 - 待后端API开发
		setTimeout(() => {
			loadMoreStatus.value = 'noMore';
		}, 1000);
	}
});
</script>

<style scoped lang="scss">
.coupon-mall {
	min-height: 100vh;
	background-color: #F5F5F5;
}

// Banner区域
.banner-section {
	width: 100%;
	height: 320rpx;
	background-color: #FFFFFF;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-image {
	width: 100%;
	height: 100%;
}

// 积分卡片
.points-card {
	margin: 24rpx;
	padding: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	border-radius: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.2);
}

.points-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.points-label {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
}

.points-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.points-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.action-text {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
}

// 快捷入口
.quick-entry {
	display: flex;
	justify-content: space-around;
	padding: 32rpx 24rpx;
	background-color: #FFFFFF;
	margin: 0 24rpx 24rpx;
	border-radius: 24rpx;
}

.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.entry-text {
	font-size: 26rpx;
	color: $uni-text-color;
}

// 分类导航
.category-nav {
	white-space: nowrap;
	padding: 24rpx 24rpx 24rpx 0;
	background-color: #FFFFFF;
	margin-bottom: 24rpx;
}

.category-item {
	display: inline-block;
	padding: 16rpx 32rpx;
	margin-left: 24rpx;
	font-size: 28rpx;
	color: $uni-text-color-secondary;
	border-radius: 48rpx;
	transition: all 0.3s;

	&.active {
		background-color: #FF9F29;
		color: #FFFFFF;
		font-weight: 500;
	}
}

// 热门推荐区
.hot-section {
	margin-bottom: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.hot-scroll {
	white-space: nowrap;
}

.hot-list {
	display: inline-flex;
	gap: 24rpx;
	padding: 0 24rpx 24rpx;
}

.hot-coupon-card {
	position: relative;
	width: 280rpx;
	padding: 32rpx 24rpx;
	background: linear-gradient(135deg, #FFF5E9 0%, #FFF0E0 100%);
	border-radius: 24rpx;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.coupon-badge {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	padding: 8rpx 16rpx;
	background-color: #FF6B6B;
	color: #FFFFFF;
	font-size: 20rpx;
	border-radius: 24rpx;
}

.coupon-amount {
	display: flex;
	align-items: baseline;
	color: #FF9F29;
}

.amount-symbol {
	font-size: 32rpx;
	font-weight: bold;
}

.amount-value {
	font-size: 56rpx;
	font-weight: bold;
}

.coupon-name {
	font-size: 28rpx;
	color: $uni-text-color;
	text-align: center;
}

.coupon-condition {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	text-align: center;
}

.coupon-action {
	margin-top: 16rpx;
	padding: 16rpx 32rpx;
	background-color: #FF9F29;
	color: #FFFFFF;
	font-size: 26rpx;
	border-radius: 48rpx;
}

.action-price {
	color: #FFFFFF;
}

// 优惠券列表
.coupon-list {
	padding: 0 24rpx 24rpx;
}

.coupon-item {
	position: relative;
	display: flex;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.coupon-left {
	width: 200rpx;
	padding: 32rpx 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 2rpx;
		height: 80%;
		background: linear-gradient(to bottom, transparent 0%, transparent 45%, #E0E0E0 45%, #E0E0E0 55%, transparent 55%, transparent 100%);
		background-size: 2rpx 20rpx;
	}

	&.type-discount {
		background: linear-gradient(135deg, #FFE5E5 0%, #FFD5D5 100%);
	}

	&.type-rate {
		background: linear-gradient(135deg, #E5F5FF 0%, #D5EBFF 100%);
	}

	&.type-daily {
		background: linear-gradient(135deg, #FFF5E5 0%, #FFEBD5 100%);
	}

	&.type-service {
		background: linear-gradient(135deg, #E5FFE5 0%, #D5FFD5 100%);
	}

	&.type-special {
		background: linear-gradient(135deg, #F5E5FF 0%, #EBD5FF 100%);
	}
}

.coupon-amount-large {
	display: flex;
	align-items: baseline;
	color: #FF6B6B;

	.amount-symbol {
		font-size: 32rpx;
		font-weight: bold;
	}

	.amount-value {
		font-size: 64rpx;
		font-weight: bold;
	}
}

.coupon-type-label {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.coupon-right {
	flex: 1;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.coupon-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.coupon-name {
	font-size: 30rpx;
	font-weight: 500;
	color: $uni-text-color;
	flex: 1;
}

.coupon-tags {
	display: flex;
	gap: 8rpx;
	flex-shrink: 0;
}

.tag {
	padding: 4rpx 12rpx;
	font-size: 20rpx;
	color: #FF6B6B;
	background-color: rgba(255, 107, 107, 0.1);
	border-radius: 8rpx;

	&.vip {
		color: #FFD700;
		background-color: rgba(255, 215, 0, 0.1);
	}

	&.hot {
		color: #FF9F29;
		background-color: rgba(255, 159, 41, 0.1);
	}
}

.coupon-info {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.coupon-scope {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.coupon-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8rpx;
}

.coupon-validity {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.validity-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.coupon-stock {
	font-size: 24rpx;
	color: #FF9F29;
}

.coupon-action-btn {
	position: absolute;
	right: 24rpx;
	bottom: 24rpx;
	padding: 12rpx 24rpx;
	background-color: #F5F5F5;
	border-radius: 48rpx;
	font-size: 24rpx;
	color: $uni-text-color-secondary;

	.btn-text.active {
		color: #FF9F29;
		font-weight: 500;
	}
}
</style>
