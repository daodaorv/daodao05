<template>
	<view v-if="notices.length > 0" class="notice-banner">
		<view class="icon-box">
			<u-icon name="volume-fill" size="16" color="#FF9F29"></u-icon>
		</view>
		<view class="notice-content">
			<swiper 
				class="notice-swiper" 
				:vertical="true" 
				:autoplay="autoplay" 
				:interval="interval" 
				:circular="true"
				:duration="500"
			>
				<swiper-item v-for="(notice, index) in notices" :key="index">
					<view class="notice-text" @tap="handleNoticeClick(notice)">
						{{ notice.content }}
					</view>
				</swiper-item>
			</swiper>
		</view>
		<u-icon name="arrow-right" size="12" color="#FF9F29" style="opacity: 0.6;"></u-icon>
	</view>
</template>

<script setup lang="ts">
interface Notice {
	id: string;
	content: string;
	link?: string;
}

interface Props {
	notices: Notice[];
	autoplay?: boolean;
	interval?: number;
}

withDefaults(defineProps<Props>(), {
	notices: () => [],
	autoplay: true,
	interval: 3000
});

const emit = defineEmits(['click']);

const handleNoticeClick = (notice: Notice) => {
	emit('click', notice);
	if (notice.link) {
		uni.navigateTo({ url: notice.link });
	}
};
</script>

<style scoped lang="scss">
.notice-banner {
	display: flex;
	align-items: center;
	height: 80rpx;
	padding: 0 24rpx;
	background-color: #FFFFFF; // 改为白色背景更通透，或者保持浅橙色
	border-radius: $uni-radius-lg;
	box-shadow: $uni-shadow-sm;
	gap: 16rpx;
}

.icon-box {
	display: flex;
	align-items: center;
}

.notice-content {
	flex: 1;
	height: 100%;
	overflow: hidden;
}

.notice-swiper {
	height: 100%;
}

.notice-text {
	font-size: 26rpx;
	color: #333; // 深色文字
	line-height: 80rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>