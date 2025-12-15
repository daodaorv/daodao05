<!-- @ts-nocheck -->
<template>
  <div class="system-config-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统配置</h2>
      <p class="page-description">管理系统基础参数和业务规则配置</p>
    </div>

    <!-- 配置分类标签 -->
    // @ts-ignore
    <el-card class="tabs-card" shadow="never">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="基础配置" name="basic">
          <BasicConfig />
        </el-tab-pane>
        <el-tab-pane label="业务规则" name="business">
          <BusinessRules />
        </el-tab-pane>
        <el-tab-pane label="支付配置" name="payment">
          <PaymentConfig />
        </el-tab-pane>
        <el-tab-pane label="通知配置" name="notification">
          <NotificationConfig />
        </el-tab-pane>
        <el-tab-pane label="第三方服务" name="thirdparty">
          <ThirdPartyConfig />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import BasicConfig from './components/BasicConfig.vue'
import BusinessRules from './components/BusinessRules.vue'
import PaymentConfig from './components/PaymentConfig.vue'
import NotificationConfig from './components/NotificationConfig.vue'
import ThirdPartyConfig from './components/ThirdPartyConfig.vue'

const activeTab = ref('basic')

const handleTabChange = (tabName: string) => {
  console.log('切换到标签:', tabName)
}
</script>

<style scoped lang="scss">
.system-config-container {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #303133;
    }

    .page-description {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .tabs-card {
    :deep(.el-tabs__header) {
      margin-bottom: 20px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
  }
}
</style>
