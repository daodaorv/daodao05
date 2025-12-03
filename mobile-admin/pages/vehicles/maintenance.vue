<template>
  <view class="maintenance-container">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" fullscreen text="加载中..." />

    <!-- 维保表单 -->
    <view v-else class="maintenance-form">
      <!-- 车辆信息 -->
      <view class="info-section">
        <view class="section-title">车辆信息</view>
        <u-cell-group>
          <u-cell title="车辆名称" :value="vehicle.name" />
          <u-cell title="车牌号" :value="vehicle.plate" />
          <u-cell title="当前里程" :value="`${vehicle.mileage} km`" />
        </u-cell-group>
      </view>

      <!-- 维保类型 -->
      <view class="form-section">
        <view class="section-title">维保类型 <text class="required">*</text></view>
        <view class="type-selector">
          <view
            v-for="type in maintenanceTypes"
            :key="type.value"
            class="type-item"
            :class="{ active: formData.type === type.value }"
            @click="formData.type = type.value"
          >
            <u-icon :name="type.icon" size="40" :color="formData.type === type.value ? '#1890ff' : '#666'"></u-icon>
            <text class="type-text">{{ type.label }}</text>
          </view>
        </view>
      </view>

      <!-- 维保日期 -->
      <view class="form-section">
        <view class="section-title">维保日期 <text class="required">*</text></view>
        <picker
          mode="date"
          :value="formData.date"
          @change="handleDateChange"
        >
          <view class="picker-field">
            <text :class="{ placeholder: !formData.date }">
              {{ formData.date || '请选择维保日期' }}
            </text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>

      <!-- 维保里程 -->
      <view class="form-section">
        <view class="section-title">维保里程（km） <text class="required">*</text></view>
        <u-input
          v-model="formData.mileage"
          type="number"
          placeholder="请输入维保时的里程数"
          border="surround"
        />
      </view>

      <!-- 维保项目 -->
      <view class="form-section">
        <view class="section-title">维保项目 <text class="required">*</text></view>
        <u-checkbox-group v-model="formData.items">
          <view class="items-selector">
            <u-checkbox
              v-for="item in maintenanceItems"
              :key="item.value"
              :name="item.value"
              :label="item.label"
              shape="square"
              activeColor="#1890ff"
            />
          </view>
        </u-checkbox-group>
      </view>

      <!-- 维保费用 -->
      <view class="form-section">
        <view class="section-title">维保费用（元） <text class="required">*</text></view>
        <u-input
          v-model="formData.cost"
          type="digit"
          placeholder="请输入维保费用"
          border="surround"
        />
      </view>

      <!-- 维保机构 -->
      <view class="form-section">
        <view class="section-title">维保机构</view>
        <u-input
          v-model="formData.organization"
          placeholder="请输入维保机构名称"
          border="surround"
        />
      </view>

      <!-- 维保人员 -->
      <view class="form-section">
        <view class="section-title">维保人员</view>
        <u-input
          v-model="formData.technician"
          placeholder="请输入维保人员姓名"
          border="surround"
        />
      </view>

      <!-- 维保照片 -->
      <view class="form-section">
        <view class="section-title">维保照片</view>
        <u-upload
          :fileList="photoList"
          @afterRead="afterReadPhoto"
          @delete="deletePhoto"
          :maxCount="6"
          :previewFullImage="true"
          multiple
          width="160"
          height="160"
        >
          <view class="upload-slot">
            <u-icon name="camera-fill" size="40" color="#999"></u-icon>
            <text class="upload-text">上传照片</text>
          </view>
        </u-upload>
        <view class="upload-tip">可上传维保前后对比照片、维保单据等</view>
      </view>

      <!-- 维保说明 -->
      <view class="form-section">
        <view class="section-title">维保说明</view>
        <u-textarea
          v-model="formData.remark"
          placeholder="请输入维保详细说明、更换配件、注意事项等"
          :maxlength="500"
          count
        />
      </view>

      <!-- 下次维保提醒 -->
      <view class="form-section">
        <view class="section-title">下次维保提醒</view>
        <view class="reminder-row">
          <text class="reminder-label">里程提醒</text>
          <input
            v-model.number="formData.nextMileage"
            type="number"
            class="reminder-input"
            placeholder="下次维保里程"
          />
          <text class="reminder-unit">km</text>
        </view>
        <view class="reminder-row">
          <text class="reminder-label">时间提醒</text>
          <picker
            mode="date"
            :value="formData.nextDate"
            @change="handleNextDateChange"
          >
            <view class="reminder-picker">
              <text :class="{ placeholder: !formData.nextDate }">
                {{ formData.nextDate || '选择日期' }}
              </text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <button class="action-btn" @click="handleCancel">
          取消
        </button>
        <button class="action-btn primary" type="primary" @click="handleSubmit">
          保存记录
        </button>
      </view>
    </view>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :message="dialogMessage"
      :type="dialogType"
      @confirm="handleDialogConfirm"
    />
  </view>
</template>

<script>
import { getVehicleDetail } from '@/api/vehicle'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

export default {
  components: {
    LoadingSpinner,
    ImageUploader,
    ConfirmDialog
  },

  data() {
    return {
      vehicleId: null,
      vehicle: {},
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogType: 'default',

      // 表单数据
      formData: {
        type: 'maintenance',
        date: '',
        mileage: 0,
        items: [],
        cost: 0,
        organization: '',
        technician: '',
        photos: [],
        remark: '',
        nextMileage: 0,
        nextDate: ''
      },

      // 维保类型
      maintenanceTypes: [
        { value: 'maintenance', label: '常规保养', icon: '🔧' },
        { value: 'repair', label: '维修', icon: '🔨' },
        { value: 'inspection', label: '年检', icon: '📋' },
        { value: 'insurance', label: '保险', icon: '🛡️' },
        { value: 'cleaning', label: '清洁美容', icon: '✨' },
        { value: 'other', label: '其他', icon: '📝' }
      ],

      // 维保项目
      maintenanceItems: [
        { value: 'oil', label: '更换机油' },
        { value: 'filter', label: '更换滤芯' },
        { value: 'brake', label: '刹车系统' },
        { value: 'tire', label: '轮胎检查' },
        { value: 'battery', label: '电瓶检查' },
        { value: 'aircon', label: '空调系统' },
        { value: 'engine', label: '发动机检查' },
        { value: 'transmission', label: '变速箱' },
        { value: 'suspension', label: '悬挂系统' },
        { value: 'lights', label: '灯光系统' },
        { value: 'body', label: '车身修复' },
        { value: 'interior', label: '内饰维护' }
      ]
    }
  },

  onLoad(options) {
    if (options.id) {
      this.vehicleId = options.id
      this.loadVehicleDetail()
    }

    // 设置默认日期为今天
    const today = new Date()
    this.formData.date = this.formatDate(today)
  },

  methods: {
    async loadVehicleDetail() {
      this.loading = true
      try {
        const data = await getVehicleDetail(this.vehicleId)
        this.vehicle = data

        // 预填当前里程
        this.formData.mileage = data.mileage || 0
      } catch (error) {
        console.error('加载车辆详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    handleDateChange(e) {
      this.formData.date = e.detail.value
    },

    handleNextDateChange(e) {
      this.formData.nextDate = e.detail.value
    },

    toggleItem(value) {
      const index = this.formData.items.indexOf(value)
      if (index > -1) {
        this.formData.items.splice(index, 1)
      } else {
        this.formData.items.push(value)
      }
    },

    handleCancel() {
      this.dialogTitle = '取消添加'
      this.dialogMessage = '确定要取消添加维保记录吗？已填写的内容将不会保存。'
      this.dialogType = 'default'
      this.dialogVisible = true
    },

    handleSubmit() {
      // 验证必填项
      if (!this.validateForm()) {
        return
      }

      this.dialogTitle = '保存记录'
      this.dialogMessage = '确认保存维保记录吗？'
      this.dialogType = 'default'
      this.dialogVisible = true
    },

    validateForm() {
      // 检查维保日期
      if (!this.formData.date) {
        uni.showToast({
          title: '请选择维保日期',
          icon: 'none'
        })
        return false
      }

      // 检查维保里程
      if (!this.formData.mileage || this.formData.mileage <= 0) {
        uni.showToast({
          title: '请输入维保里程',
          icon: 'none'
        })
        return false
      }

      // 检查维保项目
      if (this.formData.items.length === 0) {
        uni.showToast({
          title: '请至少选择一个维保项目',
          icon: 'none'
        })
        return false
      }

      // 检查维保费用
      if (!this.formData.cost || this.formData.cost <= 0) {
        uni.showToast({
          title: '请输入维保费用',
          icon: 'none'
        })
        return false
      }

      return true
    },

    async handleDialogConfirm() {
      if (this.dialogTitle === '取消添加') {
        uni.navigateBack()
      } else if (this.dialogTitle === '保存记录') {
        await this.submitMaintenance()
      }
    },

    async submitMaintenance() {
      try {
        uni.showLoading({
          title: '保存中...'
        })

        // TODO: 调用API提交维保记录
        // await addMaintenanceRecord(this.vehicleId, this.formData)

        // Mock延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        uni.hideLoading()

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        console.error('保存维保记录失败:', error)
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.maintenance-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.maintenance-form {
  padding: 20rpx;
}

/* 信息区块 */
.info-section,
.form-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.required {
  color: #f56c6c;
  margin-left: 8rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.label {
  color: #999;
}

.value {
  color: #333;
  font-weight: 500;
}

/* 类型选择器 */
.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 16rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.type-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.type-icon {
  font-size: 40rpx;
}

.type-text {
  font-size: 24rpx;
  color: #333;
}

.type-item.active .type-text {
  color: #1890ff;
  font-weight: bold;
}

/* 选择器字段 */
.picker-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 输入框 */
.input-field {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.textarea-field {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

/* 项目选择器 */
.items-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.item-tag {
  padding: 16rpx 28rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.item-tag.active {
  background: #e6f7ff;
  color: #1890ff;
  border-color: #1890ff;
}

/* 提醒设置 */
.reminder-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.reminder-row:last-child {
  margin-bottom: 0;
}

.reminder-label {
  font-size: 28rpx;
  color: #666;
  min-width: 140rpx;
}

.reminder-input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.reminder-unit {
  font-size: 28rpx;
  color: #999;
}

.reminder-picker {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70rpx;
  padding: 0 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
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

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}
</style>
