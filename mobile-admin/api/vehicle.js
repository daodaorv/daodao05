/**
 * 车辆相关API
 */
import { get, post, put } from '@/utils/request'
import mockVehicle from './mock/vehicle'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 获取车辆列表
 */
export function getVehicleList(params) {
  if (USE_MOCK) {
    return mockVehicle.getVehicleList(params)
  }
  return get('/api/v1/vehicles', params)
}

/**
 * 获取车辆详情
 */
export function getVehicleDetail(id) {
  if (USE_MOCK) {
    return mockVehicle.getVehicleDetail(id)
  }
  return get(`/api/v1/vehicles/${id}`)
}

/**
 * 更新车辆状态
 */
export function updateVehicleStatus(id, status, remark) {
  if (USE_MOCK) {
    return mockVehicle.updateVehicleStatus(id, status, remark)
  }
  return put(`/api/v1/vehicles/${id}/status`, { status, remark })
}

/**
 * 添加维保记录
 */
export function addMaintenanceRecord(id, data) {
  if (USE_MOCK) {
    return mockVehicle.addMaintenanceRecord(id, data)
  }
  return post(`/api/v1/vehicles/${id}/maintenance`, data)
}

/**
 * 获取维保记录
 */
export function getMaintenanceRecords(id) {
  if (USE_MOCK) {
    return mockVehicle.getMaintenanceRecords(id)
  }
  return get(`/api/v1/vehicles/${id}/maintenance`)
}

/**
 * 上传车辆照片
 */
export function uploadVehiclePhotos(data) {
  if (USE_MOCK) {
    return mockVehicle.uploadVehiclePhotos(data)
  }
  const vehicleId = data?.vehicleId
  const url = vehicleId ? `/api/v1/vehicles/${vehicleId}/photos` : '/api/v1/vehicles/photos'
  return post(url, data)
}

/**
 * 获取车辆照片上传历史
 */
export function getUploadHistory(params = {}) {
  if (USE_MOCK) {
    return mockVehicle.getUploadHistory(params)
  }
  const vehicleId = params?.vehicleId
  const url = vehicleId ? `/api/v1/vehicles/${vehicleId}/photos/history` : '/api/v1/vehicles/photos/history'
  return get(url, params)
}

export default {
  getVehicleList,
  getVehicleDetail,
  updateVehicleStatus,
  addMaintenanceRecord,
  getMaintenanceRecords,
  uploadVehiclePhotos,
  getUploadHistory
}
