<!-- @ts-nocheck -->
<template>
  <div class="rule-logs-container">
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="title">
          <el-icon :size="24" color="#409eff"><Document /></el-icon>
          <span>规则执行日志</span>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalExecutions }}</div>
            <div class="stat-label">总执行次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value success">{{ stats.successExecutions }}</div>
            <div class="stat-label">成功次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalMatchedUsers }}</div>
            <div class="stat-label">匹配用户总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.averageDuration }}ms</div>
            <div class="stat-label">平均耗时</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="标签">
          <el-select
            v-model="searchForm.tagId"
            placeholder="选择标签"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="tag in tagList"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 日志列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="logList"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="标签" width="150">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.tagId)">
              {{ row.tagName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="规则条件" min-width="300">
          <template #default="{ row }">
            <div class="rule-conditions-text">{{ row.ruleConditions }}</div>
          </template>
        </el-table-column>
        <el-table-column label="触发方式" width="100">
          <template #default="{ row }">
            <el-tag :type="row.triggerMode === 'realtime' ? 'success' : 'info'" size="small">
              {{ row.triggerMode === 'realtime' ? '实时触发' : '手动触发' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配用户" width="100">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="handleViewMatchedUsers(row)"
            >
              {{ row.matchedUserCount }} 人
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="执行人" width="150">
          <template #default="{ row }">
            {{ row.executedBy }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时" width="100">
          <template #default="{ row }">
            {{ row.duration }}ms
          </template>
        </el-table-column>
        <el-table-column prop="executionTime" label="执行时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.executionTime) }}
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

    <!-- 匹配用户对话框 -->
    <el-dialog
      v-model="matchedUsersDialogVisible"
      title="匹配的用户列表"
      width="600px"
    >
      <el-table :data="matchedUsers" stripe max-height="400">
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewUser(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Document } from '@element-plus/icons-vue'
import { mockTags } from '@/mock/tags'
import { mockUserList } from '@/mock/users'
import {
  mockGetRuleExecutionLogs,
  mockGetRuleExecutionStats,
  type RuleExecutionLog
} from '@/mock/ruleExecutionLogs'

const router = useRouter()

// 标签列表
const tagList = ref(mockTags)

// 日志列表
const logList = ref<RuleExecutionLog[]>([])
const loading = ref(false)

// 统计数据
const stats = reactive({
  totalExecutions: 0,
  successExecutions: 0,
  failedExecutions: 0,
  totalMatchedUsers: 0,
  averageDuration: 0
})

// 搜索表单
const searchForm = reactive({
  tagId: undefined as number | undefined,
  status: '',
  dateRange: [] as Date[]
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 匹配用户对话框
const matchedUsersDialogVisible = ref(false)
const matchedUsers = ref<any[]>([])

// 加载统计数据
const loadStats = async () => {
  try {
    const res: any = await mockGetRuleExecutionStats()
    Object.assign(stats, res.data)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载日志列表
const loadLogs = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    if (searchForm.tagId) {
      params.tagId = searchForm.tagId
    }
    if (searchForm.status) {
      params.status = searchForm.status
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0].toISOString()
      params.endDate = searchForm.dateRange[1].toISOString()
    }

    const res: any = await mockGetRuleExecutionLogs(params)
    logList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    console.error('加载日志列表失败:', error)
    ElMessage.error('加载日志列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadLogs()
}

// 重置
const handleReset = () => {
  searchForm.tagId = undefined
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
  loadLogs()
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadLogs()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadLogs()
}

// 查看匹配的用户
const handleViewMatchedUsers = (log: RuleExecutionLog) => {
  matchedUsers.value = mockUserList.filter(user => log.matchedUserIds.includes(user.id))
  matchedUsersDialogVisible.value = true
}

// 查看用户详情
const handleViewUser = (user: any) => {
  router.push(`/users/detail/${user.id}`)
}

// 获取标签类型
const getTagType = (tagId: number) => {
  const tag = tagList.value.find(t => t.id === tagId)
  return tag?.color || 'primary'
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 页面加载
onMounted(() => {
  loadStats()
  loadLogs()
})
</script>

<style scoped lang="scss">
.rule-logs-container {
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
          background: #f5f7fa;
          border-radius: 8px;

          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #409eff;
            margin-bottom: 8px;

            &.success {
              color: #67c23a;
            }
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .rule-conditions-text {
      color: #606266;
      font-size: 13px;
      line-height: 1.5;
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
