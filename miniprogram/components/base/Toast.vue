<template>
	<view class="toast-container" :class="{ 'toast-show': visible }">
		<view class="toast-content" :class="`toast-${type}`">
			<u-icon v-if="showIcon" :name="iconType" size="20" color="#FFFFFF"></u-icon>
			<text class="toast-text">{{ message }}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
	message: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
	showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	message: '',
	type: 'info',
	duration: 2000,
	showIcon: true
});

const visible = ref(false);
let timer: any = null;

const iconType = computed(() => {
	const iconMap = {
		success: 'checkbox-mark',
		error: 'close',
		warning: 'info-circle',
		info: 'info-circle'
	};
	return iconMap[props.type];
});

const show = () => {
	visible.value = true;
	
	if (timer) {
		clearTimeout(timer);
	}
	
	timer = setTimeout(() => {
		hide();
	}, props.duration);
};

const hide = () => {
	visible.value = false;
};

watch(() => props.message, (newVal) => {
	if (newVal) {
		show();
	}
});

defineExpose({
	show,
	hide
});
</script>

<style scoped lang="scss">
.toast-container {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9999;
	opacity: 0;
	transition: opacity 0.3s;
	pointer-events: none;
	
	&.toast-show {
		opacity: 1;
	}
}

.toast-content {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 24rpx 32rpx;
	background-color: rgba(0, 0, 0, 0.8);
	border-radius: $uni-border-radius-md;
	max-width: 500rpx;
	
	&.toast-success {
		background-color: rgba(76, 175, 80, 0.9);
	}
	
	&.toast-error {
		background-color: rgba(244, 67, 54, 0.9);
	}
	
	&.toast-warning {
		background-color: rgba(255, 152, 0, 0.9);
	}
}

.toast-text {
	font-size: 28rpx;
	color: #FFFFFF;
	line-height: 1.5;
}
</style>
