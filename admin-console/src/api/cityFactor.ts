/**
 * 城市因子相关API
 */

import type {
  CityTierListParams,
  CityTierListResponse,
  CityTier,
  UpdateCityTierRequest,
  CityFactorListParams,
  CityFactorListResponse,
  CityFactor,
  CityFactorFormData,
  CityListParams,
  CityListResponse
} from '@/types/cityFactor'

import {
  mockGetCityTierList,
  mockGetCityTierDetail,
  mockUpdateCityTier,
  mockGetCityFactorList,
  mockGetCityFactorDetail,
  mockCreateCityFactor,
  mockUpdateCityFactor,
  mockDeleteCityFactor,
  mockGetCityList
} from '@/mock/cityFactor'

/**
 * 获取城市分级列表
 */
export const getCityTierList = (params: CityTierListParams): Promise<CityTierListResponse> => {
  return mockGetCityTierList(params)
}

/**
 * 获取城市分级详情
 */
export const getCityTierDetail = (id: number): Promise<CityTier> => {
  return mockGetCityTierDetail(id)
}

/**
 * 修改城市分级
 */
export const updateCityTier = (id: number, data: UpdateCityTierRequest): Promise<CityTier> => {
  return mockUpdateCityTier(id, data)
}

/**
 * 获取自定义城市因子列表
 */
export const getCityFactorList = (params: CityFactorListParams): Promise<CityFactorListResponse> => {
  return mockGetCityFactorList(params)
}

/**
 * 获取自定义城市因子详情
 */
export const getCityFactorDetail = (id: number): Promise<CityFactor> => {
  return mockGetCityFactorDetail(id)
}

/**
 * 创建自定义城市因子
 */
export const createCityFactor = (data: CityFactorFormData): Promise<CityFactor> => {
  return mockCreateCityFactor(data)
}

/**
 * 更新自定义城市因子
 */
export const updateCityFactor = (id: number, data: CityFactorFormData): Promise<CityFactor> => {
  return mockUpdateCityFactor(id, data)
}

/**
 * 删除自定义城市因子
 */
export const deleteCityFactor = (id: number): Promise<void> => {
  return mockDeleteCityFactor(id)
}

/**
 * 获取城市列表
 */
export const getCityList = (params: CityListParams): Promise<CityListResponse> => {
  return mockGetCityList(params)
}
