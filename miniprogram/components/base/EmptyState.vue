<template>
	<view class="empty-state">
		<view class="empty-icon">
			<u-icon :name="iconType" size="80" :color="iconColor"></u-icon>
		</view>
		<text class="empty-title">{{ title }}</text>
		<text v-if="description" class="empty-description">{{ description }}</text>
		<button v-if="buttonText" class="empty-button" @tap="handleButtonClick">
			{{ buttonText }}
		</button>
	</view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	type?: 'default' | 'search' | 'network' | 'error';
	title?: string;
	description?: string;
	buttonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'default',
	title: '暂无数据',
	description: '',
	buttonText: ''
});

const emit = defineEmits(['buttonClick']);

const iconType = computed(() => {
	const iconMap = {
		default: 'info-circle',
		search: 'search',
		network: 'wifi-off',
		error: 'close'
	};
	return iconMap[props.type] || 'info-circle';
});

const iconColor = computed(() => {
	return '#CCCCCC';
});

const handleButtonClick = () => {
	emit('buttonClick');
};
</script>

<style scoped lang="scss">
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 32rpx;
	min-height: 400rpx;
}

.empty-icon {
	margin-bottom: 24rpx;
	opacity: 0.5;
}

.empty-title {
	font-size: 28rpx;
	color: $uni-text-color;
	margin-bottom: 16rpx;
}

.empty-description {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	text-align: center;
	line-height: 1.5;
	margin-bottom: 32rpx;
}

.empty-button {
	padding: 16rpx 48rpx;
	background-color: $uni-color-primary;
	color: #FFFFFF;
	border-radius: $uni-border-radius-md;
	font-size: 28rpx;
	border: none;
}
</style>
