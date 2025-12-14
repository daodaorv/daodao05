/**
 * 车型价格管理 API 接口
 */

import type {
  VehicleModelPriceGroupListParams,
  VehicleModelPriceHistoryListParams,
  UpdateModelPriceRequest,
  BatchUpdatePriceRequest,
  CreatePriceGroupRequest,
  JoinPriceGroupRequest,
  UpdateGroupPriceRequest,
  LeaveGroupRequest,
  VehicleModelPriceGroup,
} from '../types/vehicleModel'

import {
  mockGetPriceGroups,
  mockGetPriceGroupDetail,
  mockCreatePriceGroup,
  mockUpdatePriceGroup,
  mockDeletePriceGroup,
  mockGetPriceHistory,
  mockUpdateModelPrice,
  mockBatchUpdatePrice,
  mockJoinPriceGroup,
  mockUpdateGroupPrice,
  mockLeaveGroup,
} from '../mock/vehicleModelPrice'

/**
 * 获取价格分组列表
 */
export const getPriceGroups = (params: VehicleModelPriceGroupListParams) => {
  return mockGetPriceGroups(params)
}

/**
 * 获取价格分组详情
 */
export const getPriceGroupDetail = (id: number) => {
  return mockGetPriceGroupDetail(id)
}

/**
 * 创建价格分组
 */
export const createPriceGroup = (data: CreatePriceGroupRequest) => {
  return mockCreatePriceGroup(data)
}

/**
 * 更新价格分组
 */
export const updatePriceGroup = (id: number, data: Partial<VehicleModelPriceGroup>) => {
  return mockUpdatePriceGroup(id, data)
}

/**
 * 删除价格分组
 */
export const deletePriceGroup = (id: number) => {
  return mockDeletePriceGroup(id)
}

/**
 * 获取价格历史记录列表
 */
export const getPriceHistory = (params: VehicleModelPriceHistoryListParams) => {
  return mockGetPriceHistory(params)
}

/**
 * 更新车型价格
 */
export const updateModelPrice = (data: UpdateModelPriceRequest) => {
  return mockUpdateModelPrice(data)
}

/**
 * 批量更新车型价格
 */
export const batchUpdatePrice = (data: BatchUpdatePriceRequest) => {
  return mockBatchUpdatePrice(data)
}

/**
 * 车型加入分组
 */
export const joinPriceGroup = (data: JoinPriceGroupRequest) => {
  return mockJoinPriceGroup(data)
}

/**
 * 更新分组价格
 */
export const updateGroupPrice = (data: UpdateGroupPriceRequest) => {
  return mockUpdateGroupPrice(data)
}

/**
 * 车型脱离分组
 */
export const leaveGroup = (data: LeaveGroupRequest) => {
  return mockLeaveGroup(data)
}
