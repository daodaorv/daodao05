<!-- @ts-nocheck -->
<template>
  <div class="city-factor-list">
    <el-alert
      type="info"
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #title>
        <div style="font-size: 13px">
          城市因子根据门店所在城市调整价格，同一城市只生效优先级最高的因子
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
      :data="factorList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #cityTier="{ row }">
        <el-tag :type="getCityTierTag(row.cityTier)" size="small">
          {{ getCityTierLabel(row.cityTier) }}
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
      <template #cities="{ row }">
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <el-tag v-for="(city, index) in row.cities.slice(0, 3)" :key="index" size="small" type="info">
            {{ city }}
          </el-tag>
          <el-tag v-if="row.cities.length > 3" size="small" type="info">
            +{{ row.cities.length - 3 }}
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
      width="800px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import type { FormField } from '@/components/common/FormDialog.vue'

// 城市分级选项
const CITY_TIER_OPTIONS = [
  { label: '一线城市', value: 'tier1' },
  { label: '新一线城市', value: 'new_tier1' },
  { label: '二线城市', value: 'tier2' },
  { label: '三线城市', value: 'tier3' },
  { label: '四线城市', value: 'tier4' }
]

// 城市选项（示例）
const CITY_OPTIONS = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '成都', value: '成都' },
  { label: '杭州', value: '杭州' },
  { label: '重庆', value: '重庆' },
  { label: '西安', value: '西安' },
  { label: '武汉', value: '武汉' },
  { label: '南京', value: '南京' }
]

// 搜索表单
const searchForm = reactive({
  keyword: '',
  cityTier: undefined,
  status: undefined
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '因子名称或城市',
    width: '200px'
  },
  {
    prop: 'cityTier',
    label: '城市分级',
    type: 'select',
    placeholder: '请选择分级',
    width: '150px',
    options: CITY_TIER_OPTIONS
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
  { prop: 'name', label: '因子名称', minWidth: 150 },
  { prop: 'cityTier', label: '城市分级', width: 120, slot: 'cityTier' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'cities', label: '适用城市', minWidth: 200, slot: 'cities' },
  { prop: 'adjustmentType', label: '调整类型', width: 120, slot: 'adjustmentType' },
  { prop: 'adjustmentValue', label: '调整值', width: 120, slot: 'adjustmentValue' },
  { prop: 'priority', label: '优先级', width: 100 },
  { prop: 'description', label: '说明', minWidth: 200 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增城市因子',
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
const factorList = ref([
  {
    id: 1,
    name: '一线城市高价因子',
    cityTier: 'tier1',
    status: 'active',
    cities: ['北京', '上海', '广州', '深圳'],
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    priority: 80,
    description: '一线城市基础价格上涨30%'
  },
  {
    id: 2,
    name: '新一线城市因子',
    cityTier: 'new_tier1',
    status: 'active',
    cities: ['成都', '杭州', '重庆', '西安', '武汉', '南京'],
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    priority: 70,
    description: '新一线城市基础价格上涨20%'
  },
  {
    id: 3,
    name: '二线城市因子',
    cityTier: 'tier2',
    status: 'active',
    cities: ['昆明', '大连', '厦门', '合肥', '佛山'],
    adjustmentType: 'percentage',
    adjustmentValue: 10,
    priority: 60,
    description: '二线城市基础价格上涨10%'
  },
  {
    id: 4,
    name: '三四线城市优惠',
    cityTier: 'tier3',
    status: 'active',
    cities: ['丽江', '大理', '桂林', '张家界'],
    adjustmentType: 'percentage',
    adjustmentValue: -10,
    priority: 50,
    description: '三四线城市基础价格下降10%'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: factorList.value.length
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
  cityTier: 'tier1',
  status: 'inactive',
  cities: [] as string[],
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  priority: 50,
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
        label: '因子名称',
        type: 'input',
        placeholder: '请输入因子名称',
        span: 12
      },
      {
        prop: 'cityTier',
        label: '城市分级',
        type: 'select',
        options: CITY_TIER_OPTIONS,
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
        prop: 'priority',
        label: '优先级',
        type: 'number',
        min: 1,
        max: 100,
        span: 12,
        tip: '数字越大优先级越高，同一城市只生效优先级最高的因子'
      }
    ]
  },
  {
    prop: 'cities',
    label: '适用城市',
    type: 'select',
    multiple: true,
    options: CITY_OPTIONS,
    placeholder: '请选择适用城市',
    tip: '选择该因子适用的城市列表'
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
    prop: 'description',
    label: '因子说明',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入因子说明',
    maxlength: 200
  }
])

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入因子名称', trigger: 'blur' }],
  cityTier: [{ required: true, message: '请选择城市分级', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  cities: [{ required: true, message: '请选择适用城市', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }]
}

// 获取城市分级标签类型
const getCityTierTag = (tier: string) => {
  const tagMap: Record<string, string> = {
    tier1: 'danger',
    new_tier1: 'warning',
    tier2: 'primary',
    tier3: 'success',
    tier4: 'info'
  }
  return tagMap[tier] || 'info'
}

// 获取城市分级标签文本
const getCityTierLabel = (tier: string) => {
  const labelMap: Record<string, string> = {
    tier1: '一线城市',
    new_tier1: '新一线城市',
    tier2: '二线城市',
    tier3: '三线城市',
    tier4: '四线城市'
  }
  return labelMap[tier] || tier
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // TODO: 调用搜索API
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.cityTier = undefined
  searchForm.status = undefined
  pagination.page = 1
  // TODO: 重新加载数据
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.cityTier = 'tier1'
  formData.status = 'inactive'
  formData.cities = []
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.priority = 50
  formData.description = ''
}

// 创建
const handleCreate = () => {
  resetForm()
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增城市因子'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑城市因子'

  formData.name = row.name
  formData.cityTier = row.cityTier
  formData.status = row.status
  formData.cities = [...row.cities]
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.priority = row.priority
  formData.description = row.description

  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除城市因子"${row.name}"吗？`,
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
</script>

<style scoped lang="scss">
.city-factor-list {
  // 组件样式
}
</style>
