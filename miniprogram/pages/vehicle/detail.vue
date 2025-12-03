<template>
	<view class="vehicle-detail-page">
		<!-- 图片轮播 -->
		<swiper class="image-swiper" :indicator-dots="true" :autoplay="false" :circular="true"
			indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#FF9F29">
			<swiper-item v-for="(image, index) in vehicleImages" :key="index">
				<image class="swiper-image" :src="image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<scroll-view scroll-y class="detail-scroll">
			<!-- 基本信息 -->
			<view class="info-section">
				<view class="vehicle-header">
					<text class="vehicle-name">{{ vehicle.name }}</text>
					<view class="tags">
						<text v-for="(tag, index) in vehicle.tags" :key="index" class="tag">{{ tag }}</text>
					</view>
				</view>
				<view class="price-box">
					<text class="currency">¥</text>
					<text class="price">{{ vehicle.price }}</text>
					<text class="unit">/日均</text>
				</view>
			</view>

			<!-- 车辆规格 -->
			<view class="section">
				<view class="section-title">车辆规格</view>
				<view class="specs-row">
					<view class="spec-item-inline">
						<u-icon name="car-fill" size="16" color="#FF9F29"></u-icon>
						<text class="spec-text">{{ vehicle.type }}</text>
					</view>
					<view class="spec-item-inline">
						<u-icon name="account-fill" size="16" color="#FF9F29"></u-icon>
						<text class="spec-text">{{ vehicle.seats }}座</text>
					</view>
					<view class="spec-item-inline">
						<u-icon name="home-fill" size="16" color="#FF9F29"></u-icon>
						<text class="spec-text">{{ vehicle.beds }}卧</text>
					</view>
					<view class="spec-item-inline">
						<u-icon name="setting-fill" size="16" color="#FF9F29"></u-icon>
						<text class="spec-text">{{ vehicle.transmission }}</text>
					</view>
				</view>
			</view>

			<!-- 车辆配置 -->
			<view class="section">
				<view class="section-title">车辆配置</view>
				<view class="features-list">
					<view v-for="(feature, index) in vehicle.features" :key="index" class="feature-item">
						<u-icon name="checkbox-mark" size="16" color="#4CAF50"></u-icon>
						<text class="feature-text">{{ feature }}</text>
					</view>
				</view>
			</view>

			<!-- 车辆详情 -->
			<view class="section">
				<view class="section-title">车辆详情</view>
				<view class="detail-content">
					<!-- 富文本内容 -->
					<rich-text :nodes="vehicle.detailHtml"></rich-text>
				</view>
			</view>

			<!-- 评价 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">用户评价</text>
					<text class="rating-score">{{ vehicle.rating }} 分</text>
				</view>
				<view v-if="vehicle.reviews && vehicle.reviews.length > 0" class="reviews-list">
					<view v-for="(review, index) in vehicle.reviews" :key="index" class="review-item">
						<view class="review-header">
							<text class="reviewer-name">{{ review.userName }}</text>
							<text class="review-date">{{ review.date }}</text>
						</view>
						<view class="review-rating">
							<u-icon v-for="star in 5" :key="star" 
								:name="star <= review.rating ? 'star-filled' : 'star'" 
								size="14" 
								:color="star <= review.rating ? '#FFB400' : '#DDD'">
							</u-icon>
						</view>
						<text class="review-content">{{ review.content }}</text>
					</view>
				</view>
				<view v-else class="empty-reviews">
					<text class="empty-text">暂无评价</text>
				</view>
			</view>



			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="price-info">
				<text class="price-label">租金</text>
				<view class="price-value">
					<text class="currency">¥</text>
					<text class="price">{{ vehicle.price }}</text>
					<text class="unit">/日</text>
				</view>
			</view>
			<button class="book-btn" @tap="handleBook">立即预订</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 车辆数据
const vehicle = ref({
	id: '',
	name: '上汽大通RG10',
	type: 'C型房车',
	seats: 6,
	beds: 4,
	transmission: '自动挡',
	price: 680,
	tags: ['热门', '新车'],
	rating: 4.8,
	storeName: '深圳宝安店',
	storeAddress: '深圳市宝安区XX路XX号',
	features: [
		'独立卫浴',
		'冷暖空调',
		'车载冰箱',
		'微波炉',
		'燃气灶',
		'太阳能板',
		'倒车影像',
		'定速巡航'
	],
	detailHtml: `
		<div style="line-height: 1.8; color: #333;">
			<p style="margin-bottom: 16px;"><strong>车辆介绍</strong></p>
			<p style="margin-bottom: 12px;">上汽大通RG10是一款专为家庭出游设计的C型房车，采用经典的额头床设计，空间利用率极高。车身长度5.99米，宽度2.5米，高度3.2米，整备质量3.5吨。</p>
			<p style="margin-bottom: 16px;"><img src="/static/场景推荐2.jpg" style="width: 100%; border-radius: 8px; margin: 12px 0;" /></p>
			<p style="margin-bottom: 16px;"><strong>内部空间</strong></p>
			<p style="margin-bottom: 12px;">车内采用温馨的木纹装饰，配备独立卫浴间、厨房区域和会客区。额头床尺寸为1.9m×1.4m，后部双人床尺寸为1.8m×1.5m，可舒适容纳4-6人休息。</p>
			<p style="margin-bottom: 16px;"><img src="/static/优惠政策.jpg" style="width: 100%; border-radius: 8px; margin: 12px 0;" /></p>
			<p style="margin-bottom: 16px;"><strong>动力系统</strong></p>
			<p style="margin-bottom: 12px;">搭载2.0T涡轮增压发动机，最大功率165kW，峰值扭矩350N·m，匹配6速自动变速箱，百公里油耗约12L。</p>
			<p style="margin-bottom: 16px;"><strong>适用场景</strong></p>
			<p style="margin-bottom: 12px;">适合家庭长途旅行、自驾游、露营等场景，特别适合带老人和孩子的家庭出游。</p>
		</div>
	`,
	reviews: [
		{
			userName: '张先生',
			date: '2024-11-20',
			rating: 5,
			content: '车况很好，配置齐全，客服态度也很好，下次还会选择这家！'
		},
		{
			userName: '李女士',
			date: '2024-11-15',
			rating: 4,
			content: '整体不错，就是取车时等了一会儿，其他都挺满意的。'
		}
	]
});

const vehicleImages = ref([
	'/static/场景推荐2.jpg',
	'/static/优惠政策.jpg',
	'/static/场景推荐2.jpg'
]);

onLoad((options: any) => {
	if (options.id) {
		vehicle.value.id = options.id;
		// TODO: 根据ID从后台加载车辆详情(包括detailHtml富文本)
		console.log('加载车辆详情:', options.id);
	}
});

const handleBook = () => {
	// 跳转到订单确认页
	uni.navigateTo({
		url: `/pages/order/confirm?vehicleId=${vehicle.value.id}`
	});
};
</script>

<style scoped lang="scss">
.vehicle-detail-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

.image-swiper {
	width: 100%;
	height: 560rpx;
	background-color: #F0F0F0;
}

.swiper-image {
	width: 100%;
	height: 100%;
}

.detail-scroll {
	flex: 1;
	height: 0;
}

.info-section {
	background-color: #FFFFFF;
	padding: 40rpx 32rpx;
	margin-bottom: 20rpx;
	border-radius: 0 0 $uni-border-radius-lg $uni-border-radius-lg;
	box-shadow: $uni-shadow-sm;
}

.vehicle-header {
	margin-bottom: 24rpx;
}

.vehicle-name {
	font-size: 40rpx;
	font-weight: 800;
	color: $uni-text-color;
	display: block;
	margin-bottom: 16rpx;
	line-height: 1.3;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.tag {
	font-size: 22rpx;
	color: $uni-color-primary;
	background-color: rgba(255, 159, 41, 0.1);
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-weight: 500;
}

.price-box {
	display: flex;
	align-items: baseline;
	color: $uni-color-primary;
}

.currency {
	font-size: 28rpx;
	font-weight: 600;
}

.price {
	font-size: 56rpx;
	font-weight: bold;
	margin: 0 4rpx;
	font-family: 'DIN Alternate', sans-serif;
}

.unit {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.section {
	background-color: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 20rpx;
	border-radius: $uni-border-radius-lg;
	box-shadow: $uni-shadow-sm;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
	margin-bottom: 32rpx;
	display: flex;
	align-items: center;
	
	&::before {
		content: '';
		width: 8rpx;
		height: 32rpx;
		background-color: $uni-color-primary;
		border-radius: 4rpx;
		margin-right: 16rpx;
	}
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.rating-score {
	font-size: 32rpx;
	color: #FFB400;
	font-weight: bold;
}

// 规格行布局
.specs-row {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
}

.spec-item-inline {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	padding: 24rpx 0;
	background-color: $uni-bg-color;
	border-radius: 16rpx;
}

.spec-text {
	font-size: 24rpx;
	color: $uni-text-color;
	font-weight: 500;
}

.features-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24rpx;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.feature-text {
	font-size: 28rpx;
	color: $uni-text-color;
}

// 车辆详情
.detail-content {
	line-height: 1.8;
	color: $uni-text-color;
	font-size: 28rpx;
}

.reviews-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.review-item {
	padding: 24rpx;
	background-color: $uni-bg-color;
	border-radius: 16rpx;
}

.review-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.reviewer-name {
	font-size: 28rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.review-date {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.review-rating {
	display: flex;
	gap: 4rpx;
	margin-bottom: 16rpx;
}

.review-content {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

.empty-reviews {
	text-align: center;
	padding: 60rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.bottom-placeholder {
	height: 140rpx;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background-color: #FFFFFF;
	border-top: 1rpx solid $uni-border-color-light;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.price-info {
	display: flex;
	flex-direction: column;
}

.price-label {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.price-value {
	display: flex;
	align-items: baseline;
	color: $uni-color-primary;
	
	.currency {
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.price {
		font-size: 44rpx;
		font-weight: bold;
		margin: 0 4rpx;
		font-family: 'DIN Alternate', sans-serif;
	}
	
	.unit {
		font-size: 22rpx;
	}
}

.book-btn {
	margin: 0;
	padding: 0 64rpx;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	background: linear-gradient(135deg, $uni-color-primary 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 44rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.3);
	
	&::after {
		border: none;
	}
	
	&:active {
		opacity: 0.9;
		transform: scale(0.98);
	}
}
</style>
