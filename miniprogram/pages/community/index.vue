<template>
	<view class="community-page">
		<!-- 沉浸式头部背景 -->
		<view class="header-bg"></view>

		<!-- 顶部占位 / 标题栏 -->
		<view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
			<text class="page-title">社区</text>
		</view>

		<!-- 业务入口 (沉浸式卡片) -->
		<view class="business-grid">
			<view class="biz-card campsite-card" @click="navigateTo('/pages/campsite/list')">
				<view class="card-overlay"></view>
				<view class="biz-content">
					<view class="biz-header">
						<text class="biz-title">营地预订</text>
						<u-icon name="arrow-right" color="#FFFFFF" :size="14"></u-icon>
					</view>
					<text class="biz-desc">精选全国 200+ 优质营地</text>
				</view>
			</view>
			<view class="biz-card tour-card" @click="navigateTo('/pages/tour/list')">
				<view class="card-overlay"></view>
				<view class="biz-content">
					<view class="biz-header">
						<text class="biz-title">房车旅游</text>
						<u-icon name="arrow-right" color="#FFFFFF" :size="14"></u-icon>
					</view>
					<text class="biz-desc">跟团自驾 · 深度体验</text>
				</view>
			</view>
		</view>

		<!-- 粘性分类 Tab -->
		<view class="sticky-tabs">
			<scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
				<view class="tabs-wrapper">
					<view
						v-for="item in categories"
						:key="item.id"
						class="tab-pill"
						:class="{ active: currentCategory === item.id }"
						@click="switchCategory(item.id)"
					>
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 瀑布流内容 -->
		<view class="waterfall-container">
			<view class="column">
				<view
					v-for="post in leftPosts"
					:key="post.id"
					class="post-card"
					@click="goToDetail(post.id)"
				>
					<image :src="post.cover" class="post-img" mode="widthFix"></image>
					<view class="post-body">
						<text class="post-title">{{ post.title }}</text>
						<view class="post-footer">
							<view class="user-box">
								<image :src="post.userAvatar" class="avatar" mode="aspectFill"></image>
								<text class="username">{{ post.userName }}</text>
							</view>
							<view class="like-box">
								<u-icon name="heart" :size="16" color="#999"></u-icon>
								<text class="count">{{ post.likeCount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="column">
				<view
					v-for="post in rightPosts"
					:key="post.id"
					class="post-card"
					@click="goToDetail(post.id)"
				>
					<image :src="post.cover" class="post-img" mode="widthFix"></image>
					<view class="post-body">
						<text class="post-title">{{ post.title }}</text>
						<view class="post-footer">
							<view class="user-box">
								<image :src="post.userAvatar" class="avatar" mode="aspectFill"></image>
								<text class="username">{{ post.userName }}</text>
							</view>
							<view class="like-box">
								<u-icon name="heart" :size="16" color="#999"></u-icon>
								<text class="count">{{ post.likeCount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 发布按钮 (FAB) -->
		<view class="fab-btn" @click="goToPublish">
			<u-icon name="plus" :size="20" color="#FFFFFF"></u-icon>
			<text class="fab-text">发布</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { logger } from '@/utils/logger'

// 状态栏高度
const statusBarHeight = ref(0)

// 分类数据
const categories = ref([
	{ id: 'all', name: '全部' },
	{ id: 'travel', name: '旅行日记' },
	{ id: 'guide', name: '攻略分享' },
	{ id: 'equipment', name: '装备测评' },
	{ id: 'camping', name: '露营生活' },
	{ id: 'food', name: '美食推荐' }
])

// 当前分类
const currentCategory = ref('all')

// Mock 帖子数据
const posts = ref([
	{
		id: 1,
		cover: 'https://placehold.co/300x400/FF9F29/FFFFFF?text=Post1',
		title: '川西秋色 | 房车自驾7天深度游记',
		userName: '旅行达人',
		userAvatar: '/static/default-avatar.png',
		likeCount: 128
	},
	{
		id: 2,
		cover: 'https://placehold.co/300x300/2196F3/FFFFFF?text=Post2',
		title: '新手必看！房车露营装备清单',
		userName: '露营玩家',
		userAvatar: '/static/default-avatar.png',
		likeCount: 256
	},
	{
		id: 3,
		cover: 'https://placehold.co/300x500/4CAF50/FFFFFF?text=Post3',
		title: '西藏阿里大环线 | 21天房车旅行攻略',
		userName: '自驾游侠',
		userAvatar: '/static/default-avatar.png',
		likeCount: 512
	},
	{
		id: 4,
		cover: 'https://placehold.co/300x350/FF5722/FFFFFF?text=Post4',
		title: '房车上的美食 | 10道简单快手菜',
		userName: '美食博主',
		userAvatar: '/static/default-avatar.png',
		likeCount: 89
	},
	{
		id: 5,
		cover: 'https://placehold.co/300x450/9C27B0/FFFFFF?text=Post5',
		title: '新疆独库公路 | 最美自驾路线推荐',
		userName: '风景摄影师',
		userAvatar: '/static/default-avatar.png',
		likeCount: 342
	},
	{
		id: 6,
		cover: 'https://placehold.co/300x320/FF9800/FFFFFF?text=Post6',
		title: '房车改装日记 | 打造温馨移动小家',
		userName: '改装达人',
		userAvatar: '/static/default-avatar.png',
		likeCount: 167
	}
])

// 瀑布流分栏
const leftPosts = computed(() => {
	return posts.value.filter((_, index) => index % 2 === 0)
})

const rightPosts = computed(() => {
	return posts.value.filter((_, index) => index % 2 === 1)
})

// 页面加载
onMounted(() => {
	// 获取状态栏高度
	const systemInfo = uni.getSystemInfoSync()
	statusBarHeight.value = systemInfo.statusBarHeight || 0

	// 加载帖子数据
	loadPosts()
})

// 切换分类
const switchCategory = (categoryId: string) => {
	currentCategory.value = categoryId
	logger.debug('切换分类', { categoryId })
	// TODO: 根据分类加载数据
	loadPosts()
}

// 加载帖子数据
const loadPosts = () => {
	logger.debug('加载帖子数据', { category: currentCategory.value })
	// TODO: 调用API加载数据
}

// 跳转到帖子详情
const goToDetail = (postId: number) => {
	uni.navigateTo({
		url: `/pages/community/detail?id=${postId}`
	})
}

// 跳转到发布页面
const goToPublish = () => {
	uni.navigateTo({
		url: '/pages/community/publish'
	})
}

// 页面跳转
const navigateTo = (url: string) => {
	uni.navigateTo({ url })
}
</script>

<style scoped lang="scss">
.community-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 120rpx;
}

/* 头部背景 */
.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 400rpx;
	background: linear-gradient(180deg, rgba(255, 159, 41, 0.08) 0%, transparent 100%);
	z-index: 0;
}

/* 自定义标题栏 */
.custom-header {
	position: relative;
	z-index: 10;
	padding: 20rpx $uni-spacing-lg;
	text-align: center;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: $uni-text-color;
}

/* 业务卡片 */
.business-grid {
	position: relative;
	z-index: 1;
	padding: $uni-spacing-md $uni-spacing-lg $uni-spacing-lg;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.biz-card {
	position: relative;
	height: 220rpx;
	border-radius: 24rpx;
	overflow: hidden;
	background-color: #E0E0E0;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	transition: transform 0.2s ease;

	&:active { transform: scale(0.98); }

	// 营地预订卡片渐变背景
	&.campsite-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	// 房车旅游卡片渐变背景
	&.tour-card {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}
}

.card-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.card-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
}

.biz-content {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 24rpx;
	z-index: 2;
	box-sizing: border-box;
}

.biz-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.biz-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
}

.biz-desc {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.9);
	display: block;
}

/* Sticky Tabs */
.sticky-tabs {
	position: sticky;
	top: 0;
	z-index: 99;
	background-color: $uni-bg-color;
	padding: $uni-spacing-md 0;
}

.tabs-wrapper {
	display: flex;
	padding: 0 $uni-spacing-lg;
	gap: 20rpx;
}

.tab-pill {
	padding: 10rpx $uni-spacing-lg;
	border-radius: 32rpx;
	background-color: #FFFFFF;
	color: $uni-text-color-secondary;
	font-size: 28rpx;
	white-space: nowrap;
	border: 1rpx solid transparent;
	transition: all 0.2s ease;

	&.active {
		background-color: $uni-color-primary;
		color: #FFFFFF;
		font-weight: bold;
		box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);
	}
}

/* 瀑布流 */
.waterfall-container {
	display: flex;
	align-items: flex-start;
	padding: 0 $uni-spacing-md;
	gap: 20rpx;
}

.column {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.post-card {
	background-color: #FFFFFF;
	border-radius: $uni-radius-md;
	overflow: hidden;
	box-shadow: $uni-shadow-sm;
	transition: opacity 0.2s ease;

	&:active { opacity: 0.9; }
}

.post-img {
	width: 100%;
	display: block;
	background-color: #EEE;
}

.post-body {
	padding: $uni-spacing-md;
}

.post-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
	line-height: 1.4;
	margin-bottom: $uni-spacing-md;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.post-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.user-box {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
}

.avatar {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	background-color: #EEE;
}

.username {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
	max-width: 120rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.like-box {
	display: flex;
	align-items: center;
	gap: 4rpx;

	.count {
		font-size: 22rpx;
		color: $uni-text-color-secondary;
	}
}

/* FAB */
.fab-btn {
	position: fixed;
	right: $uni-spacing-lg;
	bottom: 160rpx;
	background: $uni-color-primary-gradient;
	color: #FFFFFF;
	padding: 0 $uni-spacing-lg;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
	box-shadow: 0 8rpx 20rpx rgba(255, 159, 41, 0.4);
	z-index: 100;
	transition: transform 0.2s ease;

	&:active { transform: scale(0.95); }

	.fab-text {
		font-size: 30rpx;
		font-weight: bold;
	}
}
</style>
