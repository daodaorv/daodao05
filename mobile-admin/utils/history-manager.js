/**
 * 操作历史管理器
 * 记录用户操作历史,支持撤销/重做功能
 */

import logger from './logger'
import { getStorage, setStorage } from './storage'

/**
 * 操作历史管理类
 */
class HistoryManager {
  constructor() {
    this.history = []
    this.currentIndex = -1
    this.maxSize = 50
    this.listeners = []
    this.storageKey = 'app_operation_history'
    this.loadFromStorage()
  }

  /**
   * 记录操作
   * @param {Object} operation - 操作对象
   * @param {string} operation.type - 操作类型
   * @param {string} operation.description - 操作描述
   * @param {any} operation.data - 操作数据
   * @param {Function} operation.undo - 撤销函数
   * @param {Function} operation.redo - 重做函数
   */
  record(operation) {
    // 验证操作对象
    if (!operation.type || !operation.description) {
      logger.warn('HistoryManager', 'Invalid operation object')
      return
    }

    // 如果当前不在历史记录末尾,删除后面的记录
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    // 添加时间戳
    const record = {
      ...operation,
      timestamp: Date.now(),
      id: this.generateId()
    }

    // 添加到历史记录
    this.history.push(record)
    this.currentIndex++

    // 限制历史记录大小
    if (this.history.length > this.maxSize) {
      this.history.shift()
      this.currentIndex--
    }

    // 保存到本地存储
    this.saveToStorage()

    // 通知监听器
    this.notifyListeners()

    logger.info('HistoryManager', `Recorded operation: ${operation.type}`, record)
  }

  /**
   * 撤销操作
   * @returns {boolean} 是否成功撤销
   */
  async undo() {
    if (!this.canUndo()) {
      logger.warn('HistoryManager', 'Cannot undo: no more operations')
      return false
    }

    const operation = this.history[this.currentIndex]

    try {
      // 执行撤销函数
      if (typeof operation.undo === 'function') {
        await operation.undo(operation.data)
      }

      this.currentIndex--
      this.notifyListeners()

      logger.info('HistoryManager', `Undid operation: ${operation.type}`)
      return true
    } catch (error) {
      logger.error('HistoryManager', 'Undo failed', error)
      return false
    }
  }

  /**
   * 重做操作
   * @returns {boolean} 是否成功重做
   */
  async redo() {
    if (!this.canRedo()) {
      logger.warn('HistoryManager', 'Cannot redo: no more operations')
      return false
    }

    const operation = this.history[this.currentIndex + 1]

    try {
      // 执行重做函数
      if (typeof operation.redo === 'function') {
        await operation.redo(operation.data)
      }

      this.currentIndex++
      this.notifyListeners()

      logger.info('HistoryManager', `Redid operation: ${operation.type}`)
      return true
    } catch (error) {
      logger.error('HistoryManager', 'Redo failed', error)
      return false
    }
  }

  /**
   * 是否可以撤销
   * @returns {boolean}
   */
  canUndo() {
    return this.currentIndex >= 0
  }

  /**
   * 是否可以重做
   * @returns {boolean}
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * 获取当前操作
   * @returns {Object|null}
   */
  getCurrentOperation() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex]
    }
    return null
  }

  /**
   * 获取历史记录列表
   * @param {number} limit - 限制数量
   * @returns {Array}
   */
  getHistory(limit = 20) {
    const start = Math.max(0, this.history.length - limit)
    return this.history.slice(start).map(op => ({
      id: op.id,
      type: op.type,
      description: op.description,
      timestamp: op.timestamp,
      isCurrent: this.history.indexOf(op) === this.currentIndex
    }))
  }

  /**
   * 获取最近的操作
   * @param {number} count - 数量
   * @returns {Array}
   */
  getRecentOperations(count = 10) {
    const start = Math.max(0, this.currentIndex - count + 1)
    const end = this.currentIndex + 1
    return this.history.slice(start, end).reverse()
  }

  /**
   * 按类型获取操作
   * @param {string} type - 操作类型
   * @returns {Array}
   */
  getOperationsByType(type) {
    return this.history.filter(op => op.type === type)
  }

  /**
   * 清除历史记录
   */
  clear() {
    this.history = []
    this.currentIndex = -1
    this.saveToStorage()
    this.notifyListeners()
    logger.info('HistoryManager', 'Cleared history')
  }

  /**
   * 清除指定类型的历史记录
   * @param {string} type - 操作类型
   */
  clearByType(type) {
    this.history = this.history.filter(op => op.type !== type)
    this.currentIndex = this.history.length - 1
    this.saveToStorage()
    this.notifyListeners()
    logger.info('HistoryManager', `Cleared history for type: ${type}`)
  }

  /**
   * 添加监听器
   * @param {Function} listener - 监听函数
   * @returns {Function} 取消监听函数
   */
  addListener(listener) {
    this.listeners.push(listener)
    return () => this.removeListener(listener)
  }

  /**
   * 移除监听器
   * @param {Function} listener - 监听函数
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    const state = {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      currentOperation: this.getCurrentOperation(),
      historyLength: this.history.length,
      currentIndex: this.currentIndex
    }

    this.listeners.forEach(listener => {
      try {
        listener(state)
      } catch (error) {
        logger.error('HistoryManager', 'Listener error', error)
      }
    })
  }

  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      // 只保存必要的数据,不保存函数
      const data = this.history.map(op => ({
        id: op.id,
        type: op.type,
        description: op.description,
        timestamp: op.timestamp,
        data: op.data
      }))

      setStorage(this.storageKey, {
        history: data,
        currentIndex: this.currentIndex
      })
    } catch (error) {
      logger.error('HistoryManager', 'Failed to save to storage', error)
    }
  }

  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const data = getStorage(this.storageKey)
      if (data && Array.isArray(data.history)) {
        this.history = data.history
        this.currentIndex = data.currentIndex || -1
        logger.info('HistoryManager', `Loaded ${this.history.length} operations from storage`)
      }
    } catch (error) {
      logger.error('HistoryManager', 'Failed to load from storage', error)
    }
  }

  /**
   * 生成唯一ID
   * @returns {string}
   */
  generateId() {
    return 'op_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * 获取统计信息
   * @returns {Object}
   */
  getStatistics() {
    const typeCount = {}
    this.history.forEach(op => {
      typeCount[op.type] = (typeCount[op.type] || 0) + 1
    })

    return {
      total: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      typeCount,
      oldestTimestamp: this.history[0]?.timestamp,
      newestTimestamp: this.history[this.history.length - 1]?.timestamp
    }
  }
}

// 创建单例
const historyManager = new HistoryManager()

/**
 * 操作装饰器 - 自动记录操作历史
 * @param {string} type - 操作类型
 * @param {string} description - 操作描述
 */
export function recordOperation(type, description) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      const result = await originalMethod.apply(this, args)

      // 记录操作
      historyManager.record({
        type,
        description,
        data: { args, result },
        undo: async () => {
          // 默认撤销逻辑(可以在方法中自定义)
          logger.info('Operation', `Undo: ${description}`)
        },
        redo: async () => {
          // 默认重做逻辑
          return originalMethod.apply(this, args)
        }
      })

      return result
    }

    return descriptor
  }
}

export default historyManager
export { HistoryManager }
