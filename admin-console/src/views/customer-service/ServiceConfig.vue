<!-- @ts-nocheck -->
<template>
  <div class="service-config-container">
    <PageHeader title="智能客服配置" description="配置智能路由和客服人员管理" />

    <el-tabs v-model="activeTab" class="config-tabs">
      <!-- 智能路由配置 -->
      <el-tab-pane label="智能路由配置" name="routing">
        <el-form
          :model="routingConfig"
          :rules="routingRules"
          ref="routingFormRef"
          label-width="150px"
        >
          <el-card header="基础配置" class="config-card">
            <el-form-item label="启用自动路由" prop="enableAutoRouting">
              <el-switch v-model="routingConfig.enableAutoRouting" />
              <span class="form-tip">开启后，工单将自动分配给合适的客服</span>
            </el-form-item>

            <el-form-item label="路由策略" prop="routingStrategy">
              <el-radio-group v-model="routingConfig.routingStrategy">
                <el-radio value="skill">技能匹配</el-radio>
                <el-radio value="load">负载均衡</el-radio>
                <el-radio value="priority">优先级优先</el-radio>
                <el-radio value="round_robin">轮询分配</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>

          <el-card header="路由规则" class="config-card">
            <el-form-item label="技能匹配" prop="skillMatching">
              <el-switch v-model="routingConfig.skillMatching" />
              <span class="form-tip">根据客服技能自动匹配工单类型</span>
            </el-form-item>

            <el-form-item label="负载均衡" prop="loadBalancing">
              <el-switch v-model="routingConfig.loadBalancing" />
              <span class="form-tip">优先分配给工单数较少的客服</span>
            </el-form-item>

            <el-form-item label="优先级优先" prop="priorityFirst">
              <el-switch v-model="routingConfig.priorityFirst" />
              <span class="form-tip">高优先级工单优先分配</span>
            </el-form-item>
          </el-card>

          <el-card header="时效配置" class="config-card">
            <el-form-item label="最大等待时间" prop="maxWaitTime">
              <el-input-number v-model="routingConfig.maxWaitTime" :min="1" :max="60" />
              <span class="form-tip">分钟，超过此时间未分配将发出提醒</span>
            </el-form-item>

            <el-form-item label="自动升级" prop="autoEscalate">
              <el-switch v-model="routingConfig.autoEscalate" />
              <span class="form-tip">工单长时间未处理自动升级优先级</span>
            </el-form-item>

            <el-form-item label="升级时间" prop="escalateTime">
              <el-input-number v-model="routingConfig.escalateTime" :min="10" :max="120" />
              <span class="form-tip">分钟，超过此时间未处理将自动升级</span>
            </el-form-item>
          </el-card>

          <el-card header="工作时间" class="config-card">
            <el-form-item label="开始时间" prop="workingHours.start">
              <el-time-select
                v-model="routingConfig.workingHours.start"
                start="00:00"
                step="00:30"
                end="23:30"
                placeholder="选择开始时间"
              />
            </el-form-item>

            <el-form-item label="结束时间" prop="workingHours.end">
              <el-time-select
                v-model="routingConfig.workingHours.end"
                start="00:00"
                step="00:30"
                end="23:30"
                placeholder="选择结束时间"
              />
            </el-form-item>
          </el-card>

          <el-form-item>
            <el-button type="primary" @click="handleSaveRouting" :loading="routingSaving">
              保存配置
            </el-button>
            <el-button @click="handleResetRouting">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 客服人员管理 -->
      <el-tab-pane label="客服人员管理" name="agents">
        <div class="agent-management">
          <el-table :data="agentList" :loading="agentLoading" border stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="头像" width="80">
              <template #default="{ row }">
                <el-avatar :src="row.avatar" :size="40" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getAgentStatusType(row.status)" size="small">
                  {{ getAgentStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="技能" min-width="200">
              <template #default="{ row }">
                <el-tag
                  v-for="(skill, index) in row.skills"
                  :key="index"
                  size="small"
                  style="margin-right: 4px"
                >
                  {{ getSkillLabel(skill) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="工单负载" width="150">
              <template #default="{ row }">
                <el-progress
                  :percentage="(row.currentTickets / row.maxConcurrent) * 100"
                  :color="getLoadColor(row.currentTickets, row.maxConcurrent)"
                >
                  <span>{{ row.currentTickets }}/{{ row.maxConcurrent }}</span>
                </el-progress>
              </template>
            </el-table-column>
            <el-table-column label="统计" width="200">
              <template #default="{ row }">
                <div class="agent-stats">
                  <div>累计工单: {{ row.totalTickets }}</div>
                  <div>平均满意度: {{ row.avgSatisfaction.toFixed(1) }}</div>
                  <div>平均响应: {{ row.avgResponseTime }}分钟</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="onlineTime" label="今日在线" width="120">
              <template #default="{ row }">
                {{ row.onlineTime.toFixed(1) }}小时
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'offline'"
                  type="success"
                  link
                  @click="handleUpdateAgentStatus(row, 'online')"
                >
                  上线
                </el-button>
                <el-button
                  v-if="row.status === 'online'"
                  type="warning"
                  link
                  @click="handleUpdateAgentStatus(row, 'offline')"
                >
                  下线
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import {
  getRoutingConfig,
  updateRoutingConfig,
  getServiceAgents,
  updateServiceAgentStatus,
  type RoutingConfig,
  type ServiceAgent,
  type ServiceStatus,
  type ServiceSkill
} from '@/api/customerService'

// 当前标签页
const activeTab = ref('routing')

// 智能路由配置
const routingConfig = reactive<RoutingConfig>({
  id: 1,
  enableAutoRouting: true,
  routingStrategy: 'skill',
  skillMatching: true,
  loadBalancing: true,
  priorityFirst: true,
  maxWaitTime: 5,
  autoEscalate: true,
  escalateTime: 30,
  workingHours: {
    start: '09:00',
    end: '18:00'
  },
  updatedAt: ''
})

const routingFormRef = ref()
const routingRules = {
  routingStrategy: [{ required: true, message: '请选择路由策略', trigger: 'change' }],
  maxWaitTime: [
    { required: true, message: '请设置最大等待时间', trigger: 'blur' },
    { type: 'number', min: 1, max: 60, message: '等待时间范围为1-60分钟', trigger: 'blur' }
  ],
  escalateTime: [
    { required: true, message: '请设置升级时间', trigger: 'blur' },
    { type: 'number', min: 10, max: 120, message: '升级时间范围为10-120分钟', trigger: 'blur' }
  ]
}
const routingSaving = ref(false)

// 客服人员列表
const agentList = ref<ServiceAgent[]>([])
const agentLoading = ref(false)

// 获取路由配置
const fetchRoutingConfig = async () => {
  try {
    const config = await getRoutingConfig()
    Object.assign(routingConfig, config)
  } catch (error) {
    console.error('获取路由配置失败:', error)
    ElMessage.error('获取路由配置失败')
  }
}

// 保存路由配置
const handleSaveRouting = async () => {
  if (!routingFormRef.value) return

  await routingFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    routingSaving.value = true
    try {
      await updateRoutingConfig(routingConfig)
      ElMessage.success('保存成功')
      fetchRoutingConfig()
    } catch (error) {
      console.error('保存配置失败:', error)
      ElMessage.error('保存配置失败')
    } finally {
      routingSaving.value = false
    }
  })
}

// 重置路由配置
const handleResetRouting = () => {
  fetchRoutingConfig()
}

// 获取客服人员列表
const fetchAgentList = async () => {
  agentLoading.value = true
  try {
    agentList.value = await getServiceAgents()
  } catch (error) {
    console.error('获取客服列表失败:', error)
    ElMessage.error('获取客服列表失败')
  } finally {
    agentLoading.value = false
  }
}

// 更新客服状态
const handleUpdateAgentStatus = async (agent: ServiceAgent, status: ServiceStatus) => {
  try {
    await updateServiceAgentStatus(agent.id, status)
    ElMessage.success('状态更新成功')
    fetchAgentList()
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 获取客服状态类型
const getAgentStatusType = (status: ServiceStatus) => {
  const statusMap: Record<ServiceStatus, any> = {
    online: 'success',
    busy: 'warning',
    offline: 'info',
    break: ''
  }
  return statusMap[status] || 'info'
}

// 获取客服状态标签
const getAgentStatusLabel = (status: ServiceStatus) => {
  const statusMap: Record<ServiceStatus, string> = {
    online: '在线',
    busy: '忙碌',
    offline: '离线',
    break: '休息'
  }
  return statusMap[status] || status
}

// 获取技能标签
const getSkillLabel = (skill: ServiceSkill) => {
  const skillMap: Record<ServiceSkill, string> = {
    vehicle: '车辆',
    order: '订单',
    payment: '支付',
    technical: '技术',
    complaint: '投诉',
    general: '通用'
  }
  return skillMap[skill] || skill
}

// 获取负载颜色
const getLoadColor = (current: number, max: number) => {
  const percentage = (current / max) * 100
  if (percentage >= 80) return '#F56C6C'
  if (percentage >= 60) return '#E6A23C'
  return '#67C23A'
}

// 初始化
onMounted(() => {
  fetchRoutingConfig()
  fetchAgentList()
})
</script>

<style scoped lang="scss">
.service-config-container {
  padding: 20px;
}

.config-tabs {
  margin-top: 20px;
}

.config-card {
  margin-bottom: 20px;

  .form-tip {
    margin-left: 12px;
    font-size: 12px;
    color: #909399;
  }
}

.agent-management {
  .agent-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #606266;
  }
}
</style>
