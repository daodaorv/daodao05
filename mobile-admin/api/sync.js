/**
 * 数据同步相关API
 */
import { get, post, put } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * Mock数据
 */
const mockData = {
  status: {
    status: 'idle',
    lastSyncTime: '2025-12-06 15:30:00',
    queueSize: 5,
    syncing: false,
    autoSyncEnabled: true,
    networkOnline: true
  },
  stats: {
    totalCount: 156,
    successCount: 148,
    failCount: 8,
    pendingCount: 5
  },
  config: {
    autoSync: true,
    wifiOnly: false,
    syncInterval: 5,
    notification: true,
    dataTypes: {
      order: true,
      vehicle: true,
      hosting: true,
      message: true,
      photo: true
    }
  },
  history: [
    {
      id: 1,
      type: '订单数据',
      status: 'success',
      time: '2025-12-06 15:30:00',
      detail: '成功同步 3 条订单数据'
    },
    {
      id: 2,
      type: '车辆数据',
      status: 'success',
      time: '2025-12-06 14:15:00',
      detail: '成功同步 2 条车辆数据'
    },
    {
      id: 3,
      type: '照片数据',
      status: 'failed',
      time: '2025-12-06 13:00:00',
      detail: '同步失败：网络连接超时'
    },
    {
      id: 4,
      type: '消息数据',
      status: 'success',
      time: '2025-12-06 12:30:00',
      detail: '成功同步 5 条消息数据'
    },
    {
      id: 5,
      type: '托管数据',
      status: 'success',
      time: '2025-12-06 11:00:00',
      detail: '成功同步 1 条托管数据'
    }
  ]
}

/**
 * 获取同步状态
 * @returns {Promise}
 */
export function getSyncStatus() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: mockData.status
    })
  }
  return get('/api/v1/sync/status')
}

/**
 * 获取同步统计
 * @returns {Promise}
 */
export function getSyncStats() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: mockData.stats
    })
  }
  return get('/api/v1/sync/stats')
}

/**
 * 获取同步配置
 * @returns {Promise}
 */
export function getSyncConfig() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: mockData.config
    })
  }
  return get('/api/v1/sync/config')
}

/**
 * 更新同步配置
 * @param {Object} config - 同步配置
 * @returns {Promise}
 */
export function updateSyncConfig(config) {
  if (USE_MOCK) {
    mockData.config = { ...mockData.config, ...config }
    return Promise.resolve({
      code: 200,
      message: '更新成功',
      data: mockData.config
    })
  }
  return put('/api/v1/sync/config', config)
}

/**
 * 开始手动同步
 * @returns {Promise}
 */
export function startManualSync() {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '同步成功',
          data: {
            success: true,
            processed: 5,
            failed: 0,
            remaining: 0
          }
        })
      }, 2000)
    })
  }
  return post('/api/v1/sync/manual')
}

/**
 * 获取同步历史
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getSyncHistory(params = {}) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: mockData.history,
        total: mockData.history.length
      }
    })
  }
  return get('/api/v1/sync/history', params)
}

/**
 * 清除同步队列
 * @returns {Promise}
 */
export function clearSyncQueue() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '清除成功'
    })
  }
  return post('/api/v1/sync/clear')
}

/**
 * 添加数据到同步队列
 * @param {Object} data - 同步数据
 * @param {string} data.type - 数据类型
 * @param {string} data.action - 操作类型（create/update/delete）
 * @param {Object} data.payload - 数据内容
 * @returns {Promise}
 */
export function addToSyncQueue(data) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '添加成功',
      data: {
        id: Date.now(),
        ...data,
        status: 'pending',
        createTime: new Date().toISOString()
      }
    })
  }
  return post('/api/v1/sync/queue', data)
}

/**
 * 获取同步队列
 * @returns {Promise}
 */
export function getSyncQueue() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: [
          {
            id: 1,
            type: 'order',
            action: 'create',
            status: 'pending',
            createTime: '2025-12-06 15:30:00'
          },
          {
            id: 2,
            type: 'vehicle',
            action: 'update',
            status: 'pending',
            createTime: '2025-12-06 15:25:00'
          },
          {
            id: 3,
            type: 'photo',
            action: 'create',
            status: 'pending',
            createTime: '2025-12-06 15:20:00'
          }
        ],
        total: 3
      }
    })
  }
  return get('/api/v1/sync/queue')
}

/**
 * 重试失败的同步任务
 * @param {number} id - 任务ID
 * @returns {Promise}
 */
export function retrySyncTask(id) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '重试成功'
    })
  }
  return post(`/api/v1/sync/retry/${id}`)
}

/**
 * 删除同步任务
 * @param {number} id - 任务ID
 * @returns {Promise}
 */
export function deleteSyncTask(id) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '删除成功'
    })
  }
  return post(`/api/v1/sync/delete/${id}`)
}

export default {
  getSyncStatus,
  getSyncStats,
  getSyncConfig,
  updateSyncConfig,
  startManualSync,
  getSyncHistory,
  clearSyncQueue,
  addToSyncQueue,
  getSyncQueue,
  retrySyncTask,
  deleteSyncTask
}
