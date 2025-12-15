/**
 * Mock数据管理器
 * 统一管理所有Mock数据,提供一致的API接口
 */

import logger from './logger'

/**
 * Mock配置
 */
const MOCK_CONFIG = {
  // 是否启用Mock
  enabled: true,
  // 默认延迟时间(毫秒)
  defaultDelay: 500,
  // 是否打印Mock日志
  logging: true
}

/**
 * Mock数据管理类
 */
class MockManager {
  constructor() {
    this.mockData = new Map()
    this.mockHandlers = new Map()
    this.config = { ...MOCK_CONFIG }
  }

  /**
   * 设置配置
   * @param {Object} config - 配置对象
   */
  setConfig(config) {
    this.config = { ...this.config, ...config }
  }

  /**
   * 注册Mock数据
   * @param {string} key - 数据键名
   * @param {any} data - Mock数据
   */
  registerData(key, data) {
    this.mockData.set(key, data)
    if (this.config.logging) {
      logger.info('MockManager', `Registered mock data: ${key}`)
    }
  }

  /**
   * 注册Mock处理器
   * @param {string} key - 处理器键名
   * @param {Function} handler - 处理函数
   */
  registerHandler(key, handler) {
    this.mockHandlers.set(key, handler)
    if (this.config.logging) {
      logger.info('MockManager', `Registered mock handler: ${key}`)
    }
  }

  /**
   * 获取Mock数据
   * @param {string} key - 数据键名
   * @param {Object} params - 查询参数
   * @returns {Promise} Mock数据
   */
  async getData(key, params = ) {
    if (!this.config.enabled) {
      throw new Error('Mock is disabled')
    }

    // 检查是否有自定义处理器
    if (this.mockHandlers.has(key)) {
      const handler = this.mockHandlers.get(key)
      return this.mockResponse(handler(params), key)
    }

    // 返回静态数据
    if (this.mockData.has(key)) {
      const data = this.mockData.get(key)
      return this.mockResponse(data, key)
    }

    throw new Error(`Mock data not found: ${key}`)
  }

  /**
   * 模拟响应(添加延迟)
   * @param {any} data - 响应数据
   * @param {string} key - 数据键名
   * @param {number} delay - 延迟时间
   * @returns {Promise} 响应数据
   */
  mockResponse(data, key = '', delay = null) {
    const actualDelay = delay !== null ? delay : this.config.defaultDelay

    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.config.logging) {
          logger.info('MockManager', `Mock response: ${key}`, data)
        }
        resolve(data)
      }, actualDelay)
    })
  }

  /**
   * 模拟分页数据
   * @param {Array} list - 完整列表
   * @param {Object} params - 分页参数 { page, pageSize }
   * @returns {Object} 分页结果
   */
  mockPagination(list, params = {}) {
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize,
      hasMore: end < list.length
    }
  }

  /**
   * 模拟搜索
   * @param {Array} list - 完整列表
   * @param {string} keyword - 搜索关键词
   * @param {Array} fields - 搜索字段
   * @returns {Array} 搜索结果
   */
  mockSearch(list, keyword, fields = []) {
    if (!keyword) return list

    const lowerKeyword = keyword.toLowerCase()

    return list.filter(item => {
      return fields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerKeyword)
        }
        return false
      })
    })
  }

  /**
   * 模拟筛选
   * @param {Array} list - 完整列表
   * @param {Object} filters - 筛选条件
   * @returns {Array} 筛选结果
   */
  mockFilter(list, filters = {}) {
    return list.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key]
        const itemValue = item[key]

        // 如果筛选值为空,跳过该条件
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true
        }

        // 数组类型(多选)
        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue)
        }

        // 普通值
        return itemValue === filterValue
      })
    })
  }

  /**
   * 模拟排序
   * @param {Array} list - 完整列表
   * @param {string} field - 排序字段
   * @param {string} order - 排序方向 'asc' | 'desc'
   * @returns {Array} 排序结果
   */
  mockSort(list, field, order = 'asc') {
    const sorted = [...list].sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })

    return sorted
  }

  /**
   * 生成Mock ID
   * @returns {string} Mock ID
   */
  generateId() {
    return 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * 生成Mock时间戳
   * @param {number} offset - 时间偏移(天)
   * @returns {string} ISO时间字符串
   */
  generateTimestamp(offset = 0) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return date.toISOString()
  }

  /**
   * 清除所有Mock数据
   */
  clear() {
    this.mockData.clear()
    this.mockHandlers.clear()
    if (this.config.logging) {
      logger.info('MockManager', 'Cleared all mock data')
    }
  }

  /**
   * 获取所有已注册的Mock键名
   * @returns {Array} 键名列表
   */
  getRegisteredKeys() {
    return {
      data: Array.from(this.mockData.keys()),
      handlers: Array.from(this.mockHandlers.keys())
    }
  }
}

// 创建单例
const mockManager = new MockManager()

/**
 * Mock装饰器 - 用于API函数
 * @param {string} key - Mock数据键名
 * @param {Object} options - 选项
 */
export function mockApi(key, options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      // 如果Mock未启用,调用原始方法
      if (!mockManager.config.enabled) {
        return originalMethod.apply(this, args)
      }

      try {
        // 尝试获取Mock数据
        const mockData = await mockManager.getData(key, args[0])
        return mockData
      } catch (error) {
        // Mock失败,回退到原始方法
        logger.warn('MockManager', `Mock failed for ${key}, fallback to real API`, error)
        return originalMethod.apply(this, args)
      }
    }

    return descriptor
  }
}

export default mockManager
export { MockManager }
