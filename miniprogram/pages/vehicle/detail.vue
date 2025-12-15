<template>
	<view class="vehicle-detail-page">
		<!-- 图片轮播 (沉浸式) -->
		<swiper class="image-swiper" 
			:indicator-dots="true" 
			:autoplay="false" 
			:circular="true"
			indicator-color="rgba(255,255,255,0.6)" 
			indicator-active-color="#FF9F29"
			:duration="500"
		>
			<swiper-item v-for="(image, index) in vehicleImages" :key="index">
				<image class="swiper-image" :src="image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 返回按钮 (悬浮) -->
		<view class="back-btn" :style="{ top: statusBarHeight + 8 + 'px' }" @tap="goBack">
			<u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
		</view>

		<scroll-view scroll-y class="detail-scroll">
			<!-- 内容容器 -->
			<view class="content-container">
				<!-- 基本信息卡片 -->
				<view class="info-card">
					<view class="header-row">
						<view class="title-wrap">
							<text class="vehicle-name">{{ vehicle.name }}</text>
							<view class="store-tag">
								<u-icon name="map-fill" size="12" color="#FF9F29"></u-icon>
								<text>{{ vehicle.storeName }}</text>
							</view>
						</view>
						<view class="share-btn">
							<u-icon name="share" size="20" color="#333"></u-icon>
						</view>
					</view>
					
					<view class="tags-row">
						<text v-for="(tag, index) in vehicle.tags" :key="index" class="tag">{{ tag }}</text>
					</view>
					
					<view class="divider"></view>
					
					<view class="price-row">
						<view class="price-left">
							<text class="currency">¥</text>
							<text class="price">{{ vehicle.price }}</text>
							<text class="unit">/日均</text>
						</view>
						<view class="rating-right">
							<u-icon name="star-fill" size="14" color="#FFB400"></u-icon>
							<text class="rating-score">{{ vehicle.rating }}</text>
							<text class="rating-count">(128条评价)</text>
						</view>
					</view>
				</view>

				<!-- 核心规格 (Grid) -->
				<view class="specs-grid">
					<view class="spec-box">
						<view class="spec-icon bg-blue">
							<u-icon name="car-fill" size="20" color="#2196F3"></u-icon>
						</view>
						<text class="spec-val">{{ vehicle.type }}</text>
						<text class="spec-label">车型</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-green">
							<u-icon name="account-fill" size="20" color="#4CAF50"></u-icon>
						</view>
						<text class="spec-val">{{ vehicle.seats }}座</text>
						<text class="spec-label">荷载</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-orange">
							<u-icon name="home-fill" size="20" color="#FF9800"></u-icon>
						</view>
						<text class="spec-val">{{ vehicle.beds }}卧</text>
						<text class="spec-label">床位</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-purple">
							<u-icon name="setting-fill" size="20" color="#9C27B0"></u-icon>
						</view>
						<text class="spec-val">{{ vehicle.transmission }}</text>
						<text class="spec-label">排挡</text>
					</view>
				</view>

				<!-- 车辆配置 (List) -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">车辆配置</text>
						<text class="more-link">全部配置</text>
					</view>
					<view class="features-grid">
						<view v-for="(feature, index) in vehicle.features" :key="index" class="feature-item">
							<u-icon name="checkmark-circle-fill" size="16" color="#FF9F29"></u-icon>
							<text>{{ feature }}</text>
						</view>
					</view>
				</view>

				<!-- 车辆详情 (RichText) -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">车辆详情</text>
					</view>
					<view class="rich-content">
						<rich-text :nodes="vehicle.detailHtml"></rich-text>
					</view>
				</view>

				<!-- 用户评价 -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">用户评价</text>
						<view class="rating-summary">
							<text class="score">{{ vehicle.rating }}</text>
							<text class="total">/5.0</text>
						</view>
					</view>
					
					<view v-if="vehicle.reviews && vehicle.reviews.length" class="reviews-list">
						<view v-for="(review, index) in vehicle.reviews" :key="index" class="review-item">
							<view class="review-user">
								<image src="/static/default-avatar.png" class="user-avatar"></image>
								<view class="user-info">
									<text class="user-name">{{ review.userName }}</text>
									<text class="review-date">{{ review.date }}</text>
								</view>
								<view class="user-rating">
									<u-icon v-for="n in 5" :key="n" :name="n <= review.rating ? 'star-fill' : 'star'" size="12" :color="n <= review.rating ? '#FFB400' : '#DDD'"></u-icon>
								</view>
							</view>
							<text class="review-content">{{ review.content }}</text>
						</view>
					</view>
					<view v-else class="empty-reviews">
						<text>暂无评价</text>
					</view>
					
					<view class="view-all-btn">
						<text>查看全部评价</text>
						<u-icon name="arrow-right" size="12" color="#666"></u-icon>
					</view>
				</view>

				<!-- 底部安全区占位 -->
				<view class="safe-area-placeholder"></view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="bottom-left">
				<view class="action-item">
					<u-icon name="kefu-ermai" size="22" color="#333"></u-icon>
					<text>客服</text>
				</view>
				<view class="action-item">
					<u-icon name="heart" size="22" color="#333"></u-icon>
					<text>收藏</text>
				</view>
			</view>
			<button class="book-btn" @tap="handleBook">
				<text>立即预订</text>
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const statusBarHeight = ref(0);

// 车辆数据
const vehicle = ref({
	id: '',
	name: '上汽大通RG10 生活家V90',
	type: 'C型房车',
	seats: 6,
	beds: 4,
	transmission: '自动挡',
	price: 680,
	tags: ['热门', '新车', '独立卫浴'],
	rating: 4.8,
	storeName: '深圳宝安店',
	storeAddress: '深圳市宝安区XX路XX号',
	features: [
		'独立卫浴', '冷暖空调', '车载冰箱', '微波炉',
		'燃气灶', '太阳能板', '倒车影像', '定速巡航'
	],
	detailHtml: `
		<div style="line-height: 1.8; color: #333; font-size: 15px;">
			<p style="margin-bottom: 16px;"><strong>车辆介绍</strong></p>
			<p style="margin-bottom: 12px; color: #666;">上汽大通RG10是一款专为家庭出游设计的C型房车，采用经典的额头床设计，空间利用率极高。车身长度5.99米，宽度2.5米，高度3.2米，整备质量3.5吨。</p>
			<p style="margin-bottom: 16px;"><img src="/static/场景推荐2.jpg" style="width: 100%; border-radius: 12px; margin: 12px 0; display: block;" /></p>
			<p style="margin-bottom: 16px;"><strong>内部空间</strong></p>
			<p style="margin-bottom: 12px; color: #666;">车内采用温馨的木纹装饰，配备独立卫浴间、厨房区域和会客区。额头床尺寸为1.9m×1.4m，后部双人床尺寸为1.8m×1.5m，可舒适容纳4-6人休息。</p>
		</div>
	`,
	reviews: [
		{ userName: '张先生', date: '2024-11-20', rating: 5, content: '车况很好，配置齐全，客服态度也很好，下次还会选择这家！' },
		{ userName: '李女士', date: '2024-11-15', rating: 4, content: '整体不错，就是取车时等了一会儿，其他都挺满意的。' }
	]
});

const vehicleImages = ref([
	'/static/场景推荐2.jpg',
	'/static/优惠政策.jpg',
	'/static/场景推荐2.jpg'
]);

onLoad((options: any) => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;

	if (options.id) {
		vehicle.value.id = options.id;
		console.log('加载车辆详情:', options.id);
	}
});

const goBack = () => {
	uni.navigateBack();
};

const handleBook = () => {
	uni.navigateTo({
		url: `/pages/order/confirm?vehicleId=${vehicle.value.id}`
	});
};
</script>

<style scoped lang="scss">
.vehicle-detail-page {
	min-height: 100vh;
	background-color: #F8F9FC;
	display: flex;
	flex-direction: column;
}

/* 沉浸式轮播 */
.image-swiper {
	width: 100%;
	height: 600rpx;
	background-color: #EEE;
}

.swiper-image {
	width: 100%;
	height: 100%;
}

.back-btn {
	position: fixed;
	left: 32rpx;
	z-index: 100;
	width: 64rpx;
	height: 64rpx;
	background-color: rgba(0,0,0,0.4);
	backdrop-filter: blur(4px);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.detail-scroll {
	flex: 1;
	height: 0;
	margin-top: -40rpx; // 上拉遮挡图片底部
	position: relative;
	z-index: 10;
}

.content-container {
	padding: 0 32rpx;
}

/* 信息卡片 */
.info-card {
	background-color: #FFFFFF;
	border-radius: 32rpx;
	padding: 40rpx 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
	margin-bottom: 24rpx;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.title-wrap {
	flex: 1;
	margin-right: 24rpx;
}

.vehicle-name {
	font-size: 40rpx;
	font-weight: 800;
	color: #1D2129;
	line-height: 1.3;
	display: block;
	margin-bottom: 12rpx;
}

.store-tag {
	display: inline-flex;
	align-items: center;
	gap: 6rpx;
	background-color: rgba(255, 159, 41, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	
	text {
		font-size: 22rpx;
		color: #FF9F29;
		font-weight: 500;
	}
}

.share-btn {
	width: 64rpx;
	height: 64rpx;
	background-color: #F2F3F5;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.tag {
	font-size: 22rpx;
	color: #4E5969;
	background-color: #F7F8FA;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

.divider {
	height: 1rpx;
	background-color: #F2F3F5;
	margin-bottom: 24rpx;
}

.price-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-left {
	display: flex;
	align-items: baseline;
	color: #FF4D4F;
}

.currency { font-size: 28rpx; font-weight: bold; }
.price { font-size: 56rpx; font-weight: 800; font-family: 'DIN Alternate', sans-serif; margin: 0 4rpx; }
.unit { font-size: 24rpx; color: #86909C; }

.rating-right {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.rating-score { font-size: 32rpx; font-weight: bold; color: #1D2129; }
.rating-count { font-size: 24rpx; color: #86909C; }

/* 规格 Grid */
.specs-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
	margin-bottom: 24rpx;
}

.spec-box {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}

.spec-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12rpx;
	
	&.bg-blue { background-color: rgba(33, 150, 243, 0.1); }
	&.bg-green { background-color: rgba(76, 175, 80, 0.1); }
	&.bg-orange { background-color: rgba(255, 152, 0, 0.1); }
	&.bg-purple { background-color: rgba(156, 39, 176, 0.1); }
}

.spec-val { font-size: 26rpx; font-weight: bold; color: #1D2129; margin-bottom: 4rpx; }
.spec-label { font-size: 22rpx; color: #86909C; }

/* 通用 Section */
.section-card {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
	position: relative;
	padding-left: 20rpx;
	
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 8rpx;
		height: 28rpx;
		background-color: #FF9F29;
		border-radius: 4rpx;
	}
}

.more-link { font-size: 26rpx; color: #86909C; }

/* 配置列表 */
.features-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24rpx;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 28rpx;
	color: #4E5969;
}

/* 评价 */
.rating-summary {
	display: flex;
	align-items: baseline;
	gap: 4rpx;
	
	.score { font-size: 40rpx; font-weight: bold; color: #FFB400; font-family: 'DIN Alternate', sans-serif; }
	.total { font-size: 24rpx; color: #86909C; }
}

.reviews-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.review-item {
	border-bottom: 1rpx solid #F5F5F5;
	padding-bottom: 32rpx;
	
	&:last-child { border-bottom: none; padding-bottom: 0; }
}

.review-user {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.user-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	margin-right: 16rpx;
	background-color: #EEE;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.user-name { font-size: 26rpx; color: #1D2129; font-weight: 500; }
.review-date { font-size: 22rpx; color: #86909C; }
.user-rating { display: flex; gap: 4rpx; }

.review-content {
	font-size: 28rpx;
	color: #4E5969;
	line-height: 1.6;
}

.view-all-btn {
	margin-top: 32rpx;
	height: 80rpx;
	background-color: #F7F8FA;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	font-size: 26rpx;
	color: #4E5969;
}

.safe-area-placeholder {
	height: 180rpx;
}

/* 底部栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #FFFFFF;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 99;
}

.bottom-left {
	display: flex;
	gap: 40rpx;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	font-size: 20rpx;
	color: #4E5969;
}

.book-btn {
	margin: 0;
	flex: 1;
	margin-left: 48rpx;
	height: 88rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	border-radius: 44rpx;
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.3);
	
	&::after { border: none; }
}
</style>