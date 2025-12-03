<template>
	<view class="profile-page">
		<!-- 头部用户信息 -->
		<view class="header-section" :style="{ paddingTop: headerPaddingTop + 'px' }" @tap="handleLogin">
			<view class="user-card">
				<view class="user-info-row">
					<view class="avatar-wrapper">
						<image
							class="avatar"
							:src="isLogin ? userInfo.avatar : '/static/default-avatar.png'"
							mode="aspectFill"
						></image>
						<view v-if="isLogin" class="vip-badge">
							<u-icon name="vip-fill" :size="12" :color="'#8F5E1E'"></u-icon>
						</view>
					</view>
					<view class="info-col">
						<view v-if="isLogin" class="login-state">
							<text class="nickname">{{ userInfo.nickname }}</text>
							<text class="user-id">ID: 888888</text>
						</view>
						<view v-else class="logout-state">
							<text class="login-tip">点击登录/注册</text>
							<text class="sub-tip">登录后享受更多权益</text>
						</view>
					</view>
					<u-icon name="right" :size="16" :color="'#999'"></u-icon>
				</view>

				<!-- 会员卡片 -->
				<view class="vip-card-entry" v-if="isLogin">
					<view class="vip-left">
						<u-icon name="vip-fill" :size="20" :color="'#FFD700'"></u-icon>
						<text class="vip-title">{{ userInfo.levelName }}</text>
					</view>
					<view class="vip-right">
						<text class="vip-desc">查看权益</text>
						<u-icon name="right" :size="12" :color="'#FFD700'"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单状态栏 -->
		<view class="order-section">
			<view class="section-header" @tap="navigateToOrders(0)">
				<text class="title">我的订单</text>
				<view class="more">
					<text>全部订单</text>
					<u-icon name="right" size="12" color="#999"></u-icon>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item" @tap="navigateToOrders(1)">
					<view class="icon-wrapper">
						<u-icon name="wallet" :size="28" :color="'#666'"></u-icon>
						<view v-if="orderCounts.pendingPayment > 0" class="badge">{{ orderCounts.pendingPayment }}</view>
					</view>
					<text class="status-text">待付款</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(2)">
					<view class="icon-wrapper">
						<u-icon name="shop" :size="28" :color="'#666'"></u-icon>
						<view v-if="orderCounts.pendingConfirm > 0" class="badge">{{ orderCounts.pendingConfirm }}</view>
					</view>
					<text class="status-text">待门店确认</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(3)">
					<view class="icon-wrapper">
						<u-icon name="calendar" :size="28" :color="'#666'"></u-icon>
						<view v-if="orderCounts.pendingPickup > 0" class="badge">{{ orderCounts.pendingPickup }}</view>
					</view>
					<text class="status-text">待取车</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(4)">
					<view class="icon-wrapper">
						<u-icon name="paperplane" :size="28" :color="'#666'"></u-icon>
						<view v-if="orderCounts.renting > 0" class="badge">{{ orderCounts.renting }}</view>
					</view>
					<text class="status-text">租赁中</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view
				v-for="(item, index) in menuList"
				:key="index"
				class="menu-item"
				@tap="handleMenuClick(item)"
			>
				<view class="menu-left">
					<u-icon :name="item.icon" :size="24" :color="item.iconColor"></u-icon>
					<text class="menu-name">{{ item.name }}</text>
				</view>
				<view class="menu-right">
					<text v-if="item.badge" class="menu-badge">{{ item.badge }}</text>
					<text v-if="item.amount" class="menu-amount">¥{{ item.amount }}</text>
					<u-icon name="right" :size="16" :color="'#999'"></u-icon>
				</view>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<view v-if="isLogin" class="logout-btn-box">
			<button class="logout-btn" @tap="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { isLoggedIn, getCurrentUser, logout as logoutUtil } from '@/utils/auth';

// 获取系统状态栏高度
const statusBarHeight = ref(0);
const getStatusBarHeight = () => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight || 0;
};
getStatusBarHeight();

// 计算顶部安全区域高度(状态栏高度)
const headerPaddingTop = computed(() => {
	return statusBarHeight.value;
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

// 页面显示时检查登录状态
onShow(() => {
	checkLoginStatus();
});

// 检查登录状态
const checkLoginStatus = () => {
	isLogin.value = isLoggedIn();

	if (isLogin.value) {
		const user = getCurrentUser();
		if (user) {
			userInfo.value = {
				avatar: user.avatar || '/static/default-avatar.png',
				nickname: user.nickname || '房车用户',
				levelName: user.userType === 'PLUS' ? 'PLUS会员' : user.userType === 'HOST' ? '车主' : '普通会员'
			};
		}
	} else {
		// 未登录，重置为默认值
		userInfo.value = {
			avatar: '/static/default-avatar.png',
			nickname: '游客',
			levelName: '普通会员'
		};
		orderCounts.value = {
			pendingPayment: 0,
			pendingConfirm: 0,
			pendingPickup: 0,
			renting: 0
		};
	}
};

// 菜单列表
const menuList = [
	{ name: '我的优惠券', icon: 'gift-filled', iconColor: '#F44336', path: '/pages/profile/coupons', badge: 3 },
	{ name: '积分中心', icon: 'medal', iconColor: '#FF9F29', path: '/pages/profile/points' },
	{ name: 'PLUS会员', icon: 'vip-filled', iconColor: '#FFD700', path: '/pages/membership/index' },
	{ name: '钱包余额', icon: 'wallet-filled', iconColor: '#FF9F29', path: '/pages/profile/wallet', amount: '1280.50' },
	{ name: '我的收藏', icon: 'star', iconColor: '#FF9F29', path: '/pages/profile/favorites' },
	{ name: '常用联系人', icon: 'staff', iconColor: '#4CAF50', path: '/pages/profile/contacts' },
	{ name: '地址管理', icon: 'location', iconColor: '#2196F3', path: '/pages/profile/address' },
	{ name: '联系客服', icon: 'headphones', iconColor: '#9C27B0', action: 'call' },
	{ name: '设置', icon: 'gear', iconColor: '#607D8B', path: '/pages/profile/settings' }
];

// 登录/注册/编辑资料
const handleLogin = () => {
	if (!isLogin.value) {
		// 未登录，跳转到登录页
		uni.navigateTo({
			url: '/pages/auth/login'
		});
	} else {
		// 已登录，跳转到编辑资料页
		uni.navigateTo({
			url: '/pages/profile/edit',
			fail: () => {
				uni.showToast({
					title: '该功能正在开发中',
					icon: 'none'
				});
			}
		});
	}
};

// 退出登录
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: async (res) => {
			if (res.confirm) {
				await logoutUtil();
				// 刷新页面状态
				checkLoginStatus();
			}
		}
	});
};

// 跳转订单列表
const navigateToOrders = (status: number) => {
	uni.navigateTo({
		url: `/pages/order/list?status=${status}`
	});
};

// 菜单点击处理
const handleMenuClick = (item: any) => {
	if (item.action === 'call') {
		// 拨打客服电话，捕获用户取消操作
		uni.makePhoneCall({
			phoneNumber: '400-123-4567',
			success: () => {
				console.log('拨打电话成功');
			},
			fail: (err) => {
				// 用户取消拨打电话，不显示错误提示
				if (err.errMsg.includes('cancel')) {
					console.log('用户取消拨打电话');
				} else {
					uni.showToast({
						title: '拨打电话失败',
						icon: 'none'
					});
				}
			}
		});
	} else if (item.path) {
		// 检查页面是否存在
		const notImplementedPages = ['/pages/profile/address'];
		if (notImplementedPages.includes(item.path)) {
			uni.showToast({
				title: '该功能正在开发中',
				icon: 'none',
				duration: 2000
			});
		} else {
			uni.navigateTo({
				url: item.path,
				fail: () => {
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					});
				}
			});
		}
	} else {
		uni.showToast({
			title: `访问: ${item.name}`,
			icon: 'none'
		});
	}
};
</script>

<style scoped lang="scss">
.profile-page {
	min-height: 100vh;
	background-color: #F5F7FA;
	padding-bottom: 40rpx;
}

.header-section {
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	padding: 0 32rpx 120rpx;
	position: relative;
}

.user-card {
	padding-top: 40rpx;
}

.user-info-row {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}

.avatar-wrapper {
	position: relative;
	margin-right: 24rpx;

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255,255,255,0.8);
		background-color: #FFF;
	}

	.vip-badge {
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: #FFF;
		border-radius: 50%;
		width: 36rpx;
		height: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
	}
}

.info-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.nickname {
	font-size: 40rpx;
	font-weight: bold;
	color: #FFF;
	margin-bottom: 8rpx;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
}

.user-id {
	font-size: 24rpx;
	color: rgba(255,255,255,0.9);
}

.login-tip {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFF;
	margin-bottom: 8rpx;
}

.sub-tip {
	font-size: 24rpx;
	color: rgba(255,255,255,0.9);
}

.vip-card-entry {
	background: linear-gradient(90deg, #333333 0%, #1A1A1A 100%);
	border-radius: 20rpx 20rpx 0 0;
	padding: 20rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 20rpx;

	.vip-left {
		display: flex;
		align-items: center;
		gap: 12rpx;

		.vip-title {
			color: #FFD700;
			font-size: 28rpx;
			font-weight: 600;
		}
	}

	.vip-right {
		display: flex;
		align-items: center;
		gap: 4rpx;

		.vip-desc {
			color: #FFD700;
			font-size: 24rpx;
			opacity: 0.9;
		}
	}
}

.order-section {
	margin: -80rpx 32rpx 32rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
	position: relative;
	z-index: 1;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;

	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.more {
		display: flex;
		align-items: center;
		gap: 4rpx;
		font-size: 24rpx;
		color: #999;
	}
}

.status-grid {
	display: flex;
	justify-content: space-between;
	padding: 0 16rpx;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;

	&:active {
		transform: scale(0.96);
	}
}

.icon-wrapper {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.badge {
	position: absolute;
	top: -6rpx;
	right: -6rpx;
	background-color: #FF4D4F;
	color: #FFFFFF;
	font-size: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 8rpx;
	border: 2rpx solid #FFFFFF;
	font-weight: bold;
}

.status-text {
	font-size: 24rpx;
	color: #333;
	font-weight: 500;
}

.menu-section {
	margin: 0 32rpx 32rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 0 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 36rpx 0;
	border-bottom: 1rpx solid #F5F5F5;

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
	gap: 24rpx;
}

.menu-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.menu-right {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.menu-badge {
	background-color: #FF4D4F;
	color: #FFFFFF;
	font-size: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 8rpx;
	font-weight: bold;
}

.menu-amount {
	font-size: 28rpx;
	color: #FF9F29;
	font-weight: 600;
}

.logout-btn-box {
	margin: 64rpx 32rpx;
}

.logout-btn {
	background-color: #FFFFFF;
	color: #FF4D4F;
	font-size: 32rpx;
	border-radius: 48rpx;
	height: 96rpx;
	line-height: 96rpx;
	font-weight: bold;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

	&::after {
		border: none;
	}

	&:active {
		background-color: #FAFAFA;
	}
}
</style>
