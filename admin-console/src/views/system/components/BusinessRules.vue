<template>
  <div class="business-rules">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="180px"
    >
      <!-- 订单规则 -->
      <div class="config-section">
        <h3 class="section-title">订单规则</h3>
        <el-form-item label="订单自动取消时间" prop="orderAutoCancelTime">
          <el-input-number
            v-model="form.orderAutoCancelTime"
            :min="5"
            :max="120"
            :step="5"
          />
          <span class="form-tip">分钟（未支付订单）</span>
        </el-form-item>
        <el-form-item label="订单自动完成时间" prop="orderAutoCompleteTime">
          <el-input-number
            v-model="form.orderAutoCompleteTime"
            :min="1"
            :max="30"
            :step="1"
          />
          <span class="form-tip">天（还车后）</span>
        </el-form-item>
        <el-form-item label="订单可取消时间" prop="orderCancelableTime">
          <el-input-number
            v-model="form.orderCancelableTime"
            :min="1"
            :max="72"
            :step="1"
          />
          <span class="form-tip">小时（取车前）</span>
        </el-form-item>
        <el-form-item label="订单可评价时间" prop="orderReviewableTime">
          <el-input-number
            v-model="form.orderReviewableTime"
            :min="1"
            :max="30"
            :step="1"
          />
          <span class="form-tip">天（订单完成后）</span>
        </el-form-item>
      </div>

      <!-- 租赁规则 -->
      <div class="config-section">
        <h3 class="section-title">租赁规则</h3>
        <el-form-item label="最短租赁天数" prop="minRentalDays">
          <el-input-number
            v-model="form.minRentalDays"
            :min="1"
            :max="7"
            :step="1"
          />
          <span class="form-tip">天</span>
        </el-form-item>
        <el-form-item label="最长租赁天数" prop="maxRentalDays">
          <el-input-number
            v-model="form.maxRentalDays"
            :min="7"
            :max="365"
            :step="1"
          />
          <span class="form-tip">天</span>
        </el-form-item>
        <el-form-item label="提前预订天数" prop="advanceBookingDays">
          <el-input-number
            v-model="form.advanceBookingDays"
            :min="0"
            :max="180"
            :step="1"
          />
          <span class="form-tip">天（最多提前）</span>
        </el-form-item>
        <el-form-item label="最晚取车时间" prop="latestPickupTime">
          <el-time-picker
            v-model="form.latestPickupTime"
            format="HH:mm"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="超时费用标准" prop="overtimeFeeRate">
          <el-input-number
            v-model="form.overtimeFeeRate"
            :min="0"
            :max="1000"
            :step="10"
            :precision="2"
          />
          <span class="form-tip">元/小时</span>
        </el-form-item>
      </div>

      <!-- 押金规则 -->
      <div class="config-section">
        <h3 class="section-title">押金规则</h3>
        <el-form-item label="基础押金金额" prop="baseDepositAmount">
          <el-input-number
            v-model="form.baseDepositAmount"
            :min="0"
            :max="50000"
            :step="1000"
          />
          <span class="form-tip">元</span>
        </el-form-item>
        <el-form-item label="押金退还时间" prop="depositRefundTime">
          <el-input-number
            v-model="form.depositRefundTime"
            :min="1"
            :max="30"
            :step="1"
          />
          <span class="form-tip">天（还车后）</span>
        </el-form-item>
        <el-form-item label="违章押金扣除" prop="violationDepositDeduction">
          <el-switch
            v-model="form.violationDepositDeduction"
            active-text="开启"
            inactive-text="关闭"
          />
          <span class="form-tip">发现违章时自动从押金扣除</span>
        </el-form-item>
      </div>

      <!-- 优惠券规则 -->
      <div class="config-section">
        <h3 class="section-title">优惠券规则</h3>
        <el-form-item label="优惠券叠加使用" prop="couponStackable">
          <el-switch
            v-model="form.couponStackable"
            active-text="允许"
            inactive-text="不允许"
          />
        </el-form-item>
        <el-form-item label="最多叠加数量" prop="maxCouponStack">
          <el-input-number
            v-model="form.maxCouponStack"
            :min="1"
            :max="5"
            :step="1"
            :disabled="!form.couponStackable"
          />
          <span class="form-tip">张</span>
        </el-form-item>
        <el-form-item label="优惠券过期提醒" prop="couponExpiryReminder">
          <el-input-number
            v-model="form.couponExpiryReminder"
            :min="1"
            :max="30"
            :step="1"
          />
          <span class="form-tip">天（过期前）</span>
        </el-form-item>
      </div>

      <!-- 众筹规则 -->
      <div class="config-section">
        <h3 class="section-title">众筹规则</h3>
        <el-form-item label="最小众筹金额" prop="minCrowdfundingAmount">
          <el-input-number
            v-model="form.minCrowdfundingAmount"
            :min="1000"
            :max="100000"
            :step="1000"
          />
          <span class="form-tip">元</span>
        </el-form-item>
        <el-form-item label="最小份额购买数" prop="minSharePurchase">
          <el-input-number
            v-model="form.minSharePurchase"
            :min="1"
            :max="100"
            :step="1"
          />
          <span class="form-tip">份</span>
        </el-form-item>
        <el-form-item label="份额转让手续费" prop="shareTransferFeeRate">
          <el-input-number
            v-model="form.shareTransferFeeRate"
            :min="0"
            :max="10"
            :step="0.1"
            :precision="1"
          />
          <span class="form-tip">%</span>
        </el-form-item>
        <el-form-item label="众筹项目审核" prop="crowdfundingReview">
          <el-switch
            v-model="form.crowdfundingReview"
            active-text="需要审核"
            inactive-text="自动通过"
          />
        </el-form-item>
      </div>

      <!-- 分润规则 -->
      <div class="config-section">
        <h3 class="section-title">分润规则</h3>
        <el-form-item label="平台分润比例" prop="platformProfitRate">
          <el-input-number
            v-model="form.platformProfitRate"
            :min="0"
            :max="50"
            :step="1"
            :precision="1"
          />
          <span class="form-tip">%</span>
        </el-form-item>
        <el-form-item label="门店分润比例" prop="storeProfitRate">
          <el-input-number
            v-model="form.storeProfitRate"
            :min="0"
            :max="50"
            :step="1"
            :precision="1"
          />
          <span class="form-tip">%</span>
        </el-form-item>
        <el-form-item label="推广分润比例" prop="promotionProfitRate">
          <el-input-number
            v-model="form.promotionProfitRate"
            :min="0"
            :max="20"
            :step="1"
            :precision="1"
          />
          <span class="form-tip">%</span>
        </el-form-item>
        <el-form-item label="分润结算周期" prop="profitSettlementCycle">
          <el-select v-model="form.profitSettlementCycle" placeholder="请选择">
            <el-option label="每日结算" value="daily" />
            <el-option label="每周结算" value="weekly" />
            <el-option label="每月结算" value="monthly" />
          </el-select>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存配置
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  // 订单规则
  orderAutoCancelTime: 30,
  orderAutoCompleteTime: 7,
  orderCancelableTime: 24,
  orderReviewableTime: 15,

  // 租赁规则
  minRentalDays: 1,
  maxRentalDays: 90,
  advanceBookingDays: 90,
  latestPickupTime: new Date(2024, 0, 1, 20, 0),
  overtimeFeeRate: 50,

  // 押金规则
  baseDepositAmount: 5000,
  depositRefundTime: 7,
  violationDepositDeduction: true,

  // 优惠券规则
  couponStackable: true,
  maxCouponStack: 3,
  couponExpiryReminder: 7,

  // 众筹规则
  minCrowdfundingAmount: 10000,
  minSharePurchase: 1,
  shareTransferFeeRate: 2.0,
  crowdfundingReview: true,

  // 分润规则
  platformProfitRate: 20,
  storeProfitRate: 30,
  promotionProfitRate: 5,
  profitSettlementCycle: 'monthly',
})

const formRules: FormRules = {
  orderAutoCancelTime: [
    { required: true, message: '请设置订单自动取消时间', trigger: 'blur' },
  ],
  minRentalDays: [
    { required: true, message: '请设置最短租赁天数', trigger: 'blur' },
  ],
  baseDepositAmount: [
    { required: true, message: '请设置基础押金金额', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      // TODO: 调用保存配置API
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('业务规则保存成功')
    } catch (error) {
      ElMessage.error('业务规则保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.business-rules {
  .config-section {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-left: 10px;
      border-left: 3px solid #409eff;
    }
  }

  .form-tip {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
