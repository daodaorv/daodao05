<!-- @ts-nocheck -->
<template>
  <div class="week-calendar-view">
    <div class="week-header">
      <el-button-group>
        <el-button @click="previousWeek">
          <el-icon><ArrowLeft /></el-icon>
          上一周
        </el-button>
        <el-button disabled>{{ weekLabel }}</el-button>
        <el-button @click="nextWeek">
          下一周
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </el-button-group>
      <el-button type="primary" @click="goToCurrentWeek">本周</el-button>
    </div>

    <div class="week-grid" v-loading="loading">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="week-day-card"
        :class="{
          'is-today': isToday(day.date),
          'is-weekend': isWeekend(day.date),
          'is-selected': selectedDates.includes(day.date)
        }"
        @click="handleDayClick(day.date)"
      >
        <div class="day-header">
          <div class="day-date">
            <div class="day-number">{{ getDayNumber(day.date) }}</div>
            <div class="day-weekday">{{ getWeekday(day.date) }}</div>
          </div>
          <div v-if="isToday(day.date)" class="today-badge">今天</div>
        </div>

        <div v-if="day.priceInfo" class="day-content">
          <div class="price-section">
            <div class="price-label">最终价格</div>
            <div class="price-value">¥{{ day.priceInfo.dailyRental }}</div>
          </div>

          <div class="price-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">基础价:</span>
              <span class="breakdown-value">¥{{ day.priceInfo.basePrice }}</span>
            </div>
            <div v-if="day.priceInfo.cityFactor" class="breakdown-item">
              <span class="breakdown-label">城市因子:</span>
              <span class="breakdown-value">
                {{ formatFactorValue(day.priceInfo.cityFactor) }}
              </span>
            </div>
            <div v-if="day.priceInfo.timeFactor" class="breakdown-item">
              <span class="breakdown-label">时间因子:</span>
              <span class="breakdown-value">
                {{ formatFactorValue(day.priceInfo.timeFactor) }}
              </span>
            </div>
          </div>

          <div v-if="day.priceInfo.factors && day.priceInfo.factors.length > 0" class="factors-section">
            <el-tag
              v-for="factor in day.priceInfo.factors"
              :key="factor.id"
              size="small"
              :type="factor.type === 'city' ? 'primary' : 'danger'"
              style="margin-right: 4px; margin-bottom: 4px"
            >
              {{ factor.name }}
            </el-tag>
          </div>

          <div v-if="day.priceInfo.priceChange !== 0" class="price-change">
            <el-icon v-if="day.priceInfo.priceChange > 0" color="#f56c6c">
              <CaretTop />
            </el-icon>
            <el-icon v-else color="#67c23a">
              <CaretBottom />
            </el-icon>
            <span :style="{ color: day.priceInfo.priceChange > 0 ? '#f56c6c' : '#67c23a' }">
              {{ Math.abs(day.priceInfo.priceChange) }}%
            </span>
          </div>
        </div>

        <div v-else class="day-content empty">
          <el-empty description="暂无数据" :image-size="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight, CaretTop, CaretBottom } from '@element-plus/icons-vue'

interface PriceInfo {
  date: string
  basePrice: number
  dailyRental: number
  cityFactor?: any
  timeFactor?: any
  factors?: Array<{ id: number; name: string; type: string }>
  priceChange?: number
}

interface Props {
  priceData?: PriceInfo[]
  loading?: boolean
  selectedDates?: string[]
}

interface Emits {
  (e: 'date-click', date: string): void
  (e: 'week-change', startDate: string, endDate: string): void
}

const props = withDefaults(defineProps<Props>(), {
  priceData: () => [],
  loading: false,
  selectedDates: () => []
})

const emit = defineEmits<Emits>()

// 当前周的起始日期
const currentWeekStart = ref(getWeekStart(new Date()))

// 周标签
const weekLabel = computed(() => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)

  const startStr = `${start.getMonth() + 1}月${start.getDate()}日`
  const endStr = `${end.getMonth() + 1}月${end.getDate()}日`

  return `${start.getFullYear()}年 ${startStr} - ${endStr}`
})

// 周的日期列表
const weekDays = computed(() => {
  const days: Array<{ date: string; priceInfo?: PriceInfo }> = []
  const start = new Date(currentWeekStart.value)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    const priceInfo = props.priceData.find(p => p.date === dateStr)

    days.push({
      date: dateStr,
      priceInfo
    })
  }

  return days
})

// 获取一周的起始日期（周一）
function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 调整到周一
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

// 上一周
const previousWeek = () => {
  const start = new Date(currentWeekStart.value)
  start.setDate(start.getDate() - 7)
  currentWeekStart.value = start.toISOString().split('T')[0]
  emitWeekChange()
}

// 下一周
const nextWeek = () => {
  const start = new Date(currentWeekStart.value)
  start.setDate(start.getDate() + 7)
  currentWeekStart.value = start.toISOString().split('T')[0]
  emitWeekChange()
}

// 回到本周
const goToCurrentWeek = () => {
  currentWeekStart.value = getWeekStart(new Date())
  emitWeekChange()
}

// 发送周变化事件
const emitWeekChange = () => {
  const start = currentWeekStart.value
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  emit('week-change', start, end.toISOString().split('T')[0])
}

// 点击日期
const handleDayClick = (date: string) => {
  emit('date-click', date)
}

// 是否是今天
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

// 是否是周末
const isWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  const day = date.getDay()
  return day === 0 || day === 6
}

// 获取日期数字
const getDayNumber = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.getDate().toString()
}

// 获取星期几
const getWeekday = (dateStr: string): string => {
  const date = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}

// 格式化因子值
const formatFactorValue = (factor: any): string => {
  if (!factor) return ''
  if (factor.adjustmentType === 'percentage') {
    return `${factor.configValue > 0 ? '+' : ''}${factor.configValue}%`
  } else {
    return `${factor.configValue > 0 ? '+' : ''}¥${factor.configValue}`
  }
}
</script>

<style scoped lang="scss">
.week-calendar-view {
  .week-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .week-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;

    .week-day-card {
      background: #fff;
      border: 2px solid #e4e7ed;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s;
      min-height: 200px;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
        transform: translateY(-2px);
      }

      &.is-today {
        border-color: #67c23a;
        border-width: 2px;
        background-color: #f0f9ff;
      }

      &.is-weekend {
        background-color: #fef0f0;
      }

      &.is-selected {
        border-color: #409eff;
        background-color: #ecf5ff;
      }

      .day-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e4e7ed;

        .day-date {
          display: flex;
          align-items: baseline;
          gap: 6px;

          .day-number {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
          }

          .day-weekday {
            font-size: 12px;
            color: #909399;
          }
        }

        .today-badge {
          background-color: #67c23a;
          color: #fff;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
        }
      }

      .day-content {
        &.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
        }

        .price-section {
          text-align: center;
          margin-bottom: 12px;

          .price-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .price-value {
            font-size: 20px;
            font-weight: bold;
            color: #409eff;
          }
        }

        .price-breakdown {
          margin-bottom: 8px;

          .breakdown-item {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 4px;

            .breakdown-label {
              color: #909399;
            }

            .breakdown-value {
              color: #606266;
              font-weight: 500;
            }
          }
        }

        .factors-section {
          margin-bottom: 8px;
        }

        .price-change {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #e4e7ed;
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 1400px) {
  .week-calendar-view .week-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .week-calendar-view .week-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .week-calendar-view .week-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
