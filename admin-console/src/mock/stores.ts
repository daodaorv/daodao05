/**
 * 门店管理 Mock 数据
 */

// 门店类型
export type StoreType = 'direct' | 'franchise' | 'cooperative'

// 门店状态
export type StoreStatus = 'active' | 'inactive' | 'suspended'

// 门店价格策略配置
export interface StorePriceStrategyConfig {
  useCustomCityFactor: boolean // 是否使用自定义城市因子
  customCityFactorId?: number // 自定义城市因子ID
  specialRules?: number[] // 门店专属规则ID列表
}

// 门店信息
export interface Store {
  id: number
  name: string
  code: string
  type: StoreType
  status: StoreStatus
  cityId: number
  cityName: string
  regionId: number
  regionName: string
  address: string
  latitude: number
  longitude: number
  phone: string
  email: string
  manager: string
  managerId: number
  businessHours: string
  serviceScope: string[]
  vehicleCount: number
  employeeCount: number
  monthlyRevenue: number
  rating: number
  images: string[]
  description: string
  createdAt: string
  updatedAt: string

  // 价格策略配置（新增）
  priceStrategyConfig?: StorePriceStrategyConfig

  // 可托管验车（新增）
  canHostingInspection: boolean
}

// 城市信息
export interface City {
  // 基础信息
  id: number
  name: string
  code: string
  provinceId: number
  provinceName: string

  // 门店相关
  storeCount: number
  status: 'active' | 'inactive'
  serviceArea: string[]

  // 价格策略相关（可选字段）
  tierId?: number // 所属城市分级ID
  tierName?: string // 所属城市分级名称
  isHot?: boolean // 是否热门城市
  sortOrder?: number // 排序

  // 时间戳
  createdAt: string
  updatedAt?: string // 更新时间
}

// 区域信息
export interface Region {
  id: number
  name: string
  code: string
  managerId: number
  managerName: string
  cityIds: number[]
  cityNames: string[]
  storeCount: number
  status: 'active' | 'inactive'
  description: string
  createdAt: string
}

// 门店统计
export interface StoreStats {
  totalStores: number
  activeStores: number
  directStores: number
  franchiseStores: number
  cooperativeStores: number
  totalRevenue: number
  totalVehicles: number
  totalEmployees: number
}

// Mock 门店数据
const mockStores: Store[] = [
  {
    id: 1,
    name: '北京朝阳店',
    code: 'BJ-CY-001',
    type: 'direct',
    status: 'active',
    cityId: 1,
    cityName: '北京',
    regionId: 1,
    regionName: '华北区',
    address: '北京市朝阳区建国路88号',
    latitude: 39.9042,
    longitude: 116.4074,
    phone: '010-12345678',
    email: 'bjcy@daodao.com',
    manager: '王五',
    managerId: 3,
    businessHours: '09:00-21:00',
    serviceScope: ['租赁', '维修', '保养', '保险'],
    vehicleCount: 25,
    employeeCount: 8,
    monthlyRevenue: 450000,
    rating: 4.8,
    images: [
      'https://via.placeholder.com/800x600/409EFF/FFFFFF?text=Store+1',
      'https://via.placeholder.com/800x600/67C23A/FFFFFF?text=Store+2'
    ],
    description: '北京朝阳区旗舰店，提供全方位房车租赁服务',
    canHostingInspection: true,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-11-29T10:00:00.000Z'
  },
  {
    id: 2,
    name: '上海浦东店',
    code: 'SH-PD-001',
    type: 'direct',
    status: 'active',
    cityId: 2,
    cityName: '上海',
    regionId: 2,
    regionName: '华东区',
    address: '上海市浦东新区世纪大道1000号',
    latitude: 31.2304,
    longitude: 121.4737,
    phone: '021-87654321',
    email: 'shpd@daodao.com',
    manager: '赵六',
    managerId: 4,
    businessHours: '08:30-20:30',
    serviceScope: ['租赁', '维修', '保养'],
    vehicleCount: 30,
    employeeCount: 10,
    monthlyRevenue: 520000,
    rating: 4.9,
    images: [
      'https://via.placeholder.com/800x600/E6A23C/FFFFFF?text=Store+3'
    ],
    description: '上海浦东核心商圈店，高端房车租赁首选',
    canHostingInspection: true,
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2024-11-28T15:30:00.000Z'
  },
  {
    id: 3,
    name: '广州天河加盟店',
    code: 'GZ-TH-001',
    type: 'franchise',
    status: 'active',
    cityId: 3,
    cityName: '广州',
    regionId: 3,
    regionName: '华南区',
    address: '广州市天河区天河路123号',
    latitude: 23.1291,
    longitude: 113.2644,
    phone: '020-98765432',
    email: 'gzth@daodao.com',
    manager: '孙七',
    managerId: 5,
    businessHours: '09:00-20:00',
    serviceScope: ['租赁', '保养'],
    vehicleCount: 18,
    employeeCount: 6,
    monthlyRevenue: 320000,
    rating: 4.6,
    images: [
      'https://via.placeholder.com/800x600/F56C6C/FFFFFF?text=Store+4'
    ],
    description: '广州天河区加盟店，服务周到价格实惠',
    canHostingInspection: false,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-11-27T09:20:00.000Z'
  },
  {
    id: 4,
    name: '深圳南山合作店',
    code: 'SZ-NS-001',
    type: 'cooperative',
    status: 'active',
    cityId: 4,
    cityName: '深圳',
    regionId: 3,
    regionName: '华南区',
    address: '深圳市南山区科技园南路88号',
    latitude: 22.5431,
    longitude: 114.0579,
    phone: '0755-55667788',
    email: 'szns@daodao.com',
    manager: '周八',
    managerId: 6,
    businessHours: '09:30-19:30',
    serviceScope: ['租赁'],
    vehicleCount: 12,
    employeeCount: 4,
    monthlyRevenue: 180000,
    rating: 4.3,
    images: [
      'https://via.placeholder.com/800x600/909399/FFFFFF?text=Store+5'
    ],
    description: '深圳南山区合作商户，提供基础租赁服务',
    canHostingInspection: false,
    createdAt: '2024-04-01T08:00:00.000Z',
    updatedAt: '2024-11-26T14:10:00.000Z'
  },
  {
    id: 5,
    name: '成都武侯店',
    code: 'CD-WH-001',
    type: 'direct',
    status: 'active',
    cityId: 5,
    cityName: '成都',
    regionId: 4,
    regionName: '西南区',
    address: '成都市武侯区人民南路四段999号',
    latitude: 30.5728,
    longitude: 104.0668,
    phone: '028-66778899',
    email: 'cdwh@daodao.com',
    manager: '吴九',
    managerId: 7,
    businessHours: '09:00-21:00',
    serviceScope: ['租赁', '维修', '保养', '保险'],
    vehicleCount: 22,
    employeeCount: 7,
    monthlyRevenue: 380000,
    rating: 4.7,
    images: [
      'https://via.placeholder.com/800x600/409EFF/FFFFFF?text=Store+6'
    ],
    description: '成都武侯区直营店，川藏线房车租赁专家',
    canHostingInspection: true,
    createdAt: '2024-05-10T08:00:00.000Z',
    updatedAt: '2024-11-25T11:45:00.000Z'
  },
  {
    id: 6,
    name: '杭州西湖店',
    code: 'HZ-XH-001',
    type: 'franchise',
    status: 'inactive',
    cityId: 6,
    cityName: '杭州',
    regionId: 2,
    regionName: '华东区',
    address: '杭州市西湖区文三路456号',
    latitude: 30.2741,
    longitude: 120.1551,
    phone: '0571-88990011',
    email: 'hzxh@daodao.com',
    manager: '郑十',
    managerId: 8,
    businessHours: '09:00-20:00',
    serviceScope: ['租赁', '保养'],
    vehicleCount: 15,
    employeeCount: 5,
    monthlyRevenue: 0,
    rating: 4.4,
    images: [
      'https://via.placeholder.com/800x600/67C23A/FFFFFF?text=Store+7'
    ],
    description: '杭州西湖区加盟店，暂停营业装修中',
    canHostingInspection: false,
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-11-20T16:00:00.000Z'
  }
]

// Mock 城市数据
export const mockCities: City[] = [
  // 一线城市
  {
    id: 1,
    name: '北京',
    code: 'BJ',
    provinceId: 1,
    provinceName: '北京市',
    storeCount: 1,
    status: 'active',
    serviceArea: ['朝阳区', '海淀区', '东城区', '西城区'],
    tierId: 1,
    tierName: '一线城市',
    isHot: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: '上海',
    code: 'SH',
    provinceId: 2,
    provinceName: '上海市',
    storeCount: 1,
    status: 'active',
    serviceArea: ['浦东新区', '黄浦区', '徐汇区', '静安区'],
    tierId: 1,
    tierName: '一线城市',
    isHot: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: '广州',
    code: 'GZ',
    provinceId: 3,
    provinceName: '广东省',
    storeCount: 1,
    status: 'active',
    serviceArea: ['天河区', '越秀区', '海珠区', '番禺区'],
    tierId: 1,
    tierName: '一线城市',
    isHot: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    name: '深圳',
    code: 'SZ',
    provinceId: 3,
    provinceName: '广东省',
    storeCount: 1,
    status: 'active',
    serviceArea: ['南山区', '福田区', '罗湖区', '宝安区'],
    tierId: 1,
    tierName: '一线城市',
    isHot: true,
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // 新一线城市
  {
    id: 5,
    name: '成都',
    code: 'CD',
    provinceId: 4,
    provinceName: '四川省',
    storeCount: 1,
    status: 'active',
    serviceArea: ['武侯区', '锦江区', '青羊区', '金牛区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 5,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 6,
    name: '杭州',
    code: 'HZ',
    provinceId: 5,
    provinceName: '浙江省',
    storeCount: 1,
    status: 'active',
    serviceArea: ['西湖区', '上城区', '拱墅区', '滨江区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 6,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 7,
    name: '重庆',
    code: 'CQ',
    provinceId: 6,
    provinceName: '重庆市',
    storeCount: 0,
    status: 'active',
    serviceArea: ['渝中区', '江北区', '南岸区', '渝北区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 7,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 8,
    name: '西安',
    code: 'XA',
    provinceId: 7,
    provinceName: '陕西省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['雁塔区', '碑林区', '莲湖区', '未央区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 8,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 9,
    name: '武汉',
    code: 'WH',
    provinceId: 8,
    provinceName: '湖北省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['武昌区', '汉口区', '汉阳区', '洪山区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 9,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 10,
    name: '南京',
    code: 'NJ',
    provinceId: 9,
    provinceName: '江苏省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['鼓楼区', '玄武区', '秦淮区', '建邺区'],
    tierId: 2,
    tierName: '新一线城市',
    isHot: true,
    sortOrder: 10,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // 二线城市
  {
    id: 11,
    name: '苏州',
    code: 'SZ',
    provinceId: 9,
    provinceName: '江苏省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['姑苏区', '工业园区', '高新区', '吴中区'],
    tierId: 3,
    tierName: '二线城市',
    isHot: false,
    sortOrder: 11,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 12,
    name: '天津',
    code: 'TJ',
    provinceId: 10,
    provinceName: '天津市',
    storeCount: 0,
    status: 'active',
    serviceArea: ['和平区', '河西区', '南开区', '河东区'],
    tierId: 3,
    tierName: '二线城市',
    isHot: false,
    sortOrder: 12,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 13,
    name: '郑州',
    code: 'ZZ',
    provinceId: 11,
    provinceName: '河南省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['金水区', '二七区', '中原区', '管城区'],
    tierId: 3,
    tierName: '二线城市',
    isHot: false,
    sortOrder: 13,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 14,
    name: '长沙',
    code: 'CS',
    provinceId: 12,
    provinceName: '湖南省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['岳麓区', '芙蓉区', '天心区', '开福区'],
    tierId: 3,
    tierName: '二线城市',
    isHot: false,
    sortOrder: 14,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 15,
    name: '沈阳',
    code: 'SY',
    provinceId: 13,
    provinceName: '辽宁省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['和平区', '沈河区', '皇姑区', '大东区'],
    tierId: 3,
    tierName: '二线城市',
    isHot: false,
    sortOrder: 15,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // 三线城市
  {
    id: 16,
    name: '昆明',
    code: 'KM',
    provinceId: 14,
    provinceName: '云南省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['五华区', '盘龙区', '官渡区', '西山区'],
    tierId: 4,
    tierName: '三线城市',
    isHot: false,
    sortOrder: 16,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 17,
    name: '大连',
    code: 'DL',
    provinceId: 13,
    provinceName: '辽宁省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['中山区', '西岗区', '沙河口区', '甘井子区'],
    tierId: 4,
    tierName: '三线城市',
    isHot: false,
    sortOrder: 17,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 18,
    name: '厦门',
    code: 'XM',
    provinceId: 15,
    provinceName: '福建省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['思明区', '湖里区', '集美区', '海沧区'],
    tierId: 4,
    tierName: '三线城市',
    isHot: false,
    sortOrder: 18,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 19,
    name: '合肥',
    code: 'HF',
    provinceId: 16,
    provinceName: '安徽省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['庐阳区', '瑶海区', '蜀山区', '包河区'],
    tierId: 4,
    tierName: '三线城市',
    isHot: false,
    sortOrder: 19,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 20,
    name: '石家庄',
    code: 'SJZ',
    provinceId: 17,
    provinceName: '河北省',
    storeCount: 0,
    status: 'active',
    serviceArea: ['长安区', '桥西区', '新华区', '裕华区'],
    tierId: 4,
    tierName: '三线城市',
    isHot: false,
    sortOrder: 20,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

// Mock 区域数据
const mockRegions: Region[] = [
  {
    id: 1,
    name: '华北区',
    code: 'HB',
    managerId: 2,
    managerName: '李四',
    cityIds: [1],
    cityNames: ['北京'],
    storeCount: 1,
    status: 'active',
    description: '负责华北地区业务运营',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: '华东区',
    code: 'HD',
    managerId: 9,
    managerName: '钱十一',
    cityIds: [2, 6],
    cityNames: ['上海', '杭州'],
    storeCount: 2,
    status: 'active',
    description: '负责华东地区业务运营',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: '华南区',
    code: 'HN',
    managerId: 10,
    managerName: '孙十二',
    cityIds: [3, 4],
    cityNames: ['广州', '深圳'],
    storeCount: 2,
    status: 'active',
    description: '负责华南地区业务运营',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    name: '西南区',
    code: 'XN',
    managerId: 11,
    managerName: '李十三',
    cityIds: [5],
    cityNames: ['成都'],
    storeCount: 1,
    status: 'active',
    description: '负责西南地区业务运营',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

// 门店列表查询参数
export interface StoreListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: StoreType
  status?: StoreStatus
  cityId?: number
  regionId?: number
}

// 创建门店参数
export interface CreateStoreParams {
  name: string
  code: string
  type: StoreType
  cityId: number
  regionId: number
  address: string
  latitude: number
  longitude: number
  phone: string
  email: string
  managerId: number
  businessHours: string
  serviceScope: string[]
  description: string
}

// 更新门店参数
export interface UpdateStoreParams extends Partial<CreateStoreParams> {
  status?: StoreStatus
}

// Mock 获取门店列表
export const mockGetStoreList = (params: StoreListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredStores = [...mockStores]

      // 关键词搜索
      if (params.keyword) {
        filteredStores = filteredStores.filter(
          (store) =>
            store.name.includes(params.keyword!) ||
            store.code.includes(params.keyword!) ||
            store.address.includes(params.keyword!)
        )
      }

      // 门店类型筛选
      if (params.type) {
        filteredStores = filteredStores.filter((store) => store.type === params.type)
      }

      // 状态筛选
      if (params.status) {
        filteredStores = filteredStores.filter((store) => store.status === params.status)
      }

      // 城市筛选
      if (params.cityId) {
        filteredStores = filteredStores.filter((store) => store.cityId === params.cityId)
      }

      // 区域筛选
      if (params.regionId) {
        filteredStores = filteredStores.filter((store) => store.regionId === params.regionId)
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredStores.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredStores.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 获取门店详情
export const mockGetStoreDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const store = mockStores.find((s) => s.id === id)
      if (store) {
        resolve({
          code: 200,
          message: '获取成功',
          data: store
        })
      } else {
        reject({
          code: 404,
          message: '门店不存在'
        })
      }
    }, 200)
  })
}

// Mock 创建门店
export const mockCreateStore = (params: CreateStoreParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStore: Store = {
        id: mockStores.length + 1,
        ...params,
        cityName: mockCities.find((c) => c.id === params.cityId)?.name || '',
        regionName: mockRegions.find((r) => r.id === params.regionId)?.name || '',
        manager: '新经理',
        status: 'active',
        vehicleCount: 0,
        employeeCount: 0,
        monthlyRevenue: 0,
        rating: 5.0,
        images: [],
        canHostingInspection: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockStores.push(newStore)
      resolve({
        code: 200,
        message: '创建成功',
        data: newStore
      })
    }, 500)
  })
}

// Mock 更新门店
export const mockUpdateStore = (id: number, params: UpdateStoreParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStores.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockStores[index] = {
          ...mockStores[index],
          ...params,
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '更新成功',
          data: mockStores[index]
        })
      } else {
        reject({
          code: 404,
          message: '门店不存在'
        })
      }
    }, 500)
  })
}

// Mock 删除门店
export const mockDeleteStore = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStores.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockStores.splice(index, 1)
        resolve({
          code: 200,
          message: '删除成功'
        })
      } else {
        reject({
          code: 404,
          message: '门店不存在'
        })
      }
    }, 500)
  })
}

// Mock 获取门店统计
export const mockGetStoreStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: StoreStats = {
        totalStores: mockStores.length,
        activeStores: mockStores.filter((s) => s.status === 'active').length,
        directStores: mockStores.filter((s) => s.type === 'direct').length,
        franchiseStores: mockStores.filter((s) => s.type === 'franchise').length,
        cooperativeStores: mockStores.filter((s) => s.type === 'cooperative').length,
        totalRevenue: mockStores.reduce((sum, s) => sum + s.monthlyRevenue, 0),
        totalVehicles: mockStores.reduce((sum, s) => sum + s.vehicleCount, 0),
        totalEmployees: mockStores.reduce((sum, s) => sum + s.employeeCount, 0)
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}

// 城市列表查询参数
export interface CityListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'active' | 'inactive'
  tierId?: number // 按分级筛选
  isHot?: boolean // 按热门筛选
}

// Mock 获取城市列表
export const mockGetCityList = (params?: CityListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredCities = [...mockCities]

      // 状态筛选
      if (params?.status) {
        filteredCities = filteredCities.filter(city => city.status === params.status)
      }

      // 分级筛选
      if (params?.tierId) {
        filteredCities = filteredCities.filter(city => city.tierId === params.tierId)
      }

      // 热门城市筛选
      if (params?.isHot !== undefined) {
        filteredCities = filteredCities.filter(city => city.isHot === params.isHot)
      }

      // 关键词搜索
      if (params?.keyword) {
        filteredCities = filteredCities.filter(city =>
          city.name.includes(params.keyword!) ||
          city.provinceName.includes(params.keyword!)
        )
      }

      // 分页
      const page = params?.page || 1
      const pageSize = params?.pageSize || 20
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredCities.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: list,
        total: filteredCities.length,
        page,
        pageSize
      })
    }, 200)
  })
}

// Mock 获取区域列表
export const mockGetRegionList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockRegions
      })
    }, 200)
  })
}
