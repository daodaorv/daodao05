<template>
  <el-row :gutter="20" class="stats-cards">
    <el-col v-for="(item, index) in stats" :key="index" :span="span">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon :size="iconSize" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatValue(item.value) }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

export interface StatItem {
  label: string
  value: number | string
  icon: any
  color: string
  format?: 'number' | 'currency' | 'percent'
}

const props = withDefaults(
  defineProps<{
    stats: StatItem[]
    span?: number
    iconSize?: number
  }>(),
  {
    span: 6,
    iconSize: 40,
  }
)

const formatValue = (value: number | string) => {
  if (typeof value === 'string') return value

  const stat = props.stats.find(s => s.value === value)
  if (!stat?.format) return value

  switch (stat.format) {
    case 'currency':
      return `¥${value.toLocaleString()}`
    case 'percent':
      return `${value}%`
    default:
      return value
  }
}
</script>

<style scoped lang="scss">
.stats-cards {
  margin-bottom: 20px;

  .stat-card {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        flex-shrink: 0;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #303133;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>
