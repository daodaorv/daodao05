<template>
  <view class="return-container">
    <view class="progress-bar">
      <u-steps
        :current="currentStep - 1"
        :list="stepList"
        activeColor="#3cc51f"
        inactiveColor="#dcdcdc"
      ></u-steps>
    </view>

    <view v-if="detailLoading" class="inline-loading">
      <LoadingSpinner :text="orderInfo.orderNo ? '同步还车流程...' : '正在加载订单...'" />
    </view>

    <view v-else class="step-container">
      <view v-if="currentStep === 1" class="step-content">
        <view class="section-card">
          <view class="section-title">订单识别</view>
          <view class="order-search">
            <u-input
              v-model="orderSearchNo"
              placeholder="输入订单号或扫描二维码"
              border="surround"
              clearable
            ></u-input>
            <view class="search-actions">
              <u-button
                type="info"
                size="small"
                icon="scan"
                plain
                text="扫码"
                @click="handleScanOrder"
              ></u-button>
              <u-button
                type="primary"
                size="small"
                text="读取订单"
                @click="handleOrderSearch"
              ></u-button>
            </view>
          </view>
          <view class="tips-text">完成订单校验后录入当前里程与油量。</view>
        </view>

        <view class="section-card" v-if="orderInfo.orderNo">
          <view class="section-title">订单信息</view>
          <u-cell-group>
            <u-cell title="订单号" :value="orderInfo.orderNo" />
            <u-cell title="客户姓名" :value="orderInfo.customerName" />
            <u-cell title="联系电话" :value="orderInfo.customerPhone" />
            <u-cell title="车辆信息" :value="`${orderInfo.vehicleName} (${orderInfo.vehiclePlate})`" />
            <u-cell title="租期" :value="`${orderInfo.startDate} 至 ${orderInfo.endDate}`" />
            <u-cell title="还车地址" :value="orderInfo.returnAddress || '同取车地址'" />
          </u-cell-group>
        </view>

        <view class="section-card">
          <view class="section-title">基准数据对比</view>
          <u-cell-group>
            <u-cell title="取车里程" :value="pickupBaseline.mileage ? `${pickupBaseline.mileage} km` : '-'" />
            <u-cell title="取车油量" :value="pickupBaseline.fuelLevel ? `${pickupBaseline.fuelLevel}%` : '-'" />
            <u-cell title="取车时间" :value="pickupBaseline.pickupTime || '-'" />
          </u-cell-group>
          <view class="input-row">
            <text class="input-label">当前里程 (km)</text>
            <u-input
              v-model="inspectionForm.mileage"
              type="number"
              placeholder="请输入当前行驶里程"
              border="surround"
            ></u-input>
          </view>
          <view class="input-row">
            <text class="input-label">当前油量 (%)</text>
            <u-input
              v-model="inspectionForm.fuelLevel"
              type="number"
              placeholder="请输入仪表盘油量"
              border="surround"
            ></u-input>
          </view>
        </view>

        <view class="statistics-card">
          <view class="statistics-item">
            <text class="label">步骤</text>
            <text class="value">1 / 5</text>
          </view>
          <view class="statistics-item">
            <text class="label">订单状态</text>
            <text class="value">{{ orderInfo.orderNo ? '已识别' : '待识别' }}</text>
          </view>
        </view>

        <view class="action-buttons">
          <u-button
            type="primary"
            :disabled="!canProceedStep1"
            text="下一步：车辆检查"
            @click="handleNextStep"
          ></u-button>
        </view>
      </view>

      <view v-if="currentStep === 2" class="step-content">
        <view class="section-card">
          <view class="section-title">检查清单</view>
          <view class="checklist-section">
            <view class="checklist-header">
              <text>外观检查</text>
              <text class="checklist-progress">{{ exteriorProgress }}/{{ checklist.exterior.length }}</text>
            </view>
            <u-checkbox-group
              v-model="inspectionForm.exteriorChecks"
              @change="(vals) => syncChecklist('exterior', vals)"
            >
              <u-checkbox
                v-for="item in checklist.exterior"
                :key="item.id"
                :name="item.id"
                :label="item.name"
                shape="square"
                activeColor="#3cc51f"
              />
            </u-checkbox-group>
          </view>

          <view class="checklist-section">
            <view class="checklist-header">
              <text>内饰检查</text>
              <text class="checklist-progress">{{ interiorProgress }}/{{ checklist.interior.length }}</text>
            </view>
            <u-checkbox-group
              v-model="inspectionForm.interiorChecks"
              @change="(vals) => syncChecklist('interior', vals)"
            >
              <u-checkbox
                v-for="item in checklist.interior"
                :key="item.id"
                :name="item.id"
                :label="item.name"
                shape="square"
                activeColor="#3cc51f"
              />
            </u-checkbox-group>
          </view>

          <view class="checklist-section">
            <view class="checklist-header">
              <text>功能检查</text>
              <text class="checklist-progress">{{ functionProgress }}/{{ checklist.functions.length }}</text>
            </view>
            <u-checkbox-group
              v-model="inspectionForm.functionChecks"
              @change="(vals) => syncChecklist('functions', vals)"
            >
              <u-checkbox
                v-for="item in checklist.functions"
                :key="item.id"
                :name="item.id"
                :label="item.name"
                shape="square"
                activeColor="#3cc51f"
              />
            </u-checkbox-group>
          </view>
        </view>

        <view class="section-card">
          <view class="section-title">车辆拍照存证</view>
          <view class="photo-section" v-for="group in photoGroupKeys" :key="group.key">
            <view class="photo-header">
              <text>{{ group.label }}</text>
              <text class="photo-progress">
                {{ getCategoryPhotoCount(group.key) }}/{{ photoPositions[group.key].length }}
              </text>
            </view>
            <view class="photo-grid">
              <view
                v-for="position in photoPositions[group.key]"
                :key="position.key"
                class="photo-item"
              >
                <view class="photo-label">{{ position.label }}</view>
                <u-upload
                  :fileList="getPhotoList(group.key, position.key)"
                  :maxCount="1"
                  :previewFullImage="true"
                  width="220"
                  height="220"
                  @afterRead="(e) => handlePhotoRead(e, group.key, position.key)"
                  @delete="() => handlePhotoDelete(group.key, position.key)"
                >
                  <view class="upload-slot">
                    <u-icon name="camera-fill" size="36" color="#9e9e9e"></u-icon>
                    <text class="upload-text">拍照</text>
                  </view>
                </u-upload>
              </view>
            </view>
          </view>
        </view>

        <view class="statistics-card">
          <view class="statistics-item">
            <text class="label">检查完成</text>
            <text class="value">{{ completedCheckItems }}/{{ totalCheckItems }}</text>
          </view>
          <view class="statistics-item">
            <text class="label">照片完成</text>
            <text class="value">{{ requiredPhotoCompleted }}/{{ requiredPhotoCount }}</text>
          </view>
        </view>

        <view class="action-buttons">
          <u-button text="上一步" type="info" plain @click="handlePrevStep"></u-button>
          <u-button
            type="primary"
            :loading="stepSubmitting"
            :disabled="!canProceedStep2 || stepSubmitting"
            text="下一步：损坏评估"
            @click="handleNextStep"
          ></u-button>
        </view>
      </view>

      <view v-if="currentStep === 3" class="step-content">
        <view class="section-card">
          <view class="section-title">损坏记录</view>
          <view class="damage-form">
            <view class="form-row">
              <text class="form-label">损坏类型</text>
              <u-radio-group
                v-model="damageForm.type"
                placement="row"
                :wrap="true"
              >
                <u-radio
                  v-for="item in damageTypeOptions"
                  :key="item.value"
                  :name="item.value"
                  :label="item.label"
                ></u-radio>
              </u-radio-group>
            </view>

            <view class="form-row">
              <text class="form-label">损坏程度</text>
              <u-radio-group v-model="damageForm.level" placement="row">
                <u-radio
                  v-for="item in damageLevelOptions"
                  :key="item.value"
                  :name="item.value"
                  :label="item.label"
                ></u-radio>
              </u-radio-group>
            </view>

            <view class="form-row">
              <text class="form-label">位置描述</text>
              <u-input
                v-model="damageForm.position"
                placeholder="例：左前门下沿"
                border="surround"
              ></u-input>
            </view>

            <view class="form-row">
              <text class="form-label">预估费用 (¥)</text>
              <u-input
                v-model="damageForm.estimatedCost"
                type="number"
                placeholder="请输入预计维修金额"
                border="surround"
              ></u-input>
            </view>

            <view class="form-row">
              <text class="form-label">详情描述</text>
              <u-textarea
                v-model="damageForm.description"
                placeholder="补充损坏细节、建议处理方式"
                :autoHeight="true"
              ></u-textarea>
            </view>

            <view class="form-row">
              <text class="form-label">损坏照片</text>
              <u-upload
                :fileList="damagePhotoList"
                :maxCount="4"
                :previewFullImage="true"
                width="200"
                height="200"
                @afterRead="handleDamagePhotoRead"
                @delete="handleDamagePhotoDelete"
              ></u-upload>
            </view>

            <u-button
              type="success"
              text="添加损坏记录"
              @click="addDamageRecord"
            ></u-button>
            <view class="tips-text">若无新增损坏，可直接点击下一步。</view>
          </view>
        </view>

        <view class="damage-list" v-if="damageList.length > 0">
          <view
            v-for="damage in damageList"
            :key="damage.id"
            class="damage-card"
          >
            <view class="damage-card__header">
              <view>
                <text class="damage-type">{{ getDamageLabel(damage.type) }}</text>
                <u-tag
                  :text="getDamageLevelLabel(damage.level)"
                  size="mini"
                  type="warning"
                />
              </view>
              <u-button
                type="error"
                size="mini"
                text="移除"
                plain
                @click="removeDamageRecord(damage.id)"
              ></u-button>
            </view>
            <view class="damage-card__body">
              <text class="damage-field">位置：{{ damage.position }}</text>
              <text class="damage-field">费用：¥{{ damage.estimatedCost.toFixed(2) }}</text>
              <text class="damage-field" v-if="damage.description">备注：{{ damage.description }}</text>
              <view v-if="damage.photos.length" class="damage-photos">
                <image
                  v-for="(url, index) in damage.photos"
                  :key="index"
                  :src="url"
                  mode="aspectFill"
                ></image>
              </view>
            </view>
          </view>
        </view>
        <u-empty v-else mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" text="暂无损坏记录"></u-empty>

        <view class="action-buttons">
          <u-button text="上一步" type="info" plain @click="handlePrevStep"></u-button>
          <u-button
            type="primary"
            text="下一步：费用结算"
            :loading="damageSubmitting"
            :disabled="damageSubmitting"
            @click="handleNextStep"
          ></u-button>
        </view>
      </view>

      <view v-if="currentStep === 4" class="step-content">
        <view class="section-card">
          <view class="section-title">费用汇总</view>
          <view class="fee-summary" v-if="feeInfo">
            <view class="fee-total">
              <text>总费用</text>
              <text class="fee-amount">¥{{ feeInfo.totalFee.toFixed(2) }}</text>
            </view>
            <view class="fee-detail">
              <view class="fee-item">
                <text>基础租金</text>
                <text>{{ formatCurrency(feeInfo.baseFee) }}</text>
              </view>
              <view class="fee-item">
                <text>超时费用</text>
                <text>{{ formatCurrency(feeInfo.overtimeFee) }}</text>
              </view>
              <view class="fee-item">
                <text>超里程费用</text>
                <text>{{ formatCurrency(feeInfo.overMileageFee) }}</text>
              </view>
              <view class="fee-item">
                <text>补油费用</text>
                <text>{{ formatCurrency(feeInfo.fuelFee) }}</text>
              </view>
              <view class="fee-item">
                <text>损坏赔偿</text>
                <text>{{ formatCurrency(feeInfo.damageFee) }}</text>
              </view>
              <view class="fee-item">
                <text>押金</text>
                <text class="deposit-text">¥{{ feeInfo.deposit.toFixed(2) }}</text>
              </view>
            </view>
            <view class="fee-deposit">
              <view>
                <text class="deposit-title">押金可退</text>
                <text class="deposit-value">¥{{ feeInfo.depositRefund.toFixed(2) }}</text>
              </view>
              <view>
                <text class="deposit-title">需补差额</text>
                <text class="deposit-value">¥{{ feeInfo.needPay.toFixed(2) }}</text>
              </view>
            </view>
          </view>
          <view v-else class="tips-text">尚未获取费用，请点击下方按钮计算。</view>
        </view>

        <view class="section-card" v-if="feeBreakdown.length">
          <view class="section-title">费用明细</view>
          <u-cell-group>
            <u-cell
              v-for="(item, index) in feeBreakdown"
              :key="index"
              :title="item.name"
              :value="formatCurrency(item.amount)"
            >
              <template #label>
                <text class="fee-label" :class="{ paid: item.paid }">
                  {{ item.paid ? '已预付' : '待结算' }}
                </text>
              </template>
            </u-cell>
          </u-cell-group>
        </view>

        <view class="action-buttons">
          <u-button text="上一步" type="info" plain @click="handlePrevStep"></u-button>
          <u-button
            text="重新计算费用"
            type="default"
            :loading="feeLoading"
            :disabled="feeLoading"
            @click="calculateFees"
          ></u-button>
          <u-button
            type="primary"
            text="下一步：完成还车"
            :disabled="!canProceedStep4"
            @click="handleNextStep"
          ></u-button>
        </view>
      </view>

      <view v-if="currentStep === 5" class="step-content">
        <view class="section-card">
          <view class="section-title">客户确认</view>
          <view class="confirmation-list">
            <u-checkbox-group v-model="confirmationGroup">
              <u-checkbox
                name="customerConfirmed"
                shape="square"
                label="客户已确认检查结果与费用"
              ></u-checkbox>
              <u-checkbox
                name="keyRecovered"
                shape="square"
                label="钥匙及附件已回收"
              ></u-checkbox>
            </u-checkbox-group>
            <view class="switch-row">
              <text>发送还车完成通知</text>
              <u-switch v-model="completionForm.notifyCustomer"></u-switch>
            </view>
            <u-textarea
              v-model="completionForm.remarks"
              placeholder="填写现场备注，可留空"
            ></u-textarea>
          </view>
        </view>

        <view class="section-card">
          <view class="section-title">客户签名</view>
          <SignaturePad v-model="completionForm.signature" :height="280" />
        </view>

        <view class="action-buttons">
          <u-button text="上一步" type="info" plain @click="handlePrevStep"></u-button>
          <u-button
            type="primary"
            text="完成还车"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="completeReturnFlow"
          ></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  calculateReturnFees,
  completeReturn,
  getOrderDetail,
  startReturn,
  submitDamageAssessment,
  submitReturnInspection,
  uploadReturnPhotos
} from '@/api/order'
import SignaturePad from '@/components/common/SignaturePad.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface OrderInfo {
  id?: number | string
  orderNo: string
  customerName: string
  customerPhone: string
  vehicleName: string
  vehiclePlate: string
  startDate: string
  endDate: string
  returnAddress?: string
}

interface ChecklistItem {
  id: number
  name: string
  checked?: boolean
}

interface PhotoPosition {
  key: string
  label: string
}

interface DamageRecord {
  id: number
  type: string
  level: string
  position: string
  description: string
  estimatedCost: number
  photos: string[]
}

interface FeeInfo {
  baseFee: number
  overtimeFee: number
  overMileageFee: number
  fuelFee: number
  damageFee: number
  totalFee: number
  deposit: number
  depositRefund: number
  needPay: number
}

const stepList = [
  { name: '车辆接收' },
  { name: '检查/拍照' },
  { name: '损坏评估' },
  { name: '费用结算' },
  { name: '完成还车' }
]

const orderId = ref('')
const orderSearchNo = ref('')
const currentStep = ref(1)
const detailLoading = ref(false)
const stepSubmitting = ref(false)
const damageSubmitting = ref(false)
const feeLoading = ref(false)
const submitting = ref(false)

const orderInfo = reactive<OrderInfo>({
  orderNo: '',
  customerName: '',
  customerPhone: '',
  vehicleName: '',
  vehiclePlate: '',
  startDate: '',
  endDate: '',
  returnAddress: ''
})

const pickupBaseline = reactive({
  mileage: 0,
  fuelLevel: 0,
  pickupTime: ''
})

const checklist = reactive<{ exterior: ChecklistItem[]; interior: ChecklistItem[]; functions: ChecklistItem[] }>({
  exterior: [],
  interior: [],
  functions: []
})

const inspectionForm = reactive({
  mileage: '',
  fuelLevel: '',
  exteriorChecks: [] as number[],
  interiorChecks: [] as number[],
  functionChecks: [] as number[]
})

const photoPositions = reactive<Record<'exterior' | 'interior' | 'optional', PhotoPosition[]>>({
  exterior: [],
  interior: [],
  optional: []
})

const photos = reactive<Record<'exterior' | 'interior' | 'optional', Record<string, string>>>({
  exterior: {},
  interior: {},
  optional: {}
})

const damageTypeOptions = [
  { label: '车身划痕', value: 'scratch' },
  { label: '碰撞凹陷', value: 'dent' },
  { label: '玻璃破损', value: 'glass' },
  { label: '内饰污损', value: 'interior' },
  { label: '设备故障', value: 'device' }
]

const damageLevelOptions = [
  { label: '轻微', value: 'mild' },
  { label: '中等', value: 'medium' },
  { label: '严重', value: 'severe' }
]

const damageList = ref<DamageRecord[]>([])
const damageForm = reactive({
  type: damageTypeOptions[0].value,
  level: damageLevelOptions[0].value,
  position: '',
  description: '',
  estimatedCost: '',
  photos: [] as string[]
})
const damagePhotoList = ref<Array<{ url: string }>>([])

const feeInfo = ref<FeeInfo | null>(null)
const feeBreakdown = ref<Array<{ name: string; amount: number; paid?: boolean }>>([])

const confirmationGroup = ref<string[]>([])

const completionForm = reactive({
  customerConfirmed: computed(() => confirmationGroup.value.includes('customerConfirmed')),
  keyRecovered: computed(() => confirmationGroup.value.includes('keyRecovered')),
  notifyCustomer: true,
  remarks: '',
  signature: ''
})

const photoGroupKeys = [
  { key: 'exterior' as const, label: '外观照片 (必传)' },
  { key: 'interior' as const, label: '内饰照片 (必传)' },
  { key: 'optional' as const, label: '补充照片 (选填)' }
]

const totalCheckItems = computed(
  () => checklist.exterior.length + checklist.interior.length + checklist.functions.length
)

const completedCheckItems = computed(() => {
  const total = [
    ...checklist.exterior.filter((item) => item.checked),
    ...checklist.interior.filter((item) => item.checked),
    ...checklist.functions.filter((item) => item.checked)
  ]
  return total.length
})

const exteriorProgress = computed(() => checklist.exterior.filter((item) => item.checked).length)
const interiorProgress = computed(() => checklist.interior.filter((item) => item.checked).length)
const functionProgress = computed(() => checklist.functions.filter((item) => item.checked).length)

const requiredPhotoCount = computed(() => photoPositions.exterior.length + photoPositions.interior.length)
const requiredPhotoCompleted = computed(() => getCategoryPhotoCount('exterior') + getCategoryPhotoCount('interior'))

const canProceedStep1 = computed(
  () => Boolean(orderInfo.orderNo && inspectionForm.mileage && inspectionForm.fuelLevel)
)
const canProceedStep2 = computed(
  () =>
    completedCheckItems.value === totalCheckItems.value && requiredPhotoCompleted.value === requiredPhotoCount.value
)
const canProceedStep4 = computed(() => Boolean(feeInfo.value))
const canSubmit = computed(
  () =>
    completionForm.customerConfirmed &&
    completionForm.keyRecovered &&
    !!completionForm.signature &&
    !submitting.value
)

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return '¥0.00'
  return `¥${Number(value).toFixed(2)}`
}

function resetFormState() {
  inspectionForm.mileage = ''
  inspectionForm.fuelLevel = ''
  inspectionForm.exteriorChecks = []
  inspectionForm.interiorChecks = []
  inspectionForm.functionChecks = []
  photos.exterior = {}
  photos.interior = {}
  photos.optional = {}
  damageList.value = []
  feeInfo.value = null
  feeBreakdown.value = []
  confirmationGroup.value = []
  completionForm.notifyCustomer = true
  completionForm.remarks = ''
  completionForm.signature = ''
  currentStep.value = 1
}

async function loadOrderDetailData(id: string) {
  if (!id) {
    uni.showToast({ title: '请输入订单号', icon: 'none' })
    return
  }
  detailLoading.value = true
  try {
    const data = await getOrderDetail(id)
    orderId.value = String(data.id ?? id)
    orderSearchNo.value = data.orderNo
    Object.assign(orderInfo, {
      orderNo: data.orderNo,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      vehicleName: data.vehicleName,
      vehiclePlate: data.vehiclePlate,
      startDate: data.startDate,
      endDate: data.endDate,
      returnAddress: data.returnAddress || ''
    })
    await startReturnFlow()
  } catch (error: any) {
    console.error('加载订单失败', error)
    uni.showToast({ title: error?.message || '读取订单失败', icon: 'none' })
  } finally {
    detailLoading.value = false
  }
}

async function startReturnFlow() {
  if (!orderId.value) return
  try {
    detailLoading.value = true
    const res = await startReturn(orderId.value)
    pickupBaseline.mileage = res.pickupData?.mileage || 0
    pickupBaseline.fuelLevel = res.pickupData?.fuelLevel || 0
    pickupBaseline.pickupTime = res.pickupData?.pickupTime || ''
    if (res.checklistTemplate) {
      checklist.exterior = res.checklistTemplate.exterior || []
      checklist.interior = res.checklistTemplate.interior || []
      checklist.functions = res.checklistTemplate.functions || []
    }
    if (res.photoPositions) {
      photoPositions.exterior = res.photoPositions.exterior || []
      photoPositions.interior = res.photoPositions.interior || []
      photoPositions.optional = res.photoPositions.optional || []
    } else {
      photoPositions.exterior = [
        { key: 'front', label: '车头正面' },
        { key: 'back', label: '车尾' },
        { key: 'left', label: '左侧45°' },
        { key: 'right', label: '右侧45°' }
      ]
      photoPositions.interior = [
        { key: 'dashboard', label: '仪表盘' },
        { key: 'cabin', label: '驾驶舱' }
      ]
      photoPositions.optional = []
    }
    resetFormState()
  } catch (error) {
    console.error('初始化还车流程失败', error)
    uni.showToast({ title: '还车流程初始化失败', icon: 'none' })
  } finally {
    detailLoading.value = false
  }
}

function syncChecklist(category: 'exterior' | 'interior' | 'functions', values: number[]) {
  checklist[category].forEach((item) => {
    item.checked = values.includes(item.id)
  })
}

function getPhotoList(category: 'exterior' | 'interior' | 'optional', key: string) {
  const photo = photos[category][key]
  return photo ? [{ url: photo, status: 'success' }] : []
}

function handlePhotoRead(event: any, category: 'exterior' | 'interior' | 'optional', key: string) {
  const file = Array.isArray(event.file) ? event.file[0] : event.file
  if (file?.url) {
    photos[category][key] = file.url
  }
}

function handlePhotoDelete(category: 'exterior' | 'interior' | 'optional', key: string) {
  delete photos[category][key]
}

function getCategoryPhotoCount(category: 'exterior' | 'interior' | 'optional') {
  return Object.keys(photos[category]).length
}

function handleDamagePhotoRead(event: any) {
  const files = Array.isArray(event.file) ? event.file : [event.file]
  files.forEach((file) => {
    if (file?.url) {
      damagePhotoList.value.push({ url: file.url })
      damageForm.photos.push(file.url)
    }
  })
}

function handleDamagePhotoDelete(event: any) {
  const index = event.index
  damagePhotoList.value.splice(index, 1)
  damageForm.photos.splice(index, 1)
}

function addDamageRecord() {
  if (!damageForm.position || !damageForm.estimatedCost) {
    uni.showToast({ title: '请填写位置和费用', icon: 'none' })
    return
  }
  const record: DamageRecord = {
    id: Date.now(),
    type: damageForm.type,
    level: damageForm.level,
    position: damageForm.position,
    description: damageForm.description,
    estimatedCost: Number(damageForm.estimatedCost),
    photos: [...damageForm.photos]
  }
  damageList.value = [...damageList.value, record]
  damageForm.position = ''
  damageForm.description = ''
  damageForm.estimatedCost = ''
  damageForm.photos = []
  damagePhotoList.value = []
  uni.showToast({ title: '已添加损坏记录', icon: 'success' })
}

function removeDamageRecord(id: number) {
  damageList.value = damageList.value.filter((item) => item.id !== id)
}

function getDamageLabel(value: string) {
  return damageTypeOptions.find((item) => item.value === value)?.label || value
}

function getDamageLevelLabel(value: string) {
  return damageLevelOptions.find((item) => item.value === value)?.label || value
}

function collectPhotos() {
  const result: string[] = []
  ;(['exterior', 'interior', 'optional'] as const).forEach((category) => {
    Object.keys(photos[category]).forEach((key) => {
      result.push(photos[category][key])
    })
  })
  return result
}

async function persistInspectionData() {
  if (!canProceedStep2.value) return false
  stepSubmitting.value = true
  try {
    await submitReturnInspection(orderId.value, {
      mileage: Number(inspectionForm.mileage),
      fuelLevel: Number(inspectionForm.fuelLevel),
      checklist: {
        exterior: checklist.exterior,
        interior: checklist.interior,
        functions: checklist.functions
      }
    })
    const photoPayload = collectPhotos()
    await uploadReturnPhotos(orderId.value, photoPayload)
    uni.showToast({ title: '检查已提交', icon: 'success' })
    return true
  } catch (error: any) {
    console.error('提交检查失败', error)
    uni.showToast({ title: error?.message || '提交检查失败', icon: 'none' })
    return false
  } finally {
    stepSubmitting.value = false
  }
}

async function persistDamageData() {
  if (damageList.value.length === 0) {
    return true
  }
  damageSubmitting.value = true
  try {
    const payload = damageList.value.map((item) => ({
      type: item.type,
      level: item.level,
      position: item.position,
      description: item.description,
      estimatedCost: item.estimatedCost,
      photos: item.photos
    }))
    await submitDamageAssessment(orderId.value, payload)
    uni.showToast({ title: '损坏评估已提交', icon: 'success' })
    return true
  } catch (error: any) {
    console.error('提交损坏评估失败', error)
    uni.showToast({ title: error?.message || '提交损坏评估失败', icon: 'none' })
    return false
  } finally {
    damageSubmitting.value = false
  }
}

async function calculateFees() {
  if (!inspectionForm.mileage || !inspectionForm.fuelLevel) {
    uni.showToast({ title: '请先填写里程与油量', icon: 'none' })
    return
  }
  feeLoading.value = true
  try {
    const res = await calculateReturnFees(orderId.value, {
      mileage: Number(inspectionForm.mileage),
      fuelLevel: Number(inspectionForm.fuelLevel),
      damages: damageList.value.map((item) => ({
        type: item.type,
        level: item.level,
        estimatedCost: item.estimatedCost
      }))
    })
    feeInfo.value = res.fees
    feeBreakdown.value = res.breakdown || []
    uni.showToast({ title: '费用已更新', icon: 'success' })
  } catch (error: any) {
    console.error('计算费用失败', error)
    uni.showToast({ title: error?.message || '费用计算失败', icon: 'none' })
  } finally {
    feeLoading.value = false
  }
}

function handlePrevStep() {
  if (currentStep.value > 1) {
    currentStep.value -= 1
  }
}

async function handleNextStep() {
  if (currentStep.value === 1) {
    currentStep.value = 2
    return
  }
  if (currentStep.value === 2) {
    const ok = await persistInspectionData()
    if (ok) currentStep.value = 3
    return
  }
  if (currentStep.value === 3) {
    const ok = await persistDamageData()
    if (ok) {
      await calculateFees()
      currentStep.value = 4
    }
    return
  }
  if (currentStep.value === 4) {
    if (!feeInfo.value) {
      await calculateFees()
      if (!feeInfo.value) return
    }
    currentStep.value = 5
  }
}

async function completeReturnFlow() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await completeReturn(orderId.value, {
      mileage: Number(inspectionForm.mileage),
      fuelLevel: Number(inspectionForm.fuelLevel),
      photos: collectPhotos(),
      damages: damageList.value,
      fees: feeInfo.value,
      notifyCustomer: completionForm.notifyCustomer,
      remarks: completionForm.remarks,
      signature: completionForm.signature
    })
    uni.showToast({ title: '还车已完成', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
  } catch (error: any) {
    console.error('完成还车失败', error)
    uni.showToast({ title: error?.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

async function handleOrderSearch() {
  const target = orderSearchNo.value || orderId.value
  await loadOrderDetailData(target)
}

function handleScanOrder() {
  uni.scanCode({
    success: (res) => {
      orderSearchNo.value = res.result
      loadOrderDetailData(res.result)
    },
    fail: () => {
      uni.showToast({ title: '扫码失败', icon: 'none' })
    }
  })
}

onLoad((options) => {
  if (options?.id) {
    orderId.value = options.id
    loadOrderDetailData(options.id)
  }
})
</script>

<style lang="scss" scoped>
.return-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 120rpx;
}

.progress-bar {
  background-color: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.step-content {
  padding: 20rpx 24rpx 40rpx;
}

.section-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
  color: #333;
}

.order-search {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.search-actions {
  display: flex;
  gap: 20rpx;
}

.tips-text {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #999;
}

.input-row {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.input-label {
  font-size: 26rpx;
  color: #555;
}

.statistics-card {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 20rpx 0;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
}

.statistics-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.statistics-item .label {
  font-size: 24rpx;
  color: #888;
}

.statistics-item .value {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.checklist-section {
  margin-bottom: 24rpx;
}

.checklist-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14rpx;
  font-size: 28rpx;
  color: #444;
}

.checklist-progress {
  color: #999;
  font-size: 24rpx;
}

.photo-section {
  margin-bottom: 24rpx;
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.photo-progress {
  font-size: 24rpx;
  color: #999;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.photo-item {
  background-color: #fafafa;
  border-radius: 16rpx;
  padding: 16rpx;
}

.photo-label {
  font-size: 24rpx;
  margin-bottom: 10rpx;
  color: #555;
}

.upload-slot {
  width: 100%;
  height: 200rpx;
  border: 2rpx dashed #d3d3d3;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #999;
}

.upload-text {
  font-size: 24rpx;
}

.damage-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.form-label {
  font-size: 26rpx;
  color: #555;
}

.damage-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.damage-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
}

.damage-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.damage-type {
  font-size: 30rpx;
  font-weight: 600;
  margin-right: 12rpx;
}

.damage-field {
  display: block;
  font-size: 26rpx;
  color: #555;
  margin-bottom: 6rpx;
}

.damage-photos {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}

.damage-photos image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
}

.fee-summary {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.fee-total {
  display: flex;
  justify-content: space-between;
  font-size: 32rpx;
  font-weight: 600;
}

.fee-amount {
  color: #f56c6c;
}

.fee-detail {
  background-color: #fafafa;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #555;
}

.fee-deposit {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.deposit-title {
  font-size: 24rpx;
  color: #888;
}

.deposit-value {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.deposit-text {
  color: #3cc51f;
}

.fee-label {
  font-size: 24rpx;
  color: #999;
}

.fee-label.paid {
  color: #3cc51f;
}

.confirmation-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inline-loading {
  padding: 40rpx;
}
</style>
