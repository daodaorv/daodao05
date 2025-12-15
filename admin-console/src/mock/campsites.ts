/**
 * 营地管理 Mock 数据
 */

// 营地状态
export type CampsiteStatus = 'active' | 'inactive' | 'maintenance'

// 营地类型
export type CampsiteType = 'scenic' | 'forest' | 'lakeside' | 'mountain' | 'desert' | 'grassland'

// 预订模式
export type BookingMode = 'instant' | 'approval' | 'inquiry'

// 营地设施
export interface CampsiteFacility {
  id: string
  name: string
  icon: string
  available: boolean
}

// 营地信息
export interface Campsite {
  id: number
  name: string
  type: CampsiteType
  status: CampsiteStatus
  bookingMode: BookingMode
  address: string
  province: string
  city: string
  district: string
  latitude: number
  longitude: number
  area: number
  capacity: number
  availableSpots: number
  pricePerNight: number
  weekendPrice: number
  holidayPrice: number
  facilities: CampsiteFacility[]
  images: string[]
  description: string
  rules: string
  contactPerson: string
  contactPhone: string
  rating: number
  reviewCount: number
  bookingCount: number
  revenue: number
  openTime: string
  closeTime: string
  checkInTime: string
  checkOutTime: string
  createdAt: string
  updatedAt: string
}

// 营地统计
export interface CampsiteStats {
  totalCampsites: number
  activeCampsites: number
  totalCapacity: number
  occupancyRate: number
  totalRevenue: number
  todayBookings: number
}

// 预订状态
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

// 营地预订
export interface CampsiteReservation {
  id: number
  campsiteId: number
  campsiteName: string
  userId: number
  userName: string
  userPhone: string
  checkInDate: string
  checkOutDate: string
  nights: number
  spots: number
  totalAmount: number
  paidAmount: number
  status: ReservationStatus
  specialRequests: string
  createdAt: string
  updatedAt: string
}

// 咨询状态
export type InquiryStatus = 'pending' | 'replied' | 'closed'

// 营地咨询
export interface CampsiteInquiry {
  id: number
  campsiteId: number
  campsiteName: string
  userId: number
  userName: string
  userPhone: string
  question: string
  reply: string
  repliedBy: string
  repliedAt: string
  status: InquiryStatus
  createdAt: string
  updatedAt: string
}

// Mock 营地数据
let mockCampsites: Campsite[] = [
  {
    id: 1,
    name: '北京怀柔雁栖湖房车营地',
    type: 'lakeside',
    status: 'active',
    bookingMode: 'instant',
    address: '北京市怀柔区雁栖湖畔',
    province: '北京市',
    city: '北京市',
    district: '怀柔区',
    latitude: 40.3889,
    longitude: 116.6333,
    area: 5000,
    capacity: 50,
    availableSpots: 35,
    pricePerNight: 200,
    weekendPrice: 280,
    holidayPrice: 350,
    facilities: [
      { id: 'power', name: '电源接口', icon: 'electric', available: true },
      { id: 'water', name: '供水设施', icon: 'water', available: true },
      { id: 'toilet', name: '卫生间', icon: 'toilet', available: true },
      { id: 'shower', name: '淋浴间', icon: 'shower', available: true },
      { id: 'wifi', name: 'WiFi', icon: 'wifi', available: true },
      { id: 'bbq', name: '烧烤区', icon: 'bbq', available: true },
      { id: 'parking', name: '停车场', icon: 'parking', available: true },
      { id: 'store', name: '便利店', icon: 'store', available: true }
    ],
    images: ['/images/campsite1-1.jpg', '/images/campsite1-2.jpg', '/images/campsite1-3.jpg'],
    description: '位于雁栖湖畔的优质房车营地，环境优美，设施齐全，适合家庭出游和团队活动。',
    rules: '1. 禁止明火\n2. 保持安静，晚上10点后禁止喧哗\n3. 爱护环境，垃圾分类\n4. 宠物需牵绳',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    rating: 4.8,
    reviewCount: 156,
    bookingCount: 328,
    revenue: 65600,
    openTime: '全年开放',
    closeTime: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2025-12-03T10:00:00.000Z'
  },
  {
    id: 2,
    name: '上海崇明东滩湿地营地',
    type: 'grassland',
    status: 'active',
    bookingMode: 'approval',
    address: '上海市崇明区东滩湿地公园',
    province: '上海市',
    city: '上海市',
    district: '崇明区',
    latitude: 31.5167,
    longitude: 121.9667,
    area: 3000,
    capacity: 30,
    availableSpots: 20,
    pricePerNight: 180,
    weekendPrice: 250,
    holidayPrice: 300,
    facilities: [
      { id: 'power', name: '电源接口', icon: 'electric', available: true },
      { id: 'water', name: '供水设施', icon: 'water', available: true },
      { id: 'toilet', name: '卫生间', icon: 'toilet', available: true },
      { id: 'shower', name: '淋浴间', icon: 'shower', available: false },
      { id: 'wifi', name: 'WiFi', icon: 'wifi', available: true },
      { id: 'bbq', name: '烧烤区', icon: 'bbq', available: true },
      { id: 'parking', name: '停车场', icon: 'parking', available: true }
    ],
    images: ['/images/campsite2-1.jpg', '/images/campsite2-2.jpg'],
    description: '崇明岛东滩湿地旁的生态营地，可观鸟、骑行，体验自然之美。',
    rules: '1. 禁止明火\n2. 保护湿地生态\n3. 禁止捕鱼捕鸟\n4. 垃圾带走',
    contactPerson: '李经理',
    contactPhone: '13800138001',
    rating: 4.6,
    reviewCount: 89,
    bookingCount: 187,
    revenue: 33660,
    openTime: '3月-11月',
    closeTime: '12月-2月',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    createdAt: '2024-03-20T10:00:00.000Z',
    updatedAt: '2025-12-03T10:00:00.000Z'
  },
  {
    id: 3,
    name: '杭州千岛湖森林营地',
    type: 'forest',
    status: 'active',
    bookingMode: 'instant',
    address: '浙江省杭州市淳安县千岛湖镇',
    province: '浙江省',
    city: '杭州市',
    district: '淳安县',
    latitude: 29.6089,
    longitude: 119.0378,
    area: 8000,
    capacity: 80,
    availableSpots: 45,
    pricePerNight: 220,
    weekendPrice: 300,
    holidayPrice: 380,
    facilities: [
      { id: 'power', name: '电源接口', icon: 'electric', available: true },
      { id: 'water', name: '供水设施', icon: 'water', available: true },
      { id: 'toilet', name: '卫生间', icon: 'toilet', available: true },
      { id: 'shower', name: '淋浴间', icon: 'shower', available: true },
      { id: 'wifi', name: 'WiFi', icon: 'wifi', available: true },
      { id: 'bbq', name: '烧烤区', icon: 'bbq', available: true },
      { id: 'parking', name: '停车场', icon: 'parking', available: true },
      { id: 'store', name: '便利店', icon: 'store', available: true },
      { id: 'restaurant', name: '餐厅', icon: 'restaurant', available: true }
    ],
    images: ['/images/campsite3-1.jpg', '/images/campsite3-2.jpg', '/images/campsite3-3.jpg', '/images/campsite3-4.jpg'],
    description: '千岛湖畔的森林营地，空气清新，景色宜人，配套设施完善。',
    rules: '1. 禁止明火\n2. 森林防火，严禁吸烟\n3. 保护森林环境\n4. 夜间保持安静',
    contactPerson: '王经理',
    contactPhone: '13800138002',
    rating: 4.9,
    reviewCount: 234,
    bookingCount: 512,
    revenue: 112640,
    openTime: '全年开放',
    closeTime: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2025-12-03T10:00:00.000Z'
  },
  {
    id: 4,
    name: '成都青城山营地',
    type: 'mountain',
    status: 'maintenance',
    bookingMode: 'inquiry',
    address: '四川省成都市都江堰市青城山镇',
    province: '四川省',
    city: '成都市',
    district: '都江堰市',
    latitude: 30.9000,
    longitude: 103.5667,
    area: 4000,
    capacity: 40,
    availableSpots: 0,
    pricePerNight: 200,
    weekendPrice: 280,
    holidayPrice: 350,
    facilities: [
      { id: 'power', name: '电源接口', icon: 'electric', available: true },
      { id: 'water', name: '供水设施', icon: 'water', available: true },
      { id: 'toilet', name: '卫生间', icon: 'toilet', available: true },
      { id: 'shower', name: '淋浴间', icon: 'shower', available: true },
      { id: 'wifi', name: 'WiFi', icon: 'wifi', available: false },
      { id: 'parking', name: '停车场', icon: 'parking', available: true }
    ],
    images: ['/images/campsite4-1.jpg', '/images/campsite4-2.jpg'],
    description: '青城山脚下的山地营地，正在进行设施升级改造。',
    rules: '1. 禁止明火\n2. 山区注意安全\n3. 保护环境\n4. 防范野生动物',
    contactPerson: '赵经理',
    contactPhone: '13800138003',
    rating: 4.5,
    reviewCount: 67,
    bookingCount: 145,
    revenue: 29000,
    openTime: '全年开放',
    closeTime: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    createdAt: '2024-04-05T10:00:00.000Z',
    updatedAt: '2025-12-03T10:00:00.000Z'
  }
]

// Mock 预订数据
let mockReservations: CampsiteReservation[] = [
  {
    id: 1,
    campsiteId: 1,
    campsiteName: '北京怀柔雁栖湖房车营地',
    userId: 1,
    userName: '张三',
    userPhone: '13800138000',
    checkInDate: '2025-12-10',
    checkOutDate: '2025-12-12',
    nights: 2,
    spots: 2,
    totalAmount: 560,
    paidAmount: 560,
    status: 'confirmed',
    specialRequests: '需要靠近湖边的位置',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-01T10:30:00.000Z'
  },
  {
    id: 2,
    campsiteId: 3,
    campsiteName: '杭州千岛湖森林营地',
    userId: 2,
    userName: '李四',
    userPhone: '13800138001',
    checkInDate: '2025-12-15',
    checkOutDate: '2025-12-18',
    nights: 3,
    spots: 3,
    totalAmount: 900,
    paidAmount: 0,
    status: 'pending',
    specialRequests: '',
    createdAt: '2025-12-03T09:00:00.000Z',
    updatedAt: '2025-12-03T09:00:00.000Z'
  },
  {
    id: 3,
    campsiteId: 1,
    campsiteName: '北京怀柔雁栖湖房车营地',
    userId: 3,
    userName: '王五',
    userPhone: '13800138002',
    checkInDate: '2025-12-05',
    checkOutDate: '2025-12-07',
    nights: 2,
    spots: 1,
    totalAmount: 400,
    paidAmount: 400,
    status: 'checked_out',
    specialRequests: '需要安静的位置',
    createdAt: '2025-11-28T10:00:00.000Z',
    updatedAt: '2025-12-07T12:00:00.000Z'
  }
]

// Mock 咨询数据
let mockInquiries: CampsiteInquiry[] = [
  {
    id: 1,
    campsiteId: 1,
    campsiteName: '北京怀柔雁栖湖房车营地',
    userId: 1,
    userName: '张三',
    userPhone: '13800138000',
    question: '请问营地可以带宠物吗？有什么要求？',
    reply: '可以带宠物，但需要牵绳，并且要清理宠物粪便。',
    repliedBy: '客服-小王',
    repliedAt: '2025-12-02T10:30:00.000Z',
    status: 'replied',
    createdAt: '2025-12-02T10:00:00.000Z',
    updatedAt: '2025-12-02T10:30:00.000Z'
  },
  {
    id: 2,
    campsiteId: 3,
    campsiteName: '杭州千岛湖森林营地',
    userId: 2,
    userName: '李四',
    userPhone: '13800138001',
    question: '营地附近有超市吗？可以购买食材吗？',
    reply: '',
    repliedBy: '',
    repliedAt: '',
    status: 'pending',
    createdAt: '2025-12-03T09:30:00.000Z',
    updatedAt: '2025-12-03T09:30:00.000Z'
  },
  {
    id: 3,
    campsiteId: 2,
    campsiteName: '上海崇明东滩湿地营地',
    userId: 3,
    userName: '王五',
    userPhone: '13800138002',
    question: '营地有充电桩吗？电动房车可以充电吗？',
    reply: '有充电桩，支持电动房车充电，需要提前预约。',
    repliedBy: '客服-小李',
    repliedAt: '2025-12-01T15:00:00.000Z',
    status: 'replied',
    createdAt: '2025-12-01T14:30:00.000Z',
    updatedAt: '2025-12-01T15:00:00.000Z'
  }
]

// 营地列表查询参数
export interface CampsiteListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: CampsiteType
  status?: CampsiteStatus
  province?: string
  city?: string
}

// 预订列表查询参数
export interface ReservationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  campsiteId?: number
  status?: ReservationStatus
  startDate?: string
  endDate?: string
}

// 咨询列表查询参数
export interface InquiryListParams {
  page?: number
  pageSize?: number
  keyword?: string
  campsiteId?: number
  status?: InquiryStatus
}

// Mock 获取营地列表
export const mockGetCampsiteList = (params: CampsiteListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredCampsites = [...mockCampsites]

      // 关键词搜索
      if (params.keyword) {
        filteredCampsites = filteredCampsites.filter(
          (campsite) =>
            campsite.name.includes(params.keyword!) ||
            campsite.address.includes(params.keyword!)
        )
      }

      // 类型筛选
      if (params.type) {
        filteredCampsites = filteredCampsites.filter((campsite) => campsite.type === params.type)
      }

      // 状态筛选
      if (params.status) {
        filteredCampsites = filteredCampsites.filter((campsite) => campsite.status === params.status)
      }

      // 省份筛选
      if (params.province) {
        filteredCampsites = filteredCampsites.filter((campsite) => campsite.province === params.province)
      }

      // 城市筛选
      if (params.city) {
        filteredCampsites = filteredCampsites.filter((campsite) => campsite.city === params.city)
      }

      // 按创建时间倒序排序
      filteredCampsites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredCampsites.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredCampsites.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 获取营地详情
export const mockGetCampsiteDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campsite = mockCampsites.find((c) => c.id === id)
      if (campsite) {
        resolve({
          code: 200,
          message: '获取成功',
          data: campsite
        })
      } else {
        reject({
          code: 404,
          message: '营地不存在'
        })
      }
    }, 200)
  })
}

// Mock 获取营地统计
export const mockGetCampsiteStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: CampsiteStats = {
        totalCampsites: mockCampsites.length,
        activeCampsites: mockCampsites.filter((c) => c.status === 'active').length,
        totalCapacity: mockCampsites.reduce((sum, c) => sum + c.capacity, 0),
        occupancyRate: 0.65,
        totalRevenue: mockCampsites.reduce((sum, c) => sum + c.revenue, 0),
        todayBookings: 5
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}

// Mock 获取预订列表
export const mockGetReservationList = (params: ReservationListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredReservations = [...mockReservations]

      // 关键词搜索
      if (params.keyword) {
        filteredReservations = filteredReservations.filter(
          (reservation) =>
            reservation.campsiteName.includes(params.keyword!) ||
            reservation.userName.includes(params.keyword!) ||
            reservation.userPhone.includes(params.keyword!)
        )
      }

      // 营地筛选
      if (params.campsiteId) {
        filteredReservations = filteredReservations.filter(
          (reservation) => reservation.campsiteId === params.campsiteId
        )
      }

      // 状态筛选
      if (params.status) {
        filteredReservations = filteredReservations.filter(
          (reservation) => reservation.status === params.status
        )
      }

      // 按创建时间倒序排序
      filteredReservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredReservations.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredReservations.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 确认预订
export const mockConfirmReservation = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockReservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        mockReservations[index] = {
          ...mockReservations[index],
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '确认成功',
          data: mockReservations[index]
        })
      } else {
        reject({
          code: 404,
          message: '预订不存在'
        })
      }
    }, 500)
  })
}

// Mock 取消预订
export const mockCancelReservation = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockReservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        mockReservations[index] = {
          ...mockReservations[index],
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '取消成功',
          data: mockReservations[index]
        })
      } else {
        reject({
          code: 404,
          message: '预订不存在'
        })
      }
    }, 500)
  })
}

// Mock 获取咨询列表
export const mockGetInquiryList = (params: InquiryListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredInquiries = [...mockInquiries]

      // 关键词搜索
      if (params.keyword) {
        filteredInquiries = filteredInquiries.filter(
          (inquiry) =>
            inquiry.campsiteName.includes(params.keyword!) ||
            inquiry.userName.includes(params.keyword!) ||
            inquiry.question.includes(params.keyword!)
        )
      }

      // 营地筛选
      if (params.campsiteId) {
        filteredInquiries = filteredInquiries.filter(
          (inquiry) => inquiry.campsiteId === params.campsiteId
        )
      }

      // 状态筛选
      if (params.status) {
        filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.status === params.status)
      }

      // 按创建时间倒序排序
      filteredInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredInquiries.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredInquiries.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 回复咨询
export const mockReplyInquiry = (id: number, reply: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockInquiries.findIndex((i) => i.id === id)
      if (index !== -1) {
        mockInquiries[index] = {
          ...mockInquiries[index],
          reply,
          repliedBy: '客服-小王',
          repliedAt: new Date().toISOString(),
          status: 'replied',
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '回复成功',
          data: mockInquiries[index]
        })
      } else {
        reject({
          code: 404,
          message: '咨询不存在'
        })
      }
    }, 500)
  })
}
