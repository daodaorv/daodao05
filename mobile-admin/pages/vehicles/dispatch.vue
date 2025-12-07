<template>
  <view class="dispatch-container">
    <!-- 顶部筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item">
        <text class="filter-label">车辆状态</text>
        <u-radio-group v-model="filterStatus" @change="handleFilterChange">
          <u-radio
            v-for="item in statusOptions"
            :key="item.value"
            :name="item.value"
            :label="item.label"
            size="small"
          />
        </u-radio-group>
      </view>
    </view>

    <!-- 可用车辆列表 -->
    <view class="vehicle-list">
      <view class="section-title">
        <text>可调度车辆</text>
        <text class="vehicle-count">{{ availableVehicles.length }}辆</text>
      </view>

      <view
        v-for="vehicle in availableVehicles"
        :key="vehicle.id"
        class="vehicle-card"
        @click="selectVehicle(vehicle)"
      >
        <view class="vehicle-header">
          <view class="vehicle-info">
            <text class="vehicle-name">{{ vehicle.name }}</text>
            <text class="vehicle-plate">{{ vehicle.plate }}</text>
          </view>
          <u-tag
            :text="getStatusText(vehicle.status)"
            :type="getStatusType(vehicle.status)"
            size="mini"
          />
        </view>

        <view class="vehicle-details">
          <view class="detail-item">
            <u-icon name="map-pin" size="16" color="#666"></u-icon>
            <text class="detail-text">{{ vehicle.location }}</text>
          </view>
          <view class="detail-item">
            <u-icon name="clock" size="16" color="#666"></u-icon>
            <text class="detail-text">{{ vehicle.lastUpdateTime }}</text>
          </view>
        </view>

        <view class="vehicle-actions">
          <u-button
            type="primary"
            size="small"
            plain
            @click.stop="viewLocation(vehicle)"
          >
            查看位置
          </u-button>
          <u-button
            type="success"
            size="small"
            @click.stop="createDispatchTask(vehicle)"
          >
            创建调度
          </u-button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="availableVehicles.length === 0 && !loading" class="empty-state">
        <EmptyState
          icon="🚗"
          text="暂无可调度车辆"
          description="当前没有符合条件的车辆"
        />
      </view>
    </view>

    <!-- 调度任务列表 -->
    <view class="task-list">
      <view class="section-title">
        <text>调度任务</text>
        <text class="task-count">{{ dispatchTasks.length }}个</text>
      </view>

      <view
        v-for="task in dispatchTasks"
        :key="task.id"
        class="task-card"
        @click="viewTaskDetail(task)"
      >
        <view class="task-header">
          <view class="task-info">
            <text class="task-title">{{ task.title }}</text>
            <u-tag
              :text="getTaskStatusText(task.status)"
              :type="getTaskStatusType(task.status)"
              size="mini"
            />
          </view>
          <text class="task-time">{{ formatTime(task.createTime) }}</text>
        </view>

        <view class="task-content">
          <view class="task-vehicle">
            <text class="label">车辆：</text>
            <text class="value">{{ task.vehicleName }} ({{ task.vehiclePlate }})</text>
          </view>
          <view class="task-route">
            <text class="label">路线：</text>
            <text class="value">{{ task.fromLocation }} → {{ task.toLocation }}</text>
          </view>
          <view class="task-assignee">
            <text class="label">负责人：</text>
            <text class="value">{{ task.assigneeName || '待分配' }}</text>
          </view>
        </view>

        <view v-if="task.status === 'pending'" class="task-actions">
          <u-button
            type="primary"
            size="small"
            plain
            @click.stop="assignTask(task)"
          >
            分配任务
          </u-button>
          <u-button
            type="success"
            size="small"
            @click.stop="startTask(task)"
          >
            开始执行
          </u-button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="dispatchTasks.length === 0 && !loading" class="empty-state">
        <EmptyState
          icon="📋"
          text="暂无调度任务"
          description="还没有创建任何调度任务"
        />
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <LoadingSpinner text="加载中..." />
    </view>

    <!-- 创建调度任务弹窗 -->
    <u-popup v-model="showCreateDialog" mode="bottom" :round="20">
      <view class="create-dialog">
        <view class="dialog-header">
          <text class="dialog-title">创建调度任务</text>
          <u-icon name="close" size="24" @click="showCreateDialog = false"></u-icon>
        </view>

        <view class="dialog-content">
          <view class="form-item">
            <text class="form-label">任务标题</text>
            <u-input
              v-model="taskForm.title"
              placeholder="请输入任务标题"
              border="surround"
            />
          </view>

          <view class="form-item">
            <text class="form-label">车辆信息</text>
            <view class="vehicle-display">
              <text>{{ selectedVehicle.name }} ({{ selectedVehicle.plate }})</text>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">起始位置</text>
            <u-input
              v-model="taskForm.fromLocation"
              placeholder="请输入起始位置"
              border="surround"
            />
          </view>

          <view class="form-item">
            <text class="form-label">目标位置</text>
            <u-input
              v-model="taskForm.toLocation"
              placeholder="请输入目标位置"
              border="surround"
            />
          </view>

          <view class="form-item">
            <text class="form-label">备注说明</text>
            <u-textarea
              v-model="taskForm.remark"
              placeholder="请输入备注说明"
              :maxlength="200"
              count
            />
          </view>
        </view>

        <view class="dialog-actions">
          <u-button type="info" plain @click="showCreateDialog = false">取消</u-button>
          <u-button
            type="primary"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="submitTask"
          >
            创建任务
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getAvailableVehicles, getDispatchTasks, createDispatchTask, updateTaskStatus } from '@/api/dispatch'
import { formatRelativeTime } from '@/utils/format'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    EmptyState,
    LoadingSpinner
  },

  data() {
    return {
      filterStatus: 'all',
      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '可用', value: 'available' },
        { label: '维护中', value: 'maintenance' }
      ],
      vehicles: [],
      dispatchTasks: [],
      loading: false,
      showCreateDialog: false,
      selectedVehicle: {},
      taskForm: {
        title: '',
        fromLocation: '',
        toLocation: '',
        remark: ''
      },
      submitting: false
    }
  },

  computed: {
    availableVehicles() {
      if (this.filterStatus === 'all') {
        return this.vehicles
      }
      return this.vehicles.filter(v => v.status === this.filterStatus)
    },

    canSubmit() {
      return (
        this.taskForm.title.trim() &&
        this.taskForm.fromLocation.trim() &&
        this.taskForm.toLocation.trim() &&
        !this.submitting
      )
    }
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh()
    })
  },

  methods: {
    formatTime(time) {
      return formatRelativeTime(time)
    },

    async loadData() {
      this.loading = true
      try {
        const [vehiclesData, tasksData] = await Promise.all([
          getAvailableVehicles(),
          getDispatchTasks()
        ])

        this.vehicles = vehiclesData.list
        this.dispatchTasks = tasksData.list
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    handleFilterChange() {
      // 筛选已通过computed自动处理
    },

    selectVehicle(vehicle) {
      uni.showActionSheet({
        itemList: ['查看位置', '创建调度任务'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.viewLocation(vehicle)
          } else if (res.tapIndex === 1) {
            this.createDispatchTask(vehicle)
          }
        }
      })
    },

    viewLocation(vehicle) {
      uni.navigateTo({
        url: `/pages/vehicles/location?id=${vehicle.id}`
      })
    },

    createDispatchTask(vehicle) {
      this.selectedVehicle = vehicle
      this.taskForm = {
        title: `${vehicle.name}调度任务`,
        fromLocation: vehicle.location,
        toLocation: '',
        remark: ''
      }
      this.showCreateDialog = true
    },

    async submitTask() {
      if (!this.canSubmit) {
        return
      }

      this.submitting = true
      try {
        await createDispatchTask({
          vehicleId: this.selectedVehicle.id,
          vehicleName: this.selectedVehicle.name,
          vehiclePlate: this.selectedVehicle.plate,
          title: this.taskForm.title,
          fromLocation: this.taskForm.fromLocation,
          toLocation: this.taskForm.toLocation,
          remark: this.taskForm.remark
        })

        uni.showToast({
          title: '任务创建成功',
          icon: 'success'
        })

        this.showCreateDialog = false
        this.loadData()
      } catch (error) {
        console.error('创建任务失败:', error)
        uni.showToast({
          title: '创建失败',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    },

    viewTaskDetail(task) {
      uni.showModal({
        title: task.title,
        content: `车辆：${task.vehicleName}\n路线：${task.fromLocation} → ${task.toLocation}\n负责人：${task.assigneeName || '待分配'}`,
        showCancel: false
      })
    },

    assignTask(task) {
      uni.showToast({
        title: '分配任务功能开发中',
        icon: 'none'
      })
    },

    async startTask(task) {
      try {
        await updateTaskStatus(task.id, 'in_progress')
        uni.showToast({
          title: '任务已开始',
          icon: 'success'
        })
        this.loadData()
      } catch (error) {
        console.error('开始任务失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    getStatusText(status) {
      const statusMap = {
        available: '可用',
        in_use: '使用中',
        maintenance: '维护中',
        disabled: '禁用'
      }
      return statusMap[status] || status
    },

    getStatusType(status) {
      const typeMap = {
        available: 'success',
        in_use: 'primary',
        maintenance: 'warning',
        disabled: 'info'
      }
      return typeMap[status] || 'default'
    },

    getTaskStatusText(status) {
      const statusMap = {
        pending: '待执行',
        in_progress: '进行中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },

    getTaskStatusType(status) {
      const typeMap = {
        pending: 'warning',
        in_progress: 'primary',
        completed: 'success',
        cancelled: 'info'
      }
      return typeMap[status] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.dispatch-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 40rpx;
}

.filter-bar {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.filter-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.vehicle-count,
.task-count {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
}

.vehicle-list,
.task-list {
  margin-bottom: 40rpx;
}

.vehicle-card,
.task-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.vehicle-header,
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.vehicle-info,
.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.vehicle-name,
.task-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.vehicle-plate {
  font-size: 26rpx;
  color: #666;
}

.task-time {
  font-size: 24rpx;
  color: #999;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
}

.vehicle-actions,
.task-actions {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.task-vehicle,
.task-route,
.task-assignee {
  display: flex;
  font-size: 26rpx;
}

.label {
  color: #999;
  margin-right: 8rpx;
}

.value {
  color: #333;
  flex: 1;
}

.empty-state {
  padding: 120rpx 0;
}

.loading-state {
  padding: 120rpx 0;
}

.create-dialog {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.dialog-content {
  margin-bottom: 32rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.vehicle-display {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.dialog-actions {
  display: flex;
  gap: 20rpx;
}
</style>
