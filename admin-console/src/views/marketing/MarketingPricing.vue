<template>
  <div class="marketing-pricing-container">
    <el-tabs v-model="activeTab" type="border-card" class="pricing-tabs">
      <!-- Tab 1: 价格日历 -->
      <el-tab-pane label="价格日历" name="calendar">
        <div class="tab-content">
          <el-alert type="info" :closable="false" style="margin-bottom: 16px">
            <template #title>
              <div style="font-size: 13px">
                价格日历展示每个日期的最终价格,由车型基础价 + 城市因子 + 时间因子 +
                其他因子动态计算而成
              </div>
            </template>
          </el-alert>

          <div style="text-align: center; padding: 40px 0">
            <el-button type="primary" size="large" @click="handleViewPriceCalendar">
              查看完整价格日历
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 时间因子配置 -->
      <el-tab-pane label="时间因子配置" name="timeFactor">
        <div class="tab-content">
          <el-alert type="info" :closable="false" style="margin-bottom: 16px">
            <template #title>
              <div style="font-size: 13px">
                时间因子包括法定节假日和自定义时间规则,用于在特定日期调整价格
              </div>
            </template>
          </el-alert>

          <el-tabs v-model="timeFactorTab" type="card">
            <el-tab-pane label="法定节假日" name="holiday">
              <NationalHolidayList />
            </el-tab-pane>
            <el-tab-pane label="自定义时间规则" name="custom">
              <CustomTimeRuleList />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>

      <!-- Tab 3: 城市因子配置 -->
      <el-tab-pane label="城市因子配置" name="cityFactor">
        <div class="tab-content">
          <CityFactorList />
        </div>
      </el-tab-pane>

      <!-- Tab 4: 其他价格规则 -->
      <el-tab-pane label="其他价格规则" name="otherRules">
        <div class="tab-content">
          <OtherPriceRuleList />
        </div>
      </el-tab-pane>

      <!-- Tab 5: 价格计算演示 -->
      <el-tab-pane label="价格计算演示" name="calculator">
        <div class="tab-content">
          <PriceCalculator />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NationalHolidayList from '@/components/marketing/NationalHolidayList.vue'
import CustomTimeRuleList from '@/components/marketing/CustomTimeRuleList.vue'
import CityFactorList from '@/components/marketing/CityFactorList.vue'
import OtherPriceRuleList from '@/components/marketing/OtherPriceRuleList.vue'
import PriceCalculator from '@/components/marketing/PriceCalculator.vue'

// Router
const router = useRouter()

// Tab 状态
const activeTab = ref('timeFactor')
const timeFactorTab = ref('holiday')

// 查看价格日历
const handleViewPriceCalendar = () => {
  router.push({
    name: 'PriceCalendar',
  })
}
</script>

<style scoped lang="scss">
.marketing-pricing-container {
  padding: 20px;

  .pricing-tabs {
    margin-top: 20px;

    .tab-content {
      padding: 20px;
      min-height: 400px;
    }
  }
}
</style>
