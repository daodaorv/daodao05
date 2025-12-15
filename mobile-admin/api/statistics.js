/**
 * 数据统计相关API
 */
import { get } from '@/utils/request'
import mockStatistics from './mock/statistics'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 获取个人统计数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期 (today/week/month)
 */
export function getPersonalStatistics(params) {
  if (USE_MOCK) {
    return mockStatistics.getPersonalStatistics(params)
  }
  return get('/api/v1/statistics/personal', params)
}

/**
 * 获取团队统计数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期 (today/week/month)
 */
export function getTeamStatistics(params) {
  if (USE_MOCK) {
    return mockStatistics.getTeamStatistics(params)
  }
  return get('/api/v1/statistics/team', params)
}

/**
 * 获取车辆统计数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期 (today/week/month)
 */
export function getVehicleStatistics(params) {
  if (USE_MOCK) {
    return mockStatistics.getVehicleStatistics(params)
  }
  return get('/api/v1/statistics/vehicles', params)
}

/**
 * 获取收益统计数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期 (today/week/month)
 */
export function getRevenueStatistics(params) {
  if (USE_MOCK) {
    return mockStatistics.getRevenueStatistics(params)
  }
  return get('/api/v1/statistics/revenue', params)
}

export default {
  getPersonalStatistics,
  getTeamStatistics,
  getVehicleStatistics,
  getRevenueStatistics
}
