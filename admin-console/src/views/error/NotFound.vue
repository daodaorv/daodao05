<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <el-icon size="120" color="#409eff">
          <WarningFilled />
        </el-icon>
      </div>
      <h1 class="error-title">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <div class="error-actions">
        <el-button type="primary" @click="$router.push('/dashboard')">
          返回工作台
        </el-button>
        <el-button @click="$router.go(-1)">
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面组件
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;

  .error-content {
    text-align: center;

    .error-icon {
      margin-bottom: 20px;
    }

    .error-title {
      font-size: 72px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
    }

    .error-message {
      font-size: 18px;
      color: #909399;
      margin-bottom: 32px;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  }
}
</style>