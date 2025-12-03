<template>
	<view class="error-boundary">
		<slot v-if="!hasError"></slot>
		<view v-else class="error-container">
			<view class="error-icon">
				<u-icon name="close" size="80" color="#F44336"></u-icon>
			</view>
			<text class="error-title">页面加载失败</text>
			<text class="error-message">{{ errorMessage }}</text>
			<button class="retry-button" @tap="handleRetry">
				重新加载
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

const emit = defineEmits(['error', 'retry']);

onErrorCaptured((error: Error) => {
	hasError.value = true;
	errorMessage.value = error.message || '未知错误';
	emit('error', error);
	
	// 阻止错误继续传播
	return false;
});

const handleRetry = () => {
	hasError.value = false;
	errorMessage.value = '';
	emit('retry');
};

const reset = () => {
	hasError.value = false;
	errorMessage.value = '';
};

defineExpose({
	reset
});
</script>

<style scoped lang="scss">
.error-boundary {
	width: 100%;
	min-height: 400rpx;
}

.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 32rpx;
	min-height: 400rpx;
}

.error-icon {
	margin-bottom: 24rpx;
}

.error-title {
	font-size: 32rpx;
	color: $uni-text-color;
	font-weight: bold;
	margin-bottom: 16rpx;
}

.error-message {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	text-align: center;
	line-height: 1.5;
	margin-bottom: 32rpx;
}

.retry-button {
	padding: 16rpx 48rpx;
	background-color: $uni-color-primary;
	color: #FFFFFF;
	border-radius: $uni-border-radius-md;
	font-size: 28rpx;
	border: none;
}
</style>
