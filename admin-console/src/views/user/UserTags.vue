<!-- @ts-nocheck -->
<template>
  <div class="user-tags-container">
    <div class="tags-layout">
      <!-- 左侧：标签列表 -->
      <el-card class="tags-sidebar" shadow="never">
        <template #header>
          <div class="sidebar-header">
            <span>标签分类</span>
            <el-button type="primary" size="small" :icon="Plus" @click="handleCreateTag">
              新增
            </el-button>
          </div>
        </template>

        <div class="tag-list">
          <!-- 按分类分组显示标签 -->
          <div
            v-for="(category, key) in groupedTags"
            :key="key"
            class="tag-category"
          >
            <div v-if="category.length > 0" class="category-header">
              {{ categoryNames[key] }}
            </div>
            <div
              v-for="tag in category"
              :key="tag.id"
              class="tag-item"
              :class="{ active: currentTag?.id === tag.id }"
              @click="handleSelectTag(tag)"
            >
              <div class="tag-info">
                <div class="tag-name-wrapper">
                  <el-tag :type="getTagType(tag.color)" size="large">
                    {{ tag.name }}
                  </el-tag>
                  <!-- 系统标签徽章 -->
                  <el-tag v-if="tag.type === 'system'" type="info" size="small" effect="plain">
                    系统
                  </el-tag>
                  <!-- 自动化状态徽章 -->
                  <el-icon v-if="hasEnabledTriggers(tag)" class="auto-icon" color="#67c23a" title="自动规则已启用">
                    <CircleCheck />
                  </el-icon>
                </div>
                <span class="tag-count">{{ tag.userCount }}人</span>
              </div>
              <el-dropdown @command="(cmd) => handleTagAction(tag, cmd)" trigger="click">
                <el-icon class="more-icon" @click.stop><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="hasRuleTrigger(tag)" command="execute" divided>
                      立即执行规则
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 右侧：用户列表 -->
      <div class="users-content">
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
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">
                搜索
              </el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 操作栏 -->
        <el-card class="toolbar-card" shadow="never">
          <el-button
            type="primary"
            :icon="Plus"
            :disabled="!currentTag"
            @click="handleBatchAddTag"
          >
            批量添加用户
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedUsers.length === 0"
            @click="handleBatchRemoveTag"
          >
            批量移除标签
          </el-button>
          <span v-if="currentTag" class="current-tag-info">
            当前标签：
            <el-tag :type="getTagType(currentTag.color)">
              {{ currentTag.name }}
            </el-tag>
          </span>
        </el-card>

        <!-- 用户列表 -->
        <el-card class="table-card" shadow="never">
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
            <el-table-column label="用户标签" min-width="300">
              <template #default="{ row }">
                <el-tag
                  v-for="tag in row.tags"
                  :key="tag.id"
                  :type="getTagType(tag.color)"
                  size="small"
                  closable
                  style="margin-right: 8px"
                  @close="handleRemoveUserTag(row, tag)"
                >
                  {{ tag.name }}
                </el-tag>
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Plus"
                  @click="handleAddUserTag(row)"
                >
                  添加标签
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleViewUser(row)">
                  查看详情
                </el-button>
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
      </div>
    </div>

    <!-- 新增/编辑标签对话框 - 4标签页 -->
    <el-dialog
      v-model="tagDialogVisible"
      :title="tagDialogTitle"
      width="800px"
      @close="handleTagDialogClose"
    >
      <el-tabs v-model="activeTab">
        <!-- 基本信息标签页 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="tagFormRef"
            :model="tagForm"
            :rules="tagFormRules"
            label-width="100px"
          >
            <el-form-item label="标签名称" prop="name">
              <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
            </el-form-item>
            <el-form-item label="标签类型" prop="type">
              <el-radio-group v-model="tagForm.type">
                <el-radio value="custom">自定义标签</el-radio>
                <el-radio value="system">系统标签</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="标签分类" prop="category">
              <el-select v-model="tagForm.category" placeholder="请选择分类">
                <el-option label="价值等级" value="value_level" />
                <el-option label="行为特征" value="behavior" />
                <el-option label="用户属性" value="user_attribute" />
                <el-option label="风险控制" value="risk_control" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签颜色" prop="color">
              <el-radio-group v-model="tagForm.color">
                <el-radio value="primary">蓝色</el-radio>
                <el-radio value="success">绿色</el-radio>
                <el-radio value="warning">橙色</el-radio>
                <el-radio value="danger">红色</el-radio>
                <el-radio value="info">灰色</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-input-number v-model="tagForm.priority" :min="1" :max="100" />
              <span style="margin-left: 10px; color: #909399; font-size: 12px;">
                数字越小优先级越高
              </span>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="tagForm.status">
                <el-radio value="active">启用</el-radio>
                <el-radio value="inactive">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="过期时间" prop="expiresAt">
              <el-date-picker
                v-model="tagForm.expiresAt"
                type="datetime"
                placeholder="选择过期时间(可选)"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="标签描述" prop="description">
              <el-input
                v-model="tagForm.description"
                type="textarea"
                :rows="3"
                placeholder="请输入标签描述"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 触发配置标签页 -->
        <el-tab-pane label="触发配置" name="triggers">
          <div class="triggers-container">
            <div class="triggers-header">
              <span>已配置触发器</span>
              <el-button type="primary" size="small" :icon="Plus" @click="handleAddTrigger">
                添加触发器
              </el-button>
            </div>
            
            <el-empty v-if="!tagForm.triggers || tagForm.triggers.length === 0" description="暂无触发器配置" />
            
            <div v-else class="triggers-list">
              <div v-for="(trigger, index) in tagForm.triggers" :key="trigger.id" class="trigger-item">
                <div class="trigger-info">
                  <el-tag :type="getTriggerTypeTag(trigger.type)" size="large">
                    {{ getTriggerTypeName(trigger.type) }}
                  </el-tag>
                  <span class="trigger-name">{{ trigger.name }}</span>
                  <el-switch v-model="trigger.enabled" size="small" />
                </div>
                <div class="trigger-actions">
                  <el-button link type="primary" size="small" @click="handleEditTrigger(index)">
                    编辑
                  </el-button>
                  <el-button link type="danger" size="small" @click="handleDeleteTrigger(index)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>


        <!-- 业务关联标签页 -->
        <el-tab-pane label="业务关联" name="business">
          <el-form :model="tagForm" label-width="120px">
            <el-form-item label="关联优惠券">
              <el-select
                v-model="tagForm.businessAssociation.coupons"
                multiple
                placeholder="选择关联的优惠券"
                style="width: 100%"
              >
                <el-option label="新用户专享券" :value="1" />
                <el-option label="春节特惠券" :value="2" />
                <el-option label="周末出行券" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联价格策略">
              <el-select
                v-model="tagForm.businessAssociation.pricingStrategies"
                multiple
                placeholder="选择关联的价格策略"
                style="width: 100%"
              >
                <el-option label="春节假期价格上浮" :value="1" />
                <el-option label="淡季优惠策略" :value="2" />
                <el-option label="周末价格调整" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联营销活动">
              <el-select
                v-model="tagForm.businessAssociation.activities"
                multiple
                placeholder="选择关联的营销活动"
                style="width: 100%"
              >
                <el-option label="春节房车自驾游活动" :value="1" />
                <el-option label="新用户注册送券活动" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联分润配置">
              <el-select
                v-model="tagForm.businessAssociation.profitConfigs"
                multiple
                placeholder="选择关联的分润配置"
                style="width: 100%"
              >
                <el-option label="托管分润比例" :value="1" />
                <el-option label="合作商订单门店分润比例" :value="2" />
                <el-option label="员工激励比例" :value="3" />
                <el-option label="推广分润比例" :value="4" />
              </el-select>
            </el-form-item>
            <el-alert
              title="业务关联说明"
              type="info"
              :closable="false"
              show-icon
            >
              关联后,拥有此标签的用户将自动享受对应的优惠券、价格策略、营销活动和分润配置
            </el-alert>
          </el-form>
        </el-tab-pane>

        <!-- 会员权益标签页 (仅PLUS会员) -->
        <el-tab-pane label="会员权益" name="benefits">
          <el-form :model="tagForm" label-width="120px">
            <el-form-item label="积分倍数">
              <el-input-number
                v-model="tagForm.benefits.pointsMultiplier"
                :min="1"
                :max="10"
                :step="0.1"
                :disabled="tagForm.name !== 'PLUS会员'"
              />
              <span style="margin-left: 10px; color: #909399; font-size: 12px;">
                例如: 2.0 表示双倍积分
              </span>
            </el-form-item>
            <el-form-item label="价格折扣">
              <el-input-number
                v-model="tagForm.benefits.priceDiscount"
                :min="0.1"
                :max="1"
                :step="0.01"
                
              />
              <span style="margin-left: 10px; color: #909399; font-size: 12px;">
                例如: 0.95 表示95折
              </span>
            </el-form-item>
            <el-form-item label="专属优惠券">
              <el-select
                v-model="tagForm.benefits.exclusiveCoupons"
                multiple
                placeholder="选择专属优惠券"
                style="width: 100%"
                
              >
                <el-option label="新用户专享券" :value="1" />
                <el-option label="春节特惠券" :value="2" />
                <el-option label="周末出行券" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="优先服务">
              <el-switch
                v-model="tagForm.benefits.priorityService"
                :disabled="tagForm.name !== 'PLUS会员'"
              />
            </el-form-item>
            <el-form-item label="免费保险">
              <el-switch
                v-model="tagForm.benefits.freeInsurance"
                :disabled="false"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="tagDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleTagSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 为用户添加标签对话框 -->
    <el-dialog
      v-model="addTagDialogVisible"
      title="为用户添加标签"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="用户">
          <div>{{ currentUser?.username }} ({{ currentUser?.phone }})</div>
        </el-form-item>
        <el-form-item label="选择标签">
          <el-select
            v-model="selectedTagIds"
            multiple
            placeholder="请选择标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            >
              <el-tag :type="getTagType(tag.color)" size="small">
                {{ tag.name }}
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addTagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTagSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量添加用户对话框 -->
    <el-dialog
      v-model="batchAddDialogVisible"
      title="批量添加用户到标签"
      width="600px"
    >
      <el-form label-width="100px">
  // @ts-ignore
        <el-form-item label="当前标签">
          <el-tag :type="getTagType(currentTag?.color)" size="large">
            {{ currentTag?.name }}
          </el-tag>
        </el-form-item>
        <el-form-item label="选择用户">
          <el-select
            v-model="batchSelectedUserIds"
            multiple
            filterable
            placeholder="请选择用户"
            style="width: 100%"
          >
            <el-option
              v-for="user in allUserList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchAddSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 触发器配置对话框 -->
    <el-dialog
      v-model="triggerDialogVisible"
      :title="triggerDialogTitle"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="触发器类型">
          <el-radio-group v-model="triggerForm.type">
            <el-radio value="manual">手动触发</el-radio>
            <el-radio value="rule_based">规则触发</el-radio>
            <el-radio value="api_driven">API触发</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="触发器名称">
          <el-input v-model="triggerForm.name" placeholder="请输入触发器名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="triggerForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="triggerForm.priority" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="triggerForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="triggerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTriggerSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Delete,
  MoreFilled,
  CircleCheck,
} from '@element-plus/icons-vue'
import type { Tag, TagCategory, TagTriggerType } from '@/api/user'
import { API_TRIGGER_SOURCES } from '@/types/tag'
import { mockTags } from '@/mock/tags'

const router = useRouter()

// 用户数据类型
interface User {
  id: number
  username: string
  phone: string
  avatarUrl: string
  tags: Tag[]
  createdAt: string
}

// 标签列表 - 使用完整的 Mock 数据
const tagList = ref<Tag[]>(mockTags)

// 当前选中的标签
const currentTag = ref<Tag | null>(null)

// 按分类分组的标签
const groupedTags = computed(() => {
  const groups: Record<string, Tag[]> = {
    value_level: [],
    behavior: [],
    user_attribute: [],
    risk_control: []
  }

  tagList.value.forEach(tag => {
    if (tag.category && groups[tag.category]) {
      groups[tag.category].push(tag)
    }
  })

  return groups
})

// 检查标签是否有启用的触发器
const hasEnabledTriggers = (tag: Tag) => {
  if (tag.triggers && tag.triggers.length > 0) {
    return tag.triggers.some(t => t.enabled)
  }
}

// 检查标签是否有规则触发器
const hasRuleTrigger = (tag: Tag) => {
  if (tag.triggers && tag.triggers.length > 0) {
    return tag.triggers.some(t => t.type === 'rule_based' && t.enabled)
  }
  return false
}

// 分类名称映射
const categoryNames: Record<string, string> = {
  value_level: '价值等级',
  risk_control: '风险控制'
}

// 用户列表
const userList = ref<User[]>([])
const allUserList = ref<User[]>([
  {
    id: 1,
    username: '张三',
    phone: '13800138000',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [],
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    username: '李四',
    phone: '13800138001',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [],
    createdAt: '2024-02-10T08:00:00.000Z',
  },
])

const loading = ref(false)
const selectedUsers = ref<User[]>([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 标签对话框
const tagDialogVisible = ref(false)
const tagDialogTitle = ref('新增标签')
const isEditTag = ref(false)
const submitLoading = ref(false)
const tagFormRef = ref<FormInstance>()
const activeTab = ref('basic') // 当前激活的标签页: basic, business, benefits


const tagForm = reactive({
  id: 0,
  name: '',
  color: 'primary',
  description: '',
  type: 'custom' as 'system' | 'custom',
  category: 'user_attribute' as TagCategory,
  priority: 1,
  status: 'active' as 'active' | 'inactive',
  expiresAt: '',
  // 多触发器配置
  triggers: [] as any[],
  // 业务关联
  businessAssociation: {
    coupons: [] as number[],
    pricingStrategies: [] as number[],
    activities: [] as number[],
    profitConfigs: [] as number[]
  },
  // 会员权益(仅PLUS会员)
  benefits: {
    pointsMultiplier: 1,
    priceDiscount: 1,
    exclusiveCoupons: [] as number[],
    priorityService: false,
    freeInsurance: false
  }
})

const tagFormRules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '标签名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择标签颜色', trigger: 'change' },
  ],
}

// 添加标签对话框
const addTagDialogVisible = ref(false)
const currentUser = ref<User | null>(null)
const selectedTagIds = ref<number[]>([])

// 批量添加对话框
const batchAddDialogVisible = ref(false)
const triggerDialogVisible = ref(false)
const triggerDialogTitle = ref("添加触发器")
const isEditTrigger = ref(false)
const currentTriggerIndex = ref(-1)
const batchSelectedUserIds = ref<number[]>([])

// 触发器表单数据
const triggerForm = reactive({
  type: "manual" as "manual" | "rule_based" | "api_driven",
  name: "",
  description: "",
  enabled: true,
  priority: 1
})

// 可用标签（排除用户已有的标签）
const availableTags = computed(() => {
  if (!currentUser.value) return tagList.value
  const userTagIds = currentUser.value.tags.map(t => t.id)
  return tagList.value.filter(t => !userTagIds.includes(t.id))
})
// 获取触发器类型标签颜色
const getTriggerTypeTag = (type: string) => {
  const map: Record<string, string> = {
    manual: "info",
    rule_based: "success",
    api_driven: "warning"
  }
  return map[type] || "info"
}

// 获取触发器类型名称
const getTriggerTypeName = (type: string) => {
  const map: Record<string, string> = {
    manual: "手动触发",
    rule_based: "规则触发",
    api_driven: "API触发"
  }
  return map[type] || "未知类型"
}


// 选择标签
const handleSelectTag = (tag: Tag) => {
  currentTag.value = tag
  loadTagUsers(tag.id)
}

// 加载标签下的用户
const loadTagUsers = (tagId: number) => {
  loading.value = true
  // TODO: 调用API加载该标签下的用户
  setTimeout(() => {
    // Mock数据
    userList.value = allUserList.value.map(user => ({
      ...user,
      tags: tagId === 1 ? [tagList.value[0]] : [],
    }))
    pagination.total = userList.value.length
    loading.value = false
  }, 300)
}

// 新增标签
const handleCreateTag = () => {
  tagDialogTitle.value = '新增标签'
  isEditTag.value = false
  tagDialogVisible.value = true
}

// 标签操作
const handleTagAction = (tag: Tag, command: string) => {
  if (command === 'edit') {
    handleEditTag(tag)
  } else if (command === 'delete') {
    handleDeleteTag(tag)
  } else if (command === 'execute') {
    handleExecuteAutoRule(tag)
  }
}

// 立即执行自动规则


// 编辑标签
const handleEditTag = (tag: Tag) => {
  tagDialogTitle.value = '编辑标签'
  isEditTag.value = true
  activeTab.value = 'basic'

  // 加载完整的标签数据
  tagForm.id = tag.id
  tagForm.name = tag.name
  tagForm.color = tag.color
  tagForm.description = tag.description
  tagForm.type = tag.type || 'custom'
  tagForm.category = tag.category || 'user_attribute'
  tagForm.priority = tag.priority || 1
  tagForm.status = tag.status || 'active'
  tagForm.expiresAt = tag.expiresAt || 'info'


  // 多触发器配置
  tagForm.triggers = tag.triggers ? [...tag.triggers] : []

  // 业务关联
  if (tag.businessAssociation) {
    tagForm.businessAssociation = {
      coupons: tag.businessAssociation.coupons || [],
      pricingStrategies: tag.businessAssociation.pricingStrategies || [],
      activities: tag.businessAssociation.activities || [],
      profitConfigs: tag.businessAssociation.profitConfigs || []
    }
  }

  // 会员权益
  if (tag.benefits) {
    tagForm.benefits = {
      pointsMultiplier: tag.benefits.pointsMultiplier || 1,
      priceDiscount: tag.benefits.priceDiscount || 1,
      exclusiveCoupons: tag.benefits.exclusiveCoupons || [],
      priorityService: tag.benefits.priorityService || false,
      freeInsurance: tag.benefits.freeInsurance || false
    }
  }

  tagDialogVisible.value = true
}

// 删除标签
const handleDeleteTag = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${tag.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('删除成功')
    const index = tagList.value.findIndex(t => t.id === tag.id)
    if (index > -1) {
      tagList.value.splice(index, 1)
    }
    if (currentTag.value?.id === tag.id) {
      currentTag.value = null
      userList.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 添加触发器
const handleAddTrigger = () => {
  triggerDialogTitle.value = "添加触发器"
  isEditTrigger.value = false
  currentTriggerIndex.value = -1

  // 重置表单
  triggerForm.type = "manual"
  triggerForm.name = ""
  triggerForm.description = ""
  triggerForm.enabled = true
  triggerForm.priority = tagForm.triggers.length + 1

  triggerDialogVisible.value = true
}

// 编辑触发器
const handleEditTrigger = (index: number) => {
  const trigger = tagForm.triggers[index]

  triggerDialogTitle.value = "编辑触发器"
  isEditTrigger.value = true
  currentTriggerIndex.value = index

  // 加载触发器数据
  triggerForm.type = trigger.type
  triggerForm.name = trigger.name
  triggerForm.description = trigger.description || ""
  triggerForm.enabled = trigger.enabled
  triggerForm.priority = trigger.priority

  triggerDialogVisible.value = true
}

// 删除触发器
const handleDeleteTrigger = (index: number) => {
  tagForm.triggers.splice(index, 1)
  ElMessage.success("删除成功")
}

// 提交触发器表单
const handleTriggerSubmit = () => {
  if (!triggerForm.name) {
    ElMessage.warning("请输入触发器名称")
    return
  }

  const newTrigger = {
    id: `trigger_${Date.now()}`,
    type: triggerForm.type,
    name: triggerForm.name,
    description: triggerForm.description,
    enabled: triggerForm.enabled,
    priority: triggerForm.priority
  }

  if (isEditTrigger.value && currentTriggerIndex.value >= 0) {
    tagForm.triggers[currentTriggerIndex.value] = newTrigger
    ElMessage.success("更新成功")
  } else {
    tagForm.triggers.push(newTrigger)
    ElMessage.success("添加成功")
  }

  triggerDialogVisible.value = false
}

// 提交标签表单
const handleTagSubmit = async () => {
  if (!tagFormRef.value) return

  await tagFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEditTag.value) {
        const index = tagList.value.findIndex(t => t.id === tagForm.id)
        if (index > -1) {
          tagList.value[index] = {
            ...tagList.value[index],
            name: tagForm.name,
            color: tagForm.color,
            description: tagForm.description,
          }
        }
        ElMessage.success('更新成功')
      } else {
        const newTag: Tag = {
          id: tagList.value.length + 1,
          userCount: 0,
          createdAt: new Date().toISOString(),
        }
        tagList.value.push(newTag)
        ElMessage.success('创建成功')
      }
      tagDialogVisible.value = false
    } catch (error) {
      ElMessage.error(isEditTag.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 标签对话框关闭
const handleTagDialogClose = () => {
  tagFormRef.value?.resetFields()
  activeTab.value = 'basic'

  // 重置所有字段
  tagForm.id = 0
  tagForm.name = ''
  tagForm.color = 'primary'
  tagForm.description = ''
  tagForm.type = 'custom'
  tagForm.category = 'user_attribute'
  tagForm.priority = 1
  tagForm.status = 'active'
  tagForm.expiresAt = ''

  // 重置触发器配置
  tagForm.triggers = []
  tagForm.businessAssociation = {
    coupons: [],
    pricingStrategies: [],
    activities: [],
    profitConfigs: []
  }

  // 重置会员权益
  tagForm.benefits = {
    pointsMultiplier: 1,
    priceDiscount: 1,
    exclusiveCoupons: [],
    priorityService: false,
    freeInsurance: false
  }
}

// 为用户添加标签
const handleAddUserTag = (user: User) => {
  currentUser.value = user
  selectedTagIds.value = []
  addTagDialogVisible.value = true
}

// 提交添加标签
const handleAddTagSubmit = () => {
  if (selectedTagIds.value.length === 0) {
    ElMessage.warning('请选择至少一个标签')
    return
  }

  const selectedTags = tagList.value.filter(t => selectedTagIds.value.includes(t.id))
  if (currentUser.value) {
    currentUser.value.tags.push(...selectedTags)
  }
  ElMessage.success('添加成功')
  addTagDialogVisible.value = false
}

// 移除用户标签
const handleRemoveUserTag = async (user: User, tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除用户 "${user.username}" 的标签 "${tag.name}" 吗？`,
      '移除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const index = user.tags.findIndex(t => t.id === tag.id)
    if (index > -1) {
      user.tags.splice(index, 1)
    }
    ElMessage.success('移除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('移除失败')
    }
  }
}

// 批量添加用户
const handleBatchAddTag = () => {
  batchSelectedUserIds.value = []
  batchAddDialogVisible.value = true
}

// 提交批量添加
const handleBatchAddSubmit = () => {
  if (batchSelectedUserIds.value.length === 0) {
    ElMessage.warning('请选择至少一个用户')
    return
  }

  ElMessage.success(`成功为 ${batchSelectedUserIds.value.length} 个用户添加标签`)
  batchAddDialogVisible.value = false
  if (currentTag.value) {
    loadTagUsers(currentTag.value.id)
  }
}

// 批量移除标签
const handleBatchRemoveTag = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要为选中的 ${selectedUsers.value.length} 个用户移除当前标签吗？`,
      '批量移除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('批量移除成功')
    selectedUsers.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量移除失败')
    }
  }
}

// 查看用户详情
const handleViewUser = (user: User) => {
  router.push(`/users/detail/${user.id}`)
}

// 选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

// 获取标签类型
const getTagType = (color: string) => {
  return color as any
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
  // 默认选中第一个标签
  if (tagList.value.length > 0) {
    handleSelectTag(tagList.value[0])
  }
})
</script>

<style scoped lang="scss">
.user-tags-container {
  padding: 20px;

  .tags-layout {
    display: flex;
    gap: 20px;
    height: calc(100vh - 120px);

    .tags-sidebar {
      width: 280px;
      flex-shrink: 0;

      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      .tag-list {
        .tag-category {
          margin-bottom: 20px;

          .category-header {
            font-size: 12px;
            font-weight: 600;
            color: #909399;
            padding: 8px 12px;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        .tag-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f5f7fa;
          }

          &.active {
            background: #ecf5ff;
            border-left: 3px solid #409eff;
          }

          .tag-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1;
            overflow: hidden;

            .tag-name-wrapper {
              display: flex;
              align-items: center;
              gap: 6px;
              flex-wrap: wrap;

              .auto-icon {
                font-size: 16px;
                flex-shrink: 0;
              }
            }

            .tag-count {
              color: #909399;
              font-size: 12px;
              margin-left: 4px;
            }
          }

          .more-icon {
            cursor: pointer;
            color: #909399;
            font-size: 16px;
            flex-shrink: 0;

            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }

    .users-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow: hidden;

      .search-card,
      .toolbar-card {
        flex-shrink: 0;
      }

      .toolbar-card {
        display: flex;
        align-items: center;
        gap: 12px;

        .current-tag-info {
          margin-left: auto;
          color: #606266;
          font-size: 14px;
        }
      }

      .table-card {
        flex: 1;
        overflow: auto;

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
  }
}

// 规则条件样式
.rule-conditions {
  .condition-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
    transition: all 0.3s;

    &:hover {
      background: #ecf5ff;
    }
  }
}

// 触发器管理样式
.triggers-container {
  .triggers-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 14px;
  }

  .triggers-list {
    .trigger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      margin-bottom: 12px;
      background: #f5f7fa;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background: #ecf5ff;
      }

      .trigger-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;

        .trigger-name {
          font-weight: 500;
          color: #303133;
        }
      }

      .trigger-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
