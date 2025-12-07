<!-- @ts-nocheck -->
<template>
  <div class="migration-container">
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="title">
          <el-icon :size="24" color="#409eff"><Operation /></el-icon>
          <span>PLUS会员数据迁移</span>
        </div>
        <el-alert
          title="数据迁移说明"
          type="info"
          :closable="false"
          show-icon
        >
          <p>本工具用于将旧的 <code>plus_member</code> 用户类型迁移为 <code>customer</code> + PLUS会员标签的新模式。</p>
          <p>迁移后，用户将保留所有PLUS会员权益，并获得1年的会员有效期。</p>
        </el-alert>
      </div>
    </el-card>

    <!-- 迁移前检查 -->
    <el-card v-if="!migrationStarted" class="check-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>迁移前检查</span>
          <el-button type="primary" :icon="Search" @click="handlePreCheck">
            执行检查
          </el-button>
        </div>
      </template>

      <div v-if="preCheckResult" class="check-result">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="总用户数">
            {{ preCheckResult.totalUsers }}
          </el-descriptions-item>
          <el-descriptions-item label="需要迁移的用户">
            <el-tag type="warning">{{ preCheckResult.needMigration }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="已迁移的用户">
            <el-tag type="success">{{ preCheckResult.alreadyMigrated }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="普通用户">
            <el-tag type="info">{{ preCheckResult.normalUsers }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="preCheckResult.needMigration > 0" class="migration-action">
          <el-button
            type="primary"
            size="large"
            :icon="Upload"
            @click="handleStartMigration"
          >
            开始迁移 ({{ preCheckResult.needMigration }} 个用户)
          </el-button>
        </div>
        <el-alert
          v-else
          title="无需迁移"
          type="success"
          :closable="false"
          show-icon
          style="margin-top: 20px"
        >
          所有用户数据已是最新格式，无需执行迁移。
        </el-alert>
      </div>
    </el-card>

    <!-- 迁移进度 -->
    <el-card v-if="migrationStarted && !migrationCompleted" class="progress-card" shadow="never">
      <template #header>
        <span>迁移进度</span>
      </template>

      <div class="progress-content">
        <el-progress
          :percentage="migrationProgress"
          :status="migrationProgress === 100 ? 'success' : undefined"
          :stroke-width="20"
        />
        <div class="progress-text">
          正在迁移用户数据... {{ migrationProgress }}%
        </div>
      </div>
    </el-card>

    <!-- 迁移结果 -->
    <el-card v-if="migrationCompleted" class="result-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>迁移结果</span>
          <el-button type="primary" :icon="Download" @click="handleExportReport">
            导出报告
          </el-button>
        </div>
      </template>

      <div class="result-content">
        <!-- 统计信息 -->
        <el-descriptions :column="3" border>
          <el-descriptions-item label="总用户数">
            {{ migrationStats.totalUsers }}
          </el-descriptions-item>
          <el-descriptions-item label="成功迁移">
            <el-tag type="success">{{ migrationStats.migratedUsers }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="迁移失败">
            <el-tag type="danger">{{ migrationStats.failedUsers }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="跳过用户">
            <el-tag type="info">{{ migrationStats.skippedUsers }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ formatDateTime(migrationStats.startTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ formatDateTime(migrationStats.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="总耗时" :span="3">
            {{ migrationStats.duration }}ms
          </el-descriptions-item>
        </el-descriptions>

        <!-- 迁移日志 -->
        <div class="logs-section">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="成功日志" name="success">
              <el-table
                :data="successLogs"
                stripe
                max-height="400"
              >
                <el-table-column prop="userId" label="用户ID" width="100" />
                <el-table-column prop="username" label="用户名" width="150" />
                <el-table-column prop="oldUserType" label="旧类型" width="150" />
                <el-table-column prop="newUserType" label="新类型" width="150" />
                <el-table-column label="添加标签" width="150">
                  <template #default="{ row }">
                    <el-tag
                      v-for="tag in row.addedTags"
                      :key="tag"
                      type="warning"
                      size="small"
                      style="margin-right: 4px"
                    >
                      {{ tag }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="迁移时间" width="180">
                  <template #default="{ row }">
                    {{ formatDateTime(row.migratedAt) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="失败日志" name="failed">
              <el-table
                :data="failedLogs"
                stripe
                max-height="400"
              >
                <el-table-column prop="userId" label="用户ID" width="100" />
                <el-table-column prop="username" label="用户名" width="150" />
                <el-table-column prop="errorMessage" label="错误信息" />
                <el-table-column label="迁移时间" width="180">
                  <template #default="{ row }">
                    {{ formatDateTime(row.migratedAt) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 验证结果 -->
        <div class="validation-section">
          <el-button type="primary" :icon="Check" @click="handleValidate">
            验证迁移结果
          </el-button>

          <el-alert
            v-if="validationResult"
            :title="validationResult.isValid ? '验证通过' : '验证失败'"
            :type="validationResult.isValid ? 'success' : 'error'"
            :closable="false"
            show-icon
            style="margin-top: 20px"
          >
            <div v-if="!validationResult.isValid">
              <p v-for="(issue, index) in validationResult.issues" :key="index">
                {{ issue }}
              </p>
            </div>
            <p v-else>所有用户数据已成功迁移到新格式。</p>
          </el-alert>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Upload,
  Download,
  Check,
  Operation
} from '@element-plus/icons-vue'
import { mockUserList } from '@/mock/users'
import { mockTags } from '@/mock/tags'
import {
  migrateUsers,
  validateMigration,
  generateMigrationReport,
  exportMigrationReport,
  type MigrationLog,
  type MigrationStats
} from '@/utils/membershipMigration'

// 迁移状态
const migrationStarted = ref(false)
const migrationCompleted = ref(false)
const migrationProgress = ref(0)

// 预检查结果
const preCheckResult = ref<any>(null)

// 迁移结果
const migrationLogs = ref<MigrationLog[]>([])
const migrationStats = reactive<MigrationStats>({
  totalUsers: 0,
  migratedUsers: 0,
  failedUsers: 0,
  skippedUsers: 0,
  startTime: '',
  endTime: '',
  duration: 0
})

// 验证结果
const validationResult = ref<any>(null)

// 当前标签页
const activeTab = ref('success')

// PLUS会员标签
const plusMemberTag = computed(() => {
  return mockTags.find(tag => tag.name === 'PLUS会员')
})

// 成功日志
const successLogs = computed(() => {
  return migrationLogs.value.filter(log => log.status === 'success')
})

// 失败日志
const failedLogs = computed(() => {
  return migrationLogs.value.filter(log => log.status === 'failed')
})

// 执行预检查
const handlePreCheck = () => {
  const totalUsers = mockUserList.length
  const needMigration = mockUserList.filter(user => user.userType === 'plus_member').length
  const alreadyMigrated = mockUserList.filter(user =>
    user.userType === 'customer' && user.tags?.some(tag => tag.name === 'PLUS会员')
  ).length
  const normalUsers = totalUsers - needMigration - alreadyMigrated

  preCheckResult.value = {
    totalUsers,
    needMigration,
    alreadyMigrated,
    normalUsers
  }

  ElMessage.success('预检查完成')
}

// 开始迁移
const handleStartMigration = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要开始迁移吗？将迁移 ${preCheckResult.value.needMigration} 个用户。`,
      '迁移确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    if (!plusMemberTag.value) {
      ElMessage.error('未找到PLUS会员标签，请先创建')
      return
    }

    migrationStarted.value = true
    migrationProgress.value = 0

    // 模拟进度
    const progressInterval = setInterval(() => {
      if (migrationProgress.value < 90) {
        migrationProgress.value += 10
      }
    }, 200)

    // 执行迁移
    const result = await migrateUsers(mockUserList, plusMemberTag.value)

    clearInterval(progressInterval)
    migrationProgress.value = 100

    // 保存结果
    migrationLogs.value = result.logs
    Object.assign(migrationStats, result.stats)

    setTimeout(() => {
      migrationCompleted.value = true
      ElMessage.success('迁移完成！')
    }, 500)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('迁移失败')
      migrationStarted.value = false
    }
  }
}

// 验证迁移结果
const handleValidate = () => {
  validationResult.value = validateMigration(mockUserList)

  if (validationResult.value.isValid) {
    ElMessage.success('验证通过')
  } else {
    ElMessage.warning('验证发现问题，请查看详情')
  }
}

// 导出报告
const handleExportReport = () => {
  const report = generateMigrationReport(migrationLogs.value, migrationStats)
  exportMigrationReport(report, `migration-report-${Date.now()}.md`)
  ElMessage.success('报告已导出')
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
</script>

<style scoped lang="scss">
.migration-container {
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
        margin-bottom: 20px;
      }

      code {
        padding: 2px 6px;
        background: #f5f7fa;
        border-radius: 4px;
        color: #409eff;
        font-family: 'Courier New', monospace;
      }
    }
  }

  .check-card,
  .progress-card,
  .result-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .check-result {
      .migration-action {
        margin-top: 24px;
        text-align: center;
      }
    }

    .progress-content {
      padding: 40px 20px;

      .progress-text {
        text-align: center;
        margin-top: 20px;
        font-size: 16px;
        color: #606266;
      }
    }

    .result-content {
      .logs-section {
        margin-top: 24px;
      }

      .validation-section {
        margin-top: 24px;
      }
    }
  }
}
</style>
