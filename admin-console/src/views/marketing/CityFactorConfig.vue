<!-- @deprecated 已废弃：城市因子配置功能已集成到价格策略页面中 -->
<!-- 请使用 /marketing/pricing 页面进行城市因子配置 -->
<template>
  <div class="city-factor-config-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 城市分级管理 -->
      <el-tab-pane label="城市分级管理" name="tier">
        <CityTierManagement />
      </el-tab-pane>

      <!-- 自定义城市因子 -->
      <el-tab-pane label="自定义城市因子" name="custom">
        <CustomCityFactor />
      </el-tab-pane>

      <!-- 城市列表 -->
      <el-tab-pane label="城市列表" name="city">
        <CityList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CityTierManagement from '@/components/marketing/CityTierManagement.vue'
import CustomCityFactor from '@/components/marketing/CustomCityFactor.vue'
import CityList from '@/components/marketing/CityList.vue'

const activeTab = ref('tier')
</script>

<style scoped lang="scss">
.city-factor-config-container {
  padding: 20px;
}
</style>
