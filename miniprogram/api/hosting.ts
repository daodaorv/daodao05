import { get, post } from '@/utils/request'
import mockHosting from './mock/hosting'
import type {
  OldCarApplicationData,
  NewCarApplicationData,
  SelfUseApplicationData,
  IncomeDetailParams,
  WithdrawData,
  ModelBookingData
} from '@/types/hosting'

const USE_MOCK = true // 开发环境使用Mock数据

/**
 * 托管中心API
 */

// 获取托管收益数据
export const getHostingIncome = () => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getHostingIncome())
  }
  return get('/hosting/income')
}

// 获取托管车辆列表
export const getHostingVehicles = () => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getHostingVehicles())
  }
  return get('/hosting/vehicles')
}

// 提交自有车托管申请
export const submitOldCarApplication = (data: OldCarApplicationData) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.submitOldCarApplication(data))
  }
  return post('/hosting/old-car/apply', data)
}

// 提交购车托管申请
export const submitNewCarApplication = (data: NewCarApplicationData) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.submitNewCarApplication(data))
  }
  return post('/hosting/new-car/apply', data)
}

// 申请车主自用
export const applySelfUse = (data: SelfUseApplicationData) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.applySelfUse(data))
  }
  return post('/hosting/self-use/apply', data)
}

// 获取收益明细
export const getIncomeDetail = (params: IncomeDetailParams) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getIncomeDetail(params))
  }
  return get('/hosting/income/detail', params)
}

// 提现
export const withdrawIncome = (data: WithdrawData) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.withdrawIncome(data))
  }
  return post('/hosting/withdraw', data)
}

// 获取车辆详情
export const getVehicleDetail = (id: number) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getVehicleDetail(id))
  }
  return get(`/hosting/vehicles/${id}`)
}

// 获取热门车型列表
export const getPopularModels = () => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getPopularModels())
  }
  return get('/hosting/models/popular')
}

// 获取车型详情
export const getModelDetail = (id: number) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getModelDetail(id))
  }
  return get(`/hosting/models/${id}`)
}

// 提交购车预定
export const submitModelBooking = (data: ModelBookingData) => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.submitModelBooking(data))
  }
  return post('/hosting/models/booking', data)
}

// 获取门店列表
export const getStoreList = () => {
  if (USE_MOCK) {
    return Promise.resolve(mockHosting.getStoreList())
  }
  return get('/hosting/stores')
}

export default {
  getHostingIncome,
  getHostingVehicles,
  submitOldCarApplication,
  submitNewCarApplication,
  applySelfUse,
  getIncomeDetail,
  withdrawIncome,
  getVehicleDetail,
  getPopularModels,
  getModelDetail,
  submitModelBooking,
  getStoreList
}
