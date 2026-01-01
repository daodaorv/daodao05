<!-- 特殊费用管理页面 -->
<template>
  <div class="special-fees-container">
    <!-- 搜索表单 -->
    <SearchForm :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :toolbar-buttons="toolbarButtons"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #calculationType="{ row }">
        <el-tag v-if="row.calculationType === 'fixed'" type="primary" size="small">固定金额</el-tag>
        <el-tag v-else-if="row.calculationType === 'distance'" type="success" size="small"
          >按距离计算</el-tag
        >
        <el-tag v-else type="info" size="small">-</el-tag>
      </template>

      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <template #price="{ row }">
        <span v-if="row.calculationType === 'distance'" style="color: #67c23a; font-weight: bold">
          ¥{{ row.distanceUnitPrice }}/公里
        </span>
        <span v-else style="color: #f56c6c; font-weight: bold">
          ¥{{ row.price }}/{{ row.unit }}
        </span>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
      @submit="handleSubmit"
      @cancel="dialogVisible = false"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="特殊费用详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentFee" :column="2" border>
        <el-descriptions-item label="费用名称">{{ currentFee.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTag(currentFee.status)" size="small">
            {{ getStatusLabel(currentFee.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="计算方式">
          <el-tag v-if="currentFee.calculationType === 'fixed'" type="primary" size="small"
            >固定金额</el-tag
          >
          <el-tag v-else-if="currentFee.calculationType === 'distance'" type="success" size="small"
            >按距离计算</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item label="费用价格">
          <span v-if="currentFee.calculationType === 'distance'">
            ¥{{ currentFee.distanceUnitPrice }}/公里
          </span>
          <span v-else> ¥{{ currentFee.price }}/{{ currentFee.unit }} </span>
        </el-descriptions-item>
        <el-descriptions-item label="费用说明" :span="2">
          {{ currentFee.description }}
        </el-descriptions-item>
        <el-descriptions-item label="分配规则" :span="2">
          <el-table :data="currentFee.allocationRules" border size="small">
            <el-table-column prop="partyType" label="分配方" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.partyType === 'platform'" type="success" size="small"
                  >平台</el-tag
                >
                <el-tag v-else-if="row.partyType === 'pickup_store'" type="primary" size="small"
                  >取车门店</el-tag
                >
                <el-tag v-else-if="row.partyType === 'return_store'" type="warning" size="small"
                  >还车门店</el-tag
                >
                <el-tag v-else type="info" size="small">服务门店</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="分配比例" width="120">
              <template #default="{ row }"> {{ row.percentage }}% </template>
            </el-table-column>
            <el-table-column prop="partyName" label="备注" />
          </el-table>
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
import { ref, reactive, computed, onMounted, h } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElButton,
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getSpecialFeeList,
  createSpecialFee,
  updateSpecialFee,
  deleteSpecialFee,
  type ExtraFee,
  type ExtraFeeListParams,
} from '@/api/marketing'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '费用名称',
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '生效中', value: 'active' },
      { label: '未生效', value: 'inactive' },
    ],
  },
  {
    type: 'select',
    prop: 'calculationType',
    label: '计算方式',
    placeholder: '请选择计算方式',
    options: [
      { label: '固定金额', value: 'fixed' },
      { label: '按距离计算', value: 'distance' },
    ],
  },
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '费用名称', minWidth: 180 },
  { prop: 'calculationType', label: '计算方式', width: 120, slot: 'calculationType' },
  { prop: 'price', label: '价格', width: 150, slot: 'price' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'description', label: '说明', minWidth: 200 },
  { prop: 'actions', label: '操作', width: 200, slot: 'actions', fixed: 'right' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增特殊费用',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
]

// 表格数据
const tableData = ref<ExtraFee[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 搜索参数
const searchForm = reactive<ExtraFeeListParams>({
  keyword: '',
  status: undefined,
  calculationType: undefined,
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const currentFeeId = ref<number | null>(null)
const submitLoading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentFee = ref<ExtraFee | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  status: 'inactive',
  calculationType: 'distance',
  price: 0,
  unit: '次',
  distanceUnitPrice: 0,
  description: '',
  allocationRules: [
    { partyType: 'pickup_store', percentage: 50 },
    { partyType: 'return_store', percentage: 50 },
  ],
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
        prop: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '生效中', value: 'active' },
          { label: '未生效', value: 'inactive' },
        ],
        span: 12,
      },
    ],
  },
  {
    type: 'divider',
    label: '计算方式',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'calculationType',
        label: '计算方式',
        type: 'select',
        options: [
          { label: '固定金额', value: 'fixed' },
          { label: '按距离计算', value: 'distance' },
        ],
        span: 12,
        tip: '选择费用计算方式',
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'price',
        label: '固定金额',
        type: 'number',
        placeholder: '请输入固定金额',
        span: 12,
        show: formData.calculationType === 'fixed',
      },
      {
        prop: 'unit',
        label: '计费单位',
        type: 'select',
        options: [
          { label: '次', value: '次' },
          { label: '天', value: '天' },
          { label: '小时', value: '小时' },
        ],
        span: 12,
        show: formData.calculationType === 'fixed',
      },
      {
        prop: 'distanceUnitPrice',
        label: '单价(元/公里)',
        type: 'number',
        placeholder: '请输入单价',
        span: 12,
        show: formData.calculationType === 'distance',
        tip: '费用 = 单价 × 两店间距离(公里)',
      },
    ],
  },
  {
    type: 'divider',
    label: '分配规则',
    tip: '配置费用在各方之间的分配比例,总比例必须为100%',
  },
  {
    type: 'custom',
    prop: 'allocationRules',
    label: '分配规则',
    render: () => {
      return h('div', [
        h(
          ElTable,
          { data: formData.allocationRules, border: true, size: 'small' },
          {
            default: () => [
              h(
                ElTableColumn,
                { prop: 'partyType', label: '分配方', width: 150 },
                {
                  default: ({ row }: any) =>
                    h(
                      ElSelect,
                      {
                        modelValue: row.partyType,
                        'onUpdate:modelValue': (val: string) => {
                          row.partyType = val
                        },
                        placeholder: '请选择',
                        size: 'small',
                      },
                      {
                        default: () => [
                          h(ElOption, { label: '平台', value: 'platform' }),
                          h(ElOption, { label: '取车门店', value: 'pickup_store' }),
                          h(ElOption, { label: '还车门店', value: 'return_store' }),
                        ],
                      }
                    ),
                }
              ),
              h(
                ElTableColumn,
                { prop: 'percentage', label: '分配比例(%)', width: 150 },
                {
                  default: ({ row }: any) =>
                    h(ElInputNumber, {
                      modelValue: row.percentage,
                      'onUpdate:modelValue': (val: number) => {
                        row.percentage = val
                      },
                      min: 0,
                      max: 100,
                      precision: 2,
                      size: 'small',
                      style: 'width: 100%',
                    }),
                }
              ),
              h(
                ElTableColumn,
                { label: '操作', width: 100 },
                {
                  default: ({ $index }: any) =>
                    h(
                      ElButton,
                      {
                        link: true,
                        type: 'danger',
                        size: 'small',
                        onClick: () => handleRemoveAllocationRule($index),
                      },
                      { default: () => '删除' }
                    ),
                }
              ),
            ],
          }
        ),
        h(
          ElButton,
          {
            type: 'primary',
            size: 'small',
            style: 'margin-top: 10px',
            onClick: handleAddAllocationRule,
          },
          { default: () => '添加分配规则' }
        ),
        h('div', { style: 'margin-top: 10px; color: #909399; font-size: 12px' }, [
          `当前总比例: ${calculateTotalPercentage()}%`,
          calculateTotalPercentage() !== 100
            ? h('span', { style: 'color: #f56c6c' }, ' (必须为100%)')
            : null,
        ]),
      ])
    },
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'description',
        label: '费用说明',
        type: 'textarea',
        placeholder: '请输入费用说明',
        span: 24,
        rows: 3,
      },
    ],
  },
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入费用名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  calculationType: [{ required: true, message: '请选择计算方式', trigger: 'change' }],
  price: [
    {
      required: false,
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.calculationType === 'fixed' && (!value || value <= 0)) {
          callback(new Error('固定金额必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  distanceUnitPrice: [
    {
      required: false,
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.calculationType === 'distance' && (!value || value <= 0)) {
          callback(new Error('单价必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    const res = await getSpecialFeeList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    handleApiError(error, '获取列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = (params: any) => {
  Object.assign(searchForm, params)
  pagination.page = 1
  loadList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: undefined,
    calculationType: undefined,
  })
  pagination.page = 1
  loadList()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.status = 'inactive'
  formData.calculationType = 'distance'
  formData.price = 0
  formData.unit = '次'
  formData.distanceUnitPrice = 0
  formData.description = ''
  formData.allocationRules = [
    { partyType: 'pickup_store', percentage: 50 },
    { partyType: 'return_store', percentage: 50 },
  ]
}

// 创建
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentFeeId.value = null
  dialogTitle.value = '新增特殊费用'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ExtraFee) => {
  isEdit.value = true
  currentFeeId.value = row.id
  dialogTitle.value = '编辑特殊费用'

  // 填充表单数据
  formData.name = row.name
  formData.status = row.status
  formData.calculationType = row.calculationType || 'distance'
  formData.price = row.price
  formData.unit = row.unit
  formData.distanceUnitPrice = row.distanceUnitPrice || 0
  formData.description = row.description
  formData.allocationRules = row.allocationRules || [
    { partyType: 'pickup_store', percentage: 50 },
    { partyType: 'return_store', percentage: 50 },
  ]

  dialogVisible.value = true
}

// 查看详情
const handleView = (row: ExtraFee) => {
  currentFee.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = async (row: ExtraFee) => {
  try {
    await ElMessageBox.confirm(`确定要删除特殊费用"${row.name}"吗?`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteSpecialFee(row.id)
    ElMessage.success('删除成功')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除特殊费用失败')
    }
  }
}

// 提交表单
const handleSubmit = async (_data: any) => {
  // 验证分配规则总比例
  const totalPercentage = calculateTotalPercentage()
  if (totalPercentage !== 100) {
    ElMessage.error('分配规则总比例必须为100%')
    return
  }

  submitLoading.value = true
  try {
    const submitData = {
      name: formData.name,
      type: 'special',
      status: formData.status,
      calculationType: formData.calculationType,
      price: formData.calculationType === 'fixed' ? formData.price : 0,
      unit: formData.calculationType === 'fixed' ? formData.unit : '公里',
      distanceUnitPrice: formData.calculationType === 'distance' ? formData.distanceUnitPrice : 0,
      description: formData.description,
      ownerType: 'multi_party',
      allocationRules: formData.allocationRules,
    }

    if (isEdit.value && currentFeeId.value) {
      await updateSpecialFee(currentFeeId.value, submitData)
      ElMessage.success('编辑成功')
    } else {
      await createSpecialFee(submitData)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑特殊费用失败' : '创建特殊费用失败')
  } finally {
    submitLoading.value = false
  }
}

// 添加分配规则
const handleAddAllocationRule = () => {
  formData.allocationRules.push({
    partyType: 'platform',
    percentage: 0,
  })
}

// 删除分配规则
const handleRemoveAllocationRule = (index: number) => {
  if (formData.allocationRules.length <= 1) {
    ElMessage.warning('至少保留一条分配规则')
    return
  }
  formData.allocationRules.splice(index, 1)
}

// 计算总比例
const calculateTotalPercentage = () => {
  return formData.allocationRules.reduce((sum, rule) => sum + (rule.percentage || 0), 0)
}

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    active: 'success',
    inactive: 'info',
  }
  return tagMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
  }
  return labelMap[status] || status
}

onMounted(() => {
  loadList()
})
</script>

<style scoped lang="scss">
.special-fees-container {
  padding: 20px;
}
</style>
