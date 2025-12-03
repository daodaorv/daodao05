<template>
	<view class="service-grid">
		<view 
			v-for="(service, index) in services" 
			:key="index"
			class="service-item"
			@tap="handleServiceClick(service)"
		>
			<view class="service-icon">
				<u-icon :name="service.icon" size="28" color="#FF9F29"></u-icon>
			</view>
			<text class="service-name">{{ service.name }}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Service {
	id: string;
	name: string;
	icon: string;
	path: string;
	isTabBar?: boolean; // 标识是否为 tabBar 页面
}

const services = ref<Service[]>([
	{ id: '1', name: '特惠租车', icon: 'gift', path: '/pages/special-offer/list' },
	{ id: '3', name: '托管中心', icon: 'home', path: '/pages/hosting/index', isTabBar: true },
	{ id: '4', name: '营地预订', icon: 'location', path: '/pages/campsite/list' },
	{ id: '5', name: '房车旅游', icon: 'map', path: '/pages/tour/list' }
]);

const handleServiceClick = (service: Service) => {
	// tabBar 页面使用 switchTab，普通页面使用 navigateTo
	if (service.isTabBar) {
		uni.switchTab({
			url: service.path
		});
	} else {
		uni.navigateTo({
			url: service.path
		});
	}
};
</script>

<style scoped lang="scss">
.service-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 32rpx 24rpx;
	padding: 32rpx 24rpx;
	background-color: #FFFFFF;
	margin-bottom: 24rpx;
}

.service-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	transition: transform 0.2s;
	
	&:active {
		transform: scale(0.95);
	}
}

.service-icon {
	width: 100rpx;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #FFF5E9 0%, #FFF0E0 100%);
	border-radius: 32rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.1);
}

.service-name {
	font-size: 26rpx;
	color: $uni-text-color;
	text-align: center;
	font-weight: 500;
}
</style>
