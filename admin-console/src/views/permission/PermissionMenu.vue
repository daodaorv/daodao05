<!-- 菜单权限管理页面 -->
<template>
  <div class="permission-menu-container">
    <PageHeader title="菜单权限" description="管理角色的菜单访问权限" />

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
      <template #permissions="{ row }">
        <el-tag v-if="row.canView" type="success" size="small" style="margin-right: 5px">查看</el-tag>
        <el-tag v-if="row.canCreate" type="primary" size="small" style="margin-right: 5px">创建</el-tag>
        <el-tag v-if="row.canEdit" type="warning" size="small" style="margin-right: 5px">编辑</el-tag>
        <el-tag v-if="row.canDelete" type="danger" size="small" style="margin-right: 5px">删除</el-tag>
        <el-tag v-if="row.canExport" type="info" size="small">导出</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑权限</el-button>
      </template>
    </DataTable>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑菜单权限"
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
        <el-form-item label="菜单">
          <el-input v-model="formData.menuName" disabled />
        </el-form-item>
        <el-form-item label="权限设置">
          <el-checkbox v-model="formData.canView">查看</el-checkbox>
          <el-checkbox v-model="formData.canCreate">创建</el-checkbox>
          <el-checkbox v-model="formData.canEdit">编辑</el-checkbox>
          <el-checkbox v-model="formData.canDelete">删除</el-checkbox>
          <el-checkbox v-model="formData.canExport">导出</el-checkbox>
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
import type { MenuPermission } from '@/api/permission'

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
]

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'roleName', label: '角色', width: 150 },
  { prop: 'menuName', label: '菜单名称', width: 150 },
  { prop: 'menuPath', label: '菜单路径', width: 200 },
  { prop: 'permissions', label: '权限', width: 300, slot: 'permissions' },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<MenuPermission[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  roleId: undefined as number | undefined,
})

const dialogVisible = ref(false)
const submitLoading = ref(false)

const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  roleName: '',
  menuName: '',
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canExport: false,
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await permissionApi.getMenuPermissionList({
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

const handleEdit = (row: MenuPermission) => {
  Object.assign(formData, {
    id: row.id,
    roleName: row.roleName,
    menuName: row.menuName,
    canView: row.canView,
    canCreate: row.canCreate,
    canEdit: row.canEdit,
    canDelete: row.canDelete,
    canExport: row.canExport,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await permissionApi.updateMenuPermission({
      id: formData.id,
      canView: formData.canView,
      canCreate: formData.canCreate,
      canEdit: formData.canEdit,
      canDelete: formData.canDelete,
      canExport: formData.canExport,
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
.permission-menu-container {
  padding: 20px;
}
</style>
