<!-- @deprecated 已废弃：时间因子配置功能已集成到价格策略页面中 -->
<!-- 请使用 /marketing/pricing 页面进行时间因子配置 -->
<template>
  <div class="time-factor-config-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 法定节假日管理 -->
      <el-tab-pane label="法定节假日管理" name="holiday">
        <NationalHolidayManagement />
      </el-tab-pane>

      <!-- 自定义时间规则 -->
      <el-tab-pane label="自定义时间规则" name="custom">
        <CustomTimeRule />
      </el-tab-pane>

      <!-- 时间因子日历 -->
      <el-tab-pane label="时间因子日历" name="calendar">
        <TimeFactorCalendar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NationalHolidayManagement from '@/components/marketing/NationalHolidayManagement.vue'
import CustomTimeRule from '@/components/marketing/CustomTimeRule.vue'
import TimeFactorCalendar from '@/components/marketing/TimeFactorCalendar.vue'

const activeTab = ref('holiday')
</script>

<style scoped lang="scss">
.time-factor-config-container {
  padding: 20px;
}
</style>
