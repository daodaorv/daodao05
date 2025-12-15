<template>
	<view class="article-page">
		<!-- 文章头部 -->
		<view class="article-header">
			<view class="category-tag">
				<text>{{ article.categoryName }}</text>
			</view>
			<text class="article-title">{{ article.title }}</text>
			<view class="article-meta">
				<view class="meta-item">
					<u-icon name="eye" size="14" color="#999999" />
					<text class="meta-text">{{ article.views }}次浏览</text>
				</view>
				<view class="meta-item">
					<u-icon name="thumb-up" size="14" color="#999999" />
					<text class="meta-text">{{ article.helpful }}人觉得有用</text>
				</view>
			</view>
		</view>

		<!-- 文章内容 -->
		<view class="article-content">
			<rich-text :nodes="formattedContent"></rich-text>
		</view>

		<!-- 反馈区域 -->
		<view class="feedback-section">
			<view class="feedback-title">
				<text>这篇文章对您有帮助吗？</text>
			</view>
			<view class="feedback-buttons">
				<button
					class="feedback-btn"
					:class="isHelpful === true ? 'active' : ''"
					@click="markHelpful(true)"
				>
					<u-icon name="thumb-up" size="20" :color="isHelpful === true ? '#FFFFFF' : '#FF9F29'" />
					<text>有帮助</text>
				</button>
				<button
					class="feedback-btn"
					:class="isHelpful === false ? 'active' : ''"
					@click="markHelpful(false)"
				>
					<u-icon name="thumb-down" size="20" :color="isHelpful === false ? '#FFFFFF' : '#999999'" />
					<text>没帮助</text>
				</button>
			</view>
		</view>

		<!-- 相关文章 -->
		<view v-if="relatedArticles.length > 0" class="related-section">
			<view class="section-title">
				<text>相关文章</text>
			</view>
			<view class="related-list">
				<view
					v-for="item in relatedArticles"
					:key="item.id"
					class="related-item"
					@click="viewArticle(item.id)"
				>
					<text class="related-title">{{ item.title }}</text>
					<u-icon name="arrow-right" size="16" color="#CCCCCC" />
				</view>
			</view>
		</view>

		<!-- 联系客服 -->
		<view class="contact-section">
			<view class="contact-card">
				<view class="contact-content">
					<text class="contact-title">还有疑问？</text>
					<text class="contact-desc">联系客服获取更多帮助</text>
				</view>
				<button class="contact-btn" @click="contactService">
					联系客服
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockGetHelpArticleDetail, mockGetHelpArticles, type HelpArticle } from '@/api/help'

// 文章ID
const articleId = ref('')

// 文章详情
const article = ref<HelpArticle>({
	id: '',
	categoryId: '',
	categoryName: '',
	title: '',
	summary: '',
	content: '',
	views: 0,
	helpful: 0,
	isHot: false,
	createdAt: ''
})

// 是否有帮助
const isHelpful = ref<boolean | null>(null)

// 相关文章
const relatedArticles = ref<HelpArticle[]>([])

// 格式化内容（将Markdown转换为富文本）
const formattedContent = computed(() => {
	let content = article.value.content

	// 简单的Markdown转换（实际项目中应使用专业的Markdown解析库）
	// 标题
	content = content.replace(/^# (.+)$/gm, '<h1 style="font-size: 36rpx; font-weight: bold; color: #333333; margin: 32rpx 0 24rpx;">$1</h1>')
	content = content.replace(/^## (.+)$/gm, '<h2 style="font-size: 32rpx; font-weight: bold; color: #333333; margin: 24rpx 0 16rpx;">$1</h2>')
	content = content.replace(/^### (.+)$/gm, '<h3 style="font-size: 28rpx; font-weight: bold; color: #333333; margin: 20rpx 0 12rpx;">$1</h3>')

	// 列表
	content = content.replace(/^- (.+)$/gm, '<li style="font-size: 28rpx; color: #666666; line-height: 1.8; margin: 8rpx 0;">• $1</li>')
	content = content.replace(/^\d+\. (.+)$/gm, '<li style="font-size: 28rpx; color: #666666; line-height: 1.8; margin: 8rpx 0;">$1</li>')

	// 粗体
	content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold; color: #333333;">$1</strong>')

	// 段落
	content = content.replace(/\n\n/g, '</p><p style="font-size: 28rpx; color: #666666; line-height: 1.8; margin: 16rpx 0;">')
	content = '<p style="font-size: 28rpx; color: #666666; line-height: 1.8; margin: 16rpx 0;">' + content + '</p>'

	return content
})

// 标记有帮助
const markHelpful = (helpful: boolean) => {
	isHelpful.value = helpful

	// TODO: 调用API标记文章有帮助
	uni.showToast({
		title: helpful ? '感谢您的反馈' : '我们会继续改进',
		icon: 'success'
	})
}

// 查看文章
const viewArticle = (id: string) => {
	// 重新加载文章
	articleId.value = id
	loadArticle()

	// 滚动到顶部
	uni.pageScrollTo({
		scrollTop: 0,
		duration: 300
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

// 加载文章详情
const loadArticle = async () => {
	try {
		uni.showLoading({ title: '加载中...' })

		// 使用Mock数据
		const detail = await mockGetHelpArticleDetail(articleId.value)
		article.value = detail

		// 加载相关文章
		loadRelatedArticles(detail.categoryId)

		uni.hideLoading()
	} catch (error) {
		console.error('加载文章失败:', error)
		uni.hideLoading()
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

// 加载相关文章
const loadRelatedArticles = async (categoryId: string) => {
	try {
		const result = await mockGetHelpArticles({ categoryId, page: 1, pageSize: 3 })
		// 排除当前文章
		relatedArticles.value = result.list.filter(a => a.id !== articleId.value)
	} catch (error) {
		console.error('加载相关文章失败:', error)
	}
}

onMounted(() => {
	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as any
	const options = currentPage.options || {}

	articleId.value = options.id || 'article_001'
	loadArticle()
})
</script>

<style lang="scss" scoped>
.article-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 32rpx;
}

// 文章头部
.article-header {
	background: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 16rpx;

	.category-tag {
		display: inline-block;
		padding: 4rpx 16rpx;
		background: #E8F5E9;
		color: #4CAF50;
		font-size: 20rpx;
		border-radius: 8rpx;
		margin-bottom: 16rpx;
	}

	.article-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		line-height: 1.5;
		margin-bottom: 16rpx;
	}

	.article-meta {
		display: flex;
		gap: 32rpx;

		.meta-item {
			display: flex;
			align-items: center;
			gap: 8rpx;

			.meta-text {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
}

// 文章内容
.article-content {
	background: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 16rpx;
	line-height: 1.8;

	:deep(h1) {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		margin: 32rpx 0 24rpx;
	}

	:deep(h2) {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		margin: 24rpx 0 16rpx;
	}

	:deep(h3) {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin: 20rpx 0 12rpx;
	}

	:deep(p) {
		font-size: 28rpx;
		color: #666666;
		line-height: 1.8;
		margin: 16rpx 0;
	}

	:deep(li) {
		font-size: 28rpx;
		color: #666666;
		line-height: 1.8;
		margin: 8rpx 0;
	}

	:deep(strong) {
		font-weight: bold;
		color: #333333;
	}
}

// 反馈区域
.feedback-section {
	background: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 16rpx;

	.feedback-title {
		text-align: center;
		margin-bottom: 24rpx;

		text {
			font-size: 28rpx;
			color: #333333;
		}
	}

	.feedback-buttons {
		display: flex;
		justify-content: center;
		gap: 24rpx;

		.feedback-btn {
			display: flex;
			align-items: center;
			gap: 12rpx;
			padding: 16rpx 32rpx;
			background: #F5F5F5;
			border: 2rpx solid transparent;
			border-radius: 48rpx;
			font-size: 26rpx;
			color: #666666;
			transition: all 0.3s;

			&.active {
				background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
				border-color: #FF9F29;
				color: #FFFFFF;
			}
		}
	}
}

// 相关文章
.related-section {
	background: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 16rpx;

	.section-title {
		margin-bottom: 24rpx;

		text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
	}

	.related-list {
		.related-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 0;
			border-bottom: 1rpx solid #F0F0F0;

			&:last-child {
				border-bottom: none;
			}

			.related-title {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
			}
		}
	}
}

// 联系客服
.contact-section {
	margin: 0 32rpx;

	.contact-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		background: linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%);
		border-radius: 16rpx;

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
}
</style>
