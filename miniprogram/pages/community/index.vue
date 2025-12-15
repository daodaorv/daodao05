<template>
	<view class="community-page">
		<!-- 沉浸式头部背景 -->
		<view class="header-bg"></view>
		
		<!-- 顶部占位 / 标题栏 -->
		<view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
			<text class="page-title">社区</text>
		</view>

		<!-- 业务入口 (改为更现代的 Glassmorphism 卡片) -->
		<view class="business-grid">
			<view class="biz-card campsite" @click="navigateTo('/pages/campsite/list')">
				<view class="biz-content">
					<text class="biz-title">营地预订</text>
					<text class="biz-desc">精选全国 200+ 优质营地</text>
				</view>
				<image class="biz-icon" src="/static/logo.png" mode="aspectFit"></image> <!-- 替换为合适的插图 -->
			</view>
			<view class="biz-card tour" @click="navigateTo('/pages/tour/list')">
				<view class="biz-content">
					<text class="biz-title">房车旅游</text>
					<text class="biz-desc">跟团自驾 · 深度体验</text>
				</view>
				<image class="biz-icon" src="/static/logo.png" mode="aspectFit"></image> <!-- 替换为合适的插图 -->
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
			<!-- 左列 -->
			<view class="column">
				<view 
					v-for="post in leftPosts" 
					:key="post.id" 
					class="post-card"
					@click="viewDetail(post)"
				>
					<image class="post-img" :src="post.image" mode="widthFix"></image>
					<view class="post-body">
						<text class="post-title">{{ post.title }}</text>
						<view class="post-footer">
							<view class="user-box">
								<image class="avatar" :src="post.avatar" mode="aspectFill"></image>
								<text class="username">{{ post.nickname }}</text>
							</view>
							<view class="like-box">
								<u-icon name="heart" size="12" color="#999"></u-icon>
								<text class="count">{{ post.likes }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 右列 -->
			<view class="column">
				<view 
					v-for="post in rightPosts" 
					:key="post.id" 
					class="post-card"
					@click="viewDetail(post)"
				>
					<image class="post-img" :src="post.image" mode="widthFix"></image>
					<view class="post-body">
						<text class="post-title">{{ post.title }}</text>
						<view class="post-footer">
							<view class="user-box">
								<image class="avatar" :src="post.avatar" mode="aspectFill"></image>
								<text class="username">{{ post.nickname }}</text>
							</view>
							<view class="like-box">
								<u-icon name="heart" size="12" color="#999"></u-icon>
								<text class="count">{{ post.likes }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 悬浮发布按钮 -->
		<view class="fab-btn" @click="handlePublish">
			<u-icon name="plus" size="24" color="#FFFFFF"></u-icon>
			<text class="fab-text">发布</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const statusBarHeight = ref(0);

// Categories
const categories = ref([
	{ id: 'all', name: '推荐' },
	{ id: 'guide', name: '攻略' },
	{ id: 'experience', name: '游记' },
	{ id: 'activity', name: '活动' },
	{ id: 'qa', name: '问答' }
]);

const currentCategory = ref('all');

onMounted(() => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;
});

// Mock Data
const posts = ref([
	{ id: 1, title: '318国道房车自驾攻略，避坑指南！', image: '/static/场景推荐2.jpg', avatar: '/static/default-avatar.png', nickname: '旅行达人', likes: 128, category: 'guide' },
	{ id: 2, title: '带娃房车游，这些装备一定要带', image: '/static/优惠政策.jpg', avatar: '/static/default-avatar.png', nickname: '亲子旅行', likes: 99, category: 'experience' },
	{ id: 3, title: '我的第一次房车之旅，太震撼了', image: '/static/场景推荐2.jpg', avatar: '/static/default-avatar.png', nickname: '小白车友', likes: 256, category: 'experience' },
	{ id: 4, title: '川西小环线，7天6晚完美路线', image: '/static/优惠政策.jpg', avatar: '/static/default-avatar.png', nickname: '自驾狂人', likes: 342, category: 'guide' },
	{ id: 5, title: '房车露营美食大赏', image: '/static/场景推荐2.jpg', avatar: '/static/default-avatar.png', nickname: '美食家', likes: 67, category: 'experience' }
]);

const filteredPosts = computed(() => {
	if (currentCategory.value === 'all') return posts.value;
	return posts.value.filter(p => p.category === currentCategory.value);
});

const leftPosts = computed(() => filteredPosts.value.filter((_, i) => i % 2 === 0));
const rightPosts = computed(() => filteredPosts.value.filter((_, i) => i % 2 === 1));

const switchCategory = (id: string) => {
	currentCategory.value = id;
};

const navigateTo = (url: string) => uni.navigateTo({ url });
const viewDetail = (post: any) => uni.navigateTo({ url: `/pages/community/detail?id=${post.id}` });
const handlePublish = () => uni.navigateTo({ url: '/pages/community/publish' });
</script>

<style scoped lang="scss">
.community-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 120rpx;
	position: relative;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 400rpx;
	background: linear-gradient(180deg, #FFF8E1 0%, $uni-bg-color 100%);
	z-index: 0;
}

.custom-header {
	position: relative;
	z-index: 1;
	height: 44px;
	display: flex;
	align-items: center;
	padding-left: $uni-spacing-lg;
}

.page-title {
	font-size: 36rpx;
	font-weight: 800;
	color: $uni-text-color;
}

/* 业务卡片 */
.business-grid {
	position: relative;
	z-index: 1;
	padding: $uni-spacing-md $uni-spacing-lg $uni-spacing-lg;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: $uni-spacing-md;
}

.biz-card {
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-md;
	height: 160rpx;
	position: relative;
	overflow: hidden;
	box-shadow: $uni-shadow-card;
	display: flex;
	flex-direction: column;
	justify-content: center;
	transition: transform 0.2s ease;

	&.campsite {
		background: linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%);
	}

	&.tour {
		background: linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%);
	}

	&:active { transform: scale(0.98); }
}

.biz-content {
	position: relative;
	z-index: 2;
}

.biz-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
	display: block;
	margin-bottom: 4rpx;
}

.biz-desc {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.biz-icon {
	position: absolute;
	right: -20rpx;
	bottom: -20rpx;
	width: 100rpx;
	height: 100rpx;
	opacity: 0.2;
	z-index: 1;
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