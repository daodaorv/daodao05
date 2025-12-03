<template>
	<view class="vehicle-card" @tap="handleClick">
		<view class="image-wrapper">
			<image class="vehicle-image" :src="data.image" mode="aspectFill"></image>
			<view class="favorite-btn" @tap.stop="handleFavorite">
				<u-icon :name="favorited ? 'heart-fill' : 'heart'" size="20" :color="favorited ? '#FF4D4F' : '#FFFFFF'"></u-icon>
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
	background-color: $uni-bg-color-card;
	border-radius: $uni-border-radius-lg;
	overflow: hidden;
	margin-bottom: 32rpx;
	box-shadow: $uni-shadow-md;
	display: flex;
	flex-direction: column;
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	&:active {
		transform: scale(0.98);
		box-shadow: $uni-shadow-sm;
	}
}

.image-wrapper {
	position: relative;
	height: 400rpx;
}

.vehicle-image {
	width: 100%;
	height: 100%;
	background-color: #F0F0F0;
}

.favorite-btn {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	width: 64rpx;
	height: 64rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	transition: all 0.2s;
	
	&:active {
		transform: scale(0.9);
	}
}

.vehicle-info {
	padding: 32rpx;
}

.header {
	margin-bottom: 16rpx;
}

.vehicle-name {
	font-size: 34rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 12rpx;
	display: block;
	line-height: 1.4;
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

.specs {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	flex-wrap: wrap;
}

.spec-item {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.divider {
	font-size: 22rpx;
	color: $uni-border-color;
	margin: 0 16rpx;
}

.footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 24rpx;
	border-top: 1rpx solid $uni-border-color-light;
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
	font-size: 44rpx;
	font-weight: 600;
	margin: 0 4rpx;
	font-family: 'DIN Alternate', sans-serif;
}

.unit {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.book-btn {
	margin: 0;
	padding: 0 40rpx;
	height: 72rpx;
	line-height: 72rpx;
	font-size: 28rpx;
	background: linear-gradient(135deg, $uni-color-primary 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 36rpx;
	font-weight: 600;
	box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.3);

	&::after {
		border: none;
	}
}
</style>
