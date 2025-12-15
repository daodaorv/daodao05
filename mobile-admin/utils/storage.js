/**
 * 本地存储工具
 * 封装uni.storage API，提供类型安全和错误处理
 */

import logger from './logger'

/**
 * 存储数据到本地
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的值（支持对象、数组等）
 * @returns {boolean} 存储是否成功
 * @example
 * setStorage('userInfo', { name: '张三', age: 25 }) // true
 * setStorage('token', 'abc123') // true
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (error) {
    logger.error('Storage', 'setStorage 失败:', error)
    return false
  }
}

/**
 * 从本地获取数据
 * @param {string} key - 存储键名
 * @param {any} [defaultValue=null] - 默认值（当键不存在时返回）
 * @returns {any} 存储的值或默认值
 * @example
 * getStorage('userInfo') // { name: '张三', age: 25 }
 * getStorage('notExist', 'default') // 'default'
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = uni.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (error) {
    logger.error('Storage', 'getStorage 失败:', error)
    return defaultValue
  }
}

/**
 * 删除指定键的数据
 * @param {string} key - 要删除的存储键名
 * @returns {boolean} 删除是否成功
 * @example
 * removeStorage('token') // true
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    logger.error('Storage', 'removeStorage 失败:', error)
    return false
  }
}

/**
 * 清空所有本地存储数据
 * @returns {boolean} 清空是否成功
 * @example
 * clearStorage() // true
 */
export function clearStorage() {
  try {
    uni.clearStorageSync()
    return true
  } catch (error) {
    logger.error('Storage', 'clearStorage 失败:', error)
    return false
  }
}

/**
 * 获取本地存储的相关信息
 * @returns {Object|null} 存储信息对象（包含 keys、currentSize、limitSize）或 null
 * @example
 * getStorageInfo() // { keys: ['token', 'userInfo'], currentSize: 10, limitSize: 10240 }
 */
export function getStorageInfo() {
  try {
    return uni.getStorageInfoSync()
  } catch (error) {
    logger.error('Storage', 'getStorageInfo 失败:', error)
    return null
  }
}

// 常用存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  SETTINGS: 'settings',
  CACHE_DATA: 'cacheData',
  OFFLINE_DATA: 'offlineData'
}

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo,
  STORAGE_KEYS
}
