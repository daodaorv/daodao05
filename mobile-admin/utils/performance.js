/**
 * 性能监控工具
 * 提供页面性能监控、资源加载监控、内存监控等功能
 */

import logger from './logger'

/**
 * 性能监控类
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: ,
      apiCalls: [],
      memoryUsage: [],
      fps: []
    }
    this.observers = []
    this.isMonitoring = false
  }

  /**
   * 开始监控
   */
  startMonitoring() {
    if (this.isMonitoring) {
      return
    }

    this.isMonitoring = true
    this.monitorPageLoad()
    this.monitorMemory()
    this.monitorFPS()

    logger.info('PerformanceMonitor', 'Performance monitoring started')
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    this.isMonitoring = false
    this.observers.forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect()
      }
    })
    this.observers = []

    logger.info('PerformanceMonitor', 'Performance monitoring stopped')
  }

  /**
   * 监控页面加载性能
   */
  monitorPageLoad() {
    const startTime = Date.now()

    // 记录页面加载开始时间
    this.metrics.pageLoad.startTime = startTime

    // 监听页面加载完成
    uni.onAppShow(() => {
      const loadTime = Date.now() - startTime
      this.metrics.pageLoad.loadTime = loadTime

      logger.info('PerformanceMonitor', `Page load time: ${loadTime}ms`)

      // 如果加载时间超过3秒，记录警告
      if (loadTime > 3000) {
        logger.warn('PerformanceMonitor', `Slow page load: ${loadTime}ms`)
      }
    })
  }

  /**
   * 监控内存使用
   */
  monitorMemory() {
    // uni-app 暂不支持直接获取内存信息
    // 可以通过原生插件实现
    // #ifdef APP-PLUS
    const checkMemory = () => {
      if (!this.isMonitoring) return

      try {
        // 这里可以调用原生插件获取内存信息
        const memoryInfo = {
          timestamp: Date.now(),
          used: 0, // 实际应该从原生获取
          total: 0
        }

        this.metrics.memoryUsage.push(memoryInfo)

        // 只保留最近100条记录
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift()
        }

        // 每5秒检查一次
        setTimeout(checkMemory, 5000)
      } catch (error) {
        logger.error('PerformanceMonitor', 'Memory monitoring failed:', error)
      }
    }

    checkMemory()
    // #endif
  }

  /**
   * 监控FPS（帧率）
   */
  monitorFPS() {
    let lastTime = Date.now()
    let frames = 0

    const checkFPS = () => {
      if (!this.isMonitoring) return

      frames++
      const currentTime = Date.now()
      const elapsed = currentTime - lastTime

      // 每秒计算一次FPS
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed)

        this.metrics.fps.push({
          timestamp: currentTime,
          fps: fps
        })

        // 只保留最近60条记录
        if (this.metrics.fps.length > 60) {
          this.metrics.fps.shift()
        }

        // 如果FPS低于30，记录警告
        if (fps < 30) {
          logger.warn('PerformanceMonitor', `Low FPS detected: ${fps}`)
        }

        frames = 0
        lastTime = currentTime
      }

      requestAnimationFrame(checkFPS)
    }

    requestAnimationFrame(checkFPS)
  }

  /**
   * 记录API调用性能
   * @param {string} url - API地址
   * @param {number} duration - 耗时（毫秒）
   * @param {boolean} success - 是否成功
   */
  recordAPICall(url, duration, success = true) {
    const record = {
      url,
      duration,
      success,
      timestamp: Date.now()
    }

    this.metrics.apiCalls.push(record)

    // 只保留最近100条记录
    if (this.metrics.apiCalls.length > 100) {
      this.metrics.apiCalls.shift()
    }

    // 如果API调用超过2秒，记录警告
    if (duration > 2000) {
      logger.warn('PerformanceMonitor', `Slow API call: ${url} (${duration}ms)`)
    }

    logger.info('PerformanceMonitor', `API call: ${url} (${duration}ms)`)
  }

  /**
   * 获取性能指标
   * @returns {Object} 性能指标
   */
  getMetrics() {
    return {
      pageLoad: this.metrics.pageLoad,
      apiCalls: this.getAPICallStats(),
      memory: this.getMemoryStats(),
      fps: this.getFPSStats()
    }
  }

  /**
   * 获取API调用统计
   * @returns {Object} API调用统计
   */
  getAPICallStats() {
    const calls = this.metrics.apiCalls
    if (calls.length === 0) {
      return {
        total: 0,
        success: 0,
        failed: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: 0
      }
    }

    const successCalls = calls.filter(c => c.success)
    const failedCalls = calls.filter(c => !c.success)
    const durations = calls.map(c => c.duration)

    return {
      total: calls.length,
      success: successCalls.length,
      failed: failedCalls.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations)
    }
  }

  /**
   * 获取内存统计
   * @returns {Object} 内存统计
   */
  getMemoryStats() {
    const usage = this.metrics.memoryUsage
    if (usage.length === 0) {
      return {
        current: 0,
        avg: 0,
        max: 0
      }
    }

    const used = usage.map(m => m.used)
    return {
      current: usage[usage.length - 1].used,
      avg: Math.round(used.reduce((a, b) => a + b, 0) / used.length),
      max: Math.max(...used)
    }
  }

  /**
   * 获取FPS统计
   * @returns {Object} FPS统计
   */
  getFPSStats() {
    const fps = this.metrics.fps
    if (fps.length === 0) {
      return {
        current: 0,
        avg: 0,
        min: 0
      }
    }

    const values = fps.map(f => f.fps)
    return {
      current: fps[fps.length - 1].fps,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: Math.min(...values)
    }
  }

  /**
   * 清除性能数据
   */
  clearMetrics() {
    this.metrics = {
      pageLoad: {},
      apiCalls: [],
      memoryUsage: [],
      fps: []
    }

    logger.info('PerformanceMonitor', 'Performance metrics cleared')
  }

  /**
   * 生成性能报告
   * @returns {string} 性能报告
   */
  generateReport() {
    const metrics = this.getMetrics()

    const report = `
=== 性能监控报告 ===

页面加载:
- 加载时间: ${metrics.pageLoad.loadTime || 'N/A'}ms

API调用:
- 总调用次数: ${metrics.apiCalls.total}
- 成功: ${metrics.apiCalls.success}
- 失败: ${metrics.apiCalls.failed}
- 平均耗时: ${metrics.apiCalls.avgDuration}ms
- 最大耗时: ${metrics.apiCalls.maxDuration}ms
- 最小耗时: ${metrics.apiCalls.minDuration}ms

内存使用:
- 当前: ${metrics.memory.current}MB
- 平均: ${metrics.memory.avg}MB
- 最大: ${metrics.memory.max}MB

帧率(FPS):
- 当前: ${metrics.fps.current}
- 平均: ${metrics.fps.avg}
- 最低: ${metrics.fps.min}

生成时间: ${new Date().toLocaleString()}
    `.trim()

    return report
  }

  /**
   * 导出性能数据
   * @returns {Object} 性能数据
   */
  exportData() {
    return {
      metrics: this.metrics,
      stats: this.getMetrics(),
      timestamp: Date.now()
    }
  }
}

// 创建单例
const performanceMonitor = new PerformanceMonitor()

/**
 * 性能装饰器 - 用于监控函数执行时间
 * @param {string} name - 函数名称
 */
export function measurePerformance(name) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      const startTime = Date.now()

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime

        logger.info('Performance', `${name || propertyKey} executed in ${duration}ms`)

        return result
      } catch (error) {
        const duration = Date.now() - startTime
        logger.error('Performance', `${name || propertyKey} failed after ${duration}ms`, error)
        throw error
      }
    }

    return descriptor
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300) {
  let timeout = null
  let previous = 0

  return function(...args) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout = null

  return function(...args) {
    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }
}

export default performanceMonitor
export { PerformanceMonitor }
