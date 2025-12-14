/**
 * 标签系统类型定义
 * 从 @/api/user.ts 中提取，避免循环依赖
 */

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
  triggerType: TagTriggerType             // 触发类型
  autoRule?: AutoRule                     // 规则触发配置
  apiTrigger?: ApiTrigger                 // API触发配置

  // 业务配置
  businessAssociation?: BusinessAssociation  // 业务关联
  expiresAt?: string                      // 到期时间（如PLUS会员到期）
  benefits?: MemberBenefits               // 会员权益（仅会员标签）

  createdAt: string
  updatedAt?: string
}
