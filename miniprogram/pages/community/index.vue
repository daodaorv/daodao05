<template>
  <view class="community-page">
    <!-- 业务推荐入口 -->
    <view class="business-section">
      <view class="business-card" @click="navigateTo('/pages/campsite/list')">
        <image class="card-bg" src="https://picsum.photos/350/180?random=1" mode="aspectFill"></image>
        <view class="card-overlay">
          <text class="card-title">营地预订</text>
          <text class="card-subtitle">房车旅行好住处</text>
        </view>
      </view>
      <view class="business-card" @click="navigateTo('/pages/tour/list')">
        <image class="card-bg" src="https://picsum.photos/350/180?random=2" mode="aspectFill"></image>
        <view class="card-overlay">
          <text class="card-title">房车旅游</text>
          <text class="card-subtitle">精选旅游路线</text>
        </view>
      </view>
    </view>

    <!-- 内容分类Tab -->
    <view class="category-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentCategory === item.id }" 
        v-for="item in categories" 
        :key="item.id"
        @click="switchCategory(item.id)"
      >
        {{ item.name }}
      </view>
    </view>

    <!-- 内容列表(瀑布流) -->
    <view class="content-list">
      <view class="content-column">
        <view class="content-item" v-for="post in leftPosts" :key="post.id" @click="viewDetail(post)">
          <image class="post-image" :src="post.image" mode="widthFix"></image>
          <view class="post-info">
            <text class="post-title">{{ post.title }}</text>
            <view class="post-meta">
              <view class="author-info">
                <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
                <text class="nickname">{{ post.nickname }}</text>
              </view>
              <view class="interactions">
                <view class="like-box">
                  <uni-icons type="heart" size="14" color="#999"></uni-icons>
                  <text>{{ post.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="content-column">
        <view class="content-item" v-for="post in rightPosts" :key="post.id" @click="viewDetail(post)">
          <image class="post-image" :src="post.image" mode="widthFix"></image>
          <view class="post-info">
            <text class="post-title">{{ post.title }}</text>
            <view class="post-meta">
              <view class="author-info">
                <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
                <text class="nickname">{{ post.nickname }}</text>
              </view>
              <view class="interactions">
                <view class="like-box">
                  <uni-icons type="heart" size="14" color="#999"></uni-icons>
                  <text>{{ post.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="float-btn" @click="handlePublish">
      <uni-icons type="plus-filled" size="28" color="#FFFFFF"></uni-icons>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 内容分类
const categories = ref([
  { id: 'all', name: '推荐' },
  { id: 'guide', name: '攻略' },
  { id: 'experience', name: '体验' },
  { id: 'activity', name: '活动' },
  { id: 'qa', name: '问答' }
]);

const currentCategory = ref('all');

// Mock数据
const posts = ref([
  { id: 1, title: '318国道房车自驾攻略', image: 'https://picsum.photos/300/400?random=11', avatar: 'https://picsum.photos/50/50?random=101', nickname: '旅行达人', likes: 128, category: 'guide' },
  { id: 2, title: '房车露营装备清单', image: 'https://picsum.photos/300/300?random=12', avatar: 'https://picsum.photos/50/50?random=102', nickname: '露营爱好者', likes: 85, category: 'guide' },
  { id: 3, title: '我的第一次房车之旅', image: 'https://picsum.photos/300/500?random=13', avatar: 'https://picsum.photos/50/50?random=103', nickname: '小白车友', likes: 256, category: 'experience' },
  { id: 4, title: '带娃房车游攻略', image: 'https://picsum.photos/300/350?random=14', avatar: 'https://picsum.photos/50/50?random=104', nickname: '亲子旅行', likes: 99, category: 'experience' },
  { id: 5, title: '房车自驾西藏准备', image: 'https://picsum.photos/300/450?random=15', avatar: 'https://picsum.photos/50/50?random=105', nickname: '在路上', likes: 342, category: 'guide' },
  { id: 6, title: '房车美食分享', image: 'https://picsum.photos/300/320?random=16', avatar: 'https://picsum.photos/50/50?random=106', nickname: '美食家', likes: 67, category: 'experience' }
]);

const filteredPosts = computed(() => {
  if (currentCategory.value === 'all') {
    return posts.value;
  }
  return posts.value.filter(p => p.category === currentCategory.value);
});

const leftPosts = computed(() => {
  return filteredPosts.value.filter((_, index) => index % 2 === 0);
});

const rightPosts = computed(() => {
  return filteredPosts.value.filter((_, index) => index % 2 === 1);
});

const switchCategory = (id: string) => {
  currentCategory.value = id;
};

const navigateTo = (url: string) => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

const viewDetail = (post: any) => {
  uni.showToast({ title: `查看: ${post.title}`, icon: 'none' });
};

const handlePublish = () => {
  uni.showToast({ title: '发布功能开发中', icon: 'none' });
};
</script>

<style scoped lang="scss">
.community-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 100rpx;
}

.business-section {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
}

.business-card {
  flex: 1;
  height: 180rpx;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
}

.card-bg {
  width: 100%;
  height: 100%;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  padding: 32rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 4rpx;
}

.card-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
}

.category-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 16rpx 24rpx;
  gap: 32rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  font-size: 28rpx;
  color: #666;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s;

  &.active {
    color: #FF9F29;
    background-color: rgba(255, 159, 41, 0.1);
    font-weight: bold;
  }
}

.content-list {
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

.content-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.content-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.post-image {
  width: 100%;
  display: block;
}

.post-info {
  padding: 16rpx;
}

.post-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.avatar {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
}

.nickname {
  font-size: 22rpx;
  color: #666;
}

.interactions {
  display: flex;
  gap: 16rpx;
}

.like-box {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: #999;
}

.float-btn {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 16rpx rgba(255, 159, 41, 0.4);
}
</style>
