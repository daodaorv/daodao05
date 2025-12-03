<template>
  <view class="settings-page">
    <view class="section">
      <uni-list>
        <uni-list-item title="账号与安全" showArrow clickable @click="handleAccountSecurity" />
        <uni-list-item title="隐私政策" showArrow clickable @click="handlePrivacy" />
        <uni-list-item title="用户协议" showArrow clickable @click="handleAgreement" />
        <uni-list-item title="关于我们" showArrow clickable @click="handleAbout" />
        <uni-list-item title="清除缓存" :rightText="cacheSize" showArrow clickable @click="handleClearCache" />
        <uni-list-item title="当前版本" rightText="v1.0.0" />
      </uni-list>
    </view>
    
    <view class="logout-btn-box">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const cacheSize = ref('0KB');

onMounted(() => {
  calculateCacheSize();
});

const calculateCacheSize = () => {
  // 模拟计算缓存大小
  const size = Math.floor(Math.random() * 10) + 1;
  cacheSize.value = `${size}MB`;
};

const handleAccountSecurity = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

const handlePrivacy = () => {
  // 实际应跳转webview
  uni.showToast({ title: '隐私政策', icon: 'none' });
};

const handleAgreement = () => {
  // 实际应跳转webview
  uni.showToast({ title: '用户协议', icon: 'none' });
};

const handleAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/about'
  });
};

const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中' });
        setTimeout(() => {
          uni.hideLoading();
          cacheSize.value = '0KB';
          uni.showToast({ title: '清理完成', icon: 'success' });
        }, 1000);
      }
    }
  });
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    }
  });
};
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-top: 24rpx;
}

.section {
  background-color: #FFFFFF;
  margin-bottom: 24rpx;
}

.logout-btn-box {
  margin: 48rpx 32rpx;
}

.logout-btn {
  background-color: #FFFFFF;
  color: #F44336;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  
  &::after {
    border: none;
  }
}
</style>
