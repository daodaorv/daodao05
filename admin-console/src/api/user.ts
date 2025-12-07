import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetUserList,
  mockGetUserDetail,
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  mockChangeUserStatus,
} from '@/mock/users'

// 是否使用 Mock 数据（开发环境默认使用）
const USE_MOCK = import.meta.env.DEV

// 用户管理API接口类型定义
export interface UserListParams {
  page?: number
  pageSize?: number
  phone?: string
  username?: string
  userType?: string
  status?: string
}

// ==================== 标签系统类型定义 ====================

// 标签类型枚举
export enum TagType {
  SYSTEM = 'system',      // 系统标签（如PLUS会员、VIP用户）
  CUSTOM = 'custom'       // 自定义标签（运营手动创建）
}

// 标签分类枚举
export enum TagCategory {
  USER_ATTRIBUTE = 'user_attribute',    // 用户属性（新用户、企业用户）
  BEHAVIOR = 'behavior',                // 行为特征（活跃用户、沉睡用户）
  VALUE_LEVEL = 'value_level',          // 价值等级（VIP用户、优质客户）
  RISK_CONTROL = 'risk_control',        // 风险控制（高风险用户）
  MEMBERSHIP = 'membership',            // 会员类型（PLUS会员）
  HOSTING = 'hosting'                   // 托管类型（自有车托管、购车托管）
}

// 自动规则触发条件类型
export type AutoRuleConditionType =
  | 'register_days'      // 注册天数
  | 'order_count'        // 订单数量
  | 'total_amount'       // 消费金额
  | 'last_login_days'    // 最后登录天数
  | 'violation_count'    // 违规次数

// 自动规则运算符
export type AutoRuleOperator = 'gt' | 'lt' | 'eq' | 'gte' | 'lte'

// 自动规则触发条件
export interface AutoRuleCondition {
  type: AutoRuleConditionType
  operator: AutoRuleOperator
  value: number
}

// 标签触发类型枚举
export enum TagTriggerType {
  MANUAL = 'manual',           // 手动添加（管理员操作）
  RULE_BASED = 'rule_based',   // 规则触发（基于用户数据）
  API_DRIVEN = 'api_driven'    // API驱动（业务系统调用）
}

// 自动规则配置
export interface AutoRule {
  enabled: boolean                      // 是否启用
  conditions: AutoRuleCondition[]       // 触发条件（AND关系）
  logic?: 'AND' | 'OR'                  // 条件逻辑（默认AND）
  triggerMode: 'realtime' | 'manual'    // 触发模式：实时触发/手动触发
  description: string                   // 规则描述
}

// API触发配置
export interface ApiTrigger {
  apiEndpoint: string          // 触发API端点
  sourceSystem: string         // 来源系统：order_system, hosting_system
  description: string          // 触发说明
  autoRemove?: boolean         // 是否支持自动移除
  removeConditions?: string[]  // 移除条件说明
}

// 业务关联配置
export interface BusinessAssociation {
  coupons: number[]              // 关联的优惠券ID
  pricingStrategies: number[]    // 关联的价格策略ID
  activities: number[]           // 关联的营销活动ID
  profitConfigs: number[]        // 关联的分润配置ID
}

// 会员权益配置（仅PLUS会员等会员标签使用）
export interface MemberBenefits {
  pointsMultiplier: number      // 积分倍率（如2表示双倍积分）
  priceDiscount: number         // 价格折扣（如0.95表示95折）
  exclusiveCoupons: number[]    // 专属优惠券ID列表
  priorityService: boolean      // 优先服务
  freeInsurance: boolean        // 免费保险
}

// 扩展后的标签接口
export interface Tag {
  id: number
  name: string
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  description: string
  userCount: number

  // 基本字段
  type: TagType                           // 标签类型
  category: TagCategory                   // 标签分类
  priority: number                        // 优先级（1-10，数字越小优先级越高）
  status: 'active' | 'inactive'           // 标签状态

  // 触发方式配置
  triggerType: TagTriggerType             // 触发类型（新增）
  autoRule?: AutoRule                     // 规则触发配置
  apiTrigger?: ApiTrigger                 // API触发配置（新增）

  // 业务配置
  businessAssociation?: BusinessAssociation  // 业务关联
  expiresAt?: string                      // 到期时间（如PLUS会员到期）
  benefits?: MemberBenefits               // 会员权益（仅会员标签）

  createdAt: string
  updatedAt?: string
}

// 用户类型枚举（重构：移除plus_member，改为标签管理）
export type UserType = 'visitor' | 'registered' | 'customer'  // customer 保留用于向后兼容

export interface UserInfo {
  id: number
  username: string
  phone: string
  email?: string
  userType: UserType  // 只描述身份认证状态：游客/注册用户
  status: 'active' | 'inactive' | 'banned'
  realName?: string
  avatarUrl?: string
  tags?: Tag[]  // 用户标签（包含PLUS会员、VIP等标签）
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  list: UserInfo[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserParams {
  username: string
  phone: string
  password: string
  email?: string
  userType: UserType  // visitor 或 registered
  realName?: string
}

export interface UpdateUserParams {
  id: number
  username?: string
  email?: string
  userType?: UserType  // visitor 或 registered
  status?: 'active' | 'inactive' | 'banned'
  realName?: string
}

// 用户导入结果
export interface ImportUsersResult {
  success: number
  failed: number
  errors: Array<{ row: number; message: string }>
}

export const userApi = {
  // 获取用户列表
  getUserList: (params: UserListParams) => {
    if (USE_MOCK) {
      return mockGetUserList(params) as Promise<ApiResponse<UserListResponse>>
    }
    return request.get<ApiResponse<UserListResponse>>('/users', params)
  },

  // 获取用户详情
  getUserDetail: (id: number) => {
    if (USE_MOCK) {
      return mockGetUserDetail(id) as Promise<ApiResponse<UserInfo>>
    }
    return request.get<ApiResponse<UserInfo>>(`/users/${id}`)
  },

  // 创建用户
  createUser: (data: CreateUserParams) => {
    if (USE_MOCK) {
      return mockCreateUser(data) as Promise<ApiResponse<UserInfo>>
    }
    return request.post<ApiResponse<UserInfo>>('/users', data)
  },

  // 更新用户信息
  updateUser: (data: UpdateUserParams) => {
    if (USE_MOCK) {
      return mockUpdateUser(data) as Promise<ApiResponse<UserInfo>>
    }
    return request.put<ApiResponse<UserInfo>>(`/users/${data.id}`, data)
  },

  // 删除用户
  deleteUser: (id: number) => {
    if (USE_MOCK) {
      return mockDeleteUser(id) as Promise<ApiResponse>
    }
    return request.delete<ApiResponse>(`/users/${id}`)
  },

  // 更改用户状态
  changeUserStatus: (id: number, status: 'active' | 'inactive' | 'banned') => {
    if (USE_MOCK) {
      return mockChangeUserStatus(id, status) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/users/${id}/status`, { status })
  },

  // 重置用户密码
  resetPassword: (id: number, newPassword: string) =>
    request.put<ApiResponse>(`/users/${id}/reset-password`, { password: newPassword }),

  // 用户导入
  importUsers: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    // TODO: 实现真实的导入逻辑
    return Promise.resolve({
      success: 0,
      failed: 0,
      errors: []
    } as ImportUsersResult)
  },
}

// 标签管理 API
export const tagApi = {
  // 获取标签列表
  getTagList: () => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve([] as Tag[])
  },

  // 创建标签
  createTag: (data: Partial<Tag>) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve({} as Tag)
  },

  // 更新标签
  updateTag: (id: number, data: Partial<Tag>) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve({} as Tag)
  },

  // 删除标签
  deleteTag: (id: number) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve()
  },

  // 获取用户的标签
  getUserTags: (userId: number) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve([] as Tag[])
  },

  // 为用户添加标签
  addUserTags: (userId: number, tagIds: number[]) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve()
  },

  // 移除用户标签
  removeUserTag: (userId: number, tagId: number) => {
    // TODO: 实现真实的 API 调用
    return Promise.resolve()
  },
}
