<template>
  <view class="own-car-review-page">
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
            <text class="label">身份证号</text>
            <text class="value">{{ applicationData.ownerIdCard }}</text>
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
            <text class="label">车辆年份</text>
            <text class="value">{{ applicationData.vehicleInfo.year }}年</text>
            <u-tag
              v-if="vehicleAge > 8"
              text="车龄超标"
              type="error"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
          <view class="info-row">
            <text class="label">车牌号码</text>
            <text class="value">{{ applicationData.vehicleInfo.plate }}</text>
          </view>
          <view class="info-row">
            <text class="label">车架号</text>
            <text class="value">{{ applicationData.vehicleInfo.vin }}</text>
          </view>
          <view class="info-row">
            <text class="label">行驶里程</text>
            <text class="value">{{ applicationData.vehicleInfo.mileage.toLocaleString() }} 公里</text>
          </view>
          <view class="info-row">
            <text class="label">车身颜色</text>
            <text class="value">{{ applicationData.vehicleInfo.color }}</text>
          </view>
        </view>
      </view>

      <!-- 行驶证信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="file-text" size="20" />
          <text>行驶证信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">所有人</text>
            <text class="value">{{ applicationData.licenseInfo.ownerName }}</text>
            <u-tag
              v-if="applicationData.licenseInfo.ownerName !== applicationData.ownerName"
              text="与车主不符"
              type="warning"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
          <view class="info-row">
            <text class="label">号牌号码</text>
            <text class="value">{{ applicationData.licenseInfo.plateNo }}</text>
          </view>
          <view class="info-row">
            <text class="label">车辆类型</text>
            <text class="value">{{ applicationData.licenseInfo.vehicleType }}</text>
          </view>
          <view class="info-row">
            <text class="label">注册日期</text>
            <text class="value">{{ applicationData.licenseInfo.registerDate }}</text>
          </view>
          <view class="info-row">
            <text class="label">发证日期</text>
            <text class="value">{{ applicationData.licenseInfo.issueDate }}</text>
          </view>
        </view>
      </view>

      <!-- 托管信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="calendar" size="20" />
          <text>托管信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">预期收益</text>
            <text class="value highlight">¥{{ applicationData.expectedIncome }}/月</text>
          </view>
          <view class="info-row">
            <text class="label">托管期限</text>
            <text class="value">{{ applicationData.hostingPeriod }}个月</text>
          </view>
          <view class="info-row">
            <text class="label">总收益预估</text>
            <text class="value highlight">¥{{ (applicationData.expectedIncome * applicationData.hostingPeriod).toLocaleString() }}</text>
          </view>
          <view v-if="applicationData.remark" class="info-row">
            <text class="label">备注说明</text>
            <text class="value">{{ applicationData.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 车辆照片 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="photo" size="20" />
          <text>车辆照片（{{ applicationData.photos.length }}张）</text>
        </view>
        <view class="photos-grid">
          <view
            v-for="(photo, index) in applicationData.photos"
            :key="index"
            class="photo-item"
            @click="previewPhoto(index)"
          >
            <image :src="photo" mode="aspectFill" class="photo-image" />
          </view>
        </view>
        <view class="photo-tips">
          <u-icon name="info-circle" size="14" color="#ff9900" />
          <text>至少需要12张照片：外观4张、内饰3张、细节5张</text>
        </view>
      </view>

      <!-- 资格评估 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="checkmark-circle" size="20" />
          <text>资格评估</text>
        </view>
        <view class="qualification-card">
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="vehicleAge <= 8 ? 'checkmark-circle' : 'close-circle'" :color="vehicleAge <= 8 ? '#19be6b' : '#fa3534'" size="18" />
              <text>车龄检查</text>
            </view>
            <text :class="['qualification-value', vehicleAge <= 8 ? 'pass' : 'fail']">
              {{ vehicleAge }}年 {{ vehicleAge <= 8 ? '(符合要求)' : '(超过8年)' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="applicationData.photos.length >= 12 ? 'checkmark-circle' : 'close-circle'" :color="applicationData.photos.length >= 12 ? '#19be6b' : '#fa3534'" size="18" />
              <text>照片数量</text>
            </view>
            <text :class="['qualification-value', applicationData.photos.length >= 12 ? 'pass' : 'fail']">
              {{ applicationData.photos.length }}张 {{ applicationData.photos.length >= 12 ? '(符合要求)' : '(不足12张)' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="applicationData.licenseInfo.ownerName === applicationData.ownerName ? 'checkmark-circle' : 'close-circle'" :color="applicationData.licenseInfo.ownerName === applicationData.ownerName ? '#19be6b' : '#fa3534'" size="18" />
              <text>车主信息</text>
            </view>
            <text :class="['qualification-value', applicationData.licenseInfo.ownerName === applicationData.ownerName ? 'pass' : 'fail']">
              {{ applicationData.licenseInfo.ownerName === applicationData.ownerName ? '一致' : '不一致' }}
            </text>
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
import { getOwnCarDetail, submitOwnCarReview } from '@/api/hosting'

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
    // 车龄
    vehicleAge() {
      if (!this.applicationData) return 0
      const currentYear = new Date().getFullYear()
      return currentYear - this.applicationData.vehicleInfo.year
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
        const res = await getOwnCarDetail(this.applicationId)

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

    // 预览照片
    previewPhoto(index) {
      uni.previewImage({
        urls: this.applicationData.photos,
        current: index
      })
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
        const res = await submitOwnCarReview(this.applicationId, this.reviewForm)

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
.own-car-review-page {
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

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f5f5f5;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.photo-tips {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #fff7e6;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #ff9900;
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
