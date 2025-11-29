<template>
  <view class="crowdfunding-page">
    <!-- 分段切换 -->
    <view class="segment-tabs">
      <view 
        class="tab-button" 
        :class="{ active: currentTab === 'projects' }"
        @click="switchTab('projects')"
      >
        <text>众筹项目</text>
      </view>
      <view 
        class="tab-button" 
        :class="{ active: currentTab === 'trading' }"
        @click="switchTab('trading')"
      >
        <text>份额交易</text>
      </view>
    </view>

    <!-- 众筹项目列表 -->
    <scroll-view v-if="currentTab === 'projects'" class="tab-content" scroll-y>
      <view class="project-list">
        <view class="project-card" v-for="project in projects" :key="project.id" @click="viewProjectDetail(project)">
          <image class="project-image" :src="project.image" mode="aspectFill"></image>
          <view class="project-info">
            <view class="status-tag" :class="project.status">
              {{ getStatusText(project.status) }}
            </view>
            <text class="project-title">{{ project.title }}</text>
            <text class="project-desc">{{ project.desc }}</text>
            
            <view class="progress-section">
              <view class="progress-bar">
                <view class="progress-inner" :style="{ width: project.progress + '%' }"></view>
              </view>
              <text class="progress-text">{{ project.progress }}%</text>
            </view>
            
            <view class="project-data">
              <view class="data-item">
                <text class="value">¥{{ project.raised }}</text>
                <text class="label">已筹金额</text>
              </view>
              <view class="data-item">
                <text class="value">{{ project.backers }}</text>
                <text class="label">支持人数</text>
              </view>
              <view class="data-item">
                <text class="value">{{ project.annualReturn }}%</text>
                <text class="label">年化收益</text>
              </view>
              <view class="data-item">
                <text class="value">{{ project.daysLeft }}</text>
                <text class="label">剩余天数</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 份额交易市场 -->
    <scroll-view v-if="currentTab === 'trading'" class="tab-content" scroll-y>
      <view class="trading-overview">
        <view class="overview-card">
          <text class="card-label">当前交易量</text>
          <text class="card-value">￥328,000</text>
        </view>
        <view class="overview-card">
          <text class="card-label">今日成交</text>
          <text class="card-value">45笔</text>
        </view>
      </view>

      <view class="trading-list">
        <view class="list-header">
          <text class="header-title">实时交易</text>
          <view class="filter-btn">
            <text>筛选</text>
            <uni-icons type="arrowdown" size="12" color="#666"></uni-icons>
          </view>
        </view>

        <view class="trading-item" v-for="item in tradingItems" :key="item.id">
          <view class="item-header">
            <text class="vehicle-name">{{ item.vehicle }}</text>
            <view class="type-tag" :class="item.type">
              {{ item.type === 'sell' ? '卖出' : '买入' }}
            </view>
          </view>
          <view class="item-content">
            <view class="info-row">
              <text class="label">交易份额:</text>
              <text class="value">{{ item.shares }} 份</text>
            </view>
            <view class="info-row">
              <text class="label">单价:</text>
              <text class="value price">¥{{ item.unitPrice }}</text>
            </view>
            <view class="info-row">
              <text class="label">总价:</text>
              <text class="value total">¥{{ item.totalPrice }}</text>
            </view>
          </view>
          <view class="item-footer">
            <text class="time">{{ item.time }}</text>
            <button class="action-btn" size="mini" @click="handleTrade(item)">
              {{ item.type === 'sell' ? '买入' : '查看' }}
            </button>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentTab = ref('projects');

const projects = ref([
  {
    id: 1,
    title: '道道房车2025新款 - 探索者号',
    desc: '专为家庭出游打造，超大空间，智能家居系统',
    image: 'https://picsum.photos/700/400?random=20',
    status: 'funding',
    progress: 68,
    raised: '1,250,000',
    backers: 356,
    annualReturn: 12.5,
    daysLeft: 15
  },
  {
    id: 2,
    title: '轻量化越野拖挂 - 自由之翼',
    desc: '全铝车身，独立悬挂，轻松应对各种复杂路况',
    image: 'https://picsum.photos/700/400?random=21',
    status: 'funding',
    progress: 32,
    raised: '450,000',
    backers: 128,
    annualReturn: 10.8,
    daysLeft: 28
  },
  {
    id: 3,
    title: '商务接待旗舰 - 领航者',
    desc: '豪华内饰，静音发电机，移动的五星级酒店',
    image: 'https://picsum.photos/700/400?random=22',
    status: 'completed',
    progress: 100,
    raised: '3,000,000',
    backers: 500,
    annualReturn: 15.0,
    daysLeft: 0
  }
]);

const tradingItems = ref([
  {
    id: 1,
    vehicle: '探索者号 2024款',
    type: 'sell',
    shares: 10,
    unitPrice: '10,500',
    totalPrice: '105,000',
    time: '2分钟前'
  },
  {
    id: 2,
    vehicle: '自由之翼 豪华版',
    type: 'buy',
    shares: 5,
    unitPrice: '12,000',
    totalPrice: '60,000',
    time: '5分钟前'
  },
  {
    id: 3,
    vehicle: '领航者 商务版',
    type: 'sell',
    shares: 20,
    unitPrice: '15,800',
    totalPrice: '316,000',
    time: '10分钟前'
  }
]);

const switchTab = (tab: string) => {
  currentTab.value = tab;
};

const getStatusText = (status: string) => {
  const map: any = {
    funding: '众筹中',
    completed: '已成功',
    failed: '已结束'
  };
  return map[status] || status;
};

const viewProjectDetail = (project: any) => {
  uni.navigateTo({
    url: `/pages/crowdfunding/detail?id=${project.id}`
  });
};

const handleTrade = (item: any) => {
  uni.showToast({ title: '交易功能开发中', icon: 'none' });
};
</script>

<style scoped lang="scss">
.crowdfunding-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
}

.segment-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 16rpx 32rpx;
  gap: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.tab-button {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 30rpx;
  color: #666;
  border-radius: 16rpx;
  transition: all 0.3s;

  &.active {
    color: #FF9F29;
    background-color: rgba(255, 159, 41, 0.1);
    font-weight: bold;
  }
}

.tab-content {
  flex: 1;
  padding-bottom: 40rpx;
}

.project-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.project-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.project-image {
  width: 100%;
  height: 320rpx;
}

.project-info {
  padding: 24rpx;
  position: relative;
}

.status-tag {
  position: absolute;
  top: -24rpx;
  right: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #FFFFFF;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

  &.funding {
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  }

  &.completed {
    background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  }

  &.failed {
    background-color: #999;
  }
}

.project-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.project-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background-color: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #FF9F29 0%, #FFB84D 100%);
}

.progress-text {
  font-size: 24rpx;
  color: #FF9F29;
  font-weight: bold;
  width: 80rpx;
  text-align: right;
}

.project-data {
  display: flex;
  justify-content: space-between;
  border-top: 1rpx solid #F5F5F5;
  padding-top: 24rpx;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  .value {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }

  .label {
    font-size: 22rpx;
    color: #999;
  }
}

.trading-overview {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
}

.overview-card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 12rpx;
}

.card-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.trading-list {
  padding: 0 24rpx 24rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 26rpx;
  color: #666;
}

.trading-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.vehicle-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.type-tag {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #FFFFFF;

  &.sell {
    background-color: #F44336;
  }

  &.buy {
    background-color: #4CAF50;
  }
}

.item-content {
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  font-size: 26rpx;

  .label {
    color: #999;
  }

  .value {
    color: #333;

    &.price {
      color: #FF9F29;
      font-weight: bold;
    }

    &.total {
      color: #F44336;
      font-weight: bold;
    }
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #F5F5F5;
}

.time {
  font-size: 22rpx;
  color: #999;
}

.action-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  border-radius: 20rpx;
  padding: 0 32rpx;
}
</style>
