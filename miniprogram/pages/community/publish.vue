<template>
	<view class="publish-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @click="handleCancel">
				<u-icon name="close" size="24" color="#333333" />
			</view>
			<view class="navbar-title">发布内容</view>
			<view class="navbar-right" @click="handlePublish">
				<text class="publish-btn" :class="{ disabled: !canPublish }">发布</text>
			</view>
		</view>

		<!-- 内容类型选择 -->
		<view class="type-section">
			<view class="section-title">选择类型</view>
			<view class="type-list">
				<view
					v-for="type in postTypes"
					:key="type.value"
					class="type-item"
					:class="{ active: formData.type === type.value }"
					@click="selectType(type.value)"
				>
					<u-icon :name="type.icon" size="24" :color="formData.type === type.value ? '#FF9F29' : '#999999'" />
					<text class="type-name">{{ type.label }}</text>
				</view>
			</view>
		</view>

		<!-- 标题输入 -->
		<view class="title-section">
			<textarea
				v-model="formData.title"
				class="title-input"
				placeholder="请输入标题（必填）"
				maxlength="50"
				:auto-height="true"
			/>
			<view class="char-count">{{ formData.title.length }}/50</view>
		</view>

		<!-- 内容输入 -->
		<view class="content-section">
			<textarea
				v-model="formData.content"
				class="content-input"
				placeholder="分享你的房车旅行故事..."
				maxlength="5000"
				:auto-height="true"
			/>
			<view class="char-count">{{ formData.content.length }}/5000</view>
		</view>

		<!-- 图片上传 -->
		<view class="image-section">
			<view class="section-title">添加图片（最多9张）</view>
			<view class="image-list">
				<view
					v-for="(image, index) in formData.images"
					:key="index"
					class="image-item"
				>
					<image :src="photo" class="photo" mode="aspectFill" />
					<view class="image-delete" @click="deleteImage(index)">
						<u-icon name="close" size="16" color="#FFFFFF" />
					</view>
				</view>
				<view
					v-if="formData.images.length < 9"
					class="image-upload"
					@click="chooseImage"
				>
					<u-icon name="camera" size="32" color="#CCCCCC" />
					<text class="upload-text">添加图片</text>
				</view>
			</view>
		</view>

		<!-- 标签选择 -->
		<view class="tag-section">
			<view class="section-title">添加标签（最多5个）</view>
			<view class="tag-input-wrapper">
				<input
					v-model="tagInput"
					class="tag-input"
					placeholder="输入标签后按回车添加"
					@confirm="addTag"
				/>
			</view>
			<view v-if="formData.tags.length > 0" class="tag-list">
				<view
					v-for="(tag, index) in formData.tags"
					:key="index"
					class="tag-item"
				>
					<text class="tag-text">{{ tag }}</text>
					<view class="tag-delete" @click="deleteTag(index)">
						<u-icon name="close" size="12" color="#FF9F29" />
					</view>
				</view>
			</view>
			<view class="tag-suggestions">
				<text class="suggestion-title">推荐标签：</text>
				<view
					v-for="tag in suggestedTags"
					:key="tag"
					class="suggestion-tag"
					@click="addSuggestedTag(tag)"
				>
					{{ tag }}
				</view>
			</view>
		</view>

		<!-- 位置选择 -->
		<view class="location-section" @click="chooseLocation">
			<view class="section-title">添加位置（可选）</view>
			<view class="location-display">
				<u-icon name="map" size="20" color="#999999" />
				<text class="location-text">{{ formData.location || '点击添加位置' }}</text>
				<u-icon name="arrow-right" size="16" color="#CCCCCC" />
			</view>
		</view>

		<!-- 发布须知 -->
		<view class="notice-section">
			<view class="notice-title">
				<u-icon name="info" size="16" color="#FF9F29" />
				<text>发布须知</text>
			</view>
			<view class="notice-content">
				<text>1. 内容需经过审核，预计24小时内完成</text>
				<text>2. 请确保内容真实、原创，不得侵犯他人权益</text>
				<text>3. 禁止发布违法违规、广告营销等内容</text>
				<text>4. 优质内容将获得积分奖励</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createPost, PostType, type CreatePostParams, uploadImage } from '@/api/community'

// 表单数据
const formData = ref<CreatePostParams>({
	type: PostType.GUIDE,
	title: '',
	content: '',
	images: [],
	tags: [],
	location: ''
})

// 标签输入
const tagInput = ref('')

// 内容类型列表
const postTypes = [
	{ value: PostType.GUIDE, label: '攻略', icon: 'map' },
	{ value: PostType.EXPERIENCE, label: '体验', icon: 'heart' },
	{ value: PostType.ACTIVITY, label: '活动', icon: 'pushpin' },
	{ value: PostType.QA, label: '问答', icon: 'question-circle' }
]

// 推荐标签
const suggestedTags = ref([
	'房车旅行',
	'自驾游',
	'露营',
	'川西',
	'新疆',
	'西藏',
	'海南',
	'云南'
])

// 是否可以发布
const canPublish = computed(() => {
	return formData.value.title.trim() !== '' && formData.value.content.trim() !== ''
})

// 选择类型
const selectType = (type: PostType) => {
	formData.value.type = type
}

// 选择图片
const chooseImage = () => {
	const remainingCount = 9 - formData.value.images.length
	uni.chooseImage({
		count: remainingCount,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			uni.showLoading({ title: '上传中...' })

			try {
				// 确保 tempFilePaths 是数组
				const tempFilePaths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [];

				// 上传所有选中的图片
				const uploadPromises = tempFilePaths.map(filePath => uploadImage(filePath))
				const results = await Promise.all(uploadPromises)

				// 添加到图片列表
				const urls = Array.isArray(results) ? results.map(r => r.url) : [];
				formData.value.images.push(...urls)

				uni.hideLoading()
				uni.showToast({
					title: '上传成功',
					icon: 'success'
				})
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				})
			}
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
				formData.value.images.splice(index, 1)
			}
		}
	})
}

// 添加标签
const addTag = () => {
	const tag = tagInput.value.trim()
	if (!tag) {
		return
	}

	if (formData.value.tags.length >= 5) {
		uni.showToast({
			title: '最多添加5个标签',
			icon: 'none'
		})
		return
	}

	if (formData.value.tags.includes(tag)) {
		uni.showToast({
			title: '标签已存在',
			icon: 'none'
		})
		return
	}

	formData.value.tags.push(tag)
	tagInput.value = ''
}

// 添加推荐标签
const addSuggestedTag = (tag: string) => {
	if (formData.value.tags.length >= 5) {
		uni.showToast({
			title: '最多添加5个标签',
			icon: 'none'
		})
		return
	}

	if (formData.value.tags.includes(tag)) {
		uni.showToast({
			title: '标签已存在',
			icon: 'none'
		})
		return
	}

	formData.value.tags.push(tag)
}

// 删除标签
const deleteTag = (index: number) => {
	formData.value.tags.splice(index, 1)
}

// 选择位置
const chooseLocation = () => {
	uni.chooseLocation({
		success: (res) => {
			formData.value.location = res.name || res.address
		}
	})
}

// 取消发布
const handleCancel = () => {
	if (formData.value.title || formData.value.content || formData.value.images.length > 0) {
		uni.showModal({
			title: '提示',
			content: '确定放弃发布吗？',
			success: (res) => {
				if (res.confirm) {
					uni.navigateBack()
				}
			}
		})
	} else {
		uni.navigateBack()
	}
}

// 发布内容
const handlePublish = async () => {
	if (!canPublish.value) {
		uni.showToast({
			title: '请填写标题和内容',
			icon: 'none'
		})
		return
	}

	uni.showLoading({ title: '发布中...' })

	try {
		await createPost(formData.value)

		uni.hideLoading()
		uni.showToast({
			title: '发布成功，等待审核',
			icon: 'success',
			duration: 2000
		})

		setTimeout(() => {
			uni.navigateBack()
		}, 2000)
	} catch (error) {
		uni.hideLoading()
		uni.showToast({
			title: '发布失败',
			icon: 'none'
		})
	}
}
</script>

<style lang="scss" scoped>
.publish-page {
	min-height: 100vh;
	background: $uni-bg-color;
	padding-bottom: $uni-spacing-lg;
}

// 顶部导航栏
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 $uni-spacing-lg;
	background: #FFFFFF;
	border-bottom: 1rpx solid $uni-border-color-light;
	position: sticky;
	top: 0;
	z-index: 100;

	.navbar-left,
	.navbar-right {
		width: 80rpx;
	}

	.navbar-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: $uni-text-color;
	}

	.publish-btn {
		display: inline-block;
		padding: $uni-spacing-xs $uni-spacing-md;
		background: $uni-color-primary-gradient;
		color: #FFFFFF;
		font-size: 28rpx;
		border-radius: 32rpx;
		transition: opacity 0.2s ease;

		&.disabled {
			background: #CCCCCC;
			opacity: 0.6;
		}

		&:not(.disabled):active {
			opacity: 0.8;
		}
	}
}

// 内容类型选择
.type-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;

	.section-title {
		font-size: 28rpx;
		font-weight: 500;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-md;
	}

	.type-list {
		display: flex;
		gap: $uni-spacing-md;

		.type-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $uni-spacing-sm;
			padding: $uni-spacing-md 0;
			background: $uni-bg-color;
			border-radius: $uni-radius-md;
			border: 2rpx solid transparent;
			transition: all 0.3s ease;

			&.active {
				background: #FFF8F0;
				border-color: $uni-color-primary;
			}

			.type-name {
				font-size: 24rpx;
				color: $uni-text-color-secondary;
			}

			&.active .type-name {
				color: $uni-color-primary;
				font-weight: 500;
			}
		}
	}
}

// 标题输入
.title-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;
	position: relative;

	.title-input {
		width: 100%;
		font-size: 32rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 1.5;
		min-height: 80rpx;
	}

	.char-count {
		position: absolute;
		right: $uni-spacing-lg;
		bottom: $uni-spacing-md;
		font-size: 24rpx;
		color: $uni-text-color-placeholder;
	}
}

// 内容输入
.content-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;
	position: relative;

	.content-input {
		width: 100%;
		font-size: 28rpx;
		color: $uni-text-color-secondary;
		line-height: 1.8;
		min-height: 300rpx;
	}

	.char-count {
		position: absolute;
		right: $uni-spacing-lg;
		bottom: $uni-spacing-md;
		font-size: 24rpx;
		color: $uni-text-color-placeholder;
	}
}

// 图片上传
.image-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;

	.section-title {
		font-size: 28rpx;
		font-weight: 500;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-md;
	}

	.image-list {
		display: flex;
		flex-wrap: wrap;
		gap: $uni-spacing-md;

		.image-item {
			position: relative;
			width: 200rpx;
			height: 200rpx;

			.image {
				width: 100%;
				height: 100%;
				border-radius: $uni-radius-sm;
			}

			.image-delete {
				position: absolute;
				top: $uni-spacing-xs;
				right: $uni-spacing-xs;
				width: 40rpx;
				height: 40rpx;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.image-upload {
			width: 200rpx;
			height: 200rpx;
			background: $uni-bg-color;
			border: 2rpx dashed $uni-border-color-light;
			border-radius: $uni-radius-sm;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: $uni-spacing-sm;
			transition: all 0.2s ease;

			&:active {
				opacity: 0.8;
			}

			.upload-text {
				font-size: 24rpx;
				color: $uni-text-color-placeholder;
			}
		}
	}
}

// 标签选择
.tag-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;

	.section-title {
		font-size: 28rpx;
		font-weight: 500;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-md;
	}

	.tag-input-wrapper {
		margin-bottom: $uni-spacing-md;

		.tag-input {
			width: 100%;
			height: 80rpx;
			padding: 0 $uni-spacing-md;
			background: $uni-bg-color;
			border-radius: $uni-radius-sm;
			font-size: 28rpx;
			color: $uni-text-color;
		}
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: $uni-spacing-md;
		margin-bottom: $uni-spacing-md;

		.tag-item {
			display: flex;
			align-items: center;
			gap: $uni-spacing-xs;
			padding: $uni-spacing-xs $uni-spacing-md;
			background: #FFF8F0;
			border: 1rpx solid $uni-color-primary;
			border-radius: 32rpx;

			.tag-text {
				font-size: 24rpx;
				color: $uni-color-primary;
			}

			.tag-delete {
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.tag-suggestions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: $uni-spacing-md;

		.suggestion-title {
			font-size: 24rpx;
			color: $uni-text-color-placeholder;
		}

		.suggestion-tag {
			padding: $uni-spacing-xs $uni-spacing-md;
			background: $uni-bg-color;
			border-radius: 32rpx;
			font-size: 24rpx;
			color: $uni-text-color-secondary;
			transition: all 0.2s ease;

			&:active {
				opacity: 0.7;
			}
		}
	}
}

// 位置选择
.location-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;

	.section-title {
		font-size: 28rpx;
		font-weight: 500;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-md;
	}

	.location-display {
		display: flex;
		align-items: center;
		gap: $uni-spacing-sm;
		padding: $uni-spacing-md;
		background: $uni-bg-color;
		border-radius: $uni-radius-sm;
		transition: all 0.2s ease;

		&:active {
			opacity: 0.8;
		}

		.location-text {
			flex: 1;
			font-size: 28rpx;
			color: $uni-text-color-secondary;
		}
	}
}

// 发布须知
.notice-section {
	background: #FFFFFF;
	padding: $uni-spacing-lg;
	margin: 0 $uni-spacing-lg;
	border-radius: $uni-radius-md;

	.notice-title {
		display: flex;
		align-items: center;
		gap: $uni-spacing-xs;
		margin-bottom: $uni-spacing-md;

		text {
			font-size: 28rpx;
			font-weight: 500;
			color: $uni-text-color;
		}
	}

	.notice-content {
		display: flex;
		flex-direction: column;
		gap: $uni-spacing-sm;

		text {
			font-size: 24rpx;
			color: $uni-text-color-placeholder;
			line-height: 1.6;
		}
	}
}
</style>
