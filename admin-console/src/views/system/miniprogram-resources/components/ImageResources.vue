<template>
  <div class="image-resources">
    <!-- 二级 Tab：按图片类型分类 -->
    <el-tabs v-model="imageType" type="card">
      <el-tab-pane label="首页轮播图" name="home-banners">
        <BannerManager type="home" />
      </el-tab-pane>
      <el-tab-pane label="推广卡片" name="promo-cards">
        <PromoCardManager />
      </el-tab-pane>
      <el-tab-pane label="托管轮播图" name="hosting-banners">
        <BannerManager type="hosting" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BannerManager from './BannerManager.vue'
import PromoCardManager from './PromoCardManager.vue'

const imageType = ref('home-banners')
</script>

<style scoped lang="scss">
.image-resources {
  :deep(.el-tabs--card > .el-tabs__header) {
    border-bottom: 1px solid #e4e7ed;
  }
}
</style>
