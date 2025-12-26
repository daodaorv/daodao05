<template>
	<view v-if="noticeList.length > 0" class="notice-banner">
		<view class="icon-box">
			<u-icon name="volume-fill" size="16" :color="primaryColor"></u-icon>
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
				<swiper-item v-for="(notice, index) in noticeList" :key="index">
					<view class="notice-text" @tap="handleNoticeClick(notice)">
						{{ notice.content }}
					</view>
				</swiper-item>
			</swiper>
		</view>
		<u-icon name="arrow-right" size="12" :color="primaryColor" style="opacity: 0.6;"></u-icon>
	</view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 主题色常量（与 uni.scss 中 $uni-color-primary 保持一致）
const primaryColor = '#FF9F29';

interface Notice {
	id: string;
	content: string;
	link?: string;
}

interface Props {
	notices?: Notice[];
	autoplay?: boolean;
	interval?: number;
}

const props = withDefaults(defineProps<Props>(), {
	notices: () => [],
	autoplay: true,
	interval: 3000
});

const emit = defineEmits<{
	(e: 'click', notice: Notice): void;
}>();

// 使用计算属性确保 noticeList 始终是数组
const noticeList = computed(() => {
	return Array.isArray(props.notices) ? props.notices : [];
});

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
	background-color: $uni-bg-color-card;
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
	color: $uni-text-color;
	line-height: 80rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>