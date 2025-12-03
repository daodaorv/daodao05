<template>
	<view class="help-page">
		<!-- 搜索框 -->
		<view class="search-section">
			<view class="search-box">
				<u-icon name="search" size="20" color="#999999" />
				<input
					v-model="searchKeyword"
					class="search-input"
					placeholder="搜索帮助内容"
					confirm-name="search"
					@confirm="handleSearch"
				/>
				<view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
					<u-icon name="close" size="16" color="#999999" />
				</view>
			</view>
		</view>

		<!-- 热门问题 -->
		<view class="hot-section">
			<view class="section-header">
				<text class="section-title">热门问题</text>
				<u-icon name="fire" size="20" color="#FF9F29" />
			</view>
			<view class="hot-list">
				<view
					v-for="article in hotArticles"
					:key="article.id"
					class="hot-item"
					@click="viewArticle(article.id)"
				>
					<view class="hot-icon">
						<u-icon name="help" size="20" color="#FF9F29" />
					</view>
					<view class="hot-content">
						<text class="hot-title">{{ article.title }}</text>
						<text class="hot-summary">{{ article.summary }}</text>
					</view>
					<view class="hot-arrow">
						<u-icon name="right" size="16" color="#CCCCCC" />
					</view>
				</view>
			</view>
		</view>

		<!-- 帮助分类 -->
		<view class="category-section">
			<view class="section-header">
				<text class="section-title">问题分类</text>
			</view>
			<view class="category-grid">
				<view
					v-for="category in categories"
					:key="category.id"
					class="category-item"
					@click="viewCategory(category.id)"
				>
					<view class="category-icon">
						<u-icon :name="getCategoryIcon(category.icon)" size="32" color="#FF9F29" />
					</view>
					<text class="category-name">{{ category.name }}</text>
					<text class="category-count">{{ category.articleCount }}篇</text>
				</view>
			</view>
		</view>

		<!-- 最近文章 -->
		<view class="article-section">
			<view class="section-header">
				<text class="section-title">最近更新</text>
			</view>
			<view class="article-list">
				<view
					v-for="article in recentArticles"
					:key="article.id"
					class="article-item"
					@click="viewArticle(article.id)"
				>
					<view class="article-header">
						<text class="article-category">{{ article.categoryName }}</text>
						<view class="article-stats">
							<u-icon name="eye" size="14" color="#999999" />
							<text class="stat-text">{{ article.views }}</text>
						</view>
					</view>
					<text class="article-title">{{ article.title }}</text>
					<text class="article-summary">{{ article.summary }}</text>
				</view>
			</view>
		</view>

		<!-- 联系客服 -->
		<view class="contact-section">
			<view class="contact-card">
				<view class="contact-icon">
					<u-icon name="chat-fill" size="40" color="#FF9F29" />
				</view>
				<view class="contact-content">
					<text class="contact-title">没有找到答案？</text>
					<text class="contact-desc">联系我们的客服团队获取帮助</text>
				</view>
				<button class="contact-btn" @click="contactService">
					联系客服
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockGetHelpCategories, mockGetHelpArticles, mockGetHotArticles, type HelpCategory, type HelpArticle } from '@/api/help'

// 搜索关键词
const searchKeyword = ref('')

// 热门问题
const hotArticles = ref<HelpArticle[]>([])

// 帮助分类
const categories = ref<HelpCategory[]>([])

// 最近文章
const recentArticles = ref<HelpArticle[]>([])

// 获取分类图标
const getCategoryIcon = (icon: string) => {
	const iconMap: Record<string, string> = {
		car: 'car',
		home: 'home',
		map: 'map',
		wallet: 'wallet',
		vip: 'vip-filled',
		help: 'help'
	}
	return iconMap[icon] || 'help'
}

// 处理搜索
const handleSearch = () => {
	if (!searchKeyword.value.trim()) {
		uni.showToast({
			title: '请输入搜索关键词',
			icon: 'none'
		})
		return
	}

	// 跳转到搜索结果页（这里简化处理，直接显示提示）
	uni.showToast({
		title: `搜索: ${searchKeyword.value}`,
		icon: 'none'
	})
}

// 清除搜索
const clearSearch = () => {
	searchKeyword.value = ''
}

// 查看文章
const viewArticle = (id: string) => {
	uni.navigateTo({
		url: `/pages/help/article?id=${id}`
	})
}

// 查看分类
const viewCategory = (categoryId: string) => {
	// 这里可以跳转到分类文章列表页，简化处理直接显示提示
	uni.showToast({
		title: '查看分类文章',
		icon: 'none'
	})
}

// 联系客服
const contactService = () => {
	uni.showModal({
		title: '联系客服',
		content: '客服电话：400-123-4567\n工作时间：9:00-18:00',
		showCancel: false
	})
}

// 加载热门问题
const loadHotArticles = async () => {
	try {
		const articles = await mockGetHotArticles()
		hotArticles.value = articles
	} catch (error) {
		console.error('加载热门问题失败:', error)
	}
}

// 加载帮助分类
const loadCategories = async () => {
	try {
		const cats = await mockGetHelpCategories()
		categories.value = cats
	} catch (error) {
		console.error('加载帮助分类失败:', error)
	}
}

// 加载最近文章
const loadRecentArticles = async () => {
	try {
		const result = await mockGetHelpArticles({ page: 1, pageSize: 5 })
		recentArticles.value = result.list
	} catch (error) {
		console.error('加载最近文章失败:', error)
	}
}

onMounted(() => {
	loadHotArticles()
	loadCategories()
	loadRecentArticles()
})
</script>

<style lang="scss" scoped>
.help-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 32rpx;
}

// 搜索区域
.search-section {
	padding: 32rpx;
	background: #FFFFFF;

	.search-box {
		display: flex;
		align-items: center;
		padding: 20rpx 24rpx;
		background: #F5F5F5;
		border-radius: 48rpx;

		.search-input {
			flex: 1;
			margin: 0 16rpx;
			font-size: 28rpx;
			color: #333333;
		}

		.clear-btn {
			width: 32rpx;
			height: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}

// 通用区块样式
.hot-section,
.category-section,
.article-section,
.contact-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
}

// 热门问题
.hot-list {
	.hot-item {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		.hot-icon {
			width: 56rpx;
			height: 56rpx;
			background: #FFF8F0;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;
		}

		.hot-content {
			flex: 1;

			.hot-title {
				display: block;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-bottom: 8rpx;
			}

			.hot-summary {
				display: block;
				font-size: 24rpx;
				color: #999999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.hot-arrow {
			margin-left: 16rpx;
		}
	}
}

// 帮助分类
.category-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;

	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32rpx 16rpx;
		background: #F8F8F8;
		border-radius: 16rpx;
		transition: all 0.3s;

		&:active {
			background: #F0F0F0;
		}

		.category-icon {
			width: 80rpx;
			height: 80rpx;
			background: #FFF8F0;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16rpx;
		}

		.category-name {
			font-size: 26rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 8rpx;
		}

		.category-count {
			font-size: 20rpx;
			color: #999999;
		}
	}
}

// 最近文章
.article-list {
	.article-item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		.article-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12rpx;

			.article-category {
				padding: 4rpx 16rpx;
				background: #E8F5E9;
				color: #4CAF50;
				font-size: 20rpx;
				border-radius: 8rpx;
			}

			.article-stats {
				display: flex;
				align-items: center;
				gap: 8rpx;

				.stat-text {
					font-size: 20rpx;
					color: #999999;
				}
			}
		}

		.article-title {
			display: block;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 8rpx;
		}

		.article-summary {
			display: block;
			font-size: 24rpx;
			color: #999999;
			line-height: 1.5;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
}

// 联系客服
.contact-card {
	display: flex;
	align-items: center;
	padding: 32rpx;
	background: linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%);
	border-radius: 16rpx;

	.contact-icon {
		width: 80rpx;
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.contact-content {
		flex: 1;

		.contact-title {
			display: block;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 8rpx;
		}

		.contact-desc {
			display: block;
			font-size: 24rpx;
			color: #999999;
		}
	}

	.contact-btn {
		padding: 16rpx 32rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		border-radius: 48rpx;
		font-size: 26rpx;
		border: none;
	}
}
</style>
