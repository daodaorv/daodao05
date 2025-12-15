<template>
  <view class="self-use-review-page">
    <!-- 加载状态 -->
    <u-loading-page :loading="loading" loading-text="加载中..." />

    <view v-if="!loading && applicationData" class="content">
      <!-- 申请状态 -->
      <view class="status-card">
        <view class="status-header">
          <text class="application-no">{{ applicationData.applicationNo }}</text>
          <u-tag
            :text="applicationData.statusText"
            :type="getStatusType(applicationData.status)"
            size="large"
          />
        </view>
        <view v-if="applicationData.reviewTime" class="review-info">
          <text class="review-time">审核时间：{{ applicationData.reviewTime }}</text>
          <text class="review-by">审核人：{{ applicationData.reviewBy }}</text>
          <text v-if="applicationData.reviewComment" class="review-comment">
            审核意见：{{ applicationData.reviewComment }}
          </text>
        </view>
      </view>

      <!-- 车主信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="account" size="20" />
          <text>车主信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">车主姓名</text>
            <text class="value">{{ applicationData.ownerName }}</text>
          </view>
          <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value">{{ applicationData.ownerPhone }}</text>
          </view>
          <view class="info-row">
            <text class="label">申请时间</text>
            <text class="value">{{ applicationData.createTime }}</text>
          </view>
        </view>
      </view>

      <!-- 车辆信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="car" size="20" />
          <text>车辆信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">品牌型号</text>
            <text class="value">{{ applicationData.vehicleInfo.brand }} {{ applicationData.vehicleInfo.model }}</text>
          </view>
          <view class="info-row">
            <text class="label">车牌号码</text>
            <text class="value">{{ applicationData.vehicleInfo.plate }}</text>
          </view>
          <view class="info-row">
            <text class="label">当前状态</text>
            <text class="value">{{ applicationData.vehicleInfo.currentStatusText }}</text>
            <u-tag
              :text="applicationData.vehicleInfo.currentStatusText"
              :type="getVehicleStatusType(applicationData.vehicleInfo.currentStatus)"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
          <view class="info-row">
            <text class="label">当前位置</text>
            <text class="value">{{ applicationData.vehicleInfo.currentLocation }}</text>
          </view>
        </view>
      </view>

      <!-- 使用信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="calendar" size="20" />
          <text>使用信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">开始日期</text>
            <text class="value">{{ applicationData.useInfo.startDate }}</text>
          </view>
          <view class="info-row">
            <text class="label">结束日期</text>
            <text class="value">{{ applicationData.useInfo.endDate }}</text>
          </view>
          <view class="info-row">
            <text class="label">使用天数</text>
            <text class="value highlight">{{ applicationData.useInfo.days }}天</text>
          </view>
          <view class="info-row">
            <text class="label">取车门店</text>
            <text class="value">{{ applicationData.useInfo.pickupStore }}</text>
          </view>
          <view class="info-row">
            <text class="label">还车门店</text>
            <text class="value">{{ applicationData.useInfo.returnStore }}</text>
            <u-tag
              v-if="applicationData.useInfo.pickupStore !== applicationData.useInfo.returnStore"
              text="异地还车"
              type="warning"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="wallet" size="20" />
          <text>费用信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">服务费</text>
            <text class="value">¥{{ applicationData.fees.serviceFee }}</text>
          </view>
          <view class="info-row">
            <text class="label">附加费用</text>
            <text class="value">¥{{ applicationData.fees.extraFee }}</text>
          </view>
          <view class="info-row">
            <text class="label">总费用</text>
            <text class="value highlight">¥{{ applicationData.fees.totalFee }}</text>
          </view>
          <view v-if="applicationData.remark" class="info-row">
            <text class="label">备注说明</text>
            <text class="value">{{ applicationData.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 状态检查 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="checkmark-circle" size="20" />
          <text>状态检查</text>
        </view>
        <view class="qualification-card">
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="vehicleAvailable ? 'checkmark-circle' : 'close-circle'" :color="vehicleAvailable ? '#19be6b' : '#fa3534'" size="18" />
              <text>车辆可用性</text>
            </view>
            <text :class="['qualification-value', vehicleAvailable ? 'pass' : 'fail']">
              {{ vehicleAvailable ? '车辆可用' : '车辆不可用' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="locationMatch ? 'checkmark-circle' : 'close-circle'" :color="locationMatch ? '#19be6b' : '#fa3534'" size="18" />
              <text>位置匹配</text>
            </view>
            <text :class="['qualification-value', locationMatch ? 'pass' : 'fail']">
              {{ locationMatch ? '位置匹配' : '位置不匹配' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="!hasConflict ? 'checkmark-circle' : 'close-circle'" :color="!hasConflict ? '#19be6b' : '#fa3534'" size="18" />
              <text>时间冲突</text>
            </view>
            <text :class="['qualification-value', !hasConflict ? 'pass' : 'fail']">
              {{ hasConflict ? '有冲突' : '无冲突' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="dateValid ? 'checkmark-circle' : 'close-circle'" :color="dateValid ? '#19be6b' : '#fa3534'" size="18" />
              <text>日期合理性</text>
            </view>
            <text :class="['qualification-value', dateValid ? 'pass' : 'fail']">
              {{ dateValid ? '日期合理' : '日期不合理' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 风险提示 -->
      <view v-if="hasRisk" class="risk-section">
        <view class="risk-card">
          <view class="risk-header">
            <u-icon name="error-circle" color="#ff9900" size="20" />
            <text>风险提示</text>
          </view>
          <view class="risk-list">
            <text v-if="!vehicleAvailable" class="risk-item">• 车辆当前状态不可用，无法满足自用需求</text>
            <text v-if="!locationMatch" class="risk-item">• 车辆当前位置与取车门店不匹配</text>
            <text v-if="hasConflict" class="risk-item">• 使用时间与现有订单或维保计划冲突</text>
            <text v-if="!dateValid" class="risk-item">• 使用日期不合理（开始日期早于当前日期或结束日期早于开始日期）</text>
            <text v-if="applicationData.useInfo.pickupStore !== applicationData.useInfo.returnStore" class="risk-item">• 异地还车需要额外协调车辆调度</text>
          </view>
        </view>
      </view>

      <!-- 审核操作 (仅待审核状态显示) -->
      <view v-if="applicationData.status === 'pending'" class="review-section">
        <view class="section-title">
          <u-icon name="edit-pen" size="20" />
          <text>审核操作</text>
        </view>
        <view class="review-form">
          <view class="form-item">
            <text class="form-label">审核意见</text>
            <u-textarea
              v-model="reviewForm.comment"
              placeholder="请填写审核意见（必填）"
              :maxlength="500"
              count
              height="200"
            />
          </view>
          <view class="form-item">
            <text class="form-label">审核决策</text>
            <u-radio-group v-model="reviewForm.approved">
              <u-radio
                :name="true"
                label="通过审核"
                label-size="16"
              />
              <u-radio
                :name="false"
                label="拒绝申请"
                label-size="16"
              />
            </u-radio-group>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 (仅待审核状态显示) -->
    <view v-if="!loading && applicationData && applicationData.status === 'pending'" class="footer-bar">
      <u-button
        type="default"
        size="large"
        @click="handleCancel"
      >
        取消
      </u-button>
      <u-button
        type="primary"
        size="large"
        :loading="submitting"
        @click="handleSubmit"
      >
        提交审核
      </u-button>
    </view>
  </view>
</template>

<script>
import { getSelfUseDetail, submitSelfUseReview } from '@/api/hosting'

export default {
  data() {
    return {
      // 申请ID
      applicationId: null,

      // 申请数据
      applicationData: null,

      // 审核表单
      reviewForm: {
        approved: true,
        comment: ''
      },

      // 加载状态
      loading: false,
      submitting: false
    }
  },

  computed: {
    // 车辆是否可用
    vehicleAvailable() {
      if (!this.applicationData) return false
      return this.applicationData.vehicleInfo.currentStatus === 'available'
    },

    // 位置是否匹配
    locationMatch() {
      if (!this.applicationData) return false
      return this.applicationData.vehicleInfo.currentLocation === this.applicationData.useInfo.pickupStore
    },

    // 是否有时间冲突 (Mock数据中假设无冲突)
    hasConflict() {
      return false
    },

    // 日期是否合理
    dateValid() {
      if (!this.applicationData) return false
      const now = new Date()
      const startDate = new Date(this.applicationData.useInfo.startDate)
      const endDate = new Date(this.applicationData.useInfo.endDate)
      return startDate >= now && endDate > startDate
    },

    // 是否有风险
    hasRisk() {
      return !this.vehicleAvailable || !this.locationMatch || this.hasConflict || !this.dateValid ||
        this.applicationData.useInfo.pickupStore !== this.applicationData.useInfo.returnStore
    }
  },

  onLoad(options) {
    if (options.id) {
      this.applicationId = options.id
      this.loadApplicationDetail()
    } else {
      uni.showToast({
        title: '缺少申请ID',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  },

  methods: {
    // 加载申请详情
    async loadApplicationDetail() {
      this.loading = true

      try {
        const res = await getSelfUseDetail(this.applicationId)

        if (res.code === 200) {
          this.applicationData = res.data
        } else {
          uni.showToast({
            title: res.message || '加载失败',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (error) {
        console.error('加载申请详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } finally {
        this.loading = false
      }
    },

    // 获取状态类型
    getStatusType(status) {
      const typeMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error'
      }
      return typeMap[status] || 'default'
    },

    // 获取车辆状态类型
    getVehicleStatusType(status) {
      const typeMap = {
        available: 'success',
        in_use: 'warning',
        maintenance: 'error'
      }
      return typeMap[status] || 'default'
    },

    // 取消
    handleCancel() {
      uni.navigateBack()
    },

    // 提交审核
    handleSubmit() {
      // 验证审核意见
      if (!this.reviewForm.comment.trim()) {
        uni.showToast({
          title: '请填写审核意见',
          icon: 'none'
        })
        return
      }

      // 二次确认
      const action = this.reviewForm.approved ? '通过' : '拒绝'
      uni.showModal({
        title: '确认提交',
        content: `确定要${action}该申请吗？`,
        success: (res) => {
          if (res.confirm) {
            this.submitReview()
          }
        }
      })
    },

    // 提交审核
    async submitReview() {
      this.submitting = true

      try {
        const res = await submitSelfUseReview(this.applicationId, this.reviewForm)

        if (res.code === 200) {
          const action = this.reviewForm.approved ? '通过' : '拒绝'
          uni.showToast({
            title: `审核${action}成功`,
            icon: 'success'
          })

          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: res.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('提交审核失败:', error)
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.self-use-review-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.content {
  padding: 20rpx;
}

.status-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.application-no {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.review-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
  font-size: 26rpx;
  color: #666;

  .review-comment {
    color: #333;
    line-height: 1.6;
  }
}

.info-section {
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 26rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    color: #999;
    min-width: 160rpx;
  }

  .value {
    flex: 1;
    text-align: right;
    color: #333;

    &.highlight {
      color: #ff6b00;
      font-weight: 600;
      font-size: 28rpx;
    }
  }
}

.qualification-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.qualification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.qualification-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: #333;
}

.qualification-value {
  font-size: 26rpx;

  &.pass {
    color: #19be6b;
  }

  &.fail {
    color: #fa3534;
  }
}

.risk-section {
  margin-bottom: 20rpx;
}

.risk-card {
  background-color: #fff7e6;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid #ffd591;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #ff9900;
  margin-bottom: 16rpx;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.risk-item {
  font-size: 26rpx;
  color: #ff9900;
  line-height: 1.6;
}

.review-section {
  margin-bottom: 20rpx;
}

.review-form {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
