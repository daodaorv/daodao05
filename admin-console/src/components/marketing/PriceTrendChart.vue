<!-- @ts-nocheck -->
<template>
  <div class="price-trend-chart">
    <div class="chart-header">
      <div class="chart-title">价格趋势分析</div>
      <div class="chart-controls">
        <el-radio-group v-model="chartType" size="small" @change="updateChart">
          <el-radio-button value="line">折线图</el-radio-button>
          <el-radio-button value="bar">柱状图</el-radio-button>
        </el-radio-group>
        <el-select
          v-model="timeRange"
          size="small"
          style="width: 120px; margin-left: 10px"
          @change="updateChart"
        >
          <el-option label="近7天" value="7" />
          <el-option label="近15天" value="15" />
          <el-option label="近30天" value="30" />
          <el-option label="近60天" value="60" />
        </el-select>
      </div>
    </div>
    <div ref="chartRef" class="chart-container" v-loading="loading"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  priceData?: Array<{
    date: string
    basePrice: number
    dailyRental: number
    cityFactor?: number
    timeFactor?: number
  }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  priceData: () => [],
  loading: false
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const chartType = ref<'line' | 'bar'>('line')
const timeRange = ref('30')

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  // 过滤数据
  const filteredData = props.priceData.slice(-parseInt(timeRange.value))

  // 准备数据
  const dates = filteredData.map(item => item.date)
  const basePrices = filteredData.map(item => item.basePrice)
  const finalPrices = filteredData.map(item => item.dailyRental)
  const cityFactors = filteredData.map(item => item.cityFactor || 0)
  const timeFactors = filteredData.map(item => item.timeFactor || 0)

  const option: EChartsOption = {
    title: {
      text: '价格趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: bold; margin-bottom: 5px">${params[0].axisValue}</div>`
        params.forEach((param: any) => {
          const value = param.value
          const color = param.color
          result += `
            <div style="display: flex; align-items: center; margin: 3px 0">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; margin-right: 5px"></span>
              <span style="flex: 1">${param.seriesName}:</span>
              <span style="font-weight: bold; margin-left: 10px">¥${value}</span>
            </div>
          `
        })
        return result
      }
    },
    legend: {
      data: ['基础价格', '最终价格', '城市因子', '时间因子'],
      top: 30,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: chartType.value === 'bar',
      data: dates,
      axisLabel: {
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '价格 (元)',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '基础价格',
        type: chartType.value,
        data: basePrices,
        smooth: true,
        itemStyle: {
          color: '#909399'
        },
        lineStyle: {
          width: 2
        }
      },
      {
        name: '最终价格',
        type: chartType.value,
        data: finalPrices,
        smooth: true,
        itemStyle: {
          color: '#409eff'
        },
        lineStyle: {
          width: 3
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '城市因子',
        type: chartType.value,
        data: cityFactors,
        smooth: true,
        itemStyle: {
          color: '#67c23a'
        },
        lineStyle: {
          width: 2,
          type: 'dashed'
        }
      },
      {
        name: '时间因子',
        type: chartType.value,
        data: timeFactors,
        smooth: true,
        itemStyle: {
          color: '#f56c6c'
        },
        lineStyle: {
          width: 2,
          type: 'dashed'
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        height: 20,
        bottom: 10
      }
    ]
  }

  chartInstance.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 监听数据变化
watch(() => props.priceData, () => {
  updateChart()
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (newVal) => {
  if (!newVal && chartInstance) {
    updateChart()
  }
})

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped lang="scss">
.price-trend-chart {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 20px;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .chart-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }

    .chart-controls {
      display: flex;
      align-items: center;
    }
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }
}
</style>
