<template>
	<view class="rating-list-page">
		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view
				v-for="(tab, index) in filterTabs"
				:key="index"
				class="tab-item"
				:class="currentTab === index ? 'active' : ''"
				@click="switchTab(index)"
			>
				<text>{{ tab.label }}</text>
			</view>
		</view>

		<!-- 评价列表 -->
		<view class="rating-list">
			<view
				v-for="rating in ratingList"
				:key="rating.id"
				class="rating-item"
			>
				<!-- 订单信息 -->
				<view class="rating-header">
					<view class="order-info">
						<text class="type-tag">{{ getTypeName(rating.type) }}</text>
						<text class="target-name">{{ rating.targetName }}</text>
					</view>
					<view class="rating-status" :class="'status-' + rating.status.toLowerCase()">
						<text>{{ getStatusName(rating.status) }}</text>
					</view>
				</view>

				<!-- 评分和标签 -->
				<view class="rating-score">
					<view class="stars">
						<u-icon
							v-for="star in 5"
							:key="star"
							:name="star <= rating.rating ? 'star-filled' : 'star'"
							:color="star <= rating.rating ? '#FF9F29' : '#E0E0E0'"
							size="20"
						/>
					</view>
					<view class="tags">
						<text
							v-for="tag in rating.tags"
							:key="tag"
							class="tag"
						>{{ tag }}</text>
					</view>
				</view>

				<!-- 评价内容 -->
				<view class="rating-content">
					<text>{{ rating.content }}</text>
				</view>

				<!-- 评价图片 -->
				<view v-if="rating.images.length > 0" class="rating-images">
					<image
						v-for="(image, index) in rating.images"
						:key="index"
						:src="image"
						mode="aspectFill"
						class="image"
						@click="previewImage(rating.images, index)"
					/>
				</view>

				<!-- 商家回复 -->
				<view v-if="rating.reply" class="rating-reply">
					<view class="reply-header">
						<text class="reply-label">商家回复：</text>
					</view>
					<view class="reply-content">
						<text>{{ rating.reply.content }}</text>
					</view>
					<view class="reply-time">
						<text>{{ formatDate(rating.reply.createdAt) }}</text>
					</view>
				</view>

				<!-- 底部信息 -->
				<view class="rating-footer">
					<view class="footer-left">
						<text class="time">{{ formatDate(rating.createdAt) }}</text>
						<text v-if="rating.rewardPoints > 0" class="reward">
							+{{ rating.rewardPoints }}积分
						</text>
					</view>
					<view class="footer-actions">
						<button
							v-if="canEdit(rating)"
							class="action-btn edit-btn"
							@click="handleEdit(rating)"
						>
							编辑
						</button>
						<button
							class="action-btn delete-btn"
							@click="handleDelete(rating)"
						>
							删除
						</button>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="ratingList.length === 0 && !loading" class="empty-state">
				<image src="/static/images/empty-rating.png" class="empty-image" mode="aspectFit"></image>
				<text class="empty-text">暂无评价记录</text>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<u-icon name="spinner-cycle" size="32" color="#999999" />
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore && !loading" class="load-more" @click="loadMore">
				<text>加载更多</text>
			</view>

			<!-- 没有更多 -->
			<view v-if="!hasMore && ratingList.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockGetMyRatings, type Rating, type RatingType, type RatingStatus } from '@/api/rating'

// 筛选标签
const filterTabs = ref([
	{ label: '全部', type: null, status: null },
	{ label: '房车租赁', type: 'VEHICLE', status: null },
	{ label: '营地预订', type: 'CAMPSITE', status: null },
	{ label: '房车旅游', type: 'TOUR', status: null }
])

const currentTab = ref(0)

// 评价列表
const ratingList = ref<Rating[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(10)

// 获取类型名称
const getTypeName = (type: RatingType) => {
	const names: Record<RatingType, string> = {
		VEHICLE: '房车租赁',
		CAMPSITE: '营地预订',
		TOUR: '房车旅游'
	}
	return names[type]
}

// 获取状态名称
const getStatusName = (status: RatingStatus) => {
	const names: Record<RatingStatus, string> = {
		PENDING: '待审核',
		PUBLISHED: '已发布',
		REJECTED: '已拒绝'
	}
	return names[status]
}

// 格式化日期
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr)
	const now = new Date()
	const diff = now.getTime() - date.getTime()

	// 1小时内
	if (diff < 3600000) {
		const minutes = Math.floor(diff / 60000)
		return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
	}

	// 24小时内
	if (diff < 86400000) {
		const hours = Math.floor(diff / 3600000)
		return `${hours}小时前`
	}

	// 7天内
	if (diff < 604800000) {
		const days = Math.floor(diff / 86400000)
		return `${days}天前`
	}

	// 超过7天显示日期
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 是否可以编辑（24小时内且未被回复）
const canEdit = (rating: Rating) => {
	if (rating.reply) return false

	const createdTime = new Date(rating.createdAt).getTime()
	const now = new Date().getTime()
	const diff = now - createdTime

	return diff < 86400000 // 24小时
}

// 预览图片
const previewImage = (images: string[], index: number) => {
	uni.previewImage({
		urls: images,
		current: index
	})
}

// 切换标签
const switchTab = (index: number) => {
	currentTab.value = index
	page.value = 1
	ratingList.value = []
	loadRatings()
}

// 加载评价列表
const loadRatings = async () => {
	if (loading.value) return

	try {
		loading.value = true

		const tab = filterTabs.value[currentTab.value]
		const params: any = {
			page: page.value,
			pageSize: pageSize.value
		}

		if (tab.type) {
			params.type = tab.type
		}
		if (tab.status) {
			params.status = tab.status
		}

		// 使用Mock数据
		const result = await mockGetMyRatings(params)

		if (page.value === 1) {
			ratingList.value = result.list
		} else {
			ratingList.value.push(...result.list)
		}

		hasMore.value = result.hasMore
		loading.value = false
	} catch (error) {
		console.error('加载评价列表失败:', error)
		loading.value = false
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

// 加载更多
const loadMore = () => {
	if (!hasMore.value || loading.value) return
	page.value++
	loadRatings()
}

// 编辑评价
const handleEdit = (rating: Rating) => {
	uni.navigateTo({
		url: `/pages/rating/create?id=${rating.id}&orderId=${rating.orderId}&type=${rating.type}&targetId=${rating.targetId}&targetName=${rating.targetName}`
	})
}

// 删除评价
const handleDelete = (rating: Rating) => {
	uni.showModal({
		title: '提示',
		content: '确定删除这条评价吗？',
		success: (res) => {
			if (res.confirm) {
				// TODO: 调用删除API
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})

				// 从列表中移除
				const index = ratingList.value.findIndex(r => r.id === rating.id)
				if (index > -1) {
					ratingList.value.splice(index, 1)
				}
			}
		}
	})
}

onMounted(() => {
	loadRatings()
})
</script>

<style lang="scss" scoped>
.rating-list-page {
	min-height: 100vh;
	background: #F5F5F5;
}

// 筛选标签
.filter-tabs {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	background: #FFFFFF;
	padding: 24rpx 32rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		border-radius: 48rpx;
		transition: all 0.3s;

		text {
			font-size: 28rpx;
			color: #666666;
		}

		&.active {
			background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);

			text {
				color: #FFFFFF;
				font-weight: 500;
			}
		}
	}
}

// 评价列表
.rating-list {
	padding: 32rpx;

	.rating-item {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}
}

// 评价头部
.rating-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;

	.order-info {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 16rpx;

		.type-tag {
			padding: 4rpx 16rpx;
			background: #E8F5E9;
			color: #4CAF50;
			font-size: 20rpx;
			border-radius: 8rpx;
		}

		.target-name {
			font-size: 28rpx;
			color: #333333;
			font-weight: 500;
		}
	}

	.rating-status {
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 20rpx;

		&.status-pending {
			background: #FFF3E0;
			color: #FF9800;
		}

		&.status-published {
			background: #E8F5E9;
			color: #4CAF50;
		}

		&.status-rejected {
			background: #FFEBEE;
			color: #F44336;
		}
	}
}

// 评分和标签
.rating-score {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 16rpx;

	.stars {
		display: flex;
		gap: 8rpx;
	}

	.tags {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;

		.tag {
			padding: 4rpx 12rpx;
			background: #FFF8F0;
			color: #FF9F29;
			font-size: 20rpx;
			border-radius: 8rpx;
		}
	}
}

// 评价内容
.rating-content {
	margin-bottom: 16rpx;

	text {
		font-size: 28rpx;
		color: #333333;
		line-height: 1.6;
	}
}

// 评价图片
.rating-images {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16rpx;
	margin-bottom: 16rpx;

	.image {
		width: 100%;
		height: 200rpx;
		border-radius: 12rpx;
	}
}

// 商家回复
.rating-reply {
	margin-top: 16rpx;
	padding: 24rpx;
	background: #F8F8F8;
	border-radius: 12rpx;

	.reply-header {
		margin-bottom: 12rpx;

		.reply-label {
			font-size: 24rpx;
			color: #FF9F29;
			font-weight: 500;
		}
	}

	.reply-content {
		margin-bottom: 12rpx;

		text {
			font-size: 26rpx;
			color: #666666;
			line-height: 1.5;
		}
	}

	.reply-time {
		text {
			font-size: 20rpx;
			color: #999999;
		}
	}
}

// 评价底部
.rating-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #F0F0F0;

	.footer-left {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.time {
			font-size: 24rpx;
			color: #999999;
		}

		.reward {
			font-size: 24rpx;
			color: #FF9F29;
		}
	}

	.footer-actions {
		display: flex;
		gap: 16rpx;

		.action-btn {
			padding: 8rpx 24rpx;
			font-size: 24rpx;
			border-radius: 48rpx;
			border: none;

			&.edit-btn {
				background: #FFF8F0;
				color: #FF9F29;
			}

			&.delete-btn {
				background: #F5F5F5;
				color: #999999;
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

	.empty-image {
		width: 320rpx;
		height: 320rpx;
		margin-bottom: 32rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999999;
	}
}

// 加载状态
.loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 0;

	.loading-text {
		font-size: 24rpx;
		color: #999999;
		margin-top: 16rpx;
	}
}

// 加载更多
.load-more {
	text-align: center;
	padding: 40rpx 0;

	text {
		font-size: 28rpx;
		color: #FF9F29;
	}
}

// 没有更多
.no-more {
	text-align: center;
	padding: 40rpx 0;

	text {
		font-size: 24rpx;
		color: #999999;
	}
}
</style>
