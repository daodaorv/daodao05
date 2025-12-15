<template>
  <view class="order-detail-container">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" fullscreen text="加载中..." />

    <!-- 订单内容 -->
    <view v-else-if="order" class="order-content">
      <!-- 订单状态卡片 -->
      <view class="status-card">
        <view class="status-header">
          <u-tag
            :text="order.statusText"
            :type="getStatusType(order.status)"
            size="large"
            plain
          />
          <text class="order-no">订单号: {{ order.orderNo }}</text>
        </view>
        <view class="status-time">
          <text>创建时间: {{ order.createTime }}</text>
        </view>
      </view>

      <!-- 客户信息 -->
      <view class="info-section">
        <view class="section-title">客户信息</view>
        <u-cell-group>
          <u-cell title="客户姓名" :value="order.customerName" />
          <u-cell title="联系电话" :value="order.customerPhone">
            <template #right-icon>
              <u-button
                icon="phone"
                type="primary"
                size="mini"
                @click="callCustomer"
              ></u-button>
            </template>
          </u-cell>
        </u-cell-group>
      </view>

      <!-- 车辆信息 -->
      <view class="info-section">
        <view class="section-title">车辆信息</view>
        <u-cell-group>
          <u-cell title="车辆名称" :value="order.vehicleName" />
          <u-cell title="车牌号" :value="order.vehiclePlate" />
        </u-cell-group>
      </view>

      <!-- 租期信息 -->
      <view class="info-section">
        <view class="section-title">租期信息</view>
        <u-cell-group>
          <u-cell title="开始日期" :value="order.startDate" />
          <u-cell title="结束日期" :value="order.endDate" />
          <u-cell title="租期天数" :value="`${order.days} 天`" />
        </u-cell-group>
      </view>

      <!-- 取还车地址 -->
      <view class="info-section">
        <view class="section-title">取还车地址</view>
        <u-cell-group>
          <u-cell title="取车地址" :value="order.pickupAddress" />
          <u-cell title="还车地址" :value="order.returnAddress" />
        </u-cell-group>
      </view>

      <!-- 费用明细 -->
      <view class="info-section">
        <view class="section-title">费用明细</view>
        <u-cell-group>
          <u-cell title="租金">
            <template #value>
              <text class="price-text">¥{{ order.totalAmount }}</text>
            </template>
          </u-cell>
          <u-cell title="押金" :value="`¥${order.deposit}`" />
          <u-cell v-if="order.extras && order.extras.length > 0" title="附加服务">
            <template #value>
              <view class="extras-list">
                <view v-for="extra in order.extras" :key="extra.name" class="extra-item">
                  <text class="extra-name">{{ extra.name }} x{{ extra.quantity }}</text>
                  <text class="extra-price">¥{{ extra.price * extra.quantity }}</text>
                </view>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="order.insurance" title="保险" :value="`${order.insurance.name} ¥${order.insurance.price}`" />
        </u-cell-group>
      </view>

      <!-- 备注信息 -->
      <view v-if="order.remark" class="info-section">
        <view class="section-title">备注信息</view>
        <view class="remark-content">
          <text>{{ order.remark }}</text>
        </view>
      </view>

      <!-- 操作记录 -->
      <view v-if="order.timeline && order.timeline.length > 0" class="info-section">
        <view class="section-title">操作记录</view>
        <view class="timeline-list">
          <view v-for="(item, index) in order.timeline" :key="index" class="timeline-item">
            <view class="timeline-dot"></view>
            <view class="timeline-content">
              <text class="timeline-status">{{ item.status }}</text>
              <text class="timeline-time">{{ item.time }}</text>
              <text class="timeline-operator">操作人: {{ item.operator }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="order" class="bottom-actions">
      <u-button
        v-if="order.status === 'pending'"
        text="确认订单"
        type="primary"
        @click="confirmOrder"
      ></u-button>
      <u-button
        v-if="order.status === 'pending'"
        text="取消订单"
        type="info"
        plain
        @click="cancelOrder"
      ></u-button>
      <u-button
        v-if="order.status === 'confirmed'"
        text="开始用车"
        type="primary"
        @click="startOrder"
      ></u-button>
      <u-button
        v-if="order.status === 'in_use'"
        text="处理还车流程"
        type="warning"
        plain
        @click="goReturnFlow"
      ></u-button>
      <u-button
        v-if="order.status === 'in_use'"
        text="完成订单"
        type="primary"
        @click="completeOrder"
      ></u-button>
    </view>

    <!-- 空状态 -->
    <EmptyState
      v-else
      mode="data"
      title="订单不存在"
      description="该订单可能已被删除或不存在"
      buttonText="返回列表"
      @click="goBack"
    />

    <!-- 确认对话框 -->
    <u-modal
      :show="dialogVisible"
      :title="dialogTitle"
      :content="dialogMessage"
      :showCancelButton="true"
      @confirm="handleDialogConfirm"
      @cancel="dialogVisible = false"
    ></u-modal>
  </view>
</template>

<script>
import { getOrderDetail, confirmOrder as confirmOrderApi, cancelOrder as cancelOrderApi, updateOrderStatus } from '@/api/order'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

export default {
  components: {
    LoadingSpinner,
    EmptyState
  },

  data() {
    return {
      orderId: null,
      order: null,
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogAction: null
    }
  },

  onLoad(options) {
    if (options.id) {
      this.orderId = options.id
      this.loadOrderDetail()
    }
  },

  methods: {
    async loadOrderDetail() {
      this.loading = true
      try {
        const data = await getOrderDetail(this.orderId)
        this.order = data
      } catch (error) {
        console.error('加载订单详情失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    callCustomer() {
      uni.makePhoneCall({
        phoneNumber: this.order.customerPhone
      })
    },

    confirmOrder() {
      this.dialogTitle = '确认订单'
      this.dialogMessage = `确认订单 ${this.order.orderNo}？`
      this.dialogType = 'default'
      this.dialogAction = 'confirm'
      this.dialogVisible = true
    },

    cancelOrder() {
      this.dialogTitle = '取消订单'
      this.dialogMessage = `确认取消订单 ${this.order.orderNo}？此操作不可撤销。`
      this.dialogType = 'danger'
      this.dialogAction = 'cancel'
      this.dialogVisible = true
    },

    startOrder() {
      this.dialogTitle = '开始用车'
      this.dialogMessage = `确认开始用车？订单状态将变更为"使用中"。`
      this.dialogType = 'default'
      this.dialogAction = 'start'
      this.dialogVisible = true
    },

    goReturnFlow() {
      if (!this.orderId) return
      uni.navigateTo({
        url: `/pages/orders/return?id=${this.orderId}`
      })
    },

    completeOrder() {
      this.dialogTitle = '完成订单'
      this.dialogMessage = `确认完成订单？请确保已完成车辆检查和交接。`
      this.dialogType = 'default'
      this.dialogAction = 'complete'
      this.dialogVisible = true
    },

    async handleDialogConfirm() {
      try {
        switch (this.dialogAction) {
          case 'confirm':
            await confirmOrderApi(this.orderId, {})
            uni.showToast({
              title: '订单已确认',
              icon: 'success'
            })
            break
          case 'cancel':
            await cancelOrderApi(this.orderId, '管理员取消')
            uni.showToast({
              title: '订单已取消',
              icon: 'success'
            })
            break
          case 'start':
            await updateOrderStatus(this.orderId, 'in_use', '开始用车')
            uni.showToast({
              title: '已开始用车',
              icon: 'success'
            })
            break
          case 'complete':
            await updateOrderStatus(this.orderId, 'completed', '订单完成')
            uni.showToast({
              title: '订单已完成',
              icon: 'success'
            })
            break
        }

        // 重新加载订单详情
        setTimeout(() => {
          this.loadOrderDetail()
        }, 1000)
      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    getStatusType(status) {
      const map = {
        pending: 'warning',
        confirmed: 'primary',
        in_use: 'success',
        completed: 'default',
        cancelled: 'error'
      }
      return map[status] || 'default'
    },

    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 状态卡片 */
.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  color: #fff;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.order-no {
  font-size: 28rpx;
  opacity: 0.9;
}

.status-time {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 信息区块 */
.info-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  padding: 0 30rpx 16rpx;
  border-bottom: 1px solid #eee;
}

.price-text {
  color: #f56c6c;
  font-weight: bold;
  font-size: 32rpx;
}

/* 附加服务 */
.extras-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.extra-item {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
}

.extra-price {
  color: #333;
  font-weight: 500;
}

/* 备注 */
.remark-content {
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 时间轴 */
.timeline-list {
  position: relative;
  padding-left: 40rpx;
}

.timeline-item {
  position: relative;
  padding-bottom: 40rpx;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -40rpx;
  top: 8rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #3cc51f;
  border: 3rpx solid #fff;
  box-shadow: 0 0 0 2rpx #3cc51f;
}

.timeline-item:not(:last-child) .timeline-dot::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2rpx;
  height: 40rpx;
  background: #e0e0e0;
  transform: translateX(-50%);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.timeline-status {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.timeline-time {
  font-size: 24rpx;
  color: #999;
}

.timeline-operator {
  font-size: 24rpx;
  color: #666;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
