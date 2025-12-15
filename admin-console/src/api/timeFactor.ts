/**
 * 时间因子相关API
 */

import type {
  NationalHolidayListParams,
  NationalHolidayListResponse,
  NationalHoliday,
  NationalHolidayFormData,
  SyncNationalHolidayRequest,
  SyncNationalHolidayResponse,
  YearListResponse,
  CustomTimeRuleListParams,
  CustomTimeRuleListResponse,
  CustomTimeRule,
  CustomTimeRuleFormData,
  TimeFactorCalendarParams,
  TimeFactorCalendarResponse
} from '@/types/timeFactor'

import {
  mockGetNationalHolidayList,
  mockGetNationalHolidayDetail,
  mockCreateNationalHoliday,
  mockUpdateNationalHoliday,
  mockDeleteNationalHoliday,
  mockSyncNationalHoliday,
  mockGetYearList,
  mockGetCustomTimeRuleList,
  mockGetCustomTimeRuleDetail,
  mockCreateCustomTimeRule,
  mockUpdateCustomTimeRule,
  mockDeleteCustomTimeRule,
  mockGetTimeFactorCalendar
} from '@/mock/timeFactor'

/**
 * 获取法定节假日列表
 */
export const getNationalHolidayList = (params: NationalHolidayListParams): Promise<NationalHolidayListResponse> => {
  return mockGetNationalHolidayList(params)
}

/**
 * 获取法定节假日详情
 */
export const getNationalHolidayDetail = (id: number): Promise<NationalHoliday> => {
  return mockGetNationalHolidayDetail(id)
}

/**
 * 创建法定节假日
 */
export const createNationalHoliday = (data: NationalHolidayFormData): Promise<NationalHoliday> => {
  return mockCreateNationalHoliday(data)
}

/**
 * 更新法定节假日
 */
export const updateNationalHoliday = (id: number, data: NationalHolidayFormData): Promise<NationalHoliday> => {
  return mockUpdateNationalHoliday(id, data)
}

/**
 * 删除法定节假日
 */
export const deleteNationalHoliday = (id: number): Promise<void> => {
  return mockDeleteNationalHoliday(id)
}

/**
 * 同步法定节假日
 */
export const syncNationalHoliday = (data: SyncNationalHolidayRequest): Promise<SyncNationalHolidayResponse> => {
  return mockSyncNationalHoliday(data)
}

/**
 * 获取年份列表
 */
export const getYearList = (): Promise<YearListResponse> => {
  return mockGetYearList()
}

/**
 * 获取自定义时间规则列表
 */
export const getCustomTimeRuleList = (params: CustomTimeRuleListParams): Promise<CustomTimeRuleListResponse> => {
  return mockGetCustomTimeRuleList(params)
}

/**
 * 获取自定义时间规则详情
 */
export const getCustomTimeRuleDetail = (id: number): Promise<CustomTimeRule> => {
  return mockGetCustomTimeRuleDetail(id)
}

/**
 * 创建自定义时间规则
 */
export const createCustomTimeRule = (data: CustomTimeRuleFormData): Promise<CustomTimeRule> => {
  return mockCreateCustomTimeRule(data)
}

/**
 * 更新自定义时间规则
 */
export const updateCustomTimeRule = (id: number, data: CustomTimeRuleFormData): Promise<CustomTimeRule> => {
  return mockUpdateCustomTimeRule(id, data)
}

/**
 * 删除自定义时间规则
 */
export const deleteCustomTimeRule = (id: number): Promise<void> => {
  return mockDeleteCustomTimeRule(id)
}

/**
 * 获取时间因子日历
 */
export const getTimeFactorCalendar = (params: TimeFactorCalendarParams): Promise<TimeFactorCalendarResponse> => {
  return mockGetTimeFactorCalendar(params)
}
