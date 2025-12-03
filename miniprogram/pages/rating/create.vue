<template>
	<view class="rating-create-page">
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="info-row">
				<text class="label">订单类型</text>
				<text class="value">{{ getTypeName(ratingType) }}</text>
			</view>
			<view class="info-row">
				<text class="label">服务名称</text>
				<text class="value">{{ targetName }}</text>
			</view>
		</view>

		<!-- 评分区域 -->
		<view class="rating-section">
			<view class="section-title">
				<text>服务评分</text>
				<text class="required">*</text>
			</view>
			<view class="star-rating">
				<view
					v-for="star in 5"
					:key="star"
					class="star-item"
					@click="handleStarClick(star)"
				>
					<u-icon
						:name="star <= rating ? 'star-filled' : 'star'"
						:color="star <= rating ? '#FF9F29' : '#E0E0E0'"
						size="40"
					/>
				</view>
			</view>
			<view class="rating-desc">
				<text>{{ getRatingDesc(rating) }}</text>
			</view>
		</view>

		<!-- 评价标签 -->
		<view class="tags-section">
			<view class="section-title">
				<text>选择标签</text>
			</view>
			<view class="tags-list">
				<view
					v-for="tag in availableTags"
					:key="tag"
					class="tag-item"
					:class="selectedTags.includes(tag) ? 'selected' : ''"
					@click="toggleTag(tag)"
				>
					<text>{{ tag }}</text>
				</view>
			</view>
		</view>

		<!-- 评价内容 -->
		<view class="content-section">
			<view class="section-title">
				<text>评价内容</text>
				<text class="required">*</text>
			</view>
			<textarea
				v-model="content"
				class="content-textarea"
				placeholder="分享您的使用体验，帮助其他用户做出选择（10-500字）"
				:maxlength="500"
				:show-confirm-bar="false"
			/>
			<view class="char-count">
				<text>{{ content.length }}/500</text>
			</view>
		</view>

		<!-- 图片上传 -->
		<view class="images-section">
			<view class="section-title">
				<text>上传图片</text>
				<text class="tip">（最多9张，晒图额外奖励20积分）</text>
			</view>
			<view class="images-grid">
				<view
					v-for="(image, index) in images"
					:key="index"
					class="image-item"
				>
					<image :src="image" mode="aspectFill" class="image"></image>
					<view class="image-delete" @click="deleteImage(index)">
						<u-icon name="close" color="#FFFFFF" size="16" />
					</view>
				</view>
				<view
					v-if="images.length < 9"
					class="image-upload"
					@click="chooseImage"
				>
					<u-icon name="camera" color="#999999" size="40" />
					<text class="upload-text">上传图片</text>
				</view>
			</view>
		</view>

		<!-- 评价激励 -->
		<view class="reward-section">
			<view class="reward-card">
				<view class="reward-icon">
					<u-icon name="gift-fill" color="#FF9F29" size="32" />
				</view>
				<view class="reward-content">
					<text class="reward-title">评价奖励</text>
					<text class="reward-desc">优质评价可获得{{ calculateReward() }}积分奖励</text>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<button class="submit-btn" @click="handleSubmit" :disabled="!canSubmit">
				提交评价
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockCreateRating, type RatingType } from '@/api/rating'

// 页面参数
const orderId = ref('')
const ratingType = ref<RatingType>('VEHICLE')
const targetId = ref('')
const targetName = ref('')

// 评分
const rating = ref(5)

// 选中的标签
const selectedTags = ref<string[]>([])

// 评价内容
const content = ref('')

// 上传的图片
const images = ref<string[]>([])

// 可用标签（根据类型动态变化）
const availableTags = computed(() => {
	const tagMap: Record<RatingType, string[]> = {
		VEHICLE: ['车况好', '服务好', '性价比高', '驾驶舒适', '设施齐全', '清洁卫生'],
		CAMPSITE: ['环境好', '设施完善', '服务周到', '位置便利', '安静舒适', '性价比高'],
		TOUR: ['行程好', '领队专业', '风景美', '体验棒', '安排合理', '值得推荐']
	}
	return tagMap[ratingType.value] || []
})

// 是否可以提交
const canSubmit = computed(() => {
	return rating.value > 0 && content.value.length >= 10 && content.value.length <= 500
})

// 获取类型名称
const getTypeName = (type: RatingType) => {
	const names: Record<RatingType, string> = {
		VEHICLE: '房车租赁',
		CAMPSITE: '营地预订',
		TOUR: '房车旅游'
	}
	return names[type]
}

// 获取评分描述
const getRatingDesc = (score: number) => {
	const descs = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
	return descs[score] || ''
}

// 处理星星点击
const handleStarClick = (star: number) => {
	rating.value = star
}

// 切换标签
const toggleTag = (tag: string) => {
	const index = selectedTags.value.indexOf(tag)
	if (index > -1) {
		selectedTags.value.splice(index, 1)
	} else {
		selectedTags.value.push(tag)
	}
}

// 选择图片
const chooseImage = () => {
	const remainCount = 9 - images.value.length
	uni.chooseImage({
		count: remainCount,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			// 模拟上传，实际应该调用上传接口
			images.value.push(...res.tempFilePaths)
		}
	})
}

// 删除图片
const deleteImage = (index: number) => {
	uni.showModal({
		title: '提示',
		content: '确定删除这张图片吗？',
		success: (res) => {
			if (res.confirm) {
				images.value.splice(index, 1)
			}
		}
	})
}

// 计算奖励积分
const calculateReward = () => {
	let reward = 10
	if (rating.value >= 4) reward = 30
	if (images.value.length > 0) reward += 20
	return reward
}

// 提交评价
const handleSubmit = async () => {
	if (!canSubmit.value) {
		uni.showToast({
			title: '请完善评价内容',
			icon: 'none'
		})
		return
	}

	try {
		uni.showLoading({ title: '提交中...' })

		// 使用Mock数据
		const result = await mockCreateRating({
			orderId: orderId.value,
			type: ratingType.value,
			targetId: targetId.value,
			rating: rating.value,
			content: content.value,
			images: images.value,
			tags: selectedTags.value
		})

		uni.hideLoading()

		// 显示成功提示
		uni.showModal({
			title: '评价成功',
			content: `感谢您的评价！已获得${result.rewardPoints}积分奖励`,
			showCancel: false,
			success: () => {
				// 返回上一页
				uni.navigateBack()
			}
		})
	} catch (error) {
		console.error('提交评价失败:', error)
		uni.hideLoading()
		uni.showToast({
			title: '提交失败',
			icon: 'none'
		})
	}
}

onMounted(() => {
	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as any
	const options = currentPage.options || {}

	orderId.value = options.orderId || 'order_001'
	ratingType.value = (options.type as RatingType) || 'VEHICLE'
	targetId.value = options.targetId || 'target_001'
	targetName.value = options.targetName || '依维柯欧胜C型房车'
})
</script>

<style lang="scss" scoped>
.rating-create-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 120rpx;
}

// 订单信息
.order-info {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;

		&:not(:last-child) {
			border-bottom: 1rpx solid #F0F0F0;
		}

		.label {
			font-size: 28rpx;
			color: #999999;
		}

		.value {
			font-size: 28rpx;
			color: #333333;
			font-weight: 500;
		}
	}
}

// 通用区块样式
.rating-section,
.tags-section,
.content-section,
.images-section,
.reward-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;

	.required {
		color: #FF4444;
		margin-left: 8rpx;
	}

	.tip {
		font-size: 24rpx;
		color: #999999;
		font-weight: normal;
		margin-left: 16rpx;
	}
}

// 评分区域
.star-rating {
	display: flex;
	justify-content: center;
	gap: 24rpx;
	padding: 32rpx 0;

	.star-item {
		cursor: pointer;
	}
}

.rating-desc {
	text-align: center;

	text {
		font-size: 28rpx;
		color: #FF9F29;
		font-weight: 500;
	}
}

// 标签区域
.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;

	.tag-item {
		padding: 16rpx 32rpx;
		background: #F5F5F5;
		border-radius: 48rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s;

		text {
			font-size: 26rpx;
			color: #666666;
		}

		&.selected {
			background: #FFF8F0;
			border-color: #FF9F29;

			text {
				color: #FF9F29;
			}
		}
	}
}

// 评价内容
.content-textarea {
	width: 100%;
	min-height: 300rpx;
	padding: 24rpx;
	background: #F8F8F8;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 1.6;
}

.char-count {
	text-align: right;
	margin-top: 16rpx;

	text {
		font-size: 24rpx;
		color: #999999;
	}
}

// 图片上传
.images-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16rpx;

	.image-item {
		position: relative;
		width: 100%;
		padding-bottom: 100%;
		border-radius: 16rpx;
		overflow: hidden;

		.image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.image-delete {
			position: absolute;
			top: 8rpx;
			right: 8rpx;
			width: 48rpx;
			height: 48rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.image-upload {
		width: 100%;
		padding-bottom: 100%;
		position: relative;
		background: #F8F8F8;
		border: 2rpx dashed #E0E0E0;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.upload-text {
			position: absolute;
			bottom: 30%;
			font-size: 24rpx;
			color: #999999;
		}
	}
}

// 评价激励
.reward-card {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%);
	border-radius: 16rpx;

	.reward-icon {
		width: 64rpx;
		height: 64rpx;
		background: #FFFFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.reward-content {
		flex: 1;

		.reward-title {
			display: block;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 8rpx;
		}

		.reward-desc {
			display: block;
			font-size: 24rpx;
			color: #FF9F29;
		}
	}
}

// 底部操作栏
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #FFFFFF;
	padding: 24rpx 32rpx;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
	z-index: 100;

	.submit-btn {
		width: 100%;
		padding: 28rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		border: none;

		&[disabled] {
			opacity: 0.5;
		}
	}
}
</style>
