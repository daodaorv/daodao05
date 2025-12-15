<template>
	<view class="empty-state">
		<u-empty
			:mode="mode"
			:icon="customIcon"
			:text="text"
			:textColor="textColor"
			:textSize="textSize"
			:iconSize="iconSize"
			:iconColor="iconColor"
		>
			<!-- 自定义底部按钮 -->
			<template #bottom v-if="buttonText">
				<u-button
					:text="buttonText"
					type="primary"
					:custom-style="{
						width: '320rpx',
						height: '80rpx',
						borderRadius: '50rpx',
						fontSize: '28rpx',
						marginTop: '32rpx'
					}"
					@click="handleButtonClick"
				></u-button>
			</template>
		</u-empty>
	</view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	mode?: 'car' | 'address' | 'coupon' | 'favor' | 'permission' | 'history' |
	       'news' | 'message' | 'list' | 'search' | 'wifi-off' | 'data' | 'order';
	customIcon?: string;
	text?: string;
	textColor?: string;
	textSize?: string | number;
	iconSize?: string | number;
	iconColor?: string;
	buttonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	mode: 'data',
	text: '暂无数据',
	textColor: '#999999',
	textSize: 28,
	iconSize: 200,
	iconColor: '#CCCCCC'
});

const emit = defineEmits<{
	(e: 'button-click'): void;
}>();

const handleButtonClick = () => {
	emit('button-click');
};
</script>

<style scoped lang="scss">
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 64rpx;
	min-height: 400rpx;
}
</style>
