<template>
	<u-popup :show="show" @close="handleClose" mode="center" :closeable="true">
		<view class="dialog-container">
			<view class="dialog-header">
				<text class="dialog-title">{{ title }}</text>
			</view>
			<view class="dialog-content">
				<text v-if="mode === 'base'" class="dialog-text">{{ content }}</text>
				<input v-else v-model="inputValue" class="dialog-input" :placeholder="placeholder" />
			</view>
			<view class="dialog-footer">
				<button class="dialog-button cancel" @tap="handleClose">取消</button>
				<button class="dialog-button confirm" @tap="handleConfirm">确定</button>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
	type?: 'success' | 'error' | 'warn' | 'info';
	mode?: 'base' | 'input';
	title?: string;
	content?: string;
	placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'info',
	mode: 'base',
	title: '提示',
	content: '',
	placeholder: ''
});

const emit = defineEmits(['confirm', 'close']);

const show = ref(false);
const inputValue = ref('');

const open = () => {
	show.value = true;
	inputValue.value = '';
};

const close = () => {
	show.value = false;
};

const handleConfirm = () => {
	emit('confirm', props.mode === 'input' ? inputValue.value : undefined);
	close();
};

const handleClose = () => {
	emit('close');
	close();
};

defineExpose({
	open,
	close
});
</script>

<style scoped lang="scss">
.dialog-container {
	background-color: #FFFFFF;
	border-radius: $uni-border-radius-lg;
	width: 560rpx;
	overflow: hidden;
}

.dialog-header {
	padding: 32rpx 32rpx 24rpx;
	text-align: center;
	border-bottom: 1rpx solid $uni-border-color;
}

.dialog-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.dialog-content {
	padding: 32rpx;
	min-height: 100rpx;
}

.dialog-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

.dialog-input {
	width: 100%;
	padding: 16rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-sm;
	font-size: 28rpx;
}

.dialog-footer {
	display: flex;
	border-top: 1rpx solid $uni-border-color;
}

.dialog-button {
	flex: 1;
	padding: 24rpx;
	font-size: 28rpx;
	border: none;
	background-color: transparent;

	&.cancel {
		color: $uni-text-color-secondary;
	}

	&.confirm {
		color: $uni-color-primary;
		font-weight: bold;
		border-left: 1rpx solid $uni-border-color;
	}
}
</style>
