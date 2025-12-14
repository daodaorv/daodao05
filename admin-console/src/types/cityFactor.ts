/**
 * 城市因子相关类型定义
 */

/**
 * 调整方式
 */
export type AdjustmentType = 'percentage' | 'fixed'

/**
 * 城市分级状态
 */
export type CityTierStatus = 'active' | 'inactive'

/**
 * 城市因子状态
 */
export type CityFactorStatus = 'active' | 'inactive'

/**
 * 城市分级
 */
export interface CityTier {
  id: number
  tierName: string // 分级名称（如：一线城市、二线城市）
  tierLevel: number // 分级等级（1-5）
  adjustmentType: AdjustmentType // 调整方式
  adjustmentValue: number // 调整值
  description: string // 描述
  status: CityTierStatus // 状态
  cityCount: number // 城市数量
  createdAt: string
  updatedAt: string
}

/**
 * 城市分级列表项
 */
export interface CityTierListItem extends CityTier {
  cities?: City[] // 关联的城市列表
}

/**
 * 城市分级表单数据
 */
export interface CityTierFormData {
  tierName: string
  tierLevel: number
  adjustmentType: AdjustmentType
  adjustmentValue: number
  description: string
  status: CityTierStatus
}

/**
 * 城市信息
 */
export interface City {
  id: number
  name: string // 城市名称
  provinceId: number // 省份ID
  provinceName: string // 省份名称
  tierId?: number // 所属分级ID
  tierName?: string // 所属分级名称
  isHot: boolean // 是否热门城市
  sortOrder: number // 排序
}

/**
 * 自定义城市因子
 */
export interface CityFactor {
  id: number
  factorName: string // 因子名称
  cityIds: number[] // 关联城市ID列表
  cityNames: string[] // 关联城市名称列表
  priority: number // 优先级（1-10，数字越大优先级越高）
  adjustmentType: AdjustmentType // 调整方式
  adjustmentValue: number // 调整值
  startDate: string // 生效日期
  endDate: string // 失效日期
  status: CityFactorStatus // 状态
  remark: string // 备注
  createdBy: string // 创建人
  createdAt: string
  updatedAt: string
}

/**
 * 自定义城市因子列表项
 */
export interface CityFactorListItem extends CityFactor {}

/**
 * 自定义城市因子表单数据
 */
export interface CityFactorFormData {
  factorName: string
  cityIds: number[]
  priority: number
  adjustmentType: AdjustmentType
  adjustmentValue: number
  startDate: string
  endDate: string
  status: CityFactorStatus
  remark: string
}

/**
 * 城市分级列表查询参数
 */
export interface CityTierListParams {
  page?: number
  pageSize?: number
  status?: CityTierStatus
  tierLevel?: number
  keyword?: string
}

/**
 * 城市因子列表查询参数
 */
export interface CityFactorListParams {
  page?: number
  pageSize?: number
  status?: CityFactorStatus
  cityId?: number
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 城市列表查询参数
 */
export interface CityListParams {
  page?: number
  pageSize?: number
  provinceId?: number
  tierId?: number
  isHot?: boolean
  keyword?: string
}

/**
 * 城市分级列表响应
 */
export interface CityTierListResponse {
  list: CityTierListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 城市因子列表响应
 */
export interface CityFactorListResponse {
  list: CityFactorListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 城市列表响应
 */
export interface CityListResponse {
  list: City[]
  total: number
  page: number
  pageSize: number
}

/**
 * 修改城市分级请求数据
 */
export interface UpdateCityTierRequest {
  adjustmentType: AdjustmentType
  adjustmentValue: number
  changeReason: string // 变更原因
  status?: CityTierStatus
}
