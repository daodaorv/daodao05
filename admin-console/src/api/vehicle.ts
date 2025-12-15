/**
 * 车辆管理 API
 */
import request from '@/utils/request'
import {
  mockGetVehicleModels,
  mockGetVehicleModelDetail,
  mockCreateVehicleModel,
  mockUpdateVehicleModel,
  mockDeleteVehicleModel,
  mockChangeVehicleModelStatus,
  mockGetBrands,
  mockGetVehicles,
  mockGetVehicleDetail,
  mockCreateVehicle,
  mockUpdateVehicle,
  mockDeleteVehicle,
  mockChangeVehicleStatus,
  mockGetVehicleStatusStats,
  mockGetVehicleStatusHistory,
  mockCreateStatusHistory,
  type VehicleModel,
  type Vehicle,
  type VehicleStatusHistory,
} from '@/mock/vehicles'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.DEV

// ==================== 车型库管理 ====================

/**
 * 获取车型列表
 */
export const getVehicleModels = (params: {
  page?: number
  pageSize?: number
  brandId?: number | null
  keyword?: string
  vehicleType?: string
  status?: string
}) => {
  if (USE_MOCK) {
    return mockGetVehicleModels(params)
  }
  return request.get('/vehicles/models', { params })
}

/**
 * 获取车型详情
 */
export const getVehicleModelDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetVehicleModelDetail(id)
  }
  return request.get(`/vehicles/models/${id}`)
}

/**
 * 创建车型
 */
export const createVehicleModel = (data: Partial<VehicleModel>) => {
  if (USE_MOCK) {
    return mockCreateVehicleModel(data)
  }
  return request.post('/vehicles/models', data)
}

/**
 * 更新车型
 */
export const updateVehicleModel = (id: number, data: Partial<VehicleModel>) => {
  if (USE_MOCK) {
    return mockUpdateVehicleModel(id, data)
  }
  return request.put(`/vehicles/models/${id}`, data)
}

/**
 * 删除车型
 */
export const deleteVehicleModel = (id: number) => {
  if (USE_MOCK) {
    return mockDeleteVehicleModel(id)
  }
  return request.delete(`/vehicles/models/${id}`)
}

/**
 * 更改车型状态
 */
export const changeVehicleModelStatus = (id: number, status: 'active' | 'inactive') => {
  if (USE_MOCK) {
    return mockChangeVehicleModelStatus(id, status)
  }
  return request.put(`/vehicles/models/${id}/status`, { status })
}

/**
 * 获取品牌列表
 */
export const getBrands = () => {
  if (USE_MOCK) {
    return mockGetBrands()
  }
  return request.get('/vehicles/brands')
}

// ==================== 车辆管理 ====================

/**
 * 获取车辆列表
 */
export const getVehicles = (params: {
  page?: number
  pageSize?: number
  vehicleNumber?: string
  modelId?: number | null
  storeId?: number | null
  status?: string
  ownershipType?: string
  crowdfundingProjectId?: number | null
}) => {
  if (USE_MOCK) {
    return mockGetVehicles(params)
  }
  return request.get('/vehicles', { params })
}

/**
 * 获取车辆详情
 */
export const getVehicleDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetVehicleDetail(id)
  }
  return request.get(`/vehicles/${id}`)
}

/**
 * 创建车辆
 */
export const createVehicle = (data: Partial<Vehicle>) => {
  if (USE_MOCK) {
    return mockCreateVehicle(data)
  }
  return request.post('/vehicles', data)
}

/**
 * 更新车辆
 */
export const updateVehicle = (id: number, data: Partial<Vehicle>) => {
  if (USE_MOCK) {
    return mockUpdateVehicle(id, data)
  }
  return request.put(`/vehicles/${id}`, data)
}

/**
 * 删除车辆
 */
export const deleteVehicle = (id: number) => {
  if (USE_MOCK) {
    return mockDeleteVehicle(id)
  }
  return request.delete(`/vehicles/${id}`)
}

/**
 * 更改车辆状态
 */
export const changeVehicleStatus = (
  id: number,
  status: 'available' | 'rented' | 'maintenance' | 'repair' | 'retired'
) => {
  if (USE_MOCK) {
    return mockChangeVehicleStatus(id, status)
  }
  return request.put(`/vehicles/${id}/status`, { status })
}

// ==================== 车辆状态管理 ====================

/**
 * 获取车辆状态统计
 */
export const getVehicleStatusStats = () => {
  if (USE_MOCK) {
    return mockGetVehicleStatusStats()
  }
  return request.get('/vehicles/status/stats')
}

/**
 * 获取车辆状态历史
 */
export const getVehicleStatusHistory = (vehicleId: number) => {
  if (USE_MOCK) {
    return mockGetVehicleStatusHistory(vehicleId)
  }
  return request.get(`/vehicles/${vehicleId}/status/history`)
}

/**
 * 创建状态变更记录
 */
export const createStatusHistory = (data: {
  vehicleId: number
  newStatus: 'available' | 'rented' | 'maintenance' | 'repair' | 'retired'
  reason: string
  remark?: string
  estimatedRecoveryTime?: string
}) => {
  if (USE_MOCK) {
    return mockCreateStatusHistory(data)
  }
  return request.post(`/vehicles/${data.vehicleId}/status/history`, data)
}

// ==================== 维保管理 ====================

import {
  mockGetMaintenanceRecords,
  mockGetMaintenanceRecordDetail,
  mockCreateMaintenanceRecord,
  mockUpdateMaintenanceRecord,
  mockDeleteMaintenanceRecord,
  mockGetMaintenancePlans,
  mockGetMaintenanceStats,
  type MaintenanceRecord,
  type MaintenancePlan,
} from '@/mock/vehicles'

/**
 * 获取维保记录列表
 */
export const getMaintenanceRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  type?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  if (USE_MOCK) {
    return mockGetMaintenanceRecords(params)
  }
  return request.get('/vehicles/maintenance/records', { params })
}

/**
 * 获取维保记录详情
 */
export const getMaintenanceRecordDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetMaintenanceRecordDetail(id)
  }
  return request.get(`/vehicles/maintenance/records/${id}`)
}

/**
 * 创建维保记录
 */
export const createMaintenanceRecord = (data: Partial<MaintenanceRecord>) => {
  if (USE_MOCK) {
    return mockCreateMaintenanceRecord(data)
  }
  return request.post('/vehicles/maintenance/records', data)
}

/**
 * 更新维保记录
 */
export const updateMaintenanceRecord = (id: number, data: Partial<MaintenanceRecord>) => {
  if (USE_MOCK) {
    return mockUpdateMaintenanceRecord(id, data)
  }
  return request.put(`/vehicles/maintenance/records/${id}`, data)
}

/**
 * 删除维保记录
 */
export const deleteMaintenanceRecord = (id: number) => {
  if (USE_MOCK) {
    return mockDeleteMaintenanceRecord(id)
  }
  return request.delete(`/vehicles/maintenance/records/${id}`)
}

/**
 * 获取维保计划列表
 */
export const getMaintenancePlans = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  status?: string
}) => {
  if (USE_MOCK) {
    return mockGetMaintenancePlans(params)
  }
  return request.get('/vehicles/maintenance/plans', { params })
}

/**
 * 获取维保统计
 */
export const getMaintenanceStats = () => {
  if (USE_MOCK) {
    return mockGetMaintenanceStats()
  }
  return request.get('/vehicles/maintenance/stats')
}

// ==================== 保险管理 ====================

import {
  mockGetInsuranceRecords,
  mockGetInsuranceRecordDetail,
  mockCreateInsuranceRecord,
  mockUpdateInsuranceRecord,
  mockDeleteInsuranceRecord,
  mockGetClaimRecords,
  mockGetClaimRecordDetail,
  mockCreateClaimRecord,
  mockUpdateClaimRecord,
  mockGetRenewalReminders,
  mockGetInsuranceStats,
  type InsuranceRecord,
  type ClaimRecord,
  type RenewalReminder,
} from '@/mock/insurance'

/**
 * 获取保险记录列表
 */
export const getInsuranceRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  insuranceType?: string
  status?: string
  insuranceCompany?: string
}) => {
  if (USE_MOCK) {
    return mockGetInsuranceRecords(params)
  }
  return request.get('/vehicles/insurance/records', { params })
}

/**
 * 获取保险记录详情
 */
export const getInsuranceRecordDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetInsuranceRecordDetail(id)
  }
  return request.get(`/vehicles/insurance/records/${id}`)
}

/**
 * 创建保险记录
 */
export const createInsuranceRecord = (data: Partial<InsuranceRecord>) => {
  if (USE_MOCK) {
    return mockCreateInsuranceRecord(data)
  }
  return request.post('/vehicles/insurance/records', data)
}

/**
 * 更新保险记录
 */
export const updateInsuranceRecord = (id: number, data: Partial<InsuranceRecord>) => {
  if (USE_MOCK) {
    return mockUpdateInsuranceRecord(id, data)
  }
  return request.put(`/vehicles/insurance/records/${id}`, data)
}

/**
 * 删除保险记录
 */
export const deleteInsuranceRecord = (id: number) => {
  if (USE_MOCK) {
    return mockDeleteInsuranceRecord(id)
  }
  return request.delete(`/vehicles/insurance/records/${id}`)
}

/**
 * 获取理赔记录列表
 */
export const getClaimRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  if (USE_MOCK) {
    return mockGetClaimRecords(params)
  }
  return request.get('/vehicles/insurance/claims', { params })
}

/**
 * 获取理赔记录详情
 */
export const getClaimRecordDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetClaimRecordDetail(id)
  }
  return request.get(`/vehicles/insurance/claims/${id}`)
}

/**
 * 创建理赔记录
 */
export const createClaimRecord = (data: Partial<ClaimRecord>) => {
  if (USE_MOCK) {
    return mockCreateClaimRecord(data)
  }
  return request.post('/vehicles/insurance/claims', data)
}

/**
 * 更新理赔记录
 */
export const updateClaimRecord = (id: number, data: Partial<ClaimRecord>) => {
  if (USE_MOCK) {
    return mockUpdateClaimRecord(id, data)
  }
  return request.put(`/vehicles/insurance/claims/${id}`, data)
}

/**
 * 获取续保提醒列表
 */
export const getRenewalReminders = (params: {
  page?: number
  pageSize?: number
  status?: string
  daysThreshold?: number
}) => {
  if (USE_MOCK) {
    return mockGetRenewalReminders(params)
  }
  return request.get('/vehicles/insurance/renewals', { params })
}

/**
 * 获取保险统计
 */
export const getInsuranceStats = () => {
  if (USE_MOCK) {
    return mockGetInsuranceStats()
  }
  return request.get('/vehicles/insurance/stats')
}

// ==================== 违章管理 ====================

import {
  mockGetViolationRecords,
  mockGetViolationRecordDetail,
  mockCreateViolationRecord,
  mockUpdateViolationRecord,
  mockDeleteViolationRecord,
  mockProcessViolation,
  mockGetViolationStats,
  type ViolationRecord,
  type ViolationStats,
} from '@/mock/violation'

/**
 * 获取违章记录列表
 */
export const getViolationRecords = (params: {
  page?: number
  pageSize?: number
  vehicleId?: number | null
  vehicleNumber?: string
  violationType?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  if (USE_MOCK) {
    return mockGetViolationRecords(params)
  }
  return request.get('/vehicles/violations/records', { params })
}

/**
 * 获取违章记录详情
 */
export const getViolationRecordDetail = (id: number) => {
  if (USE_MOCK) {
    return mockGetViolationRecordDetail(id)
  }
  return request.get(`/vehicles/violations/records/${id}`)
}

/**
 * 创建违章记录
 */
export const createViolationRecord = (data: Partial<ViolationRecord>) => {
  if (USE_MOCK) {
    return mockCreateViolationRecord(data)
  }
  return request.post('/vehicles/violations/records', data)
}

/**
 * 更新违章记录
 */
export const updateViolationRecord = (id: number, data: Partial<ViolationRecord>) => {
  if (USE_MOCK) {
    return mockUpdateViolationRecord(id, data)
  }
  return request.put(`/vehicles/violations/records/${id}`, data)
}

/**
 * 删除违章记录
 */
export const deleteViolationRecord = (id: number) => {
  if (USE_MOCK) {
    return mockDeleteViolationRecord(id)
  }
  return request.delete(`/vehicles/violations/records/${id}`)
}

/**
 * 处理违章
 */
export const processViolation = (
  id: number,
  data: {
    processDate: string
    paymentDate?: string
    paymentMethod?: string
    handler: string
    remark?: string
  }
) => {
  if (USE_MOCK) {
    return mockProcessViolation(id, data)
  }
  return request.post(`/vehicles/violations/records/${id}/process`, data)
}

/**
 * 获取违章统计
 */
export const getViolationStats = () => {
  if (USE_MOCK) {
    return mockGetViolationStats()
  }
  return request.get('/vehicles/violations/stats')
}

// 导出类型
export type {
  VehicleModel,
  Vehicle,
  VehicleStatusHistory,
  MaintenanceRecord,
  MaintenancePlan,
  InsuranceRecord,
  ClaimRecord,
  RenewalReminder,
  ViolationRecord,
  ViolationStats,
}
