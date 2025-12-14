<!-- @ts-nocheck -->
<template>
  <div class="marketing-activities-container">
    <PageHeader title="营销活动管理" description="管理营销活动策划和执行" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="activityList"
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
        <el-tag :type="(getActivityTypeTag(row.type)) as any" size="small">
          {{ getActivityTypeLabel(row.type) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="(getActivityStatusTag(row.status)) as any" size="small">
          {{ getActivityStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #budget="{ row }">
        <div style="font-size: 12px">
          <div>预算: ¥{{ row.budget.toLocaleString() }}</div>
          <div style="color: #f56c6c">实际: ¥{{ row.actualCost.toLocaleString() }}</div>
        </div>
      </template>
      <template #performance="{ row }">
        <div style="font-size: 12px">
          <div>参与: {{ row.participantCount }}人</div>
          <div>订单: {{ row.orderCount }}单</div>
          <div style="color: #67c23a">营收: ¥{{ row.revenue.toLocaleString() }}</div>
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
      <template #roi="{ row }">
        <span :style="{ color: row.roi > 10 ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
          {{ row.roi.toFixed(1) }}
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
      title="营销活动详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentActivity" :column="2" border>
        <el-descriptions-item label="活动ID">{{ currentActivity.id }}</el-descriptions-item>
        <el-descriptions-item label="活动名称">{{ currentActivity.name }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">
          <el-tag :type="(getActivityTypeTag(currentActivity.type)) as any" size="small">
            {{ getActivityTypeLabel(currentActivity.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="(getActivityStatusTag(currentActivity.status)) as any" size="small">
            {{ getActivityStatusLabel(currentActivity.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentActivity.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentActivity.endDate }}</el-descriptions-item>
        <el-descriptions-item label="活动预算">¥{{ currentActivity.budget.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="实际成本">¥{{ currentActivity.actualCost.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="目标用户标签" :span="2">
          <el-tag v-for="tagId in currentActivity.targetUserTags" :key="tagId" size="small" style="margin-right: 8px">
            {{ getTagName(tagId) }}
          </el-tag>
          <span v-if="!currentActivity.targetUserTags || currentActivity.targetUserTags.length === 0" style="color: #909399">
            全部用户
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ currentActivity.participantCount }}人</el-descriptions-item>
        <el-descriptions-item label="订单数量">{{ currentActivity.orderCount }}单</el-descriptions-item>
        <el-descriptions-item label="活动营收">¥{{ currentActivity.revenue.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="投资回报率(ROI)">
          <span :style="{ color: currentActivity.roi > 10 ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
            {{ currentActivity.roi.toFixed(1) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentActivity.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="活动描述" :span="2">
          <div v-html="currentActivity.description"></div>
        </el-descriptions-item>
        <el-descriptions-item label="活动规则" :span="2">
          <div v-html="currentActivity.rules"></div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentActivity.createdAt }}</el-descriptions-item>
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
  getActivityList,
  type MarketingActivity,
  type ActivityListParams
} from '@/api/marketing'
import { tagApi, type Tag } from '@/api/user'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

// 标签列表
const tagList = ref<Tag[]>([])
const tagOptions = computed(() =>
  tagList.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
)

const ACTIVITY_TYPE_OPTIONS = [
  { label: '促销活动', value: 'promotion' },
  { label: '主题活动', value: 'event' },
  { label: '营销战役', value: 'campaign' }
]

const ACTIVITY_STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '进行中', value: 'active' },
  { label: '已暂停', value: 'paused' },
  { label: '已结束', value: 'ended' }
]

const searchForm = reactive<ActivityListParams>({
  keyword: '',
  type: undefined,
  status: undefined,
  tagId: undefined
})

const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '活动名称',
    width: '200px'
  },
  {
    prop: 'type',
    label: '活动类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: ACTIVITY_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '活动状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: ACTIVITY_STATUS_OPTIONS
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

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '活动名称', minWidth: 200 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'targetUserTags', label: '目标用户标签', width: 150, slot: 'targetUserTags' },
  { prop: 'budget', label: '预算/实际', width: 140, slot: 'budget' },
  { prop: 'performance', label: '活动效果', width: 140, slot: 'performance' },
  { prop: 'roi', label: 'ROI', width: 80, slot: 'roi' },
  { prop: 'startDate', label: '开始时间', width: 120 },
  { prop: 'endDate', label: '结束时间', width: 120 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增活动',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

const tableActions: TableAction[] = [
  {
    label: '查看',
    type: 'primary',
    onClick: (row: MarketingActivity) => handleView(row)
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: MarketingActivity) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: MarketingActivity) => handleDelete(row)
  }
]

const activityList = ref<MarketingActivity[]>([])
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
const currentActivityId = ref<number | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentActivity = ref<MarketingActivity | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  type: 'promotion',
  status: 'draft',
  startDate: '',
  endDate: '',
  budget: 0,
  targetUserTags: [] as number[],
  description: '',
  rules: ''
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
        label: '活动名称',
        type: 'input',
        placeholder: '请输入活动名称',
        span: 12
      },
      {
        prop: 'type',
        label: '活动类型',
        type: 'select',
        options: ACTIVITY_TYPE_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'status',
        label: '活动状态',
        type: 'select',
        options: ACTIVITY_STATUS_OPTIONS,
        span: 12
      },
      {
        prop: 'budget',
        label: '活动预算',
        type: 'number',
        min: 0,
        span: 12,
        tip: '单位：元'
      }
    ]
  },
  {
    type: 'divider',
    label: '活动时间'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'startDate',
        label: '开始时间',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      },
      {
        prop: 'endDate',
        label: '结束时间',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        span: 12
      }
    ]
  },
  {
    type: 'divider',
    label: '目标用户'
  },
  {
    prop: 'targetUserTags',
    label: '目标用户标签',
    type: 'select',
    multiple: true,
    options: tagOptions.value,
    placeholder: '请选择目标用户标签（不选则全部用户可参与）',
    tip: '选择可参与此活动的用户标签，不选则全部用户可参与'
  },
  {
    type: 'divider',
    label: '活动详情'
  },
  {
    prop: 'description',
    label: '活动描述',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入活动描述',
    maxlength: 1000
  },
  {
    prop: 'rules',
    label: '活动规则',
    type: 'textarea',
    rows: 6,
    placeholder: '请输入活动规则',
    maxlength: 2000
  }
]) as any

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择活动状态', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  budget: [{ required: true, message: '请输入活动预算', trigger: 'blur' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  rules: [{ required: true, message: '请输入活动规则', trigger: 'blur' }]
}

const loadActivityList = async () => {
  loading.value = true
  try {
    const params: ActivityListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }

    const res = await getActivityList(params) as any
    activityList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载营销活动列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadActivityList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.tagId = undefined
  pagination.page = 1
  loadActivityList()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = 'promotion'
  formData.status = 'draft'
  formData.startDate = ''
  formData.endDate = ''
  formData.budget = 0
  formData.targetUserTags = []
  formData.description = ''
  formData.rules = ''
}

// 创建活动
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentActivityId.value = null
  dialogTitle.value = '新增营销活动'
  dialogVisible.value = true
}

const handleEdit = (row: MarketingActivity) => {
  resetForm()
  isEdit.value = true
  currentActivityId.value = row.id
  dialogTitle.value = '编辑营销活动'

  // 填充表单数据
  formData.name = row.name
  formData.type = row.type
  formData.status = row.status
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.budget = row.budget
  formData.targetUserTags = row.targetUserTags ? [...row.targetUserTags] : []
  formData.description = row.description
  formData.rules = row.rules

  dialogVisible.value = true
}

const handleView = (row: MarketingActivity) => {
  currentActivity.value = row
  detailDialogVisible.value = true
}

// 删除活动
const handleDelete = async (row: MarketingActivity) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除营销活动"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadActivityList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除营销活动失败')
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
    loadActivityList()
  } catch (error) {
    handleApiError(error, isEdit.value ? '编辑营销活动失败' : '创建营销活动失败')
  } finally {
    submitLoading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadActivityList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadActivityList()
}

const getActivityTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    promotion: 'success',
    event: 'primary',
    campaign: 'warning'
  }
  return tagMap[type] || 'info'
}

const getActivityTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    promotion: '促销活动',
    event: '主题活动',
    campaign: '营销战役'
  }
  return labelMap[type] || type
}

const getActivityStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    draft: 'info',
    active: 'success',
    paused: 'warning',
    ended: 'danger'
  }
  return tagMap[status] || 'info'
}

const getActivityStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    active: '进行中',
    paused: '已暂停',
    ended: '已结束'
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

onMounted(() => {
  loadTagList()
  loadActivityList()
})
</script>

<style scoped lang="scss">
.marketing-activities-container {
  padding: 20px;
}
</style>
