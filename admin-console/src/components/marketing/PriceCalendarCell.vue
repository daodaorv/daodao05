<template>
  <div
    class="price-cell"
    :class="cellClass"
    @click="handleClick"
  >
    <div class="cell-date">{{ dayOfMonth }}</div>
    <div v-if="priceInfo" class="cell-content">
      <div class="cell-price">¥{{ priceInfo.dailyRental }}</div>
      <div v-if="priceInfo.factors && priceInfo.factors.length > 0" class="cell-factors">
        <el-tag
          v-for="factor in priceInfo.factors.slice(0, 2)"
          :key="factor.id"
          size="small"
          :type="getFactorTagType(factor)"
        >
          {{ factor.name }}
        </el-tag>
        <el-tag v-if="priceInfo.factors.length > 2" size="small" type="info">
          +{{ priceInfo.factors.length - 2 }}
        </el-tag>
      </div>
      <div v-if="priceInfo.priceChange" class="cell-change">
        <el-icon v-if="priceInfo.priceChange > 0" color="#f56c6c">
          <CaretTop />
        </el-icon>
        <el-icon v-else color="#67c23a">
          <CaretBottom />
        </el-icon>
        <span>{{ Math.abs(priceInfo.priceChange) }}%</span>
      </div>
    </div>
    <div v-else class="cell-empty">
      <span>-</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import type { DailyPriceDetail } from '@/types/pricing'

interface Props {
  date: string // YYYY-MM-DD
  priceInfo?: DailyPriceDetail & {
    factors?: Array<{ id: number; name: string; type: string }>
    priceChange?: number
  }
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false
})

const emit = defineEmits<{
  click: [date: string]
}>()

// 提取日期中的日
const dayOfMonth = computed(() => {
  const date = new Date(props.date)
  return date.getDate()
})

// 单元格样式类
const cellClass = computed(() => {
  return {
    'is-selected': props.selected,
    'is-disabled': props.disabled,
    'is-weekend': isWeekend.value,
    'is-today': isToday.value,
    'has-price-up': props.priceInfo?.priceChange && props.priceInfo.priceChange > 0,
    'has-price-down': props.priceInfo?.priceChange && props.priceInfo.priceChange < 0
  }
})

// 是否是周末
const isWeekend = computed(() => {
  const date = new Date(props.date)
  const day = date.getDay()
  return day === 0 || day === 6
})

// 是否是今天
const isToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.date === today
})

// 获取因子标签类型
const getFactorTagType = (factor: { type: string }) => {
  const typeMap: Record<string, string> = {
    city: 'primary',
    time: 'danger',
    other: 'warning'
  }
  return typeMap[factor.type] || 'info'
}

// 处理点击
const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.date)
  }
}
</script>

<style scoped lang="scss">
.price-cell {
  position: relative;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;

  &:hover:not(.is-disabled) {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    transform: translateY(-2px);
  }

  &.is-selected {
    border-color: #409eff;
    background-color: #ecf5ff;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f5f7fa;
  }

  &.is-weekend {
    background-color: #fef0f0;
  }

  &.is-today {
    border-color: #67c23a;
    border-width: 2px;
  }

  &.has-price-up {
    .cell-price {
      color: #f56c6c;
    }
  }

  &.has-price-down {
    .cell-price {
      color: #67c23a;
    }
  }

  .cell-date {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .cell-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cell-price {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .cell-factors {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .el-tag {
      font-size: 10px;
      height: 18px;
      line-height: 18px;
      padding: 0 4px;
    }
  }

  .cell-change {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    color: #606266;

    .el-icon {
      font-size: 14px;
    }
  }

  .cell-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: #c0c4cc;
    font-size: 14px;
  }
}
</style>
