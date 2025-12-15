/**
 * 自动化规则执行引擎
 * 用于评估规则条件并自动为用户添加标签
 */

// 规则条件接口
export interface RuleCondition {
  field: 'register_days' | 'order_count' | 'total_amount' | 'last_login_days' | 'violation_count'
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  value: number
}

// 规则接口
export interface Rule {
  enabled: boolean
  conditions: RuleCondition[]
  logic: 'AND' | 'OR'
  triggerMode: 'realtime' | 'manual'
  description: string
}

// 用户数据接口(用于规则评估)
export interface UserData {
  id: number
  username: string
  register_days: number      // 注册天数
  order_count: number         // 订单数量
  total_amount: number        // 消费总额
  last_login_days: number     // 最后登录天数
  violation_count: number     // 违规次数
}

/**
 * 评估单个条件
 */
function evaluateCondition(condition: RuleCondition, userData: UserData): boolean {
  const fieldValue = userData[condition.field]
  const targetValue = condition.value

  switch (condition.operator) {
    case 'gt':
      return fieldValue > targetValue
    case 'lt':
      return fieldValue < targetValue
    case 'eq':
      return fieldValue === targetValue
    case 'gte':
      return fieldValue >= targetValue
    case 'lte':
      return fieldValue <= targetValue
    default:
      return false
  }
}

/**
 * 评估规则是否匹配用户
 */
export function evaluateRule(rule: Rule, userData: UserData): boolean {
  // 规则未启用
  if (!rule.enabled) {
    return false
  }

  // 没有条件
  if (rule.conditions.length === 0) {
    return false
  }

  // 评估所有条件
  const results = rule.conditions.map(condition => evaluateCondition(condition, userData))

  // 根据逻辑运算符返回结果
  if (rule.logic === 'AND') {
    return results.every(result => result === true)
  } else {
    return results.some(result => result === true)
  }
}

/**
 * 批量评估用户列表
 * 返回匹配规则的用户ID列表
 */
export function evaluateUsers(rule: Rule, users: UserData[]): number[] {
  return users
    .filter(user => evaluateRule(rule, user))
    .map(user => user.id)
}

/**
 * 生成规则描述文本
 */
export function generateRuleDescription(rule: Rule): string {
  if (rule.conditions.length === 0) {
    return '无条件'
  }

  const fieldNames: Record<string, string> = {
    register_days: '注册天数',
    order_count: '订单数量',
    total_amount: '消费总额',
    last_login_days: '最后登录天数',
    violation_count: '违规次数'
  }

  const operatorNames: Record<string, string> = {
    gt: '大于',
    lt: '小于',
    eq: '等于',
    gte: '大于等于',
    lte: '小于等于'
  }

  const conditionTexts = rule.conditions.map(condition => {
    const fieldName = fieldNames[condition.field] || condition.field
    const operatorName = operatorNames[condition.operator] || condition.operator
    return `${fieldName}${operatorName}${condition.value}`
  })

  const logic = rule.logic === 'AND' ? '且' : '或'
  return conditionTexts.join(` ${logic} `)
}

/**
 * Mock: 生成用户的规则评估数据
 * 实际项目中应该从后端API获取
 */
export function generateUserData(userId: number): UserData {
  // 这里使用简单的随机数生成Mock数据
  // 实际项目中应该从数据库查询真实数据
  const now = new Date()
  const registerDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28))
  const lastLoginDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)

  const registerDays = Math.floor((now.getTime() - registerDate.getTime()) / (24 * 60 * 60 * 1000))
  const lastLoginDays = Math.floor((now.getTime() - lastLoginDate.getTime()) / (24 * 60 * 60 * 1000))

  return {
    id: userId,
    username: `用户${userId}`,
    register_days: registerDays,
    order_count: Math.floor(Math.random() * 50),
    total_amount: Math.floor(Math.random() * 50000),
    last_login_days: lastLoginDays,
    violation_count: Math.floor(Math.random() * 5)
  }
}
