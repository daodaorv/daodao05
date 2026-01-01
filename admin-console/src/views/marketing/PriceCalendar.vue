<template>
  <div class="price-calendar-container">
    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters">
        <el-form-item label="车型">
          <el-select
            v-model="filters.modelId"
            placeholder="请选择车型"
            style="width: 200px"
            @change="handleFilterChange"
          >
            <el-option
              v-for="model in vehicleModels"
              :key="model.id"
              :label="model.modelName"
              :value="model.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="门店">
          <el-select
            v-model="filters.storeId"
            placeholder="请选择门店"
            style="width: 200px"
            @change="handleFilterChange"
          >
            <el-option
              v-for="store in stores"
              :key="store.id"
              :label="`${store.name} (${store.cityName})`"
              :value="store.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视图">
          <el-radio-group v-model="viewMode">
            <el-radio-button value="month">月视图</el-radio-button>
            <el-radio-button value="list">列表视图</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="loadCalendar"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row v-if="calendarData" :gutter="20" style="margin-top: 20px">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">平均价格</div>
            <div class="stat-value">¥{{ calendarData.summary.avgPrice }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">最高价格</div>
            <div class="stat-value" style="color: #f56c6c">
              ¥{{ calendarData.summary.maxPrice }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">最低价格</div>
            <div class="stat-value" style="color: #67c23a">
              ¥{{ calendarData.summary.minPrice }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">总天数</div>
            <div class="stat-value">{{ calendarData.summary.totalDays }} 天</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 日历视图 -->
    <el-card v-if="viewMode === 'month'" class="calendar-card" v-loading="loading">
      <template #header>
        <div class="calendar-header">
          <el-button-group>
            <el-button @click="previousMonth">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-button disabled>{{ currentMonthLabel }}</el-button>
            <el-button @click="nextMonth">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-button-group>
          <div class="calendar-actions">
            <el-button type="primary" @click="goToToday">今天</el-button>
            <el-button v-if="selectedDates.length > 0" type="success" @click="handleBatchAdjust">
              批量调价 ({{ selectedDates.length }})
            </el-button>
            <el-button v-if="selectedDates.length > 0" @click="clearSelection">
              清空选择
            </el-button>
          </div>
        </div>
      </template>

      <div class="calendar-grid">
        <!-- 星期标题 -->
        <div class="calendar-weekdays">
          <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
        </div>

        <!-- 日期单元格 -->
        <div class="calendar-days">
          <PriceCalendarCell
            v-for="date in calendarDates"
            :key="date"
            :date="date"
            :price-info="getPriceInfo(date)"
            :selected="selectedDates.includes(date)"
            @click="(clickedDate, event) => handleDateClick(clickedDate, event)"
          />
        </div>
      </div>
    </el-card>

    <!-- 列表视图 -->
    <el-card v-else class="list-card" v-loading="loading">
      <el-table :data="calendarData?.calendar || []" border stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="basePrice" label="基础价" width="100">
          <template #default="{ row }"> ¥{{ row.basePrice }} </template>
        </el-table-column>
        <el-table-column label="城市因子" width="150">
          <template #default="{ row }">
            <div v-if="row.cityFactor">
              <el-tag size="small" type="primary">
                {{ row.cityFactor.factorName }}
              </el-tag>
              <div style="font-size: 12px; color: #909399; margin-top: 4px">
                {{ formatFactorValue(row.cityFactor) }}
              </div>
            </div>
            <span v-else style="color: #c0c4cc">-</span>
          </template>
        </el-table-column>
        <el-table-column label="时间因子" width="150">
          <template #default="{ row }">
            <div v-if="row.timeFactor">
              <el-tag size="small" type="danger">
                {{ row.timeFactor.factorName }}
              </el-tag>
              <div style="font-size: 12px; color: #909399; margin-top: 4px">
                {{ formatFactorValue(row.timeFactor) }}
              </div>
            </div>
            <span v-else style="color: #c0c4cc">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="dailyRental" label="最终价格" width="120">
          <template #default="{ row }">
            <span class="price-highlight">¥{{ row.dailyRental }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格变化" width="100">
          <template #default="{ row, $index }">
            <div v-if="$index > 0 && calendarData" class="price-change">
              <template v-if="row.dailyRental > calendarData.calendar[$index - 1].dailyRental">
                <el-icon color="#f56c6c"><CaretTop /></el-icon>
                <span style="color: #f56c6c">
                  +{{
                    Math.round(
                      ((row.dailyRental - calendarData.calendar[$index - 1].dailyRental) /
                        calendarData.calendar[$index - 1].dailyRental) *
                        100
                    )
                  }}%
                </span>
              </template>
              <template v-else-if="row.dailyRental < calendarData.calendar[$index - 1].dailyRental">
                <el-icon color="#67c23a"><CaretBottom /></el-icon>
                <span style="color: #67c23a">
                  {{
                    Math.round(
                      ((row.dailyRental - calendarData.calendar[$index - 1].dailyRental) /
                        calendarData.calendar[$index - 1].dailyRental) *
                        100
                    )
                  }}%
                </span>
              </template>
              <span v-else style="color: #909399">-</span>
            </div>
            <span v-else style="color: #909399">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row.date)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 价格详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="价格详情" size="600px" :close-on-click-modal="false">
      <PriceDayDetail
        v-if="selectedDate && filters.modelId && filters.storeId"
        :date="selectedDate"
        :model-id="filters.modelId"
        :city-id="getCityId()"
        @adjust="handleAdjustPrice"
        @view-history="handleViewHistory"
        @copy-to-other-dates="handleCopyToOtherDates"
      />
    </el-drawer>

    <!-- 批量调价对话框 -->
    <BatchPriceAdjustForm
      v-model="batchAdjustVisible"
      :selected-dates="selectedDates"
      :model-id="filters.modelId"
      :store-id="filters.storeId"
      @success="handleBatchAdjustSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import PriceCalendarCell from '@/components/marketing/PriceCalendarCell.vue'
import PriceDayDetail from '@/components/marketing/PriceDayDetail.vue'
import BatchPriceAdjustForm from '@/components/marketing/BatchPriceAdjustForm.vue'
import { getPriceCalendar, type PriceCalendarResponse } from '@/api/priceCalendar'
import { getVehicleModels, type VehicleModel } from '@/api/vehicle'
import { getStoreList, type Store } from '@/api/store'

// 筛选条件
const filters = reactive({
  modelId: undefined as number | undefined,
  storeId: undefined as number | undefined,
})

// 视图模式
const viewMode = ref<'month' | 'list'>('month')

// 当前月份
const currentDate = ref(new Date())

// 加载状态
const loading = ref(false)

// 车型列表
const vehicleModels = ref<VehicleModel[]>([])

// 门店列表
const stores = ref<Store[]>([])

// 日历数据
const calendarData = ref<PriceCalendarResponse['data'] | null>(null)

// 选中的日期
const selectedDates = ref<string[]>([])
const selectedDate = ref<string>('')

// 抽屉显示
const drawerVisible = ref(false)

// 批量调价对话框显示
const batchAdjustVisible = ref(false)

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前月份标签
const currentMonthLabel = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

// 生成日历日期
const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // 获取第一天是星期几（0-6）
  const firstDayOfWeek = firstDay.getDay()

  // 获取上个月需要显示的天数
  const prevMonthDays = firstDayOfWeek

  // 生成日期数组
  const dates: string[] = []

  // 上个月的日期
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    dates.push(date.toISOString().split('T')[0])
  }

  // 当月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    dates.push(date.toISOString().split('T')[0])
  }

  // 下个月的日期（补齐到42个格子，6行7列）
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
})

// 获取价格信息
const getPriceInfo = (date: string) => {
  if (!calendarData.value) return undefined

  const priceDetail = calendarData.value.calendar.find(c => c.date === date)
  if (!priceDetail) return undefined

  // 构建因子列表
  const factors: Array<{ id: number; name: string; type: string }> = []

  if (priceDetail.cityFactor) {
    factors.push({
      id: priceDetail.cityFactor.factorId,
      name: priceDetail.cityFactor.factorName,
      type: 'city',
    })
  }

  if (priceDetail.timeFactor) {
    factors.push({
      id: priceDetail.timeFactor.factorId,
      name: priceDetail.timeFactor.factorName,
      type: 'time',
    })
  }

  // 计算价格变化
  const index = calendarData.value.calendar.findIndex(c => c.date === date)
  let priceChange = 0
  if (index > 0) {
    const prevPrice = calendarData.value.calendar[index - 1].dailyRental
    const currentPrice = priceDetail.dailyRental
    priceChange = Math.round(((currentPrice - prevPrice) / prevPrice) * 100)
  }

  return {
    ...priceDetail,
    factors,
    priceChange,
  }
}

// 格式化因子值
const formatFactorValue = (factor: any) => {
  if (!factor) return ''
  if (factor.adjustmentType === 'percentage') {
    return `${factor.configValue > 0 ? '+' : ''}${factor.configValue}%`
  } else {
    return `${factor.configValue > 0 ? '+' : ''}¥${factor.configValue}`
  }
}

// 加载车型列表
const loadVehicleModels = async () => {
  try {
    const res = await getVehicleModels({ page: 1, pageSize: 100, status: 'active' })
    vehicleModels.value = res.data.list
    if (vehicleModels.value.length > 0 && !filters.modelId) {
      filters.modelId = vehicleModels.value[0].id
    }
  } catch (error) {
    console.error('加载车型列表失败:', error)
    ElMessage.error('加载车型列表失败')
  }
}

// 加载门店列表
const loadStores = async () => {
  try {
    const res = (await getStoreList({ page: 1, pageSize: 100, status: 'active' })) as any
    stores.value = res.data.list
    if (stores.value.length > 0 && !filters.storeId) {
      filters.storeId = stores.value[0].id
    }
  } catch (error) {
    console.error('加载门店列表失败:', error)
    ElMessage.error('加载门店列表失败')
  }
}

// 加载日历数据
const loadCalendar = async () => {
  if (!filters.modelId || !filters.storeId) {
    ElMessage.warning('请选择车型和门店')
    return
  }

  loading.value = true
  try {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const res = await getPriceCalendar({
      modelId: filters.modelId,
      storeId: filters.storeId,
      startDate,
      endDate,
    })

    if (res.success) {
      calendarData.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error('加载价格日历失败:', error)
    ElMessage.error('加载价格日历失败')
  } finally {
    loading.value = false
  }
}

// 筛选条件变化
const handleFilterChange = () => {
  loadCalendar()
}

// 上一月
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  loadCalendar()
}

// 下一月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  loadCalendar()
}

// 回到今天
const goToToday = () => {
  currentDate.value = new Date()
  loadCalendar()
}

// 点击日期
const handleDateClick = (date: string, event?: MouseEvent) => {
  // 如果按住 Ctrl/Cmd 键，则进行多选
  if (event && (event.ctrlKey || event.metaKey)) {
    const index = selectedDates.value.indexOf(date)
    if (index > -1) {
      // 已选中，取消选择
      selectedDates.value.splice(index, 1)
    } else {
      // 未选中，添加到选择列表
      selectedDates.value.push(date)
    }
  } else {
    // 单击查看详情
    selectedDate.value = date
    drawerVisible.value = true
  }
}

// 查看详情
const handleViewDetail = (date: string) => {
  selectedDate.value = date
  drawerVisible.value = true
}

// 批量调价
const handleBatchAdjust = () => {
  if (selectedDates.value.length === 0) {
    ElMessage.warning('请先选择要调价的日期')
    return
  }
  if (!filters.modelId || !filters.storeId) {
    ElMessage.warning('请先选择车型和门店')
    return
  }
  batchAdjustVisible.value = true
}

// 批量调价成功
const handleBatchAdjustSuccess = () => {
  selectedDates.value = []
  loadCalendar()
}

// 清空选择
const clearSelection = () => {
  selectedDates.value = []
}

// 获取城市ID
const getCityId = () => {
  const store = stores.value.find(s => s.id === filters.storeId)
  return store?.cityId || 0
}

// 调整价格
const handleAdjustPrice = (date: string) => {
  selectedDates.value = [date]
  drawerVisible.value = false
  batchAdjustVisible.value = true
}

// 查看历史
const handleViewHistory = (date: string) => {
  ElMessage.info(`查看 ${date} 的价格历史记录功能开发中`)
}

// 复制到其他日期
const handleCopyToOtherDates = (date: string) => {
  ElMessage.info(`复制 ${date} 的价格到其他日期功能开发中`)
}

// 初始化
onMounted(async () => {
  await Promise.all([loadVehicleModels(), loadStores()])
  loadCalendar()
})
</script>

<style scoped lang="scss">
.price-calendar-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;
  }

  .calendar-card {
    margin-top: 20px;

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .calendar-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }

    .calendar-grid {
      .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin-bottom: 8px;

        .weekday {
          text-align: center;
          font-weight: bold;
          color: #606266;
          padding: 8px;
        }
      }

      .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
      }
    }
  }

  .list-card {
    margin-top: 20px;
  }

  .stat-item {
    text-align: center;

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
  }

  .price-highlight {
    color: #f56c6c;
    font-weight: bold;
    font-size: 16px;
  }

  .price-change {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
