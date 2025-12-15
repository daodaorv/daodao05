/**
 * 车型价格管理相关类型定义
 */

/**
 * 车型价格分组
 * 用途：批量管理同类车型的基础价格
 */
export interface VehicleModelPriceGroup {
  id: number
  groupName: string // 分组名称（如："经济型¥500/天"、"豪华型¥800/天"）
  groupCode: string // 分组编码（如："economy"、"luxury"）
  basePrice: number // 分组基础价格
  vehicleTypes: string[] // 适用车型类型（可多选）
  description: string // 描述
  vehicleCount: number // 组内车型数量
  status: 'active' | 'inactive'
  createdBy: string
  createdAt: string
  updatedAt: string
}

/**
 * 车型价格分组列表项
 */
export interface VehicleModelPriceGroupListItem extends VehicleModelPriceGroup {
  // 可扩展字段
}

/**
 * 车型价格分组表单数据
 */
export interface VehicleModelPriceGroupFormData {
  groupName: string
  groupCode: string
  vehicleTypes: string[]
  basePrice: number
  description: string
}

/**
 * 价格变更类型
 */
export type PriceChangeType = 'manual' | 'group_sync' | 'batch'

/**
 * 车型价格变更历史
 * 用途：审计追踪，记录每次价格调整
 */
export interface VehicleModelPriceHistory {
  id: number
  modelId: number // 车型ID
  modelName: string // 车型名称
  oldPrice: number // 原价格
  newPrice: number // 新价格
  changeType: PriceChangeType // 变更类型
  changeReason: string // 变更原因
  remark?: string // 备注
  changedBy: string // 变更人
  changedAt: string // 变更时间
}

/**
 * 车型价格变更历史列表查询参数
 */
export interface VehicleModelPriceHistoryListParams {
  page?: number
  pageSize?: number
  modelId?: number
  startDate?: string
  endDate?: string
  changeType?: PriceChangeType
  operatorId?: number
  keyword?: string
}

/**
 * 车型价格变更历史列表响应
 */
export interface VehicleModelPriceHistoryListResponse {
  list: VehicleModelPriceHistory[]
  total: number
  page: number
  pageSize: number
}

/**
 * 车型价格分组列表查询参数
 */
export interface VehicleModelPriceGroupListParams {
  page?: number
  pageSize?: number
  status?: 'active' | 'inactive'
  vehicleType?: string
  keyword?: string
}

/**
 * 车型价格分组列表响应
 */
export interface VehicleModelPriceGroupListResponse {
  list: VehicleModelPriceGroupListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 更新车型价格请求
 */
export interface UpdateModelPriceRequest {
  modelId: number
  newPrice: number
  changeReason: string
  remark?: string
}

/**
 * 更新车型价格响应
 */
export interface UpdateModelPriceResponse {
  success: boolean
  data: {
    model: any // VehicleModel 类型在 vehicles.ts 中定义
    priceHistory: VehicleModelPriceHistory
  }
  message: string
}

/**
 * 批量调价方式
 */
export type BatchAdjustType = 'percentage' | 'fixed' | 'unified'

/**
 * 批量更新车型价格请求
 */
export interface BatchUpdatePriceRequest {
  modelIds: number[]
  adjustType: BatchAdjustType
  adjustValue: number
  changeReason: string
  remark?: string
}

/**
 * 批量更新车型价格响应
 */
export interface BatchUpdatePriceResponse {
  success: boolean
  data: {
    successCount: number
    failureCount: number
    successModels: any[] // VehicleModel[]
    failureModels: Array<{
      modelId: number
      modelName: string
      reason: string
    }>
    priceHistories: VehicleModelPriceHistory[]
  }
  message: string
}

/**
 * 创建价格分组请求
 */
export interface CreatePriceGroupRequest {
  groupName: string
  groupCode: string
  vehicleTypes: string[]
  basePrice: number
  description?: string
}

/**
 * 创建价格分组响应
 */
export interface CreatePriceGroupResponse {
  success: boolean
  data: VehicleModelPriceGroup
  message: string
}

/**
 * 车型加入分组请求
 */
export interface JoinPriceGroupRequest {
  modelIds: number[]
  groupId: number
}

/**
 * 车型加入分组响应
 */
export interface JoinPriceGroupResponse {
  success: boolean
  data: {
    successCount: number
    skippedCount: number
    updatedModels: any[] // VehicleModel[]
    priceHistories: VehicleModelPriceHistory[]
    group: VehicleModelPriceGroup
  }
  message: string
}

/**
 * 更新分组价格请求
 */
export interface UpdateGroupPriceRequest {
  groupId: number
  newPrice: number
  changeReason: string
  remark?: string
}

/**
 * 更新分组价格响应
 */
export interface UpdateGroupPriceResponse {
  success: boolean
  data: {
    group: VehicleModelPriceGroup
    affectedCount: number
    updatedModels: any[] // VehicleModel[]
    priceHistories: VehicleModelPriceHistory[]
  }
  message: string
}

/**
 * 车型脱离分组请求
 */
export interface LeaveGroupRequest {
  modelId: number
}

/**
 * 车型脱离分组响应
 */
export interface LeaveGroupResponse {
  success: boolean
  data: {
    model: any // VehicleModel
    priceHistory: VehicleModelPriceHistory
    group: VehicleModelPriceGroup
  }
  message: string
}
