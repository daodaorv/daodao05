<template>
  <el-dialog
    v-model="visible"
    title="还车管理"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <!-- 订单信息 -->
      <el-card class="info-card" shadow="never">
        <template #header><span class="card-title">订单信息</span></template>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <span class="label">订单号：</span>
              <span class="value">{{ orderInfo?.orderNo }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">用户：</span>
              <span class="value">{{ orderInfo?.userName }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">车辆：</span>
              <span class="value">{{ orderInfo?.vehicleName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <span class="label">取车里程：</span>
              <span class="value">{{ pickupRecord?.vehicleCondition?.mileage || 0 }} 公里</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">取车油量：</span>
              <span class="value">{{ pickupRecord?.vehicleCondition?.fuelLevel || 0 }}%</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="label">租赁天数：</span>
              <span class="value">{{ orderInfo?.days || 0 }} 天</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 车辆状况检查 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">车辆状况检查</span></template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="还车里程" prop="vehicleCondition.mileage">
              <el-input-number
                v-model="form.vehicleCondition.mileage"
                :min="pickupRecord?.vehicleCondition?.mileage || 0"
                :max="999999"
                :precision="0"
                placeholder="请输入还车里程"
                style="width: 100%"
              >
                <template #append>公里</template>
              </el-input-number>
              <div class="field-tip">
                行驶里程：{{ traveledMileage }} 公里
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还车油量" prop="vehicleCondition.fuelLevel">
              <el-slider
                v-model="form.vehicleCondition.fuelLevel"
                :min="0"
                :max="100"
                :step="10"
                :marks="fuelMarks"
                show-stops
              />
              <div class="field-tip" :class="{ 'text-warning': fuelDifference < 0 }">
                油量差异：{{ fuelDifference > 0 ? '+' : '' }}{{ fuelDifference }}%
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 车辆照片上传 -->
        <el-form-item label="车辆外观照片" prop="vehicleCondition.exterior">
          <div class="upload-section">
            <div class="upload-tip">请拍摄车辆前、后、左、右四个角度的照片</div>
            <el-upload
              v-model:file-list="form.vehicleCondition.exterior"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="4"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="车辆内饰照片" prop="vehicleCondition.interior">
          <div class="upload-section">
            <div class="upload-tip">请拍摄车辆内饰整体照片</div>
            <el-upload
              v-model:file-list="form.vehicleCondition.interior"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="2"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="仪表盘照片" prop="vehicleCondition.dashboard">
          <div class="upload-section">
            <div class="upload-tip">请拍摄仪表盘清晰照片，确保里程数可见</div>
            <el-upload
              v-model:file-list="form.vehicleCondition.dashboard"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>
      </el-card>

      <!-- 车辆损坏登记 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header-with-action">
            <span class="card-title">车辆损坏登记</span>
            <el-button type="primary" size="small" @click="handleAddDamage">添加损坏项</el-button>
          </div>
        </template>

        <el-empty v-if="form.damages.length === 0" description="暂无损坏记录" :image-size="80" />

        <div v-else class="damage-list">
          <el-card
            v-for="(damage, index) in form.damages"
            :key="index"
            class="damage-item"
            shadow="hover"
          >
            <template #header>
              <div class="damage-header">
                <span>损坏项 {{ index + 1 }}</span>
                <el-button type="danger" size="small" text @click="handleRemoveDamage(index)">
                  删除
                </el-button>
              </div>
            </template>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="`损坏类型`" :prop="`damages.${index}.type`">
                  <el-select v-model="damage.type" placeholder="请选择损坏类型" style="width: 100%">
                    <el-option label="车身划痕" value="scratch" />
                    <el-option label="车身凹陷" value="dent" />
                    <el-option label="玻璃破损" value="glass_damage" />
                    <el-option label="轮胎损坏" value="tire_damage" />
                    <el-option label="内饰损坏" value="interior_damage" />
                    <el-option label="设备故障" value="equipment_failure" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`预估费用`" :prop="`damages.${index}.estimatedCost`">
                  <el-input-number
                    v-model="damage.estimatedCost"
                    :min="0"
                    :max="999999"
                    :precision="2"
                    placeholder="请输入预估费用"
                    style="width: 100%"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="`损坏描述`" :prop="`damages.${index}.description`">
              <el-input
                v-model="damage.description"
                type="textarea"
                :rows="2"
                placeholder="请详细描述损坏情况"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item :label="`损坏照片`" :prop="`damages.${index}.photos`">
              <el-upload
                v-model:file-list="damage.photos"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :limit="5"
                accept="image/*"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-card>
        </div>
      </el-card>

      <!-- 费用结算 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">费用结算</span></template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="超时费用">
              <el-input-number
                v-model="form.additionalFees.overtimeFee"
                :min="0"
                :max="999999"
                :precision="2"
                placeholder="超时费用"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
              <div class="field-tip">
                {{ overtimeTip }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="油费补偿">
              <el-input-number
                v-model="form.additionalFees.fuelFee"
                :min="0"
                :max="999999"
                :precision="2"
                placeholder="油费补偿"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
              <div class="field-tip" :class="{ 'text-warning': fuelDifference < 0 }">
                {{ fuelFeeTip }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="清洁费用">
              <el-input-number
                v-model="form.additionalFees.cleaningFee"
                :min="0"
                :max="999999"
                :precision="2"
                placeholder="清洁费用"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="损坏费用">
              <el-input-number
                v-model="form.additionalFees.damageFee"
                :min="0"
                :max="999999"
                :precision="2"
                :disabled="true"
                placeholder="损坏费用"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
              <div class="field-tip">
                自动计算：{{ totalDamageCost.toFixed(2) }} 元
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 费用汇总 -->
        <el-divider />
        <div class="fee-summary">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="summary-item">
                <span class="summary-label">订单押金：</span>
                <span class="summary-value">¥{{ orderInfo?.depositAmount?.toFixed(2) || '0.00' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="summary-item">
                <span class="summary-label">额外费用合计：</span>
                <span class="summary-value text-danger">¥{{ totalAdditionalFees.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="summary-item">
                <span class="summary-label">应退押金：</span>
                <span class="summary-value text-success">¥{{ depositRefund.toFixed(2) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="summary-item" v-if="depositRefund < 0">
                <span class="summary-label">需补缴费用：</span>
                <span class="summary-value text-danger">¥{{ Math.abs(depositRefund).toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 费用处理方式 -->
        <el-divider />
        <el-form-item
          label="费用处理方式"
          prop="paymentMethod"
          v-if="totalAdditionalFees > 0"
        >
          <el-radio-group v-model="form.paymentMethod">
            <el-radio value="deposit_deduction">
              <div class="payment-option">
                <span class="option-title">押金扣取</span>
                <span class="option-desc">从押金中直接扣除费用，退款时自动减扣</span>
              </div>
            </el-radio>
            <el-radio value="user_payment">
              <div class="payment-option">
                <span class="option-title">用户支付</span>
                <span class="option-desc">发起支付让用户在小程序端完成，或生成收款码扫码支付</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 用户支付方式选择 -->
        <el-form-item
          label="支付方式"
          prop="userPaymentType"
          v-if="form.paymentMethod === 'user_payment' && totalAdditionalFees > 0"
        >
          <el-radio-group v-model="form.userPaymentType">
            <el-radio value="miniprogram">
              <div class="payment-option">
                <span class="option-title">小程序支付</span>
                <span class="option-desc">发起支付订单，用户在小程序端完成支付</span>
              </div>
            </el-radio>
            <el-radio value="qrcode">
              <div class="payment-option">
                <span class="option-title">扫码支付</span>
                <span class="option-desc">生成收款二维码，用户扫码完成支付</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 支付提示 -->
        <el-alert
          v-if="form.paymentMethod === 'deposit_deduction' && totalAdditionalFees > 0"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <div class="payment-tip">
              <p>押金扣取说明：</p>
              <ul>
                <li>额外费用 ¥{{ totalAdditionalFees.toFixed(2) }} 将从押金中扣除</li>
                <li>实际退还押金：¥{{ depositRefund.toFixed(2) }}</li>
                <li v-if="depositRefund < 0">押金不足，需用户补缴：¥{{ Math.abs(depositRefund).toFixed(2) }}</li>
                <li>押金退款将在还车确认后自动发起</li>
              </ul>
            </div>
          </template>
        </el-alert>

        <el-alert
          v-if="form.paymentMethod === 'user_payment' && totalAdditionalFees > 0"
          type="warning"
          :closable="false"
          show-icon
        >
          <template #default>
            <div class="payment-tip">
              <p>用户支付说明：</p>
              <ul>
                <li v-if="form.userPaymentType === 'miniprogram'">将发起支付订单，用户需在小程序端完成支付</li>
                <li v-if="form.userPaymentType === 'qrcode'">将生成收款二维码，用户扫码后完成支付</li>
                <li>支付金额：¥{{ totalAdditionalFees.toFixed(2) }}</li>
                <li>押金将全额退还：¥{{ orderInfo?.depositAmount?.toFixed(2) || '0.00' }}</li>
                <li>用户完成支付后，押金退款将自动发起</li>
              </ul>
            </div>
          </template>
        </el-alert>
      </el-card>

      <!-- 备注信息 -->
      <el-card class="section-card" shadow="never">
        <template #header><span class="card-title">备注信息</span></template>

        <el-form-item label="备注">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确认还车</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// Props
interface Props {
  modelValue: boolean
  orderInfo: any
  pickupRecord: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  orderInfo: null,
  pickupRecord: null
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

// 响应式数据
const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  vehicleCondition: {
    mileage: 0,
    fuelLevel: 100,
    exterior: [] as any[],
    interior: [] as any[],
    dashboard: [] as any[]
  },
  damages: [] as Array<{
    type: string
    description: string
    photos: any[]
    estimatedCost: number
  }>,
  additionalFees: {
    overtimeFee: 0,
    fuelFee: 0,
    cleaningFee: 0,
    damageFee: 0
  },
  paymentMethod: 'deposit_deduction', // 费用处理方式: deposit_deduction(押金扣取) | user_payment(用户支付)
  userPaymentType: 'miniprogram', // 用户支付方式: miniprogram(小程序支付) | qrcode(扫码支付)
  notes: ''
})

// 表单验证规则
const formRules: FormRules = {
  'vehicleCondition.mileage': [
    { required: true, message: '请输入还车里程', trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        const pickupMileage = props.pickupRecord?.vehicleCondition?.mileage || 0
        if (value < pickupMileage) {
          callback(new Error(`还车里程不能小于取车里程（${pickupMileage}公里）`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'vehicleCondition.fuelLevel': [
    { required: true, message: '请选择还车油量', trigger: 'change' }
  ],
  'vehicleCondition.exterior': [
    { required: true, message: '请上传车辆外观照片', trigger: 'change' }
  ],
  'vehicleCondition.dashboard': [
    { required: true, message: '请上传仪表盘照片', trigger: 'change' }
  ],
  paymentMethod: [
    { required: true, message: '请选择费用处理方式', trigger: 'change' }
  ],
  userPaymentType: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

// 油量标记
const fuelMarks = {
  0: '0%',
  25: '1/4',
  50: '1/2',
  75: '3/4',
  100: '满'
}

// 计算属性
const traveledMileage = computed(() => {
  const pickupMileage = props.pickupRecord?.vehicleCondition?.mileage || 0
  return Math.max(0, form.vehicleCondition.mileage - pickupMileage)
})

const fuelDifference = computed(() => {
  const pickupFuel = props.pickupRecord?.vehicleCondition?.fuelLevel || 100
  return form.vehicleCondition.fuelLevel - pickupFuel
})

const totalDamageCost = computed(() => {
  return form.damages.reduce((sum, damage) => sum + (damage.estimatedCost || 0), 0)
})

const totalAdditionalFees = computed(() => {
  return (
    form.additionalFees.overtimeFee +
    form.additionalFees.fuelFee +
    form.additionalFees.cleaningFee +
    totalDamageCost.value
  )
})

const depositRefund = computed(() => {
  const deposit = props.orderInfo?.depositAmount || 0
  return deposit - totalAdditionalFees.value
})

const overtimeTip = computed(() => {
  // 这里可以根据实际超时情况计算提示
  return '如有超时，请输入超时费用'
})

const fuelFeeTip = computed(() => {
  if (fuelDifference.value < 0) {
    return `油量减少 ${Math.abs(fuelDifference.value)}%，需收取油费补偿`
  } else if (fuelDifference.value > 0) {
    return `油量增加 ${fuelDifference.value}%`
  }
  return '油量与取车时一致'
})

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.pickupRecord) {
    // 初始化还车里程和油量
    form.vehicleCondition.mileage = props.pickupRecord.vehicleCondition?.mileage || 0
    form.vehicleCondition.fuelLevel = props.pickupRecord.vehicleCondition?.fuelLevel || 100
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 监听损坏费用变化
watch(totalDamageCost, (val) => {
  form.additionalFees.damageFee = val
})

// 添加损坏项
const handleAddDamage = () => {
  form.damages.push({
    type: '',
    description: '',
    photos: [],
    estimatedCost: 0
  })
}

// 删除损坏项
const handleRemoveDamage = (index: number) => {
  form.damages.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 检查损坏项是否填写完整
    for (let i = 0; i < form.damages.length; i++) {
      const damage = form.damages[i]
      if (!damage.type) {
        ElMessage.warning(`请选择损坏项 ${i + 1} 的损坏类型`)
        return
      }
      if (!damage.description) {
        ElMessage.warning(`请填写损坏项 ${i + 1} 的损坏描述`)
        return
      }
    }

    loading.value = true
    try {
      // 构建提交数据
      const submitData = {
        orderId: props.orderInfo?.id,
        returnTime: new Date().toISOString(),
        vehicleCondition: {
          mileage: form.vehicleCondition.mileage,
          fuelLevel: form.vehicleCondition.fuelLevel,
          exterior: form.vehicleCondition.exterior.map(file => file.url || URL.createObjectURL(file.raw)),
          interior: form.vehicleCondition.interior.map(file => file.url || URL.createObjectURL(file.raw)),
          dashboard: form.vehicleCondition.dashboard.map(file => file.url || URL.createObjectURL(file.raw))
        },
        damages: form.damages.map(damage => ({
          type: damage.type,
          description: damage.description,
          photos: damage.photos.map(file => file.url || URL.createObjectURL(file.raw)),
          estimatedCost: damage.estimatedCost
        })),
        additionalFees: {
          overtimeFee: form.additionalFees.overtimeFee,
          fuelFee: form.additionalFees.fuelFee,
          cleaningFee: form.additionalFees.cleaningFee,
          damageFee: form.additionalFees.damageFee
        },
        depositRefund: depositRefund.value,
        notes: form.notes
      }

      emit('submit', submitData)
      ElMessage.success('还车登记成功')
      handleClose()
    } catch (error) {
      console.error('还车登记失败:', error)
      ElMessage.error('还车登记失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  form.vehicleCondition.exterior = []
  form.vehicleCondition.interior = []
  form.vehicleCondition.dashboard = []
  form.damages = []
  form.additionalFees = {
    overtimeFee: 0,
    fuelFee: 0,
    cleaningFee: 0,
    damageFee: 0
  }
  form.notes = ''
  visible.value = false
}
</script>

<style scoped lang="scss">
.info-card,
.section-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  font-weight: 600;
  font-size: 14px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  margin-bottom: 12px;

  .label {
    color: #909399;
    font-size: 14px;
  }

  .value {
    color: #303133;
    font-size: 14px;
    font-weight: 500;
  }
}

.upload-section {
  .upload-tip {
    margin-bottom: 10px;
    color: #909399;
    font-size: 12px;
  }
}

.field-tip {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;

  &.text-warning {
    color: #e6a23c;
  }
}

.damage-list {
  .damage-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .damage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.fee-summary {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .summary-label {
      font-size: 14px;
      color: #606266;
    }

    .summary-value {
      font-size: 16px;
      font-weight: 600;
      color: #303133;

      &.text-success {
        color: #67c23a;
      }

      &.text-danger {
        color: #f56c6c;
      }
    }
  }
}

.payment-option {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .option-title {
    font-weight: 500;
    font-size: 14px;
    color: #303133;
  }

  .option-desc {
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }
}

.payment-tip {
  p {
    margin: 0 0 8px 0;
    font-weight: 500;
    color: #303133;
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 6px;
      color: #606266;
      font-size: 13px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-divider) {
  margin: 16px 0;
}

:deep(.el-radio) {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-alert) {
  margin-top: 16px;
}
</style>
