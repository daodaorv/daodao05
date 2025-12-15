<template>
	<view class="error-state">
		<u-empty
			mode="data"
			:icon="customIcon || 'error-circle'"
			:text="message || '加载失败'"
			textColor="#FF4D4F"
			:textSize="textSize"
			:iconSize="iconSize"
			iconColor="#FF4D4F"
		>
			<!-- 重试按钮 -->
			<template #bottom>
				<u-button
					:text="retryText"
					type="error"
					:custom-style="{
						width: '320rpx',
						height: '80rpx',
						borderRadius: '50rpx',
						fontSize: '28rpx',
						marginTop: '32rpx',
						background: '#FF4D4F'
					}"
					@click="handleRetry"
				></u-button>
			</template>
		</u-empty>
	</view>
</template>

<script setup lang="ts">
interface Props {
	customIcon?: string;
	message?: string;
	retryText?: string;
	textSize?: string | number;
	iconSize?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	message: '加载失败，请重试',
	retryText: '重新加载',
	textSize: 28,
	iconSize: 200
});

const emit = defineEmits<{
	(e: 'retry'): void;
}>();

const handleRetry = () => {
	emit('retry');
};
</script>

<style scoped lang="scss">
.error-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 64rpx;
	min-height: 400rpx;
}
</style>
