import type { Tag } from '@/api/user'
import { TagType, TagCategory, TagTriggerType } from '@/api/user'

// 标签 Mock 数据（重构版：包含完整的业务字段）
export const mockTags: Tag[] = [
  // ==================== 系统标签：PLUS会员 ====================
  {
    id: 100,
    name: 'PLUS会员',
    color: 'warning',
    type: TagType.SYSTEM,
    category: TagCategory.MEMBERSHIP,  // 改为会员类型
    priority: 1,
    status: 'active',
    triggerType: TagTriggerType.API_DRIVEN,  // API驱动
    description: 'PLUS会员，享受专属权益：双倍积分、95折优惠、专属优惠券',
    userCount: 15,
    apiTrigger: {
      apiEndpoint: '/api/tags/add-to-user',
      sourceSystem: 'order_system',
      description: '用户购买PLUS会员商品（99元）或单次消费满1万元时自动添加',
      autoRemove: false
    },
    businessAssociation: {
      coupons: [1, 2],           // 关联新用户专享券、春节特惠券
      pricingStrategies: [],
      activities: [1],           // 关联春节房车自驾游活动
      profitConfigs: []
    },
    benefits: {
      pointsMultiplier: 2.0,     // 双倍积分
      priceDiscount: 0.95,       // 95折优惠
      exclusiveCoupons: [1, 2],  // 专属优惠券
      priorityService: true,     // 优先服务
      freeInsurance: true        // 免费保险
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // ==================== 价值等级类标签 ====================
  {
    id: 1,
    name: 'VIP用户',
    color: 'warning',
    type: TagType.CUSTOM,
    category: TagCategory.VALUE_LEVEL,
    priority: 2,
    status: 'active',
    triggerType: TagTriggerType.RULE_BASED,  // 规则触发
    description: '高价值用户，消费金额超过10000元',
    userCount: 15,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'total_amount', operator: 'gte', value: 10000 }
      ],
      logic: 'AND',
      triggerMode: 'realtime',
      description: '消费金额达到10000元自动获得VIP标签'
    },
    businessAssociation: {
      coupons: [3],              // 关联VIP专属优惠券
      pricingStrategies: [1],    // 关联VIP价格策略
      activities: [1],
      profitConfigs: []
    },
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 7,
    name: '优质客户',
    color: 'success',
    type: TagType.CUSTOM,
    category: TagCategory.VALUE_LEVEL,
    priority: 3,
    status: 'active',
    description: '信用良好，无违约记录',
    userCount: 32,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'violation_count', operator: 'eq', value: 0 },
        { type: 'order_count', operator: 'gte', value: 3 }
      ],
      triggerMode: 'realtime',
      description: '无违规记录且订单数≥3的用户自动获得'
    },
    businessAssociation: {
      coupons: [],
      pricingStrategies: [],
      activities: [],
      profitConfigs: []
    },
    createdAt: '2024-04-15T08:00:00.000Z',
    updatedAt: '2024-04-15T08:00:00.000Z'
  },

  // ==================== 行为特征类标签 ====================
  {
    id: 2,
    name: '活跃用户',
    color: 'success',
    type: TagType.CUSTOM,
    category: TagCategory.BEHAVIOR,
    priority: 4,
    status: 'active',
    description: '近30天有订单记录',
    userCount: 48,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'last_login_days', operator: 'lte', value: 30 },
        { type: 'order_count', operator: 'gte', value: 1 }
      ],
      triggerMode: 'realtime',
      description: '30天内登录且有订单的用户自动获得'
    },
    businessAssociation: {
      coupons: [],
      pricingStrategies: [],
      activities: [2],           // 关联新用户注册送券活动
      profitConfigs: []
    },
    createdAt: '2024-02-10T08:00:00.000Z',
    updatedAt: '2024-02-10T08:00:00.000Z'
  },
  {
    id: 4,
    name: '沉睡用户',
    color: 'info',
    type: TagType.CUSTOM,
    category: TagCategory.BEHAVIOR,
    priority: 7,
    status: 'active',
    description: '超过90天未登录',
    userCount: 12,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'last_login_days', operator: 'gt', value: 90 }
      ],
      triggerMode: 'realtime',
      description: '超过90天未登录的用户自动获得'
    },
    businessAssociation: {
      coupons: [4],              // 关联唤醒优惠券
      pricingStrategies: [],
      activities: [],
      profitConfigs: []
    },
    createdAt: '2024-03-10T08:00:00.000Z',
    updatedAt: '2024-03-10T08:00:00.000Z'
  },

  // ==================== 用户属性类标签 ====================
  {
    id: 3,
    name: '新用户',
    color: 'primary',
    type: TagType.CUSTOM,
    category: TagCategory.USER_ATTRIBUTE,
    priority: 5,
    status: 'active',
    description: '注册时间少于30天',
    userCount: 23,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'register_days', operator: 'lt', value: 30 }
      ],
      triggerMode: 'realtime',
      description: '注册30天内的用户自动获得'
    },
    businessAssociation: {
      coupons: [1],              // 关联新用户专享券
      pricingStrategies: [],
      activities: [2],           // 关联新用户注册送券活动
      profitConfigs: []
    },
    createdAt: '2024-03-05T08:00:00.000Z',
    updatedAt: '2024-03-05T08:00:00.000Z'
  },
  {
    id: 6,
    name: '企业用户',
    color: 'primary',
    type: TagType.CUSTOM,
    category: TagCategory.USER_ATTRIBUTE,
    priority: 6,
    status: 'active',
    description: '企业客户',
    userCount: 8,
    autoRule: {
      enabled: false,  // 企业用户需要人工审核，不自动打标签
      conditions: [],
      triggerMode: 'manual',
      description: '企业认证通过后手动添加'
    },
    businessAssociation: {
      coupons: [],
      pricingStrategies: [2],    // 关联企业客户价格策略
      activities: [],
      profitConfigs: []
    },
    createdAt: '2024-04-01T08:00:00.000Z',
    updatedAt: '2024-04-01T08:00:00.000Z'
  },

  // ==================== 风险控制类标签 ====================
  {
    id: 5,
    name: '高风险用户',
    color: 'danger',
    type: TagType.CUSTOM,
    category: TagCategory.RISK_CONTROL,
    priority: 8,
    status: 'active',
    description: '存在违规行为或风险记录',
    userCount: 5,
    autoRule: {
      enabled: true,
      conditions: [
        { type: 'violation_count', operator: 'gte', value: 3 }
      ],
      triggerMode: 'realtime',
      description: '违规次数≥3次的用户自动获得'
    },
    businessAssociation: {
      coupons: [],
      pricingStrategies: [],
      activities: [],
      profitConfigs: []
    },
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  }
]

// Mock API 实现
export function mockGetTagList(): Promise<Tag[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTags])
    }, 300)
  })
}

export function mockCreateTag(data: Partial<Tag>): Promise<Tag> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTag: Tag = {
        id: mockTags.length + 1,
        name: data.name!,
        color: data.color!,
        type: data.type || TagType.CUSTOM,
        category: data.category || TagCategory.USER_ATTRIBUTE,
        priority: data.priority || 99,
        status: data.status || 'active',
        description: data.description || '',
        userCount: 0,
        autoRule: data.autoRule,
        businessAssociation: data.businessAssociation,
        expiresAt: data.expiresAt,
        benefits: data.benefits,
        createdAt: new Date().toISOString()
      }
      mockTags.push(newTag)
      resolve(newTag)
    }, 300)
  })
}

export function mockUpdateTag(id: number, data: Partial<Tag>): Promise<Tag> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTags.findIndex(tag => tag.id === id)
      if (index === -1) {
        reject(new Error('标签不存在'))
        return
      }

      mockTags[index] = {
        ...mockTags[index],
        ...data
      }
      resolve(mockTags[index])
    }, 300)
  })
}

export function mockDeleteTag(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTags.findIndex(tag => tag.id === id)
      if (index === -1) {
        reject(new Error('标签不存在'))
        return
      }

      mockTags.splice(index, 1)
      resolve()
    }, 300)
  })
}

export function mockGetUserTags(_userId: number): Promise<Tag[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 这里简化处理，实际应该从用户数据中获取
      resolve([])
    }, 300)
  })
}

export function mockAddUserTags(userId: number, tagIds: number[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 这里简化处理，实际应该更新用户数据
      console.log(`为用户 ${userId} 添加标签:`, tagIds)
      resolve()
    }, 300)
  })
}

export function mockRemoveUserTag(userId: number, tagId: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 这里简化处理，实际应该更新用户数据
      console.log(`为用户 ${userId} 移除标签:`, tagId)
      resolve()
    }, 300)
  })
}
