<template>
  <view class="about-page">
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">叨叨房车</text>
      <text class="version">Version 1.0.0</text>
    </view>
    
    <view class="info-section">
      <view class="info-item">
        <text class="label">官方网站</text>
        <text class="value">www.daodao.com</text>
      </view>
      <view class="info-item">
        <text class="label">客服电话</text>
        <text class="value">400-123-4567</text>
      </view>
      <view class="info-item">
        <text class="label">微信公众号</text>
        <text class="value">叨叨房车</text>
      </view>
    </view>
    
    <view class="copyright">
      <text>Copyright © 2025 叨叨房车 All Rights Reserved</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 无需特殊逻辑
</script>

<style scoped lang="scss">
.about-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 32rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 24rpx;
    border-radius: 32rpx;
  }
  
  .app-name {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .version {
    font-size: 24rpx;
    color: #999;
  }
}

.info-section {
  width: 100%;
  padding: 0 32rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 32rpx 0;
    border-bottom: 1rpx solid #F5F5F5;
    
    .label {
      font-size: 28rpx;
      color: #333;
    }
    
    .value {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.copyright {
  margin-top: auto;
  font-size: 20rpx;
  color: #CCC;
  padding-bottom: 40rpx;
}
</style>
