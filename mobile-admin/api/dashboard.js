/**
 * 工作台相关API
 */
import { get, post } from '@/utils/request'
import mockDashboard from './mock/dashboard'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 获取工作台数据概览
 */
export function getDashboardOverview() {
  if (USE_MOCK) {
    return mockDashboard.getOverview()
  }
  return get('/api/v1/dashboard/overview')
}

/**
 * 获取待办任务列表
 */
export function getTodoList(params) {
  if (USE_MOCK) {
    return mockDashboard.getTodoList(params)
  }
  return get('/api/v1/dashboard/todos', params)
}

/**
 * 更新任务状态
 */
export function updateTodoStatus(id, status) {
  if (USE_MOCK) {
    return mockDashboard.updateTodoStatus(id, status)
  }
  return post(`/api/v1/dashboard/todos/${id}/status`, { status })
}

/**
 * 获取今日提醒
 */
export function getTodayReminders() {
  if (USE_MOCK) {
    return mockDashboard.getTodayReminders()
  }
  return get('/api/v1/dashboard/reminders')
}

export default {
  getDashboardOverview,
  getTodoList,
  updateTodoStatus,
  getTodayReminders
}
