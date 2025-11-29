<template>
	<view class="vehicle-card" @tap="handleClick">
		<view class="image-wrapper">
			<image class="vehicle-image" :src="data.image" mode="aspectFill"></image>
			<view class="favorite-btn" @tap.stop="handleFavorite">
				<uni-icons :type="favorited ? 'heart-filled' : 'heart'" size="20" :color="favorited ? '#FF4D4F' : '#FFFFFF'"></uni-icons>
			</view>
		</view>
		<view class="vehicle-info">
			<view class="header">
				<text class="vehicle-name">{{ data.name }}</text>
				<view class="tags">
					<text v-for="(tag, index) in data.tags" :key="index" class="tag">{{ tag }}</text>
				</view>
			</view>
			<view class="specs">
				<text class="spec-item">{{ data.type }}</text>
				<text class="divider">|</text>
				<text class="spec-item">{{ data.seats }}座{{ data.beds }}卧</text>
				<text class="divider">|</text>
				<text class="spec-item">{{ data.transmission }}</text>
			</view>
			<view class="footer">
				<view class="price-box">
					<text class="currency">¥</text>
					<text class="price">{{ data.price }}</text>
					<text class="unit">/天</text>
				</view>
				<button class="book-btn" @tap.stop="handleBook">立即预订</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Vehicle {
	id: string;
	name: string;
	image: string;
	type: string;
	seats: number;
	beds: number;
	storeId?: string;
	storeName?: string;
	brand?: string;
	transmission: string;
	price: number;
	tags: string[];
}

const props = defineProps<{
	data: Vehicle;
}>();

const emit = defineEmits(['click']);

const favorited = ref(false);

const handleClick = () => {
	emit('click', props.data);
};

const handleBook = () => {
	// 预订按钮也跳转到详情页,让用户查看完整信息
	emit('click', props.data);
};

const handleFavorite = () => {
	favorited.value = !favorited.value;
	uni.showToast({
		title: favorited.value ? '收藏成功' : '取消收藏',
		icon: 'none'
	});
};
</script>

<style scoped lang="scss">
.vehicle-card {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
}

.image-wrapper {
	position: relative;
}

.vehicle-image {
	width: 100%;
	height: 320rpx;
	background-color: #F5F5F5;
}

.favorite-btn {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	width: 56rpx;
	height: 56rpx;
	background-color: rgba(0, 0, 0, 0.3);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(4rpx);
}

.vehicle-info {
	padding: 24rpx;
}

.header {
	margin-bottom: 12rpx;
}

.vehicle-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
	display: block;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.tag {
	font-size: 20rpx;
	color: #666;
	background-color: #F5F5F5;
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
}

.specs {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.spec-item {
	font-size: 24rpx;
	color: #999;
}

.divider {
	font-size: 20rpx;
	color: #DDD;
	margin: 0 12rpx;
}

.footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.price-box {
	display: flex;
	align-items: baseline;
	color: $uni-color-primary;
}

.currency {
	font-size: 24rpx;
	font-weight: bold;
}

.price {
	font-size: 40rpx;
	font-weight: bold;
	margin: 0 4rpx;
}

.unit {
	font-size: 22rpx;
	color: #999;
}

.book-btn {
	margin: 0;
	padding: 0 32rpx;
	height: 64rpx;
	line-height: 64rpx;
	font-size: 26rpx;
	background-color: $uni-color-primary;
	color: #FFFFFF;
	border-radius: 32rpx;

	&::after {
		border: none;
	}

	&:active {
		opacity: 0.9;
	}
}
</style>
