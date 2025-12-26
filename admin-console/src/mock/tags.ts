// @ts-nocheck
import type { Tag } from '@/api/user'
import { TagType, TagCategory, TagTriggerType, BenefitType } from '@/types/tag'

// 标签 Mock 数据（重构版：包含完整的业务字段）
export const mockTags: Tag[] = [
  // ==================== 系统标签：PLUS会员 ====================
  {
    id: 100,
    name: 'PLUS会员',
    color: 'warning',
    type: TagType.SYSTEM,
    category: TagCategory.MEMBERSHIP,
    priority: 1,
    status: 'active',
    description: 'PLUS会员，享受专属权益：双倍积分、95折优惠、专属优惠券',
    userCount: 15,

    // 多触发器配置（新增）
    triggers: [
      {
        id: 'trigger_1',
        type: TagTriggerType.API_DRIVEN,
        enabled: true,
        priority: 1,
        name: 'PLUS会员购买',
        description: '用户购买PLUS会员商品（99元）',
        sourceId: 'order_plus_member_purchase',
        autoRemove: false
      },
      {
        id: 'trigger_2',
        type: TagTriggerType.RULE_BASED,
        enabled: true,
        priority: 2,
        name: '高额消费自动升级',
        description: '单次消费满1万元自动升级',
        conditions: [
          { type: 'total_amount', operator: 'gte', value: 10000 }
        ],
        logic: 'AND',
        triggerMode: 'realtime'
      }
    ],

    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // ==================== 系统标签：托管车主 ====================
  {
    id: 200,
    name: '自有车托管车主',
    color: 'success',
    type: TagType.SYSTEM,
    category: TagCategory.HOSTING,
    priority: 2,
    status: 'active',
    description: '自有车托管车主，享受70%分润比例',
    userCount: 8,

    triggers: [
      {
        id: 'trigger_1',
        type: TagTriggerType.API_DRIVEN,
        enabled: true,
        priority: 1,
        name: '托管审核通过',
        description: '自有车托管审核通过且车辆上线',
        sourceId: 'hosting_owner_approved',
        autoRemove: true,
        removeSourceId: 'hosting_cancelled'
      }
    ],


    benefitsConfig: {
      benefits: [
        {
          id: 'benefit_1',
          type: BenefitType.PROFIT_SHARING,
          name: '分润比例',
          description: '订单分润70%',
          icon: 'money',
          value: 0.7,
          priority: 1,
          applicableScenes: ['order_settlement'],
          status: 'active'
        }
      ]
    },

    businessAssociation: {
      coupons: [],
      pricingStrategies: [],
      activities: [],
      profitConfigs: [1]
    },

    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  {
    id: 201,
    name: '购车托管车主',
    color: 'success',
    type: TagType.SYSTEM,
    category: TagCategory.HOSTING,
    priority: 2,
    status: 'active',
    description: '购车托管车主，享受60%分润比例',
    userCount: 5,

    triggers: [
      {
        id: 'trigger_1',
        type: TagTriggerType.API_DRIVEN,
        enabled: true,
        priority: 1,
        name: '托管审核通过',
        description: '购车托管审核通过且车辆上线',
        sourceId: 'hosting_owner_approved',
        autoRemove: true,
        removeSourceId: 'hosting_cancelled'
      }
    ],


    benefitsConfig: {
      benefits: [
        {
          id: 'benefit_1',
          type: BenefitType.PROFIT_SHARING,
          name: '分润比例',
          description: '订单分润60%',
          icon: 'money',
          value: 0.6,
          priority: 1,
          applicableScenes: ['order_settlement'],
          status: 'active'
        }
      ]
    },

    businessAssociation: {
      coupons: [],
      pricingStrategies: [],
      activities: [],
      profitConfigs: [2]
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
    description: '高价值用户，消费金额超过10000元',
    userCount: 15,
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
        businessAssociation: data.businessAssociation,
        expiresAt: data.expiresAt,
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
