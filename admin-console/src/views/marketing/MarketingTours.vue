<template>
  <div class="marketing-tours-container">
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
        <el-tag :type="getTourStatusTag(row.status) as any" size="small">
          {{ getTourStatusLabel(row.status) }}
        </el-tag>
        <el-tag v-if="row.isHot" type="danger" size="small" style="margin-left: 4px">热门</el-tag>
      </template>
      <template #price="{ row }">
        <div style="font-size: 12px">
          <div style="color: #f56c6c; font-weight: bold">成人: ¥{{ row.pricePerPerson }}</div>
          <div style="color: #909399">儿童: ¥{{ row.childPrice }}</div>
        </div>
      </template>
      <template #batches="{ row }">
        <div style="font-size: 12px">
          <div>批次数: {{ row.batches.length }}</div>
          <div style="color: #67c23a">
            招募中: {{ row.batches.filter(b => b.status === 'recruiting').length }}
          </div>
        </div>
      </template>
      <template #tags="{ row }">
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <el-tag
            v-for="(tag, index) in row.tags.slice(0, 2)"
            :key="index"
            size="small"
            type="info"
          >
            {{ tag }}
          </el-tag>
          <el-tag v-if="row.tags.length > 2" size="small" type="warning">
            +{{ row.tags.length - 2 }}
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
        <el-descriptions-item label="线路标题">{{ currentTour.title }}</el-descriptions-item>
        <el-descriptions-item label="路线状态">
          <el-tag :type="getTourStatusTag(currentTour.status) as any" size="small">
            {{ getTourStatusLabel(currentTour.status) }}
          </el-tag>
          <el-tag v-if="currentTour.isHot" type="danger" size="small" style="margin-left: 8px"
            >热门</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item label="目的地">{{ currentTour.destination }}</el-descriptions-item>
        <el-descriptions-item label="行程天数"
          >{{ currentTour.duration }}天{{ currentTour.duration - 1 }}晚</el-descriptions-item
        >
        <el-descriptions-item label="取车门店">{{
          currentTour.pickupStoreName || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="还车门店">{{
          currentTour.returnStoreName || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="成人价格"
          >¥{{ currentTour.pricePerPerson }}/人</el-descriptions-item
        >
        <el-descriptions-item label="儿童价格"
          >¥{{ currentTour.childPrice }}/人</el-descriptions-item
        >
        <el-descriptions-item label="成团人数"
          >{{ currentTour.minPeople }}-{{ currentTour.maxPeople }}人</el-descriptions-item
        >
        <el-descriptions-item label="线路标签" :span="2">
          <el-tag
            v-for="(tag, index) in currentTour.tags"
            :key="index"
            size="small"
            type="success"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="出发批次" :span="2">
          <div
            v-for="batch in currentTour.batches"
            :key="batch.id"
            style="margin-bottom: 8px; padding: 8px; background: #f5f7fa; border-radius: 4px"
          >
            <span style="font-weight: 500">{{ batch.departureDate }}</span>
            <el-tag :type="getBatchStatusTag(batch.status)" size="small" style="margin-left: 8px">
              {{ getBatchStatusLabel(batch.status) }}
            </el-tag>
            <span style="margin-left: 8px; color: #909399"
              >{{ batch.currentPeople }}/{{ batch.maxPeople }}人</span
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="行程安排" :span="2">
          <div
            v-for="(day, index) in currentTour.itinerary"
            :key="index"
            style="margin-bottom: 12px"
          >
            <div style="font-weight: 500; margin-bottom: 4px">
              Day {{ index + 1 }}: {{ day.title }}
            </div>
            <div style="color: #606266; margin-bottom: 4px">{{ day.content }}</div>
            <div v-if="day.highlights && day.highlights.length > 0">
              <el-tag
                v-for="(highlight, hIndex) in day.highlights"
                :key="hIndex"
                size="small"
                type="warning"
                style="margin-right: 4px"
              >
                {{ highlight }}
              </el-tag>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="费用包含" :span="2">
          <div
            v-for="(item, index) in currentTour.priceIncludes"
            :key="index"
            style="margin-bottom: 4px"
          >
            <el-icon style="color: #67c23a"><Check /></el-icon>
            <span style="margin-left: 4px">{{ item }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="费用不含" :span="2">
          <div
            v-for="(item, index) in currentTour.priceExcludes"
            :key="index"
            style="margin-bottom: 4px"
          >
            <el-icon style="color: #f56c6c"><Close /></el-icon>
            <span style="margin-left: 4px">{{ item }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentTour.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentTour.createdAt }}</el-descriptions-item>
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
import { Plus, Check, Close } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getTourList,
  createTour,
  updateTour,
  deleteTour,
  type Tour,
  type TourListParams,
} from '@/api/marketing'
import { useErrorHandler } from '@/composables'
import { STORE_OPTIONS } from '@/constants/options'

const { handleApiError } = useErrorHandler()

const TOUR_STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已结束', value: 'ended' },
]

const searchForm = reactive<TourListParams>({
  keyword: '',
  status: undefined,
  destination: '',
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '路线名称/目的地',
    width: '200px',
  },
  {
    prop: 'status',
    label: '路线状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: TOUR_STATUS_OPTIONS,
  },
  {
    prop: 'destination',
    label: '目的地',
    type: 'input',
    placeholder: '目的地名称',
    width: '150px',
  },
])

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'title', label: '线路标题', minWidth: 200 },
  { prop: 'status', label: '状态', width: 120, slot: 'status' },
  { prop: 'destination', label: '目的地', width: 120 },
  { prop: 'duration', label: '天数', width: 80 },
  { prop: 'price', label: '价格', width: 140, slot: 'price' },
  { prop: 'batches', label: '批次信息', width: 120, slot: 'batches' },
  { prop: 'tags', label: '标签', width: 150, slot: 'tags' },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增路线',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: Tour) => handleView(row),
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: Tour) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: Tour) => handleDelete(row),
  },
]

const tourList = ref<Tour[]>([])
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
const currentTourId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentTour = ref<Tour | null>(null)

// 车型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: 'A型房车', value: 'A型房车' },
  { label: 'B型房车', value: 'B型房车' },
  { label: 'C型房车', value: 'C型房车' },
  { label: '拖挂房车', value: '拖挂房车' },
]

// 表单数据
const formData = reactive({
  title: '',
  status: 'draft',
  destination: '',
  duration: 0,
  pickupStoreId: undefined,
  returnStoreId: undefined,
  pricePerPerson: 0,
  childPrice: 0,
  vehicleType: '',
  minPeople: 5,
  maxPeople: 12,
  tags: '',
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
        prop: 'title',
        label: '线路标题',
        type: 'input',
        placeholder: '请输入线路标题',
        span: 12,
      },
      {
        prop: 'status',
        label: '路线状态',
        type: 'select',
        options: TOUR_STATUS_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'destination',
        label: '目的地',
        type: 'input',
        placeholder: '请输入目的地',
        span: 12,
      },
      {
        prop: 'duration',
        label: '行程天数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：天',
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'pickupStoreId',
        label: '取车门店',
        type: 'select',
        placeholder: '请选择取车门店',
        options: STORE_OPTIONS,
        span: 12,
      },
      {
        prop: 'returnStoreId',
        label: '还车门店',
        type: 'select',
        placeholder: '请选择还车门店',
        options: STORE_OPTIONS,
        span: 12,
      },
    ],
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'pricePerPerson',
        label: '成人价格',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：元/人',
      },
      {
        prop: 'childPrice',
        label: '儿童价格',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：元/人',
      },
    ],
  },
  {
    prop: 'vehicleType',
    label: '适用车型',
    type: 'select',
    options: VEHICLE_TYPE_OPTIONS,
  },
  {
    type: 'divider',
    label: '成团设置',
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'minPeople',
        label: '最少成团人数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：人',
      },
      {
        prop: 'maxPeople',
        label: '最多容纳人数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '单位：人',
      },
    ],
  },
  {
    type: 'divider',
    label: '路线详情',
  },
  {
    prop: 'tags',
    label: '线路标签',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入线路标签，多个标签用逗号分隔',
    tip: '例如：高原风光,摄影天堂,藏族文化',
  },
  {
    prop: 'description',
    label: '路线描述',
    type: 'richtext',
    placeholder: '请输入路线描述，支持图片、视频、链接等富文本内容',
    height: '500px',
  },
]) as any

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入线路标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择路线状态', trigger: 'change' }],
  destination: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入行程天数', trigger: 'blur' }],
  pricePerPerson: [{ required: true, message: '请输入成人价格', trigger: 'blur' }],
  childPrice: [{ required: true, message: '请输入儿童价格', trigger: 'blur' }],
  vehicleType: [{ required: true, message: '请选择适用车型', trigger: 'change' }],
  minPeople: [{ required: true, message: '请输入最少成团人数', trigger: 'blur' }],
  maxPeople: [{ required: true, message: '请输入最多容纳人数', trigger: 'blur' }],
}

const loadTourList = async () => {
  loading.value = true
  try {
    const params: TourListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = (await getTourList(params)) as any
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
  formData.title = ''
  formData.status = 'draft'
  formData.destination = ''
  formData.duration = 0
  formData.pickupStoreId = undefined
  formData.returnStoreId = undefined
  formData.pricePerPerson = 0
  formData.childPrice = 0
  formData.vehicleType = ''
  formData.minPeople = 5
  formData.maxPeople = 12
  formData.tags = ''
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
  formData.title = row.title
  formData.status = row.status
  formData.destination = row.destination
  formData.duration = row.duration
  formData.pickupStoreId = row.pickupStoreId
  formData.returnStoreId = row.returnStoreId
  formData.pricePerPerson = row.pricePerPerson
  formData.childPrice = row.childPrice
  formData.vehicleType = row.vehicleType
  formData.minPeople = row.minPeople
  formData.maxPeople = row.maxPeople
  formData.tags = row.tags.join(',')
  formData.description = row.itinerary.map(day => day.title).join('\n')

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
    await ElMessageBox.confirm(`确定要删除房车旅游路线"${row.title}"吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteTour(row.id)
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
    // 获取门店名称
    const pickupStore = STORE_OPTIONS.find(s => s.value === data.pickupStoreId)
    const returnStore = STORE_OPTIONS.find(s => s.value === data.returnStoreId)

    // 构建提交数据
    const submitData: Partial<Tour> = {
      title: data.title,
      status: data.status,
      destination: data.destination,
      duration: data.duration,
      pickupStoreId: data.pickupStoreId,
      pickupStoreName: pickupStore?.label,
      returnStoreId: data.returnStoreId,
      returnStoreName: returnStore?.label,
      pricePerPerson: data.pricePerPerson,
      childPrice: data.childPrice,
      vehicleType: data.vehicleType,
      minPeople: data.minPeople,
      maxPeople: data.maxPeople,
      tags: data.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag),
      images: [],
      batches: [],
      itinerary: [],
      priceIncludes: [],
      priceExcludes: [],
      announcement: data.description || '',
      bookingNotices: [],
      cancellationPolicy: [],
      isHot: false,
    }

    if (isEdit.value && currentTourId.value) {
      await updateTour(currentTourId.value, submitData)
      ElMessage.success('编辑成功')
    } else {
      await createTour(submitData)
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
    ended: 'danger',
  }
  return tagMap[status] || 'info'
}

const getTourStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    ended: '已结束',
  }
  return labelMap[status] || status
}

const getBatchStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    recruiting: 'success',
    confirmed: 'primary',
    departed: 'warning',
    finished: 'info',
  }
  return tagMap[status] || 'info'
}

const getBatchStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    recruiting: '招募中',
    confirmed: '已成团',
    departed: '已出发',
    finished: '已结束',
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
