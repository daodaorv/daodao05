<!-- @ts-nocheck -->
<template>
  <div class="marketing-tours-container">
    <PageHeader title="房车旅游管理" description="管理房车旅游路线和批次" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="tourList"
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
        <el-tag :type="(getTourStatusTag(row.status)) as any" size="small">
          {{ getTourStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #participants="{ row }">
        <div style="font-size: 12px">
          <div>已报名: {{ row.currentParticipants }}人</div>
          <div>总名额: {{ row.maxParticipants }}人</div>
          <div :style="{ color: row.currentParticipants >= row.maxParticipants ? '#f56c6c' : '#67c23a' }">
            剩余: {{ row.maxParticipants - row.currentParticipants }}人
          </div>
        </div>
      </template>
      <template #route="{ row }">
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <el-tag v-for="(city, index) in row.route.slice(0, 3)" :key="index" size="small" type="info">
            {{ city }}
          </el-tag>
          <el-tag v-if="row.route.length > 3" size="small" type="warning">
            +{{ row.route.length - 3 }}
          </el-tag>
        </div>
      </template>
      <template #price="{ row }">
        <span style="color: #f56c6c; font-weight: bold">
          ¥{{ row.price.toLocaleString() }}
        </span>
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
      width="1000px"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="房车旅游路线详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentTour" :column="2" border>
        <el-descriptions-item label="路线ID">{{ currentTour.id }}</el-descriptions-item>
        <el-descriptions-item label="路线名称">{{ currentTour.name }}</el-descriptions-item>
        <el-descriptions-item label="路线状态">
          <el-tag :type="(getTourStatusTag(currentTour.status)) as any" size="small">
            {{ getTourStatusLabel(currentTour.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="目的地">{{ currentTour.destination }}</el-descriptions-item>
        <el-descriptions-item label="行程天数">{{ currentTour.days }}天</el-descriptions-item>
        <el-descriptions-item label="路线价格">¥{{ currentTour.price.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="适用车型">{{ currentTour.vehicleType }}</el-descriptions-item>
        <el-descriptions-item label="已报名人数">{{ currentTour.currentParticipants }}人</el-descriptions-item>
        <el-descriptions-item label="最大人数">{{ currentTour.maxParticipants }}人</el-descriptions-item>
        <el-descriptions-item label="剩余名额">{{ currentTour.maxParticipants - currentTour.currentParticipants }}人</el-descriptions-item>
        <el-descriptions-item label="出发日期">{{ currentTour.departureDate }}</el-descriptions-item>
        <el-descriptions-item label="返回日期">{{ currentTour.returnDate }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentTour.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="途经城市" :span="2">
          <el-tag v-for="(city, index) in currentTour.route" :key="index" size="small" type="info" style="margin-right: 8px">
            {{ city }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="路线描述" :span="2">
          {{ currentTour.description }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentTour.createdAt }}</el-descriptions-item>
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
  getTourList,
  type Tour,
  type TourListParams
} from '@/api/marketing'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

const TOUR_STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已满员', value: 'full' },
  { label: '已结束', value: 'ended' }
]

const searchForm = reactive<TourListParams>({
  keyword: '',
  status: undefined,
  destination: ''
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '路线名称/目的地',
    width: '200px'
  },
  {
    prop: 'status',
    label: '路线状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: TOUR_STATUS_OPTIONS
  },
  {
    prop: 'destination',
    label: '目的地',
    type: 'input',
    placeholder: '目的地名称',
    width: '150px'
  }
])

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '路线名称', minWidth: 200 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'destination', label: '目的地', width: 120 },
  { prop: 'days', label: '天数', width: 80 },
  { prop: 'price', label: '价格', width: 120, slot: 'price' },
  { prop: 'vehicleType', label: '车型', width: 120 },
  { prop: 'participants', label: '报名情况', width: 140, slot: 'participants' },
  { prop: 'route', label: '途经城市', minWidth: 200, slot: 'route' },
  { prop: 'departureDate', label: '出发日期', width: 120 },
  { prop: 'returnDate', label: '返回日期', width: 120 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增路线',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Tour) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Tour) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Tour) => handleDelete(row)
  }
]

const tourList = ref<Tour[]>([])
const loading = ref(false)

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
const currentTourId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentTour = ref<Tour | null>(null)

// 车型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: 'A型房车', value: 'A型房车' },
  { label: 'B型房车', value: 'B型房车' },
  { label: 'C型房车', value: 'C型房车' },
  { label: '拖挂房车', value: '拖挂房车' }
]

// 表单数据
const formData = reactive({
  name: '',
  status: 'draft',
  destination: '',
  days: 0,
  price: 0,
  vehicleType: '',
  maxParticipants: 0,
  departureDate: '',
  returnDate: '',
  route: [] as string[],
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
        label: '路线名称',
        type: 'input',
        placeholder: '请输入路线名称',
        span: 12
      },
      {
        prop: 'status',
        label: '路线状态',
        type: 'select',
        options: TOUR_STATUS_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'destination',
        label: '目的地',
        type: 'input',
        placeholder: '请输入目的地',
        span: 12
      },
      {
        prop: 'days',
        label: '行程天数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：天'
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'price',
        label: '路线价格',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：元'
      },
      {
        prop: 'vehicleType',
        label: '适用车型',
        type: 'select',
        options: VEHICLE_TYPE_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'divider',
    label: '报名设置'
  },
  {
    prop: 'maxParticipants',
    label: '最大人数',
    type: 'number',
    min: 1,
    tip: '单位：人'
  },
  {
    type: 'divider',
    label: '行程时间'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'departureDate',
        label: '出发日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      },
      {
        prop: 'returnDate',
        label: '返回日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      }
    ]
  },
  {
    type: 'divider',
    label: '路线详情'
  },
  {
    prop: 'route',
    label: '途经城市',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入途经城市，多个城市用逗号分隔',
    tip: '例如：北京,天津,石家庄,太原'
  },
  {
    prop: 'description',
    label: '路线描述',
    type: 'textarea',
    rows: 5,
    placeholder: '请输入路线描述',
    maxlength: 1000
  }
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入路线名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择路线状态', trigger: 'change' }],
  destination: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
  days: [{ required: true, message: '请输入行程天数', trigger: 'blur' }],
  price: [{ required: true, message: '请输入路线价格', trigger: 'blur' }],
  vehicleType: [{ required: true, message: '请选择适用车型', trigger: 'change' }],
  maxParticipants: [{ required: true, message: '请输入最大人数', trigger: 'blur' }],
  departureDate: [{ required: true, message: '请选择出发日期', trigger: 'change' }],
  returnDate: [{ required: true, message: '请选择返回日期', trigger: 'change' }]
}

const loadTourList = async () => {
  loading.value = true
  try {
    const params: TourListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getTourList(params) as any
    tourList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载房车旅游列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadTourList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  searchForm.destination = ''
  pagination.page = 1
  loadTourList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.status = 'draft'
  formData.destination = ''
  formData.days = 0
  formData.price = 0
  formData.vehicleType = ''
  formData.maxParticipants = 0
  formData.departureDate = ''
  formData.returnDate = ''
  formData.route = []
  formData.description = ''
}

// 创建路线
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentTourId.value = null
  dialogTitle.value = '新增房车旅游路线'
  dialogVisible.value = true
}

// 编辑路线
const handleEdit = (row: Tour) => {
  resetForm()
  isEdit.value = true
  currentTourId.value = row.id
  dialogTitle.value = '编辑房车旅游路线'

  // 填充表单数据
  formData.name = row.name
  formData.status = row.status
  formData.destination = row.destination
  formData.days = row.days
  formData.price = row.price
  formData.vehicleType = row.vehicleType
  formData.maxParticipants = row.maxParticipants
  formData.departureDate = row.departureDate
  formData.returnDate = row.returnDate
  formData.route = [...row.route]
  formData.description = row.description

  dialogVisible.value = true
}

// 查看路线详情
const handleView = (row: Tour) => {
  currentTour.value = row
  detailDialogVisible.value = true
}

// 删除路线
const handleDelete = async (row: Tour) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除房车旅游路线"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadTourList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除房车旅游路线失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    // 处理途经城市字段(将逗号分隔的字符串转为数组)
    if (typeof data.route === 'string') {
      data.route = data.route.split(',').map((item: string) => item.trim()).filter((item: string) => item)
    }

    if (isEdit.value) {
      // TODO: 调用编辑API
      ElMessage.success('编辑成功')
    } else {
      // TODO: 调用创建API
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadTourList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑房车旅游路线失败' : '创建房车旅游路线失败')
  } finally {
    submitLoading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadTourList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadTourList()
}

const getTourStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    draft: 'info',
    published: 'success',
    full: 'warning',
    ended: 'danger'
  }
  return tagMap[status] || 'info'
}

const getTourStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    full: '已满员',
    ended: '已结束'
  }
  return labelMap[status] || status
}

onMounted(() => {
  loadTourList()
})
</script>

<style scoped lang="scss">
.marketing-tours-container {
  padding: 20px;
}
</style>
