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
                  <el-icon v-if="tag.autoRule?.enabled" class="auto-icon" color="#67c23a" title="自动规则已启用">
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
                    <el-dropdown-item v-if="tag.autoRule?.enabled" command="execute" divided>
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
                <el-radio label="custom">自定义标签</el-radio>
                <el-radio label="system">系统标签</el-radio>
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
                <el-radio label="primary">蓝色</el-radio>
                <el-radio label="success">绿色</el-radio>
                <el-radio label="warning">橙色</el-radio>
                <el-radio label="danger">红色</el-radio>
                <el-radio label="info">灰色</el-radio>
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
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">禁用</el-radio>
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

        <!-- 自动规则标签页 -->
        <el-tab-pane label="自动规则" name="autoRule">
          <el-form :model="tagForm" label-width="100px">
            <el-form-item label="启用规则">
              <el-switch v-model="tagForm.autoRule.enabled" />
              <span style="margin-left: 10px; color: #909399; font-size: 12px;">
                启用后将自动为符合条件的用户添加此标签
              </span>
            </el-form-item>
            <el-form-item label="触发模式" v-if="tagForm.autoRule.enabled">
              <el-radio-group v-model="tagForm.autoRule.triggerMode">
                <el-radio label="realtime">实时触发</el-radio>
                <el-radio label="manual">手动触发</el-radio>
              </el-radio-group>
              <div style="margin-top: 8px; color: #909399; font-size: 12px;">
                实时触发：用户行为发生时自动检查并添加标签<br>
                手动触发：需要管理员手动执行规则
              </div>
            </el-form-item>

            <!-- 规则条件配置 -->
            <el-form-item label="规则条件" v-if="tagForm.autoRule.enabled">
              <div class="rule-conditions">
                <div
                  v-for="(condition, index) in tagForm.autoRule.conditions"
                  :key="index"
                  class="condition-item"
                >
                  <el-select
                    v-model="condition.field"
                    placeholder="选择字段"
                    style="width: 180px"
                  >
                    <el-option label="注册天数" value="register_days" />
                    <el-option label="订单数量" value="order_count" />
                    <el-option label="消费总额" value="total_amount" />
                    <el-option label="最后登录天数" value="last_login_days" />
                    <el-option label="违规次数" value="violation_count" />
                  </el-select>

                  <el-select
                    v-model="condition.operator"
                    placeholder="选择操作符"
                    style="width: 120px; margin-left: 10px"
                  >
                    <el-option label="大于" value="gt" />
                    <el-option label="小于" value="lt" />
                    <el-option label="等于" value="eq" />
                    <el-option label="大于等于" value="gte" />
                    <el-option label="小于等于" value="lte" />
                  </el-select>

                  <el-input-number
                    v-model="condition.value"
                    :min="0"
                    :precision="0"
                    style="width: 150px; margin-left: 10px"
                    placeholder="输入值"
                  />

                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    style="margin-left: 10px"
                    @click="removeCondition(index)"
                  />
                </div>

                <el-button
                  type="primary"
                  :icon="Plus"
                  size="small"
                  style="margin-top: 10px"
                  @click="addCondition"
                >
                  添加条件
                </el-button>

                <div v-if="tagForm.autoRule.conditions.length > 1" style="margin-top: 10px">
                  <el-radio-group v-model="tagForm.autoRule.logic">
                    <el-radio label="AND">满足所有条件</el-radio>
                    <el-radio label="OR">满足任一条件</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="规则描述" v-if="tagForm.autoRule.enabled">
              <el-input
                v-model="tagForm.autoRule.description"
                type="textarea"
                :rows="3"
                placeholder="请描述自动规则的触发条件"
              />
            </el-form-item>

            <el-alert
              v-if="!tagForm.autoRule.enabled"
              title="自动规则未启用"
              type="info"
              :closable="false"
              show-icon
            >
              启用自动规则后,系统将根据设定的条件自动为用户添加标签
            </el-alert>
            <el-alert
              v-else-if="tagForm.autoRule.conditions.length === 0"
              title="请添加规则条件"
              type="warning"
              :closable="false"
              show-icon
            >
              至少需要添加一个规则条件才能启用自动规则
            </el-alert>
            <el-alert
              v-else
              title="自动规则已配置"
              type="success"
              :closable="false"
              show-icon
            >
              规则将根据设定的条件自动为用户添加标签
            </el-alert>
          </el-form>
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
            <el-alert
              v-if="tagForm.name !== 'PLUS会员'"
              title="仅PLUS会员标签可配置会员权益"
              type="warning"
              :closable="false"
              show-icon
              style="margin-bottom: 20px"
            />
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
                :disabled="tagForm.name !== 'PLUS会员'"
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
                :disabled="tagForm.name !== 'PLUS会员'"
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
                :disabled="tagForm.name !== 'PLUS会员'"
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
import type { Tag, TagType, TagCategory } from '@/api/user'
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

// 分类名称映射
const categoryNames: Record<string, string> = {
  value_level: '价值等级',
  behavior: '行为特征',
  user_attribute: '用户属性',
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
const activeTab = ref('basic') // 当前激活的标签页: basic, autoRule, business, benefits

// 规则条件接口
interface RuleCondition {
  field: 'register_days' | 'order_count' | 'total_amount' | 'last_login_days' | 'violation_count' | ''
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | ''
  value: number
}

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
  // 自动规则
  autoRule: {
    enabled: false,
    conditions: [] as RuleCondition[],
    logic: 'AND' as 'AND' | 'OR',
    triggerMode: 'realtime' as 'realtime' | 'manual',
    description: ''
  },
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
const batchSelectedUserIds = ref<number[]>([])

// 可用标签（排除用户已有的标签）
const availableTags = computed(() => {
  if (!currentUser.value) return tagList.value
  const userTagIds = currentUser.value.tags.map(t => t.id)
  return tagList.value.filter(t => !userTagIds.includes(t.id))
})

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
const handleExecuteAutoRule = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要立即执行标签 "${tag.name}" 的自动规则吗？`,
      '执行确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )

    // 执行规则引擎
    const loading = ElLoading.service({
      lock: true,
      text: '正在执行规则...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      // 模拟规则执行
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 导入规则引擎
      const { evaluateUsers, generateUserData, generateRuleDescription } = await import('@/utils/ruleEngine')

      // 生成所有用户的评估数据
      const usersData = allUserList.value.map(user => generateUserData(user.id))

      // 评估规则
      const matchedUserIds = evaluateUsers(
        {
          enabled: tag.autoRule?.enabled || false,
          conditions: tag.autoRule?.conditions || [],
          logic: (tag.autoRule as any)?.logic || 'AND',
          triggerMode: tag.autoRule?.triggerMode || 'manual',
          description: tag.autoRule?.description || ''
        },
        usersData
      )

      // 为匹配的用户添加标签
      matchedUserIds.forEach(userId => {
        const user = allUserList.value.find(u => u.id === userId)
        if (user && !user.tags.some(t => t.id === tag.id)) {
          user.tags.push(tag)
        }
      })

      loading.close()

      // 生成规则描述
      const ruleDesc = generateRuleDescription({
        enabled: tag.autoRule?.enabled || false,
        conditions: tag.autoRule?.conditions || [],
        logic: (tag.autoRule as any)?.logic || 'AND',
        triggerMode: tag.autoRule?.triggerMode || 'manual',
        description: tag.autoRule?.description || ''
      })

      // 记录执行日志
      const { mockAddRuleExecutionLog } = await import('@/mock/ruleExecutionLogs')
      await mockAddRuleExecutionLog({
        tagId: tag.id,
        tagName: tag.name,
        executionTime: new Date().toISOString(),
        triggerMode: 'manual',
        ruleConditions: ruleDesc,
        matchedUserCount: matchedUserIds.length,
        matchedUserIds: matchedUserIds,
        executedBy: '管理员-当前用户',
        status: 'success',
        duration: 1500
      })

      ElMessage.success({
        message: `规则执行成功！匹配 ${matchedUserIds.length} 个用户\n规则条件：${ruleDesc}`,
        duration: 5000,
        showClose: true
      })

      // 如果当前正在查看该标签，刷新用户列表
      if (currentTag.value?.id === tag.id) {
        loadTagUsers(tag.id)
      }
    } catch (error) {
      loading.close()
      console.error('规则执行失败:', error)
      ElMessage.error('规则执行失败，请检查规则配置')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('执行失败')
    }
  }
}

// 添加规则条件
const addCondition = () => {
  tagForm.autoRule.conditions.push({
    field: '',
    operator: '',
    value: 0
  })
}

// 移除规则条件
const removeCondition = (index: number) => {
  tagForm.autoRule.conditions.splice(index, 1)
}

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
  tagForm.expiresAt = tag.expiresAt || ''

  // 自动规则
  if (tag.autoRule) {
    tagForm.autoRule = {
      enabled: tag.autoRule.enabled,
      conditions: tag.autoRule.conditions || [],
      logic: (tag.autoRule as any).logic || 'AND',
      triggerMode: tag.autoRule.triggerMode,
      description: tag.autoRule.description
    }
  }

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
          name: tagForm.name,
          color: tagForm.color,
          description: tagForm.description,
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

  // 重置自动规则
  tagForm.autoRule = {
    enabled: false,
    conditions: [],
    logic: 'AND',
    triggerMode: 'realtime',
    description: ''
  }

  // 重置业务关联
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
</style>
