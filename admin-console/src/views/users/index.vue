<template>
  <div class="user-list-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.search" placeholder="手机号/用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="searchForm.userType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="普通用户" value="customer" />
            <el-option label="移动端管理员" value="mobile_admin" />
            <el-option label="PC端管理员" value="pc_admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div class="toolbar">
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
        <el-button @click="fetchUserList">刷新</el-button>
      </div>

      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="用户类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.user_type === 'pc_admin'" type="danger">PC管理员</el-tag>
            <el-tag v-else-if="row.user_type === 'mobile_admin'" type="warning">移动管理员</el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">正常</el-tag>
            <el-tag v-else-if="row.status === 'inactive'" type="warning">禁用</el-tag>
            <el-tag v-else type="danger">封禁</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link :type="row.status === 'active' ? 'warning' : 'success'" size="small"
              @click="handleToggleStatus(row)">{{ row.status === 'active' ? '禁用' : '启用' }}</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserList, deleteUser, batchDeleteUsers, updateUserStatus, type User } from '@/api/user'

const router = useRouter()
const searchForm = reactive({ search: '', userType: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })
const userList = ref<User[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchForm.search,
      userType: searchForm.userType,
      status: searchForm.status
    })
    userList.value = res.data.users
    pagination.total = res.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchUserList() }
const handleReset = () => { Object.assign(searchForm, { search: '', userType: '', status: '' }); handleSearch() }
const handleSelectionChange = (selection: User[]) => { selectedIds.value = selection.map(item => item.id) }
const handleView = (row: User) => router.push(`/users/${row.id}`)
const handleEdit = (row: User) => router.push(`/users/${row.id}/edit`)
const handleSizeChange = () => { pagination.page = 1; fetchUserList() }
const handleCurrentChange = () => fetchUserList()

const handleToggleStatus = async (row: User) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 'active' ? '启用' : '禁用'}该用户吗？`, '提示', { type: 'warning' })
    await updateUserStatus(row.id, newStatus)
    ElMessage.success('操作成功')
    fetchUserList()
  } catch (error: any) { if (error !== 'cancel') console.error('操作失败:', error) }
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '警告', { type: 'error' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error: any) { if (error !== 'cancel') console.error('删除失败:', error) }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗？`, '警告', { type: 'error' })
    await batchDeleteUsers(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchUserList()
  } catch (error: any) { if (error !== 'cancel') console.error('批量删除失败:', error) }
}

onMounted(() => fetchUserList())
</script>

<style scoped lang="scss">
.user-list-container { padding: 20px;
  .search-card, .table-card { margin-bottom: 20px; }
  .toolbar { margin-bottom: 16px; }
  .pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
}
</style>

