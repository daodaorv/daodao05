<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h1>仪表盘</h1>
      <p>欢迎使用叨叨房车管理系统</p>
    </div>

    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon primary">
              <el-icon size="24"><Van /></el-icon>
            </div>
            <div class="stat-content">
              <h3>128</h3>
              <p>车辆总数</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon success">
              <el-icon size="24"><Tickets /></el-icon>
            </div>
            <div class="stat-content">
              <h3>456</h3>
              <p>订单总数</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon warning">
              <el-icon size="24"><User /></el-icon>
            </div>
            <div class="stat-content">
              <h3>1,234</h3>
              <p>用户总数</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon danger">
              <el-icon size="24"><Money /></el-icon>
            </div>
            <div class="stat-content">
              <h3>￥2.3M</h3>
              <p>总收入</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="dashboard-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="card-container">
            <h3>系统状态</h3>
            <p>✅ 后端服务：正常</p>
            <p>✅ 数据库连接：正常</p>
            <p>✅ Redis缓存：正常</p>
            <p>✅ API接口：正常</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-container">
            <h3>快速操作</h3>
            <el-space direction="vertical" style="width: 100%">
              <el-button type="primary" style="width: 100%">
                新增订单
              </el-button>
              <el-button type="success" style="width: 100%">
                车辆管理
              </el-button>
              <el-button type="warning" style="width: 100%">
                用户管理
              </el-button>
              <el-button type="info" style="width: 100%">
                系统设置
              </el-button>
            </el-space>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Dashboard loaded')
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;

  h1 {
    margin: 0 0 10px 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
}

.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: white;

    &.primary {
      background: $primary-color;
    }

    &.success {
      background: $success-color;
    }

    &.warning {
      background: $warning-color;
    }

    &.danger {
      background: $danger-color;
    }
  }

  .stat-content {
    h3 {
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
}

.dashboard-content {
  .card-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    p {
      margin: 10px 0;
      color: #666;
    }
  }
}
</style>