<!-- @ts-nocheck -->
<template>
  <div class="plus-membership-container">
    <!-- 头部统计卡片 -->
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="title">
          <el-icon :size="24" color="#f59e0b"><Star /></el-icon>
          <span>PLUS会员管理</span>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalMembers }}</div>
            <div class="stat-label">PLUS会员总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value active">{{ stats.activeMembers }}</div>
            <div class="stat-label">有效会员</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.expiredMembers }}</div>
            <div class="stat-label">已过期</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ stats.totalRevenue }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 会员权益说明 -->
    <el-card class="benefits-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>PLUS会员权益</span>
          <el-tag type="warning" size="large">¥99/年</el-tag>
        </div>
      </template>
      <div class="benefits-grid">
        <div class="benefit-item">
          <el-icon :size="32" color="#f59e0b"><Trophy /></el-icon>
          <div class="benefit-title">双倍积分</div>
          <div class="benefit-desc">消费积分翻倍，更快兑换礼品</div>
        </div>
        <div class="benefit-item">
          <el-icon :size="32" color="#f59e0b"><Discount /></el-icon>
          <div class="benefit-title">95折优惠</div>
          <div class="benefit-desc">所有订单享受95折优惠</div>
        </div>
        <div class="benefit-item">
          <el-icon :size="32" color="#f59e0b"><Ticket /></el-icon>
          <div class="benefit-title">专属优惠券</div>
          <div class="benefit-desc">每月赠送专属优惠券</div>
        </div>
        <div class="benefit-item">
          <el-icon :size="32" color="#f59e0b"><Service /></el-icon>
          <div class="benefit-title">优先服务</div>
          <div class="benefit-desc">优先取车、优先客服响应</div>
        </div>
        <div class="benefit-item">
          <el-icon :size="32" color="#f59e0b"><Document /></el-icon>
          <div class="benefit-title">免费保险</div>
          <div class="benefit-desc">免费赠送全险保障</div>
        </div>
      </div>
    </el-card>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="手机号/用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="会员状态">
          <el-select
            v-model="searchForm.memberStatus"
            placeholder="选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="有效" value="active" />
            <el-option label="已过期" value="expired" />
            <el-option label="未开通" value="none" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" :icon="Plus" @click="handleBatchGrant">
            批量开通会员
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" width="250">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.avatarUrl" :size="40">
                {{ row.username?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="user-detail">
                <div>{{ row.username }}</div>
                <div class="phone">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会员状态" width="150">
          <template #default="{ row }">
            <el-tag v-if="isPlusMember(row)" type="warning" effect="dark">
              <el-icon><Star /></el-icon>
              PLUS会员
            </el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" width="180">
          <template #default="{ row }">
            <span v-if="isPlusMember(row)">
              {{ getMemberExpireTime(row) }}
            </span>
            <span v-else style="color: #909399">-</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余天数" width="120">
          <template #default="{ row }">
            <span v-if="isPlusMember(row)">
              <el-tag :type="getRemainingDaysType(row)" size="small">
                {{ getRemainingDays(row) }} 天
              </el-tag>
            </span>
            <span v-else style="color: #909399">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="!isPlusMember(row)"
              link
              type="primary"
              size="small"
              :icon="Plus"
              @click="handleGrantMembership(row)"
            >
              开通会员
            </el-button>
            <template v-else>
              <el-button
                link
                type="warning"
                size="small"
                :icon="Refresh"
                @click="handleRenewMembership(row)"
              >
                续费
              </el-button>
              <el-button
                link
                type="danger"
                size="small"
                :icon="Delete"
                @click="handleCancelMembership(row)"
              >
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
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

    <!-- 开通会员对话框 -->
    <el-dialog
      v-model="grantDialogVisible"
      title="开通PLUS会员"
      width="500px"
    >
      <el-form :model="grantForm" label-width="100px">
        <el-form-item label="用户">
          <div v-if="currentUser">{{ currentUser.username }} ({{ currentUser.phone }})</div>
        </el-form-item>
        <el-form-item label="会员时长">
          <el-radio-group v-model="grantForm.duration">
            <el-radio :label="365">1年 (¥99)</el-radio>
            <el-radio :label="730">2年 (¥178)</el-radio>
            <el-radio :label="1095">3年 (¥247)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="grantForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息(可选)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="grantDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGrantSubmit">
          确定开通
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量开通对话框 -->
    <el-dialog
      v-model="batchGrantDialogVisible"
      title="批量开通PLUS会员"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="选中用户">
          <div>已选择 {{ selectedUsers.length }} 个用户</div>
        </el-form-item>
        <el-form-item label="会员时长">
          <el-radio-group v-model="batchGrantForm.duration">
            <el-radio :label="365">1年 (¥99)</el-radio>
            <el-radio :label="730">2年 (¥178)</el-radio>
            <el-radio :label="1095">3年 (¥247)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchGrantForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息(可选)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchGrantDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchGrantSubmit">
          确定开通
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Delete,
  Star,
  Trophy,
  Discount,
  Ticket,
  Service,
  Document
} from '@element-plus/icons-vue'
import { mockUserList } from '@/mock/users'
import { mockTags } from '@/mock/tags'

// 用户列表
const userList = ref([...mockUserList])
const loading = ref(false)
const selectedUsers = ref<any[]>([])

// 统计数据
const stats = reactive({
  totalMembers: 0,
  activeMembers: 0,
  expiredMembers: 0,
  totalRevenue: 0
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  memberStatus: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 开通会员对话框
const grantDialogVisible = ref(false)
const currentUser = ref<any>(null)
const grantForm = reactive({
  duration: 365,
  remark: ''
})

// 批量开通对话框
const batchGrantDialogVisible = ref(false)
const batchGrantForm = reactive({
  duration: 365,
  remark: ''
})

// PLUS会员标签
const plusMemberTag = computed(() => {
  return mockTags.find(tag => tag.name === 'PLUS会员')
})

// 判断是否为PLUS会员
const isPlusMember = (user: any) => {
  return user.tags?.some((tag: any) => tag.name === 'PLUS会员')
}

// 获取会员到期时间
const getMemberExpireTime = (user: any) => {
  const plusTag = user.tags?.find((tag: any) => tag.name === 'PLUS会员')
  if (plusTag?.expiresAt) {
    return formatDateTime(plusTag.expiresAt)
  }
  return '-'
}

// 获取剩余天数
const getRemainingDays = (user: any) => {
  const plusTag = user.tags?.find((tag: any) => tag.name === 'PLUS会员')
  if (plusTag?.expiresAt) {
    const now = new Date()
    const expireDate = new Date(plusTag.expiresAt)
    const diff = expireDate.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
  }
  return 0
}

// 获取剩余天数类型
const getRemainingDaysType = (user: any) => {
  const days = getRemainingDays(user)
  if (days <= 7) return 'danger'
  if (days <= 30) return 'warning'
  return 'success'
}

// 加载统计数据
const loadStats = () => {
  const plusMembers = userList.value.filter(user => isPlusMember(user))
  const activeMembers = plusMembers.filter(user => getRemainingDays(user) > 0)
  const expiredMembers = plusMembers.filter(user => getRemainingDays(user) === 0)

  stats.totalMembers = plusMembers.length
  stats.activeMembers = activeMembers.length
  stats.expiredMembers = expiredMembers.length
  stats.totalRevenue = plusMembers.length * 99
}

// 加载用户列表
const loadUsers = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...mockUserList]

    // 关键词搜索
    if (searchForm.keyword) {
      filtered = filtered.filter(user =>
        user.username.includes(searchForm.keyword) ||
        user.phone.includes(searchForm.keyword)
      )
    }

    // 会员状态筛选
    if (searchForm.memberStatus === 'active') {
      filtered = filtered.filter(user => isPlusMember(user) && getRemainingDays(user) > 0)
    } else if (searchForm.memberStatus === 'expired') {
      filtered = filtered.filter(user => isPlusMember(user) && getRemainingDays(user) === 0)
    } else if (searchForm.memberStatus === 'none') {
      filtered = filtered.filter(user => !isPlusMember(user))
    }

    pagination.total = filtered.length
    const start = (pagination.page - 1) * pagination.pageSize
    userList.value = filtered.slice(start, start + pagination.pageSize)

    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.memberStatus = ''
  pagination.page = 1
  loadUsers()
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadUsers()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadUsers()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedUsers.value = selection
}

// 开通会员
const handleGrantMembership = (user: any) => {
  currentUser.value = user
  grantForm.duration = 365
  grantForm.remark = ''
  grantDialogVisible.value = true
}

// 提交开通
const handleGrantSubmit = async () => {
  if (!currentUser.value || !plusMemberTag.value) return

  // 计算到期时间
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + grantForm.duration)

  // 添加PLUS会员标签
  const tagWithExpire = {
    ...plusMemberTag.value,
    expiresAt: expireDate.toISOString()
  }

  if (!currentUser.value.tags) {
    currentUser.value.tags = []
  }
  currentUser.value.tags.push(tagWithExpire)

  ElMessage.success(`成功为用户 ${currentUser.value.username} 开通PLUS会员`)
  grantDialogVisible.value = false
  loadStats()
  loadUsers()
}

// 续费会员
const handleRenewMembership = (user: any) => {
  currentUser.value = user
  grantForm.duration = 365
  grantForm.remark = ''
  grantDialogVisible.value = true
}

// 取消会员
const handleCancelMembership = async (user: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消用户 "${user.username}" 的PLUS会员吗？`,
      '取消确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 移除PLUS会员标签
    user.tags = user.tags.filter((tag: any) => tag.name !== 'PLUS会员')

    ElMessage.success('取消成功')
    loadStats()
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败')
    }
  }
}

// 批量开通
const handleBatchGrant = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择用户')
    return
  }
  batchGrantForm.duration = 365
  batchGrantForm.remark = ''
  batchGrantDialogVisible.value = true
}

// 提交批量开通
const handleBatchGrantSubmit = async () => {
  if (!plusMemberTag.value) return

  // 计算到期时间
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + batchGrantForm.duration)

  // 为所有选中用户添加PLUS会员标签
  selectedUsers.value.forEach(user => {
    const tagWithExpire = {
      ...plusMemberTag.value,
      expiresAt: expireDate.toISOString()
    }

    if (!user.tags) {
      user.tags = []
    }

    // 如果已经是会员，先移除旧标签
    user.tags = user.tags.filter((tag: any) => tag.name !== 'PLUS会员')
    user.tags.push(tagWithExpire)
  })

  ElMessage.success(`成功为 ${selectedUsers.value.length} 个用户开通PLUS会员`)
  batchGrantDialogVisible.value = false
  selectedUsers.value = []
  loadStats()
  loadUsers()
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 页面加载
onMounted(() => {
  loadStats()
  loadUsers()
})
</script>

<style scoped lang="scss">
.plus-membership-container {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .header-content {
      .title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .stat-item {
          text-align: center;
          padding: 16px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 8px;

          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #f59e0b;
            margin-bottom: 8px;

            &.active {
              color: #10b981;
            }
          }

          .stat-label {
            font-size: 14px;
            color: #78350f;
          }
        }
      }
    }
  }

  .benefits-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;

      .benefit-item {
        text-align: center;
        padding: 20px;
        background: #fffbeb;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }

        .benefit-title {
          font-size: 16px;
          font-weight: 600;
          color: #78350f;
          margin: 12px 0 8px;
        }

        .benefit-desc {
          font-size: 13px;
          color: #92400e;
          line-height: 1.5;
        }
      }
    }
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-detail {
        .phone {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
