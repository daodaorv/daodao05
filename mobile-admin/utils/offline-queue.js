/**
 * 离线队列管理
 * 管理离线状态下的操作队列，在网络恢复后自动同步
 */
import { getStorage, setStorage } from './storage'
import logger from './logger'

const QUEUE_KEY = 'offline_queue'
const MAX_QUEUE_SIZE = 100

/**
 * 离线队列管理类
 */
class OfflineQueue {
  constructor() {
    this.queue = []
    this.processing = false
    this.loadQueue()
  }

  /**
   * 从本地存储加载队列
   */
  loadQueue() {
    try {
      const savedQueue = getStorage(QUEUE_KEY, [])
      this.queue = Array.isArray(savedQueue) ? savedQueue : []
      logger.info('OfflineQueue', `加载离线队列，共 ${this.queue.length} 项`)
    } catch (error) {
      logger.error('OfflineQueue', '加载队列失败:', error)
      this.queue = []
    }
  }

  /**
   * 保存队列到本地存储
   */
  saveQueue() {
    try {
      setStorage(QUEUE_KEY, this.queue)
      return true
    } catch (error) {
      logger.error('OfflineQueue', '保存队列失败:', error)
      return false
    }
  }

  /**
   * 添加操作到队列
   * @param {Object} operation - 操作对象
   * @param {string} operation.type - 操作类型
   * @param {string} operation.url - 请求URL
   * @param {string} operation.method - 请求方法
   * @param {Object} operation.data - 请求数据
   * @returns {boolean} 是否添加成功
   */
  add(operation) {
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      logger.warn('OfflineQueue', '队列已满，移除最旧的操作')
      this.queue.shift()
    }

    const queueItem = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...operation
    }

    this.queue.push(queueItem)
    this.saveQueue()
    logger.info('OfflineQueue', '添加操作到队列:', queueItem.type)
    return true
  }

  /**
   * 处理队列中的所有操作
   * @param {Function} processor - 处理函数
   * @returns {Promise<Object>} 处理结果
   */
  async processQueue(processor) {
    if (this.processing) {
      logger.warn('OfflineQueue', '队列正在处理中')
      return { success: false, message: '队列正在处理中' }
    }

    if (this.queue.length === 0) {
      logger.info('OfflineQueue', '队列为空，无需处理')
      return { success: true, processed: 0, failed: 0 }
    }

    this.processing = true
    let processed = 0
    let failed = 0
    const failedItems = []

    logger.info('OfflineQueue', `开始处理队列，共 ${this.queue.length} 项`)

    for (const item of [...this.queue]) {
      try {
        await processor(item)
        this.removeItem(item.id)
        processed++
        logger.info('OfflineQueue', `处理成功: ${item.type}`)
      } catch (error) {
        failed++
        failedItems.push(item)
        logger.error('OfflineQueue', `处理失败: ${item.type}`, error)
      }
    }

    this.queue = failedItems
    this.saveQueue()
    this.processing = false

    logger.info('OfflineQueue', `队列处理完成: 成功 ${processed}, 失败 ${failed}`)
    return { success: true, processed, failed, remaining: this.queue.length }
  }

  /**
   * 移除队列中的指定项
   * @param {string|number} id - 项ID
   */
  removeItem(id) {
    const index = this.queue.findIndex(item => item.id === id)
    if (index !== -1) {
      this.queue.splice(index, 1)
      this.saveQueue()
    }
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue = []
    this.saveQueue()
    logger.info('OfflineQueue', '队列已清空')
  }

  /**
   * 获取队列大小
   * @returns {number} 队列中的项数
   */
  size() {
    return this.queue.length
  }

  /**
   * 获取队列内容
   * @returns {Array} 队列数组
   */
  getQueue() {
    return [...this.queue]
  }
}

// 创建单例
const offlineQueue = new OfflineQueue()

export default offlineQueue
export { OfflineQueue }
