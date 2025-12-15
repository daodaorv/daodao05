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

		<!-- 客服服务 -->
		<view class="service-section">
			<view class="section-header service-header">
				<text class="section-title">客服服务</text>
				<text class="service-hours">每日 09:00 - 21:00</text>
			</view>
			<view class="service-grid">
				<view
					v-for="item in serviceEntries"
					:key="item.id"
					class="service-item"
					@tap="handleServiceAction(item.action)"
				>
					<view class="service-icon">
						<u-icon :name="item.icon" size="28" color="#FF9F29" />
					</view>
					<view class="service-info">
						<text class="service-title">{{ item.title }}</text>
						<text class="service-desc">{{ item.desc }}</text>
					</view>
					<u-icon name="arrow-right" size="16" color="#CCCCCC" />
				</view>
			</view>
		</view>

		<!-- 热门问题 -->
		<view class="hot-section" id="faq-hot">
			<view class="section-header">
				<text class="section-title">热门问题</text>
				<u-icon name="star-fill" size="20" color="#FF9F29" />
			</view>
			<view class="hot-list">
				<view
					v-for="article in hotArticles"
					:key="article.id"
					class="hot-item"
					@click="viewArticle(article.id)"
				>
					<view class="hot-icon">
						<u-icon name="question-circle" size="20" color="#FF9F29" />
					</view>
					<view class="hot-content">
						<text class="hot-title">{{ article.title }}</text>
						<text class="hot-summary">{{ article.summary }}</text>
					</view>
					<view class="hot-arrow">
						<u-icon name="arrow-right" size="16" color="#CCCCCC" />
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
					@click="viewCategory(category.id, category.name)"
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
					<text class="contact-desc">客服电话：{{ servicePhone }} ｜ 人工 09:00-21:00</text>
				</view>
				<button class="contact-btn" @click="contactService">
					立即致电
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockGetHelpCategories, mockGetHelpArticles, mockGetHotArticles, type HelpCategory, type HelpArticle } from '@/api/help'

type ServiceAction = 'chat' | 'phone' | 'faq'

interface ServiceEntry {
	id: string
	title: string
	desc: string
	icon: string
	action: ServiceAction
}

// 搜索关键词
const searchKeyword = ref('')

// 客服服务入口
const servicePhone = '400-123-4567'
const serviceEntries = ref<ServiceEntry[]>([
	{
		id: 'chat',
		title: '在线客服',
		desc: '智能助手 7×24 小时响应',
		icon: 'chat',
		action: 'chat'
	},
	{
		id: 'phone',
		title: '电话客服',
		desc: `${servicePhone} ｜ 人工 09:00-21:00`,
		icon: 'phone',
		action: 'phone'
	},
	{
		id: 'faq',
		title: '常见问题',
		desc: '查看政策与使用指南',
		icon: 'question-circle',
		action: 'faq'
	}
])

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
		rmb: 'rmb',
		level: 'level',
		'question-circle': 'question-circle'
	}
	return iconMap[icon] || icon || 'question-circle'
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
const viewCategory = (categoryId: string, categoryName: string) => {
	uni.navigateTo({
		url: `/pages/help/category?id=${categoryId}&name=${encodeURIComponent(categoryName)}`
	})
}

const handleServiceAction = (action: ServiceAction) => {
	if (action === 'phone') {
		uni.makePhoneCall({ phoneNumber: servicePhone })
		return
	}
	if (action === 'chat') {
		uni.showToast({
			title: '正在接入在线客服，请稍候',
			icon: 'none'
		})
		return
	}
	uni.pageScrollTo({
		selector: '#faq-hot',
		duration: 250,
		fail: () => {
			uni.showToast({
				title: '请下拉查看常见问题',
				icon: 'none'
			})
		}
	})
}

// 联系客服
const contactService = () => {
	handleServiceAction('phone')
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
.service-section,
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

.service-header {
	align-items: center;

	.service-hours {
		font-size: 24rpx;
		color: #999999;
	}
}

.service-grid {
	display: flex;
	flex-direction: column;

	.service-item {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F5F5F5;

		&:last-child {
			border-bottom: none;
		}

		.service-icon {
			width: 72rpx;
			height: 72rpx;
			border-radius: 16rpx;
			background: #FFF8F0;

			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;
		}

		.service-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;

			.service-title {
				font-size: 30rpx;
				color: #333333;
				font-weight: 500;
			}

			.service-desc {
				font-size: 24rpx;
				color: #999999;
			}
		}
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
