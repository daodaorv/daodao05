<template>
	<view v-if="notices.length > 0" class="notice-banner">
		<u-icon name="volume" size="18" color="#FF9F29"></u-icon>
		<view class="notice-content">
			<swiper 
				class="notice-swiper" 
				:vertical="true" 
				:autoplay="autoplay" 
				:interval="interval" 
				:circular="true"
				:duration="300"
			>
				<swiper-item v-for="(notice, index) in notices" :key="index">
					<view class="notice-text" @tap="handleNoticeClick(notice)">
						{{ notice.content }}
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script setup lang="ts">
interface Notice {
	id: string;
	content: string;
	link?: string;
	type?: 'info' | 'warning' | 'error';
}

interface Props {
	notices: Notice[];
	autoplay?: boolean;
	interval?: number;
}

const props = withDefaults(defineProps<Props>(), {
	notices: () => [],
	autoplay: true,
	interval: 3000
});

const emit = defineEmits(['click']);

const handleNoticeClick = (notice: Notice) => {
	emit('click', notice);
	if (notice.link) {
		uni.navigateTo({
			url: notice.link
		});
	}
};
</script>

<style scoped lang="scss">
.notice-banner {
	display: flex;
	align-items: center;
	height: 80rpx; /* 固定高度 80rpx */
	padding: 0 32rpx;
	background-color: #FFF5E9;
	gap: 16rpx;
}

.notice-content {
	flex: 1;
	height: 100%; /* 充满父容器 */
	overflow: hidden;
}

.notice-swiper {
	height: 100%;
}

.notice-text {
	font-size: 24rpx;
	color: $uni-color-primary;
	line-height: 80rpx; /* 垂直居中 */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
