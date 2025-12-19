<template>
	<view class="index-page">
		<!-- 沉浸式导航栏 (Fixed) -->
		<view class="navbar-fixed" :style="{ paddingTop: statusBarHeight + 'px', background: navbarBackground }">
			<view class="navbar-content">
				<text class="navbar-title" :style="{ color: navbarColor }">叨叨房车</text>
				<view class="navbar-actions">
					<u-icon name="bell" size="24" :color="navbarColor"></u-icon>
				</view>
			</view>
		</view>

		<!-- 沉浸式 Hero 区域 (包含轮播) -->
		<view class="hero-section">
			<u-swiper
				:list="banners"
				keyName="image"
				:autoplay="true"
				:circular="true"
				height="480"
				:radius="0"
				bgColor="#F8F9FC"
				indicator
				indicatorMode="dot"
				indicatorActiveColor="#FF9F29"
				indicatorInactiveColor="rgba(255,255,255,0.5)"
			></u-swiper>
			<!-- 底部遮罩，平滑过渡到页面背景 -->
			<view class="hero-mask"></view>
		</view>

		<!-- 主要内容容器 (负 margin 实现悬浮堆叠) -->
		<view class="content-container">
			
			<!-- 悬浮预订表单 -->
			<view class="floating-form-wrapper">
				<BookingForm ref="bookingFormRef" @search="handleSearch" @open-date-picker="handleOpenDatePicker" />
			</view>

			<!-- 公告栏 (移到表单下方) -->
			<view class="notice-wrapper">
				<NoticeBanner :notices="notices" @click="handleNoticeClick" />
			</view>

			<!-- 金刚区服务 -->
			<ServiceGrid />

			<!-- 推广卡片 -->
			<view class="promo-cards">
				<view class="promo-card" @tap="navigateTo('/pages/coupon-mall/index')">
					<view class="promo-content">
						<text class="promo-title">特惠商城</text>
						<text class="promo-desc">限时特惠套餐</text>
					</view>
					<view class="promo-icon-box">
						<u-icon name="gift-fill" size="28" color="#FF9F29"></u-icon>
					</view>
				</view>
				<view class="promo-card" @tap="navigateTo('/pages/membership/index')">
					<view class="promo-content">
						<text class="promo-title">PLUS会员</text>
						<text class="promo-desc">尊享专属权益</text>
					</view>
					<view class="promo-icon-box">
						<u-icon name="level" size="28" color="#FFD700"></u-icon>
					</view>
				</view>
			</view>

			<!-- 社区精选 -->
			<view class="section-header">
				<text class="section-title">社区精选</text>
				<view class="section-more" @tap="uni.switchTab({ url: '/pages/community/index' })">
					<text>更多</text>
					<u-icon name="arrow-right" size="12" color="#999"></u-icon>
				</view>
			</view>
			
			<view class="content-list">
				<view
					v-for="(item, index) in communityList"
					:key="index"
					class="content-item"
					@tap="navigateTo('/pages/community/detail?id=' + item.id)"
				>
					<image class="content-image" :src="item.image" mode="aspectFill"></image>
					<view class="content-info">
						<text class="content-title">{{ item.title }}</text>
						<view class="content-footer">
							<view class="author-box">
								<u-icon name="account-fill" size="14" color="#999"></u-icon>
								<text class="author-name">{{ item.author }}</text>
							</view>
							<view class="likes-box">
								<u-icon name="heart" size="14" color="#999"></u-icon>
								<text class="likes-count">{{ item.likes }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 根节点弹窗 -->
		<RentDatePicker ref="rentDatePickerRef" @confirm="handleDateConfirm" />
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, onMounted } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import NoticeBanner from '@/components/base/NoticeBanner.vue';
import BookingForm from '@/components/business/BookingForm.vue';
import ServiceGrid from '@/components/business/ServiceGrid.vue';
import RentDatePicker from '@/components/business/RentDatePicker.vue';
import { getUserLocation, reverseGeocode, type LocationResult, type LocationError, LocationErrorType } from '@/utils/location';

// 状态栏高度
const statusBarHeight = ref(0);
// 导航栏样式状态
const navbarBackground = ref('rgba(255, 255, 255, 0)');
const navbarColor = ref('#FFFFFF');

// 公告数据
const notices = ref([
	{ id: '1', content: '国庆假期房车火热预订中,部分车型已售罄!' },
	{ id: '2', content: '新用户注册即送100元优惠券!' }
]);

// 轮播图数据 (使用更宽幅的图片展示)
const banners = ref([
	{ id: '1', image: '/static/场景推荐2.jpg' },
	{ id: '2', image: '/static/优惠政策.jpg' }
]);

const bookingFormRef = ref();
const rentDatePickerRef = ref();

// 社区内容
const communityList = ref([
	{
		id: '1',
		title: '我们最爱的海滨营地，拥有绝美海景的完美度假地',
		description: '拥有绝美海景的完美度假地。',
		author: '旅行一家人',
		likes: '1.2k',
		image: '/static/场景推荐2.jpg'
	},
	{
		id: '2',
		title: '优胜美地周末游，充分利用国家公园之旅的小贴士',
		description: '充分利用国家公园之旅的小贴士。',
		author: '冒险家',
		likes: '980',
		image: '/static/优惠政策.jpg'
	},
	{
		id: '3',
		title: '房车露营初体验，第一次租房车需要注意什么？',
		description: '第一次租房车需要注意什么？',
		author: '新手上路',
		likes: '560',
		image: '/static/场景推荐2.jpg'
	},
	{
		id: '4',
		title: '川西小环线攻略，7天6晚，感受高原的魅力',
		description: '7天6晚，感受高原的魅力。',
		author: '自驾达人',
		likes: '2.3k',
		image: '/static/优惠政策.jpg'
	}
]);

// 用户位置信息
const userLocation = ref<LocationResult | null>(null);
const userCity = ref<string>('');

onMounted(() => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight || 0;

	// 初始化定位
	initLocation();
});

// 监听滚动，实现导航栏渐变
onPageScroll((e) => {
	const scrollTop = e.scrollTop;
	const threshold = 100; // 滚动阈值
	
	if (scrollTop > threshold) {
		navbarBackground.value = 'rgba(255, 255, 255, 0.98)';
		navbarColor.value = '#1A1A1A';
	} else {
		// 计算透明度
		const opacity = scrollTop / threshold;
		navbarBackground.value = `rgba(255, 255, 255, ${opacity})`;
		// 文字颜色过渡 (简单处理: 超过一半变黑，否则白)
		navbarColor.value = opacity > 0.5 ? '#1A1A1A' : '#FFFFFF';
	}
});

/**
 * 初始化定位
 */
const initLocation = async () => {
	try {
		logger.debug('[首页] 开始获取用户位置');

		// 获取用户位置
		const location = await getUserLocation({
			type: 'gcj02',
			showLoading: true,
			timeout: 10000
		});

		userLocation.value = location;
		logger.debug('[首页] 获取位置成功:', location);

		// 逆地理编码获取城市
		const city = await reverseGeocode(location.latitude, location.longitude);
		userCity.value = city;
		logger.debug('[首页] 当前城市:', city);

		// 显示成功提示
		uni.showToast({
			title: `定位成功：${city}`,
			icon: 'success',
			duration: 2000
		});

	} catch (error) {
		const locationError = error as LocationError;
		logger.error('[首页] 获取位置失败:', locationError);

		// 根据错误类型显示不同提示
		let errorMessage = '定位失败';

		switch (locationError.type) {
			case LocationErrorType.PERMISSION_DENIED:
				errorMessage = '定位权限被拒绝，部分功能可能无法使用';
				break;
			case LocationErrorType.TIMEOUT:
				errorMessage = '定位超时，请检查网络连接';
				break;
			case LocationErrorType.LOCATION_UNAVAILABLE:
				errorMessage = '定位服务不可用，请检查手机定位设置';
				break;
			default:
				errorMessage = locationError.message || '定位失败';
		}

		uni.showToast({
			title: errorMessage,
			icon: 'none',
			duration: 3000
		});

		// 使用默认城市
		userCity.value = '北京';
		logger.debug('[首页] 使用默认城市:', userCity.value);
	}
};

const handleNoticeClick = (notice: any) => {
	logger.debug('点击公告:', notice);
};

const handleSearch = (params: any) => {
	uni.navigateTo({ url: '/pages/vehicle/list' });
};

const handleOpenDatePicker = (data: any) => {
	rentDatePickerRef.value?.open(data.pickupDate, data.returnDate, data.time);
};

const handleDateConfirm = (data: any) => {
	bookingFormRef.value?.onDateConfirm(data);
};

const navigateTo = (url: string) => {
	uni.navigateTo({ url });
};
</script>

<style scoped lang="scss">
.index-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 40rpx;
}

/* 沉浸式导航 */
.navbar-fixed {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	transition: background 0.3s ease;
	backdrop-filter: blur(5px);
}

.navbar-content {
	height: 88rpx; /* 标准导航栏高度 */
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
}

.navbar-title {
	font-size: 36rpx;
	font-weight: 800;
	letter-spacing: 1px;
	transition: color 0.3s;
}

.navbar-actions {
	transition: color 0.3s;
}

/* Hero 区域 */
.hero-section {
	position: relative;
	width: 100%;
	z-index: 0;
}

.hero-mask {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 160rpx;
	background: linear-gradient(to bottom, rgba(248,249,252,0) 0%, rgba(248,249,252,1) 100%);
	z-index: 1;
}

/* 内容容器 */
.content-container {
	position: relative;
	z-index: 1;
	padding: 0 32rpx;
	margin-top: -120rpx; /* 关键：负边距实现重叠 */
}

.floating-form-wrapper {
	margin-bottom: 32rpx;
}

.notice-wrapper {
	margin-bottom: 32rpx;
}

/* 推广卡片 */
.promo-cards {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-top: 32rpx;
}

.promo-card {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	box-shadow: $uni-shadow-sm;
	position: relative;
	overflow: hidden;
	
	&:active {
		transform: scale(0.98);
	}
}

.promo-content {
	z-index: 2;
}

.promo-title {
	display: block;
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
	margin-bottom: 8rpx;
}

.promo-desc {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.promo-icon-box {
	width: 64rpx;
	height: 64rpx;
	background-color: rgba(255, 159, 41, 0.08);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 社区精选 */
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 48rpx 0 24rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: 800;
	color: $uni-text-color;
}

.section-more {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.content-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.content-item {
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: $uni-shadow-sm;
	display: flex;
	flex-direction: row;
	padding: 20rpx;
	gap: 24rpx;
}

.content-image {
	width: 220rpx;
	height: 160rpx;
	border-radius: 16rpx;
	background-color: #F0F0F0;
	flex-shrink: 0;
}

.content-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.content-title {
	font-size: 30rpx;
	font-weight: 600;
	color: $uni-text-color;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.content-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16rpx;
}

.author-box, .likes-box {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.likes-count {
	font-family: 'DIN Alternate', sans-serif;
}
</style>