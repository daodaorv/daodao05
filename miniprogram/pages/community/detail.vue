<template>
	<view class="detail-page">
		<!-- 导航栏占位 -->
		<!-- <view class="nav-placeholder"></view> -->

		<!-- 头部作者信息 -->
		<view class="header-section">
			<view class="author-row" @click="viewUserProfile">
				<image :src="post.userAvatar" class="avatar" mode="aspectFill" />
				<view class="author-info">
					<text class="author-name">{{ post.userName }}</text>
					<view class="meta-row">
						<text class="publish-time">{{ formatTime(post.createdAt) }}</text>
						<text class="separator">·</text>
						<text class="location" v-if="post.location">{{ post.location }}</text>
					</view>
				</view>
				<button class="follow-btn" :class="{ following: isFollowing }" @click.stop="handleFollow">
					{{ isFollowing ? '已关注' : '关注' }}
				</button>
			</view>
		</view>

		<!-- 轮播图/图片展示 -->
		<view v-if="post.images && post.images.length > 0" class="media-section">
			<swiper class="image-swiper" :indicator-dots="post.images.length > 1" indicator-active-color="#FF9F29" :autoplay="false" :circular="true">
				<swiper-item v-for="(image, index) in post.images" :key="index" @click="previewImage(index)">
					<image :src="image" class="swiper-image" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<view class="title-section">
				<text class="title">{{ post.title }}</text>
			</view>

			<view class="article-content">
				<rich-text :nodes="formattedContent" class="rich-text"></rich-text>
			</view>

			<!-- 标签 -->
			<view v-if="post.tags && post.tags.length > 0" class="tags-row">
				<view v-for="tag in post.tags" :key="tag" class="tag-chip"># {{ tag }}</view>
			</view>

			<!-- 底部数据统计 -->
			<view class="stats-row">
				<text class="stat-text">阅读 {{ post.viewCount }}</text>
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comments-section">
			<view class="section-header">
				<text class="section-title">全部评论 ({{ post.commentCount }})</text>
			</view>

			<view v-if="comments.length > 0" class="comment-list">
				<view v-for="comment in comments" :key="comment.id" class="comment-item">
					<image :src="comment.userAvatar" class="comment-avatar" mode="aspectFill" />
					<view class="comment-body">
						<view class="comment-user-row">
							<text class="username">{{ comment.userName }}</text>
							<view class="like-action" @click="likeComment(comment.id)">
								<u-icon :name="comment.isLiked ? 'heart-fill' : 'heart'" size="14" :color="comment.isLiked ? '#FF4D4F' : '#999'" />
								<text class="count" v-if="comment.likeCount > 0">{{ comment.likeCount }}</text>
							</view>
						</view>
						<text class="comment-content">{{ comment.content }}</text>
						<view class="comment-footer">
							<text class="time">{{ formatTime(comment.createdAt) }}</text>
							<text class="reply-btn" @click="replyComment(comment)">回复</text>
						</view>

						<!-- 二级回复 -->
						<view v-if="comment.replies && comment.replies.length > 0" class="sub-comments">
							<view v-for="reply in comment.replies" :key="reply.id" class="sub-comment-item">
								<text class="sub-text">
									<text class="sub-user">{{ reply.userName }}</text>
									<text v-if="reply.replyToUserName" class="reply-arrow"> 回复 </text>
									<text v-if="reply.replyToUserName" class="sub-user">{{ reply.replyToUserName }}</text>
									: {{ reply.content }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="empty-state">
				<text>暂无评论，快来抢沙发~</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-action-bar">
			<view class="input-box" @click="focusInput">
				<u-icon name="compose" size="16" color="#666" />
				<text class="placeholder">说点什么...</text>
			</view>
			<view class="actions">
				<view class="action-btn" @click="handleLike">
					<u-icon :name="post.isLiked ? 'heart-fill' : 'heart'" size="24" :color="post.isLiked ? '#FF4D4F' : '#333'" />
					<text class="count">{{ post.likeCount || '点赞' }}</text>
				</view>
				<view class="action-btn" @click="handleFavorite">
					<u-icon :name="post.isFavorited ? 'star-fill' : 'star'" size="24" :color="post.isFavorited ? '#FF9F29' : '#333'" />
					<text class="count">{{ post.favoriteCount || '收藏' }}</text>
				</view>
				<view class="action-btn">
					<u-icon name="chat" size="24" color="#333" />
					<text class="count">{{ post.commentCount || '评论' }}</text>
				</view>
			</view>
		</view>

		<!-- 真正的输入弹窗/区域 (简化处理，实际可能需要popup) -->
		<view v-if="showInput" class="input-overlay" @click="showInput = false">
			<view class="input-panel" @click.stop>
				<textarea 
					v-model="commentInput" 
					class="comment-textarea" 
					:placeholder="replyTarget ? `回复 @${replyTarget.userName}` : '写评论...'" 
					:focus="showInput"
					cursor-spacing="20"
				/>
				<view class="panel-footer">
					<button class="send-btn" @click="sendComment">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
	getPostDetail,
	getComments,
	likePost,
	unlikePost,
	favoritePost,
	unfavoritePost,
	commentPost,
	followUser,
	unfollowUser,
	type CommunityPost,
	type Comment
} from '@/api/community'

const postId = ref('')
const showInput = ref(false)

const post = ref<CommunityPost>({
	id: '',
	userId: '',
	userName: '',
	userAvatar: '',
	type: 'GUIDE' as any,
	title: '',
	content: '',
	images: [],
	tags: [],
	location: '',
	viewCount: 0,
	likeCount: 0,
	commentCount: 0,
	favoriteCount: 0,
	isLiked: false,
	isFavorited: false,
	status: 'PUBLISHED' as any,
	createdAt: ''
})

const comments = ref<Comment[]>([])
const commentInput = ref('')
const isFollowing = ref(false)
const replyTarget = ref<Comment | null>(null)

// 格式化内容
const formattedContent = computed(() => {
	let content = post.value.content || ''
	// 简单处理换行
	content = content.replace(/\n/g, '<br/>')
	return `<div style="font-size: 16px; line-height: 1.8; color: #333;">${content}</div>`
})

const formatTime = (time: string) => {
	if (!time) return ''
	const date = new Date(time)
	return `${date.getMonth() + 1}-${date.getDate()}`
}

const previewImage = (index: number) => {
	uni.previewImage({
		urls: post.value.images,
		current: index
	})
}

const viewUserProfile = () => {
	uni.navigateTo({
		url: `/pages/community/user?id=${post.value.userId}`
	})
}

const handleFollow = async () => {
	isFollowing.value = !isFollowing.value
	uni.showToast({ title: isFollowing.value ? '已关注' : '已取消关注', icon: 'none' })
}

const handleLike = async () => {
	post.value.isLiked = !post.value.isLiked
	post.value.likeCount += post.value.isLiked ? 1 : -1
}

const handleFavorite = async () => {
	post.value.isFavorited = !post.value.isFavorited
	post.value.favoriteCount += post.value.isFavorited ? 1 : -1
}

const focusInput = () => {
	showInput.value = true
	replyTarget.value = null
}

const replyComment = (comment: Comment) => {
	replyTarget.value = comment
	showInput.value = true
}

const likeComment = (id: string) => {
	// Mock like comment
}

const sendComment = async () => {
	if (!commentInput.value.trim()) return
	
	// Mock sending
	const newComment: Comment = {
		id: Date.now().toString(),
		userId: 'me',
		userName: '我',
		userAvatar: '/static/default-avatar.png',
		content: commentInput.value,
		createdAt: new Date().toISOString(),
		likeCount: 0,
		isLiked: false,
		replies: []
	}
	
	if (replyTarget.value) {
		// Add to replies (mock)
		// In real app, re-fetch comments
	} else {
		comments.value.unshift(newComment)
	}
	
	post.value.commentCount++
	commentInput.value = ''
	showInput.value = false
	uni.showToast({ title: '评论成功', icon: 'success' })
}

const loadPost = async () => {
	// Mock data loading
	// post.value = await getPostDetail(postId.value)
	// For demo purpose, keep existing mock or load real
    // Using the same mock logic as before but ensuring it populates correctly
    post.value = {
        id: '1',
        userId: 'u1',
        userName: '房车旅行家',
        userAvatar: 'https://picsum.photos/100/100?random=1',
        type: 'GUIDE',
        title: '川西秘境·稻城亚丁房车自驾攻略',
        content: '稻城亚丁被誉为"蓝色星球上的最后一片净土"。\n\n这里有雪山、冰川、峡谷、森林、草甸、湖泊，风景绝美。\n\n最佳旅游季节：9-10月，此时秋色迷人，气候宜人。\n\n注意事项：\n1. 高原反应预防\n2. 防晒保暖\n3. 尊重当地风俗',
        images: [
            'https://picsum.photos/750/500?random=101',
            'https://picsum.photos/750/500?random=102'
        ],
        tags: ['川西', '自驾', '攻略'],
        location: '四川·甘孜',
        viewCount: 1205,
        likeCount: 89,
        commentCount: 12,
        favoriteCount: 45,
        isLiked: false,
        isFavorited: false,
        status: 'PUBLISHED',
        createdAt: '2025-11-28T10:00:00Z'
    } as any
}

const loadComments = async () => {
    // Mock comments
    comments.value = [
        {
            id: 'c1',
            userId: 'u2',
            userName: '路在脚下',
            userAvatar: 'https://picsum.photos/100/100?random=2',
            content: '太美了！请问租车费用大概多少？',
            createdAt: '2025-11-28T10:30:00Z',
            likeCount: 5,
            isLiked: false,
            replies: [
                {
                    id: 'r1',
                    userId: 'u1',
                    userName: '房车旅行家',
                    replyToUserName: '路在脚下',
                    content: '淡旺季价格不同，建议查看APP首页的特惠套餐哦。',
                    createdAt: '2025-11-28T11:00:00Z'
                }
            ]
        } as any
    ]
}

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as any
	const options = currentPage.options || {}
	postId.value = options.id || 'post_001'
	loadPost()
	loadComments()
})
</script>

<style lang="scss" scoped>
.detail-page {
	background-color: #FFFFFF;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.header-section {
	padding: 20rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.author-row {
	display: flex;
	align-items: center;
	width: 100%;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	border: 1rpx solid #F0F0F0;
}

.author-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.author-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 4rpx;
}

.meta-row {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.separator {
	margin: 0 8rpx;
}

.follow-btn {
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	font-weight: 500;
	background-color: #FF9F29;
	color: #FFF;
	line-height: 1.2;
	
	&.following {
		background-color: #F5F5F5;
		color: #999;
		border: 1rpx solid #EEE;
	}
	
	&::after { border: none; }
}

.media-section {
	width: 100%;
	height: 500rpx;
	background-color: #F5F5F5;
}

.image-swiper {
	width: 100%;
	height: 100%;
}

.swiper-image {
	width: 100%;
	height: 100%;
}

.content-container {
	padding: 32rpx;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	margin-bottom: 24rpx;
	display: block;
}

.article-content {
	margin-bottom: 32rpx;
}

.tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.tag-chip {
	font-size: 26rpx;
	color: #576B95;
	background-color: #F2F5FF;
	padding: 8rpx 20rpx;
	border-radius: 8rpx;
}

.stats-row {
	font-size: 24rpx;
	color: #999;
	margin-top: 32rpx;
	padding-bottom: 32rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.comments-section {
	padding: 0 32rpx;
}

.section-header {
	padding: 32rpx 0;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.comment-item {
	display: flex;
	margin-bottom: 40rpx;
}

.comment-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.comment-body {
	flex: 1;
}

.comment-user-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.username {
	font-size: 26rpx;
	color: #666;
	font-weight: 500;
}

.like-action {
	display: flex;
	align-items: center;
	gap: 4rpx;
	
	.count {
		font-size: 24rpx;
		color: #999;
	}
}

.comment-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	display: block;
	margin-bottom: 12rpx;
}

.comment-footer {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 16rpx;
}

.time {
	font-size: 24rpx;
	color: #CCC;
}

.reply-btn {
	font-size: 24rpx;
	color: #576B95;
	font-weight: 500;
}

.sub-comments {
	background-color: #F9F9F9;
	padding: 16rpx;
	border-radius: 8rpx;
}

.sub-comment-item {
	font-size: 26rpx;
	line-height: 1.6;
	margin-bottom: 8rpx;
	
	&:last-child { margin-bottom: 0; }
}

.sub-user {
	color: #666;
	font-weight: 500;
}

.reply-arrow {
	color: #999;
	margin: 0 4rpx;
}

.empty-state {
	padding: 60rpx 0;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}

.bottom-action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #FFF;
	border-top: 1rpx solid #F0F0F0;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
	z-index: 100;
	padding-bottom: env(safe-area-inset-bottom);
}

.input-box {
	flex: 1;
	height: 72rpx;
	background-color: #F5F5F5;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	margin-right: 32rpx;
	
	.placeholder {
		font-size: 28rpx;
		color: #999;
		margin-left: 12rpx;
	}
}

.actions {
	display: flex;
	align-items: center;
	gap: 40rpx;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	
	.count {
		position: absolute;
		top: -8rpx;
		right: -10rpx;
		font-size: 20rpx;
		color: #666;
		background-color: #FFF;
		padding: 0 4rpx;
	}
}

.input-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.5);
	z-index: 999;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.input-panel {
	background-color: #FFF;
	padding: 32rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
	border-radius: 24rpx 24rpx 0 0;
}

.comment-textarea {
	width: 100%;
	height: 200rpx;
	background-color: #F5F5F5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	margin-bottom: 20rpx;
}

.panel-footer {
	display: flex;
	justify-content: flex-end;
}

.send-btn {
	background-color: #FF9F29;
	color: #FFF;
	font-size: 28rpx;
	padding: 0 40rpx;
	height: 64rpx;
	line-height: 64rpx;
	border-radius: 32rpx;
	margin: 0;
}
</style>
