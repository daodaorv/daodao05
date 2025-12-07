<template>
  <view class="help-container">
    <!-- 搜索框 -->
    <view class="search-section">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索帮助内容"
        :show-action="false"
        bg-color="#f5f5f5"
        @search="handleSearch"
        @custom="handleSearch"
      ></u-search>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-access-section">
      <view class="section-title">快捷入口</view>
      <view class="quick-grid">
        <view class="quick-item" @click="navigateToFAQ">
          <view class="quick-icon">❓</view>
          <text class="quick-label">常见问题</text>
        </view>
        <view class="quick-item" @click="navigateToFeedback">
          <view class="quick-icon">💬</view>
          <text class="quick-label">意见反馈</text>
        </view>
        <view class="quick-item" @click="contactService">
          <view class="quick-icon">📞</view>
          <text class="quick-label">联系客服</text>
        </view>
        <view class="quick-item" @click="viewUserGuide">
          <view class="quick-icon">📖</view>
          <text class="quick-label">使用指南</text>
        </view>
      </view>
    </view>

    <!-- 使用指南 -->
    <view class="guide-section">
      <view class="section-title">使用指南</view>
      <view class="guide-list">
        <view
          class="guide-item"
          v-for="guide in guideList"
          :key="guide.id"
          @click="viewGuideDetail(guide)"
        >
          <view class="guide-icon">{{ guide.icon }}</view>
          <view class="guide-info">
            <text class="guide-title">{{ guide.title }}</text>
            <text class="guide-desc">{{ guide.description }}</text>
          </view>
          <text class="guide-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 热门问题 -->
    <view class="hot-section">
      <view class="section-title">热门问题</view>
      <view class="hot-list">
        <view
          class="hot-item"
          v-for="(item, index) in hotQuestions"
          :key="item.id"
          @click="viewQuestionDetail(item)"
        >
          <view class="hot-badge">{{ index + 1 }}</view>
          <text class="hot-question">{{ item.question }}</text>
          <text class="hot-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="contact-section">
      <view class="section-title">联系我们</view>
      <view class="contact-card">
        <view class="contact-item">
          <text class="contact-label">客服热线</text>
          <text class="contact-value" @click="callPhone('400-888-8888')">400-888-8888</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">工作时间</text>
          <text class="contact-value">周一至周日 9:00-21:00</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">客服邮箱</text>
          <text class="contact-value">support@daodao.com</text>
        </view>
      </view>
    </view>

    <!-- 问题详情弹窗 -->
    <u-popup :show="showQuestionDetail" mode="bottom" :round="20" @close="showQuestionDetail = false">
      <view class="question-detail">
        <view class="detail-header">
          <text class="detail-title">{{ currentQuestion.question }}</text>
          <view class="detail-close" @click="showQuestionDetail = false">✕</view>
        </view>
        <view class="detail-content">
          <text class="detail-answer">{{ currentQuestion.answer }}</text>
        </view>
        <view class="detail-footer">
          <button class="detail-button helpful" @click="markHelpful">有帮助</button>
          <button class="detail-button not-helpful" @click="markNotHelpful">没帮助</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getHelpGuides, getHotQuestions, searchHelp } from '@/api/help'

export default {
  data() {
    return {
      searchKeyword: '',
      guideList: [],
      hotQuestions: [],
      showQuestionDetail: false,
      currentQuestion: {
        id: null,
        question: '',
        answer: ''
      }
    }
  },

  onLoad() {
    this.loadGuideList()
    this.loadHotQuestions()
  },

  methods: {
    async loadGuideList() {
      try {
        const res = await getHelpGuides()
        if (res.code === 200) {
          this.guideList = res.data.list
        }
      } catch (error) {
        console.error('加载使用指南失败:', error)
      }
    },

    async loadHotQuestions() {
      try {
        const res = await getHotQuestions()
        if (res.code === 200) {
          this.hotQuestions = res.data.list
        }
      } catch (error) {
        console.error('加载热门问题失败:', error)
      }
    },

    async handleSearch() {
      if (!this.searchKeyword.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '搜索中...' })
        const res = await searchHelp({ keyword: this.searchKeyword })
        uni.hideLoading()

        if (res.code === 200 && res.data.list.length > 0) {
          // 跳转到搜索结果页面
          uni.navigateTo({
            url: `/pages/profile/help-search?keyword=${this.searchKeyword}`
          })
        } else {
          uni.showToast({
            title: '未找到相关内容',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '搜索失败',
          icon: 'none'
        })
      }
    },

    navigateToFAQ() {
      uni.navigateTo({
        url: '/pages/profile/faq'
      })
    },

    navigateToFeedback() {
      uni.navigateTo({
        url: '/pages/profile/feedback'
      })
    },

    contactService() {
      uni.showActionSheet({
        itemList: ['拨打客服电话', '在线客服'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.callPhone('400-888-8888')
          } else if (res.tapIndex === 1) {
            uni.navigateTo({
              url: '/pages/messages/chat?type=service'
            })
          }
        }
      })
    },

    viewUserGuide() {
      uni.showToast({
        title: '查看使用指南',
        icon: 'none'
      })
    },

    viewGuideDetail(guide) {
      uni.navigateTo({
        url: `/pages/profile/guide-detail?id=${guide.id}`
      })
    },

    viewQuestionDetail(question) {
      this.currentQuestion = question
      this.showQuestionDetail = true
    },

    callPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          uni.showToast({
            title: '拨号失败',
            icon: 'none'
          })
        }
      })
    },

    markHelpful() {
      uni.showToast({
        title: '感谢您的反馈',
        icon: 'success'
      })
      this.showQuestionDetail = false
    },

    markNotHelpful() {
      uni.showModal({
        title: '反馈',
        content: '很抱歉没能帮到您，是否需要联系客服？',
        success: (res) => {
          if (res.confirm) {
            this.contactService()
          }
        }
      })
      this.showQuestionDetail = false
    }
  }
}
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 搜索区域 */
.search-section {
  background: #fff;
  padding: 20rpx;
}

/* 快捷入口 */
.quick-access-section {
  margin-top: 20rpx;
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 0 20rpx;
  background: #fff;
  padding: 30rpx 20rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.quick-icon {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.quick-label {
  font-size: 24rpx;
  color: #666;
}

/* 使用指南 */
.guide-section {
  margin-top: 20rpx;
}

.guide-list {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.guide-item:last-child {
  border-bottom: none;
}

.guide-icon {
  width: 80rpx;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 24rpx;
}

.guide-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.guide-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.guide-desc {
  font-size: 24rpx;
  color: #999;
}

.guide-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 热门问题 */
.hot-section {
  margin-top: 20rpx;
}

.hot-list {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-badge {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 24rpx;
}

.hot-question {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.hot-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 联系我们 */
.contact-section {
  margin-top: 20rpx;
}

.contact-card {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-size: 28rpx;
  color: #666;
}

.contact-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 问题详情弹窗 */
.question-detail {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.detail-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.detail-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #999;
}

.detail-content {
  flex: 1;
  padding: 40rpx 30rpx;
  overflow-y: auto;
}

.detail-answer {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.detail-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1px solid #f5f5f5;
}

.detail-button {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}

.detail-button::after {
  border: none;
}

.detail-button.helpful {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.detail-button.not-helpful {
  background: #f5f5f5;
  color: #666;
}
</style>
