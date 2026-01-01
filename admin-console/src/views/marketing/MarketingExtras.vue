<template>
  <div class="marketing-extras-container">
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="extraFeeList"
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
        <el-tag :type="getExtraFeeTypeTag(row.type) as any" size="small">
          {{ getExtraFeeTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #ownerType="{ row }">
        <el-tag :type="row.ownerType === 'platform' ? 'success' : 'primary'" size="small">
          {{ row.ownerType === 'platform' ? '平台' : row.storeName || '门店' }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getExtraFeeStatusTag(row.status) as any" size="small">
          {{ getExtraFeeStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #price="{ row }">
        <span style="color: #f56c6c; font-weight: bold"> ¥{{ row.price }}/{{ row.unit }} </span>
      </template>
      <template #isRequired="{ row }">
        <el-tag :type="row.isRequired ? 'danger' : 'info'" size="small">
          {{ row.isRequired ? '必选' : '可选' }}
        </el-tag>
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
      width="800px"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="增值费用详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentExtraFee" :column="2" border>
        <el-descriptions-item label="费用ID">{{ currentExtraFee.id }}</el-descriptions-item>
        <el-descriptions-item label="费用名称">{{ currentExtraFee.name }}</el-descriptions-item>
        <el-descriptions-item label="费用类型">
          <el-tag :type="getExtraFeeTypeTag(currentExtraFee.type) as any" size="small">
            {{ getExtraFeeTypeLabel(currentExtraFee.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="费用状态">
          <el-tag :type="getExtraFeeStatusTag(currentExtraFee.status) as any" size="small">
            {{ getExtraFeeStatusLabel(currentExtraFee.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="费用价格"
          >¥{{ currentExtraFee.price }}/{{ currentExtraFee.unit }}</el-descriptions-item
        >
        <el-descriptions-item label="是否必选">
          <el-tag :type="currentExtraFee.isRequired ? 'danger' : 'info'" size="small">
            {{ currentExtraFee.isRequired ? '必选' : '可选' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="归属方">
          <el-tag
            :type="currentExtraFee.ownerType === 'platform' ? 'success' : 'primary'"
            size="small"
          >
            {{ currentExtraFee.ownerType === 'platform' ? '平台' : '门店' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属门店">
          {{ currentExtraFee.storeName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentExtraFee.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          currentExtraFee.createdAt
        }}</el-descriptions-item>
        <el-descriptions-item label="费用说明" :span="2">
          {{ currentExtraFee.description }}
        </el-descriptions-item>
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
import {
  getExtraFeeList,
  createExtraFee,
  updateExtraFee,
  deleteExtraFee,
  type ExtraFee,
  type ExtraFeeListParams,
} from '@/api/marketing'
import { getStoreList } from '@/api/store'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

// 门店选项
const storeOptions = ref<Array<{ label: string; value: number }>>([])

const EXTRA_FEE_TYPE_OPTIONS = [
  { label: '保险服务', value: 'insurance' },
  { label: '设备租赁', value: 'equipment' },
  { label: '增值服务', value: 'service' },
  { label: '其他费用', value: 'other' },
]

const EXTRA_FEE_STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '未生效', value: 'inactive' },
]

const OWNER_TYPE_OPTIONS = [
  { label: '平台', value: 'platform' },
  { label: '门店', value: 'store' },
]

const searchForm = reactive<ExtraFeeListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '费用名称',
    width: '200px',
  },
  {
    prop: 'type',
    label: '费用类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: EXTRA_FEE_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '费用状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: EXTRA_FEE_STATUS_OPTIONS,
  },
])

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '费用名称', minWidth: 180 },
  { prop: 'type', label: '类型', width: 120, slot: 'type' },
  { prop: 'ownerType', label: '归属方', width: 120, slot: 'ownerType' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'price', label: '价格', width: 120, slot: 'price' },
  { prop: 'isRequired', label: '是否必选', width: 100, slot: 'isRequired' },
  { prop: 'description', label: '说明', minWidth: 200 },
  { prop: 'createdBy', label: '创建人', width: 120 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增费用',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: ExtraFee) => handleView(row),
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: ExtraFee) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: ExtraFee) => handleDelete(row),
  },
]

const extraFeeList = ref<ExtraFee[]>([])
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
const currentExtraFeeId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentExtraFee = ref<ExtraFee | null>(null)

// 计费单位选项
const UNIT_OPTIONS = [
  { label: '天', value: '天' },
  { label: '次', value: '次' },
  { label: '个', value: '个' },
  { label: '套', value: '套' },
]

// 表单数据
const formData = reactive({
  name: '',
  type: 'insurance',
  status: 'inactive',
  price: 0,
  unit: '天',
  isRequired: false,
  description: '',
  ownerType: 'platform',
  storeId: undefined as number | undefined,
  autoAllocate: false,
  allocationStrategy: 'split_evenly' as 'same_store' | 'split_evenly' | 'custom',
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
        label: '费用名称',
        type: 'input',
        placeholder: '请输入费用名称',
        span: 12,
      },
      {
        prop: 'type',
        label: '费用类型',
        type: 'select',
        options: EXTRA_FEE_TYPE_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'status',
        label: '费用状态',
        type: 'select',
        options: EXTRA_FEE_STATUS_OPTIONS,
        span: 12,
      },
      {
        prop: 'isRequired',
        label: '是否必选',
        type: 'switch',
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '归属方配置',
    tip: '配置费用的归属和分配规则',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'autoAllocate',
        label: '自动分配',
        type: 'switch',
        span: 24,
        tip: '开启后,费用将根据订单的取车和还车门店自动分配。关闭则使用固定归属方',
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'ownerType',
        label: '归属方',
        type: 'select',
        options: [
          { label: '平台', value: 'platform' },
          { label: '门店', value: 'store' },
        ],
        span: 12,
        tip: '选择费用固定归属方',
        show: !formData.autoAllocate,
      },
      {
        prop: 'storeId',
        label: '所属门店',
        type: 'select',
        options: storeOptions.value,
        span: 12,
        tip: '当归属方为门店时必选',
        show: !formData.autoAllocate && formData.ownerType === 'store',
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'allocationStrategy',
        label: '分配策略',
        type: 'select',
        options: [
          { label: '同店100%归属', value: 'same_store' },
          { label: '不同店平均分配', value: 'split_evenly' },
        ],
        span: 24,
        tip: '同店:取还车同一门店时100%归该店;不同店:取还车不同门店时平均分配',
        show: formData.autoAllocate,
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
        prop: 'price',
        label: '费用价格',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：元',
      },
      {
        prop: 'unit',
        label: '计费单位',
        type: 'select',
        options: UNIT_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '费用说明',
  },
  {
    prop: 'description',
    label: '费用说明',
    type: 'textarea',
    rows: 5,
    placeholder: '请输入费用说明',
    maxlength: 500,
  },
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入费用名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择费用状态', trigger: 'change' }],
  price: [{ required: true, message: '请输入费用价格', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择计费单位', trigger: 'change' }],
  ownerType: [
    {
      required: false,
      validator: (_rule: any, value: any, callback: any) => {
        if (!formData.autoAllocate && !value) {
          callback(new Error('当未开启自动分配时，必须选择归属方'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  storeId: [
    {
      required: false,
      validator: (_rule: any, value: any, callback: any) => {
        if (!formData.autoAllocate && formData.ownerType === 'store' && !value) {
          callback(new Error('当归属方为门店时，必须选择所属门店'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  allocationStrategy: [
    {
      required: false,
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.autoAllocate && !value) {
          callback(new Error('当开启自动分配时，必须选择分配策略'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

const loadExtraFeeList = async () => {
  loading.value = true
  try {
    const params: ExtraFeeListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = (await getExtraFeeList(params)) as any
    extraFeeList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载增值费用列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadExtraFeeList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  pagination.page = 1
  loadExtraFeeList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = 'insurance'
  formData.status = 'inactive'
  formData.price = 0
  formData.unit = '天'
  formData.isRequired = false
  formData.description = ''
  formData.ownerType = 'platform'
  formData.storeId = undefined
  formData.autoAllocate = false
  formData.allocationStrategy = 'split_evenly'
}

// 创建费用
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentExtraFeeId.value = null
  dialogTitle.value = '新增增值费用'
  dialogVisible.value = true
}

// 编辑费用
const handleEdit = (row: ExtraFee) => {
  resetForm()
  isEdit.value = true
  currentExtraFeeId.value = row.id
  dialogTitle.value = '编辑增值费用'

  // 填充表单数据
  formData.name = row.name
  formData.type = row.type
  formData.status = row.status
  formData.price = row.price
  formData.unit = row.unit
  formData.isRequired = row.isRequired
  formData.description = row.description
  formData.ownerType = row.ownerType
  formData.storeId = row.storeId
  formData.autoAllocate = row.autoAllocate || false
  formData.allocationStrategy = row.allocationStrategy || 'split_evenly'

  dialogVisible.value = true
}

// 查看费用详情
const handleView = (row: ExtraFee) => {
  currentExtraFee.value = row
  detailDialogVisible.value = true
}

// 删除费用
const handleDelete = async (row: ExtraFee) => {
  try {
    await ElMessageBox.confirm(`确定要删除增值费用"${row.name}"吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteExtraFee(row.id)
    ElMessage.success('删除成功')
    loadExtraFeeList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除增值费用失败')
    }
  }
}

// 提交表单
const handleSubmit = async (_data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value && currentExtraFeeId.value) {
      await updateExtraFee(currentExtraFeeId.value, formData)
      ElMessage.success('编辑成功')
    } else {
      await createExtraFee(formData)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadExtraFeeList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑增值费用失败' : '创建增值费用失败')
  } finally {
    submitLoading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadExtraFeeList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadExtraFeeList()
}

const getExtraFeeTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    insurance: 'danger',
    equipment: 'primary',
    service: 'success',
    other: 'info',
  }
  return tagMap[type] || 'info'
}

const getExtraFeeTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    insurance: '保险服务',
    equipment: '设备租赁',
    service: '增值服务',
    other: '其他费用',
  }
  return labelMap[type] || type
}

const getExtraFeeStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
  }
  return tagMap[status] || 'info'
}

const getExtraFeeStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
  }
  return labelMap[status] || status
}

// 加载门店列表
const loadStoreList = async () => {
  try {
    const res = (await getStoreList({ page: 1, pageSize: 1000 })) as any
    storeOptions.value = res.data.list.map((store: any) => ({
      label: store.name,
      value: store.id,
    }))
  } catch (error) {
    handleApiError(error, '加载门店列表失败')
  }
}

onMounted(() => {
  loadExtraFeeList()
  loadStoreList()
})
</script>

<style scoped lang="scss">
.marketing-extras-container {
  padding: 20px;
}
</style>
