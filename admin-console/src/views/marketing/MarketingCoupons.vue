<!-- @ts-nocheck -->
<template>
  <div class="marketing-coupons-container">
    <PageHeader title="优惠券管理" description="管理优惠券创建、发放和核销" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="couponList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #type="{ row }">
        <el-tag :type="(getCouponTypeTag(row.type)) as any" size="small">
          {{ getCouponTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="(getCouponStatusTag(row.status)) as any" size="small">
          {{ getCouponStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #discount="{ row }">
        <span style="color: #f56c6c; font-weight: bold">
          {{ row.discountType === 'percentage' ? `${row.discountValue}%` : `¥${row.discountValue}` }}
        </span>
      </template>
      <template #quantity="{ row }">
        <div style="font-size: 12px">
          <div>总量: {{ row.totalQuantity }}</div>
          <div style="color: #67c23a">已用: {{ row.usedQuantity }}</div>
          <div style="color: #409eff">剩余: {{ row.remainingQuantity }}</div>
        </div>
      </template>
      <template #targetUserTags="{ row }">
        <el-tag
          v-for="tagId in row.targetUserTags"
          :key="tagId"
          size="small"
          style="margin-right: 4px"
        >
          {{ getTagName(tagId) }}
        </el-tag>
        <span v-if="!row.targetUserTags || row.targetUserTags.length === 0" style="color: #909399">
          全部用户
        </span>
      </template>
      <template #dateRange="{ row }">
        <div style="font-size: 12px">
          <div>{{ row.startDate }}</div>
          <div>{{ row.endDate }}</div>
        </div>
      </template>
    </DataTable>

    <!-- 创建/编辑对话框 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="formFields"
      :form-data="formData"
      :rules="formRules"
      :loading="submitLoading"
      width="900px"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="优惠券详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentCoupon" :column="2" border>
        <el-descriptions-item label="优惠券ID">{{ currentCoupon.id }}</el-descriptions-item>
        <el-descriptions-item label="优惠券名称">{{ currentCoupon.name }}</el-descriptions-item>
        <el-descriptions-item label="优惠码">{{ currentCoupon.code }}</el-descriptions-item>
        <el-descriptions-item label="优惠券类型">
          <el-tag :type="(getCouponTypeTag(currentCoupon.type)) as any" size="small">
            {{ getCouponTypeLabel(currentCoupon.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优惠券状态">
          <el-tag :type="(getCouponStatusTag(currentCoupon.status)) as any" size="small">
            {{ getCouponStatusLabel(currentCoupon.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优惠类型">
          {{ currentCoupon.discountType === 'percentage' ? '百分比折扣' : '固定金额' }}
        </el-descriptions-item>
        <el-descriptions-item label="优惠额度">
          <span style="color: #f56c6c; font-weight: bold">
            {{ currentCoupon.discountType === 'percentage' ? `${currentCoupon.discountValue}%` : `¥${currentCoupon.discountValue}` }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="最低消费">¥{{ currentCoupon.minAmount }}</el-descriptions-item>
        <el-descriptions-item label="最高优惠">¥{{ currentCoupon.maxDiscount }}</el-descriptions-item>
        <el-descriptions-item label="总发行量">{{ currentCoupon.totalQuantity }}</el-descriptions-item>
        <el-descriptions-item label="已使用">{{ currentCoupon.usedQuantity }}</el-descriptions-item>
        <el-descriptions-item label="剩余数量">{{ currentCoupon.remainingQuantity }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ currentCoupon.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ currentCoupon.endDate }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentCoupon.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="目标用户标签" :span="2">
          <el-tag v-for="tagId in currentCoupon.targetUserTags" :key="tagId" size="small" style="margin-right: 8px">
            {{ getTagName(tagId) }}
          </el-tag>
          <span v-if="!currentCoupon.targetUserTags || currentCoupon.targetUserTags.length === 0" style="color: #909399">
            全部用户
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="适用车型" :span="2">
          <el-tag v-for="(type, index) in currentCoupon.applicableVehicles" :key="index" size="small" type="info" style="margin-right: 8px">
            {{ type }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优惠券描述" :span="2">
          {{ currentCoupon.description }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentCoupon.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getCouponList,
  type Coupon,
  type CouponListParams
} from '@/api/marketing'
import { tagApi, type Tag } from '@/api/user'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 标签列表
const tagList = ref<Tag[]>([])
const tagOptions = computed(() =>
  tagList.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
)

// 优惠券类型选项
const COUPON_TYPE_OPTIONS = [
  { label: '折扣券', value: 'discount' },
  { label: '代金券', value: 'cash' },
  { label: '礼品券', value: 'gift' }
]

// 优惠券状态选项
const COUPON_STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '未生效', value: 'inactive' },
  { label: '已过期', value: 'expired' }
]

// 优惠类型选项
const DISCOUNT_TYPE_OPTIONS = [
  { label: '百分比折扣', value: 'percentage' },
  { label: '固定金额', value: 'fixed' }
]

// 车型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: 'A型房车', value: 'A型房车' },
  { label: 'B型房车', value: 'B型房车' },
  { label: 'C型房车', value: 'C型房车' },
  { label: '拖挂房车', value: '拖挂房车' },
  { label: '所有车型', value: '所有车型' }
]

// 搜索表单
const searchForm = reactive<CouponListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  tagId: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '优惠券名称/代码',
    width: '200px'
  },
  {
    prop: 'type',
    label: '优惠券类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: COUPON_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '优惠券状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: COUPON_STATUS_OPTIONS
  },
  {
    prop: 'tagId',
    label: '用户标签',
    type: 'select',
    placeholder: '请选择标签',
    width: '150px',
    options: tagOptions.value
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '优惠券名称', minWidth: 180 },
  { prop: 'code', label: '优惠码', width: 120 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'discount', label: '优惠额度', width: 100, slot: 'discount' },
  { prop: 'minAmount', label: '最低消费', width: 100 },
  { prop: 'targetUserTags', label: '目标用户标签', width: 150, slot: 'targetUserTags' },
  { prop: 'quantity', label: '数量统计', width: 120, slot: 'quantity' },
  { prop: 'dateRange', label: '有效期', width: 180, slot: 'dateRange' },
  { prop: 'createdBy', label: '创建人', width: 120 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增优惠券',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Coupon) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Coupon) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Coupon) => handleDelete(row)
  }
]

// 优惠券列表
const couponList = ref<Coupon[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentCouponId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentCoupon = ref<Coupon | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  type: 'discount',
  status: 'inactive',
  discountType: 'percentage',
  discountValue: 0,
  minAmount: 0,
  maxDiscount: 0,
  totalQuantity: 0,
  startDate: '',
  endDate: '',
  targetUserTags: [] as number[],
  applicableVehicles: [] as string[],
  description: ''
})

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'divider',
    label: '基本信息'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'name',
        label: '优惠券名称',
        type: 'input',
        placeholder: '请输入优惠券名称',
        span: 12
      },
      {
        prop: 'code',
        label: '优惠码',
        type: 'input',
        placeholder: '请输入优惠码',
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'type',
        label: '优惠券类型',
        type: 'select',
        options: COUPON_TYPE_OPTIONS,
        span: 12
      },
      {
        prop: 'status',
        label: '优惠券状态',
        type: 'select',
        options: COUPON_STATUS_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'divider',
    label: '优惠设置'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'discountType',
        label: '优惠类型',
        type: 'select',
        options: DISCOUNT_TYPE_OPTIONS,
        span: 12
      },
      {
        prop: 'discountValue',
        label: '优惠额度',
        type: 'number',
        min: 0,
        span: 12,
        tip: '百分比填1-100，固定金额填具体数值'
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'minAmount',
        label: '最低消费',
        type: 'number',
        min: 0,
        span: 12,
        tip: '满多少元可用'
      },
      {
        prop: 'maxDiscount',
        label: '最高优惠',
        type: 'number',
        min: 0,
        span: 12,
        tip: '最多优惠多少元'
      }
    ]
  },
  {
    type: 'divider',
    label: '发行设置'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'totalQuantity',
        label: '发行数量',
        type: 'number',
        min: 1,
        span: 12
      },
      {
        prop: 'startDate',
        label: '开始日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      }
    ]
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'date',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    type: 'divider',
    label: '适用范围'
  },
  {
    prop: 'targetUserTags',
    label: '目标用户标签',
    type: 'select',
    multiple: true,
    options: tagOptions.value,
    placeholder: '请选择目标用户标签（不选则全部用户可用）',
    tip: '选择可使用此优惠券的用户标签，不选则全部用户可用'
  },
  {
    prop: 'applicableVehicles',
    label: '适用车型',
    type: 'checkbox',
    options: VEHICLE_TYPE_OPTIONS
  },
  {
    prop: 'description',
    label: '优惠券描述',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入优惠券描述',
    maxlength: 500
  }
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入优惠码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择优惠券状态', trigger: 'change' }],
  discountType: [{ required: true, message: '请选择优惠类型', trigger: 'change' }],
  discountValue: [{ required: true, message: '请输入优惠额度', trigger: 'blur' }],
  minAmount: [{ required: true, message: '请输入最低消费', trigger: 'blur' }],
  maxDiscount: [{ required: true, message: '请输入最高优惠', trigger: 'blur' }],
  totalQuantity: [{ required: true, message: '请输入发行数量', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  applicableVehicles: [{ required: true, message: '请选择适用车型', trigger: 'change' }]
}

// 加载优惠券列表
const loadCouponList = async () => {
  loading.value = true
  try {
    const params: CouponListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getCouponList(params) as any
    couponList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载优惠券列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadCouponList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.tagId = undefined
  pagination.page = 1
  loadCouponList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.type = 'discount'
  formData.status = 'inactive'
  formData.discountType = 'percentage'
  formData.discountValue = 0
  formData.minAmount = 0
  formData.maxDiscount = 0
  formData.totalQuantity = 0
  formData.startDate = ''
  formData.endDate = ''
  formData.targetUserTags = []
  formData.applicableVehicles = []
  formData.description = ''
}

// 创建优惠券
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentCouponId.value = null
  dialogTitle.value = '新增优惠券'
  dialogVisible.value = true
}

// 编辑优惠券
const handleEdit = (row: Coupon) => {
  resetForm()
  isEdit.value = true
  currentCouponId.value = row.id
  dialogTitle.value = '编辑优惠券'

  // 填充表单数据
  formData.name = row.name
  formData.code = row.code
  formData.type = row.type
  formData.status = row.status
  formData.discountType = row.discountType
  formData.discountValue = row.discountValue
  formData.minAmount = row.minAmount
  formData.maxDiscount = row.maxDiscount
  formData.totalQuantity = row.totalQuantity
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.targetUserTags = row.targetUserTags ? [...row.targetUserTags] : []
  formData.applicableVehicles = [...row.applicableVehicles]
  formData.description = row.description

  dialogVisible.value = true
}

// 查看优惠券详情
const handleView = (row: Coupon) => {
  currentCoupon.value = row
  detailDialogVisible.value = true
}

// 删除优惠券
const handleDelete = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除优惠券"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadCouponList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除优惠券失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      // TODO: 调用编辑API
      ElMessage.success('编辑成功')
    } else {
      // TODO: 调用创建API
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadCouponList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑优惠券失败' : '创建优惠券失败')
  } finally {
    submitLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadCouponList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadCouponList()
}

// 获取优惠券类型标签类型
const getCouponTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    discount: 'warning',
    cash: 'success',
    gift: 'primary'
  }
  return tagMap[type] || 'info'
}

// 获取优惠券类型标签文本
const getCouponTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    discount: '折扣券',
    cash: '代金券',
    gift: '礼品券'
  }
  return labelMap[type] || type
}

// 获取优惠券状态标签类型
const getCouponStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    expired: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取优惠券状态标签文本
const getCouponStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
    expired: '已过期'
  }
  return labelMap[status] || status
}

// 获取标签名称
const getTagName = (tagId: number) => {
  const tag = tagList.value.find(t => t.id === tagId)
  return tag ? tag.name : `标签${tagId}`
}

// 加载标签列表
const loadTagList = async () => {
  try {
    const res = await tagApi.getTagList({
      page: 1,
      pageSize: 100,
      status: 'active'
    }) as any
    tagList.value = res.data.list
  } catch (error) {
    handleApiError(error, '加载标签列表失败')
  }
}

// 页面加载
onMounted(() => {
  loadTagList()
  loadCouponList()
})
</script>

<style scoped lang="scss">
.marketing-coupons-container {
  padding: 20px;
}
</style>
