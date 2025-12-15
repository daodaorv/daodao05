<!-- @ts-nocheck -->
<template>
  <el-card class="chart-card" :shadow="shadow" :body-style="{ padding: '0' }">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <el-icon v-if="icon" class="header-icon" :style="{ color: iconColor }">
            <component :is="icon" />
          </el-icon>
          <div class="header-text">
            <div class="card-title">{{ title }}</div>
            <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
          </div>
        </div>
        <div v-if="$slots.extra || showRefresh" class="header-right">
          <slot name="extra"></slot>
          <el-button
            v-if="showRefresh"
            :icon="Refresh"
            circle
            size="small"
            :loading="refreshing"
            @click="handleRefresh"
            title="刷新数据"
          />
        </div>
      </div>
    </template>

    <!-- 图表容器 -->
    <div class="chart-container" :style="{ height: height }">
      <div
        v-if="chartType === 'echarts'"
        ref="chartRef"
        class="echarts-container"
        :style="{ width: '100%', height: '100%' }"
      ></div>

      <!-- 自定义图表内容 -->
      <div v-else-if="chartType === 'custom'" class="custom-chart">
        <slot name="chart"></slot>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="chart-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && isEmpty"
        :description="emptyText"
        :image-size="100"
      />
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { Refresh, Loading } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, ECharts } from 'echarts'

// 注册 ECharts 组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
])

// Props 定义
interface Props {
  title: string                   // 卡片标题
  subtitle?: string               // 卡片副标题
  icon?: Component                // 标题图标
  iconColor?: string              // 图标颜色
  chartType?: 'echarts' | 'custom' // 图表类型
  options?: EChartsOption         // ECharts 配置项
  height?: string                 // 图表高度
  loading?: boolean               // 加载状态
  isEmpty?: boolean               // 是否为空
  emptyText?: string              // 空状态文本
  shadow?: 'always' | 'hover' | 'never' // 阴影显示时机
  showRefresh?: boolean           // 是否显示刷新按钮
  autoResize?: boolean            // 是否自动调整大小
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  iconColor: '#409eff',
  chartType: 'echarts',
  options: () => ({}),
  height: '300px',
  loading: false,
  isEmpty: false,
  emptyText: '暂无数据',
  shadow: 'hover',
  showRefresh: false,
  autoResize: true,
})

// Emits 定义
const emit = defineEmits<{
  'refresh': []
  'chart-ready': [chart: ECharts]
}>()

// 响应式数据
const chartRef = ref<HTMLElement>()
const chartInstance = ref<ECharts>()
const refreshing = ref(false)

// 计算属性
const _hasData = computed(() => {
  if (props.chartType === 'custom') return true
  return props.options && Object.keys(props.options).length > 0
})

// 初始化图表
const initChart = () => {
  if (props.chartType !== 'echarts' || !chartRef.value) return

  // 销毁旧实例
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  // @ts-ignore
  // 创建新实例
  chartInstance.value = echarts.init(chartRef.value)

  // 设置配置项
  if (props.options && Object.keys(props.options).length > 0) {
    chartInstance.value?.setOption(props.options)
  }

  // 触发图表就绪事件
  emit('chart-ready', chartInstance.value!)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance.value || !props.options) return

  chartInstance.value?.setOption(props.options, true)
}

// 调整图表大小
const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// 刷新数据
const handleRefresh = async () => {
  refreshing.value = true
  emit('refresh')

  // 模拟刷新延迟
  setTimeout(() => {
    refreshing.value = false
  }, 500)
}

// 监听配置项变化
watch(
  () => props.options,
  () => {
    if (chartInstance.value) {
      updateChart()
    }
  },
  { deep: true }
)

// 监听加载状态
watch(
  () => props.loading,
  (newVal) => {
    if (!newVal && chartInstance.value) {
      // 加载完成后重新渲染
      nextTick(() => {
        resizeChart()
      })
    }
  }
)

// 窗口大小变化监听
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    if (props.chartType === 'echarts') {
      initChart()
    }

    // 监听容器大小变化
    if (props.autoResize && chartRef.value) {
      resizeObserver = new ResizeObserver(() => {
        resizeChart()
      })
      resizeObserver.observe(chartRef.value)
    }
  })
})

onBeforeUnmount(() => {
  // 销毁图表实例
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  // 取消监听
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// 暴露方法供父组件调用
defineExpose({
  getChartInstance: () => chartInstance.value,
  resize: resizeChart,
  refresh: handleRefresh,
})
</script>

<script lang="ts">
export default {
  name: 'ChartCard',
}
</script>

<style scoped lang="scss">
.chart-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
      }

      .header-text {
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          line-height: 1.5;
        }

        .card-subtitle {
          font-size: 12px;
          color: #909399;
          margin-top: 2px;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .chart-container {
    position: relative;
    padding: 16px;

    .echarts-container {
      width: 100%;
      height: 100%;
    }

    .custom-chart {
      width: 100%;
      height: 100%;
    }

    .chart-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 10;

      .el-icon {
        font-size: 32px;
        color: #409eff;
      }

      span {
        font-size: 14px;
        color: #606266;
      }
    }

    :deep(.el-empty) {
      padding: 40px 0;
    }
  }

  .card-footer {
    padding: 12px 20px;
    border-top: 1px solid #ebeef5;
    background-color: #fafafa;
  }
}
</style>
