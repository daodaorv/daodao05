<template>
  <view class="faq-container">
    <!-- 搜索框 -->
    <view class="search-section">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索常见问题"
        :show-action="false"
        bg-color="#f5f5f5"
        @search="handleSearch"
        @custom="handleSearch"
      ></u-search>
    </view>

    <!-- 分类标签 -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll">
        <view class="category-list">
          <view
            class="category-item"
            :class="{ active: currentCategory === category.id }"
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
          >
            <text class="category-name">{{ category.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 问题列表 -->
    <view class="faq-list">
      <view
        class="faq-item"
        v-for="item in filteredFaqList"
        :key="item.id"
      >
        <view class="faq-question" @click="toggleAnswer(item.id)">
          <text class="question-text">{{ item.question }}</text>
          <text class="question-icon">{{ expandedIds.includes(item.id) ? '−' : '+' }}</text>
        </view>
        <view class="faq-answer" v-if="expandedIds.includes(item.id)">
          <text class="answer-text">{{ item.answer }}</text>
          <view class="answer-actions">
            <view class="action-button" @click="markHelpful(item.id)">
              <text class="action-icon">👍</text>
              <text class="action-text">有帮助 ({{ item.helpfulCount }})</text>
            </view>
            <view class="action-button" @click="markNotHelpful(item.id)">
              <text class="action-icon">👎</text>
              <text class="action-text">没帮助</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredFaqList.length === 0">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">未找到相关问题</text>
        <button class="empty-button" @click="navigateToFeedback">提交问题</button>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="footer-tip">
      <text class="tip-text">没有找到您想要的答案？</text>
      <text class="tip-link" @click="navigateToFeedback">联系客服</text>
    </view>
  </view>
</template>

<script>
import { getFaqList, getFaqCategories, markFaqHelpful } from '@/api/help'

export default {
  data() {
    return {
      searchKeyword: '',
      currentCategory: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'order', name: '订单相关' },
        { id: 'vehicle', name: '车辆管理' },
        { id: 'hosting', name: '托管服务' },
        { id: 'payment', name: '支付问题' },
        { id: 'account', name: '账号安全' },
        { id: 'other', name: '其他问题' }
      ],
      faqList: [],
      expandedIds: []
    }
  },

  computed: {
    filteredFaqList() {
      let list = this.faqList

      // 按分类筛选
      if (this.currentCategory !== 'all') {
        list = list.filter(item => item.category === this.currentCategory)
      }

      // 按关键词搜索
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase()
        list = list.filter(item =>
          item.question.toLowerCase().includes(keyword) ||
          item.answer.toLowerCase().includes(keyword)
        )
      }

      return list
    }
  },

  onLoad() {
    this.loadFaqList()
  },

  methods: {
    async loadFaqList() {
      try {
        const res = await getFaqList()
        if (res.code === 200) {
          this.faqList = res.data.list
        }
      } catch (error) {
        console.error('加载常见问题失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    selectCategory(categoryId) {
      this.currentCategory = categoryId
      this.expandedIds = []
    },

    toggleAnswer(id) {
      const index = this.expandedIds.indexOf(id)
      if (index > -1) {
        this.expandedIds.splice(index, 1)
      } else {
        this.expandedIds.push(id)
      }
    },

    handleSearch() {
      // 搜索逻辑已在 computed 中实现
      if (this.filteredFaqList.length === 0) {
        uni.showToast({
          title: '未找到相关问题',
          icon: 'none'
        })
      }
    },

    async markHelpful(id) {
      try {
        const res = await markFaqHelpful({ faqId: id, helpful: true })
        if (res.code === 200) {
          // 更新本地数据
          const item = this.faqList.find(item => item.id === id)
          if (item) {
            item.helpfulCount = (item.helpfulCount || 0) + 1
          }

          uni.showToast({
            title: '感谢您的反馈',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('标记失败:', error)
      }
    },

    markNotHelpful(id) {
      uni.showModal({
        title: '反馈',
        content: '很抱歉没能帮到您，是否需要联系客服？',
        success: (res) => {
          if (res.confirm) {
            this.navigateToFeedback()
          }
        }
      })
    },

    navigateToFeedback() {
      uni.navigateTo({
        url: '/pages/profile/feedback'
      })
    }
  }
}
</script>

<style scoped>
.faq-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 搜索区域 */
.search-section {
  background: #fff;
  padding: 20rpx;
}

/* 分类标签 */
.category-section {
  background: #fff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  gap: 20rpx;
  padding: 0 20rpx;
}

.category-item {
  padding: 12rpx 32rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  white-space: nowrap;
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-name {
  font-size: 26rpx;
  color: #666;
}

.category-item.active .category-name {
  color: #fff;
}

/* 问题列表 */
.faq-list {
  padding: 0 20rpx;
}

.faq-item {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 30rpx;
  cursor: pointer;
}

.question-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.6;
}

.question-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #667eea;
  font-weight: bold;
}

.faq-answer {
  padding: 0 30rpx 32rpx;
  border-top: 1px solid #f5f5f5;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.answer-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  padding: 20rpx 0;
}

.answer-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}

.action-icon {
  font-size: 32rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  background: #fff;
  border-radius: 12rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-button {
  width: 300rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.empty-button::after {
  border: none;
}

/* 底部提示 */
.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 40rpx 20rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #999;
}

.tip-link {
  font-size: 26rpx;
  color: #667eea;
  text-decoration: underline;
}
</style>
