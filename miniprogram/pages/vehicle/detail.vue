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

				<!-- 公告栏 -->
				<AnnouncementBar :content="vehicle.announcement" />

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
				<view class="action-item" @tap="handleShare">
					<u-icon name="share-fill" size="22" color="#333"></u-icon>
					<text>分享</text>
				</view>
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

		<!-- 分享面板 -->
		<ShareSheet
			v-model:show="showShareSheet"
			@select="handleShareSelect"
		/>

		<!-- 海报预览 -->
		<PosterPreview
			v-model:show="showPosterPopup"
			:poster-image="posterImage"
			@save="savePoster"
		/>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import { useShare } from '@/composables/useShare';
import { ShareScene } from '@/types/share';
import ShareSheet from '@/components/share/ShareSheet.vue';
import PosterPreview from '@/components/share/PosterPreview.vue';
import AnnouncementBar from '@/components/common/AnnouncementBar.vue';

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
	announcement: '【重要提醒】本车辆配备全新升级的智能驾驶辅助系统，首次租用客户可享受免费驾驶培训服务。春节期间租期需满7天，请提前规划行程。车辆已投保全险，但请注意高速公路限速要求。',
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

// 分享功能
const {
	showShareSheet,
	showPosterPopup,
	posterImage,
	openShareSheet,
	handleShareSelect,
	savePoster,
	getShareContent
} = useShare({
	title: `【叨叨房车】${vehicle.value.name}`,
	desc: `日均¥${vehicle.value.price}起，${vehicle.value.type}，${vehicle.value.seats}座${vehicle.value.beds}卧`,
	imageUrl: vehicleImages.value[0],
	path: '/pages/vehicle/detail',
	scene: ShareScene.VEHICLE,
	businessId: vehicle.value.id || 'demo_vehicle',
	query: {
		id: vehicle.value.id || 'demo_vehicle'
	}
});

onLoad((options: any) => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;

	// 从本地存储读取完整的车辆数据
	const selectedVehicle = uni.getStorageSync('selected_vehicle');

	if (selectedVehicle) {
		// 使用列表页传递的完整数据
		vehicle.value = {
			...vehicle.value,
			id: selectedVehicle.id,
			name: selectedVehicle.name,
			type: selectedVehicle.type,
			seats: selectedVehicle.seats,
			beds: selectedVehicle.beds,
			transmission: selectedVehicle.transmission,
			price: selectedVehicle.price,
			tags: selectedVehicle.tags || [],
			storeName: selectedVehicle.storeName,
			storeId: selectedVehicle.storeId,
			brand: selectedVehicle.brand
		};

		logger.debug('加载车辆详情(从存储):', {
			id: vehicle.value.id,
			name: vehicle.value.name,
			storeName: vehicle.value.storeName
		});
	} else if (options.id) {
		// 兼容直接传递ID的情况
		vehicle.value.id = options.id;
		logger.debug('加载车辆详情(仅ID):', options.id);
	}

	// 处理分享来源
	if (options.share_from) {
		logger.info('来自分享', {
			scene: options.share_scene,
			from: options.share_from,
			businessId: options.share_id
		});
	}
});

// 配置微信分享
onShareAppMessage(() => {
	return getShareContent();
});

// 打开分享面板
const handleShare = () => {
	openShareSheet();
};

const goBack = () => {
	uni.navigateBack();
};

const handleBook = () => {
	// 从存储中获取搜索参数
	const selectedVehicle = uni.getStorageSync('selected_vehicle');
	const searchParams = selectedVehicle?.searchParams || {};

	// 将车辆信息和搜索参数存储，供订单确认页使用
	uni.setStorageSync('order_booking_data', {
		vehicle: vehicle.value,
		searchParams: searchParams
	});

	logger.debug('跳转到订单确认页', {
		vehicleId: vehicle.value.id,
		storeName: vehicle.value.storeName,
		searchParams
	});

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

/* 沉浸式轮播 */
.image-swiper {
	width: 100%;
	height: 600rpx;
	background-color: $uni-bg-color-grey;
}

.swiper-image {
	width: 100%;
	height: 100%;
}

.back-btn {
	position: fixed;
	left: $uni-spacing-lg;
	z-index: 100;
	width: 72rpx;
	height: 72rpx;
	background-color: rgba(0, 0, 0, 0.35);
	backdrop-filter: blur(8px);
	border-radius: $uni-radius-circle;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.2s ease;

	&:active {
		transform: scale(0.95);
	}
}

.detail-scroll {
	flex: 1;
	height: 0;
	margin-top: -48rpx;
	position: relative;
	z-index: 10;
}

.content-container {
	padding: 0 $uni-spacing-lg;
}

/* 信息卡片 */
.info-card {
	background-color: $uni-bg-color-card;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-xl $uni-spacing-lg;
	box-shadow: $uni-shadow-float;
	margin-bottom: $uni-spacing-md;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: $uni-spacing-md;
}

.title-wrap {
	flex: 1;
	margin-right: $uni-spacing-md;
}

.vehicle-name {
	font-size: $uni-font-size-xl;
	font-weight: 800;
	color: $uni-text-color;
	line-height: 1.3;
	display: block;
	margin-bottom: $uni-spacing-sm;
}

.store-tag {
	display: inline-flex;
	align-items: center;
	gap: 6rpx;
	background-color: rgba(255, 159, 41, 0.1);
	padding: 6rpx 16rpx;
	border-radius: $uni-radius-xs;

	text {
		font-size: $uni-font-size-xs;
		color: $uni-color-primary;
		font-weight: 500;
	}
}

.share-btn {
	width: 72rpx;
	height: 72rpx;
	background-color: $uni-bg-color-grey;
	border-radius: $uni-radius-circle;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.2s ease;

	&:active {
		transform: scale(0.95);
	}
}

.tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: $uni-spacing-sm;
	margin-bottom: $uni-spacing-md;
}

.tag {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-secondary;
	background-color: $uni-bg-color-grey;
	padding: 8rpx 20rpx;
	border-radius: $uni-radius-xs;
}

.divider {
	height: 1rpx;
	background-color: $uni-border-color-light;
	margin-bottom: $uni-spacing-md;
}

.price-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-left {
	display: flex;
	align-items: baseline;
	color: $uni-color-error;
}

.currency {
	font-size: $uni-font-size-base;
	font-weight: bold;
}

.price {
	font-size: 56rpx;
	font-weight: 800;
	font-family: 'DIN Alternate', sans-serif;
	margin: 0 4rpx;
}

.unit {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-placeholder;
}

.rating-right {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.rating-score {
	font-size: $uni-font-size-md;
	font-weight: bold;
	color: $uni-text-color;
}

.rating-count {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-placeholder;
}

/* 规格 Grid */
.specs-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: $uni-spacing-md;
	margin-bottom: $uni-spacing-md;
}

.spec-box {
	background-color: $uni-bg-color-card;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-md 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: $uni-shadow-card;
	transition: transform 0.2s ease;

	&:active {
		transform: scale(0.98);
	}
}

.spec-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: $uni-radius-circle;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: $uni-spacing-sm;

	&.bg-blue {
		background-color: rgba(33, 150, 243, 0.1);
	}

	&.bg-green {
		background-color: rgba(76, 175, 80, 0.1);
	}

	&.bg-orange {
		background-color: rgba(255, 152, 0, 0.1);
	}

	&.bg-purple {
		background-color: rgba(156, 39, 176, 0.1);
	}
}

.spec-val {
	font-size: $uni-font-size-sm;
	font-weight: bold;
	color: $uni-text-color;
	margin-bottom: 4rpx;
}

.spec-label {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-placeholder;
}

/* 通用 Section */
.section-card {
	background-color: $uni-bg-color-card;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;
	box-shadow: $uni-shadow-card;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: $uni-spacing-lg;
}

.section-title {
	font-size: $uni-font-size-md;
	font-weight: bold;
	color: $uni-text-color;
	position: relative;
	padding-left: $uni-spacing-md;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 8rpx;
		height: 28rpx;
		background-color: $uni-color-primary;
		border-radius: 4rpx;
	}
}

.more-link {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-placeholder;
}

/* 配置列表 */
.features-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: $uni-spacing-md;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: $uni-spacing-sm;
	font-size: $uni-font-size-base;
	color: $uni-text-color-secondary;
}

/* 评价 */
.rating-summary {
	display: flex;
	align-items: baseline;
	gap: 4rpx;

	.score {
		font-size: $uni-font-size-xl;
		font-weight: bold;
		color: #FFB400;
		font-family: 'DIN Alternate', sans-serif;
	}

	.total {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-placeholder;
	}
}

.reviews-list {
	display: flex;
	flex-direction: column;
	gap: $uni-spacing-lg;
}

.review-item {
	border-bottom: 1rpx solid $uni-border-color-light;
	padding-bottom: $uni-spacing-lg;

	&:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
}

.review-user {
	display: flex;
	align-items: center;
	margin-bottom: $uni-spacing-sm;
}

.user-avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: $uni-radius-circle;
	margin-right: $uni-spacing-sm;
	background-color: $uni-bg-color-grey;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
	font-weight: 500;
}

.review-date {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-placeholder;
}

.user-rating {
	display: flex;
	gap: 4rpx;
}

.review-content {
	font-size: $uni-font-size-base;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

.empty-reviews {
	padding: $uni-spacing-xl 0;
	text-align: center;
	color: $uni-text-color-placeholder;
	font-size: $uni-font-size-base;
}

.view-all-btn {
	margin-top: $uni-spacing-lg;
	height: 88rpx;
	background-color: $uni-bg-color-grey;
	border-radius: $uni-radius-btn;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: $uni-spacing-xs;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-secondary;
	transition: background-color 0.2s ease;

	&:active {
		background-color: $uni-border-color;
	}
}

.safe-area-placeholder {
	height: 200rpx;
}

/* 底部栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: $uni-bg-color-card;
	padding: $uni-spacing-md $uni-spacing-lg;
	padding-bottom: calc(#{$uni-spacing-md} + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 99;
	box-sizing: border-box;
}

.bottom-left {
	display: flex;
	gap: $uni-spacing-xl;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	font-size: $uni-font-size-xs;
	color: $uni-text-color-secondary;
	transition: opacity 0.2s ease;

	&:active {
		opacity: 0.7;
	}
}

.book-btn {
	margin: 0;
	flex: 1;
	margin-left: $uni-spacing-xl;
	height: 96rpx;
	background: $uni-color-primary-gradient;
	border-radius: $uni-radius-btn;
	color: $uni-text-color-inverse;
	font-size: $uni-font-size-md;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: $uni-shadow-glow;
	transition: transform 0.2s ease, opacity 0.2s ease;

	&:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	&::after {
		border: none;
	}
}
</style>