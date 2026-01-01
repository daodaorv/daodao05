<template>
  <div class="marketing-packages-container">
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="packageList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #status="{ row }">
        <el-tag :type="getPackageStatusTag(row.status) as any" size="small">
          {{ getPackageStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #price="{ row }">
        <div style="font-size: 12px">
          <div style="text-decoration: line-through; color: #909399">
            原价: ¥{{ row.originalPrice }}
          </div>
          <div style="color: #f56c6c; font-weight: bold">套餐价: ¥{{ row.packagePrice }}</div>
          <div style="color: #67c23a">优惠: {{ row.discount }}%</div>
        </div>
      </template>
      <template #quantity="{ row }">
        <div style="font-size: 12px">
          <div>总量: {{ row.totalQuantity }}</div>
          <div style="color: #f56c6c">已售: {{ row.soldQuantity }}</div>
          <div style="color: #67c23a">剩余: {{ row.remainingQuantity }}</div>
        </div>
      </template>
      <template #includes="{ row }">
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <el-tag
            v-for="(item, index) in row.includes.slice(0, 3)"
            :key="index"
            size="small"
            type="info"
          >
            {{ item }}
          </el-tag>
          <el-tag v-if="row.includes.length > 3" size="small" type="warning">
            +{{ row.includes.length - 3 }}
          </el-tag>
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
      title="特惠套餐详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentPackage" :column="2" border>
        <el-descriptions-item label="套餐ID">{{ currentPackage.id }}</el-descriptions-item>
        <el-descriptions-item label="套餐名称">{{ currentPackage.name }}</el-descriptions-item>
        <el-descriptions-item label="套餐状态">
          <el-tag :type="getPackageStatusTag(currentPackage.status) as any" size="small">
            {{ getPackageStatusLabel(currentPackage.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="适用车型">{{
          currentPackage.vehicleType
        }}</el-descriptions-item>
        <el-descriptions-item label="租赁天数">{{ currentPackage.days }}天</el-descriptions-item>
        <el-descriptions-item label="原价"
          >¥{{ currentPackage.originalPrice }}</el-descriptions-item
        >
        <el-descriptions-item label="套餐价"
          >¥{{ currentPackage.packagePrice }}</el-descriptions-item
        >
        <el-descriptions-item label="优惠折扣">{{ currentPackage.discount }}%</el-descriptions-item>
        <el-descriptions-item label="总发行量">{{
          currentPackage.totalQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="已售数量">{{
          currentPackage.soldQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="剩余数量">{{
          currentPackage.remainingQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ currentPackage.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ currentPackage.endDate }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentPackage.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="包含内容" :span="2">
          <el-tag
            v-for="(item, index) in currentPackage.includes"
            :key="index"
            size="small"
            type="info"
            style="margin-right: 8px"
          >
            {{ item }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="套餐描述" :span="2">
          {{ currentPackage.description }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{
          currentPackage.createdAt
        }}</el-descriptions-item>
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
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import { getPackageList, type Package, type PackageListParams } from '@/api/marketing'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

const PACKAGE_STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '未生效', value: 'inactive' },
  { label: '已售罄', value: 'soldout' },
]

const searchForm = reactive<PackageListParams>({
  keyword: '',
  status: undefined,
  vehicleType: '',
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '套餐名称',
    width: '200px',
  },
  {
    prop: 'status',
    label: '套餐状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: PACKAGE_STATUS_OPTIONS,
  },
  {
    prop: 'vehicleType',
    label: '车型',
    type: 'input',
    placeholder: '车型名称',
    width: '150px',
  },
])

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '套餐名称', minWidth: 180 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'vehicleType', label: '车型', width: 120 },
  { prop: 'days', label: '天数', width: 80 },
  { prop: 'price', label: '价格信息', width: 160, slot: 'price' },
  { prop: 'quantity', label: '数量统计', width: 120, slot: 'quantity' },
  { prop: 'includes', label: '包含内容', minWidth: 250, slot: 'includes' },
  { prop: 'startDate', label: '开始时间', width: 120 },
  { prop: 'endDate', label: '结束时间', width: 120 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增套餐',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Package) => handleView(row),
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Package) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Package) => handleDelete(row),
  },
]

const packageList = ref<Package[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentPackageId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentPackage = ref<Package | null>(null)

// 车型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: 'A型房车', value: 'A型房车' },
  { label: 'B型房车', value: 'B型房车' },
  { label: 'C型房车', value: 'C型房车' },
  { label: '拖挂房车', value: '拖挂房车' },
]

// 表单数据
const formData = reactive({
  name: '',
  status: 'inactive',
  vehicleType: '',
  days: 0,
  originalPrice: 0,
  packagePrice: 0,
  discount: 0,
  totalQuantity: 0,
  startDate: '',
  endDate: '',
  includes: [] as string[],
  description: '',
})

// 表单字段配置
const formFields = computed(() => [
  {
    type: 'divider',
    label: '基本信息',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'name',
        label: '套餐名称',
        type: 'input',
        placeholder: '请输入套餐名称',
        span: 12,
      },
      {
        prop: 'status',
        label: '套餐状态',
        type: 'select',
        options: PACKAGE_STATUS_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'vehicleType',
        label: '适用车型',
        type: 'select',
        options: VEHICLE_TYPE_OPTIONS,
        span: 12,
      },
      {
        prop: 'days',
        label: '租赁天数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：天',
      },
    ],
  },
  {
    type: 'divider',
    label: '价格设置',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'originalPrice',
        label: '原价',
        type: 'number',
        min: 0,
        span: 8,
        tip: '单位：元',
      },
      {
        prop: 'packagePrice',
        label: '套餐价',
        type: 'number',
        min: 0,
        span: 8,
        tip: '单位：元',
      },
      {
        prop: 'discount',
        label: '优惠折扣',
        type: 'number',
        min: 0,
        max: 100,
        span: 8,
        tip: '单位：%',
      },
    ],
  },
  {
    type: 'divider',
    label: '发行设置',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'totalQuantity',
        label: '发行数量',
        type: 'number',
        min: 1,
        span: 12,
      },
      {
        prop: 'startDate',
        label: '开始日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12,
      },
    ],
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'date',
    valueFormat: 'YYYY-MM-DD',
  },
  {
    type: 'divider',
    label: '套餐内容',
  },
  {
    prop: 'includes',
    label: '包含内容',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入包含内容，多项用逗号分隔',
    tip: '例如：基础保险,GPS导航,户外桌椅',
  },
  {
    prop: 'description',
    label: '套餐描述',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入套餐描述',
    maxlength: 500,
  },
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择套餐状态', trigger: 'change' }],
  vehicleType: [{ required: true, message: '请选择适用车型', trigger: 'change' }],
  days: [{ required: true, message: '请输入租赁天数', trigger: 'blur' }],
  originalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  packagePrice: [{ required: true, message: '请输入套餐价', trigger: 'blur' }],
  discount: [{ required: true, message: '请输入优惠折扣', trigger: 'blur' }],
  totalQuantity: [{ required: true, message: '请输入发行数量', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
}

const loadPackageList = async () => {
  loading.value = true
  try {
    const params: PackageListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = (await getPackageList(params)) as any
    packageList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载特惠套餐列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadPackageList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  searchForm.vehicleType = ''
  pagination.page = 1
  loadPackageList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.status = 'inactive'
  formData.vehicleType = ''
  formData.days = 0
  formData.originalPrice = 0
  formData.packagePrice = 0
  formData.discount = 0
  formData.totalQuantity = 0
  formData.startDate = ''
  formData.endDate = ''
  formData.includes = []
  formData.description = ''
}

// 创建套餐
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentPackageId.value = null
  dialogTitle.value = '新增特惠套餐'
  dialogVisible.value = true
}

// 编辑套餐
const handleEdit = (row: Package) => {
  resetForm()
  isEdit.value = true
  currentPackageId.value = row.id
  dialogTitle.value = '编辑特惠套餐'

  // 填充表单数据
  formData.name = row.name
  formData.status = row.status
  formData.vehicleType = row.vehicleType
  formData.days = row.days
  formData.originalPrice = row.originalPrice
  formData.packagePrice = row.packagePrice
  formData.discount = row.discount
  formData.totalQuantity = row.totalQuantity
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.includes = [...row.includes]
  formData.description = row.description

  dialogVisible.value = true
}

// 查看套餐详情
const handleView = (row: Package) => {
  currentPackage.value = row
  detailDialogVisible.value = true
}

// 删除套餐
const handleDelete = async (row: Package) => {
  try {
    await ElMessageBox.confirm(`确定要删除特惠套餐"${row.name}"吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadPackageList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除特惠套餐失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    // 处理包含内容字段(将逗号分隔的字符串转为数组)
    if (typeof data.includes === 'string') {
      data.includes = data.includes
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item)
    }

    if (isEdit.value) {
      // TODO: 调用编辑API
      ElMessage.success('编辑成功')
    } else {
      // TODO: 调用创建API
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadPackageList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑特惠套餐失败' : '创建特惠套餐失败')
  } finally {
    submitLoading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadPackageList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadPackageList()
}

const getPackageStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    soldout: 'danger',
  }
  return tagMap[status] || 'info'
}

const getPackageStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
    soldout: '已售罄',
  }
  return labelMap[status] || status
}

onMounted(() => {
  loadPackageList()
})
</script>

<style scoped lang="scss">
.marketing-packages-container {
  padding: 20px;
}
</style>
