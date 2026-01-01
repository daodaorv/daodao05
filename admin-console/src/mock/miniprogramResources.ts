/**
 * 小程序资源管理 Mock 数据
 */
import type {
  Banner,
  PromoCard,
  Notice,
  Agreement,
  AgreementType,
  MembershipConfig,
  ServiceMenuItem,
  AppConfig,
} from '@/types/miniprogramResources'

// ==================== 轮播图 Mock 数据 ====================

const mockBanners: Banner[] = [
  {
    id: 1,
    type: 'home',
    image: 'https://picsum.photos/750/320?random=1',
    link: '/pages/special-offer/list',
    sortOrder: 100,
    isEnabled: true,
    startTime: '2025-01-01 00:00:00',
    endTime: '2025-12-31 23:59:59',
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-01 10:00:00',
  },
  {
    id: 2,
    type: 'home',
    image: 'https://picsum.photos/750/320?random=2',
    link: '/pages/vehicle/list',
    sortOrder: 90,
    isEnabled: true,
    createdAt: '2025-01-02 10:00:00',
    updatedAt: '2025-01-02 10:00:00',
  },
  {
    id: 3,
    type: 'home',
    image: 'https://picsum.photos/750/320?random=3',
    sortOrder: 80,
    isEnabled: false,
    createdAt: '2025-01-03 10:00:00',
    updatedAt: '2025-01-03 10:00:00',
  },
  {
    id: 4,
    type: 'hosting',
    image: 'https://picsum.photos/750/300?random=4',
    link: '/pages/hosting/old-car/index',
    sortOrder: 100,
    isEnabled: true,
    createdAt: '2025-01-04 10:00:00',
    updatedAt: '2025-01-04 10:00:00',
  },
]

export const mockGetBanners = async (type: 'home' | 'hosting') => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockBanners.filter(b => b.type === type),
    message: '获取成功',
  }
}

export const mockCreateBanner = async (data: Partial<Banner>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newBanner: Banner = {
    id: Date.now(),
    type: data.type || 'home',
    image: data.image || '',
    link: data.link,
    sortOrder: data.sortOrder || 0,
    isEnabled: data.isEnabled ?? true,
    startTime: data.startTime,
    endTime: data.endTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockBanners.push(newBanner)
  return {
    code: 200,
    data: newBanner,
    message: '创建成功',
  }
}

export const mockUpdateBanner = async (id: number, data: Partial<Banner>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockBanners.findIndex(b => b.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '轮播图不存在',
    }
  }
  mockBanners[index] = {
    ...mockBanners[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return {
    code: 200,
    data: mockBanners[index],
    message: '更新成功',
  }
}

export const mockDeleteBanner = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockBanners.findIndex(b => b.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '轮播图不存在',
    }
  }
  mockBanners.splice(index, 1)
  return {
    code: 200,
    data: null,
    message: '删除成功',
  }
}

// ==================== 推广卡片 Mock 数据 ====================

const mockPromoCards: PromoCard[] = [
  {
    id: 1,
    title: '特惠租车',
    subtitle: '限时优惠，低至5折',
    image: 'https://picsum.photos/690/200?random=11',
    route: '/pages/special-offer/list',
    sortOrder: 100,
    isEnabled: true,
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-01 10:00:00',
  },
  {
    id: 2,
    title: '会员专享',
    subtitle: '开通会员享95折',
    image: 'https://picsum.photos/690/200?random=12',
    route: '/pages/membership/index',
    sortOrder: 90,
    isEnabled: true,
    createdAt: '2025-01-02 10:00:00',
    updatedAt: '2025-01-02 10:00:00',
  },
]

export const mockGetPromoCards = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockPromoCards,
    message: '获取成功',
  }
}

export const mockCreatePromoCard = async (data: Partial<PromoCard>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newCard: PromoCard = {
    id: Date.now(),
    title: data.title || '',
    subtitle: data.subtitle || '',
    image: data.image || '',
    route: data.route || '',
    sortOrder: data.sortOrder || 0,
    isEnabled: data.isEnabled ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockPromoCards.push(newCard)
  return {
    code: 200,
    data: newCard,
    message: '创建成功',
  }
}

export const mockUpdatePromoCard = async (id: number, data: Partial<PromoCard>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockPromoCards.findIndex(c => c.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '推广卡片不存在',
    }
  }
  mockPromoCards[index] = {
    ...mockPromoCards[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return {
    code: 200,
    data: mockPromoCards[index],
    message: '更新成功',
  }
}

export const mockDeletePromoCard = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockPromoCards.findIndex(c => c.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '推广卡片不存在',
    }
  }
  mockPromoCards.splice(index, 1)
  return {
    code: 200,
    data: null,
    message: '删除成功',
  }
}

// ==================== 公告 Mock 数据 ====================

const mockNotices: Notice[] = [
  {
    id: 1,
    content: '春节期间部分门店营业时间调整，请提前咨询客服',
    type: 'warning',
    link: '/pages/help/article?id=1',
    sortOrder: 100,
    isEnabled: true,
    startTime: '2025-01-20 00:00:00',
    endTime: '2025-02-10 23:59:59',
    createdAt: '2025-01-15 10:00:00',
    updatedAt: '2025-01-15 10:00:00',
  },
  {
    id: 2,
    content: '新用户注册即送200元优惠券，限时领取',
    type: 'promotion',
    link: '/pages/coupon-mall/index',
    sortOrder: 90,
    isEnabled: true,
    createdAt: '2025-01-10 10:00:00',
    updatedAt: '2025-01-10 10:00:00',
  },
  {
    id: 3,
    content: '平台系统升级维护通知：1月30日凌晨2:00-4:00',
    type: 'info',
    sortOrder: 80,
    isEnabled: false,
    createdAt: '2025-01-05 10:00:00',
    updatedAt: '2025-01-05 10:00:00',
  },
]

export const mockGetNotices = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockNotices,
    message: '获取成功',
  }
}

export const mockCreateNotice = async (data: Partial<Notice>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newNotice: Notice = {
    id: Date.now(),
    content: data.content || '',
    type: data.type || 'info',
    link: data.link,
    sortOrder: data.sortOrder || 0,
    isEnabled: data.isEnabled ?? true,
    startTime: data.startTime,
    endTime: data.endTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockNotices.push(newNotice)
  return {
    code: 200,
    data: newNotice,
    message: '创建成功',
  }
}

export const mockUpdateNotice = async (id: number, data: Partial<Notice>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockNotices.findIndex(n => n.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '公告不存在',
    }
  }
  mockNotices[index] = {
    ...mockNotices[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return {
    code: 200,
    data: mockNotices[index],
    message: '更新成功',
  }
}

export const mockDeleteNotice = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const index = mockNotices.findIndex(n => n.id === id)
  if (index === -1) {
    return {
      code: 404,
      data: null,
      message: '公告不存在',
    }
  }
  mockNotices.splice(index, 1)
  return {
    code: 200,
    data: null,
    message: '删除成功',
  }
}

// ==================== 协议 Mock 数据 ====================

const mockAgreements: Record<AgreementType, Agreement> = {
  user_agreement: {
    id: 1,
    type: 'user_agreement',
    title: '叨叨房车用户服务协议',
    content:
      '<h2>一、服务条款的确认和接纳</h2><p>本协议是您与叨叨房车之间关于使用叨叨房车服务所订立的协议...</p>',
    version: 'v1.0.0',
    effectiveDate: '2025-01-01',
    requireRead: true,
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-01 10:00:00',
  },
  privacy_policy: {
    id: 2,
    type: 'privacy_policy',
    title: '叨叨房车隐私政策',
    content:
      '<h2>一、我们如何收集和使用您的个人信息</h2><p>我们会遵循正当、合法、必要的原则...</p>',
    version: 'v1.0.0',
    effectiveDate: '2025-01-01',
    requireRead: true,
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-01 10:00:00',
  },
  cancellation_policy: {
    id: 3,
    type: 'cancellation_policy',
    title: '叨叨房车取消政策',
    content: '<h2>一、取消规则</h2><p>为保障您的权益，我们制定了以下取消规则...</p>',
    version: 'v1.0.0',
    effectiveDate: '2025-01-01',
    requireRead: false,
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-01 10:00:00',
  },
}

export const mockGetAgreement = async (type: AgreementType) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockAgreements[type],
    message: '获取成功',
  }
}

export const mockUpdateAgreement = async (type: AgreementType, data: Partial<Agreement>) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  mockAgreements[type] = {
    ...mockAgreements[type],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return {
    code: 200,
    data: mockAgreements[type],
    message: '更新成功',
  }
}

// ==================== 会员配置 Mock 数据 ====================

let mockMembershipConfig: MembershipConfig = {
  price: 299,
  duration: 365,
  discount: 0.95,
  benefits: [
    {
      name: '租车优惠',
      description: '所有车型享95折优惠',
      icon: 'discount',
    },
    {
      name: '优先取车',
      description: '节假日优先安排取车',
      icon: 'medal',
    },
    {
      name: '免费升级',
      description: '免费升级同级别车型',
      icon: 'gift',
    },
    {
      name: '专属客服',
      description: '7x24小时专属客服',
      icon: 'service',
    },
  ],
}

export const mockGetMembershipConfig = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockMembershipConfig,
    message: '获取成功',
  }
}

export const mockUpdateMembershipConfig = async (data: MembershipConfig) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  mockMembershipConfig = data
  return {
    code: 200,
    data: mockMembershipConfig,
    message: '更新成功',
  }
}

// ==================== 服务菜单配置 Mock 数据 ====================

let mockServiceMenu: ServiceMenuItem[] = [
  {
    id: '1',
    name: '租车',
    icon: 'car',
    path: '/pages/vehicle/list',
    sortOrder: 100,
    isEnabled: true,
  },
  {
    id: '2',
    name: '特惠',
    icon: 'discount',
    path: '/pages/special-offer/list',
    sortOrder: 90,
    isEnabled: true,
  },
  {
    id: '3',
    name: '营地',
    icon: 'location',
    path: '/pages/campsite/list',
    sortOrder: 80,
    isEnabled: true,
  },
  {
    id: '4',
    name: '旅游',
    icon: 'map',
    path: '/pages/tour/list',
    sortOrder: 70,
    isEnabled: true,
  },
]

export const mockGetServiceMenu = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockServiceMenu,
    message: '获取成功',
  }
}

export const mockUpdateServiceMenu = async (data: ServiceMenuItem[]) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  mockServiceMenu = data
  return {
    code: 200,
    data: mockServiceMenu,
    message: '更新成功',
  }
}

// ==================== 应用配置 Mock 数据 ====================

let mockAppConfig: AppConfig = {
  servicePhone: '400-888-8888',
  serviceWechat: 'daodao_service',
  companyAddress: '北京市朝阳区某某大厦10层',
  businessHours: '周一至周日 9:00-21:00',
  aboutUs: '<h2>关于叨叨房车</h2><p>叨叨房车是国内领先的房车租赁平台...</p>',
  version: 'v1.0.0',
}

export const mockGetAppConfig = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    code: 200,
    data: mockAppConfig,
    message: '获取成功',
  }
}

export const mockUpdateAppConfig = async (data: AppConfig) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  mockAppConfig = data
  return {
    code: 200,
    data: mockAppConfig,
    message: '更新成功',
  }
}
