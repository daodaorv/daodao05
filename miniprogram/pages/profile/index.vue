<template>
	<view class="profile-page">
		<!-- 头部用户信息 -->
		<view class="header-section" :style="{ paddingTop: headerPaddingTop + 'px' }" @tap="handleLogin">
			<view class="user-info">
				<view class="avatar-box">
					<image 
						class="avatar" 
						:src="isLogin ? userInfo.avatar : '/static/default-avatar.png'" 
						mode="aspectFill"
					></image>
				</view>
				<view class="info-content">
					<view v-if="isLogin" class="login-state">
						<text class="nickname">{{ userInfo.nickname }}</text>
						<view class="vip-tag">
							<uni-icons type="vip-filled" size="12" color="#8F5E1E"></uni-icons>
							<text class="vip-text">{{ userInfo.levelName }}</text>
						</view>
					</view>
					<view v-else class="logout-state">
						<text class="login-tip">点击登录/注册</text>
						<text class="sub-tip">登录后享受更多权益</text>
					</view>
				</view>
			</view>
			<uni-icons type="right" size="16" color="rgba(255,255,255,0.8)"></uni-icons>
		</view>

		<!-- 订单状态栏 -->
		<view class="order-section">
			<view class="section-header" @tap="navigateToOrders(0)">
				<text class="title">我的订单</text>
				<view class="more">
					<text>全部订单</text>
					<uni-icons type="right" size="12" color="#999"></uni-icons>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item" @tap="navigateToOrders(1)">
					<view class="icon-wrapper">
						<uni-icons type="wallet" size="28" color="#666"></uni-icons>
						<view v-if="orderCounts.pendingPayment > 0" class="badge">{{ orderCounts.pendingPayment }}</view>
					</view>
					<text class="status-text">待付款</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(2)">
					<view class="icon-wrapper">
						<uni-icons type="shop" size="28" color="#666"></uni-icons>
						<view v-if="orderCounts.pendingConfirm > 0" class="badge">{{ orderCounts.pendingConfirm }}</view>
					</view>
					<text class="status-text">待门店确认</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(3)">
					<view class="icon-wrapper">
						<uni-icons type="calendar" size="28" color="#666"></uni-icons>
						<view v-if="orderCounts.pendingPickup > 0" class="badge">{{ orderCounts.pendingPickup }}</view>
					</view>
					<text class="status-text">待取车</text>
				</view>
				<view class="status-item" @tap="navigateToOrders(4)">
					<view class="icon-wrapper">
						<uni-icons type="paperplane" size="28" color="#666"></uni-icons>
						<view v-if="orderCounts.renting > 0" class="badge">{{ orderCounts.renting }}</view>
					</view>
					<text class="status-text">租赁中</text>
				</view>
			</view>
		</view>

		<!-- 常用功能菜单 -->
		<view class="menu-section">
			<view class="menu-list">
				<view class="menu-item" v-for="(item, index) in menuList" :key="index" @tap="handleMenuClick(item)">
					<view class="menu-left">
						<uni-icons :type="item.icon" size="22" :color="item.iconColor"></uni-icons>
						<text class="menu-name">{{ item.name }}</text>
					</view>
					<uni-icons type="right" size="14" color="#CCC"></uni-icons>
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

// 获取系统状态栏高度
const statusBarHeight = ref(0);
const getStatusBarHeight = () => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight || 0;
};
getStatusBarHeight();

// 计算顶部安全区域高度(状态栏高度)
const headerPaddingTop = computed(() => {
	return statusBarHeight.value + 40; // 状态栏高度 + 额外内边距40rpx转px
});

// 登录状态模拟
const isLogin = ref(true);

// 用户信息模拟
const userInfo = ref({
	avatar: '/static/avatar.png', // 实际开发中需替换为真实图片路径或网络图片
	nickname: '房车旅行家',
	levelName: '黄金会员'
});

// 订单数量模拟
const orderCounts = ref({
	pendingPayment: 1,
	pendingConfirm: 2, // 待门店确认
	pendingPickup: 0,
	renting: 1
});

// 菜单列表
const menuList = [
	{ name: '我的收藏', icon: 'star', iconColor: '#FF9F29', path: '/pages/profile/favorites' },
	{ name: '常用联系人', icon: 'staff', iconColor: '#4CAF50', path: '/pages/profile/contacts' },
	{ name: '我的优惠券', icon: 'gift', iconColor: '#F44336', path: '/pages/profile/coupons' },
	{ name: '地址管理', icon: 'location', iconColor: '#2196F3', path: '/pages/profile/address' },
	{ name: '联系客服', icon: 'headphones', iconColor: '#9C27B0', action: 'call' },
	{ name: '设置', icon: 'gear', iconColor: '#607D8B', path: '/pages/profile/settings' }
];

// 登录/注册/编辑资料
const handleLogin = () => {
	if (!isLogin.value) {
		uni.showToast({
			title: '跳转登录页...',
			icon: 'none'
		});
		// 模拟登录成功
		setTimeout(() => {
			isLogin.value = true;
		}, 1000);
	} else {
		// 已登录，跳转到编辑资料页
		uni.navigateTo({
			url: '/pages/profile/edit'
		});
	}
};

// 退出登录
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				isLogin.value = false;
				uni.showToast({
					title: '已退出',
					icon: 'none'
				});
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
		uni.makePhoneCall({
			phoneNumber: '400-123-4567'
		});
	} else if (item.path) {
		uni.navigateTo({
			url: item.path
		});
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
	background-color: #F8F8F8;
}

.header-section {
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	padding: 40rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #FFFFFF;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.avatar-box {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 4rpx;
	
	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #FFFFFF;
	}
}

.info-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.nickname {
	font-size: 36rpx;
	font-weight: bold;
}

.vip-tag {
	display: inline-flex;
	align-items: center;
	gap: 4rpx;
	background-color: rgba(0, 0, 0, 0.15);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	
	.vip-text {
		font-size: 22rpx;
		color: #FFF;
	}
}

.login-tip {
	font-size: 36rpx;
	font-weight: bold;
}

.sub-tip {
	font-size: 24rpx;
	opacity: 0.8;
}

.order-section {
	margin: 24rpx 32rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
	
	.title {
		font-size: 30rpx;
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
	padding: 0 12rpx;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.icon-wrapper {
	position: relative;
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.badge {
	position: absolute;
	top: -8rpx;
	right: -12rpx;
	background-color: #F44336;
	color: #FFFFFF;
	font-size: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 6rpx;
	border: 2rpx solid #FFFFFF;
}

.status-text {
	font-size: 24rpx;
	color: #666;
}

.menu-section {
	margin: 24rpx 32rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 0 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
}

.menu-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.menu-name {
	font-size: 28rpx;
	color: #333;
}

.logout-btn-box {
	margin: 48rpx 32rpx;
}

.logout-btn {
	background-color: #FFFFFF;
	color: #F44336;
	font-size: 30rpx;
	border-radius: 44rpx;
	
	&::after {
		border: none;
	}
}
</style>
