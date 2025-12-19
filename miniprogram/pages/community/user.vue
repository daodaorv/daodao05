<template>
	<view class="user-page">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<image :src="userProfile.avatar" class="avatar" mode="aspectFill" />
			<text class="username">{{ userProfile.userName }}</text>
			<text v-if="userProfile.bio" class="bio">{{ userProfile.bio }}</text>

			<!-- 数据统计 -->
			<view class="stats">
				<view class="stat-item">
					<text class="stat-value">{{ userProfile.postCount }}</text>
					<text class="stat-label">发布</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ userProfile.followerCount }}</text>
					<text class="stat-label">粉丝</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ userProfile.followingCount }}</text>
					<text class="stat-label">关注</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ userProfile.likeCount }}</text>
					<text class="stat-label">获赞</text>
				</view>
			</view>

			<!-- 关注按钮 -->
			<button
				class="follow-btn"
				:class="{ following: userProfile.isFollowing }"
				@click="handleFollow"
			>
				{{ userProfile.isFollowing ? '已关注' : '+ 关注' }}
			</button>
		</view>

		<!-- Tab切换 -->
		<view class="tab-bar">
			<view
				v-for="tab in tabs"
				:key="tab.value"
				class="tab-item"
				:class="{ active: currentTab === tab.value }"
				@click="switchTab(tab.value)"
			>
				<text class="tab-text">{{ tab.label }}</text>
			</view>
		</view>

		<!-- 内容列表 -->
		<view class="content-section">
			<!-- 发布内容 -->
			<view v-if="currentTab === 'posts'" class="post-list">
				<view
					v-for="post in userProfile.posts"
					:key="post.id"
					class="post-item"
					@click="viewPost(post.id)"
				>
					<image
						v-if="post.images && post.images.length > 0"
						:src="post.images[0]"
						class="post-cover"
						mode="aspectFill"
					/>
					<view class="post-info">
						<view class="post-header">
							<view class="type-tag">{{ getTypeLabel(post.type) }}</view>
						</view>
						<text class="post-title">{{ post.title }}</text>
						<view class="post-meta">
							<view class="meta-item">
								<u-icon name="thumb-up" size="14" color="#999999" />
								<text class="meta-text">{{ post.likeCount }}</text>
							</view>
							<view class="meta-item">
								<u-icon name="chat" size="14" color="#999999" />
								<text class="meta-text">{{ post.commentCount }}</text>
							</view>
							<text class="meta-time">{{ formatTime(post.createdAt) }}</text>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-if="userProfile.posts.length === 0" class="empty-state">
					<u-icon name="edit-pen" size="64" color="#CCCCCC" />
					<text class="empty-text">暂无发布内容</text>
				</view>
			</view>

			<!-- 关注列表 -->
			<view v-if="currentTab === 'following'" class="user-list">
				<view class="empty-state">
					<u-icon name="account-fill" size="64" color="#CCCCCC" />
					<text class="empty-text">暂无关注</text>
				</view>
			</view>

			<!-- 粉丝列表 -->
			<view v-if="currentTab === 'followers'" class="user-list">
				<view class="empty-state">
					<u-icon name="account-fill" size="64" color="#CCCCCC" />
					<text class="empty-text">暂无粉丝</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserProfile, followUser, unfollowUser, type UserProfile } from '@/api/community'

// 用户ID
const userId = ref('')

// 用户资料
const userProfile = ref<UserProfile>({
	id: '',
	userName: '',
	avatar: '',
	bio: '',
	postCount: 0,
	followerCount: 0,
	followingCount: 0,
	likeCount: 0,
	isFollowing: false,
	posts: []
})

// 当前Tab
const currentTab = ref('posts')

// Tab列表
const tabs = [
	{ value: 'posts', label: '发布' },
	{ value: 'following', label: '关注' },
	{ value: 'followers', label: '粉丝' }
]

// 获取类型标签
const getTypeLabel = (type: string) => {
	const typeMap: Record<string, string> = {
		GUIDE: '攻略',
		EXPERIENCE: '体验',
		ACTIVITY: '活动',
		QA: '问答'
	}
	return typeMap[type] || '其他'
}

// 格式化时间
const formatTime = (time: string) => {
	const date = new Date(time)
	const now = new Date()
	const diff = now.getTime() - date.getTime()

	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour

	if (diff < minute) {
		return '刚刚'
	} else if (diff < hour) {
		return `${Math.floor(diff / minute)}分钟前`
	} else if (diff < day) {
		return `${Math.floor(diff / hour)}小时前`
	} else if (diff < 7 * day) {
		return `${Math.floor(diff / day)}天前`
	} else {
		return `${date.getMonth() + 1}-${date.getDate()}`
	}
}

// 切换Tab
const switchTab = (tab: string) => {
	currentTab.value = tab
}

// 关注/取消关注
const handleFollow = async () => {
	try {
		if (userProfile.value.isFollowing) {
			const result = await unfollowUser(userProfile.value.id)
			userProfile.value.isFollowing = result.isFollowing
			userProfile.value.followerCount = result.followerCount
			uni.showToast({
				title: '已取消关注',
				icon: 'success'
			})
		} else {
			const result = await followUser(userProfile.value.id)
			userProfile.value.isFollowing = result.isFollowing
			userProfile.value.followerCount = result.followerCount
			uni.showToast({
				title: '关注成功',
				icon: 'success'
			})
		}
	} catch (error) {
		uni.showToast({
			title: '操作失败',
			icon: 'none'
		})
	}
}

// 查看帖子详情
const viewPost = (postId: string) => {
	uni.navigateTo({
		url: `/pages/community/detail?id=${postId}`
	})
}

// 加载用户资料
const loadUserProfile = async () => {
	try {
		uni.showLoading({ title: '加载中...' })
		userProfile.value = await getUserProfile(userId.value)
		uni.hideLoading()
	} catch (error) {
		uni.hideLoading()
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

onMounted(() => {
	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as any
	const options = currentPage.options || {}

	userId.value = options.id || 'user_001'
	loadUserProfile()
})
</script>

<style lang="scss" scoped>
.user-page {
	min-height: 100vh;
	background: #F5F5F5;
}

// 用户信息卡片
.user-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48rpx 32rpx;
	background: #FFFFFF;
	margin-bottom: 16rpx;

	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		margin-bottom: 24rpx;
	}

	.username {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 12rpx;
	}

	.bio {
		font-size: 24rpx;
		color: #999999;
		text-align: center;
		margin-bottom: 32rpx;
	}

	.stats {
		display: flex;
		gap: 64rpx;
		margin-bottom: 32rpx;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8rpx;

			.stat-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}

			.stat-label {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.follow-btn {
		width: 400rpx;
		height: 72rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		font-size: 28rpx;
		border-radius: 36rpx;
		border: none;

		&.following {
			background: #F5F5F5;
			color: #999999;
		}
	}
}

// Tab栏
.tab-bar {
	display: flex;
	background: #FFFFFF;
	margin-bottom: 16rpx;

	.tab-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 88rpx;
		position: relative;

		.tab-text {
			font-size: 28rpx;
			color: #666666;
		}

		&.active {
			.tab-text {
				color: #FF9F29;
				font-weight: 500;
			}

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 4rpx;
				background: #FF9F29;
				border-radius: 2rpx;
			}
		}
	}
}

// 内容区域
.content-section {
	background: #FFFFFF;
	min-height: 400rpx;
}

// 帖子列表
.post-list {
	padding: 32rpx;

	.post-item {
		display: flex;
		gap: 16rpx;
		padding-bottom: 32rpx;
		margin-bottom: 32rpx;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
			margin-bottom: 0;
		}

		.post-cover {
			width: 200rpx;
			height: 150rpx;
			border-radius: 12rpx;
			flex-shrink: 0;
		}

		.post-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 12rpx;

			.post-header {
				.type-tag {
					display: inline-block;
					padding: 4rpx 12rpx;
					background: #E8F5E9;
					color: #4CAF50;
					font-size: 20rpx;
					border-radius: 8rpx;
				}
			}

			.post-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.post-meta {
				display: flex;
				align-items: center;
				gap: 24rpx;

				.meta-item {
					display: flex;
					align-items: center;
					gap: 4rpx;

					.meta-text {
						font-size: 20rpx;
						color: #999999;
					}
				}

				.meta-time {
					margin-left: auto;
					font-size: 20rpx;
					color: #CCCCCC;
				}
			}
		}
	}
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
	gap: 16rpx;

	.empty-text {
		font-size: 24rpx;
		color: #CCCCCC;
	}
}
</style>
