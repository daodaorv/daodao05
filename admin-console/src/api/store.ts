/**
 * 门店管理 API
 */
import {
  mockGetStoreList,
  mockGetStoreDetail,
  mockCreateStore,
  mockUpdateStore,
  mockDeleteStore,
  mockGetStoreStats,
  mockGetCityList,
  mockGetRegionList,
  mockGetCityTierList,
  mockGetStoreSpecialServices,
  mockCreateStoreSpecialService,
  mockUpdateStoreSpecialService,
  mockDeleteStoreSpecialService,
  type Store,
  type StoreListParams,
  type CreateStoreParams,
  type UpdateStoreParams,
  type StoreStats,
  type City,
  type Region,
  type CityTier,
  type CityListParams,
  type StoreSpecialService
} from '@/mock/stores'

// 导出类型
export type {
  Store,
  StoreListParams,
  CreateStoreParams,
  UpdateStoreParams,
  StoreStats,
  City,
  Region,
  CityTier,
  CityListParams,
  StoreSpecialService
}

/**
 * 获取门店列表
 */
export const getStoreList = (params: StoreListParams) => {
  // return request.get('/stores', { params })
  return mockGetStoreList(params)
}

/**
 * 获取门店详情
 */
export const getStoreDetail = (id: number) => {
  // return request.get(`/stores/${id}`)
  return mockGetStoreDetail(id)
}

/**
 * 创建门店
 */
export const createStore = (data: CreateStoreParams) => {
  // return request.post('/stores', data)
  return mockCreateStore(data)
}

/**
 * 更新门店
 */
export const updateStore = (id: number, data: UpdateStoreParams) => {
  // return request.put(`/stores/${id}`, data)
  return mockUpdateStore(id, data)
}

/**
 * 删除门店
 */
export const deleteStore = (id: number) => {
  // return request.delete(`/stores/${id}`)
  return mockDeleteStore(id)
}

/**
 * 获取门店统计
 */
export const getStoreStats = () => {
  // return request.get('/stores/stats')
  return mockGetStoreStats()
}

/**
 * 获取城市列表
 */
export const getCityList = (params?: CityListParams) => {
  // return request.get('/cities', { params })
  return mockGetCityList(params)
}

/**
 * 获取区域列表
 */
export const getRegionList = () => {
  // return request.get('/regions')
  return mockGetRegionList()
}

/**
 * 获取城市分级列表
 */
export const getCityTierList = () => {
  // return request.get('/city-tiers')
  return mockGetCityTierList()
}

// ==================== 门店特色服务 ====================

/**
 * 获取门店特色服务列表
 */
export const getStoreSpecialServices = (storeId: number) => {
  // return request.get(`/stores/${storeId}/special-services`)
  return mockGetStoreSpecialServices(storeId)
}

/**
 * 创建门店特色服务
 */
export const createStoreSpecialService = (storeId: number, data: Partial<StoreSpecialService>) => {
  // return request.post(`/stores/${storeId}/special-services`, data)
  return mockCreateStoreSpecialService(storeId, data)
}

/**
 * 更新门店特色服务
 */
export const updateStoreSpecialService = (
  storeId: number,
  serviceId: number,
  data: Partial<StoreSpecialService>
) => {
  // return request.put(`/stores/${storeId}/special-services/${serviceId}`, data)
  return mockUpdateStoreSpecialService(storeId, serviceId, data)
}

/**
 * 删除门店特色服务
 */
export const deleteStoreSpecialService = (storeId: number, serviceId: number) => {
  // return request.delete(`/stores/${storeId}/special-services/${serviceId}`)
  return mockDeleteStoreSpecialService(storeId, serviceId)
}
