/**
 * 标签系统类型定义
 * 从 @/api/user.ts 中提取，避免循环依赖
 */

// 标签类型枚举
export enum TagType {
  SYSTEM = 'system',
  CUSTOM = 'custom'
}

// 标签分类枚举
export enum TagCategory {
  USER_ATTRIBUTE = 'user_attribute',
  BEHAVIOR = 'behavior',
  VALUE_LEVEL = 'value_level',
  RISK_CONTROL = 'risk_control',
  MEMBERSHIP = 'membership',
  HOSTING = 'hosting'
}

// 自动规则触发条件类型
export type AutoRuleConditionType =
  | 'register_days'
  | 'order_count'
  | 'total_amount'
  | 'last_login_days'
  | 'violation_count'

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
  MANUAL = 'manual',
  RULE_BASED = 'rule_based',
  API_DRIVEN = 'api_driven'
}

// 自动规则配置
export interface AutoRule {
  enabled: boolean
  conditions: AutoRuleCondition[]
  logic?: 'AND' | 'OR'
  triggerMode: 'realtime' | 'manual'
  description: string
}

// API触发配置
export interface ApiTrigger {
  apiEndpoint: string
  sourceSystem: string
  description: string
  autoRemove?: boolean
  removeConditions?: string[]
}

// ==================== 多触发器架构 ====================

// 触发器基础接口
export interface TagTrigger {
  id: string
  type: TagTriggerType
  enabled: boolean
  priority: number
  name: string
  description: string
}

// 手动触发器
export interface ManualTrigger extends TagTrigger {
  type: TagTriggerType.MANUAL
}

// 规则触发器
export interface RuleTrigger extends TagTrigger {
  type: TagTriggerType.RULE_BASED
  conditions: AutoRuleCondition[]
  logic: 'AND' | 'OR'
  triggerMode: 'realtime' | 'manual'
}

// API触发器配置
export interface ApiTriggerConfig extends TagTrigger {
  type: TagTriggerType.API_DRIVEN
  sourceId: string
  autoRemove: boolean
  removeSourceId?: string
}

// API触发源定义
export interface ApiTriggerSource {
  id: string
  name: string
  description: string
  sourceSystem: string
  apiEndpoint: string
  httpMethod: 'POST' | 'PUT'
  requestSchema: Record<string, any>
  enabled: boolean
  createdAt: string
}

// 预定义的API触发源列表
export const API_TRIGGER_SOURCES: ApiTriggerSource[] = [
  {
    id: 'order_plus_member_purchase',
    name: 'PLUS会员购买',
    description: '用户购买PLUS会员商品（99元）时触发',
    sourceSystem: 'order_system',
    apiEndpoint: '/api/tags/add-to-user',
    httpMethod: 'POST',
    requestSchema: { userId: 'number', tagId: 'number', expiresAt: 'string' },
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'order_high_value_purchase',
    name: '高额消费触发',
    description: '单次消费满1万元时触发',
    sourceSystem: 'order_system',
    apiEndpoint: '/api/tags/add-to-user',
    httpMethod: 'POST',
    requestSchema: { userId: 'number', tagId: 'number', expiresAt: 'string', orderId: 'number' },
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'hosting_owner_approved',
    name: '托管审核通过',
    description: '托管审核通过且车辆上线时触发',
    sourceSystem: 'hosting_system',
    apiEndpoint: '/api/tags/add-to-user',
    httpMethod: 'POST',
    requestSchema: { userId: 'number', tagId: 'number', vehicleId: 'number' },
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'hosting_cancelled',
    name: '托管取消',
    description: '托管取消或车辆下线时触发移除',
    sourceSystem: 'hosting_system',
    apiEndpoint: '/api/tags/remove-from-user',
    httpMethod: 'POST',
    requestSchema: { userId: 'number', tagId: 'number', reason: 'string' },
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// ==================== 通用权益系统 ====================

// 权益类型枚举
export enum BenefitType {
  DISCOUNT = 'discount',
  POINTS_MULTIPLIER = 'points_multiplier',
  COUPON = 'coupon',
  SERVICE = 'service',
  INSURANCE = 'insurance',
  PRIORITY = 'priority',
  PROFIT_SHARING = 'profit_sharing',
  CUSTOM = 'custom'
}

// 通用权益配置
export interface TagBenefit {
  id: string
  type: BenefitType
  name: string
  description: string
  icon: string
  value: string | number
  priority: number
  applicableScenes: string[]
  status: 'active' | 'inactive'
  expiresAt?: string
}

// 标签权益配置
export interface TagBenefitsConfig {
  benefits: TagBenefit[]
}

// 业务关联配置
export interface BusinessAssociation {
  coupons: number[]
  pricingStrategies: number[]
  activities: number[]
  profitConfigs: number[]
}

// 会员权益配置
export interface MemberBenefits {
  pointsMultiplier: number
  priceDiscount: number
  exclusiveCoupons: number[]
  priorityService: boolean
  freeInsurance: boolean
}

// 扩展后的标签接口
export interface Tag {
  id: number
  name: string
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  description: string
  userCount: number

  type: TagType
  category: TagCategory
  priority: number
  status: 'active' | 'inactive'

  // 多触发器配置（新增）
  triggers?: (ManualTrigger | RuleTrigger | ApiTriggerConfig)[]


  businessAssociation?: BusinessAssociation
  expiresAt?: string

  // 通用权益配置（新增）
  benefitsConfig?: TagBenefitsConfig


  createdAt: string
  updatedAt?: string
}
