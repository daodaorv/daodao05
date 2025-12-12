<!-- @ts-nocheck -->
<template>
  <div class="order-detail-container">
    <PageHeader
      :title="`订单详情 - ${order?.orderNo || 'info'}`"
      :description="`${order?.userName || 'info'} - ${order?.userPhone || 'info'}`"
      show-back
    />

    <el-card v-if="order" class="detail-card">
      <template #header>
        <div class="card-header">
          <span>订单信息</span>
          <div class="header-actions">
            <el-tag :type="getOrderStatusTag(order.status)" size="large">
              {{ getOrderStatusLabel(order.status) }}
            </el-tag>
            <el-tag :type="getPaymentStatusTag(order.paymentStatus)" size="large" style="margin-left: 10px">
              {{ getPaymentStatusLabel(order.paymentStatus) }}
            </el-tag>
          </div>
        </div>
      </template>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">
          <el-tag :type="getOrderTypeTag(order.type)" size="small">
            {{ getOrderTypeLabel(order.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(order.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名">{{ order.userName }}</el-descriptions-item>
        <el-descriptions-item label="用户手机">{{ order.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="所属门店">{{ order.storeName }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="order" class="vehicle-card">
      <template #header><span>车辆信息</span></template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="车辆名称">{{ order.vehicleName }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ order.vehicleNumber }}</el-descriptions-item>
        <el-descriptions-item label="日租金">¥{{ order.dailyPrice.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="取车门店">{{ order.pickupStore }}</el-descriptions-item>
        <el-descriptions-item label="还车门店">{{ order.returnStore }}</el-descriptions-item>
        <el-descriptions-item label="租赁天数">{{ order.days }} 天</el-descriptions-item>
        <el-descriptions-item label="取车时间">{{ order.pickupTime }}</el-descriptions-item>
        <el-descriptions-item label="还车时间">{{ order.returnTime }}</el-descriptions-item>
        <el-descriptions-item label="租期">{{ order.startDate }} 至 {{ order.endDate }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="order" class="driver-card">
      <template #header><span>驾驶员信息</span></template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="驾驶员姓名">{{ order.driverName }}</el-descriptions-item>
        <el-descriptions-item label="驾驶员手机">{{ order.driverPhone }}</el-descriptions-item>
        <el-descriptions-item label="驾驶证号">{{ order.driverLicense }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ order.emergencyContact }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系电话">{{ order.emergencyPhone }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ order.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="order" class="payment-card">
      <template #header><span>费用信息</span></template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="租金">¥{{ order.totalAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="押金">¥{{ order.depositAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="保险费">¥{{ order.insuranceAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="服务费">¥{{ order.serviceAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">-¥{{ order.discountAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">
          <span style="color: #f56c6c; font-weight: bold; font-size: 16px">
            ¥{{ order.actualAmount.toLocaleString() }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="已支付">¥{{ order.paidAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="已退款">¥{{ order.refundAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="getPaymentStatusTag(order.paymentStatus)" size="small">
            {{ getPaymentStatusLabel(order.paymentStatus) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="order" class="actions-card">
      <template #header><span>订单操作</span></template>
      <div class="action-buttons">
        <el-button v-if="order.status === 'pending_confirm'" type="success" size="large" @click="handleConfirm">确认订单</el-button>
        <el-button v-if="order.status === 'in_use'" type="success" size="large" @click="handleComplete">完成订单</el-button>
        <el-button v-if="['pending_payment', 'pending_confirm', 'confirmed'].includes(order.status)" type="danger" size="large" @click="handleCancel">取消订单</el-button>
        <el-button size="large" @click="handleBack">返回列表</el-button>
      </div>
    </el-card>

    <el-dialog v-model="cancelDialogVisible" title="取消订单" width="500px" @close="handleCancelDialogClose">
      <el-form ref="cancelFormRef" :model="cancelForm" :rules="cancelFormRules" label-width="100px">
        <el-form-item label="取消原因" prop="reason">
          <el-input v-model="cancelForm.reason" type="textarea" :rows="4" placeholder="请输入取消原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="cancelLoading" @click="handleCancelSubmit">确定取消订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { getOrderDetail, confirmOrder, completeOrder, cancelOrder, type Order } from '@/api/order'
import { useErrorHandler } from '@/composables'

const route = useRoute()
const router = useRouter()
const { handleApiError } = useErrorHandler()

const order = ref<Order | null>(null)
const loading = ref(false)
const cancelDialogVisible = ref(false)
const cancelLoading = ref(false)
const cancelFormRef = ref<FormInstance>()
const cancelForm = reactive({ reason: '' })
const cancelFormRules: FormRules = {
  reason: [
    { required: true, message: '请输入取消原因', trigger: 'blur' },
    { min: 5, message: '取消原因至少5个字符', trigger: 'blur' }
  ]
}

const loadOrderDetail = async () => {
  const orderId = Number(route.params.id)
  if (!orderId) {
    ElMessage.error('订单ID无效')
    router.push('/orders/list')
    return
  }
  loading.value = true
  try {
    const res = await getOrderDetail(orderId) as any
    order.value = res.data
  } catch (error) {
    handleApiError(error, '加载订单详情失败')
    router.push('/orders/list')
  } finally {
    loading.value = false
  }
}

const handleConfirm = async () => {
  if (!order.value) return
  try {
    await ElMessageBox.confirm(`确定要确认订单 "${order.value.orderNo}" 吗？`, '确认订单', { type: 'success' })
    await confirmOrder(order.value.id)
    ElMessage.success('订单已确认')
    loadOrderDetail()
  } catch (error) {
    if (error !== 'cancel') handleApiError(error, '确认订单失败')
  }
}

const handleComplete = async () => {
  if (!order.value) return
  try {
    await ElMessageBox.confirm(`确定要完成订单 "${order.value.orderNo}" 吗？`, '完成订单', { type: 'success' })
    await completeOrder(order.value.id)
    ElMessage.success('订单已完成')
    loadOrderDetail()
  } catch (error) {
    if (error !== 'cancel') handleApiError(error, '完成订单失败')
  }
}

const handleCancel = () => { cancelDialogVisible.value = true }

const handleCancelSubmit = async () => {
  if (!cancelFormRef.value || !order.value) return
  await cancelFormRef.value.validate(async (valid) => {
    if (!valid) return
    cancelLoading.value = true
    try {
      await cancelOrder(order.value!.id, cancelForm.reason)
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      loadOrderDetail()
    } catch (error) {
      handleApiError(error, '取消订单失败')
    } finally {
      cancelLoading.value = false
    }
  })
}

const handleCancelDialogClose = () => {
  cancelFormRef.value?.resetFields()
  cancelForm.reason = ''
}

const handleBack = () => { router.push('/orders/list') }

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const getOrderTypeTag = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = { hosting: 'primary', cooperative: 'success' }
  return map[type] || 'info'
}
const getOrderTypeLabel = (type: string) => ({ hosting: '托管订单', cooperative: '合作订单' }[type] || type)
const getOrderStatusTag = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = { pending_payment: 'warning', pending_confirm: 'warning', confirmed: 'primary', in_use: 'success', completed: 'info', cancelled: 'danger', refunding: 'warning', refunded: 'info' }
  return map[status] || 'info'
}
const getOrderStatusLabel = (status: string) => ({ pending_payment: '待支付', pending_confirm: '待确认', confirmed: '已确认', in_use: '使用中', completed: '已完成', cancelled: '已取消', refunding: '退款中', refunded: '已退款' }[status] || status)
const getPaymentStatusTag = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = { unpaid: 'danger', paid: 'success', refunding: 'warning', refunded: 'info' }
  return map[status] || 'info'
}
const getPaymentStatusLabel = (status: string) => ({ unpaid: '未支付', paid: '已支付', refunding: '退款中', refunded: '已退款' }[status] || status)

onMounted(() => { loadOrderDetail() })
</script>

<style scoped lang="scss">
.order-detail-container {
  padding: 20px;
  .detail-card, .vehicle-card, .driver-card, .payment-card, .actions-card { margin-top: 20px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .action-buttons { display: flex; gap: 12px; justify-content: center; padding: 20px 0; }
}
</style>
