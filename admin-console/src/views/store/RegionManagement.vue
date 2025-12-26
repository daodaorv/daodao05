<!-- @ts-nocheck -->
<template>
  <div class="city-tier-management-container">


    <DataTable
      :data="cityTierList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :actions-width="150"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
          {{ row.status === 'active' ? '启用' : '停用' }}
        </el-tag>
      </template>
      <template #level="{ row }">
        <el-tag :type="getLevelTagType(row.level)" size="small">
          {{ row.name }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 编辑城市分级对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="分级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分级名称" />
        </el-form-item>
        <el-form-item label="分级编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分级编码" />
        </el-form-item>
        <el-form-item label="分级等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择分级等级" style="width: 100%">
            <el-option label="1级（一线城市）" :value="1" />
            <el-option label="2级（新一线城市）" :value="2" />
            <el-option label="3级（二线城市）" :value="3" />
            <el-option label="4级（三线城市）" :value="4" />
            <el-option label="5级（四线城市）" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="分级状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分级描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分级描述（包含的城市列表）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import DataTable from '@/components/common/DataTable.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import { getCityTierList, type CityTier } from '@/api/store'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 获取分级标签类型
const getLevelTagType = (level: number) => {
  const typeMap: Record<number, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    1: 'danger',
    2: 'warning',
    3: 'success',
    4: 'info',
    5: 'primary'
  }
  return typeMap[level] || 'info'
}

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'level', label: '分级等级', width: 150, slot: 'level' },
  { prop: 'code', label: '分级编码', width: 120 },
  { prop: 'cityCount', label: '城市数量', width: 120 },
  { prop: 'storeCount', label: '门店数量', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'description', label: '包含城市', minWidth: 300 },
  { prop: 'createdAt', label: '创建时间', width: 180 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增分级',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate()
  }
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '编辑',
  // @ts-ignore
    type: 'primary',
    icon: Edit,
    onClick: (row: CityTier) => handleEdit(row)
  },
  {
    label: '删除',
  // @ts-ignore
    type: 'danger',
    icon: Delete,
    onClick: (row: CityTier) => handleDelete(row)
  }
]

// 城市分级列表
const cityTierList = ref<CityTier[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增分级')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  code: '',
  level: 1,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分级名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分级编码', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择分级等级', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择分级状态', trigger: 'change' }
  ]
}

// 加载城市分级列表
const loadCityTierList = async () => {
  loading.value = true
  try {
    const res = await getCityTierList() as any
    cityTierList.value = res.data
  } catch (error) {
    handleApiError(error, '加载城市分级列表失败')
  } finally {
    loading.value = false
  }
}

// 新增分级
const handleCreate = () => {
  dialogTitle.value = '新增分级'
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑分级
const handleEdit = (row: CityTier) => {
  dialogTitle.value = '编辑分级'
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.level = row.level
  form.status = row.status
  form.description = row.description
  dialogVisible.value = true
}

// 删除分级
const handleDelete = async (row: CityTier) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分级 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('删除成功')
    loadCityTierList()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      // 这里应该调用创建/更新城市分级的API
      await new Promise(resolve => setTimeout(resolve, 500))

      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadCityTierList()
    } catch (error) {
      handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.name = ''
  form.code = ''
  form.level = 1
  form.status = 'active'
  form.description = ''
}

// 页面加载
onMounted(() => {
  loadCityTierList()
})
</script>

<style scoped lang="scss">
.city-tier-management-container {
  padding: 20px;
}
</style>
