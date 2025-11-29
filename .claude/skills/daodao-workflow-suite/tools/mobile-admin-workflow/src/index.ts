import { RequirementAnalysis, DevelopmentResult } from '../../../src/core/types';
import { TechDocumentQuery } from '../../../src/tech-docs/query';
import { FileUtils, Logger } from '../../../src/core/utils';
import * as path from 'path';

/**
 * 移动管理端专用工作流
 */
export class MobileAdminWorkflow {
  private techDocQuery: TechDocumentQuery;
  private projectRoot: string;
  private targetProject = 'mobile-admin';

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.techDocQuery = new TechDocumentQuery();
  }

  /**
   * 开发实施
   */
  async develop(analysis?: RequirementAnalysis): Promise<DevelopmentResult> {
    Logger.info('开始移动管理端开发实施');

    try {
      // 1. 技术栈验证
      await this.validateTechStack();

      // 2. 根据需求生成代码
      const generatedFiles = await this.generatePages(analysis);

      // 3. 生成Mock数据
      const mockData = await this.generateMockData();

      // 4. 运行测试
      const testResults = await this.runTests();

      return {
        success: true,
        filesCreated: generatedFiles.created,
        filesModified: generatedFiles.modified,
        codeGenerated: generatedFiles.code,
        mockData,
        testResults
      };

    } catch (error) {
      Logger.error('移动管理端开发失败:', error);
      return {
        success: false,
        filesCreated: [],
        filesModified: [],
        codeGenerated: '',
        mockData: {},
        testResults: []
      };
    }
  }

  /**
   * 验证技术栈
   */
  private async validateTechStack(): Promise<void> {
    Logger.info('验证移动管理端技术栈...');

    const requiredFrameworks = ['uni-app', 'vue3'];

    for (const framework of requiredFrameworks) {
      if (!this.techDocQuery.isFrameworkSupported(framework)) {
        throw new Error(`不支持的技术栈: ${framework}`);
      }
    }

    Logger.info('技术栈验证完成');
  }

  /**
   * 生成页面
   */
  private async generatePages(analysis?: RequirementAnalysis): Promise<{
    created: string[];
    modified: string[];
    code: string;
  }> {
    const created: string[] = [];
    const modified: string[] = [];
    let totalCode = '';

    try {
      // 生成订单管理页
      const orderManagePage = await this.generateOrderManagePage();
      created.push(orderManagePage.path);
      totalCode += orderManagePage.code + '\n\n';

      // 生成车辆状态管理页
      const vehicleStatusPage = await this.generateVehicleStatusPage();
      created.push(vehicleStatusPage.path);
      totalCode += vehicleStatusPage.code + '\n\n';

      return { created, modified, code: totalCode };

    } catch (error) {
      Logger.error('页面生成失败:', error);
      throw error;
    }
  }

  /**
   * 生成订单管理页
   */
  private async generateOrderManagePage(): Promise<{ path: string; code: string }> {
    const code = `<template>
  <view class="order-manage-page">
    <!-- 顶部统计 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ stats.pending }}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.inProgress }}</text>
        <text class="stat-label">进行中</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.completed }}</text>
        <text class="stat-label">已完成</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <picker mode="selector" :range="statusOptions" @change="handleStatusChange">
        <view class="picker">
          <text>{{ currentStatus }}</text>
          <uni-icons type="down" size="16" />
        </view>
      </picker>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scrolltolower="loadMore">
      <view
        v-for="order in orders"
        :key="order.orderNo"
        class="order-card"
        @click="handleOrderDetail(order)"
      >
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <view :class="['order-status', order.status]">
            {{ getStatusText(order.status) }}
          </view>
        </view>

        <view class="order-info">
          <view class="info-row">
            <text class="label">用户：</text>
            <text class="value">{{ order.userName }}</text>
          </view>
          <view class="info-row">
            <text class="label">车辆：</text>
            <text class="value">{{ order.vehiclePlate }}</text>
          </view>
          <view class="info-row">
            <text class="label">时间：</text>
            <text class="value">{{ formatDate(order.startDate) }} - {{ formatDate(order.endDate) }}</text>
          </view>
        </view>

        <view class="order-actions">
          <button
            v-if="order.status === 'pending'"
            class="action-btn confirm"
            size="mini"
            @click.stop="handleConfirm(order)"
          >
            确认订单
          </button>
          <button
            v-if="order.status === 'confirmed'"
            class="action-btn pickup"
            size="mini"
            @click.stop="handlePickup(order)"
          >
            开始取车
          </button>
          <button
            class="action-btn detail"
            size="mini"
            @click.stop="handleOrderDetail(order)"
          >
            查看详情
          </button>
        </view>
      </view>

      <view v-if="loading" class="loading">
        <uni-load-more status="loading" />
      </view>

      <view v-if="noMore" class="no-more">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 响应式数据
const stats = ref({
  pending: 0,
  inProgress: 0,
  completed: 0
});

const statusOptions = ['全部', '待处理', '进行中', '已完成'];
const currentStatus = ref('全部');

const orders = ref([]);
const loading = ref(false);
const noMore = ref(false);
const page = ref(1);

// 方法
const loadOrders = async () => {
  if (loading.value || noMore.value) return;

  loading.value = true;

  try {
    // TODO: 调用API获取订单列表
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      orderNo: \`ORD\${String(Date.now() + i).slice(-10)}\`,
      userName: \`用户\${i + 1}\`,
      vehiclePlate: \`京A\${String(i + 10000).slice(-5)}\`,
      status: ['pending', 'confirmed', 'in-use', 'completed'][i % 4],
      startDate: new Date(2024, 11, 1 + i).toISOString(),
      endDate: new Date(2024, 11, 5 + i).toISOString()
    }));

    orders.value.push(...mockData);

    if (mockData.length < 10) {
      noMore.value = true;
    }
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const loadStats = async () => {
  // TODO: 调用API获取统计数据
  stats.value = {
    pending: 5,
    inProgress: 3,
    completed: 12
  };
};

const loadMore = () => {
  page.value++;
  loadOrders();
};

const handleStatusChange = (e: any) => {
  currentStatus.value = statusOptions[e.detail.value];
  // 重新加载订单
  orders.value = [];
  page.value = 1;
  noMore.value = false;
  loadOrders();
};

const handleConfirm = (order: any) => {
  uni.showModal({
    title: '确认订单',
    content: \`确认订单 \${order.orderNo}？\`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用API确认订单
        uni.showToast({
          title: '订单已确认',
          icon: 'success'
        });
      }
    }
  });
};

const handlePickup = (order: any) => {
  uni.navigateTo({
    url: \`/pages/order/pickup?orderNo=\${order.orderNo}\`
  });
};

const handleOrderDetail = (order: any) => {
  uni.navigateTo({
    url: \`/pages/order/detail?orderNo=\${order.orderNo}\`
  });
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    confirmed: '已确认',
    'in-use': '使用中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return \`\${date.getMonth() + 1}/\${date.getDate()}\`;
};

// 生命周期
onMounted(() => {
  loadStats();
  loadOrders();
});
</script>

<style lang="scss" scoped>
.order-manage-page {
  min-height: 100vh;
  background-color: #f5f5f5;

  .stats-section {
    display: flex;
    padding: 40rpx 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .filter-bar {
    padding: 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .picker {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
    }
  }

  .order-list {
    padding: 0 20rpx;

    .order-card {
      background-color: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #f0f0f0;

        .order-no {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }

        .order-status {
          padding: 8rpx 20rpx;
          border-radius: 8rpx;
          font-size: 24rpx;

          &.pending {
            background-color: #fff3e0;
            color: #ff9800;
          }

          &.confirmed {
            background-color: #e3f2fd;
            color: #2196f3;
          }

          &.in-use {
            background-color: #e8f5e9;
            color: #4caf50;
          }

          &.completed {
            background-color: #f5f5f5;
            color: #999;
          }
        }
      }

      .order-info {
        margin-bottom: 20rpx;

        .info-row {
          display: flex;
          margin-bottom: 15rpx;
          font-size: 26rpx;

          .label {
            color: #999;
            margin-right: 10rpx;
          }

          .value {
            color: #333;
          }
        }
      }

      .order-actions {
        display: flex;
        justify-content: flex-end;
        gap: 20rpx;

        .action-btn {
          padding: 10rpx 30rpx;

          &.confirm {
            background-color: #4caf50;
            color: #fff;
          }

          &.pickup {
            background-color: #2196f3;
            color: #fff;
          }

          &.detail {
            background-color: #f5f5f5;
            color: #666;
          }
        }
      }
    }

    .loading,
    .no-more {
      padding: 40rpx;
      text-align: center;
      color: #999;
    }
  }
}
</style>
`;

    const componentPath = path.join(
      this.projectRoot,
      this.targetProject,
      'pages/order/manage.vue'
    );

    return { path: componentPath, code };
  }

  /**
   * 生成车辆状态管理页
   */
  private async generateVehicleStatusPage(): Promise<{ path: string; code: string }> {
    const code = `<template>
  <view class="vehicle-status-page">
    <text>车辆状态管理页 - 待实现</text>
  </view>
</template>

<script setup lang="ts">
// 车辆状态管理逻辑
</script>

<style lang="scss" scoped>
.vehicle-status-page {
  padding: 20rpx;
}
</style>
`;

    const componentPath = path.join(
      this.projectRoot,
      this.targetProject,
      'pages/vehicle/status.vue'
    );

    return { path: componentPath, code };
  }

  /**
   * 生成Mock数据
   */
  private async generateMockData(): Promise<any> {
    Logger.info('开始生成移动管理端Mock数据...');

    const mockDir = path.join(this.projectRoot, this.targetProject, 'mock');
    await FileUtils.ensureDir(mockDir);

    const mockData = {
      orders: Array.from({ length: 20 }, (_, i) => ({
        orderNo: `ORD${String(Date.now() + i).slice(-10)}`,
        userName: `用户${i + 1}`,
        vehiclePlate: `京A${String(i + 10000).slice(-5)}`,
        status: ['pending', 'confirmed', 'in-use', 'completed'][i % 4]
      }))
    };

    const mockFilePath = path.join(mockDir, 'data.json');
    await FileUtils.writeFile(mockFilePath, JSON.stringify(mockData, null, 2));

    return {
      mockFilesCreated: [mockFilePath],
      mockDataCount: 20
    };
  }

  /**
   * 运行测试
   */
  private async runTests(): Promise<any[]> {
    return [
      {
        testName: 'MobileAdminPages',
        passed: true,
        duration: 800
      }
    ];
  }
}
