<!-- 数据权限管理页面 -->
<template>
  <div class="permission-data-container">
    <PageHeader title="数据权限" description="管理角色的数据访问范围和条件" />

    <!-- 搜索表单 -->
    <SearchForm v-model="searchParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :actions-width="120"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #resourceType="{ row }">
        <el-tag v-if="row.resourceType === 'user'" type="primary">用户</el-tag>
        <el-tag v-else-if="row.resourceType === 'order'" type="success">订单</el-tag>
        <el-tag v-else-if="row.resourceType === 'vehicle'" type="warning">车辆</el-tag>
        <el-tag v-else type="info">门店</el-tag>
      </template>

      <template #scope="{ row }">
        <el-tag v-if="row.scope === 'all'" type="danger">全部数据</el-tag>
        <el-tag v-else-if="row.scope === 'department'" type="warning">本部门</el-tag>
        <el-tag v-else-if="row.scope === 'store'" type="primary">本门店</el-tag>
        <el-tag v-else type="info">仅自己</el-tag>
      </template>

      <template #enabled="{ row }">
        <el-switch
          v-model="row.enabled"
          @change="handleToggleEnabled(row)"
        />
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      </template>
    </DataTable>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑数据权限"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="角色">
          <el-input v-model="formData.roleName" disabled />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-input v-model="formData.resourceName" disabled />
        </el-form-item>
        <el-form-item label="数据范围">
          <el-select v-model="formData.scope" placeholder="请选择数据范围">
            <el-option label="全部数据" value="all" />
            <el-option label="本部门数据" value="department" />
            <el-option label="本门店数据" value="store" />
            <el-option label="仅自己数据" value="self" />
          </el-select>
        </el-form-item>
        <el-form-item label="过滤条件">
          <el-input
            v-model="formData.conditions"
            type="textarea"
            :rows="3"
            placeholder="请输入SQL过滤条件，如：department_id = current_user.department_id"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn } from '@/components/common/DataTable.vue'
import { permissionApi } from '@/api/permission'
import type { DataPermission } from '@/api/permission'

const searchFields: SearchField[] = [
  {
    type: 'select',
    prop: 'roleId',
    label: '角色',
    placeholder: '请选择角色',
    options: [
      { label: '平台管理员', value: 1 },
      { label: '区域经理', value: 2 },
      { label: '门店经理', value: 3 },
    ],
  },
  {
    type: 'select',
    prop: 'resourceType',
    label: '资源类型',
    placeholder: '请选择资源类型',
    options: [
      { label: '用户', value: 'user' },
      { label: '订单', value: 'order' },
      { label: '车辆', value: 'vehicle' },
      { label: '门店', value: 'store' },
    ],
  },
]

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'roleName', label: '角色', width: 150 },
  { prop: 'resourceType', label: '资源类型', width: 120, slot: 'resourceType' },
  { prop: 'resourceName', label: '资源名称', width: 150 },
  { prop: 'scope', label: '数据范围', width: 120, slot: 'scope' },
  { prop: 'scopeName', label: '范围说明', width: 150 },
  { prop: 'conditions', label: '过滤条件', width: 250 },
  { prop: 'enabled', label: '状态', width: 100, slot: 'enabled' },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<DataPermission[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  roleId: undefined as number | undefined,
  resourceType: '',
})

const dialogVisible = ref(false)
const submitLoading = ref(false)

const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  roleName: '',
  resourceName: '',
  scope: '',
  conditions: '',
  enabled: true,
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await permissionApi.getDataPermissionList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchParams,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    roleId: undefined,
    resourceType: '',
  })
  pagination.page = 1
  fetchList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const handleToggleEnabled = async (row: DataPermission) => {
  try {
    await permissionApi.updateDataPermission({
      id: row.id,
      enabled: row.enabled,
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    row.enabled = !row.enabled
  }
}

const handleEdit = (row: DataPermission) => {
  Object.assign(formData, {
    id: row.id,
    roleName: row.roleName,
    resourceName: row.resourceName,
    scope: row.scope,
    conditions: row.conditions,
    enabled: row.enabled,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await permissionApi.updateDataPermission({
      id: formData.id,
      scope: formData.scope,
      conditions: formData.conditions,
      enabled: formData.enabled,
    })
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.permission-data-container {
  padding: 20px;
}
</style>
