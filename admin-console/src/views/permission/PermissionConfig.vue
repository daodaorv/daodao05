<!-- 权限配置页面 -->
<template>
  <div class="permission-config-container">
    <PageHeader title="权限配置" description="管理系统权限配置和权限树" />

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
      <template #type="{ row }">
        <el-tag v-if="row.type === 'menu'" type="primary">菜单</el-tag>
        <el-tag v-else-if="row.type === 'button'" type="success">按钮</el-tag>
        <el-tag v-else type="info">API</el-tag>
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
      title="编辑权限"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入权限描述"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn } from '@/components/common/DataTable.vue'
import { permissionApi } from '@/api/permission'
import type { Permission } from '@/api/permission'

const searchFields: SearchField[] = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '权限名称/权限代码',
  },
  {
    type: 'select',
    prop: 'type',
    label: '权限类型',
    placeholder: '请选择类型',
    options: [
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' },
      { label: 'API', value: 'api' },
    ],
  },
]

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '权限名称', width: 150 },
  { prop: 'code', label: '权限代码', width: 180 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'path', label: '路径', width: 200 },
  { prop: 'description', label: '描述', width: 200 },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'enabled', label: '状态', width: 100, slot: 'enabled' },
  { prop: 'actions', label: '操作', width: 120, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<Permission[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  keyword: '',
  type: '',
})

const dialogVisible = ref(false)
const submitLoading = ref(false)

const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  name: '',
  description: '',
  sort: 0,
  enabled: true,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await permissionApi.getPermissionList({
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
    keyword: '',
    type: '',
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

const handleToggleEnabled = async (row: Permission) => {
  try {
    await permissionApi.updatePermission({
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

const handleEdit = (row: Permission) => {
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    description: row.description,
    sort: row.sort,
    enabled: row.enabled,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await permissionApi.updatePermission(formData)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchList()
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.permission-config-container {
  padding: 20px;
}
</style>
