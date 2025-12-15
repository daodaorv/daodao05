/**
 * 车辆调度相关API
 */
import { get, post, put } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * Mock数据
 */
const mockData = {
  vehicles: [
    {
      id: 1,
      name: '大通V90房车',
      plate: '京A12345',
      status: 'available',
      location: '北京门店',
      lastUpdateTime: '2025-12-06 15:30:00',
      latitude: 39.9042,
      longitude: 116.4074,
      mileage: 15000
    }
  ],
  tasks: [
    {
      id: 1,
      title: '大通V90房车调度任务',
      vehicleId: 1,
      vehicleName: '大通V90房车',
      vehiclePlate: '京A12345',
      fromLocation: '北京门店',
      toLocation: '上海门店',
      status: 'pending',
      createTime: '2025-12-06 10:00:00'
    }
  ],
  drivers: [
    { id: 1, name: '张三', phone: '13800138001', available: true, statusText: '空闲中' }
  ],
  stats: { pending: 5, inProgress: 3, completed: 12 }
}

export function getAvailableVehicles(params = {}) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, list: mockData.vehicles, total: mockData.vehicles.length })
  }
  return get('/api/v1/dispatch/vehicles', params)
}

export function getDispatchTasks(params = {}) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, list: mockData.tasks, total: mockData.tasks.length })
  }
  return get('/api/v1/dispatch/tasks', params)
}

export function getDispatchStats() {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockData.stats })
  }
  return get('/api/v1/dispatch/stats')
}

export function createDispatchTask(data) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, message: '创建成功', data })
  }
  return post('/api/v1/dispatch/tasks', data)
}

export function updateTaskStatus(taskId, status) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, message: '更新成功' })
  }
  return put(`/api/v1/dispatch/tasks/${taskId}/status`, { status })
}

export function getAvailableDrivers() {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { list: mockData.drivers } })
  }
  return get('/api/v1/dispatch/drivers')
}

export function assignDispatchDriver(data) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, message: '分配成功' })
  }
  return post('/api/v1/dispatch/assign', data)
}

export function completeDispatchTask(taskId) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, message: '任务已完成' })
  }
  return put(`/api/v1/dispatch/tasks/${taskId}/complete`)
}

export function cancelDispatchTask(taskId) {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, message: '任务已取消' })
  }
  return put(`/api/v1/dispatch/tasks/${taskId}/cancel`)
}

export function getDispatchList(params = {}) {
  if (USE_MOCK) {
    const tasks = mockData.tasks.map(task => ({
      ...task,
      statusText: task.status === 'pending' ? '待调度' : '调度中',
      typeText: '车辆调度',
      vehicle: { id: task.vehicleId, name: task.vehicleName, plate: task.vehiclePlate, image: '/static/images/vehicle.jpg' },
      distance: 1200,
      scheduledTime: task.createTime
    }))
    return Promise.resolve({ code: 200, data: { list: tasks, total: tasks.length } })
  }
  return get('/api/v1/dispatch/list', params)
}

export function getVehicleLocation(vehicleId) {
  if (USE_MOCK) {
    const vehicle =
      mockData.vehicles.find(item => String(item.id) === String(vehicleId)) ||
      mockData.vehicles[0]
    return Promise.resolve({ code: 200, ...vehicle })
  }
  return get(`/api/v1/dispatch/vehicles/${vehicleId}/location`)
}

export function getVehicleTrack(vehicleId, params = {}) {
  if (USE_MOCK) {
    const list = Array.from({ length: 6 }).map((_, index) => {
      const baseTime = Date.now() - index * 60 * 60 * 1000
      return {
        id: index + 1,
        vehicleId,
        time: new Date(baseTime).toISOString(),
        location: `杭州西湖区灵隐路${10 + index}号`,
        speed: Math.max(15, 60 - index * 5)
      }
    })
    return Promise.resolve({ code: 200, list, total: list.length })
  }
  return get(`/api/v1/dispatch/vehicles/${vehicleId}/track`, params)
}

export default {
  getAvailableVehicles,
  getDispatchTasks,
  getDispatchStats,
  createDispatchTask,
  updateTaskStatus,
  getAvailableDrivers,
  assignDispatchDriver,
  completeDispatchTask,
  cancelDispatchTask,
  getDispatchList,
  getVehicleLocation,
  getVehicleTrack
}
