/**
 * 城市因子Mock数据
 */

import type {
  CityTier,
  CityTierListItem,
  CityTierListParams,
  CityTierListResponse,
  UpdateCityTierRequest,
  City,
  CityListParams,
  CityListResponse,
  CityFactor,
  CityFactorListItem,
  CityFactorListParams,
  CityFactorListResponse,
  CityFactorFormData
} from '@/types/cityFactor'

/**
 * Mock城市数据
 */
export const mockCities: City[] = [
  // 一线城市
  { id: 1, name: '北京', provinceId: 1, provinceName: '北京市', tierId: 1, tierName: '一线城市', isHot: true, sortOrder: 1 },
  { id: 2, name: '上海', provinceId: 2, provinceName: '上海市', tierId: 1, tierName: '一线城市', isHot: true, sortOrder: 2 },
  { id: 3, name: '广州', provinceId: 3, provinceName: '广东省', tierId: 1, tierName: '一线城市', isHot: true, sortOrder: 3 },
  { id: 4, name: '深圳', provinceId: 3, provinceName: '广东省', tierId: 1, tierName: '一线城市', isHot: true, sortOrder: 4 },

  // 新一线城市
  { id: 5, name: '成都', provinceId: 4, provinceName: '四川省', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 5 },
  { id: 6, name: '杭州', provinceId: 5, provinceName: '浙江省', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 6 },
  { id: 7, name: '重庆', provinceId: 6, provinceName: '重庆市', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 7 },
  { id: 8, name: '西安', provinceId: 7, provinceName: '陕西省', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 8 },
  { id: 9, name: '武汉', provinceId: 8, provinceName: '湖北省', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 9 },
  { id: 10, name: '南京', provinceId: 9, provinceName: '江苏省', tierId: 2, tierName: '新一线城市', isHot: true, sortOrder: 10 },

  // 二线城市
  { id: 11, name: '苏州', provinceId: 9, provinceName: '江苏省', tierId: 3, tierName: '二线城市', isHot: false, sortOrder: 11 },
  { id: 12, name: '天津', provinceId: 10, provinceName: '天津市', tierId: 3, tierName: '二线城市', isHot: false, sortOrder: 12 },
  { id: 13, name: '郑州', provinceId: 11, provinceName: '河南省', tierId: 3, tierName: '二线城市', isHot: false, sortOrder: 13 },
  { id: 14, name: '长沙', provinceId: 12, provinceName: '湖南省', tierId: 3, tierName: '二线城市', isHot: false, sortOrder: 14 },
  { id: 15, name: '沈阳', provinceId: 13, provinceName: '辽宁省', tierId: 3, tierName: '二线城市', isHot: false, sortOrder: 15 },

  // 三线城市
  { id: 16, name: '昆明', provinceId: 14, provinceName: '云南省', tierId: 4, tierName: '三线城市', isHot: false, sortOrder: 16 },
  { id: 17, name: '大连', provinceId: 13, provinceName: '辽宁省', tierId: 4, tierName: '三线城市', isHot: false, sortOrder: 17 },
  { id: 18, name: '厦门', provinceId: 15, provinceName: '福建省', tierId: 4, tierName: '三线城市', isHot: false, sortOrder: 18 },
  { id: 19, name: '合肥', provinceId: 16, provinceName: '安徽省', tierId: 4, tierName: '三线城市', isHot: false, sortOrder: 19 },
  { id: 20, name: '石家庄', provinceId: 17, provinceName: '河北省', tierId: 4, tierName: '三线城市', isHot: false, sortOrder: 20 }
]

/**
 * Mock城市分级数据
 */
export const mockCityTiers: CityTierListItem[] = [
  {
    id: 1,
    tierName: '一线城市',
    tierLevel: 1,
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    description: '北京、上海、广州、深圳等一线城市，价格上浮20%',
    status: 'active',
    cityCount: 4,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    cities: mockCities.filter(c => c.tierId === 1)
  },
  {
    id: 2,
    tierName: '新一线城市',
    tierLevel: 2,
    adjustmentType: 'percentage',
    adjustmentValue: 15,
    description: '成都、杭州、重庆、西安等新一线城市，价格上浮15%',
    status: 'active',
    cityCount: 6,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    cities: mockCities.filter(c => c.tierId === 2)
  },
  {
    id: 3,
    tierName: '二线城市',
    tierLevel: 3,
    adjustmentType: 'percentage',
    adjustmentValue: 10,
    description: '苏州、天津、郑州等二线城市，价格上浮10%',
    status: 'active',
    cityCount: 5,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    cities: mockCities.filter(c => c.tierId === 3)
  },
  {
    id: 4,
    tierName: '三线城市',
    tierLevel: 4,
    adjustmentType: 'percentage',
    adjustmentValue: 5,
    description: '昆明、大连、厦门等三线城市，价格上浮5%',
    status: 'active',
    cityCount: 5,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    cities: mockCities.filter(c => c.tierId === 4)
  },
  {
    id: 5,
    tierName: '其他城市',
    tierLevel: 5,
    adjustmentType: 'fixed',
    adjustmentValue: 0,
    description: '其他城市，价格不调整',
    status: 'active',
    cityCount: 0,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    cities: []
  }
]

/**
 * Mock自定义城市因子数据
 */
export const mockCityFactors: CityFactorListItem[] = [
  {
    id: 1,
    factorName: '旅游旺季城市加价',
    cityIds: [5, 6, 16],
    cityNames: ['成都', '杭州', '昆明'],
    priority: 8,
    adjustmentType: 'percentage',
    adjustmentValue: 25,
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    status: 'active',
    remark: '暑期旅游旺季，热门旅游城市价格上浮25%',
    createdBy: '管理员',
    createdAt: '2024-06-01 10:00:00',
    updatedAt: '2024-06-01 10:00:00'
  },
  {
    id: 2,
    factorName: '冬季冰雪城市加价',
    cityIds: [11, 15, 17],
    cityNames: ['哈尔滨', '沈阳', '大连'],
    priority: 7,
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    status: 'active',
    remark: '冬季冰雪旅游旺季，东北城市价格上浮30%',
    createdBy: '管理员',
    createdAt: '2024-11-01 10:00:00',
    updatedAt: '2024-11-01 10:00:00'
  },
  {
    id: 3,
    factorName: '沿海城市夏季加价',
    cityIds: [2, 4, 18],
    cityNames: ['上海', '深圳', '厦门'],
    priority: 6,
    adjustmentType: 'fixed',
    adjustmentValue: 100,
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    status: 'active',
    remark: '夏季沿海城市旅游旺季，固定加价100元/天',
    createdBy: '管理员',
    createdAt: '2024-05-01 10:00:00',
    updatedAt: '2024-05-01 10:00:00'
  }
]

/**
 * 获取城市分级列表
 */
export const mockGetCityTierList = (params: CityTierListParams): Promise<CityTierListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockCityTiers]

      // 状态筛选
      if (params.status) {
        filteredList = filteredList.filter(item => item.status === params.status)
      }

      // 分级等级筛选
      if (params.tierLevel) {
        filteredList = filteredList.filter(item => item.tierLevel === params.tierLevel)
      }

      // 关键词搜索
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.tierName.includes(params.keyword!) ||
          item.description.includes(params.keyword!)
        )
      }

      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        list: filteredList.slice(start, end),
        total,
        page,
        pageSize
      })
    }, 300)
  })
}

/**
 * 获取城市分级详情
 */
export const mockGetCityTierDetail = (id: number): Promise<CityTier> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tier = mockCityTiers.find(item => item.id === id)
      if (tier) {
        resolve(tier)
      } else {
        reject(new Error('城市分级不存在'))
      }
    }, 300)
  })
}

/**
 * 修改城市分级
 */
export const mockUpdateCityTier = (id: number, data: UpdateCityTierRequest): Promise<CityTier> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tier = mockCityTiers.find(item => item.id === id)
      if (tier) {
        tier.adjustmentType = data.adjustmentType
        tier.adjustmentValue = data.adjustmentValue
        if (data.status) {
          tier.status = data.status
        }
        tier.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
        resolve(tier)
      } else {
        reject(new Error('城市分级不存在'))
      }
    }, 300)
  })
}

/**
 * 获取城市列表
 */
export const mockGetCityList = (params: CityListParams): Promise<CityListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockCities]

      // 省份筛选
      if (params.provinceId) {
        filteredList = filteredList.filter(item => item.provinceId === params.provinceId)
      }

      // 分级筛选
      if (params.tierId) {
        filteredList = filteredList.filter(item => item.tierId === params.tierId)
      }

      // 热门城市筛选
      if (params.isHot !== undefined) {
        filteredList = filteredList.filter(item => item.isHot === params.isHot)
      }

      // 关键词搜索
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.name.includes(params.keyword!) ||
          item.provinceName.includes(params.keyword!)
        )
      }

      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        list: filteredList.slice(start, end),
        total,
        page,
        pageSize
      })
    }, 300)
  })
}

/**
 * 获取自定义城市因子列表
 */
export const mockGetCityFactorList = (params: CityFactorListParams): Promise<CityFactorListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockCityFactors]

      // 状态筛选
      if (params.status) {
        filteredList = filteredList.filter(item => item.status === params.status)
      }

      // 城市筛选
      if (params.cityId) {
        filteredList = filteredList.filter(item => item.cityIds.includes(params.cityId!))
      }

      // 关键词搜索
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.factorName.includes(params.keyword!) ||
          item.remark.includes(params.keyword!)
        )
      }

      // 日期范围筛选
      if (params.startDate) {
        filteredList = filteredList.filter(item => item.endDate >= params.startDate!)
      }
      if (params.endDate) {
        filteredList = filteredList.filter(item => item.startDate <= params.endDate!)
      }

      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        list: filteredList.slice(start, end),
        total,
        page,
        pageSize
      })
    }, 300)
  })
}

/**
 * 获取自定义城市因子详情
 */
export const mockGetCityFactorDetail = (id: number): Promise<CityFactor> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const factor = mockCityFactors.find(item => item.id === id)
      if (factor) {
        resolve(factor)
      } else {
        reject(new Error('城市因子不存在'))
      }
    }, 300)
  })
}

/**
 * 创建自定义城市因子
 */
export const mockCreateCityFactor = (data: CityFactorFormData): Promise<CityFactor> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFactor: CityFactor = {
        id: mockCityFactors.length + 1,
        factorName: data.factorName,
        cityIds: data.cityIds,
        cityNames: data.cityIds.map(id => mockCities.find(c => c.id === id)?.name || ''),
        priority: data.priority,
        adjustmentType: data.adjustmentType,
        adjustmentValue: data.adjustmentValue,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        remark: data.remark,
        createdBy: '管理员',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      mockCityFactors.push(newFactor)
      resolve(newFactor)
    }, 300)
  })
}

/**
 * 更新自定义城市因子
 */
export const mockUpdateCityFactor = (id: number, data: CityFactorFormData): Promise<CityFactor> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const factor = mockCityFactors.find(item => item.id === id)
      if (factor) {
        factor.factorName = data.factorName
        factor.cityIds = data.cityIds
        factor.cityNames = data.cityIds.map(id => mockCities.find(c => c.id === id)?.name || '')
        factor.priority = data.priority
        factor.adjustmentType = data.adjustmentType
        factor.adjustmentValue = data.adjustmentValue
        factor.startDate = data.startDate
        factor.endDate = data.endDate
        factor.status = data.status
        factor.remark = data.remark
        factor.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
        resolve(factor)
      } else {
        reject(new Error('城市因子不存在'))
      }
    }, 300)
  })
}

/**
 * 删除自定义城市因子
 */
export const mockDeleteCityFactor = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCityFactors.findIndex(item => item.id === id)
      if (index !== -1) {
        mockCityFactors.splice(index, 1)
        resolve()
      } else {
        reject(new Error('城市因子不存在'))
      }
    }, 300)
  })
}
