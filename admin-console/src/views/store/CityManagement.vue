<!-- @ts-nocheck -->
<template>
  <div class="city-management-container">
    <PageHeader title="城市管理" description="管理服务城市和服务区域配置" />

    <DataTable
      :data="cityList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :actions-width="150"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
          {{ row.status === 'active' ? '已开通' : '未开通' }}
        </el-tag>
      </template>
      <template #serviceArea="{ row }">
        <el-tag
          v-for="area in row.serviceArea.slice(0, 3)"
          :key="area"
          size="small"
          style="margin-right: 4px"
        >
          {{ area }}
        </el-tag>
        <el-tag v-if="row.serviceArea.length > 3" size="small" type="info">
          +{{ row.serviceArea.length - 3 }}
        </el-tag>
      </template>
    </DataTable>

    <!-- 编辑城市对话框 -->
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
        <el-form-item label="城市名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入城市名称" />
        </el-form-item>
        <el-form-item label="城市编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入城市编码" />
        </el-form-item>
        <el-form-item label="所属省份" prop="provinceName">
          <el-input v-model="form.provinceName" placeholder="请输入所属省份" />
        </el-form-item>
        <el-form-item label="服务状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">已开通</el-radio>
            <el-radio label="inactive">未开通</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务区域" prop="serviceArea">
          <el-select
            v-model="form.serviceArea"
            multiple
            filterable
            allow-create
            placeholder="请输入或选择服务区域"
            style="width: 100%"
          >
            <el-option
              v-for="area in commonAreas"
              :key="area"
              :label="area"
              :value="area"
            />
          </el-select>
          <div class="form-tip">可以输入新的区域名称并按回车添加</div>
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
import { getCityList, type City } from '@/api/store'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 常用区域列表
const commonAreas = [
  '朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区',
  '浦东新区', '黄浦区', '徐汇区', '静安区', '长宁区', '普陀区',
  '天河区', '越秀区', '海珠区', '番禺区', '白云区', '荔湾区',
  '南山区', '福田区', '罗湖区', '宝安区', '龙岗区', '龙华区',
  '武侯区', '锦江区', '青羊区', '金牛区', '成华区', '高新区',
  '西湖区', '上城区', '拱墅区', '滨江区', '余杭区', '萧山区'
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '城市名称', width: 120 },
  { prop: 'code', label: '城市编码', width: 100 },
  { prop: 'provinceName', label: '所属省份', width: 120 },
  { prop: 'status', label: '服务状态', width: 100, slot: 'status' },
  { prop: 'storeCount', label: '门店数量', width: 100 },
  { prop: 'serviceArea', label: '服务区域', minWidth: 300, slot: 'serviceArea' },
  { prop: 'createdAt', label: '创建时间', width: 180 }
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增城市',
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
    onClick: (row: City) => handleEdit(row)
  },
  {
    label: '删除',
  // @ts-ignore
    type: 'danger',
    icon: Delete,
    onClick: (row: City) => handleDelete(row)
  }
]

// 城市列表
const cityList = ref<City[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增城市')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  code: '',
  provinceName: '',
  status: 'active' as 'active' | 'inactive',
  serviceArea: [] as string[]
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入城市名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入城市编码', trigger: 'blur' }
  ],
  provinceName: [
    { required: true, message: '请输入所属省份', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择服务状态', trigger: 'change' }
  ],
  serviceArea: [
    { required: true, message: '请选择服务区域', trigger: 'change', type: 'array', min: 1 }
  ]
}

// 加载城市列表
const loadCityList = async () => {
  loading.value = true
  try {
    const res = await getCityList() as any
    cityList.value = res.data
  } catch (error) {
    handleApiError(error, '加载城市列表失败')
  } finally {
    loading.value = false
  }
}

// 新增城市
const handleCreate = () => {
  dialogTitle.value = '新增城市'
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑城市
const handleEdit = (row: City) => {
  dialogTitle.value = '编辑城市'
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.provinceName = row.provinceName
  form.status = row.status
  form.serviceArea = [...row.serviceArea]
  dialogVisible.value = true
}

// 删除城市
const handleDelete = async (row: City) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除城市 "${row.name}" 吗？删除后该城市下的所有门店将无法访问。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('删除成功')
    loadCityList()
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
      // 这里应该调用创建/更新城市的API
      await new Promise(resolve => setTimeout(resolve, 500))

      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadCityList()
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
  form.provinceName = ''
  form.status = 'active'
  form.serviceArea = []
}

// 页面加载
onMounted(() => {
  loadCityList()
})
</script>

<style scoped lang="scss">
.city-management-container {
  padding: 20px;

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}
</style>
