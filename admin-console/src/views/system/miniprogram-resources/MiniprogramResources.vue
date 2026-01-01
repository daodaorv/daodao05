<template>
  <div class="miniprogram-resources-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>小程序资源配置</h2>
      <p class="page-description">管理小程序端的图片、文本、配置等资源</p>
    </div>

    <!-- 配置分类标签 -->
    <el-card class="tabs-card" shadow="never">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <el-tab-pane label="图片资源" name="images">
          <ImageResources />
        </el-tab-pane>
        <el-tab-pane label="文本内容" name="texts">
          <TextContents />
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="configs">
          <ConfigManagement />
        </el-tab-pane>
        <el-tab-pane label="页面预览" name="preview">
          <MiniprogramPreview ref="previewRef" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageResources from './components/ImageResources.vue'
import TextContents from './components/TextContents.vue'
import ConfigManagement from './components/ConfigManagement.vue'
import MiniprogramPreview from './components/MiniprogramPreview.vue'

const activeTab = ref('images')
const previewRef = ref()

const handleTabChange = (tabName: string) => {
  console.log('切换到标签:', tabName)
  // 切换到预览页时刷新预览数据
  if (tabName === 'preview' && previewRef.value) {
    previewRef.value.refresh()
  }
}
</script>

<style scoped lang="scss">
.miniprogram-resources-container {
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
