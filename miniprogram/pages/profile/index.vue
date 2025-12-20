<template>
	<view class="profile-page">
		<!-- 沉浸式头部背景 -->
		<view class="header-bg"></view>

		<!-- 用户信息区 -->
		<view class="user-section" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }" @tap="handleLogin">
			<view class="user-row">
				<view class="avatar-box">
					<image
						class="avatar"
						:src="isLogin ? userInfo.avatar : '/static/default-avatar.png'"
						mode="aspectFill"
					></image>
					<view v-if="isLogin" class="vip-tag">
						<u-icon name="star-fill" size="10" color="#FFFFFF"></u-icon>
						<text class="vip-text">{{ userInfo.levelName }}</text>
					</view>
				</view>
				
				<view class="info-box">
					<view class="name-row">
						<text class="nickname">{{ isLogin ? userInfo.nickname : '点击登录/注册' }}</text>
						<u-icon v-if="!isLogin" name="arrow-right" size="14" color="#1D2129"></u-icon>
					</view>
					<text class="subtitle">{{ isLogin ? 'ID: 888888' : '登录后享受更多权益' }}</text>
				</view>
			</view>
			
			<!-- 会员黑卡入口 -->
			<view class="vip-banner" v-if="isLogin" @tap.stop="navigateTo('/pages/membership/index')">
				<view class="vip-content">
					<view class="vip-left">
						<u-icon name="star-fill" size="18" color="#FFD700"></u-icon>
						<text class="vip-label">PLUS会员</text>
					</view>
					<view class="vip-right">
						<text class="vip-tip">查看专属权益</text>
						<u-icon name="arrow-right" size="10" color="#FFD700"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 资产宫格 (Assets Grid) - 仅登录后显示 -->
		<view v-if="isLogin" class="card-container assets-card">
			<view
				class="asset-item"
				v-for="(item, index) in gridMenu"
				:key="index"
				@tap="handleMenuClick(item)"
			>
				<view class="asset-value" :class="{ 'is-amount': item.amount }">
					<template v-if="item.amount">{{ item.amount }}</template>
					<template v-else>
						<u-icon :name="item.icon" size="28" :color="item.iconColor"></u-icon>
					</template>
				</view>
				<text class="asset-label">{{ item.name }}</text>
				<view v-if="item.badge" class="asset-badge">{{ item.badge }}</view>
			</view>
		</view>

		<!-- 未登录提示卡片 -->
		<view v-else class="card-container login-prompt-card">
			<view class="login-prompt">
				<u-icon name="lock" size="48" color="#CCCCCC"></u-icon>
				<text class="prompt-text">登录后查看您的资产信息</text>
				<button class="login-btn" @tap="handleLogin">立即登录</button>
			</view>
		</view>

		<!-- 订单状态栏 -->
		<view class="card-container order-card">
			<view class="card-header" @tap="navigateToOrders(0)">
				<text class="card-title">我的订单</text>
				<view class="card-more">
					<text>全部订单</text>
					<u-icon name="arrow-right" size="12" color="#999"></u-icon>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item" @tap="navigateToOrders(1)">
					<view class="icon-box">
						<u-icon name="rmb" size="28" color="#1D2129"></u-icon>
						<view v-if="orderCounts.pendingPayment > 0" class="dot-badge"></view>
					</view>
					<text class="status-text">待付款</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(2)">
					<view class="icon-box">
						<u-icon name="bag" size="28" color="#1D2129"></u-icon>
						<view v-if="orderCounts.pendingConfirm > 0" class="dot-badge"></view>
					</view>
					<text class="status-text">待确认</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(3)">
					<view class="icon-box">
						<u-icon name="calendar" size="28" color="#1D2129"></u-icon>
						<view v-if="orderCounts.pendingPickup > 0" class="dot-badge"></view>
					</view>
					<text class="status-text">待取车</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(4)">
					<view class="icon-box">
						<u-icon name="car" size="28" color="#1D2129"></u-icon>
						<view v-if="orderCounts.renting > 0" class="dot-badge"></view>
					</view>
					<text class="status-text">租赁中</text>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="card-container menu-card">
			<view
				v-for="(item, index) in listMenu"
				:key="index"
				class="menu-item"
				@tap="handleMenuClick(item)"
			>
				<view class="menu-left">
					<u-icon :name="item.icon" size="20" color="#1D2129"></u-icon>
					<text class="menu-name">{{ item.name }}</text>
				</view>
				<u-icon name="arrow-right" size="14" color="#CCCCCC"></u-icon>
			</view>
		</view>

		<!-- 退出登录 -->
		<view v-if="isLogin" class="logout-section">
			<text class="logout-text" @tap="handleLogout">退出登录</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { isLoggedIn, getCurrentUser, logout as logoutUtil } from '@/utils/auth';

// 获取系统状态栏高度
const statusBarHeight = ref(0);
uni.getSystemInfo({
	success: (res) => {
		statusBarHeight.value = res.statusBarHeight || 0;
	}
});

// 登录状态
const isLogin = ref(false);

// 用户信息
const userInfo = ref({
	avatar: '/static/default-avatar.png',
	nickname: '游客',
	levelName: '普通会员'
});

// 订单数量
const orderCounts = ref({
	pendingPayment: 0,
	pendingConfirm: 0,
	pendingPickup: 0,
	renting: 0
});

// 菜单配置
const gridMenu = ref([
	{ name: '优惠券', icon: 'coupon-fill', iconColor: '#FF4D4F', path: '/pages/profile/coupons', badge: '3' },
	{ name: '积分', icon: 'integral-fill', iconColor: '#FF9F29', path: '/pages/profile/points', amount: '2,080' },
	{ name: '钱包', icon: 'wallet-fill', iconColor: '#2196F3', path: '/pages/profile/wallet', amount: '¥1280' },
	{ name: '收藏', icon: 'star-fill', iconColor: '#FFC107', path: '/pages/profile/favorites' }
]);

const listMenu = ref([
	{ name: '推广中心', icon: 'share-fill', path: '/pages/profile/promotion-center' },
	{ name: '常用联系人', icon: 'account-fill', path: '/pages/profile/contacts' },
	{ name: '地址管理', icon: 'map-fill', path: '/pages/profile/address' },
	{ name: '联系客服', icon: 'server-man', path: '/pages/help/index' },
	{ name: '设置', icon: 'setting-fill', path: '/pages/profile/settings' }
]);

// 页面显示时检查登录状态
onShow(() => {
	checkLoginStatus();
});

const checkLoginStatus = () => {
	isLogin.value = isLoggedIn();
	if (isLogin.value) {
		const user = getCurrentUser();
		if (user) {
			userInfo.value = {
				avatar: user.avatar || '/static/default-avatar.png',
				nickname: user.nickname || '房车用户',
				levelName: user.userType === 'PLUS' ? 'PLUS会员' : '普通会员'
			};
		}
	} else {
		userInfo.value = {
			avatar: '/static/default-avatar.png',
			nickname: '游客',
			levelName: '普通会员'
		};
	}
};

const handleLogin = () => {
	if (!isLogin.value) {
		uni.navigateTo({ url: '/pages/auth/login' });
	} else {
		uni.navigateTo({ url: '/pages/profile/edit' });
	}
};

const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: async (res) => {
			if (res.confirm) {
				await logoutUtil();
				checkLoginStatus();
			}
		}
	});
};

const navigateToOrders = (status: number) => {
	uni.navigateTo({ url: `/pages/order/list?status=${status}` });
};

const handleMenuClick = (item: any) => {
	if (item.path) {
		if (item.path === '/pages/profile/address') {
			uni.showToast({ title: '该功能开发中', icon: 'none' });
			return;
		}
		uni.navigateTo({ url: item.path });
	}
};

const navigateTo = (url: string) => {
	uni.navigateTo({ url });
};
</script>

<style scoped lang="scss">
.profile-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 40rpx;
	position: relative;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 500rpx;
	background: linear-gradient(180deg, #FFF8E1 0%, #F8F9FC 100%);
	z-index: 0;
}

.user-section {
	position: relative;
	z-index: 1;
	padding: 0 $uni-spacing-lg 40rpx;
}

.user-row {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.avatar-box {
	position: relative;
	margin-right: $uni-spacing-md;
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid #FFFFFF;
		box-shadow: $uni-shadow-sm;
	}
	
	.vip-tag {
		position: absolute;
		bottom: -6rpx;
		left: 50%;
		transform: translateX(-50%);
		background-color: #333;
		color: #FFD700;
		font-size: 20rpx;
		padding: 2rpx 12rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		gap: 4rpx;
		white-space: nowrap;
		border: 2rpx solid #FFFFFF;
	}
	
	.vip-text {
		font-size: 18rpx;
		font-weight: bold;
	}
}

.info-box {
	flex: 1;
	
	.name-row {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 8rpx;
		
		.nickname {
			font-size: 40rpx;
			font-weight: 800;
			color: $uni-text-color;
		}
	}
	
	.subtitle {
		font-size: 24rpx;
		color: $uni-text-color-secondary;
	}
}

.vip-banner {
	background: linear-gradient(90deg, #1A1A1A 0%, #333333 100%);
	border-radius: 20rpx;
	padding: $uni-spacing-md $uni-spacing-lg;
	box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.15);
	
	.vip-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.vip-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
		
		.vip-label {
			color: #FFD700;
			font-size: 28rpx;
			font-weight: 600;
		}
	}
	
	.vip-right {
		display: flex;
		align-items: center;
		gap: 4rpx;
		
		.vip-tip {
			color: rgba(255, 215, 0, 0.8);
			font-size: 22rpx;
		}
	}
}

.card-container {
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	margin: 0 $uni-spacing-lg $uni-spacing-md;
	padding: $uni-spacing-lg;
	box-shadow: $uni-shadow-card;
	position: relative;
	z-index: 1;
}

/* Assets Grid */
.assets-card {
	display: flex;
	justify-content: space-between;
	padding: $uni-spacing-lg $uni-spacing-md;
}

.asset-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $uni-spacing-sm;
	position: relative;
	min-width: 120rpx;
}

.asset-value {
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&.is-amount {
		font-family: 'DIN Alternate', sans-serif;
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-text-color;
	}
}

.asset-label {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.asset-badge {
	position: absolute;
	top: -10rpx;
	right: 10rpx;
	background-color: #FF4D4F;
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 2rpx 10rpx;
	border-radius: 20rpx;
	border: 2rpx solid #FFFFFF;
}

/* Login Prompt Card */
.login-prompt-card {
	padding: 60rpx $uni-spacing-lg;
}

.login-prompt {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}

.prompt-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.login-btn {
	margin-top: 16rpx;
	padding: 0 64rpx;
	height: 72rpx;
	line-height: 72rpx;
	background: $uni-color-primary-gradient;
	color: #FFFFFF;
	font-size: 28rpx;
	font-weight: 600;
	border-radius: 36rpx;
	box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.3);

	&::after {
		border: none;
	}

	&:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
}

/* Order Card */
.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: $uni-spacing-lg;
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.card-more {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.status-grid {
	display: flex;
	justify-content: space-between;
	padding: 0 $uni-spacing-md;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $uni-spacing-sm;
}

.icon-box {
	position: relative;
	
	.dot-badge {
		position: absolute;
		top: -2rpx;
		right: -2rpx;
		width: 12rpx;
		height: 12rpx;
		background-color: #FF4D4F;
		border-radius: 50%;
		border: 2rpx solid #FFFFFF;
	}
}

.status-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

/* Menu List */
.menu-card {
	padding: 0 $uni-spacing-lg;
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: $uni-spacing-lg 0;
	border-bottom: 1rpx solid $uni-border-color-light;
	transition: opacity 0.2s ease;

	&:last-child {
		border-bottom: none;
	}

	&:active {
		opacity: 0.7;
	}
}

.menu-left {
	display: flex;
	align-items: center;
	gap: $uni-spacing-md;
}

.menu-name {
	font-size: 28rpx;
	color: $uni-text-color;
}

.logout-section {
	margin: 48rpx 0;
	text-align: center;
	
	.logout-text {
		font-size: 28rpx;
		color: $uni-text-color-secondary;
		text-decoration: underline;
	}
}
</style>