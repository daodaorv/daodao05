/**
 * 门店管理 API
 */
import request from '@/utils/request'
import {
  mockGetStoreList,
  mockGetStoreDetail,
  mockCreateStore,
  mockUpdateStore,
  mockDeleteStore,
  mockGetStoreStats,
  mockGetCityList,
  mockGetRegionList,
  type Store,
  type StoreListParams,
  type CreateStoreParams,
  type UpdateStoreParams,
  type StoreStats,
  type City,
  type Region
} from '@/mock/stores'

// 导出类型
export type {
  Store,
  StoreListParams,
  CreateStoreParams,
  UpdateStoreParams,
  StoreStats,
  City,
  Region
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
export const getCityList = () => {
  // return request.get('/cities')
  return mockGetCityList()
}

/**
 * 获取区域列表
 */
export const getRegionList = () => {
  // return request.get('/regions')
  return mockGetRegionList()
}
