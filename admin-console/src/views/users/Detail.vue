<template>
  <div class="user-detail-container">
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <span class="text-large font-600 mr-3">用户详情</span>
      </template>
    </el-page-header>

    <el-card v-loading="loading" class="detail-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="用户类型">
          <el-tag v-if="userInfo.user_type === 'pc_admin'" type="danger">PC管理员</el-tag>
          <el-tag v-else-if="userInfo.user_type === 'mobile_admin'" type="warning">移动管理员</el-tag>
          <el-tag v-else type="info">普通用户</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="userInfo.status === 'active'" type="success">正常</el-tag>
          <el-tag v-else-if="userInfo.status === 'inactive'" type="warning">禁用</el-tag>
          <el-tag v-else type="danger">封禁</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ userInfo.created_at }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ userInfo.updated_at }}</el-descriptions-item>
        <el-descriptions-item label="最后登录">{{ userInfo.last_login_at || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="action-card" shadow="never">
      <el-space>
        <el-button type="primary" @click="handleEdit">编辑用户</el-button>
        <el-button :type="userInfo.status === 'active' ? 'warning' : 'success'" @click="handleToggleStatus">
          {{ userInfo.status === 'active' ? '禁用用户' : '启用用户' }}
        </el-button>
        <el-button type="info" @click="handleResetPassword">重置密码</el-button>
        <el-button type="danger" @click="handleDelete">删除用户</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserDetail, updateUserStatus, deleteUser, resetUserPassword, type User } from '@/api/user'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const userInfo = ref<Partial<User>>({})

const fetchUserDetail = async () => {
  loading.value = true
  try {
    const res = await getUserDetail(Number(route.params.id))
    userInfo.value = res.data
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/users/${route.params.id}/edit`)
}

const handleToggleStatus = async () => {
  const newStatus = userInfo.value.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', { type: 'warning' })
    await updateUserStatus(userInfo.value.id!, newStatus)
    ElMessage.success(`${action}成功`)
    fetchUserDetail()
  } catch (error: any) {
    if (error !== 'cancel') console.error(`${action}失败:`, error)
  }
}

const handleResetPassword = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新密码', '重置密码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{6,}$/,
      inputErrorMessage: '密码至少6位'
    })
    await resetUserPassword(userInfo.value.id!, value)
    ElMessage.success('密码重置成功')
  } catch (error: any) {
    if (error !== 'cancel') console.error('重置密码失败:', error)
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', { type: 'error' })
    await deleteUser(userInfo.value.id!)
    ElMessage.success('删除成功')
    router.push('/users')
  } catch (error: any) {
    if (error !== 'cancel') console.error('删除失败:', error)
  }
}

onMounted(() => fetchUserDetail())
</script>

<style scoped lang="scss">
.user-detail-container { padding: 20px;
  .el-page-header { margin-bottom: 20px; }
  .detail-card, .action-card { margin-bottom: 20px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
}
</style>

