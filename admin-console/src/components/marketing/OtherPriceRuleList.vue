<!-- @ts-nocheck -->
<template>
  <div class="other-price-rule-list">
    <el-alert
      type="info"
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #title>
        <div style="font-size: 13px">
          其他价格规则包括长租优惠、会员折扣等，所有命中的规则都会生效并累加
        </div>
      </template>
    </el-alert>

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="ruleList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #ruleType="{ row }">
        <el-tag :type="getRuleTypeTag(row.ruleType)" size="small">
          {{ getRuleTypeLabel(row.ruleType) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status === 'active' ? '生效中' : '未生效' }}
        </el-tag>
      </template>
      <template #adjustmentType="{ row }">
        <el-tag :type="row.adjustmentType === 'percentage' ? 'success' : 'primary'" size="small">
          {{ row.adjustmentType === 'percentage' ? '百分比' : '固定金额' }}
        </el-tag>
      </template>
      <template #adjustmentValue="{ row }">
        <span :style="{ color: row.adjustmentValue > 0 ? '#f56c6c' : '#67c23a', fontWeight: 'bold' }">
          {{ row.adjustmentValue > 0 ? '+' : '' }}{{ row.adjustmentValue }}{{ row.adjustmentType === 'percentage' ? '%' : '元' }}
        </span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'
import { tagApi, type Tag } from '@/api/user'

// 规则类型选项
const RULE_TYPE_OPTIONS = [
  { label: '长租优惠', value: 'long_term_discount' },
  { label: '会员折扣', value: 'member_discount' },
  { label: '早鸟优惠', value: 'early_bird' },
  { label: '团购优惠', value: 'group_discount' },
  { label: '新用户优惠', value: 'new_user_discount' },
  { label: '老用户回馈', value: 'loyalty_reward' }
]

// 标签列表
const tagList = ref<Tag[]>([])
const tagOptions = computed(() =>
  tagList.value.map(tag => ({
    label: tag.name,
    value: tag.id
  }))
)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  ruleType: undefined,
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '规则名称',
    width: '200px'
  },
  {
    prop: 'ruleType',
    label: '规则类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: RULE_TYPE_OPTIONS
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: [
      { label: '生效中', value: 'active' },
      { label: '未生效', value: 'inactive' }
    ]
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '规则名称', minWidth: 150 },
  { prop: 'ruleType', label: '规则类型', width: 120, slot: 'ruleType' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'adjustmentType', label: '调整类型', width: 120, slot: 'adjustmentType' },
  { prop: 'adjustmentValue', label: '调整值', width: 120, slot: 'adjustmentValue' },
  { prop: 'targetUserTags', label: '目标用户', minWidth: 150, slot: 'targetUserTags' },
  { prop: 'minDays', label: '最少天数', width: 100 },
  { prop: 'description', label: '说明', minWidth: 200 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增规则',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: any) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    onClick: (row: any) => handleDelete(row)
  }
]

// Mock 数据
const ruleList = ref([
  {
    id: 1,
    name: '长租7天优惠',
    ruleType: 'long_term_discount',
    status: 'active',
    adjustmentType: 'percentage',
    adjustmentValue: -10,
    targetUserTags: [],
    minDays: 7,
    description: '租期满7天享受9折优惠'
  },
  {
    id: 2,
    name: '长租15天优惠',
    ruleType: 'long_term_discount',
    status: 'active',
    adjustmentType: 'percentage',
    adjustmentValue: -15,
    targetUserTags: [],
    minDays: 15,
    description: '租期满15天享受85折优惠'
  },
  {
    id: 3,
    name: '长租30天优惠',
    ruleType: 'long_term_discount',
    status: 'active',
    adjustmentType: 'percentage',
    adjustmentValue: -20,
    targetUserTags: [],
    minDays: 30,
    description: '租期满30天享受8折优惠'
  },
  {
    id: 4,
    name: 'VIP会员折扣',
    ruleType: 'member_discount',
    status: 'active',
    adjustmentType: 'percentage',
    adjustmentValue: -15,
    targetUserTags: [1],
    minDays: 1,
    description: 'VIP会员享受85折优惠'
  },
  {
    id: 5,
    name: '提前30天预订优惠',
    ruleType: 'early_bird',
    status: 'active',
    adjustmentType: 'percentage',
    adjustmentValue: -12,
    targetUserTags: [],
    minDays: 1,
    description: '提前30天预订享受88折优惠'
  },
  {
    id: 6,
    name: '新用户首单优惠',
    ruleType: 'new_user_discount',
    status: 'active',
    adjustmentType: 'fixed',
    adjustmentValue: -200,
    targetUserTags: [3],
    minDays: 1,
    description: '新用户首单立减200元'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: ruleList.value.length
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  ruleType: 'long_term_discount',
  status: 'inactive',
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  targetUserTags: [] as number[],
  minDays: 1,
  description: ''
})

// 表单字段配置
const formFields = computed<FormField[]>(() => [
  {
    type: 'divider',
    label: '基本信息'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'name',
        label: '规则名称',
        type: 'input',
        placeholder: '请输入规则名称',
        span: 12
      },
      {
        prop: 'ruleType',
        label: '规则类型',
        type: 'select',
        options: RULE_TYPE_OPTIONS,
        span: 12
      }
    ]
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '生效中', value: 'active' },
          { label: '未生效', value: 'inactive' }
        ],
        span: 12
      },
      {
        prop: 'minDays',
        label: '最少天数',
        type: 'number',
        min: 1,
        span: 12,
        tip: '规则生效的最少租期天数'
      }
    ]
  },
  {
    type: 'divider',
    label: '价格调整'
  },
  {
    type: 'row',
    columns: [
      {
        prop: 'adjustmentType',
        label: '调整类型',
        type: 'select',
        options: [
          { label: '百分比', value: 'percentage' },
          { label: '固定金额', value: 'fixed' }
        ],
        span: 12
      },
      {
        prop: 'adjustmentValue',
        label: '调整值',
        type: 'number',
        span: 12,
        tip: '正数表示涨价，负数表示降价'
      }
    ]
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
    tip: '选择可使用此规则的用户标签，不选则全部用户可用'
  },
  {
    prop: 'description',
    label: '规则说明',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入规则说明',
    maxlength: 200
  }
])

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  minDays: [{ required: true, message: '请输入最少天数', trigger: 'blur' }]
}

// 获取规则类型标签类型
const getRuleTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    long_term_discount: 'success',
    member_discount: 'warning',
    early_bird: 'primary',
    group_discount: 'danger',
    new_user_discount: 'info',
    loyalty_reward: 'success'
  }
  return tagMap[type] || 'info'
}

// 获取规则类型标签文本
const getRuleTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    long_term_discount: '长租优惠',
    member_discount: '会员折扣',
    early_bird: '早鸟优惠',
    group_discount: '团购优惠',
    new_user_discount: '新用户优惠',
    loyalty_reward: '老用户回馈'
  }
  return labelMap[type] || type
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

    if (res && res.data) {
      tagList.value = res.data.list || res.data || []
    } else if (res && res.list) {
      tagList.value = res.list
    } else {
      tagList.value = []
    }
  } catch (error) {
    console.error('加载标签列表失败:', error)
    tagList.value = []
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // TODO: 调用搜索API
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.ruleType = undefined
  searchForm.status = undefined
  pagination.page = 1
  // TODO: 重新加载数据
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.ruleType = 'long_term_discount'
  formData.status = 'inactive'
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.targetUserTags = []
  formData.minDays = 1
  formData.description = ''
}

// 创建
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增其他价格规则'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑其他价格规则'

  formData.name = row.name
  formData.ruleType = row.ruleType
  formData.status = row.status
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.targetUserTags = row.targetUserTags ? [...row.targetUserTags] : []
  formData.minDays = row.minDays
  formData.description = row.description

  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除其他价格规则"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('删除成功')
    // TODO: 调用删除API
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data: any) => {
  submitLoading.value = true
  try {
    if (isEdit.value) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    // TODO: 重新加载数据
  } catch (error) {
    ElMessage.error(isEdit.value ? '编辑失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // TODO: 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  // TODO: 重新加载数据
}

// 页面加载
onMounted(() => {
  loadTagList()
})
</script>

<style scoped lang="scss">
.other-price-rule-list {
  // 组件样式
}
</style>
