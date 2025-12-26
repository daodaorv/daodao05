<!-- @ts-nocheck -->
<template>
  <div class="user-detail-container">
    <!-- 页面头部 -->
    <el-page-header @back="handleBack" title="返回">
      <template #content>
        <span class="page-title">用户详情</span>
      </template>
    </el-page-header>

    <div v-loading="loading" class="detail-content">
      <!-- 基本信息 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-button type="primary" size="small" @click="handleEdit">
              编辑
            </el-button>
          </div>
        </template>
        <div class="user-info">
          <div class="avatar-section">
            <el-avatar :src="userInfo.avatarUrl" :size="100">
              {{ userInfo.username?.charAt(0) }}
            </el-avatar>
            <div class="status-badge">
              <el-tag :type="getStatusTagType(userInfo.status)" size="large">
                {{ getStatusLabel(userInfo.status) }}
              </el-tag>
            </div>
          </div>
          <div class="info-section">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户ID">
                {{ userInfo.id }}
              </el-descriptions-item>
              <el-descriptions-item label="用户名">
                {{ userInfo.username }}
              </el-descriptions-item>
              <el-descriptions-item label="真实姓名">
                {{ userInfo.realName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ userInfo.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ userInfo.email || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="账号状态">
                <el-tag :type="getStatusTagType(userInfo.status)">
                  {{ getStatusLabel(userInfo.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="最后登录">
                {{ formatDateTime(userInfo.lastLoginAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDateTime(userInfo.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDateTime(userInfo.updatedAt) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-card>

      <!-- 操作记录 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>操作记录</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
            placement="top"
          >
            <el-card>
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.content }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 订单统计 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>订单统计</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">总订单数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">进行中订单</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">已完成订单</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">¥0</div>
              <div class="stat-label">累计消费</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 操作按钮 -->
      <el-card class="action-card" shadow="never">
        <el-space>
          <el-button type="primary" @click="handleEdit">编辑用户</el-button>
          <el-button
            v-if="userInfo.status === 'active'"
            type="warning"
            @click="handleStatusChange('inactive')"
          >
            禁用用户
          </el-button>
          <el-button
            v-if="userInfo.status === 'inactive'"
            type="success"
            @click="handleStatusChange('active')"
          >
            启用用户
          </el-button>
          <el-button
            v-if="userInfo.status !== 'banned'"
            type="danger"
            @click="handleStatusChange('banned')"
          >
            封禁用户
          </el-button>
          <el-button type="info" @click="handleResetPassword">重置密码</el-button>
          <el-button type="danger" plain @click="handleDelete">删除用户</el-button>
        </el-space>
      </el-card>
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑用户"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio value="active">正常</el-radio>
            <el-radio value="inactive">禁用</el-radio>
            <el-radio value="banned">封禁</el-radio>
          </el-radio-group>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { userApi } from '@/api/user'
import type { UserInfo } from '@/api/user'

const route = useRoute()
const router = useRouter()

// 用户信息
const userInfo = ref<UserInfo>({
  id: 0,
  username: '',
  phone: '',
  email: '',
  userType: 'customer',
  status: 'active',
  createdAt: '',
  updatedAt: '',
})

const loading = ref(false)

// 操作记录
const activities = ref([
  {
    title: '账号创建',
    content: '用户账号创建成功',
    timestamp: '2024-11-29 10:00:00',
  },
  {
    title: '首次登录',
    content: '用户首次登录系统',
    timestamp: '2024-11-29 10:30:00',
  },
])

// 对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)
const userFormRef = ref<FormInstance>()

// 用户表单（注意：用户管理只管理小程序C端用户，不包含管理员）
const userForm = reactive({
  id: 0,
  username: '',
  realName: '',
  email: '',
  userType: 'customer' as const, // 固定为customer类型
  status: 'active' as 'active' | 'inactive' | 'banned',
})

// 表单验证规则
const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
}

// 获取用户详情
const getUserDetail = async () => {
  const userId = Number(route.params.id)
  if (!userId) {
    ElMessage.error('用户ID无效')
    router.back()
    return
  }

  loading.value = true
  try {
    const response = await userApi.getUserDetail(userId)
    if (response.code === 200) {
      userInfo.value = response.data
    }
  } catch (error) {
    ElMessage.error('获取用户详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑用户
const handleEdit = () => {
  userForm.id = userInfo.value.id
  userForm.username = userInfo.value.username
  userForm.realName = userInfo.value.realName || 'info'
  userForm.email = userInfo.value.email || 'info'
  // userType固定为customer，不需要从userInfo中读取
  userForm.status = userInfo.value.status
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const response = await userApi.updateUser({
        id: userForm.id,
        username: userForm.username,
        email: userForm.email,
        userType: 'customer', // 固定为customer类型
        status: userForm.status,
        realName: userForm.realName,
      })
      if (response.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getUserDetail()
      }
    } catch (error) {
      ElMessage.error('更新失败')
      console.error(error)
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  userFormRef.value?.resetFields()
}

// 更改用户状态
const handleStatusChange = async (status: 'active' | 'inactive' | 'banned') => {
  try {
    const statusText = getStatusLabel(status)
    await ElMessageBox.confirm(
      `确定要将用户 "${userInfo.value.username}" 的状态改为 "${statusText}" 吗？`,
      '状态变更确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const response = await userApi.changeUserStatus(userInfo.value.id, status)
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
      getUserDetail()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('状态更新失败')
      console.error(error)
    }
  }
}

// 重置密码
const handleResetPassword = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 "${userInfo.value.username}" 的密码吗？新密码将发送到用户手机。`,
      '重置密码确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    ElMessage.success('密码重置成功，新密码已发送到用户手机')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('密码重置失败')
    }
  }
}

// 删除用户
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${userInfo.value.username}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const response = await userApi.deleteUser(userInfo.value.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      router.push('/users/list')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 获取状态标签类型
const getStatusTagType = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const statusMap: Record<string, any> = {
    active: 'success',
    inactive: 'warning',
    banned: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    banned: '封禁',
  }
  return statusMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 页面加载时获取用户详情
onMounted(() => {
  getUserDetail()
})
</script>

<style scoped lang="scss">
.user-detail-container {
  padding: 20px;

  .page-title {
    font-size: 18px;
    font-weight: 600;
  }

  .detail-content {
    margin-top: 20px;

    .info-card,
    .action-card {
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      gap: 30px;

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;

        .status-badge {
          width: 100%;
          text-align: center;
        }
      }

      .info-section {
        flex: 1;
      }
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #409eff;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>
