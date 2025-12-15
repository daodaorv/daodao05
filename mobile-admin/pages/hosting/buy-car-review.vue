<template>
  <view class="buy-car-review-page">
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

      <!-- 申请人信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="account" size="20" />
          <text>申请人信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">申请人姓名</text>
            <text class="value">{{ applicationData.applicantName }}</text>
          </view>
          <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value">{{ applicationData.applicantPhone }}</text>
          </view>
          <view class="info-row">
            <text class="label">身份证号</text>
            <text class="value">{{ applicationData.applicantIdCard }}</text>
          </view>
          <view class="info-row">
            <text class="label">年龄</text>
            <text class="value">{{ applicationData.age }}岁</text>
            <u-tag
              v-if="applicationData.age < 22"
              text="年龄不符"
              type="error"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
          <view class="info-row">
            <text class="label">申请时间</text>
            <text class="value">{{ applicationData.createTime }}</text>
          </view>
        </view>
      </view>

      <!-- 选择车型 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="car" size="20" />
          <text>选择车型</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">品牌型号</text>
            <text class="value">{{ applicationData.selectedVehicle.brand }} {{ applicationData.selectedVehicle.model }}</text>
          </view>
          <view class="info-row">
            <text class="label">车辆价格</text>
            <text class="value highlight">¥{{ applicationData.selectedVehicle.price.toLocaleString() }}</text>
          </view>
          <view class="info-row">
            <text class="label">首付金额</text>
            <text class="value">¥{{ applicationData.selectedVehicle.downPayment.toLocaleString() }}</text>
          </view>
          <view class="info-row">
            <text class="label">贷款金额</text>
            <text class="value">¥{{ applicationData.selectedVehicle.loanAmount.toLocaleString() }}</text>
          </view>
          <view class="info-row">
            <text class="label">首付比例</text>
            <text class="value">{{ ((applicationData.selectedVehicle.downPayment / applicationData.selectedVehicle.price) * 100).toFixed(0) }}%</text>
          </view>
        </view>
      </view>

      <!-- 分期方案 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="calendar" size="20" />
          <text>分期方案</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">分期期数</text>
            <text class="value">{{ applicationData.installmentPlan.period }}期</text>
          </view>
          <view class="info-row">
            <text class="label">月供金额</text>
            <text class="value highlight">¥{{ applicationData.installmentPlan.monthlyPayment.toLocaleString() }}/月</text>
          </view>
          <view class="info-row">
            <text class="label">总利息</text>
            <text class="value">¥{{ applicationData.installmentPlan.totalInterest.toLocaleString() }}</text>
          </view>
          <view class="info-row">
            <text class="label">总还款额</text>
            <text class="value">¥{{ (applicationData.selectedVehicle.loanAmount + applicationData.installmentPlan.totalInterest).toLocaleString() }}</text>
          </view>
        </view>
      </view>

      <!-- 收入证明 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="wallet" size="20" />
          <text>收入证明</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">月收入</text>
            <text class="value highlight">¥{{ applicationData.incomeProof.monthlyIncome.toLocaleString() }}</text>
          </view>
          <view class="info-row">
            <text class="label">工作单位</text>
            <text class="value">{{ applicationData.incomeProof.workUnit }}</text>
          </view>
          <view class="info-row">
            <text class="label">职位</text>
            <text class="value">{{ applicationData.incomeProof.position }}</text>
          </view>
          <view class="info-row">
            <text class="label">工作年限</text>
            <text class="value">{{ applicationData.incomeProof.workYears }}年</text>
          </view>
          <view class="info-row">
            <text class="label">收入负债比</text>
            <text class="value">{{ incomeDebtRatio }}%</text>
            <u-tag
              v-if="incomeDebtRatio > 50"
              text="负债比过高"
              type="warning"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
        </view>
      </view>

      <!-- 信用信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="shield-checkmark" size="20" />
          <text>信用信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">信用评分</text>
            <text class="value">{{ applicationData.creditInfo.creditScore }}分</text>
            <u-tag
              :text="getCreditLevel(applicationData.creditInfo.creditScore)"
              :type="getCreditLevelType(applicationData.creditInfo.creditScore)"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
          <view class="info-row">
            <text class="label">是否有贷款</text>
            <text class="value">{{ applicationData.creditInfo.hasLoan ? '是' : '否' }}</text>
          </view>
          <view class="info-row">
            <text class="label">是否有逾期</text>
            <text class="value">{{ applicationData.creditInfo.hasOverdue ? '是' : '否' }}</text>
            <u-tag
              v-if="applicationData.creditInfo.hasOverdue"
              text="有风险"
              type="error"
              size="mini"
              style="margin-left: 10rpx;"
            />
          </view>
        </view>
      </view>

      <!-- 托管收益 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="trending-up" size="20" />
          <text>托管收益</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="label">预期月收益</text>
            <text class="value highlight">¥{{ applicationData.expectedIncome }}/月</text>
          </view>
          <view class="info-row">
            <text class="label">月供金额</text>
            <text class="value">¥{{ applicationData.installmentPlan.monthlyPayment.toLocaleString() }}/月</text>
          </view>
          <view class="info-row">
            <text class="label">净收益</text>
            <text :class="['value', netIncome > 0 ? 'highlight' : 'negative']">
              {{ netIncome > 0 ? '+' : '' }}¥{{ netIncome.toLocaleString() }}/月
            </text>
          </view>
          <view v-if="applicationData.remark" class="info-row">
            <text class="label">备注说明</text>
            <text class="value">{{ applicationData.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 资质评估 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="checkmark-circle" size="20" />
          <text>资质评估</text>
        </view>
        <view class="qualification-card">
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="applicationData.age >= 22 ? 'checkmark-circle' : 'close-circle'" :color="applicationData.age >= 22 ? '#19be6b' : '#fa3534'" size="18" />
              <text>年龄要求</text>
            </view>
            <text :class="['qualification-value', applicationData.age >= 22 ? 'pass' : 'fail']">
              {{ applicationData.age }}岁 {{ applicationData.age >= 22 ? '(符合要求)' : '(低于22岁)' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="applicationData.creditInfo.creditScore >= 700 ? 'checkmark-circle' : 'close-circle'" :color="applicationData.creditInfo.creditScore >= 700 ? '#19be6b' : '#fa3534'" size="18" />
              <text>信用评分</text>
            </view>
            <text :class="['qualification-value', applicationData.creditInfo.creditScore >= 700 ? 'pass' : 'fail']">
              {{ applicationData.creditInfo.creditScore }}分 {{ applicationData.creditInfo.creditScore >= 700 ? '(良好)' : '(偏低)' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="!applicationData.creditInfo.hasOverdue ? 'checkmark-circle' : 'close-circle'" :color="!applicationData.creditInfo.hasOverdue ? '#19be6b' : '#fa3534'" size="18" />
              <text>逾期记录</text>
            </view>
            <text :class="['qualification-value', !applicationData.creditInfo.hasOverdue ? 'pass' : 'fail']">
              {{ applicationData.creditInfo.hasOverdue ? '有逾期' : '无逾期' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="incomeDebtRatio <= 50 ? 'checkmark-circle' : 'close-circle'" :color="incomeDebtRatio <= 50 ? '#19be6b' : '#fa3534'" size="18" />
              <text>还款能力</text>
            </view>
            <text :class="['qualification-value', incomeDebtRatio <= 50 ? 'pass' : 'fail']">
              收入负债比 {{ incomeDebtRatio }}% {{ incomeDebtRatio <= 50 ? '(良好)' : '(偏高)' }}
            </text>
          </view>
          <view class="qualification-item">
            <view class="qualification-label">
              <u-icon :name="netIncome > 0 ? 'checkmark-circle' : 'close-circle'" :color="netIncome > 0 ? '#19be6b' : '#fa3534'" size="18" />
              <text>收益情况</text>
            </view>
            <text :class="['qualification-value', netIncome > 0 ? 'pass' : 'fail']">
              {{ netIncome > 0 ? '有净收益' : '无净收益' }}
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
import { getBuyCarDetail, submitBuyCarReview } from '@/api/hosting'

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
    // 收入负债比
    incomeDebtRatio() {
      if (!this.applicationData) return 0
      const ratio = (this.applicationData.installmentPlan.monthlyPayment / this.applicationData.incomeProof.monthlyIncome) * 100
      return ratio.toFixed(1)
    },

    // 净收益
    netIncome() {
      if (!this.applicationData) return 0
      return this.applicationData.expectedIncome - this.applicationData.installmentPlan.monthlyPayment
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
        const res = await getBuyCarDetail(this.applicationId)

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

    // 获取信用等级
    getCreditLevel(score) {
      if (score >= 800) return '优秀'
      if (score >= 700) return '良好'
      if (score >= 600) return '中等'
      return '较差'
    },

    // 获取信用等级类型
    getCreditLevelType(score) {
      if (score >= 800) return 'success'
      if (score >= 700) return 'primary'
      if (score >= 600) return 'warning'
      return 'error'
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
        const res = await submitBuyCarReview(this.applicationId, this.reviewForm)

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
.buy-car-review-page {
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

    &.negative {
      color: #fa3534;
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
