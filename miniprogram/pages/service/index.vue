<template>
  <view class="service-page">
    <view class="page-placeholder">
      <uni-icons type="headphones" size="80" color="#ccc"></uni-icons>
      <text class="placeholder-text">客服</text>
      <text class="placeholder-desc">功能开发中...</text>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped lang="scss">
.service-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-placeholder {
  text-align: center;
  
  .placeholder-text {
    display: block;
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }
  
  .placeholder-desc {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #999;
  }
}
</style>

