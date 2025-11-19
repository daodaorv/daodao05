<template>
  <view class="profile-page">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view v-if="isLoggedIn" class="user-info">
        <image class="avatar" :src="userInfo.avatar_url || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-details">
          <text class="username">{{ userInfo.username || userInfo.phone }}</text>
          <text class="phone">{{ userInfo.phone }}</text>
        </view>
      </view>
      <view v-else class="login-prompt" @tap="goToLogin">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill"></image>
        <view class="login-text">
          <text class="login-title">点击登录</text>
          <text class="login-desc">登录后享受更多服务</text>
        </view>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @tap="handleMenuClick('orders')">
          <uni-icons type="list" size="22" color="#3cc51f"></uni-icons>
          <text class="menu-text">我的订单</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @tap="handleMenuClick('favorites')">
          <uni-icons type="heart" size="22" color="#3cc51f"></uni-icons>
          <text class="menu-text">我的收藏</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @tap="handleMenuClick('coupons')">
          <uni-icons type="gift" size="22" color="#3cc51f"></uni-icons>
          <text class="menu-text">优惠券</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="handleMenuClick('settings')">
          <uni-icons type="gear" size="22" color="#3cc51f"></uni-icons>
          <text class="menu-text">设置</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @tap="handleMenuClick('help')">
          <uni-icons type="help" size="22" color="#3cc51f"></uni-icons>
          <text class="menu-text">帮助中心</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view v-if="isLoggedIn" class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isLoggedIn = ref(false);
const userInfo = ref({});

onMounted(() => {
  checkLoginStatus();
});

const checkLoginStatus = () => {
  isLoggedIn.value = userStore.isLoggedIn;
  if (isLoggedIn.value) {
    userInfo.value = userStore.userInfo;
  }
};

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};

const handleMenuClick = (type) => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      goToLogin();
    }, 1500);
    return;
  }
  
  uni.showToast({
    title: `${type} 功能开发中`,
    icon: 'none'
  });
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        isLoggedIn.value = false;
        userInfo.value = {};
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-info-section {
  background: linear-gradient(135deg, #3cc51f 0%, #2ea516 100%);
  padding: 40px 20px 30px;
  
  .user-info, .login-prompt {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #fff;
    }
    
    .user-details, .login-text {
      flex: 1;
      margin-left: 15px;
      
      .username, .login-title {
        display: block;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 5px;
      }
      
      .phone, .login-desc {
        display: block;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.menu-section {
  margin-top: 10px;

  .menu-group {
    background-color: #fff;
    margin-bottom: 10px;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .menu-text {
        flex: 1;
        margin-left: 12px;
        font-size: 15px;
        color: #333;
      }
    }
  }
}

.logout-section {
  margin: 20px;

  .logout-btn {
    background-color: #fff;
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
    border-radius: 8px;
    font-size: 16px;
  }
}
</style>

