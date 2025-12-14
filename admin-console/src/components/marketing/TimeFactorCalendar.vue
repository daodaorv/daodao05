<template>
  <div class="time-factor-calendar">
    <el-alert
      title="时间因子日历说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>查看指定时间范围内每天生效的时间因子，可以检测因子冲突</div>
      </template>
    </el-alert>

    <!-- 查询区 -->
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="queryForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handlePreCalculate">预计算</el-button>
      </el-form-item>
    </el-form>

    <!-- 日历视图 -->
    <div v-loading="loading" class="calendar-container">
      <el-calendar v-model="currentDate">
        <template #date-cell="{ data }">
          <div class="calendar-day">
            <div class="day-number">{{ data.day.split('-').slice(-1)[0] }}</div>
            <div v-if="getFactorForDate(data.day)" class="factor-info">
              <el-tag
                size="small"
                :type="getFactorForDate(data.day)?.factorType === 'national_holiday' ? 'danger' : 'warning'"
              >
                {{ getFactorForDate(data.day)?.factorName }}
              </el-tag>
              <div class="factor-value">
                {{ getFactorForDate(data.day)?.adjustmentType === 'percentage' ?
                  `${getFactorForDate(data.day)?.adjustmentValue > 0 ? '+' : ''}${getFactorForDate(data.day)?.adjustmentValue}%` :
                  `${getFactorForDate(data.day)?.adjustmentValue > 0 ? '+' : ''}¥${getFactorForDate(data.day)?.adjustmentValue}` }}
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>

    <!-- 统计信息 -->
    <el-card v-if="calendarData.length > 0" style="margin-top: 20px">
      <template #header>
        <span>统计信息</span>
      </template>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="总天数">
          {{ calendarData.length }}
        </el-descriptions-item>
        <el-descriptions-item label="有因子天数">
          {{ calendarData.filter(d => d.effectiveFactor).length }}
        </el-descriptions-item>
        <el-descriptions-item label="无因子天数">
          {{ calendarData.filter(d => !d.effectiveFactor).length }}
        </el-descriptions-item>
        <el-descriptions-item label="冲突天数">
          {{ calendarData.filter(d => d.conflictFactors && d.conflictFactors.length > 0).length }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getTimeFactorCalendar, preCalculateCalendar } from '@/api/timeFactor'
import type { TimeFactorCalendarItem } from '@/types/timeFactor'

// 查询表单
const queryForm = reactive({
  dateRange: [] as Date[]
})

// 当前日期
const currentDate = ref(new Date())

// 日历数据
const loading = ref(false)
const calendarData = ref<TimeFactorCalendarItem[]>([])

// 获取指定日期的因子
const getFactorForDate = (date: string) => {
  const item = calendarData.value.find(d => d.date === date)
  return item?.effectiveFactor
}

// 查询
const handleQuery = async () => {
  if (!queryForm.dateRange || queryForm.dateRange.length !== 2) {
    ElMessage.warning('请选择日期范围')
    return
  }

  loading.value = true
  try {
    const startDate = queryForm.dateRange[0].toISOString().split('T')[0]
    const endDate = queryForm.dateRange[1].toISOString().split('T')[0]

    const res = await getTimeFactorCalendar({
      startDate,
      endDate
    })

    if (res.code === 0) {
      calendarData.value = res.data.list
      ElMessage.success('查询成功')
    }
  } catch (error) {
    ElMessage.error('查询失败')
  } finally {
    loading.value = false
  }
}

// 预计算
const handlePreCalculate = async () => {
  if (!queryForm.dateRange || queryForm.dateRange.length !== 2) {
    ElMessage.warning('请选择日期范围')
    return
  }

  loading.value = true
  try {
    const startDate = queryForm.dateRange[0].toISOString().split('T')[0]
    const endDate = queryForm.dateRange[1].toISOString().split('T')[0]

    const res = await preCalculateCalendar({
      startDate,
      endDate
    })

    if (res.code === 0) {
      ElMessage.success(`预计算完成！计算 ${res.data.calculatedDays} 天，发现 ${res.data.conflictDays} 天冲突`)
      handleQuery()
    }
  } catch (error) {
    ElMessage.error('预计算失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.time-factor-calendar {
  .query-form {
    margin-bottom: 20px;
  }

  .calendar-container {
    min-height: 400px;

    .calendar-day {
      height: 80px;
      padding: 5px;

      .day-number {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .factor-info {
        font-size: 12px;

        .factor-value {
          margin-top: 3px;
          color: #67c23a;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
