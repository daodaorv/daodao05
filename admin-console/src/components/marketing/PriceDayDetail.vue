<template>
  <div class="price-day-detail" v-loading="loading">
    <el-descriptions v-if="priceDetail" :column="1" border>
      <el-descriptions-item label="日期">
        {{ date }}
      </el-descriptions-item>
      <el-descriptions-item label="车型">
        {{ priceDetail.modelName }}
      </el-descriptions-item>
      <el-descriptions-item label="基础价格">
        <span class="price-value">¥{{ priceDetail.basePrice }}</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-divider>价格计算明细</el-divider>

    <div v-if="priceDetail" class="price-breakdown">
      <div class="breakdown-item">
        <span class="label">车型基础价：</span>
        <span class="value">¥{{ priceDetail.basePrice }}</span>
      </div>

      <div v-if="priceDetail.cityFactor" class="breakdown-item">
        <span class="label">城市因子【{{ priceDetail.cityFactor.factorName }}】：</span>
        <span class="value" :class="getValueClass(priceDetail.cityFactor.calculatedAmount)">
          {{ formatAmount(priceDetail.cityFactor.calculatedAmount) }}
        </span>
        <el-tag size="small" type="primary">优先级: {{ priceDetail.cityFactor.priority }}</el-tag>
      </div>

      <div v-if="priceDetail.timeFactor" class="breakdown-item">
        <span class="label">时间因子【{{ priceDetail.timeFactor.averageAmount ? '多日平均' : priceDetail.timeFactor.dailyDetails?.[0]?.timeFactor?.factorName || '无' }}】：</span>
        <span v-if="priceDetail.timeFactor.dailyDetails?.[0]?.timeFactor" class="value" :class="getValueClass(priceDetail.timeFactor.dailyDetails[0].timeFactor.calculatedAmount)">
          {{ formatAmount(priceDetail.timeFactor.dailyDetails[0].timeFactor.calculatedAmount) }}
        </span>
        <el-tag v-if="priceDetail.timeFactor.dailyDetails?.[0]?.timeFactor" size="small" type="danger">
          优先级: {{ priceDetail.timeFactor.dailyDetails[0].timeFactor.priority }}
        </el-tag>
      </div>

      <div v-for="factor in priceDetail.otherFactors" :key="factor.factorId" class="breakdown-item">
        <span class="label">{{ factor.factorName }}：</span>
        <span class="value" :class="getValueClass(factor.calculatedAmount)">
          {{ formatAmount(factor.calculatedAmount) }}
        </span>
      </div>

      <el-divider />

      <div class="breakdown-item final">
        <span class="label">最终日租价：</span>
        <span class="value final-price">¥{{ priceDetail.dailyRental }}</span>
      </div>

      <div class="calculation-explanation">
        <el-alert type="info" :closable="false">
          <template #title>
            <div style="font-size: 12px; line-height: 1.6">
              {{ priceDetail.calculationExplanation }}
            </div>
          </template>
        </el-alert>
      </div>
    </div>

    <el-divider>快速操作</el-divider>

    <el-space>
      <el-button type="primary" @click="handleAdjust">
        <el-icon><Edit /></el-icon>
        调整价格
      </el-button>
      <el-button @click="handleViewHistory">
        <el-icon><Clock /></el-icon>
        查看历史
      </el-button>
      <el-button @click="handleCopyToOtherDates">
        <el-icon><CopyDocument /></el-icon>
        复制到其他日期
      </el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Clock, CopyDocument } from '@element-plus/icons-vue'
import { getDayPriceDetail } from '@/api/priceCalendar'
import type { PriceCalculationResult } from '@/types/pricing'

interface Props {
  date: string
  modelId: number
  cityId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  adjust: [date: string]
  viewHistory: [date: string]
  copyToOtherDates: [date: string]
}>()

const loading = ref(false)
const priceDetail = ref<PriceCalculationResult | null>(null)

// 加载价格详情
const loadPriceDetail = async () => {
  loading.value = true
  try {
    const res = await getDayPriceDetail({
      modelId: props.modelId,
      cityId: props.cityId,
      date: props.date
    })

    if (res.success) {
      priceDetail.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error('加载价格详情失败:', error)
    ElMessage.error('加载价格详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount > 0) {
    return `+¥${amount}`
  } else if (amount < 0) {
    return `-¥${Math.abs(amount)}`
  } else {
    return '¥0'
  }
}

// 获取值的样式类
const getValueClass = (amount: number) => {
  if (amount > 0) {
    return 'value-positive'
  } else if (amount < 0) {
    return 'value-negative'
  } else {
    return 'value-zero'
  }
}

// 调整价格
const handleAdjust = () => {
  emit('adjust', props.date)
}

// 查看历史
const handleViewHistory = () => {
  emit('viewHistory', props.date)
}

// 复制到其他日期
const handleCopyToOtherDates = () => {
  emit('copyToOtherDates', props.date)
}

// 监听日期变化
watch(() => props.date, () => {
  if (props.date && props.modelId && props.cityId) {
    loadPriceDetail()
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.price-day-detail {
  .price-value {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }

  .price-breakdown {
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      &.final {
        padding: 16px 0;
        border-top: 2px solid #409eff;
        border-bottom: none;
      }

      .label {
        font-size: 14px;
        color: #606266;
        min-width: 200px;
      }

      .value {
        font-size: 16px;
        font-weight: bold;
        flex: 1;

        &.value-positive {
          color: #f56c6c;
        }

        &.value-negative {
          color: #67c23a;
        }

        &.value-zero {
          color: #909399;
        }

        &.final-price {
          font-size: 24px;
          color: #409eff;
        }
      }

      .el-tag {
        margin-left: auto;
      }
    }

    .calculation-explanation {
      margin-top: 16px;
    }
  }
}
</style>
