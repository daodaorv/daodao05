<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="page-card welcome-card">
      <div class="welcome-content">
        <div class="welcome-info">
          <h2>欢迎回来，{{ user?.username }}！</h2>
          <p class="welcome-time">{{ currentTime }}</p>
          <p class="welcome-subtitle">今天是美好的一天，让我们开始工作吧</p>
        </div>
        <div class="welcome-avatar">
          <el-avatar :size="80" :src="user?.avatar" />
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="stats-grid">
      <div class="page-card stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#409eff">
              <Van />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.vehicleCount }}</div>
            <div class="stat-label">车辆总数</div>
          </div>
        </div>
      </div>

      <div class="page-card stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#67c23a">
              <List />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.orderCount }}</div>
            <div class="stat-label">订单总数</div>
          </div>
        </div>
      </div>

      <div class="page-card stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#e6a23c">
              <User />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.userCount }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </div>
      </div>

      <div class="page-card stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#f56c6c">
              <Money />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">¥{{ stats.revenue.toLocaleString() }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="page-card">
      <div class="card-header">
        <h3>快捷操作</h3>
      </div>
      <div class="quick-actions">
        <el-button type="primary" @click="$router.push('/vehicles/create')">
          <el-icon><Plus /></el-icon>
          添加车辆
        </el-button>
        <el-button type="success" @click="$router.push('/orders')">
          <el-icon><List /></el-icon>
          查看订单
        </el-button>
        <el-button type="warning" @click="$router.push('/coupons')">
          <el-icon><Ticket /></el-icon>
          发放优惠券
        </el-button>
        <el-button type="info" @click="$router.push('/users')">
          <el-icon><User /></el-icon>
          用户管理
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const currentTime = ref('')
const stats = reactive({
  vehicleCount: 48,
  orderCount: 326,
  userCount: 1234,
  revenue: 2456789,
})

const user = computed(() => userStore.user)

// 更新当前时间
const updateTime = () => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }
  currentTime.value = now.toLocaleDateString('zh-CN', options)
}

onMounted(() => {
  // 初始化用户信息
  userStore.initUserInfo()

  // 更新时间
  updateTime()
  setInterval(updateTime, 60000) // 每分钟更新一次
})
</script>

<style scoped lang="scss">
.dashboard {
  .welcome-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .welcome-info {
        h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .welcome-time {
          font-size: 16px;
          opacity: 0.9;
          margin: 0 0 4px 0;
        }

        .welcome-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;

        .stat-icon {
          margin-right: 16px;
        }

        .stat-info {
          .stat-number {
            font-size: 32px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .quick-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .el-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.card-header {
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    justify-content: center;
  }
}
</style>