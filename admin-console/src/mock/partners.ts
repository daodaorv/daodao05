/**
 * 合作商管理 Mock 数据
 */

// 合作商基础信息
export interface Partner {
  id: number
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  cooperationStatus: 'active' | 'inactive'
  creditRating: 'A' | 'B' | 'C' | 'D'
  contractUrl: string
  profitSharingRatio: number // 门店分润比例（默认30%）
  storeCount: number
  vehicleCount: number
  totalOrders: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

// 合作商列表查询参数
export interface PartnerListParams {
  page: number
  pageSize: number
  keyword?: string
  cooperationStatus?: string
  creditRating?: string
}

// 创建合作商参数
export interface CreatePartnerParams {
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  cooperationStatus: 'active' | 'inactive'
  creditRating: 'A' | 'B' | 'C' | 'D'
  contractUrl?: string
  profitSharingRatio?: number
}

// 更新合作商参数
export interface UpdatePartnerParams extends Partial<CreatePartnerParams> {}

// 合作商统计
export interface PartnerStats {
  totalPartners: number
  activePartners: number
  totalStores: number
  totalVehicles: number
  totalOrders: number
  totalRevenue: number
  monthlyRevenue: number
  averagePriceDifference: number
}

// 合作商门店
export interface PartnerStore {
  id: number
  partnerId: number
  partnerName: string
  storeName: string
  storeCode: string
  cityName: string
  address: string
  vehicleCount: number
  status: 'active' | 'inactive'
}

// 合作商订单
export interface PartnerOrder {
  id: number
  orderId: number
  orderNo: string
  partnerId: number
  partnerName: string
  partnerOrderNo: string
  daodaoOrderPrice: number
  partnerOrderPrice: number
  priceDifference: number
  profitSharingRatio: number
  storeProfitAmount: number
  platformProfitAmount: number
  storeId: number
  storeName: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 创建合作商订单参数
export interface CreatePartnerOrderParams {
  orderId: number
  partnerId: number
  partnerOrderNo: string
  partnerOrderPrice: number
}

// 更新合作商订单参数
export interface UpdatePartnerOrderParams {
  partnerOrderNo?: string
  partnerOrderPrice?: number
}

// 合作商结算
export interface PartnerSettlement {
  partnerId: number
  partnerName: string
  settlementPeriod: string
  totalOrders: number
  totalPriceDifference: number
  totalStoreProfit: number
  totalPlatformProfit: number
  settlementStatus: 'pending' | 'completed'
  settlementDate: string | null
}

// 合作商结算查询参数
export interface PartnerSettlementParams {
  partnerId?: number
  startDate?: string
  endDate?: string
}

// Mock 数据
const mockPartners: Partner[] = [
  {
    id: 1,
    name: '房车生活家',
    contactPerson: '张经理',
    phone: '13800138001',
    email: 'zhang@rvlife.com',
    address: '北京市朝阳区建国路88号',
    cooperationStatus: 'active',
    creditRating: 'A',
    contractUrl: 'https://example.com/contracts/partner-1.pdf',
    profitSharingRatio: 30,
    storeCount: 15,
    vehicleCount: 120,
    totalOrders: 856,
    totalRevenue: 2580000,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z'
  },
  {
    id: 2,
    name: '途居露营',
    contactPerson: '李经理',
    phone: '13800138002',
    email: 'li@tuju.com',
    address: '上海市浦东新区世纪大道1000号',
    cooperationStatus: 'active',
    creditRating: 'A',
    contractUrl: 'https://example.com/contracts/partner-2.pdf',
    profitSharingRatio: 30,
    storeCount: 12,
    vehicleCount: 95,
    totalOrders: 678,
    totalRevenue: 2034000,
    createdAt: '2024-02-10T08:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z'
  },
  {
    id: 3,
    name: '星空房车',
    contactPerson: '王经理',
    phone: '13800138003',
    email: 'wang@starsky.com',
    address: '广州市天河区珠江新城花城大道123号',
    cooperationStatus: 'active',
    creditRating: 'B',
    contractUrl: 'https://example.com/contracts/partner-3.pdf',
    profitSharingRatio: 30,
    storeCount: 8,
    vehicleCount: 65,
    totalOrders: 432,
    totalRevenue: 1296000,
    createdAt: '2024-03-05T08:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z'
  },
  {
    id: 4,
    name: '自由行房车',
    contactPerson: '赵经理',
    phone: '13800138004',
    email: 'zhao@freego.com',
    address: '成都市武侯区天府大道中段666号',
    cooperationStatus: 'active',
    creditRating: 'B',
    contractUrl: 'https://example.com/contracts/partner-4.pdf',
    profitSharingRatio: 30,
    storeCount: 6,
    vehicleCount: 48,
    totalOrders: 325,
    totalRevenue: 975000,
    createdAt: '2024-04-12T08:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z'
  },
  {
    id: 5,
    name: '云游房车',
    contactPerson: '刘经理',
    phone: '13800138005',
    email: 'liu@cloudtravel.com',
    address: '杭州市西湖区文三路188号',
    cooperationStatus: 'inactive',
    creditRating: 'C',
    contractUrl: 'https://example.com/contracts/partner-5.pdf',
    profitSharingRatio: 30,
    storeCount: 4,
    vehicleCount: 32,
    totalOrders: 156,
    totalRevenue: 468000,
    createdAt: '2024-05-20T08:00:00.000Z',
    updatedAt: '2024-11-15T10:00:00.000Z'
  }
]

const mockPartnerStores: PartnerStore[] = [
  {
    id: 1,
    partnerId: 1,
    partnerName: '房车生活家',
    storeName: '房车生活家北京朝阳店',
    storeCode: 'RVLIFE-BJ-01',
    cityName: '北京',
    address: '北京市朝阳区建国路88号',
    vehicleCount: 8,
    status: 'active'
  },
  {
    id: 2,
    partnerId: 1,
    partnerName: '房车生活家',
    storeName: '房车生活家北京海淀店',
    storeCode: 'RVLIFE-BJ-02',
    cityName: '北京',
    address: '北京市海淀区中关村大街1号',
    vehicleCount: 7,
    status: 'active'
  },
  {
    id: 3,
    partnerId: 1,
    partnerName: '房车生活家',
    storeName: '房车生活家上海浦东店',
    storeCode: 'RVLIFE-SH-01',
    cityName: '上海',
    address: '上海市浦东新区世纪大道1000号',
    vehicleCount: 10,
    status: 'active'
  }
]

const mockPartnerOrders: PartnerOrder[] = [
  {
    id: 1,
    orderId: 1001,
    orderNo: 'DD202412050001',
    partnerId: 1,
    partnerName: '房车生活家',
    partnerOrderNo: 'RVLIFE202412050001',
    daodaoOrderPrice: 3500,
    partnerOrderPrice: 2800,
    priceDifference: 700,
    profitSharingRatio: 30,
    storeProfitAmount: 210,
    platformProfitAmount: 490,
    storeId: 1,
    storeName: '叨叨房车北京朝阳店',
    createdBy: '张三',
    createdAt: '2024-12-05T10:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z'
  },
  {
    id: 2,
    orderId: 1002,
    orderNo: 'DD202412050002',
    partnerId: 1,
    partnerName: '房车生活家',
    partnerOrderNo: 'RVLIFE202412050002',
    daodaoOrderPrice: 4200,
    partnerOrderPrice: 3500,
    priceDifference: 700,
    profitSharingRatio: 30,
    storeProfitAmount: 210,
    platformProfitAmount: 490,
    storeId: 2,
    storeName: '叨叨房车上海浦东店',
    createdBy: '李四',
    createdAt: '2024-12-05T11:00:00.000Z',
    updatedAt: '2024-12-05T11:00:00.000Z'
  }
]

// Mock API 实现
export function mockGetPartnerList(params: PartnerListParams): Promise<{ list: Partner[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockPartners]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (partner) =>
            partner.name.toLowerCase().includes(keyword) ||
            partner.contactPerson.toLowerCase().includes(keyword) ||
            partner.phone.includes(keyword)
        )
      }

      // 合作状态筛选
      if (params.cooperationStatus) {
        filteredList = filteredList.filter((partner) => partner.cooperationStatus === params.cooperationStatus)
      }

      // 信用评级筛选
      if (params.creditRating) {
        filteredList = filteredList.filter((partner) => partner.creditRating === params.creditRating)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        list,
        total: filteredList.length
      })
    }, 300)
  })
}

export function mockGetPartnerDetail(id: number): Promise<Partner> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const partner = mockPartners.find((p) => p.id === id)
      if (partner) {
        resolve(partner)
      } else {
        reject(new Error('合作商不存在'))
      }
    }, 200)
  })
}

export function mockCreatePartner(data: CreatePartnerParams): Promise<Partner> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPartner: Partner = {
        id: mockPartners.length + 1,
        ...data,
        contractUrl: data.contractUrl || '',
        profitSharingRatio: data.profitSharingRatio || 30,
        storeCount: 0,
        vehicleCount: 0,
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockPartners.push(newPartner)
      resolve(newPartner)
    }, 300)
  })
}

export function mockUpdatePartner(id: number, data: UpdatePartnerParams): Promise<Partner> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPartners.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockPartners[index] = {
          ...mockPartners[index],
          ...data,
          updatedAt: new Date().toISOString()
        }
        resolve(mockPartners[index])
      } else {
        reject(new Error('合作商不存在'))
      }
    }, 300)
  })
}

export function mockDeletePartner(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPartners.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockPartners.splice(index, 1)
        resolve()
      } else {
        reject(new Error('合作商不存在'))
      }
    }, 300)
  })
}

export function mockGetPartnerStats(): Promise<PartnerStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: PartnerStats = {
        totalPartners: mockPartners.length,
        activePartners: mockPartners.filter((p) => p.cooperationStatus === 'active').length,
        totalStores: mockPartners.reduce((sum, p) => sum + p.storeCount, 0),
        totalVehicles: mockPartners.reduce((sum, p) => sum + p.vehicleCount, 0),
        totalOrders: mockPartners.reduce((sum, p) => sum + p.totalOrders, 0),
        totalRevenue: mockPartners.reduce((sum, p) => sum + p.totalRevenue, 0),
        monthlyRevenue: 856000,
        averagePriceDifference: 650
      }
      resolve(stats)
    }, 200)
  })
}

export function mockGetPartnerStores(partnerId: number): Promise<PartnerStore[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stores = mockPartnerStores.filter((s) => s.partnerId === partnerId)
      resolve(stores)
    }, 200)
  })
}

export function mockGetPartnerOrders(params: {
  partnerId?: number
  page: number
  pageSize: number
}): Promise<{ list: PartnerOrder[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockPartnerOrders]

      // 合作商筛选
      if (params.partnerId) {
        filteredList = filteredList.filter((order) => order.partnerId === params.partnerId)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        list,
        total: filteredList.length
      })
    }, 300)
  })
}

export function mockCreatePartnerOrder(data: CreatePartnerOrderParams): Promise<PartnerOrder> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟从订单表获取订单信息
      const daodaoOrderPrice = 3500 // 实际应该从订单表查询
      const priceDifference = daodaoOrderPrice - data.partnerOrderPrice
      const profitSharingRatio = 30 // 从合作商配置获取
      const storeProfitAmount = priceDifference * (profitSharingRatio / 100)
      const platformProfitAmount = priceDifference - storeProfitAmount

      const newOrder: PartnerOrder = {
        id: mockPartnerOrders.length + 1,
        orderId: data.orderId,
        orderNo: `DD${new Date().getTime()}`,
        partnerId: data.partnerId,
        partnerName: mockPartners.find((p) => p.id === data.partnerId)?.name || '',
        partnerOrderNo: data.partnerOrderNo,
        daodaoOrderPrice,
        partnerOrderPrice: data.partnerOrderPrice,
        priceDifference,
        profitSharingRatio,
        storeProfitAmount,
        platformProfitAmount,
        storeId: 1,
        storeName: '叨叨房车北京朝阳店',
        createdBy: '当前用户',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockPartnerOrders.push(newOrder)
      resolve(newOrder)
    }, 300)
  })
}

export function mockUpdatePartnerOrder(id: number, data: UpdatePartnerOrderParams): Promise<PartnerOrder> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPartnerOrders.findIndex((o) => o.id === id)
      if (index !== -1) {
        const order = mockPartnerOrders[index]

        // 更新订单信息
        if (data.partnerOrderNo) {
          order.partnerOrderNo = data.partnerOrderNo
        }
        if (data.partnerOrderPrice) {
          order.partnerOrderPrice = data.partnerOrderPrice
          // 重新计算差价和分润
          order.priceDifference = order.daodaoOrderPrice - data.partnerOrderPrice
          order.storeProfitAmount = order.priceDifference * (order.profitSharingRatio / 100)
          order.platformProfitAmount = order.priceDifference - order.storeProfitAmount
        }
        order.updatedAt = new Date().toISOString()

        resolve(order)
      } else {
        reject(new Error('合作商订单不存在'))
      }
    }, 300)
  })
}

export function mockGetPartnerSettlement(params: PartnerSettlementParams): Promise<PartnerSettlement[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟结算数据
      const settlements: PartnerSettlement[] = mockPartners
        .filter((p) => !params.partnerId || p.id === params.partnerId)
        .map((partner) => ({
          partnerId: partner.id,
          partnerName: partner.name,
          settlementPeriod: '2024-12',
          totalOrders: Math.floor(Math.random() * 100) + 50,
          totalPriceDifference: Math.floor(Math.random() * 50000) + 30000,
          totalStoreProfit: Math.floor(Math.random() * 15000) + 9000,
          totalPlatformProfit: Math.floor(Math.random() * 35000) + 21000,
          settlementStatus: Math.random() > 0.5 ? 'completed' : 'pending',
          settlementDate: Math.random() > 0.5 ? '2024-12-01T00:00:00.000Z' : null
        }))

      resolve(settlements)
    }, 300)
  })
}
