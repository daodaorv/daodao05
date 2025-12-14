<template>
  <div class="store-price-calendar-preview" v-loading="loading">
    <el-alert
      type="info"
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #title>
        <div style="font-size: 13px">
          显示该门店未来 7 天的价格预览，点击"查看完整日历"可查看更多
        </div>
      </template>
    </el-alert>

    <div v-if="previewData.length > 0" class="preview-list">
      <div
        v-for="item in previewData"
        :key="item.date"
        class="preview-item"
        :class="{ 'is-today': isToday(item.date) }"
      >
        <div class="item-date">
          <div class="date-day">{{ formatDate(item.date) }}</div>
          <div class="date-weekday">{{ getWeekday(item.date) }}</div>
        </div>
        <div class="item-price">
          <div class="price-value">¥{{ item.dailyRental }}</div>
          <div v-if="item.priceChange" class="price-change">
            <el-icon v-if="item.priceChange > 0" color="#f56c6c">
              <CaretTop />
            </el-icon>
            <el-icon v-else color="#67c23a">
              <CaretBottom />
            </el-icon>
            <span>{{ Math.abs(item.priceChange) }}%</span>
          </div>
        </div>
        <div class="item-factors">
          <el-tag
            v-if="item.cityFactor"
            size="small"
            type="primary"
          >
            {{ item.cityFactor.factorName }}
          </el-tag>
          <el-tag
            v-if="item.timeFactor"
            size="small"
            type="danger"
          >
            {{ item.timeFactor.factorName }}
          </el-tag>
        </div>
      </div>
    </div>

    <el-empty v-else description="暂无价格数据" />

    <div style="margin-top: 16px; text-align: center">
      <el-button type="primary" @click="handleViewFullCalendar">
        查看完整日历
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { getPriceCalendar } from '@/api/priceCalendar'
import type { DailyPriceDetail } from '@/types/pricing'

interface Props {
  storeId: number
  modelId?: number // 可选，如果不提供则使用默认车型
}

const props = defineProps<Props>()

const router = useRouter()
const loading = ref(false)
const previewData = ref<Array<DailyPriceDetail & { priceChange?: number }>>([])

// 加载预览数据
const loadPreviewData = async () => {
  loading.value = true
  try {
    // 获取未来 7 天的日期范围
    const today = new Date()
    const startDate = today.toISOString().split('T')[0]
    const endDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    // 使用默认车型（第一个车型）或指定车型
    const modelId = props.modelId || 1

    const res = await getPriceCalendar({
      modelId,
      storeId: props.storeId,
      startDate,
      endDate
    })

    if (res.success) {
      // 计算价格变化
      const calendar = res.data.calendar.map((item, index) => {
        let priceChange = 0
        if (index > 0) {
          const prevPrice = res.data.calendar[index - 1].dailyRental
          const currentPrice = item.dailyRental
          priceChange = Math.round(((currentPrice - prevPrice) / prevPrice) * 100)
        }
        return {
          ...item,
          priceChange
        }
      })

      previewData.value = calendar
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error('加载价格预览失败:', error)
    ElMessage.error('加载价格预览失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 获取星期几
const getWeekday = (dateStr: string) => {
  const date = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}

// 是否是今天
const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

// 查看完整日历
const handleViewFullCalendar = () => {
  router.push({
    name: 'PriceCalendar',
    query: {
      storeId: props.storeId,
      modelId: props.modelId || 1
    }
  })
}

onMounted(() => {
  loadPreviewData()
})
</script>

<style scoped lang="scss">
.store-price-calendar-preview {
  .preview-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .preview-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
      }

      &.is-today {
        border-color: #67c23a;
        border-width: 2px;
        background-color: #f0f9ff;
      }

      .item-date {
        min-width: 60px;
        text-align: center;

        .date-day {
          font-size: 16px;
          font-weight: bold;
          color: #303133;
        }

        .date-weekday {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }

      .item-price {
        min-width: 100px;

        .price-value {
          font-size: 18px;
          font-weight: bold;
          color: #f56c6c;
        }

        .price-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #606266;
          margin-top: 4px;

          .el-icon {
            font-size: 14px;
          }
        }
      }

      .item-factors {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}
</style>
