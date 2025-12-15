<!-- @ts-nocheck -->
<template>
  <div class="region-management-container">
    <PageHeader title="区域管理" description="管理业务区域和区域经理分配" />

    <DataTable
      :data="regionList"
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
      <template #cityNames="{ row }">
        <el-tag
          v-for="city in row.cityNames.slice(0, 3)"
          :key="city"
          size="small"
          style="margin-right: 4px"
        >
          {{ city }}
        </el-tag>
        <el-tag v-if="row.cityNames.length > 3" size="small" type="info">
          +{{ row.cityNames.length - 3 }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 编辑区域对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="区域编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="区域经理" prop="managerId">
          <el-select v-model="form.managerId" placeholder="请选择区域经理" style="width: 100%">
            <el-option
              v-for="manager in MANAGER_OPTIONS"
              :key="manager.value"
              :label="manager.label"
              :value="manager.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管辖城市" prop="cityIds">
          <el-select
            v-model="form.cityIds"
            multiple
            placeholder="请选择管辖城市"
            style="width: 100%"
          >
            <el-option
              v-for="city in cityList"
              :key="city.id"
              :label="city.name"
              :value="city.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入区域描述"
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
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import { getRegionList, getCityList, type Region, type City } from '@/api/store'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 区域经理选项 (Mock数据)
const MANAGER_OPTIONS = [
  { label: '李四', value: 2 },
  { label: '钱十一', value: 9 },
  { label: '孙十二', value: 10 },
  { label: '李十三', value: 11 }
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '区域名称', width: 120 },
  { prop: 'code', label: '区域编码', width: 100 },
  { prop: 'managerName', label: '区域经理', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'storeCount', label: '门店数量', width: 100 },
  { prop: 'cityNames', label: '管辖城市', minWidth: 300, slot: 'cityNames' },
  { prop: 'description', label: '区域描述', minWidth: 200 },
  { prop: 'createdAt', label: '创建时间', width: 180 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增区域',
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
    onClick: (row: Region) => handleEdit(row)
  },
  {
    label: '删除',
  // @ts-ignore
    type: 'danger',
    icon: Delete,
    onClick: (row: Region) => handleDelete(row)
  }
]

// 区域列表
const regionList = ref<Region[]>([])
const cityList = ref<City[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增区域')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  code: '',
  managerId: undefined as number | undefined,
  cityIds: [] as number[],
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入区域名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入区域编码', trigger: 'blur' }
  ],
  managerId: [
    { required: true, message: '请选择区域经理', trigger: 'change' }
  ],
  cityIds: [
    { required: true, message: '请选择管辖城市', trigger: 'change', type: 'array', min: 1 }
  ],
  status: [
    { required: true, message: '请选择区域状态', trigger: 'change' }
  ]
}

// 加载区域列表
const loadRegionList = async () => {
  loading.value = true
  try {
    const res = await getRegionList() as any
    regionList.value = res.data
  } catch (error) {
    handleApiError(error, '加载区域列表失败')
  } finally {
    loading.value = false
  }
}

// 加载城市列表
const loadCityList = async () => {
  try {
    const res = await getCityList() as any
    cityList.value = res.data
  } catch (error) {
    handleApiError(error, '加载城市列表失败')
  }
}

// 新增区域
const handleCreate = () => {
  dialogTitle.value = '新增区域'
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑区域
const handleEdit = (row: Region) => {
  dialogTitle.value = '编辑区域'
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.managerId = row.managerId
  form.cityIds = [...row.cityIds]
  form.status = row.status
  form.description = row.description
  dialogVisible.value = true
}

// 删除区域
const handleDelete = async (row: Region) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除区域 "${row.name}" 吗？删除后该区域下的所有门店将无法访问。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('删除成功')
    loadRegionList()
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
      // 这里应该调用创建/更新区域的API
      await new Promise(resolve => setTimeout(resolve, 500))

      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadRegionList()
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
  form.managerId = undefined
  form.cityIds = []
  form.status = 'active'
  form.description = ''
}

// 页面加载
onMounted(() => {
  loadCityList()
  loadRegionList()
})
</script>

<style scoped lang="scss">
.region-management-container {
  padding: 20px;
}
</style>
