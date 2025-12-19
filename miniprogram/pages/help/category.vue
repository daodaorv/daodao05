<template>
  <view class="category-page">
    <view class="category-header">
      <text class="category-title">{{ categoryName }}</text>
      <text class="category-count">共 {{ total }} 篇问题</text>
    </view>

    <view v-if="!articleList.length && !loading" class="empty-state">
      <u-icon name="info-circle" color="#CCCCCC" size="36"></u-icon>
      <text>该分类暂时还没有帮助文档</text>
    </view>

    <view class="article-list" v-else>
      <view
        v-for="article in articleList"
        :key="article.id"
        class="article-item"
        @tap="goDetail(article.id)"
      >
        <text class="article-title">{{ article.title }}</text>
        <text class="article-summary">{{ article.summary }}</text>
        <view class="article-meta">
          <view class="meta-left">
            <u-icon name="eye" size="14" color="#999"></u-icon>
            <text>{{ article.views }}</text>
          </view>
          <text class="meta-time">{{ formatDate(article.createdAt) }}</text>
        </view>
      </view>
      <view v-if="loading" class="loading-text">加载中...</view>
      <view v-else-if="finished" class="loading-text">已经到底啦</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { mockGetHelpArticles, type HelpArticle } from '@/api/help'

const categoryId = ref('')
const categoryName = ref('帮助分类')
const articleList = ref<HelpArticle[]>([])
const loading = ref(false)
const finished = ref(false)
const total = ref(0)

const pager = ref({ page: 1, pageSize: 10 })

const loadArticles = async () => {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await mockGetHelpArticles({
      categoryId: categoryId.value,
      page: pager.value.page,
      pageSize: pager.value.pageSize
    })
    total.value = res.total
    if (pager.value.page === 1) {
      articleList.value = res.list
    } else {
      articleList.value = [...articleList.value, ...res.list]
    }
    finished.value = !res.hasMore
    if (res.hasMore) {
      pager.value.page += 1
    }
  } catch (error) {
    logger.error('加载分类文章失败', error)
    uni.showToast({ title: '加载失败，请稍后再试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/help/article?id=${id}` })
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

onLoad((options: Record<string, any>) => {
  if (options?.id) {
    categoryId.value = options.id
  }
  if (options?.name) {
    categoryName.value = decodeURIComponent(options.name)
    uni.setNavigationBarTitle({ title: categoryName.value })
  }
  if (!categoryId.value) {
    uni.showToast({ title: '缺少分类信息', icon: 'none' })
    return
  }
  loadArticles()
})

onReachBottom(() => {
  loadArticles()
})
</script>

<style scoped lang="scss">
.category-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 32rpx;
}

.category-header {
  padding: 32rpx;
  background-color: #ffffff;
  margin: 0 32rpx 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

  .category-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
  }

  .category-count {
    display: block;
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #999999;
  }
}

.article-list {
  margin: 0 32rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 0 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.article-item {
  padding: 32rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .article-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8rpx;
  }

  .article-summary {
    font-size: 26rpx;
    color: #999999;
    line-height: 1.6;
  }

  .article-meta {
    margin-top: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22rpx;
    color: #b0b0b0;

    .meta-left {
      display: flex;
      align-items: center;
      gap: 6rpx;
    }
  }
}

.loading-text {
  text-align: center;
  padding: 24rpx 0 32rpx;
  font-size: 24rpx;
  color: #999999;
}

.empty-state {
  margin: 160rpx 32rpx;
  padding: 60rpx 32rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  color: #999999;
  font-size: 26rpx;
}
</style>
