/**
 * 车辆相关类型定义
 */

/**
 * 车辆规格
 */
export interface VehicleSpecifications {
  /** 座位数 */
  seats: number
  /** 燃料类型 */
  fuelType: string
  /** 变速箱类型 */
  transmission: string
  /** 排量 */
  displacement?: string
  /** 车身长度(米) */
  length?: number
  /** 车身宽度(米) */
  width?: number
  /** 车身高度(米) */
  height?: number
}

/**
 * 车辆详情
 */
export interface VehicleDetail {
  /** 车辆ID */
  id: string
  /** 车辆名称 */
  name: string
  /** 车辆品牌 */
  brand: string
  /** 车辆型号 */
  model: string
  /** 车辆图片 */
  images: string[]
  /** 日租金 */
  dailyPrice: number
  /** 车辆规格 */
  specifications: VehicleSpecifications
  /** 车辆描述 */
  description: string
  /** 车辆特色 */
  features: string[]
  /** 可用状态 */
  isAvailable: boolean
  /** 评分 */
  rating?: number
  /** 评价数 */
  reviewCount?: number
}

/**
 * 车辆列表项
 */
export interface VehicleListItem {
  /** 车辆ID */
  id: string
  /** 车辆名称 */
  name: string
  /** 车辆品牌 */
  brand: string
  /** 封面图 */
  coverImage: string
  /** 日租金 */
  dailyPrice: number
  /** 座位数 */
  seats: number
  /** 评分 */
  rating?: number
  /** 可用状态 */
  isAvailable: boolean
}

/**
 * 车辆筛选参数
 */
export interface VehicleFilterParams {
  /** 品牌 */
  brand?: string
  /** 座位数 */
  seats?: number
  /** 价格范围 */
  priceRange?: [number, number]
  /** 燃料类型 */
  fuelType?: string
  /** 变速箱类型 */
  transmission?: string
  /** 排序方式 */
  sortBy?: 'price' | 'rating' | 'popularity'
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
}
