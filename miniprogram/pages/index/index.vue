<template>
	<view class="index-page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="navbar-content">
				<text class="navbar-title">叨叨房车</text>
				<view class="navbar-actions">
					<u-icon name="notification" size="24" color="#333"></u-icon>
				</view>
			</view>
		</view>

		<!-- 公告轮播 -->
		<NoticeBanner :notices="notices" @click="handleNoticeClick" />

		<!-- 轮播图 -->
		<view class="banner-swiper">
			<swiper 
				class="swiper" 
				:indicator-dots="true" 
				:autoplay="true" 
				:interval="3000" 
				:circular="true"
				indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#FF9F29"
			>
				<swiper-item v-for="(banner, index) in banners" :key="index">
					<image class="banner-image" :src="banner.image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 预订表单 -->
		<view class="booking-section">
			<BookingForm @search="handleSearch" />
		</view>

		<!-- 服务入口 -->
		<ServiceGrid />

		<!-- 推广卡片 -->
		<view class="promo-cards">
			<view class="promo-card" @tap="navigateTo('/pages/coupon-mall/index')">
				<view class="promo-content">
					<text class="promo-title">特惠商城</text>
					<text class="promo-desc">特惠套餐</text>
				</view>
				<u-icon name="gift-fill" size="40" color="#FF9F29"></u-icon>
			</view>
			<view class="promo-card" @tap="navigateTo('/pages/membership/index')">
				<view class="promo-content">
					<text class="promo-title">PLUS会员</text>
					<text class="promo-desc">专属权益</text>
				</view>
				<u-icon name="vip-fill" size="40" color="#FF9F29"></u-icon>
			</view>
		</view>

		<!-- 社区内容列表 -->
		<view class="content-section">
			<view class="section-title">
				<text class="title-text">社区精选</text>
				<view class="more-link" @tap="uni.switchTab({ url: '/pages/community/index' })">
					<text class="more-text">更多</text>
					<u-icon name="right" size="14" color="#999"></u-icon>
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
						<text class="content-desc">{{ item.description }}</text>
						<view class="content-meta">
							<text class="meta-text">by @{{ item.author }}</text>
							<view class="meta-likes">
								<u-icon name="heart" size="14" color="#999"></u-icon>
								<text class="meta-text">{{ item.likes }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NoticeBanner from '@/components/base/NoticeBanner.vue';
import BookingForm from '@/components/business/BookingForm.vue';
import ServiceGrid from '@/components/business/ServiceGrid.vue';

// 状态栏高度
const statusBarHeight = ref(0);

// 公告数据
const notices = ref([
	{ id: '1', content: '国庆假期房车火热预订中,部分车型已售罄!' },
	{ id: '2', content: '新用户注册即送100元优惠券!' }
]);

// 轮播图数据
const banners = ref([
	{ id: '1', image: '/static/场景推荐2.jpg' },
	{ id: '2', image: '/static/优惠政策.jpg' }
]);


// 社区内容
const communityList = ref([
	{
		id: '1',
		title: '我们最爱的海滨营地',
		description: '拥有绝美海景的完美度假地。',
		author: '旅行一家人',
		likes: '1.2k',
		image: '/static/场景推荐2.jpg'
	},
	{
		id: '2',
		title: '优胜美地周末游',
		description: '充分利用国家公园之旅的小贴士。',
		author: '冒险家',
		likes: '980',
		image: '/static/优惠政策.jpg'
	},
	{
		id: '3',
		title: '房车露营初体验',
		description: '第一次租房车需要注意什么？',
		author: '新手上路',
		likes: '560',
		image: '/static/场景推荐2.jpg'
	},
	{
		id: '4',
		title: '川西小环线攻略',
		description: '7天6晚，感受高原的魅力。',
		author: '自驾达人',
		likes: '2.3k',
		image: '/static/优惠政策.jpg'
	}
]);

onMounted(() => {
	// 获取状态栏高度
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight || 0;
	
	// 自动定位逻辑
	checkLocationPermission();
});

const checkLocationPermission = () => {
	// #ifdef MP-WEIXIN
	uni.getSetting({
		success(res) {
			if (!res.authSetting['scope.userLocation']) {
				authorizeLocation();
			} else {
				getLocation();
			}
		}
	});
	// #endif
	// #ifndef MP-WEIXIN
	getLocation(); // H5或其他平台直接尝试获取
	// #endif
};

const authorizeLocation = () => {
	uni.authorize({
		scope: 'scope.userLocation',
		success() {
			getLocation();
		},
		fail() {
			console.log('用户拒绝定位权限');
			// 可以选择显示默认城市或提示用户
		}
	});
};

const getLocation = () => {
	uni.getLocation({
		type: 'gcj02',
		success: function (res) {
			console.log('当前位置：' + res.longitude + ',' + res.latitude);
			// TODO: 调用逆地理编码API获取城市名称
			// 这里模拟定位到杭州
			uni.showToast({
				title: '已定位到杭州',
				icon: 'none'
			});
		},
		fail: function () {
			console.log('获取位置失败');
		}
	});
};

const handleNoticeClick = (notice: any) => {
	console.log('点击公告:', notice);
};

const handleSearch = (params: any) => {
	console.log('搜索参数:', params);
	uni.navigateTo({
		url: '/pages/vehicle/list'
	});
};

const navigateTo = (url: string) => {
	uni.navigateTo({ url });
};
</script>

<style scoped lang="scss">
.index-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 20rpx;
}

.custom-navbar {
	background-color: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.navbar-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 32rpx;
}

.navbar-title {
	font-size: 36rpx;
	font-weight: 800;
	color: $uni-color-secondary;
	letter-spacing: -0.5px;
}

.navbar-actions {
	display: flex;
	align-items: center;
}

.banner-swiper {
	width: 100%;
	padding: 24rpx 0 0; // Remove horizontal padding
}

.swiper {
	width: 100%;
	height: 340rpx;
	// border-radius: $uni-border-radius-lg; // Remove border radius for full width
	overflow: hidden;
	box-shadow: $uni-shadow-md;
	transform: translateY(0);
}

.banner-image {
	width: 100%;
	height: 100%;
}

.booking-section {
	padding: 0 32rpx;
	margin-top: 24rpx;
	position: relative;
	z-index: 10;
}

.promo-cards {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24rpx;
	padding: 0 32rpx 32rpx;
}

.promo-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	background-color: #FFFFFF;
	border-radius: $uni-border-radius-lg;
	box-shadow: $uni-shadow-sm;
	transition: transform 0.2s;
	
	&:active {
		transform: scale(0.98);
	}
}

.promo-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.promo-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.promo-desc {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.content-section {
	padding: 0 32rpx 32rpx;
}

.section-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.title-text {
	font-size: 34rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.more-link {
	display: flex;
	align-items: center;
	gap: 4rpx;
	padding: 8rpx 16rpx;
	background-color: rgba(0, 0, 0, 0.03);
	border-radius: 24rpx;
}

.more-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.content-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.content-item {
	display: flex;
	gap: 24rpx;
	background-color: #FFFFFF;
	border-radius: $uni-border-radius-lg;
	overflow: hidden;
	padding: 20rpx;
	box-shadow: $uni-shadow-sm;
}

.content-image {
	width: 200rpx;
	height: 200rpx;
	flex-shrink: 0;
	border-radius: $uni-border-radius-md;
	background-color: #F0F0F0;
}

.content-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 4rpx 0;
}

.content-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
	line-height: 1.4;
	margin-bottom: 8rpx;
}

.content-desc {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.content-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 16rpx;
}

.meta-text {
	font-size: 22rpx;
	color: #999;
}

.meta-likes {
	display: flex;
	align-items: center;
	gap: 6rpx;
	background-color: #FFF5E9;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	
	.meta-text {
		color: $uni-color-primary;
		font-weight: 500;
	}
}

.placeholder-text {
	text-align: center;
	padding: 80rpx 0;
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}
</style>
